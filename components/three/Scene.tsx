'use client'
import { useGLTF, Environment, ContactShadows } from '@react-three/drei'
import { DRACO_DECODER_PATH } from './dracoConfig'

useGLTF.preload('/models/room.glb', DRACO_DECODER_PATH)

export default function Scene() {
  const { scene } = useGLTF('/models/room.glb', DRACO_DECODER_PATH)
  return (
    <group>
      <primitive object={scene} />
      {/* Warm, cozy room lighting for the flat-material model (henry-heffernan vibe). */}
      <hemisphereLight args={['#ffe9c8', '#202028', 0.9]} />
      <ambientLight intensity={0.55} />
      <directionalLight
        position={[8, 18, 12]}
        intensity={2.1}
        color="#ffd9a0"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      {/* CRT glow + warm desk fill */}
      <pointLight position={[-1.3, 5.5, -9]} intensity={6} color="#9fd0ff" distance={16} decay={1.4} />
      <pointLight position={[6, 6, -4]} intensity={5} color="#ffb37e" distance={20} decay={1.4} />
      <pointLight position={[-8, 7, -14]} intensity={4} color="#ffcaa0" distance={22} decay={1.4} />
      <Environment preset="apartment" environmentIntensity={0.7} />
      <ContactShadows position={[0, 0.02, -8]} opacity={0.5} scale={55} blur={2.8} far={22} />
    </group>
  )
}
