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
