/**
 * promise
 *
 */
(function($){
	var A = B = {};
	
	var isFunc = function (fn) {
		return Object.prototype.toString.call(fn) === "[object Function]";
	}
	
	var isArr = function (arr) {
		return Object.prototype.toString.call(arr) === "[object Array]";
	}
	
	var isArg = function (arg) {
		return Object.prototype.toString.call(arg) === "[object Arguments]";
	}
	
	var isDeferred = (function(key){
		A = null;
		
		return function (def) {
			return def.hasOwnProperty('_key') && def['_key'] === key;
		}
	})(A);
	
	var allAreFunc = function () {
		var arg = arguments;
		
		//若参数唯一且是数组，则判断该数组
		//isArg==>有时将参数数组直接传进来，而非数组，等同数组对待
		if (arg.length == 1 && ( isArr(arg[0]) || isArg(arg[0]) )){
			arg = arg[0];
		}
		
		var flag = true;
		for (var i = 0; i < arg.length; i++) {
			flag = flag && (isFunc(arg[i]));
		}
		
		return flag;
	}
	
	var _Deferred = (function(key){
		B = null;
		
		return function () {
			var state = "unfulfilled";//resolved,rejected
			var callbacks = {
				done : [],
				fail : []
			};
			
			function setState(sta){
				state = sta;
			}
	
			var e = {};
			e.data = null;
	
			var reject = function (data,scope) {
				
				e.data = (!!data) ? data : e.data;
	
				callbacks.fail.forEach(function(key, index, arr){
					try {
						key.call(scope=scope?scope:this,e);
					}
					catch (error) {
						console.log(error)
					}
				});
				
				callbacks.fail = [];
	
				setState('rejected');
			}
	
			var resolve = function (data,scope) {
				
				e.data = (!!data) ? data : e.data;
	
				callbacks.done.forEach(function(key, index, arr){
					try {
						key.call(scope=scope?scope:this,e);
					}
					catch (error) {
						console.log(error)
					}
				});
	
				callbacks.done = [];
				setState('resolved');
				
			}
	
			var done = function (callback) {
				if (isFunc(callback) ) {
					callbacks.done.push(callback);
				}
	
				//如果当前愿望已经结束并成功，直接执行
				if ( getState() === 'resolved') {
					resolve();
				}
	
				return this;
			}
	
			var fail = function (callback) {
				if (isFunc(callback) ) {
					callbacks.fail.push(callback);
				}
				
				//如果当前愿望已经结束并失败，直接执行
				if ( getState() === 'rejected' ) {
					reject();
				}
	
				return this;
			}
	
			var then = function (donecb,failcb) {
	
				return this.done(donecb).fail(failcb);
	
			}
	
			var always = function (callback) {
	
				return this.done(callback).fail(callback);
	
			}
	
			var getState = function () {
				return state;
			}
			
			var setPromise = function (pro) {
				if (isDeferred(pro)) {
					return pro;
				}
			}
			
			
			return {
				_key : key,
				then : then,
				done : done,
				fail : fail,
				reject : reject,
				resolve : resolve,
				state : getState,
				setPromise : setPromise
			};
		}
		
	})(B);
	

	$.Deferred = function(){
		return new _Deferred();
	}
	
	/*
	 * 队列实现
	 * 参数：DeferredObject [,Deferred[,Deferred[,Deferred...]]]
	 * 示例：When(Deferred,Deferred).done(function(){});
	 */
	
	$.When = function () {
		var args = arguments;
		var promise = Deferred();
		
		var promiseQueue = [];
		
		var doneNum = 0;
		var failNum = 0;
		
		var addDone = function () {
			doneNum++;
			if (doneNum + failNum >= promiseQueue.length){
				(failNum > 0) ? promise.reject() : promise.resolve();
			}
		}
		
		var addFail = function () {
			failNum++;
			if (doneNum + failNum >= promiseQueue.length){
				promise.reject();
			}
		}
		
		for (var i = 0; i < args.length; i++) {
			if (isDeferred(args[i])) {
				promiseQueue.push(args[i]);
			}
		}
		
		for (var i = 0; i < promiseQueue.length; i++) {
			promiseQueue[i].then(addDone,addFail);
		}
		
		return promise;
		
	}


	//以下为在上基础上封装的常用函数
	
	//延迟多少毫秒执行函数,可以取消

	// Function.prototype.delay = function(time,args){
	// 	var promise = Deferred();
	// 	var time = (typeof time === 'number') ? time : 0;
		
	// 	var _this = this;
		
		
	// 	promise.done(function(){
	// 		_this.apply(_this, args);
	// 	});

	// 	var t = setTimeout(function(){
	// 		promise.resolve(args);
	// 	},time);

	// 	promise.clear = function(b){
	// 		clearTimeout(t);
	// 		promise = null;
			
	// 		!!b ? _this() : b;
	// 		return _this;
	// 	}

	// 	return promise;
	// }
	

})(iTools);



