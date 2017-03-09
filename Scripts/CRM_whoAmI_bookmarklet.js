if(console && console.log) console.log('https://rawgit.com/con-cs/crm-bookmarklets/master/Scripts/CRM_whoAmI.js_bookmarklet.js'); //build:CreateOnlineOnlyBookmarklet

function copy2clipboard(text) {
	function messageFailure(textFail){
		window.prompt(textFail, text); }
    if(window.clipboardData) {
        window.clipboardData.setData('text',text);
        return true;
    } else {
        var o,b,t = '';
        try { netscape.security.PrivilegeManager.enablePrivilege('UniversalXPConnect'); }
        	catch (e) { messageFailure('Internet Security settings do not allow copying to clipboard!');
            	return false; }
        try { var e = Components.classes['@mozilla.org/widget/clipboard;1'].createInstance(Components.interfaces.nsIClipboard); }
        	catch (e) { return false; }
        try { b = Components.classes['@mozilla.org/widget/transferable;1'].createInstance(Components.interfaces.nsITransferable); }
        	catch (e) { return false; }
        b.addDataFlavor('text/unicode');
        o = Components.classes['@mozilla.org/supports-string;1'].createInstance(Components.interfaces.nsISupportsString);
        o.data = text;
        b.setTransferData('text/unicode', o, text.length * 2);
        try { t = Components.interfaces.nsIClipboard; }
        	catch (e) { return false; }
        e.setData(b, null, t.kGlobalClipboard);
        return true;
    }
    messageFailure('Copy doesn\'t work!');
    return false;
}

function whoAmI() {
	function colorTable(tableId) {
		$(tableId).find('td').css('background','transparent');
		$(tableId).find('tr').each(function(index,element){
			if (index%2===1) $(element).css('background','white');
			else $(element).css('background','LightSteelBlue');
		});
	}
	var userPriv = Xrm.Page.context.getUserRoles();
	var htmlObj = {CrmUrl:'',CrmVersion:'',OrgId:'',OrgName:'',UserId:'',UserName:'',UserDomainName:'',UserShort:'',UserEmail:'',UserTitle:'',UserLanguageCode:'',UserRoles:[]};
	var allPriv=[],userData=[],userPrivNames=[];
	var userid = Xrm.Page.context.getUserId();
	var options = '?$filter=SystemUserId%20eq%20(guid%27' + userid.substring(1, userid.length - 1).toLowerCase() + '%27)';
	var attributesInRest = [
		'SystemUserId', //Guid of SystemUserId
		'BusinessUnitId', //EntityReference mit Id, LogicalName und Name der Organisation
		'con_accessteam', //EntityReference mit Id, LogicalName und Name des passenden AccessTeams
		'FullName', //richtiger Name
		'DomainName', //Benutzername
		'Con_nav_ressource', //Kürzel
		'con_employeeacronym', //Kürzel
		'InternalEMailAddress', //Email
		'JobTitle'//JobTitel
	];
	var attributesString = '&$select=';
	for (var index = 0; index < attributesInRest.length; index++) {
		$.ajax(Xrm.Page.context.getClientUrl() + '/XRMServices/2011/OrganizationData.svc/SystemUserSet' + options + '&$select=' + attributesInRest[index], {
			dataType: 'json',
			async: false,
			success: function(data) {attributesString += attributesInRest[index] + ','},
			error: function(data) {return;}
		});
	}
	attributesString = attributesString.substring(0, attributesString.length - 1);
	options += attributesString;
	$.ajax(Xrm.Page.context.getClientUrl() + '/XRMServices/2011/OrganizationData.svc/SystemUserSet'+options, {
		dataType: 'json',
		async: false,
		success: function(data) {userData = data.d.results[0];},
		error: function(data) {console.log(data.responseText);}
	});
	htmlObj.CrmUrl = window.location.href;
	htmlObj.CrmVersion = APPLICATION_FULL_VERSION;
	htmlObj.OrgId = ORG_ID.toLowerCase().substring(1, ORG_ID.length - 1);
	htmlObj.OrgName = (userData.BusinessUnitId) ? userData.BusinessUnitId.Name : undefined;
	htmlObj.OrgLanguageCode = Xrm.Page.context.getOrgLcid();
	htmlObj.AccessTeam = (userData.con_accessteam) ? userData.con_accessteam.Name :  undefined;
	htmlObj.UserId = userData.SystemUserId;
	htmlObj.UserName = userData.FullName;
	htmlObj.UserDomainName = userData.DomainName;
	htmlObj.UserShort = (userData.Con_nav_ressource) ? userData.Con_nav_ressource : userData.con_employeeacronym;
	htmlObj.UserEmail = userData.InternalEMailAddress;
	htmlObj.UserTitle = userData.JobTitle;
	htmlObj.UserLanguageCode = Xrm.Page.context.getUserLcid();
	$.ajax(Xrm.Page.context.getClientUrl() + '/XRMServices/2011/OrganizationData.svc/RoleSet?$select=RoleId,Name', {
		dataType: 'json',
		async: false,
		success: function(data) {allPriv = data.d.results;},
		error: function(data) {console.log(data.responseText);}
	});
	for (var indexUP in userPriv) {
		$(allPriv).each(function(index, element) {
			if (element.RoleId === userPriv[indexUP] && element.Name!='') {htmlObj.UserRoles[index] = element.Name;}
		});
	}

	$('body').prepend('<div id=dialog title="Who am I?"><table id=dialogTable></table></div>');
	for (var element in htmlObj) {
		$('#dialogTable').append(
			'<tr>' +
			'<td>' + element + '</td>' +
			'<td id=' + element + ' class="tdInfo">' + htmlObj[element] + '</td>' +
			'</tr>'
		);
		if (element === 'UserRoles') {
			var toAppend = '<table>';
			for (var indexRoles in htmlObj[element]) {
				toAppend += '<tr><td class="tdInfo">'+htmlObj[element][indexRoles]+'</td></tr>';
			}
			toAppend += '</table>';
			$('#'+element).text('');
			$('#'+element).append(toAppend);
		}
    }
    $('.tdInfo').on('click',function(event){
    	colorTable('.ui-dialog');
		$(this).css('background','yellow');
		copy2clipboard($(this).text());
	});
	$( '#dialog' ).dialog({ modal: true }, {open: function( event, ui ) {
		colorTable('.ui-dialog');
		$('td').css({'font-size':'1em','padding bottom':'2pt'});} } );
	$('.ui-dialog').css('width','550px');
}

function main() {
	whoAmI();
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