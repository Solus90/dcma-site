import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SiteFooter from '../app/components/SiteFooter.vue'
import { makeSettings } from './fixtures'

describe('SiteFooter', () => {
  it('renders tagline, copyright, and facebook link', () => {
    const w = mount(SiteFooter, {
      props: {
        settings: makeSettings({
          footerTagline: 'MUTUAL AID FOR ALL',
          copyright: '© 2026 Mutual Aid Network. All rights reserved.',
          facebookUrl: 'https://facebook.com/x',
        }),
      },
    })

    expect(w.text()).toContain('MUTUAL AID FOR ALL')
    expect(w.text()).toContain('© 2026')
    expect(w.find('a[href="https://facebook.com/x"]').attributes('target')).toBe('_blank')
  })
})
