# Feature: Delete project

**From build-plan:** feature 7d
**Status:** verified

## Goal

A Delete action on each project row in the admin dashboard that removes the
project's record and its index entry from Redis, with a confirmation step
before it actually deletes anything. This is the last sub-feature of feature
7 - once it ships, the parent "Admin project management" item is fully done.

## In scope

- `app/lib/projects.ts`: add `deleteProject(slug: string): Promise<void>` -
  removes `project:{slug}` and removes the slug from `project:index`
- A Delete button per row on `/admin/dy/dashboard` (added in 7a), next to
  the existing Edit link
- **Confirmation via the browser's native `confirm()`** before the delete
  request is actually sent - not a dedicated confirmation page/route. This
  matches the plan's "with a confirmation step" without building a second
  page for a single yes/no prompt on an admin-only, low-traffic tool
- A Server Action bound to the slug (same `.bind(null, slug)` pattern as
  7c's edit action - never trusted from form data) that calls
  `deleteProject()` and redirects back to the dashboard so the list
  refreshes

## Out of scope

- Any "undo" or soft-delete/trash mechanism - the plan asks for delete with
  a confirmation step, not a recovery window. A real accidental-delete
  safety net (if wanted later) is a separate feature decision, not an
  assumed default
- Bulk delete / multi-select - one project at a time, matching the existing
  one-row-at-a-time Edit pattern

## Build loop

Build one step at a time, never the whole feature at once.

1. Plan mode lays out the step before any code.
2. The AI implements just that step.
3. It shows the diff (not full files); you read it and understand it.
4. You approve, then choose whether to commit a checkpoint or roll straight on.
   Checkpoints are optional; `/complete` makes the real feature-level commit at the end.

Never accept a step you haven't read. If a diff is too big to review, the step was too big, so split it.

## Build steps

- [x] **Step 1 - deleteProject()** - Add `deleteProject(slug: string):
  Promise<void>` to `app/lib/projects.ts`: `redis.del(project:{slug})`,
  then read `project:index`, filter out the slug, write it back. *Done
  when:* verified against the real Redis instance using a throwaway test
  project (create it, delete it, confirm both the key and the index entry
  are gone, matching the same live-verification approach used for
  `createProject`/`updateProject` in 7b/7c) - real seeded data untouched.
  `npm run build` passes.
- [x] **Step 2 - Delete button + Server Action, wired into the dashboard** -
  Add `app/admin/dy/dashboard/DeleteProjectButton.tsx` (client component: a
  form whose `onSubmit` calls `window.confirm(...)` and prevents submission
  if declined) and `app/admin/dy/dashboard/actions.ts` exporting
  `deleteProjectAction(slug: string, formData: FormData)` bound per-row.
  Update `app/admin/dy/dashboard/page.tsx` to render the button next to each
  row's Edit link. *Done when:* with a valid signed session cookie, the
  dashboard renders a Delete button per row (curl-verifiable); the actual
  confirm-and-submit interaction is a Server Action plus client-side
  `confirm()` and, as with every Server Action in this project, **cannot be
  verified from this environment** - needs your manual browser check.

## Files / areas

- `app/lib/projects.ts` - adds `deleteProject()`
- `app/admin/dy/dashboard/DeleteProjectButton.tsx` (new, client component)
- `app/admin/dy/dashboard/actions.ts` (new)
- `app/admin/dy/dashboard/page.tsx` - renders the new button per row

## Data / contracts

No changes to the `Project` type. `deleteProject()` is the third and final
write operation against the `project:{slug}`/`project:index` shape locked in
feature 5 (alongside `createProject`/`updateProject`).

## Testing

No new unit tests - `deleteProject()`'s logic (remove key, filter index) is
the same order of triviality as `createProject`/`updateProject`, verified
live against the real Redis instance instead, consistent with that
established precedent. The Delete button's render is curl-verifiable; the
confirm-dialog-then-Server-Action interaction is not, for the same reason
established across every Server Action in this project (feature 6, 7b, 7c).
No `Browser tests` command is declared.

## Notes for the AI

- Reuse the `.bind(null, slug)` pattern from 7c's edit action so the slug
  being deleted always comes from the server-rendered row, never from
  client-submitted data.
- `DeleteProjectButton` needs `'use client'` for the `onSubmit`/`confirm()`
  interactivity; keep everything else on the dashboard page server-side.
- Style the Delete button as a plain text link/button consistent with the
  existing Edit link and the admin UI's "functional/plain" convention - not
  a large red warning button; this is a low-traffic personal tool, not a
  consumer product needing heavy destructive-action styling.
