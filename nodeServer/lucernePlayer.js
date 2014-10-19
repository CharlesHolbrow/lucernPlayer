var osc = require('node-osc');


module.exports = SoundPlayer = function(port){
  this.port = port || 3333;
  this.client = new osc.Client('127.0.0.1', 3333); 
};

SoundPlayer.prototype = {

play: function(filename, volume, stereo){
  volume = (typeof volume === 'number') ? volume : 0.5;
  var number = stereo ? 0 : Math.floor(Math.random() * 9); // 0 to 8, inclusive
  console.log('v', volume);
  this.client.send('/' + filename, volume, number, number + 1);
}

}; // SoundPlayer.prototype

