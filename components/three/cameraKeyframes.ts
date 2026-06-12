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
  // FLY INTO THE SCREEN. Desk recentered ~6u at origin; CRT face at (-0.12, 3.02, -1.29) facing +z.
  // establish (slight arc) -> fly in -> push into the screen until it fills the viewport (crossfade at ~0.82).
  // Fly-in completes by offset ~0.30 (crossfade fires there); 0.30→1.0 is the portfolio scroll.
  { offset: 0.0,  position: [2.6, 3.5, 8.6],      lookAt: [0, 2.1, -1.2] },       // establish, arced
  { offset: 0.06, position: [0.2, 3.3, 7.8],      lookAt: [-0.12, 2.7, -1.29] },  // settle, center on desk
  { offset: 0.16, position: [-0.12, 3.12, 3.2],   lookAt: [-0.12, 3.02, -1.29] }, // approach monitor
  { offset: 0.24, position: [-0.12, 3.04, 0.4],   lookAt: [-0.12, 3.02, -1.29] }, // push — screen ~fills
  { offset: 0.30, position: [-0.12, 3.02, -0.55], lookAt: [-0.12, 3.02, -1.29] }, // into the screen (fills)
  { offset: 1.0,  position: [-0.12, 3.02, -0.72], lookAt: [-0.12, 3.02, -1.29] }  // hold (handed off)
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
