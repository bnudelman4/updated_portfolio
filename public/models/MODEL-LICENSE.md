# 3D Model License

**Files:** `public/models/officeroom.glb` (source), `public/models/officeroom-web.glb` (optimized, shipped)

| Field | Value |
| --- | --- |
| Model name | Complete Office Workplace Setup |
| Author | Demycs |
| Source | BlenderKit (https://www.blenderkit.com/) |
| License | Royalty Free |
| Modified | Recentered and scaled at runtime; boot terminal painted onto the monitor's screen material for this site. Optimized for web with gltf-transform (Draco geometry, KTX2/Basis 2K textures) — all objects preserved. |

## Credit

Footer credit (courtesy, not required by the license):

> "Complete Office Workplace Setup" by Demycs, via BlenderKit, Royalty Free license.

## Notes

- Do not redistribute the model as a standalone asset.
- The monitor screen is its own material (`Monitor_screen_mat`, emissive). The boot
  terminal is rendered as a `CanvasTexture` and assigned as that material's
  `map`/`emissiveMap`, so the text glows and stays crisp as the camera pushes in.
- Optimization requires the KTX2 (`ktx`) encoder on PATH; the loader is wired for both
  KTX2 (Basis transcoder in `public/basis/`) and Draco.
