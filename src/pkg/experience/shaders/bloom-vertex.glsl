varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewDir;

void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vec3 viewPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
    vViewDir = -viewPosition;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
