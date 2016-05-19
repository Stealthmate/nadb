const CHARS_LOCATION = "./chardb/";
const TAG_INDEX_FILE = "tags.json";
const Logger = require('./logger.js');

var CHARDB = [];

var TAG_INDEX = {};

function loadData() {
	
	var fs = require('fs');
	var n_err = 0;
	Logger.log("Reading character data...", Logger.LVL_INFO);
	
	var currently_reading = "";
	
	try {
		var char_folder_list = fs.readdirSync(CHARS_LOCATION);
		for (var i=0;i<=char_folder_list.length-1; i++) {
			var stats = fs.statSync(CHARS_LOCATION+char_folder_list[i]);
			if (stats.isDirectory()) {
				Logger.log("Loading " + char_folder_list[i] + ".json...", Logger.LVL_INFO);
				currently_reading = char_folder_list[i] + ".json";
				var jsonpath = CHARS_LOCATION+char_folder_list[i]+"/"+char_folder_list[i]+".json";
				var charinfo = fs.readFileSync(jsonpath, "utf-8");
				CHARDB.push(JSON.parse(charinfo).charinfo);
			}
		}
		
		Logger.log("Finished reading character data.", Logger.LVL_INFO);
		
		Logger.log("Reading tag index...", Logger.LVL_INFO);
		currently_reading = CHARS_LOCATION + TAG_INDEX_FILE;
		var stats = fs.statSync(CHARS_LOCATION+TAG_INDEX_FILE);
		if (stats.isFile()) {
			var char_tag_index = JSON.parse(fs.readFileSync(CHARS_LOCATION+TAG_INDEX_FILE, "utf-8"));
			for(character in char_tag_index) {
				//Logger.log(character);
				for(tag in char_tag_index[character]) {
					//Logger.log(char_tag_index[character][tag]);
					if(TAG_INDEX[char_tag_index[character][tag]] == null) TAG_INDEX[char_tag_index[character][tag]] = [];
					TAG_INDEX[char_tag_index[character][tag]].push(character);
				}
			}
		}
		
		Logger.log("Finished reading tag index.", Logger.LVL_INFO);
		
	} catch (e) {
		Logger.log("Could not read " + currently_reading, Logger.LVL_ERROR);
		Logger.log(e, Logger.LVL_ERROR)
		n_err++;
	}
	
	Logger.log("Loaded character data. (" + n_err + " errors)");
}

function unloadData() {
	Logger.log("Unloading character data...", Logger.LVL_INFO);
	CHARDB = [];
	TAG_INDEX = {};
}

function contains(arr, k) {
  for(var i=0; i < arr.length; i++){
    if( arr[i] === k || ( arr[i] !== arr[i] && k !== k ) ){
      return true;
    }
  }
  return false;
}

function getCharacterById(id) {
	for(chars in CHARDB) {
		if(CHARDB[chars].id == id) return CHARDB[chars];
	}
	
	Logger.log("Could not find character by id: " + id, Logger.LVL_ERROR);
}

function getInfo(req, res) {
	
	var query = req.url.substr(req.url.indexOf("searchquery")+12).toLowerCase().replace(/\++/g, "+").replace(/^\+/g, "");

	var taglist = query.split("+");
	for(tag in taglist) {
		if(taglist[tag].length==0) taglist.splice(tag, 1);
	}
	
	var response_list = [];
	if(query === "all") {
		for(var i=0; i<=CHARDB.length-1; i++) response_list.push(CHARDB[i].charinfo);
		res.send(response_list);
		return;
	}
	if(query === null) {
		res.send(response_list);
		return;
	}
	
	var matches = [];
	for(tag in taglist) {
		for(tagname in TAG_INDEX) {
			if(tagname.indexOf(taglist[tag]) == 0) {
				console.log("Found " + taglist[tag] + " in " + tagname + " " + matches.length)
				console.log(TAG_INDEX);
				if(matches.length == 0) matches = TAG_INDEX[tagname].slice();
				else {
					for(matchtag in TAG_INDEX[tagname]) {
						if(!contains(matches, TAG_INDEX[tagname][matchtag])) matches.splice(matchtag, 1);
					}
				}
			}		
		}
	}
	
	Logger.log("Returning characters: ", Logger.LVL_VERBOSE);
	Logger.log(matches, Logger.LVL_VERBOSE)
	
	for(match in matches) {
		response_list.push(getCharacterById(matches[match]));
	}

	res.send(response_list);
}

module.exports.getInfo = getInfo;
module.exports.load = loadData;
module.exports.unload = unloadData;
