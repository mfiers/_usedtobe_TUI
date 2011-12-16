$.ajaxSetup ({
    // Disable caching of AJAX responses
    cache: false
});


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
    
    retrieveLikeData();
}

var BASE_WIKI_RDF_LINK = "http://socgen.soer11.ceres.auckland.ac.nz/wiki/index.php/Special:ExportRDF/"; //TAIRG:AT1G01040.2

function retrieveLikeData()
{
    var url = BASE_WIKI_RDF_LINK + TUI.getTuiObjectName().toUpperCase() + ":" + TUI.getCurrentId().toUpperCase();
    dlog("Getting likes from: " + url);
    
    $.get(url, function(data) {
    
        //data is xml
        /*
        var dl = data.childNodes[1].childNodes[3].childNodes[9].textContent;   //.find("property:TotalDislikes").text();
        var l = data.childNodes[1].childNodes[3].childNodes[11].textContent;
        
        $('#' + TUI_DISLIKE_COUNT_ID).html(dl);
        $('#' + TUI_LIKE_COUNT_ID).html(l);
        
        */
        //dlog(data);
    
    });
}
