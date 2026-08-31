# Feature: Projects grid & detail pages

**From build-plan:** feature 2
**Status:** verified

## Goal

Fill in the `#projects` section (left as an empty placeholder by feature 1)
with a responsive card grid, and give each project a standalone detail page at
`/projects/[slug]`. Uses placeholder project data for now - feature 5 swaps in
real Upstash Redis reads behind the same data-access functions this feature
defines.

## In scope

- A `Project` type and a small placeholder data set (3-4 sample projects)
  behind `getAllProjects()` / `getProjectBySlug(slug)` functions, matching the
  MVP field set from `project-overview.md`'s data model
- Card grid inside `#projects`, one card per project, responsive from 1 to
  20+ items (CSS grid auto-fill, no fixed column count)
- Each card links to `/projects/[slug]`
- `/projects/[slug]` detail page: full description, tech stack, role, year,
  live/repo links (shown only when present), and a link back to the site
- `generateStaticParams` for the placeholder slugs; an unknown slug renders
  Next's `notFound()` (404)
- Placeholder visual treatment for thumbnails (no real images yet - see Notes)

## Out of scope

- Real Upstash Redis storage - feature 5 implements it behind the same
  `getAllProjects()`/`getProjectBySlug()` functions defined here, so callers
  don't change
- Real thumbnail/screenshot images - placeholder visual only until content
  exists
- Pagination or "load more" - the plan flags this as something to *consider*
  if the grid grows large; 3-4 MVP placeholder items don't need it yet, and
  the CSS grid already scales without a fixed layout assumption. Revisit if
  a later feature needs it.
- A dedicated "Projects" nav link - feature 1 already decided the nav stays
  Home/About/Contact only, with Projects embedded in the scroll flow
- Admin create/edit (feature 7)

## Build loop

Build one step at a time, never the whole feature at once.

1. Plan mode lays out the step before any code.
2. The AI implements just that step.
3. It shows the diff (not full files); you read it and understand it.
4. You approve, then choose whether to commit a checkpoint or roll straight on.
   Checkpoints are optional; `/complete` makes the real feature-level commit at the end.

Never accept a step you haven't read. If a diff is too big to review, the step was too big, so split it.

## Build steps

- [x] **Step 1 - Project data module** - Add `app/lib/projects.ts`: a `Project`
  type (`slug`, `title`, `summary`, `description`, `techStack: string[]`,
  `role`, `year`, `liveUrl?`, `repoUrl?`, `featured`), a placeholder array of
  3-4 sample projects, `getAllProjects(): Project[]`, and
  `getProjectBySlug(slug: string): Project | undefined`. Add
  `app/lib/projects.test.ts` covering: a known slug returns the matching
  project, an unknown slug returns `undefined`. *Done when:* `npm run test`
  passes with the new tests, and `npm run build` passes.
- [x] **Step 2 - Card grid** - Add a "Projects" heading and a responsive card
  grid (CSS grid, `auto-fill`/`minmax`, no fixed column count) inside the
  `#projects` section in `app/page.tsx`, sourced from `getAllProjects()`. Each
  card shows title, summary, tech stack tags, and a placeholder thumbnail
  (see Notes), and links to `/projects/[slug]`. Wrap the section in
  `ScrollReveal` for visual consistency with About/Contact. Render nothing
  (no heading, no empty grid box) when `getAllProjects()` returns an empty
  array - feature 5 will reuse this same component with real data that could
  start empty. *Done when:* the homepage renders one card per placeholder
  project, each card's link resolves to the right slug, the grid stays
  visually sane at both a narrow (375px) and a wide viewport, and temporarily
  forcing `getAllProjects()` to return `[]` renders no heading/empty grid.
- [x] **Step 3 - Detail page** - Add `app/projects/[slug]/page.tsx` with
  `generateStaticParams()` from `getAllProjects()`, `generateMetadata()` for
  the page title, and a call to `notFound()` when `getProjectBySlug()` returns
  `undefined`. Render title, description, tech stack, role, year, and
  live/repo links (each only if the field is present on that project), plus a
  link back to `/`. *Done when:* visiting a known project's URL shows its
  full details, visiting an unknown slug returns a 404, and `npm run build`
  statically generates all placeholder project pages.

## Files / areas

- `app/lib/projects.ts` (new) - `Project` type, placeholder data,
  `getAllProjects()`, `getProjectBySlug()`
- `app/lib/projects.test.ts` (new)
- `app/page.tsx` - fills in the `#projects` section
- `app/projects/[slug]/page.tsx` (new) - detail page

## Data / contracts

**Load-bearing:** the `Project` type and the `getAllProjects()` /
`getProjectBySlug(slug)` function signatures. Feature 5 (project data wiring)
replaces this file's placeholder-array implementation with real Upstash Redis
reads behind the same two functions and the same `Project` shape, so
`app/page.tsx` and the detail page don't need to change. Field set matches the
MVP subset from `project-overview.md`: `slug`, `title`, `summary`,
`description`, `techStack`, `role`, `year`, `thumbnailUrl` (deferred - see
Notes), `liveUrl`, `repoUrl`, `featured`, `createdAt`/`updatedAt` (also
deferred - not meaningful for static placeholder data, feature 5 adds them
when records are actually created/updated).

## Testing

`npm run test` (Vitest) is configured, so in-scope logic gets tests:

- `getProjectBySlug` - known slug returns the project, unknown slug returns
  `undefined`. Written in step 1.

The grid and detail page are UI/integration surfaces (rendering, routing,
static generation) - per `coding-standards.md`'s testing scope rule, these are
verified by build output and direct browser check, not unit tests. No
`Browser tests` command is declared, so verification rides on `npm run build`
(confirms static generation and 404 handling structurally) plus manual
dev-server click-through:

- Step 2: visual check of the grid at 375px and a wide viewport, click a card.
- Step 3: visit a known slug's detail page, visit a made-up slug and confirm
  a 404, confirm the live/repo links only appear when present.

## Notes for the AI

- No real thumbnail images exist yet. Render a placeholder box (solid/gradient
  background from the existing theme tokens, project initials or a generic
  icon) rather than an `<img>`/`next/image` pointing at a path that doesn't
  exist. Don't wire up `next/image` remote patterns for this feature.
- Server components by default - the grid and detail page don't need
  `'use client'`; only reuse the existing `ScrollReveal` client component,
  don't create new client boundaries.
- Follow the existing dark theme tokens and spacing conventions from feature 1
  (`app/globals.css` `--background`/`--foreground`/`--muted`/`--accent`) -
  don't introduce new one-off colors.
- Tailwind v4 CSS-first config - no `tailwind.config.js`.
- Keep placeholder project content honest filler (e.g. clearly-fake project
  names), not real project claims - this is a data feature, not a content
  feature.
- Between step 2 and step 3, cards briefly link to a route that returns a
  Next.js 404 until step 3 lands - that's an expected transient state within
  the review loop, not a bug to fix in step 2.
