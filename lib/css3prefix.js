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
	})
})(iTools);
