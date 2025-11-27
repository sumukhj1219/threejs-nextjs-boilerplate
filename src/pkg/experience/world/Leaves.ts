import * as THREE from "three";
import Experience from "../Experience";
import leavesVertexShader from "../shaders/leaves-vertex.glsl";
import leavesFragmentShader from "../shaders/leaves-fragment.glsl";
import Player from "./Player";

export default class Leaves {
  private experience!: Experience;
  private scene!: THREE.Scene;
  private LEAVES_COUNT = 150000;
  public player!: Player
  private instancedMesh!: THREE.InstancedMesh;
  private leavesData: {
    position: THREE.Vector3;
    velocity: THREE.Vector3;
    flying: boolean;
  }[] = [];

  constructor() {
    this.experience = new Experience();
    this.player = this.experience.world.player
    this.scene = this.experience.scene;

    this.fallenLeaves();
  }

  private fallenLeaves() {
    const geometry = new THREE.PlaneGeometry(0.125, 0.125);

    const material = new THREE.RawShaderMaterial({
      vertexShader: leavesVertexShader,
      fragmentShader: leavesFragmentShader,
      side: THREE.DoubleSide,
      transparent: true,
      uniforms: {
        uWindFrequency: { value: new THREE.Vector3(2.0, 0.0, 2.0) }
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

      this.leavesData[i] = {
        position: new THREE.Vector3(x, y, z),
        velocity: new THREE.Vector3(0, 0, 0),
        flying: false,
      };
    }

    this.instancedMesh = instancedMesh;

    instancedMesh.instanceMatrix.needsUpdate = true;

    this.scene.add(instancedMesh);
  }

   update() {
    const playerPos = this.player.player?.position
    const dt = this.experience.time.delta * 0.001

    const dummy = new THREE.Object3D()

    for (let i = 0; i < this.LEAVES_COUNT; i++) {
      const leaf = this.leavesData[i]

      if (!leaf.flying) {
        const dist = playerPos?.distanceTo(leaf.position) ?? 2.0
        if (dist < 2.0) {
          leaf.flying = true;
          leaf.velocity.set(
            (Math.random() - 0.5) * 10,
            Math.random() * 2 + 2,
            (Math.random() - 0.5) * 10
          );
        }
      }

      if (leaf.flying) {
        leaf.position.x += leaf.velocity.x * dt;
        leaf.position.y += leaf.velocity.y * dt;
        leaf.position.z += leaf.velocity.z * dt;

        leaf.velocity.y -= 0.5 * dt;
        leaf.velocity.multiplyScalar(0.98);
      }

      dummy.position.copy(leaf.position);
      dummy.rotation.x = -Math.PI / 2;
      dummy.rotation.z = Math.random() * Math.PI * 2;
      dummy.updateMatrix();

      this.instancedMesh.setMatrixAt(i, dummy.matrix);
    }

    this.instancedMesh.instanceMatrix.needsUpdate = true;
  }
}
