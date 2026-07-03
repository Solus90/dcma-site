import { describe, it, expect } from 'vitest'
import { SITE_SETTINGS_QUERY, HOME_QUERY, FRIDGE_QUERY } from '../app/composables/useSiteContent'

describe('GROQ queries', () => {
  it('target singleton ids and project image urls', () => {
    expect(SITE_SETTINGS_QUERY).toContain('"siteSettings"')
    expect(SITE_SETTINGS_QUERY).toContain('logo.asset->url')
    expect(HOME_QUERY).toContain('"homePage"')
    expect(HOME_QUERY).toContain('heroImage.asset->url')
    expect(FRIDGE_QUERY).toContain('"fridgePage"')
  })
})
