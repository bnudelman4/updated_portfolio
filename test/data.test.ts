import { describe, it, expect } from 'vitest'
import { projects } from '@/data/projects'
import { about, skillGroups, contact } from '@/data/content'

describe('ported data', () => {
  it('has all 7 projects with required fields', () => {
    expect(projects).toHaveLength(7)
    for (const p of projects) {
      expect(p.name).toBeTruthy()
      expect(p.technologies.length).toBeGreaterThan(0)
      expect(p.features.length).toBeGreaterThan(0)
      expect(typeof p.timeframe).toBe('string')
    }
  })
  it('keeps SimplifyCS github link', () => {
    const s = projects.find(p => p.name === 'SimplifyCS')
    expect(s?.github).toBe('https://github.com/randysim/simplifycs')
  })
  it('has about + skills + contact', () => {
    expect(about.paragraphs.length).toBeGreaterThan(0)
    expect(skillGroups.length).toBeGreaterThan(0)
    expect(contact.email).toBe('bnudelman2@gmail.com')
  })
})
