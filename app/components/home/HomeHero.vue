<script setup lang="ts">
import type { Cta } from '~/types/content'
defineProps<{ heading: string; tagline: string; imageUrl: string; cta: Cta }>()
</script>

<template>
  <section class="hero">
    <img :src="imageUrl" alt="" class="hand">
    <div class="copy">
      <h1 class="display">{{ heading }}</h1>
      <p class="eyebrow">{{ tagline }}</p>
      <a class="btn" :href="cta.href">{{ cta.label }}</a>
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
h1 {
  font-size: clamp(3rem, 9vw, 8.5rem);
  text-align: right;
  margin: 0 0 1.5rem;
}
.copy { display: flex; flex-direction: column; align-items: flex-end; gap: 1.5rem; }
.copy p { margin: 0; }
.hand { max-width: 100%; height: auto; }
@media (max-width: 768px) {
  .hero { grid-template-columns: 1fr; }
  h1 { text-align: left; }
  .copy { align-items: flex-start; }
}
</style>
