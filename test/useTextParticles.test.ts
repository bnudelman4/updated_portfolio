import { describe, it, expect } from 'vitest'
import { sampleText } from '@/components/three/useTextParticles'

describe('sampleText', () => {
  it('returns a Float32Array of xyz triples', () => {
    const pts = sampleText('BN', 500)
    expect(pts).toBeInstanceOf(Float32Array)
    expect(pts.length % 3).toBe(0)
    expect(pts.length).toBeGreaterThan(0)
  })
  it('respects max count', () => {
    const pts = sampleText('BN', 300)
    expect(pts.length / 3).toBeLessThanOrEqual(300)
  })
})
