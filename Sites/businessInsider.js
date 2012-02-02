if(location.href.indexOf("http://articles.businessinsider.com")  === 0  || location.href.indexOf("http://www.articles.businessinsider.com")  === 0 ) {
    TUI.onReady(loadBusinessinsider);
}
function loadBusinessinsider() {
    TUI.setTuiMeta(TUI.META_TUI_ID_PREFIX, "businessInsider");
    //split the URL
     var urlSplit  = window.location.href.split("/");
    //get the last split string ,contains the id and title
    	var id  = urlSplit[urlSplit.length - 1];
    var articleId  = id.split("_")[0];
    if(isNumber(articleId)) {
        TUI.setTuiMeta(TUI.META_TUI_ID, articleId);
        //find element to insert
		var el  = $('#mod-article-header').find('h1');
        //inject Like and Display
        TUIView.injectTitleChangeDisplay(el);
        TUIView.injectLikeDisplay(el, true);
    }
}
function isNumber(n)  {
    return  ! isNaN(parseFloat(n))  && isFinite(n);
}

