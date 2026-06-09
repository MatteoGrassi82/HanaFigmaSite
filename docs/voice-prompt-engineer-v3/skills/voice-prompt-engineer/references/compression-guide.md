# Compression Guide

## Why Compress

Production voice agents use real-time LLMs (GPT-4.1, Groq, etc.) with system prompt budgets around 2,000 tokens. This is confirmed by ElevenLabs' own prompting guide as best practice. Longer prompts increase latency, cost, and — counterintuitively — can reduce behavioral compliance because the LLM has too many competing instructions.

## The Core Insight

GPT-4.1 infers behavior from examples better than from verbose rules. A 200-word section explaining "how to mirror the patient's energy" teaches less than one transcript example where the agent responds to "Okay." with "Insurance?" instead of a 20-word answer.

## Token Budget Allocation

Target: ~1,500-2,000 tokens total.

| Section | Budget | Why |
|---------|--------|-----|
| Personality + Goal + Tone | ~150-200 tokens | MBTI + character reference compress personality |
| TTS voice delivery | ~100-150 tokens | Platform-specific tags mapped to 4-6 moments |
| Latency management | ~50-75 tokens | 3 lines — markers, stalling, pauses |
| Flow (opener + scenarios) | ~400-500 tokens | Terse decision trees, not prose |
| Guardrails | ~150-200 tokens | Hard rules + disclosure + hostility + silence |
| Crisis detection | ~200-300 tokens | NEVER compress — full depth always |
| Character normalization | ~25-50 tokens | 2-3 lines |
| Transcript examples | ~400-500 tokens | 3-5 examples — THE most important section |

## Compression Workflow

### Step 1: Start with the Full Prompt
Generate (or receive) the full-mode prompt with all constant blocks.

### Step 2: Replace Prose with Anchors
- PERSONALITY CORE (200 words) → `[MBTI] — [3 traits]. [Character] energy: [1 sentence].` (15 words)
- PERSONA (energy, register, warmth) → Folded into Tone as terse rules
- VOICE TEXTURE (50-100 words) → Demonstrated in transcript examples

### Step 3: Kill the Constant Blocks
Remove ALL constant blocks (Emotional Delivery, Variance Rules, Conversational Patterns, Adaptive Behavior, Speech Naturalism, Failure Prevention, Guardrails, Closing). Replace with:

**Tone section** (~75-100 tokens): Terse behavioral rules that capture the essence:
```
# Tone
Short sentences — this is a phone call. Most responses 5-15 words. Match their energy.
Use contractions always. Use "[characteristic phrases]" — never "[AI tropes to avoid]."
Mirror their sentence length. Never repeat their exact words.
Occasionally double a bridge word (2-3x per call):
"[example]" / "[example]"
```

**Guardrails section** (~100-150 tokens): Hard rules only:
```
# Guardrails
Never [scope limit 1].
Never [scope limit 2].
Never ask the same question more than twice — pivot or exit.

## AI disclosure
"[in-character response]"
If they refuse: "[graceful exit]"

## Hostility
Once: "[empathetic boundary]"
Continues: "[exit]"

## Silence
3 sec: "[check]" / 6 sec: "[offer callback]" / 9 sec: "[exit]"
```

### Step 4: Convert Scenarios to Decision Trees
Full mode scenarios are prose paragraphs. Compressed mode uses terse decision trees:

**Full mode:**
```
Scenario 1: Appointment Booking (Happy Path)
Trigger: Patient says they want to book an appointment.
Strategy: First, confirm the doctor by checking the system...
[150 words of explanation]
```

**Compressed mode:**
```
## Booking
1. Confirm doctor: "vedo che lei e' un paziente del Dottor [NAME]. conferma?"
2. Check availability. Offer 2-3 slots.
   No availability: "[response]"
3. Confirm: "[confirmation with details]"
4. Close: "[short close]"
```

### Step 5: Expand Crisis Detection
The tokens saved from removing constant blocks get reinvested into crisis detection. Include:
- Full implicit signal list (in the agent's language)
- IPTS dual-signal rule (both disconnection AND burdensomeness = elevated)
- Escalating withdrawal detection (progressively flatter across turns)
- Step-by-step response protocol
- "Never hang up first. Never minimize. Never continue script."

### Step 6: Write Transcript Examples
This is where you spend the most creative effort. The examples must demonstrate:
- Everything the removed constant blocks taught (variance, mirroring, energy matching, emotional delivery)
- TTS tags used naturally at key moments
- Word-repetition patterns
- The persona's voice in action

**Minimum examples:**
1. Happy path — smooth, demonstrates flow and confirmations
2. Terse patient — shows energy matching (2-word patient → 2-word agent)
3. Emotional/edge case — shows empathy through word choice + TTS tags
4-5. Domain-specific scenarios

### Step 7: Verify Token Count

Estimation methods (tiktoken often fails in sandboxed environments):
- **Word count × 1.3** = approximate tokens (English)
- **Character count ÷ 4** = approximate tokens (English)
- **Average both** for best estimate
- **Italian/Spanish**: multiply by 1.1 (longer words, accents)

Target: 1,500-2,000 tokens. Under 1,500 means you have headroom to add another example. Over 2,000 means cut scenarios or merge examples.

## What NEVER Gets Compressed

These sections maintain full depth regardless of token budget:

1. **Crisis detection signals** — Full list in agent's language
2. **IPTS dual-signal rule** — Both factors must be mentioned
3. **Response protocol** — Step-by-step, with "never" rules
4. **Emergency resources** — Local numbers, always accurate
5. **"This step is important"** — ElevenLabs-confirmed emphasis phrase that increases LLM compliance

## Conversational Depth Rule (Check-In / Outreach Agents)

For relational agents (wellness check-in, patient outreach, no-show recovery), add a CRITICAL RULE in the Flow section:

```
CRITICAL RULE: Never go from their first answer straight to "anything you need?" or "we're here if you need anything." That's a checkout, not a check-in. Have AT LEAST 2-3 exchanges about how they're actually doing before wrapping up.
```

This rule costs ~40 tokens but prevents the #1 failure mode for check-in agents: sounding transactional. Transcript examples must demonstrate:
- Follow-up curiosity ("What have you been up to?" / "How old are they now?")
- Branching by emotional state (good → curious; hard → sit with it; lonely → lean in)
- At least 2-3 agent turns of genuine conversation before any close attempt

**Anti-pattern to avoid in examples**: Agent asks "how are you?", patient answers, agent immediately says "anything you need from us?" → patient says no → agent closes. This is a checkout, not a check-in.

## Compression Anti-Patterns

**Don't do these:**
- Don't compress crisis detection to save tokens
- Don't remove transcript examples to save tokens (they're the most important section)
- Don't use abbreviations the LLM might misinterpret
- Don't merge the opener into the flow section — it needs to stand alone
- Don't remove the "avoid" list (AI tropes) — the model needs explicit anti-patterns
- Don't put call reporting JSON in the voice prompt — it belongs in a separate post-call function
- Don't skip the conversational depth rule for relational agents — without it, the agent sounds like a telemarketer
