'use client'
import { Html } from '@react-three/drei'

export default function ScreenContent() {
  return (
    <Html
      transform
      occlude
      // Mounted on the back terminal where it reads cleanly in the wide establishing framing.
      position={[-1.3, 5.0, -10.4]}
      rotation={[0, 0, 0]}
      scale={0.6}
      distanceFactor={8}
      style={{ pointerEvents: 'none' }}
    >
      <div
        style={{
          width: '320px',
          height: '230px',
          background: '#04130a',
          color: '#7CFFB0',
          fontFamily: 'monospace',
          fontSize: '13px',
          padding: '16px',
          borderRadius: '4px',
          boxShadow: 'inset 0 0 40px #0f5',
          overflow: 'hidden',
          lineHeight: 1.5,
        }}
      >
        <div>&gt; booting portfolio.os ...</div>
        <div>&gt; user: Ben Nudelman</div>
        <div>&gt; role: CS @ Cornell</div>
        <div>&gt; stack: full-stack · mobile · embedded</div>
        <div style={{ marginTop: 10, fontSize: 18, color: '#defce9' }}>
          BEN NUDELMAN<span className="crt-caret">_</span>
        </div>
        <style>{`@keyframes blink{50%{opacity:0}} .crt-caret{animation:blink 1s step-end infinite}`}</style>
      </div>
    </Html>
  )
}
