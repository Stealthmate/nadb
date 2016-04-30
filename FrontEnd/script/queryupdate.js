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

function updateSuggestions() {
	
	var results = $("#resultlist");
	results.empty();
	var query = $("#searchbox").val();
	
	if(query.length == 0) return;
	
	$.ajax({
		url : "charinfo",
		type : "get", //send it through get method
		data : {
			searchquery : query
		},
		success : function (response) {
			
			for(var i = 0; i<=response.length - 1; i++) {
				
				results.append(
				"<li class=\"searchresult\">"+
				"<span class=\"searchresult_name\">"+response[i].name+"</span>"+
				"<img class=\"searchresult_avatar\" src=\"resource/image/"+response[i].id+"_avatar.jpeg\"></img>"+
				"</li>");
				
			}
		},
		error : function (xhr) {
			console.log(xhr);
		}
	});
}
