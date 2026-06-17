'use client'
import { Suspense, useEffect, useMemo, useRef, useState, type MutableRefObject } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import type { Project } from '@/lib/types'
import { makeScreenTexture } from '@/lib/screenTexture'
import IMacGLB from './IMacGLB'
import PhoneModel from './PhoneModel'

const clamp = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x))
const BASE_SCALE = 1.12
const isMobileViewport = () =>
  typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches

function Rig({
  projects,
  phaseRef,
  reduced,
  onIndex,
}: {
  projects: Project[]
  phaseRef: MutableRefObject<number>
  reduced: boolean
  onIndex: (i: number) => void
}) {
  const group = useRef<THREE.Group>(null)
  const idxRef = useRef(0)
  const [idx, setIdx] = useState(0)

  // One screen texture per project; dispose on unmount.
  const textures = useMemo(() => projects.map((p) => makeScreenTexture(p)), [projects])
  useEffect(() => () => textures.forEach((t) => t.dispose()), [textures])

  const count = projects.length

  // No tumble: the model stays big + centered. The per-project "fade up" is done on the DOM
  // canvas wrapper (see Work.tsx). Here we just swap the screen texture, hold a large scale,
  // and add a gentle idle float + cursor parallax (matching the About photo).
  useFrame((state) => {
    const g = group.current
    if (!g) return
    const phase = clamp(phaseRef.current, 0, 1) * (count - 1)
    const i = clamp(Math.round(phase), 0, count - 1)
    if (i !== idxRef.current) {
      idxRef.current = i
      setIdx(i)
      onIndex(i)
    }
    g.scale.setScalar(BASE_SCALE)
    if (reduced) {
      g.rotation.set(0, 0, 0)
      g.position.set(0, 0, 0)
      return
    }
    g.position.y = Math.sin(state.clock.elapsedTime * 0.7) * 0.05
    g.rotation.y = state.pointer.x * 0.12
    g.rotation.x = -state.pointer.y * 0.06
    g.rotation.z = 0
  })

  const isPhone = projects[idx]?.device === 'phone'
  return (
    <group ref={group}>
      {isPhone ? <PhoneModel texture={textures[idx]} /> : <IMacGLB texture={textures[idx]} />}
    </group>
  )
}

export default function IMacStage({
  projects,
  phaseRef,
  reduced,
  onIndex,
}: {
  projects: Project[]
  phaseRef: MutableRefObject<number>
  reduced: boolean
  onIndex: (i: number) => void
}) {
  // Mobile: cap DPR and turn off MSAA to ease lag on the project model canvas. Desktop unchanged.
  const mobile = isMobileViewport()
  return (
    <Canvas dpr={mobile ? 1.5 : [1, 2]} camera={{ position: [0, 0.1, 6.4], fov: 32 }} gl={{ antialias: !mobile }}>
      <ambientLight intensity={0.45} />
      {/* dramatic key + rim */}
      <directionalLight position={[5, 6, 5]} intensity={2.6} color="#fff3e6" castShadow />
      <directionalLight position={[-6, 1, -2]} intensity={1.1} color="#7aa2ff" />
      <Suspense fallback={null}>
        <Rig projects={projects} phaseRef={phaseRef} reduced={reduced} onIndex={onIndex} />
        <ContactShadows position={[0, -2, 0]} opacity={0.45} scale={9} blur={2.6} far={4} />
        <Environment files="/hdri/lebombo_1k.hdr" environmentIntensity={0.5} />
      </Suspense>
    </Canvas>
  )
}
