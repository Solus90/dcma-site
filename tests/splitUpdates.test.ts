import { describe, it, expect } from 'vitest'
import { splitUpdates } from '../app/utils/splitUpdates'
import type { Update } from '../app/types/content'

function makeUpdate(overrides: Partial<Update>): Update {
  return {
    _id: Math.random().toString(36).slice(2),
    title: 'Untitled',
    slug: 'untitled',
    publishedAt: '2026-01-01',
    category: 'announcement',
    summary: 'summary',
    ...overrides,
  }
}

const TODAY = '2026-08-30'

describe('splitUpdates', () => {
  it('puts future-dated events in upcoming, soonest first', () => {
    const updates = [
      makeUpdate({ _id: 'later', category: 'event', publishedAt: '2026-09-15' }),
      makeUpdate({ _id: 'sooner', category: 'event', publishedAt: '2026-09-01' }),
    ]

    const { upcoming } = splitUpdates(updates, TODAY)

    expect(upcoming.map(u => u._id)).toEqual(['sooner', 'later'])
  })

  it('keeps an event listed on the day it happens', () => {
    const updates = [makeUpdate({ _id: 'today', category: 'event', publishedAt: TODAY })]

    const { upcoming, past } = splitUpdates(updates, TODAY)

    expect(upcoming.map(u => u._id)).toEqual(['today'])
    expect(past).toEqual([])
  })

  it('sends past events and all non-events to past, order preserved', () => {
    const updates = [
      makeUpdate({ _id: 'news', category: 'news', publishedAt: '2026-10-01' }),
      makeUpdate({ _id: 'old-event', category: 'event', publishedAt: '2026-07-04' }),
      makeUpdate({ _id: 'announcement', category: 'announcement', publishedAt: '2026-08-01' }),
    ]

    const { upcoming, past } = splitUpdates(updates, TODAY)

    expect(upcoming).toEqual([])
    expect(past.map(u => u._id)).toEqual(['news', 'old-event', 'announcement'])
  })

  it('handles an empty feed', () => {
    expect(splitUpdates([], TODAY)).toEqual({ upcoming: [], past: [] })
  })

  it('does not treat a future non-event as upcoming', () => {
    const updates = [makeUpdate({ _id: 'future-news', category: 'news', publishedAt: '2026-12-25' })]

    const { upcoming, past } = splitUpdates(updates, TODAY)

    expect(upcoming).toEqual([])
    expect(past.map(u => u._id)).toEqual(['future-news'])
  })
})
