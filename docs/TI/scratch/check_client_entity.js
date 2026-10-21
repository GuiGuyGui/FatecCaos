const fs = require('fs');
const code = fs.readFileSync('game.js', 'utf8');

const p = code.indexOf('entities.push({');
const pClient = code.indexOf("type: 'client'", p);
console.log(code.slice(pClient - 50, pClient + 800));
