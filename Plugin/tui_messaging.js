
//Either twitter or identica (or possibly g+
var TUIServiceProvider = {
	//enum values for provider
	SP_None: 0,
	SP_Twitter: 1,
	SP_Identica : 2,
	
	//url to open when using twitter
	TWITTER_POPUP_TWEET_URL: 'https://twitter.com/intent/tweet?text=',
	//url to open when using identi.ca (NOTE: if user is not logged in then this will not work)
	IDENTICA_POPUP_NOTICE_URL: 'http://identi.ca/index.php?action=newnotice&status_textarea=',
	
	// Current set provider
	provider: 0, //default none
	
	
	setProvider: function(providerID) {
		//ensure we have a valid selection
		switch(providerID)
		{
			case TUIServiceProvider.SP_Twitter: TUIServiceProvider.provider = providerID;
			case TUIServiceProvider.SP_Identica: TUIServiceProvider.provider = providerID;
			case TUIServiceProvider.SP_None: TUIServiceProvider.provider = providerID;
		}
	},
	
	
	//posts a message based on the currently selected service provider
	postMessage: function(message) {
	
		switch(TUIServiceProvider.provider)
		{
			case TUIServiceProvider.SP_Twitter: TUIServiceProvider._popupWindow(TUIServiceProvider.TWITTER_POPUP_TWEET_URL, 'Post to Twitter', message); break;
			case TUIServiceProvider.SP_Identica: TUIServiceProvider._popupWindow(TUIServiceProvider.IDENTICA_POPUP_NOTICE_URL, 'Post to Identi.ca', message); break;
			default: throw('No Service Provider has been set!');
		}
	},
	
    //helper method to create a popup window
	_popupWindow: function(url, title,  message) {
        var newwindow=window.open(url + encodeURIComponent(message) ,
		title,'height=350,width=650');
    }
}