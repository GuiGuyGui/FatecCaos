const fs = require('fs');
const text = fs.readFileSync('game.js', 'utf8');

const m1 = text.match(/id:\s*['"]central_rack_plaza['"][\s\S]*?furniture:\s*\[[\s\S]*?\]\s*\}/);
console.log('--- central_rack_plaza snippet ---');
console.log(m1 ? m1[0] : 'Not found');

const m2 = text.match(/if\s*\(state\.upgrades\.ac_split[\s\S]*?solid:\s*(true|false)\s*\}\;\s*\}\s*if/);
console.log('--- ac snippet ---');
console.log(m2 ? m2[0] : 'Not found');

const m3 = text.match(/Clientes na sala de espera[\s\S]*?c\.waypoints = \[[\s\S]*?\}\s*\}\s*\}/);
console.log('--- wander snippet ---');
console.log(m3 ? m3[0] : 'Not found');
