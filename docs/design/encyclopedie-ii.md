# Encyclopédie II — design specification

Read this file front to back before writing any code. It is law, not suggestion.
Where it says **never**, it means never; where it says **exactly**, do not round.

The site is turcan.nl: a personal site for an embedded/firmware engineer, set as
the plate volume of an encyclopedia about one engineer. Volume I established the
material — real Diderot plates (1751-72, public domain), knocked out to white
line on cyanotype blue. Volume II keeps that material and changes the staging.

---

## 1. Where this came from, and what was deliberately not taken

The reference is [pear.inc](https://pear.inc): full-bleed neoclassical imagery on
azure, white serif display type, a hairline instrument grid with monospace
micro-labels, and scene transitions built on a halftone dot dissolve.

**Taken:** enormous image scale · the dot dissolve · the hairline grid with
micro-labels and crosshair ticks · one-sentence display typography.

**Not taken, on purpose:**

| Pear does | We do | Why |
|---|---|---|
| Single long scroll page | Six separate pages | Multi-page was chosen deliberately |
| A narrative spine (*we build it / we rank it*) | No narrative | A CV is not a pitch |
| Full-colour AI paintings | Line engravings only | Provenance is the argument |
| Bright screen azure | `--azur: #08659c` | Volume I's palette stands |

Do not reintroduce any row of the right-hand column back toward the left. In
particular: **do not add a narrative**, and **do not add colour**.

---

## 2. Invariants — the prohibitions

These hold on every page without exception. They are phrased as prohibitions
because "keep it restrained" is unenforceable and this is not.

- **Field.** `--azur` (`#08659c`) is the ground on every page. No page has a
  different background colour.
- **No colour.** The entire site is blue, chalk (`--laid #f2ebd9`) and brass
  (`--brass`). There is no photograph, no full-colour image, no third hue
  anywhere. Not in a hover state, not in a favicon, not in an error page.
- **Three faces only.** Bodoni Moda (display), EB Garamond (body), IBM Plex Mono
  (micro-labels). Bricolage Grotesque is loaded in `fonts/` and is **not** to be
  used — remove it if nothing references it.
- **`Pl. N` top-left.** Every page carries a monospace plate number in the top
  left, and a hairline grid with crosshair tick marks.
- **Brass is the only accent.** Rules, plate numbers, emphasis. Nothing else.
- **No rounded corners.** `border-radius: 0` everywhere.
- **No shadows.** No `box-shadow`, no `text-shadow`, no `filter: drop-shadow`.
- **No gradients as decoration.** Gradients exist only inside the dissolve mask.
- **One animation.** The dot dissolve is the only motion on the site. Nothing
  else fades, slides, scales, bounces, or parallaxes. No hover transitions
  beyond an instant colour swap.

If a page seems to need something outside this list, the layout is wrong. Fix
the layout.

---

## 3. The dissolve

The signature move. An image or a line of type arrives as a coarse dot screen —
reading as *printed texture*, not as a faded picture — and the dots grow until
they overlap into the thing itself. Nothing fades. Nothing moves.

### 3.1 Verified findings — read before implementing

These were measured in Chrome against `img/plates/forge.webp` on 2026-08-17.
Prototypes are in `pl1-candidates/dot-demo.html` and
`pl1-candidates/halftone-test.html`.

- **`feTile` does not work.** The standard SVG halftone recipe — `feImage` a dot
  tile, `feTile` it, `feComposite arithmetic` against source luminance,
  threshold with `feComponentTransfer discrete` — returns **pure black**.
  `feImage` alone renders (measured: 2 distinct luminance values, mean 0.4 over
  a 120×160 probe, consistent with a single 6px tile in the corner); adding
  `feTile` collapses to 1 distinct value, mean 0. **Do not spend time on this
  path.** It is the approach every tutorial recommends and it is a dead end here.
- **Canvas halftone works.** One dot per cell, radius derived from that cell's
  mean luminance. Measured at `CELL = 6`: horizontal autocorrelation peak lands
  at exactly **6px** at every stage of the ramp, and coverage moves
  `0.106 → 0.882 → 1.000` across `t = 0 → 0.5 → 1`. That is a genuine dot
  screen whose dot area tracks brightness.
- **CSS `mask-image` with a tiled `radial-gradient` works** and is free. Uniform
  dot size — texture, not true halftone — but GPU-composited.
- **`document.startViewTransition` is available.**

### 3.2 The recipe

Two tiers. Use both:

**Motion** — CSS mask, for the ramp itself, because it animates on the GPU:

```css
.plate {
  --cell: 9px;
  --r: 0.5px;                        /* animated 0.5px → 6px */
  mask-image: radial-gradient(circle at 50% 50%,
                #000 var(--r), transparent calc(var(--r) + .6px));
  mask-size: var(--cell) var(--cell);
  filter: contrast(calc(1 + var(--flat) * 1.6));   /* --flat 1 → 0 */
}
```

**Fidelity** — canvas halftone, for the resting first frame of hero plates,
where the dot screen is held long enough to be read as printing:

```js
// one dot per CELL, radius from local mean luminance
const maxR = CELL * 0.5 * Math.SQRT2;
const r = Math.min(maxR, maxR * Math.sqrt(lum) * (0.35 + 0.65 * t) + maxR * t * 0.55);
```

Render it once to an offscreen canvas and use it as a mask; do **not** redraw it
per frame at full-bleed.

### 3.3 Timing

- Plate entry: **1400ms**, `cubic-bezier(.22,1,.36,1)` (measured cubic ease-out
  in the prototype).
- Display type resolves **per word, 90ms apart**, starting *after* the plate
  lands — never simultaneously.
- The published ramp is currently too fast in its middle: coverage hits 0.88 at
  `t = 0.5`. Bias the easing so the dots stay legible as dots for the first
  ~60% of the duration. This is a tuning constant, not a rewrite.

### 3.4 Non-negotiables

- Each plate dissolves **once**, on first entry. Never on re-scroll.
- `prefers-reduced-motion: reduce` → render the final state immediately. No
  dissolve, no per-word type. This is not optional.
- The dissolve is also the **page transition**, via cross-document View
  Transitions. Same dot screen, same easing. In browsers without support it
  degrades to an ordinary page load, and that is an acceptable outcome — do not
  add a JS router to paper over it.

---

## 4. The six pages

Each page gets **one distinct structural move**. This is a deliberate departure
from the reference, which uses one law throughout — the divergence is the point,
and §2 is what holds it together. A page's move is structural: layout, scale,
what is present and what is refused. It is never a new colour, a new typeface,
or a new animation.

| Page | The move |
|---|---|
| `index.html` | **Adam.** Michelangelo's hands, cropped hard to the finger gap, full-bleed, engraved to white line on azur like every other plate. Background to the page, arriving through the dissolve. **No text overlaps the hands.** |
| `experience.html` | **One rule.** A single hairline runs the full page height; roles hang off it. The forge plate sits fixed full-bleed behind, content scrolling over it. |
| `projects.html` | **Takeover.** Asymmetric plate grid; hovering a project lets its plate fill the entire viewport behind the list. |
| `papers.html` | **Star chart.** Papers as plotted points, hairlines connecting related work. Sparse, dark, mostly empty field. |
| `events.html` | **Refusal.** No images at all. Dense typographic ledger, brass rules, austere. This page exists to break the rhythm — do not "improve" it by adding a plate. |
| `projects/*.html` | **Frontispiece.** Oversized plate, then text in two Encyclopédie columns. |

Every page keeps its `Pl. N`, its grid, and the dissolve.

---

## 5. Imagery

### 5.1 The material

Real 1751-72 Diderot plates, public domain, knocked out to white line on azur.
Existing assets live in `img/plates/`, with candidates in `plate-candidates/`
and `pl1-candidates/`. Public-domain sourcing is primary: Rijksmuseum, the Met,
Smithsonian and British Museum open-access collections.

### 5.2 Adam

Michelangelo's *Creation of Adam*, cropped to the two hands and the gap between
them. **No ceiling, no faces, no God.** The crop is what keeps the most
reproduced image in existence from reading as a cliché.

It must match the other plates: white line on azur, engraved, not a photograph
of a fresco and not a filtered painting. There is a genuine historical precedent
for this — 16th-century reproductive engravers (Giorgio Ghisi, Adamo Scultori)
made line engravings after the Sistine ceiling, and that material is in
open-access museum collections. **Look for an existing period engraving of the
Creation of Adam before generating or deriving one.** If one exists, it is
strictly better than anything we make: it is native to the material.

> Unverified: I have not yet searched the Met / British Museum collections to
> confirm a usable Creation-of-Adam engraving exists at sufficient resolution.
> Do that first.

### 5.3 Generated imagery

Permitted, but with a formal role — never as filler, never mixed casually with
real engravings at small scale.

- Generated images are **engravings**, not paintings and not photographs.
- Full-bleed only. Maximum one per page. Always delivered through the dissolve.
- Never placed beside a real 1751 plate at comparable size, where the difference
  in line quality would show.

Locked prompt suffix, appended to every generation so the set coheres:

```
18th-century French copperplate engraving, burin line, dense cross-hatching,
uniform line weight, no wash, no shading gradients, no colour, plate mark and
laid-paper tone, encyclopedic technical plate in the manner of Diderot and
d'Alembert, front elevation, even light, white background
```

If the tool supports style pinning (e.g. Midjourney `--sref`), pin it to one
existing plate in `img/plates/` and keep that reference constant across the
whole set. Consistency across images matters more than the quality of any one.

> Open: generation tool not yet chosen. The suffix above is model-agnostic;
> tighten it once the tool is known.

---

## 6. Technical constraints

- **Static HTML, no build step.** The site is a folder of `.html` files plus
  `style.css` and a small `theme.js`, deployed on GitHub Pages via `CNAME`.
  Do not introduce a bundler, a framework, a package manager, or a JS router.
- **No dependencies.** No GSAP, no Lenis, no WebGL library. Everything here is
  achievable in CSS plus a few dozen lines of vanilla JS, and the constraint is
  load-bearing: it is what stops the site drifting.
- Cross-document View Transitions for navigation; graceful plain-load fallback.
- Keep the plate payload near its current budget — the whole `img/plates/`
  directory is presently ~872KB and dropping alpha to composite by blend or tone
  is what got it there. Do not regress that.
- Contrast: chalk on azur measures 5.8:1. Any new text colour must clear WCAG AA.

---

## 7. Acceptance criteria

A page is done when all of these hold:

1. Grep the stylesheet: zero `box-shadow`, zero `text-shadow`, zero
   `border-radius` with a non-zero value.
2. Exactly three font families are referenced.
3. No colour outside blue / chalk / brass appears anywhere, including in SVG
   assets and the favicon.
4. Every plate dissolves exactly once on entry and never again.
5. `prefers-reduced-motion: reduce` renders every final state immediately, with
   no motion whatsoever.
6. The page works with JavaScript disabled: content is present and readable,
   plates are shown in their resolved state.
7. Navigating between two pages triggers the dot transition where supported and
   a plain load where not — with no layout shift in either case.
8. Nothing animates except the dissolve.

---

## 8. Assumptions carried into this document

Recorded so they can be challenged rather than silently inherited:

- Adam is rendered as an engraving matching the other plates — no colour anywhere
  on the site. (Confirmed in discussion; the earlier "one colour moment" idea was
  rejected.)
- Generated imagery is permitted, subject to §5.3.
- The six per-page moves in §4 are approved in principle; individual moves may be
  swapped, but each page keeps exactly one and §2 is never relaxed to allow it.
- No issue tracker is in use, despite what `CLAUDE.md` says. This file is the
  single source of truth.
