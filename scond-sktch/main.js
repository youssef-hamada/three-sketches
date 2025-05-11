import * as THREE from "three";
import { OrbitControls } from "https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const light = new THREE.PointLight(0xffffff, 8);
light.position.set(5, 5, 5);
scene.add(light);

const geo = new THREE.IcosahedronGeometry(1, 3);
const mat = new THREE.MeshStandardMaterial({
  color: 0x3399ff,
  roughness: 0.3,
  metalness: 0.7,
  flatShading: true,
});

const planet = new THREE.Mesh(geo, mat);
scene.add(planet);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const clock = new THREE.Clock();

function createStars(count) {
  const starGeo = new THREE.BufferGeometry();
  const starMat = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.1,
  });

  const starVertices = [];
  for (let i = 0; i < count; i++) {
    const x = (Math.random() - 0.5) * 100;
    const y = (Math.random() - 0.5) * 100;
    const z = (Math.random() - 0.5) * 100;
    starVertices.push(x, y, z);
  }

  starGeo.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(starVertices, 3)
  );

  const stars = new THREE.Points(starGeo, starMat);
  scene.add(stars);
}

const movingLight = new THREE.PointLight(0xff3356, 1, 100);
scene.add(movingLight);

function updateLightPosition() {
  const time = Date.now() * 0.001;
  movingLight.position.x = Math.sin(time) * 5;
  movingLight.position.y = Math.cos(time) * 5;
  movingLight.position.z = Math.sin(time) * 5;
}

function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();
  updateLightPosition(delta);
  planet.rotation.x += delta;
  planet.rotation.y += delta;
  controls.update();
  renderer.render(scene, camera);
}

createStars(1000);
animate();
