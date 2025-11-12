precision highp float;

varying float vFar;
varying vec2 vUv;

void main() {
    vec3 nearColor = vec3(vUv.y, 0.45, 0.0);
    
    vec3 farColor = mix(vec3(0.7, 0.8, 0.6), nearColor, 0.2);

    vec3 color = mix(nearColor, farColor, vFar);

    gl_FragColor = vec4(color, 1.0 - vFar * 0.4);
}
