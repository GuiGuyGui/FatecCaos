const fs = require('fs');
const assert = require('assert');

// 1. Verify index.html content
const html = fs.readFileSync('index.html', 'utf8');

// Removed buttons should not exist
assert(!html.includes('id="btn-cheat-money"'), 'btn-cheat-money should be removed from index.html');
assert(!html.includes('id="btn-cheat-rep"'), 'btn-cheat-rep should be removed from index.html');
assert(!html.includes('id="btn-sidebar-add-tech"'), 'btn-sidebar-add-tech should be removed from index.html');
assert(!html.includes('data-match-players="2"'), '+1 Funcionário button should be removed');
assert(!html.includes('data-match-players="3"'), '+2 Funcionários button should be removed');
assert(!html.includes('data-match-players="4"'), '+3 Funcionários button should be removed');

// Kept elements should exist
assert(html.includes('id="session-team-counter"'), 'session-team-counter should exist');
assert(html.includes('id="btn-copy-invite-code"'), 'btn-copy-invite-code should exist');
assert(html.includes('id="btn-open-future-rooms"'), 'btn-open-future-rooms should exist');
assert(html.includes('data-solo-tier="1"'), 'solo tier 1 should exist');
assert(html.includes('data-solo-tier="5"'), 'solo tier 5 should exist');

console.log('✅ HTML structure verification passed!');

// 2. Verify game.js SHOP_CATALOG prices
const gameCode = fs.readFileSync('game.js', 'utf8');

const expectedPrices = {
  rack_lvl1: 4000,
  rack_lvl2: 8000,
  rack_refill: 1750,
  my_coffee: 3500,
  vip_sofa: 5000,
  ac_lvl1: 6500,
  ac_lvl2: 12000,
  ac_lvl3: 22500,
  workbench_lvl2: 42500,
  workbench_lvl3: 110000,
  workbench_lvl4: 225000,
  solo_expansion_2: 17500,
  solo_expansion_3: 42500,
  solo_expansion_4: 90000,
  solo_expansion_5: 190000
};

for (const [id, price] of Object.entries(expectedPrices)) {
  const regex = new RegExp(`id:\\s*'${id}'[\\s\\S]*?price:\\s*${price}`);
  assert(regex.test(gameCode), `Item ${id} should have price ${price}`);
}
console.log('✅ All 14 items in SHOP_CATALOG verified with 5x prices!');

// 3. Verify style.css
const css = fs.readFileSync('style.css', 'utf8');
assert(css.includes('.team-counter-badge'), '.team-counter-badge should be styled in style.css');
console.log('✅ CSS styling for .team-counter-badge verified!');

console.log('🎉 ALL TESTS PASSED SUCCESSFULLY!');
