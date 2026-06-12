'use client'
import { useEffect, useState } from 'react'

export interface FallbackInputs { reducedMotion: boolean; smallViewport: boolean; lowGpu: boolean }
export function shouldFallback(i: FallbackInputs): boolean {
  return i.reducedMotion || i.smallViewport || i.lowGpu
}

// Hook: resolves inputs on the client. lowGpu is passed in by the caller
// (from drei useDetectGPU) so this hook stays dependency-free and testable.
export function useSceneFallback(lowGpu: boolean): boolean {
  const [fb, setFb] = useState(true) // default safe (fallback) until measured
  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const smallViewport =
      window.matchMedia('(max-width: 768px)').matches ||
      window.matchMedia('(pointer: coarse)').matches
    setFb(shouldFallback({ reducedMotion, smallViewport, lowGpu }))
  }, [lowGpu])
  return fb
}
