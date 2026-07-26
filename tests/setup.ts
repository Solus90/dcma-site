/**
 * Replicates Nuxt's auto-imports for unit tests that mount Vue components
 * without a full Nuxt server. Keep in sync with any new ~/utils exports used
 * bare in component templates.
 */
import * as vue from 'vue'
import { config } from '@vue/test-utils'
import { linkTarget } from '../app/utils/linkTarget'

// Vue Composition API (ref, computed, reactive, …) — Nuxt injects these globally
Object.assign(globalThis, vue)

// ~/utils exports used bare in templates — Nuxt injects via unimport.
// globalProperties makes them accessible via _ctx in Vue 3 template rendering.
config.global.plugins = [
  {
    install(app: ReturnType<typeof vue.createApp>) {
      app.config.globalProperties.linkTarget = linkTarget
    },
  },
]
