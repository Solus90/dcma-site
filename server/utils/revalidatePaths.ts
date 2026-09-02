const PATHS_BY_TYPE: Record<string, string[]> = {
  update: ['/updates'],
  updatesPage: ['/updates'],
  mutualAidPage: ['/what-is-mutual-aid'],
  homePage: ['/'],
  aboutPage: ['/about'],
  fridgePage: ['/projects/full-hearts-fridge'],
  // header / footer / nav render on every page
  siteSettings: ['/', '/about', '/what-is-mutual-aid', '/projects', '/projects/full-hearts-fridge', '/updates'],
}

// A CMS "page" slug is a single lowercase-hyphen segment. Reject anything else —
// a leading slash, a dot, an absolute URL — before it becomes `/${slug}`.
// `/evil.example.com` → `//evil.example.com`, which $fetch treats as a
// protocol-relative URL and would send our `x-prerender-revalidate` bypass
// token to that host.
const SAFE_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

/** Which routes to revalidate for a published Sanity document. */
export function revalidatePathsForDoc(type?: string, slug?: string): string[] {
  if (type === 'page') return slug && SAFE_SLUG.test(slug) ? [`/${slug}`] : []
  return type ? PATHS_BY_TYPE[type] ?? [] : []
}
