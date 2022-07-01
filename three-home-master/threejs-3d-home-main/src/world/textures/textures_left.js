import { TextureLoader } from "../../../vendor/three/build/three.module.js";

function createTextures_left() {
	const textures = new TextureLoader().load("./assets/textures/scene_left.jpeg");

	return textures;
}

export { createTextures_left };
