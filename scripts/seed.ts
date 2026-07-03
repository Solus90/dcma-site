// Populate the Sanity dataset with content migrated verbatim from the Wix site.
// Run: SANITY_TOKEN=... NUXT_SANITY_PROJECT_ID=... pnpm exec tsx scripts/seed.ts
import { createClient } from '@sanity/client'
import { createReadStream } from 'node:fs'

const client = createClient({
  projectId: process.env.NUXT_SANITY_PROJECT_ID!,
  dataset: 'production',
  token: process.env.SANITY_TOKEN!,
  apiVersion: '2026-07-01',
  useCdn: false,
})

const JOIN = { label: 'JOIN NETWORK', href: 'mailto:mutualaiddoorcounty@gmail.com?subject=Join%20the%20Network' }

async function run() {
  const logo = await client.assets.upload('image', createReadStream('assets/source/logo.png'), { filename: 'logo.png' })
  const hand = await client.assets.upload('image', createReadStream('assets/source/handprint.png'), { filename: 'handprint.png' })
  const img = (a: { _id: string }) => ({ _type: 'image', asset: { _type: 'reference', _ref: a._id } })

  await client.createOrReplace({
    _id: 'siteSettings', _type: 'siteSettings',
    orgName: 'Door County Mutual Aid',
    logo: img(logo),
    email: 'mutualaiddoorcounty@gmail.com',
    facebookUrl: 'https://www.facebook.com/profile.php?id=61589260305803',
    address: '611 Jefferson Street\nSturgeon Bay',
    meetingNote: 'Mutual Aid Meetings Monthly',
    joinCta: JOIN,
    footerTagline: 'MUTUAL AID FOR ALL',
    copyright: '© 2026 Mutual Aid Network. All rights reserved.',
  })

  await client.createOrReplace({
    _id: 'homePage', _type: 'homePage',
    heroHeading: 'Door County Mutual Aid',
    heroTagline: 'WE FOSTER COMMUNITY LED SUPPORT THROUGH SOLIDARITY AND SHARED RESOURCES.',
    heroImage: img(hand),
    heroCta: { label: 'JOIN THE NETWORK', href: JOIN.href },
    missionEyebrow: 'OUR MISSION',
    missionHeading: 'WE STAND TOGETHER IN SOLIDARITY',
    missionBody: 'We believe that mutual aid is the foundation of a resilient community. Our mission is to bridge the gap between those who have and those who need, ensuring that no one is left behind. By fostering direct support and shared resources, we create a network where solidarity is not just a principle, but a daily practice.',
    howItWorksHeading: 'How It Works',
    howItWorksIntro: 'We believe in direct action and shared responsibility. Here’s how our community network operates.',
    howItWorksCards: [
      { _key: 'offer', _type: 'card', title: 'Offer Help', body: 'Whether you have extra groceries, a spare tire, or just a listening ear, we provide a simple way to share your resources.', cta: { label: 'OFFER SUPPORT', href: 'mailto:mutualaiddoorcounty@gmail.com?subject=Offer%20Support' } },
      { _key: 'request', _type: 'card', title: 'Request Help', body: 'Fill out our community agreement form to let us know what you need. We will match you with local neighbors who can assist.', cta: { label: 'REQUEST SUPPORT', href: 'mailto:mutualaiddoorcounty@gmail.com?subject=Request%20Support' } },
      { _key: 'join', _type: 'card', title: 'Join Network', body: 'Stay updated with our community impact and solidarity events. Become a part of a network that values collective action.', cta: JOIN },
    ],
    stats: ['150+ HOURS OF DIRECT SUPPORT PROVIDED', '70+ NEW COMMUNITY MEMBERS JOINED', 'SOLIDARITY MEETINGS SUCCESSFULLY FACILITATED'],
    activities: [
      { _key: 'a1', _type: 'card', title: 'Direct Support', body: 'Providing food, shelter, and essential supplies to neighbors in need.' },
      { _key: 'a2', _type: 'card', title: 'Solidarity Meetings', body: 'Facilitating open dialogue and resource-sharing agreements.' },
      { _key: 'a3', _type: 'card', title: 'Resource Hub', body: 'Establishing shared spaces for mutual aid and community growth.' },
      { _key: 'a4', _type: 'card', title: 'Community Action', body: 'Organizing local cleanups and volunteer drives.' },
    ],
    contactHeading: 'Get in Touch',
    seo: { title: 'Home | Door County Mutual Aid', description: 'Community-led support through solidarity and shared resources in Door County, Wisconsin.' },
  })

  await client.createOrReplace({
    _id: 'fridgePage', _type: 'fridgePage',
    heading: 'Full Hearts Fridge',
    intro: 'Dedicated to reducing food waste and increasing access to nourishing meals within our community. By partnering with local restaurants, grocery stores, and farms we collect food that would otherwise go unused and redirect it to those in need.',
    cta: { label: 'BECOME A VOLUNTEER', href: 'mailto:mutualaiddoorcounty@gmail.com?subject=Become%20a%20Volunteer' },
    values: [
      { _key: 'v1', _type: 'card', title: 'UNCONDITIONAL SUPPORT', body: 'We provide direct assistance without expectation of return, ensuring that every member of our community has access to the resources they need to survive and thrive.' },
      { _key: 'v2', _type: 'card', title: 'COMMUNITY AGREEMENT', body: 'Our group operates on a transparent and collective agreement, where every contribution is documented and every need is met through shared responsibility and mutual respect.' },
      { _key: 'v3', _type: 'card', title: 'COLLECTIVE SOLIDARITY', body: 'We stand together as one network, recognizing that our strength lies in our unity and that no individual is ever truly alone in the face of adversity.' },
      { _key: 'v4', _type: 'card', title: 'RESOURCE SHARING', body: 'We prioritize the equitable distribution of shared resources, ensuring that our network remains accessible and sustainable for all members regardless of background.' },
    ],
    seo: { title: 'Full Hearts Fridge | Door County Mutual Aid', description: 'Reducing food waste and increasing access to nourishing meals in Door County.' },
  })

  console.log('Seed complete')
}
run().catch((e) => { console.error(e); process.exit(1) })
