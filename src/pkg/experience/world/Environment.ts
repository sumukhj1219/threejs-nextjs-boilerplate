import { Scene, DirectionalLight } from "three"
import Experience from "../Experience"

export default class Environment {
    private experience: Experience
    public scene: Scene
    private sunLight!: DirectionalLight

    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene

        this.setSunLight()
    }

    private setSunLight() {
        this.sunLight = new DirectionalLight("#ffffff", 3) 
        this.sunLight.position.set(5, 5, 5) 
        this.sunLight.castShadow = true     
        this.sunLight.shadow.camera.near = 1
        this.sunLight.shadow.camera.far = 20
        this.sunLight.shadow.mapSize.set(1024, 1024)

        this.scene.add(this.sunLight)
    }
}
