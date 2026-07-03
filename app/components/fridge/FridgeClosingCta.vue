<script setup lang="ts">
import type { Cta } from '~/types/content'
defineProps<{ heading: string; note: string; cta: Cta; secondaryCta?: Cta }>()
</script>

<template>
  <section class="closing" aria-labelledby="closing-heading">
    <h2 id="closing-heading" class="display">{{ heading }}</h2>
    <p class="note">{{ note }}</p>
    <div class="actions">
      <a class="btn btn-dark" :href="cta.href" v-bind="linkTarget(cta.href)">{{ cta.label }}</a>
      <a v-if="secondaryCta" class="btn btn-outline" :href="secondaryCta.href" v-bind="linkTarget(secondaryCta.href)">{{ secondaryCta.label }}</a>
    </div>
  </section>
</template>

<style scoped>
.closing {
  padding: 4rem 2rem 5rem;
  text-align: center;
  border-top: 1px solid var(--hairline);
}
.closing h2 {
  font-size: clamp(2rem, 5vw, 3rem);
  margin: 0 0 1rem;
  text-wrap: balance;
}
.note {
  max-width: 50ch;
  margin: 0 auto 1.5rem;
  line-height: 1.6;
  text-wrap: pretty;
}
.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;
}
.btn-outline {
  display: inline-block;
  background: transparent;
  color: var(--navy);
  padding: 0.9rem 1.6rem;
  text-transform: uppercase;
  text-decoration: none;
  font-weight: 600;
  border: 0;
  font-size: 0.85rem;
  letter-spacing: 0.05em;
  box-shadow: inset 0 0 0 2px var(--navy);
}
.btn-outline:focus-visible {
  outline: 3px solid var(--navy);
  outline-offset: 2px;
}
</style>
