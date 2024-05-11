const period = 20 // ms
const ticks_per_draw = 1
let selected = 0;
let lastTime = performance.now();
let x = 0;
let y = 0;
let down = 0;
var new_element_coord_shift = 0;

class Draw {
  static drawall(objects,panel = true,c = cCr,ctx = ctxCr,ctxname = 'ctxCr') {
    var arr = []
    ctx.clearRect(0, 0, c.width, c.height)
    objects.get(Connection).forEach((w) => drawWire(w.in.x, w.in.y, w.out.x, w.out.y, w.on, ctx))
    objects.get(Logic).forEach((l) => {
      eval('draw' + l.name.capitalize() + '(' + l.x + ',' + l.y + ',' + l.draw_type + ((l.draw_type.length == 0)? '' : ',') + ctxname + ')');
      (l.ins.concat(l.outs)).forEach((n) => {
        arr.push(n)
        drawNode(n.x, n.y, n.on || n.onConnected(), n.i == node && ctxname == 'ctxCr', ctx)
      })
    });
    if(panel) Panel.draw();
    var i = 0
    arr.forEach((n) => {
      if(n.i==node){
        node = i
      }
      n.i=i
      i++
    })
  }
}
String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
}
class MapWithDefault extends Map {
  constructor(setDefaultValue, entries) {
    super(entries);
    this.setDefaultValue = setDefaultValue;
  }
  get(key) {
    if (!this.has(key)) {
      this.set(key, this.setDefaultValue());
    }
    return super.get(key);
  }
}
let objs = new MapWithDefault(() => new MapWithDefault(() => []));
let objs2 = null
let map = new Map()
map.set('off', new MapWithDefault(() => []))
map.get('off').set('nodes', [[0, 0]])
map.get('off').set('code', (v, l) => [[false], []])
map.get('off').set('ins', 0)
map.get('off').set('path', drawOff(0, 0))
map.set('on', new MapWithDefault(() => []))
map.get('on').set('nodes', [[0, 0]])
map.get('on').set('code', (v, l) => [[true], []])
map.get('on').set('ins', 0)
map.get('on').set('path', drawOn(0, 0))
map.set('buff', new MapWithDefault(() => []))
map.get('buff').set('nodes', [[71, 40], [187, 40]])
map.get('buff').set('code', (a, v, l) => [[a], [a]])
map.get('buff').set('ins', 1)
map.get('buff').set('path', drawBuff(0, 0, 0))
map.set('not', new MapWithDefault(() => []))
map.get('not').set('nodes', [[71, 40], [187, 40]])
map.get('not').set('code', (a, v, l) => [[!a], [!a]])
map.get('not').set('ins', 1)
map.get('not').set('path', drawNot(0, 0, 0))
map.set('or', new MapWithDefault(() => []))
map.get('or').set('nodes', [[71, 33], [71, 47], [187, 40]])
map.get('or').set('code', (a, b, v, l) => [[a || b], [a || b]])
map.get('or').set('ins', 2)
map.get('or').set('path', drawOr(0, 0, 0))
map.set('nor', new MapWithDefault(() => []))
map.get('nor').set('nodes', [[71, 33], [71, 47], [187, 40]])
map.get('nor').set('code', (a, b, v, l) => [[!(a || b)], [!(a || b)]])
map.get('nor').set('ins', 2)
map.get('nor').set('path', drawNor(0, 0, 0))
map.set('and', new MapWithDefault(() => []))
map.get('and').set('nodes', [[71, 33], [71, 47], [187, 40]])
map.get('and').set('code', (a, b, v, l) => [[a && b], [a && b]])
map.get('and').set('ins', 2)
map.get('and').set('path', drawAnd(0, 0, 0))
map.set('nand', new MapWithDefault(() => []))
map.get('nand').set('nodes', [[71, 33], [71, 47], [187, 40]])
map.get('nand').set('code', (a, b, v, l) => [[!(a && b)], [!(a && b)]])
map.get('nand').set('ins', 2)
map.get('nand').set('path', drawNand(0, 0, 0))
map.set('xor', new MapWithDefault(() => []))
map.get('xor').set('nodes', [[71, 33], [71, 47], [187, 40]])
map.get('xor').set('code', (a, b, v, l) => [[(a ^ b) == 1], [(a ^ b) == 1]])
map.get('xor').set('ins', 2)
map.get('xor').set('path', drawXor(0, 0, 0))
map.set('xnor', new MapWithDefault(() => []))
map.get('xnor').set('nodes', [[71, 33], [71, 47], [187, 40]])
map.get('xnor').set('code', (a, b, v, l) => [[(a ^ b) == 0], [(a ^ b) == 0]])
map.get('xnor').set('ins', 2)
map.get('xnor').set('path', drawXnor(0, 0, 0))
map.set('button', new MapWithDefault(() => []))
map.get('button').set('nodes', [[50, 0]])
map.get('button').set('code', (v, l) => {
  if(!down){
    v.set(1,0)
    selected = 0
  }else{
    if(((x-l.x)**2+(y-l.y)**2 < 900) && (v.get(1) == 0) && (selected == 0)){
      v.set(0,!v.get(0))
      v.set(1,1)
      selected = 1
    }
  }
  return [[v.get(0)], [v.get(0)]]
})
map.get('button').set('ins', 0)
map.get('button').set('path', drawButton(0, 0, 0))

class Connection {
  constructor(cir, node1, node2) {
    node1.connect(this);
    node2.connect(this);
    this.in = node1;
    this.out = node2;
    this.on = false;
    objs2.get(this.constructor).push(this);
    cir.tick();
  }
  del() {
    let arr = objs.get(c1).get(this.constructor)
    arr.splice(arr.indexOf(this),1)
    objs.get(c1).set(this.constructor,arr)
    new Array(this.in,this.out).forEach((n) => n.connected.splice(n.connected.indexOf(this),1))
  }
}

class Logic {
  constructor(cir, name = '', x = 0, y = 0, ins = map.get(name).get('ins'), outs = map.get(name).get('nodes').length - map.get(name).get('ins'), code = map.get(name).get('code')) {
    let i = -1
    this.name = name
    this.vars = new MapWithDefault(() => false);
    this.ins = Array.from({
      length: ins
    }, () => { i++; return new Node(name + objs2.get(this.constructor).length + '_input' + (i), x + map.get(name).get('nodes')[i][0], y + map.get(name).get('nodes')[i][1]) });
    this.outs = Array.from({
      length: outs
    }, () => { i++; return new Node(name + objs2.get(this.constructor).length + '_output' + (i - this.ins.length), x + map.get(name).get('nodes')[i][0], y + map.get(name).get('nodes')[i][1]) });
    this.x = x;
    this.y = y;
    this.block = code;
    this.draw_type = []
    this.tick()
    objs2.get(this.constructor).push(this);
    cir.tick();
  }

  tick() {
    const out = this.block(...this.ins.map(inNode => inNode.onConnected()), this.vars, this);
    for (const [i, outNode] of this.outs.entries()) {
      outNode.on = out[0][i];
    }
    this.draw_type = out[1]
  }

  clicked(x, y) {
    const ret = ctxCr.isPointInPath(map.get(this.name).get('path'), x - this.x, y - this.y);
    return ret;
  }

  reset() {
    let i = -1
    this.ins.forEach((nod) => {
      i++;
      nod.x = this.x + map.get(this.name).get('nodes')[i][0];
      nod.y = this.y + map.get(this.name).get('nodes')[i][1]
    });
    this.outs.forEach((nod) => {
      i++;
      nod.x = this.x + map.get(this.name).get('nodes')[i][0];
      nod.y = this.y + map.get(this.name).get('nodes')[i][1]
    });
  }
  del() {
    let arr = objs.get(c1).get(this.constructor)
    arr.splice(arr.indexOf(self),1)
    this.ins.concat(this.outs).forEach((n) => n.del())
  }
}
class LogicCircruit {
  constructor() {
    
  }

  tick() {
    this.cir.tick
  }

  clicked(x, y) {
    return false
  }

  reset() {
    
  }
  del() {
    let arr = objs.get(c1).get(Logic)
    arr.splice(arr.indexOf(self),1)
    this.ins.concat(this.outs).forEach((n) => n.del())
  }
}

class Node {
  constructor(name = null, x = 0, y = 0) {
    this.name = name;
    this.connected = [];
    this.x = x;
    this.y = y;
    this.i = objs2.get(this.constructor).length
    this.on = false;
    objs2.get(this.constructor).push(this);
  }
  connect(connection) {
    this.connected.push(connection);
  }
  onConnected() {
    return this.connected.some(x => x.on);
  }
  clicked(x, y) {
    return (x - this.x) ** 2 + (y - this.y) ** 2 < 100;
  }
  del() {
    let arr = objs.get(c1).get(this.constructor)
    arr.splice(arr.indexOf(this),1)
    this.connected.forEach((con) => con.del())
  }
}

class Circruit {
  constructor(save_code) {
    this.change(save_code);
  }
  change(save_code) {
    this.sve = save_code;
    objs2 = new MapWithDefault(() => []);
    objs.set(this, objs2);
    this.parse(save_code);

  }
  add(save_code) {
    this.sve = save_code;
    objs2 = objs.get(this);
    objs.set(this, objs2);
    this.parse(save_code);
  }
  parse(save) {
    save(this); // TODO: Replace By Parsing
  }
  tick(n = 1) {
    for (let time = Date.now(), tick = 0; tick < n && (Date.now() - time) <= period; tick++) {
      objs.get(this).get(Logic).slice().reverse().forEach(_1 => _1.tick());
      const visited = new Set();
      objs.get(this).get(Connection).forEach(con => {
        if (visited.has(con)) return;
        const connected_cons = new Set();
        const is_on = this.collect_connected_cons(con, connected_cons, visited);
        connected_cons.forEach((c) => c.on = is_on);
      });
    }
    this.draw();
  }
  draw() {
    Draw.drawall(objs.get(this))
  }
  collect_connected_cons(con, connected_cons, visited) {
    const cons = con.in.connected.concat(con.out.connected);
    let is_on = con.in.on || con.out.on;
    if (!connected_cons.has(con)) {
      connected_cons.add(con);
      visited.add(con);
      cons.forEach(x => {
        is_on = this.collect_connected_cons(x, connected_cons, visited) || is_on;
      });
    }
    return is_on;
  }
  save() {
    var s = "(cir) => {\n"
    s += objs.get(this).get(Logic).map((l) => "  new Logic(cir, '"+l.name+"', "+l.x+", "+l.y+")\n").join("")
    s += objs.get(this).get(Connection).map((c) => "  new Connection(cir, objs2.get(Node)["+c.in.i+"], objs2.get(Node)["+c.out.i+"])\n").join("")
    return(s + "}")
    return "s"
  }
}

function loop(timeStamp) {
  console.log(c1.save())
  ctxCr.canvas.width = window.innerWidth;
  ctxCr.canvas.height = window.innerHeight - 200;
  ctxPl.canvas.width = window.innerWidth;
  ctxPl.canvas.height = 200;
  lastTime = timeStamp;
  c1.tick(ticks_per_draw);
  elapsedTime = timeStamp - lastTime;
  setTimeout(() => window.requestAnimationFrame(loop), period - elapsedTime);
};

var mousedownID = -1;
var clicked_id = -1;
var mx = 0;
var my = 0;
var node_clicked = -1;
var node = -1;
var move = 0;

function uniq(a) {
  return Array.from(new Set(a));
}

function mousedown(event) {
  down = 1;
  if (mousedownID != -1) return;

  const rect = cCr.getBoundingClientRect()
  const clientX = event.clientX - rect.left
  const clientY = event.clientY - rect.top


  clicked_id = -1;
  els = objs.get(c1).get(Node)

  els.forEach((l, i) => {
    if (l.clicked(clientX, clientY)) {
      clicked_id = i;
    }
  })

  if (clicked_id > -1) {
    if (node_clicked == -1) {
      node = clicked_id;
      node_clicked = 1;
    } else {
      if (node > -1 && node != clicked_id){
        if(intersection(els[node].connected,els[clicked_id].connected).length == 0) {
          new Connection(c1, els[node], els[clicked_id]);
        } else {
          intersection(els[node].connected,els[clicked_id].connected)[0].del()
          node = -1;
        }
      }
      node_clicked = -1;
      node = -1;
    }
  } else {
    clicked_id = -1;
    els = objs.get(c1).get(Logic)

    els.forEach((l, i) => {
      if (l.clicked(clientX, clientY)) {
        clicked_id = i;
      }
    })
    if (clicked_id > -1) {
      node_cliked = 0;
      node = -1;
      els.push(els[clicked_id]);
      els.splice(clicked_id, 1);
      clicked_id = els.length - 1;
      mx = clientX - els[clicked_id].x
      my = clientY - els[clicked_id].y
      whilemousedown();
      mousedownID = setInterval(whilemousedown, 16);
    }else{
      selected = 1;
    }
  }
}

function mouseup(event) {
  down = 0;
  if (mousedownID != -1) {
    clearInterval(mousedownID);
    mousedownID = -1;
    move = 0
  }

}

function mousemove(event) {
  const rect = cCr.getBoundingClientRect()
  x = event.clientX - rect.left
  y = event.clientY - rect.top
  move = 1
}

function whilemousedown() {
  els = objs.get(c1).get(Logic)

  if (clicked_id > -1 && move == 1) {
    els[clicked_id].x = x - mx;
    els[clicked_id].y = y - my;
    els[clicked_id].reset()
    move = 0
  }
}

function intersection(array1, array2) {
  return array1.filter(value => array2.includes(value));
}
















