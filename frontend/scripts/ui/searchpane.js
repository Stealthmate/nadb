const SUGGESTION_TEMPLATE =
	"<li" +
	" onmouseenter=\"SEARCHPANE_FUNCS.selectSuggestionByRef(this);\"" +
	" onmouseleave=\"SEARCHPANE_FUNCS.deselectSuggestionByRef(this);\"" +
	" onclick=\"SEARCHPANE_FUNCS.confirmSelected();\" class=\"searchresult\"" +
	" data-selected=\"false\">" +
		"<span class=\"searchresult_name\">%name</span>" +
		"<img class=\"searchresult_avatar\" src=\"resource/images/characters/%id/avatar.jpg\"></img>" +
	"</li>";


var selected_suggestion = 0;

function buildSuggestion(charobj) {

	var t_name = "%name";
	var t_id = "%id";

	var str = SUGGESTION_TEMPLATE.replace(t_name, charobj.name).replace(t_id, charobj.id);

	return str;
}

function querySuggestions() {

	var text = $("#searchbox").val();
	if(text === undefined) text = "";
	SEARCH_FUNCS.query(text);
}

function populateSuggestions(charobjs) {

	var container = $("#resultlist");

	selected_suggestion = 0;
	container.empty();
	for(i in charobjs) {
		container.append(buildSuggestion(charobjs[i]));
	}

	$("#searchbox").focus();
}

function blockNumbers() {
	if ((event.which >= 49 && event.which <=58)) event.preventDefault();
}

function collapse_searchpane() {
	if(markedMember > 0) markMemberByNumber(markedMember-1);
	else {
		var val = $("#searchpane").attr("collapse");
		if(val === "true") val = true;
		else val = false;
		$("#searchpane").attr("collapse", !val);

		if(!val) $("#searchbox").blur();
		else $("#searchbox").focus();
	}
}


function shouldCapture() {
	return $("#searchpane").attr("collapse") == "false";
}

function selectByRef(self) {

	if(!shouldCapture()) return;

	var i = $(".searchresult").index(self);
	if(selected_suggestion > 0) $($(".searchresult").get(selected_suggestion-1)).attr("data-selected", "false");
	selectSuggestion(i+1);
	selected_suggestion = i+1;
}

function deselectByRef(self) {

	if(!shouldCapture()) return;

	deselectByID($(".searchresult").index(self)+1);
	selected_suggestion = 0;
}

function deselectByID(n) {
	$($(".searchresult").get(n-1)).attr("data-selected", "false");
}

function selectSuggestion(n) {
	var elem = $(".searchresult").get(n-1);
	$(elem).attr("data-selected", "true");
}

function scrollBy(n) {
	$("#resultlist").scrollTop($("#resultlist").scrollTop() + ($(".searchresult").outerHeight()*n));
}

function scrollIfNeeded() {
	var view_h = $("#resultlist").height();
	var li_h = $(".searchresult").outerHeight();

	var max_li = Math.floor(view_h/li_h) - 1;

	var current_top = Math.floor($("#resultlist").scrollTop()/li_h)+1;;

	if(selected_suggestion < current_top) scrollBy(selected_suggestion - current_top);
	if(selected_suggestion > current_top + max_li) scrollBy(selected_suggestion - current_top - max_li);
}

function selectNext() {

	if(!shouldCapture()) return;

	var elemlist = $(".searchresult");
	if(elemlist.length == 0) return;

	deselectByID(selected_suggestion);

	if(selected_suggestion == elemlist.length) selected_suggestion = 1;
	else selected_suggestion = selected_suggestion + 1;

	selectSuggestion(selected_suggestion);
	scrollIfNeeded();

}

function selectPrev() {

	if(!shouldCapture()) return;

	var elemlist = $(".searchresult");
	if(elemlist.length == 0) return;
	deselectByID(selected_suggestion);

	if(selected_suggestion <= 1) selected_suggestion = elemlist.length;
	else selected_suggestion = selected_suggestion - 1;

	selectSuggestion(selected_suggestion);
	scrollIfNeeded();
}

function confirmSelect() {

	if(!shouldCapture()) return;

	TEAMSPANE_FUNCS.setMarkedMember(charobjs[selected_suggestion-1]);
}

var SEARCHPANE_FUNCS = {};
SEARCHPANE_FUNCS.collapse = collapse_searchpane;

SEARCHPANE_FUNCS.query = querySuggestions;

SEARCHPANE_FUNCS.populate = populateSuggestions;

SEARCHPANE_FUNCS.selectSuggestionByRef = selectByRef;
SEARCHPANE_FUNCS.deselectSuggestionByRef = deselectByRef;

SEARCHPANE_FUNCS.nextSuggestion = selectNext;
SEARCHPANE_FUNCS.prevSuggestion = selectPrev;

SEARCHPANE_FUNCS.confirmSelected = confirmSelect;

SEARCHPANE_FUNCS.blockNumberInput = blockNumbers;
