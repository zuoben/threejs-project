import { TextureLoader } from "../../../vendor/three/build/three.module.js";

function createTextures_top() {
	const textures = new TextureLoader().load("./assets/textures/scene_top.jpeg");

	return textures;
}

export { createTextures_top };
