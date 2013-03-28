/**
 * queue
 * 
 */
(function($){
	/* 
	 * queue:name，fn
	 * 为name队列添加fn
	 */
	var prefix = "iToolsQueue-";
	function queue (name,fn) {
		if (!$.isFn(arguments[arguments.length-1])) {return};
		if ($.isFn(name)) {
			fn = name;
			name = "fx";
		};
		name = prefix + name;
		this.each(function (i, $ele) {
			var list = $($ele).data(name);
			list = $.isArr(list) ? list : [];
			if (list.indexOf(fn) == -1) {
				list.push(fn);
			};
			$($ele).data(name,list);
		})
		
	}
	/*
	 * dequeue:name
	 * 使name队列中的下一个fn执行
	 */
	function dequeue (name) {
		name = name ? name : "fx";
		name = prefix + name;
		this.each(function (i, $ele) {
			var list = $($ele).data(name);
			if ($.isArr(list) && list.length > 0) {
				try{
					list.shift().call($ele);
				}catch(e){};
				$($ele).data(name,list);
			};
		})
		
	}
	/*
	 * queueSize:name
	 * 获得选中标签中的一个标签的name队列的长度
	 */
	function queueSize (name) {
		name = name ? name : "fx";
		name = prefix + name;
		return (this.data(name) && this.data(name).length) || 0;
	}

	/*
	 * clearQueue:name
	 *  清空name队列
	 */
	function clearQueue (name) {
		name = name ? name : "fx";
		name = prefix + name;
		this.data(name ,[]);
		return this;
	}
	

	$.fn.queue = queue;
	$.fn.dequeue = dequeue;
	$.fn.queueSize = queueSize;
	$.fn.clearQueue = clearQueue;
})(iTools);



