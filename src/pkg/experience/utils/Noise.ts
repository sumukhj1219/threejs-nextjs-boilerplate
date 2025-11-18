import * as THREE from "three"

export async function generateHeightForPhysics() {
    const img = await new Promise<HTMLImageElement>((resolve) => {
        const image = new Image();
        image.src = "/textures/noise/noiseTexture.png";
        image.onload = () => resolve(image);
    });

    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0);

    const imgData = ctx.getImageData(0, 0, img.width, img.height);

    const data = new Float32Array(img.width * img.height);

    for (let i = 0; i < data.length; i++) {
        const r = imgData.data[i * 4] / 255;
        data[i] = r;
    }

    const texture = new THREE.DataTexture(
        data,
        img.width,
        img.height,
        THREE.RedFormat,
        THREE.FloatType
    );

    texture.needsUpdate = true;

    return texture;
}


export function generateHeightTexture() {
    const loader = new THREE.TextureLoader()
    const texture = loader.load("/textures/noise/noiseTexture.png")

    texture.wrapS = THREE.ClampToEdgeWrapping
    texture.wrapT = THREE.ClampToEdgeWrapping
    texture.needsUpdate = true

    return texture
}
