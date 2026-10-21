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
    this.innerHTML = '';
    this.textContent = '';
    this.value = '';
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
  click() {
    this.dispatchEvent({ type: 'click', target: this });
  }
  appendChild(c) { this.children.push(c); }
  querySelectorAll(sel) {
    // Collect all elements matching selector in tree
    const list = [];
    function walk(el) {
      if (el !== fakeDoc) {
        let match = false;
        if (sel.startsWith('.')) {
          if (el.classList.contains(sel.slice(1))) match = true;
        } else if (sel.startsWith('#')) {
          if (el.id === sel.slice(1)) match = true;
        } else if (sel.startsWith('[')) {
          const attr = sel.replace(/[\[\]]/g, '');
          const camel = attr.replace(/^data-/, '').replace(/-([a-z])/g, (_, l) => l.toUpperCase());
          if (el.dataset[camel] !== undefined || el.dataset[attr] !== undefined) match = true;
        }
        if (match) list.push(el);
      }
      (el.children || []).forEach(walk);
    }
    walk(this);
    return list;
  }
  querySelector(sel) {
    const all = this.querySelectorAll(sel);
    return all[0] || null;
  }
  closest(sel) { return null; }
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
  createElement: (tag) => new DOMElement(tag),
  querySelectorAll: (sel) => [],
  querySelector: (sel) => new DOMElement('div'),
  addEventListener: (ev, fn) => {
    if (ev === 'DOMContentLoaded') sandbox._domReady = fn;
  },
  body: new DOMElement('body'),
  documentElement: new DOMElement('html')
};

class FakeImage {
  constructor() {
    this.onload = null;
    this.complete = true;
    this.width = 100;
    this.height = 100;
  }
}

const sandbox = {
  document: fakeDoc,
  window: {
    innerWidth: 1200,
    innerHeight: 800,
    addEventListener: (evt, fn) => {
      if (evt === 'DOMContentLoaded') sandbox._domReady = fn;
    },
    removeEventListener: () => {},
    localStorage: { getItem: () => null, setItem: () => {} },
    requestAnimationFrame: (cb) => { sandbox._loop = cb; return 1; },
    cancelAnimationFrame: () => {},
    AudioContext: class {
      constructor() { this.state = 'running'; }
      createOscillator() { return { connect: () => {}, start: () => {}, stop: () => {} }; }
      createGain() { return { connect: () => {}, gain: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} } }; }
      resume() { return Promise.resolve(); }
    },
    webkitAudioContext: class {},
    Audio: class { play() { return Promise.resolve(); } pause() {} },
    Image: FakeImage,
    navigator: { clipboard: { writeText: () => Promise.resolve() } }
  },
  console: console,
  Image: FakeImage,
  requestAnimationFrame: (cb) => { sandbox._loop = cb; return 1; },
  cancelAnimationFrame: () => {},
  Peer: function() { return { on: () => {} }; },
  setTimeout: (fn) => setTimeout(fn, 0),
  clearTimeout: () => {},
  setInterval: () => 123,
  clearInterval: () => {},
  Math,
  Date,
  Array,
  Object,
  String,
  Number,
  Boolean,
  JSON,
  RegExp,
  Set,
  Map,
  Proxy
};
sandbox.window.document = fakeDoc;
sandbox.window.window = sandbox.window;

vm.createContext(sandbox);
vm.runInContext(js, sandbox);
if (sandbox._domReady) sandbox._domReady();

const catalog = vm.runInContext('SOLO_THEMES_CATALOG', sandbox);
const state = vm.runInContext('state', sandbox);
const cases = vm.runInContext('cases', sandbox);

console.log(`=== TESTE COMPLETO DE RENDERIZAÇÃO DOS 30 TEMAS COM DIAGNÓSTICO APROVADO ===`);

catalog.forEach((theme, idx) => {
  const c = {
    id: idx + 1,
    clientName: 'Cliente ' + idx,
    device: 'PC Gamer',
    problem: theme.variations[0].theme,
    quote: 'Teste',
    minigameType: theme.minigameType,
    requiredPart: theme.requiredPart,
    diagnosisApproved: true,
    minigameDone: false,
    inMyRoom: true,
    arrivedAtDesk: true,
    leavingState: null,
    mgState: vm.runInContext('createInitialMinigameState()', sandbox),
    questions: [],
    tools: [],
    diagnoses: []
  };
  cases[0] = c;
  state.activeCaseIndex = 0;
  state.activeTab = 'minigame';

  try {
    vm.runInContext('renderWorkbenchModal()', sandbox);
    const container = fakeDoc.getElementById('minigame-container');
    const htmlLen = container.innerHTML ? container.innerHTML.length : 0;
    if (htmlLen < 50) {
      console.error(`❌ Tema ${theme.minigameType} falhou: HTML muito curto (${htmlLen})`);
    } else {
      console.log(`✔ [${idx + 1}/30] ${theme.minigameType}: OK (${htmlLen} chars)`);
    }
  } catch (e) {
    console.error(`❌ ERRO NO TEMA ${theme.minigameType}:`, e);
  }
});
