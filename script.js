// Memory Garden - Enhanced Anniversary Version
import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js';

// Scene setup
const scene = new THREE.Scene();
const clickableObjects = [];
scene.fog = new THREE.Fog('#f0f8ff', 30, 100);

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
const groundMaterial = new THREE.MeshStandardMaterial({ color: '#a8d5a2', roughness: 5 });
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
const flowerMemories = [
  {
    text: "my angel <3 literally",
    image: "assets/angel.png"
  },
  {
    text: "your lips are the sweetest thing i'll ever taste. yaar i love you",
    image: "assets/kiss.png"
  },
  {
    text: "going to bandra tgt will always be so nice. i love bandstand w u <3",
    image: "assets/bandra.JPG"
  },
  {
    text: "ME WHEN I SEE YOUUUU. ALWAYSSSSS. you were so stunning that day",
    image: "assets/looking.JPG"
  },
  {
    text: "you and your favorite flower <3",
    image: "assets/lily sofia.JPG"
  }
];


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

  const petals = [];
  if (type === 'daisy') {
    for (let i = 0; i < 8; i++) {
      const petal = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.5, 0.1), petalMaterial);
      const angle = (i / 8) * Math.PI * 2;
      petal.position.set(Math.cos(angle) * 0.3, 2, Math.sin(angle) * 0.3);
      petal.rotation.y = angle;
      petal.rotation.x = Math.PI / 8;
      group.add(petal);
      petals.push(petal);
    }
  } else {
    for (let i = 0; i < 6; i++) {
      const petal = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), petalMaterial);
      const angle = (i / 6) * Math.PI * 2;
      petal.position.set(Math.cos(angle) * 0.4, 2, Math.sin(angle) * 0.4);
      group.add(petal);
      petals.push(petal);
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

  // Make clickable
  const memory = flowerMemories[flowers.length % flowerMemories.length];
group.userData.memoryText = memory.text;
group.userData.memoryImage = memory.image;

  flowers.push(group);
  clickableObjects.push(group);

  group.tick = (t) => {
    group.rotation.y = Math.sin(t + x + z) * 0.1;
  };

  scene.add(group);
}

const flowers = [];
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
  group.tick = (t) => {
    leaves.position.x = Math.sin(t + x + z) * 0.1;
  };

  scene.add(group);
  animatedObjects.push(group);
}

// Benches
function createBench(x, z) {
  const bench = new THREE.Group();

  const seat = new THREE.Mesh(
    new THREE.BoxGeometry(3, 0.2, 1),
    new THREE.MeshStandardMaterial({ color: '#a0522d' })
  );
  seat.position.y = 0.5;
  bench.add(seat);

  const back = new THREE.Mesh(
    new THREE.BoxGeometry(3, 1, 0.1),
    new THREE.MeshStandardMaterial({ color: '#8b4513' })
  );
  back.position.set(0, 1, -0.45);
  bench.add(back);

  for (let i = -1; i <= 1; i += 2) {
    const leg1 = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.1, 0.5),
      new THREE.MeshStandardMaterial({ color: '#5c4033' })
    );
    leg1.position.set(i, 0.25, -0.4);
    bench.add(leg1);

    const leg2 = leg1.clone();
    leg2.position.z = 0.4;
    bench.add(leg2);
  }

  bench.position.set(x, 0, z);
  bench.castShadow = true;
  scene.add(bench);
}

for (let i = 0; i < 4; i++) {
  const x = -30 + i * 20;
  const z = -5 + Math.random() * 10;
  createBench(x, z);
}

// Rocks
function createRock(x, z) {
  const rock = new THREE.Mesh(
    new THREE.DodecahedronGeometry(1 + Math.random() * 0.5, 0),
    new THREE.MeshStandardMaterial({ color: '#999999', roughness: 1 })
  );
  rock.position.set(x, 0.5, z);
  rock.rotation.set(Math.random(), Math.random(), Math.random());
  rock.castShadow = true;
  scene.add(rock);
}

for (let i = 0; i < 10; i++) {
  createRock(Math.random() * 80 - 40, Math.random() * 80 - 40);
}

const animatedObjects = [];
for (let i = 0; i < 10; i++) {
  const x = Math.random() * 80 - 40;
  const z = Math.random() * 80 - 40;
  const colors = ['#2e8b57', '#4caf50', '#3cb371'];
  createTree(x, z, 2.5 + Math.random(), colors[Math.floor(Math.random() * colors.length)]);
}

// Bushes
function createBush(x, z) {
  const bush = new THREE.Mesh(
    new THREE.SphereGeometry(1.2, 12, 12),
    new THREE.MeshStandardMaterial({ color: '#3e8e41' })
  );
  bush.position.set(x, 0.9, z);
  bush.castShadow = true;
  scene.add(bush);
  animatedObjects.push({
    tick: (t) => {
      bush.scale.y = 1 + Math.sin(t + x) * 0.05;
    }
  });
}

for (let i = 0; i < 12; i++) {
  createBush(Math.random() * 80 - 40, Math.random() * 80 - 40);
}




// Hearts
const hearts = [];
const heartTexture = new THREE.TextureLoader().load('assets/heart.png');
for (let i = 0; i < 15; i++) {
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: heartTexture, transparent: true }));
  sprite.position.set(Math.random() * 80 - 40, Math.random() * 5 + 5, Math.random() * 80 - 40);
  sprite.scale.set(1.5, 1.5, 1.5);
  scene.add(sprite);
  hearts.push(sprite);
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

function showPopupAt(text, imageSrc = null, x, y) {
  popup.innerHTML = `<div>${text}</div>` +
    (imageSrc ? `<img src="${imageSrc}" style="max-width: 200px; margin-top: 8px;">` : '');

  popup.style.display = 'block'; // temporarily show it to measure
  popup.style.opacity = 0;
  popup.style.left = '0px';
  popup.style.top = '0px';
  popup.style.transform = 'none';

  // Measure popup
  const popupWidth = popup.offsetWidth;
  const popupHeight = popup.offsetHeight;

  // Clamp X so popup doesn't go off-screen
  const margin = 10;
  const clampedX = Math.min(window.innerWidth - margin, Math.max(margin, x));
  const clampedY = Math.min(window.innerHeight - margin, Math.max(margin, y));

  // Adjust to center popup without going outside bounds
  let left = clampedX - popupWidth / 2;
  let top = clampedY - popupHeight - 20; // 20px above the click

  // Clamp again after centering
  left = Math.min(window.innerWidth - popupWidth - margin, Math.max(margin, left));
  top = Math.max(margin, top);

  popup.style.left = `${left}px`;
  popup.style.top = `${top}px`;
  popup.style.opacity = 1;
  popup.classList.add('show');

  setTimeout(() => {
    popup.classList.remove('show');
  }, 6000);
}





const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function getMouseCoords(event) {
  if (event.touches && event.touches.length > 0) {
    return {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY
    };
  } else {
    return {
      x: event.clientX,
      y: event.clientY
    };
  }
}

function handleFlowerClick(event) {
  const { x, y } = getMouseCoords(event);
  mouse.x = (x / window.innerWidth) * 2 - 1;
  mouse.y = -(y / window.innerHeight) * 2 + 1;


  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(clickableObjects, true);
  if (intersects.length > 0) {
    let obj = intersects[0].object;
    while (obj && !obj.userData.memoryText) {
      obj = obj.parent;
    }
    if (obj && obj.userData.memoryText) {
      showPopupAt(obj.userData.memoryText, obj.userData.memoryImage, x, y);
    }
  }
  
}

window.addEventListener('click', handleFlowerClick);
window.addEventListener('touchstart', handleFlowerClick);


// Music toggle
const music = new Audio('assets/bg-music.mp3');
music.loop = true;
let isPlaying = true;

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

if (isPlaying) {
  music.play()
  toggleBtn.innerText = '⏸ Pause Music';
  console.log('isplaying')
}

toggleBtn.onclick = () => {
  if (isPlaying) {
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

  const t = Date.now() * 0.001;

  sunLight.intensity = 1.5 + Math.sin(t * 2) * 0.05;

  clouds.forEach(cloud => {
    cloud.position.x += 0.1;
    if (cloud.position.x > 60) cloud.position.x = -60;
    cloud.lookAt(camera.position);
  });

  fireflies.position.y = Math.sin(t * 2) * 0.5;

  flowers.forEach(f => f.tick?.(t));
  animatedObjects.forEach(obj => obj.tick?.(t));

  hearts.forEach(h => {
    h.position.y += 0.01;
    if (h.position.y > 20) h.position.y = 5;
  });

  renderer.render(scene, camera);
}
animate();

// Resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
