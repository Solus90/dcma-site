import { describe, it, expect } from 'vitest'
import { SITE_SETTINGS_QUERY, HOME_QUERY, FRIDGE_QUERY, PAGE_QUERY, ABOUT_QUERY } from '../app/composables/useSiteContent'

describe('GROQ queries', () => {
  it.each([
    ['SITE_SETTINGS_QUERY', SITE_SETTINGS_QUERY, ['"siteSettings"', 'navLinks', 'errorPage', 'fridgeShell']],
    ['HOME_QUERY', HOME_QUERY, ['"homePage"', 'heroImage.asset->url', 'missionImage.asset->url', 'activitiesHeading', 'contactForm']],
    ['FRIDGE_QUERY', FRIDGE_QUERY, ['"fridgePage"', 'heroImage.asset->url', 'findHeading', 'closingHeading', 'mapButtonLabel', 'findFridgeCtaLabel']],
    ['PAGE_QUERY', PAGE_QUERY, ['"page"', 'heroSection', '$slug']],
    ['ABOUT_QUERY', ABOUT_QUERY, ['"aboutPage"', 'principlesHeading']],
  ])('%s targets the correct singleton and projects required fields', (_, query, fields) => {
    fields.forEach(field => expect(query).toContain(field))
  })
})
