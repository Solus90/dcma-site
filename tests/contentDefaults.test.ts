import { describe, it, expect } from 'vitest'
import { normalizeHomePage, normalizeSiteSettings, normalizeFridgePage } from '../app/utils/contentDefaults'
import type { FridgePage, HomePage } from '../app/types/content'
import { makeSettings, makeCta } from './fixtures'

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

describe('normalizeFridgePage', () => {
  const base: FridgePage = {
    heading: 'Fridge', intro: 'Intro', cta: makeCta(),
    findHeading: 'Find', locationAddress: '611 Jefferson St', locationHours: '24/7',
    pickupNote: 'No ID needed', mapButtonLabel: '', donationHeading: 'Donate',
    donationGuidelines: [], donationCta: makeCta(), valuesHeading: 'Values', values: [],
    closingHeading: '', closingNote: 'Note', closingCta: makeCta(),
    findFridgeCtaLabel: '', findFridgeMobileCtaLabel: '', quickActionsAriaLabel: '',
    seo: { title: '', description: '' },
  }

  it.each([
    ['mapButtonLabel', 'Open in Maps'],
    ['closingHeading', 'Show up for neighbors'],
    ['findFridgeCtaLabel', 'Find the fridge'],
    ['findFridgeMobileCtaLabel', 'Find fridge'],
    ['quickActionsAriaLabel', 'Quick actions'],
  ] as const)('fills missing %s with default', (field, expected) => {
    const page = normalizeFridgePage(base)
    expect(page[field]).toBe(expected)
  })

  it('preserves explicitly set values', () => {
    const page = normalizeFridgePage({ ...base, mapButtonLabel: 'Open map' })
    expect(page.mapButtonLabel).toBe('Open map')
  })
})

describe('normalizeSiteSettings', () => {
  it('fills missing nav, errorPage, and fridgeShell fields from defaults', () => {
    const settings = normalizeSiteSettings(makeSettings({ navLinks: [] }))

    const navLabels = settings.navLinks.map(l => l.label)
    expect(navLabels).toContain('Home')
    expect(settings.navLinks.some(l => l.children && l.children.length > 0)).toBe(true)
    expect(settings.errorPage.backHomeLabel).toBe('Back home')
    expect(settings.fridgeShell.loadingMessage).toContain('Fetching')
  })
})
