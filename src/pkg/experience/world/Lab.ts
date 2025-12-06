import * as THREE from "three";
import Experience from "../Experience";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import RAPIER from "@dimforge/rapier3d-compat";
import TextManager from "../utils/TextManager";
import vertexShader from "../shaders/bloom-vertex.glsl"
import fragmentShader from "../shaders/bloom-fragment.glsl"
import gsap from "gsap";

type BillBoardObject = {
    color: string
}

const BillBoardConfig: Record<string, BillBoardObject> = {
    "MainPillar": {
        color: "#21110d"
    },
    "Pillar": {
        color: "#21110d"
    },
    "RightPanel": {
        color: "#240d07"
    },
    "LeftPanel": {
        color: "#240d07"
    },
    "LightSupport": {
        color: "#21110d"
    }
}

export default class Lab {
    private experience!: Experience;
    private scene!: THREE.Scene;

    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this
        this.createLab()
    }

    private createLab() {
        const loader = new GLTFLoader();

        loader.load("/models/bill-board.glb", (glb) => {
            const root = glb.scene;
            this.scene.add(root);
            root.castShadow = true

            Object.entries(BillBoardConfig).forEach(([name, config]) => {
                root.traverse((node: any) => {
                    if (!node.isMesh) return;
                    node.castShadow = true;

                    if (node.name.startsWith(name)) {
                        node.material = new THREE.MeshToonMaterial({
                            color: config.color,
                        });
                    }
                });
            });

            new TextManager({
                root: root,
                meshName: "Board",
                text: "Git Garden",
                width: 1024,
                height: 720,
                fontSize: 94,
                background: "#0a0200",
                color: "white"
            });


            root.traverse((node: any) => {
                if (node.isMesh && node.name.includes("BloomLight")) {
                    const mat = new THREE.ShaderMaterial({
                        vertexShader: vertexShader,
                        fragmentShader: fragmentShader,
                        blending: THREE.AdditiveBlending
                    });
                    node.material = mat;
                    node.material.needsUpdate = true;
                }

                if (node.isMesh && node.name.includes("Panel")) {
                        gsap.fromTo(
                            node.position as gsap.TweenTarget,
                            { x: 0, z: 0 },
                            { x: node.position.x, z: node.position.z, duration: 1.5, ease:"bounce.inOut" }
                        );
                }
            });

            root.position.set(10, 0, 10);
            root.rotation.y = Math.PI;

            this.createPhysicsBody(root);

            root.scale.set(0.5, 0.5, 0.5);
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
        const colliderDesc = RAPIER.ColliderDesc.cuboid(size.x / 4, size.y / 4, size.z / 4);
        world.createCollider(colliderDesc, body);
    }
}
