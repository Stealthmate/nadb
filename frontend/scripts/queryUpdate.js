function hello() {
	console.log("World!");

	//var xhttp;
	//xhttp = new XMLHttpRequest();
	//xhttp.onreadystatechange = function() {
	//document.getElementById("test").innerHTML = xhttp.responseText;
	//};

	//xhttp.open("GET", "test", true);
	//xhttp.send();

}
var shouldprocess = true;
function updateSuggestions() {
	
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
				
				results.append(
				"<li class=\"searchresult\">"+
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
