const LOG_LEVELS = [
{lvl:65565, msg:"System: ", name:"system"},
{lvl:1, msg:"Verbose: ", name:"verbose"}, 
{lvl:2, msg:"Info: ", name:"info"},
{lvl:3, msg:"Warning: ", name:"warning"},
{lvl:4, msg:"Error: ", name:"error"}];

var LOG_LEVEL = 0;

function logfunc(msg, level) {
	
	if(typeof level === 'undefined') level = LOG_LEVELS[0];
	if(level.lvl >= LOG_LEVEL) {
		process.stdout.clearLine();
		process.stdout.cursorTo(0);
		console.log(level.msg+msg);
	}
}

function setLogLevel(lvl) {
	
	for(var i=1;i<=LOG_LEVELS.length-1;i++) {
		if(lvl === LOG_LEVELS[i].name) {
			logfunc("Setting log level to " + LOG_LEVELS[i].name);
			LOG_LEVEL = LOG_LEVELS[i].lvl;
			return;
		}
	}
	
	var loglvls = "";
	for(var i=1;i<=LOG_LEVELS.length-1;i++) {
		loglvls = loglvls + ("\n\t" + LOG_LEVELS[i].name);
	}

	logfunc("Invalid log level. Log levels can be:"+loglvls);
}

module.exports.log = logfunc;
module.exports.LVL_VERBOSE = LOG_LEVELS[1];
module.exports.LVL_INFO = LOG_LEVELS[2];
module.exports.LVL_WARNING = LOG_LEVELS[3];
module.exports.LVL_ERROR = LOG_LEVELS[4];
module.exports.setLogLevel = setLogLevel;