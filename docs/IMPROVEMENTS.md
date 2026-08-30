# Improvements backlog

Things we've decided are worth doing later but deliberately deferred. Newest context at the top of each section. Not a commitment, just a place so it doesn't get lost.

## Content model

### Structured event fields on `update`
The `/updates` agenda list currently reads `update` documents with `category == "event"` and shows the event date from `publishedAt` (a bare date, no time). Time and location are free-typed into the `summary`.

Add two optional fields to the `update` schema:
- `startAt` — datetime (so we can show a formatted time and sort multiple events in a day)
- `location` — string (so we can show it consistently and link to a map)

They stay empty on non-event posts. ~1 hour of schema + type + GROQ work, plus one Studio deploy. Alternative: a dedicated `event` document type instead of overloading `update` — cleaner separation, slightly more setup.

### CMS-editable section headings on `/updates`
"Upcoming events" and "Latest updates" are hardcoded in `app/pages/updates.vue`. Could become fields on the `updatesPage` singleton if editors want control. Low priority — they're structural labels, not content.

## Front-end

### Calendar month-grid view for events
A month grid with a day modal (list of that day's events) and a slide-in drawer (single event detail). Estimated 2–4 focused days: the grid itself is small, but a shared accessible overlay primitive (focus trap, escape, scroll-lock, reduced-motion), the two overlay UIs, and a mobile agenda-list fallback are the bulk. Depends on the structured event fields above (needs real start times). Recurring-event rules (e.g. "2nd Saturday monthly") are explicitly out of scope — create instances by hand.

### `/about#security` deep link doesn't open the section
The security section on the About page is a collapsed `<details>`. Linking to `/about#security` (which the What Is Mutual Aid page does) scrolls to it but leaves it closed. One-line fix: on mount, open the `<details>` whose `id` matches `location.hash`.

### Reading-list book covers on What Is Mutual Aid
The six books render as text-only `<details>` cards. Cover thumbnails would make the section richer. Needs the images somewhere (`public/` or Sanity assets) and a small layout change.

### Book-title mentions in "Why people need it"
The `Invisible Doctrine` / `The Color of Law` references in that paragraph are plain text — no italics or links. Editable, just unstyled.

### "Find your local mutual aid" page
Not built. For out-of-area visitors who find DCMA and want their own local network. Could be a generic `page` document (no schema change) with a prose section plus a link list. Different from the Projects page's partner-org list, which is Door County collaborators.

## Tooling / infra

### Content publishes don't reach the live site
**This is the big one.** Every content page is `prerender: true` — static HTML frozen at build time. There's no `swr`/`isr` route rule, no `vercel.json`, and no Vercel Deploy Hook / Sanity webhook in the repo (`CUTOVER.md` lists the webhook as an unfinished TODO). So editing and publishing in the Studio does **nothing** to the live site until the next Vercel deploy (i.e. the next code merge to `main`, which re-fetches all content).

Fix, pick one:
- **Vercel Deploy Hook + Sanity webhook** (recommended): create a Deploy Hook URL in the Vercel project, add a Sanity webhook that POSTs to it on document publish. "Editor publishes → site rebuilds." ~10 min, no code. Needs someone with Vercel project-settings access to make the hook, and Sanity admin to make the webhook.
- **SWR route rules** (`routeRules: { '/updates': { swr: 900 }, ... }` in `nuxt.config.ts`): content refreshes on a timer without a full rebuild. Pure code PR, no dashboard access. Adds a Sanity CDN hit per cache-miss + Vercel function invocations — negligible at this traffic.

### Studio deploy is fragile — move it to CI
Deploying the Studio (`sanity deploy` from `studio/`) has hit, in one session:
- Wrong-directory `ProjectRootNotFoundError` (must run from `studio/`, not repo root)
- `uploadSchema is not a function` — CLI newer than the `sanity` package in `studio/node_modules`; fixed by `npm install sanity@latest @sanity/cli@latest` in `studio/`
- `TypeError: Cannot read properties of null (reading 'useMemoCache')` spam during "Generating studio manifest" — `studio/node_modules/react` conflicts with the pnpm-hoisted `react-dom@19.2.7` in the root `node_modules`. Non-fatal (schema still deployed), but noisy and a sign the React versions across the workspace + `studio/` package-lock aren't pinned together.
- Build time swung from ~1.5s to ~11min depending on cache state.

The studio has its own `package-lock.json` (npm) inside a pnpm workspace — that split is probably the root of the version drift. Worth: dedupe React across the workspace, pin `sanity`/`@sanity/cli` together, and add a `.github/workflows/studio-deploy.yml` that runs `sanity deploy` on push to `main` when `studio/**` changes (needs a `SANITY_DEPLOY_TOKEN` GitHub secret). Optionally a PR check that runs `sanity schema validate` on `studio/**` changes.

### Sanity Studio build is very slow (sometimes)
Observed 688807 ms for the "Build Sanity Studio" step once; other runs finished in ~1.5s. Full Vite production build of the whole Studio toolkit, no incremental deploy. The slow runs were likely cold `npx`/dependency downloads. Moving the deploy to CI (above) makes this a non-issue locally.
