import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import FridgeValueList from '../app/components/fridge/FridgeValueList.vue'
import { makeCard } from './fixtures'

describe('FridgeValueList', () => {
  it('renders section heading and each value', () => {
    const w = mount(FridgeValueList, {
      props: {
        heading: 'Why we run it',
        values: [makeCard({ title: 'UNCONDITIONAL SUPPORT', body: 'We provide direct assistance.' })],
      },
    })

    expect(w.text()).toContain('Why we run it')
    expect(w.text()).toContain('UNCONDITIONAL SUPPORT')
    expect(w.text()).toContain('direct assistance')
  })
})

describe('Apple Maps URL construction', () => {
  function buildAppleMapUrl(address: string): string {
    const q = encodeURIComponent(address.replace(/\n/g, ', '))
    return `https://maps.apple.com/?q=${q}`
  }

  it('encodes a single-line address', () => {
    const url = buildAppleMapUrl('611 Jefferson Street, Sturgeon Bay')
    expect(url).toBe('https://maps.apple.com/?q=611%20Jefferson%20Street%2C%20Sturgeon%20Bay')
  })

  it('converts newlines to commas before encoding', () => {
    const url = buildAppleMapUrl('611 Jefferson Street\nSturgeon Bay')
    expect(url).toContain('611%20Jefferson%20Street%2C%20Sturgeon%20Bay')
  })

  it('always produces a valid maps.apple.com URL', () => {
    const url = buildAppleMapUrl('Any Address')
    expect(url.startsWith('https://maps.apple.com/?q=')).toBe(true)
  })
})
