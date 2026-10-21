const fs = require('fs');
const vm = require('vm');

const code = fs.readFileSync('game.js', 'utf8');

const dom = {
  getElementById: (id) => ({
    id,
    style: {},
    classList: { add: () => {}, remove: () => {}, toggle: () => {}, contains: () => false },
    innerHTML: '',
    textContent: '',
    addEventListener: () => {}
  }),
  querySelectorAll: () => [],
  addEventListener: () => {}
};

const sandbox = {
  window: { addEventListener: () => {} },
  document: dom,
  console: console,
  Image: class { constructor() { this.width = 100; this.height = 100; this.naturalWidth = 100; this.complete = true; } },
  Audio: class { play() {} pause() {} },
  localStorage: { getItem: () => null, setItem: () => {} },
  requestAnimationFrame: () => 1,
  setTimeout: setTimeout,
  clearTimeout: clearTimeout,
  setInterval: setInterval,
  clearInterval: clearInterval,
  Math: Math
};
sandbox.window.document = dom;

vm.createContext(sandbox);
vm.runInContext(code, sandbox);

// 1. Test generateRandomCrazyCaseTemplate
const tpl = vm.runInContext('generateRandomCrazyCaseTemplate()', sandbox);
console.log('Template generated:', tpl.problem, 'Client:', tpl.clientName, 'Device:', tpl.device);
console.log('Questions count:', tpl.questions.length);
console.log('Tools count:', tpl.tools.length);
console.log('Diagnoses count:', tpl.diagnoses.length);
if (tpl.questions.length !== 4) throw new Error('Expected 4 questions!');
if (tpl.tools.length !== 3) throw new Error('Expected 3 tools!');
if (tpl.diagnoses.length !== 3) throw new Error('Expected 3 diagnoses!');

// 2. Test createClientCase
const c = vm.runInContext('createClientCase(0, false)', sandbox);
console.log('Case 0 created with problem:', c.problem);
console.log('Case 0 questions:', c.questions.length, 'tools:', c.tools.length, 'diagnoses:', c.diagnoses.length);
if (c.questions.length !== 4 || c.tools.length !== 3 || c.diagnoses.length !== 3) {
  throw new Error('Case must have full questions, tools and diagnoses!');
}

// 3. Test AC models in buildOfflineMap
const map = vm.runInContext('state.upgrades.ac_split = true; buildOfflineMap();', sandbox);
const myRoom = map.rooms.find(r => r.id === 'my_room');
const acList = myRoom.furniture.filter(f => f.type === 'ac');
console.log('AC furniture count in my_room:', acList.length);
acList.forEach(a => console.log('  AC:', a.label, 'model:', a.acModel, 'x:', a.x, 'y:', a.y, 'w:', a.w, 'h:', a.h));
const towerAC = acList.find(a => a.acModel === 'tower');
const wallAC = acList.find(a => a.acModel === 'white' || a.acModel === 'black');
if (!towerAC) throw new Error('Tower AC beside workbench not found!');
if (!wallAC) throw new Error('Wall Split AC not found!');

// 4. Test client clamping in updateWorld
vm.runInContext(`
  // Place client in cases
  cases[0] = createClientCase(0, false);
  cases[0].inMyRoom = false;
  cases[0].leavingState = null;
  // Try placing outside bounds (e.g. into Cabine 01 or into Estoque or near Central Rack)
  cases[0].x = 100; // in Cabine 01
  cases[0].y = 400; // in Central Rack plaza
`, sandbox);

// Run 1 tick of updateWorld (simulation without window.requestAnimationFrame loop)
vm.runInContext('updateWorld();', sandbox);
const testClient = vm.runInContext('cases[0];', sandbox);
const recRoom = map.rooms.find(r => r.id === 'main_store');
console.log('Tested client position after updateWorld:');
console.log('  x:', testClient.x, '(rec minX is', recRoom.x + 30, ')');
console.log('  y:', testClient.y, '(minY is 568)');
if (testClient.x < recRoom.x + 30) throw new Error('Client was not clamped to reception X!');
if (testClient.y < 568) throw new Error('Client was not clamped away from Central Rack!');

console.log('ALL 4 TESTS PASSED 100%!');
