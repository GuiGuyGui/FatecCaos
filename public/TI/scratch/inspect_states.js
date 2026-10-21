const fs = require('fs');
const code = fs.readFileSync('game.js', 'utf8');
const start = code.indexOf('function renderSpecificProblemMinigame');
const end = code.indexOf('// ============================================================================', start + 100);
const mgCode = code.slice(start, end);

function getSnippet(type) {
  const p = mgCode.indexOf("activeType === '" + type + "'");
  if (p === -1) return 'NOT FOUND';
  return mgCode.slice(p, p + 1000);
}

const list = [
  'dust_blower', 'thermal_spatula', 'fan_unjam', 'cockroach_nest',
  'socket_pins', 'ram_contacts', 'cmos_battery', 'custom_water_leak',
  'cpu_ram', 'rj45', 'psu_wires', 'mobo_build', 'gpu_12vhpwr',
  'vrm_soldering', 'delid_liquid_metal', 'trojan_hunter', 'cookie_cleaner',
  'popups_closer', 'disk_defrag', 'bsod_analyzer', 'dll_fixer',
  'bios_flashing', 'malware_task', 'boot_loop_fix', 'ddu_driver_sweep',
  'bloatware_remover', 'ransomware_decrypt', 'firewall_rules',
  'temp_cleaner', 'crypto_wallet_rescue'
];

list.forEach(t => {
  console.log(`\n================== ${t} ==================`);
  console.log(getSnippet(t));
});
