const fs = require('fs');
const code = fs.readFileSync('game.js', 'utf8');

const matches = [...code.matchAll(/arrivedAtDesk/g)];
console.log('Matches for arrivedAtDesk:', matches.length);
matches.forEach(m => console.log(code.slice(m.index - 50, m.index + 200)));
