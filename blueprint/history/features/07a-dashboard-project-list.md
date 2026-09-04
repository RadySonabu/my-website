# Feature: Dashboard project list

**From build-plan:** feature 7a
**Status:** verified

## Goal

Replace the admin dashboard's "Logged in" placeholder with a real list of
projects read from Redis, each linking to its (not-yet-built) edit page, plus
a link to a (not-yet-built) create page. This is the admin's home base that
7b (create), 7c (edit), and 7d (delete) will each plug into.

## In scope

- `/admin/dy/dashboard` renders the real project list via the existing
  `getAllProjects()` - title, year, and featured status per row
- A "New project" link to `/admin/dy/projects/new` - **locks this route path
  for 7b**
- An "Edit" link per row to `/admin/dy/projects/[slug]/edit` - **locks this
  route path for 7c**
- An empty state ("No projects yet.") when the list is empty
- Logout button stays as-is

## Out of scope

- Delete action/button - that's 7d's job specifically (build-plan's original
  wording bundled "Delete actions" into this sub-feature's description; I'm
  correcting that here and in `build-plan.md`'s 7a line, since building a
  delete button with no delete action to call yet would be dead UI - it
  belongs with 7d, which builds the action and the button together)
- The create and edit pages themselves - 7b and 7c
- Any styling beyond the existing plain/functional admin look
  (`coding-standards.md`: "Admin UI - functional/plain")

**Known transient state, not a bug:** after this sub-feature merges but
before 7b/7c merge, "New project" and "Edit" will link to routes that don't
exist yet (404). This is expected incremental build behavior for an
admin-only area with no public traffic - not something to work around here.

## Build loop

Build one step at a time, never the whole feature at once.

1. Plan mode lays out the step before any code.
2. The AI implements just that step.
3. It shows the diff (not full files); you read it and understand it.
4. You approve, then choose whether to commit a checkpoint or roll straight on.
   Checkpoints are optional; `/complete` makes the real feature-level commit at the end.

Never accept a step you haven't read. If a diff is too big to review, the step was too big, so split it.

## Build steps

- [x] **Step 1 - Real project list on the dashboard** - Replace the
  "Logged in" placeholder in `app/admin/dy/dashboard/page.tsx` with:
  `getAllProjects()` results rendered as a list (title, year, a "Featured"
  tag when `featured` is true), each row linking to
  `/admin/dy/projects/${slug}/edit`, a "New project" link to
  `/admin/dy/projects/new` above the list, and an empty-state message when
  there are no projects. Keep the existing `requireAdminSession()` guard and
  logout button. *Done when:* visiting the dashboard with a valid session
  shows the real project list (verified against the real seeded Redis data
  from feature 5) with correct Edit hrefs per project, and the New-project
  link's href is correct. The empty-state message is verified by
  temporarily stubbing `getAllProjects()` to return `[]` in local code
  (the same non-destructive technique used in feature 2), observing the
  message, then reverting the stub - never by clearing the real seeded
  Redis data.

## Files / areas

- `app/admin/dy/dashboard/page.tsx` - rewritten to show the real list
- `blueprint/build-plan.md` - correct 7a's line to remove "Delete" (moved to
  7d, where the action actually lives)

## Data / contracts

**Load-bearing for 7b/7c:** route paths `/admin/dy/projects/new` (create)
and `/admin/dy/projects/[slug]/edit` (edit). No data shape changes - this
sub-feature only reads via the existing `getAllProjects()`.

## Testing

No test command changes needed - this is a read-only UI change using an
already-tested data function. No `Browser tests` command is declared, so
verification is direct dev-server interaction. Since the login Server Action
can't be curl-driven (established in feature 6), I'll construct a valid
session cookie directly using `createSessionValue()` with the local test
`SESSION_SECRET` already in `.env.local`, then curl the dashboard with that
cookie to verify the protected, real-data-rendering behavior - not just
assume it renders correctly.

## Notes for the AI

- Keep `app/admin/dy/dashboard/page.tsx` a server component - no
  interactivity needed for a read-only list.
- Reuse the existing `Project` type and `getAllProjects()` from
  `app/lib/projects.ts` - no changes to that file in this sub-feature.
- Match the existing admin visual style (plain, functional) rather than the
  public site's polish.
