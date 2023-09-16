const period = 20 // ms
const ticks_per_draw = 1000000

class Draw {
  static drawall(objects) {
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
map.set('not', new MapWithDefault(() => []))
map.get('not').set('nodes', [[71, 40], [187, 40]])
map.get('not').set('code', (a) => [[!a], [!a]])
map.get('not').set('ins', 1)
map.set('or', new MapWithDefault(() => []))
map.get('or').set('nodes', [[71, 33], [71, 47], [187, 40]])
map.get('or').set('code', (a, b) => [[a || b], [a || b]])
map.get('or').set('ins', 2)
map.get('or').set('path', drawOr(0, 0, 0))
map.set('nor', new MapWithDefault(() => []))
map.get('nor').set('nodes', [[71, 33], [71, 47], [187, 40]])
map.get('nor').set('code', (a, b) => [[!(a || b)], [!(a || b)]])
map.get('nor').set('ins', 2)
map.set('and', new MapWithDefault(() => []))
map.get('and').set('nodes', [[71, 33], [71, 47], [187, 40]])
map.get('and').set('code', (a, b) => [[a && b], [a && b]])
map.get('and').set('ins', 2)
map.set('nand', new MapWithDefault(() => []))
map.get('nand').set('nodes', [[71, 33], [71, 47], [187, 40]])
map.get('nand').set('code', (a, b) => [[!(a && b)], [!(a && b)]])
map.get('nand').set('ins', 2)
map.set('xor', new MapWithDefault(() => []))
map.get('xor').set('nodes', [[71, 33], [71, 47], [187, 40]])
map.get('xor').set('code', (a, b) => [[(a ^ b) == 1], [(a ^ b) == 1]])
map.get('xor').set('ins', 2)
map.set('xnor', new MapWithDefault(() => []))
map.get('xnor').set('nodes', [[71, 33], [71, 47], [187, 40]])
map.get('xnor').set('code', (a, b) => [[(a ^ b) == 0], [(a ^ b) == 0]])
map.get('xnor').set('ins', 2)

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
    return ctx.isPointInPath(map.get(this.name).get('path'), x - this.x, y - this.y);
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

c1 = new Circruit((cir) => {
  new Logic(cir, 'or', 0, 0)
  new Logic(cir, 'or', 0, 100)
  //new Logic(cir, 'not', 0, 0)
  //new Connection(cir, objs2.get(Node)[0], objs2.get(Node)[1])
  //new Logic(cir, 'xor', 200, 0)
  //new Connection(cir, objs2.get(Node)[1], objs2.get(Node)[3])
  //new Connection(cir, objs2.get(Node)[2], objs2.get(Node)[4])
  //new Logic(cir, 'and', 200, 40)
  //new Connection(cir, objs2.get(Node)[3], objs2.get(Node)[5])
  //new Connection(cir, objs2.get(Node)[4], objs2.get(Node)[6])
  //new Logic(cir, 'xor', 400, 0)
  //new Connection(cir, objs2.get(Node)[7], objs2.get(Node)[9])
  //new Connection(cir, objs2.get(Node)[8], objs2.get(Node)[10])
  //new Logic(cir, 'and', 400, 40)
  //new Connection(cir, objs2.get(Node)[9], objs2.get(Node)[11])
  //new Connection(cir, objs2.get(Node)[10], objs2.get(Node)[12])
  //new Logic(cir, 'xor', 600, 0)
  //new Connection(cir, objs2.get(Node)[13], objs2.get(Node)[15])
  //new Connection(cir, objs2.get(Node)[14], objs2.get(Node)[16])
  //new Logic(cir, 'and', 600, 40)
  //new Connection(cir, objs2.get(Node)[15], objs2.get(Node)[17])
  //new Connection(cir, objs2.get(Node)[16], objs2.get(Node)[18])
  //new Logic(cir, 'xor', 800, 0)
  //new Connection(cir, objs2.get(Node)[19], objs2.get(Node)[21])
  //new Connection(cir, objs2.get(Node)[20], objs2.get(Node)[22])
  //new Logic(cir, 'and', 800, 40)
  //new Connection(cir, objs2.get(Node)[21], objs2.get(Node)[23])
  //new Connection(cir, objs2.get(Node)[22], objs2.get(Node)[24])
  //new Logic(cir, 'xor', 000, 80)
  //new Connection(cir, objs2.get(Node)[25], objs2.get(Node)[27])
  //new Connection(cir, objs2.get(Node)[26], objs2.get(Node)[28])
  //new Logic(cir, 'and', 000, 120)
  //new Connection(cir, objs2.get(Node)[27], objs2.get(Node)[29])
  //new Connection(cir, objs2.get(Node)[28], objs2.get(Node)[30])
  //new Logic(cir, 'xor', 200, 80)
  //new Connection(cir, objs2.get(Node)[31], objs2.get(Node)[33])
  //new Connection(cir, objs2.get(Node)[32], objs2.get(Node)[34])
  //new Logic(cir, 'and', 200, 120)
  //new Connection(cir, objs2.get(Node)[33], objs2.get(Node)[35])
  //new Connection(cir, objs2.get(Node)[34], objs2.get(Node)[36])
  //new Logic(cir, 'xor', 400, 80)
  //new Connection(cir, objs2.get(Node)[37], objs2.get(Node)[39])
  //new Connection(cir, objs2.get(Node)[38], objs2.get(Node)[40])
  //new Logic(cir, 'and', 400, 120)
  //new Connection(cir, objs2.get(Node)[39], objs2.get(Node)[41])
  //new Connection(cir, objs2.get(Node)[40], objs2.get(Node)[42])
  //new Logic(cir, 'xor', 600, 80)
  //new Connection(cir, objs2.get(Node)[43], objs2.get(Node)[45])
  //new Connection(cir, objs2.get(Node)[44], objs2.get(Node)[46])
  //new Logic(cir, 'and', 600, 120)
  //new Connection(cir, objs2.get(Node)[45], objs2.get(Node)[47])
  //new Connection(cir, objs2.get(Node)[46], objs2.get(Node)[48])
  //new Logic(cir, 'xor', 800, 80)
  //new Connection(cir, objs2.get(Node)[49], objs2.get(Node)[51])
  //new Connection(cir, objs2.get(Node)[50], objs2.get(Node)[52])
  //new Logic(cir, 'and', 800, 120)
  //new Connection(cir, objs2.get(Node)[51], objs2.get(Node)[53])
  //new Connection(cir, objs2.get(Node)[52], objs2.get(Node)[54])
  //new Logic(cir, 'xor', 000, 160)
  //new Connection(cir, objs2.get(Node)[55], objs2.get(Node)[57])
  //new Connection(cir, objs2.get(Node)[56], objs2.get(Node)[58])
  //new Logic(cir, 'and', 000, 200)
  //new Connection(cir, objs2.get(Node)[57], objs2.get(Node)[59])
  //new Connection(cir, objs2.get(Node)[58], objs2.get(Node)[60])
  //new Logic(cir, 'xor', 200, 160)
  //new Connection(cir, objs2.get(Node)[61], objs2.get(Node)[63])
  //new Connection(cir, objs2.get(Node)[62], objs2.get(Node)[64])
  //new Logic(cir, 'and', 200, 200)
  //new Connection(cir, objs2.get(Node)[63], objs2.get(Node)[65])
  //new Connection(cir, objs2.get(Node)[64], objs2.get(Node)[66])
});

let lastTime = performance.now();
let x = 0;
let y = 0;

function loop(timeStamp) {
  lastTime = timeStamp;
  c1.tick(ticks_per_draw);
  elapsedTime = timeStamp - lastTime;
  setTimeout(() => window.requestAnimationFrame(loop), period - elapsedTime);
};

var mousedownID = -1;
var clicked_id = -1;

function mousedown(event) {
  els = objs.get(c1).get(Logic)
  els.forEach((l, i) => {
    if (l.clicked(event.clientX, event.clientY)) {
      clicked_id = i;
    }
  })
  els.push(els[clicked_id]);
  els.splice(clicked_id, 1);
  clicked_id = els.length - 1;
  if (mousedownID == -1 && clicked_id != -1) {
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
  x = event.clientX
  y = event.clientY
}

function whilemousedown() {
  els = objs.get(c1).get(Logic)
  els[clicked_id].x = x;
  els[clicked_id].y = y;
}
c.addEventListener("mousedown", mousedown);
c.addEventListener("mouseup", mouseup);
c.addEventListener("mousemove", mousemove);
window.requestAnimationFrame(loop);
