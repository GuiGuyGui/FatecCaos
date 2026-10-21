const fs = require('fs');
const code = fs.readFileSync('game.js', 'utf8');

const p = code.indexOf("centralRackState.solvedProblemIndices.push(curId");
console.log(code.slice(p, p + 800));
