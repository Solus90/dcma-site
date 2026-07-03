import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import HowItWorks from '../app/components/home/HowItWorks.vue'
import StatsMarquee from '../app/components/home/StatsMarquee.vue'

describe('HowItWorks', () => {
  it('renders a card with title, body, and cta link', () => {
    const w = mount(HowItWorks, { props: { heading: 'How It Works', intro: 'intro',
      cards: [{ _key: 'k1', title: 'Offer Help', body: 'Share resources.', cta: { label: 'OFFER SUPPORT', href: 'mailto:x@y.z' } }] } })
    expect(w.text()).toContain('Offer Help')
    expect(w.find('a[href="mailto:x@y.z"]').text()).toBe('OFFER SUPPORT')
  })
})

describe('StatsMarquee', () => {
  it('renders every stat', () => {
    const w = mount(StatsMarquee, { props: { stats: ['150+ HOURS', '70+ MEMBERS'] } })
    expect(w.text()).toContain('150+ HOURS')
    expect(w.text()).toContain('70+ MEMBERS')
  })
})
