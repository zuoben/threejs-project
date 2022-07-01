function FlatSystem(canvas, width, height) {
	this.canvas = canvas;
	this.context = canvas.getContext("2d");
	this.width = width;
	this.height = height;
	this.calibration = 20; //刻度，默认值为20
	this.proportion = 10; //绘制比例
	this.jx = canvas.offsetLeft + 50;
	this.jy = canvas.offsetTop + canvas.offsetHeight - 50;
	// console.log(this.jy);
}

FlatSystem.prototype = {
	constructor: FlatSystem,
	init: function() {
		this.context.clearRect(0, 0, this.width, this.height);
		this.context.moveTo(0, 0);
		this.setFillColor("#000");
		this.setStrokeColor("#000");
		this.build();
	},

	clear: function(x, y, width, height) {
		this.context.clearRect(x || 0, y || 0, width || this.width, height || this.height);
	},

	setProportion: function(proportion) {
		this.proportion = proportion;
	},

	setCalibration: function(calibration) {
		this.calibration = calibration;
	},

	printPoint: function(x, y, width, height) {
		// console.log(x, y);
		if (x > this.calibration || y > this.calibration || x < 1 || y < 1) return;

		x = this.getX(x - 1);
		y = this.getY(y);

		// if(x<this.width&&y<this.height){
		// 	this.drawRect(x,y,width||this.proportion,height||this.proportion);
		// 	return true;
		// }
		// return false;
		// setTimeout(
		// 	function(self){return function(){
		// 		self.drawRect(x, y, width || self.proportion, height || self.proportion);
		// 	}
		// }(this),1000)
		this.drawRect(x, y, width || this.proportion, height || this.proportion);
	},

	printLine: function(x, y, sx, sy) {
		this.drawLine(this.getX(x), this.getY(y), this.getX(sx), this.getY(sy));
	},

	setFillColor: function(color) {
		this.context.fillStyle = color;
	},

	getFillColor: function() {
		return this.context.fillStyle;
	},

	setStrokeColor: function(color) {
		this.context.strokeStyle = color;
	},

	fillText: function(text, x, y) {
		this.context.fillText(text, this.getX(x), this.getY(y));
	},

	drawRect: function(x, y, width, height) {
		this.context.beginPath();
		this.context.fillRect(x, y, width, height);
		this.context.stroke();
	},

	drawLine: function(x, y, sx, sy) {
		this.context.beginPath();
		if (sx !== undefined && sy !== undefined) {
			this.context.moveTo(sx, sy);
		}

		this.context.lineTo(x, y);
		this.context.stroke();
	},

	drawRectArea: function(sx, sy, dx, dy) {
		var x = sx;
		var y = sy;
		var width = (Math.abs(dx - sx)) * this.proportion;
		var height = (Math.abs(dy - sy)) * this.proportion;
		// console.log("起点("+x+","+y+"),宽:"+width+",高："+height);
		this.context.beginPath();
		this.context.fillRect(this.getX(x - 1), this.getY(y), width, height);
		this.context.stroke();
	},

	build: function() {
		this.drawLine(this.jx, this.jy, this.jx, this.jy - this.height);
		this.drawLine(this.jx, this.jy, this.jx + this.width, this.jy);
		this.setFillColor('#000');
		this.fillText("O", -1, -1); //原点坐标 0

		this.drawGrid();
	},
	getPixel: function(x, y, width, height) {

		width = width || this.proportion;
		height = height || this.proportion;

		if (x > this.calibration || y > this.calibration || x < 1 || y < 1) return;

		x = this.getX(x - 1);
		y = this.getY(y);

		var pixelData = this.context.getImageData(x, y, width, height);
		return pixelData;

	},

	setPixel:function(color_data,x,y){
		x = this.getX(x - 1);
		y = this.getY(y);
		this.context.putImageData(color_data,x,y);
	},

	// isColorEqual: function(x1, y1, x2, y2) {
	// 	var data1 = this.getPixel(x1, y1).data;
	// 	var data2 = this.getPixel(x2, y2).data;
	isColorEqual: function(data1, data2) {
		// var data1 = this.getPixel(x1, y1).data;
		// var data2 = this.getPixel(x2, y2).data;
		data1=data1.data;
		data2=data2.data;
		if (data1.length !== data2.length) return false;
		for (var i = 0; i < data1.length; i++) {
			if (data1[i] !== data2[i]) {
				return false;
			}
		}
		return true;

	},

	drawGrid: function() {
		this.setCalibration(Math.min(this.width / this.proportion, this.height / this.proportion));
		for (var i = 0; i <= this.calibration; i++) {
			this.drawLine(this.jx, this.jy - i * this.proportion, this.jx + this.width, this.jy - i * this.proportion);
			this.drawLine(this.jx + i * this.proportion, this.jy, this.jx + i * this.proportion, this.jy - this.height);

		}

		// var old_color=this.getFillColor();

		// this.setFillColor("red");
		for (var i = 5; i <= this.calibration; i += 5) {
			this.fillText(i, i - 1, -1);
			this.fillText(i, -1.5, i - 1);
		}

		// this.setFillColor(old_color);
		// console.log(this.getFillColor());
	},

	isIn: function(x, y) {
		var x = this.getx(x);
		var y = this.gety(y);
		return x >= 0 && x <= this.width && y >= 0 && y <= this.height;
	},

	getX: function(x) {
		return parseInt(this.jx + x * this.proportion);
	},

	getY: function(y) {
		return parseInt(this.jy - y * this.proportion);
	},

	toFlatX: function(x) {
		var toLeft = this.canvas.parentNode.offsetLeft;
		return parseInt((x - this.jx - toLeft) / this.proportion + 1);
	},

	toFlatY: function(y) {
		return parseInt((this.jy - y) / this.proportion + 1);
	}

}