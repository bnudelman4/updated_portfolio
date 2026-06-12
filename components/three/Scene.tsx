'use client'
import { useMemo } from 'react'
import * as THREE from 'three'
import {
  useGLTF,
  Environment,
  SoftShadows,
  MeshReflectorMaterial,
} from '@react-three/drei'
import { DRACO_DECODER_PATH } from './dracoConfig'

useGLTF.preload('/models/desk.glb', DRACO_DECODER_PATH)

// Target world size the (recentered) desk should fit within.
const TARGET = 6
const WALL = '#202028'
const FLOOR = '#0d0d13'

export default function Scene() {
  const { scene } = useGLTF('/models/desk.glb', DRACO_DECODER_PATH)

  // Recenter on X/Z, sit the base on y=0, scale to a sane size, and enable shadows.
  const { scale, position } = useMemo(() => {
    scene.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) {
        o.castShadow = true
        o.receiveShadow = true
      }
    })
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
      <SoftShadows size={28} samples={12} focus={0.85} />

      <group scale={scale} position={position}>
        <primitive object={scene} />
      </group>

      {/* Blank studio enclosure: reflective floor + two back walls (a corner). */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[80, 80]} />
        <MeshReflectorMaterial
          resolution={1024}
          blur={[400, 120]}
          mixBlur={1.2}
          mixStrength={12}
          depthScale={1}
          minDepthThreshold={0.85}
          color={FLOOR}
          metalness={0.5}
          roughness={0.85}
        />
      </mesh>
      {/* back wall (−Z) */}
      <mesh position={[0, 14, -11]} receiveShadow>
        <planeGeometry args={[90, 40]} />
        <meshStandardMaterial color={WALL} roughness={1} />
      </mesh>
      {/* left wall (−X) */}
      <mesh position={[-13, 14, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[90, 40]} />
        <meshStandardMaterial color={WALL} roughness={1} />
      </mesh>
      {/* soft fill aimed at the walls so the corner reads */}
      <pointLight position={[-4, 8, 4]} intensity={1.4} color="#cdd6ff" distance={40} decay={1.2} />

      {/* Lighting — soft studio key + cool fill + warm rim + CRT glow. */}
      <ambientLight intensity={0.35} />
      <directionalLight
        position={[5, 9, 7]}
        intensity={2.2}
        color="#fff4e2"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0004}
      >
        <orthographicCamera attach="shadow-camera" args={[-10, 10, 10, -10, 0.1, 40]} />
      </directionalLight>
      <directionalLight position={[-7, 5, -2]} intensity={0.6} color="#8fb6ff" />
      <pointLight position={[2.5, 4, 5]} intensity={1.2} color="#ffd9a8" distance={20} decay={1.5} />
      {/* CRT glow */}
      <pointLight position={[0, 3.1, -0.6]} intensity={2.2} color="#7CFFB0" distance={4} decay={1.8} />

      {/* HDRI for soft reflections only — visible background stays the studio. */}
      <Environment preset="studio" background={false} environmentIntensity={0.45} />
    </group>
  )
}
