'use client'
import dynamic from 'next/dynamic'
import CanvasErrorBoundary from './three/CanvasErrorBoundary'

const ParticleField = dynamic(() => import('./three/ParticleField'), {
  ssr: false,
  loading: () => null,
})

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative h-screen overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,#15132b,transparent_70%)]" />
      <CanvasErrorBoundary
        fallback={
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-display text-[28vw] md:text-[20vw] font-bold text-white/10 select-none">
              BN
            </span>
          </div>
        }
      >
        <ParticleField text="BN" />
      </CanvasErrorBoundary>
      <noscript>
        <div className="absolute inset-0 flex items-center justify-center text-7xl font-display font-bold">
          BN
        </div>
      </noscript>
      <div className="absolute inset-x-0 bottom-[20%] z-10 text-center pointer-events-none px-6">
        <p className="font-display text-3xl md:text-5xl tracking-tight text-white">
          Ben Nudelman
        </p>
        <p className="mt-3 text-sm md:text-base text-white/50">
          CS @ Cornell · builder of apps with real purpose
        </p>
      </div>
      <div className="absolute inset-x-0 bottom-8 z-10 text-center text-white/40 text-xs tracking-widest animate-bounce">
        SCROLL
      </div>
    </section>
  )
}
