<script setup lang="ts">
defineProps<{
  eyebrow?: string
  heading?: string
  body?: string
}>()
</script>

<template>
  <section class="prose" aria-labelledby="prose-heading">
    <p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p>
    <h2 v-if="heading" id="prose-heading" class="display section-heading">{{ heading }}</h2>
    <p v-if="body" class="body">{{ body }}</p>
  </section>
</template>

<style scoped>
.prose {
  padding: 4rem 2rem;
  max-width: 720px;
  margin-inline: auto;
}
.section-heading {
  font-size: clamp(2rem, 5vw, 3.5rem);
  margin: 0.5rem 0 1.5rem;
  text-wrap: balance;
}
.body {
  margin: 0;
  line-height: 1.6;
  text-wrap: pretty;
  white-space: pre-line;
}
</style>
