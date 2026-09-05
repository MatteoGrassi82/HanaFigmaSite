# Components

The library is layered. Each layer may import from the layers below it and never
from the layers above. A page composes sections; a section composes media and
primitives; nothing imports a page.

```
src/
  styles/tokens.css      design tokens: colour, radius, shadow, type scale (+ fonts in theme.css)
  content/               typed copy and facts, no JSX (programmes.ts, …)
  app/components/
    ui/                  primitives: shadcn only (+ timeline-animation). Never edit for one page.
    media/               illustrative visuals a section composes: orbs, shaders, product mock UI, cover art
    sections/            THE LIBRARY. Every block a page is built from. Props in, no page knowledge.
    layout/              site chrome: Navbar, Footer, AnnouncementBar
    templates/           page layouts that compose sections from a content object (ProgrammePage, …)
    remotion/            Remotion compositions rendered inside sections via <Player>
    lab/                 variants and unmounted alternatives awaiting a decision. Not for production imports.
    dev/                 dev-only routes (TestWebhook). Never prerendered.
    SEO.tsx              stays here: scripts/lib/route-seo.mjs reads this path.
  app/pages/             thin route files. See "Adding a page".
```

## Where does it go

| If it… | It is a… | Folder |
|---|---|---|
| renders a `<section>` with its own heading, padding and rhythm | section | `sections/` |
| is a visual with no `<section>` around it (an orb, a chart, a mock dashboard) | media | `media/` |
| is a generic control from the shadcn registry | primitive | `ui/` |
| is the header, footer or a site-wide bar | chrome | `layout/` |
| composes sections from a data object into a whole page body | template | `templates/` |
| is a second version of something already shipped, or nothing mounts it | lab | `lab/` |
| is strings, numbers, codes, FAQs, with a type and no JSX | content | `src/content/` |

Two things are not components and do not live here: page-specific copy (it lives
in the page file or in `src/content/`) and one-off layout wrappers (write the div).

## Rules

**Sections take content as props.** A section may ship sensible defaults, but a
second page must be able to mount it with different copy without editing it.
`RecipesMarquee` + `src/content/programmes.ts` is the reference pattern: typed
content module, props-taking presentation. If a section only works on one page,
it is not finished; leave it in the page file until it is.

**Tokens, never hex.** New code uses `bg-navy`, `text-ink-soft`, `border-rule`,
`rounded-card`, `shadow-float`, `text-eyebrow` (see `src/styles/tokens.css`).
Existing hex migrates section by section with a visual check, not in a sweep.
The `.cobalt` scope overrides the same tokens, so a section written with tokens
renders correctly on `/remote-v2` and on every other page.

**No light gray for prose.** `text-ink-soft` (#475569) is the floor for readable
copy; `text-ink-mute` is for labels and meta only.

**Do not grow `src/lib/i18n.ts` for a single page.** `useTranslations()` has no
fallback: a namespace added to `en` alone throws on the Italian domain, and
nothing in the build type-checks. Product pages hardcode English in the page
(twelve routed pages already do) and the dictionary stays site chrome + Home.
If a section takes `items` and `itemsIt`, pass both or accept the documented swap.

**Copy guardrails apply to defaults too.** No em dashes. "30+ languages", never
"any language". Your team reviews, your provider signs; never "nurses". CY2027
is always *proposed*. Never name a competitor. See the copy memory for the rest.

**Filenames.** New files are PascalCase (`ProofBento.tsx`), named for the export.
`ui/` keeps shadcn's kebab-case because the registry generates them. Moved
files kept their export names, so `import { ProofBento } from "…/sections/ProofBento"`.

**No path alias.** Every import is relative. `../../lib/utils` from `sections/`,
`../../../lib/utils` from `ui/`. There is one `cn`: `src/lib/utils.ts`
(`ui/utils.ts` re-exports it).

## Adding a page

The prerender pipeline regex-scrapes each page for its `<SEO … />` block, so:

1. `src/app/pages/<Name>.tsx` with a **named** export. Inside it a **literal,
   self-closing** `<SEO path="/slug" title=… description=… />`. `path` must be a
   plain double-quoted string starting with `/`. `title`/`description` may be
   string literals, `it ? "…" : "…"` ternaries, or members of a `const` object
   declared **in the same file**. Never spread or compute them, and never put the
   `<SEO>` block inside a shared template: the parser finds one unresolvable
   path, skips it, and every page using that template prerenders with the
   generic default title. No build error. You find out from Search Console.
2. `src/app/App.tsx`: a `lazy(() => import("./pages/Name").then(m => ({ default: m.Name })))`
   and a `<Route path="/slug" …/>` with a double-quoted literal path, above the `*` route.
3. `scripts/lib/route-seo.mjs`: add `/slug` to `STATIC_ROUTES` (indexed, in the
   sitemap) or `NOINDEX_ROUTES` (live at the real URL, `noindex`, for review).
   The coverage check hard-fails the build if a route is in neither; an
   unregistered route 404s in production while working in `npm run dev`.
4. English-only pages need nothing more. Do **not** add them to `EN_ONLY_ROUTES`:
   `middleware.ts` 302s first-time Italian-IP visitors to `ita.hana.health/<same
   path>`, where an EN-only route is a hard 404.
5. A rename is four edits: `vercel.json` redirects, an App.tsx `<Navigate>`,
   move the old path to `REDIRECT_ROUTES`, and the `shouldRedirect` pair in
   `scripts/seo-check.mjs`.
6. `npm run build:bundle` for module resolution (seconds); `npm run build` for the
   real gate (prerenders every route in headless Chrome, minutes).

Templates are body components: `<ProgrammePage data={CCM} />`. The page file
owns the `<SEO>` block and the `COPY` const; `src/content/` owns the facts.

## Lab policy

`lab/` is a parking lot with a time limit, not an archive. A variant that loses
its decision gets deleted; git remembers. Anything in `lab/` may be imported
only by the noindex showcase routes (`/remote-lab`, `/preview`, `/bento`,
`/proof`, `/timeline`).

## History

The dead sections cut from `RemoteV2.tsx` (CallListSim, EconomicsSection,
CareJourneyPipeline/Split, TalkToHanaBanner, NoteBeforeVisit, PatientAgentSection,
SleepCalculator, AuditSection, …) and the deleted components (UseCases,
FrontDeskBento, AgentCard, security-checkpoints, intelligence-layers,
animated-flow, …) are recoverable from commit `098f9bd`.
