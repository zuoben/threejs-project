function Polygon(start_points,seed,flatSystem,fillMethod){
	this.start_points=start_points;
	this.seed=seed;
	this.flatSystem=flatSystem;
	this.fillMethod=fillMethod;
	this.points=[];
	this.direction_4=[
		{x_offset:-1,y_offset:0},{x_offset:0,y_offset:1},
		{x_offset:1,y_offset:0}, {x_offset:0,y_offset:-1}
	];//4连通

	this.direction_8=[
		{x_offset:-1,y_offset:1},{x_offset:0,y_offset:1},
		{x_offset:1,y_offset:1}, {x_offset:1,y_offset:0},
		{x_offset:1,y_offset:-1},{x_offset:0,y_offset:-1},
		{x_offset:-1,y_offset:-1}, {x_offset:-1,y_offset:0}
	];//8连通
}

Polygon.prototype={
	constructor:Polygon,
	init:function(){
		this.new_color=this.flatSystem.getPixel(this.start_points[0].x,this.start_points[0].y);
		if(this.fillMethod==1){
			this.FloodSeedFill(seed.x,seed.y,this.new_color,this.direction_4);
		}
		else if(this.fillMethod==2){
			this.FloodSeedFill(seed.x,seed.y,this.new_color,this.direction_8);
		}
		else if(this.fillMethod==3){
			this.ScanLineSeedFill(seed.x,seed.y,this.new_color);
		}
	},
	FloodSeedFill:function(x,y,new_color,direction){
		var currentColor=this.flatSystem.getPixel(x,y);
		if(!(this.flatSystem.isColorEqual(currentColor,new_color))){
			this.flatSystem.setPixel(new_color,x,y);
			for(var i=0;i<direction.length;i++){
				// this.FloodSeedFill(x+direction[i].x_offset,y+direction[i].y_offset,new_color,direction);
				var callback=window.setTimeout(
					(function(self,k){
						return function(){
							self.FloodSeedFill(x+direction[k].x_offset,y+direction[k].y_offset,new_color,direction);
						}
					})(this,i),500
				)
			}
		}
	},

	ScanLineSeedFill:function(x,y,new_color){
		this.points.push(seed);
		while(this.points.length!==0){
			var currentPoint=this.top(this.points);
			this.points.pop();

			var count=this.fillLineRight(currentPoint.x,currentPoint.y,new_color);
			var xRight=currentPoint.x+count;
			count=this.fillLineLeft(currentPoint.x-1,currentPoint.y,new_color);
			var xLeft=currentPoint.x-count;

			this.searchLineNewSeed(this.points,xLeft,xRight,currentPoint.y-1,new_color);
			this.searchLineNewSeed(this.points,xLeft,xRight,currentPoint.y+1,new_color);

		}
	},
	searchLineNewSeed:function(points,xLeft,xRight,y,new_color){
		var xt=xLeft;
		var findNewSeed=false;
		while(xt<=xRight){
			findNewSeed=false;
			while(this.isPixelValid(xt,y,new_color)&& (xt<xRight)){
				findNewSeed=true;
				xt++;
			}

			if(findNewSeed){
				if(this.isPixelValid(xt,y,new_color)&&(xt==xRight)){
					var p={};
					p.x=xt;p.y=y;
					points.push(p);
				}
				else{
					var p={};
					p.x=xt-1;p.y=y; 
					points.push(p);
				}
			}

			xt+=1;

		}
	},

	isPixelValid:function(x,y,new_color){
		var currentColor=this.flatSystem.getPixel(x,y);
		if(this.flatSystem.isColorEqual(currentColor,new_color)){
			return false;
		}
		return true;
	},



	fillLineRight:function(x,y,new_color){
		var count=0;
		var currentColor=this.flatSystem.getPixel(x,y);
		while(!(this.flatSystem.isColorEqual(currentColor,new_color))){
			this.flatSystem.setPixel(new_color,x,y);
			count++;
			currentColor=this.flatSystem.getPixel(++x,y);
		}
		return count;
	},

	fillLineLeft:function(x,y,new_color){
		var count=0;
		var currentColor=this.flatSystem.getPixel(x,y);
		while(!(this.flatSystem.isColorEqual(currentColor,new_color))){
			this.flatSystem.setPixel(new_color,x,y);
			count++;
			currentColor=this.flatSystem.getPixel(--x,y);
		}
		return count;
	},

	// fillLineRight:function(x,y,new_color){
	// 	var count=0;
	// 	var currentColor=this.flatSystem.getPixel(x,y);
	// 	if(!(this.flatSystem.isColorEqual(currentColor,new_color))){
	// 		this.flatSystem.setPixel(new_color,x,y);
	// 		count=1;
	// 		window.setTimeout((function(self){
	// 			return function(){
	// 				count+=self.fillLineRight(++x,y,new_color);
	// 			}
	// 		})(this),1000)
			
	// 	}
	// 	return count;
	// },

	// fillLineLeft:function(x,y,new_color){
	// 	var count=0;
	// 	var currentColor=this.flatSystem.getPixel(x,y);
	// 	if(!(this.flatSystem.isColorEqual(currentColor,new_color))){
	// 		this.flatSystem.setPixel(new_color,x,y);
	// 		count=1;
	// 		window.setTimeout((function(self){
	// 			return function(){
	// 				count+=self.fillLineLeft(--x,y,new_color);
	// 			}
	// 		})(this),1000)
	// 	}
	// 	return count;
	// },


	top:function(points){
		return points[points.length-1];
	},


	setFillMethod:function(fillMethod){
		this.fillMethod=fillMethod;
	},

	drawBorder:function(){
		var points=this.start_points;
		var counts=points.length;
		for(var i=0;i<counts;i++){
			if(i==counts-1){
				this.fillLine(points[counts-1],points[0]);
				return;
			}
			this.fillLine(points[i],points[i+1]);
		}
	},

	//顺时针排序多边形顶点
	sortPoints:function(points){
		return points;
	},

	sleep:function(time){
	},

	fillLine:function(start_point,end_point){
		
		var minY=Math.min(start_point.y,end_point.y);
		var dx=end_point.x-start_point.x;
		var dy=end_point.y-start_point.y;
		if(dx==0){
			for(var k=0;k<Math.abs(dy);k++){
				this.flatSystem.printPoint(start_point.x,minY+k);
			}
		}
		else{
			var k=dy/dx;
			if(Math.abs(k)<1){
				if(start_point.x>end_point.x){
					var temp=start_point;
					start_point=end_point;
					end_point=temp;
				}
				var x=start_point.x,y=start_point.y;
				while(x<end_point.x){
					x++;
					y+=k;
					this.flatSystem.printPoint(Math.round(x),Math.round(y));
				}
			}
			else{
				if(start_point.y>end_point.y){
					var temp=start_point;
					start_point=end_point;
					end_point=temp;
				}
				var x=start_point.x,y=start_point.y;
				while(y<end_point.y){
					y++;
					x+=1/k;
					this.flatSystem.printPoint(Math.round(x),Math.round(y));
				}
			}
		}
	}
}