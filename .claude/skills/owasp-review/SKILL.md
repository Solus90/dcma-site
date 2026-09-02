---
name: owasp-review
description: >-
  Security review of staged git changes against the OWASP Top 10 (2021),
  scoped to this Nuxt 4 + Nitro + Sanity + Vercel repo. Reach for it while
  preparing a commit — especially when the staged diff touches `server/`,
  `nuxt.config.ts`, `runtimeConfig`, env handling, `package.json`,
  `scripts/`, auth, tokens/secrets, GROQ queries, `$fetch` / `fetch`
  calls, `v-html`, or the contact / revalidate endpoints. Also use it
  whenever someone asks "is this safe to commit?", wants a "security
  check" / "OWASP check" / "security review of my changes", or is about to
  land changes to request-handling or configuration code. When in doubt,
  run it — a missed access-control or SSRF bug is far more expensive than
  a two-minute review.
---

# OWASP Top 10 review of staged changes

Audit the **staged changes only** for security regressions before they land. Run it while preparing a commit that touches request handling, config, secrets, dependencies, or outbound calls — or any time someone asks whether a change is safe to land.

## What to look at

```bash
git diff --cached --stat        # what's staged
git diff --cached               # the actual changes
```

Review the diff, not the whole codebase. A pattern that already exists on `main` unchanged is out of scope unless the staged change makes it worse or newly reachable. If the user names a different target (a branch, a path, a PR), review that instead.

For anything you flag, open the surrounding file to confirm it's real — diffs lie by omission.

## The checklist

Walk every staged hunk against these. `references/checklist.md` has the detailed patterns, stack-specific gotchas, and grep hints — read it before your first review and whenever you're unsure how a category applies here.

| # | Category | The question for this repo |
|---|---|---|
| A01 | Broken Access Control | Does a new/changed `server/**` route check auth before doing work? Any IDOR (acting on an id from the request without an ownership check)? Secrets or write scopes exposed to unauthenticated callers? |
| A02 | Cryptographic Failures | Any secret, token, key, or password literal in the diff? A `.env` file staged? A secret that could reach the client bundle (`runtimeConfig.public`, `NUXT_PUBLIC_*`, a `useState`/prop)? |
| A03 | Injection | Unsanitized request input concatenated into a GROQ query, a shell command (`scripts/`), a file path, an HTML string (`v-html`), or a URL. String-built GROQ instead of parameters. |
| A04 | Insecure Design | New request-handling with no rate limit / abuse control. A honeypot or guard that's easy to bypass. A trust boundary assumed rather than enforced. |
| A05 | Security Misconfiguration | `runtimeConfig` private value moved to `public`. Permissive CORS. Verbose errors returning internals/stack traces. Debug flags. Missing/loosened security headers. |
| A06 | Vulnerable & Outdated Components | A new dependency (or a bump) — is it needed, reputable, pinned? Run `pnpm audit` / `npm --prefix studio audit` if deps changed. |
| A07 | Identification & Auth Failures | Secret comparison with `===` instead of a constant-time check. Guessable/omitted tokens. Auth logic that fails open. |
| A08 | Software & Data Integrity Failures | A webhook handler that trusts the payload without verifying a signature (Sanity webhooks support HMAC — a bare bearer token is weaker). Unpinned CI actions. A deploy/build step pulling unverified code. |
| A09 | Logging & Monitoring Failures | `console.log`/`console.error` that prints a token, secret, full request, email, or other PII. Errors swallowed silently where a security event should be recorded. |
| A10 | Server-Side Request Forgery | `$fetch` / `fetch` / `ofetch` with a URL built from request data. Protocol-relative (`//host`) or absolute URLs slipping past a `baseURL`. Following redirects to attacker-controlled hosts. Sending our headers/tokens on an outbound request whose destination isn't fully controlled. |

## Output

Report findings most-severe first. For each:

```
[SEVERITY] <A0x> — <one line: what's wrong>
  <file>:<line>
  Why it matters: <the concrete failure — what an attacker sends, what they get>
  Fix: <specific change, not "sanitize input">
```

Severity: **Critical** (exploitable now, high impact — auth bypass, secret leak, RCE), **High** (exploitable with a precondition, or high impact / lower certainty), **Medium** (defense-in-depth gap, needs an unlikely chain), **Low / Info** (hygiene).

End with a one-line verdict:

- **CLEAR** — nothing found in the staged changes.
- **REVIEW** — only Medium/Low/Info; call out anything the committer should weigh.
- **FIX FIRST** — a Critical or High. Say so plainly and stop; don't help draft the commit until it's addressed or the user explicitly overrides.

Be specific and quiet. A review that cries wolf on framework-normal code trains people to ignore it. If the staged diff is docs, styles, copy, or test-only changes with no security surface, say "no security-relevant changes" and move on — don't manufacture findings.

## Examples

**Example 1 — clean**
Staged: a new prose section on a marketing page, a CSS token rename.
Output: `No security-relevant changes in the staged diff. **CLEAR.**`

**Example 2 — real finding** (the shape of what a good hit looks like)
Staged: a new `server/api/revalidate.post.ts` that does `$fetch(`/${body.slug}`, { baseURL: origin, headers: { 'x-token': token } })`.
Output:
```
[Critical] A10 — SSRF: outbound request target is caller-controlled, and it carries our bypass token
  server/api/revalidate.post.ts:24
  Why it matters: body.slug = "/evil.example.com" makes the path "//evil.example.com",
    which $fetch treats as a protocol-relative URL — it ignores baseURL and sends
    `x-token` (our Vercel bypass token) to evil.example.com.
  Fix: validate slug against /^[a-z0-9]+(?:-[a-z0-9]+)*$/ before building the path,
    and filter the resolved path to /^\/[a-z0-9/-]*$/ before $fetch.

FIX FIRST.
```
