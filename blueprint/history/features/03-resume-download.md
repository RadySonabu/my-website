# Feature: Resume download

**From build-plan:** feature 3
**Status:** verified

## Goal

Add a downloadable resume PDF link to the single-page site, using the real
resume file the user provided (`Ardy-Ubanos-Freelance Resume-081226.pdf`).

## In scope

- Copy the provided PDF into `public/resume.pdf` (a stable, predictable
  filename - not the dated original name, since the site shouldn't need a
  code change every time the resume is refreshed with the same content)
- A "Resume" / "Download CV" link in the hero (`#home`) section, styled to
  match the current hero look (cream accent), that downloads the PDF
  directly rather than navigating to a viewer page

## Out of scope

- Any resume *content* editing (formatting, generating a new PDF) - the file
  is used as-is
- An in-page PDF viewer/preview - a direct download link only
- Admin-side resume upload/replacement (feature 7 is project CRUD, not this;
  replacing the resume later is a manual file swap until/unless a future
  feature asks for that)

## Build loop

Build one step at a time, never the whole feature at once.

1. Plan mode lays out the step before any code.
2. The AI implements just that step.
3. It shows the diff (not full files); you read it and understand it.
4. You approve, then choose whether to commit a checkpoint or roll straight on.
   Checkpoints are optional; `/complete` makes the real feature-level commit at the end.

Never accept a step you haven't read. If a diff is too big to review, the step was too big, so split it.

## Build steps

- [x] **Step 1 - Add resume file and download link** - Copy the provided PDF
  to `public/resume.pdf`. Add a link/button in the `#home` section (below the
  existing tagline) with `href="/resume.pdf"`, the `download` attribute, and
  `aria-label="Download resume (PDF)"`, styled consistently with the hero's
  cream/gold accent. *Done when:* `public/resume.pdf` exists, `npm run build`
  passes, and the link's `href`, `download`, and `aria-label` attributes are
  all present in the rendered HTML.

- [x] **Step 2 - Download confirmation state** - Turn the resume link into a
  small client component (`app/components/ResumeDownloadLink.tsx`) that, on
  click, briefly swaps the button text to "Downloaded ✓" (and back to
  "Download Resume" after ~2s), while still performing the real file
  download via the native `download` attribute. *Done when:* clicking the
  button changes its text to "Downloaded ✓" immediately, it reverts after
  ~2 seconds, and the PDF still downloads (the visual state change doesn't
  block or replace the native download behavior).

## Files / areas

- `public/resume.pdf` (new, binary - copied from the user-provided file)
- `app/page.tsx` - adds the download link to `#home`
- `app/components/ResumeDownloadLink.tsx` (new, client component) - button
  state swap on click

## Data / contracts

None. Static asset plus a link, no data model involved.

## Testing

No test command changes needed - this is a static asset and a link, no
logic. No `Browser tests` command is declared, so verification is `npm run
build` plus a direct check that the link's `href`/`download` attributes are
correct in the rendered markup (an actual click-through download is a
browser-only action I can't automate in this environment, but the static
`href` pointing at a real file is directly verifiable).

## Notes for the AI

- Keep the resume file at a stable path (`public/resume.pdf`) rather than
  embedding the dated original filename anywhere in code, so future resume
  updates are a file swap, not a code change.
- Use a plain `<a>` tag with `download`, not a client component - no
  interactivity needed for a direct file link.
