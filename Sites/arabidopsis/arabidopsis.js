//arabidopsis.org TUI script

//only works on this valid site
if(location.href.indexOf("http://www.arabidopsis.org/servlets/TairObject?") == 0)
{
    console.log("VALID");

    $(document).bind('tuiLoaded', function() 
    {
        loadUI();
    });
}




function loadUI()
{
    console.log("Loading UI");
    TUI.setTuiMeta(TUI.META_TUI_ID, "id_test");
    TUI.setTuiMeta(TUI.META_TUI_TYPE, "type_test");
    TUI.setTuiMeta(TUI.META_TUI_ID_PREFIX, "prefix_test");
}