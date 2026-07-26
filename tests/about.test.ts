import { describe, it, expect } from 'vitest'
import { DEFAULT_ABOUT_PAGE } from '../app/utils/aboutPageDefaults'
import { normalizeAboutPage } from '../app/utils/contentDefaults'

describe('DEFAULT_ABOUT_PAGE', () => {
  it('includes mission, principles, norms, and navigable sections', () => {
    expect(DEFAULT_ABOUT_PAGE.missionBody).toContain('Door County Mutual Aid')
    expect(DEFAULT_ABOUT_PAGE.principles.length).toBeGreaterThan(5)
    expect(DEFAULT_ABOUT_PAGE.shortNorms).toContain('Assume best intentions')
    expect(DEFAULT_ABOUT_PAGE.toc.map(s => s.id)).toContain('security-meetings')
  })
})

describe('normalizeAboutPage', () => {
  it('merges partial data with defaults, preferring provided values', () => {
    const page = normalizeAboutPage({
      heroHeading: 'Custom heading',
      toc: [],
      principles: [],
      seo: { title: 'Custom title', description: '' },
    })

    expect(page.heroHeading).toBe('Custom heading')
    expect(page.seo.title).toBe('Custom title')
    expect(page.principles.length).toBeGreaterThan(5)
  })
})
