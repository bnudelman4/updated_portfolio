'use client'
import { Suspense, useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ScrollControls, Scroll, useScroll, Loader } from '@react-three/drei'
import * as THREE from 'three'
import Lenis from 'lenis'
import { lenisRef } from '@/lib/lenisRef'
import Scene from './Scene'
import CameraRig from './CameraRig'
import NameReveal from './NameReveal'
import Effects from './Effects'
import { HANDOFF_START, HANDOFF_END, BLACK_START, BLACK_FULL, HERO_FRACTION, heroProgress } from './cameraKeyframes'
import About from '@/components/About'
import Work from '@/components/Work'
import Experience from '@/components/Experience'
import Skills from '@/components/Skills'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'

// Total scroll length in viewport-heights. The hero uses the first HERO_FRACTION of it
// (see the spacer below); the rest is portfolio room — bump this if content is cut off.
const PAGES = 26

const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

// Buttery scroll: drive the drei ScrollControls element with Lenis. drei reads
// el.scrollTop, so Lenis animating it feeds smooth offsets to the camera timeline.
function LenisController() {
  const scroll = useScroll()
  useEffect(() => {
    const lenis = new Lenis({
      wrapper: scroll.el,
      content: scroll.fill,
      lerp: 0.1,
      smoothWheel: true,
      syncTouch: true,
    })
    lenisRef.current = lenis
    let raf = 0
    const loop = (t: number) => {
      lenis.raf(t)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [scroll])
  return null
}

// Fade the visible background from the dark void to pure black as the camera passes
// through the screen, so the name reveal plays in true black.
function Backdrop() {
  const scroll = useScroll()
  const { scene } = useThree()
  const void0 = useMemo(() => new THREE.Color('#05060a'), [])
  const black = useMemo(() => new THREE.Color('#000000'), [])
  useFrame(() => {
    if (!(scene.background instanceof THREE.Color)) return
    const t = smoothstep(BLACK_START, BLACK_FULL, heroProgress(scroll.offset))
    scene.background.copy(void0).lerp(black, t)
  })
  return null
}

// Crossfade the WebGL canvas out and the DOM intro in once the name reveal completes.
function CrossfadeController() {
  const scroll = useScroll()
  const { gl } = useThree()
  const last = useRef(-1)
  useFrame(() => {
    const a = smoothstep(HANDOFF_START, HANDOFF_END, heroProgress(scroll.offset))
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
    <>
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: false, powerPreference: 'high-performance' }}
        camera={{ position: [4, 3, 12], fov: 38, near: 0.01, far: 100 }}
        shadows="soft"
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping
          gl.toneMappingExposure = 0.88
          gl.outputColorSpace = THREE.SRGBColorSpace
        }}
      >
        {/* Dark void — the visible background; HDRI is reflections-only. */}
        <color attach="background" args={['#05060a']} />
        <Suspense fallback={null}>
          <ScrollControls pages={PAGES} damping={0.08}>
            <LenisController />
            <Scene />
            <NameReveal />
            <CameraRig />
            <Backdrop />
            <CrossfadeController />
            <Scroll html style={{ width: '100%' }}>
              {/* reserves scroll room for the whole hero; portfolio (any length) flows after */}
              <div style={{ height: `${HERO_FRACTION * PAGES * 100}vh` }} />
              {/* intro fades in after the name completes; boot-black bg keeps the handoff seamless */}
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
      {/* Boot-styled loading screen while the model streams in. */}
      <Loader
        containerStyles={{ background: '#04130a' }}
        innerStyles={{ background: 'rgba(124,255,176,0.15)', width: '240px', height: '4px' }}
        barStyles={{ background: '#7CFFB0', height: '4px' }}
        dataStyles={{ color: '#7CFFB0', fontFamily: 'monospace', fontSize: '13px', letterSpacing: '1px' }}
        dataInterpolation={(p) => `> loading portfolio.os … ${p.toFixed(0)}%`}
      />
    </>
  )
}
