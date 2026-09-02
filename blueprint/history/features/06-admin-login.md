# Feature: Admin login

**From build-plan:** feature 6
**Status:** verified

## Goal

A secret, unlinked login page at `/admin/dy` that checks a bcrypt-hashed
password server-side and, on success, sets a signed session cookie granting
access to a minimal protected admin area. This is the auth gate feature 7
(admin project management) will build its CRUD UI behind.

## In scope

- `/admin/dy` - login page (password field only, no username - there's one
  admin), a Server Action that verifies the password against
  `ADMIN_PASSWORD_HASH` (bcrypt) and, on success, sets a signed session
  cookie and redirects to `/admin/dy/dashboard`
- Signed session cookie: HMAC-SHA256 over an expiry timestamp, using a
  `SESSION_SECRET` env var - not a JWT library, not a database session,
  just a small self-contained signed value (matches the plan's "session via
  signed cookie")
- `/admin/dy/dashboard` - minimal protected placeholder page ("Logged in"
  + a logout button) proving the session actually gates access - feature 7
  replaces this page's content with real project CRUD, not its auth guard
- A reusable `requireAdminSession()` server-side helper that feature 7's
  protected routes will also use - **load-bearing**
- A logout Server Action that clears the cookie and redirects to `/admin/dy`
- A password-hashing helper script the user runs locally with their own
  chosen password - I never see or ask for the plaintext password

## Out of scope

- Any project create/edit UI - feature 7's job; this feature's dashboard
  page is a bare placeholder proving auth works, nothing more
- Password reset/change flow, multi-admin support, "remember me" options -
  one admin, one password, one fixed session length
- Rate limiting login attempts - flagged during red-teaming below and added
  as an in-scope build step, not left out
- Storing the session server-side (e.g. in Redis) - the signed cookie is
  self-verifying and stateless, matching the plan's stated approach

## Build loop

Build one step at a time, never the whole feature at once.

1. Plan mode lays out the step before any code.
2. The AI implements just that step.
3. It shows the diff (not full files); you read it and understand it.
4. You approve, then choose whether to commit a checkpoint or roll straight on.
   Checkpoints are optional; `/complete` makes the real feature-level commit at the end.

Never accept a step you haven't read. If a diff is too big to review, the step was too big, so split it.

## Build steps

- [x] **Step 1 - Session sign/verify utilities** - Install `bcryptjs` (pure
  JS, no native build step - safer than `bcrypt` on Vercel's serverless
  runtime) and `@types/bcryptjs`. Add `app/lib/session.ts` exporting pure,
  testable functions: `createSessionValue(secret: string, now: number,
  maxAgeMs: number): string` (returns `${expiry}.${hmacHex}`) and
  `verifySessionValue(value: string, secret: string, now: number):
  boolean` (recomputes the HMAC, uses a timing-safe comparison, checks
  `now < expiry`). Add `app/lib/session.test.ts` covering: a freshly
  created value verifies, a tampered value fails, an expired value fails,
  a value signed with a different secret fails. *Done when:* `npm run
  test` passes with the new tests, `npm run build` passes.
- [x] **Step 2 - Password hash + session secret setup** - Add
  `scripts/hash-password.mjs`: a standalone Node script that prompts for a
  password on stdin (never as a CLI arg, so it doesn't land in shell
  history) and prints its bcrypt hash. Generate a random `SESSION_SECRET`
  value now (a config secret, not a personal one, so I can generate it) and
  give it to the user to add to Vercel's env vars alongside the
  `ADMIN_PASSWORD_HASH` they generate themselves by running the script.
  *Done when:* the script runs and prints a valid bcrypt hash for a test
  input; `npm run build` passes (nothing wired yet).
- [x] **Step 3 - Login page + Server Action + rate limiting** - Add
  `app/admin/dy/page.tsx`: a password-only form. Add a Server Action
  (`app/admin/dy/actions.ts`) that: rate-limits by IP (reusing the same
  `isRateLimited` pattern from `app/lib/contact.ts` - max 5 attempts per 15
  minutes, since this is the site's only write-access gate and deserves the
  same brute-force protection as the contact form got), compares the
  submitted password with `bcryptjs.compare()` against
  `process.env.ADMIN_PASSWORD_HASH`, and on success sets a cookie named
  `admin_session` (httpOnly, `secure` in production, `sameSite: "lax"`)
  built with `createSessionValue()` and redirects to
  `/admin/dy/dashboard`. On failure or rate-limit, shows a generic "Invalid
  password" error (no distinction between wrong password and rate-limited,
  to avoid leaking state to an attacker). *Done when:* submitting the
  correct password (tested with a locally-generated test hash) sets the
  cookie and redirects; submitting a wrong password shows the generic
  error; 6 rapid wrong attempts show the same generic error on the 6th
  (rate-limited, not distinguishable from "just wrong"); with
  `ADMIN_PASSWORD_HASH` or `SESSION_SECRET` unset (their current real
  state, before you've added them to Vercel), the action fails closed with
  the same generic error rather than throwing an unhandled exception or
  granting access.
- [x] **Step 4 - Protected dashboard + logout** - Add
  `requireAdminSession()` to `app/lib/session.ts`: reads the `admin_session`
  cookie server-side, calls `verifySessionValue()` with
  `process.env.SESSION_SECRET`, and returns whether it's valid. Add
  `app/admin/dy/dashboard/page.tsx`: calls `requireAdminSession()`, redirects
  to `/admin/dy` if invalid, otherwise renders "Logged in" and a logout
  button wired to a logout Server Action that clears the cookie and
  redirects to `/admin/dy`. *Done when:* visiting `/admin/dy/dashboard`
  directly without a valid session redirects to `/admin/dy`; after logging
  in, visiting it shows the placeholder page; clicking logout clears the
  session and redirects back to the login page, after which the dashboard
  is inaccessible again.

## Files / areas

- `app/lib/session.ts` (new) - sign/verify + `requireAdminSession()`
- `app/lib/session.test.ts` (new)
- `scripts/hash-password.mjs` (new)
- `app/admin/dy/page.tsx` (new) - login page
- `app/admin/dy/actions.ts` (new) - login + logout Server Actions
- `app/admin/dy/dashboard/page.tsx` (new) - protected placeholder

## Data / contracts

- **Load-bearing for feature 7:** `requireAdminSession()` in
  `app/lib/session.ts` is the auth guard every future admin route calls.
  Its shape (`(): Promise<boolean>` or similar, reading the cookie via
  `next/headers`) must stay stable.
- Cookie name `admin_session` and its signed-value format
  (`${expiry}.${hmacHex}`) - internal, not exposed to any other feature.
- Env vars: `ADMIN_PASSWORD_HASH` (bcrypt hash, user-generated),
  `SESSION_SECRET` (random string, generated in step 2).

## Testing

`npm run test` (Vitest) is configured. `createSessionValue`/
`verifySessionValue` are in-scope logic (real cryptographic edge cases:
tamper detection, expiry, wrong secret) and ship with unit tests in step 1.
The rate limiter reuses `isRateLimited` from feature 4, already tested
there - no need to re-test the same pure function, only that the login
action wires it correctly (verified via the live dev-server check in step
3's done-when).

The login form, Server Actions, and protected-page redirect are
integration-level (cookies, redirects, a real password compare) - per
`coding-standards.md`'s testing scope rule these are verified by direct
dev-server interaction (submitting the form, checking cookies, checking
redirects), not unit tests. No `Browser tests` command is declared.

**Real limit, stated honestly:** I'll generate a *test* bcrypt hash myself
(using the hash script with a throwaway test password) to verify the login
flow works structurally end-to-end in this environment. I will never see or
handle your real chosen admin password - you run the script yourself with
your real password and add the resulting hash to Vercel's env vars after
this feature is built and reviewed.

## Notes for the AI

- Fail closed: if `ADMIN_PASSWORD_HASH` or `SESSION_SECRET` is missing or
  empty at request time, the login action must reject the attempt with the
  same generic error used for a wrong password - never throw an unhandled
  error, and never treat a missing secret as "no password required."
- Never log, echo, or include the plaintext password anywhere - not in the
  script's own output beyond the hash, not in error messages, not in
  comments.
- `admin_session` cookie must be `httpOnly` (no client-side JS access) and
  `secure: process.env.NODE_ENV === "production"` (allows local HTTP dev,
  requires HTTPS in production).
- Use Node's `crypto.timingSafeEqual` for the HMAC comparison in
  `verifySessionValue` - a naive `===` string comparison is a timing side
  channel.
- Server Actions, not an API route, for login/logout - this is a simple
  form mutation with a redirect, matching `coding-standards.md`'s guidance
  to prefer Server Actions over API routes for that case (unlike the
  contact form, which needed specific HTTP status codes for a fetch-based
  client component).
- `app/admin/dy/dashboard/page.tsx` and any later admin routes should
  import and call `requireAdminSession()` directly (or a shared layout
  wrapping them once more admin pages exist in feature 7) rather than each
  reinventing the check.
