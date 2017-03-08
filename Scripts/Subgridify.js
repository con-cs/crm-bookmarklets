function subgridify() {
    console.log('https://bookmarkify.it/4479');
    var number = 1;
	var rows = $('#gridBodyTable tr:visible');
	if ($('#gridBodyTable').length===0) {rows = $('iframe').first().contents().find('#gridBodyTable tr:visible');}
	all = rows.length;
	var indexColEmail=-1,indexColName=-1,indexColTelephone=-1,indexColMobile=-1,indexColBranch=-1,indexColLast=-1;
	var thGrid = $('#crmGrid_gridBar th');
	if ($('#gridBodyTable').length===0) {thGrid=$('iframe').contents().find('#crmGrid_gridBar th');}
	$(thGrid).each(function(index,element){
		if ($(element).text().toLowerCase().indexOf('mail')>-1) {indexColEmail = index+2;}
		if ($(element).text().toLowerCase().indexOf('name')>-1 && indexColName===-1) {indexColName = index+2;}
		if ($(element).text().indexOf('Mobil')>-1) {indexColMobile = index+2;}
		else if ($(element).text().toLowerCase().indexOf('telefon')>-1) {indexColTelephone = index+2;}
		else if ($(element).text().toLowerCase().indexOf('phon')>-1) {indexColTelephone = index+2;}
		if ($(element).text().indexOf('Niederlassung')>-1) {indexColBranch = index+2;}
		indexColLast = index+1;
	});
	var userObject = {};
	for (var n=0; n<all; n++){
	    var user = (n+1)+'thUser';
	    var nthLine = $('#gridBodyTable tr:visible:nth('+n+')');
		if ($('#gridBodyTable').length===0) {nthLine=$('iframe').contents().find('#gridBodyTable tr:visible:nth('+n+')');}
	    userObject[user] = {
	        name: $(nthLine).find('td')[indexColName],
	        branch: $(nthLine).find('td')[indexColBranch],
	        telephone1: $(nthLine).find('td')[indexColTelephone],
	        mobilephone: $(nthLine).find('td')[indexColMobile],
	        email: $(nthLine).find('td')[indexColEmail],
	        last: $(nthLine).find('td').last()[0],
	        lync: ($(nthLine).find('td').length>indexColLast+2) ? $(nthLine).find('td')[indexColLast+2] : $(nthLine).find('td').clone()[indexColEmail]
	    };
	}
	for (var element in userObject) {
		var pic = 'data:image/x-icon;base64,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';
		var feldName = userObject[element].name;
		var feldTelef = userObject[element].telephone1;
		var feldMobil = userObject[element].mobilephone;
	    var feldEmail = userObject[element].email;
  	    var feldChat = userObject[element].lync;

		var typeCode = $(feldName).parent().attr('otype');
		var selectedIds = $(feldName).parent().attr('oid');
		var regVal = '?id=' + selectedIds + '&oType=' + typeCode;
		var customTiProtocol = 'mscrm-addons.cti://';
		var text = "window.top.window.location.href='"+customTiProtocol+regVal+"'";
		if ($(feldName).has('input').length===0 && ($(feldTelef).text().length>0||$(feldMobil).text().length>0)) {
			$(feldName).prepend('<input type="image" style="vertical-align:-webkit-baseline-middle;width:20px;height:20px;" src='+pic+' alt="T1" onclick="'+text+'">');
		}
		$(feldName).css('display','flex');
		$(feldName).find('a').css('vertical-align','sub');

		$(feldTelef).find('img').remove();
	    var textTelef = $(feldTelef).text();
	    numb = textTelef.replace(/\+/,'00');
	    numb = numb.match(/\d/g);
        if (numb != null) {numb = numb.join('');}
		regVal = '?id=' + selectedIds + '&oType=' + typeCode + '&number=' + numb + ';';
		var textLink = "javascript:(function(){window.top.window.location.href='"+customTiProtocol+regVal+"'})()";
	    $(feldTelef).children().replaceWith('<a href="'+textLink+'">'+textTelef+'</a>');
	    $(feldTelef).children().css('text-decoration','underline');
	    $(feldTelef).children().css('color','blue');

		$(feldMobil).find('img').remove();
	    var textMobil = $(feldMobil).text();
	    numb = textMobil.replace(/\+/,'00');
	    numb = numb.match(/\d/g);
        if (numb != null) {numb = numb.join('');}
		regVal = '?id=' + selectedIds + '&oType=' + typeCode + '&number=' + numb + ';';
		textLink = "javascript:(function(){window.top.window.location.href='"+customTiProtocol+regVal+"'})()";
	    $(feldMobil).children().replaceWith('<a href="'+textLink+'">'+textMobil+'</a>');
	    $(feldMobil).children().css('text-decoration','underline');
	    $(feldMobil).children().css('color','blue');

	    var adresse = $(feldEmail).text();
	    $(feldEmail).children().replaceWith('<a href="mailto:'+adresse+'" target="_top">'+adresse+'</a>');
	    $(feldEmail).children().css('text-decoration','underline');
	    $(feldEmail).children().css('color','blue');

	    if (typeCode === '8' && indexColEmail > -1) {
    	    var pattern = /, (.*)/;
    	    var res = pattern.exec($(userObject[element].name).text());
    	    var naming = (res !== null) ? res[1] : '';
    	    adresse = adresse.substring(0,adresse.length-2) + 'local';
			$(feldChat).children().replaceWith('<a href="im:<sip:'+adresse+'>">Chat '+naming+'</a>');
			$(feldChat).children().css('text-decoration','underline');
			$(feldChat).children().css('color','green');
			userObject[element].last = feldName;
		}
	    if ((number%2)===0) {
			$(rows[number-1]).css('background','rgba('+(245-number)+','+(201+number)+',200,0.5)');
		} else {
			$(rows[number-1]).css('background','rgba('+(201+number)+',240,'+(245-number)+',0.5)');
		}

		for (var el in userObject[element]) {
			$(userObject[element][el]).css('font-size','12px');
			$(userObject[element][el]).css('white-space','nowrap');
		}
		number++;
	}
}


function main() {
	subgridify();
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
			//callback();

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