export type Vec3 = [number, number, number]
export interface Keyframe { offset: number; position: Vec3; lookAt: Vec3 }

// The hero (fly-in + name reveal + crossfade) runs in its OWN normalized progress space
// [0,1], decoupled from the page's total scroll. heroProgress() maps the raw drei scroll
// offset into this space: the hero occupies just the first HERO_FRACTION of total scroll,
// and everything after is the normal-flow DOM portfolio (which can be any length).
export const HERO_FRACTION = 0.37
export const heroProgress = (offset: number) => Math.min(1, Math.max(0, offset / HERO_FRACTION))

// Camera timeline, expressed in SCREEN-LOCAL space so it works for any model:
//   origin = monitor screen center
//   +z     = screen outward normal (toward the viewer)
//   +y     = world up, +x = screen right
//   1 unit = one screen height
// CameraRig resolves the real monitor at runtime (sceneState.screenTarget) and maps
// these local poses into world space. Offsets here are in HERO progress space.
//
// Flow:
//   establish high/left → swivel down/right to center → push into the monitor until the
//   screen fills → pass THROUGH into a black void → the 3D name reveal plays → crossfade.
export const KEYFRAMES: Keyframe[] = [
  { offset: 0.0,   position: [-7.0, 1.9, 14.5], lookAt: [0, -0.85, 0] }, // start: far LEFT, zoomed out, model centered (not at the bottom)
  { offset: 0.138, position: [-5.2, 1.5, 11.5], lookAt: [0, -0.5, 0] },  // pan RIGHT, ease toward screen center
  { offset: 0.259, position: [-3.3, 1.0, 8.0],  lookAt: [0, 0.0, 0] },  // continue right + push in
  { offset: 0.345, position: [-1.5, 0.6, 5.0],  lookAt: [0, 0, 0] },    // nearing center
  { offset: 0.397, position: [ 0.0, 0.15, 2.0], lookAt: [0, 0, 0] },    // centered on the screen
  { offset: 0.466, position: [ 0.0, 0.0, -1.4], lookAt: [0, 0, -10] },  // through the screen into the black
  { offset: 0.810, position: [ 0.0, 0.0, -3.0], lookAt: [0, 0, -10] },  // settle, framing the name
  { offset: 1.0,   position: [ 0.0, 0.0, -3.2], lookAt: [0, 0, -10] },  // hold (handed off to the DOM intro)
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

// Phase boundaries (HERO progress space). Screen fills near BLACK_START; the void goes
// fully black by BLACK_FULL, when the office is hidden and the name reveal owns the frame.
export const BLACK_START = 0.379
export const BLACK_FULL = 0.466
export const OFFICE_HIDE = 0.466

// The 3D name "BEN NUDELMAN" drops in (scrubbed by scroll) across this range.
export const NAME_START = 0.483
export const NAME_END = 0.810

// Where the local 3D name sits along the inward (-z) axis, in screen heights.
export const NAME_DEPTH = 10

// Crossfade WebGL → DOM intro across this range (after the name completes).
export const HANDOFF_START = 0.897
export const HANDOFF_END = 1.0
