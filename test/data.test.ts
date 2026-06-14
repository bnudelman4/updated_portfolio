import { describe, it, expect } from 'vitest'
import { projects } from '@/data/projects'
import { about, skillGroups, contact } from '@/data/content'

describe('ported data', () => {
  it('has all 11 projects with required fields', () => {
    expect(projects).toHaveLength(11)
    for (const p of projects) {
      expect(p.name).toBeTruthy()
      expect(p.technologies.length).toBeGreaterThan(0)
      expect(p.features.length).toBeGreaterThan(0)
      expect(typeof p.timeframe).toBe('string')
      expect(p.screen).toBeTruthy()
    }
  })
  it('keeps SimplifyCS github link', () => {
    const s = projects.find(p => p.name === 'SimplifyCS')
    expect(s?.github).toBe('https://github.com/randall-sim/simplifycs')
  })
  it('has about + skills + contact', () => {
    expect(about.paragraphs.length).toBeGreaterThan(0)
    expect(skillGroups.length).toBeGreaterThan(0)
    expect(contact.email).toBe('bnudelman2@gmail.com')
  })
})
