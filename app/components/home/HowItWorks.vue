<script setup lang="ts">
import type { Card } from '~/types/content'
defineProps<{ heading: string; intro: string; cards: Card[] }>()
</script>

<template>
  <section class="how">
    <h2 class="display">{{ heading }}</h2>
    <p class="intro">{{ intro }}</p>
    <div class="cards">
      <article v-for="c in cards" :key="c._key">
        <h3>{{ c.title }}</h3>
        <p>{{ c.body }}</p>
        <a v-if="c.cta" class="btn btn-dark" :href="c.cta.href">{{ c.cta.label }}</a>
      </article>
    </div>
  </section>
</template>

<style scoped>
.how { padding: 4rem 2rem; }
.how h2 { font-size: clamp(2rem, 5vw, 3.5rem); margin: 0 0 1rem; }
.intro { max-width: 60ch; }
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}
.cards article { display: flex; flex-direction: column; gap: 1rem; align-items: flex-start; }
.cards h3 { margin: 0; font-size: 1.4rem; }
.cards p { margin: 0; flex: 1; }
</style>
