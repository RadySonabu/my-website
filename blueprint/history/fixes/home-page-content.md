# Fix: Home page content additions

**Type:** Fix
**Status:** verified

## Goal

Add recruiter-scannable detail the single-page site is currently missing:
a LinkedIn link and location badge in the hero, tech-skill badges in About,
a short experience summary section, and a corrected education line (MSCS
is completed, not in progress).

## In scope

- Hero (`#home`): a LinkedIn link (icon + text) pointing at
  `https://www.linkedin.com/in/ardy-ubanos/`, and a small location badge
  ("Metro Manila, PH · Open to remote"), styled as a pill consistent with
  the existing cream-accent button
- About (`#about`): a row of tech-skill badges below the bio, using
  shields.io badge images (`img.shields.io/badge/...`) - a widely-used
  GitHub-README-style pattern, not custom-drawn icons
- A new short "Experience" section between About and Contact: 3 condensed
  role entries drawn from the resume, **no company names** (per explicit
  instruction) - role title + one short line of what the role involved
- Fix the About paragraph's education line: "completing an MS in Computer
  Science" → "MS in Computer Science (Graduate)" - the resume's own dates
  (Sep 2023 - Sep 2025) show this is finished, not in progress

## Out of scope

- Any "currently at X" / current-employer mention anywhere on the site -
  explicitly excluded
- Company names in the Experience section - explicitly excluded
- Real project thumbnails or other unrelated content - not part of this ask
- New nav links - LinkedIn/location live inside the hero, not the nav bar

## Build loop

Build one step at a time, never the whole feature at once.

1. Plan mode lays out the step before any code.
2. The AI implements just that step.
3. It shows the diff (not full files); you read it and understand it.
4. You approve, then choose whether to commit a checkpoint or roll straight on.
   Checkpoints are optional; `/complete` makes the real feature-level commit at the end.

Never accept a step you haven't read. If a diff is too big to review, the step was too big, so split it.

## Build steps

- [x] **Step 1 - Hero: LinkedIn link + location badge** - Below
  `ResumeDownloadLink` in `#home`, add a small row: a LinkedIn link (inline
  SVG icon + "LinkedIn" text, `target="_blank" rel="noopener noreferrer"`,
  `aria-label="LinkedIn profile"`) and a location pill ("Metro Manila, PH ·
  Open to remote") styled with the existing muted/border look, not the
  cream accent (so it doesn't visually compete with the resume button).
  *Done when:* the hero renders both elements, the LinkedIn link's `href`
  is exactly the provided URL and opens in a new tab, and `npm run build`
  passes.
- [x] **Step 2 - About: tech-skill badges** - Below the bio paragraph in
  `#about`, add a row of `<img>` shields.io badges (flat-square style, one
  per skill) for a curated set from the resume: Python, Django, FastAPI,
  PostgreSQL, AWS, Azure, Git, JavaScript, MongoDB, and an "AI / LLMs"
  badge. Each `<img>` gets descriptive `alt` text (the skill name) since
  badge images carry no other accessible text. *Done when:* all badges
  render (verified their `src` URLs resolve, i.e. return image content,
  not a broken-image response), and `npm run build` passes.
- [x] **Step 3 - Experience section** - Add a new `<section id="experience">`
  between `#about` and `#contact` (no nav link, matching the `#projects`
  pattern - not every section needs one), wrapped in `ScrollReveal`, with 3
  condensed entries with no company names:
  - "Senior Software Engineer" - Python APIs, LLM-powered features, backend
    infrastructure
  - "Faculty Lecturer" - Software Analysis & Design, curriculum and
    mentorship
  - "Full-Stack Developer" - Django/DRF APIs, cloud deployment, sprint
    leadership
  *Done when:* the section renders between About and Contact with all 3
  entries, none mentioning a company name, and `npm run build` passes.
- [x] **Step 4 - Education wording fix** - In `#about`'s bio paragraph,
  change "I'm completing an MS in Computer Science with research in..." to
  "I hold an MS in Computer Science (research: AI-driven recommender
  systems)" - reflects that the degree is finished per the resume's own
  dates. *Done when:* the rendered About section shows the corrected
  wording, and `npm run build` passes.

## Files / areas

- `app/page.tsx` - all four changes land here (hero, about, new experience
  section)

## Data / contracts

None. Purely content/markup, no data or logic changes.

## Testing

No test command changes needed - presentational/content only, no logic.
No `Browser tests` command is declared, so verification is direct
dev-server/curl inspection (rendered markup, badge image responses, link
hrefs) plus `npm run build`.

## Notes for the AI

- Shields.io is a public third-party image service - badges will 404 or
  render as broken images if a color/logo slug is mistyped; verify each
  badge URL actually returns an image (`content-type: image/svg+xml` or
  similar), not just that the `<img>` tag exists in markup.
- Keep the LinkedIn/location row and the skill badges visually secondary to
  the existing hero headline and About bio - this is supporting detail, not
  a redesign.
- No new client components needed - all four additions are static content
  on already-server-rendered sections.
