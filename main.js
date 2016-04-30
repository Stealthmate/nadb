//const HOST = "192.168.100.2";
const PORT = 80;

const INDEX = "index.html"

const RES_ROOT = __dirname+"/";
console.log(__dirname)
var express = require('express');
var app = express();
var FS = require('fs');

var charinfo = require('./charinfo.js');

function getResource(req, res) {
	
	var path = RES_ROOT + req.url.replace("resource", "frontend");
	FS.stat(path, 
		function (err, stats) {
			if (err) {
			   return console.error(err);
		   }
		   
		   // Check file type
		   if(stats.isFile()) {
			   console.log("OK!");
			   res.sendFile(path);
		   } 		
		})
}

app.get('/charinfo', charinfo.getInfo);

app.get('/resource/*', getResource);

app.get('/', function (req, res) {
	var len = Object.keys(req.query).length;
	console.log(req.query);
	if(len == 0) {
			console.log("Sending index");
			res.setHeader('content-type', 'text/html');
			res.sendFile(RES_ROOT + "frontend/" + INDEX)
	}
})

var server = app.listen(PORT, function () {
		var host = server.address().address;
		var port = server.address().port;
		console.log(host + " " + port);
	})
