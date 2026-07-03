// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/sanity', '@nuxt/fonts', '@nuxtjs/sitemap'],
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
  },
  runtimeConfig: {
    resendApiKey: '',
    contactTo: 'mutualaiddoorcounty@gmail.com',
  },
  // Vercel is auto-detected by Nitro at deploy time — no preset needed locally.
  // Pages stay static via prerender rules; /api/contact becomes a Vercel Function.
  routeRules: {
    '/': { prerender: true },
    '/full-hearts-fridge': { prerender: true },
    '/about-us': { redirect: { to: '/full-hearts-fridge', statusCode: 301 } },
  },
  sanity: {
    projectId: process.env.NUXT_SANITY_PROJECT_ID,
    dataset: 'production',
    apiVersion: '2026-07-01',
    useCdn: true,
  },
})
