export interface Cta { label: string; href: string }
export interface NavLink { label: string; href: string }
export interface Card {
  _key: string
  title: string
  body?: string
  cta?: Cta
  imageUrl?: string
  imageAlt?: string
}
export interface ContactFormCopy {
  reassurance: string
  firstNameLabel: string
  lastNameLabel: string
  emailLabel: string
  subjectLabel: string
  messageLabel: string
  submitLabel: string
  sendingLabel: string
  successMessage: string
  fixFieldsMessage: string
  serverErrorMessage: string
  emailInvalidMessage: string
  fieldRequiredSuffix: string
}
export interface ErrorPageCopy {
  notFoundTitle: string
  notFoundDescription: string
  notFoundMetaTitle: string
  genericTitle: string
  genericDescription: string
  genericMetaTitle: string
  backHomeLabel: string
  fridgeLinkLabel: string
  emailUsLabel: string
}
export interface FridgeShellCopy {
  loadingEyebrow: string
  loadingMessage: string
  errorHeading: string
  errorMessage: string
  errorEmailSubject: string
  errorEmailButtonLabel: string
}
export interface SiteSettings {
  orgName: string
  logoUrl: string
  email: string
  facebookUrl: string
  address: string
  meetingNote: string
  joinCta: Cta
  footerTagline: string
  copyright: string
  skipLinkLabel: string
  facebookLabel: string
  navAriaLabel: string
  navLinks: NavLink[]
  errorPage: ErrorPageCopy
  fridgeShell: FridgeShellCopy
}
export interface HomePage {
  heroHeading: string
  heroTagline: string
  heroImageUrl: string
  heroImageAlt?: string
  heroCta: Cta
  missionEyebrow: string
  missionHeading: string
  missionBody: string
  missionImageUrl?: string
  missionImageAlt?: string
  howItWorksHeading: string
  howItWorksIntro: string
  howItWorksCards: Card[]
  stats: string[]
  statsAriaLabel: string
  activitiesHeading: string
  activities: Card[]
  contactHeading: string
  contactForm: ContactFormCopy
  seo: { title: string; description: string }
}
export interface FridgePage {
  heading: string
  intro: string
  heroImageUrl?: string
  heroImageAlt?: string
  cta: Cta
  findHeading: string
  locationAddress: string
  locationHours: string
  pickupNote: string
  mapUrl?: string
  mapButtonLabel: string
  donationHeading: string
  donationGuidelines: string[]
  donationCta: Cta
  valuesHeading: string
  values: Card[]
  closingHeading: string
  closingNote: string
  closingCta: Cta
  findFridgeCtaLabel: string
  findFridgeMobileCtaLabel: string
  quickActionsAriaLabel: string
  seo: { title: string; description: string }
}

export interface HeroSection {
  _key: string
  _type: 'heroSection'
  heading: string
  tagline?: string
  imageUrl?: string
  imageAlt?: string
  cta?: Cta
  secondaryCta?: Cta
}

export interface SplitSection {
  _key: string
  _type: 'splitSection'
  eyebrow?: string
  heading: string
  body?: string
  imageUrl?: string
  imageAlt?: string
  imagePosition?: 'left' | 'right'
}

export interface ProseSection {
  _key: string
  _type: 'proseSection'
  eyebrow?: string
  heading?: string
  body?: string
}

export interface CardGridSection {
  _key: string
  _type: 'cardGridSection'
  heading?: string
  intro?: string
  style?: 'simple' | 'photos'
  cards: Card[]
}

export interface ValuesSection {
  _key: string
  _type: 'valuesSection'
  heading?: string
  values: Card[]
}

export interface CtaSection {
  _key: string
  _type: 'ctaSection'
  heading?: string
  note?: string
  cta: Cta
  secondaryCta?: Cta
}

export interface ContactSectionBlock {
  _key: string
  _type: 'contactSectionBlock'
  heading?: string
}

export interface StatsSection {
  _key: string
  _type: 'statsSection'
  stats: string[]
  ariaLabel?: string
}

export type PageSection =
  | HeroSection
  | SplitSection
  | ProseSection
  | CardGridSection
  | ValuesSection
  | CtaSection
  | ContactSectionBlock
  | StatsSection

export interface CmsPage {
  title: string
  slug: string
  sections: PageSection[]
  seo?: { title?: string; description?: string }
}

export interface AboutTocItem {
  id: string
  label: string
}

export interface AboutTextItem {
  title: string
  body: string
}

export interface AboutPage {
  heroEyebrow: string
  heroHeading: string
  version: string
  date: string
  lede: string
  tocAriaLabel: string
  toc: AboutTocItem[]
  introductionHeading: string
  introductionParagraphs: string[]
  missionTitle: string
  missionBody: string
  principlesHeading: string
  principlesIntro: string
  principles: AboutTextItem[]
  shortNormsHeading: string
  shortNormsIntro: string
  shortNorms: string[]
  collectiveNormsHeading: string
  collectiveNormsIntro: string
  collectiveNorms: AboutTextItem[]
  securityHeading: string
  securityIntro: string
  securityTldr: string
  securityContext: string
  securityItems: string[]
  securityConfrontationalHeading: string
  securityConfrontationalItems: string[]
  securityMeetingsHeading: string
  securityMeetingItems: string[]
  seo: { title: string; description: string }
}
