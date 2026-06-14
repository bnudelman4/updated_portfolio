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
import { useSceneMode } from '@/components/three/useSceneFallback'

const Experience3D = dynamic(() => import('@/components/three/Experience3D'), { ssr: false })

export default function Home() {
  const gpu = useDetectGPU()
  const mode = useSceneMode(gpu?.tier)

  // While deciding (GPU still being detected), show a neutral dark cover that matches the
  // 3D loader — so the page never flashes the fallback hero before the desk scene.
  if (mode === 'measuring') {
    return (
      <ProjectsProvider>
        <Nav />
        <div className="fixed inset-0 grid place-items-center bg-boot-bg">
          <p className="font-mono text-sm tracking-widest text-boot-green">&gt; loading portfolio.os …</p>
        </div>
      </ProjectsProvider>
    )
  }

  return (
    <ProjectsProvider>
      <Nav />
      {mode === 'fallback' ? (
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
