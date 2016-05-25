const QUERY_URL = "charinfo";
const QUERY_METHOD = "get";


var shouldprocess = true;
var charobjs = [];


function generateSuggestions(response) {
	if(!shouldprocess) {
		return;
	}

	charobjs = response;

	shouldprocess=false;

	if(SEARCHPANE_FUNCS) {
		SEARCHPANE_FUNCS.populate(charobjs);
	}
}

function query_error(err) {
	console.log(err);
}

var QUERY_OBJ = {
	url: QUERY_URL,
	type: QUERY_METHOD,
	data: {
		searchquery: ""
	},
	success: generateSuggestions,
	error: query_error
}


function updateSuggestions(query) {

	charobjs = [];

	if(query.length == 0) {
		query="all";
	}

	shouldprocess = false;

	QUERY_OBJ.data.searchquery = query;
	$.ajax(QUERY_OBJ);

	shouldprocess = true;
}

var SEARCH_FUNCS = {};
SEARCH_FUNCS.query = updateSuggestions;
