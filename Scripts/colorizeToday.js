function colorizeToday() {
	function checkToday(toBeChecked, ind) {
		var today = new Date();
		var dd = (today.getDate() + ind);
		var mm = today.getMonth() + 1;
		var yyyy = today.getFullYear();
		var monthNamesUS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
		var monthNamesDE = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
		if (dd < 10) {
			dd = '0' + dd;
		}
		if (mm < 10) {
			mm = '0' + mm;
		}
		var todayUS = mm + '/' + dd + '/' + yyyy;
		var todayDE = dd + '.' + mm + '.' + yyyy;
		var todayDELeerz = dd + '. ' + mm + '. ' + yyyy;
		var todayUSlang = mm + '/' + monthNamesUS[today.getMonth()] + '/' + yyyy;
		var todayDElang = dd + '. ' + monthNamesDE[today.getMonth()] + ' ' + yyyy;
		var SearchStrings = [todayUS, todayUSlang, todayDE, todayDElang, todayDELeerz];
		for (var indexString in SearchStrings) {
			if (toBeChecked.indexOf(SearchStrings[indexString]) > -1) {
				return true;
			}
		}
		return false;
	}

	function testElement(element) {
		var testing = '';
		if ($(element).text() === '' && $(element).children()[0] && $(element).children()[0].value) {
			testing = $(element).children()[0].value;
		} else {
			testing = $(element).text();
		}
		for (var i = 0; i < 5; i++) {
			if (checkToday(testing, i)) {
				$(element).closest('tr').css('background', 'rgba(' + i * 30 + ',200,55,' + (0.6 - i / 10) + ')');
				$(element).css('background', 'rgba(' + i * 30 + ',200,55,' + (1 - i / 10) + ')');
			}
		}
		for (var j = 0; j < 5; j++) {
			if (checkToday(testing, -j)) {
				$(element).closest('tr').css('background', 'rgba(255,' + j * 30 + ',55,' + (0.6 - j / 10) + ')');
				$(element).css('background', 'rgba(255,' + j * 30 + ',55,' + (1 - j / 10) + ')');
			}
		}
	}
	var $iframe = $('#crmContentPanel iframe:not([style*="visibility: hidden"])');
	var $subIframe = $iframe.contents().find('iframe:visible');
	$('td').not(':has(td)').each(function(index, element) {
		testElement(element);
	});
	$iframe.contents().find('td').not(':has(td)').each(function(index, element) {
		testElement(element);
	});
	if ($subIframe.length > 0) {
		$($subIframe).each(function(index, element) {
			$(element).contents().find('td').not(':has(td)').each(function(index, element) {
				testElement(element);
			});
		});
	}
}

function main() {
	colorizeToday();
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