window.allData = null;
window.dataByFileCount = null;
window.dataByWords = null;

//PARAMETERS
var smallestFontSize = 40;
var largestFontSize = 70;
var lowestOpacity = 0.6;
var highestOpacity = 1.0;
var wordClusterWidthScale = 0.25;
var wordClusterHeightScale = 0.6;
var wordClusterX = 150;
var wordClusterY = 150;
var initalAngularVelocityRange = 0.05;
var colorPalette = ["#888888", "#9999aa", "#bbbbbb", "#FFFFFF", "#000000","#000000","#FFFFFF"];

var WordAnimGlobal = {};

WordAnimGlobal.onMouseEnter = function(wordObject){
  WordAnimGlobal.playSound(wordObject.text);

  // animate size
  if (typeof wordObject.originalFontSize !== 'number') 
    this.originalFontSize = this.size;
  this.animate({
    size: this.originalFontSize + 10,
  }, {
    duration: 500,
    easing: "ease-in-out-quadratic",
    callback: function(){
      this.animate({
        size: this.originalFontSize
      }, {
        duration: 600,
        easing: "ease-in-out-quadratic"
      })
    }
  });
};

WordAnimGlobal.playSound = function(text){
  $.post('/sound', {data:dataByWords[text]}, function(data, textStatus, jqXHR){
    if (textStatus !== 'success'){
      console.warn(textStatus, jqXHR);
    }
  });
};

window.proceed = function(){

  var words = Object.keys(dataByWords);
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
    
    var opacities = repeatStoreInArray(function(){return randomNumberBetween(lowestOpacity, highestOpacity)}, words.length);
    var positionYGradient = linearGradientBetween(0, 1.0, words.length);
    // array of arrays
    var wordsAndParameters = _.zip(words, fontGradient, colors, opacities, positionYGradient);

    console.log(colors);
    console.log(opacities);

    var parentRectangle = canvas.display.rectangle({
      width: canvas.width * wordClusterWidthScale,
      height: canvas.height * wordClusterHeightScale,
      x: x,
      y: y,
      origin: {x: "left", y: "top"},
      fill: 'rgba(256, 0, 0, 0.5)'
    }).add();

    var wordObjects = wordsAndParameters.map(function(paramaters, index){
      var text = paramaters[0];
      var fontSize = paramaters[1];
      var color = paramaters[2];
      var opacity = paramaters[3];
      var positionY = paramaters[4];

      return canvas.display.text({
        x: Math.random()*parentRectangle.width,
        y: positionY*parentRectangle.height,
        origin: {x: "center", y:"center"},
        text: text,
        fill: color,
        shapeType: "rectangular",
        index: index,
        font: 'ChaparralPro-Bold',
        size: fontSize,
        opacity: opacity,
        omega: randomNumberBetween(-initalAngularVelocityRange, initalAngularVelocityRange)
      });
    })

    _.each(wordObjects, function(wordObject){
      wordObject.bind('mouseenter touchenter', function(){
        WordAnimGlobal.onMouseEnter.call(wordObject, wordObject);
      });
    });

    _.each(wordObjects, function(value){parentRectangle.addChild(value);});
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
    var k1 = 0.0003;//acceleration of gravity
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
    if(text.x > canvas.width + text.width){
      text.x = -text.width;
    }
    if(text.x < -text.width){
      text.x = canvas.width + text.width
    }
    if(text.y > canvas.height + text.height){
      text.y = -text.height;
    }
    if(text.y < -text.height){
      text.y = canvas.height + text.height;
    }
  }


  canvas.setLoop(function(){
    _.each(wordCluster, function(value){
      // brownian(value);
      // flutter(value);
      // forceField(value);
      // recycle(value);
    });

  });
  canvas.timeline.start();
  wind();
}