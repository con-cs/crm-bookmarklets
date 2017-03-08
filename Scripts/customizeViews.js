var Connectiv;

(function (Connectiv) {
    "use strict";
    var View = (function () {

        function View() { }

        View.prerequisites = function(){
	        // load the necessary scripts and css libraries: jQuery and jQueryUI and call the main() after this
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
			loadScript('//ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js', function() {
				if (!scriptAvailable('//code.jquery.com/ui/1.11.1/themes/smoothness/jquery-ui.css', 'Link')) {
					$('head').prepend('<link rel="stylesheet" href="//code.jquery.com/ui/1.11.2/themes/smoothness/jquery-ui.css">');
				}
				loadScript('//code.jquery.com/ui/1.11.1/jquery-ui.js', function() {
					View.main();
				});
			});
		};


		View.helper = {
			toggleEditable: function(element, val){
				var isEditable = $(element).attr('contenteditable');
				if (val !== undefined) {
					isEditable = val;
				} else if ( isEditable === "true" ) {
					isEditable = "false";
				} else {
					isEditable = "true";
				}

				if( isEditable === "true" ) {
					$(element).parent().find('.approveChanges').show();
				} else {
					$(element).parent().find('.approveChanges').css("display", "none");
				}

				$(element).attr( 'contenteditable', isEditable );
				$(element).css({
					'font-size': (isEditable === "true") ? '12px' : '11px',
					'background': (isEditable === "true") ? 'gainsboro' : 'white',
					'border': (isEditable === "true") ? '1px solid cadetblue' : 'none'
				});
			},

			setCounterText: function(){
				var textStr = "(" + $('.fieldtrs:visible').length + " Felder)";
				$('#fieldCounter').text( textStr );
			},

			search: function(){
				var searchStr = $('#fieldsearch').val().toLowerCase();
				if (searchStr.length > 0){
					$('.fieldtrs').not(".selected").each(function(index, tr){
						var label = $(tr).find('td').attr('label').toLowerCase();
						var name = $(tr).find('td').attr('name').toLowerCase();
						var title = $(tr).find('td').attr('title').toLowerCase();
						if ( label.indexOf(searchStr) > -1 || name.indexOf(searchStr) > -1 || title.indexOf(searchStr) > -1 || $(tr).hasClass("selected") ){
							$(tr).show();
						} else {
							$(tr).hide();
						}
					});
				} else {
					$('.fieldtrs').not(".selected").show();
				}
				View.helper.setCounterText();
			},

			getSelected: function( fields ){
				$('#editViewTable').find('td').each(function(index, td){
					var thisField = fields.filter(function(a){
						if( a.logicalName === $(td).attr('name') ) { a.selected = true; }
					});
				});
			},

			getXmlObj: function( currentViewObject ){
				var obj = {
					layoutXml: {
						id:'#layoutXml',
						toBeReplacedStr: "",
						replaceStr: "",
						toBeRemovedStr: "",
						newStr: "",
						completeStr: (currentViewObject) ? currentViewObject.layoutXml : $('#layoutXml').text()
					}, fetchXml: {
						id:'#fetchXml',
						toBeReplacedStr: "",
						replaceStr: "",
						toBeRemovedStr: "",
						newStr: "",
						completeStr: (currentViewObject) ? currentViewObject.fetchXml : $('#fetchXml').text()
					}
				};
				return obj;
			},

			setXmlStrings: function(obj){
				// clear
				$( obj.id ).text('');
				$( obj.id ).append('<span class="first"/><span class="highlighter" style="background: yellow;"/><span class="last"/>');
				// remove strings if necessary
				var complete = obj.completeStr.replace(obj.toBeRemovedStr, "");
				// set xml-Text
				if (obj.toBeReplacedStr === ""){
					$(obj.id).find('.first').text(complete);
				} else {
					var split = complete.split(obj.toBeReplacedStr);
					if (split.length === 2){
						$(obj.id).find('.first').text(split[0]);
						$(obj.id).find('.highlighter').text(obj.replaceStr);
						$(obj.id).find('.last').text(split[1]);
					} else {
						$(obj.id).find('.first').text(complete);
					}
				}
			},

			getPreSortedFields: function( fetchXml ){
				var sortings = fetchXml.match(/<order attribute="\w+?" descending="(true|false)".?\/>/g);
				if (sortings){
					$( sortings ).each( function(index, element){
						var arr = sortings[index].split(/"/g);
						if( arr.length > 3 ){
							var to = arr[1];
							var dir = (arr[3] === "true") ? "descending" : "ascending";
							var target = $( '.shownFieldsInView[name="' + to + '"]');
							target.find('.sort.' + dir).css('display', 'block');
							target.find('.sort.rank').text(index + 1).css('display', 'block');
						}
					});
				}
			},

			setWidthOfViewContainer: function(){
				var width = 100;
				$('#editViewTable').find('div[name="spacer"], td').each( function(index,element){ width += $(element).outerWidth(); });
				$('#editViewTable').width( width );
			},

			setRemoveIconToTD: function(td){
				if ( $(td).closest('#editViewTable').length > 0 ){
					var iconId = 'removeIcon' + $(td).attr('name');
					var span = '<span id="' + iconId + '" class="removeIcon" title="remove field" onclick="Connectiv.View.events.removeField(event)" style="opacity: 0.5;cursor: pointer;display: none;position: absolute;right: 0;top: 0;margin:2px 5px 0 0;background: salmon;border-radius: 15px;width: 15px;height: 15px;text-align: center;">X</span>';
					$(td).append(span);
					$(td).hover(
						function() { $(this).find('.removeIcon').show(); }, // hover in
						function() { $(this).find('.removeIcon').css('display', 'none'); }  // hover out
					);
					$('#' + iconId).hover(
						function() { $(this).css('opacity', 0.9); }, // hover in
						function() { $(this).css('opacity', 0.5); }  // hover out
					);
				}
			},

			setSortingIconsToTD: function(td){
				var to = $(td).attr('name');
				var lbl = $(td).find('span').first().text();
				var style = 'display: none; font-size: 18px; margin-top:-5px; font-weight: bold;';
				var styleNr = 'display: none; border: 1px solid black; border-radius: 10px; width: 12px; height: 12px; margin: 1px; text-align: center; font-size: 9px;';
				var spanHoverUp = '<span to="' + to + '" label="' + lbl + '" style="' + style + '" direction="ascending" title="ascending" class="sorthover ascending">↑</span>';
				var spanHoverDown = '<span to="' + to + '" label="' + lbl + '" style="' + style + '" direction="descending" title="descending" class="sorthover descending">↓</span>';
				var spanUp = '<span to="' + to + '" label="' + lbl + '" style="' + style + '" direction="ascending" title="ascending" class="sort ascending">↑</span>';
				var spanDown = '<span to="' + to + '" label="' + lbl + '" style="' + style + '" direction="descending" title="descending" class="sort descending">↓</span>';
				var spanNumber = '<span to="' + to + '" label="' + lbl + '" style="' + styleNr + '" onclick="Connectiv.View.events.removeSorting(event)" title="remove sorting" class="sort rank"></span>';
				$(td).append(spanHoverUp).append(spanHoverDown).append(spanUp).append(spanDown).append(spanNumber);

				$(td).find('.sort.rank').hover(
					function() { Connectiv.tempHoverText = $(this).text(); $(this).css({background: 'salmon'}).text('X'); }, // hover in
					function() { $(this).css({background: 'none'}).text(Connectiv.tempHoverText); } // hover out
				);
			},

			prettifyTds: function( td, label ){
				var textSpan = '<span style="vertical-align: middle; word-break: break-all;">' + label + '</span>';
				$( td ).append( textSpan )
				  .css({
					width: td.width - 4,
					height: '24px',
					'border-right': '1px solid grey',
					margin: 0,
					padding: '0 0 0 3px',
					background: 'aliceblue',
					display: 'inline-block',
					display: '-webkit-inline-box',
					overflow: 'hidden',
    				'text-overflow': 'ellipsis'
				});
				$( td ).addClass("resizable");
				td.title = $(td).attr('name');

				View.helper.setRemoveIconToTD(td);
				View.helper.setSortingIconsToTD(td);
			}
		};

		View.options = {
			resizeColsOptions: {
				minHeight: 24,
				maxHeight: 25,
				minWidth: 10,
				resize: function( event, ui	){
					var obj = View.helper.getXmlObj();

					var regExp = new RegExp('<cell name="' + ui.helper.attr('name') + '" width="\\d*".*?\\/>');
					var newWidthStr = '<cell name="' + ui.helper.attr('name') + '" width="' + ui.helper.outerWidth() + '" />';
					obj.layoutXml.toBeReplacedStr = regExp;
					obj.layoutXml.replaceStr = newWidthStr;

					View.helper.setXmlStrings(obj.layoutXml);
					View.helper.setWidthOfViewContainer();
				}
			},

			resizeAvailableFieldsOptions: {
				minHeight: 70,
				minWidth: 250,
				resize: function( event, ui ) {
					$('#fieldselect').height( ui.element.innerHeight() - $('#fields>table').outerHeight() );
					$('#fieldsearch').parent().width( ui.element.width() - $('#searchicon').width() );
				}
			},

			sortableOptions: {
				revert: true,
				stop: function( event, ui ) {
					var obj = View.helper.getXmlObj();

					var movedName = ui.item.attr('name');
					var movedItem = $('.sortable').children('[name="' + movedName + '"]');
					var prevItem = movedItem.prev();
					var prevName = prevItem.attr('name');
					var nextItem = movedItem.next();
					var nextName = nextItem.attr('name');

					var regExpMoved = new RegExp('<cell name="' + movedName + '" width="\\d*".*?\\/>');
					var regExpPrev = new RegExp('<cell name="' + prevName + '" width="\\d*".*?\\/>');
					var regExpNext = new RegExp('<cell name="' + nextName + '" width="\\d*".*?\\/>');

					var movedStr = ( regExpMoved.exec(obj.layoutXml.completeStr) !== null ) ? regExpMoved.exec(obj.layoutXml.completeStr)[0] : "";
					var prevStr = ( regExpPrev.exec(obj.layoutXml.completeStr) !== null ) ? regExpPrev.exec(obj.layoutXml.completeStr)[0] : "";
					var nextStr = ( regExpNext.exec(obj.layoutXml.completeStr) !== null ) ? regExpNext.exec(obj.layoutXml.completeStr)[0] : "";

					obj.layoutXml.toBeRemovedStr = movedStr;
					obj.layoutXml.toBeReplacedStr = (prevStr !== "") ? prevStr : nextStr;
					obj.layoutXml.replaceStr = (prevStr !== "") ? prevStr + movedStr : movedStr + nextStr;

					View.helper.setXmlStrings(obj.layoutXml);
					View.helper.setWidthOfViewContainer();
				}
			},

			draggableOptions: {
				connectToSortable: ".sortable",
				helper: "clone",
				revert: "invalid",
				start: function( event, ui ) {
					$('#editViewTable').width( $('#editViewTable').width() + 300 );
				},
				stop: function( event, ui ) {
					// all cols (the new one too) shall be resizable
					$('#editViewTable').find('.resizable').resizable( View.options.resizeColsOptions );
					$('#editViewTable').find('td').addClass("shownFieldsInView");

					if ( $('#editViewTable').find('.resizable[name=' + ui.helper.attr('name') + ']').length > 0 ){
						// hide the field in the select-fields-box
						ui.helper.prevObject.parent().addClass("selected");
						window.setTimeout( function(){ $('.selected').hide(); }, 500);

						// add the new col to the layoutXml and fetchXml
						var obj = View.helper.getXmlObj();

						var newCol = $('#editViewTable').find('.resizable[name=' + ui.helper.attr('name') + ']');
						var newName = newCol.attr('name');
						var prevCol = $('#editViewTable').find('.ui-sortable-placeholder').prev();
						var prevName = prevCol.attr('name');
						if (prevName === newName){
							prevCol = newCol.prev();
							prevName = prevCol.attr('name');
						}
						var nextCol = $('#editViewTable').find('.ui-sortable-placeholder').next();
						var nextName = nextCol.attr('name');

						var regExpAttr = new RegExp('<attribute name="\\w+?"\\/>');
						var regExpPrev = new RegExp('<cell name="' + prevName + '" width="\\d*".*?\\/>');
						var regExpNext = new RegExp('<cell name="' + nextName + '" width="\\d*".*?\\/>');

						var movedStr = '<cell name="' + newName + '" width="' + newCol.outerWidth() + '" />';
						var newAttrStr = '<attribute name="' + newName + '"/>';
						var prevStr = ( regExpPrev.exec(obj.layoutXml.completeStr) !== null ) ? regExpPrev.exec(obj.layoutXml.completeStr)[0] : "";
						var nextStr = ( regExpNext.exec(obj.layoutXml.completeStr) !== null ) ? regExpNext.exec(obj.layoutXml.completeStr)[0] : "";
						var firstAttrStr = ( regExpAttr.exec(obj.fetchXml.completeStr) !== null ) ? regExpAttr.exec(obj.fetchXml.completeStr)[0] : "";

						obj.layoutXml.toBeReplacedStr = (prevStr!=="") ? prevStr : nextStr;
						obj.layoutXml.replaceStr = (prevStr!=="") ? prevStr + movedStr : movedStr + nextStr;
						obj.fetchXml.toBeReplacedStr = firstAttrStr;
						obj.fetchXml.replaceStr = firstAttrStr + newAttrStr;

						View.helper.setXmlStrings(obj.layoutXml);
						View.helper.setXmlStrings(obj.fetchXml);
						View.helper.setWidthOfViewContainer();
						View.helper.setRemoveIconToTD( newCol );
						window.setTimeout(View.helper.setCounterText, 500);
					}
				}
			},

			draggableOptionsSortButtons: {
				scope: "sortings",
				helper: "clone",
				revert: "invalid",
				start: function( event, ui ) {
					Connectiv.View.currentlyHoveredTd = "";
					var hoverElementStyle = '<style class="customStyle">' +
						'.tempHidden{ display: none !important; }' +
						'.hoveredElement{ border: 2px solid hotpink !important; }' +
					'</style>';
					if ( $('.customStyle').length === 0 ) $('head').append( hoverElementStyle );
				},
				drag: function( event, ui ) {
					var draggedElement = ui.helper;
					var direction = $(draggedElement).attr("sorting");
					var hoveredTd = $(event.toElement).closest('td');
					var thisTdName = $(hoveredTd).attr('name');
					if ( hoveredTd.hasClass('shownFieldsInView')){
						if (thisTdName !== Connectiv.View.currentlyHoveredTd){
							// dragging to another td, from outside in the td
 							$('.sorthover').css('display', 'none');
							$('.tempHidden').removeClass('tempHidden');
							$('.hoveredElement').removeClass('hoveredElement');
							hoveredTd.addClass("hoveredElement");

							$('.hoveredElement').find('.sort').addClass("tempHidden");
							$('.hoveredElement').find('.sorthover.' + direction).css('display', 'block');

							Connectiv.View.currentlyHoveredTd = thisTdName;
						} else {
							// dragging from inside of a td
						}
					} else {
						// dragging to outside of the td or outside of the tds
						$('.sorthover').css('display', 'none');
						$('.hoveredElement').removeClass('hoveredElement');
						Connectiv.View.currentlyHoveredTd = "";
					}
				},
				stop: function( event, ui ) {
					var direction = ui.helper.attr('sorting');
					if ( $('.hoveredElement').length > 0 ){
						$('.hoveredElement').find('.sort').css('display', 'none');
						$('.hoveredElement').find('.sort.' + direction).css('display', 'block');

						var counter = $('.hoveredElement').parent().find('.sort.ascending:visible,.sort.descending:visible').length + 1;
						var counterIcon = $('.hoveredElement').find('.sort.rank');
						if ( counterIcon.text() === "" ){
							counterIcon.text(counter);
							counterIcon.attr('to', $('.hoveredElement').attr('name') );
							counterIcon.attr('label', $('.hoveredElement>span').first().text() );
							// edit fetchXml
							var obj = View.helper.getXmlObj();
							var direction = $('.hoveredElement').find('.sort:visible').not('.rank').attr('direction');
							var desc = (direction === "descending") ? "true" : "false";
							var newAttrStr = '<order attribute="' + counterIcon.attr('to') + '" descending="' + desc + '"/>';
							obj.fetchXml.toBeReplacedStr = '<filter type=';
							obj.fetchXml.replaceStr = newAttrStr + '<filter type=';

							View.helper.setXmlStrings(obj.fetchXml);
						}
						counterIcon.css('display','block');

						var toBeAppended = '<li class="ui-state-disabled" style="background:gainsboro; color: black;"><div>sorting-sequence</div></li>';
						var listOfRanks = $('.sort.rank:visible,.sort.rank.tempHidden');
						listOfRanks.sort( function(a,b){ return parseInt( a.innerText ) - parseInt( b.innerText ); });
						listOfRanks.each(function(index,element){
							toBeAppended += '<li style="width: 150px;" class="sortRanking" to="' + $(element).attr('to') + '"><div>' + $(element).attr('label') + '</div></li>'; 
						});

						$('#menu:hidden').css({display: 'inline-block'});
						$('#menuentry').children().remove();
						$('#menuentry').append(toBeAppended);
						$( "#menu" ).menu( "refresh" );
						$('.sortRanking').parent().sortable(View.options.sortableOptionsSortButtons);

						$('.sorthover').css('display', 'none');
						$('.hoveredElement').removeClass('hoveredElement');
						$('.tempHidden').removeClass('tempHidden');
					}
				}
			},

			sortableOptionsSortButtons: {
				items: "li:not(.ui-state-disabled)",
				revert: true,
				stop: function( event, ui ) {
					var ranking = "";
					var obj = View.helper.getXmlObj();
					var fetchXml = obj.fetchXml.completeStr;
					$('.sortRanking').not('.ui-state-disabled').each( function(index, li){
						var to = $(li).attr('to');
						$('.rank[to="' + to + '"]').text( index + 1 );
						// edit fetchXml
						var regExp = new RegExp('<order attribute="' + to + '" descending="(true|false)".?\/>');
						var replaceStr = (index === 0) ? "@REPLACE_-_ME@" : "";
						var toBeReplaced = fetchXml.match( regExp );
						if (toBeReplaced){
							var toBeReplacedStr = toBeReplaced[0];
							ranking += toBeReplacedStr;
							fetchXml = fetchXml.replace(toBeReplacedStr, replaceStr);
						}
					});
					obj.fetchXml.completeStr = fetchXml;
					obj.fetchXml.toBeReplacedStr = "@REPLACE_-_ME@";
					obj.fetchXml.replaceStr = ranking;

					View.helper.setXmlStrings(obj.fetchXml);
				}
			},

			dialogOptions: {
				width: '97%',
				height: 470,
				buttons: [
					{
					  	text: "Update and save on server!",
					  	icons: { primary: "ui-icon-disk" },
					  	click: function() {
							Connectiv.View.setData.setViewREST();
							$( this ).dialog( "close" );
					  	}
					},{
					  	text: "Cancel",
					  	icons: { primary: "ui-icon-cancel" },
					  	click: function() { $( this ).dialog( "close" ); }
					}
				]
			}
		};

		View.createHTML = {
			createDraggableWithFields: function( fields ){
				View.helper.getSelected( fields );

				var toBeAppended = "<table><tbody>";
				fields.sort( function(a,b){ return a.displayName.localeCompare( b.displayName ); });
				$( fields ).each(function(index, field){
					var selected = (field.selected) ? " selected" : "";
					toBeAppended += '<tr class="fieldtrs' + selected + '"><td class="draggable" width="220" label="' + field.displayName + '" name="' + field.logicalName + '"></td></tr>';
				});
				toBeAppended += "</tbody></table>";

				$('#fieldselect').children().remove();
				$('#fieldselect').append( toBeAppended );
				$('.selected').hide();

				$('.fieldtrs>td').each( function(index, td){
					var label = $(td).attr('label');
					View.helper.prettifyTds( td, label );
				});

				View.helper.setCounterText();

				$( ".sortable" ).sortable( View.options.sortableOptions );
				$( ".draggable" ).draggable( View.options.draggableOptions );
				$( ".sortable, .draggable" ).disableSelection();
				$('#editViewTable').find('.resizable').resizable( View.options.resizeColsOptions );

				$('#fields').resizable( View.options.resizeAvailableFieldsOptions );

				if ($('.rank:visible').length > 0){
					$('#menu').css({display: 'inline-block'});
					var toBeAppended = '<li class="ui-state-disabled" style="background:gainsboro; color: black;"><div>sorting-sequence</div></li>';
					$('.sort.rank:visible,.sort.rank.tempHidden').each(function(index,element){
						toBeAppended += '<li style="width: 150px;" class="sortRanking" to="' + $(element).attr('to') + '"><div>' + $(element).attr('label') + '</div></li>'; 
					});

					$('#menu:hidden').css({display: 'inline-block'});
					$('#menuentry').children().remove();
					$('#menuentry').append(toBeAppended);
					$( "#menu" ).menu( "refresh" );
					$('.sortRanking').parent().sortable(View.options.sortableOptionsSortButtons);
				}

				View.helper.setWidthOfViewContainer();
			},

			createDialog: function(view){
				var approveSpan = '<span style="display: none; opacity: 0.5; border: 1px solid gainsboro; float: right; margin-right: 1px; background-color: lightgreen; border-radius: 3px; padding: 2px 10px 2px 10px;" class="approveChanges fetch"><span class="ui-button-icon-primary ui-icon ui-icon-check"></span></span>';
				var searchIcon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABAklEQVQ4T62T7ZFBQRBFjwgQARkgAmRABMhAJmSACMiADBDBrgxksFtH9SjG+PGU/vPmo+/t233n1XiOOTABunF8ApbAJsu7b2uxagD7B2CeL9EQuOYXicCEDnABVOHeUIkKWnHWKxEIWARYQF5FdRJKMgPWjyQqSNXHwO5NryNgW1IhwV+AmqUe464N/MQ6tX3bfoWgSgvn3CkVTIEV8As45dIQj4BtFIdoK0mFJLpiJUNrtVHwS/U0A79adQhAyQjBkpmjW3eVTxONdlRgsiFQBXovuB9qbeX22HKCd08+qUwPSgUqOVQhSE9bJfWoNKtKIG4QP57r6ycEArXe2ez+ASesOgBK4zwfAAAAAElFTkSuQmCC';
				var toBeAppended = '' +
					'<div id="sortingContainer" style="margin: 1em;">' +
						'<span id="sorting" style="margin: 0.3em;">Sorting:</span>' +
						'<span style="background: limegreen; color: white; padding: 0.7em; margin:0.3em; border-radius: 1em;" sorting="ascending" class="sortButton asc">sort ascending (↑ A-Z)</span>' +
						'<span style="background: limegreen; color: white; padding: 0.7em; margin:0.3em; border-radius: 1em;" sorting="descending" class="sortButton desc">sort descending (↓ Z-A)</span>' +
						'<ul style="display: none; width: 150px; border: none;" id="menu"><li style="margin: 0;"><div>sorting-sequence</div><ul id="menuentry" style="border-radius: 5px;"></ul></li></ul>' +
					'</div>' +
					'<div id="editViewTable">' +
						'<div name="spacer" style="width: 18px; height: 24px; float: left; border-right: 1px solid grey; margin: 2px 0 2px 0;"></div>' +
						view.currentview.layoutXml.replace(/grid/g,"table").replace(/row/g,"tr").replace(/cell/g,"td") +
				    '</div>' +
				    '<table style="float: left; width: 280px;"><tbody><tr><td style="padding: 0;">' +
						'<div id="fields" style="margin: 1em; border: 1px solid lightgrey; border-radius: 3px;">' +
							'<table><tbody><tr>' +
								'<td style="width: 230px"><input onkeyup="Connectiv.View.helper.search()" id="fieldsearch" style="font-size: medium; border: 1px solid lightgrey; border-radius: 2px;"></td>' +
								'<td id="searchicon" style="padding:3px;"><img title="Search" style="" src="' + searchIcon + '"/></td>' +
							'</tr></tbody></table>' +
							'<div id="fieldselect" style="overflow: auto; height: 110px;"></div>' +
						'</div>' +
					'</td></tr><tr><td style="padding: 0;">' +
						'<div id="fieldCounter" style="width: 97%;text-align: right;margin: -12px;"></div>' +
					'</td></tr></tbody></table>' +
					'<div id="fetchContainer" style="margin: 1em; border: 1px solid lightgrey; border-radius: 3px; display: flex;">' +
						'<table><tbody>' +
							'<tr id="currentLayoutXml"><td>' +
								'<p style="margin: 0.5em 0.5em 0.8em 0.5em;" onclick="Connectiv.View.helper.toggleEditable(\'#layoutXml,#fetchXml\',false)">Layout-Xml' + approveSpan + '</p>' +
								'<p style="margin: 0.5em;" id="layoutXml" ondblclick="Connectiv.View.helper.toggleEditable(\'#layoutXml\')">-</p>' +
							'</td></tr>' +
							'<tr id="currentFetchXml"><td>' +
								'<p style="margin: 0.5em 0.5em 0.8em 0.5em;" onclick="Connectiv.View.helper.toggleEditable(\'#layoutXml,#fetchXml\',false)">Fetch-Xml' + approveSpan + '</p>' +
								'<p style="margin: 0.5em;" id="fetchXml" ondblclick="Connectiv.View.helper.toggleEditable(\'#fetchXml\')">-</p>' +
							'</td></tr>' +
						'</tbody></table>' +
					'</div>';

				//$('#con_dialog').dialog( View.options.dialogOptions );
				$('#con_dialog').css({'font-family': 'SegoeUI,Tahoma,Arial'});
				$('.ui-dialog-titlebar').css({background: 'firebrick'}).children().css({color: 'white'});
				$('.ui-dialog-titlebar>span').text("Customize View: " + view.currentview.name);
				$('.ui-dialog-buttonset>button').height(30);
				$('.ui-button').css('background', 'white');
				$('[aria-describedby="con_dialog"]').css({'z-index': 99999,top: '25%', left: '1%'});

				$( '#con_dialog' ).children().remove();
				$( '#con_dialog' ).append(toBeAppended);

				$('.approveChanges').hover(
					function() { $(this).css({opacity: 0.9, border: '1px solid black'}); }, // hover in
					function() { $(this).css({opacity: 0.5, border: '1px solid gainsboro'}); }  // hover out
				);

				var obj = View.helper.getXmlObj(view.currentview);
				View.helper.setXmlStrings(obj.layoutXml);
				View.helper.setXmlStrings(obj.fetchXml);

				$( '#editViewTable' ).find('tr').addClass('sortable');

				$( '#editViewTable' ).find('td').each(function(index, td){
					var logicalName = $(td).attr('name');
					var label = $(view.frame).find('[field="' + logicalName + '"]').text();
					if (!label) label = $(view.frame).find('[name="' + logicalName + '"]').text();
					View.helper.prettifyTds( td, label );
					$(td).addClass("shownFieldsInView");
				});
				$( '#editViewTable' ).find('tr').append('<td style="width:150px"></td>')

				View.helper.setWidthOfViewContainer();

				$( '#editViewTable' ).css({
					'border-top': '1px solid lightgrey',
					'border-bottom': '1px solid lightgrey'
				});

				$('.sortButton').draggable( View.options.draggableOptionsSortButtons );

				$( "#menu" ).menu();
				$( "#menu>li" ).hover(
					function() { $(this).css({'background': 'none', 'border': 'none'}) }, // hover in
					function() {  }  // hover out
				);

				View.helper.getPreSortedFields(obj.fetchXml.completeStr);

				View.getData.getMedatada(view);
			}
		};

		View.events = {
			removeSorting: function(event){
				var td = $(event.target).parent();
				td.find('.sort').css('display', 'none');
				td.find('.rank').text("");

				var obj = View.helper.getXmlObj();
				var to = td.attr('name');
				var regExp = new RegExp('<order attribute="' + to +  '" descending="(true|false)".?\/>');
				var fetchXml = obj.fetchXml.completeStr;
				obj.fetchXml.completeStr = fetchXml.replace( regExp, "" );

				View.helper.setXmlStrings(obj.fetchXml);
			},

			removeField: function(event){
				var td = $(event.currentTarget).parent();
				var fieldname = td.attr('name');

				td.remove();
				$('.fieldtrs>td[name="' + fieldname + '"]').parent().removeClass("selected").show();

				// add the new col to the layoutXml and fetchXml
				var obj = View.helper.getXmlObj();

				var regExpCell = new RegExp('<cell name="' + fieldname + '" width="\\d*".*?\\/>');

				var removedCellStr = ( regExpCell.exec(obj.layoutXml) !== null ) ? regExpCell.exec(obj.layoutXml)[0] : "";
				var removedAttrStr = '<attribute name="' + fieldname + '"/>';

				obj.layoutXml.toBeRemovedStr = removedCellStr;
				obj.fetchXml.toBeRemovedStr = removedAttrStr;

				View.helper.setXmlStrings(obj.layoutXml);
				View.helper.setXmlStrings(obj.fetchXml);
				View.helper.setWidthOfViewContainer();
			}
		};

		View.getData = {
			getView: function(){
				var frame = window.top.document;
				window.top.$('iframe:visible').not("[style$='visibility: hidden;']").each(function(index,element){
					var toTest = $(element).contents().find('[currentview]').length;
					if (toTest) frame = $(element).contents();
				});

				if (frame) {
					var viewParams = $(frame).find('#divGridParams');
					var currentViewId = viewParams.find('#viewid').attr('value');
						if (!currentViewId) currentViewId = $(frame).find('#crmFormSubmitId').attr('value');
						if (currentViewId) currentViewId = currentViewId.replace(/\{|\}/g,"");
					var currentViewType = viewParams.find('#viewtype').attr('value');
						if (!currentViewType) currentViewType = $(frame).find('#crmFormSubmitObjectType').attr('value');
						if (currentViewType) currentViewType = parseInt( currentViewType );
					var singularName = (currentViewType === 1039) ? "savedquery" : "userquery";
					var pluralName = singularName.replace(/y$/g,"ies");
					var recordsPerPage = viewParams.find('#RecordsPerPage').attr('value');
						if (recordsPerPage) recordsPerPage = parseInt( recordsPerPage );
					var viewTitle = viewParams.find('#viewTitle').attr('value');
					var otc = viewParams.find('#otc').attr('value');
						if (otc) otc = parseInt( otc );
					var otn = viewParams.find('#otn').attr('value');
					var entityDisplayName = viewParams.find('#entitydisplayname').attr('value');
					var entityDisplayPluralName = viewParams.find('#entitypluraldisplayname').attr('value');
					var layoutXml = viewParams.find('#layoutXml').attr('value');
					var fetchXml = viewParams.find('#fetchXmlForFilters').attr('value');
					var fetchXml = viewParams.find('#fetchXml').attr('value');
					return ({
						frame: frame,
						currentview: {
							id: currentViewId,
							type: currentViewType,
							sgl: singularName,
							plr: pluralName,
							recordsPerPage: recordsPerPage,
							otc: otc,
							otn: otn,
							entityDisplayName: entityDisplayName,
							entityDisplayPluralName: entityDisplayPluralName,
							layoutXml: layoutXml,
							fetchXml: fetchXml,
							fetchXml: fetchXml,
							customLayoutXml: null,
							customFetchXml: null
						}
					});
				}

				return false;
			},

			getMedatada: function(view, secondRun){
			 	var url = Xrm.Page.context.getClientUrl() + '/api/data/v8.1/EntityDefinitions';
			 	var entityToSearch = (view.currentview.otn) ? view.currentview.otn : "";
			 	var urlEnd = (secondRun) ? '(' + secondRun + ')?$select=LogicalName&$expand=Attributes($select=LogicalName,SchemaName,DisplayName,AttributeType)' : '?$select=MetadataId&$filter=LogicalName%20eq%20%27' + entityToSearch + '%27';
			 	url += urlEnd;
				var async = true;
				console.log(url);

				var successCallback = function( data, view ){

					if ( data && data.value && data.value.length > 0 ) {
						View.getData.getMedatada( view, data.value[0].MetadataId );
					} else {
						var fields = [];
						if (data.Attributes && data.Attributes.length > 0){
							$(data.Attributes).each( function(index, attribute){
								fields.push({
									logicalName: attribute.LogicalName,
									schemaName: attribute.SchemaName,
									displayName: (attribute.DisplayName.UserLocalizedLabel) ? attribute.DisplayName.UserLocalizedLabel.Label : attribute.SchemaName,
									attributeType: attribute.AttributeType,
									selected: false
								});
							})
						}
						if (fields.length > 0) View.createHTML.createDraggableWithFields( fields );
					}
				}

				var errorCallback = function( error ){ console.log(error); };
				var req = new XMLHttpRequest();

				req.open("GET", url, async);
				req.setRequestHeader("Accept", "application/json");
				req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
				req.setRequestHeader("Prefer", "odata.include-annotations=*");
				req.onreadystatechange = function() {
					if (this.readyState == 4) {
						req.onreadystatechange = null;
						if (this.status == 200) {
							var data = JSON.parse(req.response);
							successCallback(data, view);
						} else {
							var error = (this.response) ? JSON.parse(this.response).error : this;
							errorCallback(error);
						}
					}
				};
				req.send();
			},

			getViewREST: function(){
			  	var view = View.getData.getView();

				// REST-Abfrage
				var url = Xrm.Page.context.getClientUrl() + "/api/data/v8.1/" + view.currentview.plr + "(" + view.currentview.id + ")/?$select=layoutxml,fetchxml,name,returnedtypecode";
				if (view.currentview.sgl === "savedquery") url += ",iscustomizable";
				var async = true;
				console.log(url);

				var successCallback = function( data, view ){
				    if (data && view && view.currentview){
				    	view.currentview.layoutXml = data.layoutxml;
				    	view.currentview.fetchXml = data.fetchxml;
				    	view.currentview.name = data.name;
				    	view.currentview.otn = data.returnedtypecode;
				    	view.currentview.entityDisplayName = data["returnedtypecode@OData.Community.Display.V1.FormattedValue"];
				    	view.currentview.isCustomizable = (data.iscustomizable) ? data.iscustomizable.CanBeChanged : true;
				    	if (!view.currentview.isCustomizable) {
				    		alert("This view cannot be customized.");
				    		return;
				    	}
				    	View.createHTML.createDialog(view);
				    }
				};
				var errorCallback = function(e){
					alert(e.innererror.message + e.innererror.stacktrace);
				};
				var req = new XMLHttpRequest();

				req.open("GET", url, async);
				req.setRequestHeader("Accept", "application/json");
				req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
				req.setRequestHeader("Prefer", "odata.include-annotations=*");
				req.onreadystatechange = function() {
				    if (this.readyState == 4 ) {
				        req.onreadystatechange = null;
				        if (this.status == 200) {
				        	var data = JSON.parse(req.response);
				            successCallback(data, view);
				        } else {
				            var error = (this.response) ? JSON.parse(this.response).error : this;
				            errorCallback(error);
				        }
				    }
				};
				req.send();
			}
		};

		View.setData = {
			setViewREST: function(){
			  	var view = View.getData.getView();
			  	var newLayoutXml =  $('#layoutXml').text();
			  	var newFetchXml =  $('#fetchXml').text();
			  	if ( !newLayoutXml || !newFetchXml || newLayoutXml === "" || newFetchXml === "" || (newLayoutXml === view.currentview.layoutXml && newFetchXml === view.currentview.fetchXml) ) return;

				// REST-Abfrage
				var url = Xrm.Page.context.getClientUrl() + "/api/data/v8.1/" + view.currentview.plr + "(" + view.currentview.id + ")";
				var async = true;
				console.log(url);

				var successCallback = function( view, req ){
					View.setData.publish(view);
				};
				var errorCallback = function(e){
					alert(e.innererror.message + e.innererror.stacktrace);
				};
				var completeCallback = function(){};
				var newData = {layoutxml: newLayoutXml, fetchxml: newFetchXml};

				console.log("Data sent to be updated:");
				console.log(newData);

				var req = new XMLHttpRequest();

				req.open("PATCH", url, async);
				req.setRequestHeader("Accept", "application/json");
				req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
				req.setRequestHeader("Prefer", "odata.include-annotations=*");
				req.onreadystatechange = function() {
				    if (this.readyState == 4 ) {
				        req.onreadystatechange = null;
				        if (this.status == 204) {
				            successCallback(view, req);
				            completeCallback();
				        } else {
				            var error = (this.response) ? JSON.parse(this.response).error : this;
				            errorCallback(error);
				        }
				    }
				};
				req.send(JSON.stringify(newData));
			},

			publish: function(view, secondRun){
				if (view.currentview.sgl === "userquery") {
					alert("A userquery doesn't need to be published. Just reload and you should see the changes.");
				} else {
					var parameters = {};
					parameters.ParameterXml = "<importexportxml><entities><entity>" + view.currentview.otn + "</entity></entities></importexportxml>";

					var successCallback = function(view, secondRun){
						console.log("published.");
						if (!secondRun){
							View.setData.publish(view, true);
						}
					};

					var req = new XMLHttpRequest();
					req.open("POST", Xrm.Page.context.getClientUrl() + "/api/data/v8.1/PublishXml", true);
					req.setRequestHeader("OData-MaxVersion", "4.0");
					req.setRequestHeader("OData-Version", "4.0");
					req.setRequestHeader("Accept", "application/json");
					req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
					req.onreadystatechange = function() {
						if (this.readyState === 4) {
							req.onreadystatechange = null;
							if (this.status === 204) {
								alert("A savedquery has to be published. Reload in a few seconds and you should see the changes.");
								successCallback( view, secondRun );
							} else if (this.status === 403) {
								alert("You are not allowed to change this view.");
							} else {
								console.log("publish failed.");
							}
						}
					};
					req.send(JSON.stringify(parameters));
				}
			}
		};

		View.main = function(){
			// append the dialog-frame, if it is not allready there
			var newFrame = '<div id="con_dialog" title="Customize View" style="display: none;"></div>';
			$('.ui-dialog').remove();
			if ( $('#con_dialog').length === 0 ) $('body').append(newFrame);
			$('#con_dialog').dialog( View.options.dialogOptions );
			$('.ui-dialog-buttonpane').find('.ui-button').first().css({width: '20em'});
			$('.ui-dialog-buttonpane').find('.ui-button').last().css({width: '9em', 'margin-left': '2em'});

			View.getData.getViewREST();
		};

		(function() {
			View.prerequisites();
		})();

        return View;
    })();
    Connectiv.View = View;
})(Connectiv || (Connectiv = {}));



