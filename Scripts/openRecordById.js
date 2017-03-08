var openRecordById = function(){
    "use strict"
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
};

function main() {
    openRecordById();
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