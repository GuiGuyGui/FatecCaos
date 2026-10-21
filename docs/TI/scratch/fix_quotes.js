const fs = require('fs');
let c = fs.readFileSync('scratch/build_themes.js', 'utf8');
// replace backticks around quote with single quotes
c = c.replace(/quote: `([^`]+)`/g, (match, p1) => {
  return `quote: ${JSON.stringify(p1)}`;
});
fs.writeFileSync('scratch/build_themes.js', c);
console.log('Fixed quotes successfully');
