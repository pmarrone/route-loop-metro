function MousePointer() {
	var self = this;
	var x = 0;
	var y = 0;
	
	this.visible = true;
	
    this.init = function () {
		var c = document.getElementById("canvas");
		c.addEventListener("mousemove", getMouseMove)
    }
	
	function getMouseMove(ev) {
		if (ev.offsetY) {
			x = ev.offsetX;
			y = ev.offsetY;
		} else {
			x = ev.clientX - ev.currentTarget.offsetLeft;
			y = ev.clientY;
		}
	}
	
    this.update = function (delta) {
    }

    this.draw = function (context) {
		context.drawImage(g_game.resources.pointer, x, y);
    }

}