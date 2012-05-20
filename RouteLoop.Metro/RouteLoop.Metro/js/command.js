function Command() {
	var self = this;
	var over = false;

	this.visible = true;
	
    this.init = function () {
    }
	
    this.update = function (delta) {

        if (g_showGameOver) {
            g_showGameOver = false;

            var popup = new Windows.UI.Popups.MessageDialog("Do you want to try this level again?",
                    "Game Over");
            popup.commands.append(new Windows.UI.Popups.UICommand("&Yes", function () {
                g_game.levelUpWrapper(g_gameLevel);
                g_car.tileXPos = 50;
                g_car.tileYPos = 50;
                g_car.tileX = g_goalAreaX;
                g_car.tileY = g_goalAreaY;
                g_car.angle = 0;
                g_car.visible = true;
                g_car.moving = false;
                g_score = 0;
            }));
            popup.commands.append(new Windows.UI.Popups.UICommand("&No", function () {
                //g_game.levelUpWrapper(0);
                g_car.tileXPos = 50;
                g_car.tileYPos = 50;
                g_car.tileX = g_goalAreaX;
                g_car.tileY = g_goalAreaY;
                g_car.angle = 0;
                g_car.visible = true;
                g_car.moving = false;
                g_score = 0;

                GoBack();
            }));
            popup.showAsync();
        }
    }

    this.draw = function (context) {
		if (g_showingLevelUp && false) {
			context.save();
				context.globalAlpha = 0.5;
				context.fillStyle = '#000000';
				context.fillRect(0, 150, 640, 120);
				context.globalAlpha = 1;
				context.fillStyle = '#FFFFFF';
				context.strokeStyle = "#FF3300";
				context.lineWidth = 3;
				context.font = 'bold 50px "Segoe UI"';
				context.fillText('LEVELING UP!', 180, 220);
				context.strokeText('LEVELING UP!', 180, 220);
			context.restore();
		}
    }

}