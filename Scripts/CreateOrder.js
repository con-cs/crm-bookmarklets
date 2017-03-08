javascript:(function(){window.s991=document.createElement('script');window.s991.setAttribute('type','text/javascript');window.s991.setAttribute('src','https://bookmarkify.it/bookmarklets/4493/raw');document.getElementsByTagName('body')[0].appendChild(window.s991);})();

function createOrder() {
	var frame = $('iframe').filter(function() {
		return ($(this).css('visibility') === 'visible');
	});
	frame[0].contentWindow.acceptQuoteOrCreateOrder();
}
createOrder();
//https://bookmarkify.it/4493