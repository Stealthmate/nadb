var STAGE = -1;


function help1(done) {
	
	if(done) {	
		return;
	}
	
	if($("#searchpane").attr("collapse")==="true") INFO_FUNCS.escape_f();
	
	$("#helppane").attr("stage", "1");
}

var temp;

function help2(done) {
	
	if(done) {
		KEY_COMMAND_MAP[KEY_ESCAPE].cmd = INFO_FUNCS.escape_f;
		return;
	}
	
	INFO_FUNCS.escape_f();
	if(markedMember > 0) INFO_FUNCS.escape_f();
	KEY_COMMAND_MAP[KEY_ESCAPE].cmd = null;
	$("#helppane").attr("stage", "2");
	
}


const HELP_STAGES = [
help1, help2
]

function advance(n) {
	
	if(STAGE == -1) return;
	
	HELP_STAGES[STAGE](true);
	if(n > STAGE) STAGE = n-1;
	else STAGE++;
	HELP_STAGES[STAGE](false);
}


function showHelp() {
	
	var stopHelp = $("#helppane").attr("show");
	if(stopHelp === "true") stopHelp = true;
	else stopHelp = false;
	$("#helppane").attr("show", !stopHelp);
	
	if(!stopHelp) STAGE = 0;
	HELP_STAGES[STAGE](stopHelp);
	if(stopHelp) STAGE = -1;
	
	$("#helppane").attr("stage", STAGE+1);
}

HELP_FUNCS = {};
HELP_FUNCS.showHelp = showHelp;
HELP_FUNCS.advance = advance;