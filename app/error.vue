<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

const { data: settings } = await useSiteSettings()

const is404 = computed(() => props.error.statusCode === 404)

const copy = computed(() => settings.value?.errorPage)

useHead({
  title: () => is404.value ? copy.value!.notFoundMetaTitle : copy.value!.genericMetaTitle,
})
</script>

<template>
  <NuxtLayout>
    <main v-if="copy && settings" id="main-content" class="error-page">
      <p class="eyebrow">{{ is404 ? '404' : `Error ${error.statusCode}` }}</p>
      <h1 class="display">{{ is404 ? copy.notFoundTitle : copy.genericTitle }}</h1>
      <p class="lede">
        {{ is404 ? copy.notFoundDescription : copy.genericDescription }}
      </p>
      <div class="actions">
        <NuxtLink to="/" class="btn btn-dark">{{ copy.backHomeLabel }}</NuxtLink>
        <NuxtLink to="/full-hearts-fridge" class="btn">{{ copy.fridgeLinkLabel }}</NuxtLink>
        <a
          class="btn btn-outline"
          :href="`mailto:${settings.email}`"
          v-bind="linkTarget(`mailto:${settings.email}`)"
        >
          {{ copy.emailUsLabel }}
        </a>
      </div>
    </main>
  </NuxtLayout>
</template>

<style scoped>
.error-page {
  padding: 6rem 2rem;
  max-width: 720px;
  margin-inline: auto;
  min-height: 50vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.error-page h1 {
  font-size: clamp(2.5rem, 8vw, 5rem);
  margin: 0.5rem 0 1.5rem;
  text-wrap: balance;
}
.lede {
  font-size: 1.15rem;
  line-height: 1.6;
  margin: 0 0 2rem;
  max-width: 55ch;
  text-wrap: pretty;
}
.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
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
@media (max-width: 768px) {
  .actions .btn { flex: 1 1 100%; text-align: center; }
}
</style>
