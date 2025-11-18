import * as THREE from "three";
import Experience from "../Experience";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import RAPIER from "@dimforge/rapier3d-compat";

export default class Lab {
    private experience!: Experience;
    private scene!: THREE.Scene;
    private body!: RAPIER.RigidBody

    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this
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
                    node.material = new THREE.MeshToonMaterial({ color: "#f73e19" });
                }
            });

            root.position.set(10, 0, 10)
            root.rotation.y = -Math.PI / 2
            root.scale.set(3.5, 3.5, 3.5)
            this.createPhysicsBody(root)
        });

    }

    private createPhysicsBody(root: THREE.Group) {
        const box = new THREE.Box3().setFromObject(root);
        const size = new THREE.Vector3();
        box.getSize(size);
        const center = new THREE.Vector3();
        box.getCenter(center);

        const world = this.experience.physics.world;
        const rigidBodyDesc = RAPIER.RigidBodyDesc.fixed()
            .setTranslation(root.position.x, root.position.y, root.position.z);
        const body = world.createRigidBody(rigidBodyDesc);
        const colliderDesc = RAPIER.ColliderDesc.cuboid(size.x / 2, size.y / 2, size.z / 2);
        world.createCollider(colliderDesc, body);
    }
}
