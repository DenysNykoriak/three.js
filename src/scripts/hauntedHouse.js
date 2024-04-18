import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { randNum } from "../helpers/common";

const canvas = document.querySelector("canvas.webgl");

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

const bricksColorTexture = textureLoader.load("/assets/bricks/color.jpg");
bricksColorTexture.colorSpace = THREE.SRGBColorSpace;
const bricksAmbientOcclusionTexture = textureLoader.load(
	"/assets/bricks/ambientOcclusion.jpg",
);
const bricksNormalTexture = textureLoader.load("/assets/bricks/normal.jpg");
const bricksRoughnessTexture = textureLoader.load(
	"/assets/bricks/roughness.jpg",
);

const GRASS_REPEAT = 18;

const grassColorTexture = textureLoader.load("/assets/grass/color.jpg");
grassColorTexture.colorSpace = THREE.SRGBColorSpace;
grassColorTexture.repeat.set(GRASS_REPEAT, GRASS_REPEAT);
grassColorTexture.wrapS = THREE.RepeatWrapping;
grassColorTexture.wrapT = THREE.RepeatWrapping;
const grassAmbientOcclusionTexture = textureLoader.load(
	"/assets/grass/ambientOcclusion.jpg",
);
grassAmbientOcclusionTexture.repeat.set(GRASS_REPEAT, GRASS_REPEAT);
grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping;
grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping;
const grassNormalTexture = textureLoader.load("/assets/grass/normal.jpg");
grassNormalTexture.repeat.set(GRASS_REPEAT, GRASS_REPEAT);
grassNormalTexture.wrapS = THREE.RepeatWrapping;
grassNormalTexture.wrapT = THREE.RepeatWrapping;
const grassRoughnessTexture = textureLoader.load("/assets/grass/roughness.jpg");
grassRoughnessTexture.repeat.set(GRASS_REPEAT, GRASS_REPEAT);
grassRoughnessTexture.wrapS = THREE.RepeatWrapping;
grassRoughnessTexture.wrapT = THREE.RepeatWrapping;

//Scene
const scene = new THREE.Scene();

//Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 8;
camera.position.y = 3;
scene.add(camera);

//Renderer
const renderer = new THREE.WebGLRenderer({
	canvas,
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setClearColor("#262837");
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

//Axes Helper
// const axesHelper = new THREE.AxesHelper(2);
// scene.add(axesHelper);

//Scene ----------------------------

//Groups
const house = new THREE.Group();
scene.add(house);

const bushes = new THREE.Group();
scene.add(bushes);

const graves = new THREE.Group();
scene.add(graves);

//Lights

const ambientLight = new THREE.AmbientLight("#b9d5ff", 0.12);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight("#b9d5ff", 0.26);
directionalLight.position.set(58.5, 57, 57);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 1024 * 2;
directionalLight.shadow.mapSize.height = 1024 * 2;
directionalLight.shadow.camera.far = 125;
directionalLight.shadow.camera.near = 75;
directionalLight.shadow.camera.left = -25;
directionalLight.shadow.camera.right = 25;
directionalLight.shadow.camera.top = 25;
directionalLight.shadow.camera.bottom = -25;
scene.add(directionalLight);

const doorLight = new THREE.PointLight("#ff7d46", 7, 7);
doorLight.position.set(0, 2.2, 2.5);
house.add(doorLight);

//Fog
const fog = new THREE.Fog("#262837", 12, 20);
scene.fog = fog;

//Objects
const grassMaterial = new THREE.MeshStandardMaterial({
	map: grassColorTexture,
	aoMap: grassAmbientOcclusionTexture,
	normalMap: grassNormalTexture,
	roughnessMap: grassRoughnessTexture,
});
grassMaterial.side = THREE.DoubleSide;
const grassGeometry = new THREE.PlaneGeometry(100, 100);
const grass = new THREE.Mesh(grassGeometry, grassMaterial);
grass.rotation.x = -Math.PI * 0.5;
grass.position.y = -0.001;
grass.receiveShadow = true;
scene.add(grass);

//Walls
const wallsMaterial = new THREE.MeshStandardMaterial({
	map: bricksColorTexture,
	aoMap: bricksAmbientOcclusionTexture,
	normalMap: bricksNormalTexture,
	roughnessMap: bricksRoughnessTexture,
});

const wallsGeometry = new THREE.BoxGeometry(3.5, 2.5, 4);
const walls = new THREE.Mesh(wallsGeometry, wallsMaterial);
walls.position.y = 1.25;
walls.castShadow = true;
house.add(walls);

//Roof
const roofMaterial = new THREE.MeshStandardMaterial({
	color: new THREE.Color("#F37335"),
});
const roofGeometry = new THREE.ConeGeometry(4, 2, 4);
const roof = new THREE.Mesh(roofGeometry, roofMaterial);
roof.position.y = 3.25;
roof.rotation.y = Math.PI * 0.25;
roof.castShadow = true;
house.add(roof);

//Door
const doorMaterial = new THREE.MeshStandardMaterial({
	map: doorColorTexture,
	alphaMap: doorAlphaTexture,
	transparent: true,
	aoMap: doorAmbientOcclusionTexture,
	normalMap: doorNormalTexture,
	displacementMap: doorHeightTexture,
	metalnessMap: doorMetallicTexture,
	roughnessMap: doorRoughnessTexture,
	displacementScale: 0.1,
});
const doorGeometry = new THREE.PlaneGeometry(2, 2, 100, 100);
const door = new THREE.Mesh(doorGeometry, doorMaterial);
door.position.z = 2;
door.position.y = 0.9;
door.castShadow = true;
house.add(door);

//Bushes
const bushMaterial = new THREE.MeshStandardMaterial({
	color: new THREE.Color("#89c854"),
});
const bushGeometry = new THREE.SphereGeometry(0.5, 32, 32);

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
bush1.position.set(2.5, 0.25, 2);
bush1.castShadow = true;
bushes.add(bush1);

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
bush2.position.set(-2.5, 0.25, 2);
bush2.castShadow = true;
bushes.add(bush2);

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
bush3.position.set(2.5, 0.25, -2);
bush3.castShadow = true;
bushes.add(bush3);

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
bush4.position.set(-2.5, 0.25, -2);
bush4.castShadow = true;
bushes.add(bush4);

//Graves
const graveMaterial = new THREE.MeshStandardMaterial({
	color: new THREE.Color("#b2b6b1"),
});
const graveGeometry = new THREE.BoxGeometry(0.5, 0.25, 1);

for (let i = 0; i < 50; i++) {
	const angle = Math.random() * Math.PI * 2;
	const radius = randNum(4, 25);
	const x = Math.sin(angle) * radius;
	const z = Math.cos(angle) * radius;

	const grave = new THREE.Mesh(graveGeometry, graveMaterial);
	grave.position.set(x, 0.125, z);
	grave.rotation.y = Math.random() * Math.PI * 0.25;
	grave.castShadow = true;
	graves.add(grave);
}

//Ghosts
const ghost1 = new THREE.PointLight("#ff00ff", 7, 3);
ghost1.castShadow = true;
scene.add(ghost1);

const ghost2 = new THREE.PointLight("#00ffff", 7, 3);
ghost2.castShadow = true;
scene.add(ghost2);

const ghost3 = new THREE.PointLight("#ffff00", 7, 3);
ghost3.castShadow = true;
scene.add(ghost3);

// -----------------------------------

//Animation
const clock = new THREE.Clock();

const tick = () => {
	const elapsedTime = clock.getElapsedTime();

	const ghost1Angle = elapsedTime * 0.5;
	ghost1.position.x = Math.sin(ghost1Angle) * 4;
	ghost1.position.z = Math.cos(ghost1Angle) * 4;
	ghost1.position.y = Math.sin(elapsedTime * 3) + 1;

	const ghost2Angle = -elapsedTime * 0.32;
	ghost2.position.x = Math.sin(ghost2Angle) * 5;
	ghost2.position.z = Math.cos(ghost2Angle) * 5;
	ghost2.position.y =
		Math.sin(elapsedTime * 3) * Math.sin(elapsedTime * 2.5) + 1;

	const ghost3Angle = -elapsedTime * 0.18;
	ghost3.position.x =
		Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32));
	ghost3.position.z =
		Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32));
	ghost3.position.y = Math.sin(elapsedTime * 3) * Math.sin(elapsedTime * 5) + 1;

	controls.update();
	renderer.render(scene, camera);

	window.requestAnimationFrame(tick);
};

tick();
