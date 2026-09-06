# Fix: Nav wordmark logo + hero project carousel

**Type:** Fix
**Status:** verified

## Goal

Add the "ubanox" SVG wordmark to the nav bar, and redesign the hero section
with a side-by-side layout: existing intro content plus a stacked, auto-
rotating project carousel (center card in front, glowing, with side cards
receding behind it), matching a supplied reference image.

## In scope

- `app/components/Logo.tsx` (new): the "ubanox" SVG wordmark (two paths,
  `#1E1E1E` recolored to `var(--hero-cream)` for contrast against the dark
  nav, `#F7610B` orange kept as-is)
- Nav bar (`app/page.tsx`): logo added on the left (links to `#home`,
  `aria-label="Home"`), links grouped on the right, both wrapped in a
  `max-w-4xl` centered inner container so content sits inward from the edges
  on wide/ultra-wide screens rather than spanning edge-to-edge
- `app/components/ProjectCarousel.tsx` (new, client component): reads real
  project data, renders up to 5 cards in a stacked/overlapping "coverflow"
  layout (center card enlarged with a cream glow, up to 2 cards behind each
  side, scaled down and dimmed, no filler cards when fewer than 5 projects
  exist), auto-rotates every 5.5s (paused on hover), each card links to
  `/projects/[slug]`. Card content: photo-style header placeholder, role
  (with pin icon), title, description, a stat row (year / tech count /
  featured), and a "View project" row with a circular arrow button.
  Responsive: card box stays a fixed real size and is shrunk via CSS
  `transform: scale()` (not by shrinking the box itself) so text/padding
  never overflows at smaller viewport-driven scale factors.
- Hero layout (`app/page.tsx`): side-by-side on `lg+` (intro text left,
  carousel right, vertically centered against each other via `items-center`),
  stacked (text above, carousel below) on narrower viewports
- Side padding (`sm:px-10 lg:px-16`) added consistently across the nav and
  every full-width hero/page section for a cleaner, centered margin

## Out of scope

- Favicon - separate, smaller asset job
- Any further font-family changes beyond nav-link weight (semibold)
- Real project screenshots in the carousel's photo placeholder (uses
  initials on a gradient background for now)

## Build loop

Build one step at a time, never the whole feature at once.

1. Plan mode lays out the step before any code.
2. The AI implements just that step.
3. It shows the diff (not full files); you read it and understand it.
4. You approve, then choose whether to commit a checkpoint or roll straight on.
   Checkpoints are optional; `/complete` makes the real feature-level commit at the end.

Never accept a step you haven't read. If a diff is too big to review, the step was too big, so split it.

## Build steps

- [x] **Step 1 - Logo component + nav wiring** - Add `app/components/Logo.tsx`
  with the "ubanox" SVG wordmark, sized for the nav. Wire it into `app/page.tsx`'s
  `<nav>` on the left (linking to `#home`), links grouped on the right.
  *Done when:* the nav renders the logo with correct colors, links to
  `#home`, and the existing nav links still render correctly at both a
  narrow (375px) and wide viewport.
- [x] **Step 2 - Hero project carousel** - Add
  `app/components/ProjectCarousel.tsx`, a stacked/overlapping auto-rotating
  carousel (center card enlarged + glow, up to 2 cards receding each side,
  capped at 5 visible, no filler cards), reading real project data and
  linking each card to its `/projects/[slug]` detail page. *Done when:*
  the carousel renders with no card content clipped by its own edges, cycles
  automatically and pauses on hover, and every card's content (title,
  description, stats, "View project") is fully visible at both mobile and
  desktop scale.
- [x] **Step 3 - Hero + nav layout polish** - Restructure the hero into a
  side-by-side layout on `lg+` (stacked below `lg`), fix a layout bug where
  the carousel's own container resolved to zero width (percentage width
  against an auto-sized parent), add consistent side padding across nav/hero
  sections, and inset the nav's logo/links within a `max-w-4xl` container.
  *Done when:* the text block and carousel sit with a fixed gap and never
  overlap at any tested viewport (375px through 1920px), and the page never
  triggers horizontal scroll.

## Files / areas

- `app/components/Logo.tsx` (new)
- `app/components/ProjectCarousel.tsx` (new)
- `app/page.tsx` - nav layout, hero layout, section padding

## Data / contracts

None. Purely visual; `ProjectCarousel` reads the existing `Project` type from
`app/lib/projects.ts` but adds no new fields or storage shape.

## Testing

No test command changes needed - presentational only. No `Browser tests`
command is declared, so verification is direct dev-server inspection plus
headless-browser screenshots (desktop/mobile/ultra-wide) confirming markup,
colors, layout, rotation, and absence of horizontal overflow, plus
`npm run build`.

## Notes for the AI

- Logo linking to `#home` alongside the existing "Home" text link is
  intentional (standard logo-links-to-top pattern), not a duplicate to
  remove.
- Tailwind v4 compiles `-translate-x-1/2`/`-translate-y-1/2` to the
  standalone CSS `translate` property, which composites *alongside* an
  inline `style.transform` rather than being overridden by it - don't mix
  the two on the same element for the carousel's centering math.
- The carousel's card box must stay a fixed real size (not shrunk directly)
  so responsive scaling via `transform: scale()` doesn't clip fixed-size
  text/padding; only its outer positioning container is a real px width
  (never a percentage against an auto-sized parent).
