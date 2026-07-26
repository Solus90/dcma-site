import { describe, it, expect } from 'vitest'
import { validateContact } from '../server/utils/validateContact'
import { buildContactSubmissionDoc } from '../server/utils/contactSubmission'

const good = { firstName: 'A', lastName: 'B', email: 'a@b.co', subject: 'Hi', message: 'Hello', website: '' }

describe('validateContact', () => {
  it('accepts a complete submission', () => {
    expect(validateContact(good).valid).toBe(true)
  })

  it.each(['firstName', 'lastName', 'email', 'subject', 'message'] as const)(
    'rejects a missing %s field',
    (field) => {
      const r = validateContact({ ...good, [field]: '' })
      expect(r.valid).toBe(false)
      expect(r.errors).toContain(field)
    },
  )

  it('rejects a malformed email', () => {
    const r = validateContact({ ...good, email: 'nope' })
    expect(r.valid).toBe(false)
    expect(r.errors).toContain('email')
  })
})

describe('buildContactSubmissionDoc', () => {
  it('trims fields and sets metadata', () => {
    const doc = buildContactSubmissionDoc({
      firstName: '  Ada ',
      lastName: ' Lovelace ',
      email: ' ada@example.com ',
      subject: ' Help ',
      message: ' Hello ',
    })

    expect(doc).toMatchObject({
      _type: 'contactSubmission',
      firstName: 'Ada',
      lastName: 'Lovelace',
      email: 'ada@example.com',
      subject: 'Help',
      message: 'Hello',
      read: false,
    })
    expect(doc.submittedAt).toBeTruthy()
  })
})
