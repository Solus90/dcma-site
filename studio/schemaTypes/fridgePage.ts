import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'fridgePage',
  title: 'Full Hearts Fridge',
  type: 'document',
  fields: [
    defineField({ name: 'heading', type: 'string' }),
    defineField({ name: 'intro', type: 'text' }),
    defineField({ name: 'cta', type: 'cta' }),
    defineField({ name: 'values', type: 'array', of: [{ type: 'card' }] }),
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
