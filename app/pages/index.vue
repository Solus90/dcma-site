<script setup lang="ts">
const { data: page } = await useHomePage()
useSeoMeta({
  title: () => page.value?.seo.title,
  description: () => page.value?.seo.description,
})
</script>

<template>
  <main v-if="page">
    <HomeHero
      :heading="page.heroHeading"
      :tagline="page.heroTagline"
      :image-url="page.heroImageUrl"
      :cta="page.heroCta"
    />
    <section class="mission">
      <p class="eyebrow">{{ page.missionEyebrow }}</p>
      <h2 class="display">{{ page.missionHeading }}</h2>
      <p class="body">{{ page.missionBody }}</p>
    </section>
    <HomeHowItWorks
      :heading="page.howItWorksHeading"
      :intro="page.howItWorksIntro"
      :cards="page.howItWorksCards"
    />
    <HomeStatsMarquee :stats="page.stats" />
    <HomeActivityGrid :activities="page.activities" />
    <ContactSection :heading="page.contactHeading" />
  </main>
</template>

<style scoped>
.mission { padding: 4rem 2rem; }
.mission h2 { font-size: clamp(2rem, 6vw, 4.5rem); margin: 0.5rem 0 1.5rem; }
.mission .body { max-width: 65ch; line-height: 1.6; }
</style>
