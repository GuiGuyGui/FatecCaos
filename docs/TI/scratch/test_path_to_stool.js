const fs = require('fs');
const vm = require('vm');
const js = fs.readFileSync('game.js', 'utf8');

const sandbox = {
  document: { getElementById: () => ({ style: {}, classList: { add: ()=>{}, remove: ()=>{} }, addEventListener: ()=>{} }), querySelectorAll: () => [] },
  window: { innerWidth: 1200, innerHeight: 800, addEventListener: () => {}, localStorage: { getItem: () => null, setItem: () => {} } },
  console: console,
  Image: class { constructor() { this.width = 100; this.height = 100; } },
  requestAnimationFrame: () => 1,
  cancelAnimationFrame: () => {},
  Peer: function() { return { on: () => {} }; },
  setTimeout: (fn) => setTimeout(fn, 0),
  setInterval: () => 1,
  Math, Date, Array, Object, String, Number, Boolean, JSON, RegExp, Set, Map
};
sandbox.window.document = sandbox.document;
vm.createContext(sandbox);
vm.runInContext(js, sandbox);

const map = vm.runInContext('currentMap()', sandbox);
const buildPath = vm.runInContext('buildDoorwayPath', sandbox);
const collidesAt = vm.runInContext('collidesAt', sandbox);
const stool = map.clientStoolPos;

const testPoints = [
  { x: 500, y: 550 },
  { x: 600, y: 700 },
  { x: 700, y: 800 },
  { x: 550, y: 900 }
];

testPoints.forEach((pt, i) => {
  const path = buildPath(pt.x, pt.y, stool.x, stool.y);
  console.log(`Path from (${pt.x}, ${pt.y}) to stool:`, JSON.stringify(path));
  path.forEach((wp, wIdx) => {
    const col = collidesAt(wp.x, wp.y, 14);
    if (col) console.log(`   WAYPOINT ${wIdx} (${wp.x}, ${wp.y}) COLLIDES!`);
  });
});
