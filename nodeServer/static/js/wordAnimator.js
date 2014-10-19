window.allData = null;
window.dataByFileCount = null;
window.dataByWords = null;

var fadeOutTime = 5000;
var fadeInTime = 3000;

var images = [
	"bridge_river_city.jpg",			
	"street_old_city_centre.jpg",
	"bridge_tower_mountains_river.jpg",	
	"title.jpg",
	"cow.jpg",					
	"title_bar_restaurant.jpg",
	"ducks_swans_water.jpg",			
	"title_dockyard_construction.jpg",
	"marketscene.jpg",				
	"title_harbor_ship.jpg",
	"nature_gras_mountains.jpg",		
	"title_market.jpg",
	"nature_mountains.jpg",			
	"title_park.jpg",
	"nature_rocks_mountains.jpg",		
	"title_tod_trainstation.jpg",
	"nature_small-lake2.jpg",			
	"water_city_mountains.jpg",
	"nature_small_lake.jpg",			
	"water_city_nature.jpg",
	"orchestra1.jpg",				
	"water_lake_city2.jpg",
	"orchestra2.jpg",				
	"water_river_city_night.jpg",
	"organ.jpg",				
	"water_river_lake_city.jpg",
	"panorama_bridge_city.jpg",		
	"yodel.jpg"
]



var wordClusterParameters1 = {
	smallestFontSize:60,
	largestFontSize:100,
	lowestOpacity:0.6,
	highestOpacity:1.0,
	wordClusterWidthScale:0.25,
	wordClusterHeightScale:0.6,
	initalAngularVelocityRange:0.05,
	colorPalette:["#888888","#9999aa","#bbbbbb","#FFFFFF","#000000","#000000","#FFFFFF"]
}
var wordClusterParameters2 = {
	smallestFontSize:60,
	largestFontSize:100,
	lowestOpacity:0.6,
	highestOpacity:1.0,
	wordClusterWidthScale:0.1,
	wordClusterHeightScale:0.2,
	initalAngularVelocityRange:0.05,
	colorPalette:["#222222","#111111","#111111","#000000","#000000","#FFFFFF","#FFFFFF"]
}
var wordClusterLayout = [
	{
		wordClusterParameters: wordClusterParameters1,
		x: 200,
		y: 100,
		numberOfWords: 10
	},
	{
		wordClusterParameters: wordClusterParameters2,
		x: 1300,
		y: 700,
		numberOfWords: 3
	}
]

window.proceed = function(){
	if (!allData || !dataByFileCount || !dataByWords) return;

	var allWords = Object.keys(dataByWords);
	var canvas = oCanvas.create({ canvas: "#canvas", background: "#222" });	

	var image = canvas.display.image({
	x: 0,
	y: 0,
	origin: { x: "left", y: "top" },
	image: "img/title.jpg"
	});

	canvas.addChild(image);
	//var selectedWords = randomSampleFromArray(words, 10);
	//console.log(selectedWords);

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


	function createWordCluster(words, x, y, p){//p for parameters

		var fontGradient = linearGradientBetween(p.smallestFontSize, p.largestFontSize, words.length);
		var colors = randomSampleFromArray(p.colorPalette, words.length);

		
		console.log(randomNumberBetween(p.lowestOpacity, p.highestOpacity))
		var opacities = repeatStoreInArray(function(){return randomNumberBetween(p.lowestOpacity, p.highestOpacity)}, words.length);

		var positionYGradient = linearGradientBetween(0, 1.0, words.length);


		var wordsAndParameters = _.zip(words, fontGradient, colors, opacities, positionYGradient);


		console.log(wordsAndParameters); //fontSize, color, opacity

		console.log(colors);
		console.log(opacities);

		var parentRectangle = canvas.display.rectangle({
			width: canvas.width * p.wordClusterWidthScale,
			height: canvas.height * p.wordClusterHeightScale,
			x: x,
			y: y,
			origin: {x: "center", y: "center"}
		}).add();
		var wordObjects = wordsAndParameters.map(function(parameters, index){
			var text = parameters[0];
			var fontSize = parameters[1];
			var color = parameters[2];
			var opacity = parameters[3];
			var positionY = parameters[4];

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
			alpha: 0,
			omega: randomNumberBetween(-p.initalAngularVelocityRange, p.initalAngularVelocityRange)
			});
		})

		$.each(wordObjects, function(index, value){
			// value.bind("mouseenter touchenter", function handler(e){
			// 	playSound(value.text);

			// 	//Once sound played unbind
			// 	value.unbind("mouseenter touchenter", handler);

			// });
			bindSound(value);
			parentRectangle.addChild(value);
		});
		return wordObjects;
	}

	function bindSound(word){
		word.bind("mouseenter touchenter", function handler(e){
				playSound(word.text);

				//Once sound played unbind
				word.unbind("mouseenter touchenter", handler);

				//Then replace word
				replaceWord(word);


			});
	}


	var wordClusters = wordClusterLayout.map(function(value, index){
		var chosenWords = randomSampleFromArray(allWords, value.numberOfWords);
		console.log(value);
		console.log(chosenWords);
		return createWordCluster(chosenWords, value.x, value.y, value.wordClusterParameters);
	})
	console.log(wordClusters);


	function playSound(text){
		$.post('/sound', {data:dataByWords[text]}, function(data, textStatus, jqXHR){
      		if (textStatus !== 'success'){
        	console.warn(textStatus, jqXHR);
        	}
      	})
	}
	function replaceWord(word){
		word.fadeOut(fadeOutTime, "ease-in-out-cubic", function(){
			//once word faded out...
			word.text = randomInArray(allWords);
			bindSound(word);
			word.fadeIn(fadeInTime, "ease-in-out-cubic");
		});
	}

	function changeImage(){
		var newImage = canvas.display.image({
			x: 0,
			y: 0,
			origin: { x: "left", y: "top" },
			image: "img/"+randomInArray(images),
			zIndex: "back"
		});

		canvas.addChild(newImage);
		newImage.zIndex = "back"; //must be after adding
		console.log(newImage.zIndex);
		image.fadeOut(fadeOutTime, "ease-in-out-cubic", function(){
			image.remove();
			image = newImage;
		}); 

	}

	function slideShow(){
		var interval = 20000;
		setInterval(changeImage, interval);
	}



	//ANIMATION
	function wind(){
		var windInterval = 20000;
		setInterval(applyWindForce, windInterval);
	}
	function applyWindForce(){
		//NO LONGER WORKS
		// $.each(selectedTextObjects, function(index, value){
		// 	value.omega = value.omega + 2 - 4*Math.random();
		// 	northWind = 0.5 - Math.random();
		// });

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
		$.each(wordClusters, function(index, wordCluster){
			$.each(wordCluster, function(index, word){
				flutter(word);
				//brownian(value);
				// forceField(value);
				// recycle(value);
			});
		});
	});
	canvas.timeline.start();
	slideShow();
}