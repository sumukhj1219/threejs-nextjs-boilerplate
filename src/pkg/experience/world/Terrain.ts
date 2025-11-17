import { Scene } from "three"
import Experience from "../Experience"
import * as THREE from "three"
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
        const heightMap = generateHeightTexture()
        const geometry = new THREE.PlaneGeometry(200, 200, 256, 256)
        const material = new THREE.MeshStandardMaterial({
            color: new THREE.Color("#d18b2a"),
            side: THREE.DoubleSide,
            displacementMap:heightMap,
            metalness:0,
            roughness:1,
            displacementScale:2
        })
        this.mesh = new THREE.Mesh(geometry, material)
        this.mesh.rotation.x = -Math.PI / 2
        this.mesh.castShadow = false
        this.mesh.receiveShadow = true
        this.mesh.position.y = -1
        this.scene.add(this.mesh)
    }

}