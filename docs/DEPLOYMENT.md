# Deployment

Operational reference for how this site ships. Supersedes the old `CUTOVER.md`.

## Current state (as of 2026-08-31)

- **App host:** Vercel project `dcma-site` (team `lorienwebs-projects`). Connected via Vercel's Git integration — **every push to `main` triggers a production build.** No `vercel.json`, no build workflow in the repo; build settings live in the Vercel dashboard.
- **Public domain:** `doorcountymutualaid.org` / `www` still points at **Wix** — the DNS cutover below has NOT happened. The Nuxt app is only reachable at the protected `dcma-site-*.vercel.app` URL (Vercel deployment protection / SSO).
- **Content:** content routes use ISR (`routeRules: { …: { isr: 60 } }` in `nuxt.config.ts`), so a Studio publish shows up on the live site within ~a minute — no rebuild needed. It must be `isr`, not `swr` — this Nitro version's Vercel preset silently ignores a top-level `swr` route rule. Sanity Studio is hosted at `dcma.sanity.studio` and deployed separately (`cd studio && sanity deploy` — studio is npm-managed, not part of the pnpm workspace).

## Triggering a deploy

### Code changes
Merge to `main`. Vercel builds automatically.

### Content changes
A Studio publish appears on the live site within ~60s via ISR — nothing to do. To make it **instant** instead, add on-demand revalidation (a `/api/revalidate?path=…&secret=…` route hit by a Sanity webhook — Sanity admin + a secret in Vercel env, no Vercel dashboard access): [issue #41](https://github.com/Solus90/dcma-site/issues/41).

To **force a full rebuild** (e.g. a schema/route change that ISR won't pick up): empty commit — `git commit --allow-empty -m "chore: trigger deploy" && git push`. Every push to `main` builds.

## Environment variables (Vercel production)

- `NUXT_SANITY_PROJECT_ID` — Sanity project id (`1qb86j9s`)
- `NUXT_RESEND_API_KEY` — for the contact form (`/api/contact` → Resend)
- (build also reads `SANITY_TOKEN` / `NUXT_SANITY_WRITE_TOKEN` locally for the seed scripts; not needed at runtime)

## DNS cutover runbook — doorcountymutualaid.org (Wix → Vercel)

Not yet done. Prereqs: production deploy verified on the vercel.app URL; Resend account with the domain verified (DKIM/SPF) so the form's `from: contact@doorcountymutualaid.org` works; `NUXT_RESEND_API_KEY` set in Vercel production env.

1. Lower DNS TTL to 300s at the current DNS host ~24h before cutover.
2. Deploy to production so the prod deployment is ready.
3. In Vercel: add custom domains `doorcountymutualaid.org` + `www`; note the records it asks for.
4. At the DNS host (check whether DNS is Wix-managed; if so, move DNS to the registrar or Vercel DNS first):
   - apex A → `76.76.21.21` (or the value Vercel shows); `www` CNAME → `cname.vercel-dns.com`
   - keep MX/Google records untouched (org uses Gmail)
   - add Resend DKIM/SPF records
5. Verify HTTPS cert issued; test the pages, the `/about-us` → `/projects/full-hearts-fridge` 301, and the contact form on the live domain.
6. Keep the Wix subscription until the new site has been live and stable ~2 weeks, then cancel. Do NOT delete the Wix site immediately — it's the only content backup besides Sanity.

Post-cutover: add the production domain as a CORS origin on the Sanity project; set up the Deploy Hook + Sanity webhook from the table above.
