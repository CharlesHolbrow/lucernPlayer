window.allData = null;
window.dataByFileCount = null;
window.dataByWords = null;

//PARAMETERS
var smallestFontSize = 28;
var largestFontSize = 50;
var lowestOpacity = 0.6;
var highestOpacity = 1.0;
var wordClusterWidthScale = 0.25;
var wordClusterHeightScale = 0.6;
var wordClusterX = 150;
var wordClusterY = 150;
var initalAngularVelocityRange = 0.05;
var wordSpacingYRatio = 0.5;
// 
var fadeTimeMin = 1000;
var fadeInTimeMax = 3500;
var maxWordLife = 12000;
var minWordLife = 9000;

var colorPalette = ["#888888", "#9999aa", "#bbbbbb", "#FFFFFF", "#000000","#000000","#FFFFFF"];

var WordAnimGlobal = {};

WordAnimGlobal.wordObjects = [];

WordAnimGlobal.randomizeWord = function(word){

  var textObject = word.children[0];
  var wordLife = randomNumberBetween(minWordLife, maxWordLife);
  var fadeTime = randomNumberBetween(fadeTimeMin, fadeInTimeMax);

  // ensure fade out begins after fade in finishes
  if (wordLife < 3 * fadeTime) wordLife = 3 * fadeTime;
  // after fadeIn, how long do we wait before fading out again?
  var pauseTime = wordLife  - (3 * fadeTime);
  // word must live long enough to finish fadeOut
  if (pauseTime < 100) fadeTime = wordLife * 0.333;

  word.opacity = 0;
  textObject.text = _.sample(WordAnimGlobal.mostToLeast);

  // do the fade
  word.fadeTo(
    randomNumberBetween(lowestOpacity, highestOpacity),
    fadeTime
  );
  textObject.timeout = setTimeout(function(){
    word.fadeOut(fadeTime);
  }, pauseTime + fadeTime);

  // movement
  var xPos = Math.random()*word.parent.width * 0.5;
  var moveLeft = !!(Math.floor(Math.random() * 2));
  word.x = moveLeft ? word.parent.width - xPos : xPos;

  var xTarget = randomNumberBetween(word.parent.width * 0.1, word.parent.width * 0.3);
  if (!moveLeft) xTarget = word.parent.width - xTarget;

  word.animate({
    x: xTarget
  }, {
    easing: 'linear',
    duration: wordLife,
    callback: function(){
      WordAnimGlobal.randomizeWord(word);
      console.log('do it again:', textObject.text);
    }
  });
  return word;
};

WordAnimGlobal.onMouseEnter = function(wordObject){

  var textObject = wordObject.children[0];
  WordAnimGlobal.playSound(textObject.text);

  // animate size
  if (typeof textObject.originalFontSize !== 'number') 
    textObject.originalFontSize = textObject.size;

  textObject.animate({
    size: textObject.originalFontSize + 100,
  }, {
    duration: 700,
    callback: function(){
      textObject.animate({
        size: textObject.originalFontSize
      }, {
        duration: 600,
      })
    }
  });
};

WordAnimGlobal.playSound = function(word){
  $.post('/sound', {data:dataByWords[word]}, function(data, textStatus, jqXHR){
    if (textStatus !== 'success'){
      console.warn(textStatus, jqXHR);
    }
  });
};

window.proceed = function(){

  var words = WordAnimGlobal.words = Object.keys(dataByWords);
  WordAnimGlobal.mostToLeast = _.flatten(_.values(dataByFileCount)).reverse();

  var canvas = oCanvas.create({ canvas: "#canvas", background: "#222" }); 

  var image = canvas.display.image({
    x: 0,
    y: 0,
    origin: { x: "left", y: "top" },
    image: "img/title.jpg"
  });

  canvas.addChild(image);
  var selectedWords = randomSampleFromArray(words, 10);
  console.log(selectedWords);

  var colors = ["#888888", "#9999aa", "#bbbbbb", "#FFFFFF", "#000000","#000000","#FFFFFF"];

  function createWordCluster(words, x, y){

    var fontGradient = linearGradientBetween(smallestFontSize, largestFontSize, words.length);
    var colors = randomSampleFromArray(colorPalette, words.length);
    var positionYGradient = linearGradientBetween(0, wordSpacingYRatio, words.length);
    // array of arrays
    var wordsAndParameters = _.zip(words, fontGradient, colors, positionYGradient);

    var parentRectangle = canvas.display.rectangle({
      width: canvas.width * wordClusterWidthScale,
      height: canvas.height * wordClusterHeightScale,
      x: x,
      y: y,
      origin: {x: "left", y: "top"},
      // fill: 'rgba(0, 0, 0, .5)',
    }).add();

    var wordObjects = wordsAndParameters.map(function(paramaters, index){

      var base = canvas.display.rectangle({
        origin: {x: 'center', y: 'center'};
      });

      var fader = canvas.display.rectangle({
        origin: {x: 'center', y: 'center'};
      });

      var text = paramaters[0];
      var fontSize = paramaters[1];
      var color = paramaters[2];
      var positionY = paramaters[3];

      base.addChild(canvas.display.text({
        x: 0,
        y: positionY*parentRectangle.height,
        origin: {x: "center", y:"center"},
        text: 'init',
        fill: color,
        shapeType: "rectangular",
        index: index,
        font: 'ChaparralPro-Bold',
        size: fontSize,
        omega: randomNumberBetween(-initalAngularVelocityRange, initalAngularVelocityRange)
      }));

      return base;
    })

    _.each(wordObjects, function(wordObject){ 
      wordObject.children[0].bind('mouseenter touchenter', function(){
        WordAnimGlobal.onMouseEnter.call(wordObject, wordObject);
      });
    });

    _.each(wordObjects, function(value){parentRectangle.addChild(value);});

    _.each(wordObjects, WordAnimGlobal.randomizeWord);

    WordAnimGlobal.wordObjects = WordAnimGlobal.wordObjects.concat(wordObjects);
    return wordObjects;
  }

  var wordCluster = createWordCluster(selectedWords, wordClusterX, wordClusterY);

  //ANIMATION
  function wind(){
    var windInterval = 20000;
    setInterval(applyWindForce, windInterval);
  }
  function applyWindForce(){
    $.each(selectedWords, function(index, value){
      value.omega = value.omega + 2 - 4*Math.random();
      northWind = 0.5 - Math.random();
    });

  }
  var northWind = 0.2;
  function vectorField(x, y){

    var nX = x/canvas.width;
    var nY = y/canvas.height;
    var i = nX+1+0.05*nY;
    var j = northWind*(nY+1)+0.05*nX; 

    return [i, j];
  }

  function flutter(text){
    var desired = 0;
    var k1 = 0.0000;//acceleration of gravity
    var b = 0;//damping coefficient

    var forceGravity = k1*(desired - text.rotation);
    var forceDamping = -b*text.omega;
    text.alpha = forceGravity + forceDamping;
    text.omega = text.omega + text.alpha;
    
    text.rotate(text.omega);
  }
  function forceField(text){
    var k = 1;
    var force = vectorField(text.x, text.y);
    text.x = text.x + k*force[0];
    text.y = text.y + k*force[1];
  }
  function brownian(text){
    text.x = text.x + 10 - 20*Math.random();
    text.y = text.y + 10 - 20*Math.random();
    text.rotate(5 - 10*Math.random()); 
  }

  function recycle(text){
    var moved = false
    if(text.x > text.parent.width + text.width){
      text.x = -text.width;
      moved = true;
    }
    if(text.x < -text.width){
      text.x = text.parent.width + text.width
      moved = true;
    }
    if(text.y > text.parent.height + text.height){
      text.y = -text.height;
      moved = true;
    }
    if(text.y < -text.height){
      text.y = text.parent.height + text.height;
      moved = true;
    }
  }


  canvas.setLoop(function(){
    _.each(wordCluster, function(wordObject){
      // brownian(wordObject);
      // flutter(wordObject);
      //forceField(wordObject);
      // recycle(wordObject);
    });

  });
  canvas.timeline.start();
  // wind();
}