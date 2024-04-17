import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";

const gui = new GUI();

const canvas = document.querySelector("canvas.webgl");

const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
};

//Scene
const scene = new THREE.Scene();

//AxesHelper
// const axesHelper = new THREE.AxesHelper(1);
// scene.add(axesHelper);

//Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
scene.add(camera);

//Renderer
const renderer = new THREE.WebGLRenderer({
	canvas,
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);

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

//----------------------------------------------------------------

//Objects
const material = new THREE.MeshStandardMaterial({
	roughness: 0.4,
});
const sunMaterial = new THREE.MeshStandardMaterial({
	emissive: 0xffff00,
	emissiveIntensity: 1,
});

const sunGroup = new THREE.Group();
sunGroup.position.x = -1.5;

const sphere = new THREE.Mesh(
	new THREE.SphereGeometry(0.5, 32, 32),
	sunMaterial,
);
sunGroup.add(sphere);

const planeGeometry = new THREE.PlaneGeometry(1, 1, 100, 100);
const plane = new THREE.Mesh(planeGeometry, material);
plane.position.y = -1;
plane.rotation.x = -Math.PI * 0.5;
plane.scale.set(10, 10, 10);
plane.receiveShadow = true;

const torus = new THREE.Mesh(
	new THREE.TorusGeometry(0.3, 0.2, 16, 32),
	material,
);
torus.position.x = 1.5;
torus.castShadow = true;

scene.add(sunGroup, plane, torus);

//Light

const lightDebug = {
	showHelper: false,
};

const ambientLight = new THREE.AmbientLight(0xffffff, 1);

gui
	.add(ambientLight, "intensity")
	.min(0)
	.max(2)
	.step(0.001)
	.name("ambientLightIntensity");

scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(
	new THREE.Color("#203A43"),
	1,
);
directionalLight.position.x = 1;
directionalLight.position.y = 4;
directionalLight.position.z = 1;
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 1024 * 2;
directionalLight.shadow.mapSize.height = 1024 * 2;
directionalLight.shadow.camera.near = 2;
directionalLight.shadow.camera.far = 7;
directionalLight.shadow.camera.top = 4;
directionalLight.shadow.camera.right = 4;
directionalLight.shadow.camera.bottom = -4;
directionalLight.shadow.camera.left = -4;
scene.add(directionalLight);

const directionalLightHelper = new THREE.DirectionalLightHelper(
	directionalLight,
	1,
);
const cameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera);

const pointLight = new THREE.PointLight("#FFF200", 1, 20, 0.5);
pointLight.castShadow = true;
sunGroup.add(pointLight);

gui
	.add(lightDebug, "showHelper")
	.name("Show Light Helpers")
	.onChange(() => {
		if (lightDebug.showHelper) {
			scene.add(directionalLightHelper);
			scene.add(cameraHelper);
		} else {
			scene.remove(directionalLightHelper);
			scene.remove(cameraHelper);
		}
	});

//----------------------------------------------------------------

//Animation
const clock = new THREE.Clock();

const tick = () => {
	const elapsedTime = clock.getElapsedTime();

	torus.rotation.x = elapsedTime * 0.5;
	torus.rotation.y = elapsedTime * 0.5;
	torus.rotation.z = elapsedTime * 0.5;
	sunGroup.rotation.y = elapsedTime * 0.1;

	torus.position.x = Math.cos(elapsedTime) * 2.5;
	torus.position.z = Math.sin(elapsedTime) * 2.5;

	sunGroup.position.x = Math.cos(elapsedTime) * 0.5;
	sunGroup.position.z = Math.sin(elapsedTime) * 0.5;

	controls.update();
	renderer.render(scene, camera);

	window.requestAnimationFrame(tick);
};

tick();
