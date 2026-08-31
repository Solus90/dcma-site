# Improvements backlog

Things we've decided are worth doing later but deliberately deferred. Newest context at the top of each section. Not a commitment, just a place so it doesn't get lost.

## Content model

### Partners list on the site
Raised at the Aug 30 meeting: "add a list of partners (include Econo Foods)." Not built. Candidates: the farmers-market vendors donating surplus, Bay View Lutheran, Hope Church, the Interfaith Coalition, Big Dog Farm, Door County Coffee, Econo Foods. Could be a `cardGridSection` on the Projects page, a section on the fridge page, or a small generic `page` doc — no schema change either way. Needs the collective to settle the curated list (all vendors, or a shorter set?).

### Structured event fields on `update`
The `/updates` agenda list currently reads `update` documents with `category == "event"` and shows the event date from `publishedAt` (a bare date, no time). Time and location are free-typed into the `summary`.

Add two optional fields to the `update` schema:
- `startAt` — datetime (so we can show a formatted time and sort multiple events in a day)
- `location` — string (so we can show it consistently and link to a map)

They stay empty on non-event posts. ~1 hour of schema + type + GROQ work, plus one Studio deploy. Alternative: a dedicated `event` document type instead of overloading `update` — cleaner separation, slightly more setup.

### CMS-editable section headings on `/updates`
"Upcoming events" and "Latest updates" are hardcoded in `app/pages/updates.vue`. Could become fields on the `updatesPage` singleton if editors want control. Low priority — they're structural labels, not content.

## Front-end

### Fridge blurbs on the home + projects pages are stale
The `homePage` "Full Hearts Fridge" activity card and the `page-projects` fridge card still say "Dedicated to reducing food waste… redirect food to those in need" (present tense), now that the fridge page itself says "Not open yet." Quick CMS copy fix — reword both to "we're building" language to match.

### Site media is placeholder stock
Hero images, activity cards, and fridge value photos are all generic stock. The Aug 30 meeting flagged "collect media for the website." Swap in real DCMA/Door County photos as they come in. Also open: whether to adopt the logo ("add logo to the website IF we want to move forward with it").

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

### DNS cutover: Wix → Vercel
**Biggest outstanding item.** `doorcountymutualaid.org` still resolves to the old Wix site — the public sees none of the Nuxt rebuild. The app only lives at the protected `dcma-site-*.vercel.app` URL. Full runbook in `DEPLOYMENT.md`. Needs Vercel domain access + DNS changes + Resend domain verification for the contact form.

### Content publishes: 60s now, could be instant
Content routes use ISR with a 60s window, so Studio publishes appear within ~a minute. To make it instant, add on-demand revalidation — a `/api/revalidate?path=…&secret=…` route hit by a Sanity webhook (Sanity admin + a secret in Vercel env, no Vercel dashboard access needed). ~1 hour of work. Details in `DEPLOYMENT.md`.

### `studio/` local setup is separate from the workspace
`studio/` was pulled out of the pnpm workspace (its build toolchain doesn't like pnpm's symlinked `node_modules`) and is npm-managed with its own `package-lock.json`. Anyone setting up locally needs `pnpm install` at the root **and** `npm install` in `studio/` separately. Worth a line in the README / a root `postinstall` that runs both.

### Studio deploy → CI
`sanity deploy` from `studio/` is a local ordeal. In one session it hit: wrong-directory `ProjectRootNotFoundError`; `uploadSchema is not a function` (CLI newer than the local `sanity` package — fixed by bumping `sanity`/`@sanity/cli`); `useMemoCache` React #527 from a `react` / `react-dom` version split (fixed by decoupling `studio/` from the pnpm workspace and pinning react via npm `overrides` — see the `build(studio): decouple…` commit); build time swinging 1.5s–11min on cold caches.

The immediate breakage is fixed, but the deploy is still manual and slow. Add `.github/workflows/studio-deploy.yml` that runs `sanity deploy` on push to `main` when `studio/**` changes (needs a `SANITY_DEPLOY_TOKEN` GitHub secret). Optionally a PR check running `sanity schema validate` on `studio/**` changes. That makes the local build time a non-issue.
