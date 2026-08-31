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

/** Which routes to revalidate for a published Sanity document. */
export function revalidatePathsForDoc(type?: string, slug?: string): string[] {
  if (type === 'page') return slug ? [`/${slug}`] : []
  return type ? PATHS_BY_TYPE[type] ?? [] : []
}
