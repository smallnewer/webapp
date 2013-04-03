// #require "css3prefix.js"
// #require "event.js"
// #require "promise.js"
// #require "queue.js"
/**
 * transtion
 * base : css3prefix, event, promise,queue
 */
(function($){
	$.supportTransitionEnd = (function (){
		var obj = {
				'WebKitTransitionEvent': 'webkitTransitionEnd',
				'TransitionEvent': 'transitionend',
				'OTransitionEvent': 'oTransitionEnd'
			}, ret ,e;
		for (var name in obj) {
			try {
				document.createEvent(name);
				ret =  obj[name];

			} catch (ex) { }
		}
		return ret;
	})();

	var options = {
		time : 300,
		ease : "cubic-bezier(0.33,0.66,0.66,1)",
		delay: 0
	}


	/*
	 * opt : time
	 *   ease
	 *   end
	 *   start
	 *   step
	 *   callback
	 */
	function _startAni (propObj, opt) {
		//propobj
		//propobj,time,ease
		//propobj,opt
		//propobj,time,fun
		//propobj,time,ease,fun
		//prop,value
		//prop,value,time
		//prop,value,opt
		//prop,value,fun
		//prop,value,time,fun

		//prop,value,opt || prop,value || prop,value,time || prop,value,fun ||prop,value,time,fun
		if (typeof propObj == "string" && arguments.length >= 2) {
			var prop = {};
			prop[propObj] = opt;
			propObj = prop;
			if (typeof arguments[2] == "number") {
				opt = {time:arguments[2]};
				if ($.isFn(arguments[3])) {
					opt.callback = arguments[3];
				};
			}else if ($.isFn(arguments[2])) {
				opt = {callback:arguments[2]};
			}else{
				opt = arguments[2];
			}
		}
		//propobj,time,ease || propobj,time,function || propobj,time,ease,function
		if ($.isObj(propObj) && typeof opt == "number") {
			opt = {
				time : opt,
				ease : (typeof arguments[2] == "string") ? arguments[2] : "linear",
				callback : $.isFn(arguments[2]) ? arguments[2] : arguments[3]
			};
		};

		var $promise = $.Deferred();

		//初始化opt
		opt = ($.isObj(opt)) ? $.extend({},opt,true) : {};

		for (var i in options) {
			opt[i] = (i in opt) ? opt[i] : options[i];
		};
		opt.time = opt.time/1000 + "s";
		opt.delay = opt.delay/1000 + "s";

		var $ele = this;
		$ele.data('fx-transitioning',true);
		//var callback = $.proxy(opt.callback,$ele);//
		var callback = opt.callback;
		//注册end事件
		function warpHandle (ev) {
			//避免冒泡捕获等造成的不合法触发
			if (ev.target !== ev.currentTarget || !(ev.propertyName in propObj)) {
				return;
			};

			fireNum++;
			if (fireNum >= proLength) {
				// callback.call(this);
				// _fire.call(this,ev.propertyName);
			};

			_fire(ev.propertyName,ev);
			$ele.data('fx-transitioning',false)

		}
		var fireNum = 0;

		var _fire = $.proxy(function (name,ev) {
			//触发以后就删除，避免重复触发
			var $ele = this;
			$ele.unbind($.supportTransitionEnd,warpHandle);
			//执行回掉
			
			$ele.trigger(name + "-transition-end");
			// $ele.unbind(name + "-transition-end");

			//开始下一个动画
			this.dequeue();
		}, $ele);
		var callbacks = [];
		function _addCallback (fn) {
			if (callbacks.indexOf(fn) == -1) {
				callbacks.push(fn);
			};
		}
		function _fireCallback () {
			// for (var i = 0; i < callbacks.length; i++) {
			// 	callbacks[i].call(this);
			// };
			$promise.resolve(null, $ele);
		}
		
		var tempObj = {},
			tempProperty = "",
			proLength = 0;
		for (var key in propObj) {
			tempProperty = $.toCSSCase($.getSupportStyle(key));
			tempObj[tempProperty] = propObj[key];
			proLength++;
			if (callback) {
				// _addCallback(callback);
				$promise.done(callback);
			};
			//绑定自定义事件,并且保证同标签同属性的唯一。
			$ele.unbind(tempProperty + "-transition-end");

			$ele.bind(tempProperty + "-transition-end",_fireCallback);
		};
		propObj = tempObj;
		//绑定事件过滤函数
		//if (callback){
			$ele.bind($.supportTransitionEnd,warpHandle);
		//}


		$ele[0].clientLeft;

		var nowProps = addProp($ele, propObj, opt.time, opt.ease,opt.delay);

		$ele.css("transition",nowProps);

		//$ele[0].clientLeft;
		//修改ele的style
		for (var key in propObj){
			//修正key:transform=>-webkit-transform
			$ele.css(key, propObj[key]);
		}
		//$ele[0].clientLeft;

		//修改duration全都为0，防止css()等修改样式造成动画
		
		//zeroTime($ele)

		$promise.$ = this;
		$promise.transition = function () {
			$promise.done(function () {
				$promise.$.transition.apply($promise.$,arguments);
			})
		}
		return this;
		// return {
		// 	done : function () {
		// 		return $promise.done.apply(this, arguments);
		// 	},
		// 	stop : function () {
		// 		var _props = $ele.css("transition-property").split(",");
		// 		$ele.each(function (i, item) {
		// 			var now,$el = $(item);
		// 			for (var i = 0; i < _props.length; i++) {
		// 				_props[i] = _props[i].trim();
		// 				now = $el.css(_props[i]);
		// 				$el.css(_props[i], now);
		// 				$promise.reject();
		// 			};
		// 		})
		// 	}
		// };
	}

	function zeroTime ($ele) {
		$ele[0].clientLeft;
		var times = $ele.css("transition-duration");
		if (times) {
			times = times.split(',')
			var temptime = "";
			for (var i = 0; i < times.length; i++) {
				temptime += ",0s";
			};
			temptime = temptime.slice(1);
			$ele.css("transition-duration",temptime);
		};
	}

	function addProp ($ele, propObj ,time, ease, delay) {
		var nowProps = $ele.css("transition-property"),
			nowTimes = $ele.css("transition-duration"),
			nowEases = $ele.css("transition-timing-function").replace(/([^0-9]+),/g,"$1@@@"),
			nowDelays = $ele.css("transition-delay");
		// 先将transition-property属性修改为正确值，然后修改ele的style为目标值
		// 解析props为数组
		var oldProps = nowProps.trim();
		if (oldProps == "all" || oldProps == "none" || typeof nowProps == "undefined") {
			nowProps = [];//"all"为默认值，清空
			nowTimes = [];
			nowEases = [];
			nowDelays= [];
		}else{
			nowProps = nowProps.replace(/\s+/g,"").split(",");
			nowTimes = nowTimes.replace(/\s+/g,"").split(",");
			nowEases = nowEases.replace(/\s+/g,"").split("@@@");
			nowDelays = nowDelays.replace(/\s+/g,"").split(",");
		}
		var ind;
		if ($.isObj(propObj)) {
			for (var key in propObj){
				ind = nowProps.indexOf(key);
				if (ind == -1) {
					nowProps.push(key);
					nowTimes.push(time);
					nowEases.push(ease);
					nowDelays.push(delay);
				}else{
					nowTimes[ind] = time;
					nowEases[ind] = ease;
					nowDelays[ind] = delay;
				}
			}
		}else if(typeof propObj == "string"){
			ind = nowProps.indexOf(key);
			if (ind == -1) {
				nowProps.push(propObj);
				nowTimes.push(time);
				nowEases.push(ease);
				nowDelays.push(delay);
			}else{
				nowTimes[ind] = time;
				nowEases[ind] = ease;
				nowDelays[ind] = delay;
			}
		}
		var res = "";
		for (var i = 0; i < nowProps.length; i++) {
			res += "," + nowProps[i] + " " + nowTimes[i] + " " + nowEases[i] + " " + nowDelays[i];
		};
		
		res = res.slice(1);

		return res;
	}
	

	function startAni (propObj, opt) {
		var _this = this,
			args = arguments;

		this.each(function (i,item) {
			var $e = $(item);

			$e.queue(function () {
				_startAni.apply($e,args)

			})
			!$e.data('fx-transitioning') && $e.dequeue() ;
		})
		this.each(function (i,item) {
			zeroTime($(item))
		})
		
		return this;
	}
	//把本元素身上的所有队列清空，并停止动画
	function stopAni () {
		var $ele = this;
		$ele.clearQueue();
		$ele.each(function (i, item) {
			var now,$el = $(item),
				_props = $ele.css("transition-property").split(",");
			for (var i = 0; i < _props.length; i++) {
				_props[i] = _props[i].trim();
				now = $el.css(_props[i]);
				$el.css(_props[i], now);
			};
			$el.unbind(new RegExp($.supportTransitionEnd,"g"));
			$el.unbind(/(\-transition\-end)$/g);
			$el.data('fx-transitioning',false);
		})
		return this;
	}

	$.fn.extend({
		transition : startAni,
		stop : stopAni
	})
})(iTools);



