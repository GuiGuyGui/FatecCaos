const fs = require('fs');
const code = fs.readFileSync('game.js', 'utf8');
const p = code.indexOf("activeType === 'crypto_wallet_rescue'");
console.log(code.slice(p, p + 1600));
