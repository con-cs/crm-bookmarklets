function checkToday(toBeChecked, search) {
	if (toBeChecked.indexOf(search) > -1) return true;
	return false;
}

function testElement (element, search) {
	var testing = "";
	if ( $(element).text() === "" && $(element).children()[0] && $(element).children()[0].value) {
		testing = $(element).children()[0].value;
	} else testing = $(element).text();

    for (var i = 0; i < search.length; i++) {
        if (checkToday(testing, search[i])) {
        	var factor = (255/search.length) << 0;
        	color = "rgba(" + i * factor + ",200," + (255 - i * factor) + ",0.2)";
            $(element).closest("tr").css("background", color);
        }
    }
}

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

function main() {
    var searchInCol = ["statuscode"];
	//var search = ["In Bearbeitung", "Warten auf Kunde", "Warten auf ext", "Zurückgestellt"];
	var $iframe = $('#crmContentPanel iframe:not([style*="visibility: hidden"])');
	var $subIframe = $iframe.contents().find('iframe:visible');
    var el = 'td';

	var htmlElements = [];
	$(getAllIframes()).each(function(index,element){
		$(element).contents().find('*:visible').each(function(index, element) {htmlElements.push(element);});
	});
	$($('*:visible').get().reverse()).each(function(index, element) {htmlElements.push(element);	});
	var statuscodeCol = $(htmlElements).find('th[fieldname="statuscode"]');
	var statusCodesString = $(statuscodeCol).find("*[attributexml]").attr("attributexml");
	var results = ["In Bearbeitung", "Warten auf Kunde", "Warten auf ext", "Zurückgestellt"];;
	if (statusCodesString) {
		results = statusCodesString.match(/(&gt;)(.*?)(&lt;)/gi);
		for (var element = 0; element < results.length; element++) {
			results[element] = results[element].substring(4,results[element].length-4);
			if (results[element] === "") {
				results.splice(element, 1);
				element--;
			}
		}
	}
	var search = results;

	$(el).not(":has("+el+")").each(function(index, element) { testElement(element, search); });
	$iframe.contents().find(el).not(":has("+el+")").each(function(index, element) { testElement(element,search); });
	if ($subIframe.length > 0) {
		if ($subIframe.has('iframe:visible')) {
            $.merge( $subIframe , $subIframe.contents().find('iframe:visible') );
		}
		$($subIframe).each(function(index, element){
			$(element).contents().find(el).not(":has("+el+")").each(function(index, element){ testElement(element,search); });
		});
	}
}

(function () {
    function loadScript(url, callback) {
        var script = document.createElement("script");
        script.type = "text/javascript";
        if (script.readyState) {
            script.onreadystatechange = function () {
                if (script.readyState == "loaded" || script.readyState == "complete") {
                    script.onreadystatechange = null;
                    callback();
                }
            };
        } else {
            script.onload = function () { callback(); };
        }
        script.src = url;
        document.getElementsByTagName("head")[0].appendChild(script);
    }
    loadScript("https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js", function () {
     main();
    });
})();