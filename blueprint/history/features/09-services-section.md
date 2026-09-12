# Feature: Services section

**From build-plan:** feature 9
**Status:** verified

## Goal

Add a "Services" section to the single-page scroll site listing what Ubanox
offers, so prospective clients can see the company's service lines without
having to infer them from the Projects grid alone.

## In scope

- A static, hardcoded list of services (no admin editing, no Redis storage -
  same tier as the About section), each with a title, a short paragraph
  (2-3 sentences), and an icon, in this order (AI-first, per the company's
  core positioning):
  1. **AI integration & automation** - LLM features, chatbots, agents,
     workflow automation
  2. **Custom software & web development** - Next.js/React
  3. **Data & backend systems** - APIs, databases, pipelines
  4. **Consulting & strategy**
  5. **Marketing**
  6. **UI/UX design**
  7. **Training & workshops**
- A one-line note on engagement model (end-to-end, idea to launch) somewhere
  in the section copy.
- A new `id="services"` section on `/`, positioned between About and Contact,
  visually consistent with the existing About/Contact sections (dark,
  restrained, `ScrollReveal` fade-in).
- A "Services" link added to the nav (`NAV_LINKS` in `app/page.tsx`), between
  About and Contact.
- One icon per service card via `lucide-react` (not yet a project dependency;
  added in Step 1). Chosen for pairing with the existing ShadCN UI stack and
  its small tree-shaken footprint.

## Out of scope

- Admin management of services (create/edit/delete) - static content only.
- Redis storage or any data model for services.
- Per-service detail pages - each service is a single card/entry, not a
  linked sub-page.
- Pricing or package tiers.

## Build loop

Build one step at a time, never the whole feature at once.

1. Plan mode lays out the step before any code.
2. The AI implements just that step.
3. It shows the diff (not full files); you read it and understand it.
4. You approve, then choose whether to commit a checkpoint or roll straight on.
   Checkpoints are optional; `/complete` makes the real feature-level commit at the end.

Never accept a step you haven't read. If a diff is too big to review, the step was too big, so split it.

## Build steps

- [x] **Step 1 - Services data + component** - install `lucide-react`; add a
  static services array (title, short paragraph, icon) in
  `app/lib/services.ts`, and a `ServicesSection` component in
  `app/components/ServicesSection.tsx` that renders them as a responsive grid
  of cards (icon + title + paragraph), styled consistently with the existing
  About/Contact sections. *Done when:* the component renders the 7 services
  correctly in isolation (verified via a temporary render or direct visual
  check once wired in Step 2) and `npm run build` passes.
- [x] **Step 2 - Wire into the page and nav** - render `<ServicesSection />`
  inside a new `id="services"` `<section>` in `app/page.tsx` between the About
  and Contact sections, wrapped in `ScrollReveal` like the other sections, and
  add a "Services" entry to `NAV_LINKS` between About and Contact. *Done
  when:* visiting `/` shows the Services section between About and Contact,
  the nav "Services" link scrolls to it, and `npm run build` passes.

## Files / areas

- `app/lib/services.ts` (new) - static service data.
- `app/components/ServicesSection.tsx` (new) - renders the service grid.
- `app/page.tsx` (edit) - add the section and nav link.

## Data / contracts

- `Service` type: `{ title: string; description: string; icon: LucideIcon }`.
  Static array, no persistence layer, no API route.

## Testing

- No test runner logic here worth a unit test (static data + a rendering
  component, not a parser/validator/server action) - per the Testing scope
  rule in `coding-standards.md`, this rides on the build passing and a direct
  browser check.
- Manual/browser check: load `/`, confirm the Services section appears
  between About and Contact with all 7 entries, confirm the nav "Services"
  link scrolls to it, and check both mobile and desktop widths for layout.

## Notes for the AI

- Server component by default (matches the rest of `app/page.tsx`); no
  `'use client'` needed since there's no interactivity.
- Match existing section conventions: `ScrollReveal` wrapper, `max-w-*`
  centered container, existing heading style (`text-3xl font-semibold
  tracking-tight sm:text-4xl`), dark/restrained tone per
  `blueprint/context/project-overview.md` UI/UX section.
- Keep card styling consistent with existing patterns in the codebase (e.g.
  `border border-white/10 bg-white/[0.03]` used in the contact card) rather
  than introducing a new visual language.
