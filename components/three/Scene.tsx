'use client'
import { useGLTF, Environment, ContactShadows } from '@react-three/drei'
import { DRACO_DECODER_PATH } from './dracoConfig'

useGLTF.preload('/models/room.glb', DRACO_DECODER_PATH)

export default function Scene() {
  const { scene } = useGLTF('/models/room.glb', DRACO_DECODER_PATH)
  return (
    <group>
      <primitive object={scene} />
      {/* First-pass lighting for a room-scale (~30u) model; tuned later.
          Warm key + cool fill + a CRT-glow point light near the screens. */}
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[8, 16, 10]}
        intensity={1.3}
        color="#ffd9a0"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[-1.3, 5.5, -9]} intensity={2.2} color="#86b8ff" distance={14} />
      <pointLight position={[6, 7, -4]} intensity={1.2} color="#ffb37e" distance={18} />
      <Environment preset="apartment" />
      <ContactShadows position={[0, 0.02, -8]} opacity={0.45} scale={50} blur={2.6} far={20} />
    </group>
  )
}
