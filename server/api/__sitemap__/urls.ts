import { cmsPageRoutes } from '#shared/fetchCmsPageSlugs'

export default defineEventHandler(async () => {
  const routes = await cmsPageRoutes()
  return routes.map(loc => ({ loc }))
})
