const KEY_UP = 38;
const KEY_DOWN = 40;
const KEY_ENTER = 13;
const KEY_DELETE = 46;
const KEY_ESCAPE = 27;
const KEY_1 = 49;
const KEY_2 = 50;
const KEY_3 = 51;
const KEY_4 = 52;
const KEY_5 = 53;
const KEY_6 = 54;
const KEY_ALT = 18;

var KEY_COMMAND_MAP = [];

KEY_COMMAND_MAP[KEY_UP] = {
	cmd : SUGGESTIONS_FUNCS.selectAboveSuggestion
};

KEY_COMMAND_MAP[KEY_DOWN] = {
	cmd : SUGGESTIONS_FUNCS.selectBelowSuggestion
}
KEY_COMMAND_MAP[KEY_ENTER] = {
	cmd : SUGGESTIONS_FUNCS.confirmSelectedSuggestion,
	shouldPreventDefault : true
}

KEY_COMMAND_MAP[KEY_DELETE] = {
	cmd : INFO_FUNCS.deleteMarkedMember
}
KEY_COMMAND_MAP[KEY_ESCAPE] = {
	cmd : INFO_FUNCS.escape_f
}

function _keyevents_markMemberByNumber(key) {
	INFO_FUNCS.markMemberByNumber(key - KEY_1);
}

KEY_COMMAND_MAP[KEY_1] = {
	cmd : _keyevents_markMemberByNumber
}
KEY_COMMAND_MAP[KEY_2] = {
	cmd : _keyevents_markMemberByNumber
}
KEY_COMMAND_MAP[KEY_3] = {
	cmd : _keyevents_markMemberByNumber
}
KEY_COMMAND_MAP[KEY_4] = {
	cmd : _keyevents_markMemberByNumber
}
KEY_COMMAND_MAP[KEY_5] = {
	cmd : _keyevents_markMemberByNumber
}
KEY_COMMAND_MAP[KEY_6] = {
	cmd : _keyevents_markMemberByNumber
}

KEY_COMMAND_MAP[KEY_ALT] = {
	cmd : INFO_FUNCS.cycleAlternateAbilities,
	shouldPreventDefault : true
}


function onKeyDown() {
	var key = event.which;
	if (KEY_COMMAND_MAP[key] != null) {
		if (KEY_COMMAND_MAP[key].shouldPreventDefault)
			event.preventDefault();
		KEY_COMMAND_MAP[key].cmd(key);
	}
}