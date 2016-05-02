const charinfo = require('./charinfo.js');



function load() {
	charinfo.load();
}

function unload() {
	charinfo.unload();
}

module.exports.loadResources = load;
module.exports.unloadResources = unload;