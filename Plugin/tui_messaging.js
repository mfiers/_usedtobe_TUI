"use strict";

//Either twitter or identica (or possibly g+)
var TUIServiceProvider = {
    //enum values for provider
    //need to be strings as they are stored in localStorage (and come out of there as strings)
    SP_None: "0",
    SP_Twitter: "1",
    SP_Identica: "2",

    //url to open when using twitter
    TWITTER_POPUP_TWEET_URL: 'https://twitter.com/intent/tweet?text=',
    //url to open when using identi.ca (NOTE: if user is not logged in then this will not work)
    IDENTICA_POPUP_NOTICE_URL: 'http://identi.ca/index.php?action=newnotice&status_textarea=',
    
    //called before each method to ensure that a service provider has been set
    init: function() {
        if (!localStorage.TUIServiceProvider_provider) {
            localStorage.TUIServiceProvider_provider = TUIServiceProvider.SP_Twitter;
        }
    },

    setProvider: function (providerID) {
        //ensure we have a valid selection
        //and save selection in local storage so the user doesn't have to change it every time
        switch (providerID) {
            case TUIServiceProvider.SP_Twitter:
                localStorage.TUIServiceProvider_provider = providerID;
                break;
            case TUIServiceProvider.SP_Identica:
                localStorage.TUIServiceProvider_provider = providerID;
                break;
            case TUIServiceProvider.SP_None:
                localStorage.TUIServiceProvider_provider = providerID;
                break;
        }
    },

    //posts a message based on the currently selected service provider
    postMessage: function (message) {

        //ensure there is a provider set
        TUIServiceProvider.init();

        switch (localStorage.TUIServiceProvider_provider) {
            case TUIServiceProvider.SP_Twitter:
                TUIServiceProvider._popupWindow(TUIServiceProvider.TWITTER_POPUP_TWEET_URL, 'Post to Twitter', message);
                break;
            case
                TUIServiceProvider.SP_Identica:
                TUIServiceProvider._popupWindow(TUIServiceProvider.IDENTICA_POPUP_NOTICE_URL, 'Post to Identi.ca', message);
                break;
            default:
                throw ('No Service Provider has been set!');
        }
    },

    //helper method to create a popup window
    _popupWindow: function (url, title, message) {
        window.open(url + encodeURIComponent(message), title, 'height=350,width=650');
    },
    
    //twitter base search URL
    TWITTER_SEARCH_URL: 'http://search.twitter.com/search.json?q=',
    
    //searches the provider and returns results based on the query
    //callback function must take a param (an array of tweets/messages)
    search: function(query, callbackFunction) {
    
        //ensure there is a provider set
        TUIServiceProvider.init();
    
        switch (localStorage.TUIServiceProvider_provider) {
        
            case TUIServiceProvider.SP_Twitter:
            
                $.getJSON(TUIServiceProvider.TWITTER_SEARCH_URL + encodeURIComponent(query), function(json)
                {
                    var results = new Array();
                    $.each(json.results,function(i,tweet)
                    {
                        var data = new Object();
                        data.id = tweet.id;
                        data.image = tweet.profile_image_url;
                        data.username = tweet.from_user;
                        data.message = tweet.text;
                        
                        results.push(data);
                    });
                    
                    callbackFunction(results);
                });
                break;
                
            case TUIServiceProvider.SP_Identica:
                //TODO
                break;
        }
    
    }
};
