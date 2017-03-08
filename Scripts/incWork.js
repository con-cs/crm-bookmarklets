function openNewWorkingtime(context) {
    var id = context.parent().attr('oid').replace(/\{|\}/g, "");
    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        datatype: "json",
        url: Xrm.Page.context.getClientUrl() + "/XRMServices/2011/OrganizationData.svc/IncidentSet(guid'" + id + "')?$select=Title",
        beforeSend: function(XMLHttpRequest) {
            XMLHttpRequest.setRequestHeader("Accept", "application/json");
        },
        async: true,
        success: function(data, textStatus, xhr) {
            var parameters = {};
            parameters["con_caseid"] = id;
            parameters["con_caseidname"] = data.d.Title;
            Xrm.Utility.openEntityForm("con_workrecord", null, parameters, {
                "openInNewWindow": true
            });
        },
        error: function(xhr, textStatus, errorThrown) {}
    });
}

function getAllIframes() {
    var iframes = $('iframe:visible');
    $(iframes).each(function(index, element) {
        if ($(element).contents().has('iframe')) {
            $.merge(iframes, $(element).contents().find('iframe:visible'));
        }
    });
    for (var i = 0; i < 10; i++) {
        $(iframes).each(function(index, element) {
            try {
                if ($(element).contents().has('iframe')) {
                    var testing = $(element).contents().find('iframe:visible');
                    $(testing).each(function(ind, elt) {
                        if (jQuery.inArray(elt, iframes) < 0) $.merge(iframes, $(elt));
                    });
                }
            } catch (e) {}
        });
    }
    return iframes;
}

function main() {
    var clientUrl = Xrm.Page.context.getClientUrl();
    var elementToAdd = '<img class="addWorkingtimeIcon" style="position: absolute; cursor: pointer; opacity:0.8; background-color: #D7EBF9;" src="' + clientUrl + '/WebResources/con_/pics/con_workingrecord_16.png">';
    var frames = getAllIframes();
    $(frames).each(function(index, element) {
        if ($(element).contents().find('tr[otypename="incident"]').length > 0) {
            var listRows = $(element).contents().find("TR.ms-crm-List-Row[otypename='incident'], TR.ms-crm-List-SelectedRow[otypename='incident']");
            if (listRows.length < 1) {
                listRows = $(element).contents().find("tr.ms-crm-List-Row-Lite[otypename='incident'], tr.ms-crm-List-SelectedRow-Lite[otypename='incident']");
            }
            listRows.hover(function() {
                $(this).append(elementToAdd);
                $(this).find('.addWorkingtimeIcon').css('left', $(this).position().left + 2 + 'px');
                $(this).find('.addWorkingtimeIcon').css('top', $(this).position().top + 6 + 'px');
                $(this).find('.addWorkingtimeIcon').click(function() {
                    openNewWorkingtime($(this));
                });
                $(this).find('.addWorkingtimeIcon').hover(function() {
                    $(this).css("opacity", 1)
                }, function() {
                    $(this).css("opacity", 0.8)
                });
            }, function() {
                $(this).find('.addWorkingtimeIcon').remove();
            });
        }
    });
}

main();
