function findAndColor() {
	function checkToday(toBeChecked, search) {
		if (toBeChecked.indexOf(search) > -1) {
			return true;
		}
		return false;
	}

	function testElement(element, search) {
		var testing = '';
		if ($(element).text() === '' && $(element).children()[0] && $(element).children()[0].value) {
			testing = $(element).children()[0].value;
		} else {
			testing = $(element).text();
		} if (checkToday(testing, search)) {
			$(element).closest('tr').css('background', 'rgba(30,200,55,0.6)');
			$(element).css('background', 'rgba(30,200,55,0.6)');
		}
	}

	function findIframe($subIframe, element) {
		try {
			$.merge($subIframe, $(element).contents().find('iframe:visible'));
		} catch (e) {}
	}
	var search = prompt('Wonach soll gesucht werden?', 'Suchbegriff');
	var $iframe = $('#crmContentPanel iframe:not([style*="visibility: hidden"])');
	var $subIframe = $iframe.contents().find('iframe:visible');
	var el = '*';
	$(el).not(':has(' + el + ')').each(function(index, element) {
		testElement(element, search);
	});
	$iframe.contents().find(el).not(':has(' + el + ')').each(function(index, element) {
		testElement(element, search);
	});
	if ($subIframe.length > 0) {
		if ($subIframe.has('iframe:visible')) {
			$.merge($subIframe, $subIframe.contents().find('iframe:visible'));
		}
		if ($subIframe.has('iframe:visible')) {
			$subIframe.contents().find('iframe:visible').each(function(index, element) {
				findIframe($subIframe, element);
			});
		}
		$($subIframe).each(function(index, element) {
			$(element).contents().find(el).not(':has(' + el + ')').each(function(index, element) {
				testElement(element, search);
			});
		});
	}
}

function main() {
	findAndColor();
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