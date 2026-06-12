'use client'
import { useMemo } from 'react'
import * as THREE from 'three'
import { useGLTF, Environment, ContactShadows } from '@react-three/drei'
import { DRACO_DECODER_PATH } from './dracoConfig'

useGLTF.preload('/models/desk.glb', DRACO_DECODER_PATH)

// Target world size the (recentered) desk should fit within.
const TARGET = 6

export default function Scene() {
  const { scene } = useGLTF('/models/desk.glb', DRACO_DECODER_PATH)

  // Recenter on X/Z, sit the base on y=0, and scale to a sane size.
  const { scale, position } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene)
    const size = new THREE.Vector3()
    const center = new THREE.Vector3()
    box.getSize(size)
    box.getCenter(center)
    const s = TARGET / Math.max(size.x, size.y, size.z)
    return {
      scale: s,
      position: [-center.x * s, -box.min.y * s, -center.z * s] as [number, number, number],
    }
  }, [scene])

  return (
    <group>
      <group scale={scale} position={position}>
        <primitive object={scene} />
      </group>

      {/* Gentle lighting for a flat-shaded low-poly desk floating in a void. */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 8, 6]} intensity={1.4} color="#fff2dc" castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
      <directionalLight position={[-6, 4, -4]} intensity={0.5} color="#86b8ff" />
      {/* CRT glow */}
      <pointLight position={[0, 2.2, 1.6]} intensity={3} color="#7CFFB0" distance={6} decay={1.6} />
      {/* HDRI for soft reflections only — background stays a dark void. */}
      <Environment preset="city" background={false} environmentIntensity={0.5} />
      <ContactShadows position={[0, 0.001, 0]} opacity={0.55} scale={14} blur={2.6} far={6} />
    </group>
  )
}
