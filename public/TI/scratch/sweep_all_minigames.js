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
  appendChild(c) { this.children.push(c); }
  querySelectorAll(sel) {
    // Simple query selector to simulate finding elements with attributes
    const results = [];
    const attrMatch = sel.match(/\[([a-zA-Z0-9_-]+)\]/);
    if (attrMatch) {
      // Return dummy elements that have dataset keys
      const attr = attrMatch[1];
      const camel = attr.replace(/^data-/, '').replace(/-([a-z])/g, (_, l) => l.toUpperCase());
      for (let i = 0; i < 4; i++) {
        const el = new DOMElement('button');
        el.dataset[camel] = String(i);
        results.push(el);
      }
    }
    return results;
  }
  querySelector(sel) { return new DOMElement('span'); }
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

console.log(`=== VARREDURA DE TODOS OS ${catalog.length} TEMAS DE MINIGAMES ===`);

let passedCount = 0;
let errors = [];

catalog.forEach((theme, index) => {
  const type = theme.minigameType;
  const variation = theme.variations[0];

  // Create real case from this theme
  const c = {
    id: index + 1,
    code: `Chamado #${String(index + 1).padStart(2, '0')}`,
    clientName: "Cliente Teste",
    urgency: theme.urgency,
    tagClass: theme.tagClass,
    device: "PC Desktop Gamer",
    problem: variation.theme,
    quote: variation.quote,
    reward: 500,
    minigameType: type,
    requiredPart: theme.requiredPart,
    mentorHint: "Dica de teste",
    questions: variation.questions.map(q => ({ q: q.q, a: q.a, asked: false })),
    tools: variation.tools.map(t => ({ name: t.name, result: t.result, ran: false })),
    diagnoses: [
      { title: variation.correct.title, desc: variation.correct.desc, correct: true, burnReason: "" },
      ...variation.wrongs.map(w => ({ title: w.title, desc: w.desc, correct: false, burnReason: w.burnReason }))
    ],
    inMyRoom: true,
    arrivedAtDesk: true,
    leavingState: null,
    diagnosisApproved: false,
    minigameDone: false,
    mgState: vm.runInContext('createInitialMinigameState()', sandbox)
  };

  cases[0] = c;
  state.activeCaseIndex = 0;

  try {
    // 1. Test opening modal with diagnosisApproved = false
    state.activeTab = 'minigame';
    vm.runInContext('renderWorkbenchModal()', sandbox);
    const container = fakeDoc.getElementById('minigame-container');
    if (!container.innerHTML.includes('Diagnóstico Pendente') && !container.innerHTML.includes('Etapa 4')) {
      throw new Error(`Banner de diagnóstico pendente ausente para ${type}`);
    }

    // 2. Test opening modal with diagnosisApproved = true
    c.diagnosisApproved = true;
    vm.runInContext('renderWorkbenchModal()', sandbox);
    if (!container.innerHTML || container.innerHTML.length < 50) {
      throw new Error(`HTML do minigame vazio ou muito curto para ${type}`);
    }

    passedCount++;
    console.log(`✔ [${index + 1}/30] ${type}: OK!`);
  } catch (err) {
    console.error(`❌ [${index + 1}/30] Falha no tema ${type}:`, err.message);
    errors.push({ type, error: err.message, stack: err.stack });
  }
});

console.log(`\nResultado da Varredura: ${passedCount}/${catalog.length} minigames testados com sucesso.`);
if (errors.length > 0) {
  console.error("Erros encontrados:", errors);
  process.exit(1);
}
