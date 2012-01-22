/*############################################################

                    TUI JS LIBRARY 
    
                        #TUI 
    Semantic Microblogging in Community Genome Annotation
            https://github.com/andrew-smith/TUI

	
	
This file is the main TUI library that supplies base functions
to assist other TUI plugins
############################################################*/

"use strict";

//debug log for chrome
function dlog(text)
{
	if(navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
		console.log("#tui: " + text);
    }
}

//define the tui namespace
var TUI = {

    VERSION: "testing",

	/* Meta Data Tags */
	META_TUI_ID: "tui-id",
	META_TUI_ID_PREFIX: "tui-id-prefix",
	META_TUI_TYPE: "tui-type",
	META_TUI_LIKE_COUNT: "tui-like-count",
	META_TUI_DISLIKE_COUNT: "tui-dislike-count",
	
	/* Tui like format */
	LIKE_FORMAT: ' #tui I %s %s:%s',
    /* Tui change title format */
    TITLE_FORMAT: ' #tui %s:%s dc:title %s',
    /* Tui comment format */
    COMMENT_FORMAT: ' #tui %s:%s tui:comment %s',


	//initializes the TUI object
	_init: function() {
    
        dlog("Version: " + TUI.VERSION);
	
		//ensure JQuery loaded
		if(!jQuery) { 
            throw('JQuery not loaded');
        }
		//ensure sprintf loaded
		if(!sprintf) {
            throw ('sprintf not loaded');
        }
		
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
		var name = TUI.getTuiMeta(TUI.META_TUI_ID_PREFIX), 
            id = TUI.getTuiMeta(TUI.META_TUI_ID);
		
		return sprintf(TUI.LIKE_FORMAT, 'like', name, id);
	},
	
    //creates a tui dislike message for the current viewing page
	createTuiDislike: function() {
	
		//grab the current object name
		var name = TUI.getTuiMeta(TUI.META_TUI_ID_PREFIX),
            id = TUI.getTuiMeta(TUI.META_TUI_ID);
		
		return sprintf(TUI.LIKE_FORMAT, 'dislike', name, id);
	},
    
    
    //creates a tui change-title formatted message
    createChangeTitleMessage: function(newTitle)
    {
        var name = TUI.getTuiMeta(TUI.META_TUI_ID_PREFIX),
            id = TUI.getTuiMeta(TUI.META_TUI_ID),
            title = TUI.encodeTuiString(newTitle);
        
        return sprintf(TUI.TITLE_FORMAT, name, id, title);
    },
    
    //creates a tui comment formatted message
    createComment: function(comment)
    {
        var name = TUI.getTuiMeta(TUI.META_TUI_ID_PREFIX),
            id = TUI.getTuiMeta(TUI.META_TUI_ID);
            comment = TUI.encodeTuiString(comment);
            
        return sprintf(TUI.COMMENT_FORMAT, name, id, comment);
    },
	
	
    
    //gets the current id (eg ATG10101.1)
    getCurrentId: function() {
        return TUI.getTuiMeta(TUI.META_TUI_ID);
    },
    
    //gets the current type (eg gene, locus)
    getCurrentType: function() {
        return TUI.getTuiMeta(TUI.META_TUI_TYPE);
    },
	
    
    //encodes a string to TUI definition 
    encodeTuiString: function(str) {
    
        /*
        * NOTE: This function could pose a problem.
        *
        * If the string contains a quote mark before entering this function
        * then this could add quote marks around it but parsers attempting to 
        * parse the string as a string could fail.
        *
        * Some work here is needed...
        */
    
        //first trim the whitespace from the ends of the string
        str = $.trim(str);
        
        //check if it contains whitespace
        //if it does contain whitespace then is not needed to have quote marks around it
        if(!(/\s/.test(str)))
        {
            //if it DOESN'T contain whitespace then we need to surround it with quote marks
            str = '"' + str  + '"';
        }
    
        return str;
    },
    
    _TUIReady: function() {
        $(document).trigger('tuiLoaded');
    },

	//loads the tui object and injects data into 
	init: function() {
    
        //ensure we have all the libs loaded
        //and inject empty elements onto the page
        TUI._init();
        
        //once that has been completed - notify all listeners that it is safe to start working
        //with the TUI object
        //this is called after one second to allow other scripts to attach themselves to the event
        setTimeout(TUI._TUIReady(), 1000);
	}
};
