import { TextureLoader } from "../../../vendor/three/build/three.module.js";

function createTextures_right() {
	const textures = new TextureLoader().load("./assets/textures/scene_right.jpeg");

	return textures;
}

export { createTextures_right };
