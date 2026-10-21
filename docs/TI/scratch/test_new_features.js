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

// 1. Test generateSessionShelfVariants
const v = vm.runInContext('generateSessionShelfVariants(); state.sessionShelfVariants', sandbox);
console.log('Server racks count:', v.serverRacks.length, 'Variants:', v.serverRacks);
if (v.serverRacks.length !== 3 && v.serverRacks.length !== 4) {
  throw new Error('Server racks count must be 3 or 4');
}
console.log('Parts racks variants:', v.partsRacks);
if (!v.partsRacks || v.partsRacks.length < 2) {
  throw new Error('Parts racks must have at least 2 variants');
}

// 2. Test map with tier 3 (expanded Cabine 01)
const mapTier3 = vm.runInContext('state.soloExpansionTier = 3; buildOfflineMap();', sandbox);
const myRoom = mapTier3.rooms.find(r => r.id === 'my_room');

console.log('myRoom bounds:', { x: myRoom.x, y: myRoom.y, w: myRoom.w, h: myRoom.h });
console.log('Client stool position:', mapTier3.clientStoolPos);
const stool = myRoom.furniture.find(f => f.type === 'stool');
console.log('Stool furniture:', stool);

// Check shelves in Cabine 01 pushed right
const shelves01 = myRoom.furniture.filter(f => f.type === 'shelf');
console.log('Shelves in Cabine #01 count:', shelves01.length);
shelves01.forEach(s => console.log('  Shelf:', s.label, 'x:', s.x, 'right:', s.x + s.w, 'roomRight:', myRoom.x + myRoom.w));

// Check parts rack with rack_lvl1
const mapWithRack1 = vm.runInContext('state.upgrades.rack_lvl1 = true; state.rackCapacity = 8; state.rackParts = 8; buildOfflineMap();', sandbox);
const myRoomRack1 = mapWithRack1.rooms.find(r => r.id === 'my_room');
const racks1 = myRoomRack1.furniture.filter(f => f.type === 'rack');
console.log('Racks in Cabine #01 (Lvl 1):', racks1.length);
racks1.forEach(r => console.log('  Rack:', r.label, 'x:', r.x, 'y:', r.y, 'w:', r.w, 'h:', r.h));

// Check parts rack with rack_lvl2 (Mega Rack)
const mapWithRack2 = vm.runInContext('state.upgrades.rack_lvl2 = true; state.rackCapacity = 20; state.rackParts = 20; buildOfflineMap();', sandbox);
const myRoomRack2 = mapWithRack2.rooms.find(r => r.id === 'my_room');
const racks2 = myRoomRack2.furniture.filter(f => f.type === 'rack');
console.log('Racks in Cabine #01 (Lvl 2 Mega Rack):', racks2.length);
racks2.forEach(r => console.log('  Rack:', r.label, 'x:', r.x, 'y:', r.y, 'w:', r.w, 'h:', r.h));

// 3. Check waiting slots in green zone
console.log('Waiting slots count:', mapTier3.waitingSlots.length);
mapTier3.waitingSlots.forEach((slot, i) => console.log(`  Slot ${i}:`, slot));

// 4. Check client case creation with walkInFromDoor
const clientCase = vm.runInContext('createClientCase(0, true);', sandbox);
console.log('Client spawned at:', { x: clientCase.x, y: clientCase.y });
console.log('Client target:', { x: clientCase.targetX, y: clientCase.targetY });
console.log('Client waypoints count:', clientCase.waypoints ? clientCase.waypoints.length : 0);
if (!clientCase.waypoints || clientCase.waypoints.length === 0) {
  throw new Error('Client must have waypoints to walk into room!');
}

console.log('ALL TESTS PASSED SUCCESSFULLY!');
