const fs = require('fs');
let code = fs.readFileSync('game.js', 'utf8');

const target = `: (hasPartOrRack\r\n            ? \`✅ <b>Kit na Mochila:</b> \${reqPart.name} (+Bônus R$ 250!)\`\r\n            : \`📦 <b>Peça Recomendada:</b> \${reqPart.name} (Compre um Rack na Loja para nunca faltar peça na sala!)\`)`;
const replacement = `: (hasPartOrRack\r\n            ? \`✅ <b>Kit na Mochila:</b> \${reqPart ? reqPart.name : "Peça Técnica"} (+Bônus R$ 250!)\`\r\n            : \`📦 <b>Peça Recomendada:</b> \${reqPart ? reqPart.name : "Peça Técnica"} (Compre um Rack na Loja para nunca faltar peça na sala!)\`)`;

if (code.includes(target)) {
  code = code.replace(target, replacement);
  console.log("Target 1 replaced!");
} else {
  console.log("Target 1 not found!");
}

const target2 = `\${!hasPartOrRack ? \`\r\n        <button type="button" class="btn btn-amarelo btn-xs" id="btn-mg-grab-now">✋ Pegar \${reqPart.shortName}</button>\r\n      \` : ''}`;
const replacement2 = `\${!hasPartOrRack && reqPart ? \`\r\n        <button type="button" class="btn btn-amarelo btn-xs" id="btn-mg-grab-now">✋ Pegar \${reqPart.shortName || reqPart.name}</button>\r\n      \` : ''}`;

if (code.includes(target2)) {
  code = code.replace(target2, replacement2);
  console.log("Target 2 replaced!");
} else {
  console.log("Target 2 not found!");
}

fs.writeFileSync('game.js', code, 'utf8');
