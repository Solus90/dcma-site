import { describe, it, expect } from 'vitest'
import { validateContact } from '../server/utils/validateContact'

const good = { firstName: 'A', lastName: 'B', email: 'a@b.co', subject: 'Hi', message: 'Hello', website: '' }

describe('validateContact', () => {
  it('accepts a complete submission', () => {
    expect(validateContact(good).valid).toBe(true)
  })
  it('rejects missing required fields', () => {
    const r = validateContact({ ...good, email: '' })
    expect(r.valid).toBe(false)
    expect(r.errors).toContain('email')
  })
  it('rejects malformed email', () => {
    expect(validateContact({ ...good, email: 'nope' }).valid).toBe(false)
  })
})

describe('buildContactSubmissionDoc', () => {
  it('trims fields and sets metadata', async () => {
    const { buildContactSubmissionDoc } = await import('../server/utils/contactSubmission')
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
