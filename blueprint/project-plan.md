# Project Plan

## 1. Problem
Create a company portfolio website for Ubanox, an AI solutions company, to showcase projects/case studies and services so prospective clients (businesses and individuals) can quickly assess capability and get in touch. Includes a private admin area to manage project content without redeploying.

## 2. Users
- **Primary (public)**: Businesses and individuals seeking AI solutions — need fast scanning, clear proof of capability, easy path to contact.
- **Secondary (private)**: Company admin — via a hidden admin login to create/edit projects.

## 3. Features (MVP)
- **Single-page scroll site** — Home / About / Contact as sections on one page, anchor-linked nav
- **Projects section** — card grid embedded in the scroll flow; each card links out to a dedicated project detail page (`/projects/[slug]`)
  - Grid must scale gracefully from 1 project up to 20+ (no hardcoded layout assumptions; consider pagination or "load more" if it grows large)
- **SEO & discoverability** — metadata, structured data, and real company content so search results surface for company and service searches (e.g. "Ubanox", "AI solutions company", "AI development", "Philippines")
- **Contact** — contact form section (part of the single-page scroll)
- **Admin page (secret route)**
  - Login: password-based, bcrypt-hashed, compared server-side
  - Create/edit/delete projects (plain text fields)
  - Not publicly linked; accessed via a direct URL known only to the company admin

**Retired:** Resume/CV download - removed from the hero along with the personal name and LinkedIn link now that the site represents the company rather than an individual. No longer part of the feature set.

## 4. Data
**Storage**: Upstash Redis (via Vercel Marketplace) — project records stored as JSON under key `project:{id}`, plus an index list of project IDs for ordering. No fixed schema required (fields can be added later without migrating old records).

**Project record fields:**

| Field | Type | Notes |
|---|---|---|
| `id` / `slug` | string | Unique identifier, used in URL (`/projects/my-project`) |
| `title` | string | Project name |
| `summary` | string | One-liner for the card grid |
| `description` | string | Fuller write-up for detail page (drafted via Claude Haiku) |
| `techStack` | array | e.g. `["Next.js", "Postgres", "Tailwind"]` |
| `role` | string | The company's role on the project (e.g. "Full-stack developer") |
| `year` / `dateCompleted` | string/date | For sorting/context |
| `thumbnailUrl` | string | Card grid image |
| `images` | array | *(optional, post-MVP)* additional screenshots |
| `liveUrl` | string | Link to live demo/site, if any |
| `repoUrl` | string | Link to GitHub repo, if public |
| `featured` | boolean | Pin standout projects to top of grid |
| `order` | number | *(optional, post-MVP)* manual sort control |
| `status` | string | *(optional, post-MVP)* `"published"` \| `"draft"` |
| `createdAt` / `updatedAt` | timestamp | Auto-managed, not admin-edited |

**MVP scope**: `id/slug`, `title`, `summary`, `description`, `techStack`, `role`, `year`, `thumbnailUrl`, `liveUrl`, `repoUrl`, `featured`, `createdAt`/`updatedAt`. `images`, `order`, and `status` can be added later without a migration.

## 5. Tech
- **Framework**: Next.js
- **UI**: ShadCN UI
- **Storage**: Upstash Redis (free tier)
- **Auth (admin)**: bcrypt password hash, compared server-side on login via a server action/API route; session via signed cookie
- **Content generation**: Claude Haiku — drafts project descriptions and page copy
- **Contact form backend**: Nodemailer + Gmail SMTP via a Next.js API route
  - Google App Password (2FA-enabled Gmail account) stored as env var
  - Basic spam protection (honeypot field / simple rate-limiting)

## 6. Monetize
The site itself doesn't process payments or subscriptions - it's a marketing/portfolio site for a company whose revenue comes from client work delivered off-site. **Open question:** Vercel's Hobby tier is licensed for non-commercial use; since Ubanox is now an actual company using this site commercially, confirm whether a paid Vercel plan is needed before/at launch rather than assuming Hobby still applies.

## 7. UI/UX
- **Tone**: Dark, moody, high-contrast — minimalist but distinctive
- **Motion**: Subtle fade/slide-in animations on scroll — restrained, not flashy
- **Navigation**: Single-page scroll (Home/About/Contact) with anchor links; Projects section links out to standalone detail pages
- **Admin UI**: Functional/plain — no need to match public site polish
- **About section**: uses real company content (not placeholder), written to naturally surface company/service keywords for search

## 8. Deployment
GitHub → Vercel auto-deploy on push to main branch. Estimated cost: $0/month (Hobby + Upstash free tier), aside from minor one-time Claude Haiku API usage during content drafting.