# turcan.nl: personal site (CV + portfolio)

Multi-page static site. No build step: plain HTML + one shared `style.css`.

## Pages

```
index.html            Home: intro, skills, links into each section
experience.html       Work history + education
projects.html         Project listing (card grid)
projects/*.html       One page per project (case study)
projects/_template.html   Copy this to add a new project
events.html           Conferences / hackathons / competitions
papers.html           Publications
```

## Editing content

Prose lives in `content/*.yml`: one file per page. Edit the YAML, then run:

```bash
npm run build
```

The build script scans each `.html` file for `<!-- copy:KEY -->…<!-- /copy -->` markers
and replaces what's between them with the matching value from the yaml. Structural HTML
(role cards, project cards, nav, footer) still lives in the `.html` files. Only prose
comes from yaml. Values may contain inline HTML (`<em>`, `<a>`, `<b>`, `<span>`).

Adding a new copy field:

1. Add it to `content/<page>.yml` (e.g. `hero.tagline: "..."`).
2. Wrap the phrase in the HTML: `<p><!-- copy:index.hero.tagline -->fallback text<!-- /copy --></p>`.
3. `npm run build`: the fallback gets replaced by the yaml value.

The build is idempotent (safe to re-run) and warns about missing / unused keys.

All 15 pages are wired up: `index`, `experience`, `projects`, `events`, `papers`,
every `projects/*.html` case study, and every `projects/automation-bots/*.html`.
`<head>` tags, nav, and footer boilerplate stay in HTML.

### Add a project

1. Copy `projects/_template.html` to `projects/my-slug.html`.
2. Fill in the `[brackets]`.
3. Add a card to `projects.html` (copy an existing `<a class="project-card">` block and
   point its `href` at `projects/my-slug.html`).

### Add an event / paper

Copy an existing `<article class="event">` (in `events.html`) or `<article class="paper">`
(in `papers.html`) block and edit it. Newest first.

### Screenshots

Every image currently points at `img/placeholder.svg`. To use a real image:

1. Drop the file in `img/projects/` (e.g. `img/projects/nrf9151-cover.png`).
2. Change that image's `src`. On project pages (inside `projects/`) the path is
   `../img/projects/your-file.png`. On top-level pages it's `img/projects/your-file.png`.

### Optional bits (commented out. Uncomment when ready)

- Headshot on the home hero (`img/photo.jpg`).
- GitHub / LinkedIn links in the home hero.
- Project repo/demo links.

## Add your PDF CV

Drop your CV in the root as `cv.pdf` (that exact name). The "Download CV (PDF)" links
already point at it.

## Preview locally

```bash
npm run build
python -m http.server 8000
```

Then open http://localhost:8000.

## Deploy (GitHub Pages)

1. Create a public GitHub repo. Push all these files to the root.
2. **Settings → Pages** → Source: `Deploy from a branch` → `main` / `/ (root)`.
3. **Custom domain:** enter `turcan.nl` (the `CNAME` file already contains it).
4. At your DNS host, add these **alongside** the existing Zoho mail records
   (do **not** touch `MX` / `SPF` / `DKIM`, so email keeps working):

   Apex `turcan.nl`: four `A` records:
   ```
   185.199.108.153
   185.199.109.153
   185.199.110.153
   185.199.111.153
   ```
   Subdomain `www`: one `CNAME` → `USERNAME.github.io`.

5. Tick **Enforce HTTPS** once the certificate provisions.

Live at `https://turcan.nl`.
