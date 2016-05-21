
function _mouseevents_markMemberByReference() {
	event.preventDefault();
	INFO_FUNCS.markMemberByReference($(this));
}

$(".member").on("mousedown", _mouseevents_markMemberByReference);

function _mouseevents_cycleAlternateAbilities() {
	event.stopPropagation();
	event.preventDefault();
	INFO_FUNCS.cycleAlternateAbilities($(this));
}

$(".alternate").on("mousedown", _mouseevents_cycleAlternateAbilities);


function _mouseevents_lockAbilityDescription() {
	event.stopPropagation();
	event.preventDefault();
	INFO_FUNCS.lockAbilityDescription($(this));
}


$(".ability .icon").on("mouseover", INFO_FUNCS.setAbilityDescriptionOnHover);
$(".ability .icon").on("mouseleave", INFO_FUNCS.unsetAbilityDescriptionOnHover);
$(".ability .icon").on("mousedown",_mouseevents_lockAbilityDescription);

$("#helpbtn").on("mousedown", INFO_FUNCS.showHelp)