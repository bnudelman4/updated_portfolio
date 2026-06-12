'use client'
import { Suspense, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ScrollControls, Scroll, useScroll } from '@react-three/drei'
import Scene from './Scene'
import CameraRig from './CameraRig'
import ScreenContent from './ScreenContent'
import Effects from './Effects'
import About from '@/components/About'
import Work from '@/components/Work'
import Experience from '@/components/Experience'
import Skills from '@/components/Skills'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'

const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

// Crossfade the WebGL canvas out and the DOM portfolio in right as the camera
// pushes into the CRT screen (~offset 0.25–0.32), so it reads as entering the screen.
function CrossfadeController() {
  const scroll = useScroll()
  const { gl } = useThree()
  const last = useRef(-1)
  useFrame(() => {
    const a = smoothstep(0.25, 0.32, scroll.offset)
    if (a === last.current) return
    last.current = a
    gl.domElement.style.opacity = String(1 - a)
    const el = document.getElementById('portfolio')
    if (el) {
      el.style.opacity = String(a)
      el.style.pointerEvents = a > 0.5 ? 'auto' : 'none'
    }
  })
  return null
}

export default function Experience3D() {
  return (
    <Canvas
      dpr={[1, 2]}
      gl={{ antialias: true, toneMappingExposure: 1.05 }}
      camera={{ position: [-8, 6.5, 18], fov: 40 }}
      shadows="soft"
    >
      <color attach="background" args={['#070710']} />
      <Suspense fallback={null}>
        <ScrollControls pages={7} damping={0.25}>
          <Scene />
          <ScreenContent />
          <CameraRig />
          <CrossfadeController />
          <Scroll html style={{ width: '100%' }}>
            {/* spacer reserves scroll room for the fly-in (≈ first 30% of scroll) */}
            <div style={{ height: '210vh' }} />
            {/* portfolio fades in at screen-fill; bg matches the CRT so the handoff is seamless */}
            <div id="portfolio" className="bg-bg" style={{ opacity: 0 }}>
              <About />
              <Work />
              <Experience />
              <Skills />
              <Contact />
              <Footer />
            </div>
          </Scroll>
        </ScrollControls>
        <Effects />
      </Suspense>
    </Canvas>
  )
}
