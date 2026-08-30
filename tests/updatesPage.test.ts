import { describe, it, expect } from 'vitest'
import { DEFAULT_UPDATES_PAGE } from '../app/utils/updatesPageDefaults'
import { normalizeUpdatesPage } from '../app/utils/contentDefaults'

describe('normalizeUpdatesPage', () => {
  it('returns defaults for a missing or empty document', () => {
    expect(normalizeUpdatesPage(null).heroHeading).toBe('Updates')
    expect(normalizeUpdatesPage({}).lede).toBe(DEFAULT_UPDATES_PAGE.lede)
  })

  it('falls back to defaults for blank CMS fields but keeps real ones', () => {
    const page = normalizeUpdatesPage({
      heroHeading: 'Network News',
      lede: '',
      seo: { title: '', description: 'Custom description' },
    })

    expect(page.heroHeading).toBe('Network News')
    expect(page.lede).toBe(DEFAULT_UPDATES_PAGE.lede)
    expect(page.seo.title).toBe(DEFAULT_UPDATES_PAGE.seo.title)
    expect(page.seo.description).toBe('Custom description')
  })
})
