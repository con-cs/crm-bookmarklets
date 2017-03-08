function getObjectTypeCode(entityName) {
    try {
        var lookupService = new RemoteCommand("LookupService", "RetrieveTypeCode");
        lookupService.SetParameter("entityName", entityName);
        var result = lookupService.Execute();
        if (result.Success && typeof result.ReturnValue == "number") {
            window.prompt(entityName, result.ReturnValue);
        }
    }
    catch (ex) {
        alert(ex.message);
    }
}
var entName = window.prompt("Search the ObjectTypeCode to this entity: ","Entityname");
getObjectTypeCode(entName.toLowerCase());
