const fs = require('fs');
const lines = fs.readFileSync('game.js', 'utf8').split('\n');
lines.forEach((l, i) => {
  if (l.includes('callClientToMyRoom') || l.includes('targetX') || l.includes('targetY')) {
    console.log(`${i+1}: ${l}`);
  }
});
