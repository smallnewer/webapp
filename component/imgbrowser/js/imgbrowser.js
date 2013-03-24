/**
 * imgBrowser
 * base on imgZoomer
 */
(function ($) {
	function _getLT (source, target) {
		var spos = source.getBoundingClientRect();
		var tpos = target.getBoundingClientRect();
		return {
			left : spos.left - tpos.left,
			top : spos.top - tpos.top
		};
	}
	function refresh () {
		
	}
	var _imgBrowser = function () {
		var d = this[0];
		if (!d || (d && d._hasImgBrowser)) {refresh();return null;};
		var frag = document.createDocumentFragment();
		var wrap = document.createElement("div");
		wrap.style.cssText = "position:fixed;left:0;top:0;z-index:9999999;width:100%;height:100%;overflow:hidden;text-align:center;background:rgba(0,0,0,0);-webkit-transition:background-color 0.2s ease";
		var div = document.createElement("div");
		div.style.cssText = "display: -webkit-box;height: 100%;-webkit-box-orient: vertical;-webkit-box-pack: center;";
		var img = document.createElement('img');
		img.style.cssText = "display:none;margin: 0 auto;width:"+d.width+";height:"+d.height+";-webkit-transform:translateZ(0);";
		img.src = d.src;


		div.appendChild(img);
		wrap.appendChild(div);
		frag.appendChild(wrap);

		img.style.display = "inline-block";
		img.style.width = "100%";
		
		$zoomer = $(img).imgZoomer();
		wrap._state = "hide";
		var t1 = img.getBoundingClientRect(),
				t2 = d.getBoundingClientRect(),
				scale = (t2.right - t2.left)/(t1.right-t1.left);
		function show() {
			
			var t1 = img.getBoundingClientRect(),
				t2 = d.getBoundingClientRect();
			scale = (t2.right - t2.left)/(t1.right-t1.left);
			var t1 = _getLT(d, document.body),
				t2 = _getLT(wrap, document.body),
				t3 = _getLT(img, wrap),
				t = (t1.top - t2.top - t3.top + d.offsetHeight/2 - img.offsetHeight/2),
				l = (t1.left - t2.left - t3.left + d.offsetWidth/2 - img.offsetWidth/2);
				
			img.style.webkitTransform = "translate("+l+"px,"+t+"px) scale("+scale+") translateZ(0)";
			img.style.webkitTransition = "-webkit-transform 0s ease";
			wrap.style.backgroundColor = "rgba(0,0,0,1)";
			setTimeout(function () {
				img.style.webkitTransform = "translate(0,0) scale(1) translateZ(0)";
				img.style.webkitTransition = "-webkit-transform 0.2s ease";
				bindShowEnd();
				$zoomer.refresh();
			},0)
			
		}
		function hide() {
			
			wrap.style.backgroundColor = "rgba(0,0,0,0)";
			
			img.style.webkitTransition = "-webkit-transform 0s ease";
			img.style.webkitTransform = new WebKitCSSMatrix();

			setTimeout(function () {
				var t1 = img.getBoundingClientRect(),
					t2 = d.getBoundingClientRect(),
					w = t1.right - t1.left,
					h = t1.bottom - t1.top;
				var t1 = _getLT(d, document.body),
				t2 = _getLT(wrap, document.body),
				t3 = _getLT(img, wrap),
				t = (t1.top - t2.top - t3.top + d.offsetHeight/2 - h/2),
				l = (t1.left - t2.left - t3.left + d.offsetWidth/2 - w/2);

				img.style.webkitTransform = " translate("+l+"px,"+t+"px) scale("+scale+") translateZ(0)";
				img.style.webkitTransition = "-webkit-transform 0.2s ease";
				bindHideEnd();
			},0)
			
		}
		function showEnd (e) {
			e.stopPropagation();
			e.preventDefault();
			wrap._state = "show";
			$zoomer.refresh();
		}
		function hideEnd (e) {
			e.stopPropagation();
			e.preventDefault();
			img.style.webkitTransform = "translateZ(0)";
			frag.appendChild(wrap);
			wrap._state = "hide";
		}
		function bindShowEnd () {
			img.removeEventListener("webkitTransitionEnd",showEnd,false);
			img.removeEventListener("webkitTransitionEnd",hideEnd,false);
			img.addEventListener("webkitTransitionEnd",showEnd,false);
		}
		function bindHideEnd () {
			img.removeEventListener("webkitTransitionEnd",showEnd,false);
			img.removeEventListener("webkitTransitionEnd",hideEnd,false);
			img.addEventListener("webkitTransitionEnd",hideEnd,false);
		}
		
		d.addEventListener("click",function () {
			document.body.appendChild(frag);
			setTimeout(show,0);
		},false);
		wrap.addEventListener("click",function () {
			hide();
		},false);
		d._hasImgBrowser = true;
	}
	$.fn.extend({
		imgBrowser : _imgBrowser
	});
})(iTools);
