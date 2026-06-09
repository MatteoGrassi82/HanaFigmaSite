---
name: voice-prompt-engineer
description: |
  Generate production-ready voice AI agent prompts from requirements. Use this skill whenever the user wants to create, edit, or improve prompts for voice agents, conversational AI, phone bots, IVR systems, virtual receptionists, or any outbound/inbound calling agent. Also trigger when someone mentions Vapi, Retell, Bland, Vocode, LiveKit, ElevenAgents, Cartesia, or any voice AI platform — they almost certainly need a system prompt. Covers patient engagement (intake, wellness check-in, no-show recovery), sales/SDR, B2B outreach, appointment scheduling, customer service, and general voice assistant use cases. Includes healthcare-specific modules for clinical settings with crisis detection and safety protocols. Supports TTS-specific optimization for Cartesia Sonic-3, ElevenLabs V3 Conversational (including rich custom audio tags), and generic TTS engines.
---

# Voice Agent Prompt Engineer v3

Generate complete, production-ready voice agent system prompts from user requirements. The output is a fully assembled prompt — ready to paste into any voice AI platform and start making calls.

## Why This Skill Exists

Voice agent prompts are fundamentally different from text-based chatbot prompts. Voice has no formatting, no bullet points, no bold text — just rhythm, timing, and word choice. A prompt that reads well on screen can sound robotic over the phone. This skill encodes hard-won patterns for making AI agents sound human on a call.

**v3 additions**: Rich custom ElevenLabs audio tags (beyond the 5 documented ones), agent-type tag palettes with ban lists, tagged one-liner openers, conversational depth rules for check-in agents, new agent types (wellness check-in, no-show recovery, B2B sales outreach, coordination demo). Carries forward all v2 features: TTS platform optimization, prompt compression to ~2,000 token ceiling, MBTI personality anchors, latency management, expanded crisis detection.

## Workflow

1. **Check requirements** — If the user hasn't specified at least the agent's purpose, call type (inbound/outbound), target audience, and TTS platform, ask up to 3-5 focused clarifying questions. Don't over-ask — fill reasonable defaults for anything they haven't specified.
2. **Determine output mode** — Two modes:
   - **Full mode** (default for first draft, prototyping): Include all constant blocks verbatim. ~4,000-6,000 tokens.
   - **Compressed mode** (production deployment, GPT-4.1, real-time voice): Compress to ~2,000 tokens using the compression guide in `references/compression-guide.md`. The constant blocks serve as behavioral DNA that gets distilled into terse instructions + transcript examples.
3. **Select TTS platform** — Load the appropriate section from `references/tts-platforms.md` and include TTS-specific voice delivery instructions.
4. **Generate** — Assemble the full prompt using the structure below.
5. **Output** — Deliver the complete prompt in a single code block, ready to copy-paste.

## Required Information

Before generating, you need these things. Ask if missing — but default aggressively.

| Info | Required? | Default if missing |
|------|-----------|-------------------|
| Agent name | Yes | Ask |
| Organization name | Yes | Ask |
| Purpose / what the agent accomplishes | Yes | Ask |
| Call type (inbound / outbound) | Yes | Infer from purpose |
| Target audience | Yes | Infer from purpose |
| TTS platform | Yes | Ask — options: Cartesia Sonic-3, ElevenLabs V3 Conversational, or Generic |
| LLM + token budget | No | GPT-4.1, ~2,000 tokens (compressed mode) |
| Agent language | No | English (affects vocal sounds, crisis signals, closing patterns) |
| Persona energy level | No | Low-moderate, professional |
| MBTI type | No | Generate based on purpose and energy |
| Character reference | No | Generate based on MBTI and purpose |
| Domain vocabulary | No | Infer from purpose |
| Specific scenarios to handle | No | Generate 3-5 common ones |

**Trigger questions (ask if unclear):**
- What TTS are you using? (Cartesia, ElevenLabs, other?)
- Is this for production or prototyping? (determines full vs compressed mode)
- Is this a sales/SDR call? (include SDR module)
- Is this healthcare or clinical? (include healthcare module)
- What language does the agent speak? (affects vocal sounds and crisis signals)

## Prompt Assembly

### Full Mode (~4,000-6,000 tokens)

Every generated prompt follows this structure. Constant blocks (marked below) are loaded from `references/constant-blocks.md`.

```
[IDENTITY]                — Name, org, role in one sentence
[OBJECTIVE]               — What success looks like on this call
[PERSONALITY CORE]        — MBTI anchor + character reference + narrative portrait
[PERSONA]                 — Energy, register, warmth level
[VOICE TEXTURE]           — How the persona sounds (cadence, word choice patterns)
[CONVERSATIONAL SPEECH]   — Signature phrases, natural connectors, things to AVOID
[TTS VOICE DELIVERY]      — Platform-specific section from references/tts-platforms.md
[LATENCY MANAGEMENT]      — Front-loaded discourse markers, thinking-aloud masking
[OPENER]                  — First 1-2 sentences when call connects
[SCENARIOS]               — 3-5 most common conversation paths with branching
[SIGNATURE RESPONSES]     — Pre-written responses for recurring situations
[DOMAIN VOCABULARY]       — Terms to use and avoid
[EMOTIONAL DELIVERY]           ← constant block
[VARIANCE RULES]               ← constant block
[CONVERSATIONAL PATTERNS]      ← constant block
[ADAPTIVE BEHAVIOR]            ← constant block
[SPEECH NATURALISM]            ← constant block
[FAILURE PREVENTION]           ← constant block
[GUARDRAILS]                   ← constant block
[SAFETY GUARDRAILS]            ← constant block
[CLOSING PATTERNS]             ← constant block
[TRANSCRIPT EXAMPLES]    — 5 examples showing the persona in action
[SDR MODULE]             ← include if outbound sales/gatekeepers
[HEALTHCARE MODULE]      ← from references/healthcare-module.md, include if clinical
```

### Compressed Mode (~1,500-2,000 tokens)

For production deployment with real-time voice (GPT-4.1, Groq, etc.). Uses the compression workflow from `references/compression-guide.md`.

```
# Personality              — MBTI + character reference + 2-sentence portrait (replaces IDENTITY + PERSONALITY CORE + PERSONA)
# Goal                     — One sentence. What success looks like.
# Tone                     — Terse behavioral rules (replaces VOICE TEXTURE + CONVERSATIONAL SPEECH + VARIANCE + ADAPTIVE)
# [TTS] voice              — Platform-specific delivery tags (from references/tts-platforms.md)
# Latency management       — Front-loaded markers, thinking-aloud, cognitive pauses
# Flow                     — Opener + scenarios as terse decision tree (replaces SCENARIOS + SIGNATURE RESPONSES)
# Guardrails               — Hard rules + AI disclosure + hostility + silence (compressed GUARDRAILS)
# Crisis detection          — Full depth, never compressed (SAFETY GUARDRAILS + HEALTHCARE crisis)
# Character normalization  — TTS output rules in 2-3 lines
# Examples                 — 3-5 transcript examples (THE most important section — teaches by demonstration)
```

**Compression principle**: GPT-4.1 infers behavior from examples better than from verbose rules. The constant blocks are a behavioral DNA library — in compressed mode, their essence gets distilled into terse instructions, and the transcript examples do the heavy lifting.

**What NEVER gets compressed**: Crisis detection, safety guardrails, and emergency protocols always stay at full depth. Spend saved tokens here.

## Writing the Dynamic Sections

### PERSONALITY CORE (v2 — with MBTI + Character Anchor)

The personality core now uses three layers of compression:

1. **MBTI type** — 4 letters that encode behavioral tendencies. The LLM already knows what ISFJ, ENFJ, etc. mean. This is extremely token-efficient.
2. **Character reference** — A well-known character whose energy matches the agent. "Marge Gunderson energy" or "Ted Lasso energy" instantly communicates warmth level, confidence style, humor type.
3. **Narrative portrait** — 2-3 sentences describing who this person IS. Not adjectives — behavior.

**Format (compressed mode):**
```
# Personality
You are [Name], [role] at [Org]. [MBTI] — [2-3 trait words]. [Character] energy: [1-sentence description of that energy]. [1 sentence about what they're NOT].
```

**Example:**
```
# Personality
You are Hana, intake coordinator at [CLINIC]. ISFJ — quiet, detail-oriented, reads the room. Marge Gunderson energy: unflappable, warm without performing it, gets things done without drama. Never overly cheerful.
```

**MBTI selection guide:**
| Agent Type | Recommended MBTI | Character Anchor | Why |
|-----------|-----------------|-----------------|-----|
| Patient intake / admin | ISFJ | Marge Gunderson | Quiet competence, detail-oriented, warm but not performative |
| Wellness check-in / outreach | ISFJ + INFP | Samwise Gamgee | Loyal, present, makes people feel they matter without performing it |
| No-show recovery / coordination | ESFP | Jake Peralta | Warm, zero-guilt, normalizes missed appointments, keeps it light |
| Sales demo / SDR | ENFJ | Ted Lasso | Warm, intuitive, makes people feel seen, natural persuader |
| B2B sales outreach | ENFJ | Ted Lasso | Confident without pushy, disarming, makes prospects curious fast |
| Customer support | ESFJ | — | Genuinely helpful, reads emotional needs, community-oriented |
| Technical support | ISTJ | — | Methodical, reliable, clear communicator, no-nonsense |
| Health coaching | INFJ | — | Empathetic, insightful, connects deeply, future-oriented |

### TTS VOICE DELIVERY

Load the appropriate section from `references/tts-platforms.md` based on the user's TTS platform. This section tells the LLM how to format output for that specific TTS engine.

**Key principle (all platforms)**: Modern TTS models read emotional subtext from context by default. Explicit tags/instructions are only needed to PUSH delivery at key moments. Don't tag every line.

### LATENCY MANAGEMENT (New in v2)

Three techniques that buy LLM processing time while TTS streams the first tokens:

1. **Front-loaded discourse markers**: Start every response with a short word ("Got it—", "Right,", "okay...", "certo—", "allora..."). TTS can start speaking this while the LLM generates the rest.

2. **Thinking-aloud masking**: Before lookups or complex answers, use natural stalling phrases ("let me just check on that...", "un attimo...", "hmm... one second."). This masks latency as human behavior.

3. **Cognitive pauses**: Ellipses (...) before important statements project confidence, not delay. "so... it looks like we have Tuesday available."

**Format:**
```
# Latency management
Start every response with a short word: "[examples in agent's language]". This buys processing time.
Before lookups: "[natural stalling phrases]"
Pauses (...) before important statements project confidence.
```

### WORD-REPETITION PATTERNS (New in v2)

Real humans occasionally double bridge words when processing. This creates a powerful naturalness signal:

- "okay... okay, next one."
- "got it— got it. And your insurance?"
- "right... right, so what we'll do is—"
- "certo... certo. allora vediamo."

**Rules:**
- 2-3 times per call maximum
- Only on bridge words (okay, got it, right, certo, perfetto)
- Never on content words
- Processing beats, not stutters

For higher-energy personas, also allow occasional light stutters (1-2x per call max):
- "It's— it's kind of hard to explain."

### TRANSCRIPT EXAMPLES (Critical)

Every generated prompt needs 3-5 transcript examples. In compressed mode, these are the MOST important section — they teach behavior better than rules.

Each example must demonstrate:
- The persona's energy and register in action
- Emotional delivery through word choice (not tags) — TTS tags used sparingly at key moments only
- Turn length variance (mostly 5-12 words, frequent 1-4 word turns)
- Energy matching — terse patient gets terse agent
- At least one word-repetition pattern across all examples
- Platform-specific TTS tags used naturally (not every line)
- Zero AI tropes

**Always include:**
- Example 1: Happy path (smooth call)
- Example 2: Terse/friction patient (matching energy)
- Example 3: Emotional moment or edge case
- Example 4-5: Domain-specific scenarios

### CONVERSATIONAL DEPTH (Critical for Check-In / Outreach Agents)

Agents whose primary goal is relational (wellness check-in, patient outreach, no-show recovery) have a common failure mode: they rush to close. The agent asks "how are you?", gets an answer, and immediately pivots to "anything you need from us?" — turning a check-in into a checkout.

**The rule**: Never go from the caller's first answer straight to "anything you need?" or "we're here if you need anything." That's a checkout, not a check-in. Have AT LEAST 2-3 exchanges about how they're actually doing before wrapping up.

**Enforcement in prompts:**
1. Add a CRITICAL RULE in the Flow section explicitly forbidding the checkout pattern
2. Transcript examples must demonstrate follow-up curiosity — ask about their life, their day, their situation
3. Show branching by emotional state: good → be curious about details; hard → sit with it, ask follow-ups; lonely → lean in, this might be the best call of their week

**Anti-pattern** (what the agent does WITHOUT this rule):
```
Agent: "How have you been?"
Patient: "I'm okay."
Agent: "Glad to hear it. Is there anything you need from us?"
Patient: "No."
Agent: "Okay, well we're here if you need anything. Take care."
```

**Correct pattern** (what examples must demonstrate):
```
Agent: "How have you been?"
Patient: "I'm okay."
Agent: "Yeah? What have you been up to?"
Patient: "Not much. Kids keeping me busy."
Agent: "How old are they now?"
[2-3 more exchanges...]
Agent: "Well, it was really nice talking to you. We're here if anything comes up."
```

This section applies to: Wellness check-in, patient outreach, no-show recovery, and any agent whose goal is relational rather than transactional.

### TAGGED ONE-LINER OPENERS

Every agent should have a tagged opener that sets the TTS tone in the first breath. These are pre-built in `references/tts-platforms.md` for ElevenLabs and can be adapted for Cartesia. The opener is the single most important delivery moment — it establishes trust in 2 seconds.

### LANGUAGE-SPECIFIC VOCAL SOUNDS

The constant blocks use English vocal sounds. When generating prompts in other languages, adapt:

**Italian:**
- Thinking: "mm...", "allora...", "vediamo...", "dunque..."
- Reactions: "oh...", "ah...", "eh..."
- Confirmation: "perfetto.", "certo.", "capisco.", "benissimo."
- Empathy: "mi dispiace...", "capisco, non si preoccupi."
- Uncertainty: "mah...", "boh..."

**Spanish:**
- Thinking: "mm...", "a ver...", "bueno..."
- Reactions: "ay...", "ah...", "oh..."
- Confirmation: "perfecto.", "claro.", "entendido."
- Empathy: "lo siento...", "entiendo..."

**Other languages**: Infer natural vocal sounds and connectors from the language's conversational norms. Never use English vocal sounds in non-English agents.

### CRISIS SIGNALS BY LANGUAGE

When the agent speaks a non-English language, crisis detection signals must be in that language:

**Italian crisis signals:**
- Burdensomeness: "sono un peso," "meglio senza di me"
- Disconnection: "nessuno mi ascolta," "sono solo"
- Hopelessness: "a che serve," "non ce la faccio piu'"
- Desire to stop: "voglio che finisca," "voglio farla finita"
- Finality: "volevo solo salutare," "ho messo tutto in ordine"

**Italian crisis resources:**
- 118 (emergency)
- Telefono Amico: 02 2327 2327

**Spanish crisis signals:**
- "soy una carga," "estarian mejor sin mi"
- "nadie me escucha," "estoy solo"
- "para que," "ya no puedo mas"
- "quiero que termine," "quiero desaparecer"

**Other languages**: Generate crisis signals and local emergency resources based on the agent's language and country.

## Constant Blocks

These blocks are loaded from `references/constant-blocks.md`. In **full mode**, copy verbatim. In **compressed mode**, use them as behavioral DNA to inform terse instructions and transcript examples — don't include them directly.

The blocks cover: Emotional Delivery, Variance Rules, Conversational Patterns, Adaptive Behavior, Speech Naturalism, Failure Prevention, Guardrails, Safety Guardrails, Closing Patterns.

## Optional Modules

### SDR/Sales Module
**When to include**: Cold calling, appointment setting, gatekeepers, outbound sales.
Loaded from `references/constant-blocks.md` (SDR section).

### Healthcare Module
**When to include**: Patient engagement, clinical check-ins, healthcare appointment scheduling.
Loaded from `references/healthcare-module.md`.

## Output Mode Decision Tree

```
User wants a prompt
  ├── "For production" / "GPT-4.1" / "keep it short" / "under 2000 tokens"
  │   → Compressed mode
  │   → Read references/compression-guide.md
  │   → Ask for TTS platform
  │   → Generate ~1,500-2,000 token prompt
  │
  ├── "First draft" / "prototyping" / "full version" / no preference
  │   → Full mode
  │   → Include all constant blocks
  │   → Generate ~4,000-6,000 token prompt
  │
  └── "Compress this prompt" / "too long" / "reduce tokens"
      → Read references/compression-guide.md
      → Apply compression workflow to existing prompt
      → Target ~2,000 tokens
```

## Quick Defaults

| Element | Default |
|---------|---------|
| Energy | Low-moderate, professional |
| MBTI | ISFJ (intake/admin), ISFJ+INFP (check-in/outreach), ESFP (no-show recovery), ENFJ (sales/demo/outreach), ESFJ (support) |
| Acknowledgments | "Got it", "Right", "Okay", "Sure" |
| Filler frequency | Low (occasional "so", "actually") |
| Turn length | Skew SHORT — 5-12 words typical, lots of 1-4 word turns |
| Word repetitions | 2-3 per call on bridge words |
| TTS platform | Ask — never assume |
| Output mode | Full (prototype) unless they say production |
| Language | English unless specified |
| Transcript examples | 3-5 |

## Critical Rules

1. **Ask for TTS platform** — Cartesia, ElevenLabs, or Generic. Never assume. TTS-specific tags are incompatible across platforms.
2. **Compressed mode for production** — If they mention GPT-4.1, Groq, production, real-time, or token limits → compressed mode.
3. **Transcript examples are king** — In compressed mode, examples teach behavior better than rules. Invest 40% of token budget here.
4. **Crisis detection never compresses** — Safety guardrails stay at full depth regardless of mode.
5. **MBTI + character = personality compression** — "ISFJ + Marge Gunderson energy" communicates more in 8 words than a 200-word personality description.
6. **Latency management in every prompt** — Front-loaded discourse markers are free and dramatically improve perceived responsiveness.
7. **Word-repetition patterns** — 2-3 per call on bridge words. This is the single most impactful naturalness signal.
8. **Language-specific everything** — Vocal sounds, crisis signals, closing patterns, emergency resources must match the agent's language.
9. **No bracketed tags for generic TTS** — Only Cartesia SSML and ElevenLabs expressive tags. Generic TTS reads everything aloud.
10. **Constant blocks are behavioral DNA** — Sacred in full mode, distilled in compressed mode.
11. **Safety = Bridge, not Block** — Refusals must connect to help, never abandon.
12. **The persona is a person** — MBTI + character + quirks = hired, not generated.
13. **Conversational depth for relational agents** — Check-in, outreach, and recovery agents must have 2-3 exchanges minimum before wrapping up. Transcript examples must demonstrate follow-up curiosity, not checkout behavior.
14. **Tag palettes are persona-gated** — Each agent type gets 5-7 allowed tags and 2-3 banned tags. See `references/tts-platforms.md` for per-agent-type palettes.
15. **Tagged one-liner openers** — Every agent needs a pre-built opener with TTS tags that sets tone in the first breath. See `references/tts-platforms.md`.
