var express = require('express');
var http = require('http');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var config = require('./static/js/configuratrion.js');

var app = express();

mongoose.connect('mongodb://198.199.84.144/test');
var db = mongoose.connection;
var Drawing;

//static files that we need to use in index.html
app.use('/static', express.static(__dirname + '/static/'));
app.use('/angular', express.static(__dirname + '/angular/'));
app.use('/node_modules', express.static(__dirname + '/node_modules/'));
app.use('/views', express.static(__dirname + '/views/'));

app.use(bodyParser.json());

//handles if you actually want to go to index
app.get('/', index);

app.post('/api/save/', saveDrawing);

app.get('/api/getDrawingByName/:name', getDrawingByTitle);

app.get('/api/topTen', getTop10);

app.get('/api/all', getAll);

//this is for angular routing
app.get('*', index);

function index(req, res){
	res.sendFile(__dirname + '/index.html');
};

function saveDrawing(req, res){
	var segSize = req.body.segments.length;
	for(var i = 0; i < segSize; i++){
		req.body.segments[i][1] /= 1040;
		req.body.segments[i][2] /= 519;
	}
	var reqDrawing = new Drawing({
		segments: req.body.segments,
		author: req.body.author,
		title: req.body.title,
		votes: req.body.votes
	});
	reqDrawing.save(function(err){
		if(err) return handleError(err);
		res.send(reqDrawing);
	});
};

function getTop10(req, res){
	Drawing.find().sort('-votes').limit(12).exec(function(err, drawings){
		res.send(drawings);
	});
};

function getDrawingByTitle(req, res){
	Drawing.find({title: req.params.name}, function(err, drawings){
		console.log(drawings);
	});
};

function getAll(req, res){
	Drawing.find().exec(function(err, drawings){
		res.send(drawings);
	});
};

db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function(){

	console.log('connected to mongodb');

	var drawingSchema = mongoose.Schema({
		segments: Array,
		author: String,
		title: String,
		votes: Number
	});

	Drawing = mongoose.model('Drawing', drawingSchema);

});

var server = app.listen(config.port);
console.log("Express server listening on port "+ config.port);


