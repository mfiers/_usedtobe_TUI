//arabidopsis.org TUI script

//only works on this valid site
if (location.href.indexOf("http://www.arabidopsis.org/servlets/TairObject?") == 0) {
    console.log("VALID");

    $(document).bind('tuiLoaded', function () {
        loadTair();
    });
}

function loadTair() {

    //load all the variables
    var params = getUrlVars();

    //----------------------------------
    //get the type
    TUI.setTuiMeta(TUI.META_TUI_TYPE, getUrlVars()["type"]);

    var idPfx; //undefined if nothing found
    switch (TUI.getTuiMeta(TUI.META_TUI_TYPE)) {
    case "gene":
        idPfx = "tairg";
        break;
    case "locus":
        idPfx = "tairl";
        break;
    case "aa_sequence":
        idPfx = "tairp";
        break;
    }

    //----------------------------------
    //set the id prefix
    TUI.setTuiMeta(TUI.META_TUI_ID_PREFIX, idPfx);


    //set the  id
    var el = getElementToInject();
    var data = el.innerText.split(": ")[1];
    data = $.trim(data);
    TUI.setTuiMeta(TUI.META_TUI_ID, data);


    //inject the like UI
    TUIView.injectTitleChangeDisplay(el);
    TUIView.injectLikeDisplay(el);
    TUIView.injectCommentDisplay(el);
}

//source: http://papermashup.com/read-url-get-variables-withjavascript/
function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
    });
    return vars;
}

//gets the title cell
function getElementToInject() {
    var el;
    //first need to see what type of page this is
    switch (TUI.getTuiMeta(TUI.META_TUI_TYPE)) {

    case "gene":
        el = findTargetId('Gene Model: ');
        break;
    case "locus":
        el = findTargetId('Locus: ');
        break;
    case "aa_sequence":
        el = findTargetId('Protein: ');
        break;
    }
    return el;
}

//finds the cell with the specified contents
function findTargetId(tdContent) {
    return $('td').find(":contains('" + tdContent + "')")[0];
}
