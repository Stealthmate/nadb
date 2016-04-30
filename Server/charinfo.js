
var CHARDB = [];

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

const CHARS_LOCATION = "./chardb/";

var fs = require('fs');
var char_file_list = fs.readdirSync(CHARS_LOCATION);
for (var i=0;i<=char_file_list.length-1; i++) {
	if(char_file_list[i].indexOf("json") > 0) CHARDB.push(JSON.parse(fs.readFileSync(CHARS_LOCATION + char_file_list[i])));
}