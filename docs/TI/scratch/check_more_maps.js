const fs = require('fs');
const code = fs.readFileSync('game.js', 'utf8');

const items = ['bsodLogs.map', 'missingDlls.map', 'processes.map', 'bcdSteps.map', 'bloatwareList.map', 'rsaHexBlocks.map', 'firewallPorts.map'];

items.forEach(item => {
  const p = code.indexOf(item);
  console.log(`\n================== ${item} ==================`);
  if (p !== -1) {
    console.log(code.slice(p - 100, p + 500));
  } else {
    console.log('NOT FOUND');
  }
});
