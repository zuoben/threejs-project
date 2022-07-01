/**
 * @link https://github.com/jsmask
 * @author JSMask
 */

var game = (function() {

	var width = 750,
		height = 1206;
	var scale = 1; // 场景缩放值
	var roleScale = 1; // 角色缩放值
	var distance = 350; // 生成间隔时间
	var managerCreateNum = 1; // 每次性生成角色数量

	var eventType = {
		HIT: "hit",
		END: "end"
	}

	var stateType = {
		DEFAULT: "default",
		READY: "ready",
		START: "start",
		OVER: "over"
	}

	var _event = Hilo.EventMixin;
	var state = stateType.DEFAULT;
	var asset = null,
		stage = null,
		ticker = null;
	var packetList = [];
	var progressNum = 0;
	var loadDom = null;

	var init = function(args) {
		if(args && args.width) width = args.width;
		if(args && args.height) height = args.height;
		createLoadDom();
		asset = new game.Asset();
		asset.on('complete', function(e) {
			asset.off('load');
			asset.off('complete');
			document.getElementById("game_load").remove();
			initStage();
		});

		asset.on('load', function(e) {
			progressNum++;
			renderLoadProgress(progressNum / asset.queue.getTotal());
		});

		asset.load();
	}

	function initStage() {
		//舞台画布
		var renderType = location.search.indexOf('dom') != -1 ? 'dom' : 'canvas';
		var gameContainer = document.getElementById("game-container");

		var winWidth = window.innerWidth || document.documentElement.clientWidth;
		var winHeight = window.innerHeight || document.documentElement.clientHeight;

		scale = winWidth / width;

		//舞台
		stage = new Hilo.Stage({
			container: gameContainer,
			renderType: renderType,
			width: width,
			height: height,
			scaleX: scale,
			scaleY: scale
		});

		window.onresize = function() {
			winWidth = window.innerWidth || document.documentElement.clientWidth;
			winHeight = window.innerHeight || document.documentElement.clientHeight;
			scale = winWidth / width;
			stage.scaleX = scale;
			stage.scaleY = scale;
			stage.resize(width, height, true);
		};

		//启动计时器
		ticker = new Hilo.Ticker(60);
		ticker.addTick(Hilo.Tween);
		ticker.addTick(stage);
		ticker.start(true);

		//绑定交互事件
		stage.enableDOMEvent(Hilo.event.POINTER_START, true);

		//准备游戏
		render();
		gameReady();
	}

	function render() {
		stage.children.length = 0;
		initBackground();
	}

	function gameReady() {
		state = stateType.READY;
	}

	function stopGame() {
		state = stateType.OVER;
	}

	function replayGame() {
		state = stateType.READY;
		playGame();
	}

	function createLoadDom() {
		var fragment = document.createDocumentFragment();
		var loadBox = document.createElement('div');
		loadBox.setAttribute("id", "game_load");
		loadDom = document.createElement('p');
		renderLoadProgress(0);
		loadBox.appendChild(loadDom);
		loadBox.appendChild(document.createElement('span'));
		fragment.appendChild(loadBox);
		document.body.appendChild(fragment);
	}

	function renderLoadProgress(n) {
		if(loadDom) loadDom.innerHTML = ~~(n * 100) + '%';
	}

	function initBackground() {
		//背景
		var bgImg = asset["bg"];

		this.bg = new Hilo.Bitmap({
			id: 'bg',
			image: bgImg,
			scaleX: width / bgImg.width,
			scaleY: height / bgImg.height
		}).addTo(stage);
	}

	function roleManager() {
		for(var i = 0; i < managerCreateNum; i++) {
			addRole();
		};
	}

	var createRedPacket = function() {
		var rw = 108;
		var rh = 154;
		var catimg = asset["catimg"];
		var redpacket = new Hilo.Sprite({
			x: width + Math.random() * width,
			y: -150 - Math.random() * 200,
			scaleX: roleScale,
			scaleY: roleScale,
			loop: false,
			paused: true,
			frames: Hilo.TextureAtlas.createSpriteFrames([
				["normal", "0", catimg, rw, rh, false, 5],
				["hit", "1", catimg, rw, rh, false, 5]
			])
		}).addTo(stage);
		return redpacket;
	};

	function addRole(index, type) {
		var redpacket = createRedPacket();
		packetList.push(redpacket);
		redpacket.rotation = 30;
		redpacket.vx = -3 - (6 * Math.random());
		redpacket.vy = 3 + (3 * Math.random());
		redpacket.g = 0.05;
		redpacket.tag = "redpacket";
		redpacket.status = "normal";

		redpacket.on(Hilo.event.POINTER_START, function(e) {
			if(redpacket.status == "hit" || state == stateType.OVER) return;
			redpacket.status = "hit";
			this.goto("hit", false);
			this.play();
			this.off(Hilo.event.POINTER_START);
			_event.fire(eventType.HIT, {
				type: 1
			})
		});
	}

	function removeChild() {
		for(var i = packetList.length - 1; i >= 0; i--) {
			if(packetList[i].y >= height + packetList[i].height) {
				if(packetList[i].parent) {
					packetList[i].parent.removeChild(packetList[i]);
				}
				packetList.splice(i, 1)
			}
		}
	}

	function playGame(beginDate) {
		var beginDate = beginDate || new Date(),
			lastDate;
		if(state === stateType.START) return;
		runGame(beginDate);
	}

	function runGame(beginDate) {
		requestAnimFrame(function() {
			for(var key in stateType) {
				stateFn[stateType[key]](beginDate)
			}
		});
	}

	var stateFn = {
		default: onGameStateDefault,
		ready: onGameStateReady,
		start: onGameStateStart,
		over: onGameStateOver,
	}

	function onGameStateDefault() {
		if(state !== stateType.DEFAULT) return;
		runGame();
	}

	function onGameStateReady(beginDate) {
		if(state !== stateType.READY) return;
		state = stateType.START;
	}

	function onGameStateStart(beginDate) {
		if(state !== stateType.START) return;
		var beginDate = beginDate || new Date(),
			lastDate;
		lastDate = new Date();
		packetList.forEach(function(packet) {
			packet.vy += packet.g;
			packet.x += packet.vx;
			packet.y += packet.vy;
		});
		removeChild();
		if(lastDate - beginDate > distance) {
			roleManager();
			beginDate = lastDate;
		}
		runGame(beginDate);
	}

	function onGameStateOver() {
		if(state !== stateType.OVER) return;
		_event.fire(eventType.END);
		for(var i = packetList.length - 1; i >= 0; i--) {
			if(packetList[i].parent) {
				packetList[i].parent.removeChild(packetList[i]);
			}
			packetList.splice(i, 1)
		}
	}

	window.requestAnimFrame = (function() {
		return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
			function(callback, element) {
				return window.setTimeout(callback, 1000 / 60);
			};
	})();

	return {
		EventType: eventType,
		init: init,
		play: playGame,
		stop: stopGame,
		replay: replayGame,
		on: _event.on.bind(_event)
	};
})();