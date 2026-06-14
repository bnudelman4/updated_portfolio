import * as THREE from 'three'

// Runtime-resolved monitor screen, written by Scene once the model loads and read by
// CameraRig each frame. A module singleton (rather than context) keeps the per-frame
// read allocation-free; both consumers live under the same Canvas.
export interface ScreenTarget {
  center: THREE.Vector3 // world center of the screen
  normal: THREE.Vector3 // outward (toward viewer), unit
  up: THREE.Vector3     // unit
  right: THREE.Vector3  // unit
  height: number        // world height of the screen
  width: number         // world width of the screen
}

export const screenTarget: { current: ScreenTarget | null } = { current: null }
