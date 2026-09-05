# Feature: Edit project

**From build-plan:** feature 7c
**Status:** verified

## Goal

A protected `/admin/dy/projects/[slug]/edit` form (route locked by 7a) that
loads an existing project's data, lets the admin update every field except
the slug, and writes the change back to Redis.

## In scope

- `app/lib/projects.ts`: add `updateProject(slug: string, project:
  Omit<Project, "slug">): Promise<void>` - overwrites `project:{slug}` with
  the merged record; no index change (slug doesn't change)
- `/admin/dy/projects/[slug]/edit`: protected page (same
  `requireAdminSession()` pattern), loads the project via
  `getProjectBySlug(slug)`, calls Next's `notFound()` for an unknown slug
  (matching the public detail page's existing convention)
- An edit form pre-filled with the project's current values: title,
  summary, description, tech stack (joined back into a comma-separated
  string for the input), role, year, live/repo URLs, featured checkbox
- **Slug is immutable in this sub-feature** - shown as read-only text, not
  an editable field. Changing a slug would desync the URL every visitor and
  every other project's potential links to it; that's a bigger, riskier
  feature than "edit a project" and isn't asked for in the plan
- A Server Action bound to the slug (via `.bind()`, not trusted from form
  data) that validates the submission with Zod and calls `updateProject()`,
  then redirects to `/admin/dy/dashboard`

## Out of scope

- Changing a project's slug - see above
- Delete - 7d's job
- Any change to the create flow or its files from 7b

## Build loop

Build one step at a time, never the whole feature at once.

1. Plan mode lays out the step before any code.
2. The AI implements just that step.
3. It shows the diff (not full files); you read it and understand it.
4. You approve, then choose whether to commit a checkpoint or roll straight on.
   Checkpoints are optional; `/complete` makes the real feature-level commit at the end.

Never accept a step you haven't read. If a diff is too big to review, the step was too big, so split it.

## Build steps

- [x] **Step 1 - updateProject + edit form schema** - Add `updateProject()`
  to `app/lib/projects.ts` and an `editProjectFormSchema` (same fields as
  `projectFormSchema` minus `slug`/`slugWasManuallyEdited`). *Done when:*
  `npm run build` passes (nothing wired to a page yet); `npm run test`
  still passes (no new tests required here - `updateProject` is a direct,
  single-call passthrough to `redis.set`, matching the same triviality as
  the already-untested `createProject`'s own Redis calls, which were
  verified live instead of unit-tested).
- [x] **Step 2 - Edit page + form + Server Action** - Add
  `app/admin/dy/projects/[slug]/edit/page.tsx` (protected, `notFound()` for
  an unknown slug, loads the project, renders `EditProjectForm` pre-filled),
  `app/admin/dy/projects/[slug]/edit/EditProjectForm.tsx` (client component,
  same field set as the create form minus title→slug auto-fill and minus
  the slug input itself - just a read-only slug display), and
  `app/admin/dy/projects/[slug]/edit/actions.ts` exporting
  `updateProjectAction(slug: string, prevState, formData)`, bound to the
  slug via `.bind(null, slug)` in the form component so the slug being
  updated always comes from the URL/page load, never from submitted form
  data. *Done when:* with a valid signed session cookie, GET-loading the
  edit page for a real seeded project (`sample-project-two`) renders the
  form pre-filled with that project's actual values (verified field-by-
  field via curl); loading an unknown slug returns a 404; loading it
  unauthenticated redirects to `/admin/dy`. The actual submit-and-persist
  path is a Server Action and, as with 7b, **cannot be verified from this
  environment** - needs your manual browser check.

## Files / areas

- `app/lib/projects.ts` - adds `updateProject()`, `editProjectFormSchema`
- `app/admin/dy/projects/[slug]/edit/page.tsx` (new)
- `app/admin/dy/projects/[slug]/edit/EditProjectForm.tsx` (new, client)
- `app/admin/dy/projects/[slug]/edit/actions.ts` (new)

## Data / contracts

No changes to the `Project` type or Redis shape. `updateProject()` only
ever overwrites an existing `project:{slug}` key - it never touches
`project:index`, since the slug (and therefore the index entry) doesn't
change in this sub-feature.

## Testing

No new unit tests beyond what's noted in step 1 (same triviality argument
as `createProject`'s Redis calls). The page-load/pre-fill/404/auth-guard
behavior is curl-verifiable and will be verified that way. The Server
Action submission itself is not curl-testable (established in feature 6,
confirmed again in 7b) - flagged as a real, not glossed-over, verification
gap that needs your manual check. No `Browser tests` command is declared.

## Notes for the AI

- Bind the slug into the Server Action via `.bind(null, slug)`, not a
  hidden form field - a hidden field could be tampered with client-side to
  target a different project's record; binding closes over the server-
  resolved value instead.
- Reuse the same unchecked-checkbox handling from 7b
  (`formData.get("featured") === "on"`).
- Reuse the same tech-stack comma-split/trim/filter-empty logic from 7b,
  and reverse it (`techStack.join(", ")`) when pre-filling the form.
- Keep the admin UI plain/functional, consistent with the create form's
  styling.
