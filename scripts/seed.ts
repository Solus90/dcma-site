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
  { _key: 'about', label: 'About Us', href: '/about' },
  { _key: 'mutual-aid', label: 'What Is Mutual Aid', href: '/what-is-mutual-aid' },
  { _key: 'groups', label: 'DCMA Projects', href: '/projects' },
  { _key: 'updates', label: 'Updates', href: '/updates' },
  { _key: 'get-involved', label: 'Get Involved', href: '/get-involved' },
  { _key: 'financials', label: 'Financials', href: '/financials' },
  { _key: 'contact', label: 'Contact', href: '/contact' },
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
    heroTagline: 'A NETWORK HUB CONNECTING NEIGHBORS, PROJECTS, AND MUTUAL SUPPORT ACROSS DOOR COUNTY.',
    heroImage: img(hand, 'Door County Mutual Aid handprint mark'),
    heroCta: { label: 'JOIN THE NETWORK', href: JOIN.href },
    missionEyebrow: 'WHAT WE ARE',
    missionHeading: 'A HUB, NOT AN ORGANIZATION',
    missionBody: 'Door County Mutual Aid Collective is a coordination hub — a place where neighbors organize, projects get started, and connections get made across Door County. Projects are born here, built by members, and supported by the collective. If you need help, want to offer it, or have an idea to bring to the group, this is where it starts.',
    missionImage: imageField(photos.handsJoined),
    howItWorksHeading: 'How to Plug In',
    howItWorksIntro: 'Three ways to connect. Pick the one that fits today.',
    howItWorksCards: [
      { _key: 'request', _type: 'card', title: 'Request Help', body: 'Tell us what you need — food, a ride, help with a bill. Email us and a neighbor will follow up.', cta: REQUEST },
      { _key: 'offer', _type: 'card', title: 'Offer Help', body: 'Got extra groceries, tools, or time? Let us know what you can share and we\'ll connect you with someone nearby.', cta: { label: 'OFFER SUPPORT', href: 'mailto:mutualaiddoorcounty@gmail.com?subject=Offer%20Support' } },
      { _key: 'join', _type: 'card', title: 'Join the Network', body: 'Get updates on meetings and ways to show up for neighbors.', cta: JOIN },
    ],
    stats: [],
    statsAriaLabel: 'Community impact',
    activitiesHeading: 'CONNECTED PROJECTS',
    activities: [
      { _key: 'a1', _type: 'card', title: 'Full Hearts Fridge', body: 'Dedicated to reducing food waste and increasing access to nourishing meals. Partnering with local restaurants, grocery stores, and farms to redirect food to those in need.', cta: { label: 'LEARN MORE', href: '/full-hearts-fridge' }, image: imageField(photos.strawberryUnload) },
      { _key: 'a2', _type: 'card', title: 'Solidarity Meetings', body: 'Monthly gatherings to share resources, make decisions together, and plan collective action. Location rotates — check the updates page for the next meeting.', cta: { label: 'SEE UPDATES', href: '/updates' }, image: imageField(photos.communityMeal) },
    ],
    contactHeading: 'Get in Touch',
    contactForm: CONTACT_FORM,
    seo: { title: 'Home | Door County Mutual Aid', description: 'A network hub connecting neighbors, projects, and mutual support across Door County, Wisconsin.' },
  })

  console.log('Writing fridgePage…')
  const VOLUNTEER = { label: 'BECOME A VOLUNTEER', href: 'mailto:mutualaiddoorcounty@gmail.com?subject=Become%20a%20Volunteer' }
  const DONATE = { label: 'OFFER A FOOD DONATION', href: 'mailto:mutualaiddoorcounty@gmail.com?subject=Food%20donation%20for%20Full%20Hearts%20Fridge' }
  await client.createOrReplace({
    _id: 'fridgePage', _type: 'fridgePage',
    heading: 'Full Hearts Fridge',
    intro: 'Dedicated to reducing food waste and increasing access to nourishing meals within our community. By partnering with local restaurants, grocery stores, and farms we collect food that would otherwise go unused and redirect it to those in need.',
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
    valuesHeading: 'Why it exists',
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

  console.log('Writing what-is-mutual-aid page…')
  await client.createOrReplace({
    _id: 'page-what-is-mutual-aid',
    _type: 'page',
    title: 'What Is Mutual Aid',
    slug: { _type: 'slug', current: 'what-is-mutual-aid' },
    sections: [
      {
        _key: 's1', _type: 'heroSection',
        heading: 'What Is Mutual Aid?',
        tagline: 'NOT CHARITY. NOT GOVERNMENT. NEIGHBORS TAKING CARE OF NEIGHBORS.',
      },
      {
        _key: 's2', _type: 'proseSection',
        eyebrow: 'THE IDEA',
        heading: 'Direct support without gatekeepers',
        body: 'Mutual aid is a form of political participation where people take responsibility for caring for one another — not through symbolic acts or petitions, but by actually meeting each other\'s needs. It\'s older than charity and more direct than most social services.\n\nWhen neighbors share food, rides, tools, and time outside of market logic and without applications or income verification, that is mutual aid. The relationship is horizontal — giving and receiving happen in both directions. Everyone has something to offer. Everyone has something to receive.',
      },
      {
        _key: 's3', _type: 'cardGridSection',
        heading: 'How It\'s Different',
        style: 'simple',
        cards: [
          { _key: 'c1', _type: 'card', title: 'Not charity', body: 'Charity flows one way — donor to recipient. Mutual aid assumes everyone has something to offer and something to receive.' },
          { _key: 'c2', _type: 'card', title: 'Not social services', body: 'No intake forms, income verification, or eligibility tests. If you need something, you can ask. Full stop.' },
          { _key: 'c3', _type: 'card', title: 'Not just volunteering', body: 'Volunteers donate time to an organization. In mutual aid, you\'re part of a network — a neighbor, not a helper.' },
          { _key: 'c4', _type: 'card', title: 'Solidarity, not pity', body: 'The goal isn\'t to feel good about helping — it\'s to build a community where people are genuinely taken care of.' },
        ],
      },
      {
        _key: 's4', _type: 'ctaSection',
        heading: 'READY TO SHOW UP?',
        note: 'Join the network and get connected with neighbors.',
        cta: JOIN,
        secondaryCta: REQUEST,
      },
    ],
    seo: {
      title: 'What Is Mutual Aid | Door County Mutual Aid',
      description: 'Learn what mutual aid means, how it\'s different from charity, and how Door County neighbors support each other directly.',
    },
  })

  console.log('Writing projects page…')
  await client.createOrReplace({
    _id: 'page-projects',
    _type: 'page',
    title: 'DCMA Projects',
    slug: { _type: 'slug', current: 'projects' },
    sections: [
      {
        _key: 's1', _type: 'heroSection',
        heading: 'DCMA Projects',
        tagline: 'INITIATIVES STARTED WITHIN DCMA AND RUN BY MEMBERS',
      },
      {
        _key: 's2', _type: 'proseSection',
        eyebrow: 'HOW PROJECTS WORK',
        heading: 'Ideas that start here, built by us',
        body: 'DCMA projects begin as ideas brought to the collective — workshopped at solidarity meetings, shaped by shared principles, and launched by interested members. Each project runs mostly independently as a smaller working group, then comes back to the broader collective to share progress, brainstorm, and ask for support. They\'re ours because we built them together.',
      },
      {
        _key: 's3', _type: 'cardGridSection',
        heading: 'ACTIVE PROJECTS',
        style: 'photos',
        cards: [
          { _key: 'c1', _type: 'card', title: 'Full Hearts Fridge', body: 'Dedicated to reducing food waste and increasing access to nourishing meals. Partnering with local restaurants, grocery stores, and farms to redirect food that would otherwise go unused to those in need.', cta: { label: 'LEARN MORE', href: '/full-hearts-fridge' }, image: imageField(photos.strawberryUnload) },
          { _key: 'c2', _type: 'card', title: 'Have an idea?', body: 'Bring it to a solidarity meeting. If it aligns with our principles and there are members who want to build it, we\'ll help get it off the ground.', cta: { label: 'GET IN TOUCH', href: '/contact' }, image: imageField(photos.handsJoined) },
        ],
      },
      {
        _key: 's4', _type: 'proseSection',
        eyebrow: 'PARTNER ORGANIZATIONS',
        heading: 'Groups we work alongside',
        body: 'These organizations are not DCMA projects, but they share our values and we work alongside them in Door County. Supporting them is another way to plug into the broader network.',
      },
      {
        _key: 's5', _type: 'cardGridSection',
        heading: 'PARTNERS',
        style: 'default',
        cards: [
          { _key: 'p1', _type: 'card', title: 'Northern Door Activists', body: 'Grassroots organizing in northern Door County. Reach out through their channels to connect.', cta: { label: 'LEARN MORE', href: 'https://www.facebook.com/northerndooractivists' } },
        ],
      },
      {
        _key: 's6', _type: 'ctaSection',
        heading: 'WANT TO CONNECT?',
        note: 'Whether you have a project idea or know of a partner org we should add here, reach out.',
        cta: JOIN,
      },
    ],
    seo: {
      title: 'DCMA Projects | Door County Mutual Aid',
      description: 'Active projects started within Door County Mutual Aid — including the Full Hearts Fridge — plus partner organizations we work alongside.',
    },
  })

  console.log('Writing get-involved page…')
  await client.createOrReplace({
    _id: 'page-get-involved',
    _type: 'page',
    title: 'Get Involved',
    slug: { _type: 'slug', current: 'get-involved' },
    sections: [
      {
        _key: 's1', _type: 'heroSection',
        heading: 'How to Help',
        tagline: 'EVERY NEIGHBOR HAS SOMETHING TO OFFER.',
      },
      {
        _key: 's2', _type: 'cardGridSection',
        heading: 'WAYS TO SHOW UP',
        intro: 'Pick what fits your time and capacity today.',
        style: 'simple',
        cards: [
          { _key: 'c1', _type: 'card', title: 'Offer your time', body: 'Volunteer at the fridge, help with deliveries, or show up at a solidarity meeting.', cta: { label: 'EMAIL US', href: 'mailto:mutualaiddoorcounty@gmail.com?subject=Volunteer' } },
          { _key: 'c2', _type: 'card', title: 'Share supplies', body: 'Got extra food, clothing, tools, or household goods? The network can connect them with neighbors who need them.', cta: { label: 'OFFER SUPPLIES', href: 'mailto:mutualaiddoorcounty@gmail.com?subject=Offer%20Supplies' } },
          { _key: 'c3', _type: 'card', title: 'Join the email list', body: 'Get updates on meetings, drives, and ways to plug in. Low-volume, no spam.', cta: JOIN },
          { _key: 'c4', _type: 'card', title: 'Request support', body: 'Need food, a ride, help with a bill, or just someone to talk to? Email us — no judgment, no forms.', cta: REQUEST },
        ],
      },
      {
        _key: 's3', _type: 'contactSectionBlock',
        heading: 'Get in Touch',
      },
    ],
    seo: {
      title: 'Get Involved | Door County Mutual Aid',
      description: 'Volunteer, share supplies, join the email list, or request support. Every neighbor has something to give and something to receive.',
    },
  })

  console.log('Writing contact page…')
  await client.createOrReplace({
    _id: 'page-contact',
    _type: 'page',
    title: 'Contact',
    slug: { _type: 'slug', current: 'contact' },
    sections: [
      {
        _key: 's1', _type: 'heroSection',
        heading: 'Get in Touch',
        tagline: 'WE READ EVERY MESSAGE. USUALLY RESPOND WITHIN A FEW DAYS.',
      },
      {
        _key: 's2', _type: 'contactSectionBlock',
        heading: 'Send us a message',
      },
    ],
    seo: {
      title: 'Contact | Door County Mutual Aid',
      description: 'Send Door County Mutual Aid a message — for support requests, volunteering, donations, or general questions.',
    },
  })

  console.log('Writing financials page…')
  await client.createOrReplace({
    _id: 'page-financials',
    _type: 'page',
    title: 'Financials',
    slug: { _type: 'slug', current: 'financials' },
    sections: [
      {
        _key: 's1', _type: 'heroSection',
        heading: 'Financials',
        tagline: 'TRANSPARENCY IS PART OF HOW WE BUILD TRUST.',
      },
      {
        _key: 's2', _type: 'proseSection',
        eyebrow: 'OUR COMMITMENT',
        heading: 'Open books, open community',
        body: 'Door County Mutual Aid Collective is a community-funded, community-run organization. We believe financial transparency is inseparable from our values of distributed power and collective accountability.\n\nAll funds received go directly toward our projects and direct support efforts. No salaries, no overhead — every dollar stays in the community. We publish summaries of income and expenses so members and neighbors can see exactly where resources flow.',
      },
      {
        _key: 's3', _type: 'cardGridSection',
        heading: 'WHERE MONEY GOES',
        style: 'simple',
        cards: [
          { _key: 'c1', _type: 'card', title: 'Direct Support', body: 'Food boxes, supply drives, emergency assistance — funds go directly to neighbors in need.' },
          { _key: 'c2', _type: 'card', title: 'Full Hearts Fridge', body: 'Refrigeration maintenance, food rescue coordination, and volunteer supplies.' },
          { _key: 'c3', _type: 'card', title: 'Community Events', body: 'Meeting space, materials, and logistics for solidarity meetings and community actions.' },
          { _key: 'c4', _type: 'card', title: 'Education & Outreach', body: 'Printing, signage, and digital tools that help spread the word and grow the network.' },
        ],
      },
      {
        _key: 's4', _type: 'ctaSection',
        heading: 'QUESTIONS ABOUT OUR FINANCES?',
        note: 'Ask at a solidarity meeting or send us a message. We\'re an open book.',
        cta: { label: 'CONTACT US', href: '/contact' },
      },
    ],
    seo: {
      title: 'Financials | Door County Mutual Aid',
      description: 'Financial transparency from Door County Mutual Aid — where money comes from and where it goes.',
    },
  })

  console.log('Seed complete')
}
run().catch((e) => { console.error(e); process.exit(1) })
