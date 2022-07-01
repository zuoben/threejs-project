import { OrbitControls } from "../../../vendor/three/examples/jsm/controls/OrbitControls.js";

function createControls(camera, renderDom) {
	const controls = new OrbitControls(camera, renderDom);
	controls.target.set(0, 0, 0);
	// 开启惯性
	controls.enableDamping = true;
	// 禁止缩放
	controls.enableZoom = false;

	// 添加动画
	controls.tick = () => {
		controls.update();
	};

	return controls;
}

export { createControls };
