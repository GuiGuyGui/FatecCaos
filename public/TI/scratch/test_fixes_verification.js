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

const state = vm.runInContext('state', sandbox);
const cases = vm.runInContext('cases', sandbox);
const centralRackState = vm.runInContext('centralRackState', sandbox);
const map = vm.runInContext('currentMap()', sandbox);
const collidesAt = vm.runInContext('collidesAt', sandbox);

console.log("==================================================");
console.log("🚀 VERIFICAÇÃO DAS 3 CORREÇÕES SOLICITADAS");
console.log("==================================================");

// --------------------------------------------------------------------------
// TESTE 1: RACK CENTRAL - EXPLOIT DE DINHEIRO INFINITO E MULTI-PUZZLE
// --------------------------------------------------------------------------
console.log("\n--- TESTE 1: Rack Central (Exploit e Multi-Puzzles) ---");

// A. Verificar que clicar sem incidente não dá dinheiro nem reputação
centralRackState.incidentActive = false;
const moneyBefore = state.money;
const repBefore = state.rep;

const completeBtn = fakeDoc.getElementById('btn-complete-rack-puzzle');
// Posiciona o jogador perto do rack
const you = state.players[state.mySlotIndex];
const rackPos = map.corridorFurniture.find(f => f.id === 'central_rack_1');
you.x = rackPos.x + 20;
you.y = rackPos.y + 70;

completeBtn.click();

console.log(`Exploit Bloqueado? Dinheiro inicial: R$ ${moneyBefore} | Atual: R$ ${state.money} (Esperado: inalterado)`);
console.log(`Reputação inicial: ${repBefore}% | Atual: ${state.rep}% (Esperado: inalterado)`);
if (state.money !== moneyBefore || state.rep !== repBefore) {
  throw new Error("EXPLOIT AINDA PRESENTE: Clicar no botão sem incidente deu dinheiro ou reputação!");
}

// B. Disparar incidente e verificar escalonamento de puzzles
state.rep = 85;
// Modo Solo: deve escolher de 1 a 4 puzzles dependendo da reputação
vm.runInContext('triggerCentralRackIncident()', sandbox);

console.log(`Incidente ativo? ${centralRackState.incidentActive}`);
console.log(`Número de puzzles exigidos (1 jogador, rep=85): ${centralRackState.requiredProblemIndices.length} (esperado entre 1 e 4)`);
if (centralRackState.requiredProblemIndices.length < 1 || centralRackState.requiredProblemIndices.length > 4) {
  throw new Error("Contagem de puzzles fora do intervalo esperado para 1 jogador!");
}

// Testar escalonamento para 4 jogadores
state.networkMode = 'online';
state.players = [
  { x: rackPos.x + 20, y: rackPos.y + 70, connected: true },
  { connected: true }, { connected: true }, { connected: true }
];
vm.runInContext('triggerCentralRackIncident()', sandbox);
console.log(`Número de puzzles exigidos com 4 jogadores: ${centralRackState.requiredProblemIndices.length} (esperado até 10)`);
if (centralRackState.requiredProblemIndices.length < 6 || centralRackState.requiredProblemIndices.length > 10) {
  throw new Error("Contagem de puzzles para 4 jogadores não escalou até 10!");
}

// C. Testar resolução progressiva dos puzzles e fechamento automático do modal
const rackModal = fakeDoc.getElementById('central-rack-modal');
rackModal.classList.add('open');

const reqList = [...centralRackState.requiredProblemIndices];
console.log(`Resolvendo progressivamente os ${reqList.length} módulos defeituosos:`, reqList);

reqList.forEach((probIdx, step) => {
  centralRackState.selectedPuzzleIdx = probIdx;
  // Simular que o puzzle foi concluído
  vm.runInContext(`
    // Marca o puzzle atual como resolvido
    switch (${probIdx}) {
      case 0: centralRackState.puzzles[0].connections = { 0:0, 1:1, 2:2, 3:3 }; break;
      case 1: centralRackState.puzzles[1].armed = [true, true, true, true]; break;
      case 2: centralRackState.puzzles[2].fans.forEach(f => f.broken = false); break;
      case 3: centralRackState.puzzles[3].rebuildProgress = 100; break;
      case 4: centralRackState.puzzles[4].cleanClicks = 6; centralRackState.puzzles[4].seated = true; break;
      case 5: centralRackState.puzzles[5].connected = { neg48: true, rtn0: true, pe: true }; break;
      case 6: centralRackState.puzzles[6] = { temp: 21, hum: 45, cfm: 1400 }; break;
      case 7: centralRackState.puzzles[7].booted = true; break;
      case 8: centralRackState.puzzles[8].andersonUnplugged = true; centralRackState.puzzles[8].oldPackRemoved = true; centralRackState.puzzles[8].newPackInserted = true; centralRackState.puzzles[8].andersonReplugged = true; break;
      case 9: centralRackState.puzzles[9].switches = [1, 1, 0, 0, 1, 0, 1, 1]; break;
    }
  `, sandbox);

  const isSolv = vm.runInContext(`isCurrentRackPuzzleSolved(${probIdx})`, sandbox);
  console.log(`   - Módulo ${probIdx} isSolved: ${isSolv}`);
  completeBtn.click();
  console.log(`   - Passo ${step + 1}/${reqList.length}: Módulo ${probIdx} confirmado. Solved so far: ${centralRackState.solvedProblemIndices.length}/${reqList.length}`);
});

console.log(`Incidente resolvido? ${!centralRackState.incidentActive} (Esperado: true)`);
console.log(`Modal fechou automaticamente? ${!rackModal.classList.contains('open')} (Esperado: true)`);
if (centralRackState.incidentActive) throw new Error("O incidente não foi finalizado após resolver todos os problemas!");
if (rackModal.classList.contains('open')) throw new Error("O modal não fechou automaticamente após resolver todos os problemas!");

// --------------------------------------------------------------------------
// TESTE 2: MINI-GAMES DOS CLIENTES SEMPRE ABRINDO
// --------------------------------------------------------------------------
console.log("\n--- TESTE 2: Mini-Games dos Clientes Sempre Abrindo ---");
const c = cases[0];
c.inMyRoom = true;
c.arrivedAtDesk = true;
c.diagnosisApproved = false; // Cliente ainda SEM diagnóstico aprovado!
state.activeCaseIndex = 0;
state.activeTab = 'minigame';

vm.runInContext('renderWorkbenchModal()', sandbox);
const mgContainer = fakeDoc.getElementById('minigame-container');
console.log(`Mini-Game abriu sem diagnóstico prévio? ${mgContainer.innerHTML.length > 50} (${mgContainer.innerHTML.length} caracteres)`);
if (mgContainer.innerHTML.length < 50) {
  throw new Error("Mini-game falhou ao abrir!");
}

// --------------------------------------------------------------------------
// TESTE 3: NAVEGAÇÃO DO CLIENTE ATÉ A MESA E BANQUINHO
// --------------------------------------------------------------------------
console.log("\n--- TESTE 3: Rota Garantida até o Banquinho ---");
state.networkMode = 'offline';
cases[1].inMyRoom = false;
cases[1].x = 650;
cases[1].y = 750;

vm.runInContext('callClientToMyRoom(1)', sandbox);
const targetClient = cases[1];

console.log(`Cliente walkingToDesk? ${targetClient.walkingToDesk}`);
console.log(`Waypoints gerados: ${JSON.stringify(targetClient.waypoints)}`);

// Verificar se algum waypoint colide
targetClient.waypoints.forEach((wp, wIdx) => {
  const col = collidesAt(wp.x, wp.y, 14);
  console.log(`   Waypoint ${wIdx} (${wp.x}, ${wp.y}) colisão: ${col}`);
  if (col) throw new Error(`Waypoint ${wIdx} colide com obstáculo!`);
});

const lastWp = targetClient.waypoints[targetClient.waypoints.length - 1];
const stool = map.clientStoolPos;
console.log(`Último waypoint é o banquinho? (${lastWp.x}, ${lastWp.y}) === (${stool.x}, ${stool.y})`);
if (lastWp.x !== stool.x || lastWp.y !== stool.y) {
  throw new Error("O cliente não tem como destino o banquinho da mesa!");
}

// Testar atendimento imediato na bancada (sem travar o jogador)
you.x = 180; you.y = 560; // na bancada
vm.runInContext('interactWithMyWorkbench()', sandbox);
console.log(`Ao interagir na bancada, cliente sentou no banquinho? arrivedAtDesk = ${targetClient.arrivedAtDesk}`);
console.log(`Coordenada do cliente: (${targetClient.x}, ${targetClient.y}) === (${stool.x}, ${stool.y})`);
if (!targetClient.arrivedAtDesk || targetClient.x !== stool.x || targetClient.y !== stool.y) {
  throw new Error("Cliente não sentou imediatamente no banquinho ao usar a bancada!");
}

console.log("\n==================================================");
console.log("🎉 TODAS AS 3 CORREÇÕES VALIDADAS COM 100% DE SUCESSO!");
console.log("==================================================");
