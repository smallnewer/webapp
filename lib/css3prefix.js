/**
 * css3 prefix
 *
 */
(function($){

	var div = document.createElement("div");
	var pres = ["O","ms","Webkit","Moz"];
	$.extend({
		supportStyle : {},
		getSupportStyle : function (key) {
			if (key in $.supportStyle) {
				return $.supportStyle[key];
			};
			key = $.toCamelCase(key)
			if (key in div.style) {
				return key;
			};

			var pre,pStyle,tKey;
			tKey = key.charAt(0).toUpperCase() + key.slice(1);
			tKey = $.toCamelCase(tKey);
			for (var i = 0; i < pres.length; i++) {
				pStyle = pres[i] + tKey;
				if (pStyle in div.style) {
					$.supportStyle[key] = pStyle;
					break;
				};
			};
			
			return pStyle;
		}
	});
	//借鉴gasp代码实现getTransformValues，封一个获取和设置transform的方法
	
	$.fn.transform = function (value) {
		if (arguments.length == 1) {
			return this.css($.getSupportStyle("transform"),value);
		}
		return _getTransform(this);
	}

	/**
	 * 为一个标签解析 transform values , 返回一个对象，包含 x, y, z, scaleX, scaleY, scaleZ, rotation, rotationX, rotationY, skewX, and skewY 属性. 
	 提示：默认情况下（因为性能原因）,所有skew被合并到skewX和rotation。但是skewY仍保留在transform对象里，保证我们可以记录skewX和Y的值是多少。记住，一个10的skewY看起来和rotation10+skewX-10一样。
	 * @param {!Object} t target element
	 * @param {Object=} cs computed style object (optional)
	 * @param {boolean=} rec if true, the transform values will be recorded to the target element's _gsTransform object, like target._gsTransform = {x:0, y:0, z:0, scaleX:1...}
	 * @return {object} object containing all of the transform properties/values like {x:0, y:0, z:0, scaleX:1...}
	 */
	var _getTransform = function(t, cs, rec) {
		var _transformOriginProp = t.css("transformOrigin");
		var _transformProp = $.toCamelCase($.getSupportStyle("transform"));
		var _transformPropCSS = $.toCSSCase(_transformProp);
		var _supports3D = !!t.css("perspective");
		var tm = rec ? t.data("_gsTransform") || {skewY:0} : {skewY:0},
			invX = (tm.scaleX < 0), //为了尽可能解释事情，我们需要知道如果用户事先应用了一个negative scaleX ，保证我们可以应用rotation和skewX有依据。否则，如果我们总是解释一个fliped 矩阵作为scaleY，然后用户只需要tween scaleX在联合的tweens上，它需要保持negative scakeY除了作为用户的intent。
			min = 0.00002,
			rnd = 100000,
			minPI = -Math.PI + 0.0001,
			maxPI = Math.PI - 0.0001,
			zOrigin = _supports3D ? parseFloat(t.css("transformOrigin").split(" ")[2]) || tm.zOrigin  || 0 : 0,
			s, m, i, n, dec, scaleX, scaleY, rotation, skewX, difX, difY, difR, difS;
		//if (_transformProp) {
			s = t.css("transform");
		//}
		//split the matrix values out into an array (m for matrix)
		m = (s || "").match(/(?:\-|\b)[\d\-\.e]+\b/gi) || [];
		i = m.length;
		while (--i > -1) {
			n = Number(m[i]);
			m[i] = (dec = n - (n |= 0)) ? ((dec * rnd + (dec < 0 ? -0.5 : 0.5)) | 0) / rnd + n : n; //convert strings to Numbers and round to 5 decimal places to avoid issues with tiny numbers. Roughly 20x faster than Number.toFixed(). We also must make sure to round before dividing so that values like 0.9999999999 become 1 to avoid glitches in browser rendering and interpretation of flipped/rotated 3D matrices. And don't just multiply the number by rnd, floor it, and then divide by rnd because the bitwise operations max out at a 32-bit signed integer, thus it could get clipped at a relatively low value (like 22,000.00000 for example).
		}
		if (m.length === 16) {

			//we'll only look at these position-related 6 variables first because if x/y/z all match, it's relatively safe to assume we don't need to re-parse everything which risks losing important rotational information (like rotationX:180 plus rotationY:180 would look the same as rotation:180 - there's no way to know for sure which direction was taken based solely on the matrix3d() values)
			var a13 = m[8], a23 = m[9], a33 = m[10],
				a14 = m[12], a24 = m[13], a34 = m[14];

			//we manually compensate for non-zero z component of transformOrigin to work around bugs in Safari
			if (tm.zOrigin) {
				a34 = -tm.zOrigin;
				a14 = a13*a34-m[12];
				a24 = a23*a34-m[13];
				a34 = a33*a34+tm.zOrigin-m[14];
			}

			//only parse from the matrix if we MUST because not only is it usually unnecessary due to the fact that we store the values in the _gsTransform object, but also because it's impossible to accurately interpret rotationX, rotationY, and rotationZ if all are applied, so it's much better to rely on what we store. However, we must parse the first time that an object is tweened. We also assume that if the position has changed, the user must have done some styling changes outside of CSSPlugin, thus we force a parse in that scenario.
			if (!rec || a14 !== tm.x || a24 !== tm.y || a34 !== tm.z) {
				var a11 = m[0], a21 = m[1], a31 = m[2], a41 = m[3],
					a12 = m[4], a22 = m[5], a32 = m[6], a42 = m[7],
					a43 = m[11],
					angle = tm.rotationX = Math.atan2(a32, a33),
					xFlip = (angle < minPI || angle > maxPI),
					t1, t2, t3, t4, cos, sin, yFlip, zFlip;
				//rotationX
				if (angle) {
					cos = Math.cos(-angle);
					sin = Math.sin(-angle);
					t1 = a12*cos+a13*sin;
					t2 = a22*cos+a23*sin;
					t3 = a32*cos+a33*sin;
					t4 = a42*cos+a43*sin;
					a13 = a12*-sin+a13*cos;
					a23 = a22*-sin+a23*cos;
					a33 = a32*-sin+a33*cos;
					a43 = a42*-sin+a43*cos;
					a12 = t1;
					a22 = t2;
					a32 = t3;
					//a42 = t4;
				}
				//rotationY
				angle = tm.rotationY = Math.atan2(a13, a11);
				if (angle) {
					yFlip = (angle < minPI || angle > maxPI);
					cos = Math.cos(-angle);
					sin = Math.sin(-angle);
					t1 = a11*cos-a13*sin;
					t2 = a21*cos-a23*sin;
					t3 = a31*cos-a33*sin;
					t4 = a41*cos-a43*sin;
					//a13 = a11*sin+a13*cos;
					a23 = a21*sin+a23*cos;
					a33 = a31*sin+a33*cos;
					a43 = a41*sin+a43*cos;
					a11 = t1;
					a21 = t2;
					a31 = t3;
					//a41 = t4;
				}
				//rotationZ
				angle = tm.rotation = Math.atan2(a21, a22);
				if (angle) {
					zFlip = (angle < minPI || angle > maxPI);
					cos = Math.cos(-angle);
					sin = Math.sin(-angle);
					a11 = a11*cos+a12*sin;
					t2 = a21*cos+a22*sin;
					a22 = a21*-sin+a22*cos;
					a32 = a31*-sin+a32*cos;
					a21 = t2;
				}

				if (zFlip && xFlip) {
					tm.rotation = tm.rotationX = 0;
				} else if (zFlip && yFlip) {
					tm.rotation = tm.rotationY = 0;
				} else if (yFlip && xFlip) {
					tm.rotationY = tm.rotationX = 0;
				}

				tm.scaleX = ((Math.sqrt(a11 * a11 + a21 * a21) * rnd + 0.5) >> 0) / rnd;
				tm.scaleY = ((Math.sqrt(a22 * a22 + a23 * a23) * rnd + 0.5) >> 0) / rnd;
				tm.scaleZ = ((Math.sqrt(a32 * a32 + a33 * a33) * rnd + 0.5) >> 0) / rnd;
				tm.skewX = 0;
				tm.perspective = a43 ? 1 / ((a43 < 0) ? -a43 : a43) : 0;
				tm.x = a14;
				tm.y = a24;
				tm.z = a34;
			}

		} else if (!_supports3D || m.length === 0 || tm.x !== m[4] || tm.y !== m[5] || (!tm.rotationX && !tm.rotationY)) { //sometimes a 6-element matrix is returned even when we performed 3D transforms, like if rotationX and rotationY are 180. In cases like this, we still need to honor the 3D transforms. If we just rely on the 2D info, it could affect how the data is interpreted, like scaleY might get set to -1 or rotation could get offset by 180 degrees. For example, do a TweenLite.to(element, 1, {css:{rotationX:180, rotationY:180}}) and then later, TweenLite.to(element, 1, {css:{rotationX:0}}) and without this conditional logic in place, it'd jump to a state of being unrotated when the 2nd tween starts. Then again, we need to honor the fact that the user COULD alter the transforms outside of CSSPlugin, like by manually applying new css, so we try to sense that by looking at x and y because if those changed, we know the changes were made outside CSSPlugin and we force a reinterpretation of the matrix values.
			var k = (m.length >= 6),
				a = k ? m[0] : 1,
				b = m[1] || 0,
				c = m[2] || 0,
				d = k ? m[3] : 1;

			tm.x = m[4] || 0;
			tm.y = m[5] || 0;
			scaleX = Math.sqrt(a * a + b * b);
			scaleY = Math.sqrt(d * d + c * c);
			rotation = (a || b) ? Math.atan2(b, a) : tm.rotation || 0; //note: if scaleX is 0, we cannot accurately measure rotation. Same for skewX with a scaleY of 0. Therefore, we default to the previously recorded value (or zero if that doesn't exist).
			skewX = (c || d) ? Math.atan2(c, d) + rotation : tm.skewX || 0;
			difX = scaleX - Math.abs(tm.scaleX || 0);
			difY = scaleY - Math.abs(tm.scaleY || 0);
			if (Math.abs(skewX) > Math.PI / 2 && Math.abs(skewX) < Math.PI * 1.5) {
				if (invX) {
					scaleX *= -1;
					skewX += (rotation <= 0) ? Math.PI : -Math.PI;
					rotation += (rotation <= 0) ? Math.PI : -Math.PI;
				} else {
					scaleY *= -1;
					skewX += (skewX <= 0) ? Math.PI : -Math.PI;
				}
			}
			difR = (rotation - tm.rotation) % Math.PI; //note: matching ranges would be very small (+/-0.0001) or very close to Math.PI (+/-3.1415).
			difS = (skewX - tm.skewX) % Math.PI;
			//if there's already a recorded _gsTransform in place for the target, we should leave those values in place unless we know things changed for sure (beyond a super small amount). This gets around ambiguous interpretations, like if scaleX and scaleY are both -1, the matrix would be the same as if the rotation was 180 with normal scaleX/scaleY. If the user tweened to particular values, those must be prioritized to ensure animation is consistent.
			if (tm.skewX === undefined || difX > min || difX < -min || difY > min || difY < -min || (difR > minPI && difR < maxPI && (difR * rnd) >> 0 !== 0) || (difS > minPI && difS < maxPI && (difS * rnd) >> 0 !== 0)) {
				tm.scaleX = scaleX;
				tm.scaleY = scaleY;
				tm.rotation = rotation;
				tm.skewX = skewX;
			}
			if (_supports3D) {
				tm.rotationX = tm.rotationY = tm.z = 0;
				//tm.perspective = parseFloat(CSSPlugin.defaultTransformPerspective) || 0;
				tm.perspective = 0;
				tm.scaleZ = 1;
			}
		}
		tm.zOrigin = zOrigin;

		//some browsers have a hard time with very small values like 2.4492935982947064e-16 (notice the "e-" towards the end) and would render the object slightly off. So we round to 0 in these cases. The conditional logic here is faster than calling Math.abs(). Also, browsers tend to render a SLIGHTLY rotated object in a fuzzy way, so we need to snap to exactly 0 when appropriate.
		for (i in tm) {
			if (tm[i] < min) if (tm[i] > -min) {
				tm[i] = 0;
			}
			//alternate method rounds to 5 decimal places: tm[i] = ((tm[i] * rnd) >> 0) / rnd;
		}
		//DEBUG: _log("parsed rotation: "+(tm.rotationX*_RAD2DEG)+", "+(tm.rotationY*_RAD2DEG)+", "+(tm.rotation*_RAD2DEG)+", scale: "+tm.scaleX+", "+tm.scaleY+", "+tm.scaleZ+", position: "+tm.x+", "+tm.y+", "+tm.z+", perspective: "+tm.perspective);
		if (rec) {
			t._gsTransform = tm; //record to the object's _gsTransform which we use so that tweens can control individual properties independently (we need all the properties to accurately recompose the matrix in the setRatio() method)
		}
		return tm;
	}
})(iTools);

