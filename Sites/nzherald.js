//nzherald.co.nz TUI script

//only works on this valid site
if (location.href.indexOf("http://nzherald.co.nz") === 0 || location.href.indexOf("http://www.nzherald.co.nz") === 0) {
    $(document).bind('tuiLoaded', function () {
        loadNZHerald();
    });
}

function loadNZHerald() {
    //only one id for stuff
    TUI.setTuiMeta(TUI.META_TUI_ID_PREFIX, "nzherald");

    var validPage = false;
    
    var data = getUrlVars()["objectid"];
    
    if(isNumber(data))
    {
        validPage = true;
        TUI.setTuiMeta(TUI.META_TUI_ID, data);
    }

    if (validPage) {
        //finds the storyHeader class and get the h1 element inside that
        var el =  $('.storyHeader').find('h1');
        TUIView.injectTitleChangeDisplay(el);
        TUIView.injectLikeDisplay(el, false);
    }
}


//source: http://papermashup.com/read-url-get-variables-withjavascript/
function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
    });
    return vars;
}

//from: http://stackoverflow.com/a/1830844
function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}