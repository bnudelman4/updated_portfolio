export type Vec3 = [number, number, number]
export interface Keyframe { offset: number; position: Vec3; lookAt: Vec3 }

// First-pass timeline (TUNED later against the real model).
// Model = "Computer Room" (Bruno Oliveira): room-scale ~27x10x29 units, NOT 1-unit.
// Scene center ~(-1.3, 4.6, -11); floor at y~0. Camera lives in tens of units and
// always aims near the room center. Act1 establish -> Act2 screen-readable -> Act3 handoff -> Act4 parked.
export const KEYFRAMES: Keyframe[] = [
  // The glowing "BEN NUDELMAN" terminal is only visible through a narrow sightline at the
  // establishing angle, so the camera PULLS BACK along that view axis: the cozy room (and the
  // terminal) stays centered while gracefully receding, then hands off to the portfolio text.
  // PURE ON-AXIS DOLLY back along the establishing view ray (dir ≈ [0.565,0.209,0.784]).
  // lookAt is held EXACTLY constant so the terminal stays centered and its narrow sightline
  // stays open the whole time — the room gracefully recedes, then content scrolls over.
  { offset: 0.0,  position: [16, 11, 14],       lookAt: [-1.3, 4.6, -10] },
  { offset: 0.30, position: [19.4, 12.3, 18.7], lookAt: [-1.3, 4.6, -10] },
  { offset: 0.50, position: [22.8, 13.5, 23.4], lookAt: [-1.3, 4.6, -10] },
  { offset: 1.0,  position: [26.2, 14.8, 28.1], lookAt: [-1.3, 4.6, -10] }
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
