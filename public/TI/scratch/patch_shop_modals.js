const fs = require('fs');

let code = fs.readFileSync('game.js', 'utf8');

// 1. Ensure minRep on solo expansions and workbenches are <= 70 so player with default 70 rep isn't blocked
code = code.replace(
  /id:\s*'solo_expansion_5',\s*tier:\s*5,\s*name:\s*'🗄️ Mega Almoxarifado de Peças & Suprimentos \(Nível 2\)',\s*price:\s*38000,\s*minRep:\s*80,/g,
  `id: 'solo_expansion_5', tier: 5, name: '🗄️ Mega Almoxarifado de Peças & Suprimentos (Nível 2)', price: 38000, minRep: 70,`
);
code = code.replace(
  /id:\s*'solo_expansion_2',\s*tier:\s*2,\s*name:\s*'🏢 Ampliação da Cabine #01 \(Nível 1\)',\s*price:\s*3500,\s*minRep:\s*80,/g,
  `id: 'solo_expansion_2', tier: 2, name: '🏢 Ampliação da Cabine #01 (Nível 1)', price: 3500, minRep: 70,`
);
code = code.replace(
  /id:\s*'solo_expansion_3',\s*tier:\s*3,\s*name:\s*'🔬 Mega Cabine Técnica #01 VIP \(Nível 2\)',\s*price:\s*8500,\s*minRep:\s*80,/g,
  `id: 'solo_expansion_3', tier: 3, name: '🔬 Mega Cabine Técnica #01 VIP (Nível 2)', price: 8500, minRep: 70,`
);
code = code.replace(
  /id:\s*'solo_expansion_4',\s*tier:\s*4,\s*name:\s*'📦 Ampliação do Estoque Lateral \(Nível 1\)',\s*price:\s*18000,\s*minRep:\s*80,/g,
  `id: 'solo_expansion_4', tier: 4, name: '📦 Ampliação do Estoque Lateral (Nível 1)', price: 18000, minRep: 70,`
);
code = code.replace(
  /id:\s*'workbench_lvl2',\s*level:\s*2,\s*name:\s*'🔧 Bancada Técnica c\/ Painel & Gaveteiro \(Nv\. 2\)',\s*price:\s*8500,\s*minRep:\s*75,/g,
  `id: 'workbench_lvl2', level: 2, name: '🔧 Bancada Técnica c/ Painel & Gaveteiro (Nv. 2)', price: 8500, minRep: 70,`
);
code = code.replace(
  /id:\s*'workbench_lvl3',\s*level:\s*3,\s*name:\s*'🔬 Bancada Industrial c\/ Osciloscópio & Suporte Duplo \(Nv\. 3\)',\s*price:\s*22000,\s*minRep:\s*80,/g,
  `id: 'workbench_lvl3', level: 3, name: '🔬 Bancada Industrial c/ Osciloscópio & Suporte Duplo (Nv. 3)', price: 22000, minRep: 70,`
);
code = code.replace(
  /id:\s*'workbench_lvl4',\s*level:\s*4,\s*name:\s*'⚡ Super Estação Master c\/ Monitor 4K & Banqueta \(Nv\. 4\)',\s*price:\s*45000,\s*minRep:\s*85,/g,
  `id: 'workbench_lvl4', level: 4, name: '⚡ Super Estação Master c/ Monitor 4K & Banqueta (Nv. 4)', price: 45000, minRep: 70,`
);

// 2. Add complete implementations of Shop & Stock modals and purchase handling
const shopAndStockCode = `
// ============================================================================
// SISTEMA COMPLETO DE LOJA, COMPRAS DE EXPANSÕES / BANCADAS & SALA DE ESTOQUE
// ============================================================================
function openShopModalUI() {
  const shopModal = document.getElementById('shop-modal');
  if (shopModal) shopModal.classList.add('open');
  renderShopModal();
}

function renderShopModal() {
  const moneyEl = document.getElementById('shop-money-display');
  if (moneyEl) moneyEl.textContent = '💰 R$ ' + (state.money || 0).toLocaleString('pt-BR');

  const grid = document.getElementById('shop-items-grid');
  if (!grid) return;

  grid.innerHTML = SHOP_CATALOG.map(item => {
    let isOwned = false;
    let isLocked = false;
    let lockReason = '';

    if (item.category === 'expansion') {
      isOwned = (state.soloExpansionTier || 1) >= item.tier;
      if (!isOwned && item.tier > (state.soloExpansionTier || 1) + 1) {
        isLocked = true;
        lockReason = 'Requer Expansão ' + (item.tier - 1) + 'x';
      }
    } else if (item.category === 'workbench') {
      isOwned = (state.workbenchLevel || 1) >= item.level;
      if (!isOwned && item.level > (state.workbenchLevel || 1) + 1) {
        isLocked = true;
        lockReason = 'Requer Bancada Nv. ' + (item.level - 1);
      }
    } else if (item.id === 'rack_lvl1') {
      isOwned = !!state.upgrades.rack_lvl1;
    } else if (item.id === 'rack_lvl2') {
      isOwned = !!state.upgrades.rack_lvl2;
      if (!isOwned && !state.upgrades.rack_lvl1) {
        isLocked = true;
        lockReason = 'Requer Rack Nv. 1';
      }
    } else if (item.id === 'rack_refill') {
      isOwned = false;
      if (!state.rackCapacity || state.rackCapacity <= 0) {
        isLocked = true;
        lockReason = 'Requer Rack Instalado';
      }
    } else {
      isOwned = !!state.upgrades[item.id];
    }

    if (!isOwned && !isLocked && item.minRep && (state.rep || 0) < item.minRep) {
      isLocked = true;
      lockReason = 'Requer ' + item.minRep + '% Rep.';
    }

    const canAfford = (state.money || 0) >= item.price;

    let btnHtml = '';
    if (isOwned) {
      btnHtml = '<button type=\"button\" class=\"btn btn-sm btn-verde\" disabled style=\"opacity:0.85; width:100%; font-weight:800;\">✅ Já Adquirido</button>';
    } else if (isLocked) {
      btnHtml = '<button type=\"button\" class=\"btn btn-sm btn-vidro\" disabled style=\"opacity:0.6; width:100%; font-weight:800;\">🔒 ' + lockReason + '</button>';
    } else if (!canAfford) {
      const falta = item.price - (state.money || 0);
      btnHtml = '<button type=\"button\" class=\"btn btn-sm btn-vidro\" disabled style=\"opacity:0.65; width:100%; font-weight:800;\">💰 R$ ' + item.price.toLocaleString('pt-BR') + ' (Falta R$ ' + falta.toLocaleString('pt-BR') + ')</button>';
    } else {
      btnHtml = '<button type=\"button\" class=\"btn btn-sm btn-amarelo\" onclick=\"buyShopItem(\\'' + item.id + '\\')\" style=\"width:100%; font-weight:900;\">🛒 Comprar (R$ ' + item.price.toLocaleString('pt-BR') + ')</button>';
    }

    const borderClr = isOwned ? '#16a34a' : 'var(--linha)';
    const bgClr = isOwned ? '#f0fdf4' : '#ffffff';

    return \`
      <div class="stock-item-card" style="display:flex; flex-direction:column; justify-content:space-between; padding:14px; border:2px solid \${borderClr}; border-radius:12px; background:\${bgClr};">
        <div>
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:8px;">
            <span style="font-size:24px;">\${item.icon}</span>
            <span style="font-size:12px; font-weight:900; padding:3px 10px; border-radius:99px; background:\${isOwned ? '#bbf7d0; color:#14532d;' : '#e0f2fe; color:#0369a1;'}">
              \${isOwned ? 'ATIVADO' : 'R$ ' + item.price.toLocaleString('pt-BR')}
            </span>
          </div>
          <h4 style="margin:0 0 6px; font-size:14px; font-weight:900; color:var(--escuro);">\${item.name}</h4>
          <p style="margin:0 0 12px; font-size:12px; line-height:1.4; color:var(--suave);">\${item.desc}</p>
        </div>
        <div>
          \${btnHtml}
        </div>
      </div>
    \`;
  }).join('');
}

function buyShopItem(itemId) {
  const item = SHOP_CATALOG.find(i => i.id === itemId);
  if (!item) return;

  if ((state.money || 0) < item.price) {
    showToast('❌ Dinheiro insuficiente! Você precisa de R$ ' + item.price.toLocaleString('pt-BR') + ' (Tem: R$ ' + (state.money || 0).toLocaleString('pt-BR') + ')');
    playTechChime('alarm');
    return;
  }

  // Verificar pré-requisitos de expansão
  if (item.category === 'expansion') {
    if ((state.soloExpansionTier || 1) >= item.tier) {
      showToast('⚠️ Esta expansão já foi adquirida!');
      return;
    }
    if (item.tier > (state.soloExpansionTier || 1) + 1) {
      showToast('⚠️ Você precisa comprar a Expansão ' + (item.tier - 1) + 'x primeiro!');
      return;
    }
  }

  // Verificar pré-requisitos de bancada
  if (item.category === 'workbench') {
    if ((state.workbenchLevel || 1) >= item.level) {
      showToast('⚠️ Esta bancada já foi adquirida!');
      return;
    }
    if (item.level > (state.workbenchLevel || 1) + 1) {
      showToast('⚠️ Você precisa comprar o Nível ' + (item.level - 1) + ' da bancada primeiro!');
      return;
    }
  }

  if (item.id === 'rack_lvl1' && state.upgrades.rack_lvl1) {
    showToast('⚠️ Rack Nível 1 já instalado!');
    return;
  }
  if (item.id === 'rack_lvl2') {
    if (state.upgrades.rack_lvl2) {
      showToast('⚠️ Mega Rack já instalado!');
      return;
    }
    if (!state.upgrades.rack_lvl1) {
      showToast('⚠️ Compre primeiro o Rack Nível 1!');
      return;
    }
  }
  if (item.id === 'rack_refill' && (!state.rackCapacity || state.rackCapacity <= 0)) {
    showToast('⚠️ Você precisa ter um Rack instalado para comprar peças!');
    return;
  }

  // Deduzir o valor da compra
  state.money -= item.price;
  playTechChime('success');

  if (item.category === 'expansion') {
    setSoloExpansionTier(item.tier, true);
    showToast('🎉 ' + item.name + ' comprada com sucesso! Loja ampliada!');
  } else if (item.category === 'workbench') {
    state.workbenchLevel = item.level;
    state.upgrades[item.id] = true;
    refreshMapsWithUpgrades();
    rebuildColliders();
    renderTeleportButtons();
    showToast('🔬 Parabéns! Sua Bancada de Trabalho foi atualizada para o Nível ' + item.level + '!');
  } else if (item.id === 'rack_lvl1') {
    state.upgrades.rack_lvl1 = true;
    state.rackCapacity = 8;
    state.rackParts = 8;
    refreshMapsWithUpgrades();
    rebuildColliders();
    showToast('🗄️ Rack de Peças instalado na sua Cabine com 8 peças prontas!');
  } else if (item.id === 'rack_lvl2') {
    state.upgrades.rack_lvl2 = true;
    state.rackCapacity = 20;
    state.rackParts = 20;
    refreshMapsWithUpgrades();
    rebuildColliders();
    showToast('🗄️ Mega Rack Duplo instalado com capacidade para 20 peças!');
  } else if (item.id === 'rack_refill') {
    state.rackParts = Math.min(state.rackCapacity, (state.rackParts || 0) + 8);
    showToast('📦 +8 Peças adicionadas ao seu Rack! (Total: ' + state.rackParts + '/' + state.rackCapacity + ')');
  } else {
    state.upgrades[item.id] = true;
    refreshMapsWithUpgrades();
    rebuildColliders();
    showToast('✅ ' + item.name + ' instalado com sucesso!');
  }

  updateHUD();
  renderShopModal();
}

function openStockModalUI() {
  const stockModal = document.getElementById('stock-modal');
  if (stockModal) stockModal.classList.add('open');
  renderStockModal();
}

function renderStockModal() {
  const grid = document.getElementById('stock-grid');
  if (!grid) return;

  grid.innerHTML = STOCK_PARTS.map(part => {
    const hasPart = !!state.inventory[part.id];
    return \`
      <div class="stock-item-card" style="display:flex; flex-direction:column; justify-content:space-between; padding:12px; border:2px solid \${hasPart ? '#16a34a' : 'var(--linha)'}; border-radius:10px; background:\${hasPart ? '#f0fdf4' : '#ffffff'};">
        <div>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
            <span style="font-size:20px;">\${part.shortName.slice(0, 2)}</span>
            <span style="font-size:11px; font-weight:900; padding:2px 8px; border-radius:99px; background:\${hasPart ? '#bbf7d0; color:#14532d;' : '#f1f5f9; color:#475569;'}">
              \${hasPart ? '🎒 NA MOCHILA' : 'DISPONÍVEL'}
            </span>
          </div>
          <h4 style="margin:0 0 4px; font-size:13px; font-weight:800; color:var(--escuro);">\${part.name}</h4>
          <p style="margin:0 0 8px; font-size:11px; color:var(--suave); line-height:1.3;">\${part.desc}</p>
        </div>
        <div>
          \${hasPart
            ? '<button type=\"button\" class=\"btn btn-sm btn-vidro\" onclick=\"dropStockPart(\\'' + part.id + '\\')\" style=\"width:100%; font-weight:800;\">Devolver ao Estoque</button>'
            : '<button type=\"button\" class=\"btn btn-sm btn-azul\" onclick=\"takeStockPart(\\'' + part.id + '\\')\" style=\"width:100%; font-weight:800;\">🎒 Pegar Peça</button>'
          }
        </div>
      </div>
    \`;
  }).join('');
}

function takeStockPart(partId) {
  state.inventory[partId] = true;
  playTechChime('click');
  const part = STOCK_PARTS.find(p => p.id === partId);
  showToast('🎒 Você pegou: ' + (part ? part.shortName : partId) + '!');
  renderStockModal();
  updateHUD();
}

function dropStockPart(partId) {
  state.inventory[partId] = false;
  playTechChime('click');
  const part = STOCK_PARTS.find(p => p.id === partId);
  showToast('📦 Devolvido ao estoque: ' + (part ? part.shortName : partId));
  renderStockModal();
  updateHUD();
}

function refillMyRackFree() {
  if (!state.rackCapacity || state.rackCapacity === 0) {
    showToast('⚠️ Você ainda não possui um Rack na sua Cabine! Compre na Loja primeiro.');
    playTechChime('alarm');
    return;
  }
  state.rackParts = state.rackCapacity;
  playTechChime('success');
  showToast('🗄️ Rack da sua sala abastecido gratuitamente com ' + state.rackCapacity + ' peças!');
  refreshMapsWithUpgrades();
  updateHUD();
}

function collectAllStockParts() {
  STOCK_PARTS.forEach(p => { state.inventory[p.id] = true; });
  playTechChime('success');
  showToast('🎒 Todas as peças do estoque foram guardadas na sua mochila!');
  renderStockModal();
  updateHUD();
}
`;

// Insert the functions right before `function changeReputation` or near shop setup
if (!code.includes('function buyShopItem')) {
  const target = 'function changeReputation';
  code = code.replace(target, shopAndStockCode + '\n' + target);
  console.log('Shop and Stock functions inserted successfully!');
} else {
  console.log('buyShopItem already in code!');
}

fs.writeFileSync('game.js', code, 'utf8');
console.log('game.js updated! New length:', code.length);
