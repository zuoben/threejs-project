class Resizer {
	constructor(camera, renderer, contDom) {
		this.setSize(camera, renderer, contDom);
		window.addEventListener("resize", () => {
			this.setSize(camera, renderer, contDom);
		});
	}
	setSize(camera, renderer, contDom) {
		camera.aspect = contDom.clientWidth / contDom.clientHeight;
		// 更改相机属性后续更新
		camera.updateProjectionMatrix();

		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setSize(contDom.clientWidth, contDom.clientHeight);
	}
}

export { Resizer };
