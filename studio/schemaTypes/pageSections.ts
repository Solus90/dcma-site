import { defineType, defineField } from 'sanity'

export const heroSection = defineType({
  name: 'heroSection',
  title: 'Hero',
  type: 'object',
  fields: [
    defineField({ name: 'heading', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'tagline', type: 'string' }),
    defineField({ name: 'image', type: 'image' }),
    defineField({ name: 'cta', type: 'cta' }),
    defineField({ name: 'secondaryCta', type: 'cta' }),
  ],
  preview: {
    select: { title: 'heading', subtitle: 'tagline' },
    prepare({ title, subtitle }) {
      return { title: title || 'Hero', subtitle: subtitle || 'Hero section' }
    },
  },
})

export const splitSection = defineType({
  name: 'splitSection',
  title: 'Text + image',
  type: 'object',
  fields: [
    defineField({ name: 'eyebrow', type: 'string' }),
    defineField({ name: 'heading', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'body', type: 'text', rows: 6 }),
    defineField({ name: 'image', type: 'image', options: { hotspot: true } }),
    defineField({
      name: 'imagePosition',
      type: 'string',
      options: { list: [{ title: 'Left', value: 'left' }, { title: 'Right', value: 'right' }] },
      initialValue: 'left',
    }),
  ],
  preview: {
    select: { title: 'heading', media: 'image' },
    prepare({ title, media }) {
      return { title: title || 'Text + image', subtitle: 'Split section', media }
    },
  },
})

export const proseSection = defineType({
  name: 'proseSection',
  title: 'Text section',
  type: 'object',
  fields: [
    defineField({ name: 'eyebrow', type: 'string' }),
    defineField({ name: 'heading', type: 'string' }),
    defineField({ name: 'body', type: 'text', rows: 10 }),
  ],
  preview: {
    select: { title: 'heading', subtitle: 'eyebrow' },
    prepare({ title, subtitle }) {
      return { title: title || 'Text section', subtitle }
    },
  },
})

export const cardGridSection = defineType({
  name: 'cardGridSection',
  title: 'Card grid',
  type: 'object',
  fields: [
    defineField({ name: 'heading', type: 'string' }),
    defineField({ name: 'intro', type: 'text', rows: 2 }),
    defineField({
      name: 'style',
      type: 'string',
      options: {
        list: [
          { title: 'Simple cards', value: 'simple' },
          { title: 'Cards with photos', value: 'photos' },
        ],
      },
      initialValue: 'simple',
    }),
    defineField({ name: 'cards', type: 'array', of: [{ type: 'card' }], validation: (r) => r.min(1) }),
  ],
  preview: {
    select: { title: 'heading', style: 'style' },
    prepare({ title, style }) {
      return { title: title || 'Card grid', subtitle: style === 'photos' ? 'With photos' : 'Simple cards' }
    },
  },
})

export const valuesSection = defineType({
  name: 'valuesSection',
  title: 'Alternating blocks',
  type: 'object',
  fields: [
    defineField({ name: 'heading', type: 'string' }),
    defineField({ name: 'values', type: 'array', of: [{ type: 'card' }], validation: (r) => r.min(1) }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare({ title }) {
      return { title: title || 'Alternating blocks' }
    },
  },
})

export const ctaSection = defineType({
  name: 'ctaSection',
  title: 'Call to action',
  type: 'object',
  fields: [
    defineField({ name: 'heading', type: 'string' }),
    defineField({ name: 'note', type: 'text', rows: 2 }),
    defineField({ name: 'cta', type: 'cta', validation: (r) => r.required() }),
    defineField({ name: 'secondaryCta', type: 'cta' }),
  ],
  preview: {
    select: { title: 'heading', subtitle: 'note' },
    prepare({ title, subtitle }) {
      return { title: title || 'Call to action', subtitle }
    },
  },
})

export const contactSectionBlock = defineType({
  name: 'contactSectionBlock',
  title: 'Contact form',
  type: 'object',
  fields: [
    defineField({ name: 'heading', type: 'string' }),
  ],
  preview: {
    prepare() {
      return { title: 'Contact form' }
    },
  },
})

export const statsSection = defineType({
  name: 'statsSection',
  title: 'Stats marquee',
  type: 'object',
  fields: [
    defineField({ name: 'stats', type: 'array', of: [{ type: 'string' }], validation: (r) => r.min(1) }),
    defineField({ name: 'ariaLabel', type: 'string', title: 'Aria label' }),
  ],
  preview: {
    select: { stats: 'stats' },
    prepare({ stats }) {
      return { title: 'Stats marquee', subtitle: stats?.[0] }
    },
  },
})

export const pageSectionTypes = [
  heroSection,
  splitSection,
  proseSection,
  cardGridSection,
  valuesSection,
  ctaSection,
  contactSectionBlock,
  statsSection,
]
