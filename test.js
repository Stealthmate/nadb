const readline = require('readline');
var rl;

function init() {
	rl = readline.createInterface(process.stdin, process.stdout);

	rl.setPrompt('OHAI> ');

	rl.on('line', (line) => {
			switch (line.trim()) {
			case 'hello':
				console.log('world!');
				break;
			default: 
				console.log('Say what? I might have heard `' + line.trim() + '`');
				break;
			}
			rl.prompt();
		}).on('close', () => {
			console.log('Have a great day!');
			process.exit(0);
		});
}
