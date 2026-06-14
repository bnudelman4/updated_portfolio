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

export type SceneMode = 'measuring' | 'fallback' | 'three'

// Three-way variant: stays 'measuring' until the GPU tier is known, so the caller can show
// a neutral loading cover instead of flashing the fallback hero before the decision is made.
// gpuTier is undefined while drei's useDetectGPU is still resolving.
export function useSceneMode(gpuTier: number | undefined): SceneMode {
  const [mode, setMode] = useState<SceneMode>('measuring')
  useEffect(() => {
    if (gpuTier === undefined) return // GPU not detected yet — keep measuring
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const smallViewport =
      window.matchMedia('(max-width: 768px)').matches ||
      window.matchMedia('(pointer: coarse)').matches
    const fallback = shouldFallback({ reducedMotion, smallViewport, lowGpu: gpuTier < 2 })
    setMode(fallback ? 'fallback' : 'three')
  }, [gpuTier])
  return mode
}
