<script setup lang="ts">
const { data: settings } = await useSiteSettings()
</script>

<template>
  <div v-if="settings">
    <SiteHeader :settings="settings" />
    <slot :settings="settings" />
    <SiteFooter :settings="settings" />
  </div>
</template>
