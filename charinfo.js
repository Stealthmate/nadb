const CHARS_LOCATION = "./chardb/";

const Logger = require('./logger.js');

var CHARDB = [];

function loadData() {
	
	var fs = require('fs');
	var n_err = 0;
	Logger.log("Reading character data...", Logger.LVL_INFO);
	var char_folder_list = fs.readdirSync(CHARS_LOCATION);
	for (var i=0;i<=char_folder_list.length-1; i++) {
		try {
			var stats = fs.statSync(CHARS_LOCATION+char_folder_list[i]);
			if (stats.isDirectory()) {
				Logger.log("Loading " + char_folder_list[i] + ".json...", Logger.LVL_INFO);
				var jsonpath = CHARS_LOCATION+char_folder_list[i]+"/"+char_folder_list[i]+".json";
				var charinfo = fs.readFileSync(jsonpath, "utf-8");
				CHARDB.push(JSON.parse(charinfo));
			}
		} catch (e) {
			Logger.log("Could not read " + char_folder_list[i]+".json.", Logger.LVL_ERROR);
			n_err++;
		}
	}
	
	Logger.log("Loaded character data. (" + n_err + " errors)");
}

function unloadData() {
	Logger.log("Unloading character data...", Logger.LVL_INFO);
	CHARDB = [];
}

function getInfo(req, res) {
	
	var query = req.url.substr(req.url.indexOf("searchquery")+12).toLowerCase();
	var taglist = query.split("+");
	
	var response_list = [];
	if(query === "all") {
		for(var i=0; i<=CHARDB.length-1; i++) response_list.push(CHARDB[i].charinfo);
		res.send(response_list);
		return;
	}
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
module.exports.load = loadData;
module.exports.unload = unloadData;
