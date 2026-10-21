const fs = require('fs');
const code = fs.readFileSync('game.js', 'utf8');
const p = code.indexOf("id: 'main_store'");
console.log(code.slice(p - 50, p + 600));
