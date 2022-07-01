import {
	BoxGeometry,
	MeshStandardMaterial,
	Mesh,
} from "../../../vendor/three/build/three.module.js";
import { createTextures } from "../textures/textures.js";
import { createTextures_left } from "../textures/textures_left.js";
import { createTextures_right } from "../textures/textures_right.js";
import { createTextures_top } from "../textures/textures_top.js";
import { createTextures_bottom } from "../textures/textures_bottom.js";
import { createTextures_front } from "../textures/textures_front.js";
import { createTextures_back } from "../textures/textures_back.js";

function createCube() {
	const geometry = new BoxGeometry(2, 2, 2);
	geometry.scale(1, 1, -1);
	const material = [];

	// 贴图
	// const textures = createTextures();
	const textures_left = createTextures_left();
	const textures_right = createTextures_right();
	const textures_top = createTextures_top();
	const textures_bottom = createTextures_bottom();
	const textures_front = createTextures_front();
	const textures_back = createTextures_back();
	material.push(
		new MeshStandardMaterial({ map: textures_left }),
		new MeshStandardMaterial({ map: textures_right }),
		new MeshStandardMaterial({ map: textures_top }),
		new MeshStandardMaterial({ map: textures_bottom }),
		new MeshStandardMaterial({ map: textures_front }),
		new MeshStandardMaterial({ map: textures_back })
	);

	const cube = new Mesh(geometry, material);
	// cube.geometry.scale(1, 1, -1);

	cube.tick = () => {
		cube.rotation.x += 0.01;
		cube.rotation.y += 0.01;
		cube.rotation.z += 0.01;
	};

	return cube;
}

export { createCube };
