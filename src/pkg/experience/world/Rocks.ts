import * as THREE from "three";
import Experience from "../Experience";
import { GLTFLoader } from "three/examples/jsm/Addons.js";

export default class Rocks {
  private experience!: Experience;
  private scene!: THREE.Scene;
  private TOTAL_ROCKS = 20;

  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;

    this.createRocks();
  }

  private createRocks() {
    const loader = new GLTFLoader();

    loader.load("/models/rock.glb", (glb) => {
      const root = glb.scene;
      const rockMesh: THREE.Mesh[] = [];

      root.traverse((child: any) => {
        if (child.isMesh && child.name.toLowerCase().includes("icosphere")) {
          child.castShadow = true;
          child.receiveShadow = true;
          child.material.color = new THREE.Color("gray")
          rockMesh.push(child);
        }
      });

      for (let i = 0; i < this.TOTAL_ROCKS; i++) {
        const rock = rockMesh[Math.floor(Math.random() * rockMesh.length)].clone();

        rock.position.set(
          (Math.random() - 0.5) * 100, 
          0,
          (Math.random() - 0.5) * 100   
        );

        const scale = 0.5 + Math.random() * 0.5;
        rock.scale.setScalar(scale);

        rock.rotation.y = Math.random() * Math.PI * 2;

        this.scene.add(rock);
      }
    });
  }
}
