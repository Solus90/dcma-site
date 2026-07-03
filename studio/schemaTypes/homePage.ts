import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  fields: [
    defineField({ name: 'heroHeading', type: 'string' }),
    defineField({ name: 'heroTagline', type: 'string' }),
    defineField({ name: 'heroImage', type: 'image', description: 'DCMA handprint' }),
    defineField({ name: 'heroCta', type: 'cta' }),
    defineField({ name: 'missionEyebrow', type: 'string' }),
    defineField({ name: 'missionHeading', type: 'string' }),
    defineField({ name: 'missionBody', type: 'text' }),
    defineField({ name: 'missionImage', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'howItWorksHeading', type: 'string' }),
    defineField({ name: 'howItWorksIntro', type: 'text' }),
    defineField({ name: 'howItWorksCards', type: 'array', of: [{ type: 'card' }] }),
    defineField({ name: 'stats', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'statsAriaLabel', type: 'string', title: 'Stats marquee aria label' }),
    defineField({ name: 'activitiesHeading', type: 'string', title: 'Activities section heading' }),
    defineField({ name: 'activities', type: 'array', of: [{ type: 'card' }] }),
    defineField({ name: 'contactHeading', type: 'string' }),
    defineField({ name: 'contactForm', type: 'contactFormCopy' }),
    defineField({
      name: 'seo',
      type: 'object',
      fields: [
        defineField({ name: 'title', type: 'string' }),
        defineField({ name: 'description', type: 'text', rows: 2 }),
      ],
    }),
  ],
})
