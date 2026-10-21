// Comprehensive test suite for game.js with 30 puzzles, procedural generator and hybrid cases
const fs = require('fs');
const vm = require('vm');

// Create minimal browser mock environment for game.js testing
global.window = { addEventListener: () => {} };
global.document = {
  getElementById: () => ({
    classList: { contains: () => false, add: () => {}, remove: () => {} },
    addEventListener: () => {},
    appendChild: () => {},
    style: {}
  }),
  querySelectorAll: () => []
};
global.navigator = { clipboard: { writeText: () => {} } };
global.showToast = () => {};
global.broadcastNet = () => {};

// Load game.js in global context
vm.runInThisContext(fs.readFileSync('game.js', 'utf8'));

console.log('--- TEST 1: Catalog Counts ---');
console.log('Personas count:', CRAZY_CLIENT_PERSONAS.length, '(Target >= 50)');
console.log('Devices count:', CRAZY_DEVICES.length, '(Target >= 40)');
console.log('Themes count:', CRAZY_PROBLEM_THEMES.length, '(Target == 30)');

if (CRAZY_CLIENT_PERSONAS.length < 50 || CRAZY_DEVICES.length < 40 || CRAZY_PROBLEM_THEMES.length < 30) {
  throw new Error('Catalog counts do not meet requirements!');
}

console.log('--- TEST 2: Procedural Generator (100 Cases) ---');
const generatedCases = [];
const uniqueSignatures = new Set();
let hybridCount = 0;

// Enable tier 4 to test hybrid cases
state.soloExpansionTier = 4;

for (let i = 0; i < 100; i++) {
  const c = generateRandomCrazyCaseTemplate();
  generatedCases.push(c);
  uniqueSignatures.add(`${c.clientName} | ${c.device} | ${c.minigameType}`);
  if (c.isHybrid) hybridCount++;
}

console.log('100 Cases generated.');
console.log('Unique signatures out of 100:', uniqueSignatures.size);
console.log('Hybrid cases generated:', hybridCount, 'out of 100 (Tier 4)');

if (uniqueSignatures.size < 90) {
  throw new Error('Case variance is too low!');
}

console.log('--- TEST 3: All 30 Minigame Types Present ---');
const allThemesTypes = CRAZY_PROBLEM_THEMES.map(t => t.minigameType);
console.log('Unique minigame types:', [...new Set(allThemesTypes)].length);
if ([...new Set(allThemesTypes)].length < 30) {
  throw new Error('Fewer than 30 unique minigame types in CRAZY_PROBLEM_THEMES!');
}

console.log('--- TEST 4: Initial Minigame State Properties ---');
const initialMg = createInitialMinigameState();
const requiredStateKeys = [
  'dustSpots', 'crustScraped', 'newPasteApplied', 'fanHairsRemoved', 'fanOiled',
  'roachesCleared', 'eggsDisinfected', 'bentPins', 'oxidationCleaned', 'cmosTested',
  'cmosReplaced', 'clrCmosJumper', 'fittingsTightened', 'bubblesPurged', 'ihsRemoved',
  'kaptonApplied', 'liquidMetalSpread', 'trojans', 'cookieCategories', 'popups',
  'defragBlocks', 'bsodLogs', 'missingDlls', 'biosProgress', 'bcdSteps',
  'dduSafeMode', 'bloatwareList', 'rsaHexBlocks', 'firewallPorts', 'tempCleanPurged', 'cryptoSeedUser'
];

requiredStateKeys.forEach(k => {
  if (initialMg[k] === undefined) {
    throw new Error(`Missing initial state key: ${k}`);
  }
});
console.log('All 31 initial state keys verified successfully!');

console.log('--- TEST 5: Create Client Case with Hybrid Support ---');
const sampleCase = createClientCase(0, true);
console.log('Sample case created:', sampleCase.code, sampleCase.clientName, sampleCase.device, sampleCase.urgency);
if (!sampleCase.mgState || sampleCase.mgState.dustSpots === undefined) {
  throw new Error('Sample case missing mgState properties!');
}

console.log('=== ALL TESTS PASSED SUCCESSFULLY! ===');
process.exit(0);
