//HTML Tempaltes for generating cost/class markers
var COST_TEMPLATE = "<td class=\"abilitycost tooltipped\" id=\"%chakra\"><span class=\"tooltip\"></span></td>";
var CLASS_TEMPLATE = "<td class=\"abilityclass tooltipped\" id=\"%class\"><span class=\"tooltip\">%class</span></td>";

//Path templates for resources
var CHAR_AVATAR = "resource/images/characters/%character/avatar.jpg";
var CHAR_ABILITY = "resource/images/characters/%character/ab%n.jpg";
var CHAR_ALT_ABILITY = "resource/images/characters/%character/ab%n_%i.jpg";;


var ABILITY_DESCRIPTION_LOCKED = false;


class Member {
	constructor(n) {
		this.n = n;
		this.team = "player";
		if(this.n > 2) {
			this.n = this.n - 3;
			this.team = "enemy";
		}
		this.name = "";
		this.id = "";
		this.avatar = "";
		this.abilities = [];
		
		this.isFree = true;
	}
	
	renderAbility(id, ability) {
		
		var dom_member = "#" + this.team + " #m" + (this.n + 1) + " ";
		var dom_ability = dom_member + "#ab" + (id+1) + " ";
		
		$(dom_ability + ".icon").attr("src", ability.iconpath);
		
		if($(dom_ability + ".icon").attr("locked")==="true") {
			setAbilityDescription(this.abilities[id].current_ability);
		}
		
		if(this.abilities[id].length > 1) {
			$(dom_ability + " .alternate").attr("alternate", true);
		}
		
		for(var j=0; j<=ability.cost.length - 1; j++) {
			$(dom_ability + ".cost").append(COST_TEMPLATE.replace(/%chakra/g, ability.cost[j]));
		}
		
		for(var j=0; j<=ability.classes.length - 1; j++) {
			$(dom_ability + ".classes").append(CLASS_TEMPLATE.replace(/%class/g, ability.classes[j]));
		}
	}
	
	render(characterobject) {
		
		this.clear();
		if(characterobject == null) return;
		this.isFree = false;
		//Initialize properties
		this.name = characterobject.name;
		this.id = characterobject.id;
		this.description = characterobject.description;
		this.avatar = CHAR_AVATAR.replace("%character", this.id);
		
		this.abilities = characterobject.abilities;
		
		//Set DOM object values
		var dom_member = "#" + this.team + " #m" + (this.n + 1) + " ";
		
		$(dom_member + ".name").text(this.name);
		$(dom_member + ".avatar").attr("src", this.avatar);
		
		for(var i=0; i<=3; i++) {
			this.abilities[i][0].iconpath = CHAR_ABILITY.replace("%character", this.id).replace("%n", i+1);
			
			for(var j=1; j<= this.abilities[i].length - 1; j++) {
				this.abilities[i][j].iconpath = CHAR_ALT_ABILITY.replace("%character", this.id).replace("%n", i+1).replace("%i", j);
			}
			
			var ability = this.abilities[i][0];
			
			this.abilities[i].current_ability = this.abilities[i][0];
			var dom_ability = dom_member + "#ab" + (i+1) + " ";
			this.renderAbility(i, ability);
			
		}
		
	}
	
	cycleCurrentAbility(n) {
		var abilityset = this.abilities[n];
		if(abilityset.length == 1) return;
		
		var index = -1;
		for(var i=0; i<=abilityset.length-1;i++) {
			if(abilityset[i] === this.abilities[n].current_ability) {
				index = i;
				break;
			}
		}
		if(index === abilityset.length-1) this.abilities[n].current_ability = abilityset[0];
		else this.abilities[n].current_ability = abilityset[index+1];
		
		this.clearAbility(n);
		this.renderAbility(n, this.abilities[n].current_ability);
		
	}
	
	clearAbility(n) {
		var dom_member = "#" + this.team + " #m" + (this.n + 1) + " ";
		var dom_ability = dom_member + "#ab" + (n + 1) + " ";
		
		$(dom_ability + ".icon").removeAttr("src");
		$(dom_ability + " .alternate").attr("alternate", false);
		$(dom_ability + ".cost").empty();
		$(dom_ability + ".classes").empty();
	}
	
	clear() {
		var dom_member = "#" + this.team + " #m" + (this.n + 1) + " ";
		
		$(dom_member + ".name").text("");
		$(dom_member + ".avatar").removeAttr("src");
		
		for(var i=0;i <= 3; i++) {
			this.clearAbility(i);
		}
	}
	
	free() {
		this.clear();
		this.isFree = true;
	}
}

var TEAM_MEMBERS = [new Member(0), new Member(1), new Member(2), new Member(3), new Member(4), new Member(5)];

var markedMember = -1;

function mark(i, val) {
	var team = "#player ";
	
	if(i > 3) {
		i = i - 3;
		team = "#enemy ";
	}
	
	$(team + "#m" + i).attr("marked", val);
	$(team + "#m" + i + " .avatar").attr("marked", val);
}

function markMemberByNumber(n) {
	if(markedMember > 0) mark(markedMember, false);
	if(markedMember == n + 1) {
		markedMember = -1;
		return;
	}
	markedMember = n + 1;
	mark(markedMember, true);
}

function markMemberByReference(ref) {
	var avatar = ref.find(".avatar");
	var member_i = $(".member .avatar").index(avatar);
	markMemberByNumber(member_i);
}

function clearMarkedMember() {
	if(markedMember <= 0) return;
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

function populateAbilityDescription(abilityobj) {
	
	var root = "#descriptionpane ";
	
	$(root + ".name").text(abilityobj.name);
	$(root + ".icon").attr("src", abilityobj.iconpath);
	if(abilityobj.cost.length == 0) $(root + ".cost").attr("nocost", true);
	else {
		 $(root + ".cost").attr("nocost", false);
		for(var j=0; j<=abilityobj.cost.length - 1; j++) {
			$(root + ".cost").append(COST_TEMPLATE.replace(/%chakra/g, abilityobj.cost[j]));
		}
	}
	
	for(var j=0; j<=abilityobj.classes.length - 1; j++) {
		$(root + ".classes").append(CLASS_TEMPLATE.replace(/%class/g, abilityobj.classes[j]));
	}
	
	$(root + ".cd").text(abilityobj.cd);
	
	$(root + ".description").text(abilityobj.description);
}

function clearAbilityDescription() {
	var root = "#descriptionpane ";
	
	$(root + ".name").text("Ability");
	$(root + ".icon").attr("src", "");
	$(root + ".cost").empty();
	$(root + ".cost").attr("nocost", "true");
	$(root + ".cd").text("");
	$(root + ".classes").empty();
	$(root + ".description").text("");
}

function setAbilityDescription(abilitysetobj) {
	clearAbilityDescription();
	if(abilitysetobj != null) populateAbilityDescription(abilitysetobj);
}

function getAbilityObjectFromAbilityIcon(icon) {
	var member = Math.floor($(".ability .icon").index(icon) / 4);
	
	var ability = $(".ability .icon").index(icon) - (member*4);

	if(TEAM_MEMBERS[member].abilities.length == 0) {
		setAbilityDescription(null); 
		return;
	}
	
	return TEAM_MEMBERS[member].abilities[ability].current_ability;

}

function onHover() {
	if(ABILITY_DESCRIPTION_LOCKED) return;
	
	setAbilityDescription(getAbilityObjectFromAbilityIcon($(this)));
	
}

function lockDescription(icon) {
	
	var this_is_locked = $(icon).attr("locked")==="true";
	if(ABILITY_DESCRIPTION_LOCKED && !this_is_locked) {
		$(".ability .icon[locked=\"true\"]").attr("locked", false);
		setAbilityDescription(getAbilityObjectFromAbilityIcon(icon));
		$(icon).attr("locked", true);
		return;
	}
	ABILITY_DESCRIPTION_LOCKED = !ABILITY_DESCRIPTION_LOCKED;
	$(icon).attr("locked", ABILITY_DESCRIPTION_LOCKED);
}

function onExit() {
	if(!ABILITY_DESCRIPTION_LOCKED) setAbilityDescription(null);
}

function cycleAbility() {
	
	var div_ab = $(this).parent();
	var member = Math.floor($(".ability").index(div_ab) / 4);
	
	var ability = $(".ability").index(div_ab) - (member*4);
	
	TEAM_MEMBERS[member].cycleCurrentAbility(ability);
}

function escape_f() {
	if(markedMember > 0) markMemberByNumber(markedMember-1);
	else {
		var val = $("#searchpane").attr("collapse");
		if(val === "true") val = true;
		else val = false;
		$("#searchpane").attr("collapse", !val);
		
		if(!val) $("#searchbox").blur();
		else $("#searchbox").focus();
	}
}

var INFO_FUNCS = {};
INFO_FUNCS.markMemberByReference = markMemberByReference;
INFO_FUNCS.markMemberByNumber = markMemberByNumber;
INFO_FUNCS.escape_f = escape_f;
INFO_FUNCS.deleteMarkedMember = clearMarkedMember;
INFO_FUNCS.cycleAlternateAbilities = cycleAbility;
INFO_FUNCS.setAbilityDescriptionOnHover = onHover;
INFO_FUNCS.unsetAbilityDescriptionOnHover = onExit;
INFO_FUNCS.lockAbilityDescription = lockDescription;