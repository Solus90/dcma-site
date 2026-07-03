<script setup lang="ts">
defineProps<{ stats: string[]; ariaLabel: string }>()
</script>

<template>
  <div class="marquee" role="region" :aria-label="ariaLabel">
    <div class="track">
      <div class="content">
        <span v-for="(s, i) in stats" :key="i" class="eyebrow">• {{ s }}&nbsp;</span>
      </div>
      <div class="content duplicate" aria-hidden="true">
        <span v-for="(s, i) in stats" :key="`dup-${i}`" class="eyebrow">• {{ s }}&nbsp;</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.marquee {
  overflow: hidden;
  border-block: 1px solid var(--hairline);
  padding: 1rem 0;
}

.track {
  display: flex;
  width: max-content;
  animation: marquee-scroll 40s linear infinite;
}

.content {
  display: flex;
  white-space: nowrap;
  padding-inline: 2rem;
}

@keyframes marquee-scroll {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

@media (prefers-reduced-motion: reduce) {
  .marquee { overflow: visible; padding: 1rem 2rem; }
  .track {
    animation: none;
    flex-direction: column;
    width: 100%;
    gap: 0.75rem;
  }
  .content {
    white-space: normal;
    flex-wrap: wrap;
    padding-inline: 0;
    gap: 0.5rem 1.5rem;
  }
  .duplicate { display: none; }
}
</style>
