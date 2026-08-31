// https://nuxt.com/docs/api/configuration/nuxt-config
import { cmsPageRoutes } from './shared/fetchCmsPageSlugs'

const isProd = process.env.NODE_ENV === 'production'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/sanity', '@nuxt/fonts', ...(isProd ? ['@nuxtjs/sitemap'] : [])],
  site: {
    url: 'https://www.doorcountymutualaid.org',
    name: 'Door County Mutual Aid',
  },
  app: {
    head: { htmlAttrs: { lang: 'en' } },
  },
  css: ['~/assets/css/main.css'],
  fonts: {
    families: [{ name: 'Archivo', weights: [400, 600, 700, 900] }],
    devtools: false,
  },
  runtimeConfig: {
    sanityWriteToken: '',
  },
  // Vercel is auto-detected by Nitro at deploy time — no preset needed locally.
  // Content pages use stale-while-revalidate (ISR on Vercel) so CMS edits show
  // up on their own without a rebuild — see docs/DEPLOYMENT.md. /api/contact is
  // a Vercel Function.
  routeRules: {
    '/': { swr: 3600 },
    '/about': { swr: 3600 },
    '/what-is-mutual-aid': { swr: 3600 },
    '/projects': { swr: 3600 },
    '/projects/full-hearts-fridge': { swr: 3600 },
    '/updates': { swr: 600 }, // events change more often
    '/full-hearts-fridge': { redirect: { to: '/projects/full-hearts-fridge', statusCode: 301 } },
    '/about-us': { redirect: { to: '/projects/full-hearts-fridge', statusCode: 301 } },
  },
  hooks: {
    async 'nitro:config'(nitroConfig) {
      if (!isProd) return
      const routes = await cmsPageRoutes()
      if (!routes.length) return

      // CMS "page" documents (contact, get-involved, financials, …) — same
      // SWR treatment as the routes above.
      nitroConfig.routeRules = nitroConfig.routeRules ?? {}
      for (const route of routes) {
        nitroConfig.routeRules[route] = { swr: 3600 }
      }
    },
  },
  ...(isProd && {
    sitemap: {
      sources: [
        async () => {
          const routes = await cmsPageRoutes()
          return routes.map(loc => ({ loc }))
        },
      ],
    },
  }),
  sanity: {
    projectId: process.env.NUXT_SANITY_PROJECT_ID,
    dataset: 'production',
    apiVersion: '2026-07-01',
    useCdn: isProd,
  },
})
