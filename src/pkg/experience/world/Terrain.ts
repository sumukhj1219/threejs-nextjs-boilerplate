import { Scene } from "three";
import Experience from "../Experience";
import * as THREE from "three";
import RAPIER from "@dimforge/rapier3d-compat";

export default class Terrain {
    private experience!: Experience;
    private scene!: Scene;
    public mesh!: THREE.Mesh;

    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;

        this.createTerrain();
    }

    private createTerrain() {
        const geometry = new THREE.PlaneGeometry(175, 175, 1, 1);
        const material = new THREE.MeshStandardMaterial({
            color: new THREE.Color("orange"),
            side: THREE.DoubleSide,
            metalness: 0,
            roughness: 1,
        });

        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.rotation.x = -Math.PI / 2;
        this.mesh.castShadow = false;
        this.mesh.receiveShadow = true;
        this.mesh.position.y = 0; 
        this.scene.add(this.mesh);

        this.createPhysics();
    }

    private createPhysics() {
        const world = this.experience.physics.world;

        const colliderDesc = RAPIER.ColliderDesc.cuboid(100, 0, 100); 
        const collider = world.createCollider(colliderDesc);
        collider.setTranslation({ x: 0, y: -0.5, z: 0 });
    }
}
