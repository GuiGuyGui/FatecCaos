const fs = require('fs');

let gameCode = fs.readFileSync('game.js', 'utf8');

// 1. Replace SHOP_CATALOG
const oldCatalogRegex = /const SHOP_CATALOG = \[\r?\n[\s\S]*?\r?\n\];/;
const newCatalog = `const SHOP_CATALOG = [
  {
    id: 'rack_lvl1',
    name: '🗄️ Rack de Peças na Sua Sala (Cap. 8 Peças)',
    price: 4000,
    icon: '🗄️',
    desc: 'Instala um Rack dentro da sua Cabine #01 com 8 peças prontas! Usa as peças automaticamente nos consertos sem você precisar ir ao Estoque!',
    category: 'rack'
  },
  {
    id: 'rack_lvl2',
    name: '🗄️ Mega Rack Duplo na Sala (Cap. 20 Peças)',
    price: 8000,
    icon: '🗄️✨',
    desc: 'Expande o Rack da sua Cabine #01 para caber até 20 peças e já o enche completamente!',
    category: 'rack'
  },
  {
    id: 'rack_refill',
    name: '📦 Lote de +8 Peças p/ o Seu Rack',
    price: 1750,
    icon: '📦',
    desc: 'Entrega imediata de +8 peças universais direto no Rack da sua Cabine #01 (Requer ter comprado o Rack).',
    category: 'consumable'
  },
  {
    id: 'my_coffee',
    name: '☕ Cafeteira Expresso Italiana na Sua Sala',
    price: 3500,
    icon: '☕',
    desc: 'Coloca uma Cafeteira Expresso exclusiva dentro da sua Cabine #01 ([E] para usar) e aumenta sua velocidade base em +25%!',
    category: 'furniture'
  },
  {
    id: 'vip_sofa',
    name: '🛋️ Poltrona Gamer VIP & TV p/ Clientes',
    price: 5000,
    icon: '🛋️',
    desc: 'Instala poltrona confortável na sua sala e recepção: os clientes esperam 40% mais calmos e dão +5% de Reputação extra!',
    category: 'furniture'
  },
  {
    id: 'ac_lvl1',
    name: '❄️ Ar-Condicionado Split Nível 1',
    price: 6500,
    icon: '❄️',
    desc: 'Climatiza sua Cabine #01: clientes dão +R$ 150 de gorjeta extra pelo conforto térmico!',
    category: 'furniture'
  },
  {
    id: 'ac_lvl2',
    name: '❄️ Ar-Condicionado Inverter Nível 2',
    price: 12000,
    icon: '❄️✨',
    desc: 'Ar de alto rendimento no corredor e cabine: clientes dão +R$ 350 de gorjeta extra e esperam mais tranquilos!',
    category: 'furniture'
  },
  {
    id: 'ac_lvl3',
    name: '❄️ Ar-Condicionado Torre VIP Nível 3',
    price: 22500,
    icon: '❄️💎',
    desc: 'Super climatizador torre ao lado da sua bancada de trabalho: clientes dão +R$ 600 de gorjeta extra e máxima satisfação!',
    category: 'furniture'
  },
  // ================= ATUALIZAÇÕES DA BANCADA DE TRABALHO (PREÇOS ALTOS E BENEFÍCIOS) =================
  {
    id: 'workbench_lvl2', level: 2, name: '🔧 Bancada Técnica c/ Painel & Gaveteiro (Nv. 2)', price: 42500, minRep: 70,
    icon: '🔧',
    desc: 'Bancada técnica ampliada com gaveteiro e suporte de ferramentas: revela 1 teste automaticamente na triagem, aumenta a velocidade e reduz multas em 25%!',
    category: 'workbench'
  },
  {
    id: 'workbench_lvl3', level: 3, name: '🔬 Bancada Industrial c/ Osciloscópio & Suporte Duplo (Nv. 3)', price: 110000, minRep: 70,
    icon: '🔬',
    desc: 'Estação industrial ampliada com teclado de teste, osciloscópio e gavetas duplas: revela 2 testes na triagem, dá +R$ 450 de bônus por conserto e reduz multas em 50%!',
    category: 'workbench'
  },
  {
    id: 'workbench_lvl4', level: 4, name: '⚡ Super Estação Master c/ Monitor 4K & Banqueta (Nv. 4)', price: 225000, minRep: 70,
    icon: '⚡',
    desc: 'Estação definitiva de engenharia com monitor 4K, organizador SMD e banqueta ergonômica: revela TODOS os testes de diagnóstico, dá +R$ 1.000 de bônus em cada chamado, +15% de reputação e reduz multas em 70%!',
    category: 'workbench'
  },
  // ================= EXPANSÕES DA LOJA SOLO (ATÉ 5X COM REPUTAÇÃO MÍNIMA 80%) =================
  {
    id: 'solo_expansion_2', tier: 2, name: '🏢 Ampliação da Cabine #01 (Nível 1)', price: 17500, minRep: 70,
    icon: '🏢',
    desc: 'Aumenta e expande a largura da sua sala técnica principal (Cabine #01), garantindo mais espaço para bancadas e trânsito livre! (Requer 80% de Reputação)',
    category: 'expansion'
  },
  {
    id: 'solo_expansion_3', tier: 3, name: '🔬 Mega Cabine Técnica #01 VIP (Nível 2)', price: 42500, minRep: 70,
    icon: '🔬',
    desc: 'Amplia ao máximo a sua Cabine #01, transformando-a em uma super oficina executiva com espaço duplo e acabamento VIP! (Requer 80% de Reputação)',
    category: 'expansion'
  },
  {
    id: 'solo_expansion_4', tier: 4, name: '📦 Ampliação do Estoque Lateral (Nível 1)', price: 90000, minRep: 70,
    icon: '📦',
    desc: 'Aumenta e expande a sala lateral de estoque, adicionando corredores mais largos e novas estantes de peças avançadas! (Requer 80% de Reputação)',
    category: 'expansion'
  },
  {
    id: 'solo_expansion_5', tier: 5, name: '🗄️ Mega Almoxarifado de Peças & Suprimentos (Nível 2)', price: 190000, minRep: 70,
    icon: '🗄️',
    desc: 'Expande o estoque lateral ao tamanho máximo com 4 grandes estantes industriais, espaço para pallets e suprimentos ilimitados! (Requer 80% de Reputação)',
    category: 'expansion'
  }
];`;

if (!oldCatalogRegex.test(gameCode)) {
  console.error('ERROR: oldCatalogRegex did not match!');
  process.exit(1);
}
gameCode = gameCode.replace(oldCatalogRegex, newCatalog);
console.log('SHOP_CATALOG replaced successfully!');

// 2. Add ac_lvl1, ac_lvl2, ac_lvl3 to upgrades in state definition
if (!gameCode.includes('ac_lvl1: false,')) {
  gameCode = gameCode.replace('ac_split: false,', 'ac_split: false,\n    ac_lvl1: false,\n    ac_lvl2: false,\n    ac_lvl3: false,');
  console.log('Upgrades in state updated!');
}

// 3. Update buyShopItem for ac_lvl1, ac_lvl2, ac_lvl3
const buyOld = `  } else if (item.id === 'rack_refill') {
    state.rackParts = Math.min(state.rackCapacity, (state.rackParts || 0) + 8);
    showToast('📦 +8 Peças adicionadas ao seu Rack! (Total: ' + state.rackParts + '/' + state.rackCapacity + ')');
  } else {`;

const buyNew = `  } else if (item.id === 'rack_refill') {
    state.rackParts = Math.min(state.rackCapacity, (state.rackParts || 0) + 8);
    showToast('📦 +8 Peças adicionadas ao seu Rack! (Total: ' + state.rackParts + '/' + state.rackCapacity + ')');
  } else if (item.id === 'ac_lvl1') {
    state.upgrades.ac_lvl1 = true;
    state.upgrades.ac_split = true;
    refreshMapsWithUpgrades();
    rebuildColliders();
    showToast('❄️ Ar-Condicionado Split Nível 1 instalado com sucesso!');
  } else if (item.id === 'ac_lvl2') {
    state.upgrades.ac_lvl2 = true;
    refreshMapsWithUpgrades();
    rebuildColliders();
    showToast('❄️ Ar-Condicionado Inverter Nível 2 instalado com sucesso!');
  } else if (item.id === 'ac_lvl3') {
    state.upgrades.ac_lvl3 = true;
    refreshMapsWithUpgrades();
    rebuildColliders();
    showToast('❄️ Ar-Condicionado Torre VIP Nível 3 instalado com sucesso!');
  } else {`;

if (gameCode.includes(buyOld)) {
  gameCode = gameCode.replace(buyOld, buyNew);
  console.log('buyShopItem updated!');
} else {
  console.log('buyOld pattern not found, checking if already updated...');
}

// 4. Update updateHUD to dynamically update #session-team-counter
const hudOld = `  // Atualiza barra de botões de jogadores na partida (1 a 4) e de teste da loja
  document.querySelectorAll('#session-players-bar [data-match-players]').forEach(btn => {
    btn.classList.toggle('active', Number(btn.dataset.matchPlayers) === curPCount);
  });`;

const hudNew = `  // Atualiza badge de equipe na oficina dinamicamente conforme jogadores entram
  const teamCounterEl = document.getElementById('session-team-counter');
  if (teamCounterEl) {
    if (curPCount === 1) {
      teamCounterEl.innerHTML = '👤 <b>1 Técnico</b> (Apenas Você)';
      teamCounterEl.className = 'team-counter-badge solo';
    } else if (curPCount === 2) {
      teamCounterEl.innerHTML = '👥 <b>2 Técnicos Online</b> (Você + 1 Colega)';
      teamCounterEl.className = 'team-counter-badge duo';
    } else if (curPCount === 3) {
      teamCounterEl.innerHTML = '👥 <b>3 Técnicos Online</b> (Você + 2 Colegas)';
      teamCounterEl.className = 'team-counter-badge trio';
    } else {
      teamCounterEl.innerHTML = '👥 <b>4 Técnicos Online</b> (Oficina Cheia 4P)';
      teamCounterEl.className = 'team-counter-badge full';
    }
  }
  document.querySelectorAll('#session-players-bar [data-match-players]').forEach(btn => {
    btn.classList.toggle('active', Number(btn.dataset.matchPlayers) === curPCount);
  });`;

if (gameCode.includes(hudOld)) {
  gameCode = gameCode.replace(hudOld, hudNew);
  console.log('updateHUD updated!');
} else {
  // Try CRLF version
  const hudOldCRLF = hudOld.replace(/\n/g, '\r\n');
  if (gameCode.includes(hudOldCRLF)) {
    gameCode = gameCode.replace(hudOldCRLF, hudNew.replace(/\n/g, '\r\n'));
    console.log('updateHUD updated (CRLF)!');
  } else {
    console.error('ERROR: hudOld pattern not found!');
  }
}

fs.writeFileSync('game.js', gameCode, 'utf8');
console.log('game.js saved successfully!');
