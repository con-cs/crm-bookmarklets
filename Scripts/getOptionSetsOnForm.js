function getOptionSetsOnForm() {
	var osv = '', osa = '';
	var form = $('iframe').filter(function() {
		return $(this).css('visibility') === 'visible';
	})[0];
	$(form).contents().find('.ms-crm-SelectBox').each(function(index, element){
		try{
		if (element.tagName==="SELECT") {
			var name = $(element).attr('attrname');
			osv = "<br /><b><u>Name: "+form.contentWindow.Xrm.Page.getAttribute(name).getName()+"</u></b><br />";
			$(element).children().each(function(ind,elt){
				if (ind > 0) {
				osv += "<div>Value: ";
				osv += $(elt).attr("value");
				osv += " - Text: ";
				osv += $(elt).attr("title");
				osv += "</div>";}
			});
		}
		osa += "<div>"+osv+"</div>";
		} catch(e) {}
	});
	(window.open("#", "#").document.open()).write("<div style='font-family:Segoe UI,Arial;font-size:11px;overflow:always'>"+osa+"</div>")
}

function main() {
	getOptionSetsOnForm();
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