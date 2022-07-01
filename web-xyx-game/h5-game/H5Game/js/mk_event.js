var $MK_Event = (function() {
	var _listen, _trigger, _remove;
	var clientList = [];
	
	var each = function(ary, fn) {
		var ret;
		for(var i = 0; i < ary.length; i++) {
			var n = ary[i];
			ret = fn.call(n, i, n);
			if(ret == false)
				break;
		}
		return ret;
	}
	
	_listen = function(key, fn) {
		if(!clientList[key]) {
			clientList[key] = [];
		}
		clientList[key].push(fn);
	}

	_trigger = function() {
		var key = Array.prototype.shift.call(arguments);
		var fns = clientList[key];
		var args = arguments;
		if(!fns || fns.length == 0) return false;
		return each(fns, function(i, fn) {
			return fn.apply(this, args);
		});
	}

	_remove = function(key, fn) {
		var fns = clientList[key];
		if(!fns) return false;
		if(!fn) fns && (fns.length = 0);
		for(var i = fns.length - 1; i >= 0; i--) {
			if(fns[i] === fn) {
				fns.splice(i, 1);
			}
		}
	}

	return {
		listen: _listen,
		trigger: _trigger,
		remove: _remove
	}

})();