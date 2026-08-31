// On-demand ISR revalidation. A Sanity webhook POSTs here on publish; we bust
// the affected route(s) so the change is live in seconds instead of ~60s.
// Setup (webhook URL, secret, projection) is in docs/DEPLOYMENT.md.
import { revalidatePathsForDoc } from '../utils/revalidatePaths'

export default defineEventHandler(async (event) => {
  const { revalidateSecret, revalidateToken } = useRuntimeConfig(event)

  if (!revalidateSecret || !revalidateToken) {
    throw createError({ statusCode: 501, statusMessage: 'Revalidation is not configured' })
  }
  if (getHeader(event, 'authorization') !== `Bearer ${revalidateSecret}`) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const body = await readBody<{ _type?: string, slug?: string }>(event)
  const paths = revalidatePathsForDoc(body?._type, body?.slug)
  if (!paths.length) return { revalidated: [] }

  // Hitting each route with Vercel's bypass header regenerates its ISR cache.
  const origin = getRequestURL(event).origin
  await Promise.all(
    paths.map(path =>
      $fetch(path, { baseURL: origin, headers: { 'x-prerender-revalidate': revalidateToken } })
        .catch((err) => { console.error(`revalidate ${path} failed`, err) }),
    ),
  )

  return { revalidated: paths }
})
