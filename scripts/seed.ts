// Populate the Sanity dataset with content and stock photography.
// Run: npm run seed   (reads NUXT_SANITY_PROJECT_ID and SANITY_TOKEN from .env)
import { createClient } from '@sanity/client'
import { createReadStream, existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { DEFAULT_ABOUT_PAGE } from '../app/utils/aboutPageDefaults.ts'

const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..')
const STOCK_DIR = join(ROOT, 'assets/stock')
const SOURCE_DIR = join(ROOT, 'assets/source')

function loadEnvFile(path: string) {
  if (!existsSync(path)) return
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '')
    if (process.env[key] === undefined) process.env[key] = value
  }
}

loadEnvFile(join(ROOT, '.env'))

const projectId = process.env.NUXT_SANITY_PROJECT_ID || '1qb86j9s'
const token = process.env.SANITY_TOKEN

if (!token) {
  console.error('Missing SANITY_TOKEN. Add it to .env or export it before running seed.')
  process.exit(1)
}

if (!/^[a-z0-9-]+$/.test(projectId)) {
  console.error(`Invalid NUXT_SANITY_PROJECT_ID: "${projectId}". Use your Sanity project ID (for example 1qb86j9s).`)
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset: 'production',
  token,
  apiVersion: '2026-07-01',
  useCdn: false,
})

const REQUEST = { label: 'REQUEST SUPPORT', href: 'mailto:mutualaiddoorcounty@gmail.com?subject=Request%20Support' }
const JOIN = { label: 'JOIN NETWORK', href: 'mailto:mutualaiddoorcounty@gmail.com?subject=Join%20the%20Network' }

const NAV = [
  { _key: 'home', label: 'Home', href: '/' },
  { _key: 'about', label: 'About', href: '/about' },
  { _key: 'fridge', label: 'Full Hearts Fridge', href: '/full-hearts-fridge' },
]

const CONTACT_FORM = {
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

const ERROR_PAGE = {
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

const FRIDGE_SHELL = {
  loadingEyebrow: 'Loading',
  loadingMessage: 'Fetching the latest fridge info…',
  errorHeading: 'Page unavailable',
  errorMessage: 'We couldn\'t load this page right now. Email us and a neighbor will help.',
  errorEmailSubject: 'Full Hearts Fridge question',
  errorEmailButtonLabel: 'Email',
}

const STOCK = {
  foodPacking: 'joel-muniz-3k3l2brxmwQ-unsplash-011fc2b8-a0f3-44e3-bd9b-256eb565bbe1.png',
  handsJoined: 'marlis-trio-akbar-eMB60hNHFL8-unsplash-08fc8705-0212-44cc-959e-e4f3b63d7994.png',
  gardenSign: 'david-clode-eL4ADAsiOR8-unsplash-607d42ce-97c4-4718-b661-92b0282e6537.png',
  strawberryUnload: 'joel-muniz-A4Ax1ApccfA-unsplash-7f1f0a67-6bfc-456c-a6d3-6a0272621d25.png',
  sharedTomatoes: 'elaine-casap-qgHGDbbSNm8-unsplash-900691f7-c126-40f6-9c98-f7f1a6cef8c4.png',
  deliveryWalk: 'joel-muniz-puOwSpP2ZCY-unsplash-2621022d-e152-44ef-95d9-c2445540740c.png',
  communityMeal: 'priscilla-du-preez-W3SEyZODn8U-unsplash-ff0ca46a-4618-42dc-8309-51f5e11bb31a.png',
  childGarden: 'filip-urban-ffJ8Qa0VQU0-unsplash-43139fc8-0237-4383-b9c4-bacb656a345c.png',
} as const

type Uploaded = { ref: string; alt: string }

function imageField(a: Uploaded) {
  return { _type: 'image' as const, asset: { _type: 'reference' as const, _ref: a.ref }, alt: a.alt }
}

async function uploadFile(path: string, filename: string) {
  return client.assets.upload('image', createReadStream(path), { filename })
}

async function uploadStock(key: keyof typeof STOCK, alt: string): Promise<Uploaded> {
  const filename = STOCK[key]
  const asset = await uploadFile(join(STOCK_DIR, filename), filename)
  return { ref: asset._id, alt }
}

function aboutTocItems(items: readonly { id: string; label: string }[]) {
  return items.map((item, i) => ({ _key: `toc-${i}`, _type: 'aboutTocItem' as const, ...item }))
}

function aboutTextItems(items: readonly { title: string; body: string }[]) {
  return items.map((item, i) => ({ _key: `item-${i}`, _type: 'aboutTextItem' as const, ...item }))
}

async function run() {
  console.log('Uploading brand assets…')
  const logo = await uploadFile(join(SOURCE_DIR, 'logo.png'), 'logo.png')
  const hand = await uploadFile(join(SOURCE_DIR, 'handprint.png'), 'handprint.png')
  const img = (a: { _id: string }, alt: string) => imageField({ ref: a._id, alt })

  console.log('Uploading stock photography…')
  const photos = {
    foodPacking: await uploadStock('foodPacking', 'Volunteers pack bags of canned goods and produce at a food distribution table'),
    handsJoined: await uploadStock('handsJoined', 'Diverse hands joined together in a circle viewed from above'),
    gardenSign: await uploadStock('gardenSign', 'Hand-painted Community Garden sign on a fence surrounded by green vines'),
    strawberryUnload: await uploadStock('strawberryUnload', 'Volunteers transfer boxes of strawberries on a truck bed'),
    sharedTomatoes: await uploadStock('sharedTomatoes', 'Two people hold a bowl of freshly picked cherry tomatoes'),
    deliveryWalk: await uploadStock('deliveryWalk', 'Neighbor carrying a box of supplies along a walkway between homes'),
    communityMeal: await uploadStock('communityMeal', 'Group of neighbors sharing a meal together at a long outdoor table'),
    childGarden: await uploadStock('childGarden', 'Child watering plants in a raised garden bed'),
  }

  console.log('Writing siteSettings…')
  await client.createOrReplace({
    _id: 'siteSettings', _type: 'siteSettings',
    orgName: 'Door County Mutual Aid',
    logo: img(logo, 'Door County Mutual Aid'),
    email: 'mutualaiddoorcounty@gmail.com',
    facebookUrl: 'https://www.facebook.com/profile.php?id=61589260305803',
    address: '611 Jefferson Street\nSturgeon Bay',
    meetingNote: 'Mutual Aid Meetings Monthly',
    joinCta: JOIN,
    footerTagline: 'MUTUAL AID FOR ALL',
    copyright: '© 2026 Mutual Aid Network. All rights reserved.',
    skipLinkLabel: 'Skip to content',
    facebookLabel: 'Facebook',
    navAriaLabel: 'Main',
    navLinks: NAV,
    errorPage: ERROR_PAGE,
    fridgeShell: FRIDGE_SHELL,
  })

  console.log('Writing homePage…')
  await client.createOrReplace({
    _id: 'homePage', _type: 'homePage',
    heroHeading: 'Door County Mutual Aid',
    heroTagline: 'NEIGHBORS SHARING WHAT THEY HAVE — NO PAPERWORK, NO WAITING LIST.',
    heroImage: img(hand, 'Door County Mutual Aid handprint mark'),
    heroCta: { label: 'JOIN THE NETWORK', href: JOIN.href },
    missionEyebrow: 'OUR MISSION',
    missionHeading: 'NEIGHBORS HELPING NEIGHBORS',
    missionBody: 'Mutual aid means we take care of each other directly — no intake forms, no gatekeepers. If you need a ride, groceries, or someone to listen, we connect you with people nearby who can help. If you can spare time or supplies, we make it easy to share.',
    missionImage: imageField(photos.handsJoined),
    howItWorksHeading: 'How It Works',
    howItWorksIntro: 'Three ways to plug in. Pick the one that fits today.',
    howItWorksCards: [
      { _key: 'request', _type: 'card', title: 'Request Help', body: 'Tell us what you need — food, a ride, help with a bill. Email us and a neighbor will follow up.', cta: REQUEST },
      { _key: 'offer', _type: 'card', title: 'Offer Help', body: 'Got extra groceries, tools, or time? Let us know what you can share and we\'ll match you with someone nearby.', cta: { label: 'OFFER SUPPORT', href: 'mailto:mutualaiddoorcounty@gmail.com?subject=Offer%20Support' } },
      { _key: 'join', _type: 'card', title: 'Join Network', body: 'Get updates on meetings, drives, and ways to show up for neighbors.', cta: JOIN },
    ],
    stats: ['150+ HOURS OF DIRECT SUPPORT PROVIDED', '70+ NEW COMMUNITY MEMBERS JOINED', '12+ SOLIDARITY MEETINGS FACILITATED'],
    statsAriaLabel: 'Community impact',
    activitiesHeading: 'WHAT WE DO',
    activities: [
      { _key: 'a1', _type: 'card', title: 'Direct Support', body: 'Food boxes, winter gear, rides to appointments — whatever a neighbor is short on today.', image: imageField(photos.foodPacking) },
      { _key: 'a2', _type: 'card', title: 'Solidarity Meetings', body: 'Monthly meetups at 611 Jefferson St to share resources and plan together.', image: imageField(photos.communityMeal) },
      { _key: 'a3', _type: 'card', title: 'Resource Hub', body: 'Shared spaces and supplies the network can draw on when someone needs help fast.', image: imageField(photos.gardenSign) },
      { _key: 'a4', _type: 'card', title: 'Community Action', body: 'Cleanups, fridge runs, and volunteer shifts that keep the network moving.', image: imageField(photos.deliveryWalk) },
    ],
    contactHeading: 'Get in Touch',
    contactForm: CONTACT_FORM,
    seo: { title: 'Home | Door County Mutual Aid', description: 'Community-led support through solidarity and shared resources in Door County, Wisconsin.' },
  })

  console.log('Writing fridgePage…')
  const VOLUNTEER = { label: 'BECOME A VOLUNTEER', href: 'mailto:mutualaiddoorcounty@gmail.com?subject=Become%20a%20Volunteer' }
  const DONATE = { label: 'OFFER A FOOD DONATION', href: 'mailto:mutualaiddoorcounty@gmail.com?subject=Food%20donation%20for%20Full%20Hearts%20Fridge' }
  await client.createOrReplace({
    _id: 'fridgePage', _type: 'fridgePage',
    heading: 'Full Hearts Fridge',
    intro: 'We rescue food that would go to waste from local restaurants, grocers, and farms — then get it to neighbors who need it. No paperwork, just meals.',
    heroImage: imageField(photos.strawberryUnload),
    cta: VOLUNTEER,
    findHeading: 'Find the Fridge',
    locationAddress: '611 Jefferson Street\nSturgeon Bay, WI 54235',
    locationHours: 'Open 24/7 — take what you need, leave what you can',
    pickupNote: 'The fridge is outside and unlocked. No ID, no forms, no questions. Take only what you will use; leave room for the next neighbor.',
    mapUrl: 'https://maps.google.com/?q=611+Jefferson+Street+Sturgeon+Bay+WI+54235',
    mapButtonLabel: 'Open in Maps',
    donationHeading: 'What to donate',
    donationGuidelines: [
      'Sealed, store-bought packaged food with a visible date',
      'Fresh produce that is washed and labeled with the date added',
      'No home-canned goods, raw meat, or expired items',
      'Not sure? Email us before dropping off.',
    ],
    donationCta: DONATE,
    valuesHeading: 'Why we run it',
    values: [
      { _key: 'v1', _type: 'card', title: 'UNCONDITIONAL SUPPORT', body: 'Food when you need it — no proof of hardship, no strings attached.', image: imageField(photos.sharedTomatoes) },
      { _key: 'v2', _type: 'card', title: 'COMMUNITY AGREEMENT', body: 'We decide together how the fridge runs and who it serves.', image: imageField(photos.handsJoined) },
      { _key: 'v3', _type: 'card', title: 'COLLECTIVE SOLIDARITY', body: 'Volunteers pick up, sort, and deliver so nothing usable goes to waste.', image: imageField(photos.foodPacking) },
      { _key: 'v4', _type: 'card', title: 'RESOURCE SHARING', body: 'Partner businesses share surplus; neighbors share the work of keeping it moving.', image: imageField(photos.childGarden) },
    ],
    closingNote: 'The fridge stays stocked because neighbors show up — volunteering a shift, dropping off extras, or spreading the word.',
    closingHeading: 'Show up for neighbors',
    closingCta: VOLUNTEER,
    findFridgeCtaLabel: 'Find the fridge',
    findFridgeMobileCtaLabel: 'Find fridge',
    quickActionsAriaLabel: 'Quick actions',
    seo: { title: 'Full Hearts Fridge | Door County Mutual Aid', description: 'Reducing food waste and increasing access to nourishing meals in Door County.' },
  })

  console.log('Writing aboutPage…')
  await client.createOrReplace({
    _id: 'aboutPage',
    _type: 'aboutPage',
    heroEyebrow: DEFAULT_ABOUT_PAGE.heroEyebrow,
    heroHeading: DEFAULT_ABOUT_PAGE.heroHeading,
    version: DEFAULT_ABOUT_PAGE.version,
    date: DEFAULT_ABOUT_PAGE.date,
    lede: DEFAULT_ABOUT_PAGE.lede,
    tocAriaLabel: DEFAULT_ABOUT_PAGE.tocAriaLabel,
    toc: aboutTocItems(DEFAULT_ABOUT_PAGE.toc),
    introductionHeading: DEFAULT_ABOUT_PAGE.introductionHeading,
    introductionParagraphs: [...DEFAULT_ABOUT_PAGE.introductionParagraphs],
    missionTitle: DEFAULT_ABOUT_PAGE.missionTitle,
    missionBody: DEFAULT_ABOUT_PAGE.missionBody,
    principlesHeading: DEFAULT_ABOUT_PAGE.principlesHeading,
    principlesIntro: DEFAULT_ABOUT_PAGE.principlesIntro,
    principles: aboutTextItems(DEFAULT_ABOUT_PAGE.principles),
    shortNormsHeading: DEFAULT_ABOUT_PAGE.shortNormsHeading,
    shortNormsIntro: DEFAULT_ABOUT_PAGE.shortNormsIntro,
    shortNorms: [...DEFAULT_ABOUT_PAGE.shortNorms],
    collectiveNormsHeading: DEFAULT_ABOUT_PAGE.collectiveNormsHeading,
    collectiveNormsIntro: DEFAULT_ABOUT_PAGE.collectiveNormsIntro,
    collectiveNorms: aboutTextItems(DEFAULT_ABOUT_PAGE.collectiveNorms),
    securityHeading: DEFAULT_ABOUT_PAGE.securityHeading,
    securityIntro: DEFAULT_ABOUT_PAGE.securityIntro,
    securityTldr: DEFAULT_ABOUT_PAGE.securityTldr,
    securityContext: DEFAULT_ABOUT_PAGE.securityContext,
    securityItems: [...DEFAULT_ABOUT_PAGE.securityItems],
    securityConfrontationalHeading: DEFAULT_ABOUT_PAGE.securityConfrontationalHeading,
    securityConfrontationalItems: [...DEFAULT_ABOUT_PAGE.securityConfrontationalItems],
    securityMeetingsHeading: DEFAULT_ABOUT_PAGE.securityMeetingsHeading,
    securityMeetingItems: [...DEFAULT_ABOUT_PAGE.securityMeetingItems],
    seo: { ...DEFAULT_ABOUT_PAGE.seo },
  })

  console.log('Seed complete')
}
run().catch((e) => { console.error(e); process.exit(1) })
