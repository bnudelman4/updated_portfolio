'use client'
import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import * as THREE from 'three'
import { poseAtOffset, heroProgress } from './cameraKeyframes'
import { screenTarget } from './sceneState'

// Map a screen-local point (units = screen heights; +z = screen normal) to world space.
function toWorld(local: [number, number, number], out: THREE.Vector3): THREE.Vector3 {
  const t = screenTarget.current!
  out.copy(t.center)
  out.addScaledVector(t.right, local[0] * t.height)
  out.addScaledVector(t.up, local[1] * t.height)
  out.addScaledVector(t.normal, local[2] * t.height)
  return out
}

export default function CameraRig() {
  const scroll = useScroll()
  const { camera } = useThree()
  const wantPos = useRef(new THREE.Vector3())
  const wantLook = useRef(new THREE.Vector3())
  const look = useRef(new THREE.Vector3())
  const ready = useRef(false)

  useFrame((_, dt) => {
    if (!screenTarget.current) return
    const { position, lookAt } = poseAtOffset(heroProgress(scroll.offset))
    toWorld(position, wantPos.current)
    toWorld(lookAt, wantLook.current)

    if (!ready.current) {
      camera.position.copy(wantPos.current)
      look.current.copy(wantLook.current)
      ready.current = true
    } else {
      const k = 1 - Math.pow(0.0015, dt) // frame-rate-independent damping
      camera.position.lerp(wantPos.current, k)
      look.current.lerp(wantLook.current, k)
    }
    camera.lookAt(look.current)
  })
  return null
}
