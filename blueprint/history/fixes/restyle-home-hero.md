# Fix: Restyle Home hero to match peterarendt.com reference

**Type:** Fix
**Status:** verified

## Goal

Restyle the `#home` section's headline to match the look of peterarendt.com's
hero (described by the user, no saved reference image): large bold cream/gold
headline text on the existing near-black background, one accented letter with
a pink/coral-to-cream gradient, and thin diagonal line details in a corner.
Text becomes "AI Developer" as the large headline with the user's name as a
smaller line above it. Scope is the Home hero only - no other section's look
changes.

## In scope

- New accent color tokens (cream/gold `~#f0d9a0` for headline text, a
  pink/coral gradient for one accented letter) added alongside the existing
  theme tokens in `app/globals.css` - additive, not replacing
  `--foreground`/`--accent` used elsewhere
- `#home` section markup/styling: small name line above a large "AI
  Developer" headline in the new cream/gold color
- One letter in "Developer" (the "l", matching the reference's accent
  placement) rendered with the pink/coral-to-cream gradient
- Thin diagonal line decorative elements in a corner of the hero, matching
  the reference's line detail
- Static only - no scroll-driven animation added; the existing
  `ScrollReveal`/fade-in behavior from feature 1 is untouched (Home was never
  wrapped in `ScrollReveal` since it's visible on first paint, and stays that
  way)

## Out of scope

- Any change to nav, About, Contact, or Projects grid styling - they keep
  the current dark theme (`--background`/`--foreground`/`--muted`/`--accent`)
  untouched
- Scroll-driven or interactive animation on the headline/lines
- Replacing the existing dark theme tokens - new tokens are additive, scoped
  to the hero
- A saved reference image - built from the user's description since none was
  provided; if the result doesn't match expectations, iterate from feedback
  rather than guessing further

## Build loop

Build one step at a time, never the whole feature at once.

1. Plan mode lays out the step before any code.
2. The AI implements just that step.
3. It shows the diff (not full files); you read it and understand it.
4. You approve, then choose whether to commit a checkpoint or roll straight on.
   Checkpoints are optional; `/complete` makes the real feature-level commit at the end.

Never accept a step you haven't read. If a diff is too big to review, the step was too big, so split it.

## Build steps

- [x] **Step 1 - Hero accent tokens** - Add `--hero-cream`, `--hero-gradient-start`,
  `--hero-gradient-end` custom properties to `app/globals.css` (not wired into
  `@theme`, since these are scoped to one section, not global design tokens).
  *Done when:* `npm run build` passes with the new CSS custom properties
  defined and unused (no visual change yet).
- [x] **Step 2 - Headline restyle** - In `app/page.tsx`'s `#home` section,
  replace "Your Name" / subtitle with: a small line showing the user's name,
  then a large "AI Developer" headline in `--hero-cream`, with the "l" in
  "Developer" styled using a `background-clip: text` gradient from
  `--hero-gradient-start` to `--hero-gradient-end`. *Done when:* the homepage
  hero shows the name line, "AI Developer" in cream/gold, and the "l" visibly
  rendered in the pink/coral-to-cream gradient.
- [x] **Step 3 - Diagonal line details** - Add thin diagonal line decorative
  elements (inline SVG or CSS-drawn) positioned in a corner of the `#home`
  section, matching the reference's thin-line look, purely decorative
  (`aria-hidden`). *Done when:* the lines render in the hero at both a narrow
  (375px) and a wide viewport without overlapping the headline text.

## Files / areas

- `app/globals.css` - new scoped hero accent tokens
- `app/page.tsx` - `#home` section markup/styling only

## Data / contracts

None. Purely visual, no data or type changes.

## Testing

No test command changes needed - this is presentational only, no logic
introduced. No `Browser tests` command is declared, so verification is direct
dev-server observation at both narrow and wide viewports, plus `npm run
build`.

## Notes for the AI

- Built from a text description, not a saved reference image - match the
  described elements (cream/gold headline, one gradient-accented letter, thin
  diagonal lines) rather than guessing at details not described (exact font
  weight beyond "large bold," exact line angle/position). If it's visibly off
  after review, that's expected first-pass drift to fix from feedback, not a
  spec failure.
- Keep the new hero tokens scoped/additive in `app/globals.css` - don't
  repurpose `--foreground` or `--accent`, which other sections still use for
  the existing dark theme.
- Tailwind v4 CSS-first config - no `tailwind.config.js`. Use arbitrary value
  syntax or plain CSS in `globals.css` for the gradient-text effect
  (`background-clip: text` needs a few vendor-prefixed properties).
- Decorative SVG lines get `aria-hidden="true"` since they carry no content.
