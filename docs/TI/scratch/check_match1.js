const fs = require('fs');
const code = fs.readFileSync('game.js', 'utf8');

const p = code.indexOf("document.getElementById('btn-complete-rack-puzzle')");
const p2 = code.indexOf("document.getElementById('btn-complete-rack-puzzle')", p + 10);
console.log(code.slice(p2 - 50, p2 + 1200));
