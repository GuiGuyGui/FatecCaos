const fs = require('fs');
const code = fs.readFileSync('game.js', 'utf8');

const matches = [...code.matchAll(/btn-complete-rack-puzzle/g)];
console.log('Matches:', matches.length);
matches.forEach((m, i) => {
  console.log(`\nMatch ${i} at ${m.index}:`);
  console.log(code.slice(m.index - 50, m.index + 400));
});
