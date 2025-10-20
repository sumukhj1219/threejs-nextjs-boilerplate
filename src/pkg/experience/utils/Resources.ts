import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import EventEmitter from "./EventEmitter";
import * as THREE from "three";

interface Source {
  name: string;
  type: string;
  path: string | string[]; 
}

export default class Resources extends EventEmitter {
  sources: Source[];
  items: Record<string, any>;
  toLoad: number;
  loaded: number;
  loaders?: {
    gltfLoader: GLTFLoader;
    textureLoader: THREE.TextureLoader;
    cubeTextureLoader: THREE.CubeTextureLoader;
  };

  constructor(sources: Source[]) {
    super();
    this.sources = sources;

    this.items = {};
    this.toLoad = this.sources.length;
    this.loaded = 0;

    this.setLoaders();
  }

  private setLoaders() {
    this.loaders = {
      gltfLoader: new GLTFLoader(),
      textureLoader: new THREE.TextureLoader(),
      cubeTextureLoader: new THREE.CubeTextureLoader(),
    };
  }

  public startLoading() {
    for (const source of this.sources) {
      switch (source.type) {
        case "gltf":
          this.loaders?.gltfLoader.load(
            source.path as string,
            (file) => this.sourceLoaded(source, file)
          );
          break;
        case "texture":
          this.loaders?.textureLoader.load(
            source.path as string,
            (file) => this.sourceLoaded(source, file)
          );
          break;
        case "cube":
          this.loaders?.cubeTextureLoader.load(
            source.path as string[],
            (file) => this.sourceLoaded(source, file)
          );
          break;
      }
    }
  }

  private sourceLoaded(source: Source, file: any) {
    this.items[source.name] = file;
    this.loaded++;

    if (this.loaded === this.toLoad) {
      this.trigger("ready");
    }
  }
}
