import { TextureLoader } from "../../../vendor/three/build/three.module.js";

function createTextures() {
	const textures = new TextureLoader().load("./assets/textures/crate.gif");

	return textures;
}

export { createTextures };
