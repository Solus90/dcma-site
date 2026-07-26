<script setup lang="ts">
const { data: settings } = await useSiteSettings()
</script>

<template>
  <div v-if="settings">
    <a href="#main-content" class="skip-link">{{ settings.skipLinkLabel }}</a>
    <div class="land-acknowledgement" role="complementary" aria-label="Land acknowledgement">
      <p class="land-acknowledgement-text">
        <strong>Land Acknowledgement:</strong>
        Door County, along with the lands our Facilities and Parks are located on, are the ancestral homelands of the Menominee Nation.
        Currently, there are 11 federally recognized Native American sovereign nations in Wisconsin.
        We acknowledge these indigenous communities who have stewarded this land throughout the generations and pay respect to their elders past and present.
        <cite>(County Board Resolution 2021-61, adopted August 24, 2021)</cite>
      </p>
    </div>
    <SiteHeader :settings="settings" />
    <slot :settings="settings" />
    <SiteFooter :settings="settings" />
  </div>
</template>

<style scoped>
.land-acknowledgement {
  background: var(--navy);
  color: #fff;
  padding: 0.85rem 2rem;
}

.land-acknowledgement-text {
  max-width: 72rem;
  margin-inline: auto;
  font-size: 0.8rem;
  line-height: 1.6;
  margin-block: 0;
  opacity: 0.9;
}

.land-acknowledgement-text strong {
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-size: 0.75rem;
  margin-right: 0.25rem;
  opacity: 1;
}

.land-acknowledgement-text cite {
  font-style: normal;
  opacity: 0.7;
  display: block;
  margin-top: 0.35rem;
  font-size: 0.75rem;
}

@media (max-width: 768px) {
  .land-acknowledgement {
    padding: 0.85rem 1.25rem;
  }
}
</style>
