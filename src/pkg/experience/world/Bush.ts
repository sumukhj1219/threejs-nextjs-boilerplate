import { Scene, Group, Mesh, RawShaderMaterial, PlaneGeometry, DoubleSide, Vector3, CylinderGeometry, MeshBasicMaterial, Color, MeshStandardMaterial, MeshToonMaterial } from "three";
import Experience from "../Experience";
import bushVertexShader from "../shaders/bush-vetex.glsl"
import bushFragmentShader from "../shaders/bush-fragment.glsl"
import * as THREE from "three"

export default class Bush {
    private experience!: Experience;
    private scene!: Scene;
    private PLANES = 150;

    public mesh!: Group;
    private materials: RawShaderMaterial[] = [];

    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;

        this.createBush();
    }

     private createBush() {
        this.mesh = new Group();

        for (let i = 0; i < this.PLANES; i++) {
            const geometry = new PlaneGeometry(0.5, 0.5);
            const material = new RawShaderMaterial({
                vertexShader: bushVertexShader,
                fragmentShader: bushFragmentShader,
                side: DoubleSide,
                transparent: true,
                uniforms: {
                    uWindFrequency: { value: new Vector3(0.5, 0, 0.5) },
                    uWindAmplitude: { value: 0.5 },
                    uTime: { value: 0 },
                    uTexture: { value: this.experience.resources.items.bushTexture }
                }
            });
            this.materials.push(material);

            const plane = new Mesh(geometry, material);
            plane.position.set(
                (Math.random() - 0.5) * 1,
                Math.random() * 0.25,
                (Math.random() - 0.5) * 1
            );
            plane.rotation.set(
                Math.random() * Math.PI / 4,
                Math.random() * Math.PI,
                Math.random() * Math.PI / 4
            );

            this.mesh.add(plane);
        }

        this.mesh.position.set(15, 0, 0);
        this.scene.add(this.mesh);
    }




    public update() {
        const time = this.experience.time.elapsed * 0.001;
        this.materials.forEach((mat) => {
            mat.uniforms.uTime.value = time;
        });
    }
}
