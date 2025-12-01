import * as THREE from "three"
import { RenderPass, UnrealBloomPass } from "three/examples/jsm/Addons.js";
import Experience from "./Experience"
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';

export default class PostProcessing {
    private experience: Experience
    private composer!: EffectComposer

    constructor() {
        this.experience = new Experience()
        const scene = this.experience.scene
        const camera = this.experience.camera.instance
        const renderer = this.experience.renderer.instance

        this.composer = new EffectComposer(renderer)

        const renderPass = new RenderPass(scene, camera)
        this.composer.addPass(renderPass)

        const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            1.5,
            0.4,
            0.85
        )
        this.composer.addPass(bloomPass);
    }

    update() {
        this.composer.render();
    }
}