<script setup lang="ts">
import type { Card } from '~/types/content'

defineProps<{ heading: string; values: Card[] }>()

const brokenImages = ref<Set<string>>(new Set())

function onImageError(key: string) {
  brokenImages.value.add(key)
}
</script>

<template>
  <section class="values" aria-labelledby="values-heading">
    <h2 id="values-heading" class="display">{{ heading }}</h2>
    <article
      v-for="(v, i) in values"
      :key="v._key"
      class="value"
      :class="{ reverse: i % 2 === 1 }"
    >
      <img
        v-if="v.imageUrl && !brokenImages.has(v._key)"
        :src="v.imageUrl"
        :alt="v.imageAlt || ''"
        loading="lazy"
        width="640"
        height="480"
        sizes="(max-width: 768px) 100vw, min(640px, 45vw)"
        class="photo"
        @error="onImageError(v._key)"
      >
      <div class="text">
        <h3>{{ v.title }}</h3>
        <p>{{ v.body }}</p>
      </div>
    </article>
  </section>
</template>

<style scoped>
.values {
  padding: 4rem 2rem;
  max-width: 1100px;
  margin-inline: auto;
}
.values h2 {
  font-size: clamp(2rem, 5vw, 3.5rem);
  margin: 0 0 2.5rem;
  text-wrap: balance;
}
.value {
  display: grid;
  grid-template-columns: minmax(240px, 1fr) minmax(240px, 1fr);
  gap: 2rem;
  align-items: center;
  margin-bottom: 3rem;
}
.value:last-child { margin-bottom: 0; }
.value.reverse .photo { order: 2; }
.value.reverse .text { order: 1; }
.photo {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  display: block;
}
.text h3 {
  margin: 0 0 0.75rem;
  font-size: clamp(1.25rem, 3vw, 1.75rem);
  font-weight: 900;
  font-stretch: expanded;
  line-height: 1.05;
}
.text p { margin: 0; max-width: 60ch; line-height: 1.6; text-wrap: pretty; }
@media (max-width: 768px) {
  .value,
  .value.reverse {
    grid-template-columns: 1fr;
  }
  .value.reverse .photo,
  .value.reverse .text {
    order: unset;
  }
}
</style>
