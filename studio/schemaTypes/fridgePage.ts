import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'fridgePage',
  title: 'Full Hearts Fridge',
  type: 'document',
  fields: [
    defineField({ name: 'heading', type: 'string' }),
    defineField({ name: 'intro', type: 'text' }),
    defineField({ name: 'heroImage', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'cta', type: 'cta' }),
    defineField({ name: 'findHeading', type: 'string', title: 'Find the fridge heading' }),
    defineField({ name: 'locationAddress', type: 'text', rows: 2 }),
    defineField({ name: 'locationHours', type: 'string' }),
    defineField({ name: 'pickupNote', type: 'text', rows: 2 }),
    defineField({ name: 'mapUrl', type: 'url' }),
    defineField({ name: 'donationHeading', type: 'string' }),
    defineField({ name: 'donationGuidelines', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'donationCta', type: 'cta' }),
    defineField({ name: 'valuesHeading', type: 'string' }),
    defineField({ name: 'values', type: 'array', of: [{ type: 'card' }] }),
    defineField({ name: 'closingHeading', type: 'string' }),
    defineField({ name: 'closingNote', type: 'text', rows: 2 }),
    defineField({ name: 'closingCta', type: 'cta' }),
    defineField({ name: 'findFridgeCtaLabel', type: 'string', title: 'Find fridge button (hero)' }),
    defineField({ name: 'findFridgeMobileCtaLabel', type: 'string', title: 'Find fridge button (mobile bar)' }),
    defineField({ name: 'quickActionsAriaLabel', type: 'string', title: 'Mobile quick actions aria label' }),
    defineField({ name: 'mapButtonLabel', type: 'string', title: 'Open in Maps button' }),
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
