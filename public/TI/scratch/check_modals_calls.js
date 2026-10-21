const fs = require('fs');
const lines = fs.readFileSync('game.js', 'utf8').split('\n');

console.log('--- openCentralRackModal occurrences ---');
lines.forEach((l, i) => {
  if (l.includes('openCentralRackModal')) console.log(`${i+1}: ${l.trim()}`);
});

console.log('--- openWorkbenchModal occurrences ---');
lines.forEach((l, i) => {
  if (l.includes('openWorkbenchModal')) console.log(`${i+1}: ${l.trim()}`);
});
