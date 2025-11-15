import * as THREE from "three";
import Experience from "../Experience";
import { GLTFLoader } from "three/examples/jsm/Addons.js";

export default class Lab {
    private experience!: Experience;
    private scene!: THREE.Scene;

    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;

        this.createLab()
    }

    private createLab() {
        const loader = new GLTFLoader();

        loader.load("/models/board.glb", (glb) => {
            const root = glb.scene;
            this.scene.add(root);

            root.getObjectByName("board")?.traverse((node: any) => {
                if (node.isMesh) {
                    node.castShadow = true;
                    node.material = new THREE.MeshToonMaterial({ color: "brown" });
                }
            });

            root.position.set(10, 0, 10)
            root.rotation.y = -Math.PI / 2
            root.scale.set(2,2,2)
        });

    }
}
