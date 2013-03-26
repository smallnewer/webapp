/**
 * css3prefix
 *
 */
(function($){
	//判断是否拥有属性，否则
	var div = document.createElement("div");
	var preFixes = ["Moz","Webkit","O","ms","MS"];

	$.extend({
		supportStyle : {},
		//获取浏览器支持的css key
		getSupportStyle : function (prop) {
			if ($.supportStyle[prop]) {
				return $.supportStyle[prop];
			};
			var spStyle;
			//直接支持
			if (prop in div.style) {
				spStyle = prop;
			//否则添加前缀后测试
			}else{
				var tempStyle,
					fixProp = prop.charAt(0).toUpperCase() + prop.slice(1);
				for (var i = 0; i < preFixes.length; i++) {
					tempStyle = preFixes[i] + fixProp;
					if (tempStyle in div.style) {
						spStyle = tempStyle;
						break;
					};
				};
			}

			$.supportStyle[prop] = spStyle;
			return spStyle;
		}
	})
})(iTools);
