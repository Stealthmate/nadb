var INDEX = "index.html";
const RES_ROOT = __dirname+"/";
var express = require('express');
var app = express();
var FS = require('fs');
var Logger = require('./logger.js');
function getResource(req, res) {
	
	var path = RES_ROOT + req.url.replace("resource", "frontend");
	FS.stat(path, 
		function (err, stats) {
			if (err) {
			   return Logger.log(err, Logger.LVL_ERROR);
		   }
		   
		   // Check file type
		   if(stats.isFile()) {
			   res.sendFile(path);
		   } 		
		})
}


var charinfo = require('./charinfo.js');
charinfo.load();
	
app.get('/charinfo', charinfo.getInfo);

app.get('/resource/*', getResource);

app.get('/', function (req, res) {
	var len = Object.keys(req.query).length;
	Logger.log(req.query);
	if(len == 0) {
			res.setHeader('content-type', 'text/html');
			res.sendFile(RES_ROOT + "frontend/" + INDEX)
	}
})

const PORT = 80;
var server = app.listen(process.env.PORT || PORT, function () {
		var host = server.address().address;
		var port = server.address().port;
		Logger.log("Server is running at " + host + port);
		require("./cli.js").start();
	});