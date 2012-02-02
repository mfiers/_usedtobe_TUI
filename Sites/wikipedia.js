//en.wikipedia.org TUI script

//only works on this valid site
if (location.href.indexOf("http://en.wikipedia.org") === 0 || location.href.indexOf("http://www.en.wikipedia.org") === 0) {
    TUI.onReady(loadWikipedia);
}

//base url to the wikipedia api (to get the article id
var WIKI_API_BASE = 'http://en.wikipedia.org/w/api.php?format=json&action=query&titles=';

function loadWikipedia() {
    //only one id for stuff
    TUI.setTuiMeta(TUI.META_TUI_ID_PREFIX, "wikipedia");

    //split the URL
    var urlSplit = window.location.href.split("/");
    //get the page title
    var pageTitle = urlSplit[urlSplit.length - 1];

    //send request off to API to get the article ID
    $.get(WIKI_API_BASE + pageTitle, function (data) {

        var done = false;
        //key should = key
        for (var key in data.query.pages) {
            if (!done) {
                TUI.setTuiMeta(TUI.META_TUI_ID, key);
                done = true; //only do it once
            }
        }
    });

    //finds the page title element	
    var el = $("#firstHeading");
    TUIView.injectTitleChangeDisplay(el);
    TUIView.injectLikeDisplay(el, true);

}
