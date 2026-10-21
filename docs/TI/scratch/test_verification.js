const fs = require('fs');
const content = fs.readFileSync('game.js', 'utf8');

console.log('type waiting boxes count:', (content.match(/type:\s*['"]waiting['"]/g) || []).length);
console.log('type sofa in map:', content.includes("type: 'sofa'"));
console.log('type stool in map:', content.includes("type: 'stool'"));
console.log('clientStoolPos used:', content.includes('targetX: map.clientStoolPos.x'));
console.log('door counter at 950 removed:', !content.includes("y: 950, w: recW - 50"));
console.log('central rack banner skipped:', content.includes("room.id !== 'central_rack_plaza'"));
console.log('drawWaitingSofaGraphic defined:', content.includes('function drawWaitingSofaGraphic'));
console.log('drawStoolGraphic defined:', content.includes('function drawStoolGraphic'));
console.log('server_racks_strip referenced:', content.includes('server_racks_strip'));
