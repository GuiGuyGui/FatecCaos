const fs = require('fs');
const lines = fs.readFileSync('game.js', 'utf8').split('\n');
lines.forEach((l, i) => {
  if (l.includes("type: 'waiting'") || l.includes('clientChairPos') || l.includes('clientStoolPos')) {
    console.log(`${i+1}: ${l}`);
  }
});
