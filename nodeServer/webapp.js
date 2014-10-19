// npm modules
var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

// local modules
var SoundPlayer = require('./lucernePlayer.js');
var player = new SoundPlayer();

var app = express();
app.use(express.static(__dirname + '/static'));
app.use('/json', express.static(__dirname + '/../'));
app.use(bodyParser.urlencoded({limit:'400kb', extended: true}));

// hack
var osc = require('node-osc');
client = new osc.Client('127.0.0.1', 3334);

app.post('/off', function(req, res){
  client.send('/off');
  console.log('off')
  res.status(200).end();
});

app.post('/sound', function(req, res){
  var fullname = req.body.fullname;
  if (fullname) res.status(200).end();
  else {
    res.status(500).end()
    console.warn("Warning, no fullname on /sound post");
    return;
  }

  console.log('playing:', fullname);
  player.play(fullname, false);

});

var server = app.listen(3000, function() {
  console.log('Listening on port %d', server.address().port);
});
