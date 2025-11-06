import { Scene, DirectionalLight, Texture, Mesh, MeshStandardMaterial, MeshPhysicalMaterial } from "three";
import Experience from "../Experience";
import Resources from "../utils/Resources";
import * as THREE from "three"

interface EnvironmentMap {
  texture: Texture;
  intensity: number;
}

export default class Environment {
  private experience: Experience;
  public scene: Scene;
  public sunLight!: DirectionalLight;
  private resources: Resources;
  private environmentMap!: EnvironmentMap;

  

  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    // sky
    this.scene.background = new THREE.Color("skyblue")


    this.resources = this.experience.resources;

    this.setSunLight();
    this.setEnvironmentMap();
  }

  private setSunLight() {
    this.sunLight = new DirectionalLight("#ffffff", 3);
    this.sunLight.position.set(5, 5, 5);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.camera.near = 1;
    this.sunLight.shadow.camera.far = 20;
    this.sunLight.shadow.mapSize.set(1024, 1024);

    this.scene.add(this.sunLight);
  }

  private setEnvironmentMap() {
    const envTexture = this.resources.items.environmentMapTexture as Texture;
    console.log(this.resources.items)
    if (!envTexture) {
      console.warn("Environment map texture not loaded yet.");
      return;
    }

    this.environmentMap = {
      texture: envTexture,
      intensity: 0.4,
    };

    this.scene.environment = this.environmentMap.texture;

    const updateMaterial = () => {
      this.scene.traverse((child) => {
        if (child instanceof Mesh) {
          const material = child.material;
          if (
            material instanceof MeshStandardMaterial ||
            material instanceof MeshPhysicalMaterial
          ) {
            material.envMap = this.environmentMap.texture;
            material.envMapIntensity = this.environmentMap.intensity;
            material.needsUpdate = true;
          }
        }
      });
    };

    updateMaterial();

    this.updateMaterial = updateMaterial;
  }

  public updateMaterial!: () => void;
}
