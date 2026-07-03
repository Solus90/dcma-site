import { defineType, defineField } from 'sanity'

const textItem = defineType({
  name: 'aboutTextItem',
  title: 'Title + body',
  type: 'object',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'body', type: 'text', rows: 4 }),
  ],
})

const tocItem = defineType({
  name: 'aboutTocItem',
  title: 'Table of contents item',
  type: 'object',
  fields: [
    defineField({ name: 'id', type: 'string', title: 'Anchor ID', validation: (r) => r.required() }),
    defineField({ name: 'label', type: 'string', validation: (r) => r.required() }),
  ],
  preview: {
    select: { title: 'label', subtitle: 'id' },
  },
})

export { textItem as aboutTextItem, tocItem as aboutTocItem }

export default defineType({
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',
  fields: [
    defineField({ name: 'heroEyebrow', type: 'string' }),
    defineField({ name: 'heroHeading', type: 'string' }),
    defineField({ name: 'version', type: 'string' }),
    defineField({ name: 'date', type: 'string' }),
    defineField({ name: 'lede', type: 'text', rows: 2 }),
    defineField({ name: 'tocAriaLabel', type: 'string', title: 'Table of contents aria label' }),
    defineField({ name: 'toc', type: 'array', of: [{ type: 'aboutTocItem' }] }),
    defineField({ name: 'introductionHeading', type: 'string' }),
    defineField({ name: 'introductionParagraphs', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'missionTitle', type: 'string' }),
    defineField({ name: 'missionBody', type: 'text', rows: 4 }),
    defineField({ name: 'principlesHeading', type: 'string' }),
    defineField({ name: 'principlesIntro', type: 'text', rows: 2 }),
    defineField({ name: 'principles', type: 'array', of: [{ type: 'aboutTextItem' }] }),
    defineField({ name: 'shortNormsHeading', type: 'string' }),
    defineField({ name: 'shortNormsIntro', type: 'string' }),
    defineField({ name: 'shortNorms', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'collectiveNormsHeading', type: 'string' }),
    defineField({ name: 'collectiveNormsIntro', type: 'text', rows: 2 }),
    defineField({ name: 'collectiveNorms', type: 'array', of: [{ type: 'aboutTextItem' }] }),
    defineField({ name: 'securityHeading', type: 'string' }),
    defineField({ name: 'securityIntro', type: 'text', rows: 4 }),
    defineField({ name: 'securityTldr', type: 'text', rows: 3 }),
    defineField({ name: 'securityContext', type: 'text', rows: 3 }),
    defineField({ name: 'securityItems', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'securityConfrontationalHeading', type: 'text', rows: 2 }),
    defineField({ name: 'securityConfrontationalItems', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'securityMeetingsHeading', type: 'string' }),
    defineField({ name: 'securityMeetingItems', type: 'array', of: [{ type: 'string' }] }),
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
