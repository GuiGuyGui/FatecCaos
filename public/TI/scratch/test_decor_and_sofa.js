const fs = require('fs');
const vm = require('vm');

const code = fs.readFileSync('game.js', 'utf8');

const dom = {
  getElementById: () => ({
    style: {},
    classList: { add: () => {}, remove: () => {}, toggle: () => {} },
    innerHTML: '',
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

// 1. Check session variants and decor
const v = vm.runInContext('generateSessionShelfVariants(); state.sessionShelfVariants', sandbox);
console.log('Decor selections count:', v.decorSelections.length, v.decorSelections);

// 2. Check map with tier 3
const mapTier3 = vm.runInContext('state.soloExpansionTier = 3; buildOfflineMap();', sandbox);
const myRoom = mapTier3.rooms.find(r => r.id === 'my_room');
const store = mapTier3.rooms.find(r => r.id === 'main_store');
const stock = mapTier3.rooms.find(r => r.id === 'stock_room');

// Check sofa in my_room
const mySofa = myRoom.furniture.find(f => f.type === 'sofa');
console.log('my_room Sofa:', mySofa);
if (!mySofa || mySofa.w <= mySofa.h || mySofa.orientation !== 'horizontal') {
  throw new Error('Sofa in my_room must be horizontal (w > h)!');
}

// Check decor in all 3 rooms
const myDecors = myRoom.furniture.filter(f => f.type === 'decor');
const storeDecors = store.furniture.filter(f => f.type === 'decor');
const stockDecors = stock.furniture.filter(f => f.type === 'decor');
console.log('Decors in Cabine #01:', myDecors.length, myDecors.map(d => ({ type: d.decorType, x: d.x, y: d.y })));
console.log('Decors in Recepção:', storeDecors.length, storeDecors.map(d => ({ type: d.decorType, x: d.x, y: d.y })));
console.log('Decors in Estoque:', stockDecors.length, stockDecors.map(d => ({ type: d.decorType, x: d.x, y: d.y })));

if (myDecors.length === 0 || storeDecors.length === 0 || stockDecors.length === 0) {
  throw new Error('All rooms must have decor items near walls!');
}

// Check waiting slots
console.log('Waiting slots in red zone count:', mapTier3.waitingSlots.length);
if (mapTier3.waitingSlots.length !== 12) {
  throw new Error('Expected 12 waiting slots in red zone!');
}

console.log('ALL VERIFICATIONS PASSED 100%!');
