<script setup lang="ts">
import type { Cta } from '~/types/content'

defineProps<{
  heading: string
  address: string
  hours: string
  pickupNote: string
  mapUrl?: string
  mapButtonLabel: string
  donationHeading: string
  guidelines: string[]
  donationCta: Cta
}>()
</script>

<template>
  <section id="find-fridge" class="find" aria-labelledby="find-fridge-heading">
    <header class="find-intro">
      <h2 id="find-fridge-heading" class="display">{{ heading }}</h2>
    </header>

    <div class="find-body">
      <div class="location">
        <p class="address">{{ address }}</p>
        <p class="hours-lead">{{ hours }}</p>
        <p class="pickup">{{ pickupNote }}</p>
        <a
          v-if="mapUrl"
          class="btn btn-outline map-btn"
          :href="mapUrl"
          v-bind="linkTarget(mapUrl)"
        >{{ mapButtonLabel }}</a>
      </div>

      <aside class="donate">
        <h3 class="donate-heading">{{ donationHeading }}</h3>
        <ul class="guidelines">
          <li v-for="(item, i) in guidelines" :key="i">{{ item }}</li>
        </ul>
        <a
          class="btn btn-dark donate-btn"
          :href="donationCta.href"
          v-bind="linkTarget(donationCta.href)"
        >{{ donationCta.label }}</a>
      </aside>
    </div>
  </section>
</template>

<style scoped>
.find {
  padding: clamp(3rem, 8vw, 5rem) 2rem;
  background: var(--periwinkle);
  border-top: 1px solid var(--hairline);
}

.find-intro {
  max-width: 42rem;
  margin-bottom: clamp(2rem, 5vw, 3.5rem);
}

.find h2 {
  font-size: clamp(2.25rem, 7vw, 4.5rem);
  margin: 0;
  text-wrap: balance;
}

.find-body {
  display: grid;
  grid-template-columns: minmax(0, 3fr) minmax(0, 2fr);
  gap: clamp(2rem, 5vw, 4rem);
  align-items: start;
}

.address {
  margin: 0 0 1.25rem;
  font-size: clamp(1.5rem, 4vw, 2.25rem);
  font-weight: 700;
  line-height: 1.15;
  color: var(--navy);
  white-space: pre-line;
  text-wrap: balance;
}

.hours-lead {
  margin: 0 0 1rem;
  font-weight: 700;
  font-size: clamp(1rem, 2.5vw, 1.125rem);
  line-height: 1.4;
  color: var(--navy);
  max-width: 38ch;
}

.pickup {
  margin: 0 0 1.5rem;
  line-height: 1.6;
  max-width: 42ch;
  text-wrap: pretty;
}

.btn-outline {
  display: inline-block;
  background: transparent;
  color: var(--navy);
  padding: 0.9rem 1.6rem;
  text-transform: uppercase;
  text-decoration: none;
  font-weight: 600;
  border: 0;
  font-size: 0.85rem;
  letter-spacing: 0.05em;
  box-shadow: inset 0 0 0 2px var(--navy);
}

.btn-outline:focus-visible {
  outline: 3px solid var(--navy);
  outline-offset: 2px;
}

.donate {
  padding-top: 0.25rem;
  border-top: 2px solid var(--navy);
}

.donate-heading {
  margin: 1.25rem 0 1rem;
  font-size: clamp(1.25rem, 3vw, 1.75rem);
  font-weight: 700;
  line-height: 1.2;
  color: var(--navy);
  text-wrap: balance;
}

.guidelines {
  margin: 0 0 1.5rem;
  padding-left: 1.25rem;
  max-width: 42ch;
  line-height: 1.6;
}

.guidelines li + li {
  margin-top: 0.65rem;
}

.donate-btn {
  width: 100%;
  max-width: 20rem;
  padding: 1rem 2rem;
  font-size: 0.9rem;
  text-align: center;
}

@media (max-width: 768px) {
  .find {
    padding-inline: 1.25rem;
  }

  .find-body {
    grid-template-columns: 1fr;
  }

  .donate {
    padding-top: 1.5rem;
  }

  .donate-btn {
    max-width: none;
  }
}
</style>
