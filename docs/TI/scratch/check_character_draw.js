const fs = require('fs');
const lines = fs.readFileSync('game.js', 'utf8').split('\n');
lines.forEach((l, i) => {
  if (l.includes('drawPlayer') || l.includes('drawHuman') || l.includes('drawNpc') || l.includes('drawClient') || l.includes('c.look')) {
    console.log(`${i+1}: ${l}`);
  }
});
