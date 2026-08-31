# Feature: Site shell

**From build-plan:** feature 1
**Status:** verified

## Goal

Replace the create-next-app starter page with the real single-page scroll
layout: a sticky nav with Home/About/Contact anchor links, and the three
sections themselves, styled to the plan's dark/moody/minimalist tone with
restrained scroll-in motion. This is the frame every later feature (projects
grid, resume link, contact form, admin) slots into.

## In scope

- Dark-first theme tokens in `app/globals.css` matching "dark, moody,
  high-contrast, minimalist" (single dark palette; no light/dark toggle - the
  plan doesn't ask for one, and coding-standards' "dark mode first, light mode
  as option" is satisfied by dark being the only mode for now)
- Sticky nav with Home/About/Contact anchor links, smooth-scrolling
- Home, About, Contact section shells with placeholder copy, each targetable
  by its nav anchor (`#home`, `#about`, `#contact`)
- Subtle fade/slide-in-on-scroll effect for sections, respecting
  `prefers-reduced-motion`
- Updated page `<title>`/metadata (currently still "Create Next App")

## Out of scope

- Projects grid and detail pages (feature 2)
- Resume download link (feature 3)
- Working contact form - the Contact section here is a placeholder heading
  only; the real form UI and backend land in feature 4
- Any Redis, admin, or auth code (features 5-7)
- Active-nav-link-on-scroll highlighting - a nice-to-have, not asked for in
  the plan; can be added later without touching this feature's contract

## Build loop

Build one step at a time, never the whole feature at once.

1. Plan mode lays out the step before any code.
2. The AI implements just that step.
3. It shows the diff (not full files); you read it and understand it.
4. You approve, then choose whether to commit a checkpoint or roll straight on.
   Checkpoints are optional; `/complete` makes the real feature-level commit at the end.

Never accept a step you haven't read. If a diff is too big to review, the step was too big, so split it.

## Build steps

- [x] **Step 1 - Dark theme tokens** - Replace the light/dark `@media` toggle
  in `app/globals.css` with a single dark palette (background, foreground, an
  accent/muted tone for secondary text) matching "dark, moody, high-contrast."
  Update `app/layout.tsx` metadata (title, description) to the real project
  name/purpose instead of the create-next-app defaults. *Done when:* the dev
  server shows a dark page background with no light-mode flash, and the
  browser tab title is no longer "Create Next App."
- [x] **Step 2 - Nav + section shells** - Replace `app/page.tsx`'s starter
  content with a sticky top nav (Home/About/Contact links to `#home`,
  `#about`, `#contact` - three links only, no hamburger menu needed; the nav
  wraps/stacks sensibly on narrow viewports since three text links don't need
  a collapse pattern) and section shells in this order: Home (`#home`) →
  an empty `<section id="projects">` placeholder with an HTML comment marking
  it as feature 2's insertion point (the plan embeds the projects grid in the
  scroll flow but only gives Home/About/Contact their own nav links, so
  Projects has no nav link of its own) → About (`#about`) → Contact
  (`#contact`). Use `<nav aria-label="Primary">` and `<main>` landmarks for
  basic a11y. Add `scroll-behavior: smooth` (respecting
  `prefers-reduced-motion: reduce`, where it should fall back to instant
  jumps). *Done when:* clicking each nav link smooth-scrolls to the matching
  section, all three real sections render with placeholder copy, the empty
  projects placeholder sits between Home and About, and the nav stays usable
  at a narrow (375px) viewport width.
- [x] **Step 3 - Scroll-in motion** - Add a small client component
  (IntersectionObserver-based) that applies a fade/slide-in class to each
  section as it enters the viewport, restrained (short duration, small
  translate), and inert when `prefers-reduced-motion: reduce` is set. *Done
  when:* scrolling the page shows each section fading/sliding in once, and
  setting reduced-motion in devtools shows sections appearing without
  animation.

## Files / areas

- `app/globals.css` - theme tokens, smooth-scroll, reduced-motion handling
- `app/layout.tsx` - metadata
- `app/page.tsx` - nav + section shells
- `app/components/ScrollReveal.tsx` (new, client component) - intersection
  observer wrapper for step 3
- `public/` - remove the unused starter SVGs (`next.svg`, `vercel.svg`,
  `file.svg`, `window.svg`, `globe.svg`) once nothing references them (check
  in step 2)

## Data / contracts

None yet. No project data, no forms with real submission in this feature.

**Load-bearing layout decision:** section order is Home → Projects
(placeholder, feature 2 fills this in) → About → Contact, with only
Home/About/Contact getting nav links. Feature 2 must build inside the
existing `#projects` section rather than inventing a new insertion point.

## Testing

No test command is declared in `AGENTS.md`, so this feature carries no test
gate. All three steps are UI-only (layout, styling, an intersection-observer
effect) - no parsers, validators, or server actions are introduced, so nothing
here falls in the test-gate's scope even if one existed.

Verify with the dev server (`npm run dev`) plus `npm run build` for each step:

- Step 1: visual check of dark background/no flash, tab title check.
- Step 2: click-through of all three nav links, confirm each section is
  present with placeholder content.
- Step 3: scroll-through observation of the fade/slide effect, plus a
  reduced-motion devtools check.

No `Browser tests` command is declared either, so this rides on direct dev
server observation and `npm run build`, not an automated harness.

## Notes for the AI

- No `src/` directory - components go under `app/components/...` per
  `coding-standards.md`.
- Server components by default; `ScrollReveal` needs `'use client'` since it
  uses `IntersectionObserver` and DOM refs - keep the client boundary as small
  as that one component, don't push `'use client'` up into `page.tsx`.
- Tailwind v4 CSS-first config: theme tokens go in `@theme` in
  `app/globals.css`, no `tailwind.config.js`.
- The plan calls for ShadCN UI as the component library (project-overview.md
  Tech stack) but this feature's shells are simple enough (nav, sections,
  headings) that no ShadCN install is required yet - first real use can wait
  for a feature that needs an actual interactive component (e.g. the contact
  form). Flagging so it's not silently skipped forever.
- Keep placeholder copy honest filler (e.g. "About" section says something
  generic), not fake project claims - it gets replaced by real content later,
  not by this feature.
