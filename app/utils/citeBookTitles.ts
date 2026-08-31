const escapeHtml = (s: string) =>
  s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] as string))

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/**
 * From a list of book titles, the ones distinctive enough to italicize when
 * they appear in prose: the full title and its pre-colon short form, if at
 * least 12 characters (skips the generic "Mutual Aid"). Longest first so a
 * subtitled title wins the match.
 */
export function citeableTitles(titles: string[]): string[] {
  const set = new Set<string>()
  for (const title of titles) {
    for (const t of [title, title.split(':')[0].trim()]) {
      if (t.length >= 12) set.add(t)
    }
  }
  return [...set].sort((a, b) => b.length - a.length)
}

/**
 * HTML-escape `text`, then wrap any occurrence of `titles` in `<cite>`.
 * The result is safe to pass to v-html — the paragraph text stays plain data,
 * only the known titles get markup.
 */
export function citeBookTitles(text: string, titles: string[]): string {
  const escaped = escapeHtml(text)
  const terms = citeableTitles(titles)
  if (!terms.length) return escaped
  const pattern = terms.map(t => escapeRegExp(escapeHtml(t))).join('|')
  return escaped.replace(new RegExp(`\\b(${pattern})\\b`, 'g'), '<cite>$1</cite>')
}
