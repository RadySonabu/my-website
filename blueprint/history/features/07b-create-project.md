# Feature: Create project

**From build-plan:** feature 7b
**Status:** verified

## Goal

A protected `/admin/dy/projects/new` form (route locked by 7a) that creates a
new project record in Redis: title, summary, description, tech stack, role,
year, optional live/repo URLs, and a featured flag, with a slug
auto-generated from the title (editable before submit).

## In scope

- `app/lib/slug.ts`: pure `slugify(title: string): string` (lowercase,
  non-alphanumeric → hyphens, trimmed/collapsed) and pure
  `resolveUniqueSlug(baseSlug: string, existingSlugs: string[],
  wasManuallyEdited: boolean): string | null` (auto-renumbers `-2`, `-3`,
  ... on collision when not manually edited; returns `null` - meaning
  reject - when manually edited and already taken) - both testable, no I/O
- `app/lib/projects.ts`: add `createProject(project: Project): Promise<void>`
  - writes `project:{slug}`, then read-modify-write appends the slug to
    `project:index`
- `/admin/dy/projects/new`: protected page (same `requireAdminSession()`
  pattern as the dashboard) with a client-component form:
  - Title field auto-fills a Slug field via `slugify()` as you type, but
    stops auto-filling once the user has manually edited Slug themselves
    (a common, small UX pattern - not overengineering, just correct
    behavior for an editable-but-suggested field)
  - Summary, Description, Tech Stack (comma-separated input, split into an
    array), Role, Year, Live URL (optional), Repo URL (optional), Featured
    (checkbox)
- A Server Action that: validates the submission with Zod, calls
  `resolveUniqueSlug()` against `getAllProjects()`'s slugs, returns a
  generic error if it comes back `null` (manually-edited duplicate),
  otherwise calls `createProject()` with the resolved slug and redirects to
  `/admin/dy/dashboard`

## Out of scope

- Editing an existing project - 7c's job
- Deleting a project - 7d's job
- Uploading a real thumbnail image - no `thumbnailUrl` field exists yet
  (deferred since feature 2, still deferred here)
- Rich text / markdown for the description - plain text only, matching the
  plan's "plain text fields" for admin-authored content
- A shared auth layout for `/admin/dy/*` - each protected page still calls
  `requireAdminSession()` directly, consistent with the existing dashboard
  page. Worth revisiting once there are more protected pages, but not
  required by this sub-feature.

## Build loop

Build one step at a time, never the whole feature at once.

1. Plan mode lays out the step before any code.
2. The AI implements just that step.
3. It shows the diff (not full files); you read it and understand it.
4. You approve, then choose whether to commit a checkpoint or roll straight on.
   Checkpoints are optional; `/complete` makes the real feature-level commit at the end.

Never accept a step you haven't read. If a diff is too big to review, the step was too big, so split it.

## Build steps

- [x] **Step 1 - Slugify, unique-slug resolution, createProject + tests** -
  Add `app/lib/slug.ts` (`slugify`, `resolveUniqueSlug`) with
  `app/lib/slug.test.ts` covering: `slugify` - spaces → hyphens, mixed case
  → lowercase, punctuation stripped, leading/trailing hyphens trimmed,
  consecutive spaces collapsed to one hyphen; `resolveUniqueSlug` - no
  collision returns the base slug unchanged, an auto-generated collision
  renumbers to `-2` (and `-3` if `-2` is also taken), a manually-edited
  collision returns `null`. Add `createProject()` to `app/lib/projects.ts`.
  *Done when:* `npm run test` passes with the new tests, `npm run build`
  passes (nothing wired to a page yet).
- [x] **Step 2 - Create form page + Server Action** - Add
  `app/admin/dy/projects/new/page.tsx` (protected via
  `requireAdminSession()`, redirects to `/admin/dy` if invalid - same
  pattern as the dashboard) rendering a client-component form
  (`app/admin/dy/projects/new/CreateProjectForm.tsx`) with all the fields
  above and the title→slug auto-fill behavior. Add a Zod schema for the
  input in `app/lib/projects.ts` (or a colocated file) and the Server
  Action (`app/admin/dy/projects/new/actions.ts`) that validates, dedupes
  the slug per the rule above, calls `createProject()`, and redirects.
  *Done when:* with a valid signed session cookie, GET-loading the page
  renders the form with all fields (curl-verifiable); the page redirects
  unauthenticated visitors to `/admin/dy` (curl-verifiable); calling
  `createProject()` directly (bypassing the HTTP layer, via a small
  throwaway script) with a colliding slug and confirming
  `getAllProjects()` reflects it proves the Redis write and dedupe-adjacent
  logic works. The actual browser form submission - typing a title,
  watching the slug auto-fill, submitting, landing back on the dashboard
  with the new project listed - is a Server Action and **cannot be
  verified from this environment** (established in feature 6); that full
  path needs your manual check.

## Files / areas

- `app/lib/slug.ts` (new), `app/lib/slug.test.ts` (new)
- `app/lib/projects.ts` - adds `createProject()`
- `app/admin/dy/projects/new/page.tsx` (new)
- `app/admin/dy/projects/new/CreateProjectForm.tsx` (new, client component)
- `app/admin/dy/projects/new/actions.ts` (new)

## Data / contracts

No changes to the `Project` type or the `project:{slug}`/`project:index`
Redis shape locked in feature 5 - `createProject()` writes exactly that
shape. The manual-slug-vs-auto-slug distinction (renumber only when
auto-generated) is internal to this sub-feature's Server Action, not a
contract anything else depends on.

## Testing

`npm run test` (Vitest) is configured. `slugify` and `resolveUniqueSlug` are
in-scope logic (pure, real edge cases - including the collision/renumbering
rule, the actual meaningful logic in this sub-feature) and ship with unit
tests in step 1. The Zod schema (field validation) is also logic-bearing;
if the review reveals meaningful edge cases beyond "required field
missing," a focused test is added then - noted here rather than silently
skipped.

The form UI, slug auto-fill behavior, and the Server Action's own wiring
(calling the already-tested functions in the right order and redirecting)
are integration-level - per `coding-standards.md`'s testing scope rule
these are UI/integration surfaces, not unit-tested. **Real limit, stated
honestly:** this sub-feature's create path is a Server Action, which
(established in feature 6) I cannot drive via curl - no action ID, no
form submission, no redirect to observe. I'll verify: the page renders and
its auth guard works (both curl-testable GETs), and that `createProject()`
plus `resolveUniqueSlug()` work correctly in isolation (via a throwaway
script and/or the unit tests). The full click-through - fill form, submit,
see the new project on the dashboard and the public site - is **not
verified by me** and needs your manual browser check. No `Browser tests`
command is declared, so there's no automated substitute for that gap
either.

## Notes for the AI

- `CreateProjectForm` needs `'use client'` for the title→slug interactivity
  and `useActionState`. Keep the auth check and Server Action definition
  server-side (`page.tsx` and `actions.ts`).
- Reuse the existing dark theme tokens; admin UI stays "functional/plain"
  per `coding-standards.md`, not styled to match the public site's polish.
- Tech stack input: split the comma-separated string on `,`, `trim()` each
  entry, and filter out empty strings (a trailing comma or double comma
  shouldn't produce blank tags).
- Featured checkbox: an unchecked HTML checkbox sends **no field at all**
  in `FormData`, not `"false"` - read it as `formData.get("featured") ===
  "on"` (or equivalent presence check), not by parsing a boolean string.
- The slug collision check reads all projects via `getAllProjects()` -
  fine at this project's expected scale (a personal portfolio, not
  thousands of records); don't add a dedicated index-scan optimization for
  this MVP.
