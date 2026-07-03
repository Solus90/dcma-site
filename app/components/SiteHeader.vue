<script setup lang="ts">
import type { SiteSettings } from '~/types/content'
defineProps<{ settings: SiteSettings }>()

function isInternal(href: string) {
  return href.startsWith('/')
}
</script>

<template>
  <header class="site-header">
    <NuxtLink to="/" class="brand">{{ settings.orgName }}</NuxtLink>

    <nav :aria-label="settings.navAriaLabel">
      <template v-for="(link, i) in settings.navLinks" :key="link.href">
        <span v-if="i > 0" class="sep" aria-hidden="true">·</span>
        <NuxtLink v-if="isInternal(link.href)" :to="link.href">{{ link.label }}</NuxtLink>
        <a v-else :href="link.href" v-bind="linkTarget(link.href)">{{ link.label }}</a>
      </template>
    </nav>

    <a
      class="btn join"
      :href="settings.joinCta.href"
      v-bind="linkTarget(settings.joinCta.href)"
    >{{ settings.joinCta.label }}</a>
  </header>
</template>

<style scoped>
.site-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.25rem 2rem;
  border-bottom: 1px solid var(--hairline);
}

.brand {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  max-width: min(14rem, 42vw);
  font-weight: 700;
  font-size: clamp(0.85rem, 2.5vw, 1rem);
  line-height: 1.2;
  color: var(--navy);
  text-decoration: none;
  text-wrap: balance;
}

.brand:focus-visible {
  outline: 3px solid var(--navy);
  outline-offset: 2px;
}

nav {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem 1.25rem;
}

nav a {
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

nav a:hover,
nav a.router-link-active {
  text-decoration: underline;
  text-underline-offset: 4px;
}

nav a:focus-visible {
  outline: 3px solid var(--navy);
  outline-offset: 2px;
}

.sep {
  color: var(--hairline);
}

.join {
  flex-shrink: 0;
  white-space: nowrap;
}

@media (max-width: 768px) {
  .site-header {
    flex-wrap: wrap;
    padding: 1rem 1.25rem;
    gap: 0.75rem;
  }

  .brand {
    order: 1;
  }

  .join {
    order: 2;
    margin-left: auto;
    padding: 0.75rem 1rem;
    font-size: 0.8rem;
  }

  nav {
    order: 3;
    flex-basis: 100%;
    justify-content: center;
  }
}
</style>
