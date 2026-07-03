import { createClient, type SanityClient } from '@sanity/client'

export function getSanityWriteClient(event?: Parameters<typeof useRuntimeConfig>[0]): SanityClient {
  const config = useRuntimeConfig(event)
  const token = config.sanityWriteToken || process.env.SANITY_TOKEN

  if (!token) {
    throw createError({ statusCode: 500, statusMessage: 'Contact form is not configured' })
  }

  const projectId = process.env.NUXT_SANITY_PROJECT_ID
  if (!projectId) {
    throw createError({ statusCode: 500, statusMessage: 'Sanity project is not configured' })
  }

  return createClient({
    projectId,
    dataset: 'production',
    apiVersion: '2026-07-01',
    token,
    useCdn: false,
  })
}
