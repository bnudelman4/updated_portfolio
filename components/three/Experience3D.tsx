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
    <Canvas dpr={[1, 1.75]} gl={{ antialias: true }} camera={{ position: [12, 9, 10], fov: 45 }} shadows>
      <color attach="background" args={['#06060A']} />
      <Suspense fallback={null}>
        <ScrollControls pages={7} damping={0.25}>
          <Scene />
          <ScreenContent />
          <CameraRig />
          <Scroll html style={{ width: '100%' }}>
            {/* spacer reserves scroll room for the 3D camera acts before sections appear */}
            <div style={{ height: '250vh' }} />
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
