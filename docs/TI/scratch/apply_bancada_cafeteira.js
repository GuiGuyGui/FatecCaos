const fs = require('fs');

console.log("Reading game.js...");
let content = fs.readFileSync('game.js', 'utf8');

// 1. Inserir carregamento das imagens de Asset no topo
const assetLoaderCode = `
// ============================================================================
// CARREGAMENTO DOS ASSETS GRÁFICOS (BANCADA E CAFETEIRA)
// ============================================================================
const ASSET_IMAGES = {
  workbench_lvl1: typeof Image !== 'undefined' ? new Image() : null,
  workbench_lvl2: typeof Image !== 'undefined' ? new Image() : null,
  workbench_lvl3: typeof Image !== 'undefined' ? new Image() : null,
  workbench_lvl4: typeof Image !== 'undefined' ? new Image() : null,
  coffee_machine: typeof Image !== 'undefined' ? new Image() : null
};

if (typeof Image !== 'undefined') {
  ASSET_IMAGES.workbench_lvl1.src = 'assets/workbench_lvl1.png';
  ASSET_IMAGES.workbench_lvl2.src = 'assets/workbench_lvl2.png';
  ASSET_IMAGES.workbench_lvl3.src = 'assets/workbench_lvl3.png';
  ASSET_IMAGES.workbench_lvl4.src = 'assets/workbench_lvl4.png';
  ASSET_IMAGES.coffee_machine.src = 'assets/coffee_machine.png';
}
`;

if (!content.includes('ASSET_IMAGES')) {
  content = content.replace("const SHOP_CATALOG = [", assetLoaderCode + "\nconst SHOP_CATALOG = [");
  console.log("Asset loader inserted!");
}

// 2. Atualizar SHOP_CATALOG: Substituir pro_bench pelas 3 atualizações da Bancada (com preços altos)
const oldShopItems = `  {
    id: 'pro_bench',
    name: '🔬 Bancada Dourada Pro c/ Osciloscópio',
    price: 1500,
    icon: '🔬',
    desc: 'Atualiza sua bancada: revela 1 teste de TI automaticamente em cada chamado e reduz multas de queima pela metade!',
    category: 'furniture'
  },`;

const newShopItems = `  // ================= ATUALIZAÇÕES DA BANCADA DE TRABALHO (PREÇOS ALTOS E BENEFÍCIOS) =================
  {
    id: 'workbench_lvl2',
    level: 2,
    name: '🔧 Bancada Técnica c/ Painel & Gaveteiro (Nv. 2)',
    price: 8500,
    minRep: 75,
    icon: '🔧',
    desc: 'Bancada técnica ampliada com gaveteiro e suporte de ferramentas: revela 1 teste automaticamente na triagem, aumenta a velocidade e reduz multas em 25%!',
    category: 'workbench'
  },
  {
    id: 'workbench_lvl3',
    level: 3,
    name: '🔬 Bancada Industrial c/ Osciloscópio & Suporte Duplo (Nv. 3)',
    price: 22000,
    minRep: 80,
    icon: '🔬',
    desc: 'Estação industrial ampliada com teclado de teste, osciloscópio e gavetas duplas: revela 2 testes na triagem, dá +R$ 450 de bônus por conserto e reduz multas em 50%!',
    category: 'workbench'
  },
  {
    id: 'workbench_lvl4',
    level: 4,
    name: '⚡ Super Estação Master c/ Monitor 4K & Banqueta (Nv. 4)',
    price: 45000,
    minRep: 85,
    icon: '⚡',
    desc: 'Estação definitiva de engenharia com monitor 4K, organizador SMD e banqueta ergonômica: revela TODOS os testes de diagnóstico, dá +R$ 1.000 de bônus em cada chamado, +15% de reputação e reduz multas em 70%!',
    category: 'workbench'
  },`;

if (content.includes(oldShopItems)) {
  content = content.replace(oldShopItems, newShopItems);
  console.log("Shop items for workbench upgrades inserted!");
}

// 3. Atualizar initial state para ter workbenchLevel: 1 e upgrades correspondentes
content = content.replace(
  "pro_bench: false,",
  "pro_bench: false,\n    workbench_lvl2: false,\n    workbench_lvl3: false,\n    workbench_lvl4: false,"
);
content = content.replace(
  "activeTab: 'triagem',",
  "activeTab: 'triagem',\n  workbenchLevel: 1,"
);

// 4. Funções de desenho da Bancada e da Cafeteira no Canvas
const drawCustomGraphics = `
// ============================================================================
// DESENHO GRÁFICO DA BANCADA E DA CAFETEIRA USANDO ASSETS PNG
// ============================================================================
function drawWorkbenchGraphic(ctx, f) {
  const benchLvl = state.workbenchLevel || 1;
  const imgKey = \`workbench_lvl\${benchLvl}\`;
  const img = ASSET_IMAGES ? (ASSET_IMAGES[imgKey] || ASSET_IMAGES.workbench_lvl1) : null;

  // Sombra suave no chão
  ctx.fillStyle = 'rgba(15, 37, 51, 0.28)';
  ctx.beginPath();
  ctx.roundRect(f.x + 4, f.y + 6, f.w, f.h, 10);
  ctx.fill();

  if (img && img.complete && img.naturalWidth > 0) {
    ctx.drawImage(img, f.x, f.y, f.w, f.h);
  } else {
    ctx.fillStyle = '#d97706';
    ctx.strokeStyle = '#1c3144';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.roundRect(f.x, f.y, f.w, f.h, 8);
    ctx.fill();
    ctx.stroke();
  }

  // Plaquinha elegante flutuante com o nível da bancada
  const badgeLabels = {
    1: '🛠️ BANCADA #01 [E]',
    2: '🔧 BANCADA TÉCNICA [E]',
    3: '🔬 BANCADA INDUSTRIAL [E]',
    4: '⚡ ESTAÇÃO MASTER [E]'
  };
  const labelText = badgeLabels[benchLvl] || f.label;
  const textW = ctx.measureText ? (ctx.measureText(labelText).width + 16) : 115;
  ctx.fillStyle = 'rgba(15, 37, 51, 0.88)';
  ctx.beginPath();
  ctx.roundRect(f.x + f.w / 2 - textW / 2, f.y - 12, textW, 18, 9);
  ctx.fill();
  ctx.strokeStyle = benchLvl >= 4 ? '#38bdf8' : (benchLvl >= 3 ? '#ec4899' : (benchLvl >= 2 ? '#4ade80' : '#f9c742'));
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.font = '900 10px Nunito, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(labelText, f.x + f.w / 2, f.y + 1);
  ctx.textAlign = 'left';
}

function drawCoffeeMachineGraphic(ctx, f) {
  const img = ASSET_IMAGES ? ASSET_IMAGES.coffee_machine : null;

  // Sombra suave no chão
  ctx.fillStyle = 'rgba(15, 37, 51, 0.22)';
  ctx.beginPath();
  ctx.roundRect(f.x + 3, f.y + 5, f.w, f.h, 8);
  ctx.fill();

  if (img && img.complete && img.naturalWidth > 0) {
    ctx.drawImage(img, f.x, f.y, f.w, f.h);
  } else {
    ctx.fillStyle = '#78350f';
    ctx.strokeStyle = '#1c3144';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(f.x, f.y, f.w, f.h, 8);
    ctx.fill();
    ctx.stroke();
  }

  // Plaquinha elegante da cafeteira
  const labelText = f.label || '☕ Cafeteira [E]';
  const textW = ctx.measureText ? (ctx.measureText(labelText).width + 14) : 90;
  ctx.fillStyle = 'rgba(15, 37, 51, 0.85)';
  ctx.beginPath();
  ctx.roundRect(f.x + f.w / 2 - textW / 2, f.y - 10, textW, 16, 8);
  ctx.fill();
  ctx.strokeStyle = '#f97316';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = '#fef08a';
  ctx.font = '800 9.5px Nunito, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(labelText, f.x + f.w / 2, f.y + 2);
  ctx.textAlign = 'left';
}
`;

if (!content.includes('function drawWorkbenchGraphic')) {
  content = content.replace("function drawCentralRackChassis(ctx, f) {", drawCustomGraphics + "\nfunction drawCentralRackChassis(ctx, f) {");
  console.log("drawWorkbenchGraphic and drawCoffeeMachineGraphic inserted!");
}

// 5. Inserir chamadas no render loop de furniture
const oldFurnitureRender = `      room.furniture.forEach(f => {
        if (f.type === 'central_rack') {
          drawCentralRackChassis(ctx, f);
          return;
        }`;

const newFurnitureRender = `      room.furniture.forEach(f => {
        if (f.type === 'central_rack') {
          drawCentralRackChassis(ctx, f);
          return;
        }

        if (f.type === 'workbench') {
          drawWorkbenchGraphic(ctx, f);
          return;
        }

        if (f.type === 'coffee') {
          drawCoffeeMachineGraphic(ctx, f);
          return;
        }`;

if (content.includes(oldFurnitureRender)) {
  content = content.replace(oldFurnitureRender, newFurnitureRender);
  console.log("Furniture render calls updated!");
}

// 6. Atualizar buildOfflineMap para posicionar bancada progressiva e cafeteira no estoque / sala
const buildOfflineStart = content.indexOf('function buildOfflineMap(overrideCount) {');
const buildOfflineEnd = content.indexOf('function rebuildQueueForCurrentMode() {');

if (buildOfflineStart !== -1 && buildOfflineEnd !== -1) {
  const newBuildOffline = `function buildOfflineMap(overrideCount) {
  const soloTier = state.soloExpansionTier || 1;
  const benchLvl = state.workbenchLevel || 1;

  // 1ª e 2ª expansões aumentam o tamanho da Cabine #01 (nossa sala técnica):
  let myRoomW = 320;
  if (soloTier === 2) myRoomW = 420; // +100px na 1ª expansão
  else if (soloTier >= 3) myRoomW = 510; // +190px na 2ª expansão

  // 3ª e 4ª expansões aumentam a sala lateral do estoque:
  let stockW = 320;
  if (soloTier === 4) stockW = 420; // +100px na 3ª expansão
  else if (soloTier >= 5) stockW = 510; // +190px na 4ª expansão (Mega Almoxarifado)

  const recW = 380;
  const myRoomX = 70;
  const recX = myRoomX + myRoomW + 15;
  const stockX = recX + recW + 15;
  const totalW = Math.max(1260, stockX + stockW + 70);
  const totalH = 1040;

  // Tamanho progressivo da bancada técnica
  let benchW = 180;
  let benchH = 104; // Nível 1
  if (benchLvl === 2) { benchW = 200; benchH = 115; }
  else if (benchLvl === 3) { benchW = 220; benchH = 125; }
  else if (benchLvl >= 4) { benchW = 245; benchH = 135; }

  const benchLabels = {
    1: '🛠️ SUA BANCADA #01 [E]',
    2: '🔧 BANCADA TÉCNICA [E]',
    3: '🔬 BANCADA INDUSTRIAL [E]',
    4: '⚡ ESTAÇÃO MASTER [E]'
  };

  // Mobília da Cabine #01 (Expansível nos Tiers 2 e 3)
  const furnitureMyRoom = [
    {
      type: 'workbench',
      x: myRoomX + 35, y: 505, w: benchW, h: benchH,
      label: benchLabels[benchLvl] || '🛠️ SUA BANCADA #01 [E]',
      color: '#d97706',
      solid: true
    },
    { type: 'chair', x: myRoomX + benchW + 45, y: 545, w: 48, h: 48, label: 'Cliente', color: '#f9c742', solid: false }
  ];

  // Cafeteira: colocada na sala de estoque inicialmente; passa para nossa sala quando expandirmos (soloTier >= 2)
  if (soloTier >= 2) {
    furnitureMyRoom.push({
      type: 'coffee',
      x: myRoomX + 35, y: 885, w: 90, h: 72,
      label: '☕ Cafeteira [E]',
      color: '#78350f',
      solid: true
    });
  }

  if (state.rackCapacity > 0) {
    furnitureMyRoom.push({
      type: 'rack',
      x: myRoomX + 35, y: 645, w: 155, h: 52,
      label: \`🗄️ Seu Rack (\${state.rackParts}/\${state.rackCapacity})\`,
      color: '#4f46e5',
      solid: true
    });
  }
  if (state.upgrades.ac_split) {
    furnitureMyRoom.push({
      type: 'ac',
      x: myRoomX + 105, y: 468, w: 110, h: 24,
      label: '❄️ Split 24k',
      color: '#0284c7',
      solid: false
    });
  }
  if (soloTier >= 2) {
    furnitureMyRoom.push({
      type: 'shelf',
      x: myRoomX + 255, y: 505, w: 140, h: 56,
      label: '🧰 Bancada Auxiliar & Testes',
      color: '#0d9488',
      solid: true
    });
  }
  if (soloTier >= 3) {
    furnitureMyRoom.push({
      type: 'sofa',
      x: myRoomX + 235, y: 865, w: 170, h: 54,
      label: '🛋️ Sofá VIP Executivo',
      color: '#e5534b',
      solid: true
    });
    furnitureMyRoom.push({
      type: 'shelf',
      x: myRoomX + 235, y: 730, w: 150, h: 52,
      label: '🔬 Estação Dupla Micro-Solda',
      color: '#6366f1',
      solid: true
    });
  }

  // Mobília do Estoque Lateral (Expansível nos Tiers 4 e 5)
  const furnitureStock = [
    { type: 'shelf', x: stockX + 40, y: 505, w: 220, h: 56, label: '📦 Armário de Kits [E]', color: '#1fa6b8', solid: true },
    { type: 'shelf', x: stockX + 40, y: 885, w: 220, h: 56, label: '🗄️ Encher Seu Rack [E]', color: '#4bb56b', solid: true }
  ];

  // Se a loja ainda NÃO expandiu a nossa sala (soloTier === 1), a cafeteira fica no estoque!
  if (soloTier === 1) {
    furnitureStock.push({
      type: 'coffee',
      x: stockX + 40, y: 700, w: 90, h: 72,
      label: '☕ Cafeteira [E]',
      color: '#78350f',
      solid: true
    });
  }

  if (soloTier >= 4) {
    furnitureStock.push({
      type: 'shelf',
      x: stockX + 275, y: 505, w: 125, h: 140,
      label: '⚡ Estante BGA & Servidores',
      color: '#8b5cf6',
      solid: true
    });
  }
  if (soloTier >= 5) {
    furnitureStock.push({
      type: 'shelf',
      x: stockX + 275, y: 720, w: 175, h: 130,
      label: '👑 Almoxarifado Industrial 100G',
      color: '#0f766e',
      solid: true
    });
  }

  // Ala Superior dos outros 3 jogadores (acima da nossa, com acesso pelo norte do Rack Central)
  const p2Active = !!state.players[1]?.connected;
  const p3Active = !!state.players[2]?.connected;
  const p4Active = !!state.players[3]?.connected;
  const hasEmployees = p2Active || p3Active || p4Active;

  const wStation = Math.floor((totalW - 200) / 3);
  const hUpper = 230;
  const yUpper = 25;
  const x02 = 70;
  const x03 = x02 + wStation + 30;
  const x04 = x03 + wStation + 30;

  const rooms = [
    // 1. CABINE #01 DO JOGADOR
    {
      id: 'my_room',
      name: soloTier >= 3 ? '👑 Cabine #01 VIP (Sua Sede Master)' : (soloTier === 2 ? '🏢 Cabine #01 Ampliada (Sua Bancada)' : '🛠️ Cabine #01 (Sua Bancada)'),
      x: myRoomX, y: 460, w: myRoomW, h: 520,
      floorColor: '#e4f8fa', gridColor: '#cdeef2', borderColor: '#1fa6b8',
      hasWalls: true, doorSide: 'right', doorOffset: 260, doorWidth: 125,
      doorInside: { x: myRoomX + myRoomW - 45, y: 720 },
      doorOutside: { x: myRoomX + myRoomW + 35, y: 720 },
      furniture: furnitureMyRoom
    },

    // 2. RECEPÇÃO & TRIAGEM GERAL (No centro do térreo, com Porta da Rua na base)
    {
      id: 'main_store',
      name: '🛎️ Recepção & Triagem Geral',
      x: recX, y: 460, w: recW, h: 520,
      floorColor: '#ffffff', gridColor: '#edf7f8', borderColor: '#f9c742',
      hasWalls: false,
      furniture: [
        { type: 'counter', x: recX + recW - 140, y: 580, w: 105, h: 56, label: '🛎️ Balcão [E]', color: '#f97316', solid: true },
        { type: 'waiting', x: recX + 35, y: 520, w: 160, h: 48, label: 'Fila de Espera #1', color: '#e0f2fe', solid: false },
        { type: 'waiting', x: recX + 35, y: 585, w: 160, h: 48, label: 'Fila de Espera #2', color: '#e0f2fe', solid: false },
        { type: 'waiting', x: recX + 35, y: 650, w: 160, h: 48, label: 'Fila de Espera #3', color: '#e0f2fe', solid: false },
        { type: 'waiting', x: recX + 35, y: 715, w: 160, h: 48, label: 'Fila de Espera #4', color: '#e0f2fe', solid: false },
        { type: 'waiting', x: recX + 35, y: 780, w: 160, h: 48, label: 'Fila de Espera #5', color: '#e0f2fe', solid: false }
      ]
    },

    // 3. ESTOQUE DE PEÇAS / ALMOXARIFADO LATERAL
    {
      id: 'stock_room',
      name: soloTier >= 5 ? '👑 Mega Almoxarifado Industrial' : (soloTier === 4 ? '📦 Estoque de Peças Ampliado' : '📦 Estoque de Peças'),
      x: stockX, y: 460, w: stockW, h: 520,
      floorColor: '#eef2ff', gridColor: '#e0e7ff', borderColor: '#6366f1',
      hasWalls: true, doorSide: 'left', doorOffset: 260, doorWidth: 125,
      doorInside: { x: stockX + 45, y: 720 },
      doorOutside: { x: stockX - 35, y: 720 },
      furniture: furnitureStock
    },

    // 4. RACK CENTRAL DE INFRAESTRUTURA (Diretamente no chão normal, sem quadrado escuro)
    {
      id: 'central_rack_offline',
      name: '🗄️ Rack Central de Infraestrutura',
      x: recX + 40, y: 395, w: recW - 80, h: 65,
      floorColor: 'transparent', gridColor: 'transparent', borderColor: 'transparent',
      hasWalls: false,
      furniture: [
        {
          type: 'central_rack',
          x: recX + 50, y: 395, w: recW - 100, h: 65,
          label: '🗄️ RACK CENTRAL DE INFRAESTRUTURA [E]',
          color: '#0f172a',
          solid: true
        }
      ]
    }
  ];

  // Adiciona as salas superiores apenas se houver outros funcionários
  if (hasEmployees) {
    rooms.push(
      {
        id: 'upper_room_2',
        name: p2Active ? '🏢 Estação #02 (Funcionário #02)' : '🏢 Estação #02 (Vaga Aberta p/ Funcionário via Convite)',
        x: x02, y: yUpper, w: wStation, h: hUpper,
        floorColor: p2Active ? '#faf5ff' : '#f8fafc',
        gridColor: p2Active ? '#f3e8ff' : '#e2e8f0',
        borderColor: p2Active ? '#a855f7' : '#94a3b8',
        hasWalls: true, doorSide: 'bottom', doorOffset: Math.floor(wStation / 2) - 50, doorWidth: 100,
        doorInside: { x: x02 + Math.floor(wStation / 2), y: yUpper + hUpper - 35 },
        doorOutside: { x: x02 + Math.floor(wStation / 2), y: yUpper + hUpper + 35 },
        furniture: [
          {
            type: 'workbench',
            x: x02 + 25, y: yUpper + 25, w: 160, h: 54,
            label: p2Active ? '🛠️ BANCADA #02 [E] (Funcionário #02)' : 'Mesa #02 (Aguardando Funcionário via Convite)',
            color: p2Active ? '#a855f7' : '#475569',
            solid: true
          },
          { type: 'chair', x: x02 + 200, y: yUpper + 90, w: 46, h: 46, label: 'Cliente #02', color: p2Active ? '#f9c742' : '#94a3b8', solid: false },
          { type: 'rack', x: x02 + 25, y: yUpper + 90, w: 140, h: 42, label: p2Active ? '🗄️ Rack #02 (8/8)' : '🗄️ Rack #02 (Standby)', color: p2Active ? '#4f46e5' : '#475569', solid: true },
          { type: 'coffee', x: x02 + 25, y: yUpper + 145, w: 120, h: 36, label: '☕ Café #02 [E]', color: '#78350f', solid: true }
        ]
      },
      {
        id: 'upper_room_3',
        name: p3Active ? '🏢 Estação #03 (Funcionário #03)' : '🏢 Estação #03 (Vaga Aberta p/ Funcionário via Convite)',
        x: x03, y: yUpper, w: wStation, h: hUpper,
        floorColor: p3Active ? '#eff6ff' : '#f8fafc',
        gridColor: p3Active ? '#dbeafe' : '#e2e8f0',
        borderColor: p3Active ? '#3b82f6' : '#94a3b8',
        hasWalls: true, doorSide: 'bottom', doorOffset: Math.floor(wStation / 2) - 50, doorWidth: 100,
        doorInside: { x: x03 + Math.floor(wStation / 2), y: yUpper + hUpper - 35 },
        doorOutside: { x: x03 + Math.floor(wStation / 2), y: yUpper + hUpper + 35 },
        furniture: [
          {
            type: 'workbench',
            x: x03 + 25, y: yUpper + 25, w: 160, h: 54,
            label: p3Active ? '🛠️ BANCADA #03 [E] (Funcionário #03)' : 'Mesa #03 (Aguardando Funcionário via Convite)',
            color: p3Active ? '#3b82f6' : '#475569',
            solid: true
          },
          { type: 'chair', x: x03 + 200, y: yUpper + 90, w: 46, h: 46, label: 'Cliente #03', color: p3Active ? '#f9c742' : '#94a3b8', solid: false },
          { type: 'rack', x: x03 + 25, y: yUpper + 90, w: 140, h: 42, label: p3Active ? '🗄️ Rack #03 (8/8)' : '🗄️ Rack #03 (Standby)', color: p3Active ? '#4f46e5' : '#475569', solid: true },
          { type: 'coffee', x: x03 + 25, y: yUpper + 145, w: 120, h: 36, label: '☕ Café #03 [E]', color: '#78350f', solid: true }
        ]
      },
      {
        id: 'upper_room_4',
        name: p4Active ? '🏢 Estação #04 (Funcionário #04)' : '🏢 Estação #04 (Vaga Aberta p/ Funcionário via Convite)',
        x: x04, y: yUpper, w: wStation, h: hUpper,
        floorColor: p4Active ? '#ecfdf5' : '#f8fafc',
        gridColor: p4Active ? '#d1fae5' : '#e2e8f0',
        borderColor: p4Active ? '#10b981' : '#94a3b8',
        hasWalls: true, doorSide: 'bottom', doorOffset: Math.floor(wStation / 2) - 50, doorWidth: 100,
        doorInside: { x: x04 + Math.floor(wStation / 2), y: yUpper + hUpper - 35 },
        doorOutside: { x: x04 + Math.floor(wStation / 2), y: yUpper + hUpper + 35 },
        furniture: [
          {
            type: 'workbench',
            x: x04 + 25, y: yUpper + 25, w: 160, h: 54,
            label: p4Active ? '🛠️ BANCADA #04 [E] (Funcionário #04)' : 'Mesa #04 (Aguardando Funcionário via Convite)',
            color: p4Active ? '#10b981' : '#475569',
            solid: true
          },
          { type: 'chair', x: x04 + 200, y: yUpper + 90, w: 46, h: 46, label: 'Cliente #04', color: p4Active ? '#f9c742' : '#94a3b8', solid: false },
          { type: 'rack', x: x04 + 25, y: yUpper + 90, w: 140, h: 42, label: p4Active ? '🗄️ Rack #04 (8/8)' : '🗄️ Rack #04 (Standby)', color: p4Active ? '#4f46e5' : '#475569', solid: true },
          { type: 'coffee', x: x04 + 25, y: yUpper + 145, w: 120, h: 36, label: '☕ Café #04 [E]', color: '#78350f', solid: true }
        ]
      }
    );
  }

  // Corredor de transição conectando o norte do Rack Central ao Andar Superior
  const connectors = hasEmployees
    ? [ { x: recX + 60, y: 260, w: recW - 120, h: 135, label: 'Passagem Norte para Andar Superior' } ]
    : [];

  const waitingSlots = [
    { x: recX + 75, y: 545 },
    { x: recX + 75, y: 610 },
    { x: recX + 75, y: 675 },
    { x: recX + 75, y: 740 },
    { x: recX + 75, y: 805 }
  ];

  const coffeePos = (soloTier >= 2)
    ? { x: myRoomX + 80, y: 921, label: '☕ [E] Tomar Café na Sua Sala (+Velocidade Turbo!)' }
    : { x: stockX + 85, y: 736, label: '☕ [E] Tomar Café no Estoque (+Velocidade)' };

  const interactables = [
    { id: 'my_workbench', x: myRoomX + 35 + benchW / 2, y: 505 + benchH / 2, radius: 125, label: \`🛠️ [E] Abrir Sua Bancada (Nv. \${benchLvl})\`, action: () => openWorkbenchModal() },
    { id: 'central_rack', x: recX + recW / 2, y: 430, radius: 155, label: '🗄️ [E] Rack Central de Infraestrutura (10 Puzzles)', action: () => openCentralRackModal() },
    { id: 'reception_counter', x: recX + recW - 140, y: 580, radius: 125, label: '🛎️ [E] Balcão de Recepção e Triagem', action: () => openWorkbenchModal() },
    { id: 'stock_armario_1', x: stockX + 150, y: 535, radius: 120, label: '📦 [E] Abrir Estoque de Peças', action: () => openStockModalUI() },
    { id: 'stock_armario_2', x: stockX + 150, y: 915, radius: 120, label: '🗄️ [E] Encher o Rack da Sua Sala', action: () => refillMyRackFree() },
    { id: 'coffee_machine', x: coffeePos.x, y: coffeePos.y, radius: 105, label: coffeePos.label, action: () => drinkCoffee() }
  ];

  if (hasEmployees) {
    interactables.push(
      {
        id: 'partner_bench_2',
        x: x02 + 105, y: yUpper + 40, radius: 115,
        label: p2Active ? '🛠️ [E] Bancada #02 (Funcionário #02)' : '📋 [E] Mesa #02 (Copiar Convite p/ Funcionário)',
        action: () => {
          if (p2Active) openWorkbenchModal();
          else {
            navigator.clipboard?.writeText(state.roomCode);
            showToast(\`📋 Código de convite [\${state.roomCode}] copiado! Passe para o Funcionário #02 entrar!\`);
          }
        }
      },
      {
        id: 'partner_bench_3',
        x: x03 + 105, y: yUpper + 40, radius: 115,
        label: p3Active ? '🛠️ [E] Bancada #03 (Funcionário #03)' : '📋 [E] Mesa #03 (Copiar Convite p/ Funcionário)',
        action: () => {
          if (p3Active) openWorkbenchModal();
          else {
            navigator.clipboard?.writeText(state.roomCode);
            showToast(\`📋 Código de convite [\${state.roomCode}] copiado! Passe para o Funcionário #03 entrar!\`);
          }
        }
      },
      {
        id: 'partner_bench_4',
        x: x04 + 105, y: yUpper + 40, radius: 115,
        label: p4Active ? '🛠️ [E] Bancada #04 (Funcionário #04)' : '📋 [E] Mesa #04 (Copiar Convite p/ Funcionário)',
        action: () => {
          if (p4Active) openWorkbenchModal();
          else {
            navigator.clipboard?.writeText(state.roomCode);
            showToast(\`📋 Código de convite [\${state.roomCode}] copiado! Passe para o Funcionário #04 entrar!\`);
          }
        }
      }
    );
  }

  return {
    width: totalW,
    height: totalH,
    buildingRect: { x: 50, y: 15, w: totalW - 100, h: totalH - 30 },
    spawn: { x: myRoomX + 160, y: 720 },
    myChairPos: { x: myRoomX + 35 + benchW / 2, y: 505 + benchH + 35 },
    exitPos: { x: recX + recW / 2, y: 955 },
    rooms,
    connectors,
    waitingSlots,
    interactables
  };
}
`;

  content = content.slice(0, buildOfflineStart) + newBuildOffline + '\n' + content.slice(buildOfflineEnd);
  console.log("buildOfflineMap replaced successfully!");
}

// 7. Atualizar buyShopItem e renderShopModal para suportar 'workbench' e desbloqueio do Tier 5 sem travas
const oldBuyShopItemStart = content.indexOf('function buyShopItem(itemId) {');
const oldBuyShopItemEnd = content.indexOf('function refillMyRackFree() {');

if (oldBuyShopItemStart !== -1 && oldBuyShopItemEnd !== -1) {
  const newBuyShopItemCode = `function buyShopItem(itemId) {
  const item = SHOP_CATALOG.find(x => x.id === itemId);
  if (!item) return;

  if (itemId === 'rack_refill' && state.rackCapacity === 0) {
    showToast('⚠️ Compre primeiro o "🗄️ Rack de Peças na Sua Sala" antes de comprar lotes de recarga!');
    return;
  }
  if (itemId === 'rack_refill' && state.rackParts >= state.rackCapacity) {
    showToast('✅ O Rack da sua sala já está 100% cheio!');
    return;
  }

  // Compras de Expansão Solo (Tiers 2, 3, 4 e 5 - Mega Almoxarifado)
  if (item.category === 'expansion') {
    const requiredRep = item.minRep || 80;
    if (state.rep < requiredRep) {
      showToast(\`⭐ Reputação insuficiente! É necessário pelo menos \${requiredRep}% de Reputação para esta expansão (Sua reputação atual: \${Math.round(state.rep)}%). Atenda clientes com excelência para subir!\`);
      return;
    }
    const currentTier = state.soloExpansionTier || 1;
    if (item.tier <= currentTier) {
      showToast(\`✅ Você já possui a Expansão Nível \${item.tier}x desbloqueada!\`);
      return;
    }
    if (item.tier > currentTier + 1) {
      showToast(\`⚠️ Compre primeiro a Expansão Nível \${currentTier + 1}x antes de adquirir o Nível \${item.tier}x!\`);
      return;
    }
    if (state.money < item.price) {
      showToast(\`⚠️ Saldo insuficiente! Você precisa de R$ \${item.price} (Caixa atual: R$ \${state.money}).\`);
      return;
    }

    state.money -= item.price;
    setSoloExpansionTier(item.tier, true);
    return;
  }

  // Compras de Atualização da Bancada de Trabalho (Níveis 2, 3 e 4)
  if (item.category === 'workbench') {
    const currentLvl = state.workbenchLevel || 1;
    if (item.level <= currentLvl) {
      showToast(\`✅ Você já possui a Bancada Nível \${item.level} instalada!\`);
      return;
    }
    if (item.level > currentLvl + 1) {
      showToast(\`⚠️ Compre primeiro a Bancada Nível \${currentLvl + 1} antes de adquirir o Nível \${item.level}!\`);
      return;
    }
    const requiredRep = item.minRep || 75;
    if (state.rep < requiredRep) {
      showToast(\`⭐ Reputação insuficiente! É necessário \${requiredRep}% de Reputação para esta bancada (Atual: \${Math.round(state.rep)}%).\`);
      return;
    }
    if (state.money < item.price) {
      showToast(\`⚠️ Saldo insuficiente! Você precisa de R$ \${item.price} (Caixa atual: R$ \${state.money}).\`);
      return;
    }

    state.money -= item.price;
    state.workbenchLevel = item.level;
    state.upgrades[item.id] = true;
    state.upgrades.pro_bench = true;

    refreshMapsWithUpgrades();
    rebuildColliders();
    renderShopModal();
    renderAllUI();

    showToast(\`🎉 PARABÉNS! Sua bancada foi atualizada para o Nível \${item.level}!\`);
    addChatMessage('Oficina Técnica', \`🛠️ <b>BANCADA ATUALIZADA:</b> Instalada a \${item.name}! Novos benefícios e visual aprimorado em jogo.\`);
    return;
  }

  if (state.money < item.price) {
    showToast(\`⚠️ Saldo insuficiente! Você precisa de R$ \${item.price} (Caixa atual: R$ \${state.money}).\`);
    return;
  }

  state.money -= item.price;

  if (itemId === 'rack_lvl1') {
    state.upgrades.rack_lvl1 = true;
    state.rackCapacity = Math.max(state.rackCapacity, 8);
    state.rackParts = state.rackCapacity;
    showToast('🗄️ Rack de Peças (8/8) instalado dentro da sua Cabine #01!');
  } else if (itemId === 'rack_lvl2') {
    state.upgrades.rack_lvl1 = true;
    state.upgrades.rack_lvl2 = true;
    state.rackCapacity = 20;
    state.rackParts = 20;
    showToast('🗄️✨ Mega Rack Duplo (20/20 Peças) instalado na sua Cabine #01!');
  } else if (itemId === 'rack_refill') {
    state.rackParts = Math.min(state.rackCapacity, state.rackParts + 8);
    showToast(\`📦 +8 Peças adicionadas ao Rack da sua sala (\${state.rackParts}/\${state.rackCapacity})!\`);
  } else {
    state.upgrades[itemId] = true;
    showToast(\`🎉 Compra concluída: "\${item.name}" instalado na sua sala!\`);
  }

  refreshMapsWithUpgrades();
  rebuildColliders();
  renderShopModal();
  renderAllUI();
}
`;
  content = content.slice(0, oldBuyShopItemStart) + newBuyShopItemCode + '\n' + content.slice(oldBuyShopItemEnd);
  console.log("buyShopItem updated!");
}

// 8. Atualizar renderShopModal para renderizar workbench e categorias
const oldRenderShopStart = content.indexOf('function renderShopModal() {');
const oldRenderShopEnd = content.indexOf('function openStockModalUI() {');

if (oldRenderShopStart !== -1 && oldRenderShopEnd !== -1) {
  const newRenderShopModal = `function renderShopModal() {
  document.getElementById('shop-money-display').textContent = \`💰 Caixa: R$ \${state.money}\`;
  const grid = document.getElementById('shop-items-grid');

  grid.innerHTML = SHOP_CATALOG.map(item => {
    const isExpansion = item.category === 'expansion';
    const isWorkbench = item.category === 'workbench';
    const currentTier = state.soloExpansionTier || 1;
    const currentBenchLvl = state.workbenchLevel || 1;

    let isOwned = item.id !== 'rack_refill' && !!state.upgrades[item.id];
    if (isExpansion) isOwned = item.tier <= currentTier;
    if (isWorkbench) isOwned = item.level <= currentBenchLvl;

    const repOk = !item.minRep || state.rep >= item.minRep;
    const isLockedByTier = isExpansion && item.tier > currentTier + 1;
    const isLockedByBench = isWorkbench && item.level > currentBenchLvl + 1;

    let btnLabel = \`🛒 Comprar por R$ \${item.price}\`;
    if (isOwned) {
      btnLabel = isExpansion ? \`✓ Expansão \${item.tier}x Ativa\` : (isWorkbench ? \`✓ Bancada Nv.\${item.level} Ativa\` : '✓ Instalado na Sua Sala');
    } else if (item.id === 'rack_refill') {
      btnLabel = \`📦 Abastecer Rack (+8 Peças) · R$ \${item.price}\`;
    } else if (isExpansion) {
      if (isLockedByTier) {
        btnLabel = \`🔒 Requer Nível \${item.tier - 1}x Primeiro\`;
      } else if (!repOk) {
        btnLabel = \`🔒 Requer \${item.minRep}% Reputação (\${Math.round(state.rep)}% Atual)\`;
      } else {
        btnLabel = \`🚀 Expandir Loja p/ \${item.tier}x · R$ \${item.price}\`;
      }
    } else if (isWorkbench) {
      if (isLockedByBench) {
        btnLabel = \`🔒 Requer Bancada Nv.\${item.level - 1} Primeiro\`;
      } else if (!repOk) {
        btnLabel = \`🔒 Requer \${item.minRep}% Reputação (\${Math.round(state.rep)}% Atual)\`;
      } else {
        btnLabel = \`🛠️ Atualizar Bancada p/ Nv.\${item.level} · R$ \${item.price}\`;
      }
    }

    const canBuy = !isOwned &&
      (!isExpansion || (repOk && !isLockedByTier)) &&
      (!isWorkbench || (repOk && !isLockedByBench)) &&
      (state.money >= item.price || item.id === 'rack_refill');

    const repBadge = item.minRep
      ? \`<div style="font-size:11px; font-weight:800; padding:2px 8px; border-radius:99px; margin-top:2px; display:inline-flex; width:fit-content; background:\${repOk ? 'rgba(75,181,107,0.18)' : 'rgba(229,83,75,0.18)'}; color:\${repOk ? 'var(--verde-e)' : 'var(--vermelho)'};">
           \${repOk ? \`⭐ Reputação \${Math.round(state.rep)}% (Mínimo \${item.minRep}% ✓)\` : \`🔒 Requer \${item.minRep}% Reputação (Atual: \${Math.round(state.rep)}%)\`}
         </div>\`
      : '';

    return \`
      <div class="stock-item-card \${isOwned ? 'owned' : ''}">
        <div style="font-weight:900; font-size:14px; color:var(--tinta); display:flex; justify-content:space-between; gap:6px;">
          <span>\${item.name}</span>
          <span style="color:\${isOwned ? 'var(--verde)' : 'var(--teal-e)'}; white-space:nowrap;">
            \${isOwned ? '✓ Desbloqueado' : \`R$ \${item.price}\`}
          </span>
        </div>
        \${repBadge}
        <div style="font-size:12px; font-weight:700; color:var(--suave); flex:1; margin:4px 0;">\${item.desc}</div>
        <button type="button" class="btn \${isOwned ? 'btn-verde' : (canBuy ? 'btn-amarelo' : 'btn-vidro')} btn-sm btn-buy-shop" data-shop="\${item.id}" \${isOwned || (isExpansion && (!repOk || isLockedByTier)) || (isWorkbench && (!repOk || isLockedByBench)) ? 'disabled' : ''}>
          \${btnLabel}
        </button>
      </div>
    \`;
  }).join('');

  grid.querySelectorAll('.btn-buy-shop').forEach(btn => {
    btn.addEventListener('click', () => buyShopItem(btn.dataset.shop));
  });
}
`;
  content = content.slice(0, oldRenderShopStart) + newRenderShopModal + '\n' + content.slice(oldRenderShopEnd);
  console.log("renderShopModal updated!");
}

// 9. Corrigir limitação de soloTier a 4 no HUD
content = content.replace(
  "const soloTier = Math.min(4, state.soloExpansionTier || 1);",
  "const soloTier = Math.min(5, state.soloExpansionTier || 1);"
);
content = content.replace(
  "const activeRooms = Math.min(4, Math.max(curPCount, soloTier));",
  "const activeRooms = Math.min(5, Math.max(curPCount, soloTier));"
);

// 10. Benefícios de conserto e multas com a bancada melhorada
content = content.replace(
  "if (state.upgrades.ac_split) baseReward += 200;",
  `if (state.upgrades.ac_split) baseReward += 200;
  const benchLvl = state.workbenchLevel || 1;
  if (benchLvl === 2) baseReward += 200;
  else if (benchLvl === 3) baseReward += 450;
  else if (benchLvl >= 4) { baseReward += 1000; repGain += 15; }`
);

content = content.replace(
  "const penalty = state.upgrades.pro_bench ? 900 : 1800;",
  `let penalty = 1800;
    const benchLvl = state.workbenchLevel || 1;
    if (benchLvl >= 4) penalty = Math.round(penalty * 0.30);
    else if (benchLvl === 3) penalty = Math.round(penalty * 0.50);
    else if (benchLvl === 2) penalty = Math.round(penalty * 0.75);
    else if (state.upgrades.pro_bench) penalty = 900;`
);

// Velocidade com a bancada
content = content.replace(
  "const baseSpeed = state.upgrades.my_coffee ? 5.8 : 4.8;",
  `let baseSpeed = state.upgrades.my_coffee ? 6.2 : 4.8;
    const benchLvl = state.workbenchLevel || 1;
    if (benchLvl >= 4) baseSpeed += 1.2;
    else if (benchLvl >= 3) baseSpeed += 0.8;
    else if (benchLvl >= 2) baseSpeed += 0.4;`
);

fs.writeFileSync('game.js', content);
console.log("game.js updated successfully! New length:", content.length);
