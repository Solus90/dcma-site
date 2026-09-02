<script setup lang="ts">
import type { ThemePref } from '~/composables/useTheme'

const { pref, cycle } = useTheme()

const LABEL: Record<ThemePref, string> = {
  system: 'System',
  light: 'Light',
  dark: 'Dark',
}

const next: Record<ThemePref, ThemePref> = {
  system: 'light',
  light: 'dark',
  dark: 'system',
}
</script>

<template>
  <button
    type="button"
    class="theme-toggle"
    :aria-label="`Theme: ${LABEL[pref]}. Switch to ${LABEL[next[pref]]}.`"
    :title="`Theme: ${LABEL[pref]}`"
    @click="cycle"
  >
    <svg v-if="pref === 'light'" viewBox="0 0 24 24" aria-hidden="true" class="icon">
      <circle cx="12" cy="12" r="4" />
      <g stroke-linecap="round">
        <line x1="12" y1="2" x2="12" y2="5" />
        <line x1="12" y1="19" x2="12" y2="22" />
        <line x1="2" y1="12" x2="5" y2="12" />
        <line x1="19" y1="12" x2="22" y2="12" />
        <line x1="4.9" y1="4.9" x2="7" y2="7" />
        <line x1="17" y1="17" x2="19.1" y2="19.1" />
        <line x1="4.9" y1="19.1" x2="7" y2="17" />
        <line x1="17" y1="7" x2="19.1" y2="4.9" />
      </g>
    </svg>
    <svg v-else-if="pref === 'dark'" viewBox="0 0 24 24" aria-hidden="true" class="icon">
      <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z" />
    </svg>
    <svg v-else viewBox="0 0 24 24" aria-hidden="true" class="icon">
      <rect x="3" y="4" width="18" height="13" rx="1.5" fill="none" />
      <line x1="8" y1="20" x2="16" y2="20" stroke-linecap="round" />
    </svg>
    <span class="label">{{ LABEL[pref] }}</span>
  </button>
</template>

<style scoped>
.theme-toggle {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  min-height: 44px;
  padding: 0.25rem 0.6rem;
  background: transparent;
  border: 1px solid var(--hairline);
  border-radius: 2px;
  color: var(--slate);
  font: inherit;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  cursor: pointer;
}

.theme-toggle:hover {
  color: var(--navy);
  border-color: var(--navy);
}

/* reserve the widest label ("System") so cycling modes doesn't reflow the header */
.label {
  display: inline-block;
  min-width: 3.6em;
  text-align: left;
}

.theme-toggle:focus-visible {
  outline: 3px solid var(--navy);
  outline-offset: 2px;
}

.icon {
  width: 1.05rem;
  height: 1.05rem;
  stroke: currentColor;
  stroke-width: 2;
  fill: currentColor;
}

.icon line,
.icon rect {
  stroke: currentColor;
}

.icon rect[fill='none'] {
  fill: none;
}

@media (max-width: 900px) {
  .label {
    position: absolute;
    width: 1px;
    min-width: 0;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
    border: 0;
  }
}
</style>
