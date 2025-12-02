import * as THREE from "three"
import { RenderPass, UnrealBloomPass } from "three/examples/jsm/Addons.js";
import Experience from "./Experience"
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';

export default class PostProcessing {
    private experience: Experience
    private composer!: EffectComposer
    private bloomPass!: UnrealBloomPass

    constructor() {
        this.experience = new Experience()
        const scene = this.experience.scene
        const camera = this.experience.camera.instance
        const renderer = this.experience.renderer.instance

        this.composer = new EffectComposer(renderer)

        const renderPass = new RenderPass(scene, camera)
        this.composer.addPass(renderPass)

        this.bloomPass = new UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            0.25,
            0.5,
            1
        )
        this.composer.addPass(this.bloomPass);
    }

    resize() {
        const renderer = this.experience.renderer.instance

        const width = window.innerWidth
        const height = window.innerHeight
        const pixelRatio = Math.min(window.devicePixelRatio, 2)

        renderer.setPixelRatio(pixelRatio)
        renderer.setSize(width, height)

        this.composer.setPixelRatio(pixelRatio)
        this.composer.setSize(width, height)

        this.bloomPass.resolution.set(width, height)
    }

    update() {
        this.composer.render();
    }
}