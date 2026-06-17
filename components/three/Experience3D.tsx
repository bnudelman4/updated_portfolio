'use client'
import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ScrollControls, Scroll, useScroll, Loader } from '@react-three/drei'
import * as THREE from 'three'
import Lenis from 'lenis'
import { lenisRef } from '@/lib/lenisRef'
import Scene from './Scene'
import CameraRig from './CameraRig'
import NameReveal from './NameReveal'
import Effects from './Effects'
import { HANDOFF_START, HANDOFF_END, BLACK_START, BLACK_FULL, heroProgress, setHeroFraction } from './cameraKeyframes'
import About from '@/components/About'
import Work from '@/components/Work'
import Experience from '@/components/Experience'
import Skills from '@/components/Skills'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'

// Total scroll length in viewport-heights. drei's scroll length is fixed at `pages` regardless
// of content height, so the portfolio must fit in (1-fraction)*pages screens or its tail
// (Contact/Footer) gets clipped, while too much leaves dead scroll past the bottom. Desktop
// keeps the original tuned 26/0.37; mobile content height varies (text wrap, dynamic type), so
// it's MEASURED at runtime (see below) and pages sized exactly to it. Hero stays ≈ 9.6 screens.
const DESKTOP = { pages: 26, fraction: 0.37 }
const HERO_SCREENS = 9.6
const MOBILE_INIT = { pages: 28, fraction: HERO_SCREENS / 28 }
const isMobileViewport = () =>
  typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches

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

// Keep the desk fully framed on any aspect. A PerspectiveCamera holds VERTICAL fov fixed and
// narrows HORIZONTAL fov as the viewport gets taller — so on a portrait phone the wide desk is
// cropped at the sides at the start. We instead hold the HORIZONTAL fov constant (matching the
// landscape framing) by widening vertical fov on narrow screens, which zooms out so the whole
// desk is visible for the fly-in. Landscape (>=16:9) keeps the original 38° vertical fov.
function AdaptiveCamera() {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera
  const size = useThree((s) => s.size)
  useEffect(() => {
    const REF_ASPECT = 16 / 9
    const REF_VFOV = 38
    const baseH = 2 * Math.atan(Math.tan(THREE.MathUtils.degToRad(REF_VFOV) / 2) * REF_ASPECT)
    const aspect = size.width / Math.max(1, size.height)
    const vFov = THREE.MathUtils.radToDeg(2 * Math.atan(Math.tan(baseH / 2) / aspect))
    camera.fov = Math.min(112, Math.max(REF_VFOV, vFov))
    camera.updateProjectionMatrix()
  }, [camera, size])
  return null
}

// Pin the Work stage in lockstep with the scroll. drei moves the <Scroll html> content via a
// transform in its OWN useFrame; reading layout on the Lenis scroll event (as a DOM-side rAF/
// listener would) sees last frame's transform, so the JS-pinned panel lags a frame and shakes.
// Running the pin here — a useFrame registered AFTER drei's <Scroll html> — reads the panel's
// freshly-transformed position in the same frame, so the counter-translate is always exact.
function WorkPin() {
  // subscribe to scroll so this useFrame re-runs while scrolling (delta-driven invalidation)
  useScroll()
  useFrame(() => {
    const sec = document.getElementById('work')
    const pan = document.getElementById('work-pin')
    if (!sec || !pan) return
    const range = Math.max(1, sec.offsetHeight - window.innerHeight)
    const pinned = Math.min(range, Math.max(0, -sec.getBoundingClientRect().top))
    pan.style.transform = `translateY(${pinned}px)`
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
  // Client-only (ssr:false). Desktop is untouched; mobile gets a lighter render + measured room.
  const [mobile] = useState(isMobileViewport)
  const [{ pages, fraction }, setCfg] = useState(() => (mobile ? MOBILE_INIT : DESKTOP))

  // Mobile: size the scroll room to the ACTUAL portfolio height so the tail (Contact/Footer)
  // is never clipped and there's no dead scroll past the bottom. Re-measures on content/size
  // changes (fonts loading, rotation) via ResizeObserver. Desktop keeps its tuned constants.
  useEffect(() => {
    if (!mobile) return
    let ro: ResizeObserver | null = null
    let raf = 0
    const measure = () => {
      const el = document.getElementById('portfolio')
      if (!el) return
      const screens = el.scrollHeight / window.innerHeight
      const pages = Math.max(12, Math.ceil(HERO_SCREENS + screens + 0.3))
      setCfg((prev) => (prev.pages === pages ? prev : { pages, fraction: HERO_SCREENS / pages }))
    }
    const attach = () => {
      const el = document.getElementById('portfolio')
      if (!el) { raf = requestAnimationFrame(attach); return }
      ro = new ResizeObserver(measure)
      ro.observe(el)
      measure()
    }
    raf = requestAnimationFrame(attach)
    window.addEventListener('resize', measure)
    return () => { cancelAnimationFrame(raf); ro?.disconnect(); window.removeEventListener('resize', measure) }
  }, [mobile])

  setHeroFraction(fraction) // module state read by heroProgress() each frame; idempotent

  return (
    <>
      <Canvas
        // Mobile: cap pixel ratio and drop the soft-shadow map pass — both are the heaviest
        // per-frame costs and the main source of mobile lag. Desktop keeps full quality.
        dpr={mobile ? 1.5 : [1, 2]}
        gl={{ antialias: false, powerPreference: 'high-performance' }}
        camera={{ position: [4, 3, 12], fov: 38, near: 0.01, far: 100 }}
        shadows={mobile ? false : 'soft'}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping
          gl.toneMappingExposure = 0.88
          gl.outputColorSpace = THREE.SRGBColorSpace
        }}
      >
        {/* Dark void — the visible background; HDRI is reflections-only. */}
        <color attach="background" args={['#05060a']} />
        <AdaptiveCamera />
        <Suspense fallback={null}>
          <ScrollControls pages={pages} damping={0.08}>
            <LenisController />
            <Scene />
            <NameReveal />
            <CameraRig />
            <Backdrop />
            <CrossfadeController />
            <Scroll html style={{ width: '100%' }}>
              {/* reserves scroll room for the whole hero; portfolio (any length) flows after */}
              <div style={{ height: `${fraction * pages * 100}vh` }} />
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
            {/* registered after <Scroll html> so its useFrame runs after drei's content transform */}
            <WorkPin />
          </ScrollControls>
          <Effects mobile={mobile} />
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
