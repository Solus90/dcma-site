<script setup lang="ts">
const { data: page } = await useAboutPage()

useSeoMeta({
  title: () => page.value?.seo.title,
  description: () => page.value?.seo.description,
})
</script>

<template>
  <main v-if="page" id="main-content" class="about-page">
    <header class="hero">
      <p class="eyebrow">{{ page.heroEyebrow }}</p>
      <h1 class="display">{{ page.heroHeading }}</h1>
      <p class="meta">Version {{ page.version }} · {{ page.date }}</p>
      <p class="lede">{{ page.lede }}</p>
    </header>

    <div class="cards-wrapper">
      <details id="introduction" class="section-card" open>
        <summary class="card-summary">
          <span class="card-title display">{{ page.introductionHeading }}</span>
          <span class="card-chevron" aria-hidden="true" />
        </summary>
        <div class="card-body prose">
          <p v-for="(paragraph, i) in page.introductionParagraphs" :key="i">{{ paragraph }}</p>
        </div>
      </details>

      <details id="mission" class="section-card mission-card" open>
        <summary class="card-summary">
          <span class="card-title display">{{ page.missionTitle }}</span>
          <span class="card-chevron" aria-hidden="true" />
        </summary>
        <div class="card-body">
          <p class="mission-body">{{ page.missionBody }}</p>
        </div>
      </details>

      <details id="principles" class="section-card">
        <summary class="card-summary">
          <span class="card-title display">{{ page.principlesHeading }}</span>
          <span class="card-chevron" aria-hidden="true" />
        </summary>
        <div class="card-body">
          <p class="section-intro">{{ page.principlesIntro }}</p>
          <div class="principle-grid">
            <article v-for="principle in page.principles" :key="principle.title" class="principle-card">
              <h3>{{ principle.title }}</h3>
              <p>{{ principle.body }}</p>
            </article>
          </div>
        </div>
      </details>

      <details id="norms-tldr" class="section-card">
        <summary class="card-summary">
          <span class="card-title display">{{ page.shortNormsHeading }}</span>
          <span class="card-chevron" aria-hidden="true" />
        </summary>
        <div class="card-body">
          <p class="section-intro">{{ page.shortNormsIntro }}</p>
          <ul class="norms-tldr">
            <li v-for="norm in page.shortNorms" :key="norm">{{ norm }}</li>
          </ul>
        </div>
      </details>

      <details id="collective-norms" class="section-card">
        <summary class="card-summary">
          <span class="card-title display">{{ page.collectiveNormsHeading }}</span>
          <span class="card-chevron" aria-hidden="true" />
        </summary>
        <div class="card-body">
          <p class="section-intro">{{ page.collectiveNormsIntro }}</p>
          <dl class="norm-list">
            <div v-for="norm in page.collectiveNorms" :key="norm.title" class="norm-item">
              <dt>{{ norm.title }}</dt>
              <dd>{{ norm.body }}</dd>
            </div>
          </dl>
        </div>
      </details>

      <details id="security" class="section-card">
        <summary class="card-summary">
          <span class="card-title display">{{ page.securityHeading }}</span>
          <span class="card-chevron" aria-hidden="true" />
        </summary>
        <div class="card-body">
          <p class="section-intro">{{ page.securityIntro }}</p>
          <aside class="callout" aria-label="Security norms summary">
            <p class="callout-label">TLDR</p>
            <p>{{ page.securityTldr }}</p>
          </aside>
          <p>{{ page.securityContext }}</p>
          <ul class="bullet-list">
            <li v-for="item in page.securityItems" :key="item">{{ item }}</li>
          </ul>
          <h3 class="subsection-heading">{{ page.securityConfrontationalHeading }}</h3>
          <ul class="bullet-list">
            <li v-for="item in page.securityConfrontationalItems" :key="item">{{ item }}</li>
          </ul>
        </div>
      </details>

      <details id="security-meetings" class="section-card">
        <summary class="card-summary">
          <span class="card-title display">{{ page.securityMeetingsHeading }}</span>
          <span class="card-chevron" aria-hidden="true" />
        </summary>
        <div class="card-body">
          <ul class="bullet-list">
            <li v-for="item in page.securityMeetingItems" :key="item">{{ item }}</li>
          </ul>
        </div>
      </details>
    </div>
  </main>
</template>

<style scoped>
.about-page {
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
  margin: 0.5rem 0 0.75rem;
  text-wrap: balance;
}

.meta {
  margin: 0 0 1.5rem;
  font-size: 0.9rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.lede {
  max-width: 65ch;
  font-size: 1.25rem;
  line-height: 1.55;
  font-weight: 600;
  margin: 0;
  text-wrap: pretty;
}

/* ── Cards layout ── */
.cards-wrapper {
  max-width: 72rem;
  margin-inline: auto;
  padding-inline: 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.section-card {
  border: 1px solid var(--hairline);
  background: #fff;
}

.section-card[open] {
  border-color: color-mix(in oklab, var(--navy) 25%, transparent);
}

.card-summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  cursor: pointer;
  list-style: none;
  user-select: none;
}

.card-summary::-webkit-details-marker {
  display: none;
}

.card-summary:hover {
  background: color-mix(in oklab, var(--periwinkle) 40%, transparent);
}

.card-title {
  font-size: clamp(1.1rem, 2.5vw, 1.6rem);
  font-weight: 900;
  line-height: 1.15;
  text-wrap: balance;
}

.card-chevron {
  flex-shrink: 0;
  width: 1.25rem;
  height: 1.25rem;
  border-right: 2.5px solid var(--navy);
  border-bottom: 2.5px solid var(--navy);
  transform: rotate(45deg);
  transition: transform 0.2s ease;
  margin-top: -0.35rem;
}

details[open] .card-chevron {
  transform: rotate(-135deg);
  margin-top: 0.35rem;
}

.card-body {
  padding: 0 1.5rem 1.5rem;
}

/* ── Mission card variant ── */
.mission-card {
  background: var(--periwinkle);
  border-color: color-mix(in oklab, var(--navy) 15%, transparent);
}

.mission-card .card-summary:hover {
  background: color-mix(in oklab, var(--periwinkle) 70%, transparent);
}

.mission-body {
  font-size: 1.15rem;
  font-weight: 600;
  line-height: 1.65;
  max-width: 65ch;
  margin: 0;
  text-wrap: pretty;
}

/* ── Shared content styles ── */
.section-intro,
.prose p {
  max-width: 65ch;
  line-height: 1.65;
  margin: 0 0 1rem;
  text-wrap: pretty;
}

.principle-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 18rem), 1fr));
  gap: 1.25rem;
  margin-top: 1rem;
}

.principle-card {
  background: var(--periwinkle);
  border: 1px solid color-mix(in oklab, var(--hairline) 35%, transparent);
  padding: 1.25rem 1.5rem;
}

.principle-card h3 {
  margin: 0 0 0.75rem;
  font-size: 1rem;
  font-weight: 900;
  font-stretch: expanded;
  line-height: 1.15;
  text-wrap: balance;
}

.principle-card p {
  margin: 0;
  line-height: 1.6;
  font-size: 0.95rem;
  text-wrap: pretty;
}

.norms-tldr {
  columns: 3;
  column-gap: 2rem;
  margin: 1rem 0 0;
  padding: 1.25rem 1.5rem;
  background: var(--periwinkle);
  list-style: none;
}

.norms-tldr li {
  position: relative;
  break-inside: avoid;
  margin-bottom: 0.65rem;
  padding-left: 1.1rem;
  line-height: 1.5;
  text-wrap: pretty;
}

.norms-tldr li:last-child {
  margin-bottom: 0;
}

.norms-tldr li::before {
  content: '·';
  position: absolute;
  left: 0;
  font-weight: 700;
  color: var(--navy);
}

.norm-list {
  margin: 1rem 0 0;
}

.norm-item {
  padding-block: 1.25rem;
  border-bottom: 1px solid color-mix(in oklab, var(--hairline) 35%, transparent);
}

.norm-item:first-child {
  border-top: 1px solid color-mix(in oklab, var(--hairline) 35%, transparent);
}

.norm-item dt {
  margin: 0 0 0.5rem;
  font-weight: 900;
  font-stretch: expanded;
  line-height: 1.15;
  text-wrap: balance;
}

.norm-item dd {
  margin: 0;
  max-width: 65ch;
  line-height: 1.65;
  text-wrap: pretty;
}

.callout {
  margin: 0 0 1.25rem;
  padding: 1.25rem 1.5rem;
  background: var(--navy);
  color: #fff;
}

.callout-label {
  margin: 0 0 0.5rem;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-weight: 700;
}

.callout p:last-child {
  margin: 0;
  line-height: 1.6;
  text-wrap: pretty;
}

.subsection-heading {
  margin: 1.5rem 0 0.75rem;
  font-size: 1.05rem;
  font-weight: 900;
  font-stretch: expanded;
  line-height: 1.2;
  text-wrap: pretty;
}

.bullet-list {
  margin: 0 0 1rem;
  padding-left: 1.25rem;
  max-width: 65ch;
}

.bullet-list li {
  margin-bottom: 0.65rem;
  line-height: 1.6;
  text-wrap: pretty;
}

.bullet-list li:last-child {
  margin-bottom: 0;
}

@media (max-width: 900px) {
  .norms-tldr {
    columns: 2;
  }
}

@media (max-width: 768px) {
  .hero,
  .cards-wrapper {
    padding-inline: 1.25rem;
  }

  .hero {
    padding-top: 3rem;
  }

  .norms-tldr {
    columns: 1;
  }
}
</style>
