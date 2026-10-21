const fs = require('fs');
const lines = fs.readFileSync('game.js', 'utf8').split('\n');
lines.forEach((l, i) => {
  if (l.includes('getWaitingSlotPosition') || l.includes('waitingSlots') || l.includes('spawnClient') || l.includes('street_door')) {
    console.log(`${i+1}: ${l}`);
  }
});
