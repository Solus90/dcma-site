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
      <template v-for="link in settings.navLinks" :key="link.href ?? link.label">
        <!-- Top-level item with dropdown children -->
        <div v-if="link.children?.length" class="dropdown">
          <NuxtLink
            v-if="link.href"
            :to="link.href"
            class="dropdown-trigger"
          >
            {{ link.label }}
            <span class="chevron" aria-hidden="true" />
          </NuxtLink>
          <span v-else class="dropdown-trigger no-link">
            {{ link.label }}
            <span class="chevron" aria-hidden="true" />
          </span>
          <ul class="dropdown-menu" role="list">
            <li v-for="child in link.children" :key="child.href">
              <NuxtLink v-if="child.href && isInternal(child.href)" :to="child.href">{{ child.label }}</NuxtLink>
              <a v-else-if="child.href" :href="child.href" v-bind="linkTarget(child.href)">{{ child.label }}</a>
            </li>
          </ul>
        </div>

        <!-- Plain top-level link -->
        <NuxtLink v-else-if="link.href && isInternal(link.href)" :to="link.href">{{ link.label }}</NuxtLink>
        <a v-else-if="link.href" :href="link.href" v-bind="linkTarget(link.href)">{{ link.label }}</a>
      </template>
    </nav>

    <div class="header-actions">
      <ClientOnly>
        <ThemeToggle />
        <template #fallback>
          <span class="toggle-placeholder" aria-hidden="true" />
        </template>
      </ClientOnly>
      <a
        class="btn join"
        :href="settings.joinCta.href"
        v-bind="linkTarget(settings.joinCta.href)"
      >{{ settings.joinCta.label }}</a>
    </div>
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
  gap: 0.25rem 0.25rem;
}

/* Shared link styles */
nav > a,
.dropdown-trigger {
  color: var(--slate);
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  font-size: 0.85rem;
  padding: 0.25rem 0.75rem;
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  border-radius: 2px;
}

nav > a:hover,
nav > a.router-link-active,
.dropdown-trigger:hover,
.dropdown:focus-within .dropdown-trigger {
  text-decoration: underline;
  text-underline-offset: 4px;
}

nav > a:focus-visible,
.dropdown-trigger:focus-visible {
  outline: 3px solid var(--navy);
  outline-offset: 2px;
}

/* Dropdown wrapper */
.dropdown {
  position: relative;
}

.dropdown-trigger {
  cursor: pointer;
}

.no-link {
  cursor: default;
  user-select: none;
}

/* Chevron */
.chevron {
  display: inline-block;
  width: 0.45em;
  height: 0.45em;
  border-right: 2px solid currentColor;
  border-bottom: 2px solid currentColor;
  transform: rotate(45deg) translateY(-0.1em);
  transition: transform 0.15s ease;
  flex-shrink: 0;
}

.dropdown:hover .chevron,
.dropdown:focus-within .chevron {
  transform: rotate(-135deg) translateY(-0.1em);
}

/* Dropdown menu */
.dropdown-menu {
  display: none;
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  min-width: 11rem;
  background: var(--surface-raised);
  border: 1px solid var(--hairline);
  box-shadow: 0 4px 16px color-mix(in oklab, var(--navy) 10%, transparent);
  list-style: none;
  margin: 0;
  padding: 0.35rem 0;
  padding-top: calc(0.35rem + 4px);
  z-index: 100;
}

.dropdown:hover .dropdown-menu,
.dropdown:focus-within .dropdown-menu {
  display: block;
}

.dropdown-menu li a {
  display: block;
  padding: 0.55rem 1rem;
  color: var(--navy);
  text-decoration: none;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  white-space: nowrap;
}

.dropdown-menu li a:hover,
.dropdown-menu li a.router-link-active {
  background: var(--periwinkle);
}

.dropdown-menu li a:focus-visible {
  outline: 3px solid var(--navy);
  outline-offset: -2px;
}

.header-actions {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

/* reserves the ThemeToggle's footprint until it hydrates, so the join button
   doesn't jump on load */
.toggle-placeholder {
  display: block;
  width: 6.6rem;
  height: 44px;
}

@media (max-width: 900px) {
  .toggle-placeholder {
    width: 2.7rem;
  }
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

  .header-actions {
    order: 2;
    margin-left: auto;
  }

  .join {
    padding: 0.75rem 1rem;
    font-size: 0.8rem;
  }

  nav {
    order: 3;
    flex-basis: 100%;
    justify-content: center;
  }

  /* On mobile, show dropdowns stacked (always visible) */
  .dropdown {
    flex-basis: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .dropdown-menu {
    display: block;
    position: static;
    transform: none;
    box-shadow: none;
    border: none;
    background: transparent;
    padding: 0;
    text-align: center;
  }

  .dropdown-menu li a {
    padding: 0.35rem 0.75rem;
    font-size: 0.8rem;
    color: var(--slate);
  }

  .dropdown-menu li a:hover {
    background: transparent;
    text-decoration: underline;
    text-underline-offset: 4px;
  }

  .chevron {
    display: none;
  }
}
</style>
