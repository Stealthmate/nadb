const ERR_INVALID_CMD = "System: Invalid command.";
const ERR_NO_PARAMS = "System: No parameters were passed.";
const ERR_INVALID_PARAM = "System: Invalid parameter.";


function setLogLevel(lvl) {
	require('./logger.js').setLogLevel(lvl);
}

function reload() {}

function set(arglist) {

	try {
		if(arglist.length == 0) {
			throw (ERR_NO_PARAMS);
			return;
		}
		
		var property = arglist[0];
		
		switch (property) {
			case "loglvl" : {
				if(arglist[1] === undefined) {
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
			console.log(err);
	}
}

const CMD_MAP = [

{cmd:"reload", execute:reload},
{cmd:"set", execute:set}

];

function start() {
	const readline = require('readline');
	const rl = readline.createInterface(process.stdin, process.stdout);

	console.log("> Welcome, Commander!");
	rl.setPrompt('> ');
	rl.prompt();

	rl.on('line', (line) => {

			var input = line.trim() + " ";
			var cmd = input.substring(0, input.indexOf(" "));
			var args = input.substring(input.indexOf(" ")+1).split(" ");
			
			for(var i = 0; i<=CMD_MAP.length-1; i++) {
				if(CMD_MAP[i].cmd==cmd) CMD_MAP[i].execute(args);
			}
		
			rl.prompt();
		}).on('close', () => {
			console.log('And now we part company.');
			process.exit(0);
		});
}

module.exports.start = start;
