'use client'
import dynamic from 'next/dynamic'
import { useDetectGPU } from '@react-three/drei'
import Nav from '@/components/Nav'
import ProjectsProvider from '@/components/ProjectsProvider'
import HeroFallback from '@/components/HeroFallback'
import About from '@/components/About'
import Work from '@/components/Work'
import Experience from '@/components/Experience'
import Skills from '@/components/Skills'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import { useSceneFallback } from '@/components/three/useSceneFallback'

const Experience3D = dynamic(() => import('@/components/three/Experience3D'), { ssr: false })

export default function Home() {
  const gpu = useDetectGPU()
  const fallback = useSceneFallback((gpu?.tier ?? 0) < 2)
  return (
    <ProjectsProvider>
      <Nav />
      {fallback ? (
        <main>
          <HeroFallback />
          <About />
          <Work />
          <Experience />
          <Skills />
          <Contact />
          <Footer />
        </main>
      ) : (
        <div className="h-screen w-screen">
          <Experience3D />
        </div>
      )}
    </ProjectsProvider>
  )
}
