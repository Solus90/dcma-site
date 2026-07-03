import type { SiteSettings, HomePage, FridgePage, CmsPage, AboutPage } from '~/types/content'
import { normalizeAboutPage, normalizeCmsPage, normalizeFridgePage, normalizeHomePage, normalizeSiteSettings } from '~/utils/contentDefaults'

export const SITE_SETTINGS_QUERY = /* groq */ `*[_id == "siteSettings"][0]{
  orgName, "logoUrl": logo.asset->url, email, facebookUrl, address,
  meetingNote, joinCta, footerTagline, copyright,
  skipLinkLabel, facebookLabel, navAriaLabel,
  navLinks[]{ label, href },
  errorPage,
  fridgeShell }`

const cardFields = /* groq */ `
  _key, title, body, cta,
  "imageUrl": image.asset->url,
  "imageAlt": image.alt
`

const sectionFields = /* groq */ `
  _key, _type,
  _type == "heroSection" => {
    heading, tagline, cta, secondaryCta,
    "imageUrl": image.asset->url,
    "imageAlt": coalesce(image.alt, heading)
  },
  _type == "splitSection" => {
    eyebrow, heading, body, imagePosition,
    "imageUrl": image.asset->url,
    "imageAlt": coalesce(image.alt, heading)
  },
  _type == "proseSection" => {
    eyebrow, heading, body
  },
  _type == "cardGridSection" => {
    heading, intro, style,
    cards[]{${cardFields}}
  },
  _type == "valuesSection" => {
    heading,
    values[]{${cardFields}}
  },
  _type == "ctaSection" => {
    heading, note, cta, secondaryCta
  },
  _type == "contactSectionBlock" => {
    heading
  },
  _type == "statsSection" => {
    stats, ariaLabel
  }
`

export const HOME_QUERY = /* groq */ `*[_id == "homePage"][0]{
  heroHeading, heroTagline,
  "heroImageUrl": heroImage.asset->url,
  "heroImageAlt": coalesce(heroImage.alt, heroHeading),
  heroCta,
  missionEyebrow, missionHeading, missionBody,
  "missionImageUrl": missionImage.asset->url,
  "missionImageAlt": coalesce(missionImage.alt, missionHeading),
  howItWorksHeading, howItWorksIntro,
  howItWorksCards[]{${cardFields}},
  stats, statsAriaLabel, activitiesHeading,
  activities[]{${cardFields}},
  contactHeading, contactForm, seo }`

export const FRIDGE_QUERY = /* groq */ `*[_id == "fridgePage"][0]{
  heading, intro,
  "heroImageUrl": heroImage.asset->url,
  "heroImageAlt": heroImage.alt,
  cta,
  findHeading, locationAddress, locationHours, pickupNote, mapUrl, mapButtonLabel,
  donationHeading, donationGuidelines, donationCta,
  valuesHeading,
  values[]{${cardFields}},
  closingHeading, closingNote, closingCta,
  findFridgeCtaLabel, findFridgeMobileCtaLabel, quickActionsAriaLabel,
  seo }`

export const PAGE_QUERY = /* groq */ `*[_type == "page" && slug.current == $slug][0]{
  title, "slug": slug.current,
  sections[]{${sectionFields}},
  seo }`

export const ABOUT_QUERY = /* groq */ `*[_id == "aboutPage"][0]{
  heroEyebrow, heroHeading, version, date, lede, tocAriaLabel,
  toc[]{ id, label },
  introductionHeading, introductionParagraphs,
  missionTitle, missionBody,
  principlesHeading, principlesIntro,
  principles[]{ title, body },
  shortNormsHeading, shortNormsIntro, shortNorms,
  collectiveNormsHeading, collectiveNormsIntro,
  collectiveNorms[]{ title, body },
  securityHeading, securityIntro, securityTldr, securityContext, securityItems,
  securityConfrontationalHeading, securityConfrontationalItems,
  securityMeetingsHeading, securityMeetingItems,
  seo }`

function withNormalizedData<T>(
  query: ReturnType<typeof useSanityQuery<T>>,
  normalize: (data: T) => T,
) {
  const data = computed(() => {
    const value = query.data.value
    return value ? normalize(value) : null
  })

  return { ...query, data }
}

export const useSiteSettings = () =>
  withNormalizedData(useSanityQuery<SiteSettings>(SITE_SETTINGS_QUERY), normalizeSiteSettings)

export const useHomePage = () =>
  withNormalizedData(useSanityQuery<HomePage>(HOME_QUERY), normalizeHomePage)

export const useFridgePage = () =>
  withNormalizedData(useSanityQuery<FridgePage>(FRIDGE_QUERY), normalizeFridgePage)

export const useCmsPage = (slug: string) =>
  withNormalizedData(
    useSanityQuery<CmsPage>(PAGE_QUERY, { slug }),
    normalizeCmsPage,
  )

export const useAboutPage = () =>
  withNormalizedData(useSanityQuery<AboutPage>(ABOUT_QUERY), normalizeAboutPage)
