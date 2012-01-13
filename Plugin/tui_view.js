

var TUIView = {

    //image element to a 'like' symbol
    LIKE_IMG_EL: '<img src="' + chrome.extension.getURL('images/thumbs_up.png') + '" width="12" height="18" />',
    //image element to a 'dislike' symbol
    DISLIKE_IMG_EL: '<img src="' + chrome.extension.getURL('images/thumbs_down.png') + '" width="12" height="18" />',
    
    //the id of the like link
    TUI_LIKE_LINK_ID: "tui-like-link",
    TUI_DISLIKE_LINK_ID: "tui-dislike-link",

    //injects a like display on the specified element
    injectLikeDisplay: function(element) {
        TUIView.injectLikeDisplay(element, false);
    },
    
    //injects a like display on the specified element 
    //boolean to add a new line before the like count
    injectLikeDisplay: function(element, newline) {
    
        //inject elements into the element
        var nl = (newline) ? '<br />' : "";
        $(element).append(nl + ' <b><a id="' + TUIView.TUI_LIKE_LINK_ID + '">Like ' + TUIView.LIKE_IMG_EL + '</a>&nbsp; </b>');
        $(element).append(' <b><a id="' + TUIView.TUI_DISLIKE_LINK_ID + '">Dislike ' + TUIView.DISLIKE_IMG_EL + '</a>&nbsp; </b>');
    
        //add click listeners for the elements
        $('#' + TUIView.TUI_LIKE_LINK_ID).click(function () {
            TUIServiceProvider.setProvider(TUIServiceProvider.SP_Twitter);
            TUIServiceProvider.postMessage(TUI.createTuiLike());
        });
        $('#' + TUIView.TUI_DISLIKE_LINK_ID).click(function () {
            TUIServiceProvider.setProvider(TUIServiceProvider.SP_Twitter);
            TUIServiceProvider.postMessage(TUI.createTuiDislike());
        });
    },



};