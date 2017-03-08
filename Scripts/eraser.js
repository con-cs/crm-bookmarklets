function eraser() {
	function testElement(index, element, speed) {
		$('html, body').animate({
			scrollTop: $(element).offset().top - ($(window).height() / 2)
		}, speed * 0.95);
		$(element).delay(speed * index).animate({
			height: 'toggle'
		});
	}
	var htmlElements = [];
	var $iframe = $('#crmContentPanel iframe:not([style*="visibility: hidden"])');
	$($iframe.contents().find('#dashboardFrame').contents().find('*:visible').get().reverse()).each(function(index, element) {
		htmlElements.push(element);
	});
	$($iframe.contents().find('#notescontrol').contents().find('*:visible').get().reverse()).each(function(index, element) {
		htmlElements.push(element);
	});
	$($iframe.contents().find('*:visible').get().reverse()).each(function(index, element) {
		htmlElements.push(element);
	});
	$($('*:visible').get().reverse()).each(function(index, element) {
		htmlElements.push(element);
	});
	var speed = Math.floor(25 * 1000 / htmlElements.length);
	$(htmlElements).each(function(index, element) {
		testElement(index, element, speed);
	});
}

function main() {
	eraser();
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