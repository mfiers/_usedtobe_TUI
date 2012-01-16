//arabidopsis.org TUI script

//only works on this valid site
if(location.href.indexOf("http://wormbase.org") === 0 || location.href.indexOf("http://www.wormbase.org") === 0 )
{
    console.log("VALID");

    $(document).bind('tuiLoaded', function() 
    {
        loadWormBase();
    });
}




function loadWormBase()
{

    //load all the variables
    var params = getUrlVars();

    //----------------------------------
    //get the type
    var urlText = window.location.href.split("?")[0];
    var urlSplit = urlText.split("/");
    
    //the last element in the array is the type
    var type = urlSplit[urlSplit.length-1].toLowerCase();
    
    
    TUI.setTuiMeta(TUI.META_TUI_TYPE, type);

    var idPfx; //undefined if nothing found

    switch(TUI.getTuiMeta(TUI.META_TUI_TYPE))
    {
        case "gene" : idPfx = "wrmbg"; break;
        case "locus" : idPfx = "wrmbl"; break;
        case "protein" : idPfx = "wrmbp"; break;
    }
    
    if(!idPfx) return; //exit
    
    //----------------------------------
    //set the id prefix
    TUI.setTuiMeta(TUI.META_TUI_ID_PREFIX, idPfx);
    
    
    //now get the id (or in this website's case - name)
    var name = params["name"];
    if(name.split(";").length > 1)
    {
        name = name.split(";")[0];
    }
    TUI.setTuiMeta(TUI.META_TUI_ID, name);
    
    //inject the like UI
    TUIView.injectTitleChangeDisplay(getElementToInject());
    TUIView.injectLikeDisplay(getElementToInject());
}


//source: http://papermashup.com/read-url-get-variables-withjavascript/
function getUrlVars() {
	var vars = {};
	var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
		vars[key] = value;
	});
	return vars;
}


//gets the title cell
function getElementToInject()
{
    var el;
    //first need to see what type of page this is
    switch(TUI.getTuiMeta(TUI.META_TUI_TYPE))
    {

        case "gene" : el = findTargetId('Gene Summary'); break;
        case "locus": el = findTargetId('Locus report'); break;
        case "protein": el = findTargetId('Protein Summary'); break;
    }
    return el;
}

//finds the cell with the specified contents
function findTargetId(tdContent) 
{
    return $("h1:contains('" + tdContent + "')");
    //return $('h1').find(":contains('" + tdContent + "')")[0];
}
