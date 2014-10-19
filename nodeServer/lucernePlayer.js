var osc = require('node-osc');

// order to play sounds in
var speakerOrder = [0, 4, 7, 1, 3, 8, 5, 2, 6];
var speakerIndex = 0;

var nextSpeaker = function(){
  var speaker = speakerOrder[speakerIndex];
  if (++speakerIndex >= speakerOrder.length)
    speakerIndex = 0;
  return speaker;
}

module.exports = SoundPlayer = function(port){
  this.port = port || 3333;
  this.client = new osc.Client('127.0.0.1', 3333); 
};

SoundPlayer.prototype = {

play: function(filename, volume, stereo){
  volume = (typeof volume === 'number') ? volume : 0.5;
  var number = nextSpeaker();
  console.log('v', volume, 's', number);
  this.client.send('/' + filename, volume, number, number + 1);
}

}; // SoundPlayer.prototype
