<script setup lang="ts">
const { data: page, status, error } = await useFridgePage()
const { data: settings } = await useSiteSettings()

useSeoMeta({
  title: () => page.value?.seo.title,
  description: () => page.value?.seo.description,
})

const heroBroken = ref(false)

const shell = computed(() => settings.value?.fridgeShell)

const errorMailto = computed(() => {
  if (!shell.value || !settings.value) return ''
  const subject = encodeURIComponent(shell.value.errorEmailSubject)
  return `mailto:${settings.value.email}?subject=${subject}`
})
</script>

<template>
  <div class="fridge-page">
    <main v-if="status === 'pending' && shell" id="main-content" aria-busy="true" :aria-label="shell.loadingEyebrow">
      <div class="state loading">
        <p class="eyebrow">{{ shell.loadingEyebrow }}</p>
        <p>{{ shell.loadingMessage }}</p>
      </div>
    </main>

    <main v-else-if="error || !page" id="main-content" class="state error" role="alert">
      <template v-if="shell && settings">
        <h1 class="display">{{ shell.errorHeading }}</h1>
        <p>{{ shell.errorMessage }}</p>
        <a
          class="btn btn-dark"
          :href="errorMailto"
          v-bind="linkTarget(errorMailto)"
        >
          {{ shell.errorEmailButtonLabel }} {{ settings.email }}
        </a>
      </template>
    </main>

    <template v-else-if="page">
      <main id="main-content">
        <section class="intro">
          <div class="copy">
            <h1 class="display">{{ page.heading }}</h1>
            <p class="lede">{{ page.intro }}</p>
            <div class="hero-actions">
              <a class="btn btn-dark" :href="page.cta.href" v-bind="linkTarget(page.cta.href)">{{ page.cta.label }}</a>
              <a class="btn btn-outline" href="#find-fridge">{{ page.findFridgeCtaLabel }}</a>
            </div>
          </div>
          <img
            v-if="page.heroImageUrl && !heroBroken"
            :src="page.heroImageUrl"
            :alt="page.heroImageAlt || ''"
            fetchpriority="high"
            loading="eager"
            width="800"
            height="600"
            sizes="(max-width: 768px) 100vw, 50vw"
            class="hero-photo"
            @error="heroBroken = true"
          >
        </section>

        <FridgeFindSection
          :heading="page.findHeading"
          :address="page.locationAddress"
          :hours="page.locationHours"
          :pickup-note="page.pickupNote"
          :map-url="page.mapUrl"
          :map-button-label="page.mapButtonLabel"
          :donation-heading="page.donationHeading"
          :guidelines="page.donationGuidelines"
          :donation-cta="page.donationCta"
        />

        <FridgeValueList :heading="page.valuesHeading" :values="page.values" />

        <FridgeClosingCta
          :heading="page.closingHeading"
          :note="page.closingNote"
          :cta="page.closingCta"
          :secondary-cta="page.donationCta"
        />
      </main>

      <nav class="mobile-actions" :aria-label="page.quickActionsAriaLabel">
        <a class="btn btn-outline" href="#find-fridge">{{ page.findFridgeMobileCtaLabel }}</a>
        <a class="btn btn-dark" :href="page.cta.href" v-bind="linkTarget(page.cta.href)">{{ page.cta.label }}</a>
      </nav>
    </template>
  </div>
</template>

<style scoped>
.fridge-page { padding-bottom: 0; }
.state {
  padding: 4rem 2rem;
  max-width: 60ch;
}
.state.loading p:last-child { line-height: 1.6; }
.state.error h1 { font-size: clamp(2rem, 5vw, 3rem); margin: 0 0 1rem; }
.state.error p { margin: 0 0 1.5rem; line-height: 1.6; }
.intro {
  padding: 4rem 2rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
  max-width: 1200px;
  margin-inline: auto;
}
.copy { max-width: 540px; }
.intro h1 { font-size: clamp(2.5rem, 6vw, 5rem); margin: 0 0 1.5rem; text-wrap: balance; }
.lede { font-size: 1.3rem; line-height: 1.5; font-weight: 600; margin: 0 0 2rem; text-wrap: pretty; }
.hero-actions { display: flex; flex-wrap: wrap; gap: 0.75rem; }
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
.btn-outline:focus-visible { outline: 3px solid var(--navy); outline-offset: 2px; }
.hero-photo {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  display: block;
}
.mobile-actions {
  display: none;
}
@media (max-width: 768px) {
  .intro { grid-template-columns: 1fr; }
  .hero-actions .btn { flex: 1 1 100%; text-align: center; }
  .fridge-page { padding-bottom: 5rem; }
  .mobile-actions {
    display: flex;
    gap: 0.75rem;
    position: fixed;
    inset-inline: 0;
    bottom: 0;
    padding: 0.75rem 1rem calc(0.75rem + env(safe-area-inset-bottom));
    background: color-mix(in oklab, var(--cream) 92%, transparent);
    border-top: 1px solid var(--hairline);
    z-index: 50;
  }
  .mobile-actions .btn {
    flex: 1;
    text-align: center;
    padding-inline: 0.75rem;
    font-size: 0.75rem;
  }
}
</style>
