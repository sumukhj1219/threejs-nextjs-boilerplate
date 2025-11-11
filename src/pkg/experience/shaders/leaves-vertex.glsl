precision highp float;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;

attribute vec3 position;
attribute vec2 uv;
attribute mat4 instanceMatrix;

varying vec2 vUv;

void main() {
    vUv = uv;

    vec4 worldPosition = instanceMatrix * vec4(position, 1.0);

    gl_Position = projectionMatrix * viewMatrix * worldPosition;
}
