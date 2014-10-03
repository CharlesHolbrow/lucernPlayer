var bodyParser = require('body-parser');
var express = require('express');
var app = express();

app.use(bodyParser());

app.use('/static', express.static(__dirname + '/static'));
app.use('/img', express.static(__dirname + '/static/img'));
app.use('/js', express.static(__dirname + '/static/js'));
app.use('/json', express.static(__dirname + '/../'));


app.get('/', function(req, res){
  res.sendFile(__dirname + '/static/index.html');
});

app.post('/sound', function(req, res){
  console.log(req.body);
  res.status(200).end();
});

var server = app.listen(3000, function() {
  console.log('Listening on port %d', server.address().port);
});
