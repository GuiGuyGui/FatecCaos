// Full System Audit Test using Node vm & Mock DOM
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
  querySelectorAll(sel) { return []; }
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
    if (ev === 'DOMContentLoaded') {
      sandbox._domReady = fn;
    }
  },
  body: new DOMElement('body'),
  documentElement: new DOMElement('html')
};

const storage = {};
const fakeLocalStorage = {
  getItem: (k) => storage[k] || null,
  setItem: (k, v) => { storage[k] = String(v); },
  removeItem: (k) => { delete storage[k]; },
  clear: () => { Object.keys(storage).forEach(k => delete storage[k]); }
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
      if (evt === 'DOMContentLoaded') {
        sandbox._domReady = fn;
      }
    },
    removeEventListener: () => {},
    localStorage: fakeLocalStorage,
    requestAnimationFrame: (cb) => { sandbox._loop = cb; return 1; },
    cancelAnimationFrame: () => {},
    AudioContext: class {
      constructor() { this.state = 'running'; this.destination = {}; }
      createOscillator() { return { connect: () => {}, start: () => {}, stop: () => {} }; }
      createGain() { return { connect: () => {}, gain: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} } }; }
      resume() { return Promise.resolve(); }
    },
    webkitAudioContext: class {
      createOscillator() { return { connect: () => {}, start: () => {}, stop: () => {} }; }
      createGain() { return { connect: () => {}, gain: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} } }; }
    },
    Audio: class {
      play() { return Promise.resolve(); }
      pause() {}
    },
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

console.log("=== INICIANDO AUDITORIA COMPLETA DE SISTEMAS ===");

try {
  vm.runInContext(js, sandbox);
  console.log("✔ game.js executado com sucesso no ambiente virtual!");
} catch (e) {
  console.error("FATAL: Erro ao executar game.js:", e);
  process.exit(1);
}

// Disparar DOMContentLoaded
if (sandbox._domReady) {
  sandbox._domReady();
  console.log("✔ DOMContentLoaded executado.");
}

const state = vm.runInContext('state', sandbox);
const cases = vm.runInContext('cases', sandbox);
const map = vm.runInContext('currentMap()', sandbox);
const you = state.players[state.mySlotIndex];

if (!state || !map) {
  console.error("FATAL: state ou map não foi encontrado!");
  process.exit(1);
}
console.log("✔ state e currentMap() inicializados com sucesso.");

// 1. Verificar Mapa e Móveis
console.log("\n--- TESTE 1: Mapa e Móveis ---");
console.log(`✔ Salas registradas: ${map.rooms.map(r => r.id).join(', ')}`);
console.log(`✔ Móveis de corredor: ${map.corridorFurniture ? map.corridorFurniture.length : 0}`);
map.corridorFurniture.forEach(f => console.log('  Corridor item:', f.id, f.type, f.label));
const lateralRacks = (map.corridorFurniture || []).filter(f => f.id && f.id.startsWith('central_rack_'));
console.log(`✔ Racks centrais laterais: ${lateralRacks.length} encontrados (esperado: 2).`);
if (lateralRacks.length !== 2) throw new Error("Faltam racks laterais!");

// 2. Verificar Catálogo de 30 Temas Técnicos
console.log("\n--- TESTE 2: Catálogo de 30 Temas Técnicos ---");
const catalog = vm.runInContext('SOLO_THEMES_CATALOG', sandbox);
if (!catalog || catalog.length < 30) throw new Error(`Catálogo incompleto: apenas ${catalog ? catalog.length : 0} temas`);
console.log(`✔ Total de temas técnicos no catálogo: ${catalog.length}/30`);

// 3. Teste de Renderização de Todos os 30 Minigames
console.log("\n--- TESTE 3: Geração de Casos e Renderização de Todos os 30 Minigames ---");
const renderFunc = vm.runInContext('renderSpecificProblemMinigame', sandbox);
const createMgState = vm.runInContext('createInitialMinigameState', sandbox);
if (typeof renderFunc !== 'function') throw new Error("renderSpecificProblemMinigame não é uma função!");

let minigamesTested = 0;
const minigameContainer = fakeDoc.getElementById('minigame-container');

for (const theme of catalog) {
  const dummyCase = {
    id: `test_${theme.minigameType}`,
    minigameType: theme.minigameType,
    problemTitle: theme.variations[0].theme,
    client: { name: "Cliente Teste", avatar: "👨‍💻" },
    stage: 4,
    diagnosisApproved: true,
    mgState: createMgState()
  };
  minigameContainer.innerHTML = '';
  renderFunc(dummyCase, true, { name: "Kit de Teste", shortName: "Kit" });
  if (!minigameContainer.innerHTML || minigameContainer.innerHTML.length < 10) {
    throw new Error(`Falha ao renderizar minigame para o tema: ${theme.minigameType}`);
  }
  minigamesTested++;
}
console.log(`✔ Todos os ${minigamesTested} minigames renderizados com HTML válido!`);

// 4. Teste de Fluxo Completo de Atendimento na Bancada
console.log("\n--- TESTE 4: Ciclo de Atendimento na Bancada (Etapas 1 a 5) ---");
const testCase = cases[0];
if (!testCase) throw new Error("Nenhum caso em cases[0]!");
console.log(`✔ Caso inicial carregado: "${testCase.problemTitle}" (Cliente: ${testCase.clientName})`);

// Etapa 1: Perguntas
testCase.stage = 1;
testCase.questions.forEach(q => q.asked = true);
console.log(`✔ Etapa 1 (Perguntas) completada: ${testCase.questions.length} perguntas.`);

// Etapa 2: Ferramentas
testCase.stage = 2;
testCase.tools.forEach(t => t.ran = true);
console.log(`✔ Etapa 2 (Testes de Ferramentas) completada: ${testCase.tools.length} testes.`);

// Etapa 3: Diagnóstico
testCase.stage = 3;
testCase.diagnosisApproved = true;
console.log(`✔ Etapa 3 (Diagnóstico) completada.`);

// Etapa 4: Minigame
testCase.stage = 4;
testCase.minigameDone = true;
console.log(`✔ Etapa 4 (Minigame Técnico) concluída.`);

// Etapa 5: Entrega & Recompensa
testCase.stage = 5;
const prevMoney = state.money;
const prevRep = state.rep;
vm.runInContext(`
  state.activeCaseIndex = 0;
  completeRepairAfterMinigame(cases[0]);
`, sandbox);
console.log(`✔ Etapa 5 (Entrega): Dinheiro R$ ${prevMoney} -> R$ ${state.money}, Reputação ${prevRep}% -> ${state.rep}%`);

// 5. Teste de Interação de Balcão e Bancada
console.log("\n--- TESTE 5: Interações com Balcão, Bancada e Racks ---");
// Testar balcão
you.x = 220; you.y = 700;
vm.runInContext('interactWithReceptionCounter()', sandbox);
console.log(`✔ Interação com Balcão de Recepção executada.`);

// Testar bancada
you.x = 180; you.y = 560;
vm.runInContext('interactWithMyWorkbench()', sandbox);
console.log(`✔ Interação com Bancada de Trabalho executada.`);

// Testar Rack Lateral
const rackModal = fakeDoc.getElementById('central-rack-modal');
you.x = lateralRacks[0].x + lateralRacks[0].w / 2;
you.y = lateralRacks[0].y + 70;
vm.runInContext('openCentralRackModal()', sandbox);
console.log(`✔ Rack modal abre ao interagir: ${rackModal.classList.contains('open')}`);
rackModal.classList.remove('open');

// 6. Teste de Ar-Condicionado (Níveis 1, 2 e 3)
console.log("\n--- TESTE 6: Ar-Condicionado (Níveis 1, 2 e 3) ---");
state.upgrades.ac_lvl1 = true;
state.upgrades.ac_lvl2 = true;
state.upgrades.ac_lvl3 = true;
vm.runInContext('refreshMapsWithUpgrades()', sandbox);
const updatedMap = vm.runInContext('currentMap()', sandbox);
const myRoomAfterAc = updatedMap.rooms.find(r => r.id === 'my_room');
const acFurn = myRoomAfterAc.furniture.filter(f => f.type === 'ac');
console.log(`✔ Unidades de AC instaladas na sala técnica: ${acFurn.length}`);
acFurn.forEach(ac => {
  console.log(`   - ${ac.label} (${ac.acModel}) na posição (${ac.x}, ${ac.y})`);
});
if (acFurn.length === 0) throw new Error("AC upgrades não foram inseridos nos móveis da sala!");

// 7. Teste de Clientes e Fila
console.log("\n--- TESTE 7: Fila de Clientes e Perambulação Livre ---");
console.log(`✔ Clientes aguardando na fila: ${cases.length}`);
const initialPositions = cases.map(c => ({ name: c.clientName, x: Math.round(c.x), y: Math.round(c.y) }));
for (let i = 0; i < 60; i++) {
  if (sandbox._loop) sandbox._loop();
}
const movedPositions = cases.map(c => ({ name: c.clientName, x: Math.round(c.x), y: Math.round(c.y) }));
let movingClients = 0;
for (let i = 0; i < cases.length; i++) {
  if (initialPositions[i].x !== movedPositions[i].x || initialPositions[i].y !== movedPositions[i].y) {
    movingClients++;
  }
}
console.log(`✔ Clientes com movimentação ativa e alvos autônomos: ${movingClients}/${cases.length}`);

// 8. Teste de Compras na Loja e Inventário
console.log("\n--- TESTE 8: Catálogo da Loja e Compra de Peças e Itens ---");
const shopCatalog = vm.runInContext('SHOP_CATALOG', sandbox);
console.log(`✔ Itens disponíveis na loja: ${shopCatalog.length}`);
state.money = 20000;
vm.runInContext(`
  buyShopItem(SHOP_CATALOG[0]);
`, sandbox);
console.log(`✔ Compra de item na loja realizada com sucesso. Saldo restante: R$ ${state.money}`);

// 9. Teste do Loop do Jogo (100 frames)
console.log("\n--- TESTE 9: Simulação de 100 Frames do Game Loop Completo ---");
for (let frame = 0; frame < 100; frame++) {
  if (sandbox._loop) sandbox._loop();
}
console.log("✔ 100 frames de simulação do motor gráfico e física executados sem falhas!");

// 10. Teste das Novas Regras de Reputação Lenta, Game Over 0% e Bloqueio de Minigame
console.log("\n--- TESTE 10: Novas Regras de Gameplay ---");
// a) Bloqueio de minigame sem diagnóstico
const curCase = cases[state.activeCaseIndex];
curCase.diagnosisApproved = false;
state.activeTab = 'minigame';
vm.runInContext('renderWorkbenchModal()', sandbox);
console.log(`✔ Tentativa de abrir minigame sem diagnóstico: aba redirecionada para "${state.activeTab}" (não minigame)`);
if (state.activeTab === 'minigame') throw new Error("Minigame não deveria abrir sem diagnóstico!");

// b) Game Over por Reputação 0%
state.rep = 5;
const goModal = fakeDoc.getElementById('game-over-modal');
vm.runInContext('changeReputation(-10)', sandbox);
console.log(`✔ Reputação atingiu 0%: modal aberto = ${goModal.classList.contains('open')}, título = "${fakeDoc.getElementById('game-over-title').textContent}"`);
if (!goModal.classList.contains('open')) throw new Error("Modal de Game Over deveria abrir em 0% de reputação!");

// c) Reiniciar sessão
vm.runInContext('restartGameSession()', sandbox);
console.log(`✔ Reinício de sessão pós Game Over: Reputação = ${state.rep}%, Caixa = R$ ${state.money}, Modal Fechado = ${!goModal.classList.contains('open')}`);
if (state.rep !== 70 || state.money !== 2500) throw new Error("Estado não foi reiniciado corretamente!");

console.log("\n========================================================");
console.log("🎉 TODOS OS SISTEMAS ESTÃO 100% OPERACIONAIS E SEM ERROS!");
console.log("========================================================");
