import * as THREE from 'https://unpkg.com/three@0.152.2/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.152.2/examples/jsm/controls/OrbitControls.js';

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color('#f0fdf4'); // pale green

const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(0, 4, 10);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Lighting
const ambient = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambient);
const directional = new THREE.DirectionalLight(0xffffff, 0.8);
directional.position.set(5, 10, 7.5);
scene.add(directional);

// Ground
const groundGeo = new THREE.PlaneGeometry(100, 100);
const groundMat = new THREE.MeshPhongMaterial({ color: '#a7f3d0' });
const ground = new THREE.Mesh(groundGeo, groundMat);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// Flower geometry
const flowerGeo = new THREE.SphereGeometry(0.5, 32, 32);
const flowerMat = new THREE.MeshStandardMaterial({ color: '#f472b6' });

// Memory messages
const messages = [
  "🌸 December — We began something beautiful.",
  "🌼 January — Your laugh became my favorite sound.",
  "🌷 February — Our late night talks got deeper.",
  "🌻 March — I fell in love with your mind.",
  "🌺 April — We dreamed of our little cat café.",
  "🌹 May — Your presence was my peace.",
  "🌾 June — We made distance feel like closeness.",
  "🌿 July — 8 months of love, and growing still."
];

// Create 8 flowers in a circle
const flowers = [];
const radius = 5;
for (let i = 0; i < 8; i++) {
  const flower = new THREE.Mesh(flowerGeo, flowerMat.clone());
  const angle = (i / 8) * Math.PI * 2;
  flower.position.set(Math.cos(angle) * radius, 0.5, Math.sin(angle) * radius);
  scene.add(flower);
  flowers.push(flower);
}

// Interaction
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const popup = document.getElementById('popup');

function onClick(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(flowers);
  if (intersects.length > 0) {
    const index = flowers.indexOf(intersects[0].object);
    if (index !== -1) {
      popup.innerHTML = messages[index];
      popup.style.display = 'block';
    }
  }
}
window.addEventListener('click', onClick);

// Handle resizing
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animate
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();
