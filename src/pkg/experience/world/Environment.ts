import { Scene, DirectionalLight, Texture, Mesh, MeshStandardMaterial, MeshPhysicalMaterial } from "three";
import Experience from "../Experience";
import Resources from "../utils/Resources";
import * as THREE from "three"
import Cycle from "./Cycle";
import gsap from "gsap";

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
  private cycle: Cycle

  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    // sky
    this.scene.background = new THREE.Color("skyblue")
    this.cycle = this.experience.world.cycle

    this.resources = this.experience.resources;

    this.setSunLight();
    this.setEnvironmentMap();
  }

  private setSunLight() {
    this.sunLight = new THREE.DirectionalLight(new THREE.Color('white'), 3);
    this.sunLight.castShadow = true;

    const cam = this.sunLight.shadow.camera as THREE.OrthographicCamera;
    cam.near = 0.5;
    cam.far = 100;
    cam.left = -50;
    cam.right = 50;
    cam.top = 50;
    cam.bottom = -50;

    this.sunLight.shadow.mapSize.set(2048, 2048);
    this.sunLight.shadow.bias = -0.002;

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


  update() {
    const A = this.cycle.cycleA;
    const B = this.cycle.cycleB;
    const t = this.cycle.blend;

     this.sunLight.position.lerpVectors(
        new THREE.Vector3(A.x, A.y, A.z),
        new THREE.Vector3(B.x, B.y, B.z),
        t
    )

    this.sunLight.color.lerpColors(
        new THREE.Color(A.color),
        new THREE.Color(B.color),
        t
    );

    this.sunLight.intensity =
        A.sunIntensity + (B.sunIntensity - A.sunIntensity) * t;

    this.scene.background = new THREE.Color().lerpColors(
        new THREE.Color(A.topSkyColor),
        new THREE.Color(B.topSkyColor),
        t
    );
  }
}
