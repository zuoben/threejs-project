import { TextureLoader } from "../../../vendor/three/build/three.module.js";

function createTextures_bottom() {
	const textures = new TextureLoader().load("./assets/textures/scene_bottom.jpeg");

	return textures;
}

export { createTextures_bottom };
