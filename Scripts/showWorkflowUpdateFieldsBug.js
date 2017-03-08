var optionsetValues = { valuesInterpretedAsTrue: [ "Yes", "Ja" ], valuesInterpretedAsFalse: [ "No", "Nein" ] };

function warn() {
    alert( "This will only work if you have opened a properties tab of an updated-step in a workflow." );
}

function colorFields( optionset, val ) {
	for (var i = 0; i < optionset.length; i++ ){
		var text = $( optionset[i] ).text();
		if ( val.indexOf(text) > -1 ) {
			$( optionset[i-1] ).parent().css( "background", "red" );
			//$( optionset[i-1] ).attr( "checked", "" );
		}
	}
}

function showChangedFields( changedFields ) {
	var i = 0;
	for ( i = 0; i < changedFields.length; i++ ) {
		$( "[id='" + changedFields[i].name + "']" ).css( "background", "yellow" );
		if ( changedFields[i].value === "True" || changedFields[i].value === "False" ) {
			var optionset = $( "[id='" + changedFields[i].name + "']" ).find( "input" ).parent().children();
			var lostChangesBug = true;
			$( optionset ).each( function( index, element ) {
				if( $( element ).attr("checked") ) {
					lostChangesBug = false;
				}
			});
			if ( lostChangesBug && changedFields[i].value ) { //boolfieldValue is true and no value is set by crm
				colorFields( optionset, optionsetValues.valuesInterpretedAsTrue );
			} else if ( lostChangesBug && !changedFields[i].value ) { //boolfieldValue is false and no value is set by crm
				colorFields( optionset, optionsetValues.valuesInterpretedAsFalse );
			}
		}
	}
}

function getWorkflowXml() {
    var href = window.location.href;
    var regex = /(?:workflowId=)(.+)/gi;
    var res = regex.exec(href);
	var id = ( res && res.length === 2 ) ? res[1] : warn();
	var clienturl = Xrm.Page.context.getClientUrl();
	var serverurl = clienturl + '/XRMServices/2011/OrganizationData.svc/';
	var entitySet = "WorkflowSet";
	var options = "?$filter=WorkflowId eq (guid'" + id + "')&$select=Xaml";

	$.ajax({
	    beforeSend: function (xhr) { xhr.setRequestHeader('Accept', 'application/json'); },
	    url: serverurl + entitySet + options,
	    type: 'GET',
	    dataType: 'json',
	    contentType: 'application/json; charset=utf-8',
	    success: function (data) {
            var xml = data.d.results[0].Xaml;
            var href = window.location.href;
            var regex = /(?:stepId=)(.+)(?:&)/gi;
            var res = regex.exec(href);
            var actualStep = ( res.length === 2 ) ? res[1] : warn();
            var parser = new DOMParser();
			var xmlDoc = parser.parseFromString(xml, "text/xml");
			var sequences = $(xmlDoc).find('Sequence');
			var fieldname = "", sequenceSteps = "", fieldvalue = "", changedFields = [];
			sequences.each( function( index, element ){
				var seqSteps = $(sequences).find('Variable');
				seqSteps.each(function( index, element ) {
					sequenceSteps = $( element ).attr( "Name" );
					fieldname = $(sequences).find( "[Value='[" + sequenceSteps + "]']" ).attr( "Attribute" );
					$(sequences).children().each( function( index, element )
						{ if( $(element).attr("Value") === "[" + sequenceSteps + "]" ) {
							var searchedElements = $(sequences).children()[index-1];
							var res = $(searchedElements).find( "InArgument" )[1].textContent;
							var regex = /(?:.+?)(?:,)(?:\s\")(.+?)\b/gi;
							fieldvalue = regex.exec( res )[1];
							changedFields.push( { "name":fieldname, "value":fieldvalue } );
						}
					});
				});
			showChangedFields( changedFields );
			});
	    },
	    error: function (xhr, status, error) {},
	});
}

getWorkflowXml();
