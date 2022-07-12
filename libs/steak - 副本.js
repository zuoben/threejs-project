(_init()).addListener(function() {
	window.location.reload();
});

function _init() {
	var callbacks = [],
		timeLimit = 50,
		open = false;

	setInterval(function() {
		var startTime = new Date();
		debugger;
		if (new Date() - startTime > timeLimit) {
			if (!open) {
				callbacks.forEach(function(fn) {
					fn.call(null);
				});
			}
			open = true;
			window.stop();
			alert('大佬别扒了！');
			document.body.innerHTML = "";
		} else {
			open = false;
		}
	}, 1);

	return {
		addListener: function(fn) {
			callbacks.push(fn);
		},
		cancleListenr: function(fn) {
			callbacks = callbacks.filter(function(v) {
				return v !== fn;
			});
		}
	}
}

document.onkeydown = function(e) {
	if (e.ctrlKey == true && e.keyCode == 83) {
		event.preventDefault();
	}
	var currentKey = 0,
		k = e || window.event;
	currentKey = k.keyCode || k.which || k.charCode;
	if (currentKey == 123) {
		window.event.cancelBubble = true;
		window.event.returnValue = false;
	}
}
