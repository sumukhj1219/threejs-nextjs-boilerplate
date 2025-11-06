import { Scene, Group, Mesh, RawShaderMaterial, PlaneGeometry, DoubleSide, Vector3, CylinderGeometry, MeshBasicMaterial, Color, MeshStandardMaterial } from "three";
import Experience from "../Experience";
import treeVertexShader from "../shaders/tree-vertex.glsl"
import treeFragmentShader from "../shaders/tree-fragment.glsl"

export default class Tree {
    private experience!: Experience;
    private scene!: Scene;
    private TREE_PLANES = 100;

    public mesh!: Group;
    private materials: RawShaderMaterial[] = [];

    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;

        this.createTree();
    }

    private createTree() {
        this.mesh = new Group();

        const trunkGeometry = new CylinderGeometry(0.1, 0.2, 3, 8);
        const trunkMaterial = new MeshStandardMaterial({ color: new Color("brown") });
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
                    uWindFrequency: { value: new Vector3(2.0, 2.0, 2.0) },
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

    public update() {
        const time = this.experience.time.elapsed * 0.001;
        this.materials.forEach((mat) => {
            mat.uniforms.uTime.value = time;
        });
    }
}
