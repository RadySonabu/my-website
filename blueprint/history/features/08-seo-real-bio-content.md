# Feature: SEO & real bio content

**From build-plan:** feature 8
**Status:** verified

## Goal

Make the site discoverable for the searches it should actually win: the
site owner's name, and role searches like "AI Developer," "Python Developer,"
and computer-science-adjacent teaching roles, in the Philippines. This needs
two things together - technical SEO (metadata, structured data, sitemap,
robots.txt) and real, keyword-relevant content, since metadata alone can't
rank a page whose visible content is still placeholder filler.

## In scope

- Real About-section bio, written from the site owner's resume: Senior
  Software Engineer background (Python, backend APIs, LLM/AI work), part-time
  Faculty Lecturer (Software Analysis and Design) at LPU Manila, MS Computer
  Science (in progress) at Technological Institute of the Philippines,
  based in Metro Manila, Philippines
- Root layout metadata: real `<title>`/`<meta description>` targeting the
  actual searches (name + role + location), plus `metadataBase` so relative
  OG/sitemap URLs resolve correctly
- Open Graph + Twitter card meta tags (title, description, url, type) - no
  `og:image` yet, since no real photo/screenshot exists to use (flagged as a
  follow-up, not invented here)
- JSON-LD `Person` structured data (name, job title, location, LinkedIn URL
  from the resume, `knowsAbout` skills list)
- `app/sitemap.ts` - static routes plus one entry per project from
  `getAllProjects()`
- `app/robots.ts` - allow all, point at the sitemap

## Out of scope

- `og:image` / social preview image - needs a real photo or designed graphic
  that doesn't exist yet; a future fix can add it once one does
- Google Search Console verification, analytics, or any external SEO tooling
  submission - this feature makes the site crawlable and correctly described,
  submitting it to search engines is a manual step outside the codebase
- Claiming a job title the resume doesn't support - the resume says "Faculty
  Lecturer (Part-time)," not "Professor," so content targets that search
  phrase's *keywords* (faculty, lecturer, MS Computer Science, teaching)
  honestly rather than claiming a title that isn't accurate
- Contact form, project data wiring, admin features - unrelated to this
  feature

## Build loop

Build one step at a time, never the whole feature at once.

1. Plan mode lays out the step before any code.
2. The AI implements just that step.
3. It shows the diff (not full files); you read it and understand it.
4. You approve, then choose whether to commit a checkpoint or roll straight on.
   Checkpoints are optional; `/complete` makes the real feature-level commit at the end.

Never accept a step you haven't read. If a diff is too big to review, the step was too big, so split it.

## Build steps

- [x] **Step 1 - Real About bio** - Replace the placeholder paragraph in
  `app/page.tsx`'s `#about` section with real content drawn from the resume:
  role (Senior Software Engineer, Python/backend/AI/LLM work), teaching role
  (Faculty Lecturer, Software Analysis and Design, LPU Manila), education (MS
  Computer Science, in progress, Technological Institute of the Philippines),
  location (Metro Manila, Philippines). *Done when:* the `#about` section
  renders this real content instead of the placeholder sentence, and
  `npm run build` passes.
- [x] **Step 2 - Root metadata + metadataBase** - Update `app/layout.tsx`'s
  `metadata` export: a `<title>` and `<meta description>` that name the site
  owner and the target roles/location, `metadataBase: new URL(...)` pointing
  at the live Vercel URL (load-bearing for step 3's relative OG URLs), and
  `alternates: { canonical: "/" }` to declare the canonical URL. *Done when:*
  the rendered `<head>` shows the new title/description and a
  `<link rel="canonical">` tag, and `npm run build` passes.
- [x] **Step 3 - Open Graph + Twitter card tags** - Add `openGraph` and
  `twitter` fields to the `metadata` export in `app/layout.tsx` (title,
  description, url, type `website`, Twitter card type `summary`). No image
  field - omitted rather than pointing at a placeholder. *Done when:* the
  rendered `<head>` includes `og:title`, `og:description`, `og:url`, and
  `twitter:card` meta tags.
- [x] **Step 4 - JSON-LD Person structured data** - Add a server component
  that renders a `<script type="application/ld+json">` tag with `@type:
  "Person"` schema: name, jobTitle, description, address (locality/country),
  `sameAs` (LinkedIn URL from the resume), and `knowsAbout` (a short skills
  list: Python, AI/LLMs, Software Engineering). Render it in `app/layout.tsx`.
  *Done when:* the rendered HTML contains a valid JSON-LD `<script>` tag, and
  the JSON parses without error.
- [x] **Step 5 - Sitemap and robots.txt** - Add `app/lib/seo.ts` with a pure
  `buildSitemapEntries(baseUrl: string, projects: Project[])` function
  (static routes `/`, plus `/projects/{slug}` per project) and
  `app/lib/seo.test.ts` covering: empty projects still returns the static
  routes, and one project produces its detail-page URL. Add `app/sitemap.ts`
  and `app/robots.ts` using that function and `getAllProjects()`. *Done
  when:* `npm run test` passes with the new tests, and `npm run build` shows
  `/sitemap.xml` and `/robots.txt` as generated routes.

## Files / areas

- `app/page.tsx` - real About bio content
- `app/layout.tsx` - metadata, Open Graph/Twitter tags, JSON-LD render
- `app/components/PersonJsonLd.tsx` (new) - JSON-LD structured data component
- `app/lib/seo.ts` (new) - `buildSitemapEntries`
- `app/lib/seo.test.ts` (new)
- `app/sitemap.ts` (new)
- `app/robots.ts` (new)

## Data / contracts

- `buildSitemapEntries(baseUrl: string, projects: Project[]): { url: string }[]`
  (extend with `lastModified`/`changeFrequency` if useful, but keep the
  MVP shape minimal) - consumes the existing `Project` type from feature 2,
  no changes to that contract.

## Testing

`npm run test` (Vitest) is configured. `buildSitemapEntries` is in-scope
logic (a pure mapping function with real edge cases - empty vs. non-empty
project list) and ships with unit tests in step 5.

The About content, metadata, Open Graph tags, and JSON-LD are static
markup/content changes, not logic - per `coding-standards.md`'s testing scope
rule they're verified by direct inspection of the rendered HTML (`curl` in
this environment) plus `npm run build`, not unit tests. No `Browser tests`
command is declared.

**Note on limits:** I can confirm the meta tags, JSON-LD, sitemap, and robots
output are structurally correct (present, well-formed, parseable). I can't
confirm actual search-ranking outcomes - that depends on search engines
crawling and indexing the live site, which happens outside this session and
takes time after deploy.

## Notes for the AI

- Keep the About bio honest to the resume - don't invent achievements,
  metrics, or a job title ("Professor") the resume doesn't support.
- `metadataBase` needs a real URL - use the current live Vercel URL; note in
  the step that this should be revisited if a custom domain is added later
  (a `> TODO` is acceptable, not a blocker).
- JSON-LD render stays a server component (no interactivity needed).
- Tailwind v4 / no `src/` conventions apply as usual; this feature adds no
  new styling beyond the About paragraph's existing classes.
