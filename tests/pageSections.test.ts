import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PageSections from '../app/components/page/PageSections.vue'
import HomeHero from '../app/components/home/HomeHero.vue'
import PageSplitSection from '../app/components/page/PageSplitSection.vue'
import PageProseSection from '../app/components/page/PageProseSection.vue'
import HomeHowItWorks from '../app/components/home/HowItWorks.vue'
import HomeActivityGrid from '../app/components/home/ActivityGrid.vue'
import FridgeClosingCta from '../app/components/fridge/FridgeClosingCta.vue'
import ContactSection from '../app/components/ContactSection.vue'
import { makeCard, makeSettings } from './fixtures'
import { DEFAULT_CONTACT_FORM } from '../app/utils/contentDefaults'
import type { PageSection } from '../app/types/content'

// This is the [slug].vue / projects/index.vue rendering path: sections come
// straight from Sanity as untyped `_type`-tagged blobs, and this component's
// v-else-if chain is the only thing standing between a stale/renamed _type
// and a broken generic page. Every branch gets one fixture here so a section
// type losing its match (like homepage's now-removed statsSection did) shows
// up as a missing render instead of a silent gap or a prod crash.
const sections: PageSection[] = [
  {
    _key: 'hero', _type: 'heroSection',
    heading: 'Hero heading', tagline: 'Hero tagline',
    cta: { label: 'Hero CTA', href: '/hero-cta' },
  },
  {
    _key: 'split', _type: 'splitSection',
    eyebrow: 'Split eyebrow', heading: 'Split heading', body: 'Split body',
  },
  {
    _key: 'prose', _type: 'proseSection',
    eyebrow: 'Prose eyebrow', heading: 'Prose heading', body: 'Prose body',
  },
  {
    _key: 'cards-simple', _type: 'cardGridSection', style: 'simple',
    heading: 'How it works heading', intro: 'How it works intro',
    cards: [makeCard({ title: 'Simple card' })],
  },
  {
    _key: 'cards-photos', _type: 'cardGridSection', style: 'photos',
    heading: 'Activities heading',
    cards: [makeCard({ title: 'Photo card' })],
  },
  {
    _key: 'cta', _type: 'ctaSection',
    heading: 'CTA heading', note: 'CTA note', cta: { label: 'CTA button', href: '/cta' },
  },
  {
    _key: 'contact', _type: 'contactSectionBlock',
    heading: 'Contact heading',
  },
]

function mountSections(list: PageSection[]) {
  return mount(PageSections, {
    props: { sections: list, settings: makeSettings(), contactForm: DEFAULT_CONTACT_FORM },
    global: {
      components: {
        HomeHero,
        PageSplitSection,
        PageProseSection,
        HomeHowItWorks,
        HomeActivityGrid,
        FridgeClosingCta,
        ContactSection,
      },
    },
  })
}

describe('PageSections', () => {
  it('renders exactly one component per section, matched by _type', () => {
    const w = mountSections(sections)
    const text = w.text()

    expect(text).toContain('Hero heading')
    expect(text).toContain('Split heading')
    expect(text).toContain('Prose heading')
    expect(text).toContain('How it works heading')
    expect(text).toContain('Activities heading')
    expect(text).toContain('CTA heading')
    expect(text).toContain('Contact heading')
  })

  it('renders nothing for an unrecognized _type instead of throwing', () => {
    const w = mountSections([
      { _key: 'ghost', _type: 'retiredSection' } as unknown as PageSection,
    ])

    expect(w.text()).toBe('')
  })
})
