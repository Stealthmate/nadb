var INDEX = "index1.ejs";
const RES_ROOT = __dirname+"/";
var express = require('express');
var app = express();
var FS = require('fs');

const Globals = require('./globals.js');
const Logger = Globals.Logger;

function getResource(req, res) {
	
	var path = RES_ROOT + req.url.replace("resource", "frontend");
	if(path.indexOf('characters') >=0) path = path.replace("frontend/images/characters/", "chardb/");
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

function getDocument(req, res) {
	
	var path = RES_ROOT + req.url.replace("document", "frontend");
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

Globals.ResourceManager.loadResources();
app.set('view engine', 'ejs');

app.get('/charinfo', Globals.CharacterInfo.getInfo);

app.get('/resource/*', getResource);

app.get('/document/*', getDocument);

app.get('/:id?', function (req, res) {
	var url = req.url;
	Globals.cli.pause();
	Logger.log(url);
	Globals.cli.resume();
	res.setHeader('content-type', 'text/html');
	if(url.length==1) res.render(INDEX);
	else {
		res.sendFile(RES_ROOT + "frontend/" + url.substring(1));
	}
})

const PORT = 80;
var server = app.listen(process.env.PORT || PORT, function () {
		var host = server.address().address;
		var port = server.address().port;
		Logger.log("Server is running at " + host + port);
		Globals.cli.start();
	});