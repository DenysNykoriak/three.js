import gsap from "gsap";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";

const gui = new GUI();
const debugObject = {
	wireframe: false,
	segments: 1,
};

const loadingManager = new THREE.LoadingManager();
loadingManager.onStart = () => {};
loadingManager.onLoad = () => {
	console.log("loaded");
};
loadingManager.onProgress = () => {};
loadingManager.onError = (url) => {
	console.error(`error loading: ${url}`);
};

const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

//Axes helper
// const axesHelper = new THREE.AxesHelper(2);
// scene.add(axesHelper);

//Texture
const textureLoader = new THREE.TextureLoader(loadingManager);
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

//Object
const group = new THREE.Group();
scene.add(group);

const cube1 = new THREE.Mesh(
	new THREE.BoxGeometry(1, 1, 1),
	new THREE.MeshBasicMaterial({ map: doorColorTexture }),
);
cube1.position.x = -1.5;
group.add(cube1);

const cube2 = new THREE.Mesh(
	new THREE.BoxGeometry(1, 1, 1),
	new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
);
group.add(cube2);

const cube3 = new THREE.Mesh(
	new THREE.BoxGeometry(1, 1, 1),
	new THREE.MeshBasicMaterial({ color: 0x0000ff }),
);
cube3.position.x = 1.5;
group.add(cube3);
// gui.add(cube3.position, "x").min(-3).max(3).step(0.01).name("cube3X");

gui
	.add(debugObject, "wireframe")
	.name("wireframe")
	.onChange(() => {
		if (debugObject.wireframe) {
			cube1.material.wireframe = true;
			cube2.material.wireframe = true;
			cube3.material.wireframe = true;
		} else {
			cube1.material.wireframe = false;
			cube2.material.wireframe = false;
			cube3.material.wireframe = false;
		}
	});
gui
	.add(debugObject, "segments")
	.min(1)
	.max(100)
	.step(1)
	.name("segments")
	.onChange(() => {
		cube1.geometry.dispose();
		cube1.geometry = new THREE.BoxGeometry(
			1,
			1,
			1,
			debugObject.segments,
			debugObject.segments,
			debugObject.segments,
		);
		cube2.geometry.dispose();
		cube2.geometry = new THREE.BoxGeometry(
			1,
			1,
			1,
			debugObject.segments,
			debugObject.segments,
			debugObject.segments,
		);
		cube3.geometry.dispose();
		cube3.geometry = new THREE.BoxGeometry(
			1,
			1,
			1,
			debugObject.segments,
			debugObject.segments,
			debugObject.segments,
		);
	});

// Camera
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
};

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
scene.add(camera);

//Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Renderer
const renderer = new THREE.WebGLRenderer({
	canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// renderer.render(scene, camera);

window.addEventListener("resize", () => {
	// Update sizes
	sizes.width = window.innerWidth;
	sizes.height = window.innerHeight;

	// Update camera
	camera.aspect = sizes.width / sizes.height;
	camera.updateProjectionMatrix();

	// Update renderer
	renderer.setSize(sizes.width, sizes.height);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// gsap.to(group.rotation, {
// 	duration: 5,
// 	x: Math.PI * 2,
// 	y: Math.PI * 2,
// 	repeat: -1,
// 	ease: "sine",
// });

// const clock = new THREE.Clock();

// gsap.to(camera.position, {
// 	duration: 1,
// 	repeat: -1,
// 	yoyo: true,
// 	ease: "none",
// 	onUpdate: () => {
// 		const elapsedTime = clock.getElapsedTime();

// 		gsap.set(group.rotation, {
// 			x: Math.sin(elapsedTime),
// 			y: Math.cos(elapsedTime),
// 		});
// 	},
// });

// const clock = new THREE.Clock();

// const cursor = {
// 	x: 0,
// 	y: 0,
// };

// window.addEventListener("mousemove", (event) => {
// 	cursor.x = event.clientX / sizes.width - 0.5;
// 	cursor.y = -(event.clientY / sizes.height - 0.5);
// });

//Animation
const tick = () => {
	// const elapsedTime = clock.getElapsedTime();
	// console.log(elapsedTime);

	// camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3;
	// camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3;
	// camera.position.y = cursor.y * 5;
	// camera.lookAt(group.position);

	// group.rotation.y += 0.0001;
	// group.rotation.x += 0.0001;
	controls.update();

	renderer.render(scene, camera);

	window.requestAnimationFrame(tick);
};

tick();
