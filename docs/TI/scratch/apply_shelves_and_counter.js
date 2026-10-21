const fs = require('fs');

let code = fs.readFileSync('game.js', 'utf8');

// 1. Update ASSET_IMAGES to include new shelf strips and reception counter
const oldAssetImages = `const ASSET_IMAGES = {
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
}`;

const newAssetImages = `const ASSET_IMAGES = {
  workbench_lvl1: typeof Image !== 'undefined' ? new Image() : null,
  workbench_lvl2: typeof Image !== 'undefined' ? new Image() : null,
  workbench_lvl3: typeof Image !== 'undefined' ? new Image() : null,
  workbench_lvl4: typeof Image !== 'undefined' ? new Image() : null,
  coffee_machine: typeof Image !== 'undefined' ? new Image() : null,
  shelves_sm_strip: typeof Image !== 'undefined' ? new Image() : null,
  shelves_lg_strip: typeof Image !== 'undefined' ? new Image() : null,
  reception_counter: typeof Image !== 'undefined' ? new Image() : null
};

if (typeof Image !== 'undefined') {
  ASSET_IMAGES.workbench_lvl1.src = 'assets/workbench_lvl1.png';
  ASSET_IMAGES.workbench_lvl2.src = 'assets/workbench_lvl2.png';
  ASSET_IMAGES.workbench_lvl3.src = 'assets/workbench_lvl3.png';
  ASSET_IMAGES.workbench_lvl4.src = 'assets/workbench_lvl4.png';
  ASSET_IMAGES.coffee_machine.src = 'assets/coffee_machine.png';
  ASSET_IMAGES.shelves_sm_strip.src = 'assets/shelves_sm_strip.png';
  ASSET_IMAGES.shelves_lg_strip.src = 'assets/shelves_lg_strip.png';
  ASSET_IMAGES.reception_counter.src = 'assets/reception_counter.png';
}

// Bounding boxes dos 6 armários pequenos (shelves_sm_strip.png)
const SM_SHELF_SPANS = [
  { sx: 18, sy: 2, sw: 129, sh: 186 },   // 0: Planta no topo + Caixas
  { sx: 183, sy: 14, sw: 132, sh: 175 }, // 1: Gabinetes Desktop Gamer
  { sx: 348, sy: 15, sw: 139, sh: 173 }, // 2: Laptops / Notebooks
  { sx: 525, sy: 15, sw: 131, sh: 173 }, // 3: Caixas de Peças & GPUs
  { sx: 687, sy: 15, sw: 152, sh: 175 }, // 4: Placas-Mãe & Coolers
  { sx: 870, sy: 14, sw: 138, sh: 175 }  // 5: Maletas & Gaveteiros Azuis
];

// Bounding boxes das 7 estantes industriais grandes (shelves_lg_strip.png)
const LG_SHELF_SPANS = [
  { sx: 18, sy: 0, sw: 136, sh: 146 },   // 0: Caixas reforçadas & Fans
  { sx: 168, sy: 9, sw: 130, sh: 139 },  // 1: Placas-mãe duplas & Gabinetes
  { sx: 310, sy: 0, sw: 134, sh: 143 },  // 2: Notebooks corporativos
  { sx: 457, sy: 8, sw: 139, sh: 136 },  // 3: Monitores duplos
  { sx: 611, sy: 9, sw: 133, sh: 139 },  // 4: Mouses & Periféricos
  { sx: 758, sy: 9, sw: 137, sh: 139 },  // 5: Servidores NAS & Blades
  { sx: 907, sy: 7, sw: 109, sh: 139 }   // 6: Organizador de Gaveteiros SMD
];

// Bounding box do Balcão de Recepção (reception_counter.png)
const RECEPTION_COUNTER_CROP = { sx: 8, sy: 43, sw: 272, sh: 124 };

function generateSessionShelfVariants() {
  state.sessionShelfVariants = {
    sm: [0, 1, 2, 3, 4, 5].sort(() => Math.random() - 0.5),
    lg: [0, 1, 2, 3, 4, 5, 6].sort(() => Math.random() - 0.5)
  };
}`;

if (code.includes(oldAssetImages)) {
  code = code.replace(oldAssetImages, newAssetImages);
  console.log('ASSET_IMAGES updated with shelf strips and reception counter!');
} else {
  console.log('Warning: oldAssetImages pattern not found!');
}

// 2. Add drawing functions for reception counter and shelves
const drawFunctions = `
function drawReceptionCounterGraphic(ctx, f) {
  const img = ASSET_IMAGES.reception_counter;
  if (img && img.complete && img.naturalWidth) {
    ctx.fillStyle = 'rgba(15, 37, 51, 0.22)';
    ctx.beginPath();
    ctx.roundRect(f.x + 3, f.y + 6, f.w, f.h, 6);
    ctx.fill();

    ctx.drawImage(img, RECEPTION_COUNTER_CROP.sx, RECEPTION_COUNTER_CROP.sy, RECEPTION_COUNTER_CROP.sw, RECEPTION_COUNTER_CROP.sh, f.x, f.y, f.w, f.h);
  } else {
    ctx.fillStyle = 'rgba(15,37,51,0.16)';
    ctx.beginPath();
    ctx.roundRect(f.x + 3, f.y + 5, f.w, f.h, 8);
    ctx.fill();

    ctx.fillStyle = f.color || '#f97316';
    ctx.strokeStyle = '#1c3144';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.roundRect(f.x, f.y, f.w, f.h, 8);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = '800 11px Nunito, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🛎️ Balcão [E]', f.x + f.w / 2, f.y + f.h / 2 + 4);
    ctx.textAlign = 'left';
  }
}

function drawShelfGraphic(ctx, f) {
  const isLarge = f.shelfKind === 'large';
  const img = isLarge ? ASSET_IMAGES.shelves_lg_strip : ASSET_IMAGES.shelves_sm_strip;
  const spans = isLarge ? LG_SHELF_SPANS : SM_SHELF_SPANS;
  const variant = (typeof f.shelfVariant === 'number') ? (f.shelfVariant % spans.length) : 0;
  const span = spans[variant];

  if (img && img.complete && img.naturalWidth && span) {
    ctx.fillStyle = 'rgba(15, 37, 51, 0.22)';
    ctx.beginPath();
    ctx.roundRect(f.x + 2, f.y + 4, f.w, f.h, 6);
    ctx.fill();

    ctx.drawImage(img, span.sx, span.sy, span.sw, span.sh, f.x, f.y, f.w, f.h);
  } else {
    ctx.fillStyle = 'rgba(15,37,51,0.16)';
    ctx.beginPath();
    ctx.roundRect(f.x + 2, f.y + 4, f.w, f.h, 6);
    ctx.fill();

    ctx.fillStyle = f.color || '#1fa6b8';
    ctx.strokeStyle = '#1c3144';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(f.x, f.y, f.w, f.h, 6);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = '800 9px Nunito, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(f.label ? f.label.slice(0, 10) : 'Estante', f.x + f.w / 2, f.y + f.h / 2 + 3);
    ctx.textAlign = 'left';
  }
}
`;

const targetDraw = 'function drawCoffeeMachineGraphic';
code = code.replace(targetDraw, drawFunctions + '\n' + targetDraw);
console.log('drawReceptionCounterGraphic and drawShelfGraphic inserted!');

// 3. Connect drawing calls in drawWorld
const oldWorldDrawCalls = `        if (f.type === 'coffee') {
          drawCoffeeMachineGraphic(ctx, f);
          return;
        }`;

const newWorldDrawCalls = `        if (f.type === 'coffee') {
          drawCoffeeMachineGraphic(ctx, f);
          return;
        }

        if (f.type === 'counter') {
          drawReceptionCounterGraphic(ctx, f);
          return;
        }

        if (f.type === 'shelf') {
          drawShelfGraphic(ctx, f);
          return;
        }`;

code = code.replace(oldWorldDrawCalls, newWorldDrawCalls);
console.log('drawWorld updated with counter and shelf calls!');

// 4. Update buildOfflineMap with the new shelf arrangements and counter
// Find buildOfflineMap function
const startIdx = code.indexOf('function buildOfflineMap(overrideCount) {');
const endIdx = code.indexOf('let solidColliders = [];');

const newBuildOfflineMap = `function buildOfflineMap(overrideCount) {
  const soloTier = state.soloExpansionTier || 1;
  const benchLvl = state.workbenchLevel || 1;

  // Variantes aleatórias de estantes para esta partida (diferentes a cada nova sessão)
  if (!state.sessionShelfVariants) {
    generateSessionShelfVariants();
  }
  const smVars = state.sessionShelfVariants.sm;
  const lgVars = state.sessionShelfVariants.lg;

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

  // Tamanho progressivo da bancada técnica (mantendo proporções do sprite do jogador)
  let benchW = 180;
  let benchH = 104; // Nível 1 inicial
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
      shelfKind: 'small',
      shelfVariant: smVars[2 % smVars.length],
      x: myRoomX + 255, y: 505, w: 70, h: 84,
      label: '🧰 Testes',
      color: '#0d9488',
      solid: true
    });
    furnitureMyRoom.push({
      type: 'shelf',
      shelfKind: 'small',
      shelfVariant: smVars[4 % smVars.length],
      x: myRoomX + 335, y: 505, w: 70, h: 84,
      label: '🧰 Suprimentos',
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
      shelfKind: 'large',
      shelfVariant: lgVars[1 % lgVars.length],
      x: myRoomX + 235, y: 720, w: 84, h: 88,
      label: '🔬 Micro-Solda',
      color: '#6366f1',
      solid: true
    });
    furnitureMyRoom.push({
      type: 'shelf',
      shelfKind: 'large',
      shelfVariant: lgVars[5 % lgVars.length],
      x: myRoomX + 325, y: 720, w: 84, h: 88,
      label: '🔬 Servidores',
      color: '#6366f1',
      solid: true
    });
  }

  // ============================================================================
  // MOBÍLIA DO ESTOQUE: SUBSTITUIÇÃO DOS ARMÁRIOS PELAS ARTES NOVAS
  // 3 a 4 estantes lado a lado com artes diferentes a cada partida!
  // ============================================================================
  const furnitureStock = [];

  // 1. Armários de Kits (Superior): 4 estantes pequenas lado a lado com artes diferentes
  for (let i = 0; i < 4; i++) {
    furnitureStock.push({
      type: 'shelf',
      shelfKind: 'small',
      shelfVariant: smVars[i % smVars.length],
      x: stockX + 22 + i * 70,
      y: 500,
      w: 64,
      h: 84,
      label: i === 1 ? '📦 Kits [E]' : '',
      color: '#1fa6b8',
      solid: true
    });
  }

  // 2. Encher o Rack (Inferior): 4 estantes pequenas lado a lado com artes diferentes
  for (let i = 0; i < 4; i++) {
    furnitureStock.push({
      type: 'shelf',
      shelfKind: 'small',
      shelfVariant: smVars[(i + 4) % smVars.length],
      x: stockX + 22 + i * 70,
      y: 870,
      w: 64,
      h: 84,
      label: i === 1 ? '🗄️ Rack [E]' : '',
      color: '#4bb56b',
      solid: true
    });
  }

  // Se a loja ainda NÃO expandiu a nossa sala (soloTier === 1), a cafeteira fica no estoque!
  if (soloTier === 1) {
    furnitureStock.push({
      type: 'coffee',
      x: stockX + stockW - 105,
      y: 690,
      w: 90,
      h: 72,
      label: '☕ Cafeteira [E]',
      color: '#78350f',
      solid: true
    });
  }

  // ============================================================================
  // ESTANTES EXPANDIDAS (EXPANSÕES 4 E 5: ARTES DA 2ª IMAGEM - MAIORES LADO A LADO)
  // ============================================================================
  if (soloTier >= 4) {
    // Tier 4: Espaço expandido (+100px) - 2 a 3 estantes maiores lado a lado
    for (let i = 0; i < 2; i++) {
      furnitureStock.push({
        type: 'shelf',
        shelfKind: 'large',
        shelfVariant: lgVars[i % lgVars.length],
        x: stockX + 235 + i * 88,
        y: 610,
        w: 82,
        h: 86,
        label: i === 0 ? '⚡ Estantes BGA [E]' : '',
        color: '#8b5cf6',
        solid: true
      });
    }
  }

  if (soloTier >= 5) {
    // Tier 5: Mega Almoxarifado Industrial (+190px) - 4 estantes maiores lado a lado!
    for (let i = 0; i < 4; i++) {
      furnitureStock.push({
        type: 'shelf',
        shelfKind: 'large',
        shelfVariant: lgVars[(i + 2) % lgVars.length],
        x: stockX + 115 + i * 92,
        y: 725,
        w: 84,
        h: 88,
        label: i === 1 ? '👑 Mega Almoxarifado 100G [E]' : '',
        color: '#0f766e',
        solid: true
      });
    }
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

  // Dimensões do Balcão de Recepção (Sprite do jogador)
  const counterW = 135;
  const counterH = 64;
  const counterX = recX + recW - 145;
  const counterY = 575;

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

    // 2. RECEPÇÃO & TRIAGEM GERAL (No centro do térreo, com Balcão novo no mesmo local exato)
    {
      id: 'main_store',
      name: '🛎️ Recepção & Triagem Geral',
      x: recX, y: 460, w: recW, h: 520,
      floorColor: '#ffffff', gridColor: '#edf7f8', borderColor: '#f9c742',
      hasWalls: false,
      furniture: [
        { type: 'counter', x: counterX, y: counterY, w: counterW, h: counterH, label: '🛎️ Balcão [E]', color: '#f97316', solid: true },
        { type: 'waiting', x: recX + 35, y: 520, w: 160, h: 48, label: 'Fila de Espera #1', color: '#e0f2fe', solid: false },
        { type: 'waiting', x: recX + 35, y: 585, w: 160, h: 48, label: 'Fila de Espera #2', color: '#e0f2fe', solid: false },
        { type: 'waiting', x: recX + 35, y: 650, w: 160, h: 48, label: 'Fila de Espera #3', color: '#e0f2fe', solid: false },
        { type: 'waiting', x: recX + 35, y: 715, w: 160, h: 48, label: 'Fila de Espera #4', color: '#e0f2fe', solid: false },
        { type: 'waiting', x: recX + 35, y: 780, w: 160, h: 48, label: 'Fila de Espera #5', color: '#e0f2fe', solid: false },
        { type: 'waiting', x: recX + 35, y: 845, w: 160, h: 48, label: 'Fila de Espera #6', color: '#e0f2fe', solid: false },
        { type: 'counter', x: recX + 25, y: 950, w: recW - 50, h: 22, label: '🚪 Porta de Entrada & Saída da Rua', color: '#0ea5e9', solid: false }
      ]
    },

    // 3. SALA DE ESTOQUE LATERAL (Expansível nos Tiers 4 e 5)
    {
      id: 'stock_room',
      name: soloTier >= 5 ? '👑 Mega Almoxarifado Industrial (Estoque Máximo)' : (soloTier === 4 ? '📦 Almoxarifado Expandido (Estoque Lateral)' : '📦 Sala de Estoque de Peças'),
      x: stockX, y: 460, w: stockW, h: 520,
      floorColor: '#f1fcf7', gridColor: '#d6f5e7', borderColor: '#4bb56b',
      hasWalls: true, doorSide: 'left', doorOffset: 260, doorWidth: 125,
      doorInside: { x: stockX + 45, y: 720 },
      doorOutside: { x: stockX - 35, y: 720 },
      furniture: furnitureStock
    },

    // 4. RACK CENTRAL DE INFRAESTRUTURA
    {
      id: 'central_rack_plaza',
      name: '🗄️⚡ Rack Central & NOC',
      x: recX + 20, y: 380, w: recW - 40, h: 80,
      floorColor: '#ffffff', gridColor: '#ffffff', borderColor: '#38bdf8',
      hasWalls: false,
      furniture: [
        {
          type: 'central_rack',
          x: recX + recW / 2 - 105, y: 385, w: 210, h: 72,
          label: '🗄️⚡ RACK CENTRAL DE INFRAESTRUTURA [E]',
          color: '#0f172a',
          solid: true
        }
      ]
    }
  ];

  if (hasEmployees) {
    rooms.push(
      {
        id: 'employee_station_02',
        name: p2Active ? '👥 Estação #02 (Funcionário Ativo)' : '🔒 Estação #02 (Vaga p/ Funcionário)',
        x: x02, y: yUpper, w: wStation, h: hUpper,
        floorColor: p2Active ? '#fefce8' : '#f8fafc',
        gridColor: p2Active ? '#fef08a' : '#e2e8f0',
        borderColor: p2Active ? '#eab308' : '#94a3b8',
        hasWalls: true, doorSide: 'bottom', doorOffset: Math.floor(wStation / 2), doorWidth: 100,
        doorInside: { x: x02 + Math.floor(wStation / 2), y: yUpper + hUpper - 35 },
        doorOutside: { x: x02 + Math.floor(wStation / 2), y: yUpper + hUpper + 35 },
        furniture: [
          { type: 'workbench', x: x02 + 25, y: yUpper + 35, w: 160, h: 46, label: p2Active ? '🛠️ Bancada #02 [E]' : '🔒 Mesa #02 Vazia', color: '#eab308', solid: true },
          { type: 'chair', x: x02 + 200, y: yUpper + 42, w: 40, h: 40, label: 'C02', color: '#eab308', solid: false }
        ]
      },
      {
        id: 'employee_station_03',
        name: p3Active ? '👥 Estação #03 (Funcionário Ativo)' : '🔒 Estação #03 (Vaga p/ Funcionário)',
        x: x03, y: yUpper, w: wStation, h: hUpper,
        floorColor: p3Active ? '#f5f3ff' : '#f8fafc',
        gridColor: p3Active ? '#ddd6fe' : '#e2e8f0',
        borderColor: p3Active ? '#8b5cf6' : '#94a3b8',
        hasWalls: true, doorSide: 'bottom', doorOffset: Math.floor(wStation / 2), doorWidth: 100,
        doorInside: { x: x03 + Math.floor(wStation / 2), y: yUpper + hUpper - 35 },
        doorOutside: { x: x03 + Math.floor(wStation / 2), y: yUpper + hUpper + 35 },
        furniture: [
          { type: 'workbench', x: x03 + 25, y: yUpper + 35, w: 160, h: 46, label: p3Active ? '🛠️ Bancada #03 [E]' : '🔒 Mesa #03 Vazia', color: '#8b5cf6', solid: true },
          { type: 'chair', x: x03 + 200, y: yUpper + 42, w: 40, h: 40, label: 'C03', color: '#8b5cf6', solid: false }
        ]
      },
      {
        id: 'employee_station_04',
        name: p4Active ? '👥 Estação #04 (Funcionário Ativo)' : '🔒 Estação #04 (Vaga p/ Funcionário)',
        x: x04, y: yUpper, w: wStation, h: hUpper,
        floorColor: p4Active ? '#fff1f2' : '#f8fafc',
        gridColor: p4Active ? '#fecdd3' : '#e2e8f0',
        borderColor: p4Active ? '#f43f5e' : '#94a3b8',
        hasWalls: true, doorSide: 'bottom', doorOffset: Math.floor(wStation / 2), doorWidth: 100,
        doorInside: { x: x04 + Math.floor(wStation / 2), y: yUpper + hUpper - 35 },
        doorOutside: { x: x04 + Math.floor(wStation / 2), y: yUpper + hUpper + 35 },
        furniture: [
          { type: 'workbench', x: x04 + 25, y: yUpper + 35, w: 160, h: 46, label: p4Active ? '🛠️ Bancada #04 [E]' : '🔒 Mesa #04 Vazia', color: '#f43f5e', solid: true },
          { type: 'chair', x: x04 + 200, y: yUpper + 42, w: 40, h: 40, label: 'C04', color: '#f43f5e', solid: false }
        ]
      }
    );
  }

  const waitingSlots = [
    { x: recX + 115, y: 544 },
    { x: recX + 115, y: 609 },
    { x: recX + 115, y: 674 },
    { x: recX + 115, y: 739 },
    { x: recX + 115, y: 804 },
    { x: recX + 115, y: 869 }
  ];

  const connectors = [
    { from: 'my_room', to: 'main_store', x1: myRoomX + myRoomW - 45, y1: 720, x2: recX + 45, y2: 720 },
    { from: 'main_store', to: 'stock_room', x1: recX + recW - 45, y1: 720, x2: stockX + 45, y2: 720 }
  ];

  if (hasEmployees) {
    connectors.push(
      { from: 'employee_station_02', to: 'central_rack_plaza', x1: x02 + Math.floor(wStation / 2), y1: yUpper + hUpper, x2: recX + recW / 2, y2: 380 },
      { from: 'employee_station_03', to: 'central_rack_plaza', x1: x03 + Math.floor(wStation / 2), y1: yUpper + hUpper, x2: recX + recW / 2, y2: 380 },
      { from: 'employee_station_04', to: 'central_rack_plaza', x1: x04 + Math.floor(wStation / 2), y1: yUpper + hUpper, x2: recX + recW / 2, y2: 380 }
    );
  }

  // Posição da cafeteira
  const coffeePos = (soloTier >= 2)
    ? { x: myRoomX + 80, y: 921, label: '☕ [E] Tomar Café Expresso na Sua Sala (+Velocidade)' }
    : { x: stockX + stockW - 60, y: 726, label: '☕ [E] Tomar Café na Sala de Estoque (+Velocidade)' };

  const interactables = [
    { id: 'my_workbench', x: myRoomX + 35 + benchW / 2, y: 505 + benchH / 2, radius: 125, label: \`🛠️ [E] Abrir Sua Bancada (Nv. \${benchLvl})\`, action: () => openWorkbenchModal() },
    { id: 'central_rack', x: recX + recW / 2, y: 420, radius: 155, label: '🗄️ [E] Rack Central de Infraestrutura (10 Puzzles)', action: () => openCentralRackModal() },
    { id: 'reception_counter', x: counterX + counterW / 2, y: counterY + counterH / 2, radius: 130, label: '🛎️ [E] Balcão de Recepção e Triagem', action: () => openWorkbenchModal() },
    { id: 'stock_armario_1', x: stockX + 130, y: 545, radius: 135, label: '📦 [E] Abrir Estoque de Peças (Kits)', action: () => openStockModalUI() },
    { id: 'stock_armario_2', x: stockX + 130, y: 915, radius: 135, label: '🗄️ [E] Encher o Rack da Sua Sala', action: () => refillMyRackFree() },
    { id: 'coffee_machine', x: coffeePos.x, y: coffeePos.y, radius: 105, label: coffeePos.label, action: () => drinkCoffee() }
  ];

  if (soloTier >= 4) {
    interactables.push({
      id: 'stock_expanded_1',
      x: stockX + 280,
      y: 650,
      radius: 125,
      label: '⚡ [E] Estantes Industriais de Peças',
      action: () => openStockModalUI()
    });
  }

  if (soloTier >= 5) {
    interactables.push({
      id: 'stock_mega_1',
      x: stockX + 250,
      y: 770,
      radius: 140,
      label: '👑 [E] Mega Almoxarifado & Servidores',
      action: () => openStockModalUI()
    });
  }

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

  const teleports = [
    { label: '🛠️ Cabine #01', x: myRoomX + 160, y: 720 },
    { label: '🛎️ Recepção', x: recX + 140, y: 720 },
    { label: '📦 Estoque', x: stockX + 140, y: 720 },
    { label: '🗄️ Rack Central', x: recX + recW / 2, y: 480 }
  ];
  if (hasEmployees) {
    teleports.push({ label: '👥 Mesa #02', x: x02 + 105, y: yUpper + 110 });
    teleports.push({ label: '👥 Mesa #03', x: x03 + 105, y: yUpper + 110 });
    teleports.push({ label: '👥 Mesa #04', x: x04 + 105, y: yUpper + 110 });
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
    interactables,
    teleports
  };
}
`;

code = code.slice(0, startIdx) + newBuildOfflineMap + '\n' + code.slice(endIdx);
console.log('buildOfflineMap updated with new shelves and counter!');

// 5. Ensure generateSessionShelfVariants() is called on initialization
const initTarget = 'initCanvasWorld();';
if (!code.includes('generateSessionShelfVariants();\n  initCanvasWorld();')) {
  code = code.replace(initTarget, 'generateSessionShelfVariants();\n  initCanvasWorld();');
  console.log('generateSessionShelfVariants hooked into init!');
}

fs.writeFileSync('game.js', code, 'utf8');
console.log('game.js written successfully! New length:', code.length);
