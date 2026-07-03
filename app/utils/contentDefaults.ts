import type {
  AboutPage,
  ContactFormCopy,
  CmsPage,
  ErrorPageCopy,
  FridgePage,
  FridgeShellCopy,
  HomePage,
  NavLink,
  SiteSettings,
  StatsSection,
} from '~/types/content'
import { DEFAULT_ABOUT_PAGE } from '~/utils/aboutPageDefaults'

export const DEFAULT_NAV_LINKS: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Full Hearts Fridge', href: '/full-hearts-fridge' },
]

export const DEFAULT_CONTACT_FORM: ContactFormCopy = {
  reassurance: 'We read every message and usually respond within a couple of days.',
  firstNameLabel: 'First Name',
  lastNameLabel: 'Last Name',
  emailLabel: 'Email Address',
  subjectLabel: 'Subject',
  messageLabel: 'Message',
  submitLabel: 'Send Message',
  sendingLabel: 'Sending…',
  successMessage: 'Thanks — we\'ll be in touch.',
  fixFieldsMessage: 'Please fix the highlighted fields and try again.',
  serverErrorMessage: 'Something went wrong — please email us directly instead.',
  emailInvalidMessage: 'Enter a valid email address.',
  fieldRequiredSuffix: 'is required.',
}

export const DEFAULT_ERROR_PAGE: ErrorPageCopy = {
  notFoundTitle: 'This page isn\'t here',
  notFoundDescription: 'The link may be old or mistyped. You can still find help, food, or a way to plug in below.',
  notFoundMetaTitle: 'Page not found | Door County Mutual Aid',
  genericTitle: 'Something went wrong',
  genericDescription: 'We hit a snag loading this page. Head home or email us if it keeps happening.',
  genericMetaTitle: 'Something went wrong | Door County Mutual Aid',
  backHomeLabel: 'Back home',
  fridgeLinkLabel: 'Full Hearts Fridge',
  emailUsLabel: 'Email us',
}

export const DEFAULT_FRIDGE_SHELL: FridgeShellCopy = {
  loadingEyebrow: 'Loading',
  loadingMessage: 'Fetching the latest fridge info…',
  errorHeading: 'Page unavailable',
  errorMessage: 'We couldn\'t load this page right now. Email us and a neighbor will help.',
  errorEmailSubject: 'Full Hearts Fridge question',
  errorEmailButtonLabel: 'Email',
}

function mergeRecords<T extends Record<string, unknown>>(defaults: T, data: Partial<T> | null | undefined): T {
  const merged = { ...defaults }
  if (!data) return merged

  for (const key of Object.keys(defaults) as (keyof T)[]) {
    const value = data[key]
    if (value === null || value === undefined || value === '') continue
    merged[key] = value as T[keyof T]
  }

  return merged
}

export function normalizeSiteSettings(data: SiteSettings): SiteSettings {
  return {
    ...data,
    skipLinkLabel: data.skipLinkLabel || 'Skip to content',
    facebookLabel: data.facebookLabel || 'Facebook',
    navAriaLabel: data.navAriaLabel || 'Main',
    navLinks: data.navLinks?.length ? data.navLinks : DEFAULT_NAV_LINKS,
    errorPage: mergeRecords(DEFAULT_ERROR_PAGE, data.errorPage),
    fridgeShell: mergeRecords(DEFAULT_FRIDGE_SHELL, data.fridgeShell),
  }
}

export function normalizeHomePage(data: HomePage): HomePage {
  return {
    ...data,
    statsAriaLabel: data.statsAriaLabel || 'Community impact',
    activitiesHeading: data.activitiesHeading || 'WHAT WE DO',
    contactForm: mergeRecords(DEFAULT_CONTACT_FORM, data.contactForm),
  }
}

export function normalizeFridgePage(data: FridgePage): FridgePage {
  return {
    ...data,
    mapButtonLabel: data.mapButtonLabel || 'Open in Maps',
    closingHeading: data.closingHeading || 'Show up for neighbors',
    findFridgeCtaLabel: data.findFridgeCtaLabel || 'Find the fridge',
    findFridgeMobileCtaLabel: data.findFridgeMobileCtaLabel || 'Find fridge',
    quickActionsAriaLabel: data.quickActionsAriaLabel || 'Quick actions',
  }
}

export function normalizeCmsPage(data: CmsPage): CmsPage {
  return {
    ...data,
    sections: data.sections.map((section) => {
      if (section._type !== 'statsSection') return section
      const statsSection = section as StatsSection
      return {
        ...statsSection,
        ariaLabel: statsSection.ariaLabel || 'Community impact',
      }
    }),
  }
}

export function normalizeAboutPage(data: Partial<AboutPage> | null | undefined): AboutPage {
  const defaults = DEFAULT_ABOUT_PAGE as AboutPage
  if (!data) return defaults

  const pickArray = <T>(value: T[] | undefined, fallback: T[]) =>
    value?.length ? value : fallback

  return {
    ...defaults,
    ...data,
    toc: pickArray(data.toc, defaults.toc),
    introductionParagraphs: pickArray(data.introductionParagraphs, defaults.introductionParagraphs),
    principles: pickArray(data.principles, defaults.principles),
    shortNorms: pickArray(data.shortNorms, defaults.shortNorms),
    collectiveNorms: pickArray(data.collectiveNorms, defaults.collectiveNorms),
    securityItems: pickArray(data.securityItems, defaults.securityItems),
    securityConfrontationalItems: pickArray(data.securityConfrontationalItems, defaults.securityConfrontationalItems),
    securityMeetingItems: pickArray(data.securityMeetingItems, defaults.securityMeetingItems),
    seo: mergeRecords(defaults.seo, data.seo),
  }
}
