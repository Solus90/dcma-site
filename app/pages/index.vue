<script setup lang="ts">
const { data: page } = await useHomePage()
const { data: settings } = await useSiteSettings()
const { data: latestUpdate } = await useLatestUpdate()

useSeoMeta({
  title: () => page.value?.seo.title,
  description: () => page.value?.seo.description,
})

const requestCta = computed(() =>
  page.value?.howItWorksCards.find(c => c._key === 'request')?.cta,
)

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  })
}
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
    <HomeStatsMarquee v-if="page.stats?.length" :stats="page.stats" :aria-label="page.statsAriaLabel" />
    <HomeActivityGrid :heading="page.activitiesHeading" :activities="page.activities" />

    <section v-if="latestUpdate" class="latest-update" aria-labelledby="latest-update-heading">
      <div class="latest-update-inner">
        <div class="latest-update-meta">
          <span class="eyebrow">Latest Update</span>
          <span v-if="latestUpdate.category" class="badge">{{ latestUpdate.category }}</span>
          <time :datetime="latestUpdate.publishedAt">{{ formatDate(latestUpdate.publishedAt) }}</time>
        </div>
        <h2 id="latest-update-heading" class="latest-update-title display">{{ latestUpdate.title }}</h2>
        <p class="latest-update-summary">{{ latestUpdate.summary }}</p>
        <div class="latest-update-actions">
          <NuxtLink to="/updates" class="btn">See all updates</NuxtLink>
          <a v-if="latestUpdate.cta" :href="latestUpdate.cta.href" class="update-cta-link">
            {{ latestUpdate.cta.label }}
          </a>
        </div>
      </div>
    </section>

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

.latest-update {
  background: var(--periwinkle);
  padding: 3.5rem 2rem;
}

.latest-update-inner {
  max-width: 72rem;
  margin-inline: auto;
}

.latest-update-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.badge {
  background: var(--navy);
  color: #fff;
  padding: 0.2rem 0.5rem;
  font-weight: 700;
  font-size: 0.7rem;
}

.latest-update-title {
  font-size: clamp(1.75rem, 5vw, 3.5rem);
  margin: 0 0 1rem;
  text-wrap: balance;
  max-width: 22ch;
}

.latest-update-summary {
  max-width: 60ch;
  line-height: 1.65;
  margin: 0 0 2rem;
  text-wrap: pretty;
}

.latest-update-actions {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.update-cta-link {
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--navy);
  text-decoration: none;
  padding-bottom: 2px;
  border-bottom: 2px solid currentColor;
}

.update-cta-link:hover {
  opacity: 0.7;
}

.update-cta-link:focus-visible {
  outline: 3px solid var(--navy);
  outline-offset: 2px;
}

@media (max-width: 768px) {
  .latest-update {
    padding: 2.5rem 1.25rem;
  }
}
</style>
