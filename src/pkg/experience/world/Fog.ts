import { Scene } from "three";
import Experience from "../Experience";
import * as THREE from "three";

export default class Fog {
    private experience!: Experience;
    private scene!: Scene;

    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.createFog()
    }

    private createFog() {
        this.scene.fog = new THREE.Fog( 0xcccccc, 10, 100 );
    }
}