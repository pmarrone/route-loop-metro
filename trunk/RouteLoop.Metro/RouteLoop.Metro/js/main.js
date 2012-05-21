var g_SoundManager = null;
var g_gameSpeed = 8;
var g_minSpeed = 2;
var g_maxSpeed = 8;
var g_speedIncrement = 0.25;
var g_gameLevel = -1;
var g_fuel = 0;
var g_goalAreaEnabled = true;
var g_goalAreaX = -1;
var g_goalAreaY = 3;
var g_fuelsToGoal = 0;
var g_canistersCollected = 0;
var g_levelObjects = new Array();
var g_maxFuel = 100;
var g_fuelLossTime = 0;
var g_speedGainTime = 0;
var g_enviroment = 0;
var g_gameStarting = false;
var g_gameRunning = false;
var g_shouldSpeedUp = false;
var g_showGameOver = false;
var g_showingGameOver = false;
var g_waitingForNextLevel = false;
var g_timeBetweenLevels = 3000;
var g_score = 0;
var g_showingLevelUp = false;
var intervalId;

var screenWidth;
var screenHeight;
var scaleFactorX;
var scaleFactorY;

function Game() {
	var tileGrid = null;
	var backBufferCanvas = null;
	var backBuffer = null;
	var context = null;
	var lastFrame = null;
	var self = this;
	var objectToBeAdded = new Array();
	var objectToDeleted = new Array();
	
	this.sortObjects = function() {
		gameObjects.sort(function(a,b){return a.zOrder - b.zOrder;});
    }
	this.resources = null;
	this.startGame = function() {
		// calculate the time since the last frame
		canvas = document.getElementById('canvas');
	
		backBufferCanvas = document.createElement('canvas');
		backBufferCanvas.width = canvas.width;
		backBufferCanvas.height = canvas.height;
		backBuffer = backBufferCanvas.getContext('2d');

		context = canvas.getContext('2d');
		gameObjects = new Array();
		loadResources();
	};
	
	this.init = function() {
		add(new Background());
		
		tileGrid = new TileGrid();
		add(tileGrid);
		levelUp(startingLevel);
		add(new Command());
		//add(new MousePointer());
	}

	this.destroy = function() {
	    clearInterval(intervalId);

	    for (var i = 0; i < objectToBeAdded.length; i++) {
	        objectToBeAdded.pop();
        }

	    for (var i = 0; i < objectToDeleted.length; i++) {
	        objectToDeleted.pop();
        }

	    for (var i = 0; i < gameObjects.length; i++) {
	        gameObjects.pop();
	    }
	}

	this.pause = function () {
	    clearInterval(intervalId);
	}

	this.resume = function () {
	    clearInterval(intervalId);
	    intervalId = setInterval(runGame, 1000 / 30);
    }
	
	function loadResources() {
		var loader = new PxLoader(); 
		var tempCtx = document.getElementById("canvas").getContext("2d");
	
		loader.addCompletionListener(function () {
			//tempCtx = null;
			self.init();
			intervalId = setInterval(runGame, 1000 / 30);
		});
		
		loader.addProgressListener(function (e) {
		    tempCtx.fillStyle = 'rgb(0,0,0)';
		    tempCtx.fillRect(0, 0, window.outerWidth, window.outerHeight);
			//tempCtx.fillRect(0, 0, 640, 480);
			
			tempCtx.fillStyle = '#FFFFFF';
			tempCtx.font = 'bold 30px arial';
			tempCtx.fillText(e.completedCount + ' / ' + e.totalCount, 300, 220);
		}); 
	
		self.resources = {
			car: loader.addImage('/Resources/cars.png'),
			tileSheet: loader.addImage('/Resources/ruta85.png'),
			fondomenu: loader.addImage('/Resources/fondomenu.png'),
			background: loader.addImage('/Resources/fondomain.png'),
			pointer: loader.addImage('/Resources/pointer.png'),
			meters: loader.addImage('/Resources/medidores.png'),
			barreras: loader.addImage('/Resources/barreras.png'),
			gas: loader.addImage('/Resources/gas.png'),
			slow: loader.addImage('/Resources/slow.png'),
			gasgray: loader.addImage('/Resources/grasgray.png')
		};

		/*Modo de uso en los lugares de los sonidos: g_SoundManager["credits"].play();*/
		soundManager = new SManager().startupSoundManager(
            [{ name: 'crash', src: 'Resources/Sounds/crash.wav' },
             { name: 'music', src: 'Resources/Sounds/gameMusic.mp3' },
			 { name: 'refuel', src: 'Resources/Sounds/fuelFilling.wav' },
			 { name: 'posOK', src: 'Resources/Sounds/positionOk.wav' },  
			 { name: 'posWrong', src: 'Resources/Sounds/positionWrong.wav' },
             { name: 'horn', src: 'Resources/Sounds/hornBeep.wav' },
	         { name: 'engine', src: 'Resources/Sounds/startEngine.wav' }
            ]);
		soundManager.music.loop = "loop";
		loader.start();
	}
	
	function SManager() {
		this.listSound = null;

		this.startupSoundManager = function (sounds) {
			g_SoundManager = this;

			this.listSound = new Array();

			for (var i = 0; i < sounds.length; i++) {
				var thisAudio = new Audio;
				this[sounds[i].name] = thisAudio;
				this.listSound.push(sounds[i].name);

				thisAudio.src = sounds[i].src;
			}

			return this;
		}
	}
		
	function add(obj) {
		objectToBeAdded.push(obj);
	}
	
	function remove(obj) {
		objectToDeleted.push(obj);
	}
	
	function processAll() {
		//Added
		if (objectToBeAdded.length != 0) {
			for (var x = 0; x < objectToBeAdded.length; ++x) {
				gameObjects.push(objectToBeAdded[x]);
				objectToBeAdded[x].init();
			}
			objectToBeAdded.splice(0, objectToBeAdded.length);//.clear();
		}
		
		//Remove
		if (objectToDeleted.length != 0)
		{
			for (var x = 0; x < objectToDeleted.length; ++x) {
				gameObjects.removeObject(objectToDeleted[x]);
			}
			objectToDeleted.splice(0, objectToDeleted.length);//.clear();
		}
		self.sortObjects();
	}
	
	var nextLevelAlarm = null;

	function runGame() {
		var thisFrame = new Date().getTime();
		var delta = (thisFrame - this.lastFrame) / 1000;
		this.lastFrame = thisFrame;
		//background colour
		backBuffer.fillStyle = "rgb(255,255,255)";
		backBuffer.fillRect(0, 0, canvas.width, canvas.height);
		for (var i = 0; i < gameObjects.length; i++) {
			//Update game object
			gameObjects[i].update(delta);
			//if object is drawable, draw
			if (gameObjects[i].draw && gameObjects[i].visible) {
				gameObjects[i].draw(backBuffer);
		    }
	    }
		
		//Loop finished, draw everything
        context.drawImage(backBufferCanvas, 0, 0);
		
		processAll();
		
		if (g_waitingForNextLevel) {
			if (nextLevelAlarm == null) {
				nextLevelAlarm = getAlarmTime(g_timeBetweenLevels);
			} else {
				if (isAlarmTime(nextLevelAlarm) < 0) {
					g_waitingForNextLevel = false;
					levelUp();
				}
			}
		}
	};
	
	
	this.prepareLevelUp = function() {
		g_SoundManager["horn"].play();
		g_waitingForNextLevel = true;
	}

	this.levelUpWrapper = levelUp;
	
	function levelUp(newLevel) {
	    g_SoundManager["engine"].play();

	    if (newLevel == undefined) {
	        newLevel = g_gameLevel + 1;
        }

		g_goalAreaEnabled = true;
		g_showingLevelUp = false;
		g_canistersCollected = 0;
		g_gameStarting = true;
		g_gameLevel = newLevel;
	    //g_enviroment = g_gameLevel;

		g_enviroment = levels[g_gameLevel].levelTile;

		g_fuel = g_maxFuel;
		g_gameSpeed = g_minSpeed;
		
			
		if (g_gameLevel > levels.length) { g_gameLevel = 0; }

		g_fuelLossTime = levels[g_gameLevel].fuelLossTime;
		g_speedGainTime = levels[g_gameLevel].speedGainTime;
		g_fuelsToGoal = levels[g_gameLevel].fuelsToGoal;

		for (var i = 0; i < levels[g_gameLevel].levelObjects.length; i++) {
		    g_levelObjects.push(levels[g_gameLevel].levelObjects[i]);
		}

		//g_levelObjects = levels[g_gameLevel].levelObjects;

		g_minSpeed = levels[g_gameLevel].minSpeed;
		g_gameSpeed = g_minSpeed;
		tileGrid.loadLevelTiles();
		g_gameStarting = true;
	}
}

function getAlarmTime(ticks) {
	var thisFrame = new Date().getTime();
	var alarmTime = thisFrame + ticks;
	return alarmTime;
}

function isAlarmTime(alarmTime) {
	return alarmTime - new Date().getTime(); 
}

var g_game;