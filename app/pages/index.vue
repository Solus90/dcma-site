<script setup lang="ts">
const { data: page } = await useHomePage()
const { data: settings } = await useSiteSettings()

useSeoMeta({
  title: () => page.value?.seo.title,
  description: () => page.value?.seo.description,
})

const requestCta = computed(() =>
  page.value?.howItWorksCards.find(c => c._key === 'request')?.cta,
)
</script>

<template>
  <main v-if="page && settings" id="main-content">
    <HomeHero
      :heading="page.heroHeading"
      :tagline="page.heroTagline"
      :image-url="page.heroImageUrl"
      :image-alt="page.heroImageAlt || page.heroHeading"
      :cta="requestCta ?? page.heroCta"
      :secondary-cta="requestCta ? page.heroCta : undefined"
    />
    <section class="mission">
      <div v-if="page.missionImageUrl" class="mission-media">
        <img
          :src="page.missionImageUrl"
          :alt="page.missionImageAlt || page.missionHeading"
          loading="lazy"
          class="mission-photo"
        >
      </div>
      <div class="mission-copy">
        <p class="eyebrow">{{ page.missionEyebrow }}</p>
        <h2 class="display">{{ page.missionHeading }}</h2>
        <p class="body">{{ page.missionBody }}</p>
      </div>
    </section>
    <HomeHowItWorks
      :heading="page.howItWorksHeading"
      :intro="page.howItWorksIntro"
      :cards="page.howItWorksCards"
    />
    <HomeStatsMarquee :stats="page.stats" :aria-label="page.statsAriaLabel" />
    <HomeActivityGrid :heading="page.activitiesHeading" :activities="page.activities" />
    <ContactSection
      :heading="page.contactHeading"
      :form-copy="page.contactForm"
      :settings="settings"
    />
  </main>
</template>

<style scoped>
.mission {
  padding: 4rem 2rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
}
.mission-photo {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  display: block;
}
.mission h2 { font-size: clamp(2rem, 6vw, 4.5rem); margin: 0.5rem 0 1.5rem; text-wrap: balance; }
.mission .body { max-width: 65ch; line-height: 1.6; text-wrap: pretty; }
@media (max-width: 768px) {
  .mission { grid-template-columns: 1fr; }
}
</style>
