import { describe, it, expect } from 'vitest'
import { normalizeHomePage, normalizeSiteSettings } from '../app/utils/contentDefaults'
import type { HomePage, SiteSettings } from '../app/types/content'

describe('content defaults', () => {
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

  it('fills missing site settings shell fields from defaults', () => {
    const settings = normalizeSiteSettings({
      orgName: 'DCMA',
      logoUrl: '',
      email: 'x@y.z',
      facebookUrl: 'https://facebook.com/x',
      address: '',
      meetingNote: '',
      joinCta: { label: 'Join', href: '#' },
      footerTagline: 'Tagline',
      copyright: '© 2026',
      skipLinkLabel: '',
      facebookLabel: '',
      navAriaLabel: '',
      navLinks: [],
      errorPage: null as unknown as SiteSettings['errorPage'],
      fridgeShell: null as unknown as SiteSettings['fridgeShell'],
    })

    expect(settings.navLinks).toHaveLength(3)
    expect(settings.errorPage.backHomeLabel).toBe('Back home')
    expect(settings.fridgeShell.loadingMessage).toContain('Fetching')
  })
})
