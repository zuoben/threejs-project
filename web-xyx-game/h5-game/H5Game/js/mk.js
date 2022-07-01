;
(function(global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
		typeof define === 'function' && define.amd ? define(factory) : (global.mk = factory());
}(this, (function() {
	var _extends = Object.assign || function(target) {
		for(var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for(var key in source) {
				if(Object.prototype.hasOwnProperty.call(source, key)) {
					target[key] = source[key];
				}
			}
		}
		return target;
	};
	var isIE = document.documentMode;
	var $ = {
		init: function(handle) {
			var _this = this;

			var $_wait = document.getElementById("mk-wait");
			var $_main = document.getElementById('mk-main');
			document.onreadystatechange = function() {
				if(document.readyState == "complete") {
					_this.addClass($_wait, "hide");
					$_wait.remove();
					_this.addClass($_main, "show");
					handle && handle();
				}
			};
		},
		addClass: function($elem, className) {
			if($elem == null)
				return;
			var _arr = $elem.className.split(" ");
			_arr = _arr.filter(function(item) {
				return item !== "";
			});
			if(_arr.indexOf(className) === -1) {
				_arr.push(className);
			}
			$elem.className = _arr.join(" ");
			return $elem;
		},
		removeClass: function($elem, className) {
			if($elem == null)
				return;
			var _arr = $elem.className.split(" ");
			_arr = _arr.filter(function(item) {
				return item !== "" && item != className;
			});
			$elem.className = _arr.join(" ");
			return $elem;
		},
		openLoader: function() {
			this._loader = document.createElement("div");
			this._loader.setAttribute("id", "mk-loader");
			this._loader.innerHTML = "<div class=\"double-bounce\">\n\t\t\t\t<div class=\"double-bounce1\"></div>\n\t\t\t\t<div class=\"double-bounce2\"></div>\n\t\t\t</div>";
			document.getElementsByTagName("body")[0].appendChild(this._loader);
		},
		colseLoader: function() {
			try {
				this._loader.remove();
			} catch(e) {}
		},
		ajax: function(parm, callback, bool) {
			if(!window.hasOwnProperty("mui"))
				return;
			var _this = this;
			var defaultConfig = {
				url: "",
				type: "get",
				data: {}
			};
			var _parm = _extends({}, defaultConfig, parm);
			this.colseLoader();
			mui.ajax({
				url: _parm.url,
				type: _parm.type,
				data: _parm.data,
				success: callback,
				beforeSend: function() {
					if(!bool)
						_this.openLoader();
				},
				complete: function() {
					if(!bool)
						_this.colseLoader();
				},
				error: function(a, b, c) {
					mui.toast("系统错误");
				}
			});
		},
		deepCopy: function(obj1, obj2) {
			var obj2 = obj2 || {};
			var toStr = Object.prototype.toString;
			var arrStr = "[object Array]";
			for(var prop in obj1) {
				if(obj1.hasOwnProperty(prop)) {
					if(obj1[prop] !== null && typeof(obj1[prop]) == "object") {
						obj2[prop] = toStr.call(obj1[prop]) == arrStr ? [] : {};
						deepClone(obj1[prop], obj2[prop]);
					} else {
						obj2[prop] = obj1[prop];
					}
				}
			}
			return obj2;
		},
		confirm: function(msg, title, btn, callback) {
			var mask = document.createElement("div");
			var box = document.createElement("div");
			mask.className = "mui-popup-backdrop mui-active";
			box.className = "mui-popup mui-popup-in";
			box.innerHTML = "\n\t\t\t\t<div class=\"mui-popup-inner\">\n\t\t\t\t\t<div class=\"mui-popup-title\">" + title + "</div>\t\n\t\t\t\t\t<div class=\"mui-popup-text\">" + msg + "</div>\n\t\t\t\t</div>\t\n\t\t\t\t<div class=\"mui-popup-buttons\">\n\t\t\t\t   <span class=\"mui-popup-button\">" + btn[0] + "</span>\n\t\t\t\t   <span class=\"mui-popup-button mui-popup-button-bold\">" + btn[1] + "</span>\n\t\t\t\t</div>";
			document.body.appendChild(box);
			document.body.appendChild(mask);
			for(var i = 0; i < box.lastChild.children.length; i++) {
				(function(i) {
					box.lastChild.children[i].addEventListener("tap", function(e) {
						e.index = i;
						callback.call(this, e);
						mask.remove();
						box.remove();
					});
				})(i);
			}
		},
		toast: function(msg) {
			var box = document.createElement("div");
			box.className = "mui-toast-container mui-active";
			box.innerHTML = '<div class="mui-toast-message">' + msg + '</div>';
			document.body.appendChild(box);
			setTimeout(function() {
				box.classList.remove("mui-active");
				setTimeout(function() {
					box.remove();
				}, 500);
			}, 3000);
		}
	};
	return $;
})));