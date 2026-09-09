# The section library

Every section on the site lives here. A section is one full-width band of a
page: it owns its own vertical padding, its own ground colour, and one idea.
Pages are assembled from these; pages should not define their own bands.

Counted 7 Sept 2026: **42 sections, 0 unused.**

## How to use this file

Look up the job you need in the tables below, not the component name. The
right-hand column is what actually uses it today, which is the fastest way to
see a section working before you reuse it.

Two rules that are easy to get wrong:

- **`<SEO>` never goes in a section or a template.** `scripts/lib/route-seo.mjs`
  regex-scrapes a literal `<SEO path="/…" />` out of the *page* file. Put it
  anywhere else and the parser silently skips the route, the page prerenders
  with the generic default title, and the build does not complain.
- **No dark bands mid-page.** The palette decision (5 Sept 2026) allows a dark
  hero, a dark footer, and full-bleed *media* like `MonthWrittenUp`. It does not
  allow a navy content band between two light ones. Sections that offer
  `tone` give you `"light" | "band"`; `band` is `--color-band`, a light blue-grey.

## The reusable core

Used on four or more pages. Take these first; they are the site's vocabulary.

| Section | Job | Key props | Used by |
|---|---|---|---|
| `FaqSection` | Accordion Q&A, and the JSON-LD source | `items` `eyebrow` `heading` `tone` `id` | 17 pages |
| `CtaBand` | Closing ask. Exports `DEMO_HREF` | `heading` `body` `buttons` `reassurances` `tone` | 11 pages |
| `Hero` | Text-only hero for non-programme pages | `eyebrow` `headline` `body` `primaryCta` `trustLine` | 10 pages |
| `HowItWorksLoop` | How a month runs, as a loop diagram | `eyebrow` `heading` `leftSteps` `rightSteps` `math` `tone` | 6 pages |
| `SafetyStack` | Layered call-time controls, 3D | `light` | 6 pages |
| `InlineImageHeader` | Big statement with an inline image | — | 6 pages |
| `LoopDiagram` | Read → Engage → Document, stations | `eyebrow` `heading` `stations` `cadence` `offRamp` | 4 pages |
| `EligibilityGap` | The ASPE/NORC subtraction, dialled | — (reads `MARKET`) | 4 pages |
| `WhatIsHanaCompare` | 2–3 column category comparison | `columns` `eyebrow` `heading` `footnote` `tone` | 4 pages |
| `RecipesMarquee` | Scrolling workflow breadth | — | 4 pages |

## The programme-page set

`templates/ProgrammePage.tsx` composes these in a fixed order that answers six
questions a practice manager asks. All seven `/programs/*` pages share it, so a
change here lands on seven pages at once.

| Section | Answers | Key props |
|---|---|---|
| `ProgrammeHero` | What is the one rule this programme turns on? | `data` `headline` `rows`; draws a `RuleDiagram` from `data`, or a photo if `image` is passed |
| `RuleDiagram` | The rule as a drawing: minute arc, 13-element grid, 16-of-30 day strip, discharge timeline | `programme`; SVG from tokens, no photo, so seven pages get seven different heroes |
| `EligibilityCheck` | Is this me? | `data` `id` |
| `PayVisual` | What does it pay? | `data` `heading` `tone` |
| `WhoDoesWhat` | What do I still have to do? | `data` `id` |
| `WhyHana` | Why does the month actually happen? | `eyebrow` `heading` `sub` |
| `MonthWrittenUp` | What does the month produce? | `entries` `badge` `pill` `chip` `body` `stats` `cta` |
| `RevenueEstimator` | What is it worth? | `programme` `id` |
| `SonicDemoSection` | Can I hear it? | the four `webCall` props |

⚠ **`WhyHana`'s four percentages (58 / 30 / 85 / 33) carry no citation anywhere
in this repo.** They are the only figures on a programme page that are not a CMS
rate or an attributed third-party statistic. Source them or retire them before
`/programs/*` leaves `NOINDEX_ROUTES`. `reach={false}` turns the section off.

⚠ **`RevenueEstimator` assumes per-patient-per-month.** Every string in it says
so. TCM is billed per qualifying discharge, so it passes `showEstimator={false}`
rather than print a number wrong by however many patients were never
discharged.

## Interactive

Client-side state, and each one shows its own arithmetic.

| Section | Job | Notes |
|---|---|---|
| `EligibilityGap` | Panel dials → the eligible-vs-enrolled gap | Third-party figures, cited on screen |
| `RevenueEstimator` | Panel × enrolment × rate | Locked per programme |
| `ProgrammeFilter` | Describe the patient, the fitting programmes stay lit | Hub; all 8 lit by default, so untouched it IS the card grid. Replaced `ProgrammeChooser` + the static grid + `CodeTable` on `/programs` |
| `ProgrammeChooser` | Three questions → one programme | **Unused** since 9 Sept 2026 (hub moved to `ProgrammeFilter`) |
| `EligibilityCheck` | Per-programme eligibility rule | Reads the content module |
| `CodeTable` | All seven programmes' codes at once | **Unused** since 9 Sept 2026; `PayVisual` per programme, `ProgrammeFilter` on the hub |
| `CostOfDelay` | Months unbilled → revenue that never comes back | `/compare/vs-doing-nothing`; real `<table>`, gross/net toggle |
| `AccordionPlayer` | Accordion ↔ Remotion `<Player>`, two-way scrub | Compositions only, never a video file |
| `VideoSection` | A real `.mp4`, native `<video>` | Buffering + error states for hosted files |

## Live

These reach a real endpoint. They need props threaded from `App.tsx`.

| Section | Job |
|---|---|
| `SonicDemoSection` | "Have a chat with HANA" on the waveform canvas |
| `LiveDemoSection` | The underlying form. `bare` mode is what Sonic renders |
| `ContactFlow` | The `/hana-contact` product flow |
| `AskAiAboutUs` | Ask-a-question box |

## Media and proof

| Section | Job | Notes |
|---|---|---|
| `MonthWrittenUp` | Time log already full when the clinician starts | Full-bleed photo + glass card |
| `ProductsIntro` | Two-product split, photo + activity feed | The pattern `ProgrammeHero` borrows |
| `PatientEngagement` | "Every patient conversation, handled" bento | `white` |
| `ProofBento` | Generic proof tiles | Not on programme pages: reads as borrowed credibility |
| `TeamSection` · `BuiltByClinicians` | People and credentials | |
| `CaseStudiesSection` · `LatestPosts` · `WhitepaperFlows` | Content feeds | `LatestPosts` fetches client-side, so it contributes nothing to the prerender |
| `IntegrationsSection` · `ComplianceSection` · `GetYouLive` · `ReadyToUseSection` · `StatisticsCard` · `HeroDitheringCard` · `HowHanaWorks` · `AgenticFrameworkCarousel` | Single-purpose bands | |

## Photographs

The site owns **two** real product photos and **two** AI-generated ones.

| File | Use | Notes |
|---|---|---|
| `products/contact-front-desk.webp` | HANA Contact | Real |
| `products/remote-patient-call.webp` | HANA Remote, `MonthWrittenUp`, homepage | Real |
| `products/programme-hero-kitchen.webp` | `/programs` hub hero only | **AI-generated**; programme pages draw `RuleDiagram` instead |
| `products/programme-hero-armchair.webp` | unused | **AI-generated**, warmer, better uncovered |

⚠ **The people in the generated photos do not exist.** Fine for an illustrative
hero carrying an "Illustrative" caption. **Not** fine for a testimonial, case
study, team page, or anywhere a reader could take a face as a real patient.

Imagery is the binding constraint on how far the photo pattern can go. Four
photographs across a 38-page site means reuse is visible — which is exactly how
the hero and the written-up month came to share one image before 7 Sept 2026.

## Adding a section

1. **Name it by its job, not its page.** `MonthWrittenUp`, not `SleepNote`. The
   sleep version is now a thin wrapper over the general one for this reason.
2. **Make the copy a prop.** Headlines are strings a person signs off; never
   generate them from data.
3. **Offer `tone` and `id`** if it could appear on more than one page.
4. **Respect `prefers-reduced-motion`** — and render at the *rest* position, not
   at progress 0.
5. **Add a row to this file.**

## Adding a `--text-*` token

Register it in `cn()` (`src/lib/utils.ts`). `tailwind-merge` cannot tell
`text-h2` (a size) from `text-ink` (a colour); unregistered, it treats them as a
conflict and silently drops one. That is how a 46px heading once rendered at
20px with no build error.
