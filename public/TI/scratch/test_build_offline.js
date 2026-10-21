const fs = require('fs');

// Create minimal browser mock to load game.js functions
const vm = require('vm');
const code = fs.readFileSync('game.js', 'utf8');

const dom = {
  getElementById: () => ({ style: {}, classList: { add: ()=>{}, remove: ()=>{} }, innerHTML: '', addEventListener: ()=>{} }),
  querySelectorAll: () => [],
  addEventListener: () => {}
};

const sandbox = {
  window: { addEventListener: () => {} },
  document: dom,
  console: console,
  Image: class { constructor() { this.width = 100; this.height = 100; } },
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

const map = sandbox.buildOfflineMap(1);
console.log('Map built successfully!');
console.log('Waiting slots count:', map.waitingSlots.length);
console.log('Client stool pos:', map.clientStoolPos);
console.log('My chair pos:', map.myChairPos);

// Check all furniture across all rooms
let furnitureTypes = [];
map.rooms.forEach(r => {
  r.furniture.forEach(f => {
    furnitureTypes.push({ type: f.type, label: f.label, x: f.x, y: f.y });
  });
});

console.log('Furniture count:', furnitureTypes.length);
const sofas = furnitureTypes.filter(f => f.type === 'sofa');
const stools = furnitureTypes.filter(f => f.type === 'stool');
const racks = furnitureTypes.filter(f => f.type === 'central_rack');
const waitings = furnitureTypes.filter(f => f.type === 'waiting');
const counters = furnitureTypes.filter(f => f.type === 'counter');

console.log('Sofas found:', sofas);
console.log('Stools found:', stools);
console.log('Racks found:', racks);
console.log('Waiting boxes found:', waitings.length);
console.log('Counters found:', counters);
