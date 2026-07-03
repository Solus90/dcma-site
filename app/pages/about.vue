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

    <nav class="toc" :aria-label="page.tocAriaLabel">
      <p class="toc-label">{{ page.tocAriaLabel }}</p>
      <ul>
        <li v-for="section in page.toc" :key="section.id">
          <a :href="`#${section.id}`">{{ section.label }}</a>
        </li>
      </ul>
    </nav>

    <section id="introduction" class="section prose" aria-labelledby="intro-heading">
      <h2 id="intro-heading" class="display section-heading">{{ page.introductionHeading }}</h2>
      <p v-for="(paragraph, i) in page.introductionParagraphs" :key="i">{{ paragraph }}</p>
    </section>

    <section id="mission" class="section mission" aria-labelledby="mission-heading">
      <h2 id="mission-heading" class="display section-heading">{{ page.missionTitle }}</h2>
      <p class="mission-body">{{ page.missionBody }}</p>
    </section>

    <section id="principles" class="section" aria-labelledby="principles-heading">
      <h2 id="principles-heading" class="display section-heading">{{ page.principlesHeading }}</h2>
      <p class="section-intro">{{ page.principlesIntro }}</p>
      <div class="principle-grid">
        <article v-for="principle in page.principles" :key="principle.title" class="principle-card">
          <h3>{{ principle.title }}</h3>
          <p>{{ principle.body }}</p>
        </article>
      </div>
    </section>

    <section id="norms-tldr" class="section" aria-labelledby="norms-tldr-heading">
      <h2 id="norms-tldr-heading" class="display section-heading">{{ page.shortNormsHeading }}</h2>
      <p class="section-intro">{{ page.shortNormsIntro }}</p>
      <ul class="norms-tldr">
        <li v-for="norm in page.shortNorms" :key="norm">{{ norm }}</li>
      </ul>
    </section>

    <section id="collective-norms" class="section" aria-labelledby="collective-norms-heading">
      <h2 id="collective-norms-heading" class="display section-heading">{{ page.collectiveNormsHeading }}</h2>
      <p class="section-intro">{{ page.collectiveNormsIntro }}</p>
      <dl class="norm-list">
        <div v-for="norm in page.collectiveNorms" :key="norm.title" class="norm-item">
          <dt>{{ norm.title }}</dt>
          <dd>{{ norm.body }}</dd>
        </div>
      </dl>
    </section>

    <section id="security" class="section security" aria-labelledby="security-heading">
      <h2 id="security-heading" class="display section-heading">{{ page.securityHeading }}</h2>
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
    </section>

    <section id="security-meetings" class="section security-meetings" aria-labelledby="security-meetings-heading">
      <h2 id="security-meetings-heading" class="display section-heading">{{ page.securityMeetingsHeading }}</h2>
      <ul class="bullet-list">
        <li v-for="item in page.securityMeetingItems" :key="item">{{ item }}</li>
      </ul>
    </section>
  </main>
</template>

<style scoped>
.about-page {
  padding-bottom: 4rem;
}

.hero,
.toc,
.section {
  max-width: 72rem;
  margin-inline: auto;
  padding-inline: 2rem;
}

.hero {
  padding-top: 4rem;
  padding-bottom: 2rem;
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

.toc {
  padding-block: 1.5rem 2.5rem;
}

.toc-label {
  margin: 0 0 0.75rem;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.toc ul {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1.25rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.toc a {
  color: var(--navy);
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 600;
  padding: 0.25rem;
  min-height: 44px;
  display: inline-flex;
  align-items: center;
}

.toc a:hover {
  text-decoration: underline;
  text-underline-offset: 4px;
}

.toc a:focus-visible {
  outline: 3px solid var(--navy);
  outline-offset: 2px;
}

.section {
  padding-block: 2.5rem;
  border-top: 1px solid var(--hairline);
}

.section-heading {
  font-size: clamp(1.75rem, 4.5vw, 3rem);
  margin: 0 0 1rem;
  text-wrap: balance;
}

.section-intro,
.prose p,
.mission-body {
  max-width: 65ch;
  line-height: 1.65;
  margin: 0 0 1rem;
  text-wrap: pretty;
}

.mission {
  background: var(--periwinkle);
  padding-block: 3rem;
}

.mission-body {
  font-size: 1.15rem;
  font-weight: 600;
  margin: 0;
}

.principle-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 18rem), 1fr));
  gap: 1.25rem;
  margin-top: 1.5rem;
}

.principle-card {
  background: #fff;
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
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr));
  gap: 0.75rem 1.5rem;
  margin: 1.5rem 0 0;
  padding: 1.5rem;
  background: var(--periwinkle);
  list-style: none;
}

.norms-tldr li {
  position: relative;
  padding-left: 1.1rem;
  line-height: 1.5;
  text-wrap: pretty;
}

.norms-tldr li::before {
  content: '·';
  position: absolute;
  left: 0;
  font-weight: 700;
  color: var(--navy);
}

.norm-list {
  margin: 1.5rem 0 0;
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
  margin: 1.5rem 0;
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
  margin: 2rem 0 1rem;
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

@media (max-width: 768px) {
  .hero,
  .toc,
  .section {
    padding-inline: 1.25rem;
  }

  .hero {
    padding-top: 3rem;
  }

  .norms-tldr {
    grid-template-columns: 1fr;
  }
}
</style>
