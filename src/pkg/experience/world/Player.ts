import * as THREE from "three";
import Experience from "../Experience";
import RAPIER from "@dimforge/rapier3d-compat";

export default class Player {
    private experience: Experience;
    private scene: THREE.Scene;
    private player: THREE.Mesh;
    private camera: THREE.Camera;

    private MOVEMENT_SPEED = 5;
    private cameraOffset = new THREE.Vector3(-15, 15, -15);

    private keys: Record<string, boolean> = {};

    private body!: RAPIER.RigidBody

    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.camera = this.experience.camera.instance;

        this.player = this.createCharacter();
        this.setupInput();
        this.createPhysicsBody()
    }

    private createCharacter() {
        const geometry = new THREE.CapsuleGeometry(0.5, 1);
        const material = new THREE.MeshToonMaterial({ color: "pink" });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        this.scene.add(mesh);

        return mesh;
    }

    private createPhysicsBody() {
        const world = this.experience.physics.world
        const rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic()
            .setTranslation(0, 0, 0)
            .lockRotations();
        const colliderDesc = RAPIER.ColliderDesc.capsule(1, 0.5);
        this.body = world.createRigidBody(rigidBodyDesc);
        world.createCollider(colliderDesc, this.body);

    }

    private setupInput() {
        window.addEventListener("keydown", (e) => {
            this.keys[e.key.toLowerCase()] = true;
        });

        window.addEventListener("keyup", (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });
    }

    private isGrounded(): boolean {
        const bottomY = this.body.translation().y - 1;
        return bottomY <= 0.51;
    }


    private handleMovement() {
        const vel = {
            x: 0,
            y: this.body.linvel().y,
            z: 0
        };

        if (this.keys["w"]) vel.x = this.MOVEMENT_SPEED;
        if (this.keys["s"]) vel.x = -this.MOVEMENT_SPEED;
        if (this.keys["a"]) vel.z = -this.MOVEMENT_SPEED;
        if (this.keys["d"]) vel.z = this.MOVEMENT_SPEED;
        if (this.keys[" "] && this.isGrounded()) {
            const impulse = { x: 0, y: 8, z: 0 };
             vel.y = this.MOVEMENT_SPEED;
        }

        this.body.setLinvel(vel, true);
    }


    update() {
        this.handleMovement();

        const t = this.body.translation()
        this.player.position.set(t.x, t.y, t.z)

        const offset = this.cameraOffset.clone();

        const targetPosition = this.player.position.clone().add(offset);
        this.camera.position.lerp(targetPosition, 0.15);

        const lookAtPoint = this.player.position.clone();
        lookAtPoint.y += 1.5;
        this.camera.lookAt(lookAtPoint);
    }
}
