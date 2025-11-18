import Camera from "./Camera"
import Renderer from "./Renderer"
import Sizes from "./utils/Sizes"
import Time from "./utils/Time"
import * as THREE from "three"
import World from "./world/World"
import Resources from "./utils/Resources"
import sources from "./sources"
import Physics from "./Physics"

export default class Experience {
    private static instance: Experience

    public canvas!: HTMLCanvasElement | undefined
    public sizes!: Sizes
    public time!: Time
    public scene!: THREE.Scene
    public camera!: Camera
    public renderer!: Renderer
    public world!: World
    public resources!: Resources
    public physics!: Physics

    constructor(canvas?: HTMLCanvasElement | undefined) {
        if (Experience.instance) {
            return Experience.instance
        }
        Experience.instance = this

        this.canvas = canvas

        this.physics = new Physics()
        this.sizes = new Sizes()
        this.time = new Time()
        this.scene = new THREE.Scene()
        this.camera = new Camera()
        this.renderer = new Renderer()
        this.resources = new Resources(sources)
        this.world = new World()


        this.sizes.on("resize", () => {
            this.resize()
        })

        this.time.on("tick", () => {
            this.update()
        })
    }

    resize() {
        this.camera.resize()
        this.renderer.resize()
    }

    update() {
        this.physics.update()
        this.camera.update()
        this.world.update()
        this.renderer.update()
    }

}
