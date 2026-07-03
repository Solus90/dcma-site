import { describe, it, expect } from 'vitest'
import { SITE_SETTINGS_QUERY, HOME_QUERY, FRIDGE_QUERY, PAGE_QUERY, ABOUT_QUERY } from '../app/composables/useSiteContent'

describe('GROQ queries', () => {
  it('target singleton ids and project image urls', () => {
    expect(SITE_SETTINGS_QUERY).toContain('"siteSettings"')
    expect(SITE_SETTINGS_QUERY).toContain('navLinks')
    expect(SITE_SETTINGS_QUERY).toContain('errorPage')
    expect(SITE_SETTINGS_QUERY).toContain('fridgeShell')
    expect(HOME_QUERY).toContain('"homePage"')
    expect(HOME_QUERY).toContain('heroImage.asset->url')
    expect(HOME_QUERY).toContain('missionImage.asset->url')
    expect(HOME_QUERY).toContain('activitiesHeading')
    expect(HOME_QUERY).toContain('contactForm')
    expect(FRIDGE_QUERY).toContain('"fridgePage"')
    expect(FRIDGE_QUERY).toContain('heroImage.asset->url')
    expect(FRIDGE_QUERY).toContain('findHeading')
    expect(FRIDGE_QUERY).toContain('closingHeading')
    expect(FRIDGE_QUERY).toContain('mapButtonLabel')
    expect(FRIDGE_QUERY).toContain('findFridgeCtaLabel')
    expect(PAGE_QUERY).toContain('"page"')
    expect(PAGE_QUERY).toContain('heroSection')
    expect(PAGE_QUERY).toContain('$slug')
    expect(ABOUT_QUERY).toContain('"aboutPage"')
    expect(ABOUT_QUERY).toContain('principlesHeading')
  })
})
