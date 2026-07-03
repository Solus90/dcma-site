<script setup lang="ts">
import type { SiteSettings } from '~/types/content'
defineProps<{ settings: SiteSettings }>()
</script>

<template>
  <header class="site-header">
    <NuxtLink to="/" class="logo-link">
      <img :src="settings.logoUrl" :alt="settings.orgName" height="36">
    </NuxtLink>
    <nav aria-label="Main">
      <NuxtLink to="/">Home</NuxtLink>
      <NuxtLink to="/full-hearts-fridge">Full Hearts Fridge</NuxtLink>
    </nav>
    <a class="btn" :href="settings.joinCta.href">{{ settings.joinCta.label }}</a>
  </header>
</template>

<style scoped>
.site-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 2rem;
  border-bottom: 1px solid var(--hairline);
  flex-wrap: wrap;
}
nav { display: flex; gap: 2rem; text-transform: uppercase; font-size: 0.9rem; }
nav a { color: var(--slate); text-decoration: none; }
nav a.router-link-active { text-decoration: underline; text-underline-offset: 4px; }
nav a:focus-visible { outline: 3px solid var(--navy); outline-offset: 2px; }
.logo-link img { display: block; }
</style>
