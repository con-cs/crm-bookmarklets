var toAppend = '<iframe id="WebResource_scheduler" style="width: 100%; height: 100%;" src="/{635956630300000088}/WebResources/con_/html/con_kendo_schedule_workingtime.html"></iframe>';
var scheduler = $('iframe:visible').contents().find( '#WebResource_scheduler' );
if ( scheduler.length > 0 ){
	scheduler.attr( 'src', scheduler.attr('src') );
}
$('iframe:visible').contents().find( '#crmGrid_vizIframe' ).before( toAppend );