// Targeted seed: creates ONLY the mutualAidPage singleton from code defaults
// and retires the old generic page-what-is-mutual-aid document.
// Safe to run against production without touching any other content.
// Run: pnpm run seed:mutual-aid   (reads NUXT_SANITY_PROJECT_ID and SANITY_TOKEN from .env)
import { createClient } from '@sanity/client'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { DEFAULT_MUTUAL_AID_PAGE } from '../app/utils/mutualAidPageDefaults.ts'

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

const client = createClient({ projectId, dataset: 'production', token, apiVersion: '2026-07-01', useCdn: false })

const M = DEFAULT_MUTUAL_AID_PAGE

async function run() {
  const existing = await client.fetch<string | null>(`*[_id == "mutualAidPage"][0]._id`)
  if (existing) {
    console.log('mutualAidPage already exists — leaving it alone. Edit it in Sanity Studio.')
  }
  else {
    console.log('Creating mutualAidPage from defaults…')
    await client.create({
      _id: 'mutualAidPage',
      _type: 'mutualAidPage',
      heroEyebrow: M.heroEyebrow,
      heroHeading: M.heroHeading,
      lede: M.lede,
      kropotkinHook: M.kropotkinHook,
      solidarityHeading: M.solidarityHeading,
      solidarityParagraphs: [...M.solidarityParagraphs],
      whyHeading: M.whyHeading,
      whyParagraphs: [...M.whyParagraphs],
      looksLikeHeading: M.looksLikeHeading,
      looksLikeIntro: M.looksLikeIntro,
      looksLikeItems: [...M.looksLikeItems],
      looksLikeOutro: M.looksLikeOutro,
      looksLikeCta: { ...M.looksLikeCta },
      organizedHeading: M.organizedHeading,
      organizedParagraphs: [...M.organizedParagraphs],
      securityCta: { ...M.securityCta },
      questionsHeading: M.questionsHeading,
      questions: M.questions.map((q, i) => ({ _key: `q-${i}`, _type: 'mutualAidQuestion' as const, ...q })),
      readingHeading: M.readingHeading,
      readingIntro: M.readingIntro,
      readingNote: M.readingNote,
      books: M.books.map((b, i) => ({ _key: `book-${i}`, _type: 'mutualAidBook' as const, ...b })),
      readingClosing: M.readingClosing,
      readingCta: { ...M.readingCta },
      ctaHeading: M.ctaHeading,
      ctaBody: M.ctaBody,
      cta: { ...M.cta },
      seo: { ...M.seo },
    })
    console.log('  ✓ mutualAidPage created')
  }

  const orphan = await client.fetch<string | null>(`*[_id == "page-what-is-mutual-aid"][0]._id`)
  if (orphan) {
    await client.delete('page-what-is-mutual-aid')
    console.log('  ✓ removed old page-what-is-mutual-aid document')
  }

  console.log('Done.')
}

run().catch((err) => { console.error(err); process.exit(1) })
