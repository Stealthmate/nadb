var COST_TEMPLATE = "<td class=\"abilitycost tooltipped\" id=\"%chakra\"><span class=\"tooltip\">%chakra</span></td>";
var CLASS_TEMPLATE = "<td class=\"abilityclass tooltipped\" id=\"%class\"><span class=\"tooltip\">%class</span></td>";
class Ability {
	
	constructor(character, abilityobjs, n) {
		this.n = n;
		this.character = character;
		this.abilityobjs = abilityobjs;
		this.current = 0;
		
		this.setDOMCurrent();
	}
	
	setDOMCurrent() {
		
		var icon_path = "resource/images/characters/" + this.character + "/ab"+ this.n;
		if(this.current > 0) icon_path = icon_path + "_" + this.current;
		 icon_path = icon_path + ".jpg"
		
		$("#ab" + this.n + " .icon").attr("src", icon_path);
		
		var ability = this.abilityobjs[this.current];
		
		$("#ab" + this.n + " .namse").text(ability.name);
		$("#ab" + this.n + " .alternate").prop("disabled", this.abilityobjs.length == 1);
		$("#ab" + this.n + " .description").text(ability.description);
		$("#ab" + this.n + " .cd .value").text(ability.cd);
		var cost = ability.cost;
		var costtable = $("#ab" + this.n + " .cost");
		costtable.empty();
		costtable.attr("nocost", false); 
		
		if(cost.length == 0) {
			costtable.attr("nocost", true); 
		}
		for(var j=0;j<=cost.length-1;j++) {
			switch(cost[j]) {
				case 't' : {
					costtable.append(COST_TEMPLATE.replace(/\%chakra/g, "taijutsu"));
					break;
				}
				case 'n' : {
					costtable.append(COST_TEMPLATE.replace(/\%chakra/g, "ninjutsu"));
					break;
				}
				case 'b' : {
					costtable.append(COST_TEMPLATE.replace(/\%chakra/g, "bloodline"));
					break;
				}
				case 'g' : {
					costtable.append(COST_TEMPLATE.replace(/\%chakra/g, "genjutsu"));
					break;
				}
				case 'r' : {
					costtable.append(COST_TEMPLATE.replace(/\%chakra/g, "random"));
					break;
				}
					
			}
		}
		
		var classes = ability.classes;
		var classestable = $("#ab" + this.n + " .classes");
		classestable.empty();
		for(var j=0;j<=classes.length - 1;j++) {
			classestable.append(CLASS_TEMPLATE.replace(/\%class/g, classes[j]));
		}
	}
	
	cycle() {
		if(this.current == this.abilityobjs.length-1) this.current = 0;
		else this.current++;
		
		this.setDOMCurrent();
	}
	
}

var abilities = [];

function switchAbility(n) {
	abilities[n].cycle();
}


function updateinfo(charobj) {
	
	var charname = charobj.name;
	var id = charobj.id;
	$("#infopane .name").text(charobj.name);
	$("#infopane .avatar").attr("src", "resource/images/characters/"+id+"/avatar.jpg");
	$("#infopane .description").text(charobj.description);
	abilities = [];
	for(var i = 1; i <= 4; i++) {
		abilities.push(new Ability(charobj.id, charobj.abilities[i-1], i));
	}
}