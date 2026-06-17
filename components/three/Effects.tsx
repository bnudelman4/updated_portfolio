'use client'
import { EffectComposer, Bloom, SMAA, Vignette } from '@react-three/postprocessing'

// Lean pipeline: SMAA (MSAA off to avoid conflict), Bloom for the glowing boot screen,
// a soft vignette to seat the setup in the void. DOF/chromatic/noise intentionally cut —
// they blur the screen during the push-in and are the first things to drop for fps.
// Mobile drops the expensive Bloom (mipmap blur) + Vignette, keeping only SMAA, to cut lag.
export default function Effects({ mobile = false }: { mobile?: boolean }) {
  if (mobile) {
    return (
      <EffectComposer multisampling={0}>
        <SMAA />
      </EffectComposer>
    )
  }
  return (
    <EffectComposer multisampling={0}>
      <SMAA />
      <Bloom intensity={0.7} luminanceThreshold={0.6} luminanceSmoothing={0.3} mipmapBlur />
      <Vignette eskil={false} offset={0.32} darkness={0.62} />
    </EffectComposer>
  )
}
