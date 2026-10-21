const fs = require('fs');
let code = fs.readFileSync('game.js', 'utf8');

const target = `    } else {
      completeBtn.className = 'btn btn-vidro btn-sm';
      completeBtn.innerHTML = \`✅ Rack 100% Operacional (Sem panes ativas)\`;
    }
  }
;

  const isSolved = isCurrentRackPuzzleSolved(curIdx);
  const completeBtn = document.getElementById('btn-complete-rack-puzzle');
  if (completeBtn) {
    if (isSolved) {
      completeBtn.className = 'btn btn-verde btn-sm';
      completeBtn.innerHTML = \`✅ Reestabelecer Rack Central (+R$ 500 & +10% Reputação)\`;
    } else {
      completeBtn.className = 'btn btn-vidro btn-sm';
      completeBtn.innerHTML = \`⚙️ Conclua o Puzzle Acima para Reestabelecer\`;
    }
  }

  // RENDERIZAÇÃO DOS 10 PUZZLES INTERATIVOS DO MOUSE`;

const replacement = `    } else {
      completeBtn.className = 'btn btn-vidro btn-sm';
      completeBtn.innerHTML = \`✅ Rack 100% Operacional (Sem panes ativas)\`;
    }
  }

  // RENDERIZAÇÃO DOS 10 PUZZLES INTERATIVOS DO MOUSE`;

const targetCRLF = target.replace(/\n/g, '\r\n');
const replacementCRLF = replacement.replace(/\n/g, '\r\n');

if (code.includes(targetCRLF)) {
  code = code.replace(targetCRLF, replacementCRLF);
  console.log("✔ Cleaned duplicate isSolved block (CRLF)");
} else if (code.includes(target)) {
  code = code.replace(target, replacement);
  console.log("✔ Cleaned duplicate isSolved block (LF)");
} else {
  console.error("Target not found!");
  process.exit(1);
}

fs.writeFileSync('game.js', code, 'utf8');
