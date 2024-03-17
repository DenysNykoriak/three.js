import gsap from "gsap";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

//Axes helper
// const axesHelper = new THREE.AxesHelper(2);
// scene.add(axesHelper);

//Object
const group = new THREE.Group();
scene.add(group);

const cube1 = new THREE.Mesh(
	new THREE.BoxGeometry(1, 1, 1),
	new THREE.MeshBasicMaterial({ color: 0xff0000 }),
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
