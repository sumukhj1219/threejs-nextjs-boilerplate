import * as THREE from "three"

interface TextManagerOptions {
    root: THREE.Object3D;
    meshName: string;
    text: string;
    width?: number;
    height?: number;
    fontSize?: number;
    background?: string;
    color?: string;
}

export default class TextManager {
    private root: THREE.Object3D;
    private meshName: string;
    private text: string;

    private width: number;
    private height: number;
    private fontSize: number;
    private background: string;
    private color: string;

    constructor(options: TextManagerOptions) {
        this.root = options.root;
        this.meshName = options.meshName;
        this.text = options.text;

        this.width = options.width ?? 1024;
        this.height = options.height ?? 512;
        this.fontSize = options.fontSize ?? 90;
        this.background = options.background ?? "#000";
        this.color = options.color ?? "#fff";

        this.applyText();
    }

    private applyText() {
        const mesh = this.root.getObjectByName(this.meshName) as THREE.Mesh;
        mesh.rotation.z


        if (!mesh) {
            return;
        }

        const texture = this.createTexture();
        texture.center.set(0.5, 0.5);
        texture.rotation = Math.PI / 2;
        texture.needsUpdate = true;
        texture.repeat.x = -1;

        mesh.material = new THREE.MeshBasicMaterial({
            map: texture
        });

        mesh.material.needsUpdate = true;

        mesh.material.side = THREE.DoubleSide;
    }


    private createTexture() {
        const canvas = document.createElement("canvas");
        canvas.width = this.width;
        canvas.height = this.height;

        const ctx = canvas.getContext("2d")!;
        ctx.fillStyle = this.background;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = this.color;
        ctx.font = `400 ${this.fontSize}px Annie Use Your Telescope`;
        ctx.textAlign = "center";
        ctx.fillText(this.text, canvas.width / 2, canvas.height / 2);

        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;
        return texture;
    }
}