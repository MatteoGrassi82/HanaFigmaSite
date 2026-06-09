# TTS Platform Reference

Include the appropriate section based on the user's TTS platform. Each section provides the voice delivery instructions to embed in the generated prompt.

---

## Cartesia Sonic-3

Cartesia Sonic-3 is an expressive TTS engine that supports SSML emotion tags, speed/volume controls, and nonverbalisms. It interprets emotional subtext from the text by default — tags are only needed to PUSH delivery at specific moments.

### Available Controls

**Emotion tags** (SSML format):
```
<emotion value="[emotion]" />
```
Primary emotions: neutral, angry, excited, content, sad, scared
Secondary emotions (50+): sympathetic, calm, confident, curious, surprised, disappointed, amused, nostalgic, hopeful, skeptical, grateful, concerned, proud, tender, playful, serious, determined, wistful, and more.

**Speed control:**
```
<speed ratio="[0.5-2.0]" />
```
Default is 1.0. Use 0.85-0.9 to slow for important info. Use 1.1-1.2 for familiar/easy content.

**Volume control:**
```
<volume level="[whisper|soft|normal|loud]" />
```

**Nonverbalisms:**
```
[laughter]
```
The model supports `[laughter]` as a nonverbal cue. Use sparingly — only when genuinely funny.

### Prompt Section Template (Cartesia)

Include this in the generated prompt:

```markdown
# Cartesia voice
You are generating text spoken by Cartesia Sonic-3 TTS. Use SSML emotion tags at key moments only — not every line. The model reads emotional subtext by default, so tag only when you want to push delivery.

[Map 4-6 tags to specific moments for this agent's personality:]
<emotion value="content" /> for [when to use warmth].
<emotion value="sympathetic" /> for [when to use empathy].
<emotion value="calm" /> for [when to ground/reassure].
<emotion value="confident" /> for [when to project certainty].
<speed ratio="0.85" /> to slow down for [important details specific to this agent].
[laughter] only if something is genuinely funny. Never forced.

Do not tag neutral exchanges — Cartesia handles those naturally.
```

### Tag Selection by Agent Type

| Agent Type | Primary Tags | Avoid |
|-----------|-------------|-------|
| Patient intake | content, sympathetic, calm, confident | excited, angry |
| Sales demo | content, excited, confident, curious | sad, scared |
| Customer support | content, sympathetic, calm | excited (unless celebrating resolution) |
| After-hours booking | content, sympathetic, calm, confident | excited (evening energy) |
| Health coaching | content, sympathetic, curious, hopeful | angry, scared |

### Rules for Cartesia Tags
- Tags affect delivery from the tag until the next tag or end of response
- Don't stack multiple emotion tags — use the most appropriate one
- Default (no tag) = Cartesia reads emotional subtext naturally
- Use speed control for dates, times, IDs, spelling, and emotional moments
- [laughter] max 1-2x per call, only when reactive

---

## ElevenLabs V3 Conversational

ElevenLabs V3 Conversational is an ultra-low-latency TTS model optimized for live dialogue. It maintains conversational context across turns and adapts delivery to match tone and intent automatically. Part of ElevenLabs' "Expressive mode."

### Available Controls

**5 documented tags:**
```
[laughs]    — Adds laughter
[whispers]  — Lowers volume for whispering
[sighs]     — Adds a sighing quality
[slow]      — Slows down speech delivery
[excited]   — Adds excitement to delivery
```

**Rich custom audio tags** (the real power — learned from ElevenLabs' own example prompts):
The model interprets ANY descriptive 1-2 word tag as a delivery instruction. You can invent tags to match any persona:

```
[warm]       — Warm, inviting               [gentle]     — Soft, careful for hard moments
[soft]       — Present but quiet             [calm]       — Grounded, reassuring
[confident]  — Clear, certain                [checking]   — "Looking something up" energy
[chill]      — Relaxed, zero-pressure        [friendly]   — Approachable rapport
[curious]    — Genuine interest              [apologetic] — Sorry without groveling
[thoughtful] — Considered, reflective        [chuckles]   — Lighter than [laughs]
[faster]     — Speeds up                     [quick]      — Brief, efficient
```

Each tag affects ~4-5 words, then delivery returns to normal.

**Context-aware delivery** (no tags needed):
The model adapts tone from conversational context automatically. Tags only needed to PUSH at key moments.

### Tag Rules (Critical — from ElevenLabs example prompts)
1. Tags go inline BEFORE the words they affect: `[warm] Hey, how are you?`
2. Tags must be **1-2 words max** (Jennifer rule)
3. Each tag affects ~4-5 words then returns to normal
4. Tags must be **persona-gated**: build a palette of 5-7 tags, ban 2-3 explicitly
5. Use **"Instead of / Say" rewrite pairs** alongside tags to teach what NOT to do
6. Embed tags in transcript examples — the model learns placement from demonstrations

### Prompt Section Template (ElevenLabs)

```markdown
# Voice delivery
Your response will be spoken via ElevenLabs V3 Conversational TTS. Use audio tags inline before the words they affect. Tags should be 1-2 words max. The model reads emotional context by default — only tag when you want to push delivery.

Tags [AGENT NAME] uses:
[tag1] for [moment]: "[tag1] [example phrase]."
[tag2] for [moment]: "[tag2] [example phrase]."
[tag3] for [moment]: "[tag3] [example phrase]."
[tag4] for [moment]: "[tag4] [example phrase]."
[slow] for [details — dates, IDs, emotional moments].
[chuckles] only if genuinely funny. Max once per call.

Tags [AGENT NAME] NEVER uses:
[banned_tag] — [why it doesn't fit persona].
[banned_tag] — [why it doesn't fit persona].

Instead of: "[robotic phrasing]"
Say: "[tagged natural phrasing]"
Instead of: "[another robotic phrasing]"
Say: "[tagged natural phrasing]"
```

### Tag Palette by Agent Type

| Agent Type (MBTI) | Use Tags | Ban Tags |
|-------------------|----------|----------|
| Patient intake (ISFJ) | [warm], [checking], [gentle], [calm], [confident], [slow] | [excited], [whispers], [booming] |
| Wellness check-in (ISFJ/INFP) | [warm], [gentle], [soft], [calm], [slow] | [excited], [whispers], [booming] |
| No-show recovery (ESFP) | [warm], [chill], [gentle], [checking], [confident], [slow] | [excited], [whispers], [booming] |
| Sales demo (ENFJ) | [warm], [chuckles], [slow], [excited] | [sighs], [whispers] |
| Sales outreach (ENFJ) | [warm], [friendly], [confident], [curious], [slow] | [excited], [whispers], [booming] |
| Customer support (ESFJ) | [warm], [gentle], [calm], [checking], [slow] | [excited] (unless resolving) |
| After-hours booking (ISFJ) | [warm], [gentle], [calm], [confident], [slow] | [excited], [whispers] |

### One-Liner Openers (tagged)

Every agent should have a tagged opener that sets the tone in the first breath:

```
Intake:      [warm] Hi, is this [NAME]? ... Hey, this is Hana from [CLINIC]. [calm] Getting your info ready before your appointment on [DATE]. Takes about five minutes. Is now okay?
Check-in:    [warm] Hey, is this [NAME]? ... Hi, it's Hana from [CLINIC]. [soft] Just calling to check in— it's been a while. How have you been?
No-show:     [warm] Hey, is this [NAME]? ... Hi, it's Hana from [CLINIC]. [chill] Looks like you had an appointment on [DATE] that we missed you at. No big deal— want to rebook?
Demo:        [warm] Hey! Thanks for calling. I'm Hana. [chuckles] ... So, you want to see what a patient check-in sounds like?
Outreach:    [warm] Hey, is this [NAME]? ... Hi, this is Hana. I'm actually an AI— I call patients who miss appointments and help get them rebooked.
```

---

## Generic TTS

For platforms without specific emotion/expression controls (basic TTS, older engines, unknown platforms). All emotion must come from word choice, sentence structure, and punctuation.

### Prompt Section Template (Generic)

Do NOT include a separate TTS section. Instead, ensure the Emotional Delivery constant block is present (full mode) or its principles are demonstrated in transcript examples (compressed mode).

### Key Rules for Generic TTS
- NO bracketed tags of any kind — TTS reads everything aloud
- NO stage directions or meta-instructions
- Emotion comes from: word choice, vocal sounds (written out), sentence length, punctuation
- Vocal sounds as words: "hmm...", "oh...", "ah...", "ha", "mm..."
- Pacing through punctuation: ellipses (...) for pauses, periods for slowing, em-dashes for pivots
- Write out numbers conversationally: "march fourteenth" not "3/14"
- No emojis

### Vocal Sound Reference (Generic)

**Thinking:** "hmm...", "mm...", "huh...", "ah..."
**Reactions:** "oh!", "oh no...", "ooh...", "wow..."
**Laughter:** "ha", "haha" (sparingly, reactive only)
**Transitions:** "so...", "well...", "yeah...", "right...", "ok..."

All vocal sounds must be REACTIVE — triggered by what the human said, not pre-positioned.
