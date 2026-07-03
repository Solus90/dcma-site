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
  ],
})
