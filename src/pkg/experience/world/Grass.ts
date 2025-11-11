import { BufferGeometry, BufferAttribute, DoubleSide, Mesh, RawShaderMaterial, Scene, Vector3, InstancedMesh } from "three";
import Experience from "../Experience";
import grassVertexShader from "../shaders/grass-vertex.glsl";
import grassFragmentShader from "../shaders/grass-fragment.glsl";
import { Object3D } from "three/src/Three.WebGPU.Nodes.js";

export default class Grass {
    private experience!: Experience;
    private scene!: Scene;
    public mesh!: Mesh;
    private materials: RawShaderMaterial[] = [];

    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;

        this.createGrass();
    }

    createGrass() {
        const vertices = new Float32Array([
            0.0, 0.0, 0.0,    
            0.2, 0.0, 0.0,   
            0.5, 0.5, 0.0,  
        ]);

        const geometry = new BufferGeometry();
        geometry.setAttribute("position", new BufferAttribute(vertices, 3));

        const uvs = new Float32Array([
            0, 0,
            1, 0,
            0.5, 1
        ]);
        geometry.setAttribute("uv", new BufferAttribute(uvs, 2));

        const material = new RawShaderMaterial({
            vertexShader: grassVertexShader,
            fragmentShader: grassFragmentShader,
            side: DoubleSide,
            transparent: true,
            uniforms: {
                uTime: { value: 0 },
                uWindFrequency: { value: new Vector3(2.0, 0.5, 2.0) },
                uWindAmplitude: { value: 1.5 },
            }
        });

        this.materials.push(material);

        const count = 1000000;
        const offsets = new Float32Array(count);
        for (let i = 0; i < count; i++) {
            offsets[i] = Math.random() * 200.0; 
        }
        geometry.setAttribute("aOffset", new BufferAttribute(offsets, 1));
        this.mesh = new InstancedMesh(geometry, material, count);

        const dummy = new Object3D();
        const cameraPosition = this.experience.camera.instance.position
        const target = cameraPosition.clone()

        for (let i = 0; i < count; i++) {
            dummy.position.set(
                (Math.random() - 0.5) * 180,         
                -0.3,                             
                (Math.random() - 0.5)* 180          
            );

            
            dummy.scale.setScalar(1 + Math.random() * 0.5); 
            dummy.lookAt(target)
            dummy.updateMatrix();
            // @ts-ignore
            this.mesh.setMatrixAt(i, dummy.matrix);
        }

        this.scene.add(this.mesh);
    }


    update() {
        const time = this.experience.time.elapsed * 0.001;
        this.materials.forEach((m) => {
            m.uniforms.uTime.value = time;
        });
    }
}
