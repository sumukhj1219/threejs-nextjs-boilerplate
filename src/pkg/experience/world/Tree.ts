import { Scene, Object3D, MeshToonMaterial, Color, InstancedMesh } from "three";
import Experience from "../Experience";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import * as THREE from "three";

export default class Tree {
    private experience!: Experience;
    private scene!: Scene;
    private TREES = 400;

    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;

        this.createTree();
    }

    private createTree() {
        const loader = new GLTFLoader();
        loader.load("/models/pine-tree.glb", (glb) => {
            const root = glb.scene;

            console.log("Root children:", root.children[0].children[0].children[0].children);

            const parts = root.children[0].children[0].children[0].children;

            let geomTop: THREE.BufferGeometry | null = null;
            let geomMiddle: THREE.BufferGeometry | null = null;
            let geomTrunk: THREE.BufferGeometry | null = null;

            for (const part of parts) {
                if (part.name === "Top" && part.children[0]?.isMesh) {
                    // @ts-ignore
                    geomTop = part.children[0].geometry.clone();
                } else if (part.name === "Middle" && part.children[0]?.isMesh) {
                    // @ts-ignore
                    geomMiddle = part.children[0].geometry.clone();
                } else if (part.name === "Trunk" && part.children[0]?.isMesh) {
                    // @ts-ignore
                    geomTrunk = part.children[0].geometry.clone();
                }
            }

            if (!geomTop || !geomMiddle || !geomTrunk) {
                console.warn("Could not find all parts (Top, Middle, Trunk). Check hierarchy.");
                return;
            }

            const rotateUp = (geom: THREE.BufferGeometry) => {
                geom.rotateX(-Math.PI / 2);
            };

            rotateUp(geomTop);
            rotateUp(geomMiddle);
            rotateUp(geomTrunk);

            const matTop = new MeshToonMaterial({ color: new Color("#A3B43D"), side: THREE.DoubleSide });
            const matMiddle = new MeshToonMaterial({ color: new Color("#7C8F2E"), side: THREE.DoubleSide });
            const matTrunk = new MeshToonMaterial({ color: new Color("#8B5A2B"), side: THREE.DoubleSide });


            const meshTop = new InstancedMesh(geomTop, matTop, this.TREES);
            const meshMiddle = new InstancedMesh(geomMiddle, matMiddle, this.TREES);
            const meshTrunk = new InstancedMesh(geomTrunk, matTrunk, this.TREES);

            meshTop.castShadow = meshMiddle.castShadow = meshTrunk.castShadow = true;
            meshTop.receiveShadow = meshMiddle.receiveShadow = meshTrunk.receiveShadow = false;

            const dummy = new Object3D();
            const innerRadius = 20;
            const outerRadius = 90;

            for (let i = 0; i < this.TREES; i++) {
                const angle = Math.random() * Math.PI * 2;
                const radius = Math.sqrt(Math.random() * (outerRadius ** 2 - innerRadius ** 2) + innerRadius ** 2);
                const x = Math.cos(angle) * radius;
                const z = Math.sin(angle) * radius;
                const y = 0;

                dummy.position.set(x, y, z);
                dummy.rotation.set(0, Math.random() * Math.PI * 2, 0);
                dummy.scale.setScalar(4);
                dummy.scale.y = Math.random() + 8;
                dummy.updateMatrix();

                meshTop.setMatrixAt(i, dummy.matrix);
                meshTop.position.y = dummy.scale.y * 2.3
                meshMiddle.setMatrixAt(i, dummy.matrix);
                meshMiddle.position.y = dummy.scale.y
                meshTrunk.setMatrixAt(i, dummy.matrix);
            }

            this.scene.add(meshTrunk);
            this.scene.add(meshMiddle);
            this.scene.add(meshTop);
        });
    }

    public update() { }
}
