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
  // Pages stay static via prerender rules; /api/contact becomes a Vercel Function.
  routeRules: {
    '/': { prerender: true },
    '/about': { prerender: true },
    '/projects': { prerender: true },
    '/projects/full-hearts-fridge': { prerender: true },
    '/full-hearts-fridge': { redirect: { to: '/projects/full-hearts-fridge', statusCode: 301 } },
    '/about-us': { redirect: { to: '/projects/full-hearts-fridge', statusCode: 301 } },
  },
  hooks: {
    async 'nitro:config'(nitroConfig) {
      if (!isProd) return
      const routes = await cmsPageRoutes()
      if (!routes.length) return

      nitroConfig.prerender = nitroConfig.prerender ?? {}
      const existing = nitroConfig.prerender.routes ?? []
      nitroConfig.prerender.routes = [...existing, ...routes]
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
