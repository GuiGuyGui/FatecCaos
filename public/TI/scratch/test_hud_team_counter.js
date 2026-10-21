const vm = require('vm');
const fs = require('fs');
const assert = require('assert');

const gameCode = fs.readFileSync('game.js', 'utf8');

// Lightweight DOM mock
const elements = {};
function getOrCreateEl(id) {
  if (!elements[id]) {
    elements[id] = {
      id,
      innerHTML: '',
      textContent: '',
      className: '',
      classList: {
        contains: (cls) => (elements[id].className || '').split(' ').includes(cls),
        add: (cls) => { elements[id].className += ' ' + cls; },
        remove: (cls) => { elements[id].className = (elements[id].className || '').replace(cls, ''); },
        toggle: (cls, val) => {
          if (val) elements[id].classList.add(cls);
          else elements[id].classList.remove(cls);
        }
      },
      style: {}
    };
  }
  return elements[id];
}

const sandbox = {
  document: {
    getElementById: (id) => getOrCreateEl(id),
    querySelectorAll: (sel) => [],
    querySelector: (sel) => null
  },
  window: {},
  navigator: {},
  localStorage: { getItem: () => null, setItem: () => {} },
  Audio: class { play() {} },
  console: console,
  setTimeout: () => {},
  setInterval: () => {},
  clearTimeout: () => {},
  clearInterval: () => {}
};

vm.createContext(sandbox);

// Extract updateHUD and state
vm.runInContext(`
${gameCode.slice(0, 15000)}
`, sandbox);

console.log("Loaded game initial state.");
const state = sandbox.state;
assert(state, "State should be initialized");

// Test team counter text for 1, 2, 3, 4 players
const teamCounterEl = sandbox.document.getElementById('session-team-counter');

// 1 Player
state.players.forEach((p, i) => p.connected = (i < 1));
sandbox.updateHUD();
console.log("1 Player HUD badge:", teamCounterEl.innerHTML);
assert(teamCounterEl.innerHTML.includes('1 Técnico'), "Should display 1 Técnico for 1 player");
assert(teamCounterEl.className.includes('solo'), "Should have class solo");

// 2 Players
state.players.forEach((p, i) => p.connected = (i < 2));
sandbox.updateHUD();
console.log("2 Players HUD badge:", teamCounterEl.innerHTML);
assert(teamCounterEl.innerHTML.includes('2 Técnicos Online'), "Should display 2 Técnicos for 2 players");
assert(teamCounterEl.className.includes('duo'), "Should have class duo");

// 3 Players
state.players.forEach((p, i) => p.connected = (i < 3));
sandbox.updateHUD();
console.log("3 Players HUD badge:", teamCounterEl.innerHTML);
assert(teamCounterEl.innerHTML.includes('3 Técnicos Online'), "Should display 3 Técnicos for 3 players");
assert(teamCounterEl.className.includes('trio'), "Should have class trio");

// 4 Players
state.players.forEach((p, i) => p.connected = (i < 4));
sandbox.updateHUD();
console.log("4 Players HUD badge:", teamCounterEl.innerHTML);
assert(teamCounterEl.innerHTML.includes('4 Técnicos Online'), "Should display 4 Técnicos for 4 players");
assert(teamCounterEl.className.includes('full'), "Should have class full");

console.log("🎉 ALL HUD TEAM COUNTER TESTS PASSED!");
