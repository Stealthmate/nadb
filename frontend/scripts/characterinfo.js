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

		$(dom_ability + ".cost").empty();
		for(var j=0; j<=ability.cost.length - 1; j++) {

			$(dom_ability + ".cost").attr("nocost", false);
			$(dom_ability + ".cost").append(COST_TEMPLATE.replace(/%chakra/g, ability.cost[j]));
		}

		$(dom_ability + ".classes").empty();
		for(var j=0; j<=ability.classes.length - 1; j++) {
			$(dom_ability + ".classes").append(CLASS_TEMPLATE.replace(/%class/g, ability.classes[j]));
		}
	}

	render(characterobject) {

		this.clear();
		if(characterobject == null) return;
		this.characterobject = characterobject;
		this.isFree = false;
		//Initialize properties
		this.name = this.characterobject.name;
		this.id = this.characterobject.id;
		this.description = this.characterobject.description;
		this.avatar = CHAR_AVATAR.replace("%character", this.id);

		this.abilities = this.characterobject.abilities;

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

		this.renderAbility(n, this.abilities[n].current_ability);

	}

	clearAbility(n) {
		var dom_member = "#" + this.team + " #m" + (this.n + 1) + " ";
		var dom_ability = dom_member + "#ab" + (n + 1) + " ";

		$(dom_ability + ".icon").removeAttr("src");
		if($(dom_ability + ".icon").attr("locked")==="true") {
			$(dom_ability + ".icon").attr("locked", false);
			ABILITY_DESCRIPTION_LOCKED = false;
		}
		$(dom_ability + " .alternate").attr("alternate", false);
		$(dom_ability + ".cost").empty();
		$(dom_ability + ".cost").attr("nocost", true);
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
		this.abilities = [];
		this.name = "";
		this.isFree = true;
	}
}



var INFO_FUNCS = {};
