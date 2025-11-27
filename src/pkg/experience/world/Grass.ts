import { BufferGeometry, BufferAttribute, DoubleSide, InstancedMesh, RawShaderMaterial, Scene, Vector3, Object3D } from "three";
import Experience from "../Experience";
import grassVertexShader from "../shaders/grass-vertex.glsl";
import grassFragmentShader from "../shaders/grass-fragment.glsl";

export default class Grass {
    private experience!: Experience;
    private scene!: Scene;
    public mesh!: InstancedMesh;
    private material!: RawShaderMaterial;

    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.createGrass();
    }

    createGrass() {
        const vertices = new Float32Array([
            0.0, 0.0, 0.0,
            0.3, 0.0, 0.0,
            0.15, 1.0, 0.0,
        ]);

        const geometry = new BufferGeometry();
        geometry.setAttribute("position", new BufferAttribute(vertices, 3));

        const uvs = new Float32Array([
            0, 0,
            1, 0,
            0.5, 1
        ]);
        geometry.setAttribute("uv", new BufferAttribute(uvs, 2));
        const uFar = false;

        this.material = new RawShaderMaterial({
            vertexShader: grassVertexShader,
            fragmentShader: grassFragmentShader,
            side: DoubleSide,
            transparent: true,
            uniforms: {
                uTime: { value: 0 },
                uWindFrequency: { value: new Vector3(2.0, 0.5, 2.0) },
                uWindAmplitude: { value: 1.5 },
                uCameraPosition: { value: new Vector3() }
            },
        });

        const count = 2000000;
        this.mesh = new InstancedMesh(geometry, this.material, count);

        const dummy = new Object3D();
        for (let i = 0; i < count; i++) {
            dummy.position.set(
                (Math.random() - 0.5) * 170,
                0,
                (Math.random() - 0.5) * 170
            );
            dummy.rotation.y = Math.random() * Math.PI;
            dummy.scale.setScalar(0.5 + Math.random() * 0.5);
            dummy.updateMatrix();
            this.mesh.setMatrixAt(i, dummy.matrix);
        }

        this.scene.add(this.mesh);
    }

    update() {
        const time = this.experience.time.elapsed * 0.001;
        this.material.uniforms.uTime.value = time;

        this.material.uniforms.uCameraPosition.value.copy(
            this.experience.camera.instance.position
        );
    }
}
