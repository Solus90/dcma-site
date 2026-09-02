# OWASP Top 10 (2021) — patterns for this repo

Detailed guidance per category. The stack: **Nuxt 4** (Vue 3, SSR + ISR on Vercel), **Nitro** server routes in `server/`, **Sanity** CMS (content via `@nuxtjs/sanity` at build + ISR, writes via a server-only token), **Resend** for the contact form, **Vercel** hosting. The Sanity Studio in `studio/` is a separate app.

Grep hints assume you run them against the staged diff or the touched files.

---

## A01 — Broken Access Control

The main surface is `server/api/*.post.ts` / `*.get.ts` and any `server/routes/`.

Check:
- Every route that mutates state or reads non-public data authenticates **first**, before `readBody` side effects or DB calls.
- The auth check can't be skipped by a falsy env var reading as "no auth required". Prefer: if the secret isn't configured, **fail closed** (`throw createError({ statusCode: 501 })`), never "skip the check".
- No IDOR: if the request supplies a document id / slug / key, there's an ownership or allow-list check before acting on it. `contactSubmission` is create-only from the client — nothing should let the client read or list them.
- `runtimeConfig` (private) values — `sanityWriteToken`, any `*Secret` / `*Token` — are only read server-side (`useRuntimeConfig(event)` in `server/`), never in `app/`.
- Route rules: a route that should be authenticated isn't accidentally `prerender`/`isr` (which would cache a response) — those are for public pages only.

Grep: `defineEventHandler`, `useRuntimeConfig`, `readBody`, `getRouterParam`, `createError`.

---

## A02 — Cryptographic Failures (mostly: secret exposure)

Check:
- No secret literal in any staged file: API keys, tokens, `Bearer ...`, connection strings, private keys, passwords. `.env` and `.env.*` are gitignored (except `.env.example`) — make sure a real `.env` isn't force-added and `.env.example` has only empty placeholders.
- Nothing secret crosses to the client: not in `runtimeConfig.public`, not `NUXT_PUBLIC_*`, not passed as a component prop / `useState` / injected into rendered HTML. `@nuxtjs/sanity`'s `token` option is build/server only — confirm a token isn't added to a client-reachable config.
- HTTPS assumed for all outbound calls (`https://`), no `rejectUnauthorized: false` / TLS disabling.
- The seed/patch scripts in `scripts/` read tokens from `.env` at runtime — they must not hardcode or log them.

Grep: `token`, `secret`, `key`, `password`, `Bearer`, `apiKey`, `-----BEGIN`, `NUXT_PUBLIC`, `runtimeConfig`.

---

## A03 — Injection

**GROQ (Sanity):** queries live in `app/composables/useSiteContent.ts` and `scripts/`. They must pass user input as query parameters — a `groq` tagged template with `$slug`-style placeholders bound through a params object like `{ slug }` — and never string-concatenate request/user input into the query text. A `slug` from a route param going straight into `*[slug.current == "${x}"]` is injectable.

**Command injection:** `scripts/` shell out? Anything building a command string from a variable, or `child_process` with `shell: true` + interpolation.

**Path traversal:** file reads/writes with a path segment from input (`../`), `join(dir, userValue)` without validation.

**XSS:** `v-html` anywhere — the bound value must be either a trusted constant or HTML-escaped by us first (see `app/utils/citeBookTitles.ts` for the pattern: escape the text, then insert only known markup). Sanity Portable Text rendered via a vetted serializer is fine; raw HTML from a CMS field is not. Also watch `innerHTML`, `document.write`, dynamic `<script>` `src`.

Grep: `v-html`, `innerHTML`, `groq`, `` fetch(` ``, `` $fetch(` ``, `execSync`, `exec(`, `spawn(`, `shell: true`, `join(`, `readFile`.

---

## A04 — Insecure Design

Check:
- New request endpoints have some abuse control — a rate limit, a size cap on the body, a honeypot (the contact form uses a `website` honeypot field — new forms should too), or at minimum a note that Vercel's platform limits are the only backstop.
- Guards that are trivially bypassed: a honeypot that still processes the submission, a check on a header the client fully controls, an allow-list that's actually open.
- Trust boundaries are enforced in code, not assumed ("the webhook secret means the body is safe" — no, still validate the body; see A08 / A10).

---

## A05 — Security Misconfiguration

Check:
- `nuxt.config.ts`: a value didn't move from `runtimeConfig` (private) to `runtimeConfig.public`. `routeRules` changes don't expose an API route or turn an authenticated page into a cached one.
- Errors: `server/` handlers throw `createError` with a safe `statusMessage`, not the raw error / stack / DB message. `catch (e) { return { error: e }}` leaks internals.
- CORS: if a route adds CORS headers, the origin is an explicit allow-list, not `*` (especially not `*` with credentials).
- No debug/verbose flags flipped on for production (`devtools`, source maps exposing server code, `sourcemap: true` on the server build).
- Sitemap / robots changes don't expose routes meant to be private.

Grep: `public:`, `Access-Control-Allow`, `cors`, `sourcemap`, `devtools`, `statusMessage`, `console.error(e`, `throw e`.

---

## A06 — Vulnerable & Outdated Components

Check when `package.json`, `pnpm-lock.yaml`, `studio/package.json`, or `studio/package-lock.json` are staged:
- Is each new/bumped dependency actually needed and from a reputable source? Typosquat check on unfamiliar names.
- Versions pinned (exact or `^` with a lockfile committed) — not `*` or `latest`.
- Run `pnpm audit --prod` (root) and `npm --prefix studio audit` (studio) and report anything High/Critical introduced or left unaddressed.
- A new dependency with install scripts (`postinstall`) — is it in `pnpm-workspace.yaml` `onlyBuiltDependencies` deliberately?

---

## A07 — Identification & Authentication Failures

Check:
- Secret / token comparison is **constant-time**. `if (header !== `Bearer ${secret}`)` leaks length/prefix via timing. Use `node:crypto` `timingSafeEqual` on equal-length buffers (guard the length first), or accept the small risk with a comment explaining why. (This repo's `revalidate` route currently uses `!==` — a reasonable follow-up is `timingSafeEqual`.)
- Tokens are long and random (≥ 32 bytes of entropy), not a word or a short id.
- Auth failures return **before** any work and can't fall through to the success path.
- No "remember me" / session / cookie logic added without CSRF and `Secure` + `HttpOnly` + `SameSite`.

---

## A08 — Software & Data Integrity Failures

Check:
- A new webhook handler (Sanity → our API): does it verify authenticity properly? Sanity webhooks support an **HMAC signature** (`sanity-webhook-signature` header, verifiable with `@sanity/webhook`). A shared bearer token is the weaker option — acceptable for low-risk actions if the token is strong and the action is idempotent, but flag it and note HMAC as the stronger choice.
- The handler validates the **payload shape and values** even after auth passes — never `pathsFromSlug(body.slug)` without validating `body.slug`.
- `.github/workflows/*`: actions pinned to a full commit SHA or at least a major version tag from a trusted publisher, not a moving `@main`. Secrets scoped to the job that needs them.
- No build/deploy step that `curl | sh` or pulls and executes unverified code.

---

## A09 — Security Logging & Monitoring Failures

Check:
- No `console.log` / `console.error` / logger call that includes: a token, secret, API key, `Authorization` header, full request body, email address, name, message content, IP tied to identity. `console.error('revalidate failed', err)` is usually fine; `console.error('revalidate failed', err, { token })` is not. Check what `err` might contain (a fetch error can include the request URL + headers).
- Security-relevant failures (auth rejected, signature invalid, rate limit hit) aren't silently swallowed where a log line would matter for incident response.
- Error responses to the client don't double as a logging channel that leaks internals (see A05).

---

## A10 — Server-Side Request Forgery

The highest-risk pattern in this codebase (an outbound `$fetch` that carries a privileged header).

Check any `$fetch` / `fetch` / `ofetch` / `axios` call added or changed in `server/`:
- Is the URL (or the path + `baseURL`) built from request data? If yes, the input must be validated to a strict allow-list or format **before** it's in the URL.
- **Protocol-relative bypass:** `` `/${x}` `` where `x` starts with `/` becomes `//host` — a full URL that ignores `baseURL`. Also watch `x` = `http://...`, `x` = `..%2f`, backslashes.
- Does the outbound request send any of our headers/tokens/cookies? If the destination isn't 100% controlled, it shouldn't.
- `redirect: 'follow'` (the default) can bounce to an internal address (`169.254.169.254`, `localhost`, private ranges) or an attacker host. For calls with user-influenced targets, set `redirect: 'manual'` / `redirect: 'error'`.
- Server-side image/asset fetching from a CMS URL: is the host constrained to the Sanity CDN?

Reference fix (already in `server/utils/revalidatePaths.ts`): validate the slug segment (`/^[a-z0-9]+(?:-[a-z0-9]+)*$/`), then re-check the assembled path (`/^\/[a-z0-9/-]*$/`) at the call site.
