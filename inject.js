

//----- global vars -----
//menu currently displaying or not
var TMENU_ACTIVE = false;
//menu loaded (stops the refreshing)
var TMENU_LOADED = false;
//html id of the menu
var TMENU_ID_HMTL = 'tui-menu';
//jquery formatted id
var TMENU_ID = '#' + TMENU_ID_HMTL;
var TUI_LIKE = false;
//twitter anywhere api link
var TWITTER_ANYWHERE_HREF = "http://platform.twitter.com/anywhere.js?id=IJUb6CuxDlb9CeDVwAcQ&v=1";
//twitter popup tweet 
var TWITTER_POPUP_TWEET = 'https://twitter.com/intent/tweet?text=';


//TUI like message format 
//{0} = tui id (eg: tairg)
//{1} = object id (eg: AT1G01040.1)
var TUI_LIKE_FORMAT = '<msg here> #tui tui:I tui:like %s:%s';


//----- start script -----

dlog("checking for required params");

var params = getUrlVars();

if(params["name"] && params["type"] && params["type"] == "gene")
{
	dlog("valid params");
	
	//jquery init
	 $(document).ready(function() {
	 
		dlog("linking twitter api");
		//load js
		$.getScript(TWITTER_ANYWHERE_HREF);
	 
	   	createTuiMenu();
		
	 });
}
else dlog("params not valid");


//creates a menu at the bottom of the page
function createTuiMenu()
{
	dlog("creating tui menu");
	
	//using jquery append new element to body
	$('body').append('<div id="' + TMENU_ID_HMTL + '"></div>');

	
	//scrolling event
	$(window).scroll(function(event) {
		refreshTuiMenu();
	});
	//when window is resized
	$(window).resize(function(event) {
		refreshTuiMenu();
	});
	
	//click listener
	$(TMENU_ID).click(function(event) {
		 menuClicked();
	});
	
	//init
	refreshTuiMenu();
}




//refresh function called everytime page updates
function refreshTuiMenu()
{
	//set padding (to make it look good
	$(TMENU_ID).css('padding', '25px 25px 25px 25px');

	if(TMENU_ACTIVE && !TMENU_LOADED)
	{
		$(TMENU_ID).html('<p> <a id="tui-tweet">Like '+ params["name"] + '</a>');
		TMENU_LOADED = true;
		
		//TODO these variables need to be dynamically generated
		var tui_id = 'tairg';
		var obj_id = params["name"];
		if(!TUI_LIKE)
		{
			
		//popup window for twitter
			$('#tui-tweet').click(function() {
				TUI_LIKE = !TUI_LIKE;
				newwindow=window.open(TWITTER_POPUP_TWEET + encodeURIComponent(sprintf(TUI_LIKE_FORMAT, tui_id, obj_id)) ,
				'Post To Twitter','height=350,width=650');
				
				//if (window.focus) {newwindow.focus()}
			});
		}
		else
		{
			$(TMENU_ID).html('<p> <a id="tui-tweet">You Like '+ params["name"] + '</a>');
		}
	}
	else if(!TMENU_ACTIVE)
	{
		$(TMENU_ID).html('<p>Click Here</p>');
		TMENU_LOADED = false;
	}

	//grab the #content 
	var data = (($(document).width()/2) + (($('#content').width())/2)) - $(TMENU_ID).width()/2 + 'px' ;

	$(TMENU_ID).css({
		position: 'fixed',
		top: 'auto',
		bottom: '0px',
		left: data
	});
	
	//set a colour
	$(TMENU_ID).css('background-color', '#DEB887');
}



//called when menu is clicked on
function menuClicked()
{
	TMENU_ACTIVE = !TMENU_ACTIVE;
	refreshTuiMenu();
}


//debug log for chrome
function dlog(text)
{
	console.log("#tui: " + text);
}

//source: http://papermashup.com/read-url-get-variables-withjavascript/
function getUrlVars() {
	var vars = {};
	var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
		vars[key] = value;
	});
	return vars;
}
