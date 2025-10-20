import { Scene } from "three";
import Experience from "../Experience";
import * as THREE from "three"
import Environment from "./Environment";
import Resources from "../utils/Resources";

export default class World {
    private experience!: Experience
    public scene!: Scene
    public environment!: Environment
    public resources!: Resources

    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        this.resources.startLoading()
        
        const testMesh = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshStandardMaterial()
        )
        this.scene.add(testMesh)
        
        this.resources.on("ready",()=>{
            this.environment = new Environment()
        })
    }
}