import { describe, it, expect } from 'vitest'
import { linkTarget } from '../app/utils/linkTarget'

describe('linkTarget', () => {
  it('opens http(s) and mailto links in a new tab', () => {
    expect(linkTarget('https://facebook.com/x')).toEqual({
      target: '_blank',
      rel: 'noopener noreferrer',
    })
    expect(linkTarget('mailto:a@b.co')).toEqual({
      target: '_blank',
      rel: 'noopener noreferrer',
    })
  })

  it('leaves hash and relative links alone', () => {
    expect(linkTarget('#find-fridge')).toEqual({})
    expect(linkTarget('/about')).toEqual({})
    expect(linkTarget(undefined)).toEqual({})
  })
})
