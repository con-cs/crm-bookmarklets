function getTable(){
    var view = {};
    if ( $('iframe:visible').contents().find('#gridBodyTable').length > 0 && $('iframe:visible').contents().find('.ms-crm-List-Header').length > 0 ) {
        view.header = $('iframe:visible').contents().find('.ms-crm-List-Header')[0];
        view.table = $('iframe:visible').contents().find('#gridBodyTable')[0];
        var el = $( view.table ).find('tr:visible')[0];
        for (var i = 0, atts = el.attributes, n = atts.length, arr = []; i < n; i++){
            if ( atts[i].nodeName.indexOf("onmouse") === -1 || atts[i].nodeName.indexOf("hierarchydatachildcount") === -1 ) {
                arr.push(atts[i].nodeName);
            }
        }
        view.addionalCols = arr;
    }
    return view;
}

function modifyTable( view ){
    var visibleTableRows = $( view.table ).find('tr:visible');
    for (var index = 0; index < visibleTableRows.length; index++){
        var titletext = "";
        for (var i = 0; i < view.addionalCols.length; i++){
            titletext += view.addionalCols[i] + ": " + visibleTableRows[index].getAttribute(view.addionalCols[i]) + " \n";
        }
        var textInRow = "";
        var valuesInRow = $(visibleTableRows[index]).children('.inner-grid-cellPadding');
        for (var i = 0; i< valuesInRow.length; i++){
            textInRow += $(view.header).find('th:nth('+ i +')').text() + ": " + $(valuesInRow[i]).text() + " \n";
        }
        $(visibleTableRows[index]).children('td').children().attr('title', titletext);
        promptText = textInRow + titletext;

        $(visibleTableRows[index]).attr('promptText', promptText);

        var imageElement = '<img class="wannaKnowMore" style="position: absolute; height: 16px; width: 16px; cursor: pointer; opacity:0.8;" src="/_imgs/ico_16_4001.gif">';
        $(visibleTableRows[index]).hover(function() {
            $(this).append(imageElement);
            $(this).find('.wannaKnowMore').css('left', $(this).position().left + 2 + 'px');
            $(this).find('.wannaKnowMore').css('top', $(this).position().top + 6 + 'px');
            $(this).find('.wannaKnowMore').click(function() {
                var toPrompt = $(this).parent().attr('promptText');
                prompt( toPrompt, toPrompt );
            });
            $(this).find('.wannaKnowMore').hover(function() {
                $(this).css("opacity", 1)
            }, function() {
                $(this).css("opacity", 0.8)
            });
        }, function() {
            $(this).find('.wannaKnowMore').remove();
        });
    }
}

(function showAdditionalColsInTitle() {
    var view = getTable();
    modifyTable( view );
})()
