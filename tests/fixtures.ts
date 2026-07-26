import type { Card, Cta, NavLink, SiteSettings } from '../app/types/content'

export function makeNavLink(overrides?: Partial<NavLink>): NavLink {
  return { label: 'Home', href: '/', ...overrides }
}

export function makeCta(overrides?: Partial<Cta>): Cta {
  return { label: 'Go', href: '#', ...overrides }
}

export function makeCard(overrides?: Partial<Card>): Card {
  return { _key: 'c1', title: 'Card', ...overrides }
}

export function makeSettings(overrides?: Partial<SiteSettings>): SiteSettings {
  return {
    orgName: 'DCMA',
    logoUrl: '',
    email: 'x@y.z',
    facebookUrl: 'https://facebook.com/x',
    address: '',
    meetingNote: '',
    joinCta: makeCta({ label: 'JOIN', href: '#' }),
    footerTagline: 'MUTUAL AID FOR ALL',
    copyright: '© 2026 Mutual Aid Network. All rights reserved.',
    skipLinkLabel: 'Skip to content',
    facebookLabel: 'Facebook',
    navAriaLabel: 'Main',
    navLinks: [],
    errorPage: {
      notFoundTitle: '',
      notFoundDescription: '',
      notFoundMetaTitle: '',
      genericTitle: '',
      genericDescription: '',
      genericMetaTitle: '',
      backHomeLabel: '',
      fridgeLinkLabel: '',
      emailUsLabel: '',
    },
    fridgeShell: {
      loadingEyebrow: '',
      loadingMessage: '',
      errorHeading: '',
      errorMessage: '',
      errorEmailSubject: '',
      errorEmailButtonLabel: '',
    },
    ...overrides,
  }
}
