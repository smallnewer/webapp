/**
 * imgLazyShow
 *
 */
(function () {
	function getRect (dom) {
		if (dom == window) {
			return {left:0,right:window.innerWidth,top:0,bottom:window.innerHeight,width:window.innerWidth,height:window.innerHeight};
		}
		if (dom.style.display == "none") {
			var p = dom.parentNode,
				r = getRect(p),
				$p = $(p),
				blw = parseInt($p.css("borderLeftWidth")),
				btw = parseInt($p.css("borderTopWidth")),
				brw = parseInt($p.css("borderRightWidth")),
				bbw = parseInt($p.css("borderBottomWidth")),
				blw = isNaN(blw) ? 0 : blw ;
				btw = isNaN(btw) ? 0 : btw ;
				brw = isNaN(brw) ? 0 : brw ;
				bbw = isNaN(bbw) ? 0 : bbw ;
			return {
				left: r.left + blw,
				right: r.right - brw,
				top: r.top + btw,
				bottom : r.bottom - bbw,
				width : r.width,
				height : r.height
			}
		};
		return dom.getBoundingClientRect();
	}
	function update ($imglist,wrap,offset) {
		var t1,t2 = getRect(wrap);
		var s = [];
		for (var i = 0; i < $imglist.length; i++) {
			t1 = getRect($imglist[i]);

			if (t1.bottom + offset < t2.top
			 || t1.top - offset > t2.bottom
			 || t1.right + offset < t2.left
			 || t1.left - offset > t2.right
			  ) {
			  	s.push(true)
				updateHide($imglist[i]);
			}else{
				s.push(false)
				updateShow($imglist[i]);
			}
		}

	}
	function updateShow (wrap) {
		
		if (wrap.parentNode.getAttribute("isHolder")) {
			// wrap.style.width = wrap.parentNode.style.width;
			// wrap.style.height = wrap.parentNode.style.height;
			// wrap.style.border = "1px solid red"
			wrap.parentNode.removeAttribute("isHolder");
			wrap.parentNode.style.width = wrap.parentNode.style.height = null;
		}
		wrap.style.display = null;
	}
	function updateHide (wrap) {
		if (wrap.style.display == "none") {return};
		//已经有宽高,让其父元素保持其占位宽高
		if (wrap.width) {
			wrap.parentNode.style.height = wrap.height + "px";
			wrap.parentNode.style.width = wrap.width + "px";
			
			wrap.parentNode.setAttribute("isHolder",true);
		}
		wrap.style.display = "none";
	}
	//$imglist ,$选中的图片集合，wrap是可视区域的容器，默认为窗口,offset容错偏差
	function imgLazyShow ($imglist,wrap,offset,iscrollObj) {
		if ($imglist._hasImgLazyShow) {return};
		wrap = wrap ? wrap : window;
		offset = offset ? offset : 0;
		$imglist._hasImgLazyShow = true;
		update($imglist,wrap,offset);
		if (!iscrollObj) {
			wrap.addEventListener("scroll",function (e) {
				update($imglist,wrap,offset);
			},false)
		}else{
			iscrollObj.options.onScrollEnd=function () {
				update($imglist,wrap,offset);
			};
		}
		
	}
	$.fn.extend({
		imgLazyShow : function (wrap,offset,iscrollObj) {
			return this.length>0 ? new imgLazyShow(this,wrap,offset,iscrollObj) : null; 
		}
	})
})();