import * as THREE from "three";
import Experience from "../Experience";
import RAPIER from "@dimforge/rapier3d-compat";
import { GLTFLoader } from "three/examples/jsm/Addons.js";

export default class Player {
    private experience: Experience;
    private scene: THREE.Scene;
    private player: THREE.Object3D | null = null;
    private camera: THREE.Camera;

    private MOVEMENT_SPEED = 3;
    private ROTATION_ANGLE = 0;
    private FLOATING_DISTANCE = 1.0
    private FLOAT_TIME = 0.0;
    private cameraOffset = new THREE.Vector3(-15, 15, -15);

    private keys: Record<string, boolean> = {};

    private body!: RAPIER.RigidBody

    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.camera = this.experience.camera.instance;
        this.setupInput();
        this.createCharacter()
    }

    private createCharacter() {
        const loader = new GLTFLoader()
        loader.load("/models/robot-raw.glb", (glb) => {
            const root = glb.scene;
            root.traverse((child) => {
                if ((child as THREE.Mesh).isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
            root.rotation.set(-Math.PI / 2, 0, -Math.PI);
            root.scale.set(1, 1, 1);
            root.updateWorldMatrix(true, true);
            const box = new THREE.Box3().setFromObject(root);
            const size = new THREE.Vector3();
            box.getSize(size);
            const radius = Math.min(size.x, size.y, size.z) / 2;
            this.createPhysicsBody(radius);
            this.player = root;
            this.scene.add(this.player);
        });

    }

    private createPhysicsBody(radius: number) {
        const world = this.experience.physics.world;
        const rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic()
            .setTranslation(0, radius, 0)
            .lockRotations();

        this.body = world.createRigidBody(rigidBodyDesc);
        this.body.setGravityScale(0, true)
        const collider = RAPIER.ColliderDesc.ball(radius);
        world.createCollider(collider, this.body);
    }

    private setupInput() {
        window.addEventListener("keydown", (e) => {
            this.keys[e.key.toLowerCase()] = true;
        });

        window.addEventListener("keyup", (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });
    }

    private updatePosition() {
        let moveX = 0, moveZ = 0;

        if (this.keys["w"]) {
            moveX += 1.0;
            this.ROTATION_ANGLE = 0;
        }
        if (this.keys["s"]) {
            moveX -= 1.0;
            this.ROTATION_ANGLE = Math.PI;
        }
        if (this.keys["a"]) {
            moveZ -= 1.0;
            this.ROTATION_ANGLE = Math.PI / 2;
        }
        if (this.keys["d"]) {
            moveZ += 1.0;
            this.ROTATION_ANGLE = -Math.PI / 2;
        }

        const len = Math.hypot(moveX, moveZ);
        if (len > 0) {
            moveX /= len;
            moveZ /= len;
        }

        if (this.player && (moveX !== 0 || moveZ !== 0)) {
            this.player.rotation.z = THREE.MathUtils.lerp(
                this.player.rotation.z,
                this.ROTATION_ANGLE,
                0.15
            );
        }

        const vel = new RAPIER.Vector3(moveX * this.MOVEMENT_SPEED, 0, moveZ * this.MOVEMENT_SPEED);
        this.body.setLinvel(vel, true);
    }

    update() {
        if (!this.player) return;
        this.updatePosition()

        this.FLOAT_TIME += this.experience.time.delta * 0.002; 
        const floatOffset = Math.sin(this.FLOAT_TIME) * 0.05; 

        const t = this.body.translation();
        this.player.position.set(t.x, t.y + floatOffset + this.FLOATING_DISTANCE, t.z);

        const offset = this.cameraOffset.clone();
        const targetPos = this.player.position.clone().add(offset);
        this.camera.position.lerp(targetPos, 0.15);

        const lookAtPoint = this.player.position.clone().add(new THREE.Vector3(0, 1.5, 0));
        this.camera.lookAt(lookAtPoint);
    }
}
