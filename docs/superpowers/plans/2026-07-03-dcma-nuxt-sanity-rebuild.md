# Door County Mutual Aid — Nuxt + Sanity Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild doorcountymutualaid.org (currently Wix) as a statically generated Nuxt 4 site with all content managed in Sanity, then cut the domain over from Wix.

**Architecture:** A two-page marketing site (Home, Full Hearts Fridge) rendered by Nuxt 4 in SSG mode, pulling content at build time from a Sanity dataset via `@nuxtjs/sanity`. Content is modeled as three singletons (site settings, home page, fridge page) plus reusable objects, seeded once by a migration script since the Wix source has no export path. The contact form posts to a Nuxt server route that emails the org via Resend.

**Tech Stack:** Nuxt 4, Vue 3, TypeScript, `@nuxtjs/sanity`, Sanity v4 (Studio embedded at `/studio` or hosted), Vitest + `@nuxt/test-utils`, Resend, Vercel (hosting + DNS cutover target).

## Site Inventory (source of truth for content migration)

Captured 2026-07-03 from the live Wix site (only 2 pages exist per `pages-sitemap.xml`).

**Global**
- Header: logo ("Mutual Aid Network" mark), nav links Home / Full Hearts Fridge, `JOIN NETWORK` button → `mailto:mutualaiddoorcounty@gmail.com?subject=Join the Network...`
- Footer: logo, "CONNECT" + Facebook link, "© 2026 Mutual Aid Network. All rights reserved.", giant "MUTUAL AID FOR ALL" display text.

**Home (`/`)**
1. Hero: display heading "Door County Mutual Aid", DCMA blue handprint graphic, tagline "WE FOSTER COMMUNITY LED SUPPORT THROUGH SOLIDARITY AND SHARED RESOURCES.", CTA "JOIN THE NETWORK" (mailto).
2. Mission: eyebrow "OUR MISSION", heading "WE STAND TOGETHER IN SOLIDARITY", paragraph ("We believe that mutual aid is the foundation of a resilient community. Our mission is to bridge the gap between those who have and those who need, ensuring that no one is left behind. By fostering direct support and shared resources, we create a network where solidarity is not just a principle, but a daily practice.").
3. How It Works: intro "We believe in direct action and shared responsibility. Here's how our community network operates." + 3 cards:
   - Offer Help — "Whether you have extra groceries, a spare tire, or just a listening ear, we provide a simple way to share your resources." CTA `OFFER SUPPORT`
   - Request Help — "Fill out our community agreement form to let us know what you need. We will match you with local neighbors who can assist." CTA `REQUEST SUPPORT`
   - Join Network — "Stay updated with our community impact and solidarity events. Become a part of a network that values collective action." CTA `JOIN NETWORK`
4. Stats marquee: "150+ HOURS OF DIRECT SUPPORT PROVIDED • 70+ NEW COMMUNITY MEMBERS JOINED • SOLIDARITY MEETINGS SUCCESSFULLY FACILITATED"
5. Activities (4 cards): Direct Support ("Providing food, shelter, and essential supplies to neighbors in need."), Solidarity Meetings ("Facilitating open dialogue and resource-sharing agreements."), Resource Hub ("Establishing shared spaces for mutual aid and community growth."), Community Action ("Organizing local cleanups and volunteer drives.").
6. Get in Touch: Location "Mutual Aid Meetings Monthly, 611 Jefferson Street, Sturgeon Bay" · Email mutualaiddoorcounty@gmail.com · contact form (First Name*, Last Name*, Email Address*, Subject*, Message*, SEND MESSAGE) on pale periwinkle background.

**Full Hearts Fridge (`/about-us` on Wix → `/full-hearts-fridge` on new site, with redirect)**
1. Intro: "Dedicated to reducing food waste and increasing access to nourishing meals within our community. By partnering with local restaurants, grocery stores, and farms we collect food that would otherwise go unused and redirect it to those in need." CTA `BECOME A VOLUNTEER` (mailto).
2. Values (4): Unconditional Support, Community Agreement, Collective Solidarity, Resource Sharing — full copy in seed script (Task 3).

**Design tokens (from screenshots)**
- Cream background `#FAF1E9`; slate blue text/headings `#34688C`; steel blue button `#2F6690`; dark navy button `#1E3648`; pale periwinkle form section `#EDF1FD`; thin hairline rules `#5B6670`.
- Display face: very bold, wide grotesque (Wix custom). Closest free match: **Archivo Expanded 800/900** (Google Fonts, variable width axis). Body: **Inter**.
- Assets to pull from Wix CDN before cutover: handprint DCMA graphic, "Mutual Aid Network" logo mark (right-click/save from live site into `assets/source/` and upload to Sanity in Task 3).

## Global Constraints

- Nuxt 4, TypeScript, `pnpm` as package manager.
- All human-visible copy comes from Sanity — no hard-coded page copy in components (labels like form field names may be local).
- Static generation for pages (prerendered via routeRules); the only server route is `/api/contact` (deployed as a Vercel Function — Nuxt's zero-config Vercel preset handles this).
- Preserve existing copy verbatim during migration; copy edits are out of scope.
- New route for the fridge page is `/full-hearts-fridge`; `/about-us` must 301 to it.
- Org email: `mutualaiddoorcounty@gmail.com`. Copyright name: "Mutual Aid Network".
- Accessibility floor: WCAG 2.1 AA (contrast, focus states, labeled form fields, alt text).

---

### Task 1: Scaffold Nuxt project and tooling

**Files:**
- Create: `package.json`, `nuxt.config.ts`, `app/app.vue`, `tsconfig.json`, `.gitignore`, `vitest.config.ts`
- Test: `tests/smoke.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: a running Nuxt 4 app with Vitest wired up; `pnpm dev`, `pnpm test`, `pnpm generate` all work. Directory layout uses Nuxt 4 `app/` dir.

- [ ] **Step 1: Scaffold**

```bash
cd ~/Developer/dcma-site
pnpm dlx nuxi@latest init . --package-manager pnpm --git-init --force
pnpm add -D vitest @nuxt/test-utils @vue/test-utils happy-dom
```

- [ ] **Step 2: Configure Vitest**

```ts
// vitest.config.ts
import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: { environment: 'happy-dom' },
})
```

Add to `package.json` scripts: `"test": "vitest run"`.

- [ ] **Step 3: Write smoke test**

```ts
// tests/smoke.test.ts
import { describe, it, expect } from 'vitest'

describe('project', () => {
  it('runs vitest', () => {
    expect(1 + 1).toBe(2)
  })
})
```

- [ ] **Step 4: Verify**

Run: `pnpm test` → PASS. Run: `pnpm dev` briefly → serves on :3000.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "chore: scaffold Nuxt 4 app with vitest"
```

---

### Task 2: Sanity project, schemas, and studio

**Files:**
- Create: `studio/` (Sanity Studio workspace), `studio/schemaTypes/siteSettings.ts`, `studio/schemaTypes/homePage.ts`, `studio/schemaTypes/fridgePage.ts`, `studio/schemaTypes/objects.ts`, `studio/schemaTypes/index.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: deployed schema with document types `siteSettings`, `homePage`, `fridgePage` and object types `cta`, `card`. Dataset `production`. Project ID recorded in `.env` as `NUXT_SANITY_PROJECT_ID`.

- [ ] **Step 1: Create Sanity project + studio**

```bash
cd ~/Developer/dcma-site
pnpm create sanity@latest -- --create-project "Door County Mutual Aid" --dataset production --template clean --typescript --output-path studio
```

(Alternatively use the Sanity MCP `create_project` tool, then init studio against that project ID.)

- [ ] **Step 2: Define shared objects**

```ts
// studio/schemaTypes/objects.ts
import { defineType, defineField } from 'sanity'

export const cta = defineType({
  name: 'cta', title: 'CTA', type: 'object',
  fields: [
    defineField({ name: 'label', type: 'string', validation: r => r.required() }),
    defineField({ name: 'href', type: 'string', description: 'URL or mailto:', validation: r => r.required() }),
  ],
})

export const card = defineType({
  name: 'card', title: 'Card', type: 'object',
  fields: [
    defineField({ name: 'title', type: 'string', validation: r => r.required() }),
    defineField({ name: 'body', type: 'text', rows: 3 }),
    defineField({ name: 'cta', type: 'cta' }),
  ],
})
```

- [ ] **Step 3: Define documents**

```ts
// studio/schemaTypes/siteSettings.ts
import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'siteSettings', title: 'Site Settings', type: 'document',
  fields: [
    defineField({ name: 'orgName', type: 'string' }),
    defineField({ name: 'logo', type: 'image' }),
    defineField({ name: 'email', type: 'string' }),
    defineField({ name: 'facebookUrl', type: 'url' }),
    defineField({ name: 'address', type: 'text', rows: 3 }),
    defineField({ name: 'meetingNote', type: 'string' }),
    defineField({ name: 'joinCta', type: 'cta' }),
    defineField({ name: 'footerTagline', type: 'string' }),
    defineField({ name: 'copyright', type: 'string' }),
  ],
})
```

```ts
// studio/schemaTypes/homePage.ts
import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'homePage', title: 'Home Page', type: 'document',
  fields: [
    defineField({ name: 'heroHeading', type: 'string' }),
    defineField({ name: 'heroTagline', type: 'string' }),
    defineField({ name: 'heroImage', type: 'image', description: 'DCMA handprint' }),
    defineField({ name: 'heroCta', type: 'cta' }),
    defineField({ name: 'missionEyebrow', type: 'string' }),
    defineField({ name: 'missionHeading', type: 'string' }),
    defineField({ name: 'missionBody', type: 'text' }),
    defineField({ name: 'howItWorksHeading', type: 'string' }),
    defineField({ name: 'howItWorksIntro', type: 'text' }),
    defineField({ name: 'howItWorksCards', type: 'array', of: [{ type: 'card' }] }),
    defineField({ name: 'stats', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'activities', type: 'array', of: [{ type: 'card' }] }),
    defineField({ name: 'contactHeading', type: 'string' }),
    defineField({ name: 'seo', type: 'object', fields: [
      defineField({ name: 'title', type: 'string' }),
      defineField({ name: 'description', type: 'text', rows: 2 }),
    ]}),
  ],
})
```

```ts
// studio/schemaTypes/fridgePage.ts
import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'fridgePage', title: 'Full Hearts Fridge', type: 'document',
  fields: [
    defineField({ name: 'heading', type: 'string' }),
    defineField({ name: 'intro', type: 'text' }),
    defineField({ name: 'cta', type: 'cta' }),
    defineField({ name: 'values', type: 'array', of: [{ type: 'card' }] }),
    defineField({ name: 'seo', type: 'object', fields: [
      defineField({ name: 'title', type: 'string' }),
      defineField({ name: 'description', type: 'text', rows: 2 }),
    ]}),
  ],
})
```

```ts
// studio/schemaTypes/index.ts
import siteSettings from './siteSettings'
import homePage from './homePage'
import fridgePage from './fridgePage'
import { cta, card } from './objects'
export const schemaTypes = [siteSettings, homePage, fridgePage, cta, card]
```

- [ ] **Step 4: Verify and deploy schema**

Run: `cd studio && pnpm dev` → Studio loads, all three document types visible, no schema errors. Then `pnpm dlx sanity@latest schema deploy` (or Sanity MCP `deploy_schema`).

- [ ] **Step 5: Commit**

```bash
git add studio && git commit -m "feat: sanity studio with siteSettings/homePage/fridgePage schemas"
```

---

### Task 3: Content migration (seed script + assets)

**Files:**
- Create: `scripts/seed.ts`, `assets/source/handprint.png`, `assets/source/logo.png` (downloaded from live Wix site)
- Modify: `package.json` (add `"seed": "sanity exec scripts/seed.ts --with-user-token"` under studio or use `tsx` with a token)

**Interfaces:**
- Consumes: schema types from Task 2.
- Produces: published documents with fixed IDs `siteSettings`, `homePage`, `fridgePage` in dataset `production`, images uploaded as Sanity assets.

- [ ] **Step 1: Download source assets**

Save the handprint hero graphic and header logo from the live site (browser devtools → Network → images, static.wixstatic.com URLs) into `assets/source/`. Verify both files open.

- [ ] **Step 2: Write seed script**

```ts
// scripts/seed.ts  (run: npx tsx scripts/seed.ts, needs SANITY_TOKEN with write access)
import { createClient } from '@sanity/client'
import { createReadStream } from 'node:fs'

const client = createClient({
  projectId: process.env.NUXT_SANITY_PROJECT_ID!,
  dataset: 'production',
  token: process.env.SANITY_TOKEN!,
  apiVersion: '2026-07-01',
  useCdn: false,
})

const JOIN = { label: 'JOIN NETWORK', href: 'mailto:mutualaiddoorcounty@gmail.com?subject=Join%20the%20Network' }

async function run() {
  const logo = await client.assets.upload('image', createReadStream('assets/source/logo.png'), { filename: 'logo.png' })
  const hand = await client.assets.upload('image', createReadStream('assets/source/handprint.png'), { filename: 'handprint.png' })
  const img = (a: { _id: string }) => ({ _type: 'image', asset: { _type: 'reference', _ref: a._id } })

  await client.createOrReplace({
    _id: 'siteSettings', _type: 'siteSettings',
    orgName: 'Door County Mutual Aid',
    logo: img(logo),
    email: 'mutualaiddoorcounty@gmail.com',
    facebookUrl: 'https://www.facebook.com/', // TODO-at-runtime: copy exact URL from Wix footer link before running
    address: '611 Jefferson Street\nSturgeon Bay',
    meetingNote: 'Mutual Aid Meetings Monthly',
    joinCta: JOIN,
    footerTagline: 'MUTUAL AID FOR ALL',
    copyright: '© 2026 Mutual Aid Network. All rights reserved.',
  })

  await client.createOrReplace({
    _id: 'homePage', _type: 'homePage',
    heroHeading: 'Door County Mutual Aid',
    heroTagline: 'WE FOSTER COMMUNITY LED SUPPORT THROUGH SOLIDARITY AND SHARED RESOURCES.',
    heroImage: img(hand),
    heroCta: { label: 'JOIN THE NETWORK', href: JOIN.href },
    missionEyebrow: 'OUR MISSION',
    missionHeading: 'WE STAND TOGETHER IN SOLIDARITY',
    missionBody: 'We believe that mutual aid is the foundation of a resilient community. Our mission is to bridge the gap between those who have and those who need, ensuring that no one is left behind. By fostering direct support and shared resources, we create a network where solidarity is not just a principle, but a daily practice.',
    howItWorksHeading: 'How It Works',
    howItWorksIntro: 'We believe in direct action and shared responsibility. Here’s how our community network operates.',
    howItWorksCards: [
      { _key: 'offer', _type: 'card', title: 'Offer Help', body: 'Whether you have extra groceries, a spare tire, or just a listening ear, we provide a simple way to share your resources.', cta: { label: 'OFFER SUPPORT', href: 'mailto:mutualaiddoorcounty@gmail.com?subject=Offer%20Support' } },
      { _key: 'request', _type: 'card', title: 'Request Help', body: 'Fill out our community agreement form to let us know what you need. We will match you with local neighbors who can assist.', cta: { label: 'REQUEST SUPPORT', href: 'mailto:mutualaiddoorcounty@gmail.com?subject=Request%20Support' } },
      { _key: 'join', _type: 'card', title: 'Join Network', body: 'Stay updated with our community impact and solidarity events. Become a part of a network that values collective action.', cta: JOIN },
    ],
    stats: ['150+ HOURS OF DIRECT SUPPORT PROVIDED', '70+ NEW COMMUNITY MEMBERS JOINED', 'SOLIDARITY MEETINGS SUCCESSFULLY FACILITATED'],
    activities: [
      { _key: 'a1', _type: 'card', title: 'Direct Support', body: 'Providing food, shelter, and essential supplies to neighbors in need.' },
      { _key: 'a2', _type: 'card', title: 'Solidarity Meetings', body: 'Facilitating open dialogue and resource-sharing agreements.' },
      { _key: 'a3', _type: 'card', title: 'Resource Hub', body: 'Establishing shared spaces for mutual aid and community growth.' },
      { _key: 'a4', _type: 'card', title: 'Community Action', body: 'Organizing local cleanups and volunteer drives.' },
    ],
    contactHeading: 'Get in Touch',
    seo: { title: 'Home | Door County Mutual Aid', description: 'Community-led support through solidarity and shared resources in Door County, Wisconsin.' },
  })

  await client.createOrReplace({
    _id: 'fridgePage', _type: 'fridgePage',
    heading: 'Full Hearts Fridge',
    intro: 'Dedicated to reducing food waste and increasing access to nourishing meals within our community. By partnering with local restaurants, grocery stores, and farms we collect food that would otherwise go unused and redirect it to those in need.',
    cta: { label: 'BECOME A VOLUNTEER', href: 'mailto:mutualaiddoorcounty@gmail.com?subject=Become%20a%20Volunteer' },
    values: [
      { _key: 'v1', _type: 'card', title: 'UNCONDITIONAL SUPPORT', body: 'We provide direct assistance without expectation of return, ensuring that every member of our community has access to the resources they need to survive and thrive.' },
      { _key: 'v2', _type: 'card', title: 'COMMUNITY AGREEMENT', body: 'Our group operates on a transparent and collective agreement, where every contribution is documented and every need is met through shared responsibility and mutual respect.' },
      { _key: 'v3', _type: 'card', title: 'COLLECTIVE SOLIDARITY', body: 'We stand together as one network, recognizing that our strength lies in our unity and that no individual is ever truly alone in the face of adversity.' },
      { _key: 'v4', _type: 'card', title: 'RESOURCE SHARING', body: 'We prioritize the equitable distribution of shared resources, ensuring that our network remains accessible and sustainable for all members regardless of background.' },
    ],
    seo: { title: 'Full Hearts Fridge | Door County Mutual Aid', description: 'Reducing food waste and increasing access to nourishing meals in Door County.' },
  })

  console.log('Seed complete')
}
run().catch((e) => { console.error(e); process.exit(1) })
```

Before running: open the live site footer, copy the real Facebook URL, and replace the placeholder.

- [ ] **Step 3: Run and verify**

Run: `SANITY_TOKEN=... NUXT_SANITY_PROJECT_ID=... npx tsx scripts/seed.ts` → "Seed complete". Open Studio → all three documents populated, images render.

- [ ] **Step 4: Commit**

```bash
git add scripts assets package.json && git commit -m "feat: content migration seed script + source assets"
```

---

### Task 4: Sanity module wiring + typed queries

**Files:**
- Create: `app/composables/useSiteContent.ts`, `app/types/content.ts`, `.env.example`
- Modify: `nuxt.config.ts`
- Test: `tests/queries.test.ts`

**Interfaces:**
- Consumes: document IDs `siteSettings` / `homePage` / `fridgePage` from Task 3.
- Produces: `useSiteSettings(): Promise<SiteSettings>`, `useHomePage(): Promise<HomePage>`, `useFridgePage(): Promise<FridgePage>` composables and the exported GROQ strings `SITE_SETTINGS_QUERY`, `HOME_QUERY`, `FRIDGE_QUERY`. Types `SiteSettings`, `HomePage`, `FridgePage`, `Card`, `Cta` in `app/types/content.ts`.

- [ ] **Step 1: Install + configure**

```bash
pnpm add @nuxtjs/sanity
```

```ts
// nuxt.config.ts (add)
export default defineNuxtConfig({
  modules: ['@nuxtjs/sanity'],
  sanity: { projectId: process.env.NUXT_SANITY_PROJECT_ID, dataset: 'production', apiVersion: '2026-07-01', useCdn: true },
})
```

- [ ] **Step 2: Types**

```ts
// app/types/content.ts
export interface Cta { label: string; href: string }
export interface Card { _key: string; title: string; body?: string; cta?: Cta }
export interface SiteSettings {
  orgName: string; logoUrl: string; email: string; facebookUrl: string
  address: string; meetingNote: string; joinCta: Cta; footerTagline: string; copyright: string
}
export interface HomePage {
  heroHeading: string; heroTagline: string; heroImageUrl: string; heroCta: Cta
  missionEyebrow: string; missionHeading: string; missionBody: string
  howItWorksHeading: string; howItWorksIntro: string; howItWorksCards: Card[]
  stats: string[]; activities: Card[]; contactHeading: string
  seo: { title: string; description: string }
}
export interface FridgePage {
  heading: string; intro: string; cta: Cta; values: Card[]
  seo: { title: string; description: string }
}
```

- [ ] **Step 3: Write failing test for query shape**

```ts
// tests/queries.test.ts
import { describe, it, expect } from 'vitest'
import { SITE_SETTINGS_QUERY, HOME_QUERY, FRIDGE_QUERY } from '../app/composables/useSiteContent'

describe('GROQ queries', () => {
  it('target singleton ids and project image urls', () => {
    expect(SITE_SETTINGS_QUERY).toContain('"siteSettings"')
    expect(SITE_SETTINGS_QUERY).toContain('logo.asset->url')
    expect(HOME_QUERY).toContain('"homePage"')
    expect(HOME_QUERY).toContain('heroImage.asset->url')
    expect(FRIDGE_QUERY).toContain('"fridgePage"')
  })
})
```

Run: `pnpm test` → FAIL (module not found).

- [ ] **Step 4: Implement composables**

```ts
// app/composables/useSiteContent.ts
import type { SiteSettings, HomePage, FridgePage } from '~/types/content'

export const SITE_SETTINGS_QUERY = /* groq */ `*[_id == "siteSettings"][0]{
  orgName, "logoUrl": logo.asset->url, email, facebookUrl, address,
  meetingNote, joinCta, footerTagline, copyright }`

export const HOME_QUERY = /* groq */ `*[_id == "homePage"][0]{
  heroHeading, heroTagline, "heroImageUrl": heroImage.asset->url, heroCta,
  missionEyebrow, missionHeading, missionBody,
  howItWorksHeading, howItWorksIntro, howItWorksCards, stats, activities,
  contactHeading, seo }`

export const FRIDGE_QUERY = /* groq */ `*[_id == "fridgePage"][0]{
  heading, intro, cta, values, seo }`

export const useSiteSettings = () => useSanityQuery<SiteSettings>(SITE_SETTINGS_QUERY)
export const useHomePage = () => useSanityQuery<HomePage>(HOME_QUERY)
export const useFridgePage = () => useSanityQuery<FridgePage>(FRIDGE_QUERY)
```

- [ ] **Step 5: Verify + commit**

Run: `pnpm test` → PASS.

```bash
git add -A && git commit -m "feat: sanity module, typed GROQ queries, content composables"
```

---

### Task 5: Design system + global layout (header/footer)

**Files:**
- Create: `app/assets/css/main.css`, `app/components/SiteHeader.vue`, `app/components/SiteFooter.vue`, `app/layouts/default.vue`
- Modify: `nuxt.config.ts` (css, fonts)
- Test: `tests/layout.test.ts`

**Interfaces:**
- Consumes: `useSiteSettings()` from Task 4.
- Produces: CSS custom properties (`--cream: #FAF1E9; --slate: #34688C; --steel: #2F6690; --navy: #1E3648; --periwinkle: #EDF1FD`), utility classes `.display` (Archivo Expanded 900, uppercase tracking-tight) and `.btn` / `.btn-dark`. `SiteHeader` (props: none, fetches settings) and `SiteFooter` render on every page via `layouts/default.vue`.

- [ ] **Step 1: Fonts + tokens**

```bash
pnpm add @nuxt/fonts
```

```css
/* app/assets/css/main.css */
:root {
  --cream: #FAF1E9; --slate: #34688C; --steel: #2F6690;
  --navy: #1E3648; --periwinkle: #EDF1FD; --hairline: #5B6670;
}
body { background: var(--cream); color: var(--slate); font-family: Inter, sans-serif; margin: 0; }
.display { font-family: 'Archivo', sans-serif; font-stretch: expanded; font-weight: 900; text-transform: none; line-height: 0.95; letter-spacing: -0.01em; }
.eyebrow { text-transform: uppercase; letter-spacing: 0.1em; font-size: 0.8rem; }
.btn { display: inline-block; background: var(--steel); color: #fff; padding: 0.9rem 1.6rem; text-transform: uppercase; text-decoration: none; font-weight: 600; }
.btn-dark { background: var(--navy); }
.btn:focus-visible { outline: 3px solid var(--navy); outline-offset: 2px; }
```

```ts
// nuxt.config.ts (add)
modules: ['@nuxtjs/sanity', '@nuxt/fonts'],
css: ['~/assets/css/main.css'],
fonts: { families: [{ name: 'Archivo', weights: [700, 900] }, { name: 'Inter', weights: [400, 600] }] },
```

- [ ] **Step 2: Failing render test**

```ts
// tests/layout.test.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SiteFooter from '../app/components/SiteFooter.vue'

describe('SiteFooter', () => {
  it('renders tagline, copyright, and facebook link', () => {
    const w = mount(SiteFooter, { props: { settings: {
      orgName: 'DCMA', logoUrl: '', email: 'x@y.z', facebookUrl: 'https://facebook.com/x',
      address: '', meetingNote: '', joinCta: { label: 'JOIN', href: '#' },
      footerTagline: 'MUTUAL AID FOR ALL', copyright: '© 2026 Mutual Aid Network. All rights reserved.',
    } } })
    expect(w.text()).toContain('MUTUAL AID FOR ALL')
    expect(w.text()).toContain('© 2026')
    expect(w.find('a[href="https://facebook.com/x"]').exists()).toBe(true)
  })
})
```

Run: `pnpm test` → FAIL (component missing). Note: components take `settings` as a **prop**; only the layout fetches.

- [ ] **Step 3: Implement components**

```vue
<!-- app/components/SiteHeader.vue -->
<script setup lang="ts">
import type { SiteSettings } from '~/types/content'
defineProps<{ settings: SiteSettings }>()
</script>
<template>
  <header class="site-header">
    <NuxtLink to="/"><img :src="settings.logoUrl" :alt="settings.orgName" height="36"></NuxtLink>
    <nav aria-label="Main">
      <NuxtLink to="/">Home</NuxtLink>
      <NuxtLink to="/full-hearts-fridge">Full Hearts Fridge</NuxtLink>
    </nav>
    <a class="btn" :href="settings.joinCta.href">{{ settings.joinCta.label }}</a>
  </header>
</template>
<style scoped>
.site-header { display: flex; align-items: center; justify-content: space-between; padding: 1rem 2rem; border-bottom: 1px solid var(--hairline); }
nav { display: flex; gap: 2rem; text-transform: uppercase; }
nav a { color: var(--slate); text-decoration: none; }
nav a.router-link-active { text-decoration: underline; }
</style>
```

```vue
<!-- app/components/SiteFooter.vue -->
<script setup lang="ts">
import type { SiteSettings } from '~/types/content'
defineProps<{ settings: SiteSettings }>()
</script>
<template>
  <footer>
    <div class="meta">
      <img :src="settings.logoUrl" :alt="settings.orgName" height="32">
      <span class="eyebrow">Connect</span>
      <a :href="settings.facebookUrl" aria-label="Facebook">Facebook</a>
      <small>{{ settings.copyright }}</small>
    </div>
    <p class="display tagline">{{ settings.footerTagline }}</p>
  </footer>
</template>
<style scoped>
footer { padding: 3rem 2rem 0; }
.meta { display: flex; gap: 2rem; align-items: center; justify-content: space-between; flex-wrap: wrap; }
.tagline { font-size: clamp(3rem, 10vw, 9rem); margin: 2rem 0 0; text-align: center; }
</style>
```

```vue
<!-- app/layouts/default.vue -->
<script setup lang="ts">
const { data: settings } = await useSiteSettings()
</script>
<template>
  <div v-if="settings">
    <SiteHeader :settings="settings" />
    <slot :settings="settings" />
    <SiteFooter :settings="settings" />
  </div>
</template>
```

- [ ] **Step 4: Verify**

Run: `pnpm test` → PASS. Run `pnpm dev` → header/footer render with live Sanity content.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: design tokens, header/footer, default layout"
```

---

### Task 6: Home page

**Files:**
- Create: `app/pages/index.vue`, `app/components/home/HomeHero.vue`, `app/components/home/HowItWorks.vue`, `app/components/home/StatsMarquee.vue`, `app/components/home/ActivityGrid.vue`
- Test: `tests/home.test.ts`

**Interfaces:**
- Consumes: `useHomePage()` (Task 4), `Card`/`Cta` types, `.display`/`.btn` classes (Task 5).
- Produces: complete `/` route. `HowItWorks` props: `{ heading: string; intro: string; cards: Card[] }`. `StatsMarquee` props: `{ stats: string[] }`. `ActivityGrid` props: `{ activities: Card[] }`. `HomeHero` props: `{ heading: string; tagline: string; imageUrl: string; cta: Cta }`.

- [ ] **Step 1: Failing tests**

```ts
// tests/home.test.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import HowItWorks from '../app/components/home/HowItWorks.vue'
import StatsMarquee from '../app/components/home/StatsMarquee.vue'

describe('HowItWorks', () => {
  it('renders a card with title, body, and cta link', () => {
    const w = mount(HowItWorks, { props: { heading: 'How It Works', intro: 'intro',
      cards: [{ _key: 'k1', title: 'Offer Help', body: 'Share resources.', cta: { label: 'OFFER SUPPORT', href: 'mailto:x@y.z' } }] } })
    expect(w.text()).toContain('Offer Help')
    expect(w.find('a[href="mailto:x@y.z"]').text()).toBe('OFFER SUPPORT')
  })
})

describe('StatsMarquee', () => {
  it('renders every stat and is marked decorative for AT', () => {
    const w = mount(StatsMarquee, { props: { stats: ['150+ HOURS', '70+ MEMBERS'] } })
    expect(w.text()).toContain('150+ HOURS')
    expect(w.text()).toContain('70+ MEMBERS')
  })
})
```

Run: `pnpm test` → FAIL.

- [ ] **Step 2: Implement components**

```vue
<!-- app/components/home/HomeHero.vue -->
<script setup lang="ts">
import type { Cta } from '~/types/content'
defineProps<{ heading: string; tagline: string; imageUrl: string; cta: Cta }>()
</script>
<template>
  <section class="hero">
    <img :src="imageUrl" alt="DCMA handprint logo" class="hand">
    <div>
      <h1 class="display">{{ heading }}</h1>
      <p class="eyebrow">{{ tagline }}</p>
      <a class="btn" :href="cta.href">{{ cta.label }}</a>
    </div>
  </section>
</template>
<style scoped>
.hero { display: grid; grid-template-columns: 1fr 2fr; gap: 2rem; align-items: center; padding: 3rem 2rem; }
h1 { font-size: clamp(3rem, 9vw, 8.5rem); text-align: right; }
.hand { max-width: 100%; }
@media (max-width: 768px) { .hero { grid-template-columns: 1fr; } h1 { text-align: left; } }
</style>
```

```vue
<!-- app/components/home/HowItWorks.vue -->
<script setup lang="ts">
import type { Card } from '~/types/content'
defineProps<{ heading: string; intro: string; cards: Card[] }>()
</script>
<template>
  <section class="how">
    <h2 class="display">{{ heading }}</h2>
    <p>{{ intro }}</p>
    <div class="cards">
      <article v-for="c in cards" :key="c._key">
        <h3>{{ c.title }}</h3>
        <p>{{ c.body }}</p>
        <a v-if="c.cta" class="btn btn-dark" :href="c.cta.href">{{ c.cta.label }}</a>
      </article>
    </div>
  </section>
</template>
<style scoped>
.how { padding: 4rem 2rem; }
.cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 2rem; margin-top: 2rem; }
</style>
```

```vue
<!-- app/components/home/StatsMarquee.vue -->
<script setup lang="ts">
defineProps<{ stats: string[] }>()
</script>
<template>
  <div class="marquee" role="presentation">
    <span v-for="(s, i) in stats" :key="i" class="eyebrow">• {{ s }} </span>
  </div>
</template>
<style scoped>
.marquee { overflow: hidden; white-space: nowrap; border-block: 1px solid var(--hairline); padding: 1rem 0; }
@media (prefers-reduced-motion: no-preference) {
  .marquee span { display: inline-block; animation: slide 30s linear infinite; }
  @keyframes slide { from { transform: translateX(0) } to { transform: translateX(-100%) } }
}
</style>
```

```vue
<!-- app/components/home/ActivityGrid.vue -->
<script setup lang="ts">
import type { Card } from '~/types/content'
defineProps<{ activities: Card[] }>()
</script>
<template>
  <section class="grid">
    <article v-for="a in activities" :key="a._key">
      <h3>{{ a.title }}</h3>
      <p>{{ a.body }}</p>
    </article>
  </section>
</template>
<style scoped>
.grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 2rem; padding: 4rem 2rem; }
</style>
```

```vue
<!-- app/pages/index.vue -->
<script setup lang="ts">
const { data: page } = await useHomePage()
useSeoMeta({ title: () => page.value?.seo.title, description: () => page.value?.seo.description })
</script>
<template>
  <main v-if="page">
    <HomeHero :heading="page.heroHeading" :tagline="page.heroTagline" :image-url="page.heroImageUrl" :cta="page.heroCta" />
    <section class="mission">
      <p class="eyebrow">{{ page.missionEyebrow }}</p>
      <h2 class="display">{{ page.missionHeading }}</h2>
      <p>{{ page.missionBody }}</p>
    </section>
    <HowItWorks :heading="page.howItWorksHeading" :intro="page.howItWorksIntro" :cards="page.howItWorksCards" />
    <StatsMarquee :stats="page.stats" />
    <ActivityGrid :activities="page.activities" />
    <ContactSection :heading="page.contactHeading" />
  </main>
</template>
```

(`ContactSection` is built in Task 7 — stub it as an empty component `app/components/ContactSection.vue` with `<template><section /></template>` and props `{ heading: string }` so this task builds.)

- [ ] **Step 3: Verify**

Run: `pnpm test` → PASS. `pnpm dev` → `/` matches the Wix homepage section-for-section.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: home page with hero, mission, how-it-works, stats, activities"
```

---

### Task 7: Contact section + form endpoint

**Files:**
- Create: `server/api/contact.post.ts`, `server/utils/validateContact.ts`
- Modify: `app/components/ContactSection.vue` (replace Task 6 stub), `nuxt.config.ts` (runtimeConfig)
- Test: `tests/contact.test.ts`

**Interfaces:**
- Consumes: `SiteSettings` via layout slot props (address/meetingNote/email displayed beside form).
- Produces: `POST /api/contact` accepting `{ firstName, lastName, email, subject, message, website }` → `{ ok: true }` or 400/422. `validateContact(body): { valid: boolean; errors: string[] }`. Field `website` is a honeypot: non-empty ⇒ silently accepted but not sent.

- [ ] **Step 1: Failing validation tests**

```ts
// tests/contact.test.ts
import { describe, it, expect } from 'vitest'
import { validateContact } from '../server/utils/validateContact'

const good = { firstName: 'A', lastName: 'B', email: 'a@b.co', subject: 'Hi', message: 'Hello', website: '' }

describe('validateContact', () => {
  it('accepts a complete submission', () => {
    expect(validateContact(good).valid).toBe(true)
  })
  it('rejects missing required fields', () => {
    const r = validateContact({ ...good, email: '' })
    expect(r.valid).toBe(false)
    expect(r.errors).toContain('email')
  })
  it('rejects malformed email', () => {
    expect(validateContact({ ...good, email: 'nope' }).valid).toBe(false)
  })
})
```

Run: `pnpm test` → FAIL.

- [ ] **Step 2: Implement validator + endpoint**

```ts
// server/utils/validateContact.ts
export interface ContactBody { firstName: string; lastName: string; email: string; subject: string; message: string; website?: string }

export function validateContact(b: Partial<ContactBody>): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  for (const f of ['firstName', 'lastName', 'email', 'subject', 'message'] as const) {
    if (!b[f]?.trim()) errors.push(f)
  }
  if (b.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(b.email)) errors.push('email')
  return { valid: errors.length === 0, errors: [...new Set(errors)] }
}
```

```ts
// server/api/contact.post.ts
import { validateContact } from '../utils/validateContact'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (body.website) return { ok: true } // honeypot: pretend success
  const { valid, errors } = validateContact(body)
  if (!valid) throw createError({ statusCode: 422, data: { errors } })

  const { resendApiKey, contactTo } = useRuntimeConfig(event)
  const res = await $fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${resendApiKey}` },
    body: {
      from: 'Website <contact@doorcountymutualaid.org>',
      to: [contactTo],
      reply_to: body.email,
      subject: `[Website] ${body.subject}`,
      text: `From: ${body.firstName} ${body.lastName} <${body.email}>\n\n${body.message}`,
    },
  })
  return { ok: true, id: (res as any).id }
})
```

```ts
// nuxt.config.ts (add)
runtimeConfig: { resendApiKey: '', contactTo: 'mutualaiddoorcounty@gmail.com' },
// Vercel is auto-detected by Nitro at deploy time — no preset needed locally.
// Pages stay static via prerender rules; /api/contact becomes a Vercel Function.
routeRules: { '/': { prerender: true }, '/full-hearts-fridge': { prerender: true } },
```

- [ ] **Step 3: Implement form component (replaces stub)**

```vue
<!-- app/components/ContactSection.vue -->
<script setup lang="ts">
defineProps<{ heading: string }>()
const form = reactive({ firstName: '', lastName: '', email: '', subject: '', message: '', website: '' })
const state = ref<'idle' | 'sending' | 'sent' | 'error'>('idle')
async function submit() {
  state.value = 'sending'
  try {
    await $fetch('/api/contact', { method: 'POST', body: form })
    state.value = 'sent'
  } catch { state.value = 'error' }
}
</script>
<template>
  <section class="contact">
    <h2 class="display">{{ heading }}</h2>
    <form v-if="state !== 'sent'" novalidate @submit.prevent="submit">
      <label>First Name* <input v-model="form.firstName" required autocomplete="given-name"></label>
      <label>Last Name* <input v-model="form.lastName" required autocomplete="family-name"></label>
      <label>Email Address* <input v-model="form.email" type="email" required autocomplete="email"></label>
      <label>Subject* <input v-model="form.subject" required></label>
      <label>Message* <textarea v-model="form.message" rows="5" required /></label>
      <input v-model="form.website" type="text" name="website" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">
      <button class="btn btn-dark" :disabled="state === 'sending'">Send Message</button>
      <p v-if="state === 'error'" role="alert">Something went wrong — email us directly instead.</p>
    </form>
    <p v-else role="status">Thanks — we'll be in touch.</p>
  </section>
</template>
<style scoped>
.contact { background: var(--periwinkle); padding: 4rem 2rem; }
form { display: grid; gap: 1rem; max-width: 640px; }
label { display: grid; gap: 0.25rem; font-weight: 600; }
input, textarea { padding: 0.7rem; border: 1px solid var(--navy); font: inherit; }
.hp { position: absolute; left: -9999px; }
</style>
```

Also render the location/email block (address, meetingNote, email from layout `settings` slot prop) beside the form in `index.vue`.

- [ ] **Step 4: Verify**

Run: `pnpm test` → PASS. Manual: `pnpm dev`, submit form with a test Resend key → email arrives; empty required field → inline 422.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: contact form with validated Resend-backed endpoint"
```

---

### Task 8: Full Hearts Fridge page + redirect

**Files:**
- Create: `app/pages/full-hearts-fridge.vue`
- Modify: `nuxt.config.ts` (redirect route rule)
- Test: `tests/fridge.test.ts`

**Interfaces:**
- Consumes: `useFridgePage()` (Task 4), `Card` type, `.display`/`.btn` classes.
- Produces: `/full-hearts-fridge` route; 301 from `/about-us`.

- [ ] **Step 1: Failing test**

```ts
// tests/fridge.test.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ValueList from '../app/components/ValueList.vue'

describe('ValueList', () => {
  it('renders each value with title and body', () => {
    const w = mount(ValueList, { props: { values: [
      { _key: 'v1', title: 'UNCONDITIONAL SUPPORT', body: 'We provide direct assistance.' },
    ] } })
    expect(w.text()).toContain('UNCONDITIONAL SUPPORT')
    expect(w.text()).toContain('direct assistance')
  })
})
```

Run: `pnpm test` → FAIL.

- [ ] **Step 2: Implement**

```vue
<!-- app/components/ValueList.vue -->
<script setup lang="ts">
import type { Card } from '~/types/content'
defineProps<{ values: Card[] }>()
</script>
<template>
  <dl class="values">
    <div v-for="v in values" :key="v._key">
      <dt class="display">{{ v.title }}</dt>
      <dd>{{ v.body }}</dd>
    </div>
  </dl>
</template>
<style scoped>
.values { display: grid; gap: 3rem; padding: 4rem 2rem; margin: 0; }
dd { margin: 0.5rem 0 0; max-width: 60ch; }
</style>
```

```vue
<!-- app/pages/full-hearts-fridge.vue -->
<script setup lang="ts">
const { data: page } = await useFridgePage()
useSeoMeta({ title: () => page.value?.seo.title, description: () => page.value?.seo.description })
</script>
<template>
  <main v-if="page">
    <section class="intro">
      <h1 class="display">{{ page.heading }}</h1>
      <p>{{ page.intro }}</p>
      <a class="btn btn-dark" :href="page.cta.href">{{ page.cta.label }}</a>
    </section>
    <ValueList :values="page.values" />
  </main>
</template>
<style scoped>
.intro { padding: 4rem 2rem; max-width: 900px; }
</style>
```

```ts
// nuxt.config.ts routeRules (add)
'/about-us': { redirect: { to: '/full-hearts-fridge', statusCode: 301 } },
```

- [ ] **Step 3: Verify**

Run: `pnpm test` → PASS. `pnpm dev`: `/full-hearts-fridge` renders; `curl -I localhost:3000/about-us` → 301 with correct Location.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: full hearts fridge page with 301 from /about-us"
```

---

### Task 9: SEO, sitemap, accessibility pass

**Files:**
- Create: `app/public/robots.txt` (via `public/`), install `@nuxtjs/sitemap`
- Modify: `nuxt.config.ts`, `app/app.vue`

**Interfaces:**
- Consumes: finished pages from Tasks 6–8.
- Produces: `sitemap.xml`, `robots.txt`, canonical/OG tags, Lighthouse a11y ≥ 95.

- [ ] **Step 1: Sitemap + meta**

```bash
pnpm add @nuxtjs/sitemap
```

```ts
// nuxt.config.ts (add)
modules: ['@nuxtjs/sanity', '@nuxt/fonts', '@nuxtjs/sitemap'],
site: { url: 'https://www.doorcountymutualaid.org', name: 'Door County Mutual Aid' },
app: { head: { htmlAttrs: { lang: 'en' } } },
```

```txt
# public/robots.txt
User-agent: *
Allow: /
Sitemap: https://www.doorcountymutualaid.org/sitemap.xml
```

- [ ] **Step 2: Verify structure + a11y**

Run: `pnpm generate && pnpm dlx serve .output/public` then:
- `curl localhost:3000/sitemap.xml` lists `/` and `/full-hearts-fridge`.
- Lighthouse (Chrome devtools) on both pages: Accessibility ≥ 95, check heading order (one `h1` per page), form labels, contrast of `--slate` on `--cream` (7.2:1 — passes AA).

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: sitemap, robots, meta, a11y fixes"
```

---

### Task 10: Deploy to Vercel + DNS cutover

**Files:**
- Create: `docs/CUTOVER.md`

**Interfaces:**
- Consumes: complete site from all prior tasks.
- Produces: production deployment on Vercel with `doorcountymutualaid.org` pointed at it; Wix decommissioned.

- [ ] **Step 1: Vercel project setup**

Nuxt is zero-config on Vercel (Nitro auto-detects the platform; prerendered pages ship as static assets, `/api/contact` as a Vercel Function).

```bash
vercel link          # create/link project "dcma-site"
vercel env add NUXT_SANITY_PROJECT_ID production
vercel env add NUXT_RESEND_API_KEY production   # maps to runtimeConfig.resendApiKey
vercel env add NUXT_CONTACT_TO production
vercel               # preview deployment
```

Push repo to GitHub and connect it in the Vercel project for CI deploys on push.

- [ ] **Step 2: Content rebuild hook**

Create a Vercel Deploy Hook (Project → Settings → Git → Deploy Hooks); in the Sanity manage console add a webhook (on publish of any document) pointing at the deploy hook URL, so editors publishing in Studio trigger a redeploy that re-prerenders the pages.

- [ ] **Step 3: Preview verification**

On the Vercel preview URL verify: both pages render, `/about-us` 301s, contact form delivers email (Resend domain `doorcountymutualaid.org` verified with DKIM records — do this before cutover so the `from:` address works), Lighthouse pass.

- [ ] **Step 4: Write cutover runbook**

```markdown
<!-- docs/CUTOVER.md -->
1. Lower DNS TTL to 300s at current DNS host ~24h before cutover.
2. `vercel promote` (or deploy to production) so the prod deployment is ready.
3. In Vercel: add custom domains doorcountymutualaid.org + www; note the records it asks for.
4. At the DNS host (check whether DNS is Wix-managed; if so, move DNS to the registrar or Vercel DNS first):
   - apex A → 76.76.21.21 (or the value Vercel shows); www CNAME → cname.vercel-dns.com
   - keep MX/Google records untouched (org uses Gmail)
   - add Resend DKIM/SPF records
5. Verify HTTPS cert issued; test both pages, redirect, and form on the live domain.
6. Keep the Wix subscription until the new site has been live and stable ~2 weeks, then cancel (do NOT delete the Wix site immediately — it's the only content backup besides Sanity).
```

- [ ] **Step 5: Commit + deploy**

```bash
git add -A && git commit -m "chore: cutover runbook"
git push
vercel --prod
```

Execute the runbook with the org's registrar/Wix account owner (requires their credentials — coordinate, don't automate).

---

## Self-Review Notes

- **Coverage:** every section found in the site inventory maps to a task (hero/mission/how-it-works/stats/activities → Task 6, contact → Task 7, fridge page → Task 8, global chrome → Task 5, content itself → Task 3, redirect + SEO parity → Tasks 8–9, hosting/domain → Task 10).
- **Open items that need a human:** exact Facebook URL (Task 3), Wix image downloads (Task 3), Resend account + domain verification, registrar/Wix credentials for DNS (Task 10). None block Tasks 1–2.
- **Type consistency:** `Card`/`Cta`/`SiteSettings`/`HomePage`/`FridgePage` defined once in Task 4 and consumed by name in Tasks 5–8; component prop signatures listed in each task's Interfaces block match usage in `index.vue`/`full-hearts-fridge.vue`.
