const fs = require('fs');

let code = fs.readFileSync('game.js', 'utf8');

// 1. Add waiting_sofa, client_stools, and server_racks_strip to ASSET_IMAGES
const assetOld = `  shelves_sm_strip: typeof Image !== 'undefined' ? new Image() : null,
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
}`;

const assetNew = `  shelves_sm_strip: typeof Image !== 'undefined' ? new Image() : null,
  shelves_lg_strip: typeof Image !== 'undefined' ? new Image() : null,
  reception_counter: typeof Image !== 'undefined' ? new Image() : null,
  waiting_sofa: typeof Image !== 'undefined' ? new Image() : null,
  client_stools: typeof Image !== 'undefined' ? new Image() : null,
  server_racks_strip: typeof Image !== 'undefined' ? new Image() : null
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
  ASSET_IMAGES.waiting_sofa.src = 'assets/waiting_sofa.png';
  ASSET_IMAGES.client_stools.src = 'assets/client_stools.png';
  ASSET_IMAGES.server_racks_strip.src = 'assets/server_racks_strip.png';
}`;

if (code.includes(assetOld)) {
  code = code.replace(assetOld, assetNew);
  console.log('ASSET_IMAGES updated with sofa, stools, and server racks!');
} else {
  console.error('Could not find assetOld in game.js!');
}

// 2. Add bounding box constants and session randomizer for racks and stools
const cropsAndRandomizer = `
// Bounding box do Sofá com Mesa da Área de Espera
const SOFA_CROP = { sx: 10, sy: 7, sw: 158, sh: 248 };

// Bounding boxes dos 3 banquinhos do cliente (0: Preto, 1: Azul, 2: Laranja)
const STOOL_SPANS = [
  { sx: 4, sy: 26, sw: 57, sh: 150 },   // 0: Preto
  { sx: 81, sy: 26, sw: 57, sh: 150 },  // 1: Azul
  { sx: 155, sy: 26, sw: 57, sh: 150 }  // 2: Laranja
];

// Bounding boxes dos 8 modelos de Rack Central de Servidores
const SERVER_RACK_SPANS = [
  { sx: 15, sy: 13, sw: 95, sh: 172 },   // 0: LEDs azuis e gavetas
  { sx: 124, sy: 13, sw: 94, sh: 172 },  // 1: Porta de vidro fumê e LEDs ativos
  { sx: 230, sy: 11, sw: 84, sh: 174 },  // 2: Porta perfurada mesh
  { sx: 328, sy: 12, sw: 87, sh: 173 },  // 3: Baías de storage hot-swap
  { sx: 429, sy: 12, sw: 106, sh: 173 }, // 4: Patch cables coloridos de rede
  { sx: 548, sy: 12, sw: 89, sh: 173 },  // 5: Chassi branco datacenter
  { sx: 654, sy: 12, sw: 90, sh: 173 },  // 6: Servidores blade com vidro
  { sx: 762, sy: 12, sw: 81, sh: 174 }   // 7: Rack industrial fechado
];
`;

const targetCrops = '// Bounding box do Balcão de Recepção (reception_counter.png)';
code = code.replace(targetCrops, cropsAndRandomizer + '\n' + targetCrops);

// Update generateSessionShelfVariants to also randomize Central Rack models
code = code.replace(
  `function generateSessionShelfVariants() {
  state.sessionShelfVariants = {
    sm: [0, 1, 2, 3, 4, 5].sort(() => Math.random() - 0.5),
    lg: [0, 1, 2, 3, 4, 5, 6].sort(() => Math.random() - 0.5)
  };
}`,
  `function generateSessionShelfVariants() {
  const rackOptions = [0, 1, 2, 3, 4, 5, 6, 7].sort(() => Math.random() - 0.5);
  state.sessionShelfVariants = {
    sm: [0, 1, 2, 3, 4, 5].sort(() => Math.random() - 0.5),
    lg: [0, 1, 2, 3, 4, 5, 6].sort(() => Math.random() - 0.5),
    rackA: rackOptions[0],
    rackB: rackOptions[1],
    mainStool: Math.floor(Math.random() * 3),
    stationStools: [Math.floor(Math.random() * 3), Math.floor(Math.random() * 3), Math.floor(Math.random() * 3)]
  };
}`
);
console.log('Session randomizer updated for racks and stools!');

// 3. Add drawing functions for sofa and stool, and update drawCentralRackChassis
const newDrawings = `
function drawWaitingSofaGraphic(ctx, f) {
  const img = ASSET_IMAGES.waiting_sofa;
  if (img && img.complete && img.naturalWidth) {
    ctx.fillStyle = 'rgba(15, 37, 51, 0.22)';
    ctx.beginPath();
    ctx.roundRect(f.x + 3, f.y + 6, f.w, f.h, 8);
    ctx.fill();

    ctx.drawImage(img, SOFA_CROP.sx, SOFA_CROP.sy, SOFA_CROP.sw, SOFA_CROP.sh, f.x, f.y, f.w, f.h);
  } else {
    ctx.fillStyle = '#334155';
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(f.x, f.y, f.w, f.h, 8);
    ctx.fill();
    ctx.stroke();
  }
}

function drawStoolGraphic(ctx, f) {
  const img = ASSET_IMAGES.client_stools;
  const variant = (typeof f.stoolVariant === 'number') ? (f.stoolVariant % 3) : 0;
  const span = STOOL_SPANS[variant];

  if (img && img.complete && img.naturalWidth && span) {
    ctx.fillStyle = 'rgba(15, 37, 51, 0.25)';
    ctx.beginPath();
    ctx.ellipse(f.x + f.w / 2, f.y + f.h - 4, f.w / 2 - 2, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.drawImage(img, span.sx, span.sy, span.sw, span.sh, f.x, f.y, f.w, f.h);
  } else {
    const colors = ['#334155', '#2563eb', '#ea580c'];
    ctx.fillStyle = colors[variant];
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(f.x + f.w / 2, f.y + f.h / 2, f.w / 2, f.h / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
}
`;

code = code.replace('function drawReceptionCounterGraphic', newDrawings + '\nfunction drawReceptionCounterGraphic');

// Replace drawCentralRackChassis with sprite-based renderer with animated LED effects
const oldDrawCentralRackStart = code.indexOf('function drawCentralRackChassis(ctx, f) {');
const oldDrawCentralRackEnd = code.indexOf('function drawWorkbenchGraphic(ctx, f) {');

const newDrawCentralRack = `function drawCentralRackChassis(ctx, f) {
  const incident = centralRackState.incidentActive || centralRackState.onFire;
  const t = animTick;
  const cx = f.x + f.w / 2;

  // Sombra suave sob a base do rack
  ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
  ctx.beginPath();
  ctx.ellipse(cx, f.y + f.h + 2, f.w / 2 + 4, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  // Em caso de emergência no rack, alerta luminoso em cima
  if (incident) {
    const arrAlpha = 0.6 + 0.4 * Math.sin(t * 0.2);
    ctx.fillStyle = \`rgba(239, 68, 68, \${arrAlpha})\`;
    ctx.font = '900 13px Nunito, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('⚠️ PANE NOC ATIVA ⚠️', cx, f.y - 12);
  }

  // Modelos aleatórios dos racks para esta partida
  const variants = state.sessionShelfVariants || {};
  const vA = (typeof variants.rackA === 'number') ? (variants.rackA % SERVER_RACK_SPANS.length) : 1;
  const vB = (typeof variants.rackB === 'number') ? (variants.rackB % SERVER_RACK_SPANS.length) : 4;

  const rackGap = 8;
  const singleRackW = (f.w - rackGap) / 2;

  const cabinets = [
    { x: f.x, w: singleRackW, variant: vA },
    { x: f.x + singleRackW + rackGap, w: singleRackW, variant: vB }
  ];

  const img = ASSET_IMAGES.server_racks_strip;

  cabinets.forEach((cab, cIdx) => {
    const span = SERVER_RACK_SPANS[cab.variant];
    if (img && img.complete && img.naturalWidth && span) {
      // Desenha o sprite do rack selecionado
      ctx.drawImage(img, span.sx, span.sy, span.sw, span.sh, cab.x, f.y, cab.w, f.h);

      // ========================================================================
      // EFEITOS ANIMADOS DE RACK LIGADO: LEDs piscando e pulsando em tempo real!
      // ========================================================================
      ctx.save();
      // 1. Pulso de energia do switch/servidor central
      const pwrGlow = 0.45 + 0.35 * Math.sin(t * 0.12 + cIdx);
      ctx.fillStyle = incident ? \`rgba(239, 68, 68, \${pwrGlow})\` : \`rgba(56, 189, 248, \${pwrGlow})\`;
      ctx.shadowColor = incident ? '#ef4444' : '#38bdf8';
      ctx.shadowBlur = 8;
      ctx.fillRect(cab.x + cab.w * 0.15, f.y + f.h * 0.18, cab.w * 0.7, 2);

      // 2. LEDs de atividade de discos SAS e tráfego de rede (piscando rápido)
      const leds = [
        { rx: 0.22, ry: 0.32, color: '#22c55e', cycle: 8 },
        { rx: 0.38, ry: 0.32, color: '#38bdf8', cycle: 6 },
        { rx: 0.54, ry: 0.32, color: '#f59e0b', cycle: 11 },
        { rx: 0.70, ry: 0.32, color: '#22c55e', cycle: 9 },

        { rx: 0.22, ry: 0.48, color: '#38bdf8', cycle: 5 },
        { rx: 0.38, ry: 0.48, color: '#22c55e', cycle: 7 },
        { rx: 0.54, ry: 0.48, color: '#22c55e', cycle: 13 },
        { rx: 0.70, ry: 0.48, color: '#f59e0b', cycle: 6 },

        { rx: 0.25, ry: 0.65, color: '#22c55e', cycle: 10 },
        { rx: 0.45, ry: 0.65, color: '#38bdf8', cycle: 8 },
        { rx: 0.65, ry: 0.65, color: '#22c55e', cycle: 12 }
      ];

      leds.forEach(led => {
        const on = ((t + cIdx * 7) % led.cycle) < (led.cycle * 0.6);
        if (on) {
          ctx.fillStyle = incident ? '#ef4444' : led.color;
          ctx.shadowColor = incident ? '#ef4444' : led.color;
          ctx.shadowBlur = 6;
          ctx.fillRect(cab.x + cab.w * led.rx, f.y + f.h * led.ry, 3, 2.5);
        }
      });

      // 3. Brilho suave no painel de vidro
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.beginPath();
      ctx.moveTo(cab.x + 4, f.y + 4);
      ctx.lineTo(cab.x + cab.w * 0.4, f.y + 4);
      ctx.lineTo(cab.x + cab.w * 0.1, f.y + f.h - 4);
      ctx.lineTo(cab.x + 4, f.y + f.h - 4);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    } else {
      // Fallback
      ctx.fillStyle = '#0a0e1a';
      ctx.strokeStyle = incident ? '#f87171' : '#38bdf8';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(cab.x, f.y, cab.w, f.h, 6);
      ctx.fill();
      ctx.stroke();
    }
  });
}
`;

code = code.slice(0, oldDrawCentralRackStart) + newDrawCentralRack + '\n' + code.slice(oldDrawCentralRackEnd);
console.log('drawCentralRackChassis updated with animated sprite racks!');

// 4. Update drawWorld to support sofa and stool, and NOT draw dark bar/text behind Central Rack
const drawWorldOld = `        if (f.type === 'counter') {
          drawReceptionCounterGraphic(ctx, f);
          return;
        }

        if (f.type === 'shelf') {
          drawShelfGraphic(ctx, f);
          return;
        }`;

const drawWorldNew = `        if (f.type === 'counter') {
          drawReceptionCounterGraphic(ctx, f);
          return;
        }

        if (f.type === 'shelf') {
          drawShelfGraphic(ctx, f);
          return;
        }

        if (f.type === 'sofa') {
          drawWaitingSofaGraphic(ctx, f);
          return;
        }

        if (f.type === 'stool') {
          drawStoolGraphic(ctx, f);
          return;
        }`;

code = code.replace(drawWorldOld, drawWorldNew);

// Remove the dark bar and text behind Central Rack in drawWorld
const darkBarOld = `      ctx.fillStyle = room.darkTheme ? 'rgba(255,255,255,0.15)' : 'rgba(15, 37, 51, 0.86)';
      ctx.beginPath();
      ctx.roundRect(room.x + 10, room.y + 8, Math.min(room.w - 20, 340), 22, 6);
      ctx.fill();

      ctx.fillStyle = room.darkTheme ? '#68f0ae' : '#ffffff';
      ctx.font = '900 11px Nunito, sans-serif';
      ctx.fillText(room.name, room.x + 16, room.y + 23);`;

const darkBarNew = `      // Não desenha barra escura nem texto atrás do Rack Central (mantém chão 100% normal e limpo)
      if (room.id !== 'central_rack_plaza') {
        ctx.fillStyle = room.darkTheme ? 'rgba(255,255,255,0.15)' : 'rgba(15, 37, 51, 0.86)';
        ctx.beginPath();
        ctx.roundRect(room.x + 10, room.y + 8, Math.min(room.w - 20, 340), 22, 6);
        ctx.fill();

        ctx.fillStyle = room.darkTheme ? '#68f0ae' : '#ffffff';
        ctx.font = '900 11px Nunito, sans-serif';
        ctx.fillText(room.name, room.x + 16, room.y + 23);
      }`;

code = code.replace(darkBarOld, darkBarNew);
console.log('drawWorld updated to skip dark bar behind central rack!');

// 5. Update buildOfflineMap furniture and waiting slots
const startBuildOffline = code.indexOf('function buildOfflineMap(overrideCount) {');
const endBuildOffline = code.indexOf('let bcChannel = null;');

const updatedBuildOfflineMap = `function buildOfflineMap(overrideCount) {
  const soloTier = state.soloExpansionTier || 1;
  const benchLvl = state.workbenchLevel || 1;

  // Variantes aleatórias para esta partida
  if (!state.sessionShelfVariants) {
    generateSessionShelfVariants();
  }
  const smVars = state.sessionShelfVariants.sm;
  const lgVars = state.sessionShelfVariants.lg;
  const mainStoolVar = (typeof state.sessionShelfVariants.mainStool === 'number') ? state.sessionShelfVariants.mainStool : 0;
  const stnStools = state.sessionShelfVariants.stationStools || [0, 1, 2];

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
  let benchH = 104;
  if (benchLvl === 2) { benchW = 200; benchH = 115; }
  else if (benchLvl === 3) { benchW = 220; benchH = 125; }
  else if (benchLvl >= 4) { benchW = 245; benchH = 135; }

  const benchLabels = {
    1: '🛠️ SUA BANCADA #01 [E]',
    2: '🔧 BANCADA TÉCNICA [E]',
    3: '🔬 BANCADA INDUSTRIAL [E]',
    4: '⚡ ESTAÇÃO MASTER [E]'
  };

  // Posição da banqueta do cliente (substitui o quadrado amarelo, cor aleatória entre os 3 modelos)
  const stoolX = myRoomX + benchW + 30;
  const stoolY = 535;

  // Mobília da Cabine #01
  const furnitureMyRoom = [
    {
      type: 'workbench',
      x: myRoomX + 35, y: 505, w: benchW, h: benchH,
      label: benchLabels[benchLvl] || '🛠️ SUA BANCADA #01 [E]',
      color: '#d97706',
      solid: true
    },
    // Banquinho do cliente (substitui o quadrado amarelo do cliente com cor aleatória)
    {
      type: 'stool',
      x: stoolX,
      y: stoolY,
      w: 42,
      h: 58,
      stoolVariant: mainStoolVar,
      label: 'Banqueta do Cliente',
      solid: false
    }
  ];

  // Cafeteira: no estoque no Tier 1; na nossa sala a partir do Tier 2
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
      x: myRoomX + 235, y: 865, w: 85, h: 135,
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
  // MOBÍLIA DA RECEPÇÃO & ÁREA DE ESPERA:
  // - Caixas de fila removidas (clientes ficam espalhados naturalmente pelo salão)
  // - Sofá colocado exatamente no risco vermelho (parede direita inferior da recepção)
  // - Detalhe azul/pedaço de balcão na porta da rua removido
  // ============================================================================
  const counterW = 135;
  const counterH = 64;
  const counterX = recX + recW - 145;
  const counterY = 575;

  // Posição do Sofá com Mesa (no risco vermelho feito pelo usuário)
  const sofaX = recX + recW - 95;
  const sofaY = 785;
  const sofaW = 86;
  const sofaH = 142;

  const furnitureReception = [
    // Balcão de Recepção oficial
    { type: 'counter', x: counterX, y: counterY, w: counterW, h: counterH, label: '🛎️ Balcão [E]', color: '#f97316', solid: true },
    // Sofá na área de espera da recepção (onde o usuário marcou com risco vermelho)
    { type: 'sofa', x: sofaX, y: sofaY, w: sofaW, h: sofaH, label: '🛋️ Sofá de Espera [E]', color: '#334155', solid: true }
  ];

  // ============================================================================
  // MOBÍLIA DO ESTOQUE
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

  if (soloTier >= 4) {
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

  // Ala Superior dos outros 3 jogadores
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

    // 2. RECEPÇÃO & TRIAGEM GERAL (Sem caixas de fila, com sofá na área de espera e balcão realista)
    {
      id: 'main_store',
      name: '🛎️ Recepção & Triagem Geral',
      x: recX, y: 460, w: recW, h: 520,
      floorColor: '#ffffff', gridColor: '#edf7f8', borderColor: '#f9c742',
      hasWalls: false,
      furniture: furnitureReception
    },

    // 3. SALA DE ESTOQUE LATERAL
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

    // 4. RACK CENTRAL DE INFRAESTRUTURA (Chão normal e limpo, sem barra escura atrás)
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
          { type: 'stool', x: x02 + 195, y: yUpper + 32, w: 42, h: 56, stoolVariant: stnStools[0], label: 'Banqueta C02', solid: false }
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
          { type: 'stool', x: x03 + 195, y: yUpper + 32, w: 42, h: 56, stoolVariant: stnStools[1], label: 'Banqueta C03', solid: false }
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
          { type: 'stool', x: x04 + 195, y: yUpper + 32, w: 42, h: 56, stoolVariant: stnStools[2], label: 'Banqueta C04', solid: false }
        ]
      }
    );
  }

  // Posições dos clientes espalhados naturalmente em frente ao balcão e pelo salão de espera (sem caixas!)
  const waitingSlots = [
    { x: recX + 130, y: 580 },
    { x: recX + 75,  y: 640 },
    { x: recX + 160, y: 675 },
    { x: recX + 85,  y: 730 },
    { x: recX + 150, y: 790 },
    { x: recX + 90,  y: 850 }
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

  const coffeePos = (soloTier >= 2)
    ? { x: myRoomX + 80, y: 921, label: '☕ [E] Tomar Café Expresso na Sua Sala (+Velocidade)' }
    : { x: stockX + stockW - 60, y: 726, label: '☕ [E] Tomar Café na Sala de Estoque (+Velocidade)' };

  const interactables = [
    { id: 'my_workbench', x: myRoomX + 35 + benchW / 2, y: 505 + benchH / 2, radius: 125, label: \`🛠️ [E] Abrir Sua Bancada (Nv. \${benchLvl})\`, action: () => openWorkbenchModal() },
    { id: 'central_rack', x: recX + recW / 2, y: 420, radius: 155, label: '🗄️ [E] Rack Central de Infraestrutura (10 Puzzles)', action: () => openCentralRackModal() },
    { id: 'reception_counter', x: counterX + counterW / 2, y: counterY + counterH / 2, radius: 130, label: '🛎️ [E] Balcão de Recepção e Triagem', action: () => openWorkbenchModal() },
    { id: 'reception_sofa', x: sofaX + sofaW / 2, y: sofaY + sofaH / 2, radius: 110, label: '🛋️ Sofá da Área de Espera dos Clientes' },
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
    clientStoolPos: { x: stoolX + 21, y: stoolY + 30 },
    exitPos: { x: recX + recW / 2, y: 955 },
    rooms,
    connectors,
    waitingSlots,
    interactables,
    teleports
  };
}
`;

code = code.slice(0, startBuildOffline) + updatedBuildOfflineMap + '\n' + code.slice(endBuildOffline);
console.log('buildOfflineMap updated with sofa, stools, scattered waiting slots, and clean entrance!');

// 6. Update callClientToMyRoom so client walks to the stool
code = code.replace(
  'const targetDeskPos = { x: myRoomX + benchW + 45, y: 545 };',
  `const map = currentMap();
  const targetDeskPos = (map && map.clientStoolPos) ? map.clientStoolPos : { x: myRoomX + benchW + 51, y: 565 };`
);

fs.writeFileSync('game.js', code, 'utf8');
console.log('game.js updated successfully! New length:', code.length);
