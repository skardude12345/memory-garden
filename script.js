import * as THREE from 'https://cdn.skypack.dev/three@0.152.2';

let scene = new THREE.Scene();
scene.background = new THREE.Color('#fceff9');
let camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Light
let light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(2, 2, 5).normalize();
scene.add(light);

// Ground
let groundGeo = new THREE.PlaneGeometry(100, 100);
let groundMat = new THREE.MeshPhongMaterial({ color: '#aef1c2' });
let ground = new THREE.Mesh(groundGeo, groundMat);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// Flower (a pink sphere for now)
let flowerGeo = new THREE.SphereGeometry(0.5, 32, 32);
let flowerMat = new THREE.MeshStandardMaterial({ color: '#ff9fcf' });
let flower = new THREE.Mesh(flowerGeo, flowerMat);
flower.position.set(0, 0.5, 0);
scene.add(flower);

// Raycaster for click interaction
let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();

function onMouseClick(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  let intersects = raycaster.intersectObjects([flower]);
  if (intersects.length > 0) {
    document.getElementById('popup').style.display = 'block';
  }
}
window.addEventListener('click', onMouseClick, false);

camera.position.z = 5;

function animate() {
  requestAnimationFrame(animate);
  flower.rotation.y += 0.01;
  renderer.render(scene, camera);
}
animate();
