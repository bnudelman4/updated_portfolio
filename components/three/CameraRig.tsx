'use client'
import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import * as THREE from 'three'
import { poseAtOffset } from './cameraKeyframes'

export default function CameraRig() {
  const scroll = useScroll()
  const { camera } = useThree()
  const look = useRef(new THREE.Vector3(0, 2.4, -2)) // start aimed at the desk
  const targetPos = useRef(new THREE.Vector3())
  const targetLook = useRef(new THREE.Vector3())
  useFrame((_, dt) => {
    const { position, lookAt } = poseAtOffset(scroll.offset)
    const k = Math.min(dt * 3, 1) // damping
    targetPos.current.set(position[0], position[1], position[2])
    targetLook.current.set(lookAt[0], lookAt[1], lookAt[2])
    camera.position.lerp(targetPos.current, k)
    look.current.lerp(targetLook.current, k)
    camera.lookAt(look.current)
  })
  return null
}
