/**
 * Component
 * pullToFresh
 * 
 * extend from $.fn.iScroll
 */
;$.fn.extend({
	pullToFresh : (function () {
		return function (downOpt,upOpt) {
			var myScroll,
				pullDownEl, pullDownOffset,
				pullUpEl, pullUpOffset,
				generatedCount = 0;

			var wrap = (this[0]) ? this[0] : null;
			if (wrap === null) return wrap;

			var hasDown = downOpt && downOpt.element;
			if (hasDown) {
				pullDownEl = $(downOpt.element);
				pullDownEl.css("display", "block");
				pullDownOffset = pullDownEl[0].offsetHeight;
				pullDownEl.css("display", "none");
			}else{
				pullDownOffset = 0;
			}
			
			var hasUp = upOpt && upOpt.element;
			if (hasUp) {
				pullUpEl = $(upOpt.element);
			
				pullUpOffset = pullUpEl[0].offsetHeight;
			}else{
				pullUpOffset = 0;
			}
			var temp = function () {
			}
			var defaultOpt = {
				onRestore : temp,
				onRelease : temp,
				onReleased : temp		
			}

			for (var key in defaultOpt){
				if (downOpt && !(key in downOpt)) {
					downOpt[key] = defaultOpt[key];
				};
				if (upOpt && !(key in upOpt)) {
					upOpt[key] = defaultOpt[key];
				};
			}
			
			
			myScroll = $('.main').iscroll({
				// useTransition: true,
				topOffset: pullDownOffset,
				onRefresh: function () {
					if (hasDown && pullDownEl.hasClass('loading')) {
						pullDownEl.removeClass(["loading","flip"]);
						downOpt.onRestore();
					} else if (hasUp && pullUpEl.hasClass('loading')) {
						pullUpEl.removeClass(["loading","flip"]);
						upOpt.onRestore();
					}
				},
				onScrollMove: function () {
					if (hasDown && this.y > 5 && !pullDownEl.hasClass('flip')) {
						//pullDownEl.className = 'flip';
						pullDownEl.addClass("flip")
						downOpt.onRelease();
						this.minScrollY = 0;
					} else if (hasDown && this.y < 5 && pullDownEl.hasClass('flip')) {
						pullDownEl.removeClass(["loading","flip"]);
						downOpt.onRestore();
						this.minScrollY = -pullDownOffset;
					} else if (hasUp && this.y < (this.maxScrollY - 5) && !pullUpEl.hasClass('flip')) {
						//pullUpEl.className = 'flip';
						pullUpEl.addClass("flip");
						upOpt.onRelease();
						this.maxScrollY = this.maxScrollY;
					} else if (hasUp && this.y > (this.maxScrollY + 5) && pullUpEl.hasClass('flip')) {
						pullUpEl.removeClass(["loading","flip"]);
						upOpt.onRestore();
						this.maxScrollY = pullUpOffset;
					}
				},
				onScrollEnd: function () {
					if (hasDown && pullDownEl.hasClass('flip')) {
						pullDownEl.addClass("loading")
						downOpt.onReleased();
					} else if (hasUp && pullUpEl.hasClass('flip')) {
						pullUpEl.addClass("loading")
						upOpt.onReleased();
					}
				}
			});
			
			if (hasDown) {pullDownEl.css("display","block");}
			myScroll.scrollTo(0,-pullDownOffset,0);
			return myScroll;
		}
	})()
});
