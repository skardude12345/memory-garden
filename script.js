// Memory Garden - Upgraded Anniversary Version
import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js';

// Scene setup
const scene = new THREE.Scene();

// Gradient sky shader
const skyGeo = new THREE.SphereGeometry(500, 32, 15);
const skyMat = new THREE.ShaderMaterial({
  side: THREE.BackSide,
  uniforms: {
    topColor: { value: new THREE.Color('#87CEFA') },
    bottomColor: { value: new THREE.Color('#f0f8ff') },
    offset: { value: 33 },
    exponent: { value: 0.6 }
  },
  vertexShader: `
    varying vec3 vWorldPosition;
    void main() {
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPosition.xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 topColor;
    uniform vec3 bottomColor;
    uniform float offset;
    uniform float exponent;
    varying vec3 vWorldPosition;
    void main() {
      float h = normalize(vWorldPosition + offset).y;
      gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
    }
  `
});
scene.add(new THREE.Mesh(skyGeo, skyMat));

// Camera
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 10, 25);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.physicallyCorrectLights = true;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const sunLight = new THREE.DirectionalLight(0xfff0e5, 1.5);
sunLight.position.set(30, 50, 20);
sunLight.castShadow = true;
sunLight.shadow.mapSize.set(2048, 2048);
sunLight.shadow.camera.left = -50;
sunLight.shadow.camera.right = 50;
sunLight.shadow.camera.top = 50;
sunLight.shadow.camera.bottom = -50;
scene.add(sunLight);

// Ground
const groundMaterial = new THREE.MeshStandardMaterial({ color: '#a8d5a2', roughness: 1 });
const ground = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

// Path
const path = new THREE.Mesh(
  new THREE.PlaneGeometry(8, 100),
  new THREE.MeshStandardMaterial({ color: '#d2b48c' })
);
path.rotation.x = -Math.PI / 2;
path.position.y = 0.01;
scene.add(path);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enableZoom = false;
controls.maxPolarAngle = Math.PI / 2.2;
controls.minPolarAngle = Math.PI / 3;

// Flowers
function createFlower(x, z, type) {
  const group = new THREE.Group();

  const stem = new THREE.Mesh(
    new THREE.CylinderGeometry(0.1, 0.1, 2),
    new THREE.MeshStandardMaterial({ color: '#228B22' })
  );
  stem.position.y = 1;
  group.add(stem);

  const colors = ['#ffd1dc', '#ffb6c1', '#e6a8d7', '#ffc0cb', '#f9c5d1', '#fffacd', '#e0bbff'];
  const petalMaterial = new THREE.MeshStandardMaterial({ color: colors[Math.floor(Math.random() * colors.length)] });

  if (type === 'daisy') {
    for (let i = 0; i < 8; i++) {
      const petal = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.5, 0.1), petalMaterial);
      const angle = (i / 8) * Math.PI * 2;
      petal.position.set(Math.cos(angle) * 0.3, 2, Math.sin(angle) * 0.3);
      petal.rotation.y = angle;
      petal.rotation.x = Math.PI / 8;
      group.add(petal);
    }
  } else {
    for (let i = 0; i < 6; i++) {
      const petal = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), petalMaterial);
      const angle = (i / 6) * Math.PI * 2;
      petal.position.set(Math.cos(angle) * 0.4, 2, Math.sin(angle) * 0.4);
      group.add(petal);
    }
  }

  const center = new THREE.Mesh(
    new THREE.SphereGeometry(0.2),
    new THREE.MeshStandardMaterial({ color: 'yellow' })
  );
  center.position.y = 2;
  group.add(center);

  group.position.set(x, 0, z);
  group.castShadow = true;
  scene.add(group);
}

for (let i = 0; i < 60; i++) {
  const x = Math.random() * 80 - 40;
  const z = Math.random() * 80 - 40;
  createFlower(x, z, Math.random() > 0.5 ? 'tulip' : 'daisy');
}

// Trees
function createTree(x, z, size = 2.5, color = '#2e8b57') {
  const group = new THREE.Group();

  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.3, 0.5, 4),
    new THREE.MeshStandardMaterial({ color: '#8b5a2b' })
  );
  trunk.position.y = 2;
  group.add(trunk);

  const leaves = new THREE.Mesh(
    new THREE.SphereGeometry(size, 16, 16),
    new THREE.MeshStandardMaterial({ color })
  );
  leaves.position.y = 5;
  group.add(leaves);

  group.position.set(x, 0, z);
  group.castShadow = true;
  scene.add(group);
}

for (let i = 0; i < 10; i++) {
  const x = Math.random() * 80 - 40;
  const z = Math.random() * 80 - 40;
  const colors = ['#2e8b57', '#4caf50', '#3cb371'];
  createTree(x, z, 2.5 + Math.random(), colors[Math.floor(Math.random() * colors.length)]);
}

// Clouds
const cloudTexture = new THREE.TextureLoader().load('assets/clouds.png');
const clouds = [];
function createCloud(x, z) {
  const cloud = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 6),
    new THREE.MeshBasicMaterial({ map: cloudTexture, transparent: true, opacity: 0.85, depthWrite: false })
  );
  cloud.position.set(x, 20, z);
  scene.add(cloud);
  clouds.push(cloud);
}
for (let i = 0; i < 12; i++) {
  createCloud(Math.random() * 100 - 50, Math.random() * 100 - 50);
}

// Fireflies (glow particles)
const fireflyGeometry = new THREE.BufferGeometry();
const fireflyCount = 100;
const positions = new Float32Array(fireflyCount * 3);
for (let i = 0; i < fireflyCount; i++) {
  positions[i * 3] = Math.random() * 80 - 40;
  positions[i * 3 + 1] = Math.random() * 10 + 1;
  positions[i * 3 + 2] = Math.random() * 80 - 40;
}
fireflyGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const fireflyMaterial = new THREE.PointsMaterial({ color: 0xffffaa, size: 0.2, transparent: true, opacity: 0.8 });
const fireflies = new THREE.Points(fireflyGeometry, fireflyMaterial);
scene.add(fireflies);

// Popup
const popup = document.getElementById('popup');
function showPopup(text) {
  popup.textContent = text;
  popup.style.display = 'block';
  setTimeout(() => (popup.style.display = 'none'), 3000);
}
window.addEventListener('click', () => {
  showPopup("You're walking through our memory garden 🌸");
});

// Music toggle
const music = new Audio('assets/bg-music.mp3');
music.loop = true;
let isPlaying = false;

const toggleBtn = document.createElement('button');
toggleBtn.innerText = '🎵 Toggle Music';
toggleBtn.style.position = 'absolute';
toggleBtn.style.top = '10px';
toggleBtn.style.left = '10px';
toggleBtn.style.padding = '8px';
toggleBtn.style.borderRadius = '8px';
toggleBtn.style.background = '#fff5f5';
toggleBtn.style.border = '1px solid #ccc';
document.body.appendChild(toggleBtn);

toggleBtn.onclick = () => {
  if (!isPlaying) {
    music.play();
    toggleBtn.innerText = '⏸ Pause Music';
  } else {
    music.pause();
    toggleBtn.innerText = '🎵 Toggle Music';
  }
  isPlaying = !isPlaying;
};

// Animate
function animate() {
  requestAnimationFrame(animate);
  controls.update();

  sunLight.intensity = 1.5 + Math.sin(Date.now() * 0.001) * 0.05;

  clouds.forEach(cloud => {
    cloud.position.x += 0.01;
    if (cloud.position.x > 60) cloud.position.x = -60;
    cloud.lookAt(camera.position);
  });

  const time = Date.now() * 0.001;
  fireflies.position.y = Math.sin(time * 2) * 0.5;

  renderer.render(scene, camera);
}
animate();

// Resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
