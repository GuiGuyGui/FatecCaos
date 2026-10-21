const fs = require('fs');
let code = fs.readFileSync('scratch/test_fixes_verification.js', 'utf8');

// Fix player position preservation
code = code.replace(
  `state.players = [
  { connected: true }, { connected: true }, { connected: true }, { connected: true }
];`,
  `state.players = [
  { x: rackPos.x + 20, y: rackPos.y + 70, connected: true },
  { connected: true }, { connected: true }, { connected: true }
];`
);

// Fix puzzle 8 simulation
code = code.replace(
  `case 8: centralRackState.puzzles[8].andersonReplugged = true; break;`,
  `case 8: centralRackState.puzzles[8].andersonUnplugged = true; centralRackState.puzzles[8].oldPackRemoved = true; centralRackState.puzzles[8].newPackInserted = true; centralRackState.puzzles[8].andersonReplugged = true; break;`
);

fs.writeFileSync('scratch/test_fixes_verification.js', code, 'utf8');
console.log("✔ test_fixes_verification.js updated");
