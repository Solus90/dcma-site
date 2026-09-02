import { describe, it, expect } from 'vitest'
import { revalidatePathsForDoc } from '../server/utils/revalidatePaths'

describe('revalidatePathsForDoc', () => {
  it('maps singletons to their route', () => {
    expect(revalidatePathsForDoc('mutualAidPage')).toEqual(['/what-is-mutual-aid'])
    expect(revalidatePathsForDoc('fridgePage')).toEqual(['/projects/full-hearts-fridge'])
    expect(revalidatePathsForDoc('homePage')).toEqual(['/'])
  })

  it('maps an update to /updates', () => {
    expect(revalidatePathsForDoc('update')).toEqual(['/updates'])
    expect(revalidatePathsForDoc('updatesPage')).toEqual(['/updates'])
  })

  it('revalidates every chrome-bearing route for siteSettings', () => {
    const paths = revalidatePathsForDoc('siteSettings')
    expect(paths).toContain('/')
    expect(paths).toContain('/updates')
    expect(paths.length).toBeGreaterThan(3)
  })

  it('maps a page doc to its slug', () => {
    expect(revalidatePathsForDoc('page', 'get-involved')).toEqual(['/get-involved'])
  })

  it('returns nothing for a page with no slug, or an unknown type', () => {
    expect(revalidatePathsForDoc('page')).toEqual([])
    expect(revalidatePathsForDoc('contactSubmission')).toEqual([])
    expect(revalidatePathsForDoc(undefined)).toEqual([])
  })

  it('rejects a slug that could escape the origin', () => {
    // `//evil.example.com` is a protocol-relative URL — must not become a path
    for (const bad of ['/evil.example.com', 'evil.example.com', 'a/b', '../x', 'foo bar', 'FOO', 'foo.', '-']) {
      expect(revalidatePathsForDoc('page', bad)).toEqual([])
    }
  })
})
