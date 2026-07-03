<script setup lang="ts">
import type { Cta } from '~/types/content'

defineProps<{
  heading: string
  tagline?: string
  imageUrl?: string
  imageAlt?: string
  cta?: Cta
  secondaryCta?: Cta
}>()
</script>

<template>
  <section class="hero" :class="{ 'hero--text-only': !imageUrl }">
    <img
      v-if="imageUrl"
      :src="imageUrl"
      :alt="imageAlt || heading"
      class="hand"
    >
    <div class="copy">
      <h1 class="display">{{ heading }}</h1>
      <p v-if="tagline" class="eyebrow">{{ tagline }}</p>
      <div v-if="cta || secondaryCta" class="actions">
        <a
          v-if="cta"
          class="btn btn-dark"
          :href="cta.href"
          v-bind="linkTarget(cta.href)"
        >{{ cta.label }}</a>
        <a
          v-if="secondaryCta"
          class="btn btn-outline"
          :href="secondaryCta.href"
          v-bind="linkTarget(secondaryCta.href)"
        >{{ secondaryCta.label }}</a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
  align-items: center;
  padding: 3rem 2rem;
  min-height: 70vh;
}
.hero--text-only {
  grid-template-columns: 1fr;
  min-height: auto;
}
h1 {
  font-size: clamp(3rem, 9vw, 8.5rem);
  text-align: right;
  margin: 0 0 1.5rem;
  text-wrap: balance;
}
.hero--text-only h1 {
  text-align: left;
}
.copy { display: flex; flex-direction: column; align-items: flex-end; gap: 1.5rem; }
.hero--text-only .copy { align-items: flex-start; width: 100%; }
.copy p { margin: 0; max-width: 40ch; text-align: right; }
.hero--text-only .copy p { text-align: left; }
.actions { display: flex; flex-wrap: wrap; gap: 0.75rem; justify-content: flex-end; }
.hero--text-only .actions { justify-content: flex-start; width: 100%; }
.hand { max-width: 100%; height: auto; }
.btn-outline {
  background: transparent;
  color: var(--navy);
  box-shadow: inset 0 0 0 2px var(--navy);
}
.btn-outline:focus-visible { outline: 3px solid var(--navy); outline-offset: 2px; }
@media (max-width: 768px) {
  .hero { grid-template-columns: 1fr; }
  h1 { text-align: left; }
  .copy { align-items: flex-start; width: 100%; }
  .copy p { text-align: left; }
  .actions { justify-content: flex-start; width: 100%; }
  .actions .btn { width: 100%; text-align: center; }
}
</style>
