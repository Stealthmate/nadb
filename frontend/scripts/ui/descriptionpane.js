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

function setAbilityDescription(abilitysetobj, override) {
    if(override === false && ABILITY_DESCRIPTION_LOCKED) return;
	clearAbilityDescription();
	if(abilitysetobj != null) populateAbilityDescription(abilitysetobj);
}

function onHover() {
	if(ABILITY_DESCRIPTION_LOCKED) return;

	setAbilityDescription(getAbilityObjectFromAbilityIcon($(this)));
}

function lockDescription(icon) {

	if($(icon).attr("src")==="" || $(icon).attr("src") === undefined) return;

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

var DESCRIPTIONPANE_FUNCS = {};
DESCRIPTIONPANE_FUNCS.setDescription = setAbilityDescription;
DESCRIPTIONPANE_FUNCS.clearDescription = clearAbilityDescription;
DESCRIPTIONPANE_FUNCS.lockAbilityFromIcon = lockDescription;
