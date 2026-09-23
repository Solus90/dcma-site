export type ThemePref = 'light' | 'dark'

export function useTheme() {
  const pref = useState<ThemePref>('theme-pref', () => 'dark')

  const STORAGE_KEY = 'dcma-theme'
  
  function apply(value: ThemePref) {
    if (!import.meta.client) return
    const root = document.documentElement
    localStorage.setItem(STORAGE_KEY, value)
    root.dataset.theme = value
  }

  function set(value: ThemePref) {
    pref.value = value
    apply(value)
  }

  function cycle() {
    set(pref.value === 'light' ? 'dark' : 'light')
  }

  onMounted(() => {
    pref.value = pref.value === 'light' ? 'light' :'dark'
  })

  return { pref, set, cycle }
}
