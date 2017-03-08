function globalCRMSearch(){
	var cRMBaseUrl = window.localStorage.getItem( "crmUrl" );
	if ( window.Xrm && Xrm.Page && Xrm.Page.context && Xrm.Page.context.getClientUrl() ) {
		cRMBaseUrl = Xrm.Page.context.getClientUrl();
	}

	if ( cRMBaseUrl === undefined || cRMBaseUrl === null || cRMBaseUrl === 'null' ) {
		cRMBaseUrl = window.prompt("CRM-URL: ", 'https://connectiv.crm4.dynamics.com' );
		if (cRMBaseUrl === 'null') {
			cRMBaseUrl = null;
		}
		localStorage.setItem( 'crmUrl', cRMBaseUrl );
	}

	if ( cRMBaseUrl !== undefined && cRMBaseUrl !== null && cRMBaseUrl !== 'null' ){
		var answer = window.prompt("Global-CRM-Search: ", "???");
		if ( answer === undefined || answer === null || answer === 'null' ){
			answer = "";
		}
		var urlGlobalSearch = cRMBaseUrl + '/MultiEntityQuickfind/multiEntityQuickFind.aspx?pagemode=iframe&sitemappath=CS%7cMyWork%7cnav_dashboards&text=';
		window.open( urlGlobalSearch + answer );
	} else {
		window.alert( "Something went wrong. :(" );
	}
}

globalCRMSearch();
