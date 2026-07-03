<script setup lang="ts">
import type { Card } from '~/types/content'
defineProps<{ activities: Card[] }>()
</script>

<template>
  <section class="grid">
    <article v-for="a in activities" :key="a._key">
      <h3>{{ a.title }}</h3>
      <p>{{ a.body }}</p>
    </article>
  </section>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 2rem;
  padding: 4rem 2rem;
}
.grid h3 { margin: 0 0 0.5rem; font-size: 1.3rem; }
.grid p { margin: 0; }
</style>
