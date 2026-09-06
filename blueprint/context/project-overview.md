# my-website - Project Overview

<!-- blueprint:source-hash 1c951aef7994426be50b5bc6d5699ba83f520ad646688b33b588bdbee6d90f02 -->

> A company portfolio website for Ubanox, an AI solutions company, showcasing
> projects and services to prospective clients, with a private admin area for
> managing project content without redeploying.

## Problem

Businesses and individuals evaluating an AI solutions provider need to assess
capability quickly and find a way to get in touch. A company portfolio site
solves this by presenting projects and services in a fast-scanning format,
with a low-friction contact path. Managing project content today would
otherwise require a redeploy for every edit; a private admin area removes
that friction.

## Users

- **Businesses and individuals seeking AI solutions (public, primary)** - need
  fast scanning, clear proof of capability, and an easy path to contact.
- **Company admin (private, secondary)** - accesses a hidden admin login to
  create and edit projects without touching code or redeploying.

## Features

1. **Site shell** - single-page scroll layout with Home/About/Contact sections
   and anchor-linked nav.
2. **Projects grid & detail pages** - card grid embedded in the scroll flow;
   each card links to a dedicated `/projects/[slug]` detail page. Uses
   placeholder data until feature 5 wires up storage.
3. **Resume download** *(retired)* - a downloadable PDF link that shipped for
   the personal-portfolio version of the site. Removed from the hero along
   with the personal name and LinkedIn link when the site repositioned to a
   company portfolio; no longer part of the active feature set.
8. **SEO & real bio content** - real About-section content, plus metadata,
   Open Graph tags, JSON-LD structured data, `sitemap.xml`, and `robots.txt`,
   so search results surface for company and service searches (e.g.
   "Ubanox", "AI solutions company", "AI development" + Philippines).
4. **Contact form** - form UI plus a Nodemailer/Gmail SMTP backend, with
   honeypot and basic rate-limiting spam protection.
5. **Project data wiring** - Upstash Redis storage; replaces placeholder data
   with real reads for the grid and detail pages.
6. **Admin login** - secret, unlinked route; bcrypt-hashed password checked
   server-side; session via signed cookie.
7. **Admin project management** - create/edit/delete project records (writes
   to Redis) from the admin UI, split into a dashboard list (7a), create
   form (7b), edit form (7c), and delete action (7d).

## Data model

### Project record

Stored as JSON in Upstash Redis under key `project:{id}`, plus a separate
index list of project IDs for ordering. No fixed schema - fields can be added
later without migrating existing records.

MVP fields:

- `id` / `slug` (string) - unique identifier, used in the URL
  (`/projects/my-project`). **Load-bearing**: feature 2 routes on this before
  feature 5 makes it a real Redis key.
- `title` (string) - project name
- `summary` (string) - one-liner for the card grid
- `description` (string) - fuller write-up for the detail page (can be
  drafted with Claude Haiku during admin authoring)
- `techStack` (array of string) - e.g. `["Next.js", "Postgres", "Tailwind"]`
- `role` (string) - the company's role on the project (e.g. "Full-stack
  developer")
- `year` / `dateCompleted` (string/date) - for sorting and context
- `thumbnailUrl` (string) - card grid image
- `liveUrl` (string) - link to a live demo/site, if any
- `repoUrl` (string) - link to the GitHub repo, if public
- `featured` (boolean) - pins standout projects to the top of the grid
- `createdAt` / `updatedAt` (timestamp) - auto-managed, not admin-edited

Deferred (post-MVP, no migration needed to add later): `images` (array of
additional screenshots), `order` (number, manual sort control), `status`
(`"published"` | `"draft"`).

## Tech stack

- **Next.js** - framework (App Router, no `src/` directory)
- **ShadCN UI** - component library
- **Tailwind v4** - styling, CSS-first `@theme` config
- **Upstash Redis** (Vercel Marketplace, free tier) - project record storage
- **bcrypt** - admin password hashing, checked server-side; session via
  signed cookie
- **Claude Haiku** - drafts project descriptions and page copy during admin
  authoring (not a standalone feature - an authoring convenience inside
  feature 7)
- **Nodemailer + Gmail SMTP** - contact form backend via a Next.js API route;
  Google App Password (2FA-enabled Gmail account) stored as an env var

## Monetization

The site itself doesn't process payments or subscriptions - it's a
marketing/portfolio site for a company whose revenue comes from client work
delivered off-site.

> TODO (open question) - Vercel's Hobby tier is licensed for non-commercial
> use. Now that Ubanox is an actual company using this site commercially,
> confirm whether a paid Vercel plan is needed before/at launch rather than
> assuming Hobby still applies.

## UI/UX

- **Tone** - dark, moody, high-contrast; minimalist but distinctive
- **Motion** - subtle fade/slide-in animations on scroll; restrained, not
  flashy
- **Navigation** - single-page scroll (Home/About/Contact) with anchor links;
  the Projects section links out to standalone detail pages
- **Admin UI** - functional/plain; does not need to match the public site's
  polish
- **About section** - real company content (not placeholder), written to
  naturally surface company/service keywords for search

Routes:

- `/` - single-page scroll site (Home/About/Contact, Projects grid)
- `/projects/[slug]` - project detail page
- admin route - secret, unlinked path; not documented here per the plan's
  intent to keep it undiscoverable

## Deployment

- **Host** - Vercel, GitHub-connected, auto-deploy on push to `main`
- **Status** - already live; project `my-website` under `radysonabus-projects`,
  linked to `RadySonabu/my-website`
- **Build** - `next build` (Vercel default detection, no `vercel.json` needed)
- **Env vars** (names only) - Upstash Redis connection credentials, admin
  password hash, Gmail App Password for Nodemailer SMTP, Claude Haiku API key
- **Cost** - currently $0/month (Vercel Hobby + Upstash free tier), aside from
  minor one-time Claude Haiku API usage during content drafting - pending the
  Hobby-tier commercial-use question above

## Open questions

- Vercel Hobby tier vs. commercial use (see Monetization) - needs a decision
  before/at launch.
