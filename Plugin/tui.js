/*############################################################

                    TUI JS LIBRARY 
    
                        #TUI 
    Semantic Microblogging in Community Genome Annotation
            https://github.com/andrew-smith/TUI

	
	
Work in progress (not currently used in plugin)
This file will be the main TUI library - hopefully browser 
independent. It will contain an TUI object with all the 
functions available to use on a page.
############################################################*/



//define the tui namespace
var TUI = {


	/* Meta Data Tags */
	META_TUI_ID: "tui-id",
	META_TUI_ID_PREFIX: "tui-id-prefix",
	META_TUI_TYPE: "tui-type",
	META_TUI_LIKE_COUNT: "tui-like-count",
	META_TUI_DISLIKE_COUNT: "tui-dislike-count",
	
	/* Tui like format */
	TUI_LIKE_FORMAT: ' #tui I %s %s:%s',


	//initializes the TUI object
	_init: function() {
	
		//ensure JQuery loaded
		if(!jQuery) throw('JQuery not loaded');
		//ensure sprintf loaded
		if(!sprintf) throw ('sprintf not loaded');
		
		//init all the meta-data tags (just placeholders)
		TUI.__appendToHead(TUI.META_TUI_ID, "0");
		TUI.__appendToHead(TUI.META_TUI_ID_PREFIX, "null");
		TUI.__appendToHead(TUI.META_TUI_TYPE, "0");
		TUI.__appendToHead(TUI.META_TUI_LIKE_COUNT, "0");
		TUI.__appendToHead(TUI.META_TUI_DISLIKE_COUNT, "0");
		
		
		//set the default provider to twitter
		TUIServiceProvider.setProvider(TUIServiceProvider.SP_TWITTER);
	
	},
	
	//helper method for appending data to the head
	__appendToHead: function(id, content) { 
		$('head').append('<meta name="' + id + '" content="' + content + '" />');
	},
	
	
	//adds <meta> tags to the head of the document so we can quickly access tui data 
	_encodeTuiMetaData: function() {
	
		dlog("adding data to head");
	
		var params = getUrlVars();
	
		//get the type
		TUI.setTuiMeta(TUI.META_TUI_TYPE, getUrlVars()["type"]);
		
        //set the id prefix
        TUI.setTuiMeta(TUI.META_TUI_ID_PREFIX, TUI.getTuiObjectName());
        
	
		//set the  id
        var el = TUI.getElementToInject();        
        var data = el.innerText.split(": ")[1];
        data = $.trim(data);        
        TUI.setTuiMeta(TUI.META_TUI_ID, data);
        
	},
	
	//finds the first table td element that contains tdContent
	//then the rest of the innerText is assumed to the the id
	__findTargetId: function(tdContent) {
	
		var el = $('td').find(":contains('" + tdContent + "')")[0];
		
        //return the element 
        return el;
	},
    
    //gets the element to inject the data into
    getElementToInject: function() {
    
        var el;
    
        //first need to see what type of page this is
		switch(TUI.getTuiMeta(TUI.META_TUI_TYPE))
		{
		
			case "gene" : el = TUI.__findTargetId('Gene Model: '); break;
			case "locus": el = TUI.__findTargetId('Locus: '); break;
			case "aa_sequence": el = TUI.__findTargetId('Protein: '); break;
		}
    
        return el;
    },
	
	
	//gets one of the meta-data tag content that has been dynamically inserted inside the page
	getTuiMeta: function(tagName) {
		return $('meta[name=' + tagName + ']').attr("content");
	},
	
	//sets one of the meta-data tag content that has been dynamically inserted inside the page
	setTuiMeta: function(tagName, content) {
		$('meta[name=' + tagName + ']').attr("content", content);
	},
	
	
	//creates a tui like message for the current viewing page
	createTuiLike: function() {
	
		//grab the current object name
		var name = TUI.getTuiMeta(TUI.META_TUI_ID_PREFIX);
		var id = TUI.getTuiMeta(TUI.META_TUI_ID);
		
		return sprintf(TUI.TUI_LIKE_FORMAT, 'like', name, id);
	},
	
    //creates a tui dislike message for the current viewing page
	createTuiDislike: function() {
	
		//grab the current object name
		var name = TUI.getTuiMeta(TUI.META_TUI_ID_PREFIX);
		var id = TUI.getTuiMeta(TUI.META_TUI_ID);
		
		return sprintf(TUI.TUI_LIKE_FORMAT, 'dislike', name, id);
	},
	
	
	//gets the #tui name for the current viewing page
	//eg if viewing a gene then it returns "tairg"
	getTuiObjectName: function() 
	{
		var n; //undefined if nothing found
	
		switch(TUI.getTuiMeta(TUI.META_TUI_TYPE))
		{
			case "gene" : n = "tairg"; break;
			case "locus" : n = "tairl"; break;
			case "aa_sequence" : n = "tairp"; break;
		}
	
		return n;
	},
	

	//checks if the current page looks like a GBrowse site
	isValidTuiPage: function()
	{
		var params = getUrlVars();
		//if(params["name"] && params["type"] && params["type"] == "gene")
		if(location.href.indexOf("http://www.arabidopsis.org/servlets/TairObject?") == 0)
		{
            return true;
		}
	
		return false;
	},
	
    
    //gets the current id (eg ATG10101.1)
    getCurrentId: function() {
        return TUI.getTuiMeta(TUI.META_TUI_ID);
    },
    
    //gets the current type (eg gene, locus)
    getCurrentType: function() {
        return TUI.getTuiMeta(TUI.META_TUI_TYPE);
    },
	

	//checks the page for correct features and loads the tui object
	load: function() {
		
		dlog("Checking if valid TUI page");
		if(TUI.isValidTuiPage())
		{
			dlog("Valid TUI Page");
			
			//pass loading to JQuery 
			$(document).ready(function() {
			
				//ensure we have all the libs loaded
				TUI._init();
				//adds meta-data to the page
				TUI._encodeTuiMetaData();
			});
			
		}
		else
		{
			dlog("Not a valid TUI page");
		}
	}
};


//Either twitter or identica 
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
	provider: 0,
	
	
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
			case TUIServiceProvider.SP_Twitter: TUIServiceProvider._postMessageTwitter(message); break;
			case TUIServiceProvider.SP_Identica: TUIServiceProvider._postMessageIdentica(message); break;
			default: throw('No Service Provider has been set!');
		}
	},
	
	
	
	
	//posts a message to twitter
	_postMessageTwitter: function(message) {
		var newwindow=window.open(TUIServiceProvider.TWITTER_POPUP_TWEET_URL + encodeURIComponent(message) ,
		'Post To Twitter','height=350,width=650');
	},
	
	
	//posts a message to identica
	_postMessageIdentica: function(message) {
		var newwindow=window.open(TUIServiceProvider.IDENTICA_POPUP_NOTICE_URL + encodeURIComponent(message) ,
		'Post To Identi.ca','height=350,width=650');
	}
}

//source: http://papermashup.com/read-url-get-variables-withjavascript/
function getUrlVars() {
	var vars = {};
	var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
		vars[key] = value;
	});
	return vars;
}

//debug log for chrome
function dlog(text)
{
	if(navigator.userAgent.toLowerCase().indexOf('chrome') > -1)
		console.log("#tui: " + text);
}