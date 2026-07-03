<script setup lang="ts">
import { validateContact } from '~~/server/utils/validateContact'
import type { ContactFormCopy, SiteSettings } from '~/types/content'

const props = defineProps<{ heading: string; formCopy: ContactFormCopy; settings: SiteSettings }>()

const form = reactive({ firstName: '', lastName: '', email: '', subject: '', message: '', website: '' })
const state = ref<'idle' | 'sending' | 'sent' | 'error'>('idle')
const fieldErrors = ref<Partial<Record<keyof typeof form, string>>>({})
const formError = ref('')

const fieldLabels = computed(() => ({
  firstName: props.formCopy.firstNameLabel,
  lastName: props.formCopy.lastNameLabel,
  email: props.formCopy.emailLabel,
  subject: props.formCopy.subjectLabel,
  message: props.formCopy.messageLabel,
}))

function clearFieldError(field: keyof typeof form) {
  if (fieldErrors.value[field]) {
    const next = { ...fieldErrors.value }
    delete next[field]
    fieldErrors.value = next
  }
}

function fieldRequiredMessage(field: keyof typeof fieldLabels.value) {
  return `${fieldLabels.value[field]} ${props.formCopy.fieldRequiredSuffix}`
}

async function submit(event: Event) {
  const el = event.target as HTMLFormElement
  fieldErrors.value = {}
  formError.value = ''

  if (!el.checkValidity()) {
    el.reportValidity()
    return
  }

  const { valid, errors } = validateContact(form)
  if (!valid) {
    for (const key of errors) {
      if (key in fieldLabels.value) {
        fieldErrors.value[key as keyof typeof form]
          = key === 'email' && form.email.trim()
            ? props.formCopy.emailInvalidMessage
            : fieldRequiredMessage(key as keyof typeof fieldLabels.value)
      }
    }
    return
  }

  state.value = 'sending'
  try {
    await $fetch('/api/contact', { method: 'POST', body: form })
    state.value = 'sent'
  }
  catch (err: unknown) {
    state.value = 'error'
    const data = (err as { data?: { errors?: string[] } })?.data
    if (data?.errors?.length) {
      for (const key of data.errors) {
        if (key in fieldLabels.value) {
          fieldErrors.value[key as keyof typeof form] = fieldRequiredMessage(key as keyof typeof fieldLabels.value)
        }
      }
      formError.value = props.formCopy.fixFieldsMessage
    }
    else {
      formError.value = props.formCopy.serverErrorMessage
    }
  }
}
</script>

<template>
  <section class="contact" aria-labelledby="contact-heading">
    <header class="contact-intro">
      <h2 id="contact-heading" class="display">{{ heading }}</h2>
      <p class="reassurance">{{ formCopy.reassurance }}</p>
    </header>

    <div class="contact-body">
      <form v-if="state !== 'sent'" class="contact-form" @submit.prevent="submit">
        <div class="row">
          <label>{{ formCopy.firstNameLabel }}*
            <input
              v-model="form.firstName"
              required
              autocomplete="given-name"
              :aria-invalid="!!fieldErrors.firstName"
              :aria-describedby="fieldErrors.firstName ? 'err-firstName' : undefined"
              @input="clearFieldError('firstName')"
            >
            <span v-if="fieldErrors.firstName" id="err-firstName" class="field-error" role="alert">{{ fieldErrors.firstName }}</span>
          </label>
          <label>{{ formCopy.lastNameLabel }}*
            <input
              v-model="form.lastName"
              required
              autocomplete="family-name"
              :aria-invalid="!!fieldErrors.lastName"
              :aria-describedby="fieldErrors.lastName ? 'err-lastName' : undefined"
              @input="clearFieldError('lastName')"
            >
            <span v-if="fieldErrors.lastName" id="err-lastName" class="field-error" role="alert">{{ fieldErrors.lastName }}</span>
          </label>
        </div>
        <label>{{ formCopy.emailLabel }}*
          <input
            v-model="form.email"
            type="email"
            required
            autocomplete="email"
            :aria-invalid="!!fieldErrors.email"
            :aria-describedby="fieldErrors.email ? 'err-email' : undefined"
            @input="clearFieldError('email')"
          >
          <span v-if="fieldErrors.email" id="err-email" class="field-error" role="alert">{{ fieldErrors.email }}</span>
        </label>
        <label>{{ formCopy.subjectLabel }}*
          <input
            v-model="form.subject"
            required
            :aria-invalid="!!fieldErrors.subject"
            :aria-describedby="fieldErrors.subject ? 'err-subject' : undefined"
            @input="clearFieldError('subject')"
          >
          <span v-if="fieldErrors.subject" id="err-subject" class="field-error" role="alert">{{ fieldErrors.subject }}</span>
        </label>
        <label>{{ formCopy.messageLabel }}*
          <textarea
            v-model="form.message"
            rows="6"
            required
            :aria-invalid="!!fieldErrors.message"
            :aria-describedby="fieldErrors.message ? 'err-message' : undefined"
            @input="clearFieldError('message')"
          />
          <span v-if="fieldErrors.message" id="err-message" class="field-error" role="alert">{{ fieldErrors.message }}</span>
        </label>
        <input v-model="form.website" type="text" name="website" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">
        <button class="btn btn-dark submit" :disabled="state === 'sending'">
          {{ state === 'sending' ? formCopy.sendingLabel : formCopy.submitLabel }}
        </button>
        <p v-if="formError" role="alert" class="form-error">{{ formError }}</p>
      </form>

      <p v-else role="status" class="sent display">{{ formCopy.successMessage }}</p>

      <aside class="reach">
        <p class="reach-note">{{ settings.meetingNote }}</p>
        <p class="reach-address">{{ settings.address }}</p>
        <a
          class="reach-email"
          :href="`mailto:${settings.email}`"
          v-bind="linkTarget(`mailto:${settings.email}`)"
        >{{ settings.email }}</a>
      </aside>
    </div>
  </section>
</template>

<style scoped>
.contact {
  background: var(--periwinkle);
  padding: clamp(3rem, 8vw, 5rem) 2rem;
  border-top: 1px solid var(--hairline);
}

.contact-intro {
  max-width: 42rem;
  margin-bottom: clamp(2rem, 5vw, 3.5rem);
}

.contact h2 {
  font-size: clamp(2.25rem, 7vw, 4.5rem);
  margin: 0 0 1rem;
  text-wrap: balance;
}

.reassurance {
  margin: 0;
  font-size: clamp(1rem, 2vw, 1.125rem);
  line-height: 1.6;
  max-width: 38ch;
  text-wrap: pretty;
}

.contact-body {
  display: grid;
  grid-template-columns: minmax(0, 3fr) minmax(0, 2fr);
  gap: clamp(2rem, 5vw, 4rem);
  align-items: start;
}

.contact-form {
  display: grid;
  gap: 1.25rem;
}

.row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
}

label {
  display: grid;
  gap: 0.5rem;
  font-weight: 600;
  font-size: 0.95rem;
}

input,
textarea {
  padding: 0.9rem 1rem;
  border: 2px solid var(--navy);
  font: inherit;
  background: #fff;
  color: var(--navy);
}

input[aria-invalid='true'],
textarea[aria-invalid='true'] {
  border-color: var(--navy);
  outline: 1px solid var(--navy);
}

input:focus-visible,
textarea:focus-visible {
  outline: 3px solid var(--steel);
  outline-offset: 2px;
}

.field-error {
  font-weight: 400;
  font-size: 0.85rem;
  color: var(--navy);
}

.form-error {
  margin: 0;
  font-weight: 600;
}

.submit {
  justify-self: start;
  width: 100%;
  max-width: 20rem;
  padding: 1rem 2rem;
  font-size: 0.9rem;
}

.hp {
  position: absolute;
  left: -9999px;
}

.sent {
  font-size: clamp(2rem, 5vw, 3.5rem);
  margin: 0;
  text-wrap: balance;
}

.reach {
  padding-top: 0.25rem;
  border-top: 2px solid var(--navy);
}

.reach-note {
  margin: 1.25rem 0 0.75rem;
  font-weight: 700;
  font-size: 1.05rem;
  line-height: 1.4;
  color: var(--navy);
}

.reach-address {
  margin: 0 0 1.5rem;
  white-space: pre-line;
  line-height: 1.6;
}

.reach-email {
  display: inline-block;
  color: var(--navy);
  font-weight: 700;
  font-size: clamp(1rem, 2.5vw, 1.25rem);
  line-height: 1.3;
  text-decoration: none;
  word-break: break-word;
}

.reach-email:hover {
  text-decoration: underline;
  text-underline-offset: 4px;
}

.reach-email:focus-visible {
  outline: 3px solid var(--navy);
  outline-offset: 2px;
}

@media (max-width: 768px) {
  .contact {
    padding-inline: 1.25rem;
  }

  .contact-body {
    grid-template-columns: 1fr;
  }

  .reach {
    padding-top: 1.5rem;
    border-top: 2px solid var(--navy);
  }

  .row {
    grid-template-columns: 1fr;
  }

  .submit {
    max-width: none;
  }
}
</style>
