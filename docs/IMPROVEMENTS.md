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
Content routes now use ISR route rules (revalidate on a timer — 60s window), so Studio publishes show up on their own. For *instant* updates, add on-demand revalidation (a `/api/revalidate` route + Sanity webhook) or a Deploy Hook. Details in `DEPLOYMENT.md`.

### Studio deploy → CI
`sanity deploy` from `studio/` is a local ordeal. In one session it hit: wrong-directory `ProjectRootNotFoundError`; `uploadSchema is not a function` (CLI newer than the local `sanity` package — fixed by bumping `sanity`/`@sanity/cli`); `useMemoCache` React #527 from a `react` / `react-dom` version split (fixed by decoupling `studio/` from the pnpm workspace and pinning react via npm `overrides` — see the `build(studio): decouple…` commit); build time swinging 1.5s–11min on cold caches.

The immediate breakage is fixed, but the deploy is still manual and slow. Add `.github/workflows/studio-deploy.yml` that runs `sanity deploy` on push to `main` when `studio/**` changes (needs a `SANITY_DEPLOY_TOKEN` GitHub secret). Optionally a PR check running `sanity schema validate` on `studio/**` changes. That makes the local build time a non-issue.
