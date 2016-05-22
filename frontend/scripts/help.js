function startHelp() {
	
	var next_btn = $(".nextbtn");
	
	$("#searchpane").addClass("highlight");
	
	next_btn.attr("stage", "1");
}

function showHelp() {
	
	console.log("hello");
	
	var val = $("#helppane").attr("show");
	if(val === "true") val = true;
	else val = false;
	$("#helppane").attr("show", !val);
	
	startHelp();
}

HELP_FUNCS = {};
HELP_FUNCS.showHelp = showHelp;