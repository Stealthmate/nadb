var STAGE = -1;


var temp_members;
function help1(done) {

	if(done) {

		/*TEAM_MEMBERS = temp_members.slice();
		for(var i = 0; i<=5; i++) {
			TEAM_MEMBERS[i].render();
		}*/
		return;
	}
	/*temp_members = TEAM_MEMBERS.slice();
	for(var i = 0; i<=5; i++) {
		TEAM_MEMBERS[i].free();
	}*/

	$("#helpbtn").css("display", "none");
	if(markedMember > 0) SEARCHPANE_FUNCS.collapse();
	if($("#searchpane").attr("collapse")==="true") SEARCHPANE_FUNCS.collapse();
	$("#searchbox").val("");
	SEARCHPANE_FUNCS.query();
	$("#helppane").attr("stage", "1");
}

var temp;

function help2(done) {
	if(done) {
		KEY_COMMAND_MAP[KEY_ESCAPE].cmd = SEARCHPANE_FUNCS.collapse;
		return;
	}

	SEARCHPANE_FUNCS.collapse();
	if(markedMember > 0) SEARCHPANE_FUNCS.collapse();
	KEY_COMMAND_MAP[KEY_ESCAPE].cmd = null;
	$("#helppane").attr("stage", "2");

}

function help3(done) {
	if(done) {
		return;
	}

	$("#helpbtn").css("display", "initial");
	$("#helppane").attr("stage", "3");
}

const HELP_STAGES = [
help1, help2, help3
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
