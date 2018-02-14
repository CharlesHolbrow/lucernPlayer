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
  var volume = 0.4;
  var fullname = req.body.fullname;
  if (fullname) res.status(200).end();
  else {
    res.status(500).end()
    console.warn("Warning, no fullname on /sound post", req.body);
    return;
  }
  if (req.body.words){
    // Back when I first did this demo at member's week in 2014 some samples
    // were much louder than others. I tried to compensate for this with the
    // lines of code below. In the next version, I more carefully curated the
    // samples, so I'm commenting out the lines below.

    // volume = (_(req.body.words).indexOf('yodeler') === -1) ? volume : 2;
    // volume = (_(req.body.words).indexOf('orchestra') === -1) ? volume : 2;
    // volume = (_(req.body.words).indexOf('alpenhorn') === -1) ? volume : 2;
  }

  console.log('playing:', fullname, '@' + volume);
  player.play(fullname, volume, false);

});

var server = app.listen(3000, function() {
  console.log('Listening on port %d', server.address().port);
});
