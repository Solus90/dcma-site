export type ThemePref = 'system' | 'light' | 'dark'

const STORAGE_KEY = 'dcma-theme'
const ORDER: ThemePref[] = ['system', 'light', 'dark']

/**
 * Light/dark theme preference. `system` follows `prefers-color-scheme` (pure CSS,
 * see main.css); `light`/`dark` set `data-theme` on <html> to override it.
 * The pre-paint apply is done by an inline script in nuxt.config — this just
 * drives the toggle after hydration.
 */
export function useTheme() {
  const pref = useState<ThemePref>('theme-pref', () => 'system')

  function apply(value: ThemePref) {
    if (!import.meta.client) return
    const root = document.documentElement
    if (value === 'system') delete root.dataset.theme
    else root.dataset.theme = value
    try {
      if (value === 'system') localStorage.removeItem(STORAGE_KEY)
      else localStorage.setItem(STORAGE_KEY, value)
    }
    catch { /* private mode / storage disabled */ }
  }

  function set(value: ThemePref) {
    pref.value = value
    apply(value)
  }

  function cycle() {
    set(ORDER[(ORDER.indexOf(pref.value) + 1) % ORDER.length])
  }

  onMounted(() => {
    let stored: string | null = null
    try { stored = localStorage.getItem(STORAGE_KEY) }
    catch { /* ignore */ }
    pref.value = stored === 'light' || stored === 'dark' ? stored : 'system'
  })

  return { pref, set, cycle }
}
