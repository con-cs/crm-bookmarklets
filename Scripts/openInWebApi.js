var Connectiv;

(function (Connectiv) {
    "use strict";
    var Bookmarklet = (function () {

        function Bookmarklet() { }

        Bookmarklet.openRest = function( rest, obj ){
        	var url = rest.url + obj.plr;
        	if (obj.id) {
        		url += "(" + obj.id + ")";
        	}
        	console.log(url);
        	window.open(url);
        };

		Bookmarklet.getData = {
			getEntityPlr: function( rest ){
				var obj = {id:"", etc:0, plr:""};
				var frame = [];
				var iframe = document.getElementsByTagName('iframe');
				for (var i = 0; i < iframe.length; i++){
					if (iframe[i].style.display !== "none") frame.push(iframe[i]);
				}
				if ( frame.length > 0 ){
					frame = frame[0];
				} else {
					return false;
				}

				var onForm = ( frame.contentWindow.Xrm.Page.data ) ? true : false;

				obj.etc = frame.contentWindow.Xrm.Page.context.getQueryStringParameters().etc;
				obj.id = frame.contentWindow.Xrm.Page.context.getQueryStringParameters().id;

			 	var urlEnd = "EntityDefinitions?$select=EntitySetName&$filter=ObjectTypeCode eq " + obj.etc;
			 	var url = rest.url + urlEnd;
				var async = true;
				console.log(url);

				var successCallback = function( data, rest, obj ){
					if ( data && data.value && data.value.length > 0 ) {
						obj.plr = data.value[0].EntitySetName;
						obj.MetadataId = data.value[0].MetadataId;
						Bookmarklet.openRest( rest, obj );
					}
				};

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
							successCallback(data, rest, obj);
						} else {
							var error = (this.response) ? JSON.parse(this.response).error : this;
							errorCallback(error);
						}
					}
				};
				req.send();
			},

			getEndpointVersion: function(){
				var rest = { url: Xrm.Page.context.getClientUrl() };
				var url = rest.url + "/api/data/v8.0/RetrieveVersion";
				var async = true;
				console.log(url);

				var successCallback = function( data, rest ){
					if ( data && data.Version ) {
						var vers = data.Version.split(".");
						if (vers.length > 1){
							var version = vers[0] + "." + vers[1];
							rest.url += "/api/data/v" + version + "/";
							rest.version = version;
							Bookmarklet.getData.getEntityPlr( rest );
						}
					}
				};

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
							successCallback(data, rest);
						} else {
							var error = (this.response) ? JSON.parse(this.response).error : this;
							errorCallback(error);
						}
					}
				};
				req.send();
			}
		};


		Bookmarklet.main = function(){
			// get the latest endpoint-version
			// get the plr-name of the current entity
			// get if we are on form or on view
			// open the record in a new window
			Bookmarklet.getData.getEndpointVersion();
		};

		(function() {
			Bookmarklet.main();
		})();

        return Bookmarklet;
    })();
    Connectiv.Bookmarklet = Bookmarklet;
})(Connectiv || (Connectiv = {}));



