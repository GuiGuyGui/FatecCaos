const fs = require('fs');
const code = fs.readFileSync('game.js', 'utf8');
const p1 = code.indexOf('function buildOfflineMap');
const p2 = code.indexOf("id: 'my_room'", p1);
console.log(code.slice(p2 - 50, p2 + 800));
