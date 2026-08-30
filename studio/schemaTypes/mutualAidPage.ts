import { defineType, defineField } from 'sanity'

const book = defineType({
  name: 'mutualAidBook',
  title: 'Book',
  type: 'object',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'author', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'difficulty',
      type: 'string',
      description: 'Relative to the other books on the list, not an absolute measure.',
      options: { list: ['Lighter', 'Moderate', 'Heavier'], layout: 'radio' },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'length', type: 'string', description: 'e.g. "~150 pages"' }),
    defineField({ name: 'summary', type: 'text', rows: 4, description: 'Roughly three sentences.' }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'difficulty' },
  },
})

const question = defineType({
  name: 'mutualAidQuestion',
  title: 'Question + answer',
  type: 'object',
  fields: [
    defineField({ name: 'question', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'answer', type: 'text', rows: 3, validation: (r) => r.required() }),
  ],
  preview: {
    select: { title: 'question' },
  },
})

export { book as mutualAidBook, question as mutualAidQuestion }

export default defineType({
  name: 'mutualAidPage',
  title: 'What Is Mutual Aid Page',
  type: 'document',
  fields: [
    defineField({ name: 'heroEyebrow', type: 'string' }),
    defineField({ name: 'heroHeading', type: 'string' }),
    defineField({ name: 'lede', type: 'text', rows: 3 }),
    defineField({ name: 'kropotkinHook', type: 'text', rows: 3, title: 'Opening paragraph (Kropotkin)' }),

    defineField({ name: 'solidarityHeading', type: 'string' }),
    defineField({ name: 'solidarityParagraphs', type: 'array', of: [{ type: 'text' }] }),

    defineField({ name: 'whyHeading', type: 'string' }),
    defineField({ name: 'whyParagraphs', type: 'array', of: [{ type: 'text' }] }),

    defineField({ name: 'looksLikeHeading', type: 'string' }),
    defineField({ name: 'looksLikeIntro', type: 'string' }),
    defineField({ name: 'looksLikeItems', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'looksLikeOutro', type: 'text', rows: 2 }),
    defineField({ name: 'looksLikeCta', type: 'cta', title: 'Link after the list (Projects)' }),

    defineField({ name: 'organizedHeading', type: 'string' }),
    defineField({ name: 'organizedParagraphs', type: 'array', of: [{ type: 'text' }] }),
    defineField({ name: 'securityCta', type: 'cta', title: 'Security norms link' }),

    defineField({ name: 'questionsHeading', type: 'string' }),
    defineField({ name: 'questions', type: 'array', of: [{ type: 'mutualAidQuestion' }] }),

    defineField({ name: 'readingHeading', type: 'string' }),
    defineField({ name: 'readingIntro', type: 'text', rows: 2 }),
    defineField({ name: 'readingNote', type: 'text', rows: 2, description: 'The "labels are relative" note.' }),
    defineField({ name: 'books', type: 'array', of: [{ type: 'mutualAidBook' }] }),
    defineField({ name: 'readingClosing', type: 'text', rows: 2 }),
    defineField({ name: 'readingCta', type: 'cta', title: 'Suggest-a-book link' }),

    defineField({ name: 'ctaHeading', type: 'string' }),
    defineField({ name: 'ctaBody', type: 'text', rows: 2 }),
    defineField({ name: 'cta', type: 'cta', title: 'Get involved CTA' }),

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
    prepare: () => ({ title: 'What Is Mutual Aid Page' }),
  },
})
