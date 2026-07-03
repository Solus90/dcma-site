import { defineType, defineField } from 'sanity'

const RESERVED_SLUGS = ['full-hearts-fridge', 'about', 'about-us', 'api']

export default defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (r) => r.required().custom((slug) => {
        const current = typeof slug === 'object' && slug && 'current' in slug
          ? String(slug.current)
          : String(slug ?? '')
        if (!current) return 'Slug is required'
        if (RESERVED_SLUGS.includes(current)) {
          return `"${current}" is reserved — choose a different URL slug`
        }
        return true
      }),
    }),
    defineField({
      name: 'sections',
      title: 'Page sections',
      type: 'array',
      of: [
        { type: 'heroSection' },
        { type: 'splitSection' },
        { type: 'proseSection' },
        { type: 'cardGridSection' },
        { type: 'valuesSection' },
        { type: 'ctaSection' },
        { type: 'contactSectionBlock' },
        { type: 'statsSection' },
      ],
      validation: (r) => r.min(1),
    }),
    defineField({
      name: 'seo',
      type: 'object',
      fields: [
        defineField({ name: 'title', type: 'string' }),
        defineField({ name: 'description', type: 'text', rows: 2 }),
      ],
    }),
  ],
  orderings: [
    {
      title: 'Title A–Z',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }],
    },
  ],
  preview: {
    select: { title: 'title', slug: 'slug.current' },
    prepare({ title, slug }) {
      return {
        title: title || 'Untitled page',
        subtitle: slug ? `/${slug}` : 'No slug',
      }
    },
  },
})
