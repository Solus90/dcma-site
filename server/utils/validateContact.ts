export interface ContactBody {
  firstName: string
  lastName: string
  email: string
  subject: string
  message: string
  website?: string
}

export function validateContact(b: Partial<ContactBody>): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  for (const f of ['firstName', 'lastName', 'email', 'subject', 'message'] as const) {
    if (!b[f]?.trim()) errors.push(f)
  }
  if (b.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(b.email)) errors.push('email')
  return { valid: errors.length === 0, errors: [...new Set(errors)] }
}
