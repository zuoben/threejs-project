import { createCamera } from "./components/camera.js";
import { createCube } from "./components/cube.js";
import { createScene } from "./components/scene.js";
import { createRenderer } from "./systems/renderer.js";
import { Resizer } from "./systems/Resizer.js";
import { createAmbientLight } from "./components/ambientLight.js";
import { createControls } from "./systems/controls.js";
import { Loop } from "./systems/Loop.js";

class World {
	#scene;
	#camera;
	#renderer;
	#cube;
	#loop;
	constructor(contDom) {
		this.#scene = createScene();
		this.#camera = createCamera();
		this.#renderer = createRenderer();
		const resizer = new Resizer(this.#camera, this.#renderer, contDom);
		contDom.append(this.#renderer.domElement);

		// 添加控制器
		const controls = createControls(this.#camera, this.#renderer.domElement);

		// 放置立方体
		this.#cube = createCube();
		this.#scene.add(this.#cube);

		// 放置环境光
		const ambientLight = createAmbientLight();
		this.#scene.add(ambientLight);

		// 放置动画
		this.#loop = new Loop(this.#scene, this.#camera, this.#renderer);
		this.#loop.updatables.push(controls);
	}
	render() {
		this.#renderer.render(this.#scene, this.#camera);
	}
	start() {
		this.#loop.start();
	}
	stop() {
		this.#loop.stop();
	}
}

export { World };
