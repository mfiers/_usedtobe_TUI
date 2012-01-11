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

    VERSION: "0.01 testing",

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
    
        dlog("Version: " + TUI.VERSION);
	
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
	},
	
	//helper method for appending data to the head
	__appendToHead: function(id, content) { 
		$('head').append('<meta name="' + id + '" content="' + content + '" />');
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
	
	
    
    //gets the current id (eg ATG10101.1)
    getCurrentId: function() {
        return TUI.getTuiMeta(TUI.META_TUI_ID);
    },
    
    //gets the current type (eg gene, locus)
    getCurrentType: function() {
        return TUI.getTuiMeta(TUI.META_TUI_TYPE);
    },
	

	//loads the tui object and injects data into 
	init: function() {
    
        //ensure we have all the libs loaded
        //and inject empty elements onto the page
        TUI._init();
        
        //once that has been completed - notify all listeners that it is safe to start working
        //with the TUI object
        //this is called after one second to allow other scripts to attach themselves to the event
        setTimeout("$(document).trigger('tuiLoaded')", 1000);
	}
};

//debug log for chrome
function dlog(text)
{
	if(navigator.userAgent.toLowerCase().indexOf('chrome') > -1)
		console.log("#tui: " + text);
}