var MOUSE_EVENT_DOWN = "mousedown";
var MOUSE_EVENT_OVER = "mouseover";
var MOUSE_EVENT_LEAVE = "mouseleave";

const MOUSE_COMMAND_MAP = [];

MOUSE_COMMAND_MAP[0] = {
	target: $(".ability .icon"),
	evt: MOUSE_EVENT_OVER,
	cmd: function () {
		DESCRIPTIONPANE_FUNCS.setDescription(TEAMSPANE_FUNCS.getAbilityFromIcon($(this)), false);
	},
	shouldStopPropagation: true,
	shouldPreventDefault: true
}

MOUSE_COMMAND_MAP[1] = {
	target: $(".ability .icon"),
	evt: MOUSE_EVENT_LEAVE,
	cmd: function () {
		DESCRIPTIONPANE_FUNCS.setDescription(null, false);
	},
	shouldStopPropagation: true,
	shouldPreventDefault: true
}

MOUSE_COMMAND_MAP[2] = {
	target: $(".ability .icon"),
	evt: MOUSE_EVENT_DOWN,
	cmd: function () {
		DESCRIPTIONPANE_FUNCS.lockAbilityFromIcon($(this));
	},
	shouldStopPropagation: true,
	shouldPreventDefault: true
}

MOUSE_COMMAND_MAP[3] = {
	target: $(".member"),
	evt: MOUSE_EVENT_DOWN,
	cmd: function () {
		TEAMSPANE_FUNCS.markMemberByRef($(this));
	},
	shouldStopPropagation: true,
	shouldPreventDefault: true
}

MOUSE_COMMAND_MAP[4] = {
	target: $(".alternate"),
	evt: MOUSE_EVENT_DOWN,
	cmd: function () {
		TEAMSPANE_FUNCS.cycleAbilityIcon($(this));
	},
	shouldStopPropagation: true,
	shouldPreventDefault: true
}

function dispatcher(event) {
	for(key in MOUSE_COMMAND_MAP) {
		var keyobj = MOUSE_COMMAND_MAP[key];

		if($(this).is(keyobj.target) && event.data === keyobj.evt) {

			if(keyobj.shouldStopPropagation) event.stopPropagation();
			if(keyobj.shouldPreventDefault) event.preventDefault();

			keyobj.cmd.apply($(this));
		}
	}

}

for(i in MOUSE_COMMAND_MAP) {
	MOUSE_COMMAND_MAP[i].target.on(MOUSE_COMMAND_MAP[i].evt, null, MOUSE_COMMAND_MAP[i].evt, dispatcher);
}

$("#helpbtn").on("mousedown", HELP_FUNCS.showHelp)
