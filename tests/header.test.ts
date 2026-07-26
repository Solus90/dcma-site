import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SiteHeader from '../app/components/SiteHeader.vue'
import { makeSettings, makeNavLink } from './fixtures'

function mountHeader(navLinks: ReturnType<typeof makeNavLink>[]) {
  return mount(SiteHeader, {
    props: {
      settings: makeSettings({
        orgName: 'DCMA',
        joinCta: { label: 'JOIN', href: 'mailto:join@example.com' },
        navLinks,
      }),
    },
  })
}

describe('SiteHeader', () => {
  it('renders plain links for top-level items without children', () => {
    const w = mountHeader([
      makeNavLink({ label: 'Home', href: '/' }),
      makeNavLink({ label: 'Get Involved', href: '/get-involved' }),
    ])

    expect(w.text()).toContain('Home')
    expect(w.text()).toContain('Get Involved')
    expect(w.findAll('.dropdown')).toHaveLength(0)
  })

  it('renders a dropdown trigger and its children for items with children', () => {
    const w = mountHeader([
      makeNavLink({
        label: 'About Us',
        href: '/about',
        children: [
          { label: 'Our Mission', href: '/about' },
          { label: 'Financials', href: '/financials' },
        ],
      }),
    ])

    expect(w.text()).toContain('About Us')
    expect(w.findAll('.dropdown')).toHaveLength(1)
    expect(w.text()).toContain('Our Mission')
    expect(w.text()).toContain('Financials')
  })

  it('renders a label-only dropdown trigger when href is absent', () => {
    const w = mountHeader([
      makeNavLink({
        label: 'More',
        href: undefined,
        children: [{ label: 'Updates', href: '/updates' }],
      }),
    ])

    expect(w.find('.no-link').text()).toContain('More')
    expect(w.text()).toContain('Updates')
  })

  it('renders the join CTA', () => {
    const w = mountHeader([])
    expect(w.find('a.join').text()).toBe('JOIN')
  })
})
