'use client'
import { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { sampleText } from './useTextParticles'

function Points({ text }: { text: string }) {
  const ref = useRef<THREE.Points>(null)
  const targets = useMemo(() => sampleText(text, 1400), [text])
  const positions = useMemo(() => {
    // start scattered, then lerp toward the target shape
    const a = new Float32Array(targets.length)
    for (let i = 0; i < a.length; i += 3) {
      a[i] = ((i % 7) - 3) * 2
      a[i + 1] = (((i * 3) % 7) - 3) * 2
      a[i + 2] = (((i * 5) % 7) - 3) * 2
    }
    return a
  }, [targets])
  const { pointer } = useThree()
  useFrame((_, dt) => {
    const geo = ref.current?.geometry
    if (!geo) return
    const pos = geo.attributes.position as THREE.BufferAttribute
    const arr = pos.array as Float32Array
    const k = Math.min(dt * 2, 1)
    for (let i = 0; i < arr.length; i += 3) {
      arr[i] += (targets[i] - arr[i]) * k
      arr[i + 1] += (targets[i + 1] - arr[i + 1]) * k
      arr[i + 2] += (targets[i + 2] - arr[i + 2]) * k
    }
    pos.needsUpdate = true
    if (ref.current) ref.current.rotation.y = pointer.x * 0.25
  })
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        sizeAttenuation
        color="#9fd9ff"
        transparent
        opacity={0.9}
      />
    </points>
  )
}

export default function ParticleField({ text = 'BN' }: { text?: string }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 9], fov: 50 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <Points text={text} />
    </Canvas>
  )
}
