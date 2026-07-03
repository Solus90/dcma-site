// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/sanity', '@nuxt/fonts'],
  css: ['~/assets/css/main.css'],
  fonts: {
    families: [{ name: 'Archivo', weights: [400, 600, 700, 900] }],
  },
  sanity: {
    projectId: process.env.NUXT_SANITY_PROJECT_ID,
    dataset: 'production',
    apiVersion: '2026-07-01',
    useCdn: true,
  },
})
