<script setup lang="ts">
const { data: settings } = await useSiteSettings()
</script>

<template>
  <div v-if="settings">
    <a href="#main-content" class="skip-link">{{ settings.skipLinkLabel }}</a>
    <SiteHeader :settings="settings" />
    <slot :settings="settings" />
    <SiteFooter :settings="settings" />
  </div>
</template>
