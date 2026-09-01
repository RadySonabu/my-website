# Fix: Deep-space astronomy background, site-wide

**Type:** Fix
**Status:** verified

## Goal

Add a deep-space/nebula-style background (stars, subtle nebula color
gradients, gentle twinkle animation) behind every section of the site,
site-wide. Coexists with the existing cream/gold hero headline and gradient
letter from the earlier restyle - the astronomy look is the backdrop, not a
replacement for that existing foreground styling.

## In scope

- A global background layer (behind `#home`, `#projects`, `#about`,
  `#contact`) with:
  - A deep-space gradient base (near-black to deep purple/blue - stays dark
    enough that existing cream/white text remains readable everywhere)
  - A scattered star field (small dots at varying size/opacity)
  - Subtle nebula-cloud color washes (soft, low-opacity purple/blue blobs)
    for atmosphere, not full coverage
  - A gentle twinkle animation on the stars (opacity pulsing, staggered,
    slow), respecting `prefers-reduced-motion: reduce` (falls back to
    static stars)
- CSS-only implementation (gradients, box-shadow-based or pseudo-element
  stars, `@keyframes` for twinkle) - no canvas, no JS, no new dependencies
- Applied as a fixed/absolute background layer so it doesn't scroll away or
  repeat oddly between sections (one continuous backdrop behind the whole
  page, not per-section)

## Out of scope

- Any change to the existing cream/gold hero headline, gradient letter, or
  the hero's own diagonal-line SVG decoration - those stay exactly as they
  are, just with a new backdrop behind them
- Interactive/parallax/cursor-reactive effects - explicitly deferred per the
  chosen "subtle twinkle" scope, not "interactive"
- Constellation line-drawings or illustrated planets/orbits - out of scope
  per the chosen "deep space / nebula" style, not "constellations & orbits"
- Any change to About/Projects/Contact foreground content or the existing
  `--muted`/`--accent` text tokens - only the backdrop changes
- A saved reference image - built from the description below since none was
  provided; iterate from feedback if the first pass doesn't match what's in
  your head

## Build loop

Build one step at a time, never the whole feature at once.

1. Plan mode lays out the step before any code.
2. The AI implements just that step.
3. It shows the diff (not full files); you read it and understand it.
4. You approve, then choose whether to commit a checkpoint or roll straight on.
   Checkpoints are optional; `/complete` makes the real feature-level commit at the end.

Never accept a step you haven't read. If a diff is too big to review, the step was too big, so split it.

## Build steps

- [x] **Step 1 - Space background tokens + nebula gradient** - Add new
  scoped CSS custom properties to `app/globals.css` for the space palette
  (a couple of deep purple/blue nebula tones, kept separate from the
  existing `--background`/`--foreground`/`--hero-*` tokens). Apply a
  fixed-position full-viewport background layer (a `::before` on `body`, or
  a dedicated wrapper div) with a radial/linear gradient blending
  near-black into the nebula tones. *Done when:* the page background shows
  a dark gradient with visible (if subtle) purple/blue tones behind all
  sections, and `npm run build` passes.
- [x] **Step 2 - Star field** - Add a scattered star layer on the same
  background element: a set of small radial dots (via `box-shadow` on a
  single pseudo-element, or repeated `radial-gradient` layers - whichever
  keeps the CSS reasonably sized) at varied positions, sizes, and opacities,
  covering the full viewport height so it's visible behind every section
  when scrolling. *Done when:* stars are visible behind at least the Home
  and About sections when scrolling, at both narrow (375px) and wide
  viewports, and `npm run build` passes.
- [x] **Step 3 - Twinkle animation** - Add a `@keyframes twinkle` opacity
  pulse applied to the star layer (staggered timing via
  `animation-delay`, slow duration - restrained per the plan's motion
  guideline), wrapped in `@media (prefers-reduced-motion: reduce)` to
  disable animation and show static stars instead. *Done when:* stars
  visibly pulse in opacity on a normal browser, and toggling
  "prefers-reduced-motion: reduce" in devtools shows static (non-animated)
  stars.

## Files / areas

- `app/globals.css` - all changes contained here (new tokens, background
  layer, star field, twinkle keyframes)
- No component/markup changes expected - if the background needs a
  dedicated wrapper element rather than a `body::before`, that's a minimal
  addition to `app/layout.tsx`, not a new component

## Data / contracts

None. Purely visual/CSS, no data or logic changes.

## Testing

No test command changes needed - this is presentational only, no logic
introduced. No `Browser tests` command is declared, so verification is
direct dev-server observation (scrolling through all sections at narrow and
wide viewports, checking the reduced-motion fallback) plus `npm run build`.

**Note on limits:** I can confirm the CSS renders without errors and that
the described elements (gradient, stars, twinkle, reduced-motion fallback)
are present in the stylesheet and DOM. I can't take a real screenshot to
judge whether the specific colors/density "look like astronomy" to your
eye in this environment - that's a visual call for you to make and iterate
on after implementation.

## Notes for the AI

- Keep contrast in mind: existing text uses `--foreground` (`#ededed`),
  `--muted` (`#8a8a8a`), and `--hero-cream` (`#f0d9a0`) - the nebula
  background must stay dark/muted enough that none of these become hard to
  read. Err toward subtle over vivid.
- Don't touch `--background`/`--foreground`/`--hero-*`/`--muted`/`--accent`
  tokens - add new ones (e.g. `--space-nebula-1`, `--space-nebula-2`) so
  this is additive, not a rework of the existing theme.
- CSS-only, no new npm dependencies - this is achievable with gradients,
  `box-shadow`, and `@keyframes` alone.
- Respect `prefers-reduced-motion: reduce` for the twinkle animation, same
  pattern already used for `.scroll-reveal` and `scroll-behavior` in this
  file.
- Keep the star count bounded (roughly 60-100 box-shadow dots, not
  hundreds) - a large `box-shadow` list is a real, if often overlooked,
  paint-performance cost.
