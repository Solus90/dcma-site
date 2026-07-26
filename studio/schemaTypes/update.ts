import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'update',
  title: 'Update',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: r => r.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: r => r.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published date',
      type: 'date',
      validation: r => r.required(),
    }),
    defineField({
      name: 'category',
      type: 'string',
      options: {
        list: [
          { title: 'Event', value: 'event' },
          { title: 'Announcement', value: 'announcement' },
          { title: 'News', value: 'news' },
        ],
      },
      initialValue: 'announcement',
    }),
    defineField({
      name: 'summary',
      type: 'text',
      rows: 3,
      validation: r => r.required(),
    }),
    defineField({
      name: 'image',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', type: 'string', title: 'Alt text' })],
    }),
    defineField({ name: 'cta', type: 'cta' }),
  ],
  orderings: [
    {
      title: 'Date, newest first',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: { title: 'title', subtitle: 'publishedAt', media: 'image' },
    prepare({ title, subtitle, media }) {
      return {
        title: title || 'Untitled update',
        subtitle: subtitle || 'No date',
        media,
      }
    },
  },
})
