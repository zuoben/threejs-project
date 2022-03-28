/* 创建字体精灵 */
function makeTextSprite1(scene, tabs, props, parameters) {

	if (parameters === undefined) parameters = {}

	tabs.forEach((tab, k) => {
		let {
			width,
			height
		} = props[k]
		/* 创建画布 */
		let canvas = document.createElement('canvas');
		let context = canvas.getContext('2d')
		canvas.width = width
		canvas.height = height
		let gap = 10
		let fontface = parameters.hasOwnProperty("fontface") ? parameters["fontface"] : "sans-serif"
		/* 字体大小 */
		let fontsize = parameters.hasOwnProperty("fontsize") ?
			parameters["fontsize"] : 30

		let color = parameters.hasOwnProperty("color") ? parameters["color"] : 'rgba(0, 0, 0, 1.0)'
		/* 边框厚度 */
		let borderWith = parameters.hasOwnProperty("borderWith") ? parameters["borderWith"] : 2
		/* 边框颜色 */
		let borderColor = parameters.hasOwnProperty("borderColor") ? parameters["borderColor"] : {
			r: 0,
			g: 0,
			b: 0,
			a: 1.0
		}
		/* 背景颜色 */
		let backgroundColor = parameters.hasOwnProperty("backgroundColor") ? parameters["backgroundColor"] : {
			r: 255,
			g: 255,
			b: 255,
			a: 1.0
		}

		/* 字体加粗 */
		// context.font = "Bold " + fontsize + "px " + fontface
		context.font = fontsize + "px " + fontface
		let unit = gap + fontsize
		/* 背景颜色 */
		context.fillStyle = backgroundColor
		/* 边框的颜色 */
		context.strokeStyle = borderColor
		context.lineWidth = borderWith
		/* 绘制圆角矩形 */
		roundRect(context, gap, gap, width - gap, height - gap, 4)

		tab.forEach((d, i) => {
			context.fillStyle = color;
			context.fillText(d[0], gap * 2, gap + unit * (i + 1))
			if (d[2]) {
				context.fillStyle = d[2]
			}
			context.fillText(d[1], gap * 2 + measureText(d[0], context), gap + unit * (i + 1))
		})

		/* 画布内容用于纹理贴图 */
		let texture = new THREE.Texture(canvas);
		texture.needsUpdate = true
		let spriteMaterial = new THREE.SpriteMaterial({
			map: texture,
			// sizeAttenuation:false,
			// transparent:true
		});
		let sprite = new THREE.Sprite(spriteMaterial)
		// console.log(sprite.spriteMaterial)
		/* 缩放比例 */
		sprite.scale.set(...props[k].scale)
		sprite.center = new THREE.Vector2(0, 0);
		scene.add(sprite);
		sprite.position.set(...props[k].pos);
	})
}

function measureText(text, ctx, font) {
	if (font) ctx.font = font
	return ctx.measureText(text).width;
}
/* 绘制圆角矩形 */
function roundRect(ctx, x, y, w, h, r) {

	ctx.beginPath();
	ctx.moveTo(x + r, y);
	ctx.lineTo(x + w - r, y);
	ctx.quadraticCurveTo(x + w, y, x + w, y + r);
	ctx.lineTo(x + w, y + h - r);
	ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
	ctx.lineTo(x + r, y + h);
	ctx.quadraticCurveTo(x, y + h, x, y + h - r);
	ctx.lineTo(x, y + r);
	ctx.quadraticCurveTo(x, y, x + r, y);
	ctx.closePath();

	// ctx.shadowColor = "#qb95cf";
	// ctx.shadowOffsetX = 0;
	// ctx.shadowOffsetY = 0;
	// ctx.shadowBlur = 4;

	ctx.fill();
	ctx.stroke();
	ctx.shadowColor = "";
	ctx.shadowOffsetX = 0;
	ctx.shadowOffsetY = 0;
	ctx.shadowBlur = 0;
}


function makeTextSprite(container, scene) {
	console.log(container.scrollWidth, container.scrollHeight)
	return window.html2canvas(container, {
			//allowTaint:true,
			scale: 1,
			width: container.scrollWidth,
			height: container.scrollHeight,
			// useCORS: true
		})
		.then(function(canvas) {
			if (!canvas) return;
			// console.log(canvas)
			/* 画布内容用于纹理贴图 */
			let texture = new THREE.Texture(canvas);
			texture.needsUpdate = true
			let spriteMaterial = new THREE.SpriteMaterial({
				map: texture,
				// transparent:true
			});
			let sprite = new THREE.Sprite(spriteMaterial)
			// console.log(sprite.spriteMaterial)
			/* 缩放比例 */
			sprite.scale.set(30, 20, 0)
			sprite.position.set(0, 0, 10)
			sprite.center = new THREE.Vector2(0, 0);
			scene.add(sprite);
			return sprite
		});

}
