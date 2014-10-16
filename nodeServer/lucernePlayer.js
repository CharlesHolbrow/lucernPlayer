var osc = require('node-osc');


module.exports = SoundPlayer = function(port){
  this.port = port || 3333;
  this.client = new osc.Client('127.0.0.1', 3333); 
};

SoundPlayer.prototype = {

play: function(name, stereo){
  var number = stereo ? 0 : Math.floor(Math.random() * 9); // 0 to 8, inclusive
  var volume = Math.random() * 0.5 + 0.5;
  volume = 0.7; // hack
  this.client.send('/' + name, volume, number, number + 1);
}

}; // SoundPlayer.prototype

