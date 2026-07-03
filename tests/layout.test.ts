import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SiteFooter from '../app/components/SiteFooter.vue'

describe('SiteFooter', () => {
  it('renders tagline, copyright, and facebook link', () => {
    const w = mount(SiteFooter, { props: { settings: {
      orgName: 'DCMA', logoUrl: '', email: 'x@y.z', facebookUrl: 'https://facebook.com/x',
      address: '', meetingNote: '', joinCta: { label: 'JOIN', href: '#' },
      footerTagline: 'MUTUAL AID FOR ALL', copyright: '© 2026 Mutual Aid Network. All rights reserved.',
    } } })
    expect(w.text()).toContain('MUTUAL AID FOR ALL')
    expect(w.text()).toContain('© 2026')
    expect(w.find('a[href="https://facebook.com/x"]').exists()).toBe(true)
  })
})
