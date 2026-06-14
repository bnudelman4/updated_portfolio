'use client'
import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { KTX2Loader } from 'three-stdlib'
import { DRACO_DECODER_PATH } from './dracoConfig'

const MODEL = '/models/imac-web.glb'
const TARGET = 2.9 // world size the recentered model fits within
const ROT_Y = Math.PI // the model's screen faces -z by default; turn it toward the camera
const SCREEN_MAT = 'Screen' // material that carries the full-screen wallpaper (the display)

// Real DatSketch "iMac 2021" GLB, loaded with BOTH KTX2 (Basis) and Draco. We replace the
// display material's texture with the current project's screenshot.
export default function IMacGLB({ texture }: { texture: THREE.Texture }) {
  const gl = useThree((s) => s.gl)
  const ktx2 = useMemo(() => new KTX2Loader().setTranscoderPath('/basis/').detectSupport(gl), [gl])
  useEffect(() => () => { ktx2.dispose() }, [ktx2])

  const { scene } = useGLTF(MODEL, DRACO_DECODER_PATH, false, (loader) => {
    ;(loader as unknown as { setKTX2Loader: (l: KTX2Loader) => void }).setKTX2Loader(ktx2)
  })

  const { scale, position, screenMat } = useMemo(() => {
    let screenMat: THREE.MeshStandardMaterial | null = null
    scene.traverse((o) => {
      const m = o as THREE.Mesh
      if (!m.isMesh) return
      m.castShadow = true
      m.receiveShadow = true
      const mats = Array.isArray(m.material) ? m.material : [m.material]
      for (const mt of mats) if (mt.name === SCREEN_MAT) screenMat = mt as THREE.MeshStandardMaterial
    })
    const box = new THREE.Box3().setFromObject(scene)
    const size = new THREE.Vector3()
    const center = new THREE.Vector3()
    box.getSize(size)
    box.getCenter(center)
    const s = TARGET / Math.max(size.x, size.y, size.z)
    return {
      scale: s,
      position: [-center.x * s, -center.y * s, -center.z * s] as [number, number, number],
      screenMat: screenMat as THREE.MeshStandardMaterial | null,
    }
  }, [scene])

  useEffect(() => {
    const std = screenMat
    if (!std) return
    // The model is turned 180° to face the camera. flipY=true keeps the screenshot upright;
    // repeat.x=-1 un-mirrors the horizontal caused by the turn.
    texture.flipY = true
    texture.wrapS = THREE.RepeatWrapping
    texture.repeat.x = -1
    texture.offset.x = 1
    texture.needsUpdate = true
    std.map = texture
    std.emissiveMap = texture
    std.emissive = new THREE.Color('#ffffff')
    std.emissiveIntensity = 0.85
    std.toneMapped = false
    std.needsUpdate = true
  }, [screenMat, texture])

  return (
    <group rotation={[0, ROT_Y, 0]} scale={scale} position={position}>
      <primitive object={scene} />
    </group>
  )
}
