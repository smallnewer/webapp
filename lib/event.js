/**
 * event
 *
 */
(function($){

	var eleId = 1,
		fnArr = {},
		dataArr = {
			"true" : {},
			"false" : {}
		};


	function _id (ele) {
		return ele._iTEID || (ele._iTEID = ++eleId);
	}

	function initDataArr (fn, capture) {
		dataArr[capture+""][_id(fn)] || (dataArr[capture+""][_id(fn)] = {});
	}

	//p 是否包含 s
	function hasWrap (p, s) {
		while (s && s != p){s = s.parentNode;}
		return s === p;
	}

	function _addEvent (ele, types, data, fn, capture) {
		if (typeof types !== "string") {
			return;
		};
		types = types.split(" ");
		var id = _id(ele);
		//初始化fnArr中对应的id对象
		(fnArr[id] || (fnArr[id] = {}));
		if ($.isFn(data)) {
			capture = fn;
			fn = data;
			data = null;
		};

		capture = ($.isBoolean(capture)) ? capture : false;
		//初始化dataArr中指定id的对象
		initDataArr(fn, capture);
		//开始绑定事件。
		var type;

		eachTypes(types, function (i ,type) {
			
			//初始化fnArr中指定id与type的列表
			fnArr[id][type] || (fnArr[id][type] = []);
			//如果该function是被重复绑定的，则忽视。
			if (fnArr[id][type].some(function (item, index) {
				return item.fn == fn ? true : false;
			})) {
				return;
			};
			//保存data中的数据
			if (data !== null) {
				dataArr[capture+""][_id(fn)][type] = data;
			};

			//创建新的handle
			var x = newHandler(type, fn, id, capture);
			//保存在fnArr中
			fnArr[id][type].push(x);
			//事件处理器
			x.handleEvent = function (e) {
				//fix mouseout/over repeat "bug"
				if ((e.type == "mouseout" || e.type == "mouseover")
					&&
					!(!e.relatedTarget || !hasWrap(e.currentTarget,e.relatedTarget))
				) {
					return false;
				};
				
				var result = fn.apply(ele, [e,e.data = e.data ? e.data : dataArr[capture+""][_id(fn)][type]]);
				if (result === false) {
					e.preventDefault();
					e.stopPropagation();
				};
				return result;
			}

			//绑定
			ele.addEventListener(type, x, capture);

		})
		
	}

	function newHandler (type, fn, eleId, capture) {
		return {
			"type" : type,
			"fn" : fn,
			"eleId" : eleId,
			"capture" : capture
		}
	}

	function eachTypes (types, stepFn) {
		for (var i = 0; i < types.length; i++) {
			type = types[i].trim();
			stepFn(i,type);
		};
	}

	function eachHandle (ele, type, fn, capture, stepFn) {
		if (fnArr[_id(ele)] && fnArr[_id(ele)][type]) {
			for (var i = 0; i < fnArr[_id(ele)][type].length; i++) {
				capture === fnArr[_id(ele)][type][i].capture && stepFn(i , fnArr[_id(ele)][type][i], fnArr[_id(ele)][type]);
			}

		};
	}
	//清除所有指定的handle
	function clearAllHandle (ele, type, capture) {
		if (fnArr[_id(ele)] && fnArr[_id(ele)][type]) {
			for (var i = 0; i < fnArr[_id(ele)][type].length; i++) {
				capture === fnArr[_id(ele)][type][i].capture && (fnArr[_id(ele)][type].splice(i,1))
			}
		};
	}
	function clearHandle (ele, type, handle) {
		if (fnArr[_id(ele)] && fnArr[_id(ele)][type]) {
			var tarr = fnArr[_id(ele)][type];
			fnArr[_id(ele)][type] = tarr.splice(tarr.indexOf(handle),1)
		};
	}

	function _removeEvent (ele, types, fn, capture) {
		if ((typeof types !== "string" && !$.isReg(types) ) || !ele._iTEID ) {
			return;
		};
		
		if (!$.isBoolean(capture) && !$.isBoolean(fn)) {
			_removeEvent(ele, types, fn, false);
			_removeEvent(ele, types, fn, true);
			
			return;
		};
		if ($.isBoolean(fn)) {
			capture = fn;
			fn = undefined;
		};
		
		var type,
			id = _id(ele);

		//正则匹配清空
		if ($.isReg(types)) {
			for (var typ in fnArr[id]){	
				if (!types.test(typ)) {continue;};
				//删除handle
				eachHandle(ele, typ, fn, capture, function (i , handle, handles) {
					//根据fnid & type删除对应的data
					if (dataArr[capture+""] && dataArr[capture+""][_id(handle.fn)]) {
						dataArr[capture+""][_id(handle.fn)][typ] = null;
					};

					ele.removeEventListener(typ, handle, capture);
				});
				//清空对应的handles
				clearAllHandle(ele, typ, capture,1);

			}

			return;
			
		};
		types = types.split(" ");

		if (!$.isUndefined(fn)) {
			eachTypes(types, function (i, type) {
				//删除handle
				eachHandle(ele, type, fn, capture, function (i , handle, handles) {
					if (handle.fn === fn) {
						handles.splice(i, 1);
						ele.removeEventListener(type, handle, capture);
					};
				});
				//根据fnid & type删除对应的data
				delete dataArr[capture+""][_id(fn)][type];
			});

		//删除所有绑定的事件
		}else{
			eachTypes(types, function (i, type) {
				//删除handle
				eachHandle(ele, type, fn, capture, function (i , handle, handles) {
					//根据fnid & type删除对应的data
					if (dataArr[capture+""] && dataArr[capture+""][_id(handle.fn)]) {
						dataArr[capture+""][_id(handle.fn)][type] = null;
					};

					ele.removeEventListener(type, handle, capture);
				});
				//清空对应的handles
				clearAllHandle(ele, type, capture);
			});
		}
		
	}

	function _eventLength (ele, type) {
		return  (fnArr[_id(ele)] && fnArr[_id(ele)][type]) ? fnArr[_id(ele)][type].length : 0;
	}

	//capture默认为false
	function _unbind (types, fn ,capture) {
		if (arguments.length == 0) {types = /e*/gi;};
		return this.each(this,function (i, item) {
			_removeEvent(item, types, fn, capture);
		})
	}
	function _bind (types, data, fn, capture) {
		return this.each(this,function (i, item) {
			_addEvent(item, types, data, fn, capture);
		})
	}

	function _trigger (event, data) {
		if (typeof event == "string") {event = $.Event(event)};
		//fix(event)

		//data
		event.data = data;
		//dispatchevent
		return this.each(this, function (i, item) {
			this.dispatchEvent  && this.dispatchEvent(event);
		})
	}
	
	var MouseEvs = ["click","mousedown","mouseup","mousemove"];
	var transitionEvent = {
		'WebKitTransitionEvent': 'webkitTransitionEnd',
		'TransitionEvent': 'transitionend',
		'OTransitionEvent': 'oTransitionEnd'
	},transitionRet;
	transitionEvent = (function () {
		for (var name in transitionEvent){
			try{
				var ret = document.createEvent(name);
				transitionRet = name;
			}catch(ex){}
		}
		return transitionRet;
	})();
	$.Event = function(type, props) {
		if (typeof type != 'string') props = type, type = props.type
		var event = document.createEvent(MouseEvs.indexOf(type) !== -1 ? "MouseEvents" : (type == "transitionend") ? transitionEvent : 'Events'), bubbles = true
		if (props) for (var name in props) (name == 'bubbles') ? (bubbles = !!props[name]) : (event[name] = props[name])
		event.initEvent(type, bubbles, true, null, null, null, null, null, null, null, null, null, null, null, null);
		return event
	}
	// fn con || obj name
	$.proxy = function (fn, context) {
		if ($.isFn(fn)) {
			return function () {
				fn.apply(context, arguments);
			}
		}else if (typeof context == "string"){
			return function () {
				fn[context].apply(fn, arguments);
			}
		}
	}

	$.fn.extend({
		bind : _bind,
		unbind : _unbind,
		trigger : _trigger,
		evlen : function (type) {
			if (typeof type == "string" && this[0]) {
				return _eventLength(this[0], type);
			};
			return this;
		}
	});

	["mouseover","mouseout","click","focus","blur","load","resize","focusin","focusout","unload","scroll","dbclick","mousedown","mouseup","mousemove","mouseenter","mouseleave","change","select","keydown","keypress","keyup","error"].forEach(function (event) {
		$.fn[event] = function(callback) {
			return callback ?
				this.bind(event, callback) :
				this.trigger(event);
		}
	});

	$.fn.toggle = function () {
		var args = Array.prototype.slice.call(arguments);
		this.each(function (i, item) {
			var ind = -1;
			$(this).click(function () {
				ind++;
				ind = (ind>=args.length) ? 0 : ind;
				var tfn = args[ind];
				tfn.apply(this,arguments);
			})
		})
	}
	// 临时实现的on,没有过滤event\兼容等，event类需要重构
	$.fn.on = function (type, selector, fn) {
		if ($.isFn(selector)) {
			this.bind(type, selector);
		}else if(typeof selector !== 'string'){
			return this;
		}else{
			this.each(function (i, item) {
				var handfn = function (event) {
					var event = window.event || event;
					var $targets = $(item).find(selector);
					// fire
					if ($targets.index(event.target) !== -1) {
						fn.call(event.target, event);
					};
				}
				var tarr = $(item).data("_iToolsEventOnOff");
				tarr = $.isArr(tarr) ? tarr : [];
				//if repeat ,do nothing
				for (var i = 0; i < tarr.length; i++) {
					if (tarr[i].fn && tarr[i].fn === fn) {
						return;
					};
				};
				tarr.push({
					type : type,
					selector : selector,
					handfn : handfn,
					fn : fn
				});
				$(item).data("_iToolsEventOnOff", tarr).bind(type,handfn);
			});
		}
		return this;
	}
	$.fn.off = function (type, selector, fn) {
		if ($.isFn(selector)) {
			this.unbind(type, selector); // used as bind/unbind
		}else if(typeof selector !== 'string'){
			this.unbind(type); // clear all
		}else{
			this.each(function (i, item) {
				var $item = $(item);
				var tarr = $item.data("_iToolsEventOnOff");
				tarr = $.isArr(tarr) ? tarr : [];
				//if has, delete
				for (var i = 0; i < tarr.length; i++) {
					if (tarr[i].fn && tarr[i].fn === fn) {
						$item.unbind(type,tarr[i].handfn);
						tarr.splice(i, 1);
					};
				};
				
				$item.data("_iToolsEventOnOff", tarr);
			});	
		}
		return this;
	}
})(iTools);
