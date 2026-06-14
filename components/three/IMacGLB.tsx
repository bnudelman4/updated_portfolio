'use client'
import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { KTX2Loader } from 'three-stdlib'
import { DRACO_DECODER_PATH } from './dracoConfig'

const MODEL = '/models/imac-web.glb'
const TARGET = 2.9 // world size the recentered model fits within
const SCREEN_MAT = 'Screen' // material that carries the full-screen wallpaper (the display)

// Average a mesh's vertex normals into a single world-space facing direction.
function worldFacing(mesh: THREE.Mesh): THREE.Vector3 {
  const n = mesh.geometry.attributes.normal as THREE.BufferAttribute | undefined
  const acc = new THREE.Vector3()
  if (n) {
    const v = new THREE.Vector3()
    for (let i = 0; i < n.count; i++) acc.add(v.fromBufferAttribute(n, i))
  }
  if (acc.lengthSq() === 0) acc.set(0, 0, 1)
  const normalMatrix = new THREE.Matrix3().getNormalMatrix(mesh.matrixWorld)
  return acc.applyMatrix3(normalMatrix).normalize()
}

// Real DatSketch "iMac 2021" GLB, loaded with BOTH KTX2 (Basis) and Draco. We replace the
// display material's texture with the current project's screenshot.
export default function IMacGLB({ texture }: { texture: THREE.Texture }) {
  const gl = useThree((s) => s.gl)
  const ktx2 = useMemo(() => new KTX2Loader().setTranscoderPath('/basis/').detectSupport(gl), [gl])
  useEffect(() => () => { ktx2.dispose() }, [ktx2])

  const { scene } = useGLTF(MODEL, DRACO_DECODER_PATH, false, (loader) => {
    ;(loader as unknown as { setKTX2Loader: (l: KTX2Loader) => void }).setKTX2Loader(ktx2)
  })

  const { scale, position, rotY, screen } = useMemo(() => {
    let screenMat: THREE.MeshStandardMaterial | null = null
    let screenMesh: THREE.Mesh | null = null
    // The source asset is a blue iMac. Recolor the body (bezel, back, stand, chin) to a
    // light aluminium grey so it stands out against the dark background — leave the display,
    // glass, chrome, and camera/lens alone. Names: LightBlue/DarkBlue/Metal/White/Yellow.
    const KEEP = new Set([SCREEN_MAT, 'Glass', 'Chrome', 'Lens', 'Cam.Black'])
    const BODY_BLACK = new THREE.Color('#c8ccd2')
    scene.traverse((o) => {
      const m = o as THREE.Mesh
      if (!m.isMesh) return
      m.castShadow = true
      m.receiveShadow = true
      const mats = Array.isArray(m.material) ? m.material : [m.material]
      for (const mt of mats) {
        if (mt.name === SCREEN_MAT) {
          screenMat = mt as THREE.MeshStandardMaterial
          screenMesh = m
          continue
        }
        if (KEEP.has(mt.name)) continue
        const std = mt as THREE.MeshStandardMaterial
        if (std.color) {
          std.color.copy(BODY_BLACK)
          std.metalness = 0.2
          std.roughness = 0.55
          std.map = null // drop any baked colored albedo so the black is clean
          std.needsUpdate = true
        }
      }
    })
    scene.updateMatrixWorld(true)

    // Orient the screen to face the camera (+z): measure the screen's actual normal and
    // rotate the model so that normal points at the viewer.
    let rotY = Math.PI
    // Resolve the display rectangle (in scene-local space) so we can lay our OWN texture
    // plane over it — this avoids depending on the asset's screen UVs (which are mirrored).
    let screen: { pos: [number, number, number]; quat: THREE.Quaternion; width: number; height: number } | null = null
    if (screenMesh) {
      const dir = worldFacing(screenMesh)
      rotY = Math.atan2(-dir.x, dir.z)

      const wbox = new THREE.Box3().setFromObject(screenMesh)
      const wsize = new THREE.Vector3(); const wcenter = new THREE.Vector3()
      wbox.getSize(wsize); wbox.getCenter(wcenter)
      const normal = dir.clone()
      const up = new THREE.Vector3(0, 1, 0)
      up.addScaledVector(normal, -up.dot(normal)).normalize()
      if (up.lengthSq() < 1e-6) up.set(0, 1, 0)
      const right = new THREE.Vector3().crossVectors(up, normal).normalize()
      const height = Math.abs(wsize.x * up.x) + Math.abs(wsize.y * up.y) + Math.abs(wsize.z * up.z)
      const width = Math.abs(wsize.x * right.x) + Math.abs(wsize.y * right.y) + Math.abs(wsize.z * right.z)
      const eps = Math.max(width, height) * 0.012
      const quat = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(right, up, normal))
      screen = {
        pos: [wcenter.x + normal.x * eps, wcenter.y + normal.y * eps, wcenter.z + normal.z * eps],
        quat,
        width: width * 0.97,
        height: height * 0.97,
      }
    }

    // Blacken the asset's own screen material so nothing shows through behind our plane.
    if (screenMat) {
      const std = screenMat as THREE.MeshStandardMaterial
      std.map = null; std.emissiveMap = null
      std.color = new THREE.Color('#000000')
      std.emissive = new THREE.Color('#000000')
      std.needsUpdate = true
    }

    const box = new THREE.Box3().setFromObject(scene)
    const size = new THREE.Vector3()
    const center = new THREE.Vector3()
    box.getSize(size)
    box.getCenter(center)
    const s = TARGET / Math.max(size.x, size.y, size.z)
    return {
      scale: s,
      position: [-center.x * s, -center.y * s, -center.z * s] as [number, number, number],
      rotY,
      screen,
    }
  }, [scene])

  // Our texture plane uses standard CanvasTexture mapping (flipY=true, no mirror).
  useEffect(() => {
    texture.flipY = true
    texture.needsUpdate = true
  }, [texture])

  return (
    // Outer group rotates about the origin; inner group recenters + scales, so the model
    // stays centered for any rotation angle.
    <group rotation={[0, rotY, 0]}>
      <group scale={scale} position={position}>
        <primitive object={scene} />
        {screen && (
          <mesh position={screen.pos} quaternion={screen.quat}>
            <planeGeometry args={[screen.width, screen.height]} />
            <meshBasicMaterial map={texture} toneMapped={false} side={THREE.DoubleSide} />
          </mesh>
        )}
      </group>
    </group>
  )
}
