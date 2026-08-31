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
  // Content pages use ISR with a 60s window so CMS edits show up on their own,
  // ~a minute after publishing, without a rebuild — see docs/DEPLOYMENT.md.
  // (Must be `isr`, not `swr` — this Nitro version's Vercel preset ignores a
  // top-level `swr` route rule.) /api/contact is a Vercel Function.
  routeRules: {
    '/': { isr: 60 },
    '/about': { isr: 60 },
    '/what-is-mutual-aid': { isr: 60 },
    '/projects': { isr: 60 },
    '/projects/full-hearts-fridge': { isr: 60 },
    '/updates': { isr: 60 },
    '/full-hearts-fridge': { redirect: { to: '/projects/full-hearts-fridge', statusCode: 301 } },
    '/about-us': { redirect: { to: '/projects/full-hearts-fridge', statusCode: 301 } },
  },
  hooks: {
    async 'nitro:config'(nitroConfig) {
      if (!isProd) return
      const routes = await cmsPageRoutes()
      if (!routes.length) return

      // CMS "page" documents (contact, get-involved, financials, …) — same
      // ISR treatment as the routes above.
      nitroConfig.routeRules = nitroConfig.routeRules ?? {}
      for (const route of routes) {
        nitroConfig.routeRules[route] = { isr: 60 }
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
