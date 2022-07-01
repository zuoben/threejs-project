function ClipLine(xl,yt,xr,yb,flatSystem){
	this.flatSystem=flatSystem;
	this.xl=xl;this.yt=yt;
	this.xr=xr;this.yb=yb;
	// this.px1=px1;this.py1=py1;
	// this.px2=px2;this.py2=py2;
	this.clipMethod=1;
	this.left=0x1;this.right=0x2;this.bottom=0x4;this.top=0x8;
}

ClipLine.prototype={
	constructor:ClipLine,
	clip:function(px1,py1,px2,py2){
		if(this.clipMethod==1){
			this.clipLineByEncode(px1,py1,px2,py2);
		}
	},
	encode:function(x,y){
		var code=0;
		if(x<this.xl) code=code|this.left;
		if(x>this.xr) code=code|this.right;
		if(y<this.yb) code=code|this.bottom;
		if(y>this.yt) code=code|this.top;
		return code;
	},

	setClipMethod:function(clipMethod){
		this.clipMethod=clipMethod;
	},

	clipLineByEncode:function(px1,py1,px2,py2){
		this.px1=px1;this.py1=py1;
		this.px2=px2;this.py2=py2;
		var code1,code2,code;
		var clx1=this.px1,cly1=this.py1,clx2=this.px2,cly2=this.py2;

		code1=this.encode(clx1,cly1);
		code2=this.encode(clx2,cly2);

		var x=0,y=0;

		while(code1!=0||code2!=0){
			if((code1&code2)!=0) return;
			code1!=0?code=code1:code=code2;

			if((this.left&code)!=0){
				x=this.xl;
				y=cly1+parseInt((cly2-cly1)*(x-clx1)/(clx2-clx1));
			}
			else if((this.right&code)!=0){
				x=this.xr;
				y=cly1+parseInt((cly2-cly1)*(x-clx1)/(clx2-clx1));
			}
			else if((this.top&code)!=0){
				y=this.yt;
				x=clx1+parseInt((clx2-clx1)*(y-cly1)/(cly2-cly1));
			}
			else if((this.bottom&code)!=0){
				y=this.yb;
				x=clx1+parseInt((clx2-clx1)*(y-cly1)/(cly2-cly1));
			}

			if(code==code1){
				clx1=x;
				cly1=y;
				code1=this.encode(x,y);
			}
			else{
				clx2=x;
				cly2=y;
				code2=this.encode(x,y);
			}

		}

		var start_point={x:clx1,y:cly1},end_point={x:clx2,y:cly2};
		this.fillLine(start_point,end_point);
	},

	fillLine:function(start_point,end_point){
		
		var minY=Math.min(start_point.y,end_point.y);
		var dx=end_point.x-start_point.x;
		var dy=end_point.y-start_point.y;
		if(dx==0){
			for(var k=1;k<=Math.abs(dy);k++){
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
					this.flatSystem.printPoint(Math.round(x),Math.round(y));
					x++;
					y+=k;
					
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