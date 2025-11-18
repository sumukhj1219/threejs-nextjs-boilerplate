import * as THREE from "three";
import Experience from "../Experience";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import RAPIER from "@dimforge/rapier3d-compat";

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

        const scale = 1.5 + Math.random() * 0.5;
        rock.scale.setScalar(scale);  
        rock.rotation.y = Math.random() * Math.PI * 2;

        this.scene.add(rock);
        this.createPhysicsBody(rock)
      }
    });
  }

  private createPhysicsBody(rock: THREE.Mesh) {
          const box = new THREE.Box3().setFromObject(rock);
          const size = new THREE.Vector3();
          box.getSize(size);
          const center = new THREE.Vector3();
          box.getCenter(center);
  
          const world = this.experience.physics.world;
          const rigidBodyDesc = RAPIER.RigidBodyDesc.fixed()
              .setTranslation(rock.position.x, rock.position.y, rock.position.z);
          const body = world.createRigidBody(rigidBodyDesc);
          const colliderDesc = RAPIER.ColliderDesc.cuboid(size.x / 2, size.y / 2, size.z / 2);
          world.createCollider(colliderDesc, body);
      }
}
