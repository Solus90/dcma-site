<script setup lang="ts">
defineProps<{ stats: string[] }>()
</script>

<template>
  <div class="marquee">
    <span v-for="(s, i) in stats" :key="i" class="eyebrow">• {{ s }}&nbsp;</span>
  </div>
</template>

<style scoped>
.marquee {
  overflow: hidden;
  white-space: nowrap;
  border-block: 1px solid var(--hairline);
  padding: 1rem 2rem;
}
</style>
