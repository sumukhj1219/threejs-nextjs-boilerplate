import * as THREE from "three";
import Experience from "../Experience";
import bushVertexShader from "../shaders/bush-vetex.glsl";
import bushFragmentShader from "../shaders/bush-fragment.glsl";

export default class Bush {
  private experience!: Experience;
  private scene!: THREE.Scene;
  private PLANES = 150; 
  private BUSH_COUNT = 10; 

  private materials: THREE.RawShaderMaterial[] = [];
  private bushes: THREE.Group[] = [];

  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;

    this.createBushes();
  }

  private createBushPrefab(): THREE.Group {
    const bush = new THREE.Group();

    for (let i = 0; i < this.PLANES; i++) {
      const geometry = new THREE.PlaneGeometry(0.5, 0.5);
      const material = new THREE.RawShaderMaterial({
        vertexShader: bushVertexShader,
        fragmentShader: bushFragmentShader,
        side: THREE.DoubleSide,
        transparent: true,
        depthWrite: false,
        uniforms: {
          uWindFrequency: { value: new THREE.Vector3(0.5, 0.0, 0.5) },
          uWindAmplitude: { value: 0.5 },
          uTime: { value: 0 },
          uTexture: { value: this.experience.resources.items.bushTexture },
        },
      });
      this.materials.push(material);

      const plane = new THREE.Mesh(geometry, material);
      plane.position.set(
        (Math.random() - 0.5) * 1,
        Math.random() * 0.25,
        (Math.random() - 0.5) * 1
      );
      plane.rotation.set(
        Math.random() * Math.PI / 6,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI / 6
      );
      bush.add(plane);
    }

    return bush;
  }

  private createBushes() {
    for (let i = 0; i < this.BUSH_COUNT; i++) {
      const bush = this.createBushPrefab();

      const x = (Math.random() - 0.5) * 150;
      const z = (Math.random() - 0.5) * 150;
      bush.position.set(x, 0, z);
      bush.scale.setScalar(2 + Math.random() * 0.5);
      bush.rotation.y = Math.random() * Math.PI * 2;

      this.scene.add(bush);
      this.bushes.push(bush);
    }
  }

  public update() {
    const time = this.experience.time.elapsed * 0.001;
    this.materials.forEach((mat) => {
      mat.uniforms.uTime.value = time;
    });
  }
}
