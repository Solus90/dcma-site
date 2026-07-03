<script setup lang="ts">
const route = useRoute()
const slug = String(route.params.slug)

const { data: page } = await useCmsPage(slug)
const { data: settings } = await useSiteSettings()
const { data: home } = await useHomePage()

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found' })
}

useSeoMeta({
  title: () => page.value?.seo?.title || `${page.value?.title} | Door County Mutual Aid`,
  description: () => page.value?.seo?.description,
})
</script>

<template>
  <main v-if="page && settings && home" id="main-content">
    <PageSections
      :sections="page.sections"
      :settings="settings"
      :contact-form="home.contactForm"
    />
  </main>
</template>
