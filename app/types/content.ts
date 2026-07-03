export interface Cta { label: string; href: string }
export interface Card { _key: string; title: string; body?: string; cta?: Cta }
export interface SiteSettings {
  orgName: string; logoUrl: string; email: string; facebookUrl: string
  address: string; meetingNote: string; joinCta: Cta; footerTagline: string; copyright: string
}
export interface HomePage {
  heroHeading: string; heroTagline: string; heroImageUrl: string; heroCta: Cta
  missionEyebrow: string; missionHeading: string; missionBody: string
  howItWorksHeading: string; howItWorksIntro: string; howItWorksCards: Card[]
  stats: string[]; activities: Card[]; contactHeading: string
  seo: { title: string; description: string }
}
export interface FridgePage {
  heading: string; intro: string; cta: Cta; values: Card[]
  seo: { title: string; description: string }
}
