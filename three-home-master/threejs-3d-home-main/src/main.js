import { World } from "./world/World.js";

function main() {
	const contDom = document.getElementById("webgl-cont");

	const world = new World(contDom);
	// world.render();
	world.start();
}

main();
