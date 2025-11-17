import * as THREE from "three";
import Experience from "../Experience";

export default class Player {
    private experience: Experience;
    private scene: THREE.Scene;
    private player: THREE.Mesh;
    private camera: THREE.Camera;

    private MOVEMENT_SPEED = 0.1;
    private cameraOffset = new THREE.Vector3(-15, 15, -15);

    private keys: Record<string, boolean> = {};

    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.camera = this.experience.camera.instance;

        this.player = this.createCharacter();
        this.setupInput();
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

    private setupInput() {
        window.addEventListener("keydown", (e) => {
            this.keys[e.key.toLowerCase()] = true;
        });

        window.addEventListener("keyup", (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });
    }

    private handleMovement() {
        if (this.keys["a"]) this.player.position.z -= this.MOVEMENT_SPEED;
        if (this.keys["d"]) this.player.position.z += this.MOVEMENT_SPEED;
        if (this.keys["s"]) this.player.position.x -= this.MOVEMENT_SPEED;
        if (this.keys["w"]) this.player.position.x += this.MOVEMENT_SPEED;
    }

    private handleCameraControls(){
        
    }

    update() {
        this.handleMovement();

        const offset = this.cameraOffset.clone();

        const targetPosition = this.player.position.clone().add(offset);
        this.camera.position.lerp(targetPosition, 0.15);

        const lookAtPoint = this.player.position.clone();
        lookAtPoint.y += 1.5;
        this.camera.lookAt(lookAtPoint);
    }
}
