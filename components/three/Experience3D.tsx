'use client'
import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { ScrollControls, Scroll } from '@react-three/drei'
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

export default function Experience3D() {
  return (
    <Canvas
      dpr={[1, 1.75]}
      gl={{ antialias: true, toneMappingExposure: 1.35 }}
      camera={{ position: [16, 11, 14], fov: 42 }}
      shadows
    >
      <color attach="background" args={['#0a0810']} />
      <fog attach="fog" args={['#0a0810', 16, 60]} />
      <Suspense fallback={null}>
        <ScrollControls pages={7} damping={0.25}>
          <Scene />
          <ScreenContent />
          <CameraRig />
          <Scroll html style={{ width: '100%' }}>
            {/* spacer reserves scroll room for the 3D camera acts before sections appear */}
            <div style={{ height: '320vh' }} />
            <div className="bg-bg">
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
