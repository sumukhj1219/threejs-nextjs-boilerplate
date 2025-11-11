precision highp float;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

attribute mat4 instanceMatrix;
attribute vec3 position;
attribute vec2 uv;
attribute float aOffset;

uniform float uTime;
uniform vec3 uWindFrequency;
uniform float uWindAmplitude;

varying vec2 vUv;

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

float noise(vec2 p){
    vec2 i = floor(p);
    vec2 f = fract(p);

    float a = rand(i);
    float b = rand(i + vec2(1.0, 0.0));
    float c = rand(i + vec2(0.0, 1.0));
    float d = rand(i + vec2(1.0, 1.0));

    vec2 u = f*f*(3.0-2.0*f);

    return mix(a, b, u.x) +
      (c - a)*u.y*(1.0-u.x) +
      (d - b)*u.x*u.y;
}

void main() {
    vUv = uv;

    float t = uTime * 0.8;

    float randomPhase = rand(vec2(aOffset, aOffset * 2.3));
    float wind =
          sin((position.x * uWindFrequency.x) + (t + randomPhase)) * 0.5;
          sin((position.z * uWindFrequency.y) + (t * 0.7 + randomPhase * 2.0)) * 0.3;
        //   sin((position.y * uWindFrequency.z) + (t * 1.3 + randomPhase * 4.0)) * 0.2;

    float swayFactor = smoothstep(0.0, 0.55, position.y);

    vec3 animatedPosition = position;
    animatedPosition.x += wind * (0.2 + rand(vec2(aOffset * 2.0, 0.0)) * 0.2) * swayFactor;
    // animatedPosition.z += wind * (0.35 + rand(vec2(aOffset * 2.0, 0.0)) * 0.5) * swayFactor;


    vec4 worldPos = instanceMatrix * vec4(animatedPosition, 1.0);

    float patch = noise(worldPos.xz * 0.08);

    float mask = smoothstep(0.40, 0.75, patch);

    animatedPosition *= mask;

    if (patch < 0.40) {
        gl_Position = vec4(0.0);
        return;
    }

    //
    // Height cutoff for dunes (optional)
    // uncomment if terrain Y height exists
    //
    // if (worldPos.y > 1.2) { 
    //     gl_Position = vec4(0.0);
    //     return;
    // }

    worldPos = instanceMatrix * vec4(animatedPosition, 1.0);
    gl_Position = projectionMatrix * modelViewMatrix * worldPos;
}
