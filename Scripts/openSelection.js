function getAllIframes() {
    var iframes = $('iframe:visible');
	$(iframes).each(function(index,element){
		if ($(element).contents().has('iframe')){
			$.merge(iframes, $(element).contents().find('iframe:visible'));
		}
	});
	for (var i=0;i<10;i++) {
		$(iframes).each(function(index,element){
			try {
				if ($(element).contents().has('iframe')){
					var testing =  $(element).contents().find('iframe:visible');
					$(testing).each(function(ind, elt){
						if (jQuery.inArray(elt, iframes)<0)
							$.merge(iframes, $(elt) );
					});
				}
			} catch(e) {}
		});
	}
	return iframes;
}

function openSelection(){
    function testElement(element) {
    	var selectedText='';
	    if ((typeof element.selectionStart !== 'undefined') && $(element).text().length>0) {
    	    selectedText = $(element).text().substring(element.selectionStart,element.selectionEnd);
        } else if ((typeof element.selectionStart !== 'undefined') && $(element).attr('value')) {
    	    selectedText = $(element).attr('value').substring(element.selectionStart,element.selectionEnd);
        }
		if (selectedText.length>0) {
			if (selectedText.substring(0,4)!=='http') {selectedText = 'http://' + selectedText;}
			window.open(selectedText);
		}
	}
	var htmlElements = [];
	$(getAllIframes()).each(function(index,element){
		$(element).contents().find('*:visible').each(function(index, element) {htmlElements.push(element);});
	});
	$($('*:visible').get().reverse()).each(function(index, element) {htmlElements.push(element);	});
	$(htmlElements).each(function(index, element) {
		testElement(element);
	});
}

function main() {
	openSelection();
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