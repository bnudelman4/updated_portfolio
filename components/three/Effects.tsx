'use client'
import { EffectComposer, Bloom, DepthOfField, Vignette, Noise, ChromaticAberration } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { Vector2 } from 'three'

export default function Effects() {
  return (
    <EffectComposer>
      <DepthOfField focusDistance={0.015} focalLength={0.05} bokehScale={3} />
      <Bloom intensity={0.7} luminanceThreshold={0.6} luminanceSmoothing={0.3} mipmapBlur />
      <ChromaticAberration blendFunction={BlendFunction.NORMAL} offset={new Vector2(0.0006, 0.0006)} />
      <Vignette eskil={false} offset={0.25} darkness={0.7} />
      <Noise premultiply blendFunction={BlendFunction.SCREEN} opacity={0.18} />
    </EffectComposer>
  )
}
