

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



//----- start script -----

//this ensures the params are correct 
if(TUI.isValidTuiPage())
{	
	//jquery init
	 $(document).ready(function() {
		
		dlog('Document ready');
	 
		dlog('finding "gene model" tag"');
		foundEl = $('td').find(":contains('Gene Model: " + TUI.getCurrentId() + "')")[0];
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

//image element to a 'like' symbol
var LIKE_IMG_EL = '<img src="http://teambravo.media.officelive.com/images/463px-Symbol_thumbs_up.svg.png" width="12" height="18" />';

//appends a tui like button to the top of the page
function createTuiLike(element,numberOfLikes)
{
	dlog('creating tui like element');
	
	$(element).append(' <b><a id="tui-like-link">Like ' + LIKE_IMG_EL +' '+numberOfLikes +'</a></b>');
	$('#tui-like-link').click(function () {
		tuiTweetPopup();
		
	});
	
		
}


//creates a menu at the bottom of the page
function createTuiMenu()
{
	dlog("creating tui menu");
	
	//using jquery append new element to body
	$('body').append('<div id="' + TMENU_ID_HMTL + '"></div>');

}



function tuiTweetPopup()
{	
    TUIServiceProvider.setProvider(TUIServiceProvider.SP_Twitter);
    TUIServiceProvider.postMessage(TUI.createTuiLike());
}

function getNewLikeCount()
{
	getLikeCount(foundEl,false);
	$('#tui-like-link').remove();
	createTuiLike(foundEl,numberOfLikes);
}



var bLike; //boolean like,when the user has clicked like
function getLikeCount(foundEl,bLike)
{
	var obj_id = TUI.getCurrentId();
	var url='http://search.twitter.com/search.json?q=';
	var query;
	query=TUI.createTuiLike();
		
	$.getJSON(url+encodeURIComponent(query),function(json)
	{
		numberOfLikes = 0;
		var actualUsers =  new Array();	
		$.each(json.results,function(i,tweet)
		{
			if(i>0)
			{
				var user = tweet.from_user;
				checkUser(user,actualUsers);
			}
			else
			{
				actualUsers.push(tweet.from_user);	
				numberOfLikes = 1;
			}
		 
		});
					
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