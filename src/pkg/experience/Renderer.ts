import Camera from "./Camera"
import Experience from "./Experience"
import * as THREE from "three"

export default class Renderer {
    private experience: Experience
    private canvas: HTMLCanvasElement
    private camera: Camera
    public instance!: THREE.WebGLRenderer

    constructor() {
        this.experience = new Experience()
        this.canvas = this.experience.canvas!
        this.camera = this.experience.camera

        this.setInstance()
    }

    setInstance() {
        this.instance = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true
        })

        this.instance.toneMapping = THREE.CineonToneMapping
        this.instance.toneMappingExposure = 1.75
        this.instance.shadowMap.enabled = true
        this.instance.shadowMap.type = THREE.PCFSoftShadowMap
        this.instance.setClearColor('#211d20')
        this.instance.setSize(this.experience.sizes.width, this.experience.sizes.height)
        this.instance.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    }

    public resize(){
        this.instance.setSize(this.experience.sizes.width, this.experience.sizes.height)
        this.instance.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    }

    public update(){
        this.instance.render(this.experience.scene, this.camera.instance)
    }
}
