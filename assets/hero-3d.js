// Renders manchester_graffiti_wall_5.glb as the hero background: camera framed
// tight on the wall face (cover-fit + extra zoom) so the scan's edges/backing
// never enter frame, with a subtle mouse-driven tilt on the wall itself.
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

const canvas = document.getElementById('hero-canvas');
const fallback = document.getElementById('hero-fallback');
const hero = document.querySelector('.hero');

const ZOOM = 1.5; // >1 = closer than a plain cover-fit, hides mesh edges on tilt
const PAN_DOWN = 0.15; // fraction of model height to shift the frame down, cropping the top out
const MAX_TILT = 0.02; // radians (~1.15deg) — kept small so edges stay off-screen
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

let renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
} catch {
  renderer = null;
}
if (!renderer) {
  // No WebGL: leave the static fallback image showing, do nothing else.
  throw new Error('WebGL unavailable, using fallback image');
}

fallback.style.display = 'none';
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setClearColor(0x0a0a0a, 1);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);

scene.add(new THREE.HemisphereLight(0xffffff, 0x222222, 1.1));
const key = new THREE.DirectionalLight(0xffffff, 1.4);
key.position.set(2, 3, 4);
scene.add(key);

const rig = new THREE.Group(); // rotated for the mouse-tilt effect
scene.add(rig);

let target = null;
let targetTiltX = 0, targetTiltY = 0;
let tiltX = 0, tiltY = 0;

function resize() {
  const w = hero.clientWidth, h = hero.clientHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  if (target) frameCamera();
}

function frameCamera() {
  const box = new THREE.Box3().setFromObject(target);
  const size = box.getSize(new THREE.Vector3());
  const vFov = THREE.MathUtils.degToRad(camera.fov);
  const distForHeight = (size.y / 2) / Math.tan(vFov / 2);
  const distForWidth = (size.x / 2) / Math.tan(vFov / 2) / camera.aspect;
  const distance = Math.min(distForHeight, distForWidth) / ZOOM;
  camera.position.set(0, -size.y * PAN_DOWN, Math.max(distance, size.z / 2 + 0.05));
  camera.near = Math.max(distance / 100, 0.01);
  camera.far = distance * 4 + size.length();
  camera.updateProjectionMatrix();
}

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
const loader = new GLTFLoader().setDRACOLoader(dracoLoader);

loader.load('assets/manchester_graffiti_wall_5.glb', (gltf) => {
  const model = gltf.scene;

  // Center the model, then align its thinnest axis (the wall's depth) to Z
  // so it faces the camera regardless of how it was scanned/exported.
  let box = new THREE.Box3().setFromObject(model);
  model.position.sub(box.getCenter(new THREE.Vector3()));

  box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3());
  const depthAxis = ['x', 'y', 'z'].reduce((a, b) => size[a] < size[b] ? a : b);
  if (depthAxis === 'x') model.rotation.y = Math.PI / 2;
  else if (depthAxis === 'y') model.rotation.x = Math.PI / 2;

  // Orientation guess above can leave the scanned face pointing away from
  // the camera; double-sided materials keep it visible either way.
  model.traverse((o) => { if (o.isMesh) o.material.side = THREE.DoubleSide; });

  rig.add(model);
  target = rig;
  resize();

  if (!reduceMotion) renderer.setAnimationLoop(animate);
  else renderer.render(scene, camera);
}, undefined, () => {
  // Load/parse failure: fall back to the static image.
  fallback.style.display = '';
  canvas.style.display = 'none';
});

function animate() {
  tiltX += (targetTiltX - tiltX) * 0.06;
  tiltY += (targetTiltY - tiltY) * 0.06;
  rig.rotation.x = tiltX;
  rig.rotation.y = tiltY;
  renderer.render(scene, camera);
}

if (!reduceMotion) {
  hero.addEventListener('mousemove', (e) => {
    const nx = (e.clientX / innerWidth) * 2 - 1;
    const ny = (e.clientY / innerHeight) * 2 - 1;
    targetTiltY = nx * MAX_TILT;
    targetTiltX = ny * MAX_TILT;
  });
}

addEventListener('resize', resize);
