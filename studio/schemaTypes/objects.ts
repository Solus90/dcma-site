import { defineType, defineField } from 'sanity'

export const navLink = defineType({
  name: 'navLink',
  title: 'Nav link',
  type: 'object',
  fields: [
    defineField({ name: 'label', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'href', type: 'string', validation: (r) => r.required() }),
  ],
})

export const contactFormCopy = defineType({
  name: 'contactFormCopy',
  title: 'Contact form copy',
  type: 'object',
  fields: [
    defineField({ name: 'reassurance', type: 'string' }),
    defineField({ name: 'firstNameLabel', type: 'string' }),
    defineField({ name: 'lastNameLabel', type: 'string' }),
    defineField({ name: 'emailLabel', type: 'string' }),
    defineField({ name: 'subjectLabel', type: 'string' }),
    defineField({ name: 'messageLabel', type: 'string' }),
    defineField({ name: 'submitLabel', type: 'string' }),
    defineField({ name: 'sendingLabel', type: 'string' }),
    defineField({ name: 'successMessage', type: 'string' }),
    defineField({ name: 'fixFieldsMessage', type: 'string' }),
    defineField({ name: 'serverErrorMessage', type: 'string' }),
    defineField({ name: 'emailInvalidMessage', type: 'string' }),
    defineField({ name: 'fieldRequiredSuffix', type: 'string', description: 'Appended after the field label, e.g. "is required."' }),
  ],
})

export const errorPageCopy = defineType({
  name: 'errorPageCopy',
  title: 'Error page copy',
  type: 'object',
  fields: [
    defineField({ name: 'notFoundTitle', type: 'string' }),
    defineField({ name: 'notFoundDescription', type: 'text', rows: 2 }),
    defineField({ name: 'notFoundMetaTitle', type: 'string' }),
    defineField({ name: 'genericTitle', type: 'string' }),
    defineField({ name: 'genericDescription', type: 'text', rows: 2 }),
    defineField({ name: 'genericMetaTitle', type: 'string' }),
    defineField({ name: 'backHomeLabel', type: 'string' }),
    defineField({ name: 'fridgeLinkLabel', type: 'string' }),
    defineField({ name: 'emailUsLabel', type: 'string' }),
  ],
})

export const cta = defineType({
  name: 'cta',
  title: 'CTA',
  type: 'object',
  fields: [
    defineField({ name: 'label', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'href', type: 'string', description: 'URL or mailto:', validation: (r) => r.required() }),
  ],
})

export const card = defineType({
  name: 'card',
  title: 'Card',
  type: 'object',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'body', type: 'text', rows: 3 }),
    defineField({ name: 'image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'cta', type: 'cta' }),
  ],
})
