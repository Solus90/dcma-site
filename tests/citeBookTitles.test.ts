import { describe, it, expect } from 'vitest'
import { citeableTitles, citeBookTitles } from '../app/utils/citeBookTitles'

const BOOKS = [
  'Mutual Aid: Building Solidarity During This Crisis (and the Next)',
  'The Serviceberry: Abundance and Reciprocity in the Natural World',
  'Mutual Aid: A Factor of Evolution',
  'Abolish Rent',
  'The Color of Law: A Forgotten History of How Our Government Segregated America',
  'Invisible Doctrine: The Secret History of Neoliberalism',
]

describe('citeableTitles', () => {
  it('includes distinctive short forms, drops the generic "Mutual Aid"', () => {
    const terms = citeableTitles(BOOKS)
    expect(terms).toContain('Invisible Doctrine')
    expect(terms).toContain('The Color of Law')
    expect(terms).toContain('The Serviceberry')
    expect(terms).not.toContain('Mutual Aid') // 10 chars — below the threshold
  })

  it('sorts longest first', () => {
    const terms = citeableTitles(BOOKS)
    for (let i = 1; i < terms.length; i++) {
      expect(terms[i - 1].length).toBeGreaterThanOrEqual(terms[i].length)
    }
  })
})

describe('citeBookTitles', () => {
  const para =
    'George Monbiot and Peter Hutchison\'s Invisible Doctrine covers the economics, '
    + 'and Richard Rothstein\'s The Color of Law covers how it played out in housing.'

  it('wraps the named books in <cite>', () => {
    const html = citeBookTitles(para, BOOKS)
    expect(html).toContain('<cite>Invisible Doctrine</cite>')
    expect(html).toContain('<cite>The Color of Law</cite>')
  })

  it('does not italicize a lowercase "mutual aid" in prose', () => {
    const html = citeBookTitles('Mutual aid fills the gaps now.', BOOKS)
    expect(html).not.toContain('<cite>')
  })

  it('escapes HTML in the source text', () => {
    const html = citeBookTitles('gaps & <script>alert(1)</script>', BOOKS)
    expect(html).toBe('gaps &amp; &lt;script&gt;alert(1)&lt;/script&gt;')
  })

  it('returns escaped text unchanged when no titles match', () => {
    expect(citeBookTitles('nothing to cite here', BOOKS)).toBe('nothing to cite here')
  })
})
