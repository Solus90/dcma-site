import { describe, it, expect } from 'vitest'
import { DEFAULT_MUTUAL_AID_PAGE } from '../app/utils/mutualAidPageDefaults'
import { normalizeMutualAidPage, DEFAULT_NAV_LINKS } from '../app/utils/contentDefaults'

describe('DEFAULT_MUTUAL_AID_PAGE', () => {
  it('has the hero, the solidarity section, and a six-book reading list', () => {
    expect(DEFAULT_MUTUAL_AID_PAGE.heroHeading).toBe('What is mutual aid?')
    expect(DEFAULT_MUTUAL_AID_PAGE.solidarityParagraphs.length).toBeGreaterThan(1)
    expect(DEFAULT_MUTUAL_AID_PAGE.books).toHaveLength(6)
  })

  it('only uses the three known difficulty labels', () => {
    const allowed = new Set(['Lighter', 'Moderate', 'Heavier'])
    for (const book of DEFAULT_MUTUAL_AID_PAGE.books) {
      expect(allowed.has(book.difficulty)).toBe(true)
    }
  })

  it('leads with the Dean Spade primer', () => {
    expect(DEFAULT_MUTUAL_AID_PAGE.books[0].author).toBe('Dean Spade')
  })
})

describe('normalizeMutualAidPage', () => {
  it('returns defaults when given nothing', () => {
    const page = normalizeMutualAidPage(null)
    expect(page.books).toHaveLength(6)
    expect(page.cta.href).toBe('/get-involved')
  })

  it('merges partial data, preferring provided values and keeping default arrays', () => {
    const page = normalizeMutualAidPage({
      heroHeading: 'Custom heading',
      books: [],
      seo: { title: 'Custom title', description: '' },
    })

    expect(page.heroHeading).toBe('Custom heading')
    expect(page.seo.title).toBe('Custom title')
    expect(page.books).toHaveLength(6)
  })
})

describe('DEFAULT_NAV_LINKS', () => {
  it('includes a top-level What Is Mutual Aid link', () => {
    const link = DEFAULT_NAV_LINKS.find(l => l.href === '/what-is-mutual-aid')
    expect(link).toBeDefined()
    expect(link?.label).toBe('What Is Mutual Aid')
    expect(link?.children).toBeUndefined()
  })
})
