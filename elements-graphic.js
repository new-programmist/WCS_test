var cCr = document.getElementById("Circuit");
var ctxCr = cCr.getContext("2d");
var cPl = document.getElementById("Panel");
var ctxPl = cPl.getContext("2d");
var white = "#FFFFFF"
var black = "#000000"
var red = "#FF0000"
var wgray = "#BBBBBB"
var bgray = "#555555"

function drawZoomIn(on, ctx = ctxCr) {
    const path = new Path2D();
    const x = 30
    const y = 30
    ctx.fillStyle = black;
    ctx.strokeStyle = (on ? wgray : white);
    ctx.lineWidth = 2;
    path.moveTo(45 + x, (0 + y));
    path.arcTo((50 + x), (0 + y), (50 + x), (5 + y), 5);
    path.lineTo((50 + x), (45 + y));
    path.arcTo((50 + x), (50 + y), (45 + x), (50 + y), 5);
    path.lineTo((5 + x), (50 + y));
    path.arcTo((0 + x), (50 + y), (0 + x), (45 + y), 5);
    path.lineTo((0 + x), (5 + y));
    path.arcTo((0 + x), (0 + y), (5 + x), (0 + y), 5);
    path.lineTo((45 + x), (0 + y));
    path.moveTo(10 + x, (25 + y));
    path.lineTo((40 + x), (25 + y));
    path.moveTo(25 + x, (10 + y));
    path.lineTo((25 + x), (40 + y));
    ctx.fill(path);
    ctx.stroke(path);
    return path;
}
function drawZoomOut(on, ctx = ctxCr) {
  const path = new Path2D();
  const x = 30
  const y = 85

  ctx.fillStyle = black;
  ctx.strokeStyle = (on ? wgray : white);
  ctx.lineWidth = 2;
  path.moveTo(45 + x, (0 + y));
  path.arcTo((50 + x), (0 + y), (50 + x), (5 + y), 5);
  path.lineTo((50 + x), (45 + y));
  path.arcTo((50 + x), (50 + y), (45 + x), (50 + y), 5);
  path.lineTo((5 + x), (50 + y));
  path.arcTo((0 + x), (50 + y), (0 + x), (45 + y), 5);
  path.lineTo((0 + x), (5 + y));
  path.arcTo((0 + x), (0 + y), (5 + x), (0 + y), 5);
  path.lineTo((45 + x), (0 + y));
  path.moveTo(10 + x, (25 + y));
  path.lineTo((40 + x), (25 + y));
  ctx.fill(path);
  ctx.stroke(path);
  return path;
}
function drawWire( x1, y1, x2, y2, on,ctx = ctxCr) {
  const dx = Math.abs(x1 - x2)
  const dy = Math.abs(y1 - y2)

  const points = [
        [(dx > dy) ? (x1 + x2) / 2 : x1, (dx > dy) ? y1 : (y1 + y2) / 2],
        [(dx > dy) ? (x1 + x2) / 2 : x2, (dx > dy) ? y2 : (y1 + y2) / 2],
        [x2, y2],
      ]
  ctx.strokeStyle = on ? red : white;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  points.forEach(([x, y]) => ctx.lineTo(x, y))
  ctx.stroke();
  ctx.strokeStyle = black;
}
function drawButton( x, y, on,ctx = ctxCr,size) {
  const path = new Path2D();
  ctx.lineWidth = 2;
  path.moveTo(x + 30/size, y)
  path.arcTo(x + 30/size, y + 30/size, x, y + 30/size, 30 / size);
  path.arcTo(x - 30/size, y + 30/size, x - 30/size, y, 30 / size);
  path.arcTo(x - 30/size, y - 30/size, x, y - 30/size, 30 / size);
  path.arcTo(x + 30/size, y - 30/size, x + 30/size, y, 30 / size);
  ctx.fillStyle = on ? red : black
  ctx.strokeStyle = white
  ctx.fill(path);
  ctx.stroke(path);
  const line = new Path2D();
  path.addPath(line)      
      line.moveTo(x + 30/size, y)
      line.lineTo(x + 50/size, y)
  ctx.strokeStyle = white;
  ctx.stroke(line);
  return path;
}
function drawNode( x, y, on, clicked,ctx = ctxCr,size) {
  const path = new Path2D();
  path.moveTo(x, y)
  path.arc(x, y, (clicked ? 10 : 4.5)/size, 0, 2 * Math.PI);
  ctx.fillStyle = clicked ? "#00FF00" : on ? red : white;
  ctx.fill(path);

  return path;
}
function drawOn(x, y,ctx=ctxCr,size) {
  const path = new Path2D();
  path.moveTo(x, y)
  path.lineTo(x-50/size,y)
  path.arc(x-50/size, y, 20/size, 0, 2 * Math.PI);
  ctx.fillStyle = red
  ctx.strokeStyle = red
  ctx.fill(path);
  const line = new Path2D();
  path.addPath(line)      
      line.moveTo(x, y)
      line.lineTo(x - 50/size, y)
  ctx.stroke(line);
  ctx.strokeStyle = black;
  return path
}
function drawOff(x, y,ctx=ctxCr,size) {
  const path = new Path2D();
  path.moveTo(x, y)
  path.lineTo(x-50/size,y)
  path.arc(x-50/size, y, 20/size, 0, 2 * Math.PI);
  ctx.fillStyle = black
  ctx.strokeStyle = black
  ctx.fill(path);
  const line = new Path2D();
  path.addPath(line)      
      line.moveTo(x, y)
      line.lineTo(x - 50/size, y)
  ctx.stroke(line);
  ctx.strokeStyle = black;
  return path
}
function drawOr(x, y, on,ctx = ctxCr,size) {
  const path = new Path2D();

  ctx.fillStyle = (on ? red : bgray);
  ctx.strokeStyle = white;
  ctx.lineWidth = 2;
  path.moveTo(100/size + x, 20/size + y);
  path.arcTo(150/size + x, 20/size + y, 150/size + x, 40/size + y, 20/size);
  path.arcTo(150/size + x, 60/size + y, 130/size + x, 60/size + y, 20/size);
  path.lineTo(100/size + x, 60/size + y);
  path.arcTo(120/size + x, 40/size + y, 100/size + x, 20/size + y, 29/size);
  ctx.fill(path);
  path.moveTo(107/size + x, 33/size + y);
  path.lineTo(70/size + x, 33/size + y);
  path.moveTo(107/size + x, 47/size + y);
  path.lineTo(70/size + x, 47/size + y);
  path.moveTo(187/size + x, 40/size + y);
  path.lineTo(150/size + x, 40/size + y);
  ctx.stroke(path);

  return path;
}

function drawNor(x, y, on,ctx = ctxCr,size) {
  const path = new Path2D();

  ctx.fillStyle = (on ? red : bgray);
  ctx.strokeStyle = white;
  ctx.lineWidth = 2;
  path.moveTo(100/size + x, 20/size + y);
  path.arcTo(150/size + x, 20/size + y, 150/size + x, 40/size + y, 20/size);
  path.arcTo(150/size + x, 60/size + y, 130/size + x, 60/size + y, 20/size);
  path.lineTo(100/size + x, 60/size + y);
  path.arcTo(120/size + x, 40/size + y, 100/size + x, 20/size + y, 29/size);
  ctx.fill(path);
  path.moveTo(107/size + x, 33/size + y);
  path.lineTo(70/size + x, 33/size + y);
  path.moveTo(107/size + x, 47/size + y);
  path.lineTo(70/size + x, 47/size + y);
  path.moveTo(187/size + x, 40/size + y);
  path.lineTo(150/size + x, 40/size + y);
  ctx.stroke(path);
  path.moveTo(150/size + x, 40/size + y);

  const dot = new Path2D();
  path.addPath(dot)

  dot.arc(150/size + x, 40/size + y, 5/size, 0, 2 * Math.PI);
  ctx.fillStyle = bgray;
  ctx.fill(dot);
  ctx.stroke(dot);

  return path;
}

function drawAnd(x, y, on,ctx = ctxCr,size) {
  const path = new Path2D();

  ctx.fillStyle = (on ? red : bgray);
  ctx.strokeStyle = white;
  ctx.lineWidth = 2;
  path.moveTo(100/size + x, (20/size + y));
  path.arcTo((150/size + x), (20/size + y), (150/size + x), (40/size + y), 20/size);
  path.arcTo((150/size + x), (60/size + y), (130/size + x), (60/size + y), 20/size);
  path.lineTo((100/size + x), (60/size + y));
  path.lineTo((100/size + x), (20/size + y));
  ctx.fill(path);
  path.moveTo((100/size + x), (33/size + y));
  path.lineTo((70/size + x), (33/size + y));
  path.moveTo((100/size + x), (47/size + y));
  path.lineTo((70/size + x), (47/size + y));
  path.moveTo((187/size + x), (40/size + y));
  path.lineTo((150/size + x), (40/size + y));
  ctx.stroke(path);
  return path;
}

function drawXor(x, y, on,ctx = ctxCr,size) {
  const path = new Path2D();

  ctx.fillStyle = (on ? red : bgray);
  ctx.strokeStyle = white;
  ctx.lineWidth = 2;
  path.moveTo((92/size + x), (20/size + y));
  path.lineTo((100/size + x), (20/size + y));
  path.arcTo((150/size + x), (20/size + y), (150/size + x), (40/size + y), 20/size);
  path.arcTo((150/size + x), (60/size + y), (130/size + x), (60/size + y), 20/size);
  path.lineTo((100/size + x), (60/size + y));
  path.arcTo((120/size + x), (40/size + y), (100/size + x), (20/size + y), 29/size);
  ctx.fill(path);
  path.moveTo((100/size + x), (60/size + y));
  path.lineTo((92/size + x), (60/size + y));
  path.moveTo((94/size + x), (58/size + y));
  path.arcTo((112/size + x), (40/size + y), (94/size + x), (22/size + y), 29/size);
  path.moveTo((99/size + x), (33/size + y));
  path.lineTo((70/size + x), (33/size + y));
  path.moveTo((99/size + x), (47/size + y));
  path.lineTo((70/size + x), (47/size + y));
  path.moveTo((187/size + x), (40/size + y));
  path.lineTo((150/size + x), (40/size + y));
  ctx.stroke(path);

  return path;
}

function drawNand(x, y, on,ctx = ctxCr,size) {
  const path = new Path2D();

  ctx.fillStyle = (on ? red : bgray);
  ctx.strokeStyle = white;
  ctx.lineWidth = 2;
  path.moveTo(100/size + x, (20/size + y));
  path.arcTo((150/size + x), (20/size + y), (150/size + x), (40/size + y), 20/size);
  path.arcTo((150/size + x), (60/size + y), (130/size + x), (60/size + y), 20/size);
  path.lineTo((100/size + x), (60/size + y));
  path.lineTo((100/size + x), (20/size + y));
  ctx.fill(path);
  path.moveTo((100/size + x), (33/size + y));
  path.lineTo((70/size + x), (33/size + y));
  path.moveTo((100/size + x), (47/size + y));
  path.lineTo((70/size + x), (47/size + y));
  path.moveTo((187/size + x), (40/size + y));
  path.lineTo((150/size + x), (40/size + y));
  ctx.stroke(path);
  path.moveTo(150/size + x, 40/size + y);

  const dot = new Path2D();
  path.addPath(dot)

  dot.arc(150/size + x, 40/size + y, 5/size, 0, 2 * Math.PI);
  ctx.fillStyle = bgray;
  ctx.fill(dot);
  ctx.stroke(dot);

  return path;
}

function drawXnor(x, y, on,ctx = ctxCr, size) {
  const path = new Path2D();

  ctx.fillStyle = (on ? red : bgray);
  ctx.strokeStyle = white;
  ctx.lineWidth = 2;
  path.moveTo((92/size + x), (20/size + y));
  path.lineTo((100/size + x), (20/size + y));
  path.arcTo((150/size + x), (20/size + y), (150/size + x), (40/size + y), 20/size);
  path.arcTo((150/size + x), (60/size + y), (130/size + x), (60/size + y), 20/size);
  path.lineTo((100/size + x), (60/size + y));
  path.arcTo((120/size + x), (40/size + y), (100/size + x), (20/size + y), 29/size);
  ctx.fill(path);
  path.moveTo((100/size + x), (60/size + y));
  path.lineTo((92/size + x), (60/size + y));
  path.moveTo((94/size + x), (58/size + y));
  path.arcTo((112/size + x), (40/size + y), (94/size + x), (22/size + y), 29/size);
  path.moveTo((99/size + x), (33/size + y));
  path.lineTo((70/size + x), (33/size + y));
  path.moveTo((99/size + x), (47/size + y));
  path.lineTo((70/size + x), (47/size + y));
  path.moveTo((187/size + x), (40/size + y));
  path.lineTo((150/size + x), (40/size + y));
  ctx.stroke(path);
  path.moveTo(150/size + x, 40/size + y);

  const dot = new Path2D();
  path.addPath(dot)

  dot.arc(150/size + x, 40/size + y, 5/size, 0, 2 * Math.PI);
  ctx.fillStyle = bgray;
  ctx.fill(dot);
  ctx.stroke(dot);

  return path;
}

function drawBuff(x, y, on,ctx = ctxCr,size) {
  const path = new Path2D();

  ctx.fillStyle = (on ? red : bgray);
  ctx.strokeStyle = white;
  ctx.lineWidth = 2;
  path.moveTo((99/size + x), (20/size + y));
  path.lineTo((150/size + x), (40/size + y));
  path.lineTo((99/size + x), (60/size + y));
  path.lineTo((99/size + x), (20/size + y));
  ctx.fill(path);
  path.moveTo((99/size + x), (40/size + y));
  path.lineTo((70/size + x), (40/size + y));
  path.moveTo((187/size + x), (40/size + y));
  path.lineTo((150/size + x), (40/size + y));
  ctx.stroke(path);

  return path;
}

function drawNot(x, y, on,ctx = ctxCr,size) {
  const path = new Path2D();

  ctx.fillStyle = (on ? red : bgray);
  ctx.strokeStyle = white;
  ctx.lineWidth = 2;
  path.moveTo((99/size + x), (20/size + y));
  path.lineTo((150/size + x), (40/size + y));
  path.lineTo((99/size + x), (60/size + y));
  path.lineTo((99/size + x), (20/size + y));
  ctx.fill(path);
  path.moveTo((99/size + x), (40/size + y));
  path.lineTo((70/size + x), (40/size + y));
  path.moveTo((187/size + x), (40/size + y));
  path.lineTo((150/size + x), (40/size + y));
  ctx.stroke(path);
  path.moveTo(150/size + x, 40/size + y);

  const dot = new Path2D();
  path.addPath(dot)

  dot.arc(150/size + x, 40/size + y, 5/size, 0, 2 * Math.PI);
  ctx.fillStyle = bgray;
  ctx.fill(dot);
  ctx.stroke(dot);

  return path;
}

function drawVertseg(x, y, on,ctx = ctxCr,size) {
  const path = new Path2D();
  path.moveTo(x, y - 35/size);
  path.lineTo(x - 6/size, y - 29/size);
  path.lineTo(x - 6/size, y + 9/size);
  path.lineTo(x, y + 15/size);
  path.lineTo(x + 6/size, y + 9/size);
  path.lineTo(x + 6/size, y - 29/size);
  ctx.fillStyle = on ? red : black
  ctx.strokeStyle = on ? red : black
  ctx.fill(path);
  const line = new Path2D();
  path.addPath(line)      
  line.moveTo(x, y + 10/size)
  line.lineTo(x, y + 30/size)
  ctx.stroke(line);
  ctx.strokeStyle = black;
  return path;
}

function drawHoriseg(x, y, on,ctx = ctxCr,size) {
  const path = new Path2D();
  path.moveTo(x - 35/size, y);
  path.lineTo(x - 29/size, y - 6/size);
  path.lineTo(x + 9/size, y - 6/size);
  path.lineTo(x + 15/size, y);
  path.lineTo(x + 9/size, y + 6/size);
  path.lineTo(x - 29/size, y + 6/size);
  ctx.fillStyle = on ? red : black
  ctx.strokeStyle = on ? red : black
  ctx.fill(path);
  const line = new Path2D();
  path.addPath(line)      
  line.moveTo(x + 10/size, y)
  line.lineTo(x + 30/size, y)
  ctx.stroke(line);
  ctx.strokeStyle = black;
  return path;
}