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
				for(tag in char_tag_index[character]) {
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
function intersect_all(lists)
{
    if (lists.length == 0) return [];
    else if (lists.length == 1) return lists[0];

    var partialInt = lists[0];
    for (var i = 1; i < lists.length; i++)
    {
        partialInt = intersection(partialInt, lists[i]);
    }
    return partialInt;
}
function getInfo(req, res) {

	var query = req.url.substr(req.url.indexOf("searchquery")+12).toLowerCase().replace(/\++/g, "+").replace(/^\+/g, "");

	var taglist = query.split("+");
	for(tag in taglist) {
		if(taglist[tag].length==0) taglist.splice(tag, 1);
	}

	var response_list = [];
	if(query == "all") {
		for(var i=0; i<=CHARDB.length-1; i++) response_list.push(CHARDB[i]);
		res.send(response_list);
		return;
	}
	if(query === null) {
		res.send(response_list);
		return;
	}

	var matches = [];
	for(tag in taglist) {
		matches.push([]);
		for(tagname in TAG_INDEX) {
			if(tagname.indexOf(taglist[tag]) == 0) {
				if(matches[0].length == 0) matches[0] = TAG_INDEX[tagname].slice();
				else {
					matches[0] = matches[0].concat(TAG_INDEX[tagname].slice());
				}
			}
		}
	}
	matches = intersect_all(matches);

	for(match in matches) {
		response_list.push(getCharacterById(matches[match]));
	}

	res.setHeader("cache-control", "max-age=3600");
	res.send(response_list);
}

module.exports.getInfo = getInfo;
module.exports.load = loadData;
module.exports.unload = unloadData;
