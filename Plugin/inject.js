
//init the tui object (and inject data into the page)
TUI.load();


//----- start script -----

//this ensures the params are correct 
if(TUI.isValidTuiPage())
{	
	//jquery init
    $(document).ready(function() {
    
        dlog('Document ready');
    
        createTuiLike();
        
    
	 });
}

//image element to a 'like' symbol
var LIKE_IMG_EL = '<img src="' + chrome.extension.getURL('images/thumbs_up.png') + '" width="12" height="18" />';
var DISLIKE_IMG_EL = '<img src="' + chrome.extension.getURL('images/thumbs_down.png') + '" width="12" height="18" />';
//the id of the like like
var TUI_LIKE_LINK_ID = "tui-like-link";
var TUI_DISLIKE_LINK_ID = "tui-dislike-link";
/* Like count id */
var TUI_LIKE_COUNT_ID = "like-count";
var TUI_DISLIKE_COUNT_ID = "dislike-count";

function createTuiLike()
{
    dlog('creating tui like element');
    $(TUI.getElementToInject()).append(' <b><a id="' + TUI_LIKE_LINK_ID + '">Like ' + LIKE_IMG_EL +' <span id="' + TUI_LIKE_COUNT_ID + '">0</span></a>&nbsp; </b>');
    $(TUI.getElementToInject()).append(' &nbsp; &nbsp;<b><a id="' + TUI_DISLIKE_LINK_ID + '">Dislike ' + DISLIKE_IMG_EL +' <span id="' + TUI_DISLIKE_COUNT_ID + '">0</span></a></b>');
	
    //on click popup tui twitter box
    $('#' + TUI_LIKE_LINK_ID).click(function () {
		TUIServiceProvider.setProvider(TUIServiceProvider.SP_Twitter);
        TUIServiceProvider.postMessage(TUI.createTuiLike());
	});
    
    //on click popup tui twitter box
    $('#' + TUI_DISLIKE_LINK_ID).click(function () {
		TUIServiceProvider.setProvider(TUIServiceProvider.SP_Twitter);
        TUIServiceProvider.postMessage(TUI.createTuiDislike());
	});
}

/*



//appends a tui like button to the top of the page
function createTuiLike(element,likes)
{
	dlog('creating tui like element');
	
	$(element).append(' <b><a id="tui-like-link">Like ' + LIKE_IMG_EL +' <span id="like_count">'+likes+'</span></a></b>');
	$('#tui-like-link').click(function () {
		tuiTweetPopup();
		
	});
	
		
        
}


function updateLikeCount(likes)
{
    $('#like_count').html(likes);
}




function tuiTweetPopup()
{	
    TUIServiceProvider.setProvider(TUIServiceProvider.SP_Twitter);
    TUIServiceProvider.postMessage(TUI.createTuiLike());
}

function getNewLikeCount()
{
	getLikeCount(foundEl,false);
    updateLikeCount(numberOfLikes);
}
*/
