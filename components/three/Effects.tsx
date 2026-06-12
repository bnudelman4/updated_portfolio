'use client'
import { EffectComposer, Bloom, DepthOfField, Vignette, Noise, ChromaticAberration } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { Vector2 } from 'three'

export default function Effects() {
  return (
    <EffectComposer multisampling={0}>
      <DepthOfField focusDistance={0.04} focalLength={0.12} bokehScale={2} />
      <Bloom intensity={0.9} luminanceThreshold={0.55} luminanceSmoothing={0.35} mipmapBlur />
      <ChromaticAberration blendFunction={BlendFunction.NORMAL} offset={new Vector2(0.0005, 0.0005)} />
      <Vignette eskil={false} offset={0.3} darkness={0.6} />
      <Noise premultiply blendFunction={BlendFunction.SCREEN} opacity={0.12} />
    </EffectComposer>
  )
}
