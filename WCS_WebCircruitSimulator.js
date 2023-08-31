class Draw {
  static drawall(objects) {
    objects.get(Connection).forEach((w) => drawWire(w.in.x, w.in.y, w.out.x, w.out.y, w.on))
    objects.get(Logic).forEach((l) => {
      eval('draw' + l.name.capitalize() + '(' + l.x + ',' + l.y + ',' + l.outs[0].on + ')');
      (l.ins.concat(l.outs)).forEach((n) => drawNode(n.x, n.y, n.on))
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
let objs = new MapWithDefault(() => []);
let map = new Map()
map.set('off', new MapWithDefault(() => []))
map.get('off').set('nodes', [
  [0, 0]
])
map.get('off').set('code', () => [false])
map.get('off').set('ins', 0)
map.set('on', new MapWithDefault(() => []))
map.get('on').set('nodes', [
  [0, 0]
])
map.get('on').set('code', () => [true])
map.get('on').set('ins', 0)
map.set('buff', new MapWithDefault(() => []))
map.get('buff').set('nodes', [
  [71, 40],
  [187, 40]
])
map.get('buff').set('code', (a) => [a])
map.get('buff').set('ins', 1)
map.set('not', new MapWithDefault(() => []))
map.get('not').set('nodes', [
  [71, 40],
  [187, 40]
])
map.get('not').set('code', (a) => [!a])
map.get('not').set('ins', 1)
map.set('or', new MapWithDefault(() => []))
map.get('or').set('nodes', [
  [71, 33],
  [71, 47],
  [187, 40]
])
map.get('or').set('code', (a, b) => [a || b])
map.get('or').set('ins', 2)
map.set('nor', new MapWithDefault(() => []))
map.get('nor').set('nodes', [
  [71, 33],
  [71, 47],
  [187, 40]
])
map.get('nor').set('code', (a, b) => [!(a || b)])
map.get('nor').set('ins', 2)
map.set('and', new MapWithDefault(() => []))
map.get('and').set('nodes', [
  [71, 33],
  [71, 47],
  [187, 40]
])
map.get('and').set('code', (a, b) => [a && b])
map.get('and').set('ins', 2)
map.set('nand', new MapWithDefault(() => []))
map.get('nand').set('nodes', [
  [71, 33],
  [71, 47],
  [187, 40]
])
map.get('nand').set('code', (a, b) => [!(a && b)])
map.get('nand').set('ins', 2)
map.set('xor', new MapWithDefault(() => []))
map.get('xor').set('nodes', [
  [71, 33],
  [71, 47],
  [187, 40]
])
map.get('xor').set('code', (a, b) => [(a ^ b) == 1])
map.get('xor').set('ins', 2)
map.set('xnor', new MapWithDefault(() => []))
map.get('xnor').set('nodes', [
  [71, 33],
  [71, 47],
  [187, 40]
])
map.get('xnor').set('code', (a, b) => [(a ^ b) == 0])
map.get('xnor').set('ins', 2)
class Connection {
  constructor(node1, node2, x = 0, y = 0) {
    node1.connect(this);
    node2.connect(this);
    this.in = node1;
    this.out = node2;
    this.x = x;
    this.y = y;
    this.on = false;
    objs.get(this.constructor).push(this);
  }
}
class Logic {
  constructor(name = '', x = 0, y = 0, ins = map.get(name).get('ins'), outs = map.get(name).get('nodes').length - map.get(name).get('ins'), code = map.get(name).get('code')) {
    let i = -1
    this.name = name
    this.vars = new MapWithDefault(() => false);
    this.ins = Array.from({
      length: ins
    }, () => { i++; return new Node(name + objs.get(this.constructor).length + '_input' + (i), x + map.get(name).get('nodes')[i][0], y + map.get(name).get('nodes')[i][1]) });
    this.outs = Array.from({
      length: outs
    }, () => { i++; return new Node(name + objs.get(this.constructor).length + '_output' + (i - this.ins.length), x + map.get(name).get('nodes')[i][0], y + map.get(name).get('nodes')[i][1]) });
    this.x = x;
    this.y = y;
    this.block = code;
    objs.get(this.constructor).push(this);
  }
  tick() {
    const out = this.block(...this.ins.map(inNode => inNode.onConnected()), this.vars);
    for (const [i, outNode] of this.outs.entries()) {
      outNode.on = out[i];
    }
  }
}
class Node {
  constructor(name = null, x = 0, y = 0) {
    this.name = name;
    this.connected = [];
    this.x = x;
    this.y = y;
    this.on = false;
    objs.get(this.constructor).push(this);
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
    const all_objs = objs;
    objs = new MapWithDefault(() => []);
    this.parse(save_code);
    all_objs.set(this, objs);
    objs = all_objs;
  }
  parse(save) {
    save(); // TODO: Replace By Parsing
  }
  tick(n = 1) {
    for (let time = Date.now(), tick = 0; tick < n && (Date.now() - time) < 17; tick++) {
      objs.get(this).get(Logic).forEach(_1 => _1.tick());
      const visited = new MapWithDefault(() => false);
      objs.get(this).get(Connection).forEach(con => {
        if (visited.get(con)) return;
        const connected_cons = new MapWithDefault(() => false);
        const is_on = this.collect_connected_cons(con, connected_cons, visited);
        connected_cons.forEach((_, k) => k.on = is_on);
      });
    }
    const nodes = objs.get(this).get(Node).map((n) => n.on);
    objs.get(this).get(Node).forEach((a) => a.on = a.on || a.onConnected())
    this.draw();
    objs.get(this).get(Node).forEach((a, i) => a.on = nodes[i])
  }
  draw() {
    Draw.drawall(objs.get(this))
  }
  collect_connected_cons(con, connected_cons, visited) {
    const cons = con.in.connected.concat(con.out.connected);
    let is_on = con.in.on || con.out.on;
    if (!connected_cons.get(con)) {
      cons.forEach(x => {
        connected_cons.set(x, true);
        visited.set(x, true);
        is_on ||= this.collect_connected_cons(x, connected_cons, visited);
      });
    }
    return is_on;
  }
}
c1 = new Circruit(() => {
  new Logic('nand', 20, 20)
  new Logic('on', 140, 140)
  new Connection(objs.get(Node)[0], objs.get(Node)[3])
  new Connection(objs.get(Node)[1], objs.get(Node)[2])
});

const period = 16 // ms
let lastTime = performance.now();

function loop(timeStamp) {
  lastTime = timeStamp;
  c1.tick(3428329817);
  elapsedTime = timeStamp - lastTime;
  setTimeout(() => window.requestAnimationFrame(loop), period - elapsedTime);
};

window.requestAnimationFrame(loop);
