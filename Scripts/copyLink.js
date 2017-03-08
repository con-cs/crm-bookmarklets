function copy2clipboard(text)
{
    if(window.clipboardData)
    {
        window.clipboardData.setData('text',text);
        return true;
    }
    else
    {
        var o,b,t = '';
        try {
            netscape.security.PrivilegeManager.enablePrivilege('UniversalXPConnect');
        } catch (e) {
            alert('Internet Security settings do not allow copying to clipboard!');
            return false;
        }
        try {
            var e = Components.classes['@mozilla.org/widget/clipboard;1'].createInstance(Components.interfaces.nsIClipboard);
        } catch (e) {
            return false;
        }
        try {
            b = Components.classes['@mozilla.org/widget/transferable;1'].createInstance(Components.interfaces.nsITransferable);
        } catch (e) {
            return false;
        }
        b.addDataFlavor('text/unicode');
        o = Components.classes['@mozilla.org/supports-string;1'].createInstance(Components.interfaces.nsISupportsString);
        o.data = text;
        b.setTransferData('text/unicode', o, text.length * 2);
        try {
            t = Components.interfaces.nsIClipboard;
        } catch (e) {
            return false;
        }
        e.setData(b, null, t.kGlobalClipboard);
        return true;
    }
    alert('Copy doesn\'t work!');
    return false;
}

function copyLink() {
	var form = $("iframe").filter(function () {
	    return $(this).css("visibility") == "visible"
	})[0];
	if (form && form.contentWindow) {
		form = form.contentWindow;
		var Xrm = form.Xrm;
	}
	try {
		var entityData = jQuery.parseJSON(Xrm.Page.ui.get_entityDataHeader());
	    var url = Xrm.Page.context.getClientUrl();
	    url += "/main.aspx?etc=";
	    url += Xrm.Page.context.getQueryStringParameters().etc;
	    url += "&extraqs=formid%3d";
	    url += entityData._formId;
	    url += "&id=%7b";
	    url += Xrm.Page.context.getQueryStringParameters().id.replace(/\{|\}/gi, '');
	    url += "%7d&pagetype=entityrecord";
	    window.prompt("Link to this record: ", url);
	} catch (ex) {
		if (Xrm && Xrm.Page.context.client) {
			try {
				var queryData = Xrm.Page.context.getQueryStringParameters();
				var url = Xrm.Page.context.getClientUrl();
				url += "/main.aspx?etc=";
				if (queryData.etc) {
					url += queryData.etc
				} else {
					throw undefined;
				}
				url += "&extraqs=%3fpagemode%3d";
				url += queryData.pagemode;
				url += "%26sitemappath%3d";
				url += queryData.sitemappath;
				url += "&pagetype=entitylist"
				window.prompt("Link to this view: ", url);
			} catch (ex) {
			    alert("This will not work here.");
			}
		} else {
			var selection = window.prompt('Here, copy this:', window.location.href);
		}
	}
}

function main() {
	copyLink();
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
//https://bookmarkify.it/4483