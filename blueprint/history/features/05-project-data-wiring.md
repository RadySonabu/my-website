# Feature: Project data wiring

**From build-plan:** feature 5
**Status:** verified

## Goal

Replace the placeholder in-memory project array with real reads from the
Upstash Redis database (now provisioned and connected to the Vercel
project), behind the exact same `getAllProjects()`/`getProjectBySlug(slug)`
functions and `Project` type that feature 2 locked as the contract. Seed
Redis with the 3 existing placeholder projects so the grid doesn't go blank
before admin CRUD (features 6-7) exists.

## In scope

- `app/lib/redis.ts` (new) - a singleton Upstash Redis REST client using
  `KV_REST_API_URL`/`KV_REST_API_TOKEN` (the env var names Vercel's
  integration actually created - confirmed via `vercel env ls`)
- Rewrite `app/lib/projects.ts`: `getAllProjects()` and
  `getProjectBySlug(slug)` become `async`, reading from Redis instead of the
  in-memory array. Same `Project` type, same function names/signatures
  (now async) - the contract feature 2 locked
- **Redis shape (load-bearing, feature 7 must follow this):**
  - `project:{slug}` - a JSON string of one `Project` record
  - `project:index` - a JSON string of an ordered array of slugs (simpler
    than native Redis list operations for this MVP; still satisfies the
    plan's "separate index list of project IDs for ordering")
- Update every call site to `await` the now-async functions:
  `app/page.tsx`, `app/projects/[slug]/page.tsx`
  (`generateStaticParams`), `app/sitemap.ts`
- A one-off seed script (`scripts/seed-projects.mjs`, run via
  `node scripts/seed-projects.mjs`) that writes the 3 existing placeholder
  projects into Redis in the shape above, run once during this feature to
  backfill real data
- Updated `app/lib/projects.test.ts`: mock the Redis client (per
  `coding-standards.md`'s `vi.mock()` convention for external dependencies)
  and test the mapping/parsing logic, not real network calls

## Out of scope

- Admin create/edit UI (feature 7) - this feature only wires *reads*; the
  seed script is a one-time manual backfill, not the real write path
- Admin login (feature 6)
- Any change to the `Project` type's field set - still the MVP subset
  locked in feature 2 (`thumbnailUrl`, `order`, `status`,
  `createdAt`/`updatedAt` stay deferred, as decided there)
- Redis connection pooling/retry logic beyond what `@upstash/redis`'s REST
  client already provides - it's a stateless HTTP client, no persistent
  connection to manage

## Build loop

Build one step at a time, never the whole feature at once.

1. Plan mode lays out the step before any code.
2. The AI implements just that step.
3. It shows the diff (not full files); you read it and understand it.
4. You approve, then choose whether to commit a checkpoint or roll straight on.
   Checkpoints are optional; `/complete` makes the real feature-level commit at the end.

Never accept a step you haven't read. If a diff is too big to review, the step was too big, so split it.

## Build steps

- [x] **Step 1 - Redis client** - Install `@upstash/redis`. Add
  `app/lib/redis.ts` exporting a singleton `Redis` client constructed from
  `process.env.KV_REST_API_URL`/`process.env.KV_REST_API_TOKEN`. *Done
  when:* `npm run build` passes with the new dependency and unused client
  (no call sites yet).
- [x] **Step 2 - Async Redis-backed data functions, wired end to end** -
  Rewrite `app/lib/projects.ts`: `getAllProjects()` reads `project:index`
  (JSON array of slugs), then fetches each `project:{slug}` and parses it;
  `getProjectBySlug(slug)` fetches and parses one `project:{slug}` key,
  returning `undefined` if missing. Both become `async`. In the same diff,
  update every call site to match: `app/page.tsx` (`Home` becomes an
  `async` server component, `await getAllProjects()`),
  `app/projects/[slug]/page.tsx` (`generateStaticParams` becomes `async`
  and `await`s `getAllProjects()`; the page component and
  `generateMetadata` add `await` to their existing `getProjectBySlug` calls
  - they were already `async` functions, but that alone doesn't await
  anything, so the call itself needs the `await` keyword added), and
  `app/sitemap.ts` (`sitemap()` becomes `async`, `await getAllProjects()`).
  Update `app/lib/projects.test.ts` to mock `app/lib/redis.ts`'s client
  (`vi.mock`) and cover: a populated index returns all matching projects,
  an empty/missing index returns `[]`, `getProjectBySlug` returns the
  parsed project for a known slug and `undefined` for a missing key.
  *Done when:* `npm run test` passes with the rewritten tests, `npm run
  build` passes clean with no type errors, and (with Redis still empty
  pre-seed) the homepage's Projects section renders nothing and
  `/sitemap.xml` shows only the static `/` route - confirming the wiring
  is live and correctly empty-safe, with the app fully working at every
  point in this step.
- [x] **Step 3 - Seed script + backfill** - Add `scripts/seed-projects.mjs`:
  a standalone Node script (using `@upstash/redis`, reading the same
  `KV_REST_API_URL`/`KV_REST_API_TOKEN` from the environment) that writes
  the 3 placeholder projects (same content as the old in-memory array) into
  Redis in the `project:{slug}` / `project:index` shape. Run it once against
  the real (Preview-scoped) Redis instance. *Done when:* the script runs
  successfully, and the homepage's Projects section and `/projects/[slug]`
  pages now show the 3 seeded projects when hitting the real dev server -
  proving the full read path works end-to-end, not just structurally.

## Files / areas

- `app/lib/redis.ts` (new)
- `app/lib/projects.ts` - rewritten to async Redis reads
- `app/lib/projects.test.ts` - rewritten with mocked Redis
- `app/page.tsx`, `app/projects/[slug]/page.tsx`, `app/sitemap.ts` - `await`
  added at call sites
- `scripts/seed-projects.mjs` (new)

## Data / contracts

**Load-bearing, feature 7 must follow this exactly:**
- `project:{slug}` → JSON string of a `Project` record (same shape as
  feature 2's type)
- `project:index` → JSON string of an ordered `string[]` of slugs

`getAllProjects(): Promise<Project[]>` and
`getProjectBySlug(slug: string): Promise<Project | undefined>` - same names,
now async. Every existing call site is updated in this feature; no caller
is left calling the old sync signature.

## Testing

`npm run test` (Vitest) is configured. The rewritten `getAllProjects`/
`getProjectBySlug` are in-scope logic (real parsing/mapping with real edge
cases: empty index, missing key) and get unit tests with the Redis client
mocked via `vi.mock()`, per `coding-standards.md`'s stack binding for
external dependencies - no real network calls in the test suite.

The seed script (step 3) and the end-to-end "does the real Redis instance
actually return the seeded data" check are integration-level, verified by
actually running the script and observing the dev server against the real
(Preview) Redis instance - not unit-tested. No `Browser tests` command is
declared.

**Real limit, stated honestly:** the Redis instance is Preview/Production-
scoped, not Development-scoped (that's how the Vercel integration created
it) - local `npm run dev` and `npm run build` in this environment talk to
the *real* Preview Redis instance using the pulled `.env.local` values,
which is why the seed step is a genuine end-to-end check, not a mock.
There's no separate local/sandboxed Redis to test against without touching
the real data.

## Notes for the AI

- Keep the `Project` type import from `app/lib/projects.ts` unchanged -
  `app/api/contact/route.ts`, `app/lib/seo.ts`, and the project detail page
  all reference it or the data functions; don't break those signatures
  beyond adding `async`/`await`.
- `@upstash/redis`'s REST client works directly with `KV_REST_API_URL`/
  `KV_REST_API_TOKEN` (Vercel's Upstash integration uses REST-compatible
  URLs/tokens even though the var names carry the legacy `KV_` prefix from
  Vercel's now-merged KV product).
- The seed script is plain Node (`.mjs`, no TypeScript, no new build
  tooling) since it's a one-off operational script, not app code - avoid
  adding `tsx`/`ts-node` as a dependency just for this.
- Follow `coding-standards.md`: server components by default, no new
  `'use client'` boundaries needed for this feature.
