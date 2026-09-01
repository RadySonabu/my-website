# Feature: Contact form

**From build-plan:** feature 4
**Status:** verified

## Goal

Fill in the `#contact` section (currently a "Contact form coming soon"
placeholder) with a real contact form: name/email/message fields, submitting
to a Next.js API route that validates input, filters spam via a honeypot
field and simple rate-limiting, then sends the message via Nodemailer over
Gmail SMTP.

## In scope

- Contact form UI in `#contact`: name, email, message fields, a hidden
  honeypot field, submit button, pending/success/error states
- `POST /api/contact` API route: input validation (Zod), honeypot check,
  simple in-memory per-IP rate limiting, then sends the message via
  Nodemailer/Gmail SMTP
- Required env vars: `GMAIL_USER`, `GMAIL_APP_PASSWORD` (2FA-enabled Gmail
  account's App Password) - documented, not committed
- Client-side handling of the three real outcomes: success, validation
  error, generic server error (including "email failed to send")

## Out of scope

- Any form of persistence (storing submissions in Redis/a database) - the
  plan only asks for an email-delivery contact form
- CAPTCHA or third-party anti-spam services - the plan specifies honeypot +
  simple rate-limiting only
- CSRF tokens or Origin-header verification - not asked for in the plan;
  a plain contact form has no authenticated session to protect
- Actually verifying a real email arrives in an inbox - I don't have Gmail
  credentials to test with in this environment (see Testing)

## Build loop

Build one step at a time, never the whole feature at once.

1. Plan mode lays out the step before any code.
2. The AI implements just that step.
3. It shows the diff (not full files); you read it and understand it.
4. You approve, then choose whether to commit a checkpoint or roll straight on.
   Checkpoints are optional; `/complete` makes the real feature-level commit at the end.

Never accept a step you haven't read. If a diff is too big to review, the step was too big, so split it.

## Build steps

- [x] **Step 1 - Contact form UI** - Client component
  (`app/components/ContactForm.tsx`) with name/email/message fields, a
  visually-hidden honeypot field (`aria-hidden`, off-screen, `tabIndex={-1}`,
  named something plausible like `website`), a submit button (disabled while
  pending, to prevent double submission), and idle/pending/success/error UI
  states. On submit, `fetch("/api/contact", { method: "POST", body:
  JSON.stringify(...) })`; no route exists yet so this fails - that's
  expected until step 2. *Done when:* the form renders in `#contact` with
  all fields, client-side `required` validation blocks empty submission, the
  submit button is disabled during the pending state, and submitting shows
  pending then an error state (since the API route doesn't exist yet).
- [x] **Step 2 - Validation schema + API route skeleton** - Install `zod`.
  Add `app/lib/contact.ts` exporting a `contactFormSchema` (Zod object:
  `name` non-empty string, `email` valid email, `message` non-empty string
  with a reasonable max length) and `app/lib/contact.test.ts` covering:
  valid input passes, missing/invalid fields fail with field-level errors.
  Add `app/api/contact/route.ts`: parse the JSON body, run it through
  `contactFormSchema.safeParse`, check the honeypot field (if filled, return
  a 200 success response without doing anything else - never reveal spam
  detection to the bot), return 400 with validation errors on failure,
  otherwise 200 with a stub "would send" response (no real email yet).
  *Done when:* `npm run test` passes with the new tests, and the form from
  step 1 now shows a success state for valid submissions and inline errors
  for invalid ones (verified via curl against the route directly, and dev
  server for the form).
- [x] **Step 3 - Rate limiting** - Add a pure `isRateLimited(store: Map<string,
  number[]>, key: string, now: number, opts: { max: number; windowMs: number
  }): boolean` function to `app/lib/contact.ts` (max 3 submissions per 15
  minutes per key) with unit tests: under the limit passes, at the limit is
  blocked, an old timestamp outside the window doesn't count. Wire it into
  `app/api/contact/route.ts` using the request's IP (from
  `x-forwarded-for`/`request.headers`) as the key and a module-level `Map`
  as the store, returning 429 when blocked. *Done when:* the new tests pass,
  and manually POSTing to `/api/contact` 4 times quickly from the same
  origin returns 429 on the 4th request.
- [x] **Step 4 - Real email sending** - Install `nodemailer` (+
  `@types/nodemailer`). In `app/api/contact/route.ts`, replace the stub
  success response: on a submission that passes validation, the honeypot
  check, and the rate limit, create a Nodemailer transporter using
  `GMAIL_USER`/`GMAIL_APP_PASSWORD` and send the message (from `GMAIL_USER`,
  to `GMAIL_USER`, subject includes the sender's name, body includes
  name/email/message) . If the env vars are missing or sending throws,
  return a 500 with a generic error message (never leak SMTP error details
  to the client). *Done when:* `npm run build` passes, and hitting the route
  with the env vars unset returns a 500 with a generic message rather than
  crashing.

## Files / areas

- `app/page.tsx` - replaces the `#contact` placeholder with `<ContactForm />`
- `app/components/ContactForm.tsx` (new, client component)
- `app/lib/contact.ts` (new) - `contactFormSchema`, `isRateLimited`
- `app/lib/contact.test.ts` (new)
- `app/api/contact/route.ts` (new)
- `.env.example` (new or updated) - documents `GMAIL_USER`,
  `GMAIL_APP_PASSWORD` by name only, no values

## Data / contracts

- `contactFormSchema` shape: `{ name: string; email: string; message: string;
  website?: string }` (`website` is the honeypot field, always empty for real
  users). No stored data model - the email itself is the only output.

## Testing

`npm run test` (Vitest) is configured. In-scope logic gets unit tests:

- `contactFormSchema` - valid input passes, missing/invalid fields
  (step 2)
- `isRateLimited` - under/at/outside-window cases (step 3)

The Nodemailer integration itself (step 4) is an external-service call - per
`coding-standards.md`'s testing scope rule this isn't unit-tested. It's
verified structurally: the route returns the right status codes, and a
missing-env-vars case returns a graceful 500 instead of crashing. No
`Browser tests` command is declared, so form UI behavior (step 1) rides on
direct dev-server interaction and `npm run build`.

**Real limit, stated honestly:** I don't have Gmail App Password credentials
in this environment, so I can't verify an email actually arrives in an
inbox. If you want that confirmed, you'll need to supply real credentials
(as env vars, never pasted into chat) and send a test submission yourself
after this feature is built, or tell me the credentials via a secure channel
outside this conversation.

## Notes for the AI

- API route, not a Server Action - this needs a specific external
  integration (Nodemailer/SMTP) and should return distinct HTTP status codes
  (400 validation, 429 rate-limited, 500 send failure), matching
  `coding-standards.md`'s guidance to use an API route for third-party
  integrations and specific status codes.
- Never log or echo back the raw `GMAIL_APP_PASSWORD` or full SMTP error
  details in any response body.
- The in-memory rate limiter resets on every serverless cold start / new
  instance on Vercel - it's a real but weak defense, matching the plan's
  "simple rate-limiting" wording, not a durable per-IP limit. Don't oversell
  it as robust in code comments or UI copy.
- Follow the existing dark theme tokens (`--background`/`--foreground`/
  `--muted`/`--accent`) for the form's styling - don't introduce new colors.
- `ContactForm` needs `'use client'` for the submit handler and state; keep
  the client boundary limited to that one component.
