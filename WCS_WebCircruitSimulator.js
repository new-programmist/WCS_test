const period = 20 // ms
const ticks_per_draw = 1000000

class Draw {
  static drawall(objects) {
    ctx.clearRect(0, 0, c.width, c.height)
    objects.get(Connection).forEach((w) => drawWire(w.in.x, w.in.y, w.out.x, w.out.y, w.on))
    objects.get(Logic).forEach((l) => {
      eval('draw' + l.name.capitalize() + '(' + l.x + ',' + l.y + ',' + l.draw_type + ')');
      (l.ins.concat(l.outs)).forEach((n) => drawNode(n.x, n.y, n.on || n.onConnected()))
    });
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
map.get('off').set('code', () => [[false], []])
map.get('off').set('ins', 0)
map.set('on', new MapWithDefault(() => []))
map.get('on').set('nodes', [[0, 0]])
map.get('on').set('code', () => [[true], []])
map.get('on').set('ins', 0)
map.set('buff', new MapWithDefault(() => []))
map.get('buff').set('nodes', [[71, 40], [187, 40]])
map.get('buff').set('code', (a) => [[a], [a]])
map.get('buff').set('ins', 1)
map.get('buff').set('path', drawBuff(0, 0, 0))
map.set('not', new MapWithDefault(() => []))
map.get('not').set('nodes', [[71, 40], [187, 40]])
map.get('not').set('code', (a) => [[!a], [!a]])
map.get('not').set('ins', 1)
map.get('not').set('path', drawNot(0, 0, 0))
map.set('or', new MapWithDefault(() => []))
map.get('or').set('nodes', [[71, 33], [71, 47], [187, 40]])
map.get('or').set('code', (a, b) => [[a || b], [a || b]])
map.get('or').set('ins', 2)
map.get('or').set('path', drawOr(0, 0, 0))
map.set('nor', new MapWithDefault(() => []))
map.get('nor').set('nodes', [[71, 33], [71, 47], [187, 40]])
map.get('nor').set('code', (a, b) => [[!(a || b)], [!(a || b)]])
map.get('nor').set('ins', 2)
map.get('nor').set('path', drawNor(0, 0, 0))
map.set('and', new MapWithDefault(() => []))
map.get('and').set('nodes', [[71, 33], [71, 47], [187, 40]])
map.get('and').set('code', (a, b) => [[a && b], [a && b]])
map.get('and').set('ins', 2)
map.get('and').set('path', drawAnd(0, 0, 0))
map.set('nand', new MapWithDefault(() => []))
map.get('nand').set('nodes', [[71, 33], [71, 47], [187, 40]])
map.get('nand').set('code', (a, b) => [[!(a && b)], [!(a && b)]])
map.get('nand').set('ins', 2)
map.get('nand').set('path', drawNand(0, 0, 0))
map.set('xor', new MapWithDefault(() => []))
map.get('xor').set('nodes', [[71, 33], [71, 47], [187, 40]])
map.get('xor').set('code', (a, b) => [[(a ^ b) == 1], [(a ^ b) == 1]])
map.get('xor').set('ins', 2)
map.get('xor').set('path', drawXor(0, 0, 0))
map.set('xnor', new MapWithDefault(() => []))
map.get('xnor').set('nodes', [[71, 33], [71, 47], [187, 40]])
map.get('xnor').set('code', (a, b) => [[(a ^ b) == 0], [(a ^ b) == 0]])
map.get('xnor').set('ins', 2)
map.get('xnor').set('path', drawXnor(0, 0, 0))

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
    const out = this.block(...this.ins.map(inNode => inNode.onConnected()), this.vars);
    for (const [i, outNode] of this.outs.entries()) {
      outNode.on = out[0][i];
    }
    this.draw_type = out[1]
  }

  clicked(x, y) {
    const ret = ctx.isPointInPath(map.get(this.name).get('path'), x - this.x, y - this.y);
    return ret;
  }

  reset() {
    let i = -1
    this.ins.forEach((nod) => { i++;
      nod.x = this.x + map.get(this.name).get('nodes')[i][0];
      nod.y = this.y + map.get(this.name).get('nodes')[i][1] });
    this.outs.forEach((nod) => { i++;
      nod.x = this.x + map.get(this.name).get('nodes')[i][0];
      nod.y = this.y + map.get(this.name).get('nodes')[i][1] });
  }
}

class Node {
  constructor(name = null, x = 0, y = 0) {
    this.name = name;
    this.connected = [];
    this.x = x;
    this.y = y;
    this.on = false;
    objs2.get(this.constructor).push(this);
  }
  connect(connection) {
    this.connected.push(connection);
  }
  onConnected() {
    return this.connected.some(x => x.on);
  }
}

class Circruit {
  constructor(save_code) {
    this.change(save_code);
  }
  change(save_code) {
    this.save = save_code;
    objs2 = new MapWithDefault(() => []);
    objs.set(this, objs2);
    this.parse(save_code);

  }
  add(save_code) {
    this.save = save_code;
    objs2 ||= new MapWithDefault(() => []);
    objs.set(this, objs2);
    this.parse(save_code);
  }
  parse(save) {
    save(this); // TODO: Replace By Parsing
  }
  tick(n = 1) {
    for (let time = Date.now(), tick = 0; tick < n && (Date.now() - time) <= period; tick++) {
      objs.get(this).get(Logic).forEach(_1 => _1.tick());
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
}

function loop(timeStamp) {
  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;
  lastTime = timeStamp;
  c1.tick(ticks_per_draw);
  elapsedTime = timeStamp - lastTime;
  setTimeout(() => window.requestAnimationFrame(loop), period - elapsedTime);
};

var mousedownID = -1;
var clicked_id = -1;
var mx = 0;
var my = 0;

function mousedown(event) {
  const rect = c.getBoundingClientRect()
  const clientX = event.clientX - rect.left
  const clientY = event.clientY - rect.top
  clicked_id = -1;
  els = objs.get(c1).get(Logic)
  els.forEach((l, i) => {
    if (l.clicked(clientX, clientY)) {
      clicked_id = i;
    }
  })

  if (mousedownID == -1 && clicked_id > -1) {
    els.push(els[clicked_id]);
    els.splice(clicked_id, 1);
    clicked_id = els.length - 1;
    mx = clientX - els[clicked_id].x
    my = clientY - els[clicked_id].y
    whilemousedown();
    mousedownID = setInterval(whilemousedown, 16);
  }
}

function mouseup(event) {
  if (mousedownID != -1) {
    clearInterval(mousedownID);
    mousedownID = -1;
  }

}

function mousemove(event) {
  const rect = c.getBoundingClientRect()
  x = event.clientX - rect.left
  y = event.clientY - rect.top
}

function whilemousedown() {
  els = objs.get(c1).get(Logic)

  if (clicked_id > -1) {
    els[clicked_id].x = x - mx;
    els[clicked_id].y = y - my;
    els[clicked_id].reset()
  }
}

c1 = new Circruit((cir) => {
  c1 = new Circruit((cir) => {
                new Logic(cir, 'and',0,0)
                new Logic(cir, 'nand',140,-7)
                new Connection(cir, objs2.get(Node)[2],objs2.get(Node)[4])
                new Logic(cir, 'and',0,460)
                new Logic(cir, 'nand',140,467)
                new Connection(cir, objs2.get(Node)[8],objs2.get(Node)[9])
                new Logic(cir, 'nand',280,0)
                new Logic(cir, 'nand',280,460)
                new Connection(cir, objs2.get(Node)[5],objs2.get(Node)[12])
                new Connection(cir, objs2.get(Node)[11],objs2.get(Node)[16])
                new Connection(cir, objs2.get(Node)[17],objs2.get(Node)[13])
                new Connection(cir, objs2.get(Node)[14],objs2.get(Node)[15])
                new Logic(cir, 'not',210,230)
                new Connection(cir, objs2.get(Node)[1],objs2.get(Node)[18])
                new Connection(cir, objs2.get(Node)[6],objs2.get(Node)[18])
                new Logic(cir, 'nand',420,0)
                new Logic(cir, 'nand',420,460)
                new Connection(cir, objs2.get(Node)[21],objs2.get(Node)[19])
                new Connection(cir, objs2.get(Node)[23],objs2.get(Node)[19])
                new Connection(cir, objs2.get(Node)[20],objs2.get(Node)[14])
                new Connection(cir, objs2.get(Node)[24],objs2.get(Node)[17])
                new Logic(cir, 'nand',560,0)
                new Logic(cir, 'nand',560,460)
                new Connection(cir, objs2.get(Node)[22],objs2.get(Node)[26])
                new Connection(cir, objs2.get(Node)[25],objs2.get(Node)[30])
                new Connection(cir, objs2.get(Node)[27],objs2.get(Node)[31])
                new Connection(cir, objs2.get(Node)[28],objs2.get(Node)[29])
                new Connection(cir, objs2.get(Node)[3],objs2.get(Node)[31])
                new Connection(cir, objs2.get(Node)[10],objs2.get(Node)[28])
                new Logic(cir, 'not',0,800)
                new Logic(cir, 'buff',220,800)
                new Logic(cir, 'buff',440,800)
                new Logic(cir, 'buff',660,800)
                new Logic(cir, 'buff',0,900)
                new Logic(cir, 'buff',220,900)
                new Logic(cir, 'buff',440,900)
                new Logic(cir, 'buff',660,900)
                new Connection(cir, objs2.get(Node)[33],objs2.get(Node)[34])
                new Connection(cir, objs2.get(Node)[35],objs2.get(Node)[36])
                new Connection(cir, objs2.get(Node)[37],objs2.get(Node)[38])
                new Connection(cir, objs2.get(Node)[39],objs2.get(Node)[40])
                new Connection(cir, objs2.get(Node)[41],objs2.get(Node)[42])
                new Connection(cir, objs2.get(Node)[43],objs2.get(Node)[44])
                new Connection(cir, objs2.get(Node)[45],objs2.get(Node)[46])
                new Connection(cir, objs2.get(Node)[47],objs2.get(Node)[32])
                new Connection(cir, objs2.get(Node)[32],objs2.get(Node)[18])
});

let lastTime = performance.now();
let x = 0;
let y = 0;

c.addEventListener("mousedown", mousedown);
c.addEventListener("mouseup", mouseup);
c.addEventListener("mousemove", mousemove);
window.requestAnimationFrame(loop);

