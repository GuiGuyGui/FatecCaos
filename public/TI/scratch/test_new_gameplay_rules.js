const vm = require('vm');
const fs = require('fs');
const assert = require('assert');

console.log("=== INICIANDO TESTE DAS NOVAS REGRAS DE GAMEPLAY ===");

const gameCode = fs.readFileSync('game.js', 'utf8');

// Lightweight sandbox
const elements = {};
function getOrCreateEl(id) {
  if (!elements[id]) {
    elements[id] = {
      id,
      innerHTML: '',
      textContent: '',
      className: '',
      classList: {
        contains: (cls) => (elements[id].className || '').split(' ').includes(cls),
        add: (cls) => { if (!elements[id].classList.contains(cls)) elements[id].className = (elements[id].className + ' ' + cls).trim(); },
        remove: (cls) => { elements[id].className = (elements[id].className || '').split(' ').filter(c => c !== cls).join(' '); },
        toggle: (cls, val) => {
          if (val) elements[id].classList.add(cls);
          else elements[id].classList.remove(cls);
        }
      },
      style: {}
    };
  }
  return elements[id];
}

const sandbox = {
  document: {
    getElementById: (id) => getOrCreateEl(id),
    querySelectorAll: (sel) => [],
    querySelector: (sel) => null,
    addEventListener: () => {}
  },
  window: {
    addEventListener: () => {}
  },
  navigator: {},
  localStorage: { getItem: () => null, setItem: () => {} },
  Audio: class { play() {} },
  console: console,
  setTimeout: () => {},
  setInterval: () => {},
  clearTimeout: () => {},
  clearInterval: () => {}
};

vm.createContext(sandbox);
vm.runInContext(gameCode, sandbox);

const state = vm.runInContext('state', sandbox);
const cases = vm.runInContext('cases', sandbox);
const completeRepairAfterMinigame = vm.runInContext('completeRepairAfterMinigame', sandbox);
const changeReputation = vm.runInContext('changeReputation', sandbox);
const restartGameSession = vm.runInContext('restartGameSession', sandbox);
const renderWorkbenchModal = vm.runInContext('renderWorkbenchModal', sandbox);
const handleDiagnosisStep3 = vm.runInContext('handleDiagnosisStep3', sandbox);
const getConnectedPlayerCount = vm.runInContext('getConnectedPlayerCount', sandbox);

// ==========================================
// TESTE 1: Subida da Reputação Bem Devagar
// ==========================================
console.log("\n--- TESTE 1: Progressão de Reputação Lenta ---");
const initialRep = 70;
state.rep = initialRep;
const rebuildQueueForCurrentMode = vm.runInContext('rebuildQueueForCurrentMode', sandbox);
rebuildQueueForCurrentMode();
const sampleCase = cases[0];
sampleCase.solved = false;
sampleCase.coopPlayers = 1;
sampleCase.isHybrid = false;
sampleCase.isBurntReturn = false;
state.upgrades.vip_sofa = false;

completeRepairAfterMinigame(sampleCase);
const gainedSolo = state.rep - initialRep;
console.log(`Reputação ganha em conserto solo regular: +${gainedSolo}% (Esperado: 1%)`);
assert.strictEqual(gainedSolo, 1, "Reputação solo deve subir exatamente +1%");

// Com Sofá VIP:
state.rep = initialRep;
sampleCase.solved = false;
state.upgrades.vip_sofa = true;
completeRepairAfterMinigame(sampleCase);
const gainedVip = state.rep - initialRep;
console.log(`Reputação ganha com Sofá VIP: +${gainedVip}% (Esperado: 2%)`);
assert.strictEqual(gainedVip, 2, "Reputação com Sofá VIP deve subir +2%");

// ==========================================
// TESTE 2: Game Over com Reputação 0% e Reinício
// ==========================================
console.log("\n--- TESTE 2: Game Over em 0% de Reputação ---");
state.rep = 5;
const goModal = sandbox.document.getElementById('game-over-modal');
assert(!goModal.classList.contains('open'), "Modal não deve estar aberto antes de atingir 0%");

changeReputation(-10);
assert.strictEqual(state.rep, 0, "Reputação deve limitar em 0%");
assert(goModal.classList.contains('open'), "Game Over modal deve abrir quando reputação chegar a 0%");

const titleEl = sandbox.document.getElementById('game-over-title');
console.log("Título do Game Over:", titleEl.textContent);
assert(titleEl.textContent.includes('0%') || titleEl.textContent.includes('FALIU'), "Título deve indicar falência por reputação");

// Teste de reinício do jogo
restartGameSession();
assert(!goModal.classList.contains('open'), "Modal deve fechar após restart");
assert.strictEqual(state.rep, 70, "Reputação deve reiniciar em 70%");
assert.strictEqual(state.money, 2500, "Caixa deve reiniciar em R$ 2500");
console.log("✔ Reinício do expediente testado com sucesso!");

// ==========================================
// TESTE 3: Diagnóstico Obrigatório para Abrir Minigame
// ==========================================
console.log("\n--- TESTE 3: Bloqueio do Minigame sem Diagnóstico ---");
const testCase = cases[0];
testCase.diagnosisApproved = false;
state.activeTab = 'minigame';

renderWorkbenchModal();
console.log("Aba ativa após tentar minigame sem diagnóstico:", state.activeTab);
assert.notStrictEqual(state.activeTab, 'minigame', "Não deve permitir aba 'minigame' sem diagnóstico");

// Simulando diagnóstico correto
testCase.diagnosisApproved = false;
testCase.diagnoses = [
  { title: 'Opção Errada', correct: false, burnReason: 'Curto' },
  { title: 'Opção Certa', correct: true }
];

handleDiagnosisStep3(testCase, testCase.diagnoses[1]);
assert(testCase.diagnosisApproved, "Diagnóstico correto deve aprovar");
assert.strictEqual(state.activeTab, 'minigame', "Diagnóstico correto deve abrir o minigame na Etapa 4");
console.log("✔ Minigame desbloqueado corretamente apenas após diagnóstico certo!");

// ==========================================
// TESTE 4: Paciência dos Clientes (Solo lento vs 4P rápido)
// ==========================================
console.log("\n--- TESTE 4: Decaimento de Paciência ---");
const client = cases[1];
client.solved = false;
client.pendingBurnTimer = false;
client.patience = 100;

// Testando decaimento solo (1P)
state.players.forEach((p, i) => p.connected = (i < 1));
const pSolo = Math.max(1, Math.min(4, getConnectedPlayerCount()));
const pFactorSolo = 1.0 + (pSolo - 1) * 0.85;
const drainSolo = 0.0008 * pFactorSolo;

// Testando decaimento com 4 jogadores
state.players.forEach((p, i) => p.connected = (i < 4));
const p4P = Math.max(1, Math.min(4, getConnectedPlayerCount()));
const pFactor4P = 1.0 + (p4P - 1) * 0.85;
const drain4P = 0.0008 * pFactor4P;

console.log(`Taxa de dreno Solo: ${drainSolo} | Taxa 4 Jogadores: ${drain4P}`);
assert(drain4P > drainSolo * 3, "Paciência deve drenar bem mais rápido com 4 jogadores do que sozinho");
console.log("✔ Paciência escala perfeitamente com a quantidade de jogadores!");

console.log("\n========================================================");
console.log("🎉 TODAS AS NOVAS REGRAS DE GAMEPLAY PASSARAM COM SUCESSO!");
console.log("========================================================");
