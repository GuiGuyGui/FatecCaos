const fs = require('fs');
const code = fs.readFileSync('game.js', 'utf8');
const p1 = code.indexOf('function buildOfflineMap');
const p = code.indexOf("id: 'main_store'", p1);
console.log(code.slice(p - 50, p + 600));
