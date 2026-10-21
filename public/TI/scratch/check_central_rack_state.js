const fs = require('fs');
const code = fs.readFileSync('game.js', 'utf8');

const p = code.indexOf('centralRackState =');
console.log(code.slice(p, p + 1200));
