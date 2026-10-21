const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const matches = [];
const re = /id="([^"]+)"/g;
let m;
while ((m = re.exec(html)) !== null) {
  if (m[1].includes('shop') || m[1].includes('stock')) {
    matches.push(m[1]);
  }
}
console.log('Shop/Stock IDs in HTML:', matches);

// Check stock-modal content
const idx = html.indexOf('id="stock-modal"');
console.log('stock-modal HTML:\n', html.slice(idx, idx + 1800));
