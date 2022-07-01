import { AmbientLight } from "../../../vendor/three/build/three.module.js";

function createAmbientLight() {
	const ambientLight = new AmbientLight(0xffffff, 0.9);

	return ambientLight;
}

export { createAmbientLight };
