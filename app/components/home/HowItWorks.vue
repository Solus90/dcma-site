<script setup lang="ts">
import type { Card } from '~/types/content'

const props = defineProps<{ heading: string; intro: string; cards: Card[] }>()

const orderedCards = computed(() => {
  const cards = [...props.cards]
  const requestIdx = cards.findIndex(c => c._key === 'request')
  if (requestIdx > 0) {
    const [request] = cards.splice(requestIdx, 1)
    cards.unshift(request)
  }
  return cards
})
</script>

<template>
  <section class="how">
    <h2 class="display">{{ heading }}</h2>
    <p class="intro">{{ intro }}</p>
    <div class="cards">
      <article
        v-for="c in orderedCards"
        :key="c._key"
        :class="{ featured: c._key === 'request' }"
      >
        <img
          v-if="c.imageUrl"
          :src="c.imageUrl"
          :alt="c.imageAlt || c.title"
          loading="lazy"
          class="photo"
        >
        <h3>{{ c.title }}</h3>
        <p>{{ c.body }}</p>
        <a v-if="c.cta" class="btn btn-dark" :href="c.cta.href" v-bind="linkTarget(c.cta.href)">{{ c.cta.label }}</a>
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
.cards article {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: flex-start;
}
.photo {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  display: block;
}
.cards article.featured {
  background: color-mix(in oklab, var(--slate) 8%, var(--cream));
  padding: 1.5rem;
}
.cards h3 { margin: 0; font-size: 1.4rem; }
.cards p { margin: 0; flex: 1; }
</style>
