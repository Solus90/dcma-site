import type { Update } from '~/types/content'

export interface SplitUpdates {
  /** Future-dated events, soonest first. */
  upcoming: Update[]
  /** Everything else (announcements, news, past events), newest first. */
  past: Update[]
}

/**
 * Split the updates feed into upcoming events and everything else.
 *
 * `todayIso` is a YYYY-MM-DD string in the network's local timezone. An event
 * is "upcoming" while its date is >= today, so it stays listed through the day
 * it happens. `past` keeps the order it was given (the query sorts newest first).
 */
export function splitUpdates(updates: Update[], todayIso: string): SplitUpdates {
  const upcoming = updates
    .filter(u => u.category === 'event' && u.publishedAt >= todayIso)
    .sort((a, b) => a.publishedAt.localeCompare(b.publishedAt))

  const upcomingIds = new Set(upcoming.map(u => u._id))
  const past = updates.filter(u => !upcomingIds.has(u._id))

  return { upcoming, past }
}
