<script setup lang="ts">
defineProps<{ heading: string }>()

const { data: settings } = await useSiteSettings()

const form = reactive({ firstName: '', lastName: '', email: '', subject: '', message: '', website: '' })
const state = ref<'idle' | 'sending' | 'sent' | 'error'>('idle')

async function submit() {
  state.value = 'sending'
  try {
    await $fetch('/api/contact', { method: 'POST', body: form })
    state.value = 'sent'
  }
  catch {
    state.value = 'error'
  }
}
</script>

<template>
  <section class="contact">
    <h2 class="display">{{ heading }}</h2>
    <div class="cols">
      <div v-if="settings" class="info">
        <h3 class="eyebrow">Location</h3>
        <p>{{ settings.meetingNote }}</p>
        <p class="address">{{ settings.address }}</p>
        <h3 class="eyebrow">Email</h3>
        <p><a :href="`mailto:${settings.email}`">{{ settings.email }}</a></p>
      </div>
      <form v-if="state !== 'sent'" novalidate @submit.prevent="submit">
        <div class="row">
          <label>First Name*
            <input v-model="form.firstName" required autocomplete="given-name">
          </label>
          <label>Last Name*
            <input v-model="form.lastName" required autocomplete="family-name">
          </label>
        </div>
        <label>Email Address*
          <input v-model="form.email" type="email" required autocomplete="email">
        </label>
        <label>Subject*
          <input v-model="form.subject" required>
        </label>
        <label>Message*
          <textarea v-model="form.message" rows="5" required />
        </label>
        <input v-model="form.website" type="text" name="website" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">
        <button class="btn btn-dark" :disabled="state === 'sending'">
          {{ state === 'sending' ? 'Sending…' : 'Send Message' }}
        </button>
        <p v-if="state === 'error'" role="alert">Something went wrong — please email us directly instead.</p>
      </form>
      <p v-else role="status" class="sent">Thanks — we'll be in touch.</p>
    </div>
  </section>
</template>

<style scoped>
.contact { background: var(--periwinkle); padding: 4rem 2rem; }
.contact h2 { font-size: clamp(2rem, 5vw, 3.5rem); margin: 0 0 2rem; }
.cols { display: grid; grid-template-columns: 1fr 2fr; gap: 3rem; align-items: start; }
.info a { color: var(--slate); }
.address { white-space: pre-line; }
form { display: grid; gap: 1rem; max-width: 640px; }
.row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
label { display: grid; gap: 0.25rem; font-weight: 600; font-size: 0.9rem; }
input, textarea {
  padding: 0.7rem;
  border: 1px solid var(--navy);
  font: inherit;
  background: #fff;
  color: var(--navy);
}
input:focus-visible, textarea:focus-visible { outline: 3px solid var(--steel); outline-offset: 1px; }
.hp { position: absolute; left: -9999px; }
.sent { font-size: 1.2rem; }
@media (max-width: 768px) {
  .cols { grid-template-columns: 1fr; }
  .row { grid-template-columns: 1fr; }
}
</style>
