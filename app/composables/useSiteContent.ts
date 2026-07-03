import type { SiteSettings, HomePage, FridgePage } from '~/types/content'

export const SITE_SETTINGS_QUERY = /* groq */ `*[_id == "siteSettings"][0]{
  orgName, "logoUrl": logo.asset->url, email, facebookUrl, address,
  meetingNote, joinCta, footerTagline, copyright }`

export const HOME_QUERY = /* groq */ `*[_id == "homePage"][0]{
  heroHeading, heroTagline, "heroImageUrl": heroImage.asset->url, heroCta,
  missionEyebrow, missionHeading, missionBody,
  howItWorksHeading, howItWorksIntro, howItWorksCards, stats, activities,
  contactHeading, seo }`

export const FRIDGE_QUERY = /* groq */ `*[_id == "fridgePage"][0]{
  heading, intro, cta, values, seo }`

export const useSiteSettings = () => useSanityQuery<SiteSettings>(SITE_SETTINGS_QUERY)
export const useHomePage = () => useSanityQuery<HomePage>(HOME_QUERY)
export const useFridgePage = () => useSanityQuery<FridgePage>(FRIDGE_QUERY)
