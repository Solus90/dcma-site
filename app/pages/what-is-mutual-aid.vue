<script setup lang="ts">
const { data: page } = await useMutualAidPage()

useSeoMeta({
  title: () => page.value?.seo.title,
  description: () => page.value?.seo.description,
})

function isInternal(href: string) {
  return href.startsWith('/')
}

const difficultyClass = (level: string) => `pill pill-${level.toLowerCase()}`

// Italicize book titles from the reading list where they're named in the prose.
const bookTitles = computed(() => (page.value?.books ?? []).map(b => b.title))
const withCitedBooks = (text: string) => citeBookTitles(text, bookTitles.value)
</script>

<template>
  <main v-if="page" id="main-content" class="mutual-aid-page">
    <header class="hero">
      <p class="eyebrow">{{ page.heroEyebrow }}</p>
      <h1 class="display">{{ page.heroHeading }}</h1>
      <p class="lede">{{ page.lede }}</p>
      <p class="hook">{{ page.kropotkinHook }}</p>
    </header>

    <div class="body">
      <section id="solidarity" aria-labelledby="solidarity-h" class="prose-section">
        <h2 id="solidarity-h">{{ page.solidarityHeading }}</h2>
        <p v-for="(para, i) in page.solidarityParagraphs" :key="i">{{ para }}</p>
      </section>

      <section id="why" aria-labelledby="why-h" class="prose-section">
        <h2 id="why-h">{{ page.whyHeading }}</h2>
        <!-- eslint-disable-next-line vue/no-v-html -- citeBookTitles escapes the text -->
        <p v-for="(para, i) in page.whyParagraphs" :key="i" v-html="withCitedBooks(para)" />
      </section>

      <section id="looks-like" aria-labelledby="looks-like-h" class="prose-section">
        <h2 id="looks-like-h">{{ page.looksLikeHeading }}</h2>
        <p>{{ page.looksLikeIntro }}</p>
        <ul class="examples">
          <li v-for="item in page.looksLikeItems" :key="item">{{ item }}</li>
        </ul>
        <p>{{ page.looksLikeOutro }}</p>
        <NuxtLink
          v-if="page.looksLikeCta && isInternal(page.looksLikeCta.href)"
          :to="page.looksLikeCta.href"
          class="inline-link"
        >{{ page.looksLikeCta.label }}</NuxtLink>
        <a
          v-else-if="page.looksLikeCta"
          :href="page.looksLikeCta.href"
          v-bind="linkTarget(page.looksLikeCta.href)"
          class="inline-link"
        >{{ page.looksLikeCta.label }}</a>
      </section>

      <section id="organized" aria-labelledby="organized-h" class="prose-section">
        <h2 id="organized-h">{{ page.organizedHeading }}</h2>
        <p v-for="(para, i) in page.organizedParagraphs" :key="i">{{ para }}</p>
        <NuxtLink
          v-if="page.securityCta && isInternal(page.securityCta.href)"
          :to="page.securityCta.href"
          class="inline-link"
        >{{ page.securityCta.label }}</NuxtLink>
        <a
          v-else-if="page.securityCta"
          :href="page.securityCta.href"
          v-bind="linkTarget(page.securityCta.href)"
          class="inline-link"
        >{{ page.securityCta.label }}</a>
      </section>

      <section id="questions" aria-labelledby="questions-h" class="prose-section">
        <h2 id="questions-h">{{ page.questionsHeading }}</h2>
        <dl class="faq">
          <div v-for="q in page.questions" :key="q.question" class="faq-item">
            <dt>{{ q.question }}</dt>
            <dd>{{ q.answer }}</dd>
          </div>
        </dl>
      </section>

      <section id="reading" aria-labelledby="reading-h" class="prose-section">
        <h2 id="reading-h">{{ page.readingHeading }}</h2>
        <p>{{ page.readingIntro }}</p>
        <p class="note">{{ page.readingNote }}</p>

        <ul class="book-list">
          <li v-for="(book, i) in page.books" :key="book.title">
            <details class="book-card" :open="i === 0">
              <summary class="book-summary">
                <span class="book-title">{{ book.title }}</span>
                <span class="book-meta">
                  <span class="book-author">{{ book.author }}</span>
                  <span :class="difficultyClass(book.difficulty)">{{ book.difficulty }}</span>
                  <span v-if="book.length" class="book-length">{{ book.length }}</span>
                </span>
                <span class="book-chevron" aria-hidden="true" />
              </summary>
              <p class="book-body">{{ book.summary }}</p>
            </details>
          </li>
        </ul>

        <p>{{ page.readingClosing }}</p>
        <NuxtLink
          v-if="page.readingCta && isInternal(page.readingCta.href)"
          :to="page.readingCta.href"
          class="inline-link"
        >{{ page.readingCta.label }}</NuxtLink>
        <a
          v-else-if="page.readingCta"
          :href="page.readingCta.href"
          v-bind="linkTarget(page.readingCta.href)"
          class="inline-link"
        >{{ page.readingCta.label }}</a>
      </section>

      <section id="get-involved" aria-labelledby="cta-h" class="cta-section">
        <h2 id="cta-h">{{ page.ctaHeading }}</h2>
        <p>{{ page.ctaBody }}</p>
        <a
          class="btn"
          :href="page.cta.href"
          v-bind="linkTarget(page.cta.href)"
        >{{ page.cta.label }}</a>
      </section>
    </div>
  </main>
</template>

<style scoped>
.mutual-aid-page {
  padding-bottom: 4rem;
}

.hero {
  max-width: 72rem;
  margin-inline: auto;
  padding-inline: 2rem;
  padding-top: 4rem;
  padding-bottom: 2.5rem;
}

.hero h1 {
  font-size: clamp(2.5rem, 7vw, 5rem);
  margin: 0.5rem 0 1rem;
  text-wrap: balance;
}

.eyebrow {
  margin: 0;
  font-size: 0.9rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.lede {
  max-width: 65ch;
  font-size: 1.25rem;
  line-height: 1.55;
  font-weight: 600;
  margin: 0 0 1rem;
  text-wrap: pretty;
}

.hook {
  max-width: 65ch;
  line-height: 1.65;
  margin: 0;
  text-wrap: pretty;
}

.body {
  max-width: 72rem;
  margin-inline: auto;
  padding-inline: 2rem;
}

.prose-section {
  padding-block: 2.5rem;
  border-top: 1px solid var(--hairline);
}

.prose-section h2 {
  font-size: clamp(1.5rem, 4vw, 2.25rem);
  font-weight: 900;
  line-height: 1.15;
  margin: 0 0 1.25rem;
  text-wrap: balance;
}

.prose-section p {
  max-width: 65ch;
  line-height: 1.7;
  margin: 0 0 1rem;
  text-wrap: pretty;
}

.prose-section p:last-of-type {
  margin-bottom: 0;
}

/* book titles wrapped by citeBookTitles() (rendered via v-html) */
.prose-section :deep(cite) {
  font-style: italic;
}

.note {
  font-size: 0.95rem;
  color: var(--slate);
}

.examples {
  max-width: 60ch;
  margin: 0 0 1rem;
  padding-left: 1.25rem;
}

.examples li {
  margin-bottom: 0.5rem;
  line-height: 1.6;
  text-wrap: pretty;
}

.inline-link {
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

.inline-link:hover {
  opacity: 0.7;
}

.inline-link:focus-visible {
  outline: 3px solid var(--navy);
  outline-offset: 3px;
}

/* ── FAQ ── */
.faq {
  margin: 0;
}

.faq-item {
  padding-block: 1.25rem;
  border-bottom: 1px solid color-mix(in oklab, var(--hairline) 35%, transparent);
}

.faq-item:first-child {
  border-top: 1px solid color-mix(in oklab, var(--hairline) 35%, transparent);
}

.faq-item dt {
  margin: 0 0 0.5rem;
  font-weight: 900;
  line-height: 1.2;
  text-wrap: balance;
}

.faq-item dd {
  margin: 0;
  max-width: 65ch;
  line-height: 1.7;
  text-wrap: pretty;
}

/* ── Reading list ── */
.book-list {
  list-style: none;
  margin: 1.5rem 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.book-card {
  border: 1px solid var(--hairline);
  background: #fff;
}

.book-card[open] {
  border-color: color-mix(in oklab, var(--navy) 25%, transparent);
}

.book-summary {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.35rem 1rem;
  padding: 1.1rem 1.35rem;
  cursor: pointer;
  list-style: none;
  user-select: none;
}

.book-summary::-webkit-details-marker {
  display: none;
}

.book-summary:hover {
  background: color-mix(in oklab, var(--periwinkle) 45%, transparent);
}

.book-title {
  grid-column: 1;
  font-weight: 900;
  line-height: 1.25;
  text-wrap: balance;
}

.book-meta {
  grid-column: 1;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.4rem 0.75rem;
  font-size: 0.85rem;
  color: var(--slate);
}

.book-chevron {
  grid-column: 2;
  grid-row: 1 / span 2;
  align-self: start;
  flex-shrink: 0;
  width: 0.85rem;
  height: 0.85rem;
  margin-top: 0.35rem;
  border-right: 2.5px solid var(--navy);
  border-bottom: 2.5px solid var(--navy);
  transform: rotate(45deg);
  transition: transform 0.2s ease;
}

.book-card[open] .book-chevron {
  transform: rotate(-135deg);
  margin-top: 0.6rem;
}

.book-body {
  margin: 0;
  padding: 0 1.35rem 1.35rem;
  max-width: 68ch;
  line-height: 1.7;
  text-wrap: pretty;
}

.pill {
  display: inline-block;
  padding: 0.1rem 0.5rem;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--navy);
}

.pill-lighter {
  background: #d8ede0;
}

.pill-moderate {
  background: #f6e6c8;
}

.pill-heavier {
  background: #efd8d2;
}

/* ── Bottom CTA ── */
.cta-section {
  margin-top: 2.5rem;
  padding: 2.5rem 2rem;
  background: var(--periwinkle);
  border: 1px solid color-mix(in oklab, var(--navy) 15%, transparent);
  text-align: center;
}

.cta-section h2 {
  font-size: clamp(1.5rem, 4vw, 2.25rem);
  font-weight: 900;
  margin: 0 0 0.75rem;
}

.cta-section p {
  margin: 0 0 1.5rem;
  line-height: 1.6;
}

.cta-section .btn {
  display: inline-block;
  padding: 0.9rem 1.75rem;
  background: var(--navy);
  color: #fff;
  text-decoration: none;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-size: 0.85rem;
}

.cta-section .btn:hover {
  opacity: 0.9;
}

.cta-section .btn:focus-visible {
  outline: 3px solid var(--navy);
  outline-offset: 3px;
}

@media (max-width: 768px) {
  .hero,
  .body {
    padding-inline: 1.25rem;
  }

  .hero {
    padding-top: 3rem;
  }

  .cta-section {
    padding-inline: 1.25rem;
  }
}
</style>
