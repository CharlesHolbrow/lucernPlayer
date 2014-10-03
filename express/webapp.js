var bodyParser = require('body-parser');
var express = require('express');

var SoundPlayer = require('./lucernePlayer.js');
var player = new SoundPlayer();

var app = express();
app.use(bodyParser());
app.use('/static', express.static(__dirname + '/static'));
app.use('/img', express.static(__dirname + '/static/img'));
app.use('/js', express.static(__dirname + '/static/js'));
app.use('/json', express.static(__dirname + '/../'));

// hack
var osc = require('node-osc');
client = new osc.Client('127.0.0.1', 3334);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/static/index.html');
});

app.post('/off', function(req, res){
  client.send('/off');
  console.log('off')
  res.status(200).end();
});

app.post('/sound', function(req, res){
  res.status(200).end();
  var data = req.body.data;
  if (!data) {
    console.warn("Warning, no data on /sound post");
    return;
  }

  // choose a random sample
  var random = Math.floor(Math.random() * (data.length)); 
  if (!data[random]){
    console.error('webapp.js: erroneous conclusion about Math.random');
    return;
  }
  var fullname = data[random].fullname;
  console.log('playing:', fullname);
  player.play(data[random].fullname, false);

});

var server = app.listen(3000, function() {
  console.log('Listening on port %d', server.address().port);
});
