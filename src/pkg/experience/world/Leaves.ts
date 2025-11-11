import * as THREE from "three";
import Experience from "../Experience";
import leavesVertexShader from "../shaders/leaves-vertex.glsl";
import leavesFragmentShader from "../shaders/leaves-fragment.glsl";

export default class Leaves {
  private experience!: Experience;
  private scene!: THREE.Scene;
  private LEAVES_COUNT = 100000;

  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;

    this.fallenLeaves();
  }

  private fallenLeaves() {
    const geometry = new THREE.PlaneGeometry(0.1, 0.1);

    const material = new THREE.RawShaderMaterial({
      vertexShader: leavesVertexShader,
      fragmentShader: leavesFragmentShader,
      side: THREE.DoubleSide,
      transparent: true,
      uniforms:{
        uWindFrequency:{value: new THREE.Vector3(2.0, 0.0, 2.0)}
      }
    });

    const instancedMesh = new THREE.InstancedMesh(
      geometry,
      material,
      this.LEAVES_COUNT
    );

    const dummy = new THREE.Object3D();

    for (let i = 0; i < this.LEAVES_COUNT; i++) {
      const x = (Math.random() - 0.5) * 150; 
      const y = 0.001; 
      const z = (Math.random() - 0.5) * 150;

      dummy.position.set(x, y, z);
      dummy.rotation.x = -Math.PI / 2; 
      dummy.rotation.z = Math.random() * Math.PI * 2; 
      dummy.updateMatrix();

      instancedMesh.setMatrixAt(i, dummy.matrix);
    }

    instancedMesh.instanceMatrix.needsUpdate = true;

    this.scene.add(instancedMesh);
  }
}
