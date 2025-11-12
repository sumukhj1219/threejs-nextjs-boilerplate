uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

uniform float uWindAmplitude;
uniform vec3 uWindFrequency;
uniform float uTime;

attribute vec3 position;
attribute vec2 uv;

varying float vElevation;
varying vec2 vUv;

void main() {
    vec3 pos = position;

    float elevation = 0.0;
    elevation += sin(pos.x * uWindFrequency.x + uTime) * uWindAmplitude;
    elevation += sin(pos.y * uWindFrequency.y + uTime * 1.2) * uWindAmplitude * 0.5;
    elevation += sin(pos.z * uWindFrequency.z + uTime * 0.8) * uWindAmplitude * 0.7;

    pos.x += elevation * 0.2;

    vElevation = elevation;
    vUv = uv;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
