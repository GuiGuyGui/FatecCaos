const fs = require('fs');
const code = fs.readFileSync('game.js', 'utf8');

const p = code.indexOf('function triggerCentralRackIncident');
const pEnd = code.indexOf('function isPlayerNearCentralRack', p);
console.log(code.slice(p, pEnd));
