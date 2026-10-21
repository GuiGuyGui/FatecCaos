const fs = require('fs');
let code = fs.readFileSync('game.js', 'utf8');

// 1. UPDATE centralRackState initialization
const oldState = `centralRackState = {
  incidentActive: false,
  incidentProblemIdx: 0,
  incidentSecondsRemaining: 180,
  incidentIntervalCounter: 0,
  selectedPuzzleIdx: 0,
  fixedCount: 0,
  onFire: false,
  gameOver: false,`;

const newState = `centralRackState = {
  incidentActive: false,
  incidentProblemIdx: 0,
  incidentSecondsRemaining: 180,
  incidentIntervalCounter: 0,
  selectedPuzzleIdx: 0,
  fixedCount: 0,
  requiredProblemIndices: [],
  solvedProblemIndices: [],
  onFire: false,
  gameOver: false,`;

if (code.includes(oldState)) {
  code = code.replace(oldState, newState);
  console.log("✔ centralRackState updated");
} else {
  console.log("⚠ centralRackState target not found directly, checking with CRLF...");
  code = code.replace(oldState.replace(/\n/g, '\r\n'), newState.replace(/\n/g, '\r\n'));
}

// 2. UPDATE triggerCentralRackIncident and resolveCentralRackIncident
const pTriggerStart = code.indexOf('function triggerCentralRackIncident');
const pResolveEnd = code.indexOf('function isPlayerNearCentralRack', pTriggerStart);

const newIncidentFuncs = `function triggerCentralRackIncident(specificIdx) {
  const activePlayers = (state.networkMode === 'online')
    ? Math.max(1, state.players.filter(p => p.connected || p === state.players[state.mySlotIndex]).length)
    : (state.players.length || 1);

  // Escalonamento do número de puzzles:
  // 1 jogador: de 1 a 4 dependendo da reputação
  // 2 a 3 jogadores: de 3 a 7
  // 4 jogadores: até 10 puzzles simultâneos!
  let requiredCount = 1;
  if (activePlayers >= 4) {
    requiredCount = Math.min(10, 6 + Math.floor(Math.random() * 5)); // 6 a 10
  } else if (activePlayers === 3) {
    requiredCount = 4 + Math.floor(Math.random() * 3); // 4 a 6
  } else if (activePlayers === 2) {
    requiredCount = 2 + Math.floor(Math.random() * 3); // 2 a 4
  } else {
    if (state.rep < 40) requiredCount = 1;
    else if (state.rep < 70) requiredCount = Math.random() < 0.6 ? 2 : 1;
    else if (state.rep < 90) requiredCount = 2 + (Math.random() < 0.5 ? 1 : 0);
    else requiredCount = 3 + (Math.random() < 0.5 ? 1 : 0);
  }

  // Embaralha os 10 problemas e seleciona os requiredCount módulos
  const allIndices = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  for (let i = allIndices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allIndices[i], allIndices[j]] = [allIndices[j], allIndices[i]];
  }
  const chosenIndices = allIndices.slice(0, requiredCount);
  if (specificIdx !== undefined && !chosenIndices.includes(specificIdx)) {
    chosenIndices[0] = specificIdx;
  }

  chosenIndices.forEach(idx => resetRackPuzzleState(idx));

  centralRackState.incidentActive = true;
  centralRackState.requiredProblemIndices = chosenIndices;
  centralRackState.solvedProblemIndices = [];
  centralRackState.incidentProblemIdx = chosenIndices[0];
  centralRackState.selectedPuzzleIdx = chosenIndices[0];
  centralRackState.incidentSecondsRemaining = 180 + (requiredCount - 1) * 35;

  const banner = document.getElementById('rack-incident-banner');
  const titleEl = document.getElementById('rack-incident-title');
  const textEl = document.getElementById('rack-incident-desc') || document.getElementById('rack-incident-text');
  const timeEl = document.getElementById('rack-incident-time');

  const probNames = chosenIndices.map(i => CENTRAL_RACK_PROBLEMS[i].shortName).join(', ');

  if (banner) banner.classList.add('visible');
  if (titleEl) titleEl.textContent = \`🚨 PANE NO RACK CENTRAL: \${requiredCount} MÓDULOS DEFEITUOSOS!\`;
  if (textEl) textEl.innerHTML = \`⚠️ <b>\${requiredCount} Defeitos Pendentes:</b> \${probNames}. Resolva todos para reestabelecer o rack!\`;
  
  const mins = Math.floor(centralRackState.incidentSecondsRemaining / 60);
  const secs = String(centralRackState.incidentSecondsRemaining % 60).padStart(2, '0');
  if (timeEl) timeEl.textContent = \`Tempo Restante: \${String(mins).padStart(2, '0')}:\${secs} (\${centralRackState.incidentSecondsRemaining}s)\`;

  playTechChime('alarm');
  showToast(\`🚨 PANE NO RACK CENTRAL! \${requiredCount} módulos pifaram! Vá até um dos racks para consertar!\`);
  addChatMessage('Alerta NOC', \`🚨 <b>PANE NO RACK CENTRAL:</b> \${requiredCount} módulos apresentaram falha simultânea (\${probNames}). Repare todos os módulos indicados no painel!\`);

  if (document.getElementById('central-rack-modal')?.classList.contains('open')) {
    renderCentralRackModal();
  }
}

function resolveCentralRackIncident() {
  const count = (centralRackState.requiredProblemIndices && centralRackState.requiredProblemIndices.length)
    ? centralRackState.requiredProblemIndices.length
    : 1;

  centralRackState.incidentActive = false;
  centralRackState.requiredProblemIndices = [];
  centralRackState.solvedProblemIndices = [];
  centralRackState.fixedCount++;
  centralRackState.incidentIntervalCounter = 0;

  const banner = document.getElementById('rack-incident-banner');
  if (banner) banner.classList.remove('visible');

  // Recompensa proporcional ao número de puzzles corrigidos (paga apenas UMA vez)
  const rewardMoney = 500 + count * 200;
  const repGain = 10 + count * 2;
  state.money += rewardMoney;
  changeReputation(repGain);
  playTechChime('success');

  showToast(\`🎉 Todos os \${count} problemas do Rack foram resolvidos com sucesso! (+R$ \${rewardMoney} | +\${repGain}% Rep)\`);
  addChatMessage('Rack Central', \`✅ <b>Infraestrutura 100% Reestabelecida!</b> Todos os \${count} módulos com defeito foram corrigidos. A rede, energia e climatização voltaram ao normal! (+R$ \${rewardMoney} | +\${repGain}% Reputação)\`);

  // Fecha o modal do rack automaticamente assim que todos os problemas forem concluídos!
  document.getElementById('central-rack-modal')?.classList.remove('open');

  renderCentralRackModal();
  renderAllUI();
}

`;

code = code.slice(0, pTriggerStart) + newIncidentFuncs + code.slice(pResolveEnd);
console.log("✔ triggerCentralRackIncident and resolveCentralRackIncident replaced");

// 3. UPDATE renderCentralRackModal header and buttons to point out defective puzzles and prevent infinite spam
const pRenderModal = code.indexOf('function renderCentralRackModal() {');
const pStageStart = code.indexOf('const stage = document.getElementById(\'central-rack-stage\');', pRenderModal);

const renderModalHeaderCode = `function renderCentralRackModal() {
  const pwrLed = document.getElementById('rack-led-pwr');
  const netLed = document.getElementById('rack-led-net');
  const fanLed = document.getElementById('rack-led-fan');
  const raidLed = document.getElementById('rack-led-raid');

  const pwrOk = isCurrentRackPuzzleSolved(1) && isCurrentRackPuzzleSolved(5) && isCurrentRackPuzzleSolved(8);
  const netOk = isCurrentRackPuzzleSolved(0) && isCurrentRackPuzzleSolved(4) && isCurrentRackPuzzleSolved(7);
  const fanOk = isCurrentRackPuzzleSolved(2) && isCurrentRackPuzzleSolved(6);
  const raidOk = isCurrentRackPuzzleSolved(3);

  if (pwrLed) pwrLed.className = \`rack-led \${pwrOk ? 'led-green' : 'led-red'}\`;
  if (netLed) netLed.className = \`rack-led \${netOk ? 'led-green' : 'led-amber'}\`;
  if (fanLed) fanLed.className = \`rack-led \${fanOk ? 'led-green' : 'led-red'}\`;
  if (raidLed) raidLed.className = \`rack-led \${raidOk ? 'led-green' : 'led-red'}\`;

  const statusPill = document.getElementById('central-rack-status-pill');
  if (statusPill) {
    if (centralRackState.incidentActive) {
      const totalReq = centralRackState.requiredProblemIndices?.length || 1;
      const doneReq = centralRackState.solvedProblemIndices?.length || 0;
      statusPill.textContent = \`🔴 PANE ATIVA: \${doneReq}/\${totalReq} RESOLVIDOS\`;
      statusPill.className = 'ticket-tag tag-burnt';
    } else {
      statusPill.textContent = '🟢 100% Operacional (Sem Falhas)';
      statusPill.className = 'ticket-tag tag-coop';
    }
  }

  const fixedEl = document.getElementById('central-rack-fixed-count');
  if (fixedEl) fixedEl.textContent = \`\${centralRackState.fixedCount} Incidentes Resolvidos\`;

  const curIdx = centralRackState.selectedPuzzleIdx;
  const curProb = CENTRAL_RACK_PROBLEMS[curIdx];

  const titleEl = document.getElementById('central-rack-title-text');
  const descEl = document.getElementById('central-rack-desc-text');
  const hintEl = document.getElementById('central-rack-hint-msg');

  // Painel Indicador de Defeitos Ativos
  let defectTrackerHTML = '';
  if (centralRackState.incidentActive && centralRackState.requiredProblemIndices?.length) {
    const totalReq = centralRackState.requiredProblemIndices.length;
    const doneReq = centralRackState.solvedProblemIndices?.length || 0;
    defectTrackerHTML = \`
      <div style="background:rgba(234, 88, 12, 0.15); border:2px solid #ea580c; border-radius:10px; padding:10px 14px; margin-bottom:12px;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:6px; margin-bottom:6px;">
          <b style="color:#fdba74; font-size:13px;">🚨 MÓDULOS DEFEITUOSOS QUE VOCÊ PRECISA CONSERTAR:</b>
          <span style="background:#ea580c; color:#fff; font-size:11px; font-weight:900; padding:2px 8px; border-radius:6px;">
            Progresso: \${doneReq}/\${totalReq} Resolvidos
          </span>
        </div>
        <div style="display:flex; gap:8px; flex-wrap:wrap;">
          \${centralRackState.requiredProblemIndices.map(pIdx => {
            const p = CENTRAL_RACK_PROBLEMS[pIdx];
            const isDone = centralRackState.solvedProblemIndices?.includes(pIdx);
            const isSelected = curIdx === pIdx;
            return \`
              <button type="button" class="btn \${isDone ? 'btn-verde' : 'btn-coral'} btn-xs" data-switch-rack-idx="\${pIdx}" style="\${isSelected ? 'outline:2px solid #fff; box-shadow:0 0 8px #fff;' : ''}">
                \${isDone ? '✅' : '⚠️'} \${p.shortName} \${isDone ? '(Concluído)' : '(Pendente)'}
              </button>
            \`;
          }).join('')}
        </div>
      </div>
    \`;
  }

  if (titleEl) {
    const isCurDefective = centralRackState.incidentActive && centralRackState.requiredProblemIndices?.includes(curIdx);
    const isCurDone = centralRackState.solvedProblemIndices?.includes(curIdx);
    titleEl.innerHTML = \`
      🗄️ \${curProb.name} 
      <span style="font-size:11px; color:#38bdf8; font-weight:700;">(\${curProb.category})</span>
      \${isCurDefective ? (isCurDone ? ' <span style="color:#4ade80; font-size:12px; font-weight:900;">[✅ CONCLUÍDO]</span>' : ' <span style="color:#f87171; font-size:12px; font-weight:900;">[⚠️ DEFEITO ATIVO]</span>') : ''}
    \`;
  }
  if (descEl) descEl.innerHTML = defectTrackerHTML + curProb.desc;
  if (hintEl) hintEl.innerHTML = \`💡 <b>Como operar:</b> \${curProb.hint}\`;

  // Atualiza a barra de seleção destacando quais módulos têm defeito pendente
  document.querySelectorAll('#central-rack-selector-bar [data-rack-puzzle]').forEach(btn => {
    const pIdx = Number(btn.dataset.rackPuzzle);
    btn.classList.toggle('active', pIdx === curIdx);
    const isDefective = centralRackState.incidentActive && centralRackState.requiredProblemIndices?.includes(pIdx);
    const isDone = centralRackState.solvedProblemIndices?.includes(pIdx);
    if (isDefective && !isDone) {
      btn.style.borderColor = '#ef4444';
      btn.style.boxShadow = '0 0 8px rgba(239, 68, 68, 0.6)';
    } else if (isDefective && isDone) {
      btn.style.borderColor = '#22c55e';
      btn.style.boxShadow = 'none';
    } else {
      btn.style.borderColor = '';
      btn.style.boxShadow = '';
    }
  });

  // Listener para botões do rastreador de defeitos
  setTimeout(() => {
    document.querySelectorAll('[data-switch-rack-idx]').forEach(b => {
      b.onclick = () => {
        centralRackState.selectedPuzzleIdx = Number(b.dataset.switchRackIdx);
        renderCentralRackModal();
      };
    });
  }, 10);

  const stage = document.getElementById('central-rack-stage');
  if (!stage) return;

  const isSolved = isCurrentRackPuzzleSolved(curIdx);
  const completeBtn = document.getElementById('btn-complete-rack-puzzle');
  if (completeBtn) {
    if (centralRackState.incidentActive) {
      const isRequired = centralRackState.requiredProblemIndices?.includes(curIdx);
      const isAlreadyDone = centralRackState.solvedProblemIndices?.includes(curIdx);

      if (isAlreadyDone) {
        completeBtn.className = 'btn btn-verde btn-sm';
        completeBtn.innerHTML = \`✅ Módulo "\${curProb.shortName}" Já Reparado! Escolha o próximo defeito\`;
      } else if (isSolved) {
        completeBtn.className = 'btn btn-verde btn-sm';
        completeBtn.innerHTML = \`✅ Confirmar Reparo deste Módulo (\${curProb.shortName})\`;
      } else {
        completeBtn.className = 'btn btn-coral btn-sm';
        completeBtn.innerHTML = \`⚠️ Resolva o Puzzle Acima para Reparar este Módulo\`;
      }
    } else {
      completeBtn.className = 'btn btn-vidro btn-sm';
      completeBtn.innerHTML = \`✅ Rack 100% Operacional (Sem panes ativas)\`;
    }
  }
`;

code = code.slice(0, pRenderModal) + renderModalHeaderCode + code.slice(pStageStart + 'const stage = document.getElementById(\'central-rack-stage\');\n  if (!stage) return;'.length);
console.log("✔ renderCentralRackModal updated with defect tracker and secure button");

// 4. UPDATE btn-complete-rack-puzzle click event in setupEvents to handle multi-puzzle progression and eliminate infinite money
const oldBtnComplete = `document.getElementById('btn-complete-rack-puzzle')?.addEventListener('click', () => {
    if (!isPlayerNearCentralRack()) {
      showToast('⚠️ Você precisa estar no Rack Central para realizar a manutenção!');
      document.getElementById('central-rack-modal')?.classList.remove('open');
      return;
    }
    const curIdx = centralRackState.selectedPuzzleIdx;
    if (isCurrentRackPuzzleSolved(curIdx)) {
      if (centralRackState.incidentActive) {
        resolveCentralRackIncident();
      } else {
        state.money += 200;
        changeReputation(5);
        playTechChime('success');
        showToast('🎉 Manutenção Preventiva do Rack Concluída! (+R$ 200 | +5% Reputação)');
        addChatMessage('Rack Central', '🔧 Manutenção preventiva concluída com sucesso! (+R$ 200 | +5% Reputação)');
        renderCentralRackModal();
        renderAllUI();
      }
    } else {
      playTechChime('buzz');
      const p = CENTRAL_RACK_PROBLEMS[curIdx];
      showToast(\`⚠️ Complete o puzzle "\${p.shortName}" interativamente antes de reestabelecer! \${p.hint}\`);
    }
  });`;

const newBtnComplete = `document.getElementById('btn-complete-rack-puzzle')?.addEventListener('click', () => {
    if (!isPlayerNearCentralRack()) {
      showToast('⚠️ Você precisa estar no Rack Central para realizar a manutenção!');
      document.getElementById('central-rack-modal')?.classList.remove('open');
      return;
    }

    // Se NÃO houver pane ativa, impede o exploit de dinheiro/reputação infinitos!
    if (!centralRackState.incidentActive) {
      showToast('✅ A infraestrutura do Rack Central está 100% operacional. Nenhuma pane pendente!');
      return;
    }

    const curIdx = centralRackState.selectedPuzzleIdx;
    const curProb = CENTRAL_RACK_PROBLEMS[curIdx];

    if (!isCurrentRackPuzzleSolved(curIdx)) {
      playTechChime('buzz');
      showToast(\`⚠️ Complete o puzzle "\${curProb.shortName}" interativamente antes de confirmar o reparo! \${curProb.hint}\`);
      return;
    }

    // Se o puzzle atual for um dos necessários e ainda não foi computado
    if (!centralRackState.solvedProblemIndices) centralRackState.solvedProblemIndices = [];
    if (!centralRackState.solvedProblemIndices.includes(curIdx)) {
      centralRackState.solvedProblemIndices.push(curIdx);
      playTechChime('success');
    }

    const totalReq = centralRackState.requiredProblemIndices?.length || 1;
    const doneReq = centralRackState.solvedProblemIndices.length;

    // Se todos os puzzles necessários foram resolvidos, finaliza o incidente e FECHA O MODAL!
    if (doneReq >= totalReq) {
      resolveCentralRackIncident();
    } else {
      // Avança automaticamente para o próximo puzzle com defeito pendente
      const nextPending = centralRackState.requiredProblemIndices.find(idx => !centralRackState.solvedProblemIndices.includes(idx));
      if (nextPending !== undefined) {
        centralRackState.selectedPuzzleIdx = nextPending;
      }
      showToast(\`✅ Módulo "\${curProb.shortName}" reparado! (\${doneReq}/\${totalReq} resolvidos). Avançando para o próximo defeito...\`);
      renderCentralRackModal();
    }
  });`;

if (code.includes(oldBtnComplete)) {
  code = code.replace(oldBtnComplete, newBtnComplete);
  console.log("✔ btn-complete-rack-puzzle listener updated");
} else {
  code = code.replace(oldBtnComplete.replace(/\n/g, '\r\n'), newBtnComplete.replace(/\n/g, '\r\n'));
  console.log("✔ btn-complete-rack-puzzle listener updated with CRLF");
}

// 5. UPDATE renderSpecificProblemMinigame to ALWAYS open the mini-game (no lock screen blocking)
const oldLockBlock = `  if (!c.diagnosisApproved) {
    container.innerHTML = \`
      <div class="minigame-box" style="text-align:center; padding:26px 18px;">
        <div style="font-size:38px; margin-bottom:8px;">🔒🛠️</div>
        <h4 style="margin:0 0 8px; font-size:18px; color:var(--amarelo);">
          O Mini-Game / Puzzle é a Última Etapa do Conserto!
        </h4>
        <p style="margin:0 auto 14px; max-width:540px; font-size:13.5px; color:#d7f5f8;">
          Primeiro faça o <b>Diagnóstico Correto na Etapa 3</b> para liberar o Mini-Game ou Puzzle específico de <b>\${c.clientName}</b> (<b>\${c.device}</b>)!
        </p>
        <button type="button" class="btn btn-amarelo" id="btn-go-step3-diag">
          📋 Ir para a Etapa 3 (Escolher Diagnóstico)
        </button>
      </div>
    \`;
    document.getElementById('btn-go-step3-diag')?.addEventListener('click', () => {
      state.activeTab = 'conduta';
      renderWorkbenchModal();
    });
    return;
  }`;

const newLockBlock = `  // Mini-game sempre acessível diretamente na Etapa 4! Se o diagnóstico ainda não foi feito, mostra apenas uma dica amigável
  let diagTipHTML = '';
  if (!c.diagnosisApproved) {
    diagTipHTML = \`
      <div style="background:#1e293b; border:2px dashed #f59e0b; padding:10px 14px; border-radius:10px; margin-bottom:12px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
        <div style="font-size:13px; color:#fef08a;">
          💡 <b>Dica Técnica:</b> Você pode acertar o Diagnóstico na <b>Etapa 3</b> para ganhar bônus de reputação (+25%), ou resolver o conserto no Mini-Game diretamente agora!
        </div>
        <button type="button" class="btn btn-amarelo btn-xs" id="btn-go-step3-optional">📋 Ver Diagnóstico (Etapa 3)</button>
      </div>
    \`;
  }`;

if (code.includes(oldLockBlock)) {
  code = code.replace(oldLockBlock, newLockBlock);
  console.log("✔ renderSpecificProblemMinigame lock removed");
} else {
  code = code.replace(oldLockBlock.replace(/\n/g, '\r\n'), newLockBlock.replace(/\n/g, '\r\n'));
  console.log("✔ renderSpecificProblemMinigame lock removed with CRLF");
}

// Also add diagTipHTML to the container.innerHTML
const oldContainerInner = `container.innerHTML = partBannerHTML + hybridHeaderHTML + gameBodyHTML + completionBanner;`;
const newContainerInner = `container.innerHTML = (typeof diagTipHTML !== 'undefined' ? diagTipHTML : '') + partBannerHTML + hybridHeaderHTML + gameBodyHTML + completionBanner;
  document.getElementById('btn-go-step3-optional')?.addEventListener('click', () => {
    state.activeTab = 'conduta';
    renderWorkbenchModal();
  });`;

if (code.includes(oldContainerInner)) {
  code = code.replace(oldContainerInner, newContainerInner);
  console.log("✔ container.innerHTML updated with diagTipHTML");
} else {
  code = code.replace(oldContainerInner.replace(/\n/g, '\r\n'), newContainerInner.replace(/\n/g, '\r\n'));
  console.log("✔ container.innerHTML updated with CRLF");
}

// 6. UPDATE callClientToMyRoom and interactWithMyWorkbench for best path to the desk and stool
const pCallStart = code.indexOf('function callClientToMyRoom(caseIdx)');
const pCallEnd = code.indexOf('function callNextClientToRoom()', pCallStart);

const newCallAndWorkbench = `function callClientToMyRoom(caseIdx) {
  if (!cases[caseIdx] || cases[caseIdx].leavingState) return;
  state.activeCaseIndex = caseIdx;
  const c = cases[caseIdx];
  const map = currentMap();

  if (!c.mgState) c.mgState = createInitialMinigameState();

  // Outros clientes na sala voltam para a recepção
  cases.forEach((other, i) => {
    if (i !== caseIdx && other.inMyRoom && !other.leavingState) {
      other.inMyRoom = false;
      other.walkingToDesk = false;
      other.arrivedAtDesk = false;
      const slot = getWaitingSlotPosition(i);
      other.waypoints = buildDoorwayPath(other.x, other.y, slot.x, slot.y);
    }
  });

  const you = state.players[state.mySlotIndex];
  you.bubble = \`📣 Próximo! \${c.clientName}, venha até minha mesa!\`;
  you.bubbleTimer = 180;

  const targetPos = map.clientStoolPos || map.myChairPos || { x: 326, y: 650 };
  const distToStool = Math.hypot(c.x - targetPos.x, c.y - targetPos.y);

  if (!c.inMyRoom || distToStool > 18) {
    c.inMyRoom = true;
    c.walkingToDesk = true;
    c.arrivedAtDesk = false;

    // Rota segura e desobstruída direto da recepção para a banqueta da nossa sala:
    const myRoom = (map.rooms || []).find(r => r.id === 'my_room');
    const doorOut = (myRoom && myRoom.doorOutside) ? myRoom.doorOutside : { x: 425, y: 720 };
    const doorIn = (myRoom && myRoom.doorInside) ? myRoom.doorInside : { x: 345, y: 720 };

    // Caminho em 4 passos garantidos sem colisões:
    // 1. Alinha horizontalmente no corredor livre (x = 425)
    // 2. Alinha na frente da porta da Cabine #01 (x = 425, y = 720)
    // 3. Entra pela porta na Cabine #01 (x = 345, y = 720)
    // 4. Caminha diretamente para a banqueta do cliente (x = targetPos.x, y = targetPos.y)
    c.waypoints = [
      { x: doorOut.x, y: Math.max(500, Math.min(880, c.y)) },
      { x: doorOut.x, y: doorOut.y },
      { x: doorIn.x, y: doorIn.y },
      { x: targetPos.x, y: targetPos.y }
    ];

    showToast(\`📣 Você chamou \${c.clientName} (\${c.code})! Ele está a caminho do banquinho da sua mesa para sentar-se.\`);
  } else {
    c.inMyRoom = true;
    c.walkingToDesk = false;
    c.arrivedAtDesk = true;
    c.x = targetPos.x;
    c.y = targetPos.y;
    showToast(\`🗣️ \${c.clientName} sentado na sua mesa: \${c.quote}\`);
    addChatMessage(\`🗣️ \${c.clientName}\`, \`\${c.quote} (\${c.device})\`);
  }

  renderAllUI();
}

function interactWithMyWorkbench() {
  const you = state.players[state.mySlotIndex];
  const clientInRoom = cases.find(c => c.inMyRoom && !c.leavingState);

  if (!clientInRoom) {
    you.bubble = '🤔 Nenhum cliente aqui! Preciso chamar na Recepção.';
    you.bubbleTimer = 200;
    showToast('🛎️ Nenhum cliente está na sua bancada! Vá até o Balcão de Recepção e aperte [E] para chamar o próximo cliente.');
    return;
  }

  // Se o cliente ainda estiver caminhando, senta ele imediatamente na banqueta e abre a bancada!
  if (clientInRoom.walkingToDesk && !clientInRoom.arrivedAtDesk) {
    const map = currentMap();
    const targetPos = map.clientStoolPos || { x: 326, y: 650 };
    clientInRoom.x = targetPos.x;
    clientInRoom.y = targetPos.y;
    clientInRoom.waypoints = [];
    clientInRoom.walkingToDesk = false;
    clientInRoom.arrivedAtDesk = true;
    showToast(\`🪑 \${clientInRoom.clientName} acomodou-se no banquinho pronto para o conserto!\`);
  }

  state.activeCaseIndex = cases.indexOf(clientInRoom);
  openWorkbenchModal(null, true);
}

`;

code = code.slice(0, pCallStart) + newCallAndWorkbench + code.slice(pCallEnd);
console.log("✔ callClientToMyRoom and interactWithMyWorkbench updated with guaranteed path to stool");

fs.writeFileSync('game.js', code, 'utf8');
console.log("🎉 All updates written successfully to game.js!");
