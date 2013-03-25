(function(win,doc){

	function $ (s) {
		return new $.fn.init(s);
	}

	$.fn = $.prototype = {
		constructor : $,
		version : 0.1
	};

	function _select(s,scope,parent){
		var p = parent || document;
		var ts = p.querySelectorAll(s);

		_clearNodes(scope);

		for (var i = 0; i < ts.length; i++) {
			scope[i] = ts[i];
		};
		scope.length = ts.length;
		scope.selector = s;
	}

	function isNodeList(s) {
		return Object.prototype.toString.call(s) === "[object NodeList]";
	}

	function _clearNodes (scope) {
		if (typeof scope.length === 'number') {
			for (var i = 0; i < scope.length; i++) {
				delete scope[i];
			};
			scope.length = 0;
		};
	}

	// s : selector || function 
	$.fn.init = function(s) {
		if (!s) {
			this.length = 0;
			return null;
		};
		//selector
		if (typeof s === "string") {
			_select(s, this);
		//native node || nodelist
		}else if (s.nodeType == 1 || s.nodeType == 9 || isNodeList(s)) {
			_clearNodes(this);
			if ("length" in s) {
				for (var i = 0; i < s.length; i++) {
					this[i] = s[i];
				};
				this.length = s.length;
			}else{
				this[0] = s;
				this.length = 1;
			}
		//instantceof $
		}else if (s instanceof $) {
			return s;
		};
		

		return this;
	};

	$.fn.init.prototype = $.fn;

	//target,clone,deep or clone,deep or clone
	$.extend = $.fn.extend = function () {
		var target = arguments[0] || {},
			length = arguments.length,
			deep = !!arguments[2],
			clone = arguments[1];
		if (length == 1) {
			clone = target;
			target = this;
		};
		if (length == 2 && typeof clone == 'boolean') {
			deep = clone;
			clone = target;
			target = this;
		};
		for (var key in clone){
			if (!(key in target)) {
				//clone
				if (deep) {
					target[key] = $.extend(target, clone[key], deep);
				}else{
					target[key] = clone[key];
				};
			};
		};
		return target;
	};

	$.extend({
		isArr : function (data) {
			return Object.prototype.toString.call(data) === "[object Array]";
		},
		isFn :  function (data) {
			return Object.prototype.toString.call(data) === "[object Function]";
		},
		isUndefined : function (data) {
			return Object.prototype.toString.call(data) === "[object Undefined]";
		},
		isBoolean : function (data) {
			return Object.prototype.toString.call(data) === "[object Boolean]";
		},
		each : function (arr, stepFn) {
			if (arguments.length == 2 && typeof arr.length === 'number' && $.isFn(stepFn)) {
				for (var i = 0; i < arr.length; i++) {
					try{stepFn.call(arr[i],i,arr[i],arr);}catch(ex){}
				};
			};
			return this;
		}
	});


	$.fn.extend({
		each : function (arr, stepFn) {
			if ($.isFn(arr) && arguments.length == 1) {
				$.each(this, arr);
			}else if (arguments.length == 2 && typeof arr.length === 'number' && $.isFn(stepFn)) {
				$.each(arr, stepFn);
			};
			return this;
		},
		find : function (s) {
			return this[0] ? $(this[0].querySelectorAll(s)) : $(null);
		}
	});

	function _addClass (elm,cls) {
		if ($.isArr(cls)) {
			for (var i = 0; i < cls.length; i++) {
				_addClass(elm,cls[i]);
			};
			return;
		};
		var clses = elm.className.trim().replace(/\s+/gi," ").split(' ');
		if (clses.indexOf(cls) == -1) {
			elm.className = clses.join(" ") + " " + cls;
		};
	}
	function _removeClass (elm,cls) {
		if ($.isArr(cls)) {
			for (var i = 0; i < cls.length; i++) {
				_removeClass(elm,cls[i]);
			};
			return;
		};
		var clses = elm.className.trim().replace(/\s+/gi," ").split(' ');
		var ind = clses.indexOf(cls);
		if (ind !== -1) {
			clses.splice(ind,1);
			elm.className = clses.join(" ");
		};
	}

	function _getStyle(obj,style) {
		if (obj.currentStyle) {
			return obj.currentStyle[style];
		}else if(document.defaultView && document.defaultView.getComputedStyle){
			return document.defaultView.getComputedStyle(obj,null)[style];
		}
	}

	function _setStyle(obj,prop,value) {
		obj.style[prop] = value;
	}

	function _toCSSCase (s) {
		return s.replace(/([A-Z])/g, "-$1").toLowerCase();
	}

	function _toCamelCase (s) {
		return s.replace(/\-(\w)/g, function(all, letter){
			return letter.toUpperCase();
		});
	}

	var _dataCache = {};

	$.fn.extend({
		//cls:string or array
		addClass : function (cls) {
			this.each(function(i,item){
				_addClass(item, cls);
			});
			return this;
		},
		//cls:string or array
		removeClass : function (cls) {
			this.each(function(i,item){
				_removeClass(item, cls);
			});
			return this;
		},
		//cls:string
		hasClass : function (cls) {
			if (this[0]) {
				return this[0].className.trim().replace(/\s+/gi," ").split(' ').indexOf(cls) >= 0;
			};
		},
		css : function (key, value) {
			if (arguments.length == 1 && this[0]) {
				return _getStyle(this[0], key);
			};
			if (arguments.length == 2 && this[0]) {
				this.each(function (i) {
					_setStyle(this[i], key, value);
				})	
			};
			return this;
		},
		eq : function (ind) {
			return $(this[ind]);
		},
		attr : function (key, value) {
			if (!this[0] || arguments.length <= 0) {
				return this;
			};
			switch (arguments.length){
				case 1:
					return this[0].getAttribute(key);
					break;
				case 2:
					this[0].setAttribute(key, value);
					return this;
			}
		},
		data : function (key, value) {
			var $ele = this[0];
			if (!$ele) {
				return this;
			};
			if (!$ele._dataFlag) {
				$ele._dataFlag = "iTools" + Date.now();
			};
			var flag = $ele._dataFlag;
			switch (arguments.length){
				case 0:
					return _dataCache[flag];
					break;
				case 1:
					if (!_dataCache[flag]) {
						//try to get Attribute by key;
						var x = this.attr("data-"+_toCSSCase(key));
						// if JSON,try to parse
						if (x && (x.charAt(0) == "[" || x.charAt(0) == "{")) {
							try {
								x = JSON.parse(x);
							}catch(e){}
						};
						return x;
					}else{
						return _dataCache[flag][key];
					}
				case 2:
					if (!_dataCache[flag]) {
						_dataCache[flag] = {};
					};
					_dataCache[flag][key] = value;
					break;
			}
		}
	});

	win.iTools = $;
	win.$ = win.$ ? win.$ : iTools;
})(window,document);
