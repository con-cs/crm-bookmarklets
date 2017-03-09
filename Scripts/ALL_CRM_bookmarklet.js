if(console && console.log) console.log('https://rawgit.com/con-cs/crm-bookmarklets/master/Scripts/ALL_CRM_bookmarklet.js'); //build:CreateOnlineOnlyBookmarklet
var versionBookmarkify = 4985;

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

var openRecordById = function() {
	var id = "";
	var clienturl = Xrm.Page.context.getClientUrl();
	var serverurl = clienturl + '/XRMServices/2011/OrganizationData.svc/';

	$.ajax({
	    beforeSend: function (xhr) { xhr.setRequestHeader('Accept', 'application/json'); },
	    url: serverurl,
	    type: 'GET',
	    dataType: 'json',
	    contentType: 'application/json; charset=utf-8',
	    success: function (data) {
	      var entityList = data.d.EntitySets;
	      id = prompt("Welche Id?", Xrm.Page.context.getUserId());
	      id = id.replace(/\{|\}/gi, '');
	      for (var i = 0; i < entityList.length; i++) {
	        var entityname = entityList[i];
	        $.ajax({
	            url: serverurl + entityname + "(guid'" + id + "')",
	            type: 'GET',
	            dataType: 'json',
	            contentType: 'application/json; charset=utf-8',
	            success: function (data) {
	                var str = data.d.__metadata.uri;
	                var entityname = /\/(\w+)Set/.exec(str)[1];
	                console.log(str);
	                var forbidden = ["Resource", "UserSettings", "msdyn_wallsavedqueryusersettings"]
	                if (forbidden.indexOf(entityname) === -1) {
	                    Xrm.Utility.openEntityForm(entityname.toLowerCase(), id);
	                }
	            },
	            error: function (xhr, status, error) {},
	        });
	      }
	    },
	    error: function (xhr, status, error) {},
	});
}
function populateMin() {
	var form = $("iframe").filter(function () {
		return $(this).css("visibility") == "visible"
	})[0].contentWindow;
	var attrs = form.Xrm.Page.data.entity.attributes.get();
	for (var i in attrs) {
		var attr = attrs[i];
		var contrs = attr.controls.get();
		if (attr.getRequiredLevel() == 'required') {
			switch (attr.getAttributeType()) {
				case 'memo': { attr.setValue('memo'); break; }
				case 'string': { attr.setValue('string'); break; }
				case 'boolean': { attr.setValue(false); break }
				case 'datetime': { var today = new Date(); attr.setValue(today); break; }
				case 'decimal': { attr.setValue(attr.getMin()); break; }
				case 'double': { attr.setValue(attr.getMin()); break; }
				case 'integer': { attr.setValue(attr.getMin()); break; }
				case 'lookup': { attr.setValue(0); break; }
				case 'money': { attr.setValue(attr.getMin()); break; }
				case 'optionset': { var options = attr.getOptions(); attr.setValue(options[0].value); }
			}
		}
	}
}

function populateMax() {
	var form = $("iframe").filter(function () {
		return $(this).css("visibility") == "visible"
	})[0].contentWindow;
	var attrs = form.Xrm.Page.data.entity.attributes.get();
	for (var i in attrs) {
		var attr = attrs[i];
		var contrs = attr.controls.get();
		if (attr.getRequiredLevel() == 'required') {
			switch (attr.getAttributeType()) {
				case 'memo': { attr.setValue('memo'); break; }
				case 'string': { attr.setValue('string'); break; }
				case 'boolean': { attr.setValue(false); break; }
				case 'datetime': { var today = new Date(); attr.setValue(today); break; }
				case 'decimal': { attr.setValue(attr.getMax()); break; }
				case 'double': { attr.setValue(attr.getMax()); break; }
				case 'integer': { attr.setValue(attr.getMax()); break; }
				case 'lookup': { attr.setValue(0); break; }
				case 'money': { attr.setValue(attr.getMax()); break; }
				case 'optionset': { var options = attr.getOptions(); attr.setValue(options[0].value);
				}
			}
		}
	}
}

function reOpenClosedActivities() {
	var form = $("iframe").filter(function () {
	return ($(this).css('visibility') == 'visible')
	})[0].contentWindow;
	form.Mscrm.CommandBarActions.activate( form.Xrm.Page.data.entity.getId(), form.Xrm.Page.data.entity.getEntityName() );
}

function createNewRecord() {
	var form = $("iframe").filter(function () {
		return ( $(this).css('visibility') == 'visible' )
		})[0].contentWindow;
	try {
		var name = form.Xrm.Page.data.entity.getEntityName();
	} catch(e) { }
	var y = prompt('Type the schema name of the entity to create:', name ? name : 'account');
	if (y) { var x = form.Xrm.Utility.openEntityForm(y); }
}

function openDiagnostics() {
	var client = Xrm.Page.context.getClientUrl();
	window.open(client + '/tools/diagnostics/diag.aspx','_blank');
}

function preventAutoSave() {
	var form = $('iframe').filter(function() {
		return $(this).css('visibility') === 'visible';
	})[0].contentWindow;
	form.Xrm.Page.data.entity.addOnSave(function(context){
		if (context.getEventArgs().getSaveMode() != 1) {
			context.getEventArgs().preventDefault();
		}
	});
}

function showListOfHiddenFields() {
	var form = $('iframe').filter(function() {
		return $(this).css('visibility') === 'visible';
	})[0].contentWindow;
	var contrs = form.Xrm.Page.ui.controls.get();
	var h = "", j = 0;
	contrs.forEach(function (c) {
		if (! c.getVisible()) {
			j++;
			h += j + ". " + c.getName() + "\n";
		}
	});
	alert(j + " hidden fields on this formular:\n\n" + h);
}

function getDirtyFields() {
	var message='The following fields are dirty: \n';
	var form = $('iframe').filter(function() {
		return $(this).css('visibility') === 'visible';
	})[0].contentWindow;
	form.Xrm.Page.data.entity.attributes.forEach(function(attribute,index){
		if(attribute.getIsDirty()==true){
			message+='\u2219 '+attribute.getName()+': '+attribute.getValue()+'\n';
		}
	});
	alert(message);
}
function openFormAndEntityEditor() {
	var frame = $("iframe").filter(function () { return ($(this).css("visibility") == "visible") });
	var form = frame[0].contentWindow;
	var etc = form.Xrm.Page.context.getQueryStringParameters().etc;
	if (typeof etc !== 'undefined') {
		form.Mscrm.FormEditor.OpenFormEditor(etc);
		form.Mscrm.RibbonActions.openEntityEditor(etc);
	}
}

function showFormType() {
	var formtype = ["1 = CREATE", "2 = UPDATE", "3 = READ_ONLY", "4 = DISABLED", "5 = QUICK_CREATE", "6 = BULK_EDIT"];
	var frames = $('#crmContentPanel iframe:not([style*=\"visibility: hidden\"])')[0].contentWindow;
	window.prompt("Copy to clipboard: Ctrl+C, Enter", formtype[frames.Xrm.Page.ui.getFormType()-1]);
}

function showValueOfField() {
	var prompt = prompt("Enter field name");
	window.prompt("Copy to clipboard: Ctrl+C, Enter", frames[0].Xrm.Page.getAttribute(prompt).getValue());
}

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

function openAdministration() {
	var clientUrl = (typeof Xrm !== 'undefined') ? Xrm.Page.context.getClientUrl() : '';
	var nav = {};
	nav.uri = '/tools/Admin/admin.aspx?pagemode=iframe&sitemappath=Settings|System_Setting|nav_administration';
	if (window.top.document.getElementById('navBar')) {
		window.top.document.getElementById('navBar').control.raiseNavigateRequest(nav);
	} else if (window.top.document.getElementById('contentIFrame')) {
		window.top.document.getElementById('contentIFrame').src = clientUrl + nav.uri;
	} else {
		alert('could not open CRM Administration');
	}
	void(0);
}

function advancedFind() {
	window.open($('#crmContentPanel iframe:not([style*=\"visibility: hidden\"])')[0].contentWindow.Xrm.Page.context.getClientUrl() + '/main.aspx?pagetype=advancedfind');
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

function copyId() {
	try {
		if (window.prompt('Here, copy this:', $('iframe').filter(function() {
			return ($(this).css('visibility') == 'visible');
		})[0].contentWindow.Xrm.Page.data.entity.getId().slice(1, -1))) {}
	} catch (ex) {
		alert("This only works on a record.");
	}
}

function openCustomizations() {
	var frame = $('iframe').filter(function() {
		return ($(this).css('visibility') === 'visible');
	});
	var form = frame[0].contentWindow;
	try {
		var etc = form.Xrm.Page.context.getQueryStringParameters().etc;
		form.Mscrm.RibbonActions.openEntityEditor(etc);
	} catch (e) {}
}

function godMode() {
	var form = $('iframe').filter(function() {
		return $(this).css('visibility') === 'visible';
	})[0].contentWindow;
	try {
		form.Mscrm.InlineEditDataService.get_dataService().validateAndFireSaveEvents = function() {
			return new Mscrm.SaveResponse(5, '');
		};
	} catch (e) {}
	var attrs = form.Xrm.Page.data.entity.attributes.get();
	for (var l in attrs) {
		attrs[l].setRequiredLevel('none');
	}
	var contrs = form.Xrm.Page.ui.controls.get();
	for (var i in contrs) {
		try {
			contrs[i].setVisible(true);
			contrs[i].setDisabled(false);
			contrs[i].clearNotification();
		} catch (e) {}
	}
	var tabs = form.Xrm.Page.ui.tabs.get();
	for (var j in tabs) {
		tabs[j].setVisible(true);
		tabs[j].setDisplayState('expanded');
		var sects = tabs[j].sections.get();
		for (var k in sects) {
			sects[k].setVisible(true);
		}
	}
}

function properties() {
	var frame = $('iframe').filter(function() {
		return ($(this).css('visibility') === 'visible');
	});
	var id = frame[0].contentWindow.Xrm.Page.data.entity.getId();
	var etc = frame[0].contentWindow.Xrm.Page.context.getQueryStringParameters().etc;
	frame[0].contentWindow.Mscrm.RibbonActions.openFormProperties(id, etc);
}

function saveAndPublish() {
	var frame = $('iframe').filter(function() {
		return ($(this).css('visibility') === 'visible');
	});
	try { frame[0].contentWindow.SaveAndPublish(); alert('Saved and Published'); }
	catch (e) { [0].contentWindow.Mscrm.FormEditor.PublishAll(); alert('Publish all, not saved'); }
}

function saveAndClose() {
	$('iframe').filter(function() {
		return ($(this).css('visibility') === 'visible');
	})[0].contentWindow.Xrm.Page.data.entity.save('saveandclose');
}

function saveAndNew() {
	$('iframe').filter(function() {
		return ($(this).css('visibility') === 'visible');
	})[0].contentWindow.Xrm.Page.data.entity.save('saveandnew');
}

function schemaNames() {
    function createTableRowsOfObject( objectToTransform, depth ){
        var j = 0, ret = "", css = "";
        $.each( objectToTransform, function( index, element ) {
            if ( depth < 1 ) {
                css = "style = 'background: ";
                css += ( j++ % 2 === 1 ) ? "white" : "LightSkyBlue";
                css += ";'";
            }
            if ( element !== null && typeof element === "object" ) {
                element = createTableRowsOfObject( element, ++depth );
            }
            ret += "<tr " + css + ">" +
                "<td>" + index + "</td>" +
                "<td>" + element + "</td>" +
            "</tr>";
        } );
        ret = "<table>" + ret + "</table>";
        return ret;
    }

    function rename( a, frame ) {
    	var labelElement, valueElement, description;
		if ( a && a._control && a._control.$38_2 ) { //2015.1
    	    labelElement = (a._control.$38_2.$O_1) ? a._control.$38_2.$O_1 : a._control.$38_2.$O_2;
            valueElement = a._control.$1_0[0];
    	    description = a._control.$0_1.$4_0._jsonWrapper;
		} else if ( a && a.$1G_1 && a.$1G_1.$1_0 && a.$3j_2 && a.$3j_2.$R_1 ) { //2015
			description = a.$1G_1.$1_0._jsonWrapper;
			valueElement = a.$1_0[0];
			labelElement = a.$3j_2.$R_1[0];
		} else if( a && a.$3L_2 && a.$3L_2.$R_1 && a.$17_1 && a.$17_1.$1_0 ) { //2013
			labelElement = a.$3L_2.$R_1[0];
			valueElement = a.$1_0[0];
			description = a.$17_1.$1_0._jsonWrapper;
		} else if( a && a.$1_4 && a.$1_4.$J_2 && a.$1_4.$J_2.$Bj_1 && a.$1_4.$J_2.$Bj_1.$1P_0[a.getName()].$4_2 && a.$1_4.$J_2.$Bj_1.$1P_0[a.getName()].$4_2.$5e_2 ) { //2016
			labelElement = frame.$( "#" + a.getName() + "_c" )[0];
			valueElement = frame.$( "#" + a.getName() )[0];
			description = a.$1_4.$J_2.$Bj_1.$1P_0[a.getName()].$4_2.$5e_2;
		}
		if ( labelElement && valueElement && description ) {
	        try {
	            var elementName = a.getName();
        	    var descElement = "<div class='dialog dialog" + elementName + "' title=" + elementName + ">";
	            descElement += createTableRowsOfObject( description, 0 );
        	    descElement += "</div>";
	            $(labelElement).css( "background", "lightgoldenrodyellow" );
        	    $(labelElement).children().css( "max-width", "100%" );
	            $(labelElement).parents( "table" ).css( "table-layout", "auto" );
        	    $(labelElement).children().first().off( "click" );
	            $(labelElement).children().first().click( function( e ) {
        	        e.preventDefault();
	                e.stopPropagation();
                	$( ".dialog" + elementName ).remove();
        	        $( descElement ).dialog( { maxHeight: (window.innerHeight - 100), width: 700 } );
	            } );
        	} catch ( ex ) {
				console.log( ex );
			}
		}
		try {
			a.setLabel( a.getName() );
		} catch ( ex ) {
			console.log( ex );
		}
    }

	function getFrame() {
		var $iframe = $( "#crmContentPanel iframe:not([style*='visibility: hidden'])" );
		if ( typeof $iframe.length === "undefined" && $iframe.contentWindow.Xrm.Page.ui ) {
			return $iframe.contentWindow;
		}
		if ( $iframe.length > 0 && $iframe[0].contentWindow.Xrm.Page.ui ) {
			return $iframe[0].contentWindow;
		}
		return null;
	}

	var frame = getFrame();
	if (frame === null) {
		alert( "Please make sure you are on an entity form and try again." );
	} else {
		var XrmPageUI = frame.Xrm.Page.ui;
		if ( XrmPageUI ) {
			XrmPageUI.tabs.forEach( function( tab ){ rename( tab, frame ); });
			XrmPageUI.controls.forEach( function( field ) { rename( field, frame ); } );
		}
	}
}

function openAllSolutions() {
	var clientUrl = (typeof Xrm !== 'undefined') ? Xrm.Page.context.getClientUrl() : '';
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

function refresh() {
	var frame = $('iframe:visible')[0].contentWindow;
	if (window.top.document.getElementById('navBar') && frame.Xrm.Page.data!== null) {
		frame.Xrm.Page.data.refresh();
	} else {
		alert('Could not refresh without reloading. Are you not on an Entity-Form?');
	}
}

function getJquery() {
	alert('You got JQuery now.');
}

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

function debug() {
	$(document).ready($('head').append('<script>debugger;</script>'));
}

function showHtml() {
	var lastShownOuterHtml = '';

	function testElement(element) {
		$(element).on('click', function(event) {
			if (lastShownOuterHtml !== event.target.outerHTML) {
				event.preventDefault();
				alert(event.target.outerHTML);
				console.info(event.target.outerHTML);
			}
			lastShownOuterHtml = event.target.outerHTML;
		});
	}
	var $iframe = $('#crmContentPanel iframe:not([style*="visibility: hidden"])');
	$('*').each(function(index, element) {
		testElement(element);
	});
	$iframe.contents().find('#dashboardFrame').contents().find('*:visible').each(function(index, element) {
		testElement(element);
	});
	$iframe.contents().find('*').each(function(index, element) {
		testElement(element);
	});
	$iframe.contents().find('#notescontrol').contents().find('*').each(function(index, element) {
		testElement(element);
	});
}

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

function findAndColor() {
	function checkToday(toBeChecked, search) {
		if (toBeChecked.indexOf(search) > -1) {
			return true;
		}
		return false;
	}

	function testElement(element, search) {
		var testing = '';
		if ($(element).text() === '' && $(element).children()[0] && $(element).children()[0].value) {
			testing = $(element).children()[0].value;
		} else {
			testing = $(element).text();
		} if (checkToday(testing, search)) {
			$(element).closest('tr').css('background', 'rgba(30,200,55,0.6)');
			$(element).css('background', 'rgba(30,200,55,0.6)');
		}
	}

	function findIframe($subIframe, element) {
		try {
			$.merge($subIframe, $(element).contents().find('iframe:visible'));
		} catch (e) {}
	}
	var search = prompt('Wonach soll gesucht werden?', 'Suchbegriff');
	var $iframe = $('#crmContentPanel iframe:not([style*="visibility: hidden"])');
	var $subIframe = $iframe.contents().find('iframe:visible');
	var el = '*';
	$(el).not(':has(' + el + ')').each(function(index, element) {
		testElement(element, search);
	});
	$iframe.contents().find(el).not(':has(' + el + ')').each(function(index, element) {
		testElement(element, search);
	});
	if ($subIframe.length > 0) {
		if ($subIframe.has('iframe:visible')) {
			$.merge($subIframe, $subIframe.contents().find('iframe:visible'));
		}
		if ($subIframe.has('iframe:visible')) {
			$subIframe.contents().find('iframe:visible').each(function(index, element) {
				findIframe($subIframe, element);
			});
		}
		$($subIframe).each(function(index, element) {
			$(element).contents().find(el).not(':has(' + el + ')').each(function(index, element) {
				testElement(element, search);
			});
		});
	}
}

function scramble() {
	function shuffle(elt) {
	    var a = elt.split('');
	    var n = a.length;
	    for(var i = n - 2; i > 1; i--) {
	        var j = Math.floor((Math.random() * (n-2 - 1)) + 1);
	        var tmp = a[i];
	        a[i] = a[j];
	        a[j] = tmp;
	    }
	    return a.join('');
	}
	function preShuffle(element){
		var strings = element.split(' ');
		for (var indexStr in strings) {
			strings[indexStr] = shuffle(strings[indexStr]);
		}
		return strings.join(' ');
	}
	function getFrame() {
		var $iframe = $('#crmContentPanel iframe:not([style*="visibility: hidden"])');
		if (typeof $iframe.length === 'undefined' && $iframe.contentWindow.Xrm.Page.ui) {
			return $iframe.contentWindow;
		}
		if ($iframe.length > 0 && $iframe[0].contentWindow.Xrm.Page.ui) {
			return $iframe[0].contentWindow;
		}
		return null;
	}
	var frame = getFrame();
	if (frame === null) {
		var Arr = ['button','h1','label','input','h2','h3','li','textarea','td','p','a','span'];
		for (var index in Arr) {
			$(Arr[index]).not(':has(*)').each(function(index,element){
				var a = preShuffle($(element).text());
				$(element).text(a);
			});
			$(Arr[index]).children().not(':has(*)').each(function(index,element){
				var a = preShuffle($(element).text());
				$(element).text(a);
			});
		}
	} else {
		frame.Xrm.Page.ui.controls.forEach(function(a) {
			var elName = a.getName();
			var elLabel = a.getLabel();
			if (frame.Xrm.Page.getAttribute(elName) !== null) {
				var elValue = frame.Xrm.Page.getAttribute(elName).getValue();
				if (!Array.isArray(elValue) && elValue!==null && elValue.length>3){
 					frame.Xrm.Page.getAttribute(elName).setValue(preShuffle(elValue));
 				}
			}
			a.setLabel(preShuffle(elLabel));
		});
	}
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
		if ($(element).text().toLowerCase().indexOf('mail')>-1) {indexColEmail = index+1;}
		if ($(element).text().toLowerCase().indexOf('name')>-1 && indexColName===-1) {indexColName = index+1;}
		if ($(element).text().indexOf('Mobil')>-1) {indexColMobile = index+1;}
		else if ($(element).text().toLowerCase().indexOf('telefon')>-1) {indexColTelephone = index+1;}
		else if ($(element).text().toLowerCase().indexOf('phon')>-1) {indexColTelephone = index+1;}
		if ($(element).text().indexOf('Niederlassung')>-1) {indexColBranch = index+1;}
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
	        lync: ($(nthLine).find('td').length>indexColLast+1) ? $(nthLine).find('td')[indexColLast+1] : $(nthLine).find('td').clone()[indexColEmail]
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

function close() {
	$('#menu').css('display', 'none');
	console.log('close');
}

function createConfigObj() {
	var stdPic = 'data:image/x-icon;base64,AAABAAEAICAAAAEAGACoDAAAFgAAACgAAAAgAAAAQAAAAAEAGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD2+/71///c6PLG1PHJ0v7M0fjZ2u/k4+3g5/DW6fHM6+zT8Ofk8+vx8vD07/H08fPo9uvq8ujq8erl8urg7ujj6ufi5OTV4uDO7eTI79/M7t3N6NjJ59rC5trH5djw//f//v/W2d7Hzt3J0OnQ0+/T1e3W2OrZ2+bc4OXh6enk8u7o+fXt/fzv+/3x+Pvx+Pvl/P7n+frp+fjl+PXg9vHi8O7i7OzZ6ejO6eXL6uHR6d/V5t3N4NfI3NDW4tb///X/+//MydnKyd3Nzd3S1Nzg4+jt8Pjy9f34/P3//v3//v75/P/1/f/y/v/1///6///u/P/y/P/0///0///0//71//32/v3y+fzt+fvl8/Le6efW39zP2tLT29Hg39H//e/h6f+5udff2vXt7f30/f/2/v37/vz9/vz6/Pz8/P//+f//+////v/9//z///j//vf/+///+////f3//vf//fT///f///v///7++/37+/v6//7w//fi9urU59jL1sb9//PQ3f9LUoNscaKirdPP3fPe6vDm6Ojy8e3w8vLw8/vx8f/38vv8+PP9/e39+/D/+PX/+P3/+Pr/+vf/+/P9+O/3+O7z9e/v8Ozv8+7h7OTX8eG438mOvaNnlnxqkXzc/u3v6/84QYApPpMySZdIXJOBja+vutDP1ufv8fv5+/z6//73//r2//X2//Tz//vv///w+//y/Pzz//3v//zn//3i//ze/fbW9e6/49ebyrR5tZZZoXdGkWU3fVVIg2fV//T/8v90d64qRKIhQ642UrBMZa9QbKhfdqh+iq6aobCvvrq318a959XB7eC+6Oe55ey47eq36OCx4dWh2suQ0cGKx7mEuq10sJ5hrZVTr4xJq31AoWk3k1gxgUxNimbX/+7/+//08/+Dk846W7wnVsohVsUxZMBSesxmhtJzkcx4oLx9s7SCwryIyceNycmQx8SPzLKYyambyKGNxJd8uY12qIBqj21Jf1xUrYY9soU0qnU6pWY1lFEufkNZkWjm/+7t/v/9//719/+WrOZBeuclc+4ncNw0cNQ9deJFg+9Umehjr9lvu9F0v810uL1rqaOCp2+JmluOlUx8jjtthDJ3ejJ4bTFZaTRgrXo8tYIwq3M6omM4lE0tfj9bk2jo/+3m///5//b///fz+v+DrvE9iusxh/Exg+4xfvIzhfw1j/s8ne1Iq99Vtthjv9hnw9aar2qinU6qlTmXkSiMiB+deyGlbiWAbjFurXU+tYIzqXY/nWI6kkwqfj1WlWnk//D2/vf7/////f///P/v/P+DtOY+kuswk/s1lfk4lvUymforn/0uq/Yzses0tew1uviRrm+cmU+mkziTkCeIiSGceiCmayODbzVqrnk3s4UypndGm2E+jkkqfDtYmG7h//T///L/+v/99///+vz///Pn+v9qreYymvMypvs0p/AwpvMjqf0csf8atf4XtP4atf+PrneZl1ahkT6IjSp3hyKJeiSVayZ3czldrn0ts4UxpnlKmWBGjEUwejhfmnTl//j///j/+v//+v///v7///L6//rJ8f9VqugppPQeq/smtv4juPsXt/0Suf8XuP8ovP+vtX64nlu3lTyTiiJ8gxqJeh6QbSN1ej1YsHsosoMwpXhMmF5LikI2eDdpm3no//r7+////vr///j///v5/vz7//zx/f+s3v9Dq/IYqv8YvP8bxP4Ww/sVw/8evfkxv/bIuXvUo1fYmzm1jhqZhRCbexKbbRl+fjhgsXossIIvonZJll1JiUE3dzVtoHvm//r9/P////75//T2//z2/////v///v/s+/+Pzf07tPoSuP0Gxf4Jy/sTzf0cx/omyfrAtXvPo1binjnKkxqxiAqwegimbA2MfzVssHkyrIQtoHlAlF0/iD8xejJtpXrg//T/+f/4/v/s///u///7/////P//+//9+P/Y8f9wx/MewfgAzP8A0f4J0PcKyfgHyv+ptYG9oVrWnTrKkxq3iAi2eQWubA2ahDxzsH42qocqnXw4kl05iD4sfC9oqnfb/+7//f/0/v/z/////f///P7//v7///z///n//f646vw1yPAAzf8AyPwZyv0XxfoMzP/QzK++mmTUm0DGkRy0hwe4fQK8cQ2xgzyqxZpGpYMtonU1mVg3hDo6dTh6pn/n//L//f/4/v/2/////v///f7//v7///z///n////P9f9j2P0RyvwAyv0Nyv0Vyf0Sy//n9Obm0qnIlkTHkRy/jwiyeQCubQS0ikXy/NiW079GnH43j1k0hj0vdzF1pXvr//X9/v/7/v/9//////7///7///79//z///v9///n/P+k7P8/zPcJy/sAy/0Mzf8eyv7V9fT///Dow4fBjSO+hwC8ggCucwa4jEz/+ODs//yq1cpOkGcwhkAqezZroXbq//X2//////////z///77//77//77//z6//75/v/6/P/d+P9+2/wdy/kAy/8Fzv8qzfrO9/ry//3//+fUrV+7iQu8gQCqbgC/kFP/9Ob+/P/y//6338NLjVkpcjpso3zp//Pz//////7///v///z2///4///9//74///6////+/7/+/+87v86zvgAy/4DzP0w0vzU+vTt////+vv/99HDnT+2ewC2cQTIklb/9+j9///1/Pf4//LB4MNQfmFsmn3k/+zx//////z///n///z2///6///////7///7/////Pr//fzj+v9n2f0QyvoHyfgt1vzi/O7u/f/2+////v3t2am5hSe2awnKklH/+eHw//v4//v///b7/PPH2dKOq5zn/+j0//////z///v///76///7/v///v///v/9//7///j///jz/f+g7f88zPYXyPUi1v/m/PD6///6+//0+v////vVrnqtaxjFkUX//tnv//z2////+/f//v73/P/h8Oz4//T6//7///z///z////9/v///f///f///v///vr///j///j4/f7U/v9u0PItyfQb2f/i9/j///v/+/70+P/w+f//7tu3hkK8j0X//dfy///0+f///v7//fr6///4//////r///z///7//////v///v///P///f///v////r7//j6//v6//7v/v+q5v5Ex+4c2P/f9/////v///n09//q+v////vdvIu7k1n/+d75/f/7+////f3///z2///4/P///v////v//v///v///f///f///P///f///v////n4//v2//7//////v/O8f5fzu4n1v/d9P///v////v9/f/s/f/4//b/8dLFpof/9Oz++//9/f///vr////4/v/3/f////7///v//f///P/9/f/9/v/7/v/9/v////79//n1//n4/////f///vvn//9/2/Q+1P/k9//5/P///f/////2//74//X///Xn1M//9vj//v/9//7//vr//v/7/P/3/f/6//z///v//f///P/9/P/7/v/7/v/7///7//77//v1/vv9/v///f///vrt//+f6/1b0vnn+Pv4/f///f///Pn///v7//z2+/r8+////P7///z///v9/vz//v///f/6/v/6//7///z//f///f/7/v/7///7///9//77//z6//75/v3//f///f////zv//+/+f9+1e/m9ff4//////7//vz//f37/v/z///0///7//z///n///z6/v/9/v/////+/v79//////7////9/v/7/v/9//////z///v///z7///7/////v///f3//v/x/f/X//+j3+vg8/j2//////z///z//v/6/P/z///y/v79//z///v+/v77/v/9//////7///7////7///7///6///7//////////n///j///z9/v/9/v////z//vv//f/1+//m///D7ezi9P/w/P/7//7//vr///79///7+vz//f///v/9/f38//39//7//v///v////7///n6///4///4///7//////7///n///f///z//f/8/f////v///v//f/4+//s///W+O7j9P/x/v/4///6//z3//j///n///z/+///+//5/P/6//z///v//f//+v////77//QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==';
	var tablePic = 'data:image/x-icon;base64,AAABAAEAEBAAAAEACABoBQAAFgAAACgAAAAQAAAAIAAAAAEACAAAAAAAAAEAAAAAAAAAAAAAAAEAAAAAAAD///8A5OTkAMnJyQD4+PgA/v7+AIWFhQDj4+MAmZmZANzc3AC6uroA/f39APb29gBpaWkAmJiYALm5uQD8/PwAg4ODAO7u7gCdnZ0AxcXFAO3t7QBtbW0AqampAI6OjgC2trYAlJSUAGVlZQDX19cAeXl5AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAARFBQUFBQUFAsAAAAAAAAAGRcXFxcXFxAYAAAAAAAAAAkYGBgYGA4CGAAAAAAAAAAVGxsbGxsVCRgAAAAAAAAAFQQAAAAAFQkYAAAAAAAAABUEAAAAABUJGAAAAAAAAAAVBAAAAAAVCRgAAAAAAAAAFQQAAAAAFQkYAAAAAAAAABUEAAAAABUJGAAAAAAAAAAVBAAABggVCRgAAAAAAAAAFQ8KCgUaFQEAAAAAAAAAABUTExMcDAcAAAAAAAAAAAASDQ0NDRYDAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=';
	var configObj = {
		advancedFind: {
			action: function(){advancedFind();},
			picSrc: '<img class="ui-icon" alt="" src="data:image/x-icon;base64,AAABAAEAEBAAAAEACABoBQAAFgAAACgAAAAQAAAAIAAAAAEACAAAAAAAAAEAAAAAAAAAAAAAAAEAAAAAAAD///8AcnJyAGtrawDd3d0Arq6uALu7uwDj4+MAmZmZAMjIyADV1dUAi4uLAISEhADv7+8AwMDAAJGRkQB2dnYA6OjoAG5ubgCCgoIAlpaWAKqqqgCIiIgAbW1tAGZmZgDy8vIAw8PDAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABUSEhISGAMSEhISBwAAAAAWFxcXFwwJFxcXFxIAAAAAFhcXFxcMCRcXFxcSAAAAABYXFxcXDAkXFxcXEgAAAAAWFxcXFwwJFxcXFxIAAAAAFhcXFxcKCxcXFxcSAAAAAAAFFxcXFxcXFxcGAAAAAAAABRcXFxcXFxcXBgAAAAAAAAUXFxcXFxcXFwYAAAAAAAAIAhcPEhIRFwEQAAAAAAAAABIXDQAADhcUAAAAAAAAAAAVFhkAABMWBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=" />',
			title: 'Open the Advanced Find in the CRM.',
			name: 'Advanced Find'
		},
		godMode: {
			action: function(){godMode();},
			picSrc: '<img class="ui-icon" alt="" src="data:image/x-icon;base64,AAABAAEAEBAAAAEACABoBQAAFgAAACgAAAAQAAAAIAAAAAEACAAAAAAAAAEAAAAAAAAAAAAAAAEAAAAAAABoaGgA+/v7AHFxcQClpaUArq6uALe3twBqamoAnp6eAP39/QDS0tIAp6enANvb2wCFhYUAbGxsAP///wCHh4cAmZmZAG5ubgB3d3cAiYmJAOHh4QCCgoIA8/PzAMjIyABpaWkA/Pz8AOzs7AD+/v4AqKioAOXl5QD39/cAzMzMAN7e3gC8vLwA8PDwAMXFxQBmZmYAmpqaAPn5+QBvb28Ao6OjAODg4ACBgYEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADg4ODg4ODg4ODg4ODg4ODg4OIhQpKSkpKSkaGw4ODg4ODgcAJCQkJCQkDyYODg4ODg4MJCQkFw0kJCQeDg4ODg4ODCQkABQCJCQkHg4ODg4ODgwkJBAWIyQkJB4ODg4ODg4MJCQDHgskJCQeDg4ODg4ODCQkJxUSJCQkHg4ODg4ODgMnERERERgGDyYOAQEODg4ODg4ODg4lBRsOGxwEGQ4ODg4ODg4OBCgeDh4QIQgODg4ODg4ODikqCh8KEx0ODg4ODg4ODg4bCQ8REyAbDg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=" />',
			title: 'Remove all field-restrictions in the actual form.',
			name: 'God-Mode'
		},
		schemaNames: {
			action: function(){schemaNames();},
			picSrc: '<img class="ui-icon" alt="" src="data:image/x-icon;base64,AAABAAEAEBAAAAEACABoBQAAFgAAACgAAAAQAAAAIAAAAAEACAAAAAAAAAEAAAAAAAAAAAAAAAEAAAAAAABYWFgASUlJAKGhoQD5+fkAg4ODAMzMzACfn58A9/f3AOHBwQDKi4sA587OAOnb2wDKysoARUVFAJ2dnQCOjo4A5ubmAENDQwDz8/MA5OTkAN69vQDV1dUAxsbGAF9fXwC3t7cA8fHxAIqKigCLiooAIyMjAMTExAD48fEA0J+fAP7+/gDv7+8AMDAwAPHi4gBbW1sA/Pz8AP38/ADt7e0Ad3d3APXt7QD6+voA0JubAHV1dQBmZmYASEhIAPj4+ADa2toAZGRkAEZGRgCdnp4Anp6eADc3NwDn5+cA2NjYAOza2gDz9PQA9PT0AOXl5QCpqakAMzMzANTU1AD///8A1q2tAMvFxQDS0tIAzZGRAP39/QD+/f0AlpaWANSengDf398A4N/fANDQ0AD7+/sAhYWFAN3d3QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8gPz8/Pz8/Pz8/P0Q/RD8lID9EP0REPz8/Pz8nBU0lPkoFJz8/Pz8/Pz8/MCRGOg4NFzclKipEPz8/Pxk0BANCNQIZRBYYPz8/Pz8/SCw8BgFJJhMRHBU/Pz8/SyEtKBExOUswAA0dPz8/PyAlGkwyMyMeBzYQEj8/Pz8/IAwiPUEJFCBERD8/Pz8/Pz8vAS4LR0BFIEQ/Pz8/Pz8/IA8bOEMfRT8/Pz8/Pz8/PyAQOykrCCA/Pz8/Pz8/Pz8/Pz8/Ch4/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/PwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=" />',
			title: 'Show the schemanames of all fields on the CRM-form.',
			name: 'Show SchemaNames'
		},
		openRecordById: {
			action: function(){openRecordById();},
			picSrc: '<img class="ui-icon" alt="" src='+stdPic+' />',
			title: 'Open the record to a specific id.',
			name: 'Open record to a given id'
		},
		openFormAndEntityEditor: {
			action: function(){openFormAndEntityEditor();},
			picSrc: '<img class="ui-icon" alt="" src="data:image/x-icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABmZmYkZmZm/2ZmZv9mZmb/ZmZm/2ZmZv9mZmb/ZmZm/2ZmZv9mZmb/ZmZm/2ZmZv9mZmb/ZmZmJAAAAAAAAAAAZmZmJ2ZmZswAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAZmZmzGZmZicAAAAAAAAAAGZmZidmZmbMAAAAAAAAAAAAAAAAAAAAAGZmZvZmZmb/ZmZm/2ZmZv9mZmb/ZmZmWmZmZsRmZmYnAAAAAAAAAABmZmYnZmZmxGZmZlpmZmb/ZmZm/2ZmZhRmZmb8AAAAAAAAAAAAAAAAZmZmeWZmZmhmZmbEZmZmJwAAAAAAAAAAZmZmJ2ZmZswAAAAAAAAAAAAAAAAAAAAAZmZm9mZmZv9mZmb/ZmZm/2ZmZv9mZmZaZmZmxGZmZicAAAAAAAAAAGZmZidmZmbMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGZmZsxmZmYnAAAAAAAAAABmZmYnZmZmzAAAAAAAAAAAAAAAAAAAAABmZmb2ZmZm/2ZmZv9mZmb/ZmZm/2ZmZlpmZmbEZmZmJwAAAAAAAAAAZmZmJ2ZmZsRmZmZaZmZm/2ZmZv9mZmYUZmZm/AAAAAAAAAAAAAAAAGZmZnlmZmZoZmZmxGZmZicAAAAAAAAAAGZmZidmZmbMAAAAAAAAAAAAAAAAAAAAAGZmZvZmZmb/ZmZm/2ZmZv9mZmb/ZmZmWmZmZsRmZmYnAAAAAAAAAABmZmYnZmZmzAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABmZmbMZmZmJwAAAAAAAAAAZmZmJGZmZv9mZmb/ZmZm/2ZmZv9mZmb/ZmZm/2ZmZv9mZmb/ZmZm/2ZmZv9mZmb/ZmZm/2ZmZiQAAAAAAAAAAGZmZiRmZmb/ZmZm/2ZmZv9mZmb/ZmZm/2ZmZv9mZmb/ZmZm/2ZmZv9mZmb/ZmZm/2ZmZv9mZmYkAAAAAAAAAABmZmYkZmZm/2ZmZv9mZmb/ZmZm/2ZmZv9mZmb/ZmZm/2ZmZv9mZmb/ZmZm/2ZmZv9mZmb/ZmZmJAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//8AAP//AADAAwAA3/sAAN4LAADS+wAA3gsAAN/7AADeCwAA0vsAAN4LAADf+wAAwAMAAMADAADAAwAA//8AAA==" />',
			title: 'Open the Form- and the Entity-Editor to the current opened Entity.',
			name: 'Open Form&Entity-Editor'
		},
		getOptionSetsOnForm: {
			action: function(){getOptionSetsOnForm();},
			picSrc: '<img class="ui-icon" alt="" src='+tablePic+' />',
			title: 'Show a list of all optionsets and the possible values of the form.',
			name: 'Show Optionsets'
		},
		showListOfHiddenFields: {
			action: function(){showListOfHiddenFields();},
			picSrc: '<img class="ui-icon" alt="" src='+tablePic+' />',
			title: 'Show a list of all hidden fields.',
			name: 'Show hidden fields'
		},
		getDirtyFields: {
			action: function(){getDirtyFields();},
			picSrc: '<img class="ui-icon" alt="" src='+tablePic+' />',
			title: 'Show a list of all dirty fields.',
			name: 'Get dirty fields'
		},
		showFormType: {
			action: function(){showFormType();},
			picSrc: '<img class="ui-icon" alt="" src='+tablePic+' />',
			title: 'Show the formtype.',
			name: 'Show formtype'
		},
		populateMin: {
			action: function(){populateMin();},
			picSrc: '<img class="ui-icon" alt="" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAIAAAD8GO2jAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOwgAADsIBFShKgAAAABp0RVh0U29mdHdhcmUAUGFpbnQuTkVUIHYzLjUuMTFH80I3AAACf0lEQVRIS9WWu2siURTG90/zGTfiI4kGDYJgIwimWVdXJKWtWAkSUtrY2GghIgZstEuMKIohFhZ5aETEYIyv/fAeh9HM6Miwxf4q7/F+57v3eOaMP5b/GLkGb29v9EkEWQbFYtFms2UyGVoLIcugVCqpVCq1Wn11dTUYDCi6iSyD8Xis0+kUK1wuV6FQoC94HGAwmUzS6fQvHm63W6lUMgMAs3g8/vHxQYIVUg2enp48Hg9l2gm21Wo1kkk0aDQaJpOJEkgAV7m7u2Pa/Qb1ev309JSk0ri4uMjlcky+x6DVap2cnJBOGsFg8Pn5mfS7DZDdbDaTjodWq/25hkIr9Hp9IpGYzWakXyFqgMoInt3v93c6Hbbn8/OTa1Ov19tut1mcDxl0u91QKPSbh2DdA4HAaDRiEpDP59GmR0dHkUgETUzRTcggm81SDnHQ+Fs9jsfCYrGUy+WtsvCRanB5efn19cU2czw+PqJKtBBBqgFKv3V80O/3+RUT5IASxWIxtpkDJcK0wD1oLQQZNJtNh8OB/uPAjKTEazA4b25uFosFkwAMasSPj49TqdR8PqfoJmTwnUqlYrVaWWo+19fXr6+vbM9wOOTaFI33/v7O4nxEDQDmCZqE6fkYjcY/a3AtiioU5+fnt7e3JF6zywA8PDwcNObwbOOZmE6npN9rAFCrs7MzSiANp9NZrVaZfL8BuL+/x/VJLQE0SDKZZFpJBgC1wrkowU7sdjv/3SnVAPR6vWg0il8YB+SgrGvC4fDLywsJVhxgIAg3sQ0GA1cWPrIMMNI1Gg2y+3w+vDwouoksA4wKzGo8evj/QqFvyDJAv6OJaSGC3N9gL/+7wXL5F4N+TJ8qu6LSAAAAAElFTkSuQmCC" />',
			title: 'Populate all required fields with a value that represents the datatype.',
			name: 'Populate Minimal'
		},
		populateMax: {
			action: function(){populateMax();},
			picSrc: '<img class="ui-icon" alt="" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAIAAAD8GO2jAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOwgAADsIBFShKgAAAABp0RVh0U29mdHdhcmUAUGFpbnQuTkVUIHYzLjUuMTFH80I3AAACf0lEQVRIS9WWu2siURTG90/zGTfiI4kGDYJgIwimWVdXJKWtWAkSUtrY2GghIgZstEuMKIohFhZ5aETEYIyv/fAeh9HM6Miwxf4q7/F+57v3eOaMP5b/GLkGb29v9EkEWQbFYtFms2UyGVoLIcugVCqpVCq1Wn11dTUYDCi6iSyD8Xis0+kUK1wuV6FQoC94HGAwmUzS6fQvHm63W6lUMgMAs3g8/vHxQYIVUg2enp48Hg9l2gm21Wo1kkk0aDQaJpOJEkgAV7m7u2Pa/Qb1ev309JSk0ri4uMjlcky+x6DVap2cnJBOGsFg8Pn5mfS7DZDdbDaTjodWq/25hkIr9Hp9IpGYzWakXyFqgMoInt3v93c6Hbbn8/OTa1Ov19tut1mcDxl0u91QKPSbh2DdA4HAaDRiEpDP59GmR0dHkUgETUzRTcggm81SDnHQ+Fs9jsfCYrGUy+WtsvCRanB5efn19cU2czw+PqJKtBBBqgFKv3V80O/3+RUT5IASxWIxtpkDJcK0wD1oLQQZNJtNh8OB/uPAjKTEazA4b25uFosFkwAMasSPj49TqdR8PqfoJmTwnUqlYrVaWWo+19fXr6+vbM9wOOTaFI33/v7O4nxEDQDmCZqE6fkYjcY/a3AtiioU5+fnt7e3JF6zywA8PDwcNObwbOOZmE6npN9rAFCrs7MzSiANp9NZrVaZfL8BuL+/x/VJLQE0SDKZZFpJBgC1wrkowU7sdjv/3SnVAPR6vWg0il8YB+SgrGvC4fDLywsJVhxgIAg3sQ0GA1cWPrIMMNI1Gg2y+3w+vDwouoksA4wKzGo8evj/QqFvyDJAv6OJaSGC3N9gL/+7wXL5F4N+TJ8qu6LSAAAAAElFTkSuQmCC" />',
			title: 'Populate all required fields with a value that represents the datatype.',
			name: 'Populate Maximal'
		},
		reOpenClosedActivities: {
			action: function(){reOpenClosedActivities();},
			picSrc: '<img class="ui-icon" alt="" src="data:image/x-icon;base64,AAABAAEAEBAAAAEACABoBQAAFgAAACgAAAAQAAAAIAAAAAEACAAAAAAAAAEAAAAAAAAAAAAAAAEAAAAAAAD5+fkA6urqANvb2wBcYWAAzMzMAFNWVgBlZWUAVFZWAKyurgBWVlYArq6uAObo6AD19fUAfH9/AH1/fwDm5uYA19fXALe5uQCKjIwA5OTkAMTGxgCus7IAqKioAJKVlAB7e3sA09PTAGxsbABVWVgA/f7+AP7+/gDf4OAAz9HRAGlqagBRV1YAWVtbAMLCwgCkpKQA/Pz8AN3e3gB3d3cAz8/PAFdZWQCgoqIAoaKiAPr6+gCDhIQAXWJhAFVXVwC9vr4AVldXAK6vrwBXV1cAkJGRAPj4+ADY2toAW2BfAPb29gDw8vEA5+fnAF9iYgCMjY0AfX5+AG1vbwDW1tYAp6mpAPHy8gB6fHwA09TUAGZpaABWWlkAtLa2ALa2tgCwsrEA/f//AKanpwCgo6IAlpiYAP7//wD///8A8PDwAHB2dQCJiYkAwsPDAFVYVwD7/f0ApaWlAPz9/QCDh4cA/f39AOzu7gDd398A3t/fAGdpaQBZWloAsrKyAPv7+wDs7OwA3d3dAL2/vwBWWFgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAATk5OTk4dTh0dHU0dWE5OTk5OTh05SFEYLUALWjJOTk5OThwwNy40VUxcRQNLTk5OTh1GLyQMTk5JNiIHK05OTh0eKQhOTk5OQRI9DhFOTk4dF1BfTk5OTk5OTh0BKlROWDsVTU5OTk5OTk5OQwdZTjgzKE5OTk5OTk5OTk8JEE41MwROTk5OTk5OTk5gCQJOHRoKTk5OTk5OTk4dFBsMTh1hNQAALF9OTk5OJUJXHU5OHVJTMSA6Tk4dWEpdJk5OTk5SIQdiWB0dEzxjMFhOTk5OI0QNBQYnIAc+H1ZOTk5OThkPWFtHFl4/JR1OTk5OTk5YTk5OTk5OTk5OTk5OTgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=" />',
			title: 'ReOpen a closed activity.',
			name: 'Reopen Closed Activity'
		},
		createNewRecord: {
			action: function(){createNewRecord();},
			picSrc: '<img class="ui-icon" alt="" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOwgAADsIBFShKgAAAABp0RVh0U29mdHdhcmUAUGFpbnQuTkVUIHYzLjUuMTFH80I3AAABPUlEQVQ4T32SrbdFUBDF/WmSJEmSJEmSJEmSJCmSJEmSdJP0kiRJkiRJ7u+cOQv33bfeXos1H3vPmTNnrPMLy7L8aEzTZEIPfAj6vg+CwH7A87y6rvd9N4xLQCiOYyG5rosNfN+XCFXWdRWmEQibehwiEcE4jmEYkkIs5yhB27bCvsqosrYt9nEcURThlmWJqwRy9Ov10gQFzTcCMM8zruM427ZZ4qAxSQ3NvwUgSRIiNGzxYWVZRlTT/gApabuqKqvrOqw8z/8XCK0oCos5YHEtohc07aMlqESaprEYArfB4TIm+SWAwwyJsARqSswLh6eQNND8W0DruDwIthIwLCnAKJ5bAKgtbLqQ1TIvTT9sBAn+DIDRDcPAyVIINlcVphEAnjlNU9K/QCfPtb0FAq7FyJkJL8OePiehcJ5v+FMIhAGbWmwAAAAASUVORK5CYII=" />',
			title: 'Create a new roecord from anywhere in the CRM.',
			name: 'Create New Record'
		},
		copyId: {
			action: function(){copyId();},
			picSrc: '<img class="ui-icon" alt="" src='+tablePic+' />',
			title: 'Show the ID of the actual CRM-Dataset.',
			name: 'Copy Id'
		},
		copyLink: {
			action: function(){copyLink();},
			picSrc: '<img class="ui-icon" alt="" src='+tablePic+' />',
			title: 'Copy the Link of the actual CRM-Dataset.',
			name: 'Copy Link'
		},
		showValueOfField: {
			action: function(){showValueOfField();},
			picSrc: '<img class="ui-icon" alt="" src='+tablePic+' />',
			title: 'Show the value of a specific field.',
			name: 'Show Value of field'
		},
		openDiagnostics: {
			action: function(){openDiagnostics();},
			picSrc: '<img class="ui-icon" alt="" src="data:image/x-icon;base64,AAABAAEAICAAAAEAIACoEAAAFgAAACgAAAAgAAAAQAAAAAEAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAADvAAAA7wAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABIAAAA6wAAAPcAAAAsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAA5QAAAP8AAAD/AAAA/wAAAI8AAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAhwAAAP8AAAD/AAAA/wAAAOYAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAHgAAAD/AAAAzwAAAHgAAAD7AAAA/wAAAMsAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAAAMMAAAD/AAAA+wAAAIAAAADIAAAA/wAAAHgAAAAAAAAAAAAAAAAAAAAAAAAA6wAAAP8AAABAAAAAAAAAADwAAADjAAAA8wAAACQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcAAAA6wAAAOcAAABEAAAAAAAAAEAAAAD/AAAA6wAAAAAAAAAAAAAAAAAAADwAAAD/AAAA0wAAAAAAAAAAAAAAAAAAABQAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4AAAAGAAAAAAAAAAAAAAAAAAAANMAAAD/AAAAPAAAAAAAAAAAAAAAhwAAAP8AAACDAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgwAAAP8AAACHAAAAAAAAAAAAAAC/AAAA/wAAAEQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAIAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABEAAAA/wAAAL8AAAAAAAAAAAAAANcAAAD/AAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAD/AAAA/wAAAP8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAD/AAAA1wAAAAAAAAAAAAAA8wAAAP8AAAAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAP8AAAD8AAAA6wAAABgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAAAAP8AAADzAAAAAAAAAAAAAADzAAAA/wAAAAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAA/wAAAOEAAAD/AAAA1wAAABgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMAAAA/wAAAPMAAAAAAAAAAAAAANcAAAD/AAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAAAAMMAAAD/AAAA1wAAABgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAD/AAAA1wAAAAAAAAAAAAAAvwAAAP8AAABEAAAAAAAAAAAAAAAsAAAAZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAAAAMMAAAD/AAAA1wAAABgAAAAAAAAAAAAAAAAAAABgAAAANAAAAAAAAAAAAAAARAAAAP8AAAC/AAAAAAAAAAAAAACDAAAA/wAAAIcAAABgAAAAxwAAAP8AAAD7AAAAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAAAAMMAAAD/AAAA1wAAABgAAAAAAAAAEAAAAPcAAAD/AAAAywAAAGgAAACJAAAA/wAAAIMAAAAAAAAAAAAAAEsAAAD/AAAA/AAAAP8AAAD/AAAA5wAAAIcAAAAYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAAAAMMAAAD/AAAA1wAAABgAAAAUAAAAhwAAAOcAAAD/AAAA/wAAAP0AAAD/AAAAUQAAAAAAAAAAAAAADAAAAP4AAAD/AAAAyQAAAFQAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAAAAMMAAAD/AAAA1wAAABgAAAAAAAAABAAAAFQAAADJAAAA/wAAAP4AAAAYAAAAAAAAAAAAAAAAAAAAnQAAAP8AAADPAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAAAAMMAAAD/AAAA1wAAABgAAAAAAAAAAAAAAMcAAAD/AAAAoQAAAAAAAAAAAAAAAAAAAAAAAAAIAAAA3wAAAP8AAAB0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAAAAMMAAADzAAAAOAAAAAAAAABoAAAA/wAAAN8AAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAA/wAAAPsAAABEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAADAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAAAADQAAAAAAAAAQAAAAPsAAAD/AAAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB8AAAA/wAAAO8AAABEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAD7AAAAdAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEQAAADzAAAA/wAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACTAAAA/wAAAPsAAAB0AAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAvwAAAP8AAABQAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAB0AAAA+wAAAP8AAACjAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB8AAAA/wAAAP8AAADPAAAAQAAAAAAAAAAAAAAAAAAAAAgAAAD3AAAA/wAAABAAAAAAAAAAAAAAAAAAAABAAAAAzwAAAP8AAAD/AAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAA3wAAAP8AAAD/AAAA0wAAAIMAAABEAAAAWAAAAP8AAADRAAAAIAAAAEQAAACDAAAA0wAAAP8AAAD/AAAA4wAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAcAAAAOcAAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA6wAAAHgAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADwAAACDAAAAvwAAANcAAADzAAAA9AAAANcAAAC/AAAAhwAAADwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//////////////////////////////////////P//8/g//8H5H/+B85//nPP///zj///8Z/8f/mf+H/5n/h/+Z/4P/mf/x/5n/+P+Yj/xxHA/+MDx//x48f/+OPn//zn8///z/n+f4/4/n8f/j58P/8GYP//wAP///AP//////8=" />',
			title: 'Test the performance of your CRM hosting environment.',
			name: 'Open latency tool'
		},
		openCustomizations: {
			action: function(){openCustomizations();},
			picSrc: '<img class="ui-icon" alt="" src="data:image/x-icon;base64,AAABAAEAEBAAAAEACABoBQAAFgAAACgAAAAQAAAAIAAAAAEACAAAAAAAAAEAAAAAAAAAAAAAAAEAAAAAAAC/v78AfX17ALCwsABubmwAX19dAKysqwD5+fkA6urqAJmZlwB/f34AioqIAGxsagD39/cAqqqpAJubmgBubm0AeXl3APX19QCZmZgApKSiAPHx8AC1tbQAm5ubAHNzcACxsa8A7+/uAJOTkQCzs7IAZmZkAPz8+wCvr60A7e3sAIKCgABzc3EAwMC/AP7+/gCxsbAA7+/vAKKioQD6+vkAwsLCAHV1dADY2NYAcXFvAMnJxwD8/PwAr6+uAO3t7QCgoJ8AkZGQAJycmgDp6egAwMDAALy8uwCtrawA+vr6AOvr6wDc3NwAj4+OAIuLiQB8fHoAbW1rALa2tACYmJYAx8fGAHp6eAD6+vsAdnZzAPb29gCampkAeHh2AHR0cQD09PQA1tbWAMfHxwDS0tEAtLSzAKWlpACwsK4A1NTUAMXFxQDQ0M8Atra2AGlpaAD///8A8PDwAK6urACFhYQA3d3cALS0tABycnAA/f39ALCwrwDu7u4AkpKRAJ2dmwDQ0NAA29vaAOzs7ACQkI8Am5uZAM7OzgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVE0IRTIOMg4yZF8aKAZUVFRHLDg4Hy9iYgdiTQVEVFRURzlCWDA2EktIVCQ2RFRUVCFlUSYLRgE8PgYkGERUVFQrADo9GhMyBAUdAiREVFRUWiIuC2NQJBxeGVICRFRUVFoAGyBTCQ8pNRFMTkRUVFQXQBQqCl9NGBlbVgVEVFRUQ2E3J0liN1UGLS5cDFRUVAFgFR5MWRVcDWEFLgZUVFQzMz8BA2MxPRA0XSUjVFRUWyNUEUE7VxZUVFRbVFRUVFRUIzdKJiRPVFRUVFRUVFRUVFRUVFRUVFRUVFRUVAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=" />',
			title: 'Open the Customizations in the CRM.',
			name: 'Open Customizations'
		},
		openAdministration: {
			action: function(){openAdministration();},
			picSrc: '<img class="ui-icon" alt="" src="data:image/x-icon;base64,AAABAAEAEBAAAAEACABoBQAAFgAAACgAAAAQAAAAIAAAAAEACAAAAAAAAAEAAAAAAAAAAAAAAAEAAAAAAAC80MEAsJJnAK5+VQCvflUA29vbAMzMzADf2dAA251wAIF/fgBqzoAAqIZYAIXdlwCX3qQAq4xgAMrKygDd184Ag9iVAFSoaAC7u7sAcr6EAK2fhgB7tIcAnZ2dANq1mQB4pn0AyI5iAIqKiQDX19cA3J1xALW+qwCVfFUAm5ubAMHAvgCWl5YAZb59AFG6aABdjl8A8O/uAODg3wDVpoIA0tHQAMe7qwB8tIgA6OfkAPHx8QBEm10AyZFjAP7+/gCuf1UA0dHRAMLCwgC1o40AoZ6cAF+RYADRzskARH1PALu1rQDUzL4AlZWVAOCzkACIwpMAzK2JAOfs6ADKkGcAs5ZwAKiCVgDdpX4ArX9WAMiPYgCCi4EAdJ1wAGCRYQBXoWYA3J5xAKaPbABUvG0A+Pj4AEuPTwCcnJsAvLy8ALqumQDj6+QA0tzVALGJXADit5cAm4JYANjY2ACWkIwA5LeXAEaHVgC1m3QAq5ZyAHZ0cQDl5eUAgH5+AGBgYAB8pH8AnHpGAP39/ACApooAYrJ6AMC5rQCvn4MAWapwAHGsegCtgFYA////AEqzaADO1s8A1NHEAFCsawDOqYcAi4mJAKKKZADp6OYAqcWuAMmPZQBQoWEA/f39AK6wjgDKkWgAt8S5AKOgmwDV09AApIJSAMmQYwB+k38ASaBlAM/OzgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAampqampqampqampqampqampqampqampqampqampqampqalAeVUptcyQ1R2BRampqamphA3QnRk0ja1ktNz5qampqfAJ4PRMLCUt1ZH9jampqagowP28qDBBoSCJuGGpqamoNMH1CdxU8eQARZ2xqampqAUMZHFgdRU4hflJ2ampqakBpRAdUegVWEhomampqampaQS5JF1yALAQWMWpqampqcWUzUztXCHAOHxtqampqag8UKyUpODReXzosampqamp2OWZ7TyA2KDJdL2pqampqamIGW3JMdmpqampqampqampqampqampqampqampqampqampqampqampqampqagAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=" />',
			title: 'Open the Administration-Site in the CRM.',
			name: 'Open Administration'
		},
		properties: {
			action: function(){properties();},
			picSrc: '<img class="ui-icon" alt="" src="data:image/x-icon;base64,AAABAAEAEBAAAAEACABoBQAAFgAAACgAAAAQAAAAIAAAAAEACAAAAAAAAAEAAAAAAAAAAAAAAAEAAAAAAAC/v78AoaGhAPn5+QDq6uoAdHR0AGVlZQD39/cAkJCQAOjo6ACBgYEA2dnZALu7uwCdnZ0A9fX1AH9/fwDX19cAyMjIAKqqqgCbm5sA8/PzAH19fQBubm4AxsbGALe3twCoqKgAmZmZAPHx8QCKiooAe3t7AGxsbACmpqYA/v7+AJeXlwDv7+8AampqALOzswCkpKQAz8/PAGhoaADAwMAAk5OTAOvr6wDNzc0AZmZmAL6+vgD4+PgAvLy8APb29gCPj48A5+fnAICAgADY2NgAycnJAPT09ACNjY0Afn5+ALi4uADy8vIAi4uLAP///wCJiYkAa2trALS0tAD9/f0AlpaWAO7u7gDf398AeHh4ANDQ0ACjo6MA+/v7AJSUlADs7OwAZ2dnAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7LQYfOzs7Ozs7Ozs7NTQxHwtFCh87Ozs7Ozs7OxEdDhgVBSw/Ozs7Ozs7Hx8QBQUrSQU8LAcpOzs7Ow8zGCtDGQwcSQUmAB87Oz86BQUOCg0TQjIFQyU/OzsNGUkFIz82MAMXJkACOzs7Ozs+BTgfNg4DFyZJKCE7OztBIAUHCAZIQTwrBSgaOzs7CyYFJkcnFiAiFBEqRjs7Oy8gHjoFJj0FBRI7Ozs7Ozs7OzsRBSsBN0kEOzs7Ozs7Ozs/LgkbO0QkKTs7Ozs7Ozs7Ozs5Azs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=" />',
			title: 'Show the properties of the actual CRM-Dataset.',
			name: 'Show Properties'
		},
		preventAutoSave: {
			action: function(){preventAutoSave();},
			picSrc: '<img class="ui-icon" alt="" src="data:image/x-icon;base64,AAABAAEAICAAAAEAIACoEAAAFgAAACgAAAAgAAAAQAAAAAEAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB7oAwAe6AYAHugGAB7oBQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB7oAAAAAAAAAAAAAB7okgEf6NoAFeflABbn7QAW5+0AFufrAB7o1wAe6LAAHugyAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB7oAAAAAAAAHuhGABvowwAT5/83T+3/hZP0/87U+//K0Pr/ytD6/8zS+/+GlPP/anzx/xk06v8AE+flAB3obAAe6AEAHugBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABzongwo6f9VafD////////////+/////////////////////////////////////////83U+v8gOuv/ABnn3AEf6BMAAAAAAB7oAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHugAAB7oFAAc6P84T+3/7e/9//////////////////////////////////////////////////////////////////z9//+Xo/b/ABno/wAe6EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAe6BgAHuj2AB3o/+Tn/P////////////////////////////////////////////////////////////////////////////////+9xPn/ABfn/wIf6FwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAe6AAAHugDAB3o0DNL7f8AFOf/AA7V/8DC1P/X19f/19fX/9fX1//X19f/19fX/9fX1//X19f/19fX/9fX1//X19f/19fX/9fX1//X19f/19fX/9vb2v/r7vz/ABjn9gIf6CIAHugAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAe6GoAHuj//////52p+f8AD3T/AAAA/wABB/8NDQ3/DQ0N/w0NDf8NDQ3/DQ0N/w0NDf8NDQ3/DQ0N/w0NDf8NDQ3/DQ0N/w4ODv8AAAD/Dw8P//r6+v+RnfX/ABfn0AAAAAAAHugAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHugmAyHo/+fq/f///////////3N1gv8AAAD/AReo/9/k/////////////////////////////////////////////////////////////wAAAP8UFBT/+vr6//////89VO7/AB7oYwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAb6Ic1Te3/////////////////g4OD/wAAAP8AE6n/AAyK/xEVLP81NTH/MDEx/zExMf8xMTH/MTEx/zExMf8xMTH/MDAw/0NDQ///////AAAA/xQUFP/6+vr//v///87T+/8AHej/AAAAAAAAAAAAAAAAAAAAAAAe6AAAAAAAABHn9+fr/f////////////////+Dg4P/AAAA/1Ndp/8AGOL/AA/a/9HU7P/s7Oz/7Ozs/+zs7P/s7Oz/7Ozs/+zs7P/s7Oz/8fHx//////8AAAD/FBQU//r6+v///////////wgl6f4AHOgrAB7oAAAAAAAAAAAAAAAAAAAe6CUwSO3//////////////////////4ODg/8AAAD/vLy8/3p7fv8AAAD/AQEB/wEBAf8DAAP/AAAA/wAAAP8AAAD/AAAA/wAAAP8UFBT//////wAAAP8UFBT/+vr6////////////eorz/wAX52wAAAAAAAAAAAAAAAAAAAAAAB7oWF9y8f//////////////////////g4OD/wAAAP+2trb//////7jD//8AGP//BSb//9jg////////////////////////////////////////AAAA/xQUFP/6+vr////////////r7v3/ABbnngAAAAAAAAAAAAAAAAAAAAAAHujVc4Ty/v////////////////////+Dg4P/AAAA/7u7u/+NjY3/Hx8c/zIwH/8AABn/AAAZ/wAAFP8gHxz/Gxsb/xsbG/8bGxv/LS0t//////8AAAD/FBQU//r6+v////////////n6/v8AGOf/AAAAAAAAAAAAAAAAAAAAAAAe6M1zhPL//////////////////////4ODg/8AAAD/rq6u//f39//6+vr//v37/6Sv8v8AHeT/ABHj/9DW9v/6+vr/+vr6//r6+v/6+vr//////wAAAP8UFBT/+vr6////////////+/z//wso6f8AAAAAAAAAAAAAAAAAAAAAAB7ozXOE8v//////////////////////g4OD/wAAAP8ICAj/CwsL/wsLC/8LCwv/CwsL/wACCv8AAQr/AgMK/wsLC/8LCwv/CwsL/wsLC/8MDAz/AAAA/xQUFP/6+vr////////////6+v//ABvo/wAAAAAAAAAAAAAAAAAAAAAAHuiwd4fz//7///////////////////+Dg4P/AAAA/wAAAP8AAAD/fn5+/5iYmP+YmJj/mJiY/4aJl/8AAYn/ABKL/2Bmk/+Dgn//AAAA/wAAAP8AAAD/FBQU//r6+v////////////7+//8AGOf0AAAAAAAAAAAAAAAAAAAAAAAe6F4tRuz//////////////////////4ODg/8AAAD/AAAA/wAAAP/V1dX//////////////////////6Cq5/8AFq3/AAa//5GZz/8AAAD/AAAA/wAAAP8UFBT/+vr6////////////qrT3/wAY56MAAAAAAAAAAAAAAAAAHugAAAAAABAs6v//////////////////////g4OD/wAAAP8AAAD/AAAA/9XV1f//////////////////////vLy8/wAAAP8ACk//ABrI/wAAAP8AAAD/AAAA/xQUFP/6+vr///////////86Ue3/ABfnNQAe6AAAAAAAAAAAAAAAAAAAAAAAABTn2aq1+P////////////////+Dg4P/AAAA/wAAAP8AAAD/1dXV//////////////////////+8vLz/AAAA/ycsU/8AD8f/AAAA/wAAAP8AAAD/ExMT//r6+v//////6u39/wAa6P0AHughAAAAAAAAAAAAAAAAAAAAAAAe6AEBH+hjECzp/////////////////4ODg/8AAAD/AAAA/wAAAP/V1dX//////////////////////7y8vP8AAAD/XVxY/62z2P8AAAD/AAAA/w0MBv94eHb///////////+KmPT/AB7o5AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAe6AoAG+j/mKT1////////////g4OD/wAAAP8AAAD/AAAA/9XV1f//////////////////////u7u7/wAAAP9VVVX/3d3d/wAAAP8AAAD/AAqG/8HK/////////////wAK5v8AHugsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAe6CwAHuj/vsb5//////+AgID/AAAA/wAAAP8AAAD/1dXV///////////////////////6+vr/7e3t//Pz8//T09P/AAAA/6Gnx/8AEeb/ABzo/8TL+f9HXe7+AB7ovgAAAAAAHugAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAe6KUaNer/+Pn//+vr6//W1tb/19fX/9fX1//4+Pj///////////////////////////////////////j4+P/Y2Nj////+/7a/+P8AEOf/ABbn/wAb6N4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHugAAAAAAAEf6MsQLOn/yc/6/////////////////////////////////////////////////////////////////////////////f3//0lf7/8AHuj3AB7oIAAe6AEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAe6KAAHej/f47z/////////////////////////////////////////////////////////////v7//8nQ+v8SLur/AB7o5QAe6AEAHugAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHugAAAAAAAAe6C0AG+j/Dyvp/21+8v///////////////////////v7//////////////////4eV9P8eOOv/ABzo/wAd6H4AHugDAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB7oAAAe6AYAHuh9ABnnzwAR5/8VMOr/OVDt/11w8P+LmfX/NU3t/zhQ7f8ADub/ABjn9QAe6KAAHuggAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB7oHAAe6GQAHuipAB7o2AAe6NcAHujKAB7oZAAe6DwAAAAAAAAAAAAe6AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAe6AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAe6AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////////////8A///8AD//8AAP/+AAB//AAAP/gAAB/4AAAP8AAAD+AAAAfgAAAH4AAAB+AAAAPAAAADwAAAA8AAAAPAAAAD4AAAA+AAAAfgAAAH8AAAB/AAAA/4AAAP+AAAH/wAAD/+AAB//4AB///gA////D////////////8=" />',
			title: 'Prevent the automatic-save in CRM 2013 until you reload the page.',
			name: 'Prevent auto-save'
		},
		refresh: {
			action: function(){refresh();},
			picSrc: '<img class="ui-icon" alt="" src="data:image/x-icon;base64,AAABAAEAEBAAAAEACABoBQAAFgAAACgAAAAQAAAAIAAAAAEACAAAAAAAAAEAAAAAAAAAAAAAAAEAAAAAAAD5+fkA6urqANvb2wBcYWAAzMzMAFNWVgBlZWUAVFZWAKyurgBWVlYArq6uAObo6AD19fUAfH9/AH1/fwDm5uYA19fXALe5uQCKjIwA5OTkAMTGxgCus7IAqKioAJKVlAB7e3sA09PTAGxsbABVWVgA/f7+AP7+/gDf4OAAz9HRAGlqagBRV1YAWVtbAMLCwgCkpKQA/Pz8AN3e3gB3d3cAz8/PAFdZWQCgoqIAoaKiAPr6+gCDhIQAXWJhAFVXVwC9vr4AVldXAK6vrwBXV1cAkJGRAPj4+ADY2toAW2BfAPb29gDw8vEA5+fnAF9iYgCMjY0AfX5+AG1vbwDW1tYAp6mpAPHy8gB6fHwA09TUAGZpaABWWlkAtLa2ALa2tgCwsrEA/f//AKanpwCgo6IAlpiYAP7//wD///8A8PDwAHB2dQCJiYkAwsPDAFVYVwD7/f0ApaWlAPz9/QCDh4cA/f39AOzu7gDd398A3t/fAGdpaQBZWloAsrKyAPv7+wDs7OwA3d3dAL2/vwBWWFgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAATk5OTk4dTh0dHU0dWE5OTk5OTh05SFEYLUALWjJOTk5OThwwNy40VUxcRQNLTk5OTh1GLyQMTk5JNiIHK05OTh0eKQhOTk5OQRI9DhFOTk4dF1BfTk5OTk5OTh0BKlROWDsVTU5OTk5OTk5OQwdZTjgzKE5OTk5OTk5OTk8JEE41MwROTk5OTk5OTk5gCQJOHRoKTk5OTk5OTk4dFBsMTh1hNQAALF9OTk5OJUJXHU5OHVJTMSA6Tk4dWEpdJk5OTk5SIQdiWB0dEzxjMFhOTk5OI0QNBQYnIAc+H1ZOTk5OThkPWFtHFl4/JR1OTk5OTk5YTk5OTk5OTk5OTk5OTgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=" />',
			title: 'Refresh the current CRM-form without reloading.',
			name: 'Refresh'
		},
		saveAndPublish: {
			action: function(){saveAndPublish();},
			picSrc: '<img class="ui-icon" alt="" src="data:image/x-icon;base64,AAABAAEAEBAAAAEACABoBQAAFgAAACgAAAAQAAAAIAAAAAEACAAAAAAAAAEAAAAAAAAAAAAAAAEAAAAAAACBeHAAjoyKALmjkgD5+fkA+/n5AL+4sgDYxbYAq6WfAN7Y1ABtbGsA+/j1AP7+/QDk5OQAo5yYAPjr4ABubm4Aenl4APfw6wD++vgA9/LuAP38+wB7e3sAbGxsAJyWkQBtbGwAn5aRAHVzcQD+/v4A+fTxAP/+/gDg4OAA/Pr5AHp5eQD59vQA9OznAPr29ACVlZUA5trQAPPo4gD47+cA7+TdAMS0qAC+qpsAdXV1AGZmZgD48vAAgoKCAOXWzAB0c3MAbWtpAOfe1wCzrKgAtp6NAOXc1QB6enkAnZWPAPr39AD9/fwAsaqmAOPj4wCVh30AiYeGAPv59wDEvLUA0ce/AGtpaAD59fIA////AIZ6cQB6enoA/fv6AHt6egCHhYQAbGtrAId8dABnZ2YA/f39AP79/QDi2tQAjYiEAGlpaQB2dHMA9/HuAH97eADy5+EA7uPcAGdnZwD17ekAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0MdBi4uPSVDQ0NDQ0MMOzs7KTEJU1ZEMkNDQ0NDMDM6GSwsAScYLEoLQ0NDQxBUKAIsSSRDMFAsTENDQ0MgIiY0LD8SQxE3LExDQ0NDNlJXQCwsBw5PLCxMQ0NDQ0VCE1U8SywsLEEqG0NDQ0NHPiMtLw0ALBYFIUNDQ0NDFRQEOBxXNUgeQ0NDQ0NDQxUdOR8KKxpRA0NDQ0NDQ0MVQ0NNRisXCBtDQ0NDQ0NDKxUVFRUPThtDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=" />',
			title: 'Publish the changes in CRM.',
			name: 'SaveAndPublish'
		},
		saveAndClose: {
			action: function(){saveAndClose();},
			picSrc: '<img class="ui-icon" alt="" src="data:image/x-icon;base64,AAABAAEAEBAAAAEACABoBQAAFgAAACgAAAAQAAAAIAAAAAEACAAAAAAAAAEAAAAAAAAAAAAAAAEAAAAAAAC+vr4A8vLyAGhoaABxcXEArq6uAIODgwDr6+sAwMDAAOTk5ABsbGwA////AH5+fgCysrIAu7u7AO/v7wCQkJAAtLS0AImJiQDx8fEAcHBwAKSkpAB5eXkAra2tAIKCggC/v78AcnJyANHR0QB7e3sA4+PjAISEhAC4uLgAdHR0AMPDwwBtbW0A1dXVAKqqqgCIiIgAvLy8AJGRkQBmZmYAzs7OAG9vbwDX19cAtbW1AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgQXBRcFHQUXEAoKCgoKCgohJxwCBwoiJx8KCgoKCgoKISccJRwKIicfCgoKCgoKCiEnAx8fHxMnHwoKCgoKCgohFSYmJiYmGR8KCgoKCgoKISMKCgoKCiYfKA8UCgoKCiEjCgoKCgomHwoKHQoKCgohIwoKCgoKABYKCh0KCgoKKR8dDSsSHhcICgodCgoKCgoKCgYEAiIbKRwKHQoKCgoKCgoRDhgMHwkaCh0KCgoKCgoKAwsBDAMqIBskCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=" />',
			title: 'Save and Close the actual form in the CRM.',
			name: 'Save and Close'
		},
		saveAndNew: {
			action: function(){saveAndNew();},
			picSrc: '<img class="ui-icon" alt="" src="data:image/x-icon;base64,AAABAAEAEBAAAAEACABoBQAAFgAAACgAAAAQAAAAIAAAAAEACAAAAAAAAAEAAAAAAAAAAAAAAAEAAAAAAADm5uYAqqqqAP///wCVlZUA8fHxAOrq6gDj4+MAzMzMAICAgADV1dUAmZmZAO7u7gDQ0NAA9/f3AGZmZgDLy8sA6+vrAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICDQACAgICAgICBgoKCgoPAgcOAgICAgICAggOAAcOAggODg4AAgICAgIIDgALBwIJAQ4HDQICAgICCA4MAAAAEAkIAgICAgICAggODg4ODggFBQQCAgICAgIICgICAgICAggKAgICAgICCAoCAgICAgIICgICAgICAggKAgICAgICCAoCAgICAgIICgICAgICAggKAgICAgICAwgICAgICAgIAQICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=" />',
			title: 'Save the actual CRM-form and create a new Dataset.',
			name: 'Save and New'
		},
		openSelection: {
			action: function(){openSelection();},
			picSrc: '<img class="ui-icon" alt="" src="data:image/x-icon;base64,AAABAAEAICAAAAEAIACoEAAAFgAAACgAAAAgAAAAQAAAAAEAIAAAAAAAABAAACUWAAAlFgAAAAAAAAAAAAD+/v7///////T09P+kpKT/W1tb/zs7O/82Njb/MjIy/zQ0NP80NDT/NDQ0/zQ0NP80NDT/NDQ0/zQ0NP80NDT/NTU1/zQ0NP8xMTH/NDQ0/zw8PP9mZmb/s7Oz//n5+f///////f39/////////////v7+//7+/v///////v7+///////n5+f/VFRU/zAwMP82Njb/NDQ0/zQ0NP82Njb/NDQ0/zQ0NP80NDT/NDQ0/zQ0NP80NDT/NDQ0/zQ0NP8zMzP/MDAw/zg4OP81NTX/MzMz/zQ0NP8xMTH/a2tr/+7u7v/9/f3///////////////////////7+/v//////9/f3/1NTU/83Nzf/MzMz/zc3N/8xMTH/Ly8v/zQ0NP8zMzP/MzMz/zMzM/8zMzP/MzMz/zMzM/8zMzP/MzMz/zQ0NP86Ojr/LS0t/zAwMP82Njb/NDQ0/zIyMv8wMDD/cHBw///////+/v7//f39///////8/Pz///////7+/v+kpKT/MzMz/zExMf81NTX/MzMz/2NjY/9ycnL/cHBw/3BwcP9wcHD/cHBw/3BwcP9wcHD/cHBw/3BwcP9wcHD/bm5u/25ubv9zc3P/cXFx/1ZWVv8yMjL/OTk5/zMzM/8vLy//xMTE//39/f///////v7+/////////////////1lZWf81NTX/Nzc3/zU1Nf+7u7v//v7+///////9/f3//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v///////v7+//39/f/7+/v//v7+/5ubm/80NDT/NDQ0/zk5Of94eHj///////7+/v///////v7+////////////PDw8/zAwMP8yMjL/YmJi//7+/v/5+fn////////////+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//39/f/////////////////9/f3//////0RERP80NDT/MTEx/1lZWf///////f39///////+/v7///////39/f8zMzP/NjY2/zY2Nv9vb2///v7+///////7+/v//f39//////////////////////////////////////////////////v7+//+/v7////////////8/Pz/UFBQ/zU1Nf82Njb/T09P//7+/v//////+/v7/////////////v7+/zU1Nf80NDT/MTEx/3Jycv//////+/v7/////////////////////////////////////////////////////////////v7+/////////////v7+//////9TU1P/MTEx/zIyMv9UVFT//f39/////////////v7+//39/f//////NDQ0/zQ0NP80NDT/cXFx//7+/v/////////////////9/f3////////////+/v7///////39/f////////////7+/v///////v7+/////////////f39/1JSUv80NDT/MzMz/1RUVP/8/Pz////////////+/v7///////39/f80NDT/NDQ0/zQ0NP9xcXH//v7+///////////////////////+/v7/+fn5//////////////////7+/v///////f39//39/f///////Pz8///////9/f3/Tk5O/zQ0NP80NDT/UFBQ//////////////////z8/P///////////zQ0NP80NDT/NDQ0/3Fxcf/+/v7//////////////////Pz8/////////////f39///////8/Pz/9vb2/6mpqf9zc3P/eHh4/7a2tv/6+vr///////7+/v+ZmZn/NTU1/zU1Nf9UVFT//v7+///////9/f3//v7+////////////NDQ0/zQ0NP80NDT/cXFx//7+/v///////////////////////f39//z8/P///////Pz8//X19f9mZmb/NTU1/zExMf80NDT/NTU1/4GBgf/4+Pj//f39//7+/v+Xl5f/MjIy/09PT//+/v7///////r6+v///////v7+//7+/v80NDT/NDQ0/zQ0NP9xcXH//v7+//////////////////z8/P///////f39//7+/v/29vb/YGBg/zc3N/8zMzP/MzMz/zQ0NP80NDT/Nzc3/3x8fP/7+/v///////r6+v+ZmZn/U1NT///////9/f3//v7+/////////////////zQ0NP80NDT/NDQ0/3Fxcf/+/v7//////////////////v7+///////+/v7/8vLy/2RkZP80NDT/MTEx/zQ0NP81NTX/NDQ0/zQ0NP8uLi7/ODg4/4CAgP/6+vr///////v7+/+2trb/+/v7///////+/v7//f39/9zc3P+RkZH/NDQ0/zQ0NP80NDT/cXFx//7+/v////////////////////////////n5+f9mZmb/Li4u/zc3N/81NTX/NDQ0/zQ0NP8wMDD/Nzc3/zg4OP8yMjL/MjIy/4CAgP/5+fn//v7+//r6+v///////v7+//z8/P/W1tb/QEBA/zk5Of80NDT/NDQ0/zQ0NP9xcXH//v7+////////////////////////////sLCw/zQ0NP81NTX/MzMz/zMzM/80NDT/NDQ0/zQ0NP81NTX/MTEx/zQ0NP81NTX/NDQ0/4CAgP/7+/v///////z8/P//////1dXV/0BAQP8zMzP/NTU1/zU1Nf80NDT/NDQ0/3BwcP/+/v7///////7+/v////////////z8/P97e3v/Nzc3/zIyMv82Njb/MjIy/zY2Nv80NDT/NDQ0/zQ0NP80NDT/NDQ0/zQ0NP80NDT/NDQ0/39/f//7+/v//f39/9PT0/9BQUH/MTEx/zc3N/8zMzP/NDQ0/zExMf83Nzf/bm5u/////////////f39///////+/v7//////4eHh/8zMzP/MjIy/zAwMP81NTX/NDQ0/zQ0NP80NDT/NDQ0/zQ0NP80NDT/NDQ0/zQ0NP80NDT/MjIy/4KCgv/Q0ND/QUFB/zMzM/84ODj/MDAw/zY2Nv8wMDD/Ozs7/zExMf90dHT//////////////////f39//39/f/7+/v/zc3N/zQ0NP81NTX/ODg4/zQ0NP8yMjL/NDQ0/zQ0NP80NDT/NDQ0/zQ0NP80NDT/NDQ0/zQ0NP81NTX/MTEx/zg4OP81NTX/NTU1/zMzM/82Njb/MjIy/zc3N/8wMDD/MjIy/29vb//6+vr////////////////////////////+/v7/lpaW/zU1Nf8yMjL/LS0t/zk5Of80NDT/NDQ0/zQ0NP80NDT/NDQ0/zQ0NP80NDT/NDQ0/zQ0NP8zMzP/MjIy/zMzM/80NDT/NDQ0/zMzM/81NTX/Pj4+/zMzM/87Ozv/V1dX//z8/P/+/v7///////7+/v/////////////////8/Pz/mZmZ/zQ0NP82Njb/MDAw/zQ0NP80NDT/NDQ0/zQ0NP80NDT/NDQ0/zQ0NP80NDT/NDQ0/zU1Nf83Nzf/NDQ0/zQ0NP80NDT/Nzc3/zExMf9jY2P/NDQ0/zAwMP8xMTH/oaGh//39/f/8/Pz////////////6+vr////////////9/f3/lpaW/zU1Nf81NTX/NDQ0/zQ0NP80NDT/NDQ0/zQ0NP80NDT/NDQ0/zQ0NP80NDT/NjY2/y4uLv81NTX/OTk5/zExMf80NDT/NjY2/7Gxsf80NDT/NTU1/zY2Nv80NDT/Pz8//1JSUv9SUlL/T09P/1NTU/+NjY3///////7+/v/9/f3/m5ub/zIyMv80NDT/NDQ0/zQ0NP80NDT/NDQ0/zQ0NP80NDT/NDQ0/zQ0NP82Njb/NjY2/zQ0NP8wMDD/NTU1/zIyMv81NTX/+/v7/2VlZf8zMzP/MjIy/zY2Nv81NTX/NjY2/zExMf82Njb/MjIy/zQ0NP+IiIj//Pz8//7+/v/+/v7/l5eX/zQ0NP80NDT/NDQ0/zQ0NP80NDT/NDQ0/zQ0NP80NDT/NjY2/zExMf8yMjL/NjY2/zMzM/82Njb/NTU1/zMzM///////7+/v/3BwcP8wMDD/NjY2/zExMf80NDT/NDQ0/zY2Nv8xMTH/NDQ0/zMzM/+Li4v/+/v7///////+/v7/lpaW/zU1Nf8zMzP/Nzc3/zIyMv8zMzP/NjY2/zMzM/8yMjL/Nzc3/zMzM/82Njb/MzMz/zIyMv81NTX/MjIy///////+/v7//Pz8/8PDw/93d3f/XFxc/09PT/9UVFT/UVFR/1VVVf9UVFT/Tk5O/1NTU/+lpaX//v7+//39/f/8/Pz/mZmZ/zQ0NP8xMTH/ODg4/zU1Nf8xMTH/NjY2/zQ0NP80NDT/MDAw/zQ0NP83Nzf/NTU1/zMzM/80NDT//f39///////+/v7//v7+//7+/v///////v7+//39/f//////+fn5/////////////Pz8///////+/v7////////////S0tL/Ozs7/zQ0NP8xMTH/MzMz/zY2Nv8zMzP/MjIy/zY2Nv82Njb/MTEx/zMzM/8zMzP/MzMz/zc3N////////v7+/////////////Pz8//z8/P////////////////////////////n5+f///////f39///////+/v7/09PT/0FBQf8zMzP/NDQ0/zU1Nf8zMzP/NjY2/zU1Nf80NDT/NDQ0/zQ0NP8zMzP/NDQ0/zQ0NP8zMzP/MDAw/////////////v7+//v7+/////////////z8/P///////f39//39/f/8/Pz/////////////////+vr6/9XV1f9BQUH/NDQ0/zc3N/81NTX/NDQ0/zIyMv80NDT/MzMz/zY2Nv8yMjL/MTEx/zY2Nv81NTX/MzMz/zg4OP83Nzf/+/v7///////////////////////9/f3//////////////////////////////////v7+//39/f/V1dX/QUFB/zMzM/84ODj/NDQ0/zExMf80NDT/NTU1/zU1Nf8zMzP/NDQ0/zU1Nf8zMzP/NjY2/zIyMv8yMjL/MTEx/zU1Nf/////////////////9/f3///////7+/v/+/v7////////////8/Pz///////z8/P//////3t7e/0NDQ/8zMzP/NjY2/zIyMv8zMzP/NTU1/zg4OP8uLi7/NjY2/zU1Nf8zMzP/NTU1/zMzM/80NDT/NDQ0/zc3N/8vLy//T09P///////9/f3//////////////////Pz8///////+/v7//v7+///////9/f3///////7+/v+Xl5f/PDw8/zIyMv80NDT/MjIy/zU1Nf82Njb/MzMz/zQ0NP81NTX/MzMz/zQ0NP8zMzP/NTU1/zY2Nv8xMTH/Nzc3/0xMTP+rq6v/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=" />',
			title: 'Get the selected text and try to open in a new window.',
			name: 'Open selected Text'
		},
		whoAmI: {
			action: function(){whoAmI();},
			picSrc: '<img class="ui-icon" alt="" src="data:image/x-icon;base64,AAABAAEAICAAAAEAGACoDAAAFgAAACgAAAAgAAAAQAAAAAEAGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD9/P/5+f/7+v7///////n///X///f///v/+/3q6fLH0NrC1N/P4uro7/L/+vb//vP//P37/vzn8+3Z3t/V1N7Pz93j6vPz+/r///n///j///z//v///P///f/5+v72/////f///f////7///z+/fn///76/v/n6+zSzs3r3tb//vH169m4spuajXONb1KJXT56ZEGEbE6iiW/MtJz66NH/+urq4d3Qz9Hl6u36///7/f39/P//+//7/P/7///6//r/+f7//fz///v///n9//76/f/O1d7Y29///PDmyquVbkFtRRBfOgJjPAVrOQR1PAVnPABxOwB1OQVsOANrQguTbz/gwqX//PPY3N3J1Nj5/v///f/6+//3/f/4/fv///b//f///v///vr///vz+fjGzNHu6+3y4diIak1oQAxuPgB1PwB3PgB6PgB4PgBxOQB/RQCBQAB5NgB4OQBxOgBtOwBlPAWHa0Lv48vx7+fMycv79/z////9//z///z///z0+v/9/v///v/y8+/T2dT49u7YxLNmPB9wPA1uPgB0RQB4QwCCQQCDQAF9RAZyRgZ6PQB4QAB7RQh0OwN5PQluOQBoPgBgPwBjQhDYvaL/+fLSz8v3+O////j//vv/+//4/v/7/P/8+vrT0837+OrDtJpeNxF6Pw18PQB9RwB6SACARwCHQwCBQgacbzzDqXu1kGRpQRBtPgZ9Qgp5OwVtPQNmQgJhOwBrOwFoOxC/pIr/+vDS0c3++fr/+/z//v/9/f/5/f7V2dT28eLZxKlmPhR9RQ5+QACFSQOBQwCOTQKNSwCFRgK6jFz//+z//vn///Tdyql2RA+MSQR+PgB2RgZjOwZsPg5vNgJ1PQZjOQ7Mt6L28fPNz9r6/f/9//z7+v/r8PHZ3dHy5sp1SyB+PgSFQgCHTQKCSACQTgeVSQGUSwGFUQ/v27j3/f/j9v/X/P////SUYSmWTQCTUAB6QwBzQA5wOwl2PQB5PQBwNwBlPh7q2tTY3OHm7PH8/v709v/Q09H//uqUeE99QgqTRwCYTgCMTACLTwORTAeaTAmUTgh9Tw/248D1/P/j9f/j+/////SbaS2UTwCUTgCKSQWAQwWCRgB8QQCBQwB6PABsNQiIaEv///LLzc31+v/m8fXi3dTw07R1Qw+GRQCWUACWTQCgVgCcUwOWTgaWUAqZVQqWWg7BklX//+L//vL/+/D0zKmDTQyYVgiSSQCNRwGMSwCESQCFTQB5QQBzPQBvOQJlNwjoyarl3dbi6/jH1dP//uuvek+JQgKQTgCSVACYVACkUgCoUgCpXA2bVgagWACsWACyXgDKhDH2v3bqnV+bVBGcWA+RSQGbTweTTwSNUACHTQB7RgByRABoQgJpPwRpNwOUZ0X///HE0tHG09H/8dmNTBWfTQCaUQCOUgCZWQWmVgGxWQCqVwCpWwC2YwC5XQC7YwCmXQeRWQygWBCgVQmfUAGoVwahUgOYUAOOSgGJSwWARgRyRARqQwVoPgNsOwllOxb77tTP28nY3uPZwamJSg2hTgClVQCZUgKZVwaoXgayXgC5YQC7YwC8ZQOwYAfBgz3typ/r2sXo07TUpXGiWQmvWQCnVgGaTAWaTAqUSweMSwZ8QgB5QgVyOQFoOQFaPAu+tZDp7dTq5uu4nYKGTAqkVACxWQCrWQegVwOnXwG0ZQC6YgDBZAC7YwWoYRf/37X//v7j+P/l+////+mtciyqWwCnVwKiVA2aTAeWSwCOSQCLRgCKQgaDPQF1QQBYPACYjGj58uP/+PCmgl6SVhCfUQCyWgC0XQeuXQK2ZgG9awC9aADEaAHCZgetYhT/3bH//fri+f/m/f////G+j1ejXAyjVwScVQWUUgGWUwCSTQCMRwGKQwOFPwB3OgBrPQeFa1P//Pz//+mpe0yVVAqqWwStWQCwXAO6YwW9ZwC+agDEbwHHbwXJawfDaRD/v37//+f9//79//n//+3/7L2wbCmhWAaaXAKOWQCNVACNTgSHRwZ/RAB9PwCFPgBxMgZ/WU3/+v///vGngFOfVwC6XwC/YwC6YwO+ZAXFZgDPbQLRbwnQbwfVcQHPcALIgzP//d/y+v////v4///z//7n6tGbfkGZWgCsWgCgUACPSQaCSA15QwR5RAB0QQBhOQh9Ykj//vX/+vOqh1+fWQa7YADEZgC4YQHAaQnPbQHacADZbwDVcwPadQHifAXHcAjXn17//+P8/v/+//3///z///f/+dywiVKSVAafVwOTUAWESAZ+RAKBRgFyPQBhOQmHbFH///Dw6+q9nn2fXQ+8ZADBZADFbQi/ZwPQcADfdwDZdgTOdhHLdhPLcwnVeg3Fcg/hmEL/+O3/+vH///z9/P/4+P7//u2heUWJTwSOTACJSwCHSQOAQQB5QgVfNgmnjHH/8eDh3uDoy6ybWhCzXgDDaQDFawDIbQDPcwTIcQnknEj/1JP/3Kn/36n5unDHcgzfegC/fkf/8dT/+vz0+v/2+///9/D93r2EUhaRUAWPSgCNSwB6PgBvOwBiOw/MtJzy5d3P0Nr/99qeXRK4ZQLEbQXEagDQcADOdAW9eyj//9f//+7//////v7//+jfnU/UcADQagrGh1T/+/X0/P/6/v////f//+eLWiySTQeWSwCIRgB5RQBqPwZcPBP86drY0djL0+T/++PPk02xYwa6ZgDKcAHTcADPdAG+fy///t/6/v/o+f/r+f//+/fovYq6cxzCaA+6gUn//+78//v4/fv//fb///CRXTSTSQGbSwCHRQBzRwdZOAaDakj///jNzdnm7fzs4NT/4bCoYxO4YwDHawDXdQDTdQS/dBj/26j//vbz/P/y+v////n//+fkxqPZuZD/8sr//+j///j0///9////8tyETRqWTASTSACFRQBtPgZUNxDZy7jm497p7fL+/PzPz8///+6/jla5aQrJagDObwLNbwTLcgrZkD7//9n///T//vv///v////2/v/s///6//n///T3//7z/v////bSroaHTQyIRwOFRQR/QQFvPQiIblD//PTL0M77//T///Tp7/TP1dz/7NSsbCW+ZQPMbwjNbgbUcgTPcgvppVr//9z///T////z/f/n+//i/f/r/v/w///0//////Xv0KmVWxmMSACERwd7QgpzPQZvRRjx4M3Y2trs8e////L///f2+/7V3OXx6uf30rCoZSDAZAXVbgHbbwDMaADFcxrHjlH/4b7//ev///X///b///f///f///P/9tzLq3qMVRCTTACXTACGQgB8RA1gOhDWw6j38+jU19X9/Pj///j2//////z7+PTQz9P88vLsxqS1aBnQaQDbcAHMagTAaQm3aBGnZhu1gT/Onl7cq2fgpXjRnW+0g0uVXRCXWACWUwCSTgWORwOLRQJxPwvJtZzw9O/M09D///j///r//P7v+f////v///b49/nQ0dv/8un/2am1ahu5Ywm+ZwnFaQTNbADHaAC+aAC5ZQC9aAC1WxStVQi0XAC3XQCoUwCUTwB7RQl0QQ92RhboyKX68+rM1t3t9fX///n///77+/////7//fn///z///769fbb0s/8697/7tPElGShXhO7ZgPGZwDGZwDAZgC8ZAC8YwC8XAizVgCtUgCsVACiUwCITAZvRxeMdlr36tz07ufPzcz7+fn///7++vn7+//2/P//+/L+/v77/v////7/+/H//fjW3OPP1N3/+u7/4LTOlVCqaBqjXxKbWA2eWhGXUwqcUQeXUAyNTxOAShV9TRmof07v1LL//PHL1N7I0d7///////X//PX//v/4/v/3/f///v///v/9/P7++vX///n9//7u+P/j7vbM0dDj3dL//uv/8dXqyKTPpn+zi2ikfmCqfVGshV67ooLOwKr/9eP/++nq39HW0c7s7/f3/P////////f///j////5+/z8+/3t9//7+v7///j///j6///w+//6//////f6/vji8fq8zeDP1N3v4dX/7tn/9+f/+/j//+3/++j07dzY4NbH1tjG1Nru8PH/+vj//vv//fr6/Pz6///7//z///n///z//v8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==" />',
			title: 'Informations about the user-context in the CRM.',
			name: 'Who am I?'
		},
		subgridify: {
			action: function(){subgridify();},
			picSrc: '<img class="ui-icon" alt="" src="data:image/x-icon;base64,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" />',
			title: 'TI-Integration, E-Mail and Instant Messaging directly from the Subgrid.',
			name: 'SubGridify'
		},
		getJquery: {
			action: function(){getJquery();},
			picSrc: '<img class="ui-icon" alt="" src="data:image/x-icon;base64,AAABAAEAICAAAAEACACoCAAAFgAAACgAAAAgAAAAQAAAAAEACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQEBAAICAgADAwMABAQEAAUFBQAHBwcACAgIAAkJCQAKCgoACwsLAAwMDAANDQ0AEhISABMTEwAUFBQAFRUVABYWFgAXFxcAGRkZAB0dHQAeHh4AHx8fACAgIAAkJCQAJSUlACgoKAAwMDAANDQ0ADU1NQA2NjYAOjo6ADw8PAA+Pj4APz8/AENDQwBFRUUAR0dHAElJSQBKSkoAS0tLAE9PTwBRUVEAU1NTAFRUVABVVVUAW1tbAFxcXABhYWEAYmJiAGNjYwBkZGQAZ2dnAGhoaABqamoAbGxsAHJycgB3d3cAeXl5AHt7ewB/f38AgICAAIODgwCEhIQAiIiIAImJiQCLi4sAkZGRAJOTkwCXl5cAmJiYAJmZmQCampoAnJycAJ2dnQCenp4An5+fAKCgoAClpaUApqamAKenpwCoqKgAqampAKqqqgCrq6sArKysAK2trQCwsLAAsrKyALa2tgC4uLgAubm5ALu7uwC8vLwAvr6+AL+/vwDAwMAAwsLCAMTExADGxsYAyMjIAMnJyQDNzc0Az8/PANDQ0ADR0dEA0tLSANTU1ADV1dUA1tbWANfX1wDZ2dkA2traAN3d3QDe3t4A39/fAODg4ADh4eEA4uLiAOPj4wDk5OQA5eXlAOfn5wDo6OgA6enpAOrq6gDr6+sA7OzsAO7u7gDv7+8A8fHxAPLy8gDz8/MA9PT0APX19QD29vYA9/f3APj4+AD5+fkA+vr6APv7+wD8/PwA/f39AP7+/gD///8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQjIB0b3OAjZCQkJCQkJCQkJCQkJCQkJCQkJCQkJCHTigTCAAAAAgWK1OKkJCQkJCQkJCQkJCQkJCQkJCLRBMAAAAAAAAAAAAAABZQj5CQkJCQkJCQkJCQkJCQahsAAAAAAAAAAAAAAAAAAAEshZCQkJCQkJCQkJCQkFUIAAAAAAAACSlAVl9iWUgzEAEegpCQkJCQkJCQkJBNBAAAAAAAHFKDkJCQkJCQkJCLWx8kjZCQkJCQkJCQWwMAAAAAElKOkJCQkJCQkJCQkJCQjUNCkJCQkJCQkHgOAAAAACh8kJCQkJCQkJCQkJCQkJCQkFx6kJCQkJCPKgAAAAA0jZCQkJCQkJCQkJCQkJCQkJCQkIaQkJCQkGQDAAAAMo2QkJCQkJCQkH9gVE9Ybo2QkJCQkJCQkJCQKgAAACCLkJCQkJCQj2EmAwAAAAAAETl/kJCQkJCQkH0HAAALcpCQkJCQkH0sAgAAAAAAAgQAAA9WkJCQkJCQVQAAAD+QkJCQkJBwFwAAAAMiRWl+gXZXLwpOkJCQkJA4AAANg5CQkJCQchQAAAAoaI+QkJCQkJCQcSpqkJCQkCkAADaQkJCQkIwfAAAGRo+QkJCQkJCQkJCQjEqQkJCQIwAAXpCQkJCQSgAACVmQkJCQkJCQkJCQkJCQiImQkJAlAAWIkJCQkIsWAAFMkJCQkJCQkJCQkJCQkJCQkJCQkDAAGZCQkJCQYwAALY+QkJCQkJB5RDYwPGWQkJCQkJCQRwAgkJCQkJBBAAd0kJCQkJCKOwYAAQgNDC6IkJCQkJB1BSGQkJCQkDUAKZCQkJCQhiYABzdmhI6JZ0mPkJCQkJAtGpCQkJCQMQBNkJCQkJA3ABhrkJCQkJCQi4WQkJCQkHEPiZCQkJA6AG2QkJCQbAMVd5CQkJCQkJCQkJCQkJCQkFFdkJCQkFgCe5CQkJA8AlqQkJCQkJCQkJCQkJCQkJCQkGOQkJCQhA51kJCQkCgdj5CQkJCQkJCQkJCQkJCQkJCQj5CQkJCQRFyQkJCQJz6QkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCMV5CQkJA9UpCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCCjpCQkHFLkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkGuQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" />',
			title: 'Put Jquery to this site in this session.',
			name: 'Get jQuery'
		},
		debug: {
			action: function(){debug();},
			picSrc: '<img class="ui-icon" alt="" src="data:image/x-icon;base64,AAABAAEAICAAAAEAGACoDAAAFgAAACgAAAAgAAAAQAAAAAEAGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD9//z///7/+/3//P///f/6///4///9//7///7//v7//v///f///v/7/v/z///v///1//b6//v/+v//+v///P/2//zv//X2//f///z9+f77/f//+///+///+//6///q//z7//v0//zx//70/Pv//v///f/5+/v///////7///79//77/f3//v///P///v/z/f37//z///7//f//+////v/7/vz///v///n9//77/v/9/P/////9//X7//T9//f///z1//jR9emZzsHS+fHy//3//f///f///v/9///7///6//3///z///z//Pr//Pv7//7/+////v///v39/vz//P7//P///f///fj2/Pf7/v/7+P/9//ji/dKavIbk8dH//fft//mKvq1fqpWHyLjo//z++fr//P/3+v/0///6//////z///n4/PH2//j1//j4//v//f/y/frr//ny//n//f//+f//+P7///v7//v++v//+v/0//OCrW5JeSqBl2b///jq//mAwaxOqpFuvKXq//v//v///P/0/v/w///5+/v//vf3/u/o//Sn1sCWvqzr//b4//eXuqyh1cPg//X3/fj/+////f/0//f+//j/+v//+P/x//Jxol5Igil3mmH3//Xy//mL071Br5Jfs5rx//j/+vv/+//1/f/1/v////70//e77tNdp4VOlHV3qZHm//ft//RvoIpEiW5ZnHy+5s3v/vb7///7/////v3/+v//+v/0//JRh0I/gCqEr3zz//7///yk5NFCuZpOsJLE5tX///v/+/37/v/7/f7z//qg2cBAo3s7pHlLl3WArpfo//fl//B8qpNDjmg7mWI9kVqj1bP2//r/+v///P/9+vz5//nE475FhDxAhjms1a/2/P///P/V/fJSt51DtJNpup/W/e70//74/P30//6s2MdKpIEyqno1pXZMmnWDsZrp//Xu//h/qZJEk2cvnVUvoFBGk1qzzbv//P///f/0//nX/9xdmV1Bhj1Tj0/l/+b9/P//+v/0//+l4c9Gt5Y0t5JYvKDD9Obk//i97uBVqY05pXs3qnk9qnxDnXl4sJns//jx//l5p5BHm2swn1UvoU07mFNVj2zJ59zu//vF7tJVm2Y5jEhEhUes0KT6//X9///x///3+frx//uJ178zs5A7uZZYrpZ9wq5fuqA1qYQ9tIc8rHw1pXY8oHx2tqDs//vo//h2rZJGmWw3nF42oFk7nVs9kmBboX1tqohHjF89jFNCilWOu5T4//L8//b7//vm/P/9/v///vvq//aY4cdZuZtHq49Ir5M7sI8usIczs4Qyr340q35Bp4Rzsp7n//nX//RzrpJMm3I+nWs2nGU1mGA7mGE1kVw3kVxAkl5XkWiqy7Dy//X5+/z///////v0/v/8/f//+fn///n2//jM/emK3sVEtZQ4tpI1sooxsIMvsYIysIZApYV3tKDq//zY//d0sZVNnHU5m204nm88mmtAl2VBnGU8l2CFyp/Y99z///n//P///P/+/P///f///v/9///7//7///z7//fr//e6/ehLtZg4tJA8s41Bsow3r4YxroY4pYV5uqXq//nh//V4tZtGn3g0nm86oHBDnnFAlGo/kmVNlWrK/djz//T9/vX///v////6/f/7/f/k8vDO5eHD5d7A6eG14NWo282J1sFGtJg7uZY+tJFKso9Br4s0sIw0qYhyvKTl//Xo//N0spo+oHw4qXc6oGk/m2xDnHU9kmxMk2uDuZSo0LSry7KtyK6ux6utx7XG5d6V1seP0sOF0MJ5zL1pxbRTuKNEtp40uJoxuZc7s5RGs5NBtJMwso8yq4lqt5zm//Xk//FpqpQ+noA2qHk2pmw4oGs+n3c1mHA2lmdDnGpDkGRGi2BQlF9NklVDiFVOk26A7NVt2cNu2cZn08Ff1cJCyLEqwqUkwJ4su5o7upo8tJUztpUrtZM5sY9hq5HR+OLF/9pZnYRKpI0xpHkxq284qXA2nXAwn3MkomcmoWExmmE5lFw6mFEzm0gvlUhiwYT//Pz3//32//7//f3/+/zv/vqS4M9Dt6BEuqFGtp4+t5stupkjtpQmuJUktJEqvpoovZwlqokyrIguqYEso3ZApndQo3ZInXE/mnN6wabs//j/+vf//f/9///3+/z//f77///x//v2//7/+/v//f7x//6Y49NZ0bk8vaI/uqA+tZlBtJlOtZpVrpRZqpFXqI9TqZFZo4teo4hVpINOqYJBo3c4n3I1pXY5oXh+xKbx//f///v/+/rz/vz2///+/f/x///z//78/v7//v7///7Z+vOK18ln1sBf1L1Nu6NVt59yxK6U07+y3MvR7t7Y7+DN797N69jB3cmjyrB/uptTpoA8pn0upHk1onxgqIrV8d77//T///v2//72///4/f/t//39/////f/+/Pzl/vqf2c6J1siD0sSJ0sKq6NrF//HI//LN//nR//jW//Hi//LW//PS/+3X/+/b//DZ//DE/+Wa4sRgsJFJnHxMmntkoYXO9N76//j//vr//v/5/f/2/////f7//f/w/vyl3tWX49eQ0sbH8Ojq//vv//zb/fKr5tdwyLFSuqFSt51Xr5dOtZlMtJVRtpZqw6KQ2LrO/+3k//Xp//Oq075RnX46nHhks5Ln/+///fn/+f39/P/7/////v/+/v7O9O6V39OP2c3I8er2//z9//7k9u+mzsOM0L9s0LpEwqU3u503t5ovtpYptI8zt5I7tI5Gro1cpo7U9+n8/vj6//ee2L84pX8wm3Sp3sP///j//f//+//5//79///t/vu46+Oa4tas49rs/fr////r/Pi049qO0cKL1sZ71sFm0rtWzrVBvKI9uJw7upoztI82s4w6sI1LsZVzsqLu//v///vh//BbspE3ontmsZHs//T///7//P/6///4///l/vqw4dmp4tnL7+n6///9///i//2V18uI2cqG1sWC0sF908Fvzrlx071jxLBTu6JFtJRBtZA9tI46rI5Rp5XY//r6///0//ug2MFMooBPnn3T/un0//r////////4///d9vK3492z4dve+/j2/v36///d+/ag3dOP3tCE18iG18iD1cOA0sB7zbtyzL9wz7thxalXwZ1JupU+rI9SqJbO+vT1/v/6//7M8+NZnoNSnH606NHv//f///z//f/4///W+PK16OC25N7m//72///4///r//6r3NST28+M4dKD28uF2MmI2MeE0sFw0sZzz751zbVqzqtdy6daxaVqs6Pf/vv9/f/5/v/a/fNfo4xVn4Wf18Dt//b///v//P/2///J9e6w6eC55d/s///4///6///v///C7OWc3tOO3tGK3c6K2cuL1siJ1shv0MZ8zsGBzrl60bVkzKtqy7Cf3M7v//7/+//8/f/k//5srJlXooyY077t//j///f//P/0///Q+fLD7+jO7Of2///7///6///x//3h//q97OSi39Wa3tOU2s2P2syI2cp608mF1MeIz76Bz7eB1LuZ3Mfd//b5/f7/+//9/v/m/fmRwbV4tKKw4dHv//n///v//v/4///w//7t+/n1+/r9///6///6/v/////9///v/fvR8+206eCY3dCS49SE3c2F28+H2cyI1sWX28rE8+Po/fT///7//f///f/7///2///n+PTW8ejn//n2//z///z9///9/////////v///v/+/v76///7/////f///P///f/1//7V+/Wh3tSO3c+I4NCG28yH2MmR1snG9ezz//7//f//+////f/+/v76///8//3///7+//39//7+/v7//v/9//7///7//v///f7//v/8/Pz7/////////P3//f///f/9///t///D7OWl39Sg4taP4M2h3tDB49z0////+///9/3//f///f7+/Pv9//79//7//fz//v///v///f//+/7//v39//75//74///7///////////+/v79///9///9///9///5//7s//zU9O+96N+n7trI7uL///7/+v///P/0///y///6//////7///z5//r4//77////+/3//f///f8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==" />',
			title: 'Open F12 before you use this. Creates a break-point.',
			name: 'Debug'
		},
		colorizeToday: {
			action: function(){colorizeToday();},
			picSrc: '<img class="ui-icon" alt="" src="data:image/x-icon;base64,AAABAAEAICAAAAEAGACoDAAAFgAAACgAAAAgAAAAQAAAAAEAGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD7//v9//z9///7///7//////////77//z5/vz///7//v///v70///t///0/////v///f//+v///f/7+v///f///v///vr///v9//76///2///2///4//76//77///9///7//79///9/////v///v///v/////9///9///////++fr9+/r1+Pb3/Pv7+vz/+v//+/39+/r6+/f7/Pj19vT///7///z++/f//v/9/f/7/v/7///9/////////v///v///f///f///f///P///P///f///v///v///v/4+vs4PzwSFhEUDwwXCwsXDA4QCg8ICxAMDw0LEQYPEwgbGBM6NTL++fb//v///P///f///v///v///v///v///v///v///f///P///f///P///f///v///v///f///v/4/fz0//7s9vDJxsI+MjIQCgsKDg8HCxYGCg81ODa8vLb/+vf/+/r//f///f///f///f///v///v///v7///z///z///v///7//v7///z///z///7///7//////v///Pv7//7z/vv4//75+vi/ursVFxcHEhANExoNDhi4tL///f///v///v///P/5/P/7///9//7//v///f///v////v///v///76//j9//n///n7//v4//v4//z9//z///v///v9/Pj///7//f///v/l5OYdIB4dIRwZIhgcHSH88///+f///v///v/7/f/4/v/4//76//z7/v/9/P///f////79///9/v/4//j4//n4//n4//v4//z6//77//z9//v///j///v/+vz/+f///P/39vopJyYlIhokKxYwMSj/+f7//f//+/z9///3///2///4//74//z6///6///7/v/9/////v///f////79//74//z6//7////////9///6//79//z///z//P7/+///+f/19Pg1NDAzMScvMiM6OS//+/j//v///v/5/v36//76//79///9//76//n4//v4///7/v////7///j/+f/++/3z//zz//v6//v/+/3//f/7/P/7///9///////9/P/9/v/19/g3OjgzNzE4NDlDQDz///f////9/f/9//////z//v///P///v/7//v0//7v+//09//++/////T/+f/v///G++ev99nH/+ns//z//f//+v/9/f/2///4//75/vz9///0+Pk7QD85Pj09N0pHQ0j9//f9//v7///9//////z//f//+f//+f/y9f/Q2f6Xn+Ken+na1//6+f/d//+s7dh88cBg/rxm+b+n+tr4/v3/9///+v/z///2//n///j///z0+PlER0tLREtEQVBNS1H8//r6//b7//f9//v///7//f///P//+P/W0/9fYc1WVuhWU+VlYdLT0P+3//OC7sNY/7Qk/6kj/61y+MTy//j/+P//+//z//z6//j///b///vy+vpMT1dYSlZMTVFTUlv+/f/9//f7//H7//j//v///f////z69f+jn/hYUfhIQ/9KR/9RUfGQj/+v/+x/8L5Y/7Qg/6gb/6tt+sHv//b/+f///P/z//v7//j///f///zq+ftOWF9ZUVtTVVVdWWX/+f////z7//T5//r9/P///f////n39/+gnvdUTvlDQP9GR/9PUvGNj//P//Sg8Mtz9bZP/7NP/beV+9Lw//X/+/7///72//v6//j///z//v/q+ftWZGNbXV1cXl5lYW3/+P///f/9//v4/v36/f///v////v7/v/T1v9fYddVWPBUWOdiZdLO0f/0/v7i//i0+9qb9cqv/9za//b3/////v////77//v+//3//f//+//59/1pbWhna19jaWRvbWz//f7//f/9///3///4///6/f///P7////1+//W4P+epuyhpO7c2v/7+P//+P/z+v3l//rp//f3//r9/P/7/f/1+//7//////z//v//+v//9///9f59cWtzdWFqc2Z0eGX///T///v//v/3//72//76/f//+/////7///L1//bu9//18///+////+v9+f/b/+WM9pl37H+h9aPo/+X7//j//P//+v/++v/8//r9//j///v/+/1+enlyenB5fGx2fXb2+//4+P/9/f/9//j+//L//v//+P//+///+f/syPTIfd/Neuftuvb//f3r/+eU15RcymBV1FlgzWGe4Jny/+z//f7/+v///f/6//z6//v////89fx+fX97gn15hHSFhoL/+///+f/8+//3/vv7//v///v//v//9//30P+jYLyuVsy0XM6mYbj1wv/L/8NyxGtf01pP30pM2kdox2bn/+b//P//+f/////2//n3//77/v/4+P6EiImCh4h7iX2Pioz/9v///P////74/f/4/P/2/vf7//j/9v/Ql+ywUNy6T+W0UdWyWc7bg/XO/9BzxG9b0VBJ5DxL40RrzG7m//H/9v//+v/6//v4//n8/v7//f/5+fmAhIV4e4N7gn+Jgon/9/////7///v8/v/9/P/2///t//H6/v/Wqu2uUda6Suy0TN+vV83gkPXl//ab2J5n0WBS2EhVz1Oj5qn1/fz/8///+//y/vj7//n///v//Pr+9/R9e3t1dnp9eX97eX/8/v/7//76+/n//v///v/0/Pvx//n0//f/7f+ucMSsVNapU9epbMT/2//6/P/f/+Ss962X7Jq09Ljw/+b//+z///T///76/v////z///f///j/+vt5dHV4dXF3bXlzeHf2//z4/f7//P///f/9//f///v//f//+P//8///7f/dtPfWqfL/6P//9vr//P32//fo//Ds//Xq+ODe5rG/zH7Dzojr683//vv///7///n///769/9uam9sbWNsZWxudW72//j6/v//+f/++f////v/9PHVn7a8cZ/Cg6/tzun/+v///P///f///P7///P+/v77+///+fqblG2cokupukeqt1Gxr2798tb///n2///z/f/09/9laGxhZ2ZrZmhjZ2L5//r7//77+f//+///9P/Gl62wVYa/SJanPZB5PG7/9/r7//H///j/+f////X/+v//9v////ejoWCQliu2vkm0t0q0sFfe3Kb///T5+//9+v//+/heYV9SXWVeXFtqZGn/+//6+Pf///z/+v//7/+gX421UZO/P5ioKIeEK3Dvz+L///f9//f/+v////7+9//8+f////KZnWKDgie+t1C3skywsVvZ3an///H/8PX5zsv10cFlV0tUW15VWFZpWGP/3fHmw9Hoz9P/9///8/+hZ5elTpK7TJ6MFmd/J2P/3ff6/fv7//z//f///P/9/v/4///6//+OiniAcj6cjjyzsFuutnr6+d3/697LgHLLbVbDc1pxRC9hUUBNUlFhQE6nW3qoS3KcUHC8j6D/9Pzmx9yWXIyIMnJ1HliNVHP/+f32//z6//7//P////73//X4//z2+f+NgIhnUT9uXi+BhVTBzrb47eXcno7dbEvtaUTcbE6EOx18TixVS1FcLDi2TW7USH7CQXqdUnLeyMrZ086Zfo5mM1hkNlOJeHz7//f2//f6//7/+f/3//b6//j8//r///uOg39VQj1SR0M3Pz83RURXST2DPCGwOBS+ORSnNhWPORuCPRxWPkZZIS6DFzScCjqXCkN0GUBUND9HRT1HQTxSQ0dLQUdwdnH2//T7//f9/P79+//6//77//////v//+6Pi3JEPDUwLkIvOFMuOkBGOih2PySMMRaaNRyLNBl5Mxt1OSlPND1aKTduGjKBFDR7EjNfFzVTMUJBOj08PTQ5PjUxODN3f37//////v/9+vz6/v/6+v/4+f////7///H8/uj7//T0/P/t+f/z/P/++/P/+e7kt6yxem2/i3vzz8X/+PT//f//6/XQnK2lbHuvgovx193/9fv+9/78+P37/P/4+//z9/j///7+/Pv//fz//v//9f/6+v/6/v////7///z6//j2//L1//L7///7/P/4+v///v7//vj/+PT//v74///s//7//f//9///+P////v0//j1//f//v//+P//9v//+f///v/4//b6//f///v/+/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==" />',
			title: 'Give today a color in each table.',
			name: 'Color today'
		},
		findAndColor: {
			action: function(){findAndColor();},
			picSrc: '<img class="ui-icon" alt="" src="data:image/x-icon;base64,AAABAAEAICAAAAEAGACoDAAAFgAAACgAAAAgAAAAQAAAAAEAGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD//f7/+f//+P//+/////j///b//P//+//5/v3z/+/j/9On2Yt8vVpSojE1jRgrgxEoiQsojxZAoDVzu2Gt1pPt/9f2//L6///8+////f/5//7y//32///7/v/8//37//f4//z//Pn//P/9/P/x/f/6/v////j//+zd9ctuqm03gS83gRsygw4mhwkjjQsdhgcciwEikQcfiQcogRQ9fSNKeiiBq2rI9tLe///x/v///vz//vj/+P30+//z///7//jq//v///T///v3+//q/P//////+dbgzYRYfhwohBMfiRAjhQMtjAYljgkZiAIcigIekAElkAApjgMihAglgww0iQ8rgxkfg0eC4tzG+v//+fz//fP//P7v9v/x/f////v0//z6/v/7/f/1/v/8//T/9szgrmLJozOQoBZBjQAmkwEciwEnjAgqigcnhAEtigcpiQYthAQ2iAozjw4kjAMYiwYBgh8yxZ87z99WyerB9f/8/fn//vj//f/6+P7//////vr4+//r+f////L/+7nSoDzdnivcohvNrhV4kAA2iQAbihAchAkzhgI4hwIsgAIxggQ0ghEwfAw0ggA0jgARiBUAmGUh1eEPzPkczPtByeup9P/w//v///T//vv7+v///vn6/P/3/f//9MbkqkDjoBXipBbvqRnuqRK7oBNKfwYYhRgbiQsxigAwiwAbiQUyiAAmhgooiAw2iwAzhgAQfy0mxcMHy/sAyf8A0f8Kyfs9xu28+f/8//L///j2/P////z+/PT//93cqlfonRv0rhXmqxXpoxPyohXUoB13jBIshAgejAAslgAolwUHhQMokQAgkQQajwAjjgAkjBchnnApzeQBxfsAyvkAy/oAy/8cxf9bye3K/f/x//36/P/1/f///+vvyXvkpSvwphLqpwzmqhbhohjnnxveohq9rRpjjAA3kAAdhwUfghQjfRohgQ8phwomjAUOiREAhz8r0coayu8MxvYJzvQAy/QCyv8Nxf8qwv1z1vbd/f///P71+///8snRnTPrqRTvrgvrqQ7joRPfnh3loyLtpxfiqwqlnQNLgQo8jD96r32zwpaKxpCJtm1YizQTejcLr50Nz+0IyP0Vzf8Lx/AGyvIEyf0IzP8Iwv86xPK+8P//+/v///XjvYPdoSbqqQrqrwziphTmoRzpoR3spBftoBTppCXFpkPH35/d/+r4//j/+/jt//7//+///+ag18RQytoey/0Gx/8AxP8Eyf0GxvUIx/gAyv8Ay/8ky/eF1On9/v///MrHmELmpSDtqAvmqBTZoB/ioSDypxX7qRTqnSncpmn/8t31//fx//f///n/+f77//////z//fj2///I9f9gyPMdxv8Ay/8Ay/8IxfgPw/QCyfoA0P8Sz/ZMw9zB+P//5ZDLnS7lpxvwqBTmohnZnyLbpBvzqxH1oxXjoU7/8OTz+v/v///4/+/9//T0//3///X3/vn6////+P7/+v/P9/9Jx+oKzPwAy/8QyPwTwvQIyvoAzP4Izfkxyut46P/xx13SpivbpBnuphjqnxXkpBbgqRLlqRXcmin/4an///js/P/0//7///L8//Tv//7///X3//v0/////f///P70//+U5vIzzOsQyvoOy/4MxfcEx/kAyf8FyP8kzflG1/fotELUoSLcpRrrphvsoBLyqw7qrQnaph7NoU7//+H///L4//H///X///v////5/v///v/+/f/6/f/8/v////z4//zP/v9ZyOIeyfUGzP0Fy/sBwPIHyf8Gx/8VxvkwzvLlrSrhoxXtpxjrox/nnhjyqhDvrAnYoyTdwYH//+/7//X///L///b/+f//+v///f/1+///+////v/8//j6//f6//rl/f930fMdy/YAzvwKzPsOvPAOyf8Ay/8Ix/gkx+7gpRP0qhD6phHuoSLfmSPspRjwqQzcpCfhzZT6//zx///8//v//f//+P//9////f/q/f///f////n///D6/+v///vt+v971v0RzPgA0PsSyvogvvMPx/sA0P4E0vwZwOtyQhhnPQ5lQA5nPw9qPA1wQQ1nQwdXRg6vrI35/Pr6/P/6///5//f3//f0/v/w+P//+v///v///v37/v/5/f7///v6+v+Oo/UZSekAPfkMS+8NRdISTeMERfQFQvYMROmATyltQA1yRQxvQQtuPA52QhNzQhBiPxOdjHH///f7//r9/vr///7//v/9/v/4/f////7///X///j4/P39/f///v/q8/95muoWTOYMRf8SQvgYRucaUfAER/AGSu8ZWPCQaD5uQg1zQwl1RAxwPw9zPhN1PRRvPBt5Vz///+3///T///f/+///9v//+/////n//f78//r5//f+//r//v/9+//b8f86asoTT+kRRf8bQ/8ZQvMXS/YNTfILTucsa/WokV9lRBNuQBB0QBFxQBBsPg9vPRNxPRlhOBjgy7X///X7/f3/+///+v///f/6/fv/9//2/P/z//z///L//fDx9f+dv/8XU9sNS/MURvYaSfkNQPQNRfgWTfQdUuNNgv/QyJlXPhZuQRxzPBFyQRFpQRFoQRVtPhJxQhZ5WDf/9+r9/////P7//fn///v5/v//9v/z+v/u/v3///L///vX5f81ZugGSfoIRfkZTfMLRukFSfoHSP4ZSe8wUtuMqv/28dxeRiptPBR2Owp5RBJnPRBmPhRyQRNyPQpuQxKLclL/+O/++v///P/7/f36//j9/v/z/P/2///1+f/f5v9cfOARTO8ARP8LR/8TSe4IR+sCTP8BR/8aSupBWcnQ2v///f+jiHNvPQl9QQV6RA9oOxBpOhR1Phl5PhF7RQ5rQhFtVUnHvubm5f/z9P///v/v+//6+//48P+1tP5UadwdTOQHR/kER/8NSfsNRO0QSvcDRv8AQ/8cUOp2juD4+P/2/P/z381zRhN5QwZvQAhuQhNvPhhvNhZ4PRV0PQppPBdTM0s1J41AO8Z5dOGil9WSmd6GeclaQKsoH6wXMNoVSf8IRv4IRfkLRPQRSfQPSPcHQ/8KRv8kUeLE2P////Ty//3///WvkHdqQBFuRgxnQAxwRhtqPA1zQgptPRNXLj1FJ4wnFr4ZDs4jFsUvG7QjGLwtF8MuD8QkFM0MGdMaQ/0IQPkNRf4NRfgRSvkJRfcLSPwYS+9wkf7r9f////D2//f4+f3/9vp+XUNlPwloQQ1kPRBySwdxSQBiPBpEI3QnDsIdDN8hE9cgENMcBtoYBNkdDecZCt4fDM0hGMYZLdkTQ/kBQPYMRvkJQfoPSf8PSe5FctvU6P/7+v///f77//n8+f//9v/12891UStsQhhtPxB0RwB0TQBRMDQ3HaYbCOcZCOEhEcIiEsQaCdwgD9QOCtgODdkmFs8vE8AVEsIXPfUITP0ISvcVS/8TQ/kpWNjA4f/9//D///L/+P/7/v///f///P///fzs1MhsRytyPg97Qg5lNSlFJXQpFMQUBN4ZDNQlGMIlFr4dD8klFcAXEscRDsgcC8YtEMseDtEGHN8NRvsKTfAZTuQ5XNy2zP/0/////+D///D/+//z///6/PD///X//P/+9//14c+KYjJnNCBOH2Q9HrskENQcEM4gF8wdE8scDscoFcgnEcMlDcUoEs8lEdUfDNMdD9kNDdUaN+weU99Fd8/E3P/6+P///v7///v///n9//fx//////H//+77+//0+P////b//tmoiYxDJIUvFb8fEsIlHb0ZFbsYEM8gENkiC8sjDtUuCtIxDdElD8wYE8ogGcgjF70lJrZ4kvDL7f/4//X///H/9//99//4/P////D6//77//b///j9/f/9+v/7/P////f5+/za1P94bNAyKqcrJK0lHbcjE8QmEdIjDNMRCs8qEtQxEskqFrwkIa0uLaF1asbb0P/49v/4+/////j//v799v/29v/7/v////j//P/9/v/7//////7/+///+//s/v/s//r3//f49//b1v+alP9vYvRRO9c1G8wkDtIOGswiHcxOOdt4ZfCclv/d3v/69////vb//+7//Pv/9P/69//2/v/6//n+//r/+/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==" />',
			title: 'Find a string and give it a background-color.',
			name: 'Find and Color'
		},
		showHtml: {
			action: function(){showHtml();},
			picSrc: '<img class="ui-icon" alt="" src="data:image/x-icon;base64,AAABAAEAICAAAAEACACoCAAAFgAAACgAAAAgAAAAQAAAAAEACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQEBAAICAgADAwMABAQEAAUFBQAGBgYABwcHAAgICAAJCQkACgoKAAsLCwAMDAwADQ0NAA8PDwAQEBAAERERABISEgATExMAFRUVABcXFwAYGBgAGRkZABoaGgAbGxsAHBwcAB4eHgAfHx8AICAgACEhIQAkJCQAJSUlACgoKAApKSkAKioqAC0tLQAuLi4ALy8vADIyMgA0NDQANzc3ADg4OAA5OTkAOjo6AD4+PgBAQEAAQUFBAElJSQBOTk4AT09PAFBQUABUVFQAVVVVAFhYWABeXl4AYWFhAGRkZABlZWUAZ2dnAGlpaQBqamoAdnZ2AH19fQCDg4MAhISEAIyMjACNjY0Ajo6OAJCQkACSkpIAlJSUAJeXlwCYmJgAm5ubAJ2dnQChoaEApaWlAKampgCnp6cAqampAKqqqgCtra0Arq6uAK+vrwCxsbEAtLS0ALW1tQC3t7cAurq6ALu7uwC8vLwAvr6+AL+/vwDAwMAAwcHBAMTExADFxcUAxsbGAMfHxwDIyMgAysrKAMvLywDNzc0Azs7OAM/PzwDQ0NAA0tLSANnZ2QDa2toA3NzcAN3d3QDg4OAA4eHhAOLi4gDk5OQA5ubmAOrq6gDs7OwA7u7uAPDw8ADx8fEA8vLyAPPz8wD09PQA9fX1APb29gD39/cA+Pj4APn5+QD6+voA+/v7APz8/AD9/f0A/v7+AP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgYOBgIOCf4CBg4CCgH2BgoJ+hYOBgYKAgnxJER1ff4KDf319fn9/fn6AfoCBgIJ+gX59foB/gX58SAcAAhNig4F+f4B9fYGBgn98gYF9fn+Af32AfX6AfkwGAgcCABZjgH+AgYB/f4B+goF+foKDf35+gYN+fn5NBwAFAAEHBB6CgXx8goF9fX5/gYB/f35+gH9/foJ/TgoBBQYBCAIAHYCCf3x/gIGCgn5/fX1/foGAfYR8e1UKBwQAAQICARFef3+CgXyAgnp7fntuZGhxfoCBfH9cCQEAAQMABAIRXX6DeX6CfIF8bD4qBwEHAgAPLEBzWwsFAQQDAAQCEVuBgX9/gIJ/bzkJAgYAAAUCAAMDAw4LBAIEBAIABg9dfn2Dg4R4fVoVBAIFAAgYJSEJAAAACAMBBAAFBwIQYX+BgH1/gIJPBwcACCNLcH+AfHZYNAcCAAgBBgAAEl1/fn6BhIN8WwsCAwpFf36Bf4KCe4B+XSAEAAICBBBlgXuCgnt/f3UbAwULYIB8f31+gH+Bf4J7di4EBAERYXuCfoJ8gIOEPQIEBVR4goKAgYGAf36Ae4J+dCIAAxp3f4B/e4V8f3QOCAE6f4N9fX6BfXyBgYCAgIB+YAQEAEd9fIGCeoOASgUCCnB+f39+gn2DgXyEfYJ7f4F8MAAFK4KAf4CAf4IzBQEyf31/gH9/f39/f39/gHx/gXtSBQEHeHuAgHyAgSIBAUN7g4F9f39/f39/f3+Ahnt+f3IEAgJYg4GAf4GCDQQGVn6AfX5/f39/f39/f3x+g32AfRMDBUx/fn2Cf30DAQRZgoB9gH9/f39/f39/gnx+hH9/GwIATIGCf39/ghEDAFN8gIF/fn+AgH5+f4CBgX1+gnsOAwRQg32AfYGEJAYBP4B+gX1+f4CAfn5/gH5+hHmCbAMEA2Z+e39/gH43AAQsfYF/f4B/f39/f39+g359gnxHBAIQd3+FgIB/gFEDAwJqfn2BgX9+foCAf319fX+AfSYEAjWAfn5/gH6CexoDBS96g3yBgXyAgX6Bf39+fYFJBQQAWHmFfYCAgX+CQwICBkN+fnuAgoB+fn9+gn9+ZhMAAS17g3t8gX19gH19KQAFAkaBgH5+f4CBfXx7fWcUAAYIaYB/gYOAfH+EgX5rFwYCBDZze4F/foKEfn5CCAkCA0p9fn2Cf32BgH+GgHtmEwcCBhI8V3B5dmBAHwQEAANBe4KDfn98gIJ8gIB+fH5tKAMEAQUCBwkGBwEAAgYSUIF8fnx/gX6BgHuEgH+Efnt8RxkFAAIDAwAABgQKOHB8gIF9gYJ/e36Bf4GCgYCBhX6BflI7Jw8EDBwxRG+BgoF+hH+AfoCDg4CBhAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" />',
			title: 'Click on any HTML-element on the page and an alert will show you the HTML-Code of this element.',
			name: 'Show Html'
		},
		eraser: {
			action: function(){eraser();},
			picSrc: '<img class="ui-icon" alt="" src="data:image/x-icon;base64,AAABAAEAICAAAAEAGACoDAAAFgAAACgAAAAgAAAAQAAAAAEAGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/+f/9//jy//Hz//v6+v//+f//+/36//vx///u9//7+////v////X///f6//z4//////z///z///z///z///z///z9//77///6///6///7/v/9/v///v///v///v///v///v/4/vny//r2//z//P3//P///P//+//6///7//n///b///X9//77/v/5+/v//Pf9//79//7///////////7///7///79///7///7/v/7///7///9//7///7//v///v////z4/fz2///6/////v3/+fr/+///+v///f7///X//+7///T//v/49v///f////v4///6///9/v///f///P///f///v////7///79///7///7///7///9//7///z///z++fv///z4//j7/v/69v///P///vz//P7/9f/6+v/3/f/9//v++PP//f///P/3+Pz0///4///7/f//+///+////P///v////n///j///n9///7/v/7/f/7///9//v9//f/+v/6+fX9//j5/P/89////f/+//r0+//I0v+AjN7Az//v+P////7//f3//f/7///4/v/6/f/7/v///v///f///f///v////n///f///j///79/P/7/P/7/v/7//z7//j/+f/9///4//r8/fn//v7//P3q+P+YuPo8ZNs1WuAqSayYsObs9//49////f////T//P///v////////z///z///z///7///7///z///z///7//////v/7/v/7///6////+P/7/f/4//////f//vP4+f+QqPQ2ZuomYvwsYe0vWsclSaFykt3c7//9+v////T///z///z///z///v9//n7//n9//z//v///P///P///v////v///n///z7/v/7+/////z////8/v76//7s9/+EleQ/Xeo0ZP8zbPdPhPOAq/9MdekhTrdSdMDc4v//9P////L///f///z////9//77//z7//z9/////P//+////f////v///j///v//v/9+/////f/+/f9/P/f8P9sjN9FavRBaP9HbfVulfeLsP9Sdeo8YOlehv01V7RIXa67v/////j///z8/Pz//v/9/f/8/f/9/////v///f///P7//v////7///v//vr///7///////j/+//Z4f9ngNxHbvJEcP9QdvKJp/+Sqv5uh+9Sb/UtS98iQMdae/BIZtchP7WorNXt8//2/P/3/P3+/v7//P//+///+v///v////v+//r+//3+/v7///////v///f5+v/Q2/9ieOJRbvlXeP1mh+iYuP+En/BngvFTb/lEZfg4XPAoSuMSMsdBZOlTe+szO6Z2gtDe7v/s+v/7//v///z/+P//+v///f////z9//n6//j9//z///7///z//vnf6/9le9NPcPtYef9vifOpwf2Dndlsi/JSdv9Bav8zX/I8a/wzYf8nUfcVPMcmTLhmd/81R8JWabrT5P/v+v/8//v///v//v//+////v/7///6//z7//n+//r//v3//v/Y6f9lftxefv1xk/+du/96ld90kvFYf/83af8pYPc3b/w3cv41cf84cP85aPIoUc8UOdFNbP1OZeM/UK26x/vv+v/5//r///j+/v7++v/7+f/6/f/9//7+//r///v///7o9P+Uo+h/mPaIq/9okvNokP9Vff81ZPYwa/Y1dvo3ePw2d/s7fvs9gvs8evw5cf8iWeARPcwxUuVofP86Sa+XqOHs+//y/v76///9/P/9+P/9+f///v////79/vr///z7/ffg6P+Ln+x0l/5mkv9MfP82Zfc8cf82d/c8g/w1fvg+hP9Djf1AjPY7iP0+hv9Ihf8xae4ZRdQkRtZie/9IWsVygcrh6//v9v/9/v///v//+/7//v///v/8/v78//3//9v2+f+EluNpi/9HdPQ8be9CdPw+eP88gf85hvtCjf9Ci/9CjPxDk/5BlP88j/9LiP9FgP5GffwpWN8gQtFUafRncedeY7La3v/5+/v///T///P//vv//f/8/P/7/v////H2/P+rvfxQcOFBbv89df9Aff9Ih/VTku5WlO5XlvhVlP9RlP9Plf9QmP9Pmf9Qkf1JmvVAletGg/FGZPgsQ+woTvBSfP85VrG6xvD2/f/6//f3//36/P///P//+/v///j3/f/k7f+itflkhOVNeu1Ukf9Jj/9KlP5Sm/1Znfxfn/1iov9coP9UnP9VoP9Tmv9Tnv9JmP9DjP9Kgf9NcPY+XN8rT9lUe/tQareTmKH//+v///b4+P/5+P////T9//79///7/v/v9f/Y6f+VtfZiletSlPpSnP9Tn/9eqP9orfxnq/RorPlnrf9fp/9ZoP9em/tdmP9Plf9Kkf9ZjfdYffE1YvkXTu9QdNiNgIKmfUz/9dz7+//4/P////H//v3///n///j9//v0///l+P/E4f+PuPdwpPBurf1pr/xlr/dqtfpstPporfZqrfhmqf9yovR8o/JupPtZn/1WmP5QjP84e/8vb/9bcr2AWDzspVWxhUri4NX0+v////z//vv///z9//v4//b5//j6//74/v/w+v/O4/+ewvB8su50uPtuuf5rtf1vtP1vsfhwrP57rPqAq/R1qPFrp/lmpv9dnv9TlP9gkNiQjpS2fDrJexHVo0PGuIP///X/+P///f///v/9//79//z///n///j///b///z9/f/s+P/B3f+Xw/KCuvV6uP5xtP9wsv9zrPdsq/9lqf9rrf+CufySvOmQscuPp6eHjWqdgz3CiSbcliDLjxe8mT/968b//P/7/P/9/f///fz//vn///n///r//fr//v///f/7/P/2/f/m+P+72vuSvPF+svh6tf94svpqrf9kr/98u/+fxde6wZa/rVS4miTAmxu5jg/DjRHPigvimRnHjyTSuHz//+/8+//+/f////z///n//fj////9/P/5+f/7/f///v////z8//3z/v/f9P+w0P+Kr+18sPaLt+2gvtmquKyvq2rErDDgswvpsgDhqADXnADUjwLZhwPVhAvDiSmokFT//+T//f////7///z9//z7//76///6/f/7/P/9/f////////v///v6//72/f/u9//m8f+gyP2fpqm8m1zRny/erSHcsQ7asgDjtgDZpQDbmgDfjQDehw/CehyacC+zp3///+r//v/////7///2///2///4///9//7///7//v3///79//77//77//79//7//v3//Pvk/P/47NTgrFnclhPdoQjSpQfPrA/CnwnHnA/FkBG8exLDhTfqv4z/+N3///X9/vX//v/9/v/6///4///6//77//v///n///n///r///7//v/9///+/v7///z///n///f5//f///b//+n/7K/Oq0S5kxfAlxy2jyOjgiXHq2T647X//+z///j++vn//P7//f/6/v/7/v/9/v///v////79//z9//v9//v///z//v///f///P///P///v3///v///j///T3+//t9//z/P///+L/5JrWrlzvyYj//9b//+v7///0/f/y+//6/////f//9//9//7//////f///f///f/9///7//76//77//7//v//+///+v//+////v////z9//j/+/z6+v/x+f/w+v////7///D//+j//+n///b9/v/9+//7/f/2/v31//n+/v7/+/////n///z//v///P//+//9/f/9///9//79//79/////f//+////P///v////z///n/+v////z///T///b//f/99v/6/P/0/v/z/f///f///f///Pb///f9//v8/v7//f/9//v9//z//////v///f///f///v///v/////8/v77///7///7//////////////7//f////X///L///j/+v/89//2/P/z/f/2/f/7/f7///f///f//vz//f/7/f72//v2///4///9//z///v///v//v7//f///f/////9//z6//v6//n7//n8//3//f///P////L4//vn/f/t/P/6+////v////v//v/+/P/2///x//v3//3/9///9////f/u//YAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==" />',
			title: 'Kill this page slowly. Good stuff when you are frustrated from your CRM.',
			name: 'Eraser'
		},
		scramble: {
			action: function(){scramble();},
			picSrc: '<img class="ui-icon" alt="" src="data:image/x-icon;base64,AAABAAEAICAAAAEACACoCAAAFgAAACgAAAAgAAAAQAAAAAEACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAkJCQAJSQlACYlJAAlJSUAJiYmACYnJwAnJycAKScnACgoKAApKSkAKioqACsrKwAnLCsALCwsAC0tLQAvLy8AMDAwAC8xMQAxMTEAMjIyADMzMwA0NDQANzc3ADg4OAA8PDwAQEBAAEVFRQBGRkYAR0dHAFFRUQBSUlIAWVhYAFlYWQBcXFwAX19fAGloaQBpaWkAhYWFAIqKigCMjIwAj4+PAI+QjwCQkJAAl5eXAJuamwClpaUAp6urAFe+ogBWv6AAXb6iAFq/oABVv6IAYb2mAFe/owBav6IAWL+jAFfAoABcv6IAWMCgAFbAoQBXwKEAXr+iAFrAoABYwKEAWcChAFfAogBawKEAVsGfAFjAogBbwKEAVsCjAFnAogBXwKMAXr+kAFrAogBcv6UAX7+kAFfBoABgv6QAV8CkAFbBoQBZwaAAV8GhAFjBoQBZwaEAXsCjAF3ApABkv6UAXMGiAGDApQBiwKUAZb+oAFvBpgBlwKYAX8GlALS0tABfwqQAYMGoAGTBqAC1tbUAYMOkAGjBqQBjwqgAZcKoAGXDpQBhwqoAY8OmAGjCqAC2trYAZcOnAGXDqABixKgAaMOtAG7EqgBtx6wAvLy8AHDIrwB1yLIAd8izAMPDwwCAzrcAx8fHAJHRvQDKysoAy8vLAM/PzwDQ0NAA0dHRANLS0gCr284Aod3MAJ/dzwCp3c0Aq9zQAKvdzwCo3s4A1tfXAKrfzgCu39EArt/SALDg0gDe3t4Av+PbAN/f3wDA5doAw+fcAODj4ADE598Ax+ndAOXl5QDm5uYA5+fnAOnp6QDW7eUA0O7kAOrq6gDS7ukA6+vrANPv5wDR7+gA0u/oANLv6QDT8OgA1/DpAO3t7QDW8OsA2PDrANbw7ADc8OsA7u7uANjx7ADd8uoA5/bwAOz28wDo9/UA7ff0AO739ADs9/UA9vb2AOz49gD39/cA8Pj3APj4+ADy+fkA+Pn5APn5+QDv+/cA+fr6APr6+gDy/PcA8/z4APn7+gD1/PkA+/v7APv7/AD2/PwA9P36APf9+QD2/foA9f37APz8/AD9/PwA/Pz9APb9/AD5/fsA9/38APj9/AD7/fsA9f77APr9/QD3/vsA/P39AP39/QD8/f4A/f3+AP79/gD//f4A+/79AP3+/QD9/v4A/v7+AP/+/gD5//0A/v7/AP/+/wD5//4A+v/+APv//gD8//4A/f/+AP7//gD8//8A///+AP3//wD+//8A////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr3Ovr6+vr6+vr6+vr6+vr6+jh4t7k4Ovr6+vr6+vr6+vU1NTr6+vr6+vr6+vr6+vrq0tMSnKh3evr6+vr6+vr3Ovc3NTr6+vr6+vr6+vr6+vZhUc8UG6c4Ovr6+vr69zBsrK0trzI1Ovr6+vr6+fl487Eg0BASGug1+vr6+vr3F8DBAAGDR4tvNzr6+rns4F2YVxaVEA3RmKf1+vr69zUYwYECQQEBgQdltPc1ZNmO0RAQDw/Pz8/OGqt6+vc3NxfBAgGBgYGCAQamL+GLzBUVFNNTU1NTU0/b7Hr69zU1GwKCwsJAwoDBgQgsHFFNjwyWDkxPz9BPGmj2+vryNzc1MHc1NSNIQQEBAEplE81ZIuvvYJRUTNlpdjn6+vc3NzI3MjI1NS0IgMGBwyIemae2syHPkJAZ6bb6evr6+vr69zU1Nzc3NSdGAYGBh+smcncqDROVnSn3+rr6+vr6+vr6+vc1NzcyOtzAAMIBS7U39zKt8C+zN/p6+vr6+vr6+vr6+vryMjCjqojAgMDF5vc1Na4ubu829zr6+vr6+vr6+vr6+vr65pdeJIRAwADJLzIfw0KCxl81Mjr6+vr6+vr6+nm5dqibVI/kCwGCAMDK8jBJwYGCBN81NTc3Ovr6+rny9C6il5ROkJwtR4DBggEJam5JggGBBB81NTU1Ovr6cNbYFVAQ0BTMozUjxIABAgGCAoOAwQDCQ97yNzc6+vgy0pNTU1NUD2Jz9HIdw0GAwMECQMGCAgGBhCV1Ovr6+DNSjw8PDxokdvn6uvceRYGBggECAYGBggDEpfc6+vr38VXSVl1hK7c6evr6+vrpCgcDgsJBAYEBhR93Ovr6+vn5sfG0uPn6urq6+vr6+vr6+u8tCYIBgYVftTc6+vr6+vr6+vr6uvq6uvr6+vr6+vr69wqAAMJFH7U1Ovr6+vr6+vr6+vr6+vr6+vr6+vr6+vrgAkJCxt/wdTr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vcucHB3Nzr3Ovr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" />',
			title: 'Fun Stuff. Shuffle the characters on the page.',
			name: 'Shuffle'
		},
		close: {
			action: function(){close();},
			picSrc: '<img class="ui-icon" alt="" src="data:image/x-icon;base64,AAABAAEAICAAAAEAGACoDAAAFgAAACgAAAAgAAAAQAAAAAEAGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD//vn59v/x+f/4//79/+L//+v3/vv6/P///fj///L7//by/v/2/////v7/+v//+P///fj///n+/vj4/fz7//////7///v5+/v2/f/8//3///L//+n6//Ds//P2//7///7/+vz///v9///r9P/g6f3X2ePW1Mzd2tLa2N7c2+Xi4+Hg49Tl6+Do7O3k4+3x6fPv6uvu6+3u6+3t7uzr7Oro6e3o6e3o7Ofk69zd4Nfd2eTV0e7V2PTj6/jy+Pf///n//f////H//+3q8P+Un9tcXpTKwNDVycfMytbJy+PW1Nrh3cvj49HZ397g5uvi4uLp6Orj4uvm4+zp5eTn5ODg3+jc3ujf5tng48nX19ezr+o/OZhPSpXe2fj7+Pr///z///////j///j5+//p7/9WWJ5YVJbo3v/58//18/n79/3/+/359PH8//b0/PL1//n4/fv1+Pz7+f/++fj//fz7+//1+fr4/e729+3j3/8/OaYNBoVybbz28/////z9+f/9//v5+///+/////j9+/vQ1P8uNZxMTa/o5P///v///f/6+P//+/////j8//L0//z6//v8//v///v//fz//v///f////v////y8/9lZMIRDJEmJpLj5/////j///b/+v/7//z5+///+/////j///Ty9/+QnvAeK5lTVa3t6f/6+P/8/P/9/P////7///z3/Pr7/v////v///f7//n//v//+/z//P/y7v94etISGJUPEoWytfL0+v/9//L///j//P/5/v/9//z//vv//P///P/+/P/p9P9kc8IVI5tKULvg4/////z///f5/P/6+f////7/+////f3///v9//v9//z//f/37P+knvUdI6IGE41mcLb0+v/9//78//36/fv///j8+/////b///X9/P/89///+/////zd5v8+T70SIqpOVrTe4f/3/P36///7+////v7//f//+P///f/+//3+//j29v+6tf8qKKoMEJ4uOpjk7//5//r//v/9+v/9/f////T//v////z7//z6///9/P///P///f/7+v+3wvwuPKwhLLJES7jU2P/4/v/6/Pb///7///f//v/++v////z4+vvQ1v8wNagOE6waG5u6vvnz+f79//v9/f//+v/++v////n///v9/P/6/P/9//7///j/////+////P/++f+Wl9suNcIfJcw+QrjU1//5/v/3//////P///j9//f9///h4/9JTrEXILcSGqp2d8/y8f////z2+/n3+/z///////7//v37//v7/v/9/P////7///f9//v///////z/+/z47/9tatcvMdMsL81ER7PFy//t9f////79//f6//jo7P9qackfHroTFrg4P6zh5v////78/vj9///9//////v///v//f72//z7//v///7//v/9//////v///X///j//f//+f/d2P9hXcc1NNAzNNg3O7K0uv/0+P/2/P/u9v+Bg9slIMMbE8sqJ6zAxfz2///5//f8//v//////P3/+/z//////v76//z7//f7//f7////+////f////n///v///77/Pj//v/JxfZXUc45NeI5Ot46P8Ohqune4/+XlvI1MM8cEtsoIMeCf871+//2//T4///9/////fz//v//+//9+//8/P////v7//n4//v7////+///+////f/9///7//j8//D///T49v+koOxST9Q9P+MzOuc/SrphZuE8OtQjG9ooH9pMSL/u8f/7//D9//j4+v/8+P///v3///7//P/5+f/7/v////z////9/f///f///f/9/f/7/v/7//73//T9//f6/vj6/v/w9P+HjdhLUdo3PvMwON8bJNIKEcYfH8szLrPBwP/2/f/7//X///v/+v//+v///f/5+vj7//r7//z6//z///7//P//+f//+f/7/f/2///2//v7//j///v9/v/5+//2/v7x//7Y6P9pdOM5Pu0dIu8OHOYOH9QZI619fNLx8f/z/P/3//3///v//f//+P//+//7//77//X6//H5//P///X///j//vz//f/9+///+////v7///X///j6/P/99///+v////j4//+6wfpfXswlG+QYGtwUJOIYJ+FAQ+Wspf/99P////L//+/2//7u+//z///5//r///r//P3//P///v7////9/////v///f///v////z///z//v/+9///+/////76//vm6v+Rke8xMcFBQv84PfAwN+BITfZRUvZUVdt9ftTu7v/7+//6+/f9//f1//b2///7+///+v///P//+v/9/v/z///4/////v////v6//n4////+///+////vn6//nr9v+WmutDRNIrLt0iK9laYf5iY/NravxdYP9VW/9QV+xcYNHOyv//+f////L8//Hz/vv4/P/79P//+v///f/9///2///0///4///9//n9//X7//z8/f////z///P2+v+nrfhMU948Q/A1P/E9QtNARcl+hPtvdfJjZ/tYXf9PVP9VWPZTVM6fnOvs7v/4///7//f7//b//f//+P/6//n///z9/v/2///z///6//v///n///n9//j7//j6/f+/vPpXVddBSPY6SPo3SOtVVLy2vv9/j+J8ivBqb/RqbP9dYP9TW/VSWvNMUeJkZdfO0v/z+f////X///v99v/2//X9/////P/////6//j6//v//f///v////f2/P/Bxf9fXNdQTfBBRfE+TOw4S+KhoNjn8P/c7f+AjdF+gvhpbvllcvZbbPFPW/VPUv9QUPhPU9Cboerr8P/7/P////j2//j6/v//+////v7///f///v9/f//+///+f/b1v9mZtpFR+tFRe9MS+FKUNdTX+Xz9//6//z7//vf4f93e9R3hP5jevhbcPFgaPdcWvpUVPxJT/ZGTeJnbNPt7////+/2///7/v//+///+////f////v9//z7+//l3P95btxLSeNDSvVDSOpUVdtTU73Gx//7/vz///j///f//P/a4P9ld9Rpff9qdf9qbvVpaupeYvBQV/9ESv9MUueSmdj5//j2///9/////f//+f//+v////f///nt8f98fdhcWeRPT+lJUOdLVuZIUcqfnub78/////v//f//+v///v/z+f/V4P9uc+B3dv90dvpsduhfbetQWf1SVP9OUOtze87s+f/6//7///7//P3//f///P79/f32+v+OlNVbYtVVW+JZYeRXYd1LWdFdacfz9P////T9////+///+v///v////n2+P/p5v98d9OCgPdrc+9ndf1faP9WVv9jYPGDhtvo8v///vr9///7///5/vX9//n0+f+ipOpgY89iauNdZ9xca9lUZcxWZbvR2v/7/f///+z2///6//7///z/+vv//v7///X2+u7t7v+Afc2Bfvlzd/9faP9gYv1vau+em+P3+f///v/6/P36//z7//n4/P+0uPNcX8hxc+9uceRudeJjcNxabMegq9/0+P////v+//vz/f/6//v8//T//v///P////j//+v+//bw6P+XjOJvbd50fPdxefRsbNDi3////fj9/P////n///f5/P/Iy/5XVrKBf+mCguZ2fN1wdt9pb9h1esXx9P/9//z8/fn7/f//+//9/P/9///5/f74///0/Pv9//v///n//f/68v/EwfiEi9B/i83J0v33+f////X4+/////f///Xy8/9hYKRwbMWSjN2MjNKCi9V+h95ycsDm3v/79v/+/v79///9/f//9///+f/8+f/4/v/2///4/v/9+v//9/////r///j3+//y+f/x+f/1///6//r///z///7///r6/fv3+v/h4f+sp9qHgrl1d7Fqc6yGkb3h5f789v///P///P/+/P/9/////f///v///v/8/f/9/v/3+Pz5+v79///5/v37//v9//n///n//vn///7+/v79//////b4/P3z/v/4///+/vj++v/z8v/k5//q8P/y+//6//P///X//v7/+f///P/7//////z///H///D//f//+f///v/9//L3//T0///4/P/6/vn///T//f//9///+f////8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==" />',
			title: 'Close this dialog.',
			name: 'Close'
		}
	};

	var stringHtmlStart = '<li style="font-size: small" id="';
	var stringHtmlEnd = '</li>';

	for (var fnName in configObj) {
		configObj[fnName].html = stringHtmlStart+fnName+'" title="'+configObj[fnName].title+'">'+configObj[fnName].picSrc+configObj[fnName].name+stringHtmlEnd;
	}

	return configObj;
}

function createMenu(configObj) {
	var stringHtmlElement = '<ul id="menu" style="position: absolute;z-index: 1000; -webkit-box-shadow: 2px 2px 5px 2px rgba(0,0,0,.5);box-shadow: 2px 2px 5px 2px rgba(0,0,0,.5);">';
	stringHtmlElement += '<li class="ui-widget-header">Bookmarklets</li>';
	for (var fnName in configObj) {
		if (fnName==='close') {stringHtmlElement += '<li>-</li>';}
		stringHtmlElement += configObj[fnName].html;
		if (fnName==='createWorkingtimeOnIncident') {stringHtmlElement += '<li>-</li>';}
    }
	stringHtmlElement += '</ul>';
	$('body').prepend(stringHtmlElement);
}

function main() {
	close();
	var chosen = '';
	var configObj = createConfigObj();
	createMenu(configObj);
	$('#menu').tooltip({ position: { my: 'left+15 top', at: 'left bottom', collision: 'flipfit' },
						open: function( event, ui ) {$('.ui-tooltip').css('font-size','small');} });
	$('.ui-menu').css('width', '200px');
	$('#menu').menu({
		select: function(event, ui) {
			chosen = ui.item.context.id;
			$('#menu').css('display', 'none');
			if (typeof configObj[chosen] !== 'undefined') {
				configObj[chosen].action();
			} else { window.open('https://bookmarkify.it/'+versionBookmarkify);
			}
		}
	});
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
					if (script.readyState === 'loaded' || script.readyState === 'complete') {
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