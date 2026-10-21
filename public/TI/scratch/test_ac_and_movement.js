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

// 1. Check Central Rack position in offline map
const map = vm.runInContext('buildOfflineMap()', sandbox);
const rackRoom = map.rooms.find(r => r.id === 'central_rack_plaza');
console.log('Central Rack room:', { x: rackRoom.x, y: rackRoom.y, w: rackRoom.w, h: rackRoom.h });
const rackFurniture = rackRoom.furniture.find(f => f.type === 'central_rack');
console.log('Central Rack furniture:', { x: rackFurniture.x, y: rackFurniture.y, w: rackFurniture.w, h: rackFurniture.h });
if (rackFurniture.y > 330) {
  throw new Error('Central Rack was not moved up!');
}
console.log('Clearance below rack to lower rooms (y=460):', 460 - (rackFurniture.y + rackFurniture.h), 'px');
console.log('Clearance above rack to upper rooms (y=255):', rackFurniture.y - 255, 'px');

// 2. Check AC Level 1
vm.runInContext('state.upgrades.ac_lvl1 = true; state.upgrades.ac_lvl2 = false; state.upgrades.ac_lvl3 = false;', sandbox);
const mapLvl1 = vm.runInContext('buildOfflineMap()', sandbox);
const myRoom1 = mapLvl1.rooms.find(r => r.id === 'my_room');
const ac1 = myRoom1.furniture.filter(f => f.type === 'ac');
console.log('AC Level 1 furniture count:', ac1.length);
console.log('  Model:', ac1[0].acModel, 'x:', ac1[0].x, 'y:', ac1[0].y, 'roomRight:', myRoom1.x + myRoom1.w);
if (ac1[0].acModel !== 'white' || ac1[0].x < myRoom1.x + myRoom1.w - 150) {
  throw new Error('AC Level 1 should be white and placed to the right!');
}

// Check AC Level 2
vm.runInContext('state.upgrades.ac_lvl2 = true;', sandbox);
const mapLvl2 = vm.runInContext('buildOfflineMap()', sandbox);
const myRoom2 = mapLvl2.rooms.find(r => r.id === 'my_room');
const ac2 = myRoom2.furniture.filter(f => f.type === 'ac');
console.log('AC Level 2 furniture count:', ac2.length);
console.log('  Model:', ac2[0].acModel, 'x:', ac2[0].x, 'y:', ac2[0].y);
if (ac2[0].acModel !== 'black') {
  throw new Error('AC Level 2 should be black glass!');
}

// Check AC Level 3
vm.runInContext('state.upgrades.ac_lvl3 = true;', sandbox);
const mapLvl3 = vm.runInContext('buildOfflineMap()', sandbox);
const myRoom3 = mapLvl3.rooms.find(r => r.id === 'my_room');
const ac3 = myRoom3.furniture.filter(f => f.type === 'ac');
console.log('AC Level 3 furniture count:', ac3.length);
ac3.forEach(a => console.log('  AC:', a.label, 'model:', a.acModel, 'x:', a.x, 'y:', a.y, 'w:', a.w, 'h:', a.h));
const tower = ac3.find(a => a.acModel === 'tower');
if (!tower) throw new Error('AC Level 3 should include tower model beside workbench!');

console.log('ALL TESTS PASSED 100%!');
