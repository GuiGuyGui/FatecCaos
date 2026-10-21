const fs = require('fs');

const themes = JSON.parse(fs.readFileSync('scratch/all_30_themes.json', 'utf8'));

console.log("Loaded themes:", themes.length);
