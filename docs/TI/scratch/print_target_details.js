const fs = require('fs');
const code = fs.readFileSync('game.js', 'utf8');

const targets = [
  'vrm_soldering', 'trojan_hunter', 'cookie_cleaner', 'popups_closer',
  'disk_defrag', 'bsod_analyzer', 'dll_fixer', 'malware_task',
  'boot_loop_fix', 'bloatware_remover', 'ransomware_decrypt', 'firewall_rules'
];

targets.forEach(t => {
  const p = code.indexOf("activeType === '" + t + "'");
  console.log(`\n================== ${t} ==================`);
  console.log(code.slice(p, p + 800));
});
