function openAllSolutions() {
	var clientUrl = (typeof Xrm != 'undefined') ? Xrm.Page.context.getClientUrl() : '';
	var nav = {};
	nav.uri = '/tools/Solution/home_solution.aspx?pagemode=iframe&etc=7100&sitemappath=Settings|Customizations|nav_solution';
	if (window.top.document.getElementById('navBar')) {
		window.top.document.getElementById('navBar').control.raiseNavigateRequest(nav);
	} else if (window.top.document.getElementById('contentIFrame')) {
		window.top.document.getElementById('contentIFrame').src = clientUrl + nav.uri;
	} else {
		alert('could not open CRM Solutions');
	}
	void(0);
}

function main() {
	openAllSolutions();
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