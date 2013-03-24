/**
 * imgZoomer
 *
 */
(function ($) {
	/*
	 * opt: maxScale,minScale,maxOffset
	 *
	 */
	var _imgZoomer = function (wrap,opt) {
		var w = this.wrap = wrap;
		if (w._hasImgZoomer) {return};

		this.dOpt = {
			maxScale : 4,
			maxOffset : 40,
			minScale : 1
		};

		for ( var i in this.dOpt ){
			if (opt && i in opt) {
				this.dOpt[i] = opt[i];
			};
		}
		this.refresh();

		this.startMatrix = new WebKitCSSMatrix();
		this.wrap.style.webkitTransform = this.startMatrix.scale(1).translate(0,0,0);
		this._scale = 1;
		this._gesturing = false;

		w.addEventListener("gesturestart",this,false);
		w.addEventListener('gesturechange',this,false);
		w.addEventListener('gestureend',this,false);
		w.addEventListener("touchstart",this,false);
		w.addEventListener("touchmove",this,false);
		w.addEventListener("touchend",this,false);

		w._hasImgZoomer = true;
		return this;
	}
	_imgZoomer.prototype.refresh = function() {
		//因为等比缩放，所以只需要判断宽度即可
		this.dOpt.maxW = this.wrap.offsetWidth * this.dOpt.maxScale;
		this.dOpt.minW = this.wrap.offsetWidth * this.dOpt.minScale;
	};
	_imgZoomer.prototype._gstart = function (e) {
		e.preventDefault();
		e.stopPropagation();
		var w = this.wrap;
		w.style.webkitTransition = "-webkit-transform 0 cubic-bezier(0.33,0.66,0.66,1)";
		this.startMatrix = new WebKitCSSMatrix(this.wrap.style.webkitTransform);
		this._gesturing = true;
	}
	_imgZoomer.prototype._gchange = function (e) {
		e.preventDefault();
		e.stopPropagation();
		// this._scale = e.scale;
		this.wrap.style.webkitTransform = this.startMatrix.scale(e.scale);
		
	}
	_imgZoomer.prototype._gend = function (e){
		e.preventDefault();
		e.stopPropagation();
		this._scale *= e.scale;
		var w = this.wrap;
		var range = w.getBoundingClientRect();
		var nw = range.width ? range.width : range.right - range.left;

		if (nw >= this.dOpt.maxW  || nw <= this.dOpt.minW ) {
			w.style.webkitTransition = "-webkit-transform 0.3s ease";
			this.startMatrix = new WebKitCSSMatrix(w.style.webkitTransform);
			//this.startMatrix.translate(0,0,0);
			var t = (nw >= this.dOpt.maxW) ? this.dOpt.maxScale : this.dOpt.minScale;
			this.startMatrix =  this.startMatrix.scale(t/this._scale);
			this.wrap.removeEventListener("webkitTransitionEnd",this,false);
			this.wrap.addEventListener("webkitTransitionEnd",this,false);
			this._scale = t;
		}else{
			this.startMatrix = new WebKitCSSMatrix(w.style.webkitTransform);
			this._gesturing = false;
		}
		w.style.webkitTransform = this.startMatrix;
		
	}
	_imgZoomer.prototype._webkitTransitionEnd = function(e) {
		// e.stopPropagation();
		// e.preventDefault();
		this._gesturing = false;
	};
	_imgZoomer.prototype._start = function (e){

		if (e.touches.length > 1) {
			return;
		};

		// return;
		this._touchX = e.touches[0].pageX;
		this._touchY = e.touches[0].pageY;
		this._dTouchX = 0;
		this._dTouchY = 0;
		this._lastTouchX = this._touchX;
		this._lastTouchY = this._touchY;
		this._touchP = e.touches[0];
		this.startMatrix = new WebKitCSSMatrix(this.wrap.style.webkitTransform);
		
	}
	_imgZoomer.prototype._move = function (e){
		e.preventDefault();
		e.stopPropagation();
		
		if (e.touches.length > 1 ) {
			return;
		};

		if (Math.abs(e.touches[0].pageY - this._touchY)>5 || Math.abs(e.touches[0].pageX - this._touchX)>5) {
			if (this._scale <= 1) {
				return;
			};

			var wh = this.wrap.getBoundingClientRect();
			wh.width = typeof wh.width == 'number' ? wh.width : wh.right-wh.left;
			wh.height = typeof wh.height == 'number' ? wh.height : wh.bottom-wh.top;
			var wh1 = this.wrap.parentNode.getBoundingClientRect();
			wh1.width = typeof wh1.width == 'number' ? wh1.width : wh1.right-wh1.left;
			wh1.height = typeof wh1.height == 'number' ? wh1.height : wh1.bottom-wh1.top;

			var x = (e.touches[0].pageX - this._touchX)/this._scale,
				y = (e.touches[0].pageY - this._touchY)/this._scale;

			
			if (wh1.left<wh.left ) {
				//变化量
				this._dTouchX += (e.touches[0].pageX - this._lastTouchX) * (1-((wh.left-wh1.left)/100)) / this._scale;
				// x *=( (wh.left - wh1.left )/100);
			}else if (wh1.right>wh.right) {
				this._dTouchX += (e.touches[0].pageX - this._lastTouchX) * (1-((wh1.right-wh.right)/100)) / this._scale;
			}else{
				this._dTouchX += (e.touches[0].pageX - this._lastTouchX) * 1 / this._scale;
			}

			if (wh1.top<wh.top) {
				//变化量
				this._dTouchY += (e.touches[0].pageY - this._lastTouchY) * (1-((wh.top-wh1.top)/100)) / this._scale;
				// x *=( (wh.left - wh1.left )/100);
			}else if (wh1.bottom>wh.bottom) {
				this._dTouchY += (e.touches[0].pageY - this._lastTouchY) * (1-((wh1.bottom-wh.bottom)/100)) / this._scale;
			}else{
				this._dTouchY += (e.touches[0].pageY - this._lastTouchY) * 1 / this._scale;
			}
			
			if (parseFloat(this.wrap.style.webkitTransitionDuration)>0) {
				this.wrap.style.webkitTransitionDuration = "0s";
			};

			
			this._lastTouchX = e.touches[0].pageX;
			this._lastTouchY = e.touches[0].pageY;

			this.wrap.style.webkitTransform = this.startMatrix.translate(this._dTouchX,this._dTouchY,0);
		};

	}
	_imgZoomer.prototype._end = function (e){
		
		if (e.touches.length >= 1) {
			this._lastTouchX = e.touches[0].pageX;
			this._lastTouchY = e.touches[0].pageY;
			this._touchP = e.touches[0];
		}else{
			this.wrap.style.webkitTransitionDuration = "0.2s";
			if (this._scale == 1) {
				this.wrap.style.webkitTransform = new WebKitCSSMatrix();
				return;
			};
			var wh = this.wrap.getBoundingClientRect();
			wh.width = typeof wh.width == 'number' ? wh.width : wh.right-wh.left;
			wh.height = typeof wh.height == 'number' ? wh.height : wh.bottom-wh.top;
			var wh1 = this.wrap.parentNode.getBoundingClientRect();
			wh1.width = typeof wh1.width == 'number' ? wh1.width : wh1.right-wh1.left;
			wh1.height = typeof wh1.height == 'number' ? wh1.height : wh1.bottom-wh1.top;

			if (wh1.left<wh.left) {
				
				this._dTouchX = this._dTouchX + (wh1.left - wh.left) / this._scale;
			}else if (wh1.right>wh.right) {
				this._dTouchX = this._dTouchX + (wh1.right - wh.right) / this._scale;
			}
			
			if (wh1.top<wh.top && wh1.bottom<wh.bottom) {
				this.wrap.style.webkitTransitionDuration = "0.2s";
				this._dTouchY = this._dTouchY + (wh1.top - wh.top) / this._scale;
			}else if (wh1.bottom>wh.bottom&&wh1.top>wh.top) {
				this.wrap.style.webkitTransitionDuration = "0.2s";
				this._dTouchY = this._dTouchY + (wh1.bottom - wh.bottom) / this._scale;
			}

			this.wrap.style.webkitTransform = this.startMatrix.translate(this._dTouchX,this._dTouchY,0);
		}
		
	}
	_imgZoomer.prototype.handleEvent = function (e) {
		switch (e.type){
			case "gesturestart":
				this._gstart(e);
				break;
			case "gesturechange":
				this._gchange(e);
				break; 
			case "gestureend":
				this._gend(e);
				break;
			case "touchstart":
				this._start(e);
				break;
			case "touchmove":
				this._move(e);
				break; 
			case "touchend":
				this._end(e);
				break; 
			case "webkitTransitionEnd":
				this._webkitTransitionEnd(e);
				break; 
		}
	}
	_imgZoomer.prototype.destroy = function () {
		delete this.wrap._hasImgZoomer;
		this.wrap.removeEventListener("gesturestart",this,false);
		this.wrap.removeEventListener('gesturechange',this,false);
		this.wrap.removeEventListener('gestureend',this,false);
		this.wrap = null;
	}
	$.fn.extend({
		imgZoomer : function (opt) {
			return this.length>=1 ? new _imgZoomer(this[0],opt) : null;
		}
	});
})(iTools);