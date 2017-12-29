function ColorPicker(element) {
    this.element = element;

    this.init = function() {
        var diameter = this.element.offsetWidth;

        var canvas = document.createElement('canvas');
        canvas.height = diameter;
        canvas.width = diameter,
        this.canvas = canvas;

        this.renderColorMap();

        element.appendChild(canvas);

        this.setupBindings();
    };

    this.renderColorMap = function() {
        var canvas = this.canvas;
        var ctx = canvas.getContext('2d');

        var radius = canvas.width / 2;
        var toRad = (2 * Math.PI) / 360;
        var step = 1 / radius;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        var cx = cy = radius;
        for(var i = 0; i < 360; i += step) {
            var rad = i * toRad;
            var x = radius * Math.cos(rad),
                y = radius * Math.sin(rad);

            ctx.strokeStyle = 'hsl(' + i + ', 100%, 50%)';

            ctx.beginPath();
            ctx.moveTo(radius, radius);
            ctx.lineTo(cx + x, cy + y);
            ctx.stroke();
        }

        // draw saturation gradient
        var grd = ctx.createRadialGradient(cx,cy,0,cx,cx,radius);
        grd.addColorStop(0,"white");
        grd.addColorStop(1,'rgba(255, 255, 255, 0)');
        ctx.fillStyle = grd;
        //ctx.fillStyle = 'rgb(255, 255, 255)';
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();

        // render the rainbow box here ----------
    };

    this.renderMouseCircle = function(x, y) {
        var canvas = this.canvas;
        var ctx = canvas.getContext('2d');

        ctx.strokeStyle = 'rgb(255, 255, 255)';
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
        ctx.lineWidth = '3';
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    };

    this.setupBindings = function() {
        var canvas = this.canvas;
        var ctx = canvas.getContext('2d');
        var self = this;

        // canvas.addEventListener('click', function(e) {
        //     var x = e.offsetX || e.clientX - this.offsetLeft;
        //     var y = e.offsetY || e.clientY - this.offsetTop;

        //     var imgData = ctx.getImageData(x, y, 1, 1).data;
        //     // var selectedColor = new Color(imgData[0], imgData[1], imgData[2]);
        //     // console.log(selectedColor.r);
        //     // do something with this

        //     // self.renderColorMap();
        //     self.renderMouseCircle(x, y);
        // }, false);
    };

    this.plotRgb = function(r, g, b) {
        var canvas = this.canvas;
        var ctx = canvas.getContext('2d');

        var [h, s, v] = rgbToHsv(r, g, b);
        var theta = h * 2 * Math.PI;
        var maxRadius = canvas.width / 2;
        var r = s * maxRadius;
        var x = r * Math.cos(theta) + maxRadius,
            y = r * Math.sin(theta) + maxRadius;
        this.renderMouseCircle(x, y);
    }

    this.init();
}

function rgbToHsv(r, g, b){
    r = r/255, g = g/255, b = b/255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, v = max;

    var d = max - min;
    s = max == 0 ? 0 : d / max;

    if(max == min){
        h = 0; // achromatic
    }else{
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h, s, v];
}

var pick = new ColorPicker(document.querySelector('#colorSpace'));

// var lastRGB = {'r':231,'g':52,'b':35, 'active':0};
// pick.plotRgb(lastRGB.r, lastRGB.g, lastRGB.b);
// lastRGB.active = 1;

var canvas = pick.element.querySelector('canvas');

function rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255)
        throw "Invalid color component";
    return ((r << 16) | (g << 8) | b).toString(16);
}

// canvas.addEventListener("mouseover",function(e){
//     var eventLocation = getEventLocation(this,e);
//     var coord = "x=" + eventLocation.x + ", y=" + eventLocation.y;

//     // Get the data of the pixel according to the location generate by the getEventLocation function
//     var context = this.getContext('2d');
//     var pixelData = context.getImageData(eventLocation.x, eventLocation.y, 1, 1).data;

//     // If transparency on the image
//     if((pixelData[0] == 0) && (pixelData[1] == 0) && (pixelData[2] == 0) && (pixelData[3] == 0)){
//                 coord += " (Transparent color detected, cannot be converted to HEX)";
//     }
//     else {
//         var hex = "#" + ("000000" + rgbToHex(pixelData[0], pixelData[1], pixelData[2])).slice(-6);
//         document.getElementById("currentRGB").style.backgroundColor = hex;
//     }

//     // document.getElementById("currentRGB").style.backgroundColor = hex;
// },false);

canvas.addEventListener("mousemove",(e) => {mouseRGB(canvas,e)},false);
canvas.addEventListener("touchmove",(e) => {touchRGB(canvas,e)},false);

function mouseRGB(element,e){
    var eventLocation = getEventLocation(element,e);
    var coord = "x=" + eventLocation.x + ", y=" + eventLocation.y;

    // Get the data of the pixel according to the location generate by the getEventLocation function
    var context = element.getContext('2d');
    var pixelData = context.getImageData(eventLocation.x, eventLocation.y, 1, 1).data;

    // If transparency on the image
    if((pixelData[0] == 0) && (pixelData[1] == 0) && (pixelData[2] == 0) && (pixelData[3] == 0)){
                coord += " (Transparent color detected, cannot be converted to HEX)";
    }
    else {
        activeBLE.sendRGB(pixelData[0], pixelData[1], pixelData[2]);
        var hex = "#" + ("000000" + rgbToHex(pixelData[0], pixelData[1], pixelData[2])).slice(-6);
        document.getElementById("currentRGB").style.backgroundColor = hex;
    }

    // document.getElementById("currentRGB").style.backgroundColor = hex;
}

function touchRGB(element,e){
    e.pageX = e.changedTouches[0].pageX;
    e.pageY = e.changedTouches[0].pageY;
    e.preventDefault();
    mouseRGB(element,e);
}

function getEventLocation(element,event){
    var pos = getElementPosition(element);

    return {
        x: (event.pageX - pos.x),
        y: (event.pageY - pos.y)
    };
}

function getElementPosition(obj) {
    var curleft = 0, curtop = 0;
    if (obj.offsetParent) {
        do {
            curleft += obj.offsetLeft;
            curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
        return { x: curleft, y: curtop };
    }
    return undefined;
}
