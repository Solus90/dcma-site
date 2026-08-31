# Door County Mutual Aid — Site

Public website for [Door County Mutual Aid](https://www.doorcountymutualaid.org). The front end is a [Nuxt 4](https://nuxt.com) app on Vercel; all editable content lives in [Sanity](https://www.sanity.io). Content routes use ISR, so a Studio publish shows up on the live site within ~a minute — no rebuild. Deploy details in [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md).

| Piece | Location |
| --- | --- |
| Site app | repo root (`app/`, `server/`) |
| Sanity Studio | `studio/` |
| Content seed script | `scripts/seed.ts` |
| Sanity project ID | `1qb86j9s` |
| Dataset | `production` |

---

## Quick start (developers)

### 1. Install dependencies

The site app is a **pnpm** workspace. The Sanity Studio in `studio/` is managed
**with npm, separately** — its build toolchain doesn't cooperate with pnpm's
symlinked `node_modules`, so it has its own `package-lock.json` and is not a
workspace member. Install both:

```bash
pnpm install
npm --prefix studio install
```

### 2. Configure environment

Copy the example env file and fill in values:

```bash
cp .env.example .env
```

| Variable | Required for | Description |
| --- | --- | --- |
| `NUXT_SANITY_PROJECT_ID` | Site + seed | Sanity project ID (`1qb86j9s` for this project) |
| `SANITY_TOKEN` | Seed script, local contact form | API token with **Editor** (or higher) permissions. Server-only — never expose to the browser. |
| `NUXT_SANITY_WRITE_TOKEN` | Production contact form | Same write token, set in Vercel/hosting env. Maps to `runtimeConfig.sanityWriteToken`. |

Create a token at [sanity.io/manage](https://www.sanity.io/manage) → your project → **API** → **Tokens** → **Add API token** (Editor permissions).

### 3. Run locally

**Site** (http://localhost:3000):

```bash
pnpm run dev
```

**Sanity Studio** (http://localhost:3333):

```bash
cd studio
npm run dev
```

### 4. Other commands

```bash
pnpm run build      # production build
pnpm run preview    # preview production build
pnpm run test       # vitest
pnpm run seed       # reset/populate Sanity content (see below)
```

---

## Sanity CMS

### How content reaches the live site

- **Pages and copy** are fetched from Sanity and served with ISR (`routeRules` in `nuxt.config.ts`, `isr: 60`). Publish in Studio → the change is live within ~a minute, no deploy.
- **Contact form submissions** are written to Sanity at **runtime** via `/api/contact` (requires a write token on the server).
- A **rebuild is only needed** for: schema changes (redeploy the Studio), new CMS `page` slugs to reach the sitemap (they render immediately regardless), and code changes (any push to `main` builds).

See [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) for the full picture, including the not-yet-done DNS cutover from Wix.

### Accessing Studio

**Option A — Hosted Studio (recommended for editors)**

Deploy once (or redeploy after schema changes):

```bash
cd studio
npm run deploy
```

This project's Studio URL is **https://dcma.sanity.studio** (do not use `https://1qb86j9s.sanity.studio` — that hostname is not configured and returns "Studio not found").

**Option B — Local Studio (developers)**

```bash
cd studio
npm run dev
```

Open http://localhost:3333. Log in with a Sanity account that has access to project `1qb86j9s`.

---

## Common Sanity tasks (content editors)

Studio sidebar structure:

| Studio item | What it controls |
| --- | --- |
| **Site Settings** | Org name, logo, email, Facebook, address, nav links, footer, error-page copy |
| **Home Page** | Homepage hero, mission, how-it-works cards, stats, activities, contact form labels |
| **Full Hearts Fridge** | Fridge program page — location, hours, donation guidelines, CTAs |
| **About Page** | Community agreement / norms document |
| **What Is Mutual Aid Page** | The `/what-is-mutual-aid` explainer — sections, FAQ, the reading list |
| **Updates Page** | Headings and copy for `/updates` (the entries live under **Updates**) |
| **Updates** | Individual posts — events, announcements, news (newest first) |
| **Pages** | Additional CMS pages at custom URLs (e.g. `/volunteer`) |
| **Contact messages** | Inbound contact form submissions (read-only for editors) |

Singleton documents (Site Settings, Home, Fridge, About, What Is Mutual Aid, Updates Page) cannot be deleted or duplicated — only edited.

### Edit site-wide settings

1. Open **Site Settings** in Studio.
2. Update fields (org name, logo, email, nav links, footer, etc.).
3. Click **Publish**. Changes appear on every page (header, footer, nav) within ~a minute.

### Edit the homepage

1. Open **Home Page**.
2. Sections map to the live page top-to-bottom: hero → mission → how it works → stats → activities → contact form.
3. **Cards** (how-it-works, activities) support title, body, optional image, and optional CTA (label + link/mailto).
4. **Contact form** fields under `contactForm` control form labels and messages, not the submissions themselves.
5. Publish.

### Edit the Full Hearts Fridge page

1. Open **Full Hearts Fridge**.
2. Key fields: intro, location/hours, map URL, donation guidelines, closing CTA.
3. Publish.

### Edit the About page

1. Open **About Page**.
2. Long-form content: hero, table of contents, principles, norms, security guidance.
3. Publish.

### Post an update or event

1. Open **Updates** → **＋** (create).
2. Set the title, a date, and pick a **Category** — `event`, `announcement`, or `news`.
3. Write the summary. For events, the time and location go in the summary text (there are no separate fields yet).
4. Publish. Events dated today or later show in the "Upcoming events" list on `/updates`; everything else lands in the card grid below.

### Create a new CMS page

1. In Studio, go to **Pages** → **Create new Page**.
2. Set **Title** and **Slug** (URL path). Reserved slugs: `about`, `full-hearts-fridge`, `about-us`, `what-is-mutual-aid`, `updates`, `api`.
3. Add one or more **Page sections** (see section types below).
4. Optionally set **SEO** title and description.
5. Publish. The page is reachable immediately; a rebuild adds it to the sitemap.

**Available section types**

| Section | Use for |
| --- | --- |
| Hero | Large heading, tagline, image, primary/secondary CTAs |
| Text + image | Eyebrow, heading, body, image (left or right) |
| Text section | Prose block with optional eyebrow/heading |
| Card grid | Simple cards or cards with photos |
| Call to action | Heading, note, one or two CTAs |
| Contact form | Embeds the site contact form (uses Home Page form copy) |
| Stats marquee | Scrolling stat lines |

### Upload or replace an image

1. Click the image field in any document.
2. Upload a new file or select from the media library.
3. Fill in **Alt text** when the field is available (important for accessibility).
4. Publish the document.

### Review contact form messages

1. Open **Contact messages** in Studio (newest first).
2. Read submission details (name, email, subject, message, timestamp).
3. Toggle **Read** when handled.

Submissions are created automatically by the live site; do not create these documents manually.

### Publish workflow

Sanity uses draft/publish:

1. Edit fields in a document.
2. Click **Publish** (green).
3. The live site picks it up within ~a minute (ISR). No deploy.

Unpublished drafts are not served to the public site.

---

## Common Sanity tasks (developers)

### Seed or reset content

Populates all singleton documents and uploads brand/stock images. **Overwrites** existing `siteSettings`, `homePage`, `fridgePage`, `aboutPage`, `mutualAidPage`, and `updatesPage` documents.

```bash
# Requires SANITY_TOKEN in .env
pnpm run seed
```

Source assets: `assets/source/` (logo, handprint) and `assets/stock/` (photography).

### Deploy the Studio (after schema changes)

`studio/` is npm-managed and **not** part of the pnpm workspace, so run npm commands from inside it. After editing `studio/schemaTypes/`:

```bash
cd studio
npm run dev        # verify locally first (localhost:3333)
npm run deploy     # build + upload the hosted Studio at dcma.sanity.studio
```

`npm run deploy` both builds the Studio and uploads the schema manifest. First run needs `sanity login` (browser). If it hangs on "Verifying local content" or errors on `uploadSchema`, bump `sanity` / `@sanity/cli` in `studio/package.json` and reinstall — see [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md).

Automating this in CI is [issue #42](https://github.com/Solus90/dcma-site/issues/42).

### Add a new document type or field

1. Add or edit schema in `studio/schemaTypes/`.
2. Export it from `studio/schemaTypes/index.ts`.
3. If it is a singleton, register it in `studio/sanity.config.ts` (`singletons` array + structure sidebar).
4. Add GROQ queries and TypeScript types in `app/composables/useSiteContent.ts` and `app/types/content.ts`.
5. For a singleton with default copy, add a `*PageDefaults.ts` in `app/utils/` and a `normalize*` in `contentDefaults.ts`, then use `withDefaults()` in the composable so the page renders before the doc exists (see `useAboutPage` / `useMutualAidPage`).
6. Wire up a Nuxt page or component to render it.
7. `cd studio && npm run deploy` to push the schema.
8. Optionally extend `scripts/seed.ts` with defaults.

### Configure the contact form API

The contact endpoint (`server/api/contact.post.ts`) writes `contactSubmission` documents to Sanity.

- **Local:** set `SANITY_TOKEN` in `.env`.
- **Production:** set `NUXT_SANITY_WRITE_TOKEN` (or `SANITY_TOKEN`) in hosting env vars alongside `NUXT_SANITY_PROJECT_ID`.

Token needs **create** permission on `contactSubmission` documents.

### Invite a new editor

1. Go to [sanity.io/manage](https://www.sanity.io/manage) → project **Door County Mutual Aid**.
2. **Members** → **Invite member**.
3. Assign **Editor** (content) or **Administrator** (content + project settings).
4. Share the hosted Studio URL: **https://dcma.sanity.studio**

No repo access is required for day-to-day content editing.

---

## Project layout

```
app/                  Nuxt pages and Vue components
server/               API routes (contact form)
studio/               Sanity Studio (schemas + CMS UI)
scripts/seed.ts       One-shot content migration / reset
shared/               Shared defaults and build-time helpers
assets/source/        Brand images (logo, handprint)
assets/stock/         Stock photography for seed script
```

---

## Troubleshooting

| Problem | Likely fix |
| --- | --- |
| Published change not on the live site | Wait ~a minute (ISR window) and hard-refresh. Still stale after a few minutes → check the deploy is current; see `docs/DEPLOYMENT.md` |
| `Missing SANITY_TOKEN` when seeding | Add token to `.env` |
| Contact form returns 500 | Check write token and `NUXT_SANITY_PROJECT_ID` on the server |
| New CMS page missing from the sitemap | Rebuild — slugs are collected at build time in `nuxt.config.ts`. The page itself works without a rebuild. |
| Schema field missing in Studio | `cd studio && npm run deploy` (schema changes need a Studio redeploy) |
| Reserved slug error on new page | Choose a slug other than `about`, `full-hearts-fridge`, `about-us`, `what-is-mutual-aid`, `updates`, or `api` |
| `pnpm install` didn't set up the Studio | It won't — run `npm --prefix studio install` separately |

---

## Links

- [Nuxt documentation](https://nuxt.com/docs)
- [Sanity documentation](https://www.sanity.io/docs)
- [Sanity Studio structure](https://www.sanity.io/docs/studio-structure-builder)
