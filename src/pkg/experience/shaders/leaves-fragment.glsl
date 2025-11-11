 precision highp float;
        varying vec2 vUv;

        void main() {
            gl_FragColor = vec4(vUv.y, 0.3, 0.0, 1.0);
        }