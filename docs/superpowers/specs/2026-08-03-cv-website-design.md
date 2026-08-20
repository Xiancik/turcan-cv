# Personal Site (CV + Portfolio): Design Spec

**Date:** 2026-08-03 (revised: single-page → multi-page)
**Owner:** Cristian Turcan
**Domain:** turcan.nl (email on Zoho Mail; DNS mail records must stay untouched)

## Purpose

A personal professional site serving job-hunting + portfolio audiences. Positioning:
**Embedded + Software Engineer** (firmware/hardware *and* software/backend).

## Approach

Multi-page static site. Plain HTML + one shared `style.css`. No framework, no build step,
GitHub Pages serves files directly. Rationale: zero toolchain, instant load, trivial edits.

Rejected: static-site generator (Jekyll/Hugo), because build/tooling overhead not justified for a
handful of projects. Revisit only if projects grow to ~15+.

## Visual design

Minimal & classic: typography-led, whitespace, hairline dividers, navy accent `#14213d`,
system font stack. Responsive, `prefers-color-scheme` dark support, print styles.
Accessible: semantic landmarks, skip link, focus rings, alt text.

## Site map

- **Home** (`index.html`): hero (name, title, tagline, contacts, Download CV) + short about
  + skills + cards linking into each section.
- **Experience** (`experience.html`): work history (role · company · dates · bullets) + Education.
- **Projects** (`projects.html`): responsive card grid. Each card → a detail page.
  - **Project pages** (`projects/*.html`): cover image, meta (role · dates · tech · links),
    write-up (Overview → What I built → Highlights), screenshot gallery, back-link.
  - **Template** (`projects/_template.html`): copy to add a project.
- **Events** (`events.html`): reverse-chronological list of conferences/hackathons/competitions
  attended or competed in: event · date · location · role · one-liner · optional link.
- **Papers** (`papers.html`): publication list: title · authors (own name bold) · venue · year ·
  links (PDF / DOI / code).

## Shared elements

- Top nav on every page: `Cristian Turcan · Experience · Projects · Events · Papers`, active page
  highlighted. Consistent footer. (Nav markup duplicated per page, acceptable at this scale;
  project pages use `../` relative paths.)
- Screenshots use `img/placeholder.svg` until real PNGs are dropped in `img/projects/`.

## Files

```
index.html  experience.html  projects.html  events.html  papers.html
projects/_template.html  projects/nrf9151.html  projects/aura-sense.html  projects/event-aggregator.html
style.css  img/placeholder.svg  cv.pdf  CNAME  README.md
```

## Content strategy

Seed every section with clearly labelled placeholders (`[...]`) and the user's known work
(nRF9151, aura-sense, event-aggregator) so real content drops in without touching layout.

## Deployment (separate phase)

Public GitHub repo → Settings → Pages (deploy `main` / root) → custom domain `turcan.nl`
(`CNAME` present) → at DNS host add 4 apex `A` records (GitHub Pages IPs) + `www` CNAME →
`<username>.github.io`, **alongside** the existing Zoho `MX`/`SPF`/`DKIM` (do not modify) →
enable Enforce HTTPS.

## Out of scope (YAGNI)

Blog, CMS, contact form/backend, analytics, i18n, search. Add later if needed.

## Success criteria

- Loads at `https://turcan.nl` with valid HTTPS. Nav works across all pages.
- Renders cleanly mobile + desktop, light + dark.
- Projects browsable: listing → detail pages with images and write-ups.
- Experience, Events, Papers each present in a clean, scannable format.
- Email at `cristian@turcan.nl` keeps working (mail DNS untouched).
```
