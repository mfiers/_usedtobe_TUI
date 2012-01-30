"use strict";
//http://search.twitter.com/search.json?q=twitterapi&rpp=1
var TUIView = {

    //image element to a 'like' symbol
    LIKE_IMG_EL: '<img src="' + chrome.extension.getURL('images/thumbs_up.png') + '" width="12" height="18" />',
    //image element to a 'dislike' symbol
    DISLIKE_IMG_EL: '<img src="' + chrome.extension.getURL('images/thumbs_down.png') + '" width="12" height="18" />',
	TWITTER_SEARCH_URL: 'http://search.twitter.com/search.json?q=',

    //the id of the like link
    LIKE_LINK_ID: "tui-like-link",
    DISLIKE_LINK_ID: "tui-dislike-link",

    //injects a like display on the specified element 
    //boolean to add a new line before the like count
    injectLikeDisplay: function (element, newline) {

        //inject elements into the element
        var nl = (newline) ? '<br />' : "";
        $(element).append(nl + ' <b><a style="display: none" id="' + TUIView.LIKE_LINK_ID + '">Like ' + TUIView.LIKE_IMG_EL + '</a>&nbsp; </b>');
        $(element).append(' <b><a style="display: none" id="' + TUIView.DISLIKE_LINK_ID + '">Dislike ' + TUIView.DISLIKE_IMG_EL + '</a></b>');

        //animation to slowly fade in
        $("#" + TUIView.LIKE_LINK_ID).show("slow");
        $("#" + TUIView.DISLIKE_LINK_ID).show("slow");

        //add click listeners for the elements
        $('#' + TUIView.LIKE_LINK_ID).click(function () {
            TUIServiceProvider.postMessage(TUI.createTuiLike());
        });
        $('#' + TUIView.DISLIKE_LINK_ID).click(function () {
            TUIServiceProvider.postMessage(TUI.createTuiDislike());
        });
    },

    //id of element that will control the title change
    TITLE_ID: "tui-title-change",
    //id of the input element that the user enters the new title into
    TITLE_INPUT_ID: "tui-title-input",

    //changes the title of the page so that when double clicked on
    //it will pop up a window asking if you would like to change the title
    //(should be done before injecting the like)
    injectTitleChangeDisplay: function (element) {
        //create <span> around the title so we can assign it an ID
        $(element).html('<span id="' + TUIView.TITLE_ID + '">' + $(element).html() + '</span>');

        //register a double-click event when title is clicked on
        $('#' + TUIView.TITLE_ID).dblclick(function () {

            //create a random id every time the popup box happens
            var RAND_ID = TUIView.TITLE_INPUT_ID + "-" + Date.now(),
                submitFunction;

            submitFunction = function () {
                var data = $('#' + RAND_ID).val();
                data = data.trim();
                // if title is entered
                if(data!="")
                {
                     data = TUI.createChangeTitleMessage(data);
                     TUIServiceProvider.postMessage(data);
                }
                //close boxy
                Boxy.get($('#' + RAND_ID)).hideAndUnload();
            };

            Boxy.confirm('<p style="text-align: center; " class="_null"> Enter a new title you wish to suggest. </p>' + '<textarea style="width: 348px; " class="_null" id="' + RAND_ID + '" ></textarea>', submitFunction, {
                title: 'Change Title'
            });

            //keypress event
            //register for "enter" key being pressed
            $('#' + RAND_ID).keypress(function (event) {
                if (event.which === 13) { //13 == enter key
                    submitFunction();
                }
            });
        });

        //underline animation when user hovers over the title
        $('#' + TUIView.TITLE_ID).hover(function () {
            //on mouse over
            $(this).css("text-decoration", "underline");
        }, function () {
            //on mouse exit
            $(this).css("text-decoration", "none");
        });
    },
	COMMENT_LINK_ID: "tui-comment-link",
	COMMENT_SHOW_ID: "tui-show-comment",
	injectCommentDisplay: function(element)
	{
		$(element).append(' <b><a id="'+TUIView.COMMENT_LINK_ID+'">Comment '+'</a></b>');
		$(element).append(' <b><a id="'+TUIView.COMMENT_SHOW_ID+'"><font size=1> Show </font>'+'</a></b>');
		
		//animation
		$("#"+TUIView.COMMENT_LINK_ID).show("slow");
		$("#"+TUIView.COMMENT_SHOW_ID).show("slow");
		
		//click listener
		$('#'+TUIView.COMMENT_LINK_ID).click(function()
		{
			//create a random id every time the popup box happens
			var RAND_ID = TUIView.COMMENT_LINK_ID + "-" + Date.now(),
				submit;

			submit = function ()
			{
				var data = $('#' + RAND_ID).val();
				data = data.trim();
				if(data!="")
				{
					data = TUI.createComment(data);
					TUIServiceProvider.postMessage(data);
				}
				

					//close boxy
				Boxy.get($('#' + RAND_ID)).hideAndUnload();
			};
			Boxy.confirm('<p style="text-align: center; " class="_null"> Enter a comment </p>' + '<textarea style="width: 348px; " class="_null" id="' + RAND_ID + '" ></textarea>', submit, {
					title: 'Comment'
				});
				//keypress event
				//register for "enter" key being pressed
			$('#' + RAND_ID).keypress(function (event)
			{
				if (event.which === 13) 
				{ //13 == enter key
					submit();
				}
			});
		});
		//displays the recent tweets
		$('#'+TUIView.COMMENT_SHOW_ID).click(function()
		{
			TUIView.getTweets();
		});
		
		
	},
	//gets all the recent tweets and displays them
	getTweets: function()
		{
			
			var tweetVal='';
			//url encodes the comment to be searched
			var query = encodeURIComponent(TUI.createComment(''));
			$.getJSON(TUIView.TWITTER_SEARCH_URL+ query,function(json)
			{
				$.each(json.results,function(i,tweet)
				{
				 tweetVal = tweetVal+'<p><img src="'+tweet.profile_image_url+'" widt="48" height="48" align="left" /><b>' +tweet.from_user+'</b> <br> '+tweet.text+'</p><br>' ;
				});
				//if there are no recent tweets
				if(tweetVal == '')
				{
					 Boxy.alert('No recent tweets',null,{title:'Recent Comments'});
				}
				else
				{
					Boxy.alert(tweetVal,null,{title:'Recent Comments'});
				}
				  
			});
		}
};
