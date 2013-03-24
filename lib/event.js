/**
 * event
 *
 */
(function($){
	//加工事件对象
	function comEvent (e) {
		return e;
	}

	function eachEvent (types, step) {
		types.split(/\s/g).forEach(function(type){ step(type) });
	}

	function add (ele, types, fn, data, capture) {
		eachEvent(types, fn, function (type) {
			
		})
	}
})(iTools);
