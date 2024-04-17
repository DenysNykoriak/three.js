import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";

const canvas = document.querySelector("canvas.webgl");

const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
};

//Textures
const textureLoader = new THREE.TextureLoader();

const matcapTexture1 = textureLoader.load("/assets/matcaps/1.png");
matcapTexture1.colorSpace = THREE.SRGBColorSpace;
const matcapTexture8 = textureLoader.load("/assets/matcaps/8.png");
matcapTexture8.colorSpace = THREE.SRGBColorSpace;

//Fonts
const fontLoader = new FontLoader();

fontLoader.load("/fonts/gentilis_regular.typeface.json", (font) => {
	const textGeometry = new TextGeometry("Hello Three.js", {
		font,
		size: 0.5,
		height: 0.2,
		curveSegments: 3,
		bevelEnabled: true,
		bevelThickness: 0.03,
		bevelSize: 0.02,
		bevelOffset: 0,
		bevelSegments: 3,
	});
	textGeometry.center();

	const textMaterial = new THREE.MeshMatcapMaterial({
		matcap: matcapTexture8,
	});
	const text = new THREE.Mesh(textGeometry, textMaterial);
	scene.add(text);
});

// Scene
const scene = new THREE.Scene();

//AxesHelper
// const axesHelper = new THREE.AxesHelper(2);
// scene.add(axesHelper);

//Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
scene.add(camera);

//Renderer
const renderer = new THREE.WebGLRenderer({
	canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

window.addEventListener("resize", () => {
	// Update sizes
	sizes.width = window.innerWidth;
	sizes.height = window.innerHeight;

	// Update camera
	camera.aspect = sizes.width / sizes.height;
	camera.updateProjectionMatrix();

	// Update renderer
	renderer.setSize(sizes.width, sizes.height);
});

//Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

//Objects

const torusGeometry = new THREE.TorusGeometry(0.3, 0.2, 16, 32);
const torusMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture1 });

for (let i = 0; i < 1000; i++) {
	const torus = new THREE.Mesh(torusGeometry, torusMaterial);

	torus.position.x = (Math.random() - 0.5) * 10;
	torus.position.y = (Math.random() - 0.5) * 10;
	torus.position.z = (Math.random() - 0.5) * 10;
	torus.rotation.x = Math.random() * Math.PI;
	torus.rotation.y = Math.random() * Math.PI;
	const scale = Math.random();
	torus.scale.set(scale, scale, scale);
	scene.add(torus);
}

// const cube = new THREE.Mesh(
// 	new THREE.BoxGeometry(1, 1, 1),
// 	new THREE.MeshBasicMaterial(),
// );
// scene.add(cube);

//Animation
const clock = new THREE.Clock();

const tick = () => {
	const elapsedTime = clock.getElapsedTime();

	controls.update();
	renderer.render(scene, camera);

	window.requestAnimationFrame(tick);
};

tick();
