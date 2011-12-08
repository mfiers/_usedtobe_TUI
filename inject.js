

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
var numberOfLikes=0;

var foundEl;


//init the tui object (and inject data into the page)
TUI.load();


//TUI like message format 
//{0} = tui id (eg: tairg)
//{1} = object id (eg: AT1G01040.1)
var TUI_LIKE_FORMAT = '<msg here> #tui :I :like %s:%s';


//----- start script -----

dlog("checking for required params");

var params = getUrlVars();

//this ensures the params are correct 
if(params["name"] && params["type"] && params["type"] == "gene")
{
	dlog("valid params");
	
	//now we need to check for a valid page
	
	
	//jquery init
	 $(document).ready(function() {
		
		dlog('Document ready');
	 
		dlog('finding "gene model" tag"');
		foundEl = $('td').find(":contains('Gene Model: " + params["name"] + "')")[0];
		var refreshLikeCount = setInterval(getNewLikeCount,1000);
		if(foundEl)
		{
			dlog('Found element')
			//query the number of likes on that gene
			dlog('getting the number of likes of this gene');
			 getLikeCount(foundEl,true);
			dlog('TESTING');
		
			
			
			dlog("linking twitter api");
			//load js
			$.getScript(TWITTER_ANYWHERE_HREF);
			
			//createTuiMenu();
			
			
		}
		else dlog('No element found');
		
	 });
}
else dlog("params not valid");

//image element to a 'like' symbol
var LIKE_IMG_EL = '<img src="http://teambravo.media.officelive.com/images/463px-Symbol_thumbs_up.svg.png" width="12" height="18" />';

//appends a tui like button to the top of the page
function createTuiLike(element,numberOfLikes)
{
	dlog('creating tui like element');
	
	$(element).append(' <b><a id="tui-like-link">Like ' + LIKE_IMG_EL +' '+numberOfLikes +'</a></b>');
	$('#tui-like-link').click(function () {
		//alert('You like: ' + params["name"]);
		tuiTweetPopup();
		
	});
	
		
}


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



function tuiTweetPopup()
{	
	var tui_id = 'tairg';
	var obj_id = params["name"];
	var newwindow=window.open(TWITTER_POPUP_TWEET + encodeURIComponent(sprintf(TUI_LIKE_FORMAT, tui_id, obj_id)) ,
				'Post To Twitter','height=350,width=650');
	
	
}

function getNewLikeCount()
{
	getLikeCount(foundEl,false);
	$('#tui-like-link').remove();
	createTuiLike(foundEl,numberOfLikes);
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
		
		if(!TUI_LIKE)
		{
			
		//popup window for twitter
			$('#tui-tweet').click(function() {
				TUI_LIKE = !TUI_LIKE;
				tuiTweetPopup();
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
var bLike; //boolean like,when the user has clicked like
function getLikeCount(foundEl,bLike)
{
	var obj_id = params["name"];
	var url='http://search.twitter.com/search.json?&q=';
	var query;
	var users = new Array();
	query="#tui :I :like tairg:"+obj_id;
		
	$.getJSON(url+encodeURIComponent(query),function(json)
	{
		$.each(json.results,function(i,tweet)
		{
		  users.push(tweet.from_user);
		});
		numberOfLikes = 0;
		var actualUsers =  new Array();	
			
		for(var j = 0 ; j < users.length;j++)
		{
			var user = users.slice(j,j+1);
			if(j>0)
			{
				checkUser(user,actualUsers);
			}
			else
			{
				actualUsers.push(users.slice(j,j+1));	
				numberOfLikes = 1;
			}
		}
		if(bLike)
		{
			createTuiLike(foundEl,numberOfLikes);
		}
	});
		
}
function checkUser(user,actualUsers)
{
	var found = false;
	for(var k = 0;k <actualUsers.length;k++)
	{
		if(actualUsers.slice(k,k+1).toString() == user)
		{
			found = true;
		}
	}
	if(!found) //user has not liked before
	{
		actualUsers.push(user);
		numberOfLikes = numberOfLikes+1;
	}	
}