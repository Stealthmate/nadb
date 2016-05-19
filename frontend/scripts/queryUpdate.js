const KEY_UP = 38;
const KEY_DOWN = 40;
const KEY_ENTER = 13;
const KEY_DELETE = 46;

var shouldprocess = true;
var charobjs = [];

var selected = 0;

function updateSuggestions() {
	
	selected = 0;
	charobjs = [];
	
	var results = $("#resultlist");
	results.empty();
	var query = $("#searchbox").val();
	console.log(query)
	if(query.length == 0) {
		shouldprocess = false;
		return;
	}
	
	shouldprocess = false;
	
	$.ajax({
		url : "charinfo",
		type : "get", //send it through get method
		data : {
			searchquery : query
		},
		success : function (response) {
			
			if(!shouldprocess) {
				return;
			}
			
			for(var i = 0; i<=response.length - 1; i++) {
				charobjs.push(response[i]);
				results.append(
				"<li onmouseenter=\"selectMe(this);\" onmouseleave=\"deselectMe(this);\" onclick=\"confirmSelect();\" class=\"searchresult\" data-selected=\"false\">"+
				"<span class=\"searchresult_name\">"+response[i].name+"</span>"+
				"<img class=\"searchresult_avatar\" src=\"resource/images/characters/"+response[i].id+"/avatar.jpg\"></img>"+
				"</li>");
				
			}
			shouldprocess=false;
		},
		error : function (xhr) {
			console.log(xhr);
		}
	});
	
	shouldprocess = true;
	
}

function selectMe(self) {
	var i = $(".searchresult").index(self);
	if(selected > 0) $($(".searchresult").get(selected-1)).attr("data-selected", "false");
	selectSuggestion(i+1);
	selected = i+1;
}

function deselectMe(self) {
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
	console.log(n);
	$("#searchpane").scrollTop($("#searchpane").scrollTop() + ($(".searchresult").outerHeight()*n));
}

function scrollIfNeeded() {
	var view_h = $("#searchpane").height();
	var li_h = $(".searchresult").outerHeight();
	console.log(li_h);
	var max_li = Math.floor(view_h/li_h) - 1;
	
	var current_top = Math.floor($("#searchpane").scrollTop()/li_h)+1;;
	
	if(selected < current_top) scrollBy(selected - current_top);
	if(selected > current_top + max_li) scrollBy(selected - current_top - max_li);
}

function selectNext() {
	var elemlist = $(".searchresult");
	if(elemlist.length == 0) return;
	
	deselect(selected);
	
	if(selected == elemlist.length) selected = 1;
	else selected = selected + 1;
	
	selectSuggestion(selected);
	scrollIfNeeded();
		
}

function selectPrev() {
	var elemlist = $(".searchresult");
	if(elemlist.length == 0) return;
	
	deselect(selected);
	
	if(selected == 1) selected = elemlist.length;
	else selected = selected - 1;
	
	selectSuggestion(selected); 
	scrollIfNeeded();
}

function confirmSelect() {
	setMarkedMember(charobjs[selected-1]);
}

function onKeyDown() {
	var key = event.which;
	if(key == KEY_DOWN) {	
		event.preventDefault();
		selectNext();
	}
	else if(key == KEY_UP) {
		event.preventDefault();
		selectPrev();
	}
	
	else if(key == KEY_ENTER) {
		event.preventDefault();
		confirmSelect();
	}
	
	else if(key == KEY_DELETE) {
		clearMarkedMember();
	}
}