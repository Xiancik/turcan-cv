# Handoff: turcan.nl visual refresh (v2)

## Overview

A visual refresh of **turcan.nl** — the personal CV / portfolio site for Cristian Turcan.
It keeps the existing warm-oat + moss-green identity and **all existing copy**, and changes
the staging: an asymmetric hairline-rail grid instead of a centred 940px column, display
type at page scale, real paper grain, printed-ledger hairlines instead of rounded cards
and shadows, and one deliberate arrival/hover motion system.

Scope covered by the designs: **all six page types** in the site.

| Design id | Page in repo | What it is |
|---|---|---|
| `1a` | `index.html` | Home |
| `1b` | `experience.html` | Work history + education |
| `1c` | `projects.html` | Project index (depth bands) |
| `1d` | `events.html` | Events ledger |
| `1e` | `papers.html` | Publications |
| `1f` | `projects/mesh-simplification.html` | Case-study template — applies to every `projects/*.html` |

## About the design files

The files in this bundle are **design references created in HTML** — prototypes showing the
intended look and behaviour, not production code to paste in. The task is to **implement
this design in the existing site**: plain static HTML + the single shared `style.css`, no
bundler, no framework, no JS router (see `docs/design` conventions and the repo README).

`turcan.nl v2.dc.html` renders all six pages stacked on one canvas, each labelled with its
id badge (`1a`…`1f`). It uses inline styles because of the tool it was authored in — **do
not port inline styles into the site**. Port them into `style.css` as classes; the repo
already has the class names (`.site-nav`, `.hero`, `.role`, `.project-card`, `.band`,
`.timeline`, `.paper`, `.case`, `.footer`). `style-v2-reference.css` in this bundle is a
reference implementation of every pattern below, written against those existing class
names — start from it rather than from the prototype markup.

`Baseline - turcan.nl today.dc.html` is a faithful recreation of the site as it is **today**,
for before/after comparison. It is not a target.

## Fidelity

**High-fidelity.** Colours, type sizes, spacing, borders and motion timings below are final
and exact. Recreate them precisely. Where a value is not stated, keep what the site does today.

## Hard constraints (confirmed with the site owner)

1. **Do not change any copy.** Every string in the designs already exists in the site or in
   `content/*.yml`. Prose stays behind the `<!-- copy:KEY -->…<!-- /copy -->` markers and the
   `npm run build` step keeps working. If a layout seems to need a new line of text, stop and ask.
2. **No monospace in the interface.** Everything is IBM Plex Sans. The only exception is the
   Brainfuck code sample on `projects.html` / the case study, which is real code.
3. Numbers (dates, metrics, scores, counts) keep `font-variant-numeric: tabular-nums`.
4. **No rounded corners, no box-shadows, no gradients** except the hero portrait scrim.
5. Dark mode stays. New tokens have dark values in the reference CSS.
6. `prefers-reduced-motion: reduce` renders every final state immediately.
7. Bricolage Grotesque and IBM Plex Sans stay self-hosted from `fonts/` — no new font files.

## Design tokens

Existing tokens keep their values. Light theme:

| Token | Value | Use |
|---|---|---|
| `--paper` | `#f3efe6` | page ground |
| `--paper-alt` | `#efe9dc` | alternate section band (Beyond the code, Education, Bare metal, Gallery) |
| `--surface` | `#f8f5ee` | cards |
| `--field` | `#ece6d9` | image/media field behind screenshots and the portrait |
| `--ink` | `#232019` | primary text, ink rules, ink footer bar, buttons |
| `--ink-body` | `#403a30` | body prose (slightly warmer than `--ink`) |
| `--muted` | `#534d41` | secondary text, inactive nav |
| `--faint` | `#6b665c` | dates, org lines, spec lines |
| `--faintest` | `#8a8272` | rail numerals, field labels, captions |
| `--accent` | `#3d6b4f` | moss: section labels, live bars, rules, ticks |
| `--accent-str` | `#2e5640` | moss text on paper (links, metrics, chips) |
| `--accent-soft` | `#e3ead9` | chip fills (used sparingly now) |
| `--accent-line` | `#a9bfa8` | chip and tag borders |
| `--border` | `#e0d8c5` | inner hairline |
| `--border-str` | `#cfc6b2` | outer hairline, card border, grid gap colour |
| `--on-ink` | `#f3efe6` | text on the ink bar |
| `--on-ink-dim` | `#c6bfae` | secondary text on the ink bar |
| `--on-ink-rule` | `#3a3529` | rules on the ink bar |
| `--on-ink-accent` | `#9fd3af` | moss on the ink bar |

Dark theme keeps today's `:root[data-theme="dark"]` values and adds:
`--paper-alt:#1f1b15; --surface:#221e18; --field:#26221b; --ink-body:#d8d0c0;`
`--faintest:#7d7565; --accent-line:#3f5943; --border:#322c22; --border-str:#443c2f;`
The ink footer bar in dark mode becomes `#100e0a` so it still separates from `--paper`.

**Spacing**: rail width `200px` (subpages) / `96px` (home section numerals). Section padding
`44–60px` top, `56px` right, `40px` left of the content column. Grid gaps `1px` (hairline
grids), `24px` (project cards), `26–34px` (project sub-grids), `48px` (two-column prose).

**Type scale** (Bricolage Grotesque 700 for display, IBM Plex Sans for everything else):

| Role | Size / line-height / tracking |
|---|---|
| Home h1 | 96px / .94 / -.035em |
| Page h1 (subpages) | 72–104px / .92–.96 / -.04em (Projects 104, Events 88, Papers 80, Case 72, Experience 76) |
| Section h2 | 46px / 1.02 / -.03em |
| Block h2 (bands, case sections) | 24–28px / 1.1 / -.025em |
| Card / event title | 21–27px / 1.1 / -.022em |
| Paper title | 38px / 1.06 / -.03em |
| Role title (Experience) | 32px / 1.06 / -.03em |
| Paper lede | 22px / 1.35 / -.015em, Bricolage 600 |
| Hero sub / page intro | 20–23px / 1.55, Plex Sans 400 |
| Role summary | 21px / 1.55 |
| Body prose | 17px / 1.7–1.72, `text-wrap: pretty` |
| Card body | 15–16px / 1.6 |
| Section label | 14px / 600, `--accent` |
| Date / org / spec line | 14.5–15px, `--faint`, tabular-nums |
| Metric cell | 16px / 600, `--ink`, tabular-nums |
| Field label (Papers, Case meta) | 13.5px / 600, `--faintest` |
| Tag / chip | 13.5px, `--accent-str`, 1px `--accent-line` border, 3px 9px padding |
| Nav item | 15px / 600 |
| Button | 16px / 600, 15px 24px padding |

Nothing in the interface is below 13.5px, and nothing is uppercase or letterspaced.

## The system, page by page

### Shared chrome (every page)

- **Header**: full-bleed, `26px 56px 22px`, `border-bottom: 1px solid var(--ink)` (a full ink
  rule, not a hairline). Left to right: brand (Bricolage 700, 19px, -.02em), then a plain
  15px `--faint` label naming the page ("Software & embedded engineer · Delft" on home,
  otherwise "Experience", "Projects", "Events", "Papers", "Case study"), then the nav pushed
  right with `margin-left:auto`, `gap:26px`. Nav items are 15px/600; the active item is
  `--ink` with a 2px `--accent` bottom border, inactive are `--muted` with a transparent
  2px border that becomes `--accent` on hover. The theme toggle keeps its current 44px
  target, moved to the end of the header row.
- **Rail**: every subpage is a `grid-template-columns: 200px 1fr`. The rail cell is
  right-aligned, `border-right: 1px solid var(--ink)`, and carries the section label, the
  date, the year, the plate numeral, or "← Back to projects". The content cell is padded
  `56px` right / `40px` left. On home the rail is `96px` and carries only the section
  numerals `01`–`05` (14px/600, `--faintest`) with a `--border` right hairline.
- **Grain**: one absolutely-positioned overlay per page, `inset:0`,
  `mix-blend-mode: multiply`, `opacity:.075`, `pointer-events:none`, background is a
  220×220 tiled SVG `feTurbulence` (`type="fractalNoise" baseFrequency="0.82"
  numOctaves="4" stitchTiles="stitch"`). See `.grain` in the reference CSS. One per page —
  do not stack them.
- **Footer**: an ink bar (`background: var(--ink)`, `color: var(--faintest)`), `26px 56px`,
  the existing two footer lines flexed apart at 14px, links `--on-ink-dim` with an
  `--on-ink-rule` underline.

### 1a · Home

Five numbered blocks, each a `96px 1fr` grid, separated by `1px solid var(--border-str)`.

1. **`01` Hero** — three columns: `96px | 1fr | 340px`.
   - Left of centre: label "Positioning" (14px/600 moss), h1 at 96px with `end to end`
     in `--accent` (the existing `<em>`, still not italic), a full-width `1px` ink rule,
     the 23px sub at `max-width:34ch`, then the action row: ink block button
     ("Download CV ↓", `--ink` bg, `--on-ink` text, hover `--accent`), the email address
     with a moss underline, and "LinkedIn" with a `--border-str` underline.
   - Right: the portrait as a **fixed 340×400 plate** — `align-self:start`, `margin-top:56px`,
     `height:400px`, `border-left` + `border-bottom` hairlines, `--field` background,
     `object-fit:cover`, `object-position:50% 18%`, `filter: saturate(.86) contrast(1.04)`.
     Do **not** let the grid row stretch it (that was the bug in an earlier pass: the cell
     grew to the text column's height and cropped ~46% of the source). A bottom-anchored
     scrim (`linear-gradient(to top, rgba(35,32,25,.42), transparent 46%)`) carries the
     caption "Delft, NL · shipping since 2024" in 14px/600 `--on-ink`.
2. **`02` Selected work** — head row: label + 46px h2 on the left, the existing lead
   sentence right-aligned at `max-width:30ch`, closed by a full ink rule. Below it the
   proof block: **four equal role cards** in `repeat(4,1fr)` with `gap:1px` on a
   `--border-str` background (hairline grid, no radius, no shadow). Each card: a 5px top
   bar — `--accent` for the two live roles, `--border-str` for the past two — then 38px
   logo on `#fff` with a hairline, the "Part-time" chip pushed right where it applies, the
   20px/700 title, the org + place + dates at 14.5px `--faint`, a `--border` hairline, and
   the existing summary at 15px. Hover lightens the card to `#fdfcf8`.
3. **`03` Things I've built** — same head pattern, then a 6-column grid where each of the
   four project cards spans 3 (an even 2×2). Cards are `--surface` with a `--border-str`
   border that becomes `--accent` on hover; media sits on top at `aspect-ratio:16/9`
   (`object-fit:contain` for the diagram SVG, `cover` for screenshots) on a `--field`
   ground; body is domain label (13.5px/600 moss) → 21–24px title → 15px desc → 14.5px
   spec line → tags.
4. **`04` Beyond the code** — `--paper-alt` band. 46px h2, then the two existing personal
   cards as plain two-column prose under a full ink rule: 14px/600 `--faintest` heading,
   17px/1.72 body, no card chrome.
5. **`05` Say hello** — ink block: `--ink` background, 64px h2 in `--on-ink`, 20px lead in
   `--on-ink-dim`, a paper-coloured button (hover `--on-ink-accent`), two underlined links,
   then a `--on-ink-rule` hairline and the footer lines.

### 1b · Experience

"One rule": the 200px rail carries time, the content hangs off it.

- Page head: label in the rail, 76px h1 + 20px intro.
- Optional "Now" row (tweakable, on by default): a moss-bordered pill with a 7px moss
  square in the rail, and the existing "Aug 2026: two roles, in parallel" line beside it.
- Each role is its own `200px 1fr` grid row with a `--border-str` bottom hairline; the row
  hover lightens the whole role to `--surface`.
  - Rail: `Jan 2026 —` / `Present` (Present in moss) at 15px/600 tabular, then the
    "still counting" duration at 13.5px `--faintest`. Keep the existing JS that computes it.
  - Content: 44px logo + "Part-time" chip → 32px/700 title → org · place at 15px `--faint`
    → 21px summary at `max-width:62ch` → the **metric strip**: a full-width row under an ink
    top rule and a `--border-str` bottom rule, cells at 16px/600 `--ink` tabular separated by
    `--border` left hairlines (`10px 18px` padding). Metrics are the strongest evidence on
    the site — they read as instrument readings, not badges.
  - Sub-projects: under a `30px` gap, an ink top rule, then a **3-up grid**
    (`repeat(3,1fr)`, `gap: 22px 34px`) of title (15px/600 Bricolage) + optional metric
    (13.5px/600 moss, right-aligned on the title row) + 14px summary. This replaced a tall
    300px side column that left the page looking empty — do not reintroduce it.
  - Altix keeps its "Project · AltixDocs" line (now an inline row) and its two bullets.
- Education: `--paper-alt` band, 40px h2, two equal cards in a `1px`-gap hairline grid;
  40px logo, 19px/700 title, 14.5px org+dates, 15px note.

### 1c · Projects

Bands stay, but the band head moves into the rail: the 3-bar altitude gauge (26×4px bars,
4px gaps, filled `--accent` down to the band's depth), a 24px/700 label, and the existing
hint at 14px `--faintest`. The content column holds the cards.

- Product: one card, `1.15fr 1fr`, image left (`min-height:200px`), body right.
- Systems & compute: the generals.io feature card (`1.08fr 1fr`, `min-height:212px`), then
  mesh and prosperity side by side at `aspect-ratio:16/9`.
- Bare metal: `--paper-alt` band, the Brainfuck capstone as `1.25fr 1fr` — 27px title and
  spec on the left, the code sample on the right: `--paper` ground, `--border` hairline,
  12.5px `ui-monospace` (**the one place monospace survives**), mnemonics in `--accent-str`.
- Card titles are 25px on feature cards, 23px on the pair. All cards: `--surface`,
  `--border-str` border → `--accent` on hover.

### 1d · Events

The "refusal" page: **no imagery at all**, a dense typographic ledger. Years live in the
rail as 34px/700 Bricolage numerals (tabular); each year's events stack in the content
column, separated by `--border` hairlines, with `--border-str` between year groups. Each
event: 27px/700 title with the result chip pushed right (13.5–14px/600 moss, 1px
`--accent-line` border), then place · date at 15px `--faint` tabular, then the 17px
description at `max-width:64ch`. Row hover lightens to `--surface`. The existing
"A photo from … coming" placeholders stay as small dashed-border italic notes — they are
honest, and they are not a reason to add a photo frame.

### 1e · Papers

Two plates. The rail carries `Paper I` / `Paper II` (14px/600 with the numeral in 20px
Bricolage moss) above a `--border-str` hairline, then the front matter as label/value pairs
(13.5px/600 `--faintest` over 15px `--ink`; Status and Scope in moss 600). The body column
(`max-width:74ch`): 38px title → byline at 16px with the name in moss 600, closed by a
hairline → 22px Bricolage lede → 17px/1.7 abstract → keyword chips → ink block button
("Read the paper →"). Paper II sits on `--paper-alt`. Keep the `PASTE_*_URL` hrefs as they
are until real URLs exist.

### 1f · Case study (template for every `projects/*.html`)

"Frontispiece": rail carries "← Back to projects" plus the domain label; content carries a
72px h1, the 21px summary, and the meta as a **horizontal cell strip** under an ink rule
(Context / Role / Stack / Score — 13.5px/600 label over 16px/600 value, `--border` left
hairlines). Then the cover image full-bleed edge to edge on `--field`, `max-height:460px`,
`object-fit:cover`. Then the body: rail label "The work", content in two 48px-gapped
columns (Overview | What I built) at 17px/1.72, then "Highlights" as a 3-up hairline grid of
`--surface` cells at 16px. Then a `--paper-alt` gallery band: two figures side by side,
`--border-str` framed on `--field`, captions at 14.5px `--faint` tabular, and the back link.
Apply the same skeleton to `brainfuck-jit`, `creator-match`, `generals-ffa-bot`,
`prosperity4` and `automation-bots/*` — the meta strip absorbs whatever fields each page has.

## Interactions & behaviour

**Arrival (home only, once, on load).** Four staggered pieces, no scroll-triggered anything:

| Element | Animation |
|---|---|
| "Positioning" label | `fade .5s ease .05s both` |
| h1 | `rise .8s cubic-bezier(.2,.7,.3,1) .1s both` |
| hero sub | `rise .7s … .3s both` |
| ink rule under h1 | `rule .9s … .35s both` (`transform: scaleX(0→1)`, `transform-origin:left`) |
| action row | `rise .7s … .42s both` |
| portrait | `fade .9s ease .15s both` |

`rise` is `opacity 0 → 1` with `translateY(18px → 0)`. Nothing else on the site animates on
entry — the existing `.reveal` / `.reveal-seq` cascade should be retired on the pages
covered here, since the rail-and-rule layout reads as one plate rather than a list of cards.

**Hover** is a single move, repeated: a hairline or border swaps to `--accent`, or a row
lightens one step (`--paper` → `--surface`, `--surface` → `#fdfcf8`). No transforms, no
lifts, no shadows, no scaling. Instant or ≤150ms.

**Reduced motion**: `@media (prefers-reduced-motion: reduce) { * { animation: none !important; opacity: 1 !important; transform: none !important; } }`

**Responsive.** The designs are drawn at 1440px. Below ~900px: the 200px/96px rail collapses
— move the rail content inline above its block (section label, date, year, plate numeral) and
drop to a single column; the role-card row becomes 2-up then 1-up; the Experience sub-project
grid goes 2-up then 1-up; the hero portrait moves above the headline at `aspect-ratio:4/5`,
full width; the metric strip wraps with the left hairlines becoming top hairlines. Keep the
existing 44px minimum tap targets and the current mobile nav wrap.

## State management

Static site — no application state. Three pieces of behaviour to keep:

1. Theme toggle (`theme.js`) + the `localStorage` pre-paint script in `<head>`.
2. The "still counting" duration ticker on live roles (`data-since`), and — if the "Now" row
   is kept — the existing live-segment sizing script can be **deleted**: the spine it measured
   no longer exists in this design.
3. `notify.js` as-is.

## Assets

Everything is already in the repo. One asset needs a fix:

- **`img/projects/automation-bots.svg` is broken in the repo copy** — its class-based
  `<style>` block does not survive as an `<img>` in every context, so the diagram paints as a
  near-black panel. The fixed file is in this bundle: same geometry, all fills inlined as
  presentation attributes, and recoloured into the oat/moss palette (`#ece6d9` ground,
  `#f8f5ee` cards, `#cfc6b2` hairlines, `#3d6b4f` accents and arrows, `#6b665c` body text).
  Drop it in over the existing file.
- Unchanged: `img/cristian.jpg`, `img/experience/{offroad,insyght,altix,huawei,tudelft}.*`,
  `img/projects/{mesh.gif,mesh.png,mesh-original.png,prosperity.png,generals.png}`,
  `img/favicon.svg`, `fonts/*.woff2` (Bricolage 600/700, Plex Sans 400/400i/600).
- `fonts/bricolage-grotesque-*` are both used (700 display, 600 for sub-heads).
- Placeholder imagery is acceptable for now; no new images are required.

## Files in this bundle

| File | What it is |
|---|---|
| `turcan.nl v2.dc.html` | The design: all six pages, labelled `1a`–`1f` |
| `Baseline - turcan.nl today.dc.html` | The site as it is today, for comparison |
| `style-v2-reference.css` | Reference implementation of every pattern above, against the repo's existing class names — start here |
| `img/projects/automation-bots.svg` | Fixed diagram asset (drop-in replacement) |
| `screenshots/1a…1f*.png` | One full-page PNG per page, 1442px wide, for reference |

Note on the screenshots: they are DOM re-renders, so the paper grain is not visible in them
and the Huawei logo (`huawei.svg`) shows as a solid black square — both render correctly in
the live design. Trust the HTML over the PNGs where they disagree.

## Suggested order of work

1. Land the tokens and the shared chrome (header, rail grid, ink footer, grain, motion) in
   `style.css`; verify against `1a` and `1b`.
2. Home (`index.html`) — hero markup changes (portrait becomes a fixed plate) and the role
   card grid replacing `.roles`.
3. Experience — rail rows, metric strip, 3-up sub-projects; delete the spine scripts.
4. Projects — band heads into the rail.
5. Events, Papers.
6. `projects/_template.html` first, then each case study from it.
7. Re-run `npm run build` and confirm every `copy:` key still resolves with no warnings.
