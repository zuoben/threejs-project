import './style.css'
import * as THREE from 'three'
import {
    OrbitControls
} from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import effectInitial from './effect'
/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
  
/**
 * Light
 */
const light = new THREE.AmbientLight(0xffffff, 0.6); // soft white light
scene.add(light);

const directionalLight = new THREE.DirectionalLight(0xadadad, 0.9);
directionalLight.position.set(32, 55, 0);
scene.add(directionalLight);

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 1, 10000)
camera.position.set(882, 565, 430)
scene.add(camera)
 
// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

controls.target.set(0, 120, 0);
/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(new THREE.Color('#222'), 1);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;

const option = {
    coat: '#264552',
    interior: '#0f0303',
    skin: '#110b05'
}
const init = new effectInitial(scene, renderer, option);


gui.addColor(option, 'coat').name("外观颜色").onChange( function (val) {
   init.setCoatColor(val)
});
gui.addColor(option, 'interior').name("内饰颜色").onChange(function (val) {
   init.setInteriorColor(val)
});
gui.addColor(option, 'interior').name("方向盘颜色").onChange(function (val) {
   init.setSkinColor(val)
});

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const dt = clock.getDelta();
 
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()