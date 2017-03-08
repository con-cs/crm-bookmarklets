function populateMax() {
	var form = $("iframe").filter(function () {
		return $(this).css("visibility") == "visible"
	})[0].contentWindow;
	var attrs = form.Xrm.Page.data.entity.attributes.get();
	for (var i in attrs) {
		var attr = attrs[i];
		var contrs = attr.controls.get();
		if (attr.getRequiredLevel() == 'required') {
			switch (attr.getAttributeType()) {
				case 'memo': { attr.setValue('memo'); break; }
				case 'string': { attr.setValue('string'); break; }
				case 'boolean': { attr.setValue(false); break; }
				case 'datetime': { var today = new Date(); attr.setValue(today); break; }
				case 'decimal': { attr.setValue(attr.getMax()); break; }
				case 'double': { attr.setValue(attr.getMax()); break; }
				case 'integer': { attr.setValue(attr.getMax()); break; }
				case 'lookup': { attr.setValue(0); break; }
				case 'money': { attr.setValue(attr.getMax()); break; }
				case 'optionset': { var options = attr.getOptions(); attr.setValue(options[0].value);
				}
			}
		}
	}
}

function main() {
	populateMax();
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