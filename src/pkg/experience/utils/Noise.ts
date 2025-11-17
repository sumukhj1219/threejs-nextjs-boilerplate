import * as THREE from "three"

export function generateHeightTexture() {
    const loader = new THREE.TextureLoader()
    const texture = loader.load("/textures/noise/noiseTexture.png")

    texture.wrapS = THREE.ClampToEdgeWrapping
    texture.wrapT = THREE.ClampToEdgeWrapping
    texture.needsUpdate = true

    return texture
}
