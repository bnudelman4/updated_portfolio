# 3D Model License

**File:** `public/models/room.glb`

| Field | Value |
| --- | --- |
| Model name | Computer Room |
| Author | Bruno Oliveira |
| Source | https://poly.pizza/m/cA_lcvRC4NA |
| Direct asset URL | https://static.poly.pizza/2584093b-d6c5-4247-9af3-e13d6ad9d9cf.glb |
| License | Creative Commons Attribution (CC-BY 3.0) |
| Original format | OBJ/GLTF (originally from Google Poly) |
| Published | Dec 15, 2017 |

## Required attribution

This is a **CC-BY** model and attribution is **required** wherever the model is
displayed/distributed. Use the following credit text:

> "Computer Room" by Bruno Oliveira, licensed under CC-BY 3.0, via Poly Pizza
> (https://poly.pizza/m/cA_lcvRC4NA).

## Description

A vintage/retro computer room scene: mainframe tape drives, switch panels, a
CRT terminal, keyboard, printers, desks, books and pencils. Stylized low-poly,
material-colored (no textures).

## Processing notes

The original 2.4 MB GLB was optimized for web with a structure-preserving
pipeline (gltf-transform `dedup` + `prune` + `draco`), yielding **877 KB**.
Mesh names and material names were intentionally **preserved** (an aggressive
`optimize --compress draco` pass collapsed all 670 meshes/28 materials into 4
palette materials and was discarded) so that the CRT screen face can still be
targeted by mesh/material name later — e.g. meshes `Screen.001`, `Screen.002`,
`Screen_Cube.004`, `ScreenInner*`, `Terminal_Cube.001`, and materials
`Monitor`, `Monitor.002`, `Glass`.
