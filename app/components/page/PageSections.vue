<script setup lang="ts">
import type { ContactFormCopy, PageSection, SiteSettings } from '~/types/content'

defineProps<{
  sections: PageSection[]
  settings: SiteSettings
  contactForm: ContactFormCopy
}>()
</script>

<template>
  <template v-for="section in sections" :key="section._key">
    <HomeHero
      v-if="section._type === 'heroSection'"
      :heading="section.heading"
      :tagline="section.tagline"
      :image-url="section.imageUrl"
      :image-alt="section.imageAlt || section.heading"
      :cta="section.cta"
      :secondary-cta="section.secondaryCta"
    />

    <PageSplitSection
      v-else-if="section._type === 'splitSection'"
      :eyebrow="section.eyebrow"
      :heading="section.heading"
      :body="section.body"
      :image-url="section.imageUrl"
      :image-alt="section.imageAlt || section.heading"
      :image-position="section.imagePosition"
    />

    <PageProseSection
      v-else-if="section._type === 'proseSection'"
      :eyebrow="section.eyebrow"
      :heading="section.heading"
      :body="section.body"
    />

    <HomeHowItWorks
      v-else-if="section._type === 'cardGridSection' && section.style !== 'photos'"
      :heading="section.heading || ''"
      :intro="section.intro || ''"
      :cards="section.cards"
    />

    <HomeActivityGrid
      v-else-if="section._type === 'cardGridSection'"
      :heading="section.heading || ''"
      :activities="section.cards"
    />

    <FridgeValueList
      v-else-if="section._type === 'valuesSection'"
      :heading="section.heading || ''"
      :values="section.values"
    />

    <FridgeClosingCta
      v-else-if="section._type === 'ctaSection'"
      :heading="section.heading || ''"
      :note="section.note || ''"
      :cta="section.cta"
      :secondary-cta="section.secondaryCta"
    />

    <ContactSection
      v-else-if="section._type === 'contactSectionBlock'"
      :heading="section.heading || 'Get in Touch'"
      :form-copy="contactForm"
      :settings="settings"
    />

    <HomeStatsMarquee
      v-else-if="section._type === 'statsSection'"
      :stats="section.stats"
      :aria-label="section.ariaLabel || 'Community impact'"
    />
  </template>
</template>
