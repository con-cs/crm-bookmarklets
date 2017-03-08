function retrieveCallback(data, entity, ids, found) {
  if (data.length > 0) {
    for (var index in data) {
      for (var element in data[index]) {
        if (element.indexOf(entity+'Id')>-1 && data[index][element]!==null)
          if (typeof data[index][element] === 'object') {
             if (data[index][element].Id && data[index][element].Id !== null) {
               ids.push(data[index][element].Id); }
          } else { ids.push(data[index][element]); }
      }
    }
  }
  openRecord(entity, ids, found);
}

function nameIn(found, name) {
    for(var i = 0; i < found.length; i++) {
        if(found[i].name === name) {
            return false;
        }
    }
    return true;
}

function openRecord(entity, ids, found) {
  for (var ind in ids) {
    var name = entity.toLowerCase();
    var id = ids[ind];
    if (id === '9cd77b5b-5586-e211-a7bf-005056a03c60' && nameIn(found, name) ) {
    var element = {};
    element.id = id;
    element.name = name;
    found.push(element);
    console.log(found);
//       Xrm.Utility.openEntityForm(name,id);
    }
  }
}

function retrieveEntity(entity, found) {
  var ids = [];
    $.ajax(Xrm.Page.context.getClientUrl() + '/XRMServices/2011/OrganizationData.svc/'+entity+'Set', {
        dataType: 'json',
 async: false,
        success: function (data) { retrieveCallback(data.d.results,entity,ids,found); }
    });
}

function main() {
  var found = [];
  var entitySets = ['Account','Contact','SystemUser','Owner'];
  $.ajax(Xrm.Page.context.getClientUrl() + '/XRMServices/2011/OrganizationData.svc/', {
      dataType: 'json',
      async: false,
      success: function (data) { entitySets = data.d.EntitySets; }
  });

  var len = entitySets.length;
  for (var nr=0; nr<len; nr++) {
    console.log((nr+1)+'/'+len+': '+'Searching in '+entitySets[nr]);
    retrieveEntity(entitySets[nr].substring(0,entitySets[nr].length-3), found);
  }
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