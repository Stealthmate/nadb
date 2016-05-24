var TEAM_MEMBERS = [new Member(0), new Member(1), new Member(2), new Member(3), new Member(4), new Member(5)];

var markedMember = 0;

function getAbilityObjectFromAbilityIcon(icon) {
	var member = Math.floor($(".ability .icon").index(icon) / 4);
	var ability = $(".ability .icon").index(icon) - (member*4);

	if(TEAM_MEMBERS[member].abilities.length == 0) {
		return null;
	}

	return TEAM_MEMBERS[member].abilities[ability].current_ability;

}

function mark(i, val) {
	console.log("Marking " + i);
	var team = "#player ";

	if(i > 3) {
		i = i - 3;
		team = "#enemy ";
	}

	$(team + "#m" + i).attr("marked", val);
	$(team + "#m" + i + " .avatar").attr("marked", val);
}

function markMemberByNumber(n) {
	if(markedMember == n + 1) {
		mark(markedMember, false);
		markedMember = 0;
		return;
	}
	if(markedMember > 0) mark(markedMember, false);
	markedMember = n+1;
	console.log("To mark " + markedMember);
	mark(markedMember, true);
}

function markMemberByReference(ref) {
	var avatar = ref.find(".avatar");
	var member_i = $(".member .avatar").index(avatar);
	console.log("Ref " + member_i);
	markMemberByNumber(member_i);
}

function clearMarkedMember() {
	if(markedMember <= 0) return
	TEAM_MEMBERS[markedMember-1].free();
	setAbilityDescription(null);
}

function setMarkedMember(charobj) {
	if(markedMember < 0) {
		for(var i=0;i<=5;i++) {
			if(TEAM_MEMBERS[i].isFree) {
				TEAM_MEMBERS[i].render(charobj);
				break;
			}
		}
		return;
	}
	TEAM_MEMBERS[markedMember-1].render(charobj);
}

function cycleAbility(icon_ab) {
	if(typeof icon_ab != 'object') {
		icon_ab = $(".ability .icon[locked=\"true\"]");
	}

	var div_ab = icon_ab.parent();
	var member = Math.floor($(".ability").index(div_ab) / 4);

	var ability = $(".ability").index(div_ab) - (member*4);
    if(member === -1) return;
	TEAM_MEMBERS[member].cycleCurrentAbility(ability);
}

var TEAMSPANE_FUNCS = {};
TEAMSPANE_FUNCS.markMemberByRef = markMemberByReference;
TEAMSPANE_FUNCS.markMemberByID = markMemberByNumber;
TEAMSPANE_FUNCS.clearMarkedMember = clearMarkedMember;
TEAMSPANE_FUNCS.setMarkedMember = setMarkedMember;

TEAMSPANE_FUNCS.cycleAbilityIcon = cycleAbility;

TEAMSPANE_FUNCS.getAbilityFromIcon = getAbilityObjectFromAbilityIcon;
