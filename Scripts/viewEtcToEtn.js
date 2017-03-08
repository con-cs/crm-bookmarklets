function viewEtc2Etn() {
	var mapEtcEtn = Mscrm.EntityPropUtil.EntityTypeName2CodeMap;

	$('#dialog').remove();

	$('body').prepend('<div id="dialog" title="Etn -> Etc"><table id=dialogTable></table></div>');
	for (var element in mapEtcEtn) {
		$('#dialogTable').append(
			'<tr>' +
			'<td>' + element + '</td>' +
			'<td id=' + element + ' class="tdInfo">' + mapEtcEtn[element] + '</td>' +
			'</tr>'
		);
    }
    $('.tdInfo').on('click',function(event){
    	colorTable('.ui-dialog');
		$(this).css('background','yellow');
		copy2clipboard($(this).text());
	});
	$( '#dialog' ).dialog({ modal: true }, {open: function( event, ui ) {
		$('td').css({'font-size':'1em','padding bottom':'2pt'});} } );
	$('.ui-dialog').css({width: '450px', height: '80%', 'overflow-y': 'auto'});
	$('.ui-dialog').find( 'tr:nth-child(even)' ).css({background: 'pink'});
}

function main() {
	viewEtc2Etn();
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