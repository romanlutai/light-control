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
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();

    // render the rainbow box here
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
/* accepts parameters
 * r  Object = {r:x, g:y, b:z}
 * OR
 * r, g, b
*/
function rgbToHsv(r, g, b){
  if (arguments.length === 1) {
    b = r.b, g = r.g, r = r.r;
  }
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
/* accepts parameters
 * h  Object = {h:x, s:y, v:z}
 * OR
 * h, s, v
*/
function HSVtoRGB(h, s, v) {
  var r, g, b, i, f, p, q, t;
  if (arguments.length === 1) {
    s = h.s, v = h.v, h = h.h;
  }
  i = Math.floor(h * 6);
  f = h * 6 - i;
  p = v * (1 - s);
  q = v * (1 - f * s);
  t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0: r = v, g = t, b = p; break;
    case 1: r = q, g = v, b = p; break;
    case 2: r = p, g = v, b = t; break;
    case 3: r = p, g = q, b = v; break;
    case 4: r = t, g = p, b = v; break;
    case 5: r = v, g = p, b = q; break;
  }
  return [
    Math.round(r * 255),
    Math.round(g * 255),
    Math.round(b * 255)
  ];
}

function rgbToHex(r, g, b) {
  if (r > 255 || g > 255 || b > 255)
    throw "Invalid color component";
  return ((r << 16) | (g << 8) | b).toString(16);
}


function activeColor (id,sliders) {
  this.init = () =>{
    this.element = document.getElementById(id);
    [this.r, this.g, this.b] = [ 254, 254, 254 ];
    [this.h, this.s, this.v] = rgbToHsv(this.r,this.g,this.b);
    if (arguments.length > 1){
      var self = this;
      for (key in sliders) {
        document.getElementById(sliders[key]).addEventListener( "input", function(){self.changed( key, sliders[key] ) });
      }
    }
    this.updateElementsRGB(this.r,this.g,this.b);
  }

  this.updateElementsRGB = (r,g,b) => {
    var hex = "#" + ( "000000" + rgbToHex(r,g,b) ).slice(-6);
    this.element.style.backgroundColor = hex;
    var self = this;
    for (var key in sliders) {
      document.getElementById(sliders[key]).value = self[key];
    }
    if (activeBLE.active) activeBLE.sendRGBW(this.r,this.g,this.b);
  };

  this.updateRGB = (r,g,b,v_change) => {
    [this.r, this.g, this.b] = [ r, g, b ];
    if (arguments.length === 3) v_change = false;
    if (v_change) {
      [this.h, this.s, this.v] = rgbToHsv(this.r,this.g,this.b);
    } else {
      [this.h, this.s] = rgbToHsv(this.r,this.g,this.b);
      [this.r, this.g, this.b] = HSVtoRGB(this.h, this.s, this.v);
    }
    this.updateElementsRGB(this.r,this.g,this.b);
  };

  this.updateHSV = (h,s,v) => {
    [this.h, this.s, this.v] = [h,s,v];
    [this.r, this.g, this.b] = HSVtoRGB(this.h, this.s, this.v);
    this.updateElementsRGB(this.r,this.g,this.b);
  };

  this.changed = (key,id) => {
    var el = document.getElementById(id);
    if (key = "v") this.updateHSV(this.h, this.s, el.value);
  }

  this.init();
}

var colorInfo = new activeColor("currentRGB",{v:"slider_HSV_v"});

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
    colorInfo.updateRGB(pixelData[0], pixelData[1], pixelData[2],false);
  }
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

var pick;
var canvas;
function getColorPicker(){
  var element = document.querySelector('#colorSpace');
  if (!element.contains(canvas))  {
    pick = new ColorPicker(element);
    canvas = pick.element.querySelector('canvas');
    canvas.addEventListener("mousemove",(e) => {mouseRGB(canvas,e)},false);
    canvas.addEventListener("touchmove",(e) => {touchRGB(canvas,e)},false);
  }
}
