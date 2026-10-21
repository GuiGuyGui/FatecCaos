const fs = require('fs');
const lines = fs.readFileSync('game.js', 'utf8').split('\n');
lines.forEach((l, i) => {
  if (l.includes('function stepEntityWaypoints') || l.includes('stepEntityWaypoints')) {
    console.log(`${i+1}: ${l}`);
  }
});
