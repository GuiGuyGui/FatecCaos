const fs = require('fs');
const lines = fs.readFileSync('game.js', 'utf8').split('\n');
lines.forEach((l, i) => {
  if (l.includes('drawCharacter') || l.includes('drawClient') || l.includes('cases.forEach') || l.includes('case.look')) {
    console.log(`${i+1}: ${l}`);
  }
});
