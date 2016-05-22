const SUGGESTION_TEMPLATE = 
	"<li onmouseenter=\"selectMe(this);\" onmouseleave=\"deselectMe(this);\" onclick=\"confirmSelect();\" class=\"searchresult\" data-selected=\"false\">" +
		"<span class=\"searchresult_name\">%name</span>" +
		"<img class=\"searchresult_avatar\" src=\"resource/images/characters/%id/avatar.jpg\"></img>" +
	"</li>";


var shouldprocess = true;
var charobjs = [];

var selected = 0;

function buildSuggestion(charobj) {
	
	var t_name = "%name";
	var t_id = "%id";
	
	var str = SUGGESTION_TEMPLATE.replace(t_name, charobj.name).replace(t_id, charobj.id);
	
	return str;
}

function checkInput() {
	if ((event.which >= 49 && event.which <=58)) event.preventDefault();
}

function updateSuggestions() {

	selected = 0;
	charobjs = [];
	
	var results = $("#resultlist");
	results.empty();
	var query = $("#searchbox").val();
	if(query.length == 0) { 
		//query="all"
	}
	
	shouldprocess = false;
	
	$.ajax({
		url : "charinfo",
		type : "get",
		data : {
			searchquery : query
		},
		success : function (response) {
			
			if(!shouldprocess) {
				return;
			}
			
			for(var i = 0; i<=response.length - 1; i++) {
				charobjs.push(response[i]);
				results.append(buildSuggestion(response[i]));
				
			}
			shouldprocess=false;
		},
		error : function (xhr) {
			console.log(xhr);
		}
	});
	
	shouldprocess = true;
	
	$("#searchbox").focus();
	
}

function shouldCapture() {
	return $("#searchpane").attr("collapse") == "false";
}

function selectMe(self) {
	
	if(!shouldCapture()) return;
	
	var i = $(".searchresult").index(self);
	if(selected > 0) $($(".searchresult").get(selected-1)).attr("data-selected", "false");
	selectSuggestion(i+1);
	selected = i+1;
}

function deselectMe(self) {
	
	if(!shouldCapture()) return;
	
	deselect($(".searchresult").index(self)+1);
	selected = 0;
}

function deselect(n) {
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
	
	if(selected < current_top) scrollBy(selected - current_top);
	if(selected > current_top + max_li) scrollBy(selected - current_top - max_li);
}

function selectNext() {
	
	if(!shouldCapture()) return;
	
	var elemlist = $(".searchresult");
	if(elemlist.length == 0) return;
	
	deselect(selected);
	
	if(selected == elemlist.length) selected = 1;
	else selected = selected + 1;
	
	selectSuggestion(selected);
	scrollIfNeeded();
		
}

function selectPrev() {
	
	if(!shouldCapture()) return;
	
	var elemlist = $(".searchresult");
	if(elemlist.length == 0) return;
	
	deselect(selected);
	
	if(selected == 1) selected = elemlist.length;
	else selected = selected - 1;
	
	selectSuggestion(selected); 
	scrollIfNeeded();
}

function confirmSelect() {
	
	if(!shouldCapture()) return;
	
	HELP_FUNCS.advance(2);
	
	setMarkedMember(charobjs[selected-1]);
}

var SUGGESTIONS_FUNCS = {};
SUGGESTIONS_FUNCS.selectAboveSuggestion = selectPrev;
SUGGESTIONS_FUNCS.selectBelowSuggestion = selectNext;
SUGGESTIONS_FUNCS.confirmSelectedSuggestion = confirmSelect;