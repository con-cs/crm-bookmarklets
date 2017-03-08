
var v, f = prompt("Enter field name"); var a = frames[0].Xrm.Page.getAttribute(f); switch (a.getAttributeType()) { case "optionset": case "boolean": v = a.getSelectedOption().text; break; case "lookup": v = a.getValue()[0].name; break; default: v = a.getValue(); break; } window.prompt("Copy to clipboard: Ctrl+C, Enter", v);
Zeigt den Wert eines Feldes, auch wenn dieses ausgeblendet ist.

var h = "", j = 0; frames[0].Xrm.Page.ui.controls.forEach(function (c) { if (! c.getVisible()) { j++; h += j + ". " + c.getName() + ",\n"; } }); alert(j + " hidden fields on this formular:\n\n" + h);
Zeigt eine Liste der ausgeblendeten Felder.

var frame = $("iframe").filter(function () { return ($(this).css("visibility") == "visible") }); frame[0].contentWindow.Xrm.Page.data.entity.addOnSave(function(context){ if (context.getEventArgs().getSaveMode() != 1) { context.getEventArgs().preventDefault(); } });
Verhindert das automatische Speichern im aktuellen Fenster.

window.open($(" #crmcontentpanel="" iframe:not([style*="\&quot;visibility:" hidden\"])')[0].contentwindow.xrm.page.context.getclienturl()="" +="" "="" tools="" diagnostics="" diag.aspx");'="
Öffnet die CRM Diagnose Seite in einem neuem Fenster.
