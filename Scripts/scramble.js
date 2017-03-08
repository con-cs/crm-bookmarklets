function scramble() {
	function shuffle(elt) {
	    var a = elt.split('');
	    var n = a.length;
	    for(var i = n - 2; i > 1; i--) {
	        var j = Math.floor((Math.random() * (n-2 - 1)) + 1);
	        var tmp = a[i];
	        a[i] = a[j];
	        a[j] = tmp;
	    }
	    return a.join('');
	}
	function preShuffle(element){
		var strings = element.split(' ');
		for (var indexStr in strings) {
			strings[indexStr] = shuffle(strings[indexStr]);
		}
		return strings.join(' ');
	}
	function getFrame() {
		var $iframe = $('#crmContentPanel iframe:not([style*="visibility: hidden"])');
		if (typeof $iframe.length === 'undefined' && $iframe.contentWindow.Xrm.Page.ui) {
			return $iframe.contentWindow;
		}
		if ($iframe.length > 0 && $iframe[0].contentWindow.Xrm.Page.ui) {
			return $iframe[0].contentWindow;
		}
		return null;
	}
	var frame = getFrame();
	if (frame === null) {
		var Arr = ['button','h1','label','input','h2','h3','li','textarea','td','p','a','span'];
		for (var index in Arr) {
			$(Arr[index]).not(':has(*)').each(function(index,element){
				var a = preShuffle($(element).text());
				$(element).text(a);
			});
			$(Arr[index]).children().not(':has(*)').each(function(index,element){
				var a = preShuffle($(element).text());
				$(element).text(a);
			});
		}
	} else {
		frame.Xrm.Page.ui.controls.forEach(function(a) {
			var elName = a.getName();
			var elLabel = a.getLabel();
			if (frame.Xrm.Page.getAttribute(elName) != null) {
				var elValue = frame.Xrm.Page.getAttribute(elName).getValue();
				if (!Array.isArray(elValue) && elValue!=null && elValue.length>3){
 					frame.Xrm.Page.getAttribute(elName).setValue(preShuffle(elValue));
 				}
			}
			a.setLabel(preShuffle(elLabel));
		});
	}
}

function main() {
	scramble();
}

(function() {
	function scriptAvailable(url, type) {
		var scripts = document.getElementsByTagName(type);
		for (var indexS in scripts) {
			if (scripts[indexS].src) {
				if (scripts[indexS].src === url) {
					return true;
				}
			} else {
				if (scripts[indexS].href === url) {
					return true;
				}
			}
		}
		return false;
	}

	function loadScript(url, callback) {
		if (!scriptAvailable(url, 'Script')) {
			var script = document.createElement('script');
			script.type = 'text/javascript';
			if (script.readyState) {
				script.onreadystatechange = function() {
					if (script.readyState == 'loaded' || script.readyState == 'complete') {
						script.onreadystatechange = null;
						callback();
					}
				};
			} else {
				script.onload = function() {
					callback();
				};
			}
			script.src = url;
			document.getElementsByTagName('head')[0].appendChild(script);
		} else {
			callback();
		}
	}
	loadScript('https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js', function() {
		if (!scriptAvailable('https://code.jquery.com/ui/1.11.1/themes/smoothness/jquery-ui.css', 'Link')) {
			$('head').prepend('<link rel="stylesheet" href="//code.jquery.com/ui/1.11.2/themes/smoothness/jquery-ui.css">');
		}
		loadScript('https://code.jquery.com/ui/1.11.1/jquery-ui.js', function() {
			main();
		});
	});
})();