<script setup lang="ts">
import type { SiteSettings } from '~/types/content'
defineProps<{ settings: SiteSettings }>()
</script>

<template>
  <footer class="site-footer">
    <img
      :src="settings.logoUrl"
      :alt="settings.orgName"
      class="footer-logo"
      height="40"
    >
    <p class="display tagline">{{ settings.footerTagline }}</p>
    <p class="footer-meta">
      <a :href="settings.facebookUrl" v-bind="linkTarget(settings.facebookUrl)">{{ settings.facebookLabel }}</a>
      <span class="sep" aria-hidden="true">·</span>
      <small>{{ settings.copyright }}</small>
    </p>
  </footer>
</template>

<style scoped>
.site-footer {
  padding: 4rem 2rem 2.5rem;
  border-top: 1px solid var(--hairline);
  text-align: center;
}

.footer-logo {
  display: block;
  margin: 0 auto 2rem;
}

.tagline {
  font-size: clamp(2.5rem, 12vw, 9rem);
  margin: 0;
  text-wrap: balance;
}

.footer-meta {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 0.75rem 1.25rem;
  margin: 2rem 0 0;
  font-size: 0.9rem;
  line-height: 1.5;
}

.footer-meta a {
  color: var(--slate);
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  font-size: 0.85rem;
  padding: 0.25rem;
  min-height: 44px;
  display: inline-flex;
  align-items: center;
}

.footer-meta a:hover {
  text-decoration: underline;
  text-underline-offset: 4px;
}

.footer-meta a:focus-visible {
  outline: 3px solid var(--navy);
  outline-offset: 2px;
}

.sep {
  color: var(--hairline);
}

@media (max-width: 768px) {
  .site-footer {
    padding: 3rem 1.25rem 2rem;
  }

  .footer-logo {
    margin-bottom: 1.5rem;
  }

  .footer-meta {
    margin-top: 1.5rem;
  }
}
</style>
