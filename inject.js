


//global vars
var TMENU_ACTIVE = false;



dlog("checking for required params");

var params = getUrlVars();

if(params["name"] && params["type"] && params["type"] == "gene")
{
	dlog("valid params");
	
	
	//jquery init
	 $(document).ready(function() {
	 
		dlog("linking twitter api");
		//load js
		$.getScript("http://platform.twitter.com/anywhere.js?id=IJUb6CuxDlb9CeDVwAcQ&v=1");
	 
	   	createTuiMenu();
		
	 });
}
else dlog("params not valid");


//creates a menu at the bottom of the page
function createTuiMenu()
{
	dlog("creating tui menu");
	
	//using jquery append new element to body
	$('body').append('<div id="tui-menu"></div>');

	
	//scrolling event
	$(window).scroll(function(event) {
		refreshTuiMenu();
	});
	//when window is resized
	$(window).resize(function(event) {
		refreshTuiMenu();
	});
	
	//click listener
	$('#tui-menu').click(function(event) {
		 menuClicked();
	});
	
	//first init
	refreshTuiMenu();
	
	
	

}


var TMENU_LOADED = false;


function refreshTuiMenu()
{
	//set padding 
	$('#tui-menu').css('padding', '25px 25px 25px 25px');

	if(TMENU_ACTIVE && !TMENU_LOADED)
	{
		$('#tui-menu').html('<p> test data </p> <div id="tbox"> </div> <p> <a id="tui-tweet" href="#">Like this [data]</a>');
		TMENU_LOADED = true;
		
		$('#tui-tweet').click(function() {
			var newwindow=window.open('https://twitter.com/intent/tweet?text=%3Cmsg%20here%3E%20%23tui%20tui%3AI%20tui%3Alike%20tairg%3AAT1G01040.1',
			'Post To Twitter','height=350,width=650');
			//if (window.focus) {newwindow.focus()}
		});
		
	}
	else if(!TMENU_ACTIVE)
	{
		$('#tui-menu').html('<p>Click Here</p>');
		TMENU_LOADED = false;
	}

	//grab the #content (as all gbrowse sites have this)
	//				 center 
	var data = (($(document).width()/2) + (($('#content').width())/2)) - $('#tui-menu').width()/2 + 'px' ;

	
	
	$('#tui-menu').css({
		position: 'fixed',
		top: 'auto',
		bottom: '0px',
		left: data
	});
	
	//set a colour
	$('#tui-menu').css('background-color', '#DEB887');
}




function menuClicked()
{
	TMENU_ACTIVE = !TMENU_ACTIVE;
	refreshTuiMenu();
}

function dlog(text)
{
	console.log("#tui: " + text);
}

//source: http://papermashup.com/read-url-get-variables-withjavascript/
function getUrlVars() {
	var vars = {};
	var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
		vars[key] = value;
	});
	return vars;
}
