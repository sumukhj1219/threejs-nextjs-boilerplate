import { Scene } from "three";
import Experience from "../Experience";
import * as THREE from "three"
import skyVertexShader from "../shaders/sky-vertex.glsl"
import skyFragmentShader from "../shaders/sky-fragment.glsl"

export default class Sky {
    private experience!: Experience
    private scene!: Scene

    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene


        const geometry = new THREE.SphereGeometry(500, 32, 32)
        const material = new THREE.ShaderMaterial({
            uniforms: {
                topColor: { value: new THREE.Color(0x0077ff) },
                bottomColor: { value: new THREE.Color(0xffffff) },
                offset: { value: 33 },
                exponent: { value: 0.6 }
            },
            vertexShader: skyVertexShader,
            fragmentShader: skyFragmentShader,
            side: THREE.BackSide,
            depthWrite: false
        })
        const mesh = new THREE.Mesh(geometry, material)
        this.scene.add(mesh)
    }
}