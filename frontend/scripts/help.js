
var STAGE = 0;


function help1(done) {
	
	if(done) {	
		return;
	}
	
	$("#helppane").attr("stage", "1");
}

function help2(done) {
	
	if(done) {
		return;
	}
	
	$("#helppane").attr("stage", "2");
	
}


const HELP_STAGES = [
help1, help2
]

function advance(n) {
	HELP_STAGES[STAGE](true);
	if(n > STAGE) STAGE = n-1;
	else STAGE++;
	HELP_STAGES[STAGE](false);
}


function showHelp() {
	
	console.log("hello");
	
	var val = $("#helppane").attr("show");
	if(val === "true") val = true;
	else val = false;
	$("#helppane").attr("show", !val);
	
	HELP_STAGES[STAGE](false);
}

HELP_FUNCS = {};
HELP_FUNCS.showHelp = showHelp;
HELP_FUNCS.advance = advance;