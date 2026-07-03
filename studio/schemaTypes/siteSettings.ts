import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({ name: 'orgName', type: 'string' }),
    defineField({ name: 'logo', type: 'image' }),
    defineField({ name: 'email', type: 'string' }),
    defineField({ name: 'facebookUrl', type: 'url' }),
    defineField({ name: 'address', type: 'text', rows: 3 }),
    defineField({ name: 'meetingNote', type: 'string' }),
    defineField({ name: 'joinCta', type: 'cta' }),
    defineField({ name: 'footerTagline', type: 'string' }),
    defineField({ name: 'copyright', type: 'string' }),
    defineField({ name: 'skipLinkLabel', type: 'string', title: 'Skip link label' }),
    defineField({ name: 'facebookLabel', type: 'string', title: 'Facebook link label' }),
    defineField({ name: 'navAriaLabel', type: 'string', title: 'Main navigation aria label' }),
    defineField({ name: 'navLinks', type: 'array', of: [{ type: 'navLink' }] }),
    defineField({ name: 'errorPage', type: 'errorPageCopy' }),
    defineField({
      name: 'fridgeShell',
      title: 'Full Hearts Fridge shell copy',
      type: 'object',
      description: 'Loading and error messages shown before or when fridge page content cannot load.',
      fields: [
        defineField({ name: 'loadingEyebrow', type: 'string' }),
        defineField({ name: 'loadingMessage', type: 'string' }),
        defineField({ name: 'errorHeading', type: 'string' }),
        defineField({ name: 'errorMessage', type: 'text', rows: 2 }),
        defineField({ name: 'errorEmailSubject', type: 'string' }),
        defineField({ name: 'errorEmailButtonLabel', type: 'string' }),
      ],
    }),
  ],
})
