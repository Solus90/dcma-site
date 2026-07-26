import { describe, it, expect } from 'vitest'
import { normalizeHomePage, normalizeSiteSettings } from '../app/utils/contentDefaults'
import type { HomePage } from '../app/types/content'
import { makeSettings } from './fixtures'

const DEFAULT_NAV_COUNT = 4

describe('normalizeHomePage', () => {
  it('fills missing contactForm fields from defaults', () => {
    const page = normalizeHomePage({
      heroHeading: 'Test',
      heroTagline: 'Tag',
      heroImageUrl: '/hand.png',
      heroCta: { label: 'Go', href: '#' },
      missionEyebrow: 'Eyebrow',
      missionHeading: 'Mission',
      missionBody: 'Body',
      howItWorksHeading: 'How',
      howItWorksIntro: 'Intro',
      howItWorksCards: [],
      stats: [],
      statsAriaLabel: '',
      activitiesHeading: '',
      activities: [],
      contactHeading: 'Contact',
      contactForm: null as unknown as HomePage['contactForm'],
      seo: { title: 'T', description: 'D' },
    })

    expect(page.contactForm.reassurance).toContain('We read every message')
    expect(page.activitiesHeading).toBe('WHAT WE DO')
  })
})

describe('normalizeSiteSettings', () => {
  it('fills missing nav, errorPage, and fridgeShell fields from defaults', () => {
    const settings = normalizeSiteSettings(makeSettings({ navLinks: [] }))

    expect(settings.navLinks).toHaveLength(DEFAULT_NAV_COUNT)
    expect(settings.errorPage.backHomeLabel).toBe('Back home')
    expect(settings.fridgeShell.loadingMessage).toContain('Fetching')
  })
})
