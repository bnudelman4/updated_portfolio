import { describe, it, expect } from 'vitest'
import { shouldFallback } from '@/components/three/useSceneFallback'

describe('shouldFallback', () => {
  it('falls back on reduced motion', () => {
    expect(shouldFallback({ reducedMotion: true, smallViewport: false, lowGpu: false })).toBe(true)
  })
  it('falls back on small viewport', () => {
    expect(shouldFallback({ reducedMotion: false, smallViewport: true, lowGpu: false })).toBe(true)
  })
  it('falls back on low gpu', () => {
    expect(shouldFallback({ reducedMotion: false, smallViewport: false, lowGpu: true })).toBe(true)
  })
  it('uses full 3d when capable', () => {
    expect(shouldFallback({ reducedMotion: false, smallViewport: false, lowGpu: false })).toBe(false)
  })
})
