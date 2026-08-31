<script setup lang="ts">
const { data: page } = await useUpdatesPage()
const { data: updates } = await useUpdates()

useSeoMeta({
  title: () => page.value.seo.title,
  description: () => page.value.seo.description,
})

// This page is served from an ISR cache, so "now" on the server can be up to
// the revalidation window stale. Re-evaluate on the client after mount so the
// upcoming/past split is always correct for the visitor's actual date.
const now = ref(new Date())
onMounted(() => { now.value = new Date() })

const todayIso = computed(() =>
  now.value.toLocaleDateString('en-CA', { timeZone: 'America/Chicago' }),
)

const split = computed(() => splitUpdates(updates.value ?? [], todayIso.value))
const upcomingEvents = computed(() => split.value.upcoming)
const pastUpdates = computed(() => split.value.past)

const hasNothing = computed(() => !upcomingEvents.value.length && !pastUpdates.value.length)

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  })
}

function datePart(iso: string, opt: Intl.DateTimeFormatOptions) {
  return new Date(iso).toLocaleDateString('en-US', { ...opt, timeZone: 'UTC' })
}
</script>

<template>
  <main id="main-content" class="updates-page">
    <header class="page-hero">
      <p class="eyebrow">{{ page.heroEyebrow }}</p>
      <h1 class="display">{{ page.heroHeading }}</h1>
      <p class="lede">{{ page.lede }}</p>
    </header>

    <section v-if="upcomingEvents.length" class="agenda-section" aria-labelledby="agenda-heading">
      <h2 id="agenda-heading" class="section-heading">Upcoming events</h2>
      <ol class="agenda">
        <li v-for="event in upcomingEvents" :key="event._id" class="agenda-item">
          <div class="agenda-rail" aria-hidden="true">
            <span class="agenda-weekday">{{ datePart(event.publishedAt, { weekday: 'short' }) }}</span>
            <span class="agenda-daynum">{{ datePart(event.publishedAt, { day: 'numeric' }) }}</span>
            <span class="agenda-month">{{ datePart(event.publishedAt, { month: 'short' }) }}</span>
          </div>
          <div class="agenda-body">
            <time :datetime="event.publishedAt" class="sr-only">{{ formatDate(event.publishedAt) }}</time>
            <h3 class="agenda-title">{{ event.title }}</h3>
            <p class="agenda-summary">{{ event.summary }}</p>
            <a
              v-if="event.cta"
              :href="event.cta.href"
              class="agenda-link"
            >{{ event.cta.label }}</a>
          </div>
        </li>
      </ol>
    </section>

    <section
      v-if="pastUpdates.length || hasNothing"
      class="updates-section"
      aria-labelledby="updates-heading"
    >
      <h2 id="updates-heading" class="section-heading">
        {{ upcomingEvents.length ? 'Latest updates' : page.listAriaLabel }}
      </h2>
      <div class="updates-grid">
        <template v-if="pastUpdates.length">
          <article v-for="update in pastUpdates" :key="update._id" class="update-card">
            <div v-if="update.imageUrl" class="card-media">
              <img
                :src="update.imageUrl"
                :alt="update.imageAlt || update.title"
                loading="lazy"
                class="card-img"
              >
            </div>
            <div class="card-body">
              <div class="card-meta">
                <span v-if="update.category" class="badge">{{ update.category }}</span>
                <time :datetime="update.publishedAt">{{ formatDate(update.publishedAt) }}</time>
              </div>
              <h3 class="card-title">{{ update.title }}</h3>
              <p class="card-summary">{{ update.summary }}</p>
              <a
                v-if="update.cta"
                :href="update.cta.href"
                class="card-link"
              >{{ update.cta.label }}</a>
            </div>
          </article>
        </template>
        <p v-else class="empty">{{ page.emptyMessage }}</p>
      </div>
    </section>
  </main>
</template>

<style scoped>
.updates-page {
  padding-bottom: 5rem;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
}

.page-hero {
  max-width: 72rem;
  margin-inline: auto;
  padding: 4rem 2rem 3rem;
  border-bottom: 1px solid var(--hairline);
}

.page-hero h1 {
  font-size: clamp(2.5rem, 7vw, 5rem);
  margin: 0.5rem 0 0.75rem;
  text-wrap: balance;
}

.lede {
  max-width: 55ch;
  font-size: 1.15rem;
  line-height: 1.55;
  margin: 0;
  text-wrap: pretty;
}

.section-heading {
  font-size: clamp(1.5rem, 4vw, 2.25rem);
  font-weight: 900;
  font-stretch: expanded;
  line-height: 1.15;
  margin: 0 0 1.5rem;
  text-wrap: balance;
}

/* ── Upcoming events agenda ── */
.agenda-section {
  max-width: 72rem;
  margin-inline: auto;
  padding: 3rem 2rem 0;
}

.agenda {
  list-style: none;
  margin: 0;
  padding: 0;
  border-top: 1px solid var(--hairline);
}

.agenda-item {
  display: grid;
  grid-template-columns: 4.5rem 1fr;
  gap: 1.5rem;
  padding: 1.5rem 0;
  border-bottom: 1px solid var(--hairline);
}

.agenda-rail {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding-top: 0.15rem;
  color: var(--navy);
}

.agenda-weekday {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 700;
}

.agenda-daynum {
  font-size: 1.9rem;
  font-weight: 900;
  font-stretch: expanded;
  line-height: 1;
}

.agenda-month {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 700;
}

.agenda-title {
  font-size: clamp(1.1rem, 2.5vw, 1.4rem);
  font-weight: 900;
  font-stretch: expanded;
  line-height: 1.2;
  margin: 0 0 0.5rem;
  text-wrap: balance;
}

.agenda-summary {
  font-size: 0.95rem;
  line-height: 1.65;
  margin: 0;
  max-width: 60ch;
  text-wrap: pretty;
}

.agenda-link {
  display: inline-block;
  margin-top: 1rem;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--navy);
  text-decoration: none;
  padding-bottom: 2px;
  border-bottom: 2px solid currentColor;
}

.agenda-link:hover {
  opacity: 0.7;
}

.agenda-link:focus-visible {
  outline: 3px solid var(--navy);
  outline-offset: 2px;
}

/* ── Latest updates grid ── */
.updates-section {
  max-width: 72rem;
  margin-inline: auto;
  padding: 3rem 2rem 0;
}

.updates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 22rem), 1fr));
  gap: 2rem;
}

.update-card {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--hairline);
  overflow: hidden;
}

.card-media {
  aspect-ratio: 16 / 9;
  overflow: hidden;
}

.card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.card-body {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.card-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--slate);
}

.badge {
  background: var(--periwinkle);
  color: var(--navy);
  padding: 0.2rem 0.5rem;
  font-weight: 700;
  font-size: 0.7rem;
}

.card-title {
  font-size: clamp(1.1rem, 2.5vw, 1.35rem);
  font-weight: 900;
  font-stretch: expanded;
  line-height: 1.2;
  margin: 0 0 0.75rem;
  text-wrap: balance;
}

.card-summary {
  font-size: 0.95rem;
  line-height: 1.65;
  margin: 0;
  flex: 1;
  text-wrap: pretty;
  color: var(--slate);
}

.card-link {
  display: inline-block;
  margin-top: 1.25rem;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--navy);
  text-decoration: none;
  padding-bottom: 2px;
  border-bottom: 2px solid currentColor;
}

.card-link:hover {
  opacity: 0.7;
}

.card-link:focus-visible {
  outline: 3px solid var(--navy);
  outline-offset: 2px;
}

.empty {
  grid-column: 1 / -1;
  padding: 3rem 0;
  text-align: center;
  color: var(--slate);
}

@media (max-width: 768px) {
  .page-hero {
    padding: 3rem 1.25rem 2rem;
  }

  .agenda-section,
  .updates-section {
    padding-inline: 1.25rem;
  }

  .agenda-item {
    grid-template-columns: 3.5rem 1fr;
    gap: 1rem;
  }

  .agenda-daynum {
    font-size: 1.6rem;
  }

  .updates-grid {
    grid-template-columns: 1fr;
  }
}
</style>
