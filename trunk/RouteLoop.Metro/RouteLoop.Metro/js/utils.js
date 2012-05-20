//function Coll(x, y, width, heigth,
//            x1, y1, width1, heigth1) {

//    context.fillText(x + " : " + y + " : " + width + " : " + height, 10, 30);

//    if (x + width < x1)
//        return false;
//    if (y + height < y1)
//        return false;
//    if (x > x1 + width1)
//        return false;
//    if (y > y1 + height1)
//        return false;

//    return true;
//}

function dummyGameObject() {
}

Object.prototype.getType = function () {
    var funcNameRegex = /function (.{1,})\(/;
    var results = (funcNameRegex).exec((this).constructor.toString());
    return (results && results.length > 1) ? results[1] : "";
};

function Rectangle() {
    this.left = 0;
    this.top = 0;
    this.width = 0;
    this.height = 0;

    this.init = function (left, top, width, height) {
        this.left = left;
        this.top = top;
        this.width = width;
        this.height = height;
        return this;
    }

    this.intersects = function (other) {
        if (this.left + this.width < other.left)
            return false;
        if (this.top + this.height < other.top)
            return false;
        if (this.left > other.left + other.width)
            return false;
        if (this.top > other.top + other.height)
            return false;

        return true;
    }
}