<script setup lang="ts">
import type { Card } from '~/types/content'
defineProps<{ values: Card[] }>()
</script>

<template>
  <dl class="values">
    <div v-for="v in values" :key="v._key">
      <dt class="display">{{ v.title }}</dt>
      <dd>{{ v.body }}</dd>
    </div>
  </dl>
</template>

<style scoped>
.values { display: grid; gap: 3rem; padding: 4rem 2rem; margin: 0; }
dt { font-size: clamp(1.5rem, 3.5vw, 2.5rem); }
dd { margin: 0.5rem 0 0; max-width: 60ch; line-height: 1.6; }
</style>
