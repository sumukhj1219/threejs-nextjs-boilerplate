import { Scene, Object3D, MeshToonMaterial, Color, InstancedMesh, Box3 } from "three";
import Experience from "../Experience";
import { GLTFLoader, BufferGeometryUtils } from "three/examples/jsm/Addons.js";
import * as THREE from "three";

export default class Tree {
    private experience!: Experience;
    private scene!: Scene;
    private TREES = 400;

    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.loadTree();
    }

    private loadTree() {
        const loader = new GLTFLoader();
        loader.load("/models/cubical-tree.glb", (glb) => {
            const root = glb.scene;

            const trunkMeshes: THREE.Mesh[] = [];
            const leafMeshes: THREE.Mesh[] = [];
            console.log(root)
            root.traverse((child: any) => {
                if (child.isMesh) {
                    if (child.name.toLowerCase().includes("cube001")) {
                        leafMeshes.push(child);
                    } else if (child.name.toLowerCase().includes("cube")) {
                        trunkMeshes.push(child);
                    }
                }
            });

            if (trunkMeshes.length === 0) {
                console.warn("⚠️ No trunk mesh found (Cube).");
                return;
            }
            if (leafMeshes.length === 0) {
                console.warn("⚠️ No leaf mesh found (Cube.001). Will render trunk only.");
            }

            const mergeMeshes = (meshes: THREE.Mesh[]) => {
                const geoms: THREE.BufferGeometry[] = [];
                for (const mesh of meshes) {
                    const g = mesh.geometry.clone();
                    g.applyMatrix4(mesh.matrixWorld);
                    geoms.push(g);
                }
                return BufferGeometryUtils.mergeGeometries(geoms, true);
            };

            const trunkGeom = mergeMeshes(trunkMeshes);
            const leafGeom =  mergeMeshes(leafMeshes)

            const centerY = (geom: THREE.BufferGeometry) => {
                const bbox = new Box3().setFromBufferAttribute(geom.getAttribute("position"));
                const minY = bbox.min.y;
                geom.translate(0, -minY, 0);
            };
            centerY(trunkGeom);
            if (leafGeom) centerY(leafGeom);

            const trunkMat = new MeshToonMaterial({
                color: new Color("#704c25"), 
                side: THREE.DoubleSide,
            });
            const leafMat = new MeshToonMaterial({
                color: new Color("#d97a14"),
                side: THREE.DoubleSide,
            });

            const trunkInst = new InstancedMesh(trunkGeom, trunkMat, this.TREES);
            const leafInst = new InstancedMesh(leafGeom, leafMat, this.TREES) ;
            trunkInst.castShadow = true
            trunkInst.receiveShadow = true
            leafInst.castShadow = true
            // leafInst.receiveShadow = true

            const dummy = new Object3D();
            const innerRadius = 20;
            const outerRadius = 90;

            for (let i = 0; i < this.TREES; i++) {
                const angle = Math.random() * Math.PI * 2;
                const radius = Math.sqrt(Math.random() * (outerRadius ** 2 - innerRadius ** 2) + innerRadius ** 2);
                const x = Math.cos(angle) * radius;
                const z = Math.sin(angle) * radius;
                const y = 0;
                const scale = 5;
                const height = Math.random() * 4 + 9;

                dummy.position.set(x, y, z);
                dummy.rotation.set(0, Math.random() * Math.PI * 2, 0);
                dummy.scale.set(scale, height, scale);
                dummy.updateMatrix();
                // @ts-ignore
                leafInst.position.y = Math.random() + 2
                trunkInst.setMatrixAt(i, dummy.matrix);
                if (leafInst) leafInst.setMatrixAt(i, dummy.matrix);
            }

            this.scene.add(trunkInst);
            if (leafInst) this.scene.add(leafInst);

            console.log("✅ Tree instancing complete:", { trunk: trunkMeshes.length, leaves: leafMeshes.length });
        });
    }

    public update() {}
}
