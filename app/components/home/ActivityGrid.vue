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
        <NuxtLink v-if="a.cta?.href?.startsWith('/')" :to="a.cta.href" class="card-link">{{ a.cta.label }}</NuxtLink>
        <a v-else-if="a.cta?.href" :href="a.cta.href" class="card-link">{{ a.cta.label }}</a>
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
.card-link {
  display: inline-block;
  margin-top: 0.25rem;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--navy);
  text-decoration: none;
  padding-bottom: 2px;
  border-bottom: 2px solid currentColor;
}
.card-link:hover { opacity: 0.7; }
.card-link:focus-visible { outline: 3px solid var(--navy); outline-offset: 2px; }
</style>
