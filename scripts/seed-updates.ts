// Targeted seed: creates ONLY the updatesPage singleton from code defaults.
// Safe to run against production without touching any other content.
// Run: pnpm run seed:updates   (reads NUXT_SANITY_PROJECT_ID and SANITY_TOKEN from .env)
import { createClient } from '@sanity/client'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { DEFAULT_UPDATES_PAGE } from '../app/utils/updatesPageDefaults.ts'

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

const U = DEFAULT_UPDATES_PAGE

async function run() {
  const existing = await client.fetch<string | null>(`*[_id == "updatesPage"][0]._id`)
  if (existing) {
    console.log('updatesPage already exists — leaving it alone. Edit it in Sanity Studio.')
  }
  else {
    console.log('Creating updatesPage from defaults…')
    await client.create({
      _id: 'updatesPage',
      _type: 'updatesPage',
      heroEyebrow: U.heroEyebrow,
      heroHeading: U.heroHeading,
      lede: U.lede,
      listAriaLabel: U.listAriaLabel,
      emptyMessage: U.emptyMessage,
      seo: { ...U.seo },
    })
    console.log('  ✓ updatesPage created')
  }

  console.log('Done.')
}

run().catch((err) => { console.error(err); process.exit(1) })
