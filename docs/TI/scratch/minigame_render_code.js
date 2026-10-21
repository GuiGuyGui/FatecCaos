
// ============================================================================
// ETAPA 4: 30 MINI-GAMES / PUZZLES (15 HARDWARE + 15 SOFTWARE) & CASOS HÍBRIDOS!
// ============================================================================
function renderSpecificProblemMinigame(c, hasPartOrRack, reqPart) {
  const container = document.getElementById('minigame-container');
  const mg = c.mgState;

  if (!c.diagnosisApproved) {
    container.innerHTML = `
      <div class="minigame-box" style="text-align:center; padding:26px 18px;">
        <div style="font-size:38px; margin-bottom:8px;">🔒🛠️</div>
        <h4 style="margin:0 0 8px; font-size:18px; color:var(--amarelo);">
          O Mini-Game / Puzzle é a Última Etapa do Conserto!
        </h4>
        <p style="margin:0 auto 14px; max-width:540px; font-size:13.5px; color:#d7f5f8;">
          Primeiro faça o <b>Diagnóstico Correto na Etapa 3</b> para liberar o Mini-Game ou Puzzle específico de <b>${c.clientName}</b> (<b>${c.device}</b>)!
        </p>
        <button type="button" class="btn btn-amarelo" id="btn-go-step3-diag">
          📋 Ir para a Etapa 3 (Escolher Diagnóstico)
        </button>
      </div>
    `;
    document.getElementById('btn-go-step3-diag')?.addEventListener('click', () => {
      state.activeTab = 'conduta';
      renderWorkbenchModal();
    });
    return;
  }

  // Identifica se é Chamado Híbrido (Etapa 1: Hardware -> Etapa 2: Software)
  const isHybrid = !!c.isHybrid;
  const currentStage = mg.hybridStage || 1;
  const activeType = isHybrid
    ? (currentStage === 1 ? (c.hardwareType || 'dust_blower') : (c.softwareType || 'trojan_hunter'))
    : c.minigameType;

  // Banner superior de peças / rack
  const partBannerHTML = `
    <div class="mg-part-bar ${hasPartOrRack ? 'has-part' : 'missing-part'}">
      <div>
        ${state.rackParts > 0
          ? `🗄️ <b>Rack da Sua Sala Ativo:</b> Peça fornecida automaticamente pelo seu Rack (${state.rackParts}/${state.rackCapacity} restantes) (+Bônus R$ 250!)`
          : (hasPartOrRack
            ? `✅ <b>Kit na Mochila:</b> ${reqPart.name} (+Bônus R$ 250!)`
            : `📦 <b>Peça Recomendada:</b> ${reqPart.name} (Compre um Rack na Loja para nunca faltar peça na sala!)`)
        }
      </div>
      ${!hasPartOrRack ? `
        <button type="button" class="btn btn-amarelo btn-xs" id="btn-mg-grab-now">✋ Pegar ${reqPart.shortName}</button>
      ` : ''}
    </div>
  `;

  // Se for Híbrido, renderiza seletor de etapas
  let hybridHeaderHTML = '';
  if (isHybrid) {
    hybridHeaderHTML = `
      <div class="hybrid-stage-switcher">
        <button type="button" class="stage-tab-btn ${currentStage === 1 ? 'active' : ''} ${mg.stage1Done ? 'done' : ''}" id="btn-hybrid-stage-1">
          <span>🔧 Fase 1: Limpeza Física & Hardware</span>
          <span>${mg.stage1Done ? '✅ CONCLUÍDO' : '👉 EM ANDAMENTO'}</span>
        </button>
        <button type="button" class="stage-tab-btn ${currentStage === 2 ? 'active' : ''} ${mg.stage2Done ? 'done' : ''}" id="btn-hybrid-stage-2" ${!mg.stage1Done ? 'disabled' : ''}>
          <span>💻 Fase 2: Software & Desinfecção Lógica</span>
          <span>${mg.stage2Done ? '✅ CONCLUÍDO' : (mg.stage1Done ? '👉 PRONTO P/ INICIAR' : '🔒 Bloqueado')}</span>
        </button>
      </div>
    `;
  }

  // Função auxiliar de conclusão de etapa/minigame
  function checkAndComplete(condition, successToast, onCompleteCallback) {
    if (condition && !c.minigameDone) {
      if (isHybrid) {
        if (currentStage === 1 && !mg.stage1Done) {
          mg.stage1Done = true;
          mg.hybridStage = 2;
          showToast('🎉 FASE 1 (HARDWARE) CONCLUÍDA! Agora inicie a Fase 2 (Software)!');
          if (onCompleteCallback) onCompleteCallback();
          renderWorkbenchModal();
          return true;
        } else if (currentStage === 2 && !mg.stage2Done) {
          mg.stage2Done = true;
          c.minigameDone = true;
          showToast('🏆 CASO HÍBRIDO MESTRE 100% CONCLUÍDO COM PERFEIÇÃO! Entregue o PC!');
          if (onCompleteCallback) onCompleteCallback();
          return true;
        }
      } else {
        c.minigameDone = true;
        showToast(successToast);
        if (onCompleteCallback) onCompleteCallback();
        return true;
      }
    }
    return false;
  }

  let gameBodyHTML = '';

  // Verifica se é um dos 18 Puzzles Cooperativos (6 de 2P, 6 de 3P, 6 de 4P):
  const coopPuz = COOP_PUZZLES_CATALOG.find(p => p.id === activeType);

  if (coopPuz) {
    const reqCount = coopPuz.coopPlayers;
    const allCoopDone = coopPuz.stations.every((_, idx) => mg.coopStations[idx]);
    if (allCoopDone && !c.minigameDone) {
      c.minigameDone = true;
      showToast(`🤝 Puzzle Cooperativo "${coopPuz.title}" (${reqCount} Jogadores) concluído em sincronia!`);
    }

    gameBodyHTML = `
      <div class="minigame-box">
        <div class="minigame-header">
          <h4>🤝 ${coopPuz.title} (${reqCount} Jogadores Ao Mesmo Tempo)</h4>
          <span class="edu-pill">👥 ${getConnectedPlayerCount()} Técnico(s) · Sede Nv.${coopPuz.hqTier} (${coopPuz.hqTier * 5} Salas)</span>
        </div>
        <p style="margin:0 0 8px; font-size:12.5px; color:#d7f5f8;">
          <b>Puzzle Simultâneo de ${reqCount} Estações:</b> Em cada estação abaixo, selecione o <b>parâmetro técnico correto (Passo 1)</b> e clique em <b>Sincronizar Estação (Passo 2)</b>!
        </p>
        <div class="coop-stations-grid">
          ${coopPuz.stations.map((st, idx) => {
            const selectedOpt = mg.coopSelectedOpt[idx];
            const isOptCorrect = selectedOpt === st.correctOpt;
            const done = mg.coopStations[idx];
            return `
              <div class="coop-station-card ${done ? 'station-done' : ''}">
                <div style="font-weight:900; font-size:13.5px; color:var(--amarelo); display:flex; justify-content:space-between;">
                  <span>${st.title}</span>
                  <span>${done ? '🟢 SINCRONIZADO' : (isOptCorrect ? '⚙️ Pronto p/ Sincronizar' : '⏳ Passo 1 Pendente')}</span>
                </div>
                <div style="font-size:12px; color:#e2e8f0;">1. ${st.task}</div>
                <div class="station-sub-controls">
                  ${st.options.map((optLabel, oIdx) => `
                    <button type="button"
                      class="station-opt-btn ${selectedOpt === oIdx && oIdx === st.correctOpt ? 'selected-correct' : ''}"
                      data-coop-opt-station="${idx}"
                      data-coop-opt-idx="${oIdx}"
                      ${done ? 'disabled' : ''}>
                      ${optLabel.replace(' ✓', '')}
                    </button>
                  `).join('')}
                </div>
                <button type="button"
                  class="btn ${done ? 'btn-verde' : (isOptCorrect ? 'btn-amarelo' : 'btn-teal')} btn-sm"
                  data-coop-station="${idx}"
                  ${done || !isOptCorrect ? 'disabled' : ''}>
                  ${done
                    ? `✓ Estação #${idx + 1} Sincronizada`
                    : (isOptCorrect ? `⚡ 2. Sincronizar Estação #${idx + 1} Agora!` : `🔒 Selecione o parâmetro correto acima`)
                  }
                </button>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  // ==========================================================================
  // HARDWARE #1: SOPRADOR DE AR & LIMPEZA DE PÓ PESADO (`dust_blower`)
  // ==========================================================================
  else if (activeType === 'dust_blower') {
    const remainingPuffs = mg.dustSpots.filter(x => x === 1).length;
    checkAndComplete(remainingPuffs === 0, '💨 Todo o pó, teias e sujeira foram aspirados com o soprador!');

    gameBodyHTML = `
      <div class="minigame-box">
        <div class="minigame-header">
          <h4>💨 Mini-Game: Soprador de Ar & Pincel Antiestático</h4>
          <span class="edu-pill">Focos de Poeira Restantes: ${remainingPuffs}/6</span>
        </div>
        <p style="margin:0 0 10px; font-size:13px; color:#d7f5f8;">
          Clique em cada um dos <b>6 focos de poeira e teias de aranha</b> dentro do chassi para acionar o jato de ar comprimido e desobstruir os componentes!
        </p>
        <div class="dust-chassis-board">
          ${mg.dustSpots.map((val, idx) => `
            <div class="dust-puff-spot ${val === 0 ? 'clean' : ''}" data-dust-idx="${idx}">
              <div style="font-size:32px;">${val === 0 ? '✨' : '💨'}</div>
              <div style="font-weight:900; font-size:13px; color:${val === 0 ? '#4ade80' : '#f9c742'};">
                ${val === 0 ? '100% Limpo!' : `Foco de Poeira #${idx + 1}`}
              </div>
              <div style="font-size:11px; color:#cbd5e1;">${val === 0 ? '✓ Sem poeira' : '👉 Clique para Assoprar'}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // ==========================================================================
  // HARDWARE #2: REMOÇÃO DE PASTA TÉRMICA RESSECADA & ESPÁTULA (`thermal_spatula`)
  // ==========================================================================
  else if (activeType === 'thermal_spatula') {
    const allScraped = mg.crustScraped.every(Boolean);
    checkAndComplete(allScraped && mg.newPasteApplied, '🧪 Crosta de pasta ressecada removida e prata aplicada com perfeição!');

    gameBodyHTML = `
      <div class="minigame-box">
        <div class="minigame-header">
          <h4>🧪 Mini-Game: Raspagem de Pasta Ressecada & Aplicação de Prata</h4>
          <span class="edu-pill">Crosta: ${mg.crustScraped.filter(Boolean).length}/3 · Pasta Nova: ${mg.newPasteApplied ? 'OK' : 'Pendente'}</span>
        </div>
        <div class="crust-die-board">
          <div style="font-weight:900; font-size:13.5px; color:var(--amarelo);">
            1. Raspe as 3 Crostas Cristalizadas de Pasta Térmica Antiga com a Espátula:
          </div>
          <div class="crust-cluster">
            ${mg.crustScraped.map((scraped, idx) => `
              <button type="button" class="crust-node ${scraped ? 'scraped' : ''}" data-crust-idx="${idx}" ${scraped ? 'disabled' : ''}>
                <span>${scraped ? '✨ Limpo com Isopropílico' : `🪓 Raspar Crosta #${idx + 1}`}</span>
              </button>
            `).join('')}
          </div>
          <div style="margin-top:12px; width:100%; max-width:400px; text-align:center;">
            <button type="button" class="btn ${mg.newPasteApplied ? 'btn-verde' : (allScraped ? 'btn-amarelo' : 'btn-vidro')}" id="btn-apply-silver-paste" ${!allScraped || mg.newPasteApplied ? 'disabled' : ''} style="width:100%;">
              ${mg.newPasteApplied ? '✅ Gota de Pasta de Prata Aplicada!' : (allScraped ? '💧 2. Aplicar Gota de Pasta Térmica de Prata no Die' : '🔒 Raspe as 3 crostas acima primeiro')}
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // ==========================================================================
  // HARDWARE #3: DESOBSTRUÇÃO & LUBRIFICAÇÃO DE VENTOINHAS (`fan_unjam`)
  // ==========================================================================
  else if (activeType === 'fan_unjam') {
    const allClean = mg.fanHairsRemoved.every(Boolean) && mg.fanOiled.every(Boolean);
    checkAndComplete(allClean, '🌀 Todas as 3 ventoinhas foram destravadas, limpas e lubrificadas!');

    gameBodyHTML = `
      <div class="minigame-box">
        <div class="minigame-header">
          <h4>🌀 Mini-Game: Desobstrução & Lubrificação de Coolers</h4>
          <span class="edu-pill">Ventoinhas Prontas: ${mg.fanHairsRemoved.filter((v, i) => v && mg.fanOiled[i]).length}/3</span>
        </div>
        <div class="fans-grid">
          ${[0, 1, 2].map(idx => {
            const unjammed = mg.fanHairsRemoved[idx];
            const oiled = mg.fanOiled[idx];
            const ready = unjammed && oiled;
            return `
              <div class="fan-card ${ready ? 'spinning' : ''}">
                <div style="font-size:34px;">${ready ? '🌀' : '🛑'}</div>
                <div style="font-weight:900; font-size:13px; color:${ready ? '#4ade80' : '#f9c742'};">
                  Cooler Fan #${idx + 1}
                </div>
                <button type="button" class="btn ${unjammed ? 'btn-verde' : 'btn-amarelo'} btn-xs" data-fan-untangle="${idx}" ${unjammed ? 'disabled' : ''}>
                  ${unjammed ? '✓ Cabelos Removidos' : '✂️ Desenroscar Fios'}
                </button>
                <button type="button" class="btn ${oiled ? 'btn-verde' : (unjammed ? 'btn-amarelo' : 'btn-vidro')} btn-xs" data-fan-oil="${idx}" ${!unjammed || oiled ? 'disabled' : ''}>
                  ${oiled ? '✓ Rolamento Lubrificado' : '💧 Gotinha de Óleo'}
                </button>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  // ==========================================================================
  // HARDWARE #4: EXPURGO DE NINHO DE BARATAS NA FONTE (`cockroach_nest`)
  // ==========================================================================
  else if (activeType === 'cockroach_nest') {
    const roachesDone = mg.roachesCleared.every(Boolean);
    checkAndComplete(roachesDone && mg.eggsDisinfected, '🪳 Ninho de pragas totalmente expurgado e fonte sanitizada!');

    gameBodyHTML = `
      <div class="minigame-box">
        <div class="minigame-header">
          <h4>🪳 Mini-Game: Expurgo de Ninho de Baratas & Pragas na Fonte</h4>
          <span class="edu-pill">Baratas: ${mg.roachesCleared.filter(Boolean).length}/5 · Sanitização: ${mg.eggsDisinfected ? 'OK' : 'Pendente'}</span>
        </div>
        <p style="margin:0 0 10px; font-size:12.5px; color:#d7f5f8;">
          Capture as 5 baratas com o sugador antiestático e em seguida aplique o spray sanitizante para eliminar os casulos!
        </p>
        <div class="roach-grid">
          ${mg.roachesCleared.map((cleared, idx) => `
            <div class="roach-card ${cleared ? 'caught' : ''}" data-roach-idx="${idx}">
              <div style="font-size:28px;">${cleared ? '💨' : '🪳'}</div>
              <div>${cleared ? 'Capturada!' : `Barata #${idx + 1}`}</div>
            </div>
          `).join('')}
        </div>
        <div style="margin-top:12px; text-align:center;">
          <button type="button" class="btn ${mg.eggsDisinfected ? 'btn-verde' : (roachesDone ? 'btn-amarelo' : 'btn-vidro')}" id="btn-disinfect-nest" ${!roachesDone || mg.eggsDisinfected ? 'disabled' : ''}>
            ${mg.eggsDisinfected ? '✅ Ninho e Casulos 100% Sanitizados!' : (roachesDone ? '🧴 2. Aplicar Spray Sanitizante Antiestático' : '🔒 Capture as 5 baratas primeiro')}
          </button>
        </div>
      </div>
    `;
  }

  // ==========================================================================
  // HARDWARE #5: ALINHAMENTO DE PINOS LGA / AM4 (`socket_pins`)
  // ==========================================================================
  else if (activeType === 'socket_pins') {
    const allStraight = mg.bentPins.every(Boolean);
    checkAndComplete(allStraight, '🪡 Todos os pinos do soquete foram alinhados com precisão cirúrgica em 90°!');

    gameBodyHTML = `
      <div class="minigame-box">
        <div class="minigame-header">
          <h4>🪡 Mini-Game: Alinhamento de Pinos do Soquete LGA / AM4</h4>
          <span class="edu-pill">Pinos Desentortados: ${mg.bentPins.filter(Boolean).length}/4</span>
        </div>
        <p style="margin:0 0 10px; font-size:12.5px; color:#d7f5f8;">
          Clique em cada pino torto sob o microscópio com a agulha de precisão para endireitá-lo:
        </p>
        <div class="pins-grid">
          ${mg.bentPins.map((straight, idx) => `
            <button type="button" class="pin-card ${straight ? 'straight' : ''}" data-pin-idx="${idx}" ${straight ? 'disabled' : ''}>
              <div style="font-size:24px;">${straight ? '📍' : '⚠️'}</div>
              <div>${['Pino A1 (45°)', 'Pino B3 (60°)', 'Pino C7 (35°)', 'Pino D4 (50°)'][idx]}</div>
              <div style="font-size:11px;">${straight ? '✓ 90° Reto' : '👉 Desentortar'}</div>
            </button>
          `).join('')}
        </div>
      </div>
    `;
  }

  // ==========================================================================
  // HARDWARE #6: LIMPEZA DE CONTATOS DOURADOS DA MEMÓRIA (`ram_contacts`)
  // ==========================================================================
  else if (activeType === 'ram_contacts') {
    const allClean = mg.oxidationCleaned.every(Boolean);
    checkAndComplete(allClean, '✨ Contatos dourados da memória limpos com borracha e 100% brilhantes!');

    gameBodyHTML = `
      <div class="minigame-box">
        <div class="minigame-header">
          <h4>✨ Mini-Game: Limpeza de Contatos Dourados da Memória com Borracha</h4>
          <span class="edu-pill">Pinos Polidos: ${mg.oxidationCleaned.filter(Boolean).length}/6</span>
        </div>
        <p style="margin:0 0 10px; font-size:12.5px; color:#d7f5f8;">
          Passe a borracha escolar branca sobre os 6 contatos dourados oxidados para remover o azinhavre:
        </p>
        <div class="ram-contacts-strip">
          ${mg.oxidationCleaned.map((clean, idx) => `
            <div class="contact-pin-gold ${clean ? 'shining' : ''}" data-contact-idx="${idx}">
              <span>${clean ? '✨ 100%' : `Pino ${idx + 1}`}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // ==========================================================================
  // HARDWARE #7: TROCA DE BATERIA CR2032 & CLR_CMOS (`cmos_battery`)
  // ==========================================================================
  else if (activeType === 'cmos_battery') {
    const cmosComplete = mg.cmosTested && mg.cmosReplaced && mg.clrCmosJumper;
    checkAndComplete(cmosComplete, '🔋 Bateria CR2032 de 3V instalada e CMOS restaurado com sucesso!');

    gameBodyHTML = `
      <div class="minigame-box">
        <div class="minigame-header">
          <h4>🔋 Mini-Game: Bateria CR2032 3V & Jumper CLR_CMOS</h4>
          <span class="edu-pill">Passos: ${[mg.cmosTested, mg.cmosReplaced, mg.clrCmosJumper].filter(Boolean).length}/3</span>
        </div>
        <div style="display:flex; flex-direction:column; gap:10px; max-width:480px; margin:0 auto;">
          <button type="button" class="btn ${mg.cmosTested ? 'btn-verde' : 'btn-amarelo'}" id="btn-test-cmos-volt" ${mg.cmosTested ? 'disabled' : ''}>
            ${mg.cmosTested ? '✓ 1. Tensão Testada: 0.92V (Esgotada!)' : '⚡ 1. Medir Tensão da Bateria com Multímetro'}
          </button>
          <button type="button" class="btn ${mg.cmosReplaced ? 'btn-verde' : (mg.cmosTested ? 'btn-amarelo' : 'btn-vidro')}" id="btn-replace-cmos-bat" ${!mg.cmosTested || mg.cmosReplaced ? 'disabled' : ''}>
            ${mg.cmosReplaced ? '✓ 2. Nova Bateria CR2032 3.3V Instalada' : '🔋 2. Sacar Bateria Antiga e Encaixar Nova de Lítio 3V'}
          </button>
          <button type="button" class="btn ${mg.clrCmosJumper ? 'btn-verde' : (mg.cmosReplaced ? 'btn-amarelo' : 'btn-vidro')}" id="btn-close-clr-cmos" ${!mg.cmosReplaced || mg.clrCmosJumper ? 'disabled' : ''}>
            ${mg.clrCmosJumper ? '✓ 3. Jumper CLR_CMOS Fechado por 5s (Reset OK)' : '🎛️ 3. Fechar Jumper CLR_CMOS para Resetar NVRAM'}
          </button>
        </div>
      </div>
    `;
  }

  // ==========================================================================
  // HARDWARE #8: VEDAÇÃO DE FITTINGS DE WATER COOLER (`custom_water_leak`)
  // ==========================================================================
  else if (activeType === 'custom_water_leak') {
    const leakFixed = mg.fittingsTightened.every(Boolean) && mg.bubblesPurged;
    checkAndComplete(leakFixed, '💧 Conexões compression fittings vedadas e ar purgado sem vazamento!');

    gameBodyHTML = `
      <div class="minigame-box">
        <div class="minigame-header">
          <h4>💧 Mini-Game: Detecção & Vedação de Conexões de Water Cooler</h4>
          <span class="edu-pill">Fittings: ${mg.fittingsTightened.filter(Boolean).length}/3 · Purga: ${mg.bubblesPurged ? 'OK' : 'Pendente'}</span>
        </div>
        <p style="margin:0 0 10px; font-size:12.5px; color:#d7f5f8;">
          Aperte as 3 conexões com anéis O-Ring que estão vazando e em seguida faça a purga das bolhas de ar:
        </p>
        <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:10px;">
          ${mg.fittingsTightened.map((tight, idx) => `
            <button type="button" class="btn ${tight ? 'btn-verde' : 'btn-coral'}" data-fitting-idx="${idx}" ${tight ? 'disabled' : ''}>
              ${tight ? '✓ Vedado (0.6 bar)' : `🔩 Apertar Fitting #${idx + 1}`}
            </button>
          `).join('')}
        </div>
        <div style="margin-top:12px; text-align:center;">
          <button type="button" class="btn ${mg.bubblesPurged ? 'btn-verde' : (mg.fittingsTightened.every(Boolean) ? 'btn-amarelo' : 'btn-vidro')}" id="btn-purge-water-bubbles" ${!mg.fittingsTightened.every(Boolean) || mg.bubblesPurged ? 'disabled' : ''}>
            ${mg.bubblesPurged ? '✅ Circuito 100% Purgado e Estanque!' : '💨 2. Purgar Bolhas de Ar da Bomba'}
          </button>
        </div>
      </div>
    `;
  }

  // ==========================================================================
  // HARDWARE #9: CPU & DUAL-CHANNEL RAM (`cpu_ram`)
  // ==========================================================================
  else if (activeType === 'cpu_ram') {
    const dualChannelOk = !mg.ramSlots[0] && mg.ramSlots[1] && !mg.ramSlots[2] && mg.ramSlots[3];
    checkAndComplete(mg.cpuCleaned && mg.cpuPasted && dualChannelOk, '⚡ Dual-Channel ativado nos slots 2 e 4!');

    gameBodyHTML = `
      <div class="minigame-box">
        <div class="minigame-header">
          <h4>🧰 Mini-Game: CPU Die & Dual-Channel RAM</h4>
          <span class="edu-pill">Etapa 1: Limpeza & Pasta · Etapa 2: Dual-Channel (A2 + B2)</span>
        </div>
        <div class="mobo-board">
          <div class="cpu-socket-box">
            <div style="font-weight:900; font-size:13px; margin-bottom:6px; color:var(--amarelo);">1. Preparar Die da CPU:</div>
            <div class="cpu-die" id="mg-cpu-die" style="background:${mg.cpuPasted ? 'linear-gradient(135deg, #cbd5dc, #94a3b8)' : (mg.cpuCleaned ? '#e2e8f0' : '#854d0e')};">
              <span style="font-weight:900; font-size:11px; text-align:center; color:#0f2533;">
                ${mg.cpuPasted ? '✓ Pasta Prata OK' : (mg.cpuCleaned ? 'Die Limpo (Aplicar Pasta)' : 'Die Sujo (Limpar)')}
              </span>
            </div>
            <div style="display:flex; gap:6px; justify-content:center; margin-top:8px;">
              <button type="button" class="btn btn-teal btn-xs" id="btn-cpu-clean" ${mg.cpuCleaned ? 'disabled' : ''}>🧽 Limpar</button>
              <button type="button" class="btn btn-amarelo btn-xs" id="btn-cpu-paste" ${!mg.cpuCleaned || mg.cpuPasted ? 'disabled' : ''}>💧 Pasta</button>
            </div>
          </div>
          <div class="ram-slots-box">
            <div style="font-weight:900; font-size:13px; color:#93c5fd;">2. Ativar Dual-Channel (Slots 2 e 4):</div>
            ${['Slot 1 (A1)', 'Slot 2 (A2) ⭐', 'Slot 3 (B1)', 'Slot 4 (B2) ⭐'].map((label, idx) => `
              <div class="ram-slot ${mg.ramSlots[idx] ? 'installed' : ''}" data-ram="${idx}">
                <span>${label}</span>
                <span>${mg.ramSlots[idx] ? '✓ Pente 16GB' : 'Vazio'}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  // ==========================================================================
  // HARDWARE #10: CRIMPAGEM RJ45 T-568B (`rj45`)
  // ==========================================================================
  else if (activeType === 'rj45') {
    const isCorrect = mg.rj45Order.length === 8 &&
      mg.rj45Order.every((w, i) => w.id === mg.t568bTarget[i].id);
    checkAndComplete(isCorrect, '🌐 Cabo Cat6 crimpado com 100% de sucesso!');
    const nextPinIdx = mg.rj45Order.length;
    const nextExpected = mg.t568bTarget[nextPinIdx];

    gameBodyHTML = `
      <div class="minigame-box">
        <div class="minigame-header">
          <h4>🔌 Mini-Game: Sequência de Cores RJ45 T-568B</h4>
          <span class="edu-pill">Pinos: ${mg.rj45Order.length}/8</span>
        </div>
        <div class="rj45-slots">
          ${Array.from({ length: 8 }).map((_, idx) => {
            const wire = mg.rj45Order[idx];
            return `
              <div class="rj45-pin" style="background:${wire ? wire.color : 'rgba(255,255,255,0.06)'}; border-color:${idx === nextPinIdx ? '#f9c742' : 'rgba(255,255,255,0.3)'};">
                <span style="background:rgba(15,37,51,0.85); color:#fff; padding:1px 5px; border-radius:4px;">P${idx + 1}</span>
                <span style="font-size:10px; background:rgba(255,255,255,0.92); color:#0f2533; padding:1px 3px; border-radius:4px;">
                  ${wire ? wire.name.replace('Branco-', 'B/') : 'Vazio'}
                </span>
              </div>
            `;
          }).join('')}
        </div>
        <div class="wire-pool">
          ${mg.t568bTarget.map((w, idx) => {
            const used = mg.rj45Order.some(x => x.id === w.id);
            const isNext = nextExpected && nextExpected.id === w.id;
            return `
              <button type="button" class="wire-btn" data-wire="${w.id}" ${used ? 'disabled' : ''} style="${isNext ? 'border-color:#f9c742;' : ''}">
                <span class="wire-swatch" style="background:${w.color}"></span>
                ${idx + 1}. ${w.name}
              </button>
            `;
          }).join('')}
        </div>
        <div style="display:flex; gap:8px; margin-top:10px;">
          <button type="button" class="btn btn-coral btn-sm" id="btn-reset-rj45">🔄 Reiniciar</button>
          <button type="button" class="btn btn-teal btn-sm" id="btn-auto-hint-rj45">✨ Encaixar Próximo Fio (${nextPinIdx}/8)</button>
        </div>
      </div>
    `;
  }

  // ==========================================================================
  // HARDWARE #11: FONTE MODULAR ATX (`psu_wires`)
  // ==========================================================================
  else if (activeType === 'psu_wires') {
    checkAndComplete(Object.values(mg.psuConnected).every(Boolean), '⚡ Cabos da Fonte Modular 1000W conectados!');
    const sources = [
      { id: 'atx24', label: '🔌 Cabo 24-Pinos ATX Principal' },
      { id: 'eps8',  label: '⚡ Cabo 8-Pinos EPS 12V (CPU)' },
      { id: 'pcie8', label: '🎮 Cabo 8-Pinos PCIe (GPU)' },
      { id: 'sata',  label: '💽 Cabo SATA Power (SSD)' }
    ];
    const targets = [
      { id: 'eps8',  label: '🧠 Conector CPU_PWR1 (Processador)' },
      { id: 'sata',  label: '💽 Entrada Alimentação SSD SATA' },
      { id: 'atx24', label: '🟩 Barramento Placa-Mãe 24-Pinos' },
      { id: 'pcie8', label: '🎮 Conector Placa de Vídeo RTX' }
    ];
    gameBodyHTML = `
      <div class="minigame-box">
        <div class="minigame-header">
          <h4>⚡ Mini-Game: Conectar Fios da Fonte Modular ATX</h4>
          <span class="edu-pill">Conecte os 4 pares de barramento</span>
        </div>
        <div class="wire-connect-grid">
          <div class="connector-col">
            ${sources.map(s => `
              <button type="button" class="connector-node ${mg.psuConnected[s.id] ? 'connected' : (mg.selectedPsuCable === s.id ? 'selected' : '')}" data-psu-src="${s.id}" ${mg.psuConnected[s.id] ? 'disabled' : ''}>
                <span>${s.label}</span><span>${mg.psuConnected[s.id] ? '✓' : 'Pegar'}</span>
              </button>
            `).join('')}
          </div>
          <div class="connector-col">
            ${targets.map(t => `
              <button type="button" class="connector-node ${mg.psuConnected[t.id] ? 'connected' : (mg.selectedPsuTarget === t.id ? 'selected' : '')}" data-psu-dst="${t.id}" ${mg.psuConnected[t.id] ? 'disabled' : ''}>
                <span>${t.label}</span><span>${mg.psuConnected[t.id] ? '🟢' : 'Plugar'}</span>
              </button>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  // ==========================================================================
  // HARDWARE #12: 9 STANDOFFS DA PLACA-MÃE (`mobo_build`)
  // ==========================================================================
  else if (activeType === 'mobo_build') {
    const all9Standoffs = mg.standoffs9.every(Boolean);
    checkAndComplete(all9Standoffs && mg.moboMounted && mg.cpuLocked, '🟩 Placa Z790 montada nos 9 espaçadores com Core i9 instalado!');
    const countStandoffs = mg.standoffs9.filter(Boolean).length;

    gameBodyHTML = `
      <div class="minigame-box">
        <div class="minigame-header">
          <h4>🟩 Mini-Game: Tabuleiro de Montagem da Placa-Mãe ATX</h4>
          <span class="edu-pill">Espaçadores: ${countStandoffs}/9 · Placa: ${mg.moboMounted ? 'OK' : 'Pendente'}</span>
        </div>
        <div class="mobo-board">
          <div class="cpu-socket-box">
            <div style="font-weight:900; font-size:13px; margin-bottom:6px; color:var(--amarelo);">
              1. Clique nos 9 Furos do Gabinete p/ Rosquear os Standoffs:
            </div>
            <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:8px;">
              ${mg.standoffs9.map((inst, idx) => `
                <button type="button" class="solder-pad ${inst ? 'fixed-smd' : ''}" data-standoff="${idx}">
                  <span>Furo #${idx + 1}</span>
                  <span>${inst ? '🔩 Latão OK' : '⚪ Rosquear'}</span>
                </button>
              `).join('')}
            </div>
          </div>
          <div class="ram-slots-box">
            <div style="font-weight:900; font-size:13px; color:#93c5fd;">2. Assentar Placa-Mãe Z790 e CPU Core i9:</div>
            <button type="button" class="connector-node ${mg.moboMounted ? 'connected' : (all9Standoffs ? 'selected' : '')}" id="btn-mount-mobo" ${!all9Standoffs || mg.moboMounted ? 'disabled' : ''}>
              <span>🟩 Assentar Placa-Mãe Z790 nos 9 Standoffs</span>
              <span>${mg.moboMounted ? '✓ Parafusada' : (all9Standoffs ? '👉 Clicar' : 'Rosqueie os 9 furos')}</span>
            </button>
            <button type="button" class="connector-node ${mg.cpuLocked ? 'connected' : (mg.moboMounted ? 'selected' : '')}" id="btn-lock-cpu" ${!mg.moboMounted || mg.cpuLocked ? 'disabled' : ''}>
              <span>🧠 Encaixar Core i9 no Soquete LGA1700 + Cooler</span>
              <span>${mg.cpuLocked ? '✓ Instalado' : 'Clicar'}</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // ==========================================================================
  // HARDWARE #13: CALIBRADOR 12VHPWR 600W (`gpu_12vhpwr`)
  // ==========================================================================
  else if (activeType === 'gpu_12vhpwr') {
    const isCalibrated = mg.gapMm === 0 && mg.voltageTen === 120 && mg.fanPct === 80;
    checkAndComplete(isCalibrated, '🔥 Conector 12VHPWR 600W perfeitamente calibrado sem risco de derreter!');

    gameBodyHTML = `
      <div class="minigame-box">
        <div class="minigame-header">
          <h4>🔥 Mini-Game: Calibrador Analógico 12VHPWR 600W</h4>
          <span class="edu-pill">Folga: 0mm · Tensão: 12.0V · Fan: 80%</span>
        </div>
        <div class="slider-calib-box">
          <div class="slider-row">
            <div style="display:flex; justify-content:space-between; font-weight:900; font-size:13px;">
              <span>1. Folga Física do Plugue 16-Pinos (Meta: <b>0 mm</b>):</span>
              <span style="color:${mg.gapMm === 0 ? '#4ade80' : '#f87171'};">${mg.gapMm} mm ${mg.gapMm === 0 ? '✓ Travado!' : '⚠️ Frouxo!'}</span>
            </div>
            <input type="range" min="0" max="5" step="1" value="${mg.gapMm}" id="slider-gap" />
          </div>
          <div class="slider-row">
            <div style="display:flex; justify-content:space-between; font-weight:900; font-size:13px;">
              <span>2. Tensão da Linha PCIe 5.0 (Meta: <b>12.0 V</b>):</span>
              <span style="color:${mg.voltageTen === 120 ? '#4ade80' : '#f9c742'};">${(mg.voltageTen / 10).toFixed(1)} V ${mg.voltageTen === 120 ? '✓ Estável!' : ''}</span>
            </div>
            <input type="range" min="110" max="126" step="2" value="${mg.voltageTen}" id="slider-volt" />
          </div>
          <div class="slider-row">
            <div style="display:flex; justify-content:space-between; font-weight:900; font-size:13px;">
              <span>3. Curva da Ventoinha da GPU (Meta: <b>80%</b>):</span>
              <span style="color:${mg.fanPct === 80 ? '#4ade80' : '#93c5fd'};">${mg.fanPct}% ${mg.fanPct === 80 ? '✓ Otimizado!' : ''}</span>
            </div>
            <input type="range" min="30" max="100" step="10" value="${mg.fanPct}" id="slider-fan" />
          </div>
        </div>
      </div>
    `;
  }

  // ==========================================================================
  // HARDWARE #14: MATRIZ DE SOLDA VRM (`vrm_soldering`)
  // ==========================================================================
  else if (activeType === 'vrm_soldering') {
    const allBadFixed = mg.smdPads.filter(p => p.bad).every(p => p.fixed);
    checkAndComplete(allBadFixed, '🛠️ 4 MOSFETs em curto substituídos e VRM recuperado!');
    const countFixed = mg.smdPads.filter(p => p.bad && p.fixed).length;

    gameBodyHTML = `
      <div class="minigame-box">
        <div class="minigame-header">
          <h4>🛠️ Mini-Game: Dessolda de MOSFETs em Curto no VRM</h4>
          <span class="edu-pill">Fases Reparadas: ${countFixed}/4</span>
        </div>
        <p style="margin:0 0 10px; font-size:12.5px; color:#d7f5f8;">
          Clique nos <b>4 MOSFETs em vermelho (em curto)</b> com o ferro a 380°C para substituí-los:
        </p>
        <div class="smd-matrix">
          ${mg.smdPads.map(pad => `
            <button type="button" class="solder-pad ${pad.bad ? (pad.fixed ? 'fixed-smd' : 'bad-smd') : ''}" data-smd="${pad.id}" ${pad.fixed || !pad.bad ? 'disabled' : ''}>
              <span>${pad.label}</span>
              <span>${pad.fixed ? '✓ Soldado' : (pad.bad ? '🔥 Curto' : 'OK')}</span>
            </button>
          `).join('')}
        </div>
      </div>
    `;
  }

  // ==========================================================================
  // HARDWARE #15: DELID & METAL LÍQUIDO (`delid_liquid_metal`)
  // ==========================================================================
  else if (activeType === 'delid_liquid_metal') {
    const delidDone = mg.ihsRemoved && mg.kaptonApplied && mg.liquidMetalSpread;
    checkAndComplete(delidDone, '⚡ Delid extremo e metal líquido aplicados com sucesso (-28°C de temperatura)!');

    gameBodyHTML = `
      <div class="minigame-box">
        <div class="minigame-header">
          <h4>⚡ Mini-Game: Delid Extremo & Aplicação de Metal Líquido</h4>
          <span class="edu-pill">Etapas: ${[mg.ihsRemoved, mg.kaptonApplied, mg.liquidMetalSpread].filter(Boolean).length}/3</span>
        </div>
        <div style="display:flex; flex-direction:column; gap:10px; max-width:480px; margin:0 auto;">
          <button type="button" class="btn ${mg.ihsRemoved ? 'btn-verde' : 'btn-amarelo'}" id="btn-delid-ihs" ${mg.ihsRemoved ? 'disabled' : ''}>
            ${mg.ihsRemoved ? '✓ 1. Tampa de Cobre (IHS) Removida com Guilhotina' : '🔪 1. Cortar Cola com Ferramenta Guilhotina Delid'}
          </button>
          <button type="button" class="btn ${mg.kaptonApplied ? 'btn-verde' : (mg.ihsRemoved ? 'btn-amarelo' : 'btn-vidro')}" id="btn-apply-kapton" ${!mg.ihsRemoved || mg.kaptonApplied ? 'disabled' : ''}>
            ${mg.kaptonApplied ? '✓ 2. Capacitores SMD Isolados com Fita Kapton' : '🛡️ 2. Isolar Capacitores com Fita Kapton Dielétrica'}
          </button>
          <button type="button" class="btn ${mg.liquidMetalSpread ? 'btn-verde' : (mg.kaptonApplied ? 'btn-amarelo' : 'btn-vidro')}" id="btn-spread-liquid-metal" ${!mg.kaptonApplied || mg.liquidMetalSpread ? 'disabled' : ''}>
            ${mg.liquidMetalSpread ? '✓ 3. Filme de Metal Líquido Galinstan Espalhado' : '🧪 3. Aplicar Gota de Metal Líquido no Silício'}
          </button>
        </div>
      </div>
    `;
  }

  // ==========================================================================
  // SOFTWARE #16: CAÇA A CAVALOS DE TROIA (`trojan_hunter`)
  // ==========================================================================
  else if (activeType === 'trojan_hunter') {
    const badTrojans = mg.trojans.filter(t => t.bad);
    const allBadQuarantined = badTrojans.every(t => t.quarantined);
    checkAndComplete(allBadQuarantined, '🛡️ Todos os cavalos de troia e backdoors foram neutralizados na Quarentena!');

    gameBodyHTML = `
      <div class="minigame-box">
        <div class="minigame-header">
          <h4>🛡️ Mini-Game: Caça a Cavalos de Troia & Backdoors</h4>
          <span class="edu-pill">Trojans em Quarentena: ${badTrojans.filter(t => t.quarantined).length}/${badTrojans.length}</span>
        </div>
        <p style="margin:0 0 10px; font-size:12.5px; color:#d7f5f8;">
          Isole apenas os <b>processos maliciosos falsificados</b>. Cuidado para não enviar arquivos genuínos do sistema para a quarentena!
        </p>
        <div class="trojan-grid">
          ${mg.trojans.map(t => `
            <div class="trojan-item ${t.quarantined ? 'quarantined' : ''}">
              <div>
                <b style="color:${t.bad ? '#fca5a5' : '#86efac'};">${t.name}</b>
                <div style="font-size:11px; color:#cbd5e1;">${t.bad ? '⚠️ Assinatura digital inválida / Injeção DLL' : '✓ Assinado digitalmente pela Microsoft'}</div>
              </div>
              <button type="button" class="btn ${t.quarantined ? 'btn-verde' : (t.bad ? 'btn-coral' : 'btn-vidro')} btn-sm" data-trojan-id="${t.id}" ${t.quarantined ? 'disabled' : ''}>
                ${t.quarantined ? '✓ Na Quarentena' : '🔒 Quarentena'}
              </button>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // ==========================================================================
  // SOFTWARE #17: LIMPADOR DE COOKIES & RASTREADORES (`cookie_cleaner`)
  // ==========================================================================
  else if (activeType === 'cookie_cleaner') {
    const cats = Object.values(mg.cookieCategories);
    const allCatsDone = cats.every(Boolean);
    checkAndComplete(allCatsDone, '🍪 4.200 cookies espiões, supercookies e telemetria triturados!');

    const catLabels = [
      { key: 'supercookies', label: 'Supercookies LSO e Armazenamento Flash (820 itens)', icon: '🍪' },
      { key: 'telemetry', label: 'Telemetria do Sistema e Perfil Publicitário (1.400 itens)', icon: '📡' },
      { key: 'shadow_history', label: 'Histórico Oculto de Navegação e Índices SQLite (1.200 itens)', icon: '🕵️' },
      { key: 'ad_beacons', label: 'Beacons e Pixels de Rastreamento em Background (780 itens)', icon: '📍' }
    ];

    gameBodyHTML = `
      <div class="minigame-box">
        <div class="minigame-header">
          <h4>🍪 Mini-Game: Triturador de 4.000 Cookies e Rastreadores</h4>
          <span class="edu-pill">Categorias Trituradas: ${cats.filter(Boolean).length}/4</span>
        </div>
        <div style="display:flex; flex-direction:column; gap:8px;">
          ${catLabels.map(item => {
            const done = mg.cookieCategories[item.key];
            return `
              <div style="display:flex; justify-content:space-between; align-items:center; background:#1e293b; padding:10px 14px; border-radius:10px; border:2px solid ${done ? '#22c55e' : '#334155'};">
                <div>
                  <span style="font-size:18px; margin-right:6px;">${item.icon}</span>
                  <span style="font-weight:800; font-size:12.5px; color:${done ? '#86efac' : '#f1f5f9'};">${item.label}</span>
                </div>
                <button type="button" class="btn ${done ? 'btn-verde' : 'btn-amarelo'} btn-sm" data-shred-cat="${item.key}" ${done ? 'disabled' : ''}>
                  ${done ? '✓ Triturado' : '✂️ Triturar'}
                </button>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  // ==========================================================================
  // SOFTWARE #18: CHUVA DE 5 POP-UPS DO BAIDU (`popups_closer`)
  // ==========================================================================
  else if (activeType === 'popups_closer') {
    const allPopupsClosed = mg.popups.every(p => p.closed);
    checkAndComplete(allPopupsClosed, '🛑 Todas as 5 janelas pop-up foram fechadas com sucesso!');

    gameBodyHTML = `
      <div class="minigame-box">
        <div class="minigame-header">
          <h4>🛑 Mini-Game: Chuva de Pop-ups Piratas do Baidu</h4>
          <span class="edu-pill">Janelas Fechadas: ${mg.popups.filter(p => p.closed).length}/5</span>
        </div>
        <p style="margin:0 0 10px; font-size:12.5px; color:#d7f5f8;">
          Cuidado com os botões falsos! Clique no verdadeiro <b>[X] Vermelho</b> no topo de cada janela:
        </p>
        <div class="popup-stack">
          ${mg.popups.map(p => `
            <div class="popup-window-box ${p.closed ? 'closed' : ''}">
              <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #475569; padding-bottom:6px;">
                <b style="font-size:12px; color:#fde047;">${p.title}</b>
                <button type="button" class="btn btn-coral btn-xs" data-real-close="${p.id}" ${p.closed ? 'disabled' : ''}>✕</button>
              </div>
              <div style="font-size:11.5px; color:#cbd5e1; padding:6px 0;">
                ${p.closed ? '✓ Janela encerrada' : '⚠️ Clique no X de verdade no topo para fechar sem pegar mais vírus!'}
              </div>
              ${!p.closed ? `
                <div style="display:flex; gap:6px;">
                  <button type="button" class="btn btn-amarelo btn-xs" data-fake-x="${p.id}">👉 [X] Fechar (Falso)</button>
                  <button type="button" class="btn btn-teal btn-xs" data-fake-x="${p.id}">🎁 Baixar Prêmio</button>
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // ==========================================================================
  // SOFTWARE #19: DESFRAGMENTADOR DE DISCO RETRÔ (`disk_defrag`)
  // ==========================================================================
  else if (activeType === 'disk_defrag') {
    const allClean = mg.defragBlocks.every(x => x === 0);
    checkAndComplete(allClean, '💽 Todos os 12 clusters do disco desfragmentados e 100% contíguos!');
    const fragCount = mg.defragBlocks.filter(x => x === 1).length;

    gameBodyHTML = `
      <div class="minigame-box">
        <div class="minigame-header">
          <h4>💽 Mini-Game: Desfragmentador de Disco Retrô Anos 90</h4>
          <span class="edu-pill">Blocos Fragmentados: ${fragCount}/12</span>
        </div>
        <p style="margin:0 0 10px; font-size:12.5px; color:#d7f5f8;">
          Clique nos <b>blocos vermelhos fragmentados</b> para consolidá-los em blocos contíguos azuis otimizados:
        </p>
        <div class="defrag-grid">
          ${mg.defragBlocks.map((val, idx) => `
            <button type="button" class="defrag-block ${val === 1 ? 'frag' : 'clean'}" data-defrag-idx="${idx}" ${val === 0 ? 'disabled' : ''}>
              ${val === 1 ? 'FRAG' : '✓ OK'}
            </button>
          `).join('')}
        </div>
      </div>
    `;
  }

  // ==========================================================================
  // SOFTWARE #20: ANÁLISE FORENSE DE TELA AZUL BSOD (`bsod_analyzer`)
  // ==========================================================================
  else if (activeType === 'bsod_analyzer') {
    const allIsolated = mg.bsodLogs.every(b => b.isolated);
    checkAndComplete(allIsolated, '📋 Dump da Tela Azul analisado e drivers de vídeo corrompidos isolados!');

    gameBodyHTML = `
      <div class="minigame-box">
        <div class="minigame-header">
          <h4>📋 Mini-Game: Análise Forense de Tela Azul (BSOD Dump)</h4>
          <span class="edu-pill">Dumps Resolvidos: ${mg.bsodLogs.filter(b => b.isolated).length}/2</span>
        </div>
        <div class="bsod-card">
          <div style="font-weight:900; margin-bottom:8px;">*** STOP: 0x0000001A (MEMORY_MANAGEMENT)</div>
          <div>Inspecione os registros de dump de memória e reverta os drivers problemáticos:</div>
          <div style="margin-top:10px; display:flex; flex-direction:column; gap:8px;">
            ${mg.bsodLogs.map(b => `
              <div style="display:flex; justify-content:space-between; align-items:center; background:#000066; padding:8px 12px; border-radius:6px; border:1px solid #60a5fa;">
                <div>
                  <div style="font-weight:700;">${b.name}</div>
                  <div style="font-size:11px; color:#93c5fd;">Módulo culpado: ${b.driver}</div>
                </div>
                <button type="button" class="btn ${b.isolated ? 'btn-verde' : 'btn-amarelo'} btn-xs" data-isolate-bsod="${b.id}" ${b.isolated ? 'disabled' : ''}>
                  ${b.isolated ? '✓ Revertido p/ WHQL' : '🔄 Isolar & Reverter Driver'}
                </button>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  // ==========================================================================
  // SOFTWARE #21: REPARO DE DLLS NO SYSTEM32 (`dll_fixer`)
  // ==========================================================================
  else if (activeType === 'dll_fixer') {
    const allFixed = mg.missingDlls.every(d => d.fixed);
    checkAndComplete(allFixed, '🧩 Todas as 3 DLLs do System32 registradas com regsvr32!');

    gameBodyHTML = `
      <div class="minigame-box">
        <div class="minigame-header">
          <h4>🧩 Mini-Game: Reparo de DLLs Ausentes no System32</h4>
          <span class="edu-pill">DLLs Registradas: ${mg.missingDlls.filter(d => d.fixed).length}/3</span>
        </div>
        <div style="display:flex; flex-direction:column; gap:8px;">
          ${mg.missingDlls.map((d, idx) => `
            <div style="display:flex; justify-content:space-between; align-items:center; background:#1e293b; padding:10px 14px; border-radius:10px; border:2px solid ${d.fixed ? '#22c55e' : '#334155'};">
              <div>
                <b style="color:${d.fixed ? '#86efac' : '#f9c742'};">${d.name}</b>
                <div style="font-size:11px; color:#cbd5e1;">${d.fixed ? '✓ Registrada no Registro do Windows com sucesso' : '⚠️ Erro 0xc000007b / Ausente na pasta System32'}</div>
              </div>
              <button type="button" class="btn ${d.fixed ? 'btn-verde' : 'btn-amarelo'} btn-sm" data-fix-dll="${idx}" ${d.fixed ? 'disabled' : ''}>
                ${d.fixed ? '✓ Registrada' : '📥 Injetar & regsvr32'}
              </button>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // ==========================================================================
  // SOFTWARE #22: ATUALIZAÇÃO CRÍTICA DE BIOS (`bios_flashing`)
  // ==========================================================================
  else if (activeType === 'bios_flashing') {
    checkAndComplete(mg.biosProgress >= 100, '💾 Gravação de BIOS concluída com 100% de sucesso sem queda de tensão!');

    gameBodyHTML = `
      <div class="minigame-box">
        <div class="minigame-header">
          <h4>💾 Mini-Game: Atualização Crítica de BIOS sob Oscilação Elétrica</h4>
          <span class="edu-pill">Progresso: ${mg.biosProgress}% · Tensão SPI: ${mg.voltageDial.toFixed(1)}V</span>
        </div>
        <p style="margin:0 0 10px; font-size:12.5px; color:#d7f5f8;">
          Estabilize a barra de energia e grave os 4 blocos da EEPROM Flash sem permitir que a tensão caia:
        </p>
        <div style="background:#0f172a; padding:16px; border-radius:12px; border:2px solid #38bdf8;">
          <div style="background:#1e293b; height:24px; border-radius:12px; overflow:hidden; border:2px solid #475569; margin-bottom:12px;">
            <div style="background:linear-gradient(90deg, #38bdf8, #22c55e); height:100%; width:${mg.biosProgress}%; transition:width 0.2s;"></div>
          </div>
          <div style="text-align:center;">
            <button type="button" class="btn btn-amarelo" id="btn-flash-bios-step" ${mg.biosProgress >= 100 ? 'disabled' : ''}>
              ${mg.biosProgress >= 100 ? '✅ Gravação EEPROM Concluída 100%!' : `⚡ Estabilizar Tensão & Gravar Bloco SPI (+${mg.biosProgress}%)`}
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // ==========================================================================
  // SOFTWARE #23: GERENCIADOR DE TAREFAS 100% CPU (`malware_task` / `malware`)
  // ==========================================================================
  else if (activeType === 'malware_task' || activeType === 'malware') {
    const allMalwareKilled = mg.processes.filter(p => p.malicious).every(p => p.killed);
    checkAndComplete(allMalwareKilled, '🛡️ Processos maliciosos encerrados e uso de CPU reduzido!');

    gameBodyHTML = `
      <div class="minigame-box">
        <div class="minigame-header">
          <h4>🛡️ Mini-Game: Gerenciador de Tarefas (Caça a Minerador 100% CPU)</h4>
          <span class="edu-pill">Finalize os 2 processos maliciosos em vermelho</span>
        </div>
        <table class="taskmgr-table">
          <thead><tr><th>Processo</th><th>CPU</th><th>Descrição</th><th>Ação</th></tr></thead>
          <tbody>
            ${mg.processes.map(p => `
              <tr class="proc-row ${p.killed ? 'killed' : ''}">
                <td class="mono" style="font-weight:700; color:${p.malicious ? '#fca5a5' : '#e2e8f0'};">${p.name}</td>
                <td class="mono">${p.killed ? '0%' : p.cpu}</td>
                <td>${p.desc}</td>
                <td>
                  <button type="button" class="btn ${p.malicious ? 'btn-coral' : 'btn-vidro'} btn-sm btn-kill-proc" data-proc="${p.id}" ${p.killed ? 'disabled' : ''}>
                    ${p.killed ? '✓ Encerrado' : 'Finalizar'}
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  // ==========================================================================
  // SOFTWARE #24: REPARO DE BOOT DO WINDOWS (`boot_loop_fix`)
  // ==========================================================================
  else if (activeType === 'boot_loop_fix') {
    const allCmdsDone = mg.bcdSteps.every(s => s.done);
    checkAndComplete(allCmdsDone, '💻 Cadeia de boot reconstruída no prompt do sistema com sucesso!');

    gameBodyHTML = `
      <div class="minigame-box">
        <div class="minigame-header">
          <h4>💻 Mini-Game: Terminal de Recuperação do Windows (Reparo de Boot BCD)</h4>
          <span class="edu-pill">Comandos Executados: ${mg.bcdSteps.filter(s => s.done).length}/3</span>
        </div>
        <div class="cmd-console-box">
          <div style="color:#94a3b8; margin-bottom:8px;">Microsoft Windows [Versão 10.0.22631.3000] - Ambiente de Recuperação CMD</div>
          ${mg.bcdSteps.map((s, idx) => `
            <div style="display:flex; justify-content:space-between; align-items:center; margin:8px 0;">
              <div>X:\Windows\System32&gt; <b>${s.cmd}</b> ${s.done ? '➔ [Operação concluída com êxito]' : ''}</div>
              <button type="button" class="btn ${s.done ? 'btn-verde' : 'btn-amarelo'} btn-xs" data-cmd-step="${idx}" ${s.done ? 'disabled' : ''}>
                ${s.done ? '✓ Executado' : '▶ Executar'}
              </button>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // ==========================================================================
  // SOFTWARE #25: LIMPEZA PROFUNDA DDU (`ddu_driver_sweep`)
  // ==========================================================================
  else if (activeType === 'ddu_driver_sweep') {
    const dduComplete = mg.dduSafeMode && mg.dduDriverRemoved && mg.dduRegistryCleaned;
    checkAndComplete(dduComplete, '🧹 Limpeza profunda DDU concluída e drivers corrompidos expurgados!');

    gameBodyHTML = `
      <div class="minigame-box">
        <div class="minigame-header">
          <h4>🧹 Mini-Game: Limpeza DDU em Modo de Segurança</h4>
          <span class="edu-pill">Etapas: ${[mg.dduSafeMode, mg.dduDriverRemoved, mg.dduRegistryCleaned].filter(Boolean).length}/3</span>
        </div>
        <div style="display:flex; flex-direction:column; gap:10px; max-width:480px; margin:0 auto;">
          <button type="button" class="btn ${mg.dduSafeMode ? 'btn-verde' : 'btn-amarelo'}" id="btn-ddu-safemode" ${mg.dduSafeMode ? 'disabled' : ''}>
            ${mg.dduSafeMode ? '✓ 1. Inicializado em Modo de Segurança' : '🛡️ 1. Reiniciar em Modo de Segurança sem Rede'}
          </button>
          <button type="button" class="btn ${mg.dduDriverRemoved ? 'btn-verde' : (mg.dduSafeMode ? 'btn-amarelo' : 'btn-vidro')}" id="btn-ddu-sweep-files" ${!mg.dduSafeMode || mg.dduDriverRemoved ? 'disabled' : ''}>
            ${mg.dduDriverRemoved ? '✓ 2. Arquivos de Driver Antigo Removidos' : '🗑️ 2. Executar Limpeza e Desinstalação da GPU'}
          </button>
          <button type="button" class="btn ${mg.dduRegistryCleaned ? 'btn-verde' : (mg.dduDriverRemoved ? 'btn-amarelo' : 'btn-vidro')}" id="btn-ddu-purge-reg" ${!mg.dduDriverRemoved || mg.dduRegistryCleaned ? 'disabled' : ''}>
            ${mg.dduRegistryCleaned ? '✓ 3. Registro do Windows Purgado e Reiniciado' : '🧽 3. Purgar Chaves Órfãs do Registro'}
          </button>
        </div>
      </div>
    `;
  }

  // ==========================================================================
  // SOFTWARE #26: DESINSTALADOR DE BLOATWARE (`bloatware_remover`)
  // ==========================================================================
  else if (activeType === 'bloatware_remover') {
    const allUninstalled = mg.bloatwareList.every(b => b.uninstalled);
    checkAndComplete(allUninstalled, '🗑️ Todos os bloatwares inúteis de fábrica foram desinstalados com sucesso!');

    gameBodyHTML = `
      <div class="minigame-box">
        <div class="minigame-header">
          <h4>🗑️ Mini-Game: Desinstalador em Massa de Bloatware de Fábrica</h4>
          <span class="edu-pill">Desinstalados: ${mg.bloatwareList.filter(b => b.uninstalled).length}/4</span>
        </div>
        <div style="display:flex; flex-direction:column; gap:8px;">
          ${mg.bloatwareList.map((b, idx) => `
            <div style="display:flex; justify-content:space-between; align-items:center; background:#1e293b; padding:10px 14px; border-radius:10px; border:2px solid ${b.uninstalled ? '#22c55e' : '#334155'};">
              <div>
                <b style="color:${b.uninstalled ? '#86efac' : '#fca5a5'};">${b.name}</b>
                <div style="font-size:11px; color:#cbd5e1;">${b.uninstalled ? '✓ Desinstalado sem sobras no registro' : '⚠️ Bloatware em segundo plano pesando na inicialização'}</div>
              </div>
              <button type="button" class="btn ${b.uninstalled ? 'btn-verde' : 'btn-coral'} btn-sm" data-uninstall-bloat="${idx}" ${b.uninstalled ? 'disabled' : ''}>
                ${b.uninstalled ? '✓ Removido' : '🗑️ Desinstalar'}
              </button>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // ==========================================================================
  // SOFTWARE #27: DECIFRADOR DE RANSOMWARE (`ransomware_decrypt`)
  // ==========================================================================
  else if (activeType === 'ransomware_decrypt') {
    const allSolved = mg.rsaHexBlocks.every(b => b.solved);
    checkAndComplete(allSolved, '🔓 Chave RSA decifrada e arquivos .locked restaurados com perfeição!');

    gameBodyHTML = `
      <div class="minigame-box">
        <div class="minigame-header">
          <h4>🔓 Mini-Game: Quebra de Criptografia do Ransomware .locked</h4>
          <span class="edu-pill">Blocos Decifrados: ${mg.rsaHexBlocks.filter(b => b.solved).length}/4</span>
        </div>
        <p style="margin:0 0 10px; font-size:12.5px; color:#d7f5f8;">
          Clique nos 4 blocos hexadecimais da chave criptográfica para calcular o inverso modular RSA e decifrar os arquivos:
        </p>
        <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:10px;">
          ${mg.rsaHexBlocks.map((b, idx) => `
            <button type="button" class="btn ${b.solved ? 'btn-verde' : 'btn-coral'}" data-rsa-idx="${idx}" ${b.solved ? 'disabled' : ''} style="height:60px; font-family:monospace; font-size:15px; font-weight:900;">
              ${b.solved ? `✓ ${b.code}` : `🔐 ${b.code}`}
            </button>
          `).join('')}
        </div>
      </div>
    `;
  }

  // ==========================================================================
  // SOFTWARE #28: REGRAS DO FIREWALL (`firewall_rules`)
  // ==========================================================================
  else if (activeType === 'firewall_rules') {
    const p4444 = mg.firewallPorts.find(p => p.port === 4444);
    const p1337 = mg.firewallPorts.find(p => p.port === 1337);
    const p443 = mg.firewallPorts.find(p => p.port === 443);
    const portsCorrect = p4444.blocked && p1337.blocked && !p443.blocked;
    checkAndComplete(portsCorrect, '🧱 Portas vulneráveis 4444 e 1337 bloqueadas com sucesso no Firewall!');

    gameBodyHTML = `
      <div class="minigame-box">
        <div class="minigame-header">
          <h4>🧱 Mini-Game: Configuração de Regras de Entrada do Firewall</h4>
          <span class="edu-pill">Bloqueie portas 4444 e 1337 · Mantenha 443 aberta</span>
        </div>
        <div style="display:flex; flex-direction:column; gap:8px;">
          ${mg.firewallPorts.map((p, idx) => `
            <div style="display:flex; justify-content:space-between; align-items:center; background:#1e293b; padding:10px 14px; border-radius:10px; border:2px solid ${p.blocked ? '#ef4444' : '#22c55e'};">
              <div>
                <b style="color:${p.blocked ? '#f87171' : '#4ade80'};">Porta ${p.port} (${p.name})</b>
                <div style="font-size:11px; color:#cbd5e1;">${p.mustBlock ? '⚠️ Vulnerabilidade crítica de intrusão' : '✓ Porta essencial segura de navegação'}</div>
              </div>
              <button type="button" class="btn ${p.blocked ? 'btn-coral' : 'btn-verde'} btn-sm" data-toggle-port="${idx}">
                ${p.blocked ? '🔒 Bloqueada' : '🔓 Aberta'}
              </button>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // ==========================================================================
  // SOFTWARE #29: LIMPEZA DE %TEMP% E LOGS (`temp_cleaner`)
  // ==========================================================================
  else if (activeType === 'temp_cleaner') {
    const allPurged = mg.tempCleanPurged.every(Boolean);
    checkAndComplete(allPurged, '🧽 Mais de 120GB de arquivos temporários e logs inúteis eliminados!');

    const folders = [
      '📁 Pasta %TEMP% e Prefetch do Sistema (42 GB)',
      '🗑️ Lixeira com Vídeos Antigos Esquecidos (48 GB)',
      '📦 Cache Obsoleto do Windows Update (24 GB)',
      '📑 Despejos de Memória Antigos MEMORY.DMP (10 GB)'
    ];

    gameBodyHTML = `
      <div class="minigame-box">
        <div class="minigame-header">
          <h4>🧽 Mini-Game: Limpeza de %TEMP% e 120GB de Arquivos Fantasma</h4>
          <span class="edu-pill">Pastas Purgadas: ${mg.tempCleanPurged.filter(Boolean).length}/4</span>
        </div>
        <div style="display:flex; flex-direction:column; gap:8px;">
          ${folders.map((f, idx) => `
            <div style="display:flex; justify-content:space-between; align-items:center; background:#1e293b; padding:10px 14px; border-radius:10px; border:2px solid ${mg.tempCleanPurged[idx] ? '#22c55e' : '#334155'};">
              <span style="font-weight:800; font-size:12.5px; color:${mg.tempCleanPurged[idx] ? '#86efac' : '#f1f5f9'};">${f}</span>
              <button type="button" class="btn ${mg.tempCleanPurged[idx] ? 'btn-verde' : 'btn-amarelo'} btn-sm" data-purge-temp="${idx}" ${mg.tempCleanPurged[idx] ? 'disabled' : ''}>
                ${mg.tempCleanPurged[idx] ? '✓ Purgado' : '🧹 Purgar Espaço'}
              </button>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // ==========================================================================
  // SOFTWARE #30: RECONSTRUÇÃO DE SEED CRIPTO (`crypto_wallet_rescue`)
  // ==========================================================================
  else if (activeType === 'crypto_wallet_rescue') {
    const targetWords = ['alpha', 'saturn', 'crypto', 'shield'];
    const currentWords = mg.cryptoSeedUser || [];
    const isMatched = currentWords.length === 4 && currentWords.every((w, i) => w === targetWords[i]);
    checkAndComplete(isMatched, '🔑 Frase mnemônica recuperada e carteira de criptomoedas restaurada!');

    gameBodyHTML = `
      <div class="minigame-box">
        <div class="minigame-header">
          <h4>🔑 Mini-Game: Reconstrução de Frase Seed Mnemônica</h4>
          <span class="edu-pill">Palavras Selecionadas: ${currentWords.length}/4</span>
        </div>
        <p style="margin:0 0 10px; font-size:12.5px; color:#d7f5f8;">
          Organize as 4 palavras na ordem exata da chave BIP-39 (Ordem: <b>alpha ➔ saturn ➔ crypto ➔ shield</b>):
        </p>
        <div style="display:flex; gap:8px; margin-bottom:12px; background:#0f172a; padding:12px; border-radius:10px; min-height:48px; border:2px dashed #475569;">
          ${currentWords.map((w, idx) => `
            <span style="background:#0284c7; color:#fff; padding:6px 12px; border-radius:8px; font-weight:900; font-size:13px;">
              #${idx + 1} ${w}
            </span>
          `).join('')}
          ${currentWords.length === 0 ? '<span style="color:#64748b; font-size:12px;">Nenhuma palavra selecionada</span>' : ''}
        </div>
        <div style="display:flex; gap:8px; flex-wrap:wrap;">
          ${targetWords.map(w => `
            <button type="button" class="btn btn-vidro btn-sm" data-seed-word="${w}" ${currentWords.includes(w) ? 'disabled' : ''}>
              +${w}
            </button>
          `).join('')}
          <button type="button" class="btn btn-coral btn-sm" id="btn-reset-seed">🔄 Limpar Ordem</button>
        </div>
      </div>
    `;
  }

  // ==========================================================================
  // FALLBACK / PORTAS LÓGICAS (`logic` / `circuit_logic`)
  // ==========================================================================
  else {
    const outAnd1 = (mg.bitA === 1 && mg.bitB === 1) ? 1 : 0;
    const outNotC = mg.bitC === 0 ? 1 : 0;
    const finalPowerGood = (outAnd1 === 1 && outNotC === 1) ? 1 : 0;
    checkAndComplete(finalPowerGood === 1, '🧮 Sinal POWER_GOOD = 1 ativado!');

    gameBodyHTML = `
      <div class="minigame-box">
        <div class="minigame-header">
          <h4>🧮 Mini-Game: Circuito de Portas Lógicas (AND / NOT)</h4>
          <span class="edu-pill">Deixe A=1, B=1 e C=0</span>
        </div>
        <div class="logic-circuit">
          <div class="logic-row">
            <div style="display:flex; gap:8px;">
              <button type="button" class="bit-toggle ${mg.bitA ? 'on' : ''}" data-bit="bitA">Chave A = ${mg.bitA}</button>
              <button type="button" class="bit-toggle ${mg.bitB ? 'on' : ''}" data-bit="bitB">Chave B = ${mg.bitB}</button>
            </div>
            <div class="gate-node">Porta <b>AND</b> (A · B) ➔ <b>${outAnd1}</b></div>
          </div>
          <div class="logic-row">
            <button type="button" class="bit-toggle ${mg.bitC ? 'on' : ''}" data-bit="bitC">Chave C = ${mg.bitC}</button>
            <div class="gate-node">Porta <b>NOT</b> (!C) ➔ <b>${outNotC}</b></div>
          </div>
          <div class="logic-row" style="border-top:1px solid rgba(255,255,255,0.15); padding-top:8px;">
            <div class="gate-node">Saída Final <b>AND</b> (${outAnd1} E ${outNotC})</div>
            <div style="font-weight:900; padding:6px 14px; border-radius:10px; background:${finalPowerGood ? 'var(--verde)' : 'var(--vermelho)'};">
              POWER_GOOD = ${finalPowerGood}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  const completionBanner = c.minigameDone ? `
    <div class="mg-complete-banner">
      <div>
        <div style="font-weight:900; font-size:15px; color:#68f0ae;">✅ Mini-Game / Puzzle Concluído!</div>
        <div style="font-size:12px; color:#d7f5f8;">Clique no botão ao lado para entregar o equipamento consertado e dispensar o cliente:</div>
      </div>
      <button type="button" class="btn btn-verde btn-sm" id="btn-finish-repair-final">
        ✅ Finalizar Conserto & Entregar ao Cliente ➔
      </button>
    </div>
  ` : '';

  container.innerHTML = partBannerHTML + hybridHeaderHTML + gameBodyHTML + completionBanner;

  document.getElementById('btn-mg-grab-now')?.addEventListener('click', () => collectStockPart(c.requiredPart));

  // Switcher de etapas do chamado híbrido
  document.getElementById('btn-hybrid-stage-1')?.addEventListener('click', () => {
    mg.hybridStage = 1;
    renderWorkbenchModal();
  });
  document.getElementById('btn-hybrid-stage-2')?.addEventListener('click', () => {
    if (mg.stage1Done) {
      mg.hybridStage = 2;
      renderWorkbenchModal();
    }
  });

  // #1 Soprador de ar (dust_blower)
  container.querySelectorAll('[data-dust-idx]').forEach(el => {
    el.addEventListener('click', () => {
      const idx = Number(el.dataset.dustIdx);
      mg.dustSpots[idx] = 0;
      renderWorkbenchModal();
    });
  });

  // #2 Espátula térmica (thermal_spatula)
  container.querySelectorAll('[data-crust-idx]').forEach(el => {
    el.addEventListener('click', () => {
      const idx = Number(el.dataset.crustIdx);
      mg.crustScraped[idx] = true;
      renderWorkbenchModal();
    });
  });
  document.getElementById('btn-apply-silver-paste')?.addEventListener('click', () => {
    mg.newPasteApplied = true;
    renderWorkbenchModal();
  });

  // #3 Ventoinhas (fan_unjam)
  container.querySelectorAll('[data-fan-untangle]').forEach(el => {
    el.addEventListener('click', () => {
      const idx = Number(el.dataset.fanUntangle);
      mg.fanHairsRemoved[idx] = true;
      renderWorkbenchModal();
    });
  });
  container.querySelectorAll('[data-fan-oil]').forEach(el => {
    el.addEventListener('click', () => {
      const idx = Number(el.dataset.fanOil);
      mg.fanOiled[idx] = true;
      renderWorkbenchModal();
    });
  });

  // #4 Ninho de baratas (cockroach_nest)
  container.querySelectorAll('[data-roach-idx]').forEach(el => {
    el.addEventListener('click', () => {
      const idx = Number(el.dataset.roachIdx);
      mg.roachesCleared[idx] = true;
      renderWorkbenchModal();
    });
  });
  document.getElementById('btn-disinfect-nest')?.addEventListener('click', () => {
    mg.eggsDisinfected = true;
    renderWorkbenchModal();
  });

  // #5 Pinos do soquete (socket_pins)
  container.querySelectorAll('[data-pin-idx]').forEach(el => {
    el.addEventListener('click', () => {
      const idx = Number(el.dataset.pinIdx);
      mg.bentPins[idx] = true;
      renderWorkbenchModal();
    });
  });

  // #6 Contatos de memória (ram_contacts)
  container.querySelectorAll('[data-contact-idx]').forEach(el => {
    el.addEventListener('click', () => {
      const idx = Number(el.dataset.contactIdx);
      mg.oxidationCleaned[idx] = true;
      renderWorkbenchModal();
    });
  });

  // #7 CMOS Bateria (cmos_battery)
  document.getElementById('btn-test-cmos-volt')?.addEventListener('click', () => {
    mg.cmosTested = true;
    renderWorkbenchModal();
  });
  document.getElementById('btn-replace-cmos-bat')?.addEventListener('click', () => {
    mg.cmosReplaced = true;
    renderWorkbenchModal();
  });
  document.getElementById('btn-close-clr-cmos')?.addEventListener('click', () => {
    mg.clrCmosJumper = true;
    renderWorkbenchModal();
  });

  // #8 Water cooler leak (custom_water_leak)
  container.querySelectorAll('[data-fitting-idx]').forEach(el => {
    el.addEventListener('click', () => {
      const idx = Number(el.dataset.fittingIdx);
      mg.fittingsTightened[idx] = true;
      renderWorkbenchModal();
    });
  });
  document.getElementById('btn-purge-water-bubbles')?.addEventListener('click', () => {
    mg.bubblesPurged = true;
    renderWorkbenchModal();
  });

  // #15 Delid metal líquido (delid_liquid_metal)
  document.getElementById('btn-delid-ihs')?.addEventListener('click', () => {
    mg.ihsRemoved = true;
    renderWorkbenchModal();
  });
  document.getElementById('btn-apply-kapton')?.addEventListener('click', () => {
    mg.kaptonApplied = true;
    renderWorkbenchModal();
  });
  document.getElementById('btn-spread-liquid-metal')?.addEventListener('click', () => {
    mg.liquidMetalSpread = true;
    renderWorkbenchModal();
  });

  // #16 Trojans (trojan_hunter)
  container.querySelectorAll('[data-trojan-id]').forEach(el => {
    el.addEventListener('click', () => {
      const t = mg.trojans.find(x => x.id === el.dataset.trojanId);
      if (!t.bad) {
        showToast(`⚠️ "${t.name}" é um processo genuíno do Windows! Não isole arquivos do sistema!`);
        return;
      }
      t.quarantined = true;
      renderWorkbenchModal();
    });
  });

  // #17 Cookies (cookie_cleaner)
  container.querySelectorAll('[data-shred-cat]').forEach(el => {
    el.addEventListener('click', () => {
      const cat = el.dataset.shredCat;
      mg.cookieCategories[cat] = true;
      renderWorkbenchModal();
    });
  });

  // #18 Popups (popups_closer)
  container.querySelectorAll('[data-real-close]').forEach(el => {
    el.addEventListener('click', () => {
      const id = Number(el.dataset.realClose);
      const p = mg.popups.find(x => x.id === id);
      if (p) p.closed = true;
      renderWorkbenchModal();
    });
  });
  container.querySelectorAll('[data-fake-x]').forEach(el => {
    el.addEventListener('click', () => {
      showToast('⚠️ Cuidado! Esse botão [X] era falso! Feche apenas pelo [X] vermelho superior!');
    });
  });

  // #19 Defrag (disk_defrag)
  container.querySelectorAll('[data-defrag-idx]').forEach(el => {
    el.addEventListener('click', () => {
      const idx = Number(el.dataset.defragIdx);
      mg.defragBlocks[idx] = 0;
      renderWorkbenchModal();
    });
  });

  // #20 BSOD (bsod_analyzer)
  container.querySelectorAll('[data-isolate-bsod]').forEach(el => {
    el.addEventListener('click', () => {
      const b = mg.bsodLogs.find(x => x.id === el.dataset.isolateBsod);
      if (b) b.isolated = true;
      renderWorkbenchModal();
    });
  });

  // #21 DLLs (dll_fixer)
  container.querySelectorAll('[data-fix-dll]').forEach(el => {
    el.addEventListener('click', () => {
      const idx = Number(el.dataset.fixDll);
      mg.missingDlls[idx].fixed = true;
      renderWorkbenchModal();
    });
  });

  // #22 Flash BIOS (bios_flashing)
  document.getElementById('btn-flash-bios-step')?.addEventListener('click', () => {
    mg.biosProgress = Math.min(100, mg.biosProgress + 25);
    renderWorkbenchModal();
  });

  // #24 Boot repair (boot_loop_fix)
  container.querySelectorAll('[data-cmd-step]').forEach(el => {
    el.addEventListener('click', () => {
      const idx = Number(el.dataset.cmdStep);
      mg.bcdSteps[idx].done = true;
      renderWorkbenchModal();
    });
  });

  // #25 DDU (ddu_driver_sweep)
  document.getElementById('btn-ddu-safemode')?.addEventListener('click', () => {
    mg.dduSafeMode = true;
    renderWorkbenchModal();
  });
  document.getElementById('btn-ddu-sweep-files')?.addEventListener('click', () => {
    mg.dduDriverRemoved = true;
    renderWorkbenchModal();
  });
  document.getElementById('btn-ddu-purge-reg')?.addEventListener('click', () => {
    mg.dduRegistryCleaned = true;
    renderWorkbenchModal();
  });

  // #26 Bloatware (bloatware_remover)
  container.querySelectorAll('[data-uninstall-bloat]').forEach(el => {
    el.addEventListener('click', () => {
      const idx = Number(el.dataset.uninstallBloat);
      mg.bloatwareList[idx].uninstalled = true;
      renderWorkbenchModal();
    });
  });

  // #27 Ransomware (ransomware_decrypt)
  container.querySelectorAll('[data-rsa-idx]').forEach(el => {
    el.addEventListener('click', () => {
      const idx = Number(el.dataset.rsaIdx);
      mg.rsaHexBlocks[idx].solved = true;
      renderWorkbenchModal();
    });
  });

  // #28 Firewall (firewall_rules)
  container.querySelectorAll('[data-toggle-port]').forEach(el => {
    el.addEventListener('click', () => {
      const idx = Number(el.dataset.togglePort);
      mg.firewallPorts[idx].blocked = !mg.firewallPorts[idx].blocked;
      renderWorkbenchModal();
    });
  });

  // #29 Temp Cleaner (temp_cleaner)
  container.querySelectorAll('[data-purge-temp]').forEach(el => {
    el.addEventListener('click', () => {
      const idx = Number(el.dataset.purgeTemp);
      mg.tempCleanPurged[idx] = true;
      renderWorkbenchModal();
    });
  });

  // #30 Crypto Seed (crypto_wallet_rescue)
  container.querySelectorAll('[data-seed-word]').forEach(el => {
    el.addEventListener('click', () => {
      const w = el.dataset.seedWord;
      if (!mg.cryptoSeedUser) mg.cryptoSeedUser = [];
      if (!mg.cryptoSeedUser.includes(w)) {
        mg.cryptoSeedUser.push(w);
      }
      renderWorkbenchModal();
    });
  });
  document.getElementById('btn-reset-seed')?.addEventListener('click', () => {
    mg.cryptoSeedUser = [];
    renderWorkbenchModal();
  });

  // Eventos do Passo 1 e Passo 2 dos 18 Puzzles Cooperativos (2P, 3P e 4P):
  container.querySelectorAll('[data-coop-opt-station]').forEach(btn => {
    btn.addEventListener('click', () => {
      const stIdx = Number(btn.dataset.coopOptStation);
      const optIdx = Number(btn.dataset.coopOptIdx);
      const puz = COOP_PUZZLES_CATALOG.find(p => p.id === activeType);
      if (!puz) return;

      const st = puz.stations[stIdx];
      if (optIdx !== st.correctOpt) {
        showToast(`⚠️ Parâmetro incorreto na ${st.title}! Escolha a configuração técnica segura!`);
        return;
      }

      mg.coopSelectedOpt[stIdx] = optIdx;
      const you = state.players[state.mySlotIndex];
      broadcastNet({
        type: 'coop_step_sync',
        peerId: state.myPeerId,
        playerName: you.name,
        minigameType: activeType,
        stationIdx: stIdx,
        optIdx,
        stationDone: false
      });
      renderWorkbenchModal();
    });
  });

  container.querySelectorAll('[data-coop-station]').forEach(btn => {
    btn.addEventListener('click', () => {
      const stIdx = Number(btn.dataset.coopStation);
      mg.coopStations[stIdx] = true;
      const you = state.players[state.mySlotIndex];
      broadcastNet({
        type: 'coop_step_sync',
        peerId: state.myPeerId,
        playerName: you.name,
        minigameType: activeType,
        stationIdx: stIdx,
        optIdx: mg.coopSelectedOpt[stIdx],
        stationDone: true
      });
      renderWorkbenchModal();
    });
  });

  // Eventos do Tabuleiro de 9 Standoffs (#12 mobo_build)
  container.querySelectorAll('[data-standoff]').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.dataset.standoff);
      mg.standoffs9[idx] = true;
      renderWorkbenchModal();
    });
  });
  document.getElementById('btn-mount-mobo')?.addEventListener('click', () => {
    mg.moboMounted = true;
    renderWorkbenchModal();
  });
  document.getElementById('btn-lock-cpu')?.addEventListener('click', () => {
    mg.cpuLocked = true;
    renderWorkbenchModal();
  });

  // Eventos do Calibrador de Sliders (#13 gpu_12vhpwr)
  document.getElementById('slider-gap')?.addEventListener('input', (e) => {
    mg.gapMm = Number(e.target.value);
    renderWorkbenchModal();
  });
  document.getElementById('slider-volt')?.addEventListener('input', (e) => {
    mg.voltageTen = Number(e.target.value);
    renderWorkbenchModal();
  });
  document.getElementById('slider-fan')?.addEventListener('input', (e) => {
    mg.fanPct = Number(e.target.value);
    renderWorkbenchModal();
  });

  // Eventos da Matriz 4x3 de Solda SMD (#14 vrm_soldering)
  container.querySelectorAll('[data-smd]').forEach(btn => {
    btn.addEventListener('click', () => {
      const pad = mg.smdPads.find(p => p.id === Number(btn.dataset.smd));
      if (!pad.bad) {
        showToast('⚠️ Essa fase do VRM está boa! Solde apenas os 4 MOSFETs em vermelho (em curto).');
        return;
      }
      pad.fixed = true;
      renderWorkbenchModal();
    });
  });

  // #9 CPU & RAM
  document.getElementById('mg-cpu-die')?.addEventListener('click', () => {
    if (!mg.cpuCleaned) mg.cpuCleaned = true;
    else if (!mg.cpuPasted) mg.cpuPasted = true;
    renderWorkbenchModal();
  });
  document.getElementById('btn-cpu-clean')?.addEventListener('click', () => { mg.cpuCleaned = true; renderWorkbenchModal(); });
  document.getElementById('btn-cpu-paste')?.addEventListener('click', () => { mg.cpuCleaned = true; mg.cpuPasted = true; renderWorkbenchModal(); });
  container.querySelectorAll('.ram-slot').forEach(slotEl => {
    slotEl.addEventListener('click', () => {
      const idx = Number(slotEl.dataset.ram);
      mg.ramSlots[idx] = !mg.ramSlots[idx];
      renderWorkbenchModal();
    });
  });

  // #10 RJ45
  container.querySelectorAll('.wire-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const wireObj = mg.t568bTarget.find(x => x.id === btn.dataset.wire);
      const expected = mg.t568bTarget[mg.rj45Order.length];
      if (!expected) return;
      if (wireObj.id !== expected.id) {
        showToast(`⚠️ Pino ${mg.rj45Order.length + 1} pede "${expected.name}"!`);
        return;
      }
      mg.rj45Order.push(wireObj);
      renderWorkbenchModal();
    });
  });
  document.getElementById('btn-reset-rj45')?.addEventListener('click', () => { mg.rj45Order = []; renderWorkbenchModal(); });
  document.getElementById('btn-auto-hint-rj45')?.addEventListener('click', () => {
    if (mg.rj45Order.length < 8) {
      mg.rj45Order.push(mg.t568bTarget[mg.rj45Order.length]);
      renderWorkbenchModal();
    }
  });

  // #11 Cabos da Fonte Modular ATX
  function tryMatchPsu(sId, dId) {
    if (sId === dId) {
      mg.psuConnected[sId] = true;
      mg.selectedPsuCable = null;
      mg.selectedPsuTarget = null;
      showToast('🔌 Cabo conectado!');
    } else {
      showToast('⚠️ Entrada incorreta!');
      mg.selectedPsuCable = null;
      mg.selectedPsuTarget = null;
    }
    renderWorkbenchModal();
  }
  container.querySelectorAll('[data-psu-src]').forEach(btn => {
    btn.addEventListener('click', () => {
      const sId = btn.dataset.psuSrc;
      if (mg.selectedPsuTarget) tryMatchPsu(sId, mg.selectedPsuTarget);
      else { mg.selectedPsuCable = sId; renderWorkbenchModal(); }
    });
  });
  container.querySelectorAll('[data-psu-dst]').forEach(btn => {
    btn.addEventListener('click', () => {
      const dId = btn.dataset.psuDst;
      if (mg.selectedPsuCable) tryMatchPsu(mg.selectedPsuCable, dId);
      else { mg.selectedPsuTarget = dId; renderWorkbenchModal(); }
    });
  });

  // #23 Malware Kill
  container.querySelectorAll('.btn-kill-proc').forEach(btn => {
    btn.addEventListener('click', () => {
      const proc = mg.processes.find(x => x.id === btn.dataset.proc);
      if (!proc.malicious) {
        showToast(`⚠️ "${proc.name}" é um processo vital do sistema!`);
        return;
      }
      proc.killed = true;
      renderWorkbenchModal();
    });
  });

  // Portas Lógicas
  container.querySelectorAll('.bit-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.bit;
      mg[key] = mg[key] === 1 ? 0 : 1;
      renderWorkbenchModal();
    });
  });

  document.getElementById('btn-finish-repair-final')?.addEventListener('click', () => {
    completeRepairAfterMinigame(c);
  });
}
