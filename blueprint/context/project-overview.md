# my-website - Project Overview

<!-- blueprint:source-hash 914a7fddba047283e4bb1234714d783090feedb096cd56c87e979c320efb599e -->

> A personal portfolio website for showcasing projects and skills to recruiters,
> with a private admin area for managing project content without redeploying.

## Problem

Recruiters and hiring managers need to assess a candidate's capabilities quickly
and find a way to get in touch. A personal portfolio site solves this by
presenting projects and skills in a fast-scanning format, with a low-friction
contact path. Managing project content today would otherwise require a
redeploy for every edit; a private admin area removes that friction.

## Users

- **Recruiters and hiring managers (public, primary)** - need fast scanning,
  clear proof of skills, and an easy path to contact.
- **Site owner (private, secondary)** - accesses a hidden admin login to
  create and edit projects without touching code or redeploying.

## Features

1. **Site shell** - single-page scroll layout with Home/About/Contact sections
   and anchor-linked nav.
2. **Projects grid & detail pages** - card grid embedded in the scroll flow;
   each card links to a dedicated `/projects/[slug]` detail page. Uses
   placeholder data until feature 5 wires up storage.
3. **Resume download** - downloadable PDF link.
8. **SEO & real bio content** - real About-section bio drawn from the site
   owner's resume, plus metadata, Open Graph tags, JSON-LD Person structured
   data, `sitemap.xml`, and `robots.txt`, so search results surface for name
   and role searches (e.g. "Ardy Ubanos", "MSCS Professor", "AI Developer",
   "Python Developer" + Philippines).
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
- `role` (string) - the site owner's role on the project
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

Not monetizing. Vercel's Hobby tier (free) is non-commercial only, which is
consistent with this project having no revenue plan.

## UI/UX

- **Tone** - dark, moody, high-contrast; minimalist but distinctive
- **Motion** - subtle fade/slide-in animations on scroll; restrained, not
  flashy
- **Navigation** - single-page scroll (Home/About/Contact) with anchor links;
  the Projects section links out to standalone detail pages
- **Admin UI** - functional/plain; does not need to match the public site's
  polish
- **About section** - real bio content (not placeholder), written to
  naturally surface role/skill keywords for search

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
- **Cost** - $0/month (Vercel Hobby + Upstash free tier), aside from minor
  one-time Claude Haiku API usage during content drafting

## Open questions

None - both plans are complete and consistent as of this generation.
