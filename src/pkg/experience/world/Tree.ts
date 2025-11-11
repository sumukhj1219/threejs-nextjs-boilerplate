import { Scene, Group, Mesh, RawShaderMaterial, PlaneGeometry, DoubleSide, Vector3, CylinderGeometry, MeshBasicMaterial, Color, MeshStandardMaterial, MeshToonMaterial } from "three";
import Experience from "../Experience";
import treeVertexShader from "../shaders/tree-vertex.glsl"
import treeFragmentShader from "../shaders/tree-fragment.glsl"
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import * as THREE from "three"

export default class Tree {
    private experience!: Experience;
    private scene!: Scene;
    private TREE_PLANES = 150;
    private TREES = 366;

    public mesh!: Group;
    private materials: RawShaderMaterial[] = [];

    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;

        // this.createTree();
        this.createTrunk()
    }

    private createTree() {
        this.mesh = new Group();

        const trunkGeometry = new CylinderGeometry(0.1, 0.2, 3, 8);
        const trunkMaterial = new MeshToonMaterial({ color: new Color("brown") });
        const trunk = new Mesh(trunkGeometry, trunkMaterial);
        trunk.position.y = 1;
        this.mesh.add(trunk);

        for (let i = 0; i < this.TREE_PLANES; i++) {
            const geometry = new PlaneGeometry(1, 1);
            const material = new RawShaderMaterial({
                vertexShader: treeVertexShader,
                fragmentShader: treeFragmentShader,
                side: DoubleSide,
                transparent: true,
                opacity: 0.25,
                uniforms: {
                    uWindFrequency: { value: new Vector3(2.0, 0.0, 2.0) },
                    uWindAmplitude: { value: 0.5 },
                    uTime: { value: 0 },
                    uTexture: { value: this.experience.resources.items.treeTexture }
                }
            });
            this.materials.push(material);

            const plane = new Mesh(geometry, material);
            plane.position.set(
                (Math.random() - 0.5) * 2,
                Math.random() * 2 + 1.5,
                (Math.random() - 0.5) * 2
            );
            plane.rotation.set(
                Math.random() * Math.PI / 4,
                Math.random() * Math.PI,
                Math.random() * Math.PI / 4
            );

            this.mesh.add(plane);
        }

        this.mesh.position.set(5, 0, 0);
        this.scene.add(this.mesh);
    }

    private createTrunk() {
    const loader = new GLTFLoader();
    loader.load("/models/tree.glb", (glb) => {
        const root = glb.scene;

        let baseMesh: THREE.Mesh | null = null;
        root.traverse((child: any) => {
            if (child.isMesh && !baseMesh) baseMesh = child;
        });
        if (!baseMesh) return console.warn("No mesh found in tree.glb");

        // @ts-ignore
        const geom = baseMesh.geometry.clone();
          geom.rotateX(-Math.PI / 2);

        const box = new THREE.Box3().setFromObject(baseMesh);
        const size = new THREE.Vector3();
        box.getSize(size);

        const scaledBox = new THREE.Box3().setFromObject(new THREE.Mesh(geom));
        geom.translate(0, -scaledBox.min.y, 0);

        const toonMat = new THREE.MeshToonMaterial({
            color: new THREE.Color("#66260d"),
            side: THREE.DoubleSide
        });

        const treeMesh = new THREE.InstancedMesh(geom, toonMat, this.TREES);
        treeMesh.castShadow = true;
        treeMesh.receiveShadow = false;

        const dummy = new THREE.Object3D();
        for (let i = 0; i < this.TREES; i++) {
            const x = (Math.random() - 0.5) * 50;
            const z = (Math.random() - 0.5) * 50;
            const y = 0;

            dummy.position.set(x, y, z);
            dummy.rotation.set(0, Math.random() * Math.PI * 2, 0); 
            dummy.scale.setScalar(1);
            dummy.scale.y = Math.random() * 1.25 + 1;
            dummy.updateMatrix();

            treeMesh.setMatrixAt(i, dummy.matrix);
        }

        this.scene.add(treeMesh);
    });
}




    public update() {
        const time = this.experience.time.elapsed * 0.001;
        this.materials.forEach((mat) => {
            mat.uniforms.uTime.value = time;
        });
    }
}
