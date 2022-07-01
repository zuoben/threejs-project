import { TextureLoader } from "../../../vendor/three/build/three.module.js";

function createTextures_front() {
	const textures = new TextureLoader().load("./assets/textures/scene_front.jpeg");

	return textures;
}

export { createTextures_front };
