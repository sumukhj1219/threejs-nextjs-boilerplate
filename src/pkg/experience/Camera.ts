import { Scene } from "three";
import Experience from "./Experience";
import Sizes from "./utils/Sizes";
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/Addons.js";

export default class Camera{
    private experience:Experience
    private scene: Scene
    private canvas: HTMLCanvasElement | undefined
    private sizes: Sizes
    public instance!: THREE.PerspectiveCamera;
    public controls!: OrbitControls;
    
    constructor(){
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.canvas = this.experience.canvas
        this.sizes = this.experience.sizes

        this.setInstance()
        this.setOrbitControls()
    }

    public setInstance(){
        this.instance = new THREE.PerspectiveCamera(
            35,
            this.sizes.width / this.sizes.height,
            0.1,
            100
        )
        this.instance.position.set(6,4,8)
        this.scene.add(this.instance)
    }

    public setOrbitControls(){
        this.controls = new OrbitControls(this.instance, this.canvas)
        this.controls.enableDamping = true
    }

    public resize(){
        this.instance.aspect = this.sizes.width / this.sizes.height
        this.instance.updateProjectionMatrix()
    }

    public update(){
        this.controls.update()
    }
}