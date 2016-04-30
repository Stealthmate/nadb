const KEY_UP = 38;
const KEY_DOWN = 40;
const KEY_ENTER = 13;

var shouldprocess = true;
var charobjs = [];

var selected = 0;

function updateSuggestions() {
	
	selected = 0;
	
	var results = $("#resultlist");
	results.empty();
	var query = $("#searchbox").val();
	
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
				"<li class=\"searchresult\" data-selected=\"false\">"+
				"<span class=\"searchresult_name\">"+response[i].name+"</span>"+
				"<img class=\"searchresult_avatar\" src=\"resource/images/characters/"+response[i].id+"/avatar.jpeg\"></img>"+
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


function deselect(n) {
	$($(".searchresult").get(n-1)).attr("data-selected", "false");
}

function selectSuggestion(n) {
	var elem = $(".searchresult").get(n-1);
	$(elem).attr("data-selected", "true");
}

function selectNext() {
	var elemlist = $(".searchresult");
	if(elemlist.length == 0) return;
	
	deselect(selected);
	
	if(selected == elemlist.length) selected = 1;
	else selected = selected + 1;
	
	selectSuggestion(selected); 
}

function selectPrev() {
	var elemlist = $(".searchresult");
	if(elemlist.length == 0) return;
	
	deselect(selected);
	
	if(selected == 1) selected = elemlist.length;
	else selected = selected - 1;
	
	selectSuggestion(selected); 
}

function confirmSelect() {
	updateinfo(charobjs[selected-1]);
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
}