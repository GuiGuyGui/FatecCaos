const fs = require('fs');

let code = fs.readFileSync('game.js', 'utf8');

// 1. Update changeReputation to trigger Game Over when rep <= 0
const oldChangeRep = `function changeReputation(delta) {
  state.rep = Math.max(0, Math.min(100, state.rep + delta));
  updateHUD();
}`;

const newChangeRep = `function changeReputation(delta) {
  state.rep = Math.max(0, Math.min(100, state.rep + delta));
  updateHUD();
  if (state.rep <= 0 && !centralRackState.gameOver) {
    triggerReputationGameOver();
  }
}`;

if (code.includes(oldChangeRep)) {
  code = code.replace(oldChangeRep, newChangeRep);
  console.log('changeReputation updated (LF)!');
} else {
  const oldCRLF = oldChangeRep.replace(/\n/g, '\r\n');
  const newCRLF = newChangeRep.replace(/\n/g, '\r\n');
  if (code.includes(oldCRLF)) {
    code = code.replace(oldCRLF, newCRLF);
    console.log('changeReputation updated (CRLF)!');
  } else {
    console.error('ERROR: oldChangeRep not found!');
  }
}

// 2. Add triggerReputationGameOver and update triggerCentralRackGameOver
const oldRackGO = `function triggerCentralRackGameOver() {
  centralRackState.onFire = true;
  centralRackState.gameOver = true;
  centralRackState.incidentActive = false;

  document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.remove('open'));
  playTechChime('alarm');

  const mEl = document.getElementById('game-over-money');
  if (mEl) mEl.textContent = state.money < 0 ? \`-R$ \${Math.abs(state.money)} (DÍVIDA!)\` : \`R$ \${state.money}\`;
  const rEl = document.getElementById('game-over-rep');
  if (rEl) rEl.textContent = \`\${state.rep}%\`;
  const fEl = document.getElementById('game-over-rack-fixed');
  if (fEl) fEl.textContent = \`\${centralRackState.fixedCount} Incidentes\`;
  const bEl = document.getElementById('game-over-burnt-count');
  if (bEl) bEl.textContent = \`\${state.burntCount}\`;

  const goModal = document.getElementById('game-over-modal');
  if (goModal) goModal.classList.add('open');

  const banner = document.getElementById('rack-incident-banner');
  if (banner) banner.classList.remove('visible');

  addChatMessage('Corpo de Bombeiros', '🚨🔥 <b>EVACUAÇÃO GERAL:</b> O Rack Central pegou fogo após 180s sem conserto! O expediente terminou!');
  showToast('🔥💥 O RACK CENTRAL PEGOU FOGO! GAME OVER!');
}`;

const newRackGO = `function triggerCentralRackGameOver() {
  centralRackState.onFire = true;
  centralRackState.gameOver = true;
  centralRackState.incidentActive = false;

  document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.remove('open'));
  playTechChime('alarm');

  const mEl = document.getElementById('game-over-money');
  if (mEl) mEl.textContent = state.money < 0 ? \`-R$ \${Math.abs(state.money)} (DÍVIDA!)\` : \`R$ \${state.money}\`;
  const rEl = document.getElementById('game-over-rep');
  if (rEl) rEl.textContent = \`\${state.rep}%\`;
  const fEl = document.getElementById('game-over-rack-fixed');
  if (fEl) fEl.textContent = \`\${centralRackState.fixedCount} Incidentes\`;
  const bEl = document.getElementById('game-over-burnt-count');
  if (bEl) bEl.textContent = \`\${state.burntCount}\`;

  const titleEl = document.getElementById('game-over-title');
  const iconEl = document.getElementById('game-over-icon');
  const descEl = document.getElementById('game-over-desc');
  if (titleEl) titleEl.textContent = 'FIM DE JOGO — O RACK CENTRAL PEGOU FOGO!';
  if (iconEl) iconEl.textContent = '🔥💥🚨';
  if (descEl) descEl.innerHTML = 'O tempo de <b>180 segundos (3 minutos)</b> para resolver a pane de infraestrutura esgotou! O Rack Central superaqueceu violentamente, explodiu em chamas e a sede técnica foi <b>evacuada às pressas pelo Corpo de Bombeiros</b>!';

  const goModal = document.getElementById('game-over-modal');
  if (goModal) goModal.classList.add('open');

  const banner = document.getElementById('rack-incident-banner');
  if (banner) banner.classList.remove('visible');

  addChatMessage('Corpo de Bombeiros', '🚨🔥 <b>EVACUAÇÃO GERAL:</b> O Rack Central pegou fogo após 180s sem conserto! O expediente terminou!');
  showToast('🔥💥 O RACK CENTRAL PEGOU FOGO! GAME OVER!');
}

function triggerReputationGameOver() {
  centralRackState.gameOver = true;
  centralRackState.incidentActive = false;

  document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.remove('open'));
  playTechChime('alarm');

  const mEl = document.getElementById('game-over-money');
  if (mEl) mEl.textContent = state.money < 0 ? \`-R$ \${Math.abs(state.money)} (DÍVIDA!)\` : \`R$ \${state.money}\`;
  const rEl = document.getElementById('game-over-rep');
  if (rEl) rEl.textContent = \`0% (FALÊNCIA)\`;
  const fEl = document.getElementById('game-over-rack-fixed');
  if (fEl) fEl.textContent = \`\${centralRackState.fixedCount} Incidentes\`;
  const bEl = document.getElementById('game-over-burnt-count');
  if (bEl) bEl.textContent = \`\${state.burntCount}\`;

  const titleEl = document.getElementById('game-over-title');
  const iconEl = document.getElementById('game-over-icon');
  const descEl = document.getElementById('game-over-desc');
  if (titleEl) titleEl.textContent = 'FIM DE JOGO — SUA OFICINA FALIU (REPUTAÇÃO 0%)!';
  if (iconEl) iconEl.textContent = '📉🚫💔';
  if (descEl) descEl.innerHTML = 'A reputação da sua oficina despencou para <b>0%</b>! Clientes furiosos espalharam reclamações pela cidade, o Procon interditou as atividades e você precisou <b>declarar falência técnica</b>!';

  const goModal = document.getElementById('game-over-modal');
  if (goModal) goModal.classList.add('open');

  const banner = document.getElementById('rack-incident-banner');
  if (banner) banner.classList.remove('visible');

  addChatMessage('Procon & Fiscalização', '🚫📉 <b>OFICINA INTERDITADA:</b> A reputação chegou a 0%! Seu alvará técnico foi cassado por má qualidade e demora nos atendimentos!');
  showToast('📉🚫 REPUTAÇÃO EM 0%! SUA OFICINA FALIU! GAME OVER!');
}`;

if (code.includes(oldRackGO)) {
  code = code.replace(oldRackGO, newRackGO);
  console.log('Rack and Rep Game Over functions updated (LF)!');
} else {
  const oldRackGOCRLF = oldRackGO.replace(/\n/g, '\r\n');
  const newRackGOCRLF = newRackGO.replace(/\n/g, '\r\n');
  if (code.includes(oldRackGOCRLF)) {
    code = code.replace(oldRackGOCRLF, newRackGOCRLF);
    console.log('Rack and Rep Game Over functions updated (CRLF)!');
  } else {
    console.error('ERROR: oldRackGO not found!');
  }
}

// 3. Update client patience decay in updateEntities
const oldPatience = `      if (!c.solved && !c.pendingBurnTimer) {
        let drainRate = idx < 4 ? 0.0025 : 0.0012;
        if (state.upgrades.vip_sofa) drainRate *= 0.6;
        if (workbenchOpen && idx === state.activeCaseIndex) drainRate = 0.0007;

        c.patience = Math.max(0, c.patience - drainRate);`;

const newPatience = `      if (!c.solved && !c.pendingBurnTimer) {
        // Paciência desce lentamente: sozinho bem devagar, e acelera proporcionalmente à quantidade de técnicos online
        const connectedCount = Math.max(1, Math.min(4, getConnectedPlayerCount()));
        const pFactor = 1.0 + (connectedCount - 1) * 0.85;
        let drainRate = (idx < 4 ? 0.0008 : 0.0004) * pFactor;
        if (state.upgrades.vip_sofa) drainRate *= 0.65;
        if (workbenchOpen && idx === state.activeCaseIndex) drainRate *= 0.35;

        c.patience = Math.max(0, c.patience - drainRate);`;

if (code.includes(oldPatience)) {
  code = code.replace(oldPatience, newPatience);
  console.log('Patience decay updated (LF)!');
} else {
  const oldPatienceCRLF = oldPatience.replace(/\n/g, '\r\n');
  const newPatienceCRLF = newPatience.replace(/\n/g, '\r\n');
  if (code.includes(oldPatienceCRLF)) {
    code = code.replace(oldPatienceCRLF, newPatienceCRLF);
    console.log('Patience decay updated (CRLF)!');
  } else {
    console.error('ERROR: oldPatience not found!');
  }
}

// 4. Update completeRepairAfterMinigame to increase reputation slowly (+1% base, +2% with sofa/coop)
const oldRepReward = `  const benchLvl = state.workbenchLevel || 1;
  if (benchLvl === 2) baseReward += 200;
  else if (benchLvl === 3) baseReward += 450;
  else if (benchLvl >= 4) { baseReward += 1000; repGain += 15; }

  let repGain = (c.coopPlayers > 1 ? 20 : 12) + (state.upgrades.vip_sofa ? 5 : 0) + (wasBurntReturn ? 15 : 0);
  if (c.isHybrid) repGain += 25; // +37% a +45% de Reputação!

  state.money += baseReward;
  changeReputation(+repGain);`;

const newRepReward = `  const benchLvl = state.workbenchLevel || 1;
  if (benchLvl === 2) baseReward += 200;
  else if (benchLvl === 3) baseReward += 450;
  else if (benchLvl >= 4) { baseReward += 1000; }

  // Reputação sobe bem devagar: +1% no atendimento padrão solo, com pequenos bônus justos
  let repGain = 1;
  if (c.coopPlayers > 1) repGain += 1;
  if (state.upgrades.vip_sofa) repGain += 1;
  if (wasBurntReturn) repGain += 2;
  if (c.isHybrid) repGain += 1;
  if (benchLvl >= 4) repGain += 1;

  state.money += baseReward;
  changeReputation(+repGain);`;

if (code.includes(oldRepReward)) {
  code = code.replace(oldRepReward, newRepReward);
  console.log('Rep reward updated (LF)!');
} else {
  const oldRepRewardCRLF = oldRepReward.replace(/\n/g, '\r\n');
  const newRepRewardCRLF = newRepReward.replace(/\n/g, '\r\n');
  if (code.includes(oldRepRewardCRLF)) {
    code = code.replace(oldRepRewardCRLF, newRepRewardCRLF);
    console.log('Rep reward updated (CRLF)!');
  } else {
    console.error('ERROR: oldRepReward not found!');
  }
}

// 5. Update rack incident solve rep gain to be slow (+1% to +2%)
const oldRackRep = `  const rewardMoney = 500 + count * 200;
  const repGain = 10 + count * 2;
  state.money += rewardMoney;
  changeReputation(repGain);`;

const newRackRep = `  const rewardMoney = 500 + count * 200;
  const repGain = 1 + (count >= 5 ? 1 : 0);
  state.money += rewardMoney;
  changeReputation(repGain);`;

if (code.includes(oldRackRep)) {
  code = code.replace(oldRackRep, newRackRep);
  console.log('Rack rep gain updated (LF)!');
} else {
  const oldRackRepCRLF = oldRackRep.replace(/\n/g, '\r\n');
  const newRackRepCRLF = newRackRep.replace(/\n/g, '\r\n');
  if (code.includes(oldRackRepCRLF)) {
    code = code.replace(oldRackRepCRLF, newRackRepCRLF);
    console.log('Rack rep gain updated (CRLF)!');
  } else {
    console.error('ERROR: oldRackRep not found!');
  }
}

// 6. Workbench modal diagnosis lock: must diagnose correctly to open mini-game
const oldWbTabs = `  document.querySelectorAll('.step-tab').forEach(tab => {
    const tName = tab.dataset.tab;
    tab.classList.toggle('active', tName === state.activeTab);
    if (tName === 'conduta') tab.classList.toggle('done', c.diagnosisApproved);
    if (tName === 'minigame') tab.classList.toggle('done', c.minigameDone);
  });`;

const newWbTabs = `  // Se tentar ir para a aba de minigame sem diagnóstico correto, redireciona para triagem
  if (state.activeTab === 'minigame' && !c.diagnosisApproved) {
    state.activeTab = 'triagem';
  }

  document.querySelectorAll('.step-tab').forEach(tab => {
    const tName = tab.dataset.tab;
    tab.classList.toggle('active', tName === state.activeTab);
    if (tName === 'conduta') tab.classList.toggle('done', !!c.diagnosisApproved);
    if (tName === 'minigame') {
      tab.classList.toggle('done', !!c.minigameDone);
      tab.classList.toggle('locked', !c.diagnosisApproved);
      const numSpan = tab.querySelector('.num');
      if (numSpan) {
        numSpan.textContent = c.diagnosisApproved ? (c.minigameDone ? '✓' : '4') : '🔒';
      }
    }
  });`;

if (code.includes(oldWbTabs)) {
  code = code.replace(oldWbTabs, newWbTabs);
  console.log('Wb step tabs updated (LF)!');
} else {
  const oldWbTabsCRLF = oldWbTabs.replace(/\n/g, '\r\n');
  const newWbTabsCRLF = newWbTabs.replace(/\n/g, '\r\n');
  if (code.includes(oldWbTabsCRLF)) {
    code = code.replace(oldWbTabsCRLF, newWbTabsCRLF);
    console.log('Wb step tabs updated (CRLF)!');
  } else {
    console.error('ERROR: oldWbTabs not found!');
  }
}

// 7. Mini-game container: locked if diagnosis not approved
const oldRenderMinigameHead = `function renderSpecificProblemMinigame(c, hasPartOrRack, reqPart) {
  const container = document.getElementById('minigame-container');
  const mg = c.mgState;

  // Mini-game sempre acessível diretamente na Etapa 4! Se o diagnóstico ainda não foi feito, mostra apenas uma dica amigável
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

const newRenderMinigameHead = `function renderSpecificProblemMinigame(c, hasPartOrRack, reqPart) {
  const container = document.getElementById('minigame-container');
  const mg = c.mgState;

  // REGRA: O Mini-game só abre se o jogador diagnosticar com sucesso na Etapa 3!
  if (!c.diagnosisApproved) {
    container.innerHTML = \`
      <div style="background:#0f172a; border:2.5px dashed #475569; border-radius:14px; padding:40px 20px; text-align:center; color:#94a3b8; font-weight:800; margin:10px 0;">
        <div style="font-size:46px; margin-bottom:12px;">🔒</div>
        <h3 style="color:#f8fafc; margin:0 0 8px; font-size:19px;">Mini-Game de Reparo Bloqueado!</h3>
        <p style="margin:0 auto 16px; max-width:460px; font-size:13.5px; line-height:1.5; color:#cbd5e1;">
          Para abrir a bancada de manutenção e o mini-game, você <b>deve primeiro acertar o diagnóstico na Etapa 3 (Diagnóstico ⚠️)</b>. Caso erre, o PC queima!
        </p>
        <button type="button" class="btn btn-amarelo btn-sm" id="btn-goto-diagnosis-step" style="font-weight:900;">⚠️ Ir para Etapa 3: Diagnóstico</button>
      </div>
    \`;
    document.getElementById('btn-goto-diagnosis-step')?.addEventListener('click', () => {
      state.activeTab = 'conduta';
      renderWorkbenchModal();
    });
    return;
  }

  let diagTipHTML = '';`;

if (code.includes(oldRenderMinigameHead)) {
  code = code.replace(oldRenderMinigameHead, newRenderMinigameHead);
  console.log('renderSpecificProblemMinigame lock updated (LF)!');
} else {
  const oldMGCRLF = oldRenderMinigameHead.replace(/\n/g, '\r\n');
  const newMGCRLF = newRenderMinigameHead.replace(/\n/g, '\r\n');
  if (code.includes(oldMGCRLF)) {
    code = code.replace(oldMGCRLF, newMGCRLF);
    console.log('renderSpecificProblemMinigame lock updated (CRLF)!');
  } else {
    console.error('ERROR: oldRenderMinigameHead not found!');
  }
}

// 8. Tab click listener: prevent opening minigame without diagnosis
const oldTabClick = `  document.querySelectorAll('.step-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      state.activeTab = tab.dataset.tab;
      renderWorkbenchModal();
    });
  });`;

const newTabClick = `  document.querySelectorAll('.step-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const targetTab = tab.dataset.tab;
      const c = cases[state.activeCaseIndex];
      if (targetTab === 'minigame' && c && !c.diagnosisApproved) {
        showToast('🔒 Diagnóstico obrigatório! Acerte o diagnóstico na Etapa 3 para liberar o mini-game.');
        playTechChime('error');
        return;
      }
      state.activeTab = targetTab;
      renderWorkbenchModal();
    });
  });`;

if (code.includes(oldTabClick)) {
  code = code.replace(oldTabClick, newTabClick);
  console.log('Tab click listener updated (LF)!');
} else {
  const oldTabClickCRLF = oldTabClick.replace(/\n/g, '\r\n');
  const newTabClickCRLF = newTabClick.replace(/\n/g, '\r\n');
  if (code.includes(oldTabClickCRLF)) {
    code = code.replace(oldTabClickCRLF, newTabClickCRLF);
    console.log('Tab click listener updated (CRLF)!');
  } else {
    console.error('ERROR: oldTabClick not found!');
  }
}

fs.writeFileSync('game.js', code, 'utf8');
console.log('game.js saved successfully with all gameplay updates!');
