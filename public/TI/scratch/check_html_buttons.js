const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const terms = ['btn-open-central-rack', 'rack-incident', 'central-rack', 'btn-goto-central-rack', 'FALHA CRÍTICA'];
terms.forEach(t => {
  let idx = 0;
  while ((idx = html.indexOf(t, idx)) !== -1) {
    const start = Math.max(0, idx - 40);
    const end = Math.min(html.length, idx + 100);
    console.log(`Found '${t}' at ${idx}:\n  ${html.slice(start, end).replace(/\n/g, ' ')}`);
    idx += t.length;
  }
});
