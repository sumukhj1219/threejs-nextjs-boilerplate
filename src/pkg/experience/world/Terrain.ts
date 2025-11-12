import { Scene } from "three"
import Experience from "../Experience"
import * as THREE from "three"
import terrainVertexShader from "../shaders/terrain-vertex.glsl"
import terrainFragmentShader from "../shaders/terrain-fragment.glsl"
import { generateHeightTexture } from "../utils/Noise"

export default class Terrain {
    private experience!: Experience
    private scene!: Scene
    public mesh!: THREE.Mesh

    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene

        this.createTerrain()
    }

    private createTerrain() {
        const geometry = new THREE.PlaneGeometry(200, 200, 256, 256)
        const heightTexture = generateHeightTexture()
        const material = new THREE.MeshToonMaterial({
            color: new THREE.Color("#e05b22"),
            side: THREE.DoubleSide,
            displacementMap:heightTexture,
            displacementScale:100
        })
        this.mesh = new THREE.Mesh(geometry, material)
        this.mesh.rotation.x = Math.PI / 2
        this.mesh.castShadow = false
        this.mesh.receiveShadow = true
        this.scene.add(this.mesh)
    }

}