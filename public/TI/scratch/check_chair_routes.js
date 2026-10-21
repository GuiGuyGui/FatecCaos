const fs = require('fs');
const lines = fs.readFileSync('game.js', 'utf8').split('\n');
lines.forEach((l, i) => {
  if (l.includes('walkingToDesk') || l.includes('arrivedAtDesk') || l.includes('myChairPos')) {
    console.log(`${i+1}: ${l}`);
  }
});
