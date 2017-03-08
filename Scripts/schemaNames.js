function schemaNames() {
   	var CRMVersion = "nothing found. :(";
    function createTableRowsOfObject( objectToTransform, depth ){
        var j = 0, ret = "", css = ""; maxDepth = 2;
        $.each( objectToTransform, function( index, element ) {
            if ( depth < maxDepth ) {
                css = "style = 'background: ";
                css += ( j++ % 2 === 1 ) ? "white" : "LightSkyBlue";
                css += ";'";
            }
            if ( element !== null && typeof element === "object" && depth < maxDepth + 1 ) {
                element = createTableRowsOfObject( element, depth + 1 );
            }
            ret += "<tr " + css + ">" +
                "<td>" + index + "</td>" +
                "<td>" + element + "</td>" +
            "</tr>";
        } );
        ret = "<table>" + ret + "</table>";
        return ret;
    }

    function rename( a, frame, aIsField ) {
    	var labelElement, valueElement, description;
    	try {
    		labelElement = frame.$( "#" + a.getName() + "_c" )[0];
    	} catch(err) {
    		labelElement = "";
    	}
    	try {
    		valueElement = frame.$( "#" + a.getName() )[0];
    	} catch(err) {
    		valueElement = "";
    	}

		if ( a && a._control && a._control.$38_2 ) {
			CRMVersion = "2015.1";
    	    description = a._control.$0_1.$4_0._jsonWrapper;
    	    if (!labelElement) labelElement = (a._control.$38_2.$O_1) ? a._control.$38_2.$O_1 : a._control.$38_2.$O_2;
            if (!valueElement) valueElement = a._control.$1_0[0];
		} else if ( a && a.$1G_1 && a.$1G_1.$1_0 && a.$3j_2 && a.$3j_2.$R_1 ) {
			CRMVersion = "2015";
			description = a.$1G_1.$1_0._jsonWrapper;
			if (!labelElement) labelElement = a.$3j_2.$R_1[0];
			if (!valueElement) valueElement = a.$1_0[0];
		} else if( a && a.$3L_2 && a.$3L_2.$R_1 && a.$17_1 && a.$17_1.$1_0 ) {
			CRMVersion = "2013";
			description = a.$17_1.$1_0._jsonWrapper;
			if (!labelElement) labelElement = a.$3L_2.$R_1[0];
			if (!valueElement) valueElement = a.$1_0[0];
		} else if( a && a.$1_4 && a.$1_4.$J_2 && a.$1_4.$J_2.$Bj_1 && a.$1_4.$J_2.$Bj_1.$1P_0[a.getName()].$4_2 && a.$1_4.$J_2.$Bj_1.$1P_0[a.getName()].$4_2.$5e_2 ) {
			CRMVersion = "2016 TURBOFORMS";
			description = a.$1_4.$J_2.$Bj_1.$1P_0[a.getName()].$4_2.$5e_2;
		} else if ( a && a.$1_4 && a.$1_4.$J_2 && a.$1_4.$J_2.$Bt_1 && a.$1_4.$J_2.$Bt_1.$1P_0[a.getName()].$4_2 && a.$1_4.$J_2.$Bt_1.$1P_0[a.getName()].$4_2.$5h_2 ) {
			CRMVersion = "2016 TURBOFORMS";
			description = a.$1_4.$J_2.$Bt_1.$1P_0[a.getName()].$4_2.$5h_2;
		} else if ( a && a.$1_3 && a.$1_3.$J_2 && a.$1_3.$J_2.$Bt_1 && a.$1_3.$J_2.$Bt_1.$1P_0[a.getName()].$4_2 && a.$1_3.$J_2.$Bt_1.$1P_0[a.getName()].$4_2.$5h_2 ) {
			CRMVersion = "2016 TURBOFORMS";
			description = a.$1_3.$J_2.$Bt_1.$1P_0[a.getName()].$4_2.$5h_2;
		} else if( a && a._control && a._control.$0_1 && a._control.$0_1.$4_0 && a._control.$0_1.$4_0._jsonWrapper ){
			CRMVersion = "2016 LEGACY Rendering";
			description = a._control.$0_1.$4_0._jsonWrapper;
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
		var $iframe = $( "#crmContentPanel iframe:visible" );
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
			XrmPageUI.tabs.forEach( function( tab ){ rename( tab, frame, false ); });
			XrmPageUI.controls.forEach( function( field ) { rename( field, frame, true ); } );
		}
	}
	console.log("showSchemaNames: " + CRMVersion);
}

function main() {
	schemaNames();
}

(function() {
	function scriptAvailable( url, type ) {
		var scripts = document.getElementsByTagName( type );
		for ( var indexS in scripts ) {
			if ( scripts[indexS].src ) {
				if ( scripts[indexS].src === url ) {
					return true;
				}
			} else {
				if ( scripts[indexS].href === url ) {
					return true;
				}
			}
		}
		return false;
	}

	function loadScript( url, callback ) {
		if ( !scriptAvailable( url, "Script" ) ) {
			var script = document.createElement( "script" );
			script.type = "text/javascript" ;
			if ( script.readyState ) {
				script.onreadystatechange = function() {
					if ( script.readyState === "loaded" || script.readyState === "complete") {
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
			document.getElementsByTagName( "head" )[0].appendChild( script );
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
} )();