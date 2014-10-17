window.allData = null;
window.dataByFileCount = null;
window.dataByWords = null;

//PARAMETERS
	var smallestFontSize = 40;
	var largestFontSize = 80;
	var lowestOpacity = 0.6;
	var highestOpacity = 1.0;
	var wordClusterWidthScale = 0.25;
	var wordClusterHeightScale = 0.6;
	var wordClusterX = 200;
	var wordClusterY = 100;
	var initalAngularVelocityRange = 0.05;
	var colorPalette = ["#888888", "#9999aa", "#bbbbbb", "#FFFFFF", "#000000","#000000","#FFFFFF"];


window.proceed = function(){
	if (!allData || !dataByFileCount || !dataByWords) return;

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

	function getTextAndSounds(){//0 indexed
		return $.get("http://localhost:4730/data", function(data){
		})
	}

	var textAndSounds = [{"text":"Fire","sounds":["http://symphonyforlucerne.ch/upload/upload/Lucerne.trotamundo.Brunnen vor dem Krienbrückli.1408045646836.m4a", "http://symphonyforlucerne.ch/upload/upload/Lucerne.GizemGumuskaya.Alpine horn player lets out a yell !.1409505997521.mp3"]},{"text":"Water","sounds":["http://symphonyforlucerne.ch/upload/upload/Lucerne.trotamundo.Rega Helicopter.1408046019441.m4a"]},{"text":"Grass","sounds":["http://symphonyforlucerne.ch/upload/upload/Lucerne.trotamundo.VBL Durchsage.1408218081065.m4a"]},{"text":"Psychic","sounds":["http://symphonyforlucerne.ch/upload/upload/Lucerne.trotamundo.Reuss.1408218527569.m4a"]},{"text":"Ice","sounds":["http://symphonyforlucerne.ch/upload/upload/Lucerne.fawrkes.Sounds of Lost.1408551304852.wav"]},{"text":"Ground","sounds":["http://symphonyforlucerne.ch/upload/upload/Lucerne.Zauberlehrling.im Bus .1408717329808.wav"]},{"text":"Fighting","sounds":["http://symphonyforlucerne.ch/upload/upload/Lucerne.Zauberlehrling.Warten auf den ersten Takt.1408783457466.wav"]},{"text":"Rock","sounds":["http://symphonyforlucerne.ch/upload/upload/Lucerne.GizemGumuskaya.A chanter and an Italian tourist's duo.1409469857248.mp3"]},{"text":"Flying","sounds":["http://symphonyforlucerne.ch/upload/upload/Lucerne.GizemGumuskaya.Alpine Horn on the Chapel Bridge.1409475060258.mp3"]},{"text":"Steel","sounds":["http://symphonyforlucerne.ch/upload/upload/Lucerne.GizemGumuskaya.Young people are jamming by the KKL fountain.1409504081535.mp3"]},{"text":"Ghost","sounds":["http://symphonyforlucerne.ch/upload/upload/Lucerne.GizemGumuskaya.Cowbells.1409504257722.mp3"]}];
	
	var colors = ["#888888", "#9999aa", "#bbbbbb", "#FFFFFF", "#000000","#000000","#FFFFFF"];


	function randomInArray(array){
		return array[Math.floor(Math.random()*array.length)];
	}
	function randomSampleFromArray(array, n){
		return repeatStoreInArray(function(){return randomInArray(array)},n);
	}

	function repeatStoreInArray(f, n){
		var slices = [];
		for(var i = 0; i < n; i++){
			slices.push(f());
		}
		return slices;
	}


	function randomNumberBetween(lower, upper){
		return lower + Math.random()*(upper-lower);
	}
	function linearGradientBetween(lower, upper, n){
		var slices = [];
		var delta = (upper-lower)/n;
		console.log(delta);
		for(var i = 0; i < n; i++){
			slices.push(lower + i * delta);
		}
		return slices;
	}


	function createWordCluster(words, x, y){

		var fontGradient = linearGradientBetween(smallestFontSize, largestFontSize, words.length);
		var colors = randomSampleFromArray(colorPalette, words.length);

		
		console.log(randomNumberBetween(lowestOpacity, highestOpacity))
		var opacities = repeatStoreInArray(function(){return randomNumberBetween(lowestOpacity, highestOpacity)}, words.length);

		var positionYGradient = linearGradientBetween(0, 1.0, words.length);


		var wordsAndParameters = _.zip(words, fontGradient, colors, opacities, positionYGradient);


		console.log(wordsAndParameters); //fontSize, color, opacity

		console.log(colors);
		console.log(opacities);

		var parentRectangle = canvas.display.rectangle({
			width: canvas.width * wordClusterWidthScale,
			height: canvas.height * wordClusterHeightScale,
			x: x,
			y: y,
			origin: {x: "center", y: "center"}
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
			font: 'Chaparral Pro',
			size: fontSize,
			opacity: opacity,
			alpha: 0,
			omega: randomNumberBetween(-initalAngularVelocityRange, initalAngularVelocityRange)
			});
		})

		$.each(wordObjects, function(index, value){
			value.bind("mouseenter touchenter", function(e){
				//alert("TOUCHED" + value.text);
				playSound(value.text);
			});
			parentRectangle.addChild(value);
		});
		return wordObjects;


	}
	var wordCluster = createWordCluster(selectedWords, wordClusterX, wordClusterY);


	
	function playSound(text){
		$.post('/sound', {data:dataByWords[text]}, function(data, textStatus, jqXHR){
      		if (textStatus !== 'success'){
        	console.warn(textStatus, jqXHR);
        	}
      	})
	}


	//ANIMATION
	function wind(){
		var windInterval = 20000;
		setInterval(applyWindForce, windInterval);
	}
	function applyWindForce(){
		$.each(selectedTextObjects, function(index, value){
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
		$.each(wordCluster, function(index, value){
			//brownian(value);
			flutter(value);
			// forceField(value);
			// recycle(value);
		});

	});
	canvas.timeline.start();
	wind();
}