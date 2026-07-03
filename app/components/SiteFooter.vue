<script setup lang="ts">
import type { SiteSettings } from '~/types/content'
defineProps<{ settings: SiteSettings }>()
</script>

<template>
  <footer>
    <div class="meta">
      <img :src="settings.logoUrl" :alt="settings.orgName" height="32">
      <div class="connect">
        <span class="eyebrow">Connect</span>
        <a :href="settings.facebookUrl" rel="noopener">Facebook</a>
      </div>
      <small>{{ settings.copyright }}</small>
    </div>
    <p class="display tagline" aria-hidden="true">{{ settings.footerTagline }}</p>
  </footer>
</template>

<style scoped>
footer { padding: 3rem 2rem 0; overflow: hidden; }
.meta {
  display: flex;
  gap: 2rem;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
}
.connect { display: flex; gap: 0.75rem; align-items: center; }
.connect a { color: var(--slate); }
.connect a:focus-visible { outline: 3px solid var(--navy); outline-offset: 2px; }
.tagline {
  font-size: clamp(3rem, 10vw, 9rem);
  margin: 2rem 0 0;
  text-align: center;
  white-space: nowrap;
}
</style>
