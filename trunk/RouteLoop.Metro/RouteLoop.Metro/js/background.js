function Background() {
	var self = this;

	//this.speed = 1.5;
	this.visible = true;
	
    this.init = function () {
        this.x = 0;
        this.y = 0;
    }
	
    this.update = function (delta) {
		//this.y -= self.speed;

        //if (this.y + 479 <= 0)
            //this.y = 0;
    }

    this.draw = function (context) {
	
		context.drawImage(g_game.resources.fondomenu, this.x, this.y,
                    g_game.resources.fondomenu.width + 50, g_game.resources.fondomenu.height);
        //context.drawImage(g_game.resources.fondomenu, -60, 0);
        //context.drawImage(g_game.resources.fondomenu, 40, 0);

		context.drawImage(g_game.resources.background, 119, 0);

		context.drawImage(g_game.resources.meters,
			40, 74, 112, 57,
			5, 40, 112, 57);
		
		//Metter full fuel
		context.drawImage(g_game.resources.meters,
			40, 6, (g_fuel * g_maxFuel) / 112, 57,
			5, 40, (g_fuel * g_maxFuel) / 112, 57);
		
		context.save();
			context.fillStyle = "#FFFFFF";
			context.fillRect(7, 121, 108, 50);
		context.restore();
		
		context.drawImage(g_game.resources.meters,
			40, 150, 112, 57,
			5, 120, 112, 57);
		
		var p = (g_gameSpeed * 100) / g_maxSpeed;		
		
		context.drawImage(g_game.resources.meters,
			24, 155, 9, 29,
			((p / 100) * 112), 123, 9, 29);
		
		//Draw gas
		var i = 0;
		var row = 0;
		var counter = 0;
		
		for (i = 0; i < g_canistersCollected; i++) {
			context.drawImage(g_game.resources.gas, counter * 22, (row * 50) + 200);
			counter++;
			if (counter === 5) {
				row++;
				counter = 0;
			}
		}
		
		for (; i < g_fuelsToGoal; i++) {
			context.drawImage(g_game.resources.gasgray, counter * 22, (row * 50) + 200);
			counter++;
			if (counter === 5) {
				row++;
				counter = 0;
			}
		}
		
/* 		context.fillText("Speed",5, 280);
		context.fillText(g_gameSpeed, 5, 300); */
		
		context.save();
			var textToShow = g_score + " km";
			context.font = '20px "Segoe UI"';
			var textWidth = context.measureText(textToShow);
			
			context.fillText(textToShow, (119 - textWidth.width) - 10, 20);
		context.restore();
		
		//context.fillText("Canisters left", 5, 200);
		//context.fillText(g_fuelsToGoal - g_canistersCollected, 5, 220);
		
    }

}