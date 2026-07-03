import { createClient } from '@sanity/client'

export async function fetchCmsPageSlugs(): Promise<string[]> {
  const projectId = process.env.NUXT_SANITY_PROJECT_ID
  if (!projectId) return []

  try {
    const client = createClient({
      projectId,
      dataset: 'production',
      apiVersion: '2026-07-01',
      useCdn: true,
    })
    return await client.fetch<string[]>(
      `*[_type == "page" && defined(slug.current)].slug.current`,
    )
  }
  catch {
    return []
  }
}

export async function cmsPageRoutes(): Promise<string[]> {
  const slugs = await fetchCmsPageSlugs()
  return slugs.map(slug => `/${slug}`)
}
