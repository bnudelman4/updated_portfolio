'use client'
import dynamic from 'next/dynamic'

const ParticleField = dynamic(() => import('./three/ParticleField'), {
  ssr: false,
  loading: () => null,
})

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_55%,#15132b,transparent_70%)]" />
      <ParticleField text="BN" />
      <noscript>
        <div className="text-7xl font-display font-bold">BN</div>
      </noscript>
      <div className="relative z-10 text-center pointer-events-none">
        <p className="font-display text-2xl md:text-3xl tracking-tight text-white/80">
          Ben Nudelman
        </p>
        <p className="mt-2 text-sm text-white/50">
          CS @ Cornell · builder of apps with real purpose
        </p>
      </div>
      <div className="absolute bottom-8 text-white/40 text-xs tracking-widest animate-bounce">
        SCROLL
      </div>
    </section>
  )
}
