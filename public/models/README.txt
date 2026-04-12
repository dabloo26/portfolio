The hero globe expects cute_little_planet.glb at the site root:

  Add the file as:  public/cute_little_planet.glb

Commit it to the repo so GitHub Pages serves it at /portfolio/cute_little_planet.glb (Vite base is applied in code).

If the file is missing, the site shows a CSS gradient globe instead (no 404 / no crash).

It is loaded with @react-three/drei useGLTF, centered, and scaled so the model fits ~unit radius for the camera. Orbiting satellites/planes are separate meshes in PlanetScene.tsx.
