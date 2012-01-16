

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
        $(element).append(nl + ' <b><a style="display: none" id="' + TUIView.TUI_LIKE_LINK_ID + '">Like ' + TUIView.LIKE_IMG_EL + '</a>&nbsp; </b>');
        $(element).append(' <b><a style="display: none" id="' + TUIView.TUI_DISLIKE_LINK_ID + '">Dislike ' + TUIView.DISLIKE_IMG_EL + '</a></b>');
        
        //animation to slowly fade in
        $("#" + TUIView.TUI_LIKE_LINK_ID).show("slow");
        $("#" + TUIView.TUI_DISLIKE_LINK_ID).show("slow");
    
        //add click listeners for the elements
        $('#' + TUIView.TUI_LIKE_LINK_ID).click(function () {
            TUIServiceProvider.postMessage(TUI.createTuiLike());
        });
        $('#' + TUIView.TUI_DISLIKE_LINK_ID).click(function () {
            TUIServiceProvider.postMessage(TUI.createTuiDislike());
        });
    },

    //id of element that will control the title change
    TUI_TITLE_ID: "tui-title-change",
    //id of the input element that the user enters the new title into
    TUI_TITLE_INPUT_ID: "tui-title-input", 
    
    
    
    
    
    //changes the title of the page so that when double clicked on
    //it will pop up a window asking if you would like to change the title
    //(should be done before injecting the like)
    injectTitleChangeDisplay: function(element)
    {
        //create <span> around the title so we can assign it an ID
        $(element).html('<span id="' + TUIView.TUI_TITLE_ID + '">' + $(element).html() + '</span>');
    
        //register a double-click event when title is clicked on
        $('#' + TUIView.TUI_TITLE_ID).dblclick(function() {
            Boxy.confirm(
            '<p style="text-align: center; " class="_null"> Enter a new title you wish to suggest. </p>' + 
            '<textarea style="width: 348px; " class="_null" id="' + TUIView.TUI_TITLE_INPUT_ID + '" ></textarea>', 
            function() {
                //called when user hits 'ok'
                var data =  $('#' + TUIView.TUI_TITLE_INPUT_ID).val();
                data = TUI.createChangeTitleMessage(data);
                TUIServiceProvider.postMessage(data);
            },
            {title: 'Change Title'});
        });
        
        //underline animation when user hovers over the title
        $('#' + TUIView.TUI_TITLE_ID).hover(function () {
            //on mouse over
            $(this).css("text-decoration", "underline");
        }, function() { 
            //on mouse exit
            $(this).css("text-decoration", "none");
        });
    },


};