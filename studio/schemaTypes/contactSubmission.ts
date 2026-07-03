import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'contactSubmission',
  title: 'Contact message',
  type: 'document',
  fields: [
    defineField({ name: 'firstName', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'lastName', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'email', type: 'string', validation: (r) => r.required().email() }),
    defineField({ name: 'subject', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'message', type: 'text', rows: 8, validation: (r) => r.required() }),
    defineField({
      name: 'submittedAt',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (r) => r.required(),
    }),
    defineField({ name: 'read', type: 'boolean', title: 'Read', initialValue: false }),
  ],
  orderings: [
    {
      title: 'Newest first',
      name: 'submittedAtDesc',
      by: [{ field: 'submittedAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      subject: 'subject',
      email: 'email',
      firstName: 'firstName',
      lastName: 'lastName',
      read: 'read',
    },
    prepare({ subject, email, firstName, lastName, read }) {
      const name = [firstName, lastName].filter(Boolean).join(' ')
      return {
        title: subject || 'No subject',
        subtitle: [name, email, read ? 'Read' : 'Unread'].filter(Boolean).join(' · '),
      }
    },
  },
})
