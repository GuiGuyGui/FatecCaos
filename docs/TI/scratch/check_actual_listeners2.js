const fs = require('fs');
const code = fs.readFileSync('game.js', 'utf8');

const p = code.indexOf("container.innerHTML = partBannerHTML");
console.log(code.slice(p + 3500, p + 7000));
