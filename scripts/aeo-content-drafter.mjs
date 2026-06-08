/**
 * AEO content-gap drafter — part of the agentic AEO system (MVP).
 *
 * Given a target query/topic (a question buyers ask AI engines that Hana should
 * win), this drafts an ANSWER-FIRST, schema-rich page in Hana's voice — the kind
 * of content AI answer engines (ChatGPT, Perplexity, AI Overviews) cite. Output
 * is a review-ready markdown file under content-drafts/ for a human to edit and
 * publish to Sanity. Nothing is published automatically (human-in-the-loop).
 *
 * It calls the Anthropic API directly via fetch (no SDK install). The API key is
 * read from the environment — no external call happens unless you run it with a
 * key set.
 *
 * Usage:
 *   ANTHROPIC_API_KEY=sk-... npm run aeo:draft -- "best voice AI for post-discharge follow-up"
 *   ANTHROPIC_API_KEY=sk-... npm run aeo:draft -- --type=comparison "Hana vs patient portals"
 *   npm run aeo:draft -- --list   # show the suggested gap backlog without calling the API
 *
 * Flags:
 *   --type=faq|comparison|guide|stat   page shape (default: guide)
 *   --list                             print the built-in gap backlog and exit
 *   --model=<id>                       override the model (default below)
 */

import { writeFile, mkdir, readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const OUT_DIR = join(ROOT, 'content-drafts');

// Latest capable Claude model as of this writing. Override with --model=.
const DEFAULT_MODEL = 'claude-opus-4-8';

// A starter backlog of high-intent, query-shaped gaps worth owning. The citation
// monitor (future) would generate these from real AI-answer gaps; for the MVP this
// is a curated seed list a human can extend.
const GAP_BACKLOG = [
  { type: 'comparison', q: 'Hana vs patient portals for patient engagement' },
  { type: 'comparison', q: 'voice AI vs human call center for healthcare outreach' },
  { type: 'guide', q: 'best voice AI for post-discharge follow-up' },
  { type: 'guide', q: 'how to reduce 30-day hospital readmissions with AI' },
  { type: 'guide', q: 'how to bill APCM/CCM with automated patient outreach' },
  { type: 'stat', q: 'what patient engagement rate can voice AI achieve' },
  { type: 'faq', q: 'is voice AI HIPAA compliant for patient communication' },
  { type: 'guide', q: 'automating ADHD intake with voice AI' },
];

// Hana brand context (kept in sync with public/llms.txt).
const BRAND = `
Hana Health (https://www.hana.health) is a clinical voice AI platform that automates patient engagement
across the full care journey — intake, follow-up, remote monitoring, and care coordination. It deploys AI
agents that call, text, and message patients using voice, SMS, and chat; integrates with EHR systems; and
runs across behavioral health, chronic care, post-discharge, and specialty workflows. Hana is infrastructure,
not an app — clinic partners build on it.

Proof points (use only these; do not invent stats):
- ~85% weekly patient engagement (vs. 15–20% for portals/apps)
- 2 million+ patient interactions processed
- Deploys in days, not months
- HIPAA-compliant, BAA available

Positioning vs alternatives:
- vs patient portals: voice reaches patients who ignore apps (85% vs 15–20%)
- vs human call centers: scales without staffing cost / call-center overhead
- vs generic AI chatbots: reads the chart, knows the patient, follows clinical protocols
- vs other voice AI: purpose-built for healthcare, not repurposed call-center/sales AI
`;

function systemPrompt(type) {
  return `You are a senior healthcare content strategist writing for Answer Engine Optimization (AEO): content that
AI answer engines (ChatGPT, Perplexity, Google AI Overviews, Claude) will CITE.

Write for Hana Health. Brand context:
${BRAND}

Rules:
- ANSWER-FIRST: open with a 2–3 sentence direct answer to the query that an LLM can lift verbatim as a citation.
- Use clear H2 headings phrased as the questions buyers actually ask. Keep paragraphs short and extractable.
- Be factual and specific; use ONLY the proof points above for stats — never fabricate numbers, customers, or claims.
- Healthcare YMYL: accurate, non-promotional in tone, no medical advice to patients.
- Include a short FAQ section (3–5 Q&As) at the end — these map directly to FAQPage schema.
- Output GitHub-flavored Markdown only. Page shape requested: ${type}.
- End with a "---" then a YAML block of suggested metadata: title, description (<=155 chars), slug, and a
  "faq:" list of {q, a} pairs (so it can be wired into faqSchema()).`;
}

function userPrompt(query, type) {
  return `Target query (what a buyer asks an AI engine): "${query}"
Page type: ${type}

Draft the page now. Make the opening answer something an AI engine would quote when answering that query.`;
}

function slugify(s) {
  return s.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-').slice(0, 70);
}

async function callClaude({ apiKey, model, query, type }) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: 4000,
      system: systemPrompt(type),
      messages: [{ role: 'user', content: userPrompt(query, type) }],
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Anthropic API ${res.status}: ${body.slice(0, 300)}`);
  }
  const data = await res.json();
  return (data.content || []).filter((b) => b.type === 'text').map((b) => b.text).join('\n');
}

function parseArgs(argv) {
  const flags = {};
  const rest = [];
  for (const a of argv) {
    const m = a.match(/^--([\w-]+)(?:=(.*))?$/);
    if (m) flags[m[1]] = m[2] ?? true;
    else rest.push(a);
  }
  return { flags, query: rest.join(' ').trim() };
}

async function main() {
  const { flags, query } = parseArgs(process.argv.slice(2));

  if (flags.list) {
    console.log('▸ AEO content-gap backlog (curated seed — extend freely):\n');
    GAP_BACKLOG.forEach((g, i) => console.log(`  ${String(i + 1).padStart(2)}. [${g.type}] ${g.q}`));
    console.log('\nRun:  ANTHROPIC_API_KEY=… npm run aeo:draft -- "<query>"');
    return;
  }

  if (!query) {
    console.error('Usage: npm run aeo:draft -- "<target query>"  (or --list to see the backlog)');
    process.exit(1);
  }

  const type = (flags.type || 'guide');
  const model = (flags.model || DEFAULT_MODEL);
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    console.error('✗ ANTHROPIC_API_KEY not set. The drafter calls the Anthropic API to generate content.');
    console.error('  Set it and re-run:  ANTHROPIC_API_KEY=sk-… npm run aeo:draft -- "' + query + '"');
    process.exit(1);
  }

  console.log(`▸ Drafting [${type}] for: "${query}"  (model: ${model})`);
  const md = await callClaude({ apiKey, model, query, type });

  await mkdir(OUT_DIR, { recursive: true });
  const slug = slugify(query);
  const file = join(OUT_DIR, `${type}-${slug}.md`);
  const header = `<!-- AEO draft — review before publishing to Sanity.\n     Query: ${query}\n     Type: ${type} | Model: ${model} -->\n\n`;
  await writeFile(file, header + md + '\n', 'utf8');
  console.log(`✓ Draft written: ${file.replace(ROOT + '/', '')}`);
  console.log('  Review, edit, then publish to Sanity and wire its FAQ into faqSchema().');
}

main().catch((e) => { console.error('✗ aeo:draft crashed:', e.message); process.exit(1); });
