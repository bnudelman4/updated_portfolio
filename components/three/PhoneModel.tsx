'use client'
import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { RoundedBox } from '@react-three/drei'

// Procedural phone (no GLB): a rounded aluminium body with a near-black rounded front and an
// emissive rounded screen plane carrying the project's app mockup. Built centered at the
// origin and facing +z so it slots into the same Rig as the iMac.
const BODY_W = 1.22
const BODY_H = 2.5
const DEPTH = 0.14
const ASPECT = BODY_W / BODY_H

// Rounded-rectangle Shape centered on the origin.
function roundedRectShape(w: number, h: number, r: number): THREE.Shape {
  const s = new THREE.Shape()
  const x = -w / 2, y = -h / 2
  const rad = Math.min(r, w / 2, h / 2)
  s.moveTo(x + rad, y)
  s.lineTo(x + w - rad, y)
  s.quadraticCurveTo(x + w, y, x + w, y + rad)
  s.lineTo(x + w, y + h - rad)
  s.quadraticCurveTo(x + w, y + h, x + w - rad, y + h)
  s.lineTo(x + rad, y + h)
  s.quadraticCurveTo(x, y + h, x, y + h - rad)
  s.lineTo(x, y + rad)
  s.quadraticCurveTo(x, y, x + rad, y)
  return s
}

// Rounded-rect geometry whose UVs are remapped to span the full texture (0..1).
function roundedRectGeometry(w: number, h: number, r: number): THREE.ShapeGeometry {
  const geo = new THREE.ShapeGeometry(roundedRectShape(w, h, r), 16)
  const pos = geo.attributes.position
  const uv = new Float32Array(pos.count * 2)
  for (let i = 0; i < pos.count; i++) {
    uv[i * 2] = (pos.getX(i) + w / 2) / w
    uv[i * 2 + 1] = (pos.getY(i) + h / 2) / h
  }
  geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2))
  return geo
}

export default function PhoneModel({ texture }: { texture: THREE.Texture }) {
  useEffect(() => {
    texture.flipY = true
    texture.needsUpdate = true
  }, [texture])

  const screenW = BODY_W * 0.9
  const screenH = screenW / ASPECT // matches the portrait canvas aspect (PW/PH)
  const front = DEPTH / 2

  // Rounded geometries so the dark screen box never pokes past the phone's rounded corners.
  const bezelGeo = useMemo(() => roundedRectGeometry(BODY_W * 0.96, BODY_H * 0.965, 0.12), [])
  const screenGeo = useMemo(() => roundedRectGeometry(screenW, screenH, 0.085), [screenW, screenH])
  useEffect(() => () => { bezelGeo.dispose(); screenGeo.dispose() }, [bezelGeo, screenGeo])

  return (
    <group>
      {/* aluminium body */}
      <RoundedBox args={[BODY_W, BODY_H, DEPTH]} radius={0.14} smoothness={4} castShadow receiveShadow>
        <meshStandardMaterial color="#c8ccd2" metalness={0.35} roughness={0.5} />
      </RoundedBox>
      {/* black rounded front bezel */}
      <mesh geometry={bezelGeo} position={[0, 0, front + 0.001]}>
        <meshStandardMaterial color="#08080b" metalness={0.2} roughness={0.6} />
      </mesh>
      {/* rounded screen */}
      <mesh geometry={screenGeo} position={[0, 0, front + 0.004]}>
        <meshBasicMaterial map={texture} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
      {/* camera notch */}
      <mesh position={[0, BODY_H * 0.43, front + 0.006]}>
        <circleGeometry args={[0.045, 24]} />
        <meshBasicMaterial color="#1a1a1f" toneMapped={false} />
      </mesh>
    </group>
  )
}
