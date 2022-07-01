class Loop {
	constructor(scene, camera, renderer) {
		this.scene = scene;
		this.camera = camera;
		this.renderer = renderer;
		this.updatables = [];
	}
	start() {
		this.renderer.setAnimationLoop(() => {
			this.tick();
			this.renderer.render(this.scene, this.camera);
		});
	}
	stop() {
		this.renderer.setAnimationLoop(null);
	}
	tick() {
		this.updatables.forEach((object) => {
			object.tick();
		});
	}
}

export { Loop };
