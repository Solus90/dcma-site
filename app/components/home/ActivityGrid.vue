<script setup lang="ts">
import type { Card } from '~/types/content'
defineProps<{ heading: string; activities: Card[] }>()
</script>

<template>
  <section class="grid" aria-labelledby="activities-heading">
    <h2 id="activities-heading" class="display">{{ heading }}</h2>
    <div class="items">
      <article v-for="a in activities" :key="a._key">
        <img
          v-if="a.imageUrl"
          :src="a.imageUrl"
          :alt="a.imageAlt || a.title"
          loading="lazy"
          class="photo"
        >
        <h3>{{ a.title }}</h3>
        <p>{{ a.body }}</p>
      </article>
    </div>
  </section>
</template>

<style scoped>
.grid { padding: 4rem 2rem; }
.grid h2 {
  font-size: clamp(2rem, 5vw, 3.5rem);
  margin: 0 0 2rem;
}
.items {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 2rem;
}
.items article { display: flex; flex-direction: column; gap: 0.75rem; }
.photo {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  display: block;
}
.items h3 { margin: 0; font-size: 1.3rem; }
.items p { margin: 0; }
</style>
