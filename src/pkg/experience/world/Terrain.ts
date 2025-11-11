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
        const geometry = new THREE.PlaneGeometry(160, 160, 256, 256)
        // const material = new THREE.RawShaderMaterial({
        //     side: THREE.DoubleSide,
            
        //     vertexShader: terrainVertexShader,
        //     fragmentShader: terrainFragmentShader,
        //     uniforms: {
        //         uTime: { value: 0 },
        //         uAmplitude: { value: 0.5 },
        //         lightPosition: {value: this.experience.world.environment.sunLight.position},
        //         shadowMap:{value:null},
        //         shadowMapSize: { value: new THREE.Vector2(1024, 1024) },
        //         shadowBias: {value: this.experience.world.environment.sunLight.shadow.bias},
        //         lightViewMatrix:{value: this.experience.world.environment.sunLight.shadow.camera.matrixWorldInverse},
        //         lightProjectionMatrix:{value: this.experience.world.environment.sunLight.shadow.camera.projectionMatrix}
        //     },
        // })
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