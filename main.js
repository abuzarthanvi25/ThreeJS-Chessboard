import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Chessboard } from "./objects/chessboard";
import UIDebugger from "./debuggers";
import DebugUI from "./debuggers";
import { Pawn } from "./objects/pieces/pawn";
import { Rook } from "./objects/pieces/rook";

let scene, renderer, camera;
let clock;
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}
let chessboard

const uiDebugger = new DebugUI();

init()

async function init() {
  
  clock = new THREE.Clock();
  
  scene = new THREE.Scene();
  chessboard = new Chessboard(scene);
  await chessboard.init()
  scene.background = new THREE.Color("#615E5E");
  // scene.fog = new THREE.Fog(0xa0a0a0, 10, 50);

  const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff,1.4);
  hemiLight.position.set(0, 10, 0);
  scene.add(hemiLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.castShadow = true;
  dirLight.shadow.camera.top = 2;
  dirLight.shadow.camera.bottom = - 2;
  dirLight.shadow.camera.left = - 2;
  dirLight.shadow.camera.right = 2;
  dirLight.shadow.camera.near = 0.1;
  dirLight.shadow.camera.far = 40;
  dirLight.intensity = 0.1
  scene.add(dirLight);

  dirLight.position.set(-0.15748, 6.233916, -9.990398)

  // ground

  const textureLoader = new THREE.TextureLoader();

  // Load the base color texture (the main texture for color)
  const baseColorTexture = textureLoader.load('marble2_texture/WM_Marble-125_1024.png');
  
  // Load the other textures (displacement, normal, roughness)
  const displacementTexture = textureLoader.load('marble_texture/Marble016_1K-JPG_Displacement');
  const normalTexture = textureLoader.load('marble_texture/Marble016_1K-JPG_NormalGL.jpg');
  const roughnessTexture = textureLoader.load('marble_texture/Marble016_1K-JPG_Roughness.jpg');

  // Create the material
  const material = new THREE.MeshStandardMaterial({
    map: baseColorTexture, // Base color texture
    displacementMap: displacementTexture, // Displacement map
    normalMap: normalTexture, // Normal map
    roughnessMap: roughnessTexture, // Roughness map
    roughness: 0.6,
    metalness: 0.6
  });

  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), material);
  mesh.rotation.x = - Math.PI / 2;
  mesh.receiveShadow = true;
  scene.add(mesh);

  const canvas = document.querySelector('.webgl');
  renderer = new THREE.WebGLRenderer({ canvas })
  renderer.shadowMap.enabled = true;
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(sizes.width, sizes.height)

  // camera
  camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 1, 100);
  camera.position.set(0.647963761844208, 10.162709592179997, 21.25813042580953);
  camera.rotation.set(-0.40695977041264236, 0.027984032803983188, 0.012059558736447897);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enablePan = true;
  controls.enableZoom = true;
  controls.target.set(0, 1, 0);
  controls.minDistance = 15; // Minimum distance the camera can be zoomed out
  controls.maxDistance = 26; // Maximum distance the camera can be zoomed in
  controls.maxPolarAngle = Math.PI / 2;

  controls.update();

  animate();

  onWindowResize();
}

function onWindowResize() {
  //ANCHOR - RESIZE
  window.addEventListener("resize", () => {
    //ANCHOR - Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    //ANCHOR - update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    renderer.setSize(sizes.width, sizes.height)
  })

}

function animate() {

  // Render loop

  requestAnimationFrame(animate);

  renderer.render(scene, camera);

}
