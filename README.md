# Door County Mutual Aid — Site

Public website for [Door County Mutual Aid](https://www.doorcountymutualaid.org). The front end is a prerendered [Nuxt 4](https://nuxt.com) app; all editable content lives in [Sanity](https://www.sanity.io).

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

```bash
npm install
cd studio && npm install && cd ..
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
npm run dev
```

**Sanity Studio** (http://localhost:3333):

```bash
cd studio
npm run dev
```

### 4. Other commands

```bash
npm run build      # production build
npm run preview    # preview production build
npm run test       # vitest
npm run seed       # reset/populate Sanity content (see below)
```

---

## Sanity CMS

### How content reaches the live site

- **Pages and copy** are fetched from Sanity at **build time** and prerendered to static HTML.
- **Contact form submissions** are written to Sanity at **runtime** via `/api/contact` (requires a write token on the server).
- After you publish changes in Studio, the public site does **not** update automatically — trigger a new deploy (or local rebuild) so Nuxt picks up the latest content.

### Accessing Studio

**Option A — Hosted Studio (recommended for editors)**

Deploy once (or redeploy after schema changes):

```bash
cd studio
npm run deploy
```

Sanity prompts for a hostname on first deploy (for example `dcma`). The Studio URL becomes `https://<hostname>.sanity.studio`.

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
| **Full Hearts Fridge** | Fridge program page — location, hours, donation guidelines, values, CTAs |
| **About Page** | Community agreement / norms document |
| **Pages** | Additional CMS pages at custom URLs (e.g. `/volunteer`) |
| **Contact messages** | Inbound contact form submissions (read-only for editors) |

Singleton documents (Site Settings, Home, Fridge, About) cannot be deleted or duplicated — only edited.

### Edit site-wide settings

1. Open **Site Settings** in Studio.
2. Update fields (org name, logo, email, nav links, footer, etc.).
3. Click **Publish**.

Changes appear on every page (header, footer, nav). Redeploy the site to go live.

### Edit the homepage

1. Open **Home Page**.
2. Sections map to the live page top-to-bottom: hero → mission → how it works → stats → activities → contact form.
3. **Cards** (how-it-works, activities) support title, body, optional image, and optional CTA (label + link/mailto).
4. **Contact form** fields under `contactForm` control form labels and messages, not the submissions themselves.
5. Publish, then redeploy the site.

### Edit the Full Hearts Fridge page

1. Open **Full Hearts Fridge**.
2. Key fields: intro, location/hours, map URL, donation guidelines, value cards, closing CTA.
3. Publish, then redeploy.

### Edit the About page

1. Open **About Page**.
2. Long-form content: hero, table of contents, principles, norms, security guidance.
3. Publish, then redeploy.

### Create a new CMS page

1. In Studio, go to **Pages** → **Create new Page**.
2. Set **Title** and **Slug** (URL path). Reserved slugs: `about`, `full-hearts-fridge`, `about-us`, `api`.
3. Add one or more **Page sections** (see section types below).
4. Optionally set **SEO** title and description.
5. Publish, then redeploy — new routes are discovered at build time and added to the sitemap.

**Available section types**

| Section | Use for |
| --- | --- |
| Hero | Large heading, tagline, image, primary/secondary CTAs |
| Text + image | Eyebrow, heading, body, image (left or right) |
| Text section | Prose block with optional eyebrow/heading |
| Card grid | Simple cards or cards with photos |
| Alternating blocks | Value-style alternating image/text cards |
| Call to action | Heading, note, one or two CTAs |
| Contact form | Embeds the site contact form (uses Home Page form copy) |
| Stats marquee | Scrolling stat lines |

### Upload or replace an image

1. Click the image field in any document.
2. Upload a new file or select from the media library.
3. Fill in **Alt text** when the field is available (important for accessibility).
4. Publish the document, then redeploy.

### Review contact form messages

1. Open **Contact messages** in Studio (newest first).
2. Read submission details (name, email, subject, message, timestamp).
3. Toggle **Read** when handled.

Submissions are created automatically by the live site; do not create these documents manually.

### Publish workflow

Sanity uses draft/publish:

1. Edit fields in a document.
2. Click **Publish** (green) to make changes live in the API.
3. Trigger a site redeploy so visitors see the update.

Unpublished drafts are not served to the public site.

---

## Common Sanity tasks (developers)

### Seed or reset content

Populates all singleton documents and uploads brand/stock images. **Overwrites** existing `siteSettings`, `homePage`, `fridgePage`, and `aboutPage` documents.

```bash
# Requires SANITY_TOKEN in .env
npm run seed
```

Source assets: `assets/source/` (logo, handprint) and `assets/stock/` (photography).

### Deploy schema changes

After editing files in `studio/schemaTypes/`:

```bash
cd studio
npm run schema:deploy
```

Then redeploy Studio so editors see new fields:

```bash
npm run deploy
```

For local verification before deploy:

```bash
npm run dev
```

### Deploy Studio

```bash
cd studio
npm run deploy
```

First run requires `sanity login`. Subsequent deploys update the hosted Studio.

### Add a new document type or field

1. Add or edit schema in `studio/schemaTypes/`.
2. Export it from `studio/schemaTypes/index.ts`.
3. If it is a singleton, register it in `studio/sanity.config.ts` (`singletons` array + structure sidebar).
4. Add GROQ queries and TypeScript types in `app/composables/useSiteContent.ts` and `app/types/content.ts`.
5. Wire up a Nuxt page or component to render it.
6. Run `npm run schema:deploy` and `npm run deploy` in `studio/`.
7. Optionally extend `scripts/seed.ts` with defaults.

### Configure the contact form API

The contact endpoint (`server/api/contact.post.ts`) writes `contactSubmission` documents to Sanity.

- **Local:** set `SANITY_TOKEN` in `.env`.
- **Production:** set `NUXT_SANITY_WRITE_TOKEN` (or `SANITY_TOKEN`) in hosting env vars alongside `NUXT_SANITY_PROJECT_ID`.

Token needs **create** permission on `contactSubmission` documents.

### Invite a new editor

1. Go to [sanity.io/manage](https://www.sanity.io/manage) → project **Door County Mutual Aid**.
2. **Members** → **Invite member**.
3. Assign **Editor** (content) or **Administrator** (content + project settings).
4. Share the hosted Studio URL (`https://<hostname>.sanity.studio`).

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
| Site shows old content | Redeploy/rebuild after publishing in Studio |
| `Missing SANITY_TOKEN` when seeding | Add token to `.env` |
| Contact form returns 500 | Check write token and `NUXT_SANITY_PROJECT_ID` on the server |
| New CMS page 404 after publish | Redeploy — slugs are collected at build time in `nuxt.config.ts` |
| Schema field missing in Studio | Run `npm run schema:deploy` in `studio/`, then redeploy Studio |
| Reserved slug error on new page | Choose a slug other than `about`, `full-hearts-fridge`, `about-us`, or `api` |

---

## Links

- [Nuxt documentation](https://nuxt.com/docs)
- [Sanity documentation](https://www.sanity.io/docs)
- [Sanity Studio structure](https://www.sanity.io/docs/studio-structure-builder)
