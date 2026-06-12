import { describe, it, expect } from 'vitest'
import { projectLinks } from '@/lib/links'

describe('projectLinks', () => {
  it('omits null links', () => {
    const links = projectLinks({ github: 'g', live: null, demo: null } as any)
    expect(links).toEqual([{ label: 'GitHub', url: 'g' }])
  })
  it('includes live + demo when present', () => {
    const links = projectLinks({ github: null, live: 'l', demo: 'd' } as any)
    expect(links.map(l => l.label)).toEqual(['Live', 'Demo'])
  })
})
