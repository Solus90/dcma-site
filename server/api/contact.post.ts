import { buildContactSubmissionDoc } from '../utils/contactSubmission'
import { getSanityWriteClient } from '../utils/sanityWriteClient'
import { validateContact } from '../utils/validateContact'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (body?.website) return { ok: true } // honeypot: pretend success for bots

  const { valid, errors } = validateContact(body ?? {})
  if (!valid) throw createError({ statusCode: 422, data: { errors } })

  const client = getSanityWriteClient(event)
  const doc = await client.create(buildContactSubmissionDoc(body))

  return { ok: true, id: doc._id }
})
