//1为路 0为墙 2x为门 3为人物 4x为怪物 5x为楼梯 6x为增益道具
var allditu = [
	[
		[51, 1, 41, 42, 42, 1, 1, 1, 1, 1, 1],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
		[65, 1, 1, 21, 1, 0, 63, 67, 1, 0, 1],
		[1, 42, 1, 0, 1, 0, 65, 68, 1, 0, 1],
		[0, 22, 0, 0, 1, 0, 0, 0, 21, 0, 1],
		[66, 1, 1, 0, 1, 21, 62, 66, 65, 0, 1],
		[1, 45, 1, 0, 1, 0, 0, 0, 0, 0, 1],
		[0, 22, 0, 0, 1, 1, 1, 1, 1, 1, 1],
		[1, 1, 1, 0, 0, 22, 0, 0, 0, 22, 0],
		[65, 1, 67, 0, 63, 1, 64, 0, 1, 48, 1],
		[65, 68, 61, 0, 1, 3, 1, 0, 43, 65, 43],
	],
	[
		[1, 67, 1, 0, 67, 61, 62, 0, 1, 1, 1],
		[66, 1, 68, 0, 66, 1, 66, 0, 67, 1, 65],
		[1, 1, 1, 0, 1, 45, 1, 0, 1, 41, 1],
		[0, 22, 0, 0, 0, 21, 0, 0, 0, 22, 0],
		[1, 42, 1, 21, 43, 1, 1, 44, 1, 1, 1],
		[1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
		[45, 1, 46, 1, 1, 1, 1, 1, 1, 1, 1],
		[22, 0, 0, 21, 0, 0, 0, 22, 0, 0, 21],
		[1, 0, 1, 41, 1, 0, 1, 47, 1, 0, 1],
		[1, 0, 49, 1, 63, 0, 64, 1, 65, 0, 3],
		[51, 0, 61, 43, 62, 0, 1, 48, 1, 0, 52],
	],
	//1为路 0为墙 2x为门 3为人物 4x为怪物 5x为楼梯 6x为增益道具
	[
		[52, 1, 21, 1, 1, 1, 1, 1, 1, 1, 1],
		[3, 1, 0, 0, 1, 48, 1, 48, 1, 0, 0],
		[1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
		[1, 0, 63, 63, 0, 1, 1, 1, 0, 1, 67],
		[1, 0, 61, 1, 22, 1, 1, 1, 21, 1, 1],
		[1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0],
		[1, 0, 64, 1, 0, 1, 1, 1, 0, 1, 66],
		[1, 0, 1, 1, 21, 1, 1, 1, 22, 1, 1],
		[1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0],
		[1, 0, 61, 62, 0, 1, 1, 1, 0, 1, 64],
		[51, 0, 61, 1, 22, 1, 1, 1, 22, 43, 1],
	]
];
var center = document.querySelector('.center');

var peoplex = 0;
var peopley = 0;
var diyic = 0;

var floor = 0;
var jinkey = 5;
var yinkey = 6;

var hp = 100;
var gjili = 10;
var fangyu = 10;

var arr = allditu[floor];

function xuanran() {
	if (diyic != 0) {
		var oldbox = document.querySelector('.yxibox');
		oldbox.remove();
	}
	var yxibox = document.createElement('div');
	yxibox.className = 'yxibox';
	center.appendChild(yxibox);

	var xingxikuang = document.createElement('div');
	xingxikuang.className = 'xingxikuang';
	yxibox.appendChild(xingxikuang);

	var censhu = document.createElement('div');
	censhu.className = 'censhu';
	censhu.innerHTML = `第${floor+1}层`;
	xingxikuang.appendChild(censhu);

	var keynumber = document.createElement('div');
	keynumber.className = 'keynumber';
	keynumber.innerHTML = `金钥匙:<br>${jinkey}把<br>银钥匙:<br>${yinkey}把`;
	xingxikuang.appendChild(keynumber);

	var views = document.createElement('div');
	views.className = 'views';
	views.innerHTML = `生命:${hp}<br><br>攻击:${gjili}<br><br>防御:${fangyu}<br><br>`;
	xingxikuang.appendChild(views);

	var onceaggin = document.createElement('div');
	onceaggin.className = 'onceaggin';
	onceaggin.innerHTML = '重新开始';
	onceaggin.onclick = function () {
		location.href += "?reload=true";
	};
	xingxikuang.appendChild(onceaggin);

	for (var i = 0; i < arr.length; i++) {
		for (var j = 0; j < arr[i].length; j++) {
			if (arr[i][j] == 1) {
				var lu = document.createElement('div');
				lu.className = 'gezi lu';
				yxibox.appendChild(lu);
			} else if (arr[i][j] == 0) {
				var qiang = document.createElement('div');
				qiang.className = 'gezi qiang';
				yxibox.appendChild(qiang);
			} else if (50 <= arr[i][j] && arr[i][j] < 60) {
				var loti = document.createElement('div');
				if (arr[i][j] == 51) {
					loti.className = 'gezi loti1';
				} else if (arr[i][j] == 52) {
					loti.className = 'gezi loti2';
				}
				yxibox.appendChild(loti);
			} else if (arr[i][j] == 21) {
				var men1 = document.createElement('div');
				men1.className = 'gezi men1';
				yxibox.appendChild(men1);
			} else if (arr[i][j] == 22) {
				var men2 = document.createElement('div');
				men2.className = 'gezi men2';
				yxibox.appendChild(men2);
			} else if (40 <= arr[i][j] && arr[i][j] < 50) {
				var guaiwu = document.createElement('div');
				if (arr[i][j] == 41) {
					guaiwu.className = 'gezi guaiwu1';
				} else if (arr[i][j] == 42) {
					guaiwu.className = 'gezi guaiwu2';
				} else if (arr[i][j] == 43) {
					guaiwu.className = 'gezi guaiwu3';
				} else if (arr[i][j] == 44) {
					guaiwu.className = 'gezi guaiwu4';
				} else if (arr[i][j] == 45) {
					guaiwu.className = 'gezi guaiwu5';
				} else if (arr[i][j] == 46) {
					guaiwu.className = 'gezi guaiwu6';
				} else if (arr[i][j] == 47) {
					guaiwu.className = 'gezi guaiwu7';
				} else if (arr[i][j] == 48) {
					guaiwu.className = 'gezi guaiwu8';
				} else if (arr[i][j] == 49) {
					guaiwu.className = 'gezi guaiwu9';
				}
				yxibox.appendChild(guaiwu);
			} else if (arr[i][j] == 3) {
				peoplex = i;
				peopley = j;
				var renwu = document.createElement('div');
				renwu.className = 'gezi renwu';
				yxibox.appendChild(renwu);
			} else if (60 <= arr[i][j] && arr[i][j] < 70) {
				var daoju = document.createElement('div');
				if (arr[i][j] == 61) {
					daoju.className = 'gezi daoju1';
				} else if (arr[i][j] == 62) {
					daoju.className = 'gezi daoju2';
				} else if (arr[i][j] == 63) {
					daoju.className = 'gezi daoju3';
				} else if (arr[i][j] == 64) {
					daoju.className = 'gezi daoju4';
				} else if (arr[i][j] == 65) {
					daoju.className = 'gezi daoju5';
				} else if (arr[i][j] == 66) {
					daoju.className = 'gezi daoju6';
				} else if (arr[i][j] == 67) {
					daoju.className = 'gezi daoju7';
				} else if (arr[i][j] == 68) {
					daoju.className = 'gezi daoju8';
				}
				yxibox.appendChild(daoju);
			} else if (arr[i][j] == 99) {
				var lu = document.createElement('div');
				lu.className = 'gezi lu';
				yxibox.appendChild(lu);
				var die = document.createElement('div');
				die.className = 'die';
				die.innerHTML = '你死了！';
				yxibox.appendChild(die);
				var agin = document.createElement('div');
				agin.innerHTML = '再来一次';
				agin.className = 'agin';
				agin.onclick = function () {
					location.href += "?reload=true";
				}
				die.appendChild(agin);
				document.onkeydown =function(event){

				}
			}

		}
	}
	diyic = 1;
}
xuanran();

//1为路 0为墙 2x为门 3为人物 4x为怪物 5x为楼梯 6x为增益道具
function yidongguoceng(x, y, x1, y1) {
	if (arr[x1][y1] == 1) {
		arr[x1][y1] = 3;
		arr[x][y] = 1;
	} else if (arr[x1][y1] == 21 && jinkey > 0) {
		arr[x1][y1] = 3;
		arr[x][y] = 1;
		jinkey--;
	} else if (arr[x1][y1] == 22 && yinkey > 0) {
		arr[x1][y1] = 3;
		arr[x][y] = 1;
		yinkey--;
	} else if (arr[x1][y1] == 51) {
		if (floor >= 0 && floor < allditu.length - 1) {
			floor++;
			arr = allditu[floor];
		}
	} else if (arr[x1][y1] == 52) {
		if (floor >= 1 && floor < allditu.length) {
			floor--;
			arr = allditu[floor];
		}
	} else if (arr[x1][y1] > 40 && arr[x1][y1] < 50 && hp > 0) {
		var shanghai = arr[x1][y1] % 40;
		hp = hp - shanghai * 10;
		if (hp < 0) {
			arr[x][y] = 99;
		} else {
			arr[x1][y1] = 3;
			arr[x][y] = 1;
		}
	} else if (arr[x1][y1] > 60 && arr[x1][y1] < 70) {
		if (arr[x1][y1] == 61) {

		} else if (arr[x1][y1] == 62) {
			fangyu = fangyu + 10;
		} else if (arr[x1][y1] == 63) {
			gjili = gjili + 10;
		} else if (arr[x1][y1] == 64) {
			gjili = gjili + 15;
			fangyu = fangyu + 15;
		} else if (arr[x1][y1] == 65) {
			hp = hp + 100;
		} else if (arr[x1][y1] == 66) {
			hp = hp + 50;
		} else if (arr[x1][y1] == 67) {
			jinkey++;
		} else if (arr[x1][y1] == 68) {
			yinkey++;
		}
		arr[x1][y1] = 3;
		arr[x][y] = 1;
	}
	xuanran();
}

document.onkeydown = function (event) {
	var e = event || window.event || arguments.callee.caller.arguments[0];
	if (e && e.keyCode == 38) {
		if(peoplex>0){
			yidongguoceng(peoplex, peopley, peoplex - 1, peopley);
		}
	} else if (e && e.keyCode == 37) {
		yidongguoceng(peoplex, peopley, peoplex, peopley - 1);
	}

	if (e && e.keyCode == 40) {
		if(peoplex>=0&&peoplex<=9){
			yidongguoceng(peoplex, peopley, peoplex + 1, peopley);
		}
	} else if (e && e.keyCode == 39) {
		yidongguoceng(peoplex, peopley, peoplex, peopley + 1);
	}
};