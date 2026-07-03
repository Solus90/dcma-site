<script setup lang="ts">
const { data: page } = await useFridgePage()
useSeoMeta({
  title: () => page.value?.seo.title,
  description: () => page.value?.seo.description,
})
</script>

<template>
  <main v-if="page">
    <section class="intro">
      <h1 class="display">{{ page.heading }}</h1>
      <p class="lede">{{ page.intro }}</p>
      <a class="btn btn-dark" :href="page.cta.href">{{ page.cta.label }}</a>
    </section>
    <ValueList :values="page.values" />
  </main>
</template>

<style scoped>
.intro { padding: 4rem 2rem; max-width: 900px; }
.intro h1 { font-size: clamp(2.5rem, 6vw, 5rem); margin: 0 0 1.5rem; }
.lede { font-size: 1.3rem; line-height: 1.5; font-weight: 600; margin: 0 0 2rem; }
</style>
