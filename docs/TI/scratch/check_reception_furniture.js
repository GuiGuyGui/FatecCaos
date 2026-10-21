const fs = require('fs');
const code = fs.readFileSync('game.js', 'utf8');
const p1 = code.indexOf('furnitureReception =');
console.log(code.slice(p1, p1 + 1500));
