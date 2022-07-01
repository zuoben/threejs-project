import { TextureLoader } from "../../../vendor/three/build/three.module.js";

function createTextures_back() {
	const textures = new TextureLoader().load("./assets/textures/scene_back.jpeg");

	return textures;
}

export { createTextures_back };
