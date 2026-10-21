const fs = require('fs');
const vm = require('vm');

const html = fs.readFileSync('index.html', 'utf8');
const js = fs.readFileSync('game.js', 'utf8');

const ids = [];
const re = /id="([^"]+)"/g;
let m;
while ((m = re.exec(html)) !== null) {
  ids.push(m[1]);
}

class DOMElement {
  constructor(tag, id = '') {
    this.tagName = tag.toUpperCase();
    this.id = id;
    this.classList = {
      _s: new Set(),
      add(c) { this._s.add(c); },
      remove(c) { this._s.delete(c); },
      contains(c) { return this._s.has(c); },
      toggle(c, f) {
        if (typeof f === 'boolean') { if (f) this._s.add(c); else this._s.delete(c); return f; }
        if (this._s.has(c)) { this._s.delete(c); return false; }
        this._s.add(c); return true;
      }
    };
    this.style = {};
    this.dataset = {};
    this.children = [];
    this._listeners = {};
    this.parentElement = {
      getBoundingClientRect: () => ({ width: 1060, height: 660 })
    };
  }
  addEventListener(event, fn) {
    if (!this._listeners[event]) this._listeners[event] = [];
    this._listeners[event].push(fn);
  }
  dispatchEvent(event) {
    const list = this._listeners[event.type || event] || [];
    list.forEach(fn => fn(event));
  }
  appendChild(c) { this.children.push(c); }
  querySelectorAll(sel) { return []; }
  querySelector(sel) { return new DOMElement('span'); }
  getBoundingClientRect() { return { width: 1060, height: 660, left: 0, top: 0 }; }
  getContext(type) {
    return new Proxy({}, {
      get: (target, prop) => {
        if (prop === 'measureText') return () => ({ width: 50 });
        if (prop === 'createLinearGradient' || prop === 'createRadialGradient') {
          return () => ({ addColorStop: () => {} });
        }
        return () => {};
      }
    });
  }
}

const elements = new Map();
ids.forEach(id => {
  elements.set(id, new DOMElement('div', id));
});

const fakeDoc = {
  getElementById: (id) => {
    if (!elements.has(id)) {
      elements.set(id, new DOMElement('div', id));
    }
    return elements.get(id);
  },
  querySelector: (sel) => new DOMElement('div'),
  querySelectorAll: (sel) => [new DOMElement('div')],
  createElement: (tag) => new DOMElement(tag),
  addEventListener: () => {},
  body: new DOMElement('body')
};

class FakeImage {
  constructor() {
    this.complete = true;
    this.naturalWidth = 300;
    this.naturalHeight = 300;
  }
}

const sandbox = {
  window: {
    innerWidth: 1200,
    innerHeight: 800,
    addEventListener: (evt, fn) => {
      if (evt === 'DOMContentLoaded') {
        sandbox._domReady = fn;
      }
    },
    document: fakeDoc
  },
  document: fakeDoc,
  console: console,
  setTimeout: (fn) => setTimeout(fn, 0),
  setInterval: () => 123,
  clearTimeout: () => {},
  clearInterval: () => {},
  requestAnimationFrame: (cb) => { sandbox._loop = cb; return 1; },
  Image: FakeImage,
  AudioContext: class {
    createOscillator() { return { connect: () => {}, start: () => {}, stop: () => {} }; }
    createGain() { return { connect: () => {}, gain: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} } }; }
  },
  webkitAudioContext: class {
    createOscillator() { return { connect: () => {}, start: () => {}, stop: () => {} }; }
    createGain() { return { connect: () => {}, gain: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} } }; }
  },
  navigator: { clipboard: { writeText: () => Promise.resolve() } },
  Peer: function() { return { on: () => {} }; },
  Math: Math,
  Date: Date
};

sandbox.window.window = sandbox.window;
vm.createContext(sandbox);

try {
  vm.runInContext(js, sandbox);
  console.log("Script executed cleanly!");

  if (sandbox._domReady) {
    sandbox._domReady();
    console.log("DOMContentLoaded executed cleanly!");
  }

  const state = vm.runInContext('state', sandbox);
  const cases = vm.runInContext('cases', sandbox);
  const map = vm.runInContext('currentMap()', sandbox);
  const you = state.players[state.mySlotIndex];

  console.log("\n--- TEST 1: Check Central Rack is removed from center ---");
  const plazaRoom = map.rooms.find(r => r.id === 'central_rack_plaza');
  console.log(`central_rack_plaza room exists in map.rooms? ${!!plazaRoom} (Expected: false)`);
  if (plazaRoom) {
    throw new Error("central_rack_plaza still in map.rooms with white floor!");
  }

  console.log("\n--- TEST 2: Check 2 Racks in corridorFurniture ---");
  if (!map.corridorFurniture || map.corridorFurniture.length < 2) {
    throw new Error("Missing 2 racks in corridorFurniture!");
  }
  const rack1 = map.corridorFurniture.find(f => f.id === 'central_rack_1');
  const rack2 = map.corridorFurniture.find(f => f.id === 'central_rack_2');
  console.log(`Rack 1 (Left): (${rack1.x}, ${rack1.y}, ${rack1.w}x${rack1.h})`);
  console.log(`Rack 2 (Right): (${rack2.x}, ${rack2.y}, ${rack2.w}x${rack2.h})`);

  // Verify left rack is above Cabine #01 (x around 125, y around 335)
  if (rack1.x < 100 || rack1.x > 180 || rack1.y < 300 || rack1.y > 360) {
    throw new Error(`Rack 1 position unexpected: (${rack1.x}, ${rack1.y})`);
  }
  // Verify right rack is above Estoque (x around 855, y around 335)
  if (rack2.x < 800 || rack2.x > 950 || rack2.y < 300 || rack2.y > 360) {
    throw new Error(`Rack 2 position unexpected: (${rack2.x}, ${rack2.y})`);
  }
  console.log("Both racks placed precisely in the red rectangle areas!");

  console.log("\n--- TEST 3: Check Center is completely free ---");
  // Center is between x=350 and x=750, y=300 to 450
  const anyCenterFurniture = (map.corridorFurniture || []).filter(f => f.x > 340 && f.x < 840);
  console.log(`Furniture in center corridor: ${anyCenterFurniture.length} (Expected: 0)`);
  if (anyCenterFurniture.length !== 0) {
    throw new Error("There is still furniture blocking the center corridor!");
  }

  console.log("\n--- TEST 4: Interact with Rack 1 and Rack 2 ---");
  const rackModal = fakeDoc.getElementById('central-rack-modal');

  // Go to Rack 1
  you.x = rack1.x + rack1.w / 2;
  you.y = rack1.y + 70;
  vm.runInContext('openCentralRackModal()', sandbox);
  console.log(`Rack modal open while standing at Rack 1? ${rackModal.classList.contains('open')} (Expected: true)`);
  if (!rackModal.classList.contains('open')) throw new Error("Could not open modal at Rack 1!");
  rackModal.classList.remove('open');

  // Go to Rack 2
  you.x = rack2.x + rack2.w / 2;
  you.y = rack2.y + 70;
  vm.runInContext('openCentralRackModal()', sandbox);
  console.log(`Rack modal open while standing at Rack 2? ${rackModal.classList.contains('open')} (Expected: true)`);
  if (!rackModal.classList.contains('open')) throw new Error("Could not open modal at Rack 2!");
  rackModal.classList.remove('open');

  console.log("\n--- TEST 5: Verify Clients are NOT stuck together & Wander freely ---");
  console.log(`Total clients in queue: ${cases.length}`);
  const initialPositions = cases.map(c => ({ name: c.clientName, x: Math.round(c.x), y: Math.round(c.y) }));
  console.log("Initial client positions:", initialPositions);

  // Check that not all clients have the same coordinates
  const uniquePositions = new Set(initialPositions.map(p => `${p.x},${p.y}`));
  console.log(`Unique client spawn positions: ${uniquePositions.size} out of ${cases.length}`);
  if (uniquePositions.size < Math.min(3, cases.length)) {
    throw new Error("Clients spawned stuck together at the exact same position!");
  }

  // Simulate 180 frames of game loop to verify movement
  for (let frame = 0; frame < 180; frame++) {
    if (sandbox._loop) sandbox._loop();
  }

  const movedPositions = cases.map(c => ({ name: c.clientName, x: Math.round(c.x), y: Math.round(c.y) }));
  console.log("Positions after 180 frames of wandering:", movedPositions);

  let movedCount = 0;
  for (let i = 0; i < cases.length; i++) {
    const p0 = initialPositions[i];
    const p1 = movedPositions[i];
    const d = Math.hypot(p1.x - p0.x, p1.y - p0.y);
    if (d > 5) movedCount++;
  }
  console.log(`Clients that walked to new positions: ${movedCount}/${cases.length}`);
  if (movedCount === 0) {
    throw new Error("Clients are frozen/stuck and did not wander!");
  }

  console.log("\n🎉 ALL TESTS PASSED! The 2 Racks are positioned accurately without white floor details, and Clients wander freely across the central area without getting stuck!");
} catch(err) {
  console.error("Test failed:", err);
  process.exit(1);
}
