const fs = require('fs');
let code = fs.readFileSync('scratch/test_fixes_verification.js', 'utf8');

const target = `  completeBtn.click();
  console.log(\`   - Passo \${step + 1}/\${reqList.length}: Módulo \${probIdx} confirmado.\`);`;

const replacement = `  const isSolv = vm.runInContext(\`isCurrentRackPuzzleSolved(\${probIdx})\`, sandbox);
  console.log(\`   - Módulo \${probIdx} isSolved: \${isSolv}\`);
  completeBtn.click();
  console.log(\`   - Passo \${step + 1}/\${reqList.length}: Módulo \${probIdx} confirmado. Solved so far: \${centralRackState.solvedProblemIndices.length}/\${reqList.length}\`);`;

code = code.replace(target, replacement);
fs.writeFileSync('scratch/test_fixes_verification.js', code, 'utf8');
