import { PerspectiveCamera } from "../../../vendor/three/build/three.module.js";

function createCamera() {
	const camera = new PerspectiveCamera(90, 1, 0.1, 1000);
	camera.position.set(0, 0, 0.01);
	camera.lookAt(0, 0, 0);

	return camera;
}

export { createCamera };
