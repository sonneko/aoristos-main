import * as THREE from 'three';
import { now } from 'three/examples/jsm/libs/tween.module.js';

const draw3d = () => {
    const canvasEle = document.getElementById("canvas");
    if (canvasEle == null) return;

    // 表示の切り替え
    const updateCanvasDisplay = () => {
        const scrollAmount = window.scrollY;
        if (scrollAmount > 600) {
            canvasEle.style.opacity = "1";
        } else {
            canvasEle.style.opacity = "0";
        }
    };
    updateCanvasDisplay();
    window.addEventListener("scroll", updateCanvasDisplay);

    // 描画
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        75,
        canvasEle.clientWidth / canvasEle.clientHeight,
        0.1,
        1000,
    );
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(canvasEle.clientWidth, canvasEle.clientHeight);
    window.addEventListener("resize", () => {
        const width = canvasEle.offsetWidth;
        const height = canvasEle.offsetHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    });

    canvasEle.appendChild(renderer.domElement);

    const firstCubeGeometry = new THREE.BoxGeometry();
    const firstCubeMaterial = new THREE.MeshBasicMaterial({ color: 0x770000 });
    const firstCube = new THREE.Mesh(firstCubeGeometry, firstCubeMaterial);
    scene.add(firstCube);


    const secondPlaneGeometry = new THREE.PlaneGeometry(2, 2);
    const secondPlaneMaterial = new THREE.ShaderMaterial({
        vertexShader: `
varying vec2 vUv; // UV座標をフラグメントシェーダーに渡す
varying float vWaveHeight; // 波の高さをフラグメントシェーダーに渡す

uniform float uTime; // 時間を渡す

void main() {
    vUv = uv;

    // 波の設定
    float waveAmplitude = 0.5; // 波の高さ
    float waveFrequency = 4.0; // 波の密度
    float waveSpeed = 2.0;     // 波の動きの速さ

    // 波の計算（XとYに基づいて波打つ動き）
    float wave = waveAmplitude * sin(waveFrequency * position.x + uTime * waveSpeed) 
                + waveAmplitude * cos(waveFrequency * position.y + uTime * waveSpeed);

    // 波の高さをフラグメントシェーダー用に渡す
    vWaveHeight = wave;

    // 頂点位置に波を加える
    vec3 transformedPosition = position;
    transformedPosition.z += wave;

    // 最終的な頂点位置を計算
    vec4 worldPosition = modelMatrix * vec4(transformedPosition, 1.0);
    vec4 mvPosition = viewMatrix * worldPosition;
    gl_Position = projectionMatrix * mvPosition;
}
Ï
        `,
        fragmentShader: `
varying vec2 vUv;
varying float vWaveHeight;

void main() {
    // 波の高さに基づいた色の変化
    vec3 baseColor = vec3(0.0, 0.4, 0.8); // 基本色
    vec3 highlightColor = vec3(0.8, 0.9, 1.0); // ハイライト色
    float intensity = smoothstep(-0.5, 0.5, vWaveHeight); // 波の高さによる色変化

    vec3 finalColor = mix(baseColor, highlightColor, intensity);

    gl_FragColor = vec4(finalColor, 1.0); // 最終的な色を出力
}
        `,uniforms: {
            uTime: {value: now()}
        }
    });

    const secondPlane = new THREE.Mesh(secondPlaneGeometry, secondPlaneMaterial);
    scene.add(secondPlane);

    firstCube.scale.x = 2;
    firstCube.scale.y = 2;
    firstCube.scale.z = 2;
    camera.position.set(0, 0, 5);


    let lastTime = 0;
    const animate = (time: number) => {
        requestAnimationFrame(animate);
        const deltaTime = (time - lastTime) / 1000;
        lastTime = time;

        const scrollAmount = window.scrollY;

        if (0 < scrollAmount && scrollAmount < 1140) {
            firstCube.scale.x = scrollAmount / 500;
            firstCube.scale.y = scrollAmount / 500;
            firstCube.scale.z = scrollAmount / 500;
            firstCube.rotation.y = scrollAmount / 140 + 39;
            secondPlane.visible = false;
        } else {
            secondPlane.visible = true;
        }

        if (1140 < scrollAmount && scrollAmount < 1200) {
            firstCube.scale.x = 2.28 - (scrollAmount - 1140) / 100;
            firstCube.scale.y = 2.28 - (scrollAmount - 1140) / 100;
            firstCube.scale.z = 2.28 - (scrollAmount - 1140) / 100;
            firstCube.rotation.y = 47.14; secondPlane.visible = false;
        } else {
            secondPlane.visible = true;
        }

        if (1200 < scrollAmount && scrollAmount < 1850) {

        }

        if (1850 < scrollAmount && scrollAmount < 4000) {
            firstCube.visible = false;
            secondPlane.visible = true;
            secondPlane.rotation.x = -Math.PI / 3;
            secondPlane.position.x = -2.5;
        } else {
            firstCube.visible = true;
            secondPlane.visible = false;
            camera.position.y = 0;
        }
        renderer.render(scene, camera);
    };
    animate(lastTime);
};

export default draw3d;