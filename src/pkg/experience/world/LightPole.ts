import * as THREE from "three";
import Experience from "../Experience";
import { GLTFLoader } from "three/examples/jsm/Addons.js";

export default class LightPole {
    private experience!: Experience;
    private scene!: THREE.Scene;

    constructor(){
        this.experience = new Experience()
        this.scene = this.experience.scene

        this.createLightPole()
    }

    private createLightPole(){
        const loader = new GLTFLoader()
        loader.load("/models/emitter.glb", (glb)=>{
            const root = glb.scene
            root.position.set(5, 0, 5)
            root.scale.set(1, 2, 1)
            this.scene.add(root)

            root.traverse((node: any)=>{
                if(node.isMesh && node.name.includes("Pole")){
                    node.castShadow = true
                    node.material = new THREE.MeshToonMaterial({
                        color:"brown"
                    })
                }
            })
        })
    }
}