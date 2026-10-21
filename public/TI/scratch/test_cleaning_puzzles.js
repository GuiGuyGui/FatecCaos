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
  if (sandbox._domReady) sandbox._domReady();

  const state = vm.runInContext('state', sandbox);
  const cases = vm.runInContext('cases', sandbox);

  console.log("=== TESTE DOS PUZZLES DE LIMPEZA (HARDWARE & SOFTWARE) ===");

  // Helper to test a minigame
  function testCleaningPuzzle(type, solverFn, name) {
    const tpl = vm.runInContext("SOLO_THEMES_CATALOG.find(t => t.minigameType === '" + type + "')", sandbox);
    if (!tpl) throw new Error("Tema " + type + " não encontrado no catálogo!");

    const c = vm.runInContext("createClientCase(999, false, generateCaseFromCatalogTheme(SOLO_THEMES_CATALOG.find(t => t.minigameType === '" + type + "')))", sandbox);
    c.mgState = vm.runInContext('createInitialMinigameState()', sandbox);
    c.inMyRoom = true;
    c.arrivedAtDesk = true;
    cases[0] = c;
    state.activeCaseIndex = 0;

    // Open workbench & render step 4
    state.activeTab = 'conserto';
    vm.runInContext('renderWorkbenchModal()', sandbox);

    // Apply solver
    solverFn(c.mgState);

    // Re-render
    vm.runInContext('renderWorkbenchModal()', sandbox);

    console.log("[" + name + "] minigameDone = " + c.minigameDone + " (Esperado: true)");
    if (!c.minigameDone) {
      throw new Error("Falha na conclusão do puzzle " + name + " (" + type + ")!");
    }
  }

  // 1. Limpeza Física: Soprador de ar e pó (dust_blower)
  testCleaningPuzzle('dust_blower', (mg) => {
    mg.dustSpots = [0, 0, 0, 0, 0, 0];
  }, 'Limpeza de Poeira e Teias (Soprador de Ar)');

  // 2. Limpeza Física: Raspagem de pasta ressecada (thermal_spatula)
  testCleaningPuzzle('thermal_spatula', (mg) => {
    mg.crustScraped = [true, true, true];
    mg.newPasteApplied = true;
  }, 'Limpeza de Pasta Térmica Ressecada');

  // 3. Limpeza Física: Desobstrução de Ventoinhas (fan_unjam)
  testCleaningPuzzle('fan_unjam', (mg) => {
    mg.fanHairsRemoved = [true, true];
    mg.fanOiled = [true, true];
  }, 'Desobstrução e Limpeza de Ventoinhas');

  // 4. Limpeza Física: Ninho de Baratas e Expurgo (cockroach_nest)
  testCleaningPuzzle('cockroach_nest', (mg) => {
    mg.roachesCleared = [true, true, true, true, true];
    mg.eggsDisinfected = true;
  }, 'Expurgo e Descontaminação de Fonte');

  // 5. Limpeza Física: Contatos de Memória RAM Oxidados (ram_contacts)
  testCleaningPuzzle('ram_contacts', (mg) => {
    mg.oxidationCleaned = [true, true, true, true];
  }, 'Limpeza de Oxidação com Borracha em Contatos RAM');

  // 6. Limpeza Lógica: Cookies e Rastreadores (cookie_cleaner)
  testCleaningPuzzle('cookie_cleaner', (mg) => {
    mg.cookieCategories.tracking = true;
    mg.cookieCategories.supercookies = true;
    mg.cookieCategories.zombie = true;
    mg.cookieCategories.beacons = true;
  }, 'Limpeza de Cookies e Supercookies Invasivos');

  // 7. Limpeza Lógica: %TEMP% e Arquivos Temporários (temp_cleaner)
  testCleaningPuzzle('temp_cleaner', (mg) => {
    mg.tempCleanPurged = [true, true, true, true];
  }, 'Limpeza de %TEMP%, Cache e 120GB de Arquivos Fantasma');

  // 8. Limpeza Lógica: Desinstalação de Bloatware (bloatware_remover)
  testCleaningPuzzle('bloatware_remover', (mg) => {
    mg.bloatwareList.forEach(b => b.uninstalled = true);
  }, 'Desinstalação e Limpeza de Bloatwares');

  // 9. Limpeza Lógica: Limpeza Profunda DDU de Drivers (ddu_driver_sweep)
  testCleaningPuzzle('ddu_driver_sweep', (mg) => {
    mg.dduSafeMode = true;
    mg.dduDriverRemoved = true;
    mg.dduRegistryCleaned = true;
  }, 'Limpeza Profunda DDU e Registro');

  // 10. Limpeza Lógica: Caça a Cavalos de Troia (trojan_hunter)
  testCleaningPuzzle('trojan_hunter', (mg) => {
    mg.trojans.filter(t => t.bad).forEach(t => t.quarantined = true);
  }, 'Eliminação e Limpeza de Cavalos de Troia / Trojans');

  console.log("\n🎉 TODOS OS PUZZLES DE LIMPEZA DE HARDWARE E SOFTWARE ESTÃO 100% FUNCIONANDO E INTEGRADOS!");
} catch(err) {
  console.error("Erro no teste:", err);
  process.exit(1);
}
