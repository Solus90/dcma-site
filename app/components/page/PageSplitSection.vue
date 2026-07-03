<script setup lang="ts">
defineProps<{
  eyebrow?: string
  heading: string
  body?: string
  imageUrl?: string
  imageAlt?: string
  imagePosition?: 'left' | 'right'
}>()
</script>

<template>
  <section
    class="split"
    :class="{ reverse: imagePosition === 'right' && imageUrl }"
    aria-labelledby="split-heading"
  >
    <div v-if="imageUrl" class="media">
      <img
        :src="imageUrl"
        :alt="imageAlt || heading"
        loading="lazy"
        class="photo"
      >
    </div>
    <div class="copy">
      <p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p>
      <h2 id="split-heading" class="display">{{ heading }}</h2>
      <p v-if="body" class="body">{{ body }}</p>
    </div>
  </section>
</template>

<style scoped>
.split {
  padding: 4rem 2rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
}
.split:not(:has(.media)) {
  grid-template-columns: 1fr;
  max-width: 720px;
}
.photo {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  display: block;
}
.split h2 {
  font-size: clamp(2rem, 6vw, 4.5rem);
  margin: 0.5rem 0 1.5rem;
  text-wrap: balance;
}
.body {
  max-width: 65ch;
  line-height: 1.6;
  text-wrap: pretty;
  white-space: pre-line;
  margin: 0;
}
.split.reverse .media { order: 2; }
.split.reverse .copy { order: 1; }
@media (max-width: 768px) {
  .split,
  .split.reverse {
    grid-template-columns: 1fr;
  }
  .split.reverse .media,
  .split.reverse .copy {
    order: unset;
  }
}
</style>
