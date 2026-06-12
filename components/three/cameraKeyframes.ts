export type Vec3 = [number, number, number]
export interface Keyframe { offset: number; position: Vec3; lookAt: Vec3 }

// First-pass timeline (TUNED later against the real model).
// Model = "Computer Room" (Bruno Oliveira): room-scale ~27x10x29 units, NOT 1-unit.
// Scene center ~(-1.3, 4.6, -11); floor at y~0. Camera lives in tens of units and
// always aims near the room center. Act1 establish -> Act2 screen-readable -> Act3 handoff -> Act4 parked.
export const KEYFRAMES: Keyframe[] = [
  { offset: 0.0,  position: [12, 9, 10],  lookAt: [-1.3, 4.6, -11] },
  { offset: 0.18, position: [5, 6, 2],    lookAt: [-1.3, 4.8, -11] },
  { offset: 0.32, position: [0, 5.2, -4], lookAt: [-1.3, 5.0, -11] },
  { offset: 0.45, position: [7, 9, 7],    lookAt: [-1.3, 4.0, -12] },
  { offset: 1.0,  position: [9, 9, 9],    lookAt: [-1.3, 4.0, -13] },
]

const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const lerp3 = (a: Vec3, b: Vec3, t: number): Vec3 => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)]

export function poseAtOffset(offset: number): { position: Vec3; lookAt: Vec3 } {
  const o = Math.min(1, Math.max(0, offset))
  let a = KEYFRAMES[0], b = KEYFRAMES[KEYFRAMES.length - 1]
  for (let i = 0; i < KEYFRAMES.length - 1; i++) {
    if (o >= KEYFRAMES[i].offset && o <= KEYFRAMES[i + 1].offset) {
      a = KEYFRAMES[i]; b = KEYFRAMES[i + 1]; break
    }
  }
  const span = b.offset - a.offset
  const t = span <= 0 ? 0 : (o - a.offset) / span
  return { position: lerp3(a.position, b.position, t), lookAt: lerp3(a.lookAt, b.lookAt, t) }
}
