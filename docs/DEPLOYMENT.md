# Deployment

Operational reference for how this site ships. Supersedes the old `CUTOVER.md`.

## Current state (as of 2026-08-31)

- **App host:** Vercel project `dcma-site` (team `lorienwebs-projects`). Connected via Vercel's Git integration — **every push to `main` triggers a production build.** No `vercel.json`, no build workflow in the repo; build settings live in the Vercel dashboard.
- **Public domain:** `doorcountymutualaid.org` / `www` still points at **Wix** — the DNS cutover below has NOT happened. The Nuxt app is only reachable at the protected `dcma-site-*.vercel.app` URL (Vercel deployment protection / SSO).
- **Content:** all pages are `prerender: true` (static HTML built from Sanity at build time). Sanity Studio is hosted at `dcma.sanity.studio` and deployed separately (`cd studio && sanity deploy` — studio is npm-managed, not part of the pnpm workspace; see `IMPROVEMENTS.md`).

## Triggering a deploy

### Code changes
Merge to `main`. Vercel builds automatically.

### Content changes (the awkward one)
Because pages are prerendered, **publishing in the Studio does nothing to the deployed site until a new build runs.** Options, by access required:

| Method | Access needed | Latency | Notes |
|---|---|---|---|
| **Empty commit** — `git commit --allow-empty -m "chore: trigger deploy" && git push` | repo write | one build (~1–2 min) | What the team does today (see the old `chore/trigger-deploy` branch). Manual. |
| **Scheduled GitHub Action** pushing an empty commit on cron | repo write | up to the cron interval | Zero dashboard access. Costs commit-history noise. |
| **Vercel Deploy Hook + Sanity webhook** | Vercel project settings + Sanity admin | seconds after publish | The "right" answer. Lead dev creates one Deploy Hook URL; a Sanity webhook POSTs to it on `_type in ["update","siteSettings","homePage","aboutPage","mutualAidPage","updatesPage","fridgePage","page"]` publish. ~15 min one-time. |
| **SWR route rules** — `routeRules: { '/updates': { swr: 900 }, … }` in `nuxt.config.ts` | none (code PR) | up to the SWR window | Turns those routes from pure-static into edge-cached-dynamic (a Vercel function + Sanity CDN fetch per revalidation — negligible at this traffic). No deploy needed at all for content to refresh. |

**Recommendation:** given current access limits, ship the **SWR route rules** for the content-heavy routes (`/updates`, `/what-is-mutual-aid`, `/`, `/about`, `/projects`) so edits appear within ~15 min without any deploy. Add the **Deploy Hook + Sanity webhook** later for instant updates once someone has Vercel access.

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
