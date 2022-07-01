/**
 * @link https://github.com/jsmask
 * @author JSMask
 */

var game = (function() {

	var width = 750,
		height = 1681;
	var scale = 1; // 场景缩放值
	var roleScale = 2; // 角色缩放值
	var distance = 500; // 生成间隔时间
	var waitTime = 200; // up后等待时间
	var managerCreateNum = 1; // 每次性生成角色数量

	var roleType = [{
		id: 0,
		score: 10
	}, {
		id: 1,
		score: -10
	}];

	var posList = [{
			x: 75,
			y: 360
		}, {
			x: 290,
			y: 310
		}, {
			x: 485,
			y: 380
		},
		{
			x: 75,
			y: 580
		}, {
			x: 290,
			y: 535
		}, {
			x: 485,
			y: 600
		},
		{
			x: 70,
			y: 875
		}, {
			x: 285,
			y: 825
		}, {
			x: 485,
			y: 898
		}
	];
	
	
	var eventType = {
		HIT:"hit",
		END:"end"
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
	var roleList = [];
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
		var bgImg = asset["bg_0"];

		this.bg = new Hilo.Bitmap({
			id: 'bg',
			image: bgImg,
			scaleX: width / bgImg.width,
			scaleY: height / bgImg.height
		}).addTo(stage);
	}

	function roleManager() {
		for(var i = 0; i < managerCreateNum; i++) {
			var type = roleType[Math.floor(roleType.length * Math.random())];
			var n = getRoleIndex();
			if(n != -1) addRole(n, type);
		}
	}

	function getRoleIndex() {
		var n = Math.floor(Math.random() * posList.length);
		if(roleList.length === posList.length) return -1;
		if(roleList.indexOf(n) === -1) return n;
		return getRoleIndex();
	}

	var createRole = function(index, type) {
		var rw = 108;
		var rh = 101;
		var pos = posList[index];
		var _type = type || roleType[0];
		var up = asset["role_" + _type.id + "_up"];
		var hit = asset["role_" + _type.id + "_hit"];
		var down = asset["role_" + _type.id + "_down"];
		var role = new Hilo.Sprite({
			x: pos.x,
			y: pos.y,
			scaleX: roleScale,
			scaleY: roleScale,
			loop: false,
			paused: true,
			frames: Hilo.TextureAtlas.createSpriteFrames([
				["up", "0-5", up, rw, rh, false, 5],
				["hit", "0-3", hit, rw, rh, false, 7],
				["down", "0-5", down, rw, rh, false, 2],
			])
		}).addTo(stage);
		return role;
	};

	function addRole(index, type) {
		var role = createRole(index, type);
		roleList.push(index);
		role.goto("up", false);
		role.play();
		role.state = "up";
		role.positionIndex = index;
		role.tag = "gopher";

		role.on(Hilo.event.POINTER_START, function(e) {
			if(this.state !== "up" || state == stateType.OVER) return;
			this.goto("hit", false);
			this.play();
			this.off(Hilo.event.POINTER_START);
			_event.fire(eventType.HIT, {
				type: type,
				obj: this
			})
		});

		role.setFrameCallback(5, function() {
			setTimeout(function() {
				this.goto("down", false);
				this.play();
			}.bind(this), waitTime);
		})

		role.setFrameCallback(9, function() {
			this.goto("down", false);
			this.play();
			this.state = "hit";
		})

		role.setFrameCallback(15, function() {
			var _this = this;
			this.state = "down";
			removeChild(_this, index);
		});
	}

	function removeChild(role, rolePostion) {
		stage.children.forEach(function(item, index) {
			if(item instanceof Hilo.Sprite) {
				if(item.id == role.id) {
					stage.removeChild(item);
				}
			}
		});
		roleList.length = 0;
		stage.children.forEach(function(item, index) {
			if(item instanceof Hilo.Sprite && item.tag == "gopher") {
				roleList.push(item.positionIndex);
			}
		});
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
		if(lastDate - beginDate > distance) {
			roleManager();
			beginDate = lastDate;
		}
		runGame(beginDate);
	}

	function onGameStateOver() {
		if(state !== stateType.OVER) return;
		_event.fire(eventType.END);
	}

	window.requestAnimFrame = (function() {
		return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
			function(callback, element) {
				return window.setTimeout(callback, 1000 / 60);
			};
	})();

	return {
		EventType:eventType,
		init: init,
		play: playGame,
		stop: stopGame,
		replay: replayGame,
		on: _event.on.bind(_event)
	};
})();