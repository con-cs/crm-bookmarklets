function replaceChartWithScheduler() {
	var iframe = '<iframe name="WebResource_sched" tabindex="0" class="ms-crm-Custom" id="WebResource_sched" src="/%7B635804828000003149%7D/WebResources/con_/html/con_kendo_schedule_workingtime.html" frameborder="0" scrolling="auto" preload="0" url="/%7B635804828000003149%7D/WebResources/con_/html/con_kendo_schedule_workingtime.html" delayinitialize="0"></iframe>';
	$( "iframe" ).contents().find( "#crmGrid_pane" ).prepend( iframe );
}

replaceChartWithScheduler();
