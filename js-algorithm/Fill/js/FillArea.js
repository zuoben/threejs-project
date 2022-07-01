var start_point = [];
var seed = {};
var algorithm, algorithm_item;
var flatSystem;
var polygon;
var clipLine;
$(function() {
	var pointX_down, pointY_down;
	var isDragging = false;

	var canvas = g("myCanvas");
	var context = canvas.getContext("2d");


	flatSystem = new FlatSystem(canvas, 500, 500);
	console.log(flatSystem);
	flatSystem.init();

	polygon=new Polygon(start_point,seed,flatSystem,algorithm_item||1);


	// showReadMe();

	//画布鼠标点击事件
	canvas.addEventListener("mousedown", function(e) {
		var e = e || window.event;

		pointX_down = e.pageX;
		pointY_down = e.pageY;

		isDragging = true;

	})

	canvas.addEventListener("mouseup", function(e) {
		var e = e || window.event;
		isDragging = false;
		if(algorithm=="区域填充算法"){
			if (seed.x && seed.y) {
				alert("已选择种子点,请单击执行");
				return;
			}
		}
		
		var pointX_up = e.pageX,
			pointY_up = e.pageY;
		if (pointX_down == pointX_up && pointY_down == pointY_up) {
			if(algorithm==undefined){
				alert("请先选择算法主题");
				return;
			}

			
			var point = {};
			point.x = flatSystem.toFlatX(pointX_down);
			point.y = flatSystem.toFlatY(pointY_down);
			
			if(algorithm=="区域填充算法"){

				if (start_point.length > 2 && algorithm_item) {
					seed.x = point.x;
					seed.y = point.y;
					var old_color=flatSystem.getFillColor();
					flatSystem.setFillColor("blue");
					flatSystem.printPoint(flatSystem.toFlatX(pointX_down), flatSystem.toFlatY(pointY_down));
					flatSystem.setFillColor(old_color);
					return;
				}
				
			}
			else if(algorithm=="直线裁剪算法"){
				if(clipLine==undefined){
					alert("请先选择区域，按下鼠标滑动选择");
					return;
				}
				if(start_point.length==2){
					start_point=[];
				} 
			}
			
			start_point.push(point);

			flatSystem.printPoint(flatSystem.toFlatX(pointX_down), flatSystem.toFlatY(pointY_down));
			
		}

		// alert("not the same point");
	})

	canvas.addEventListener("mousemove", function(e) {
		var e = e || window.event;
		var pointX_up = e.pageX,
			pointY_up = e.pageY;
		var old_color = flatSystem.getFillColor();
		flatSystem.setFillColor("#777");
		if (isDragging === true) {
			flatSystem.drawRectArea(
				flatSystem.toFlatX(pointX_down),
				flatSystem.toFlatY(pointY_down),
				flatSystem.toFlatX(pointX_up),
				flatSystem.toFlatY(pointY_up)
			);
			// console.log("haha");

			// var width=Math.abs(flatSystem.toFlatX(pointX_up)-flatSystem.toFlatX(pointX_down));
			// var height=Math.abs(flatSystem.toFlatY(pointY_up)-flatSystem.toFlatY(pointY_down));
			// console.log(width,height);
			clipLine=new ClipLine(
				flatSystem.toFlatX(pointX_down),
				flatSystem.toFlatY(pointY_down),
				flatSystem.toFlatX(pointX_up),
				flatSystem.toFlatY(pointY_up),
				flatSystem
			);
		}
		flatSystem.setFillColor(old_color);
	})

	$(".algorithm-item").hasClass('hide') ? $(".algorithm-item").addClass('') : $(".algorithm-item").addClass('hide');


	//导航栏点击事件
	$(".navbar .algorithm .title").click(function(event) {
		/* Act on the event */
		algorithm = $(this).html().trim().toString();
		var $items = $(this).siblings('.algorithm-item');
		// $items.hasClass('hide')?$items.removeClass('hide'):$items.addClass('hide');showReadMe();
		if ($items.hasClass('hide')) {
			$items.removeClass('hide');
			// if(algorithm=="区域填充算法"){
			// 	showReadMe();
			// }
			showReadMe();
		} else $items.addClass('hide');

	});
	//算法选项点击事件
	$(".navbar .algorithm .algorithm-item .item").click(function(event) {
		/* Act on the event */
		var $li = $(this);
		algorithm_item = $li.val();
		$('.item').removeClass('current');
		$li.addClass('current');
		if(algorithm=="区域填充算法"){
			polygon.setFillMethod(algorithm_item);
			polygon.drawBorder();
		}
		else if(algorithm=="直线裁剪算法"&&clipLine){
			clipLine.setClipMethod(algorithm_item);
		}
	});

})



function running() {
	if (algorithm == undefined) {
		alert("没有选择算法主题")
	} 
	if(algorithm=="区域填充算法"){
		if (start_point.length == 0) {
			alert("没有选择多边形顶点")
		} 
		else if (algorithm_item == undefined) {
			alert("没有选择计算算法")
		} 
		else if (seed.x == undefined && seed.x == undefined) {
			alert("没有选择种子点")
		}
		else{
			polygon.init();
		}
		
	}
	if(algorithm=="直线裁剪算法"&&clipLine){
		if (start_point.length !== 2) {
			alert("没有选择直线顶点");
		} 
		else{
			clipLine.clip(start_point[0].x,start_point[0].y,start_point[1].x,start_point[1].y);
		}
	}
	// if (algorithm == undefined) {
	// 	alert("没有选择算法主题")
	// } else if (start_point.length == 0) {
	// 	alert("没有选择多边形顶点")
	// } else if (algorithm_item == undefined) {
	// 	alert("没有选择计算算法")
	// } else if (seed.x == undefined && seed.x == undefined) {
	// 	alert("没有选择种子点")
	// } else {
	// 	algorithm=="区域填充算法"?polygon.init():alert("hahah");

	// }

}


//出现提示文字
function showReadMe() {
	g("mask").style.display = "block";
	g("read-me").style.display = "block";

	var str = "";
	var $item = g("read-me");
	if (algorithm == "区域填充算法") {
		// if(true){
		str = "区域填充即给出一个区域的边界," +
			"要求将边界范围内的所有象素单元都修改成指定的颜色" +
			"<br><br> &nbsp;&nbsp;区域填充中最常用的是多边形填色";
		str += "<b><br><br>1.请在坐标纸上选取填充区域顶点;<br>2.选择填充算法 <br> 3.选择种子点<br> 4.单击执行，开始执行程序.</b>";
	}
	else if(algorithm == "直线裁剪算法"){
		str="直线裁剪算法是指对区域不可见部分进行裁剪，留下可见部分<br><br>比较经典的有Cohen-Sutherland算法"+
			"<br><br>程序使用步骤：<br>";
		str+="<b>1.按下鼠标左键后拖动鼠标，选择区域<br>2.在导航栏选择裁剪算法<br>3.选择直线起点和终点<br>4.单击执行，开始执行程序</b>"
	}
	
	$item.innerHTML = str;
	fillToBody(g("mask"));
	autoCenter(g("read-me"));
}

function hideReadMe() {
	g("mask").style.display = "none";
	g("read-me").style.display = "none";
}

window.onresize = function() {
	fillToBody(g("mask"));
	autoCenter(g("read-me"));
}


//自动居中函数
function autoCenter(el) {
	var bodyW = document.documentElement.clientWidth;
	var bodyH = document.documentElement.clientHeight;

	var elW = el.offsetWidth;
	var elH = el.offsetHeight;

	el.style.left = (bodyW - elW) / 2 + "px";
	el.style.top = (bodyH - elH) / 2 + "px";
}

//遮罩函数
function fillToBody(el) {
	var bodyW = document.documentElement.clientWidth;
	var bodyH = document.documentElement.clientHeight;

	el.style.width = bodyW + "px";
	el.style.height = bodyH + "px";
	// el.style.display="block"
}



function g(id) {
	return document.getElementById(id);
}