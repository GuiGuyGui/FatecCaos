const fs = require('fs');
const code = fs.readFileSync('game.js', 'utf8');

const start = code.indexOf('function renderSpecificProblemMinigame');
const end = code.indexOf('\nfunction addChatMessage', start);
const fnCode = code.slice(start, end);

// Find all HTML blocks and see what buttons/inputs they render
const buttons = [...fnCode.matchAll(/<button[^>]+>/g)].map(m => m[0]);
console.log('Total buttons rendered in templates:', buttons.length);

const ids = new Set();
const dataAttrs = new Set();

buttons.forEach(b => {
  const idM = b.match(/id="([^"]+)"/);
  if (idM) ids.add(idM[1]);
  const dataM = [...b.matchAll(/(data-[a-zA-Z0-9_-]+)="([^"]*)"/g)];
  dataM.forEach(dm => dataAttrs.add(dm[1]));
});

console.log('\n--- Button IDs rendered ---');
console.log(Array.from(ids));

console.log('\n--- Data attributes rendered ---');
console.log(Array.from(dataAttrs));
