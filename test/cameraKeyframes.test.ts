import { describe, it, expect } from 'vitest'
import { poseAtOffset, KEYFRAMES } from '@/components/three/cameraKeyframes'

describe('poseAtOffset', () => {
  it('returns the first pose at offset 0', () => {
    const p = poseAtOffset(0)
    expect(p.position).toEqual(KEYFRAMES[0].position)
  })
  it('returns the last pose at offset 1', () => {
    const p = poseAtOffset(1)
    expect(p.position).toEqual(KEYFRAMES[KEYFRAMES.length - 1].position)
  })
  it('interpolates linearly between two keyframes (midpoint)', () => {
    const a = KEYFRAMES[0], b = KEYFRAMES[1]
    const mid = (a.offset + b.offset) / 2
    const p = poseAtOffset(mid)
    expect(p.position[0]).toBeCloseTo((a.position[0] + b.position[0]) / 2, 5)
    expect(p.lookAt[1]).toBeCloseTo((a.lookAt[1] + b.lookAt[1]) / 2, 5)
  })
  it('clamps out-of-range offsets', () => {
    expect(poseAtOffset(-1).position).toEqual(KEYFRAMES[0].position)
    expect(poseAtOffset(2).position).toEqual(KEYFRAMES[KEYFRAMES.length - 1].position)
  })
})
