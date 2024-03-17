import * as THREE from "three";

const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

//TODO: add lights and hdr environment (rgbe) to the scene

const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
};

//Textures
const textureLoader = new THREE.TextureLoader();
const doorColorTexture = textureLoader.load("/assets/door/color.jpg");
doorColorTexture.colorSpace = THREE.SRGBColorSpace;
const doorAlphaTexture = textureLoader.load("/assets/door/alpha.jpg");
const doorHeightTexture = textureLoader.load("/assets/door/height.png");
const doorNormalTexture = textureLoader.load("/assets/door/normal.jpg");
const doorAmbientOcclusionTexture = textureLoader.load(
	"/assets/door/ambientOcclusion.jpg",
);
const doorMetallicTexture = textureLoader.load("/assets/door/metallic.jpg");
const doorRoughnessTexture = textureLoader.load("/assets/door/roughness.jpg");

//Material
//TODO: change to MeshStandardMaterial
const material = new THREE.MeshBasicMaterial({
	map: doorColorTexture,
	aoMap: doorAmbientOcclusionTexture,
	normalMap: doorNormalTexture,
	displacementMap: doorHeightTexture,
	metalnessMap: doorMetallicTexture,
	roughnessMap: doorRoughnessTexture,
	alphaMap: doorAlphaTexture,
	transparent: true,
});

// Objects
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 64, 64), material);
sphere.position.x = -1.5;
scene.add(sphere);

const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material);
scene.add(plane);

const torus = new THREE.Mesh(
	new THREE.TorusGeometry(0.3, 0.2, 16, 32),
	material,
);
torus.position.x = 1.5;
scene.add(torus);

// Camera
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

//Animation
const clock = new THREE.Clock();

const tick = () => {
	const elapsedTime = clock.getElapsedTime();

	sphere.rotation.y = elapsedTime * 0.2;
	plane.rotation.y = elapsedTime * 0.2;
	torus.rotation.y = elapsedTime * 0.2;

	renderer.render(scene, camera);

	window.requestAnimationFrame(tick);
};

tick();
