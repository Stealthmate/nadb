const ERR_INVALID_CMD = "Invalid command.";
const ERR_NO_PARAMS = "No parameters were passed.";
const ERR_INVALID_PARAM = "Invalid parameter.";

const Logger = require('./logger.js');

function setLogLevel(lvl) {
	Logger.setLogLevel(lvl);
}

function reload() {
	const charinfo = require('./charinfo.js');
	charinfo.unload();
	
	if(global.gc) {
		Logger.log("Running garbage collector...", Logger.LVL_INFO);
		global.gc();
	}
	else Logger.log("Garbage collector not exposed. Cannot immediately clear resources.", Logger.LVL_WARNING);
	
	charinfo.load();
}

function set(arglist) {

	try {
		if(arglist.length == 0) {
			throw (ERR_NO_PARAMS);
			return;
		}
		
		var property = arglist[0];
		
		switch (property) {
			case "loglvl" : {
				if(typeof arglist[1] === 'undefined') {
					var err = ERR_INVALID_PARAM + " No value to set.";
					throw (err);
					return;
				}
				
				setLogLevel(arglist[1]);
				
			} break;
			
			default: {
				throw (ERR_INVALID_PARAM);
				return;
			}
		}
	} catch (err) {
			Logger.log(err, Logger.LVL_ERROR);
	}
}

const CMD_MAP = [

{cmd:"reload", execute:reload},
{cmd:"set", execute:set}

];

var rl;

function exec_cmd(line) {
	var input = line.trim() + " ";
		var cmd = input.substring(0, input.indexOf(" "));
		
		var args = input.substring(input.indexOf(" ")+1, input.length-1).split(" ");
		for(var i = 0; i<=CMD_MAP.length-1; i++) {
			if(CMD_MAP[i].cmd==cmd) CMD_MAP[i].execute(args);
		}
	
		if(typeof rl !== 'undefined') rl.prompt();
}

function cli() {
	const readline = require('readline');
	rl = readline.createInterface(process.stdin, process.stdout);
	rl.prompt();
	rl.on('line', exec_cmd);
	rl.on('close', () => {
		console.log('And now we part company.');
		process.exit(0);
	});
}


//3l!73 h4x0r func
function fixfunc() {
	var input = process.stdin.read();
	if (input == null)
		return;
	input = input.toString("utf-8");
	process.stdin.removeListener('readable', fixfunc);
	process.stdin.resume();
	exec_cmd(input);
	cli();
}

function start() {
	process.stdin.pause();
	process.stdin.on('readable', fixfunc);
	process.stdout.write("> Welcome back, Commander!\n> ");
}

module.exports.start = start;
