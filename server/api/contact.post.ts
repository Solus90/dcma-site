import { validateContact } from '../utils/validateContact'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (body?.website) return { ok: true } // honeypot: pretend success for bots
  const { valid, errors } = validateContact(body ?? {})
  if (!valid) throw createError({ statusCode: 422, data: { errors } })

  const { resendApiKey, contactTo } = useRuntimeConfig(event)
  const res = await $fetch<{ id: string }>('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${resendApiKey}` },
    body: {
      from: 'Website <contact@doorcountymutualaid.org>',
      to: [contactTo],
      reply_to: body.email,
      subject: `[Website] ${body.subject}`,
      text: `From: ${body.firstName} ${body.lastName} <${body.email}>\n\n${body.message}`,
    },
  })
  return { ok: true, id: res.id }
})
