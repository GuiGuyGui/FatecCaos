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
  querySelector: (sel) => {
    return new DOMElement('div');
  },
  querySelectorAll: (sel) => {
    return [new DOMElement('div')];
  },
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
  requestAnimationFrame: (cb) => 1,
  setInterval: () => 123,
  clearTimeout: () => {},
  clearInterval: () => {},
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
  console.log("Script executed cleanly in sandbox!");

  if (sandbox._domReady) {
    sandbox._domReady();
    console.log("DOMContentLoaded executed cleanly!");
  }

  const state = vm.runInContext('state', sandbox);
  const cases = vm.runInContext('cases', sandbox);
  const you = state.players[state.mySlotIndex];

  console.log(`Initial player position: (${you.x}, ${you.y})`);
  console.log(`Cases total: ${cases.length}`);

  const clientsInRoomInitial = cases.filter(c => c.inMyRoom && !c.leavingState);
  console.log(`Clients in room at boot: ${clientsInRoomInitial.length} (Expected: 0)`);
  if (clientsInRoomInitial.length !== 0) {
    throw new Error("Client was auto-summoned into the room at boot instead of waiting in reception!");
  }

  // TEST 1: Interact with workbench without calling client
  console.log("\n--- TEST 1: Interact with workbench with NO client called ---");
  const wbModal = fakeDoc.getElementById('workbench-modal');
  vm.runInContext('interactWithMyWorkbench()', sandbox);
  console.log(`Workbench modal open? ${wbModal.classList.contains('open')} (Expected: false)`);
  if (wbModal.classList.contains('open')) {
    throw new Error("Workbench modal opened when no client was in room!");
  }

  // TEST 2: Walk to Reception Counter and interact
  console.log("\n--- TEST 2: Walk to Reception Counter and interact ---");
  const map = vm.runInContext('currentMap()', sandbox);
  const counter = map.interactables.find(i => i.id === 'reception_counter');
  console.log(`Reception Counter interactable: (${counter.x}, ${counter.y}) - label: "${counter.label}"`);
  you.x = counter.x;
  you.y = counter.y;

  vm.runInContext('interactWithReceptionCounter()', sandbox);
  console.log(`Workbench modal open after counter interaction? ${wbModal.classList.contains('open')} (Expected: false)`);
  if (wbModal.classList.contains('open')) {
    throw new Error("Reception Counter directly opened workbench modal!");
  }

  const calledClient = cases.find(c => c.inMyRoom);
  console.log(`Client summoned to room: ${calledClient ? calledClient.clientName : 'None'} (inMyRoom=${calledClient?.inMyRoom})`);
  if (!calledClient) {
    throw new Error("No client was summoned to the room!");
  }

  // TEST 3: Walk to workbench and attend client
  console.log("\n--- TEST 3: Walk to workbench and attend client ---");
  const wb = map.interactables.find(i => i.id === 'my_workbench');
  console.log(`Workbench interactable: (${wb.x}, ${wb.y}) - label: "${wb.label}"`);
  you.x = wb.x;
  you.y = wb.y;
  calledClient.arrivedAtDesk = true;
  calledClient.walkingToDesk = false;

  vm.runInContext('interactWithMyWorkbench()', sandbox);
  console.log(`Workbench modal open after attending client at workbench? ${wbModal.classList.contains('open')} (Expected: true)`);
  if (!wbModal.classList.contains('open')) {
    throw new Error("Failed to open workbench modal when interacting at workbench with client present!");
  }
  wbModal.classList.remove('open');

  // TEST 4: Try to open Central Rack while far away at workbench
  console.log("\n--- TEST 4: Try to open Central Rack from afar (at workbench) ---");
  const rackModal = fakeDoc.getElementById('central-rack-modal');
  vm.runInContext('openCentralRackModal()', sandbox);
  console.log(`Rack modal open while player is far away? ${rackModal.classList.contains('open')} (Expected: false)`);
  if (rackModal.classList.contains('open')) {
    throw new Error("Central Rack modal opened from afar!");
  }

  // TEST 5: Walk to Central Rack and open
  console.log("\n--- TEST 5: Walk to Central Rack and interact ---");
  const rack = map.interactables.find(i => i.id === 'central_rack');
  console.log(`Central Rack interactable: (${rack.x}, ${rack.y}) - label: "${rack.label}"`);
  you.x = rack.x;
  you.y = rack.y + 70;

  vm.runInContext('openCentralRackModal()', sandbox);
  console.log(`Rack modal open while player is at Central Rack? ${rackModal.classList.contains('open')} (Expected: true)`);
  if (!rackModal.classList.contains('open')) {
    throw new Error("Failed to open Central Rack modal when standing at Central Rack!");
  }

  console.log("\n✅ ALL 5 BEHAVIORAL VERIFICATION TESTS PASSED FLAWLESSLY! 🚀🎉");
} catch(err) {
  console.error("Test failed:", err);
  process.exit(1);
}
