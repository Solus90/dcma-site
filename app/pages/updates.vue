<script setup lang="ts">
const { data: updates } = await useUpdates()

useSeoMeta({
  title: 'Updates | Door County Mutual Aid',
  description: 'Upcoming events, announcements, and news from the Door County Mutual Aid network.',
})

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  })
}
</script>

<template>
  <main id="main-content" class="updates-page">
    <header class="page-hero">
      <p class="eyebrow">Door County Mutual Aid</p>
      <h1 class="display">Updates</h1>
      <p class="lede">Events, announcements, and news from the network.</p>
    </header>

    <section class="updates-grid" aria-label="Updates">
      <template v-if="updates && updates.length">
        <article v-for="update in updates" :key="update._id" class="update-card">
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
            <h2 class="card-title">{{ update.title }}</h2>
            <p class="card-summary">{{ update.summary }}</p>
            <a
              v-if="update.cta"
              :href="update.cta.href"
              class="card-link"
            >{{ update.cta.label }}</a>
          </div>
        </article>
      </template>
      <p v-else class="empty">No updates yet — check back soon.</p>
    </section>
  </main>
</template>

<style scoped>
.updates-page {
  padding-bottom: 5rem;
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

.updates-grid {
  max-width: 72rem;
  margin-inline: auto;
  padding: 3rem 2rem 0;
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

  .updates-grid {
    padding-inline: 1.25rem;
    grid-template-columns: 1fr;
  }
}
</style>
