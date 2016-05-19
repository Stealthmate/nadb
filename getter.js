var http = require('http');

var options = {
	host : 'www.naruto-arena.com',
	port : 80,
	path : '/characters-and-skills/'
};

var matcher = /class="description".*/g;

function forchar(err, window) {

	var obj = {
		"charinfo" : {}

	};

	var name = window.$(".description h2").text();
	var desc = window.$(".description .skilldescr").text();
	obj.charinfo.id = name.toLowerCase().replace(/ /g, "_").replace("(", "").replace(")", "");
	obj.charinfo.name = name;
	obj.charinfo.description = desc.replace(/[\n\t]/g, "");
	obj.charinfo.abilities = [];

	var abs = window.$(".charskill");
	abs.each(function (index) {
		var ability = [{}

		];
		ability[0].name = window.$(this).find("h2").text();
		ability[0].description = window.$(this).find(".skilldescr").text().replace(/[\n\t]/g, "");

		var coststring = "";
		var costs = window.$(this).find(".fright img").each(function (index1) {
				if (window.$(this).attr("src").indexOf("energy_0") >= 0)
					coststring = coststring + "t";
				else if (window.$(this).attr("src").indexOf("energy_1") >= 0)
					coststring = coststring + "b";
				else if (window.$(this).attr("src").indexOf("energy_2") >= 0)
					coststring = coststring + "n";
				else if (window.$(this).attr("src").indexOf("energy_3") >= 0)
					coststring = coststring + "g";
				else if (window.$(this).attr("src").indexOf("energy_random") >= 0)
					coststring = coststring + "r";
				//console.log(window.$(this).attr("src").indexOf("energy_0"));

			});

		ability[0].cost = coststring;

		var cd = window.$(this).find(".fleft").text().match(/[0-9]/);
		if (cd === null)
			cd = 0;
		else
			cd = parseInt(cd[0]);
		ability[0].cd = cd;
		ability[0].classes = window.$(this).find(".info").text().substring(10).toLowerCase().split(", ");
		obj.charinfo.abilities.push(ability);
		//console.log(obj.charinfo.abilities)

	})

	//console.log(obj.charinfo.abilities)
	var fs = require('fs');

	var mkdirSync = function (path) {
		try {
			fs.mkdirSync(path);
		} catch (e) {
			if (e.code != 'EEXIST')
				throw e;
		}
	}
	mkdirSync("testfolder/" + obj.charinfo.id);
	fs.writeFile("testfolder/" + obj.charinfo.id + "/" + obj.charinfo.id + ".json", JSON.stringify(obj), function (err) {
		if (err) {
			return console.log(err);
		}

		//console.log("The file was saved!");
	});
}

jsdom = require('jsdom');
async = require('async')
function parse(err, window) {
	console.log(err);
	var chars = window.$("div.description a");
	chars.each(function (index) {

		//console.log(window.$(this).attr("href"));
		jsdom.env(
			"http://www.naruto-arena.com" + window.$(this).attr("href"),
			["http://code.jquery.com/jquery.js"],
			forchar);

	});
	//for(var i=0;i<=chars.length-1;i++) console.log(chars["1"].attr("href"));


}

jsdom.env(
	"http://www.naruto-arena.com/characters-and-skills/",
	["http://code.jquery.com/jquery.js"],
	parse);

/*var req = http.request(options, function (res) {
console.log('STATUS: ' + res.statusCode);
//console.log('HEADERS: ' + JSON.stringify(res.headers));
res.setEncoding('utf8');
var body = [];
res.on('data', function (chunk) {
body.push(chunk);
}).on('end', function () {
body = body.concat().toString();
console.log("Got char list");
parse(body);
});
});

req.on('error', function (e) {
console.log('problem with request: ' + e.message);
});

// write data to request body
req.write('data\n');
req.write('data\n');
req.end();
*/