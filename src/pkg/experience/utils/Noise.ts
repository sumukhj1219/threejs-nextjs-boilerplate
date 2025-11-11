import * as THREE from "three"
import { ImprovedNoise } from "three/examples/jsm/math/ImprovedNoise.js"

export function generateHeightTexture(size = 256) {
    const data = new Uint8Array(size * size)
    const perlin = new ImprovedNoise()
    const z = Math.random() * 100
    let maxVal = -Infinity
    let minVal = Infinity

    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            const nx = x / size - 0.5
            const ny = y / size - 0.5
            const e =
                1.0 * perlin.noise(1 * nx, 1 * ny, z) +
                0.5 * perlin.noise(2 * nx, 2 * ny, z) +
                0.25 * perlin.noise(4 * nx, 4 * ny, z)
            const val = e * 0.5 + 0.5 
            data[y * size + x] = val * 255

            if (val > maxVal) maxVal = val
            if (val < minVal) minVal = val
        }
    }

    console.log("height range:", minVal.toFixed(2), "-", maxVal.toFixed(2))
    // @ts-ignore
    const texture = new THREE.DataTexture(data, size, size, THREE.LuminanceFormat)
    texture.needsUpdate = true
    texture.colorSpace = THREE.LinearSRGBColorSpace
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping
    texture.minFilter = THREE.LinearFilter
    texture.magFilter = THREE.LinearFilter

    return texture
}
