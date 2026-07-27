// Surgical patch — updates nav structure, fridge href references, and fridge hero image.
// Run: pnpm run patch
import { createClient } from '@sanity/client'
import { createReadStream, existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..')

function loadEnvFile(path: string) {
  if (!existsSync(path)) return
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '')
    if (process.env[key] === undefined) process.env[key] = value
  }
}

loadEnvFile(join(ROOT, '.env'))

const projectId = process.env.NUXT_SANITY_PROJECT_ID || '1qb86j9s'
const token = process.env.SANITY_TOKEN

if (!token) {
  console.error('Missing SANITY_TOKEN. Add it to .env or export it before running.')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset: 'production',
  token,
  apiVersion: '2026-07-01',
  useCdn: false,
})

const NAV = [
  { _key: 'home', label: 'Home', href: '/' },
  {
    _key: 'about',
    label: 'About Us',
    href: '/about',
    children: [
      { _key: 'mission', label: 'Our Mission', href: '/about' },
      { _key: 'financials', label: 'Financials', href: '/financials' },
      { _key: 'contact', label: 'Contact', href: '/contact' },
    ],
  },
  {
    _key: 'projects',
    label: 'Projects',
    href: '/projects',
    children: [
      { _key: 'dcma-projects', label: 'DCMA Projects', href: '/projects' },
      { _key: 'updates', label: 'Updates', href: '/updates' },
    ],
  },
  { _key: 'get-involved', label: 'Get Involved', href: '/get-involved' },
]

async function run() {
  // ── 1. Nav structure ────────────────────────────────────────────────────────
  console.log('Patching siteSettings nav…')
  await client.patch('siteSettings').set({ navLinks: NAV }).commit()
  console.log('  ✓ navLinks updated')

  // ── 2. homePage activities card href ───────────────────────────────────────
  console.log('Patching homePage activities…')
  const home = await client.fetch<{ activities: { _key: string; cta?: { href?: string } }[] }>(
    `*[_id == "homePage"][0]{ activities }`,
  )
  if (home?.activities) {
    const patched = home.activities.map(card => ({
      ...card,
      ...(card.cta?.href === '/full-hearts-fridge'
        ? { cta: { ...card.cta, href: '/projects/full-hearts-fridge' } }
        : {}),
    }))
    await client.patch('homePage').set({ activities: patched }).commit()
    console.log('  ✓ homePage activities updated')
  }

  // ── 3. Projects page card grid hrefs ───────────────────────────────────────
  console.log('Patching projects page cards…')
  const projectsPage = await client.fetch<{
    _id: string
    sections: { _key: string; _type: string; cards?: { _key: string; cta?: { href?: string } }[] }[]
  }>(`*[_id == "page-projects"][0]{ _id, sections }`)

  if (projectsPage?.sections) {
    const patchedSections = projectsPage.sections.map(section => ({
      ...section,
      ...(section.cards
        ? {
            cards: section.cards.map(card => ({
              ...card,
              ...(card.cta?.href === '/full-hearts-fridge'
                ? { cta: { ...card.cta, href: '/projects/full-hearts-fridge' } }
                : {}),
            })),
          }
        : {}),
    }))
    await client.patch('page-projects').set({ sections: patchedSections }).commit()
    console.log('  ✓ projects page cards updated')
  }

  // ── 4 & 5. Fridge hero image + projects page card image ────────────────────
  const fridgeHeroPath = join(ROOT, 'assets/source/Food_Rescue.avif')
  if (existsSync(fridgeHeroPath)) {
    console.log('Uploading Food_Rescue.avif…')
    const asset = await client.assets.upload('image', createReadStream(fridgeHeroPath), {
      filename: 'Food_Rescue.avif',
    })
    const imageRef = {
      _type: 'image',
      asset: { _type: 'reference', _ref: asset._id },
      alt: 'Volunteers unload rescued food donations',
    }

    await client.patch('fridgePage').set({ heroImage: imageRef }).commit()
    console.log('  ✓ fridgePage heroImage updated')

    // Update the Full Hearts Fridge card image on the projects page
    console.log('Patching projects page Full Hearts Fridge card image…')
    const projectsDoc = await client.fetch<{
      sections: { _key: string; _type: string; cards?: { _key: string; [k: string]: unknown }[] }[]
    }>(`*[_id == "page-projects"][0]{ sections }`)

    if (projectsDoc?.sections) {
      const patchedSections = projectsDoc.sections.map(section => ({
        ...section,
        ...(section.cards
          ? {
              cards: section.cards.map(card =>
                card._key === 'c1' ? { ...card, image: imageRef } : card,
              ),
            }
          : {}),
      }))
      await client.patch('page-projects').set({ sections: patchedSections }).commit()
      console.log('  ✓ projects page Full Hearts Fridge card image updated')
    }

    // Also update the Full Hearts Fridge card image in homePage activities
    console.log('Patching homePage Full Hearts Fridge activity card image…')
    const homeDoc = await client.fetch<{
      activities: { _key: string; [k: string]: unknown }[]
    }>(`*[_id == "homePage"][0]{ activities }`)

    if (homeDoc?.activities) {
      const patchedActivities = homeDoc.activities.map(card =>
        card._key === 'a1' ? { ...card, image: imageRef } : card,
      )
      await client.patch('homePage').set({ activities: patchedActivities }).commit()
      console.log('  ✓ homePage Full Hearts Fridge activity card image updated')
    }
  }
  else {
    console.warn('  ⚠ Food_Rescue.avif not found at assets/source — skipping image patches')
  }

  console.log('\nDone. All patches applied.')
}

run().catch((err) => { console.error(err); process.exit(1) })
