import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'updatesPage',
  title: 'Updates Page',
  type: 'document',
  description: 'Headings and copy for the /updates page. The updates themselves are edited under "Updates".',
  fields: [
    defineField({ name: 'heroEyebrow', type: 'string' }),
    defineField({ name: 'heroHeading', type: 'string' }),
    defineField({ name: 'lede', type: 'text', rows: 2 }),
    defineField({ name: 'listAriaLabel', type: 'string', title: 'Updates list aria label' }),
    defineField({ name: 'emptyMessage', type: 'string', description: 'Shown when there are no updates yet.' }),
    defineField({
      name: 'seo',
      type: 'object',
      fields: [
        defineField({ name: 'title', type: 'string' }),
        defineField({ name: 'description', type: 'text', rows: 2 }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Updates Page' }),
  },
})
