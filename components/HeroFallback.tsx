export default function HeroFallback() {
  return (
    <section id="hero" className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,#15132b,transparent_70%)]" />
      <img src="/hero-fallback.jpg" alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover opacity-60" />
      <div className="relative z-10 text-center px-6">
        <h1 className="font-display text-4xl md:text-6xl tracking-tight text-white">Ben Nudelman</h1>
        <p className="mt-3 text-white/60">CS @ Cornell · builder of apps with real purpose</p>
      </div>
      <div className="absolute inset-x-0 bottom-8 z-10 text-center text-white/40 text-xs tracking-widest">SCROLL</div>
    </section>
  )
}
