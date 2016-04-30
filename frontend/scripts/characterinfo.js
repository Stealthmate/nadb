function updateinfo(charobj) {
	
	var charname = charobj.name;
	var id = charobj.id;
	$(".characterinfo .name").text(charobj.name);
	$(".characterinfo .icon").attr("src", "resource/images/characters/"+id+"/avatar.jpeg");
	$(".characterinfo .description").text(charobj.description);
	
	for(var i = 1; i <= 4; i++) {		
		$("#ab" + i + " .icon").attr("src", "resource/images/characters/" + charobj.id + "/ability" + i + ".jpeg");
		$("#ab" + i + " .name").text(charobj.abilities[i-1].name);
		$("#ab" + i + " .description").text(charobj.abilities[i-1].description);
		$("#ab" + i + " .cd .value").text(charobj.abilities[i-1].cd);
		
		var cost = charobj.abilities[i-1].cost;
		var costtable = $("#ab" + i + " .cost tr");
		costtable.empty();
		
		for(var j=0;j<=cost.length-1;j++) {
			switch(cost[j]) {
				case 't' : {
					costtable.append("<td class=\"taijutsu\"></td>");
					break;
				}
				case 'n' : {
					costtable.append("<td class=\"ninjutsu\"></td>");
					break;
				}
				case 'b' : {
					costtable.append("<td class=\"bloodline\"></td>");
					break;
				}
				case 'r' : {
					costtable.append("<td class=\"random\"></td>");
					break;
				}
					
			}
		}
		
		var all_classes = $("#ab"+i+" .classes td").attr("data-active", "false");
		for(var j = 0; j<=charobj.abilities[i-1].classes.length - 1; j++) {
			
			$("#ab" + i + " #" + charobj.abilities[i-1].classes[j]).attr("data-active", "true");
		}
		
	}
	
}