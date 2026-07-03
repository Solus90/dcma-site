import type { ContactBody } from './validateContact'

export function buildContactSubmissionDoc(body: ContactBody) {
  return {
    _type: 'contactSubmission' as const,
    firstName: body.firstName.trim(),
    lastName: body.lastName.trim(),
    email: body.email.trim(),
    subject: body.subject.trim(),
    message: body.message.trim(),
    submittedAt: new Date().toISOString(),
    read: false,
  }
}
