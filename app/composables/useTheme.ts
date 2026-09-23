export type ThemePref = 'light' | 'dark'

const STORAGE_KEY = 'dcma-theme'

export function useTheme() {
  const pref = useState<ThemePref>('theme-pref', () => 'dark')

  function apply(value: ThemePref) {
    if (!import.meta.client) return
    const root = document.documentElement
    root.dataset.theme = value
    try {
      localStorage.setItem(STORAGE_KEY, value)
    }
    catch { 
      /* private mode / storage disabled */ 
      console.warn("Tried to set STORAGE_KEY but storage was disabled.")
    }
  }

  function set(value: ThemePref) {
    pref.value = value
    apply(value)
  }

  function cycle() {
    set(pref.value === 'light' ? 'dark' : 'light')
  }

  onMounted(() => {
    let stored: string | null = null
    try { stored = localStorage.getItem(STORAGE_KEY) }
    catch { /* ignore */ }
    pref.value = stored === 'light' || stored === 'dark' ? stored : 'dark'
  })

  return { pref, set, cycle }
}
