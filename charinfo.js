const CHARS_LOCATION = "./chardb/";

var CHARDB = [];

var fs = require('fs');
var char_folder_list = fs.readdirSync(CHARS_LOCATION);
for (var i=0;i<=char_folder_list.length-1; i++) {
	var charinfo = fs.readFileSync(CHARS_LOCATION+char_folder_list[i]+".json");
	CHARDB.push(charinfo);
}

function getInfo(req, res) {
	
	var query = req.url.substr(req.url.indexOf("searchquery")+12);
	var taglist = query.split("+");
	
	var response_list = [];
	
	for(var i=0; i<=CHARDB.length-1; i++) {
		
		var info = CHARDB[i].charinfo;
		
		var match = true;
		for(var iqtag = 0; iqtag <= taglist.length - 1 && match; iqtag++) {
			
			match = false;
			for(var j = 0; j <= info.tags.length-1; j++) {
				if(info.tags[j].indexOf(taglist[iqtag]) == 0) {
					match=true;
					break;
				}
			}
		}
		
		if(match) response_list.push(info);
	}
	
	res.send(response_list);
}

module.exports.getInfo = getInfo;
