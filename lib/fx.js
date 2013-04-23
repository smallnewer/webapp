(function ($) {

	var _2PI = Math.PI * 2;
	var _HALF_PI = Math.PI / 2;
	var EaseMap = {};
	EaseMap.Back = function(overshoot) {
		this._p1 = (overshoot || overshoot === 0) ? overshoot : 1.70158;
		this._p2 = this._p1 * 1.525;
	};
	EaseMap.Back.prototype.easeIn = function(p) {
		return p * p * ((this._p1 + 1) * p - this._p1);
	};
	EaseMap.Back.prototype.easeOut = function(p) {
		return ((p = p - 1) * p * ((this._p1 + 1) * p + this._p1) + 1);
	};
	EaseMap.Back.prototype.easeInOut = function(p) {
		return ((p *= 2) < 1) ? 0.5 * p * p * ((this._p2 + 1) * p - this._p2) : 0.5 * ((p -= 2) * p * ((this._p2 + 1) * p + this._p2) + 2);
	};
	EaseMap.SlowMo = function (linearRatio, power, yoyoMode) {
		power = (power || power === 0) ? power : 0.7;
		if (linearRatio == null) {
			linearRatio = 0.7;
		} else if (linearRatio > 1) {
			linearRatio = 1;
		}
		this._p = (linearRatio !== 1) ? power : 0;
		this._p1 = (1 - linearRatio) / 2;
		this._p2 = linearRatio;
		this._p3 = this._p1 + this._p2;
		this._calcEnd = (yoyoMode === true);
	}
	EaseMap.SlowMo.prototype.ease = function(p) {
		var r = p + (0.5 - p) * this._p;
		if (p < this._p1) {
			return this._calcEnd ? 1 - ((p = 1 - (p / this._p1)) * p) : r - ((p = 1 - (p / this._p1)) * p * p * p * r);
		} else if (p > this._p3) {
			return this._calcEnd ? 1 - (p = (p - this._p3) / this._p1) * p : r + ((p - r) * (p = (p - this._p3) / this._p1) * p * p * p);
		}
		return this._calcEnd ? 1 : r;
	};

	//SlowMo.ease = new SlowMo(0.7, 0.7);

	EaseMap.SteppedEase = function(steps) {
		steps = steps || 1;
		this._p1 = 1 / steps;
		this._p2 = steps + 1;
	};
	EaseMap.SteppedEase.prototype.ease = function(p) {
		if (p < 0) {
			p = 0;
		} else if (p >= 1) {
			p = 0.999999999;
		}
		return ((this._p2 * p) >> 0) * this._p1;
	};

	EaseMap.Bounce = function () {};
	EaseMap.Bounce.prototype.easeOut = function(p) {
		if (p < 1 / 2.75) {
			return 7.5625 * p * p;
		} else if (p < 2 / 2.75) {
			return 7.5625 * (p -= 1.5 / 2.75) * p + 0.75;
		} else if (p < 2.5 / 2.75) {
			return 7.5625 * (p -= 2.25 / 2.75) * p + 0.9375;
		}
		return 7.5625 * (p -= 2.625 / 2.75) * p + 0.984375;
	};
	EaseMap.Bounce.prototype.easeIn = function(p) {
		if ((p = 1 - p) < 1 / 2.75) {
			return 1 - (7.5625 * p * p);
		} else if (p < 2 / 2.75) {
			return 1 - (7.5625 * (p -= 1.5 / 2.75) * p + 0.75);
		} else if (p < 2.5 / 2.75) {
			return 1 - (7.5625 * (p -= 2.25 / 2.75) * p + 0.9375);
		}
		return 1 - (7.5625 * (p -= 2.625 / 2.75) * p + 0.984375);
	};
	EaseMap.Bounce.prototype.easeInOut = function(p) {
		var invert = (p < 0.5);
		if (invert) {
			p = 1 - (p * 2);
		} else {
			p = (p * 2) - 1;
		}
		if (p < 1 / 2.75) {
			p = 7.5625 * p * p;
		} else if (p < 2 / 2.75) {
			p = 7.5625 * (p -= 1.5 / 2.75) * p + 0.75;
		} else if (p < 2.5 / 2.75) {
			p = 7.5625 * (p -= 2.25 / 2.75) * p + 0.9375;
		} else {
			p = 7.5625 * (p -= 2.625 / 2.75) * p + 0.984375;
		}
		return invert ? (1 - p) * 0.5 : p * 0.5 + 0.5;
	};


	EaseMap.Circ = function () {};
	EaseMap.Circ.prototype.easeIn = function(p) {
		return -(Math.sqrt(1 - (p * p)) - 1);
	};
	EaseMap.Circ.prototype.easeOut = function(p) {
		return Math.sqrt(1 - (p = p - 1) * p);
	};
	EaseMap.Circ.prototype.easeInOut = function(p) {
		return ((p*=2) < 1) ? -0.5 * (Math.sqrt(1 - p * p) - 1) : 0.5 * (Math.sqrt(1 - (p -= 2) * p) + 1);
	};

	EaseMap.Elastic = function (amplitude, period) {
		this._p1 = amplitude || 1;
		if (period) {
			this._in = this._out = this._inout = period;
		}else{
			this._in = this._out = 0.3;
			this._inout = 0.45;
		}
		this._inp3 = this._outp3 = this._in / _2PI * (Math.asin(1 / this._p1) || 0);
		this._inoutp3 = this._inout / _2PI * (Math.asin(1 / this._p1) || 0);
	}
	EaseMap.Elastic.prototype.easeIn = function(p) {
		return -(this._p1 * Math.pow(2, 10 * (p -= 1)) * Math.sin( (p - this._inp3) * _2PI / this._in ));
	};
	EaseMap.Elastic.prototype.easeOut = function(p) {
		return this._p1 * Math.pow(2, -10 * p) * Math.sin( (p - this._outp3) * _2PI / this._out ) + 1;
	};
	EaseMap.Elastic.prototype.easeInOut = function(p) {
		return ((p *= 2) < 1) ? -0.5 * (this._p1 * Math.pow(2, 10 * (p -= 1)) * Math.sin( (p - this._inoutp3) * _2PI / this._inout)) : this._p1 * Math.pow(2, -10 *(p -= 1)) * Math.sin( (p - this._inoutp3) * _2PI / this._inout ) *0.5 + 1;
	};

	EaseMap.Expo = function () {};
	EaseMap.Expo.prototype.easeIn = function(p) {
		return Math.pow(2, 10 * (p - 1)) - 0.001;
	};
	EaseMap.Expo.prototype.easeOut = function(p) {
		return 1 - Math.pow(2, -10 * p);
	};
	EaseMap.Expo.prototype.easeInOut = function(p) {
		return ((p *= 2) < 1) ? 0.5 * Math.pow(2, 10 * (p - 1)) : 0.5 * (2 - Math.pow(2, -10 * (p - 1)));
	};

	EaseMap.Sine = function () {};
	EaseMap.Sine.prototype.easeIn = function(p) {
		return -Math.cos(p * _HALF_PI) + 1;
	};
	EaseMap.Sine.prototype.easeOut = function(p) {
		return Math.sin(p * _HALF_PI);
	};
	EaseMap.Sine.prototype.easeInOut = function(p) {
		return -0.5 * (Math.cos(Math.PI * p) - 1);
	};

	EaseMap.Linear = function () {};
	EaseMap.Linear.prototype.ease = function(p) {
		return p;
	};

	var defaultEase = {};
	for(var key in EaseMap){
		if (key == 'SlowMo') {
			defaultEase[key] = new EaseMap[key](0.7, 0.7);
		}else{
			defaultEase[key] = new EaseMap[key]();
		}
	};
	$.easeMap = EaseMap;
	$.ease = defaultEase;
	

//
//////////////////////////////////////////
//   Timeline
//   base event
//////////////////////////////////////////
//
var Timeline = function () {
	this.init();
}
Timeline.prototype.init = function() {
	this._obj = $(document.createElement("div"));
	this.fps = this._fps = 0;
	this._initTime = Date.now();
	this._lastTrickTime = this._initTime;
	this.frag = "_iToolsTimeLine" + this._initTime + Math.random();
	this._nextFrame = $.proxy((function() {
		return window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.oRequestAnimationFrame ||
			window.msRequestAnimationFrame ||
			function(callback) { return setTimeout(callback, 1); };
	})(),window);
	this._cancelFrame = $.proxy((function () {
		return window.cancelRequestAnimationFrame ||
			window.webkitCancelAnimationFrame ||
			window.webkitCancelRequestAnimationFrame ||
			window.mozCancelRequestAnimationFrame ||
			window.oCancelRequestAnimationFrame ||
			window.msCancelRequestAnimationFrame ||
			clearTimeout;
	})(),window);
	this._proxyTrick = $.proxy(this._trick, this);
	this._stop = true;
};
Timeline.prototype.start = function() {
	if (this._stop) {
		this._t = this._nextFrame(this._proxyTrick);
		this._lastStartTime = Date.now();
		this._stop = false;
	};
};

Timeline.prototype.stop = function() {
	this._stop = true;
	this._cancelFrame(this._t);
};

Timeline.prototype._trick = function() {
	this._obj.trigger(this.frag, Date.now());
	this._updateFPS();
	if (!this._stop) {
		this._nextFrame(this._proxyTrick);
	};
};

Timeline.prototype.addFrame = function(fn) {
	this._obj.bind(this.frag,fn);
	this.start();
};

Timeline.prototype.removeFrame = function(fn) {
	this._obj.unbind(this.frag,fn);
	if (this._obj.evlen(this.frag) == 0) {
		this.stop();
	};
};
//获取上一秒的fps
Timeline.prototype.getFPS = function() {
	return this.fps;
};

Timeline.prototype._updateFPS = function() {
	this._fps++;
	var now = Date.now();
	if (Math.floor(now / 1000) != Math.floor(this._lastTrickTime / 1000)) {
		this.fps = this._fps;
		this._fps = 0;
		this._lastTrickTime = now;
	};
};

Timeline.prototype.destory = function() {
	this.stop();
	this._obj.unbind();
	for( var i in this ){
		delete this[i];
	}
};

$.timeline = new Timeline();

})(iTools);