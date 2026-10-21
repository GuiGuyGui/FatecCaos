const fs = require('fs');
const code = fs.readFileSync('game.js', 'utf8');

const start = code.indexOf('function renderSpecificProblemMinigame');
const end = code.indexOf('// ============================================================================', start + 100);
const mgCode = code.slice(start, end);

// Find all matches for activeType === or activeType ==
const matches = [...mgCode.matchAll(/activeType\s*===?\s*'([^']+)'/g)];
console.log('Matched activeTypes in renderSpecificProblemMinigame:');
const foundTypes = new Set(matches.map(m => m[1]));
console.log(Array.from(foundTypes));

// Check if there are COOP minigame types that might be opened:
if (typeof code.indexOf('COOP_PUZZLES_CATALOG') !== -1) {
  const p = code.indexOf('COOP_PUZZLES_CATALOG');
  const coopEnd = code.indexOf('];', p);
  console.log('Found COOP_PUZZLES_CATALOG snippet:');
  console.log(code.slice(p, p + 400));
}
