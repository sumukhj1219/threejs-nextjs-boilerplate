 uniform sampler2D baseTexture;
 varying vec2 vUv;

                void main() {
    float y = vUv.y;

    // Smooth bright center glow
    float centerGlow = 1.0 - abs(y - 0.5) * 1.6;
    centerGlow = pow(centerGlow, 2.0);

    // Warm yellow mix
    vec3 yellow = vec3(1.9, 1.6, 0.4);
    vec3 amber  = vec3(2.2, 1.0, 0.2);
    vec3 base = mix(yellow, amber, y * 0.5);

    base *= centerGlow * 6.5; // Glow boost

    gl_FragColor = vec4(base, 1.0);
}
