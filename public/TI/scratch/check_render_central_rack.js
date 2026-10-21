const fs = require('fs');
const code = fs.readFileSync('game.js', 'utf8');

const p = code.indexOf('function renderCentralRackModal');
const pEnd = code.indexOf('function updateWorld', p);
console.log(code.slice(p, pEnd));
