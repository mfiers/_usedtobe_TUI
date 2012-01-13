//stuff.co.nz TUI script

//only works on this valid site
if(location.href.indexOf("http://stuff.co.nz") === 0 || location.href.indexOf("http://www.stuff.co.nz") === 0 )
{
    $(document).bind('tuiLoaded', function() 
    {
        loadStuff();
    });
}



function loadStuff()
{
    //only one id for stuff
    TUI.setTuiMeta(TUI.META_TUI_ID_PREFIX, "stuff");

    //split the URL
    var urlSplit = window.location.href.split("/");
    //find the number - this is the article ID
    for(var i=0; i<urlSplit.length; i++)
    {
        if(isNumber(urlSplit[i]))
        {
            TUI.setTuiMeta(TUI.META_TUI_ID, urlSplit[i]);
        }
    }
    
    //finds the first h1 element in the left column 
    TUIView.injectLikeDisplay($("#left_col").find('h1'));
}


//from: http://stackoverflow.com/a/1830844
function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

