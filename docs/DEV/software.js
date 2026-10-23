function getInitialDevMoney() {
  try {
    const saved = localStorage.getItem('omnivoid_plantaodev_save');
    if (saved) {
      const p = JSON.parse(saved);
      if (typeof p.money === 'number') return p.money;
    }
  } catch(e) {}
  return 5000;
}

function saveDevGameState() {
  try {
    const saveObj = {
      money: devState.money,
      rep: devState.rep,
      workbenchLevel: devState.workbenchLevel,
      soloExpansionTier: devState.soloExpansionTier,
      upgrades: devState.upgrades,
      stackParts: devState.stackParts,
      stackCapacity: devState.stackCapacity,
      solvedClusterPuzzles: devState.solvedClusterPuzzles,
      solvedServerPuzzles: devState.solvedServerPuzzles
    };
    localStorage.setItem('omnivoid_plantaodev_save', JSON.stringify(saveObj));
  } catch(e) {}
}

function loadDevGameState() {
  try {
    const saved = localStorage.getItem('omnivoid_plantaodev_save');
    if (saved) {
      const p = JSON.parse(saved);
      if (typeof p.money === 'number') devState.money = p.money;
      if (typeof p.rep === 'number') devState.rep = p.rep;
      if (typeof p.workbenchLevel === 'number') devState.workbenchLevel = p.workbenchLevel;
      if (typeof p.soloExpansionTier === 'number') devState.soloExpansionTier = p.soloExpansionTier;
      if (typeof p.stackParts === 'number') devState.stackParts = p.stackParts;
      if (typeof p.stackCapacity === 'number') devState.stackCapacity = p.stackCapacity;
      if (p.upgrades) Object.assign(devState.upgrades, p.upgrades);
      if (Array.isArray(p.solvedClusterPuzzles)) devState.solvedClusterPuzzles = p.solvedClusterPuzzles;
      if (Array.isArray(p.solvedServerPuzzles)) devState.solvedServerPuzzles = p.solvedServerPuzzles;
    }
  } catch(e) {}
}

/**
 * Plantão Dev - Software House & Consultoria Tech
 * Segundo Jogo: Desenvolvimento de Software para Pessoas, Empresas e Entidades.
 * Arte e personagens puramente procedurais (Canvas 2D + SVG Chibi, sem sprites externos).
 */

// ============================================================================
// CATÁLOGO DE UPGRADES E EQUIPAMENTOS DA SOFTWARE HOUSE (PREÇOS 5X BALANCEADOS)
// ============================================================================
const DEV_SHOP_CATALOG = [
  {
    id: 'rack_lvl1',
    name: '🗄️ Servidor Local de Testes (Cap. 8 Módulos)',
    price: 4000,
    icon: '🗄️',
    desc: 'Instala um Servidor On-Premise na sua Estação Dev com 8 módulos de código prontos! Usa automaticamente nos deploys!',
    category: 'rack'
  },
  {
    id: 'rack_lvl2',
    name: '🗄️ Cluster Dedicado On-Premise (Cap. 20 Módulos)',
    price: 8000,
    icon: '🗄️✨',
    desc: 'Expande o rack da sua sala para caber até 20 módulos e bibliotecas pré-compiladas!',
    category: 'rack'
  },
  {
    id: 'rack_refill',
    name: '📦 Lote de +8 Módulos & Bibliotecas Reutilizáveis',
    price: 1750,
    icon: '📦',
    desc: 'Importação imediata de pacotes NPM, pip e Docker direto para o seu servidor local.',
    category: 'consumable'
  },
  {
    id: 'my_coffee',
    name: '☕ Máquina de Café Expresso Barista Dev',
    price: 3500,
    icon: '☕',
    desc: 'Instala cafeteira barista na sua Estação Dev ([E] para beber): concede +25% de velocidade de movimento!',
    category: 'furniture'
  },
  {
    id: 'vip_sofa',
    name: '🛋️ Sofá Executivo & TV Dashboard p/ Clientes',
    price: 5000,
    icon: '🛋️',
    desc: 'Lounge confortável de espera: clientes aguardam com 40% mais paciência e dão +1% de Reputação extra!',
    category: 'furniture'
  },
  {
    id: 'ac_lvl1',
    name: '❄️ Ar-Condicionado Dev Split (Nv. 1)',
    price: 6500,
    icon: '❄️',
    desc: 'Climatiza sua sala dev: clientes pagam +R$ 150 de bônus por reunião agradável!',
    category: 'furniture'
  },
  {
    id: 'ac_lvl2',
    name: '❄️ Climatizador Inverter Server Grade (Nv. 2)',
    price: 12000,
    icon: '❄️✨',
    desc: 'Ar de alta performance nos corredores e estações: clientes pagam +R$ 350 de bônus.',
    category: 'furniture'
  },
  {
    id: 'ac_lvl3',
    name: '❄️ Sistema de Precisão p/ Data Center (Nv. 3)',
    price: 22500,
    icon: '❄️💎',
    desc: 'Super climatizador coluna ao lado da sua bancada: clientes dão +R$ 600 de bônus!',
    category: 'furniture'
  },
  {
    id: 'bench_lvl2',
    level: 2,
    name: '🖥️ Setup Dual Monitor 27" & Gabinete Torre (Nv. 2)',
    price: 45000,
    minRep: 70,
    icon: '🖥️',
    desc: 'Setup com monitores duplos de 27" e gabinete torre: revela 1 teste de stack e reduz multas contratuais em 25%!',
    category: 'workbench'
  },
  {
    id: 'bench_lvl3',
    level: 3,
    name: '🎧 Setup Curved Ultrawide 34" Studio & Audio DAC (Nv. 3)',
    price: 110000,
    minRep: 70,
    icon: '🎧',
    desc: 'Setup de estúdio com monitor curvo 34", caixas de som e interface de áudio: revela 2 requisitos técnicos, dá +R$ 450 de bônus por entrega e reduz multas em 50%!',
    category: 'workbench'
  },
  {
    id: 'bench_lvl4',
    level: 4,
    name: '⚡ Super Ultrawide 49" 32:9 & ScreenBar Light (Nv. 4)',
    price: 225000,
    minRep: 70,
    icon: '⚡',
    desc: 'Setup panorâmico 32:9 com barra de luz ScreenBar e torre RGB: revela TODOS os requisitos, dá +R$ 1.000 por entrega e reduz multas em 70%!',
    category: 'workbench'
  },
  {
    id: 'bench_lvl5',
    level: 5,
    name: '👑 Command Center Triple 4K Panoramic & Stream Deck (Nv. 5)',
    price: 450000,
    minRep: 70,
    icon: '👑',
    desc: 'O ápice da tecnologia com 3 monitores 4K em arco, Stream Deck e torre extrema: bônus de +R$ 2.500 por projeto, +1% extra de reputação e imunidade a retrabalho!',
    category: 'workbench'
  },
  {
    id: 'solo_expansion_2',
    tier: 2,
    name: '🏗️ Expansão: Estúdio Tech Ampliado (Nv. 2)',
    price: 17500,
    minRep: 70,
    icon: '🏗️',
    desc: 'Aumenta a sala técnica principal para acomodar mais estações e espaço de circulação!',
    category: 'expansion'
  },
  {
    id: 'solo_expansion_3',
    tier: 3,
    name: '🏢 Expansão: Agência de Software VIP (Nv. 3)',
    price: 42500,
    minRep: 70,
    icon: '🏢',
    desc: 'Dobra o tamanho da sua sala técnica com acabamento executivo para receber grandes empresas!',
    category: 'expansion'
  },
  {
    id: 'solo_expansion_4',
    tier: 4,
    name: '🌐 Expansão: Hub de Inovação Digital (Nv. 4)',
    price: 90000,
    minRep: 70,
    icon: '🌐',
    desc: 'Amplia o almoxarifado de servidores e cria corredores mais largos para squads maiores!',
    category: 'expansion'
  },
  {
    id: 'solo_expansion_5',
    tier: 5,
    name: '🏛️ Expansão: Mega Tech Campus Corporativo (Nv. 5)',
    price: 190000,
    minRep: 70,
    icon: '🏛️',
    desc: 'O ápice da engenharia: instala infraestrutura para até 20 desenvolvedores em desenvolvimento!',
    category: 'expansion'
  }
];

// ============================================================================
// ESTADO GLOBAL DO JOGO (PLANTÃO DEV)
// ============================================================================
const devState = {
  money: getInitialDevMoney(), // Dinheiro infinito para testes de upgrades
  rep: 70,
  failedCount: 0,
  casesDatabaseIndex: 8,
  activeCaseIndex: 0,
  activeTab: 'briefing',
  workbenchLevel: 1,
  soloExpansionTier: 1,
  solvedClusterPuzzles: [],
  solvedServerPuzzles: [],
  activeClusterPuzzleId: null,
  activeServerPuzzleId: null,
  stackParts: 0,
  stackCapacity: 0,
  coffeeBoostTimer: 0,
  mySlotIndex: 0,
  myPeerId: 'dev_' + Math.random().toString(36).slice(2, 9),
  roomCode: 'DEV-' + Math.floor(1000 + Math.random() * 9000),
  networkMode: 'solo',
  upgrades: {
    rack_lvl1: false,
    rack_lvl2: false,
    my_coffee: false,
    vip_sofa: false,
    ac_lvl1: false,
    ac_lvl2: false,
    ac_lvl3: false,
    bench_lvl2: false,
    bench_lvl3: false,
    bench_lvl4: false,
    bench_lvl5: false,
    solo_expansion_2: false,
    solo_expansion_3: false,
    solo_expansion_4: false,
    solo_expansion_5: false
  },
  players: [
    {
      id: 'p1',
      slot: 0,
      name: 'Você (Tech Lead)',
      role: '👑 Fundador & Tech Lead · Estação Dev #01',
      x: 450,
      y: 1260,
      connected: true,
      isMoving: false,
      waypoints: [],
      bubble: '',
      bubbleTimer: 0,
      look: { skin: '#ffdbb5', hair: '#1e293b', shirt: '#0284c7', glasses: false, headset: false, mood: 'happy' }
    },
    {
      id: 'p2',
      slot: 1,
      name: 'Dev Backend #02',
      role: '🤝 Engenheiro Backend (Node & Go) · Estação #02',
      x: 325,
      y: 400,
      connected: false,
      isMoving: false,
      waypoints: [],
      bubble: '',
      bubbleTimer: 0,
      look: { skin: '#fcd34d', hair: '#78350f', shirt: '#10b981', glasses: false, headset: false, mood: 'happy' }
    },
    {
      id: 'p3',
      slot: 2,
      name: 'Dev Frontend #03',
      role: '🤝 Desenvolvedor Frontend (React & Vue) · Estação #03',
      x: 930,
      y: 400,
      connected: false,
      isMoving: false,
      waypoints: [],
      bubble: '',
      bubbleTimer: 0,
      look: { skin: '#fed7aa', hair: '#b45309', shirt: '#6366f1', glasses: true, headset: false, mood: 'happy' }
    },
    {
      id: 'p4',
      slot: 3,
      name: 'Dev QA & Pentest #04',
      role: '🤝 QA & Cybersecurity · Estação #04',
      x: 1535,
      y: 400,
      connected: false,
      isMoving: false,
      waypoints: [],
      bubble: '',
      bubbleTimer: 0,
      look: { skin: '#c68642', hair: '#2c1e18', shirt: '#8c6fd1', glasses: false, headset: false, mood: 'happy' }
    },
    {
      id: 'p5',
      slot: 4,
      name: 'Engenheiro Cloud & DevOps #05',
      role: '🤝 Especialista Cloud & K8s · Estação #05',
      x: 2140,
      y: 400,
      connected: false,
      isMoving: false,
      waypoints: [],
      bubble: '',
      bubbleTimer: 0,
      look: { skin: '#ffedd5', hair: '#0f172a', shirt: '#f59e0b', glasses: false, headset: true, mood: 'happy' }
    }
  ]
};

const cloudNOCState = {
  incidentActive: false,
  incidentSecondsRemaining: 180,
  incidentIntervalCounter: 0,
  fixedCount: 0,
  onFire: false,
  gameOver: false,
  requiredModules: [0, 1, 2],
  solvedModules: []
};

// ============================================================================
// CONFIGURAÇÕES DE EXPANSÃO DA SEDE & SALAS PRÓPRIAS DE DESENVOLVIMENTO
// ============================================================================
const EXPANSION_CONFIGS = {
  1: {
    tier: 1,
    name: 'Garagem Startup',
    cabineW: 1380,
    doorCabineOffset: 700,
    deskW: 360,
    stoolXOffset: 440,
    monitors: 1,
    receptionLabel: 'RECEPÇÃO DE CLIENTES',
    loungeTitle: '🛋️ Lounge de Espera VIP'
  },
  2: {
    tier: 2,
    name: 'Estúdio Dev Ampliado',
    cabineW: 1460,
    doorCabineOffset: 740,
    deskW: 410,
    stoolXOffset: 490,
    monitors: 2,
    receptionLabel: 'RECEPÇÃO & CONSULTORIA TECH',
    loungeTitle: '🛋️ Lounge Executivo de Clientes'
  },
  3: {
    tier: 3,
    name: 'Agência Tech VIP',
    cabineW: 1540,
    doorCabineOffset: 780,
    deskW: 460,
    stoolXOffset: 540,
    monitors: 3,
    receptionLabel: 'RECEPÇÃO EXECUTIVA VIP',
    loungeTitle: '🛋️ Lounge Executivo & Coffee Bar'
  },
  4: {
    tier: 4,
    name: 'Hub de Inovação',
    cabineW: 1620,
    doorCabineOffset: 820,
    deskW: 510,
    stoolXOffset: 590,
    monitors: 4,
    receptionLabel: 'HUB CORPORATIVO DE TECH',
    loungeTitle: '🛋️ Lounge Tech & Catracas Inteligentes'
  },
  5: {
    tier: 5,
    name: 'Mega Tech Campus',
    cabineW: 1700,
    doorCabineOffset: 860,
    deskW: 560,
    stoolXOffset: 640,
    monitors: 4,
    receptionLabel: 'GRAND CAMPUS CORPORATE LOBBY',
    loungeTitle: '🏛️ Mega Lounge & Barista Station'
  }
};

const DEV_UPPER_ROOMS = [
  {
    id: 'upper_room_2',
    name: '💻 SALA DEV #02 · BACKEND & APIs',
    shortName: 'Backend & APIs',
    devTitle: 'Node.js, Go, Python, SQL & Microsserviços',
    x: 35, y: 170, w: 580, h: 420,
    wallColor: '#f59e0b',
    floorColor: '#ffffff',
    gridColor: '#fef3c7',
    door: { x: 35 + Math.round((580 - 150) / 2), y: 590, w: 150 },
    specialty: 'backend',
    deskTheme: 'dark_wood'
  },
  {
    id: 'upper_room_3',
    name: '🎨 SALA DEV #03 · FRONTEND & MOBILE',
    shortName: 'Frontend & Mobile',
    devTitle: 'React, Vue, Flutter, iOS & UI/UX Design',
    x: 640, y: 170, w: 580, h: 420,
    wallColor: '#8b5cf6',
    floorColor: '#ffffff',
    gridColor: '#ede9fe',
    door: { x: 640 + Math.round((580 - 150) / 2), y: 590, w: 150 },
    specialty: 'frontend',
    deskTheme: 'scandi_light'
  },
  {
    id: 'upper_room_4',
    name: '🛡️ SALA DEV #04 · QA & CYBERSECURITY',
    shortName: 'QA & Cybersecurity',
    devTitle: 'Testes Automatizados, Pentest & Code Audit',
    x: 1245, y: 170, w: 580, h: 420,
    wallColor: '#10b981',
    floorColor: '#ffffff',
    gridColor: '#d1fae5',
    door: { x: 1245 + Math.round((580 - 150) / 2), y: 590, w: 150 },
    specialty: 'qa_security',
    deskTheme: 'cyber_metal'
  },
  {
    id: 'upper_room_5',
    name: '🚀 SALA DEV #05 · CLOUD, DEVOPS & AI',
    shortName: 'DevOps & AI',
    devTitle: 'Docker, Kubernetes, AWS Cloud & Modelos IA',
    x: 1850, y: 170, w: 580, h: 420,
    wallColor: '#0ea5e9',
    floorColor: '#ffffff',
    gridColor: '#e0f2fe',
    door: { x: 1850 + Math.round((580 - 150) / 2), y: 590, w: 150 },
    specialty: 'devops_cloud',
    deskTheme: 'neon_tech'
  }
];

const DEV_UPPER_STATIONS = DEV_UPPER_ROOMS;

// 3 Locais de Bancadas de Compra no corredor (Onde pintado de vermelho na Imagem 2)
const DEV_HALLWAY_SHOP_SPOTS = [
  { id: 'hallway_shop_1', x: 483, y: 590, w: 290, h: 96, label: 'Bancada Tech #1' },
  { id: 'hallway_shop_2', x: 1088, y: 590, w: 290, h: 96, label: 'Bancada Tech #2' },
  { id: 'hallway_shop_3', x: 1693, y: 590, w: 290, h: 96, label: 'Bancada Tech #3' }
];

let DEV_ROOMS = [];
let devSolidWalls = [];
let devRandomPlants = [];

function rebuildOfficeLayout(tier = devState?.soloExpansionTier || 1) {
  const cfg = EXPANSION_CONFIGS[tier] || EXPANSION_CONFIGS[1];

  const cabineX = 40;
  const cabineY = 960;
  const cabineW = cfg.cabineW;
  const cabineH = 550;
  const cabineDoor = { x: cabineX + cfg.doorCabineOffset, y: 960, w: 160 };

  const receptionX = cabineX + cabineW + 30;
  const receptionY = 960;
  const receptionW = 2440 - receptionX;
  const receptionH = 550;
  const receptionDoor = { x: receptionX + 70, y: 960, w: 160 };

  DEV_ROOMS = [
    {
      id: 'dev_room_1',
      name: `💻 MEGA CABINE DEV #01 · TECH LEAD (${cfg.name.toUpperCase()})`,
      x: cabineX, y: cabineY, w: cabineW, h: cabineH,
      floorColor: '#ffffff',
      gridColor: '#cdeef2',
      wallColor: '#1fa6b8',
      door: cabineDoor
    },
    {
      id: 'reception',
      name: `🛋️ ${cfg.receptionLabel}`,
      x: receptionX, y: receptionY, w: receptionW, h: receptionH,
      floorColor: '#ffffff',
      gridColor: '#ede9fe',
      wallColor: '#6366f1',
      door: receptionDoor
    }
  ];

  devSolidWalls = buildDevSolidWalls();
}

function buildDevSolidWalls() {
  const walls = [];
  const wallThick = 12;

  // Paredes externas de contorno do prédio ampliado
  walls.push({ x: 20, y: 170, w: 2440, h: wallThick, color: '#1fa6b8' }); // topo externo
  walls.push({ x: 20, y: 1520, w: 2440, h: wallThick, color: '#1fa6b8' }); // base externa
  walls.push({ x: 20, y: 170, w: wallThick, h: 1362, color: '#1fa6b8' });  // esquerda externa

  // Parede direita externa com grande abertura para a ENTRADA DE CLIENTES (y: 660 a 910)
  walls.push({ x: 2448, y: 170, w: wallThick, h: 490, color: '#1fa6b8' }); // direita superior (170 a 660)
  walls.push({ x: 2448, y: 910, w: wallThick, h: 622, color: '#1fa6b8' }); // direita inferior (910 a 1532)

  // Paredes das salas inferiores (com abertura para portas)
  DEV_ROOMS.forEach(r => {
    const doorStart = r.door.x;
    const doorEnd = r.door.x + r.door.w;

    if (doorStart > r.x) {
      walls.push({ x: r.x, y: r.y - wallThick / 2, w: doorStart - r.x, h: wallThick, color: r.wallColor });
    }
    if (r.x + r.w > doorEnd) {
      walls.push({ x: doorEnd, y: r.y - wallThick / 2, w: (r.x + r.w) - doorEnd, h: wallThick, color: r.wallColor });
    }

    walls.push({ x: r.x, y: r.y, w: wallThick, h: r.h, color: r.wallColor });
    walls.push({ x: r.x + r.w - wallThick, y: r.y, w: wallThick, h: r.h, color: r.wallColor });
    walls.push({ x: r.x, y: r.y + r.h - wallThick, w: r.w, h: wallThick, color: r.wallColor });
  });

  // Paredes sólidas das 4 salas superiores próprias de desenvolvimento (com abertura para portas)
  DEV_UPPER_ROOMS.forEach(r => {
    const doorStart = r.door.x;
    const doorEnd = r.door.x + r.door.w;

    walls.push({ x: r.x, y: r.y, w: wallThick, h: r.h, color: r.wallColor });
    walls.push({ x: r.x + r.w - wallThick, y: r.y, w: wallThick, h: r.h, color: r.wallColor });

    if (doorStart > r.x) {
      walls.push({ x: r.x, y: r.y + r.h - wallThick, w: doorStart - r.x, h: wallThick, color: r.wallColor });
    }
    if (r.x + r.w > doorEnd) {
      walls.push({ x: doorEnd, y: r.y + r.h - wallThick, w: (r.x + r.w) - doorEnd, h: wallThick, color: r.wallColor });
    }
  });

  // ========================================================================
  // COLISÃO DAS BANCADAS DE TRABALHO, CAFETEIRA, BALCÃO E MESA (NÃO PASSAR POR CIMA)
  // ========================================================================
  const cabine = DEV_ROOMS.find(r => r.id === 'dev_room_1') || { x: 40, y: 960, w: 1380 };

  // 1. Bancada Tech Lead na Mega Cabine #01
  walls.push({ x: cabine.x + 60, y: 1005 + 40, w: 320, h: 140, isObstacle: true, name: 'Bancada Tech Lead' });

  // 2. Bancadas das 4 Salas Superiores
  DEV_UPPER_ROOMS.forEach(r => {
    walls.push({ x: r.x + 35, y: r.y + 55 + 35, w: 280, h: 125, isObstacle: true, name: `Bancada ${r.shortName}` });
  });

  // 3. Posições da Cafeteira Barista e Estantes Ampliadas (Barista antes das estantes)
  const cabineTier = (typeof devState !== 'undefined' && devState.soloExpansionTier) ? devState.soloExpansionTier : 1;
  const numCabineShelves = cabineTier >= 4 ? 2 : 1;
  const shelfW = 145;
  const shelfH = 154;
  const coffeeW = 180;
  const coffeeH = 150;
  const gap = 16;
  const rightMargin = 22;

  const shelfXPositions = [];
  if (numCabineShelves === 2) {
    const s2X = cabine.x + cabine.w - rightMargin - shelfW;
    const s1X = s2X - gap - shelfW;
    shelfXPositions.push(s1X, s2X);
  } else {
    const s1X = cabine.x + cabine.w - rightMargin - shelfW;
    shelfXPositions.push(s1X);
  }

  const coffeeX = shelfXPositions[0] - gap - coffeeW;
  const coffeeY = cabine.y + 16;

  // Cafeteira Barista antes das estantes (apenas quando comprada)
  if (typeof devState !== 'undefined' && devState.upgrades && devState.upgrades.my_coffee) {
    walls.push({ x: coffeeX, y: coffeeY + 10, w: coffeeW, h: coffeeH - 10, isObstacle: true, name: 'Estação Barista' });
  }

  // 4. Estantes Tecnológicas Ampliadas da Mega Cabine #01 (1 na Expansão inicial, 2 a partir da Expansão 4)
  for (let s = 0; s < shelfXPositions.length; s++) {
    const sX = shelfXPositions[s];
    const sY = cabine.y + 16;
    walls.push({ x: sX, y: sY + 10, w: shelfW, h: shelfH - 10, isObstacle: true, name: 'Estante Cabine ' + (s + 1) });
  }

  // 5. Balcão de Recepção no canto superior direito (selado contra a parede)
  const recDeskX = 2070;
  const recDeskY = 970;
  const recDeskW = 360;
  const recDeskH = 226;
  walls.push({ x: recDeskX, y: 960, w: 2448 - recDeskX, h: recDeskH + 10, isObstacle: true, name: 'Balcão de Recepção' });

  // 6. Armários das 4 Salas Superiores (Onde pintado de vermelho na Imagem 1)
  DEV_UPPER_ROOMS.forEach(r => {
    const cabX = r.x + r.w - 125;
    const cabY = r.y + 22;
    walls.push({ x: cabX, y: cabY, w: 105, h: 110, isObstacle: true, name: 'Armário ' + r.shortName });
  });

  // 7. Climatizador Inverter Torre Coluna (Imagem 4) no local amarelo (quando comprado)
  if (typeof devState !== 'undefined' && devState.upgrades && devState.upgrades.ac_lvl2) {
    walls.push({ x: 35, y: 825, w: 54, h: 118, isObstacle: true, name: 'Climatizador Torre Inverter' });
  }

  // 6. Plantas Decorativas Ativas nos locais verdes aleatórios
  if (typeof devRandomPlants !== 'undefined') {
    devRandomPlants.forEach(p => {
      if (p.active) {
        walls.push({ x: p.x, y: p.y + 35, w: 55, h: 55, isObstacle: true, name: 'Planta ' + p.name });
      }
    });
  }

  // 6b. Segundo Armário e Lixeiras nas Salas Superiores (Salas 2, 3, 4 e 5)
  DEV_UPPER_ROOMS.forEach(r => {
    // Segundo Armário (ao lado do primeiro armário na parede superior)
    walls.push({ x: r.x + r.w - 235, y: r.y + 22, w: 105, h: 110, isObstacle: true, name: 'Segundo Armário ' + r.shortName });
    // Lixeira no canto inferior esquerdo (Imagem 2) - Tamanho ampliado
    walls.push({ x: r.x + 28, y: r.y + r.h - 96 + 20, w: 50, h: 62, isObstacle: true, name: 'Lixeira ' + r.shortName });
  });

  // 6c. Móveis no canto inferior esquerdo da Mega Cabine #01 (Substituindo quadrado azul)
  const credX = cabine.x + 40;
  const credY = 1370;
  const credW = 125;
  const credH = 116;
  walls.push({ x: credX, y: credY + 20, w: credW, h: credH - 20, isObstacle: true, name: 'Armário Credenza Cabine 01' });

  const sideDeskX = credX + credW + 16;
  const sideDeskY = 1365;
  const sideDeskW = 210;
  const sideDeskH = 123;
  walls.push({ x: sideDeskX, y: sideDeskY + 20, w: sideDeskW, h: sideDeskH - 20, isObstacle: true, name: 'Estação Auxiliar Cabine 01' });

  // 7. Bebedouro Ampliado com Galão na Recepção (dentro da área de clientes em todas as expansões)
  const reception = DEV_ROOMS.find(r => r.id === 'reception') || { x: 1450, y: 960, w: 990, h: 550 };
  const coolerX = reception.x + 90;
  const coolerY = reception.y + 325;
  walls.push({ x: coolerX, y: coolerY + 35, w: 72, h: 100, isObstacle: true, name: 'Bebedouro Recepção' });

  // 8. Sofá VIP Executivo Ampliado no canto inferior direito da Recepção (quando comprado)
  if (typeof devState !== 'undefined' && devState.upgrades && devState.upgrades.vip_sofa) {
    const sofaW = 260;
    const sofaH = 166;
    const sofaX = 2160;
    const sofaY = 1320;
    walls.push({ x: sofaX, y: sofaY + 30, w: sofaW, h: sofaH - 30, isObstacle: true, name: 'Sofá VIP Executivo' });
  }

  // 9. Cadeira Gamer Ampliada no local amarelo (Mega Cabine 01 inferior esquerdo)
  walls.push({ x: cabine.x + 55, y: 1210 + 35, w: 80, h: 80, isObstacle: true, name: 'Cadeira Gamer Cabine 01' });

  // 10. Bancadas de Compra & Hardware nos 3 locais vermelhos do corredor (Imagem 2)
  if (typeof DEV_HALLWAY_SHOP_SPOTS !== 'undefined') {
    DEV_HALLWAY_SHOP_SPOTS.forEach((spot, idx) => {
      walls.push({
        x: spot.x,
        y: spot.y + 20,
        w: spot.w,
        h: spot.h - 20,
        isObstacle: true,
        name: 'Bancada de Hardware #' + (idx + 1)
      });
    });
  }

  // 11. Servidor Dedicado no local vermelho (quando comprado rack_lvl1 ou rack_lvl2)
  if (typeof devState !== 'undefined' && devState.upgrades && (devState.upgrades.rack_lvl1 || devState.upgrades.rack_lvl2)) {
    walls.push({ x: 140, y: 825 + 20, w: 230, h: 133 - 20, isObstacle: true, name: 'Servidor Dedicado' });
  }

  // 12. Cluster Datacenter no local azul (acompanha dinamicamente a expansão da porta da Mega Cabine #01)
  const cabDoorEnd = (cabine && cabine.door) ? (cabine.door.x + cabine.door.w) : (cabine.x + 900);
  const clusterX = cabDoorEnd + 70;
  const clusterY = 825;
  const clusterW = 160;
  const clusterH = 134;
  walls.push({ x: clusterX, y: clusterY + 20, w: clusterW, h: clusterH - 20, isObstacle: true, name: 'Cluster Datacenter Cloud' });

  // 13. Mesa de Reuniões no local verde (dentro da Cabine #01)
  walls.push({ x: 880 + 15, y: 1270 + 25, w: 360 - 30, h: 169 - 30, isObstacle: true, name: 'Mesa de Reuniões' });

  return walls;
}

// Inicializa layout inicial da sede
rebuildOfficeLayout(1);

function canMoveTo(newX, newY, radius = 16) {
  if (newX - radius < 24 || newX + radius > 2456 || newY - radius < 174 || newY + radius > 1528) {
    return false;
  }
  for (let i = 0; i < devSolidWalls.length; i++) {
    const box = devSolidWalls[i];
    const closestX = Math.max(box.x, Math.min(newX, box.x + box.w));
    const closestY = Math.max(box.y, Math.min(newY, box.y + box.h));
    const distX = newX - closestX;
    const distY = newY - closestY;
    if ((distX * distX + distY * distY) < (radius * radius)) {
      return false;
    }
  }
  return true;
}

// ============================================================================
// TEMPLATES E FILA DE CLIENTES (4.000+ CASOS & 190 PUZZLES)
// ============================================================================
const SOFTWARE_CLIENT_TEMPLATES = [
  {
    clientName: 'Lucas "Zigue" Santos',
    sector: 'Pessoa Física · Criador de Conteúdo',
    device: 'Twitch Bot & Overlay Interativo em Tempo Real',
    code: 'BOT-8821',
    urgency: 'MÉDIA',
    tagClass: 'tag-normal',
    quote: 'Preciso de um Bot com inteligência artificial para ler o chat da Twitch e disparar efeitos de luz RGB no meu quarto!',
    mentorHint: 'Bots em tempo real exigem WebSockets leves, rate limiting no Redis e tratamento contra flood de mensagens.',
    look: { skin: '#ffdbb5', hair: '#7c3aed', shirt: '#ec4899', glasses: false, headset: true, mood: 'happy' },
    categoryPreference: 'backend_api',
    requirements: {
      backend: 'WebSockets de baixa latência (<50ms) com cache Redis para contagem de pontos instantânea.',
      frontend: 'Overlay web transparente em tempo real com animações CSS a 60fps.',
      qa: 'Filtro anti-spam rigoroso com rate limiting por espectador.',
      cloud: 'Container Docker leve com auto-restart em caso de queda do link.',
      techLead: 'Arquitetura orientada a eventos desacoplada da API principal.'
    }
  },
  {
    clientName: 'Seu Carlos Mendes',
    sector: 'Comércio Local · Pizzaria Forno Nobre',
    device: 'App de Delivery & Cardápio com Pix Automático',
    code: 'APP-1044',
    urgency: 'ALTA',
    tagClass: 'tag-urgent',
    quote: 'O iFood cobra 27% de comissão! Preciso de um App próprio de delivery com Pix automático para os clientes pedirem direto!',
    mentorHint: 'Apps de delivery precisam de webhook confiável com o Banco Central e impressão automática na impressora térmica da cozinha.',
    look: { skin: '#ffedd5', hair: '#1c1917', shirt: '#ea580c', glasses: false, headset: false, mood: 'happy' },
    categoryPreference: 'frontend_mobile',
    requirements: {
      backend: 'Webhook de confirmação Pix assíncrono com retentativa exponencial e idempotência.',
      frontend: 'Interface mobile responsiva Flutter com carrinho rápido e suporte offline PWA.',
      qa: 'Validação rigorosa de CEP, endereço e geolocalização de entregas.',
      cloud: 'Banco de dados PostgreSQL com backup diário em nuvem.',
      techLead: 'Monolito modular enxuto com baixo custo operacional de infraestrutura.'
    }
  },
  {
    clientName: 'Eduardo Viana',
    sector: 'Fintech & Banco Digital Corporativo',
    device: 'SuperApp Bancário & Motor de Transações Pix B2B',
    code: 'BANK-9940',
    urgency: 'CRÍTICA',
    tagClass: 'tag-critical',
    quote: 'Transacionamos R$ 40 milhões por dia! Precisamos de segurança bancária ponta a ponta e zero downtime!',
    mentorHint: 'Bancos digitais exigem auditoria rigorosa, TLS 1.3, mTLS entre microsserviços e conformidade BACEN.',
    look: { skin: '#fed7aa', hair: '#0f172a', shirt: '#0284c7', glasses: true, headset: false, mood: 'neutral' },
    categoryPreference: 'qa_cybersecurity',
    requirements: {
      backend: 'Transações atômicas ACID com idempotency-key e ledger imutável (Event Sourcing).',
      frontend: 'Autenticação biométrica (Face ID / Fingerprint) com proteção de tela contra capturas.',
      qa: 'Conformidade BACEN/LGPD com auditoria OWASP, pentest automatizado e zero vulnerabilidades.',
      cloud: 'Cluster Kubernetes Multi-AZ com tolerância a falhas e mTLS Zero-Trust.',
      techLead: 'SLA de 99.99% com failover automático e plano de continuidade RTO < 5 minutos.'
    }
  },
  {
    clientName: 'Dra. Beatriz Fontana',
    sector: 'Saúde Pública & Hospital Municipal',
    device: 'Prontuário Hospitalar Eletrônico & Telemedicina',
    code: 'MED-5502',
    urgency: 'CRÍTICA',
    tagClass: 'tag-critical',
    quote: 'Em uma UTI, 10 segundos fora do ar custam vidas humanas! O prontuário deve ser ultra-seguro e imune a quedas de internet.',
    mentorHint: 'Sistemas de saúde exigem conformidade HIPAA/LGPD, criptografia em repouso AES-256 e redundância local.',
    look: { skin: '#ffdbb5', hair: '#b45309', shirt: '#059669', glasses: false, headset: true, mood: 'neutral' },
    categoryPreference: 'cloud_devops_ai',
    requirements: {
      backend: 'API REST com criptografia AES-256-GCM para dados clínicos e histórico imutável.',
      frontend: 'Interface em alto contraste acessível (WCAG AAA) com carregamento instantâneo de exames.',
      qa: 'Testes de carga com injeção de falhas simulando queda de internet e pico de internações.',
      cloud: 'Hospedagem em nuvem privada com sincronização de servidor local redundante no hospital.',
      techLead: 'Arquitetura com Circuit Breaker, failover instantâneo e tempo de recuperação RTO de 0s.'
    }
  },
  {
    clientName: 'Roberto Brandão',
    sector: 'Setor Público · Prefeitura Municipal',
    device: 'Portal de Serviços ao Cidadão & IPTU Online',
    code: 'GOV-7718',
    urgency: 'ALTA',
    tagClass: 'tag-urgent',
    quote: 'No dia do IPTU nosso site antigo cai e a população fica furiosa! Queremos portal moderno e estável!',
    mentorHint: 'Portais de governo sofrem picos sazonais maciços: cache de borda via CDN e filas assíncronas são vitais.',
    look: { skin: '#ffedd5', hair: '#334155', shirt: '#475569', glasses: true, headset: false, mood: 'neutral' },
    categoryPreference: 'tech_lead',
    requirements: {
      backend: 'Geração assíncrona de boletos e guias PDF com fila RabbitMQ.',
      frontend: 'Portal web leve acessível por qualquer navegador celular com CDN Cloudflare.',
      qa: 'Testes de estresse simulando 100.000 acessos simultâneos sem perda de requisições.',
      cloud: 'Autoscaling em nuvem pública escalando pods de 5 para 80 instâncias sob demanda.',
      techLead: 'Arquitetura em microsserviços com filas assíncronas para processamento em lote.'
    }
  },
  {
    clientName: 'Mariana Lima',
    sector: 'Terceiro Setor · ONG SOS Pantanal & Fauna',
    device: 'App de Mapeamento de Queimadas & Resgate Animal',
    code: 'ECO-3329',
    urgency: 'MÉDIA',
    tagClass: 'tag-normal',
    quote: 'Nossos voluntários estão em áreas remotas sem sinal celular! Precisamos de mapas offline sincronizados por satélite.',
    mentorHint: 'Aplicações de campo exigem banco local (SQLite/WatermelonDB) com sincronização em lote ao recuperar sinal.',
    look: { skin: '#fed7aa', hair: '#92400e', shirt: '#16a34a', glasses: false, headset: false, mood: 'happy' },
    categoryPreference: 'frontend_mobile',
    requirements: {
      backend: 'Sincronização delta eficiente transferindo apenas coordenadas e fotos compactadas.',
      frontend: 'Mapas vetoriais cacheados localmente com suporte a GPS offline no Flutter.',
      qa: 'Testes simulando modo avião contínuo e reconexão intermitente com perdas de pacotes.',
      cloud: 'Armazenamento em nuvem de fotos de satélite com bucket S3 e compressão WebP.',
      techLead: 'Padrão Offline-First com resolução determinística de conflitos de dados.'
    }
  }
];

function prepareClientEntity(rawCase, idx, reception, puzzlesDb) {
  const recDoorCenterX = reception.door.x + reception.door.w / 2;
  const insideTargetX = reception.x + 80 + ((idx * 140) % Math.max(160, reception.w - 180));
  const insideTargetY = 1040 + ((idx * 60) % 360);

  // Puzzle de engenharia associado dos 190 puzzles
  let puzzle = null;
  if (puzzlesDb && puzzlesDb.length > 0) {
    if (rawCase.puzzleId) {
      puzzle = puzzlesDb.find(p => p.id === rawCase.puzzleId);
    }
    if (!puzzle) {
      const catList = puzzlesDb.filter(p => p.category === rawCase.categoryPreference);
      puzzle = catList.length > 0 ? catList[idx % catList.length] : puzzlesDb[idx % puzzlesDb.length];
    }
  }
  if (!puzzle) {
    puzzle = {
      id: 'be_01',
      category: 'backend_api',
      categoryLabel: 'Backend & APIs',
      icon: '⚡',
      title: 'Roteamento REST e Códigos de Status HTTP',
      appType: rawCase.device || 'API REST',
      clientDemand: rawCase.quote || 'API precisa de rotas semânticas.',
      technicalContext: 'Retornar código de status e headers adequados para o recurso criado.',
      codeSnippet: 'app.post("/api/resource", async (req, res) => {\n  return res.status(201).json(created);\n});',
      options: [
        { text: 'Status 200 OK sem header de localização', correct: false },
        { text: 'Status 201 Created com header Location para o recurso criado', correct: true },
        { text: 'Status 204 No Content com corpo vazio', correct: false },
        { text: 'Status 301 Moved Permanently', correct: false }
      ],
      explanation: 'REST estipula status 201 Created para recursos criados via POST.'
    };
  }

  // Clonagem profunda de perguntas e módulos com fallback automático se rawCase vier de template legado
  const reqs = rawCase.requirements || {
    backend: 'API REST com rate limit e cache Redis.',
    frontend: 'Interface moderna e responsiva.',
    qa: 'Testes automatizados e segurança.',
    cloud: 'Containers em nuvem com autoscaling.',
    techLead: 'Clean Architecture e governança técnica.'
  };

  const questions = (rawCase.questions && rawCase.questions.length === 5)
    ? rawCase.questions.map(q => ({ ...q, asked: false }))
    : [
        { q: `1. Qual a meta de Backend para o ${rawCase.device || 'aplicativo'}?`, a: reqs.backend, category: 'backend', asked: false },
        { q: `2. Como deve ser a experiência de Frontend & Mobile?`, a: reqs.frontend, category: 'frontend', asked: false },
        { q: `3. Quais as políticas de QA & Segurança?`, a: reqs.qa, category: 'qa', asked: false },
        { q: `4. Qual a estratégia de Cloud, DevOps & IA?`, a: reqs.cloud, category: 'cloud', asked: false },
        { q: `5. Qual o direcionamento arquitetural de Tech Lead?`, a: reqs.techLead || reqs.tech_lead || 'Clean Architecture', category: 'techLead', asked: false }
      ];

  const appModules = (rawCase.appModules && rawCase.appModules.backend)
    ? JSON.parse(JSON.stringify(rawCase.appModules))
    : {
        backend: {
          id: 'backend',
          title: '⚡ 1. Módulo Backend & APIs',
          options: [
            { title: `API Otimizada (Alinhada)`, desc: reqs.backend, matches: true },
            { title: 'Monólito Legado Sem Índices', desc: 'Consultas N+1 que travam com mais de 10 conexões.', matches: false },
            { title: 'Overkill Experimental Sem Testes', desc: '40 microsserviços sem mensageria com 4s de latência.', matches: false }
          ]
        },
        frontend: {
          id: 'frontend',
          title: '🎨 2. Módulo Frontend & Mobile',
          options: [
            { title: `Interface Moderna & Responsiva (Alinhada)`, desc: reqs.frontend, matches: true },
            { title: 'Webview Lenta Sem Suporte Offline', desc: 'Layout quebrado em celulares sem PWA.', matches: false },
            { title: 'Bundle Gigante Bloqueante (45MB)', desc: 'Scripts pesados que travam conexões móveis.', matches: false }
          ]
        },
        qa: {
          id: 'qa',
          title: '🛡️ 3. Módulo QA & Cybersecurity',
          options: [
            { title: `Blindagem DevSecOps & Testes (Alinhada)`, desc: reqs.qa, matches: true },
            { title: 'Sem Testes nem Sanitização', desc: 'Deploy direto sem linters vulnerável a SQL Injection.', matches: false },
            { title: 'CORS Aberto em Asterisco (*)', desc: 'Cookies sem HttpOnly e logs expondo senhas.', matches: false }
          ]
        },
        cloud: {
          id: 'cloud',
          title: '🚀 4. Módulo Cloud, DevOps & IA',
          options: [
            { title: `Infraestrutura em Nuvem Resiliente (Alinhada)`, desc: reqs.cloud, matches: true },
            { title: 'VPS Compartilhado Sem Backup', desc: 'Instância única sem autoscaling nem redundância.', matches: false },
            { title: 'Cluster Superdimensionado com Custo Excessivo', desc: 'Fatura 10x maior sem políticas FinOps.', matches: false }
          ]
        },
        techLead: {
          id: 'techLead',
          title: '👑 5. Módulo Tech Lead & Arquitetura',
          options: [
            { title: `Clean Architecture & Governança (Alinhada)`, desc: reqs.techLead || reqs.tech_lead || 'Clean Architecture', matches: true },
            { title: 'Big Ball of Mud Sem Separação', desc: 'Código espaguete sem contratos nem documentação.', matches: false },
            { title: 'Engenharia de Marfim Inviável', desc: 'Complexidade teórica que atrasa o MVP em 2 anos.', matches: false }
          ]
        }
      };

  const diagnoses = (rawCase.diagnoses && rawCase.diagnoses.length === 3)
    ? JSON.parse(JSON.stringify(rawCase.diagnoses))
    : [
        {
          title: `Arquitetura Integrada do Aplicativo: ${rawCase.device || 'Software'}`,
          desc: `Consolida os requisitos levantados no briefing: ${reqs.backend} + ${reqs.frontend} + ${reqs.qa} + ${reqs.cloud}. SLA garantido.`,
          correct: true
        },
        {
          title: 'Stack Legada em Servidor Único sem Segurança',
          desc: 'Utiliza scripts antigos sem criptografia, sem testes de carga e sem autoscaling em nuvem.',
          correct: false,
          burnReason: 'O aplicativo caiu no primeiro pico de acessos, sofreu vazamento de dados e o cliente cancelou o contrato!'
        },
        {
          title: 'Arquitetura Fraturada com Tecnologias Incompatíveis',
          desc: 'Tenta misturar frameworks conflitantes sem camada de mensageria nem barramento de eventos.',
          correct: false,
          burnReason: 'Os microsserviços entraram em deadlock distribuído e a aplicação ficou completamente inoperante!'
        }
      ];

  // Paletas variadas e vibrantes para que cada cliente tenha aparência e cores únicas
  const clientSkinPalette = ['#ffdbb5', '#f3c19d', '#d89b72', '#c68b59', '#ffe4c4', '#f1c27d', '#e0ac69'];
  const clientHairPalette = ['#2c1e18', '#6b2737', '#d98a2b', '#1a1a24', '#4a2c11', '#7f8c8d', '#b45309', '#0f172a'];
  const clientShirtPalette = [
    '#8c6fd1', // Roxo (como Dona Neide no screenshot)
    '#4bb56b', // Verde (como Juliana Prado no screenshot)
    '#e5534b', // Vermelho (como Carlos Mendes no screenshot)
    '#0284c7', // Azul Ciano
    '#f59e0b', // Âmbar Laranja
    '#ec4899', // Rosa
    '#0d9488', // Teal
    '#6366f1', // Indigo
    '#eab308', // Dourado
    '#10b981'  // Esmeralda
  ];

  const assignedLook = rawCase.look ? { ...rawCase.look } : {
    skin: clientSkinPalette[idx % clientSkinPalette.length],
    hair: clientHairPalette[(idx * 3) % clientHairPalette.length],
    shirt: clientShirtPalette[idx % clientShirtPalette.length],
    glasses: (idx % 3 === 0),
    headset: false,
    mood: 'happy'
  };

  return {
    ...rawCase,
    caseIndex: idx,
    look: assignedLook,
    solved: false,
    diagnosisApproved: false,
    minigameDone: false,
    patience: 100,
    inMyRoom: false,
    walkingToDesk: false,
    arrivedAtDesk: false,
    leavingState: null,
    insideReception: false,
    enteringReception: true,
    entryDelay: (idx % 8) * 45,
    wanderDirection: (idx % 2 === 0) ? 'right' : 'left',
    pauseTimer: 0,
    x: 2430,
    y: 780,
    waypoints: [
      { x: 2260, y: 780 },
      { x: recDoorCenterX, y: 880 },
      { x: recDoorCenterX, y: 1040 },
      { x: insideTargetX, y: insideTargetY }
    ],
    wanderTarget: null,
    bubble: '',
    bubbleTimer: 0,
    puzzle: puzzle,
    puzzleSelected: null,
    puzzleErrorMsg: '',
    questions: questions,
    appModules: appModules,
    selectedModules: { backend: null, frontend: null, qa: null, cloud: null, techLead: null },
    diagnoses: diagnoses
  };
}

function createClientCasesQueue() {
  const reception = DEV_ROOMS.find(r => r.id === 'reception') || { x: 1450, y: 960, w: 990, h: 550, door: { x: 1520, y: 960, w: 160 } };
  const puzzlesDb = (typeof SOFTWARE_PUZZLES_DATABASE !== 'undefined' && SOFTWARE_PUZZLES_DATABASE.length > 0)
    ? SOFTWARE_PUZZLES_DATABASE
    : [];

  // Se o banco de 4.000+ casos estiver disponível, carrega os 8 casos iniciais da fila
  if (typeof SOFTWARE_CASES_DATABASE !== 'undefined' && SOFTWARE_CASES_DATABASE.length > 0) {
    const initialBatchSize = Math.min(8, SOFTWARE_CASES_DATABASE.length);
    const initialCases = [];
    for (let i = 0; i < initialBatchSize; i++) {
      initialCases.push(prepareClientEntity(SOFTWARE_CASES_DATABASE[i], i, reception, puzzlesDb));
    }
    return initialCases;
  }

  // Fallback para os templates padrão
  return SOFTWARE_CLIENT_TEMPLATES.map((tmpl, idx) => {
    return prepareClientEntity(tmpl, idx, reception, puzzlesDb);
  });
}

let devCases = createClientCasesQueue();

function spawnNextDatabaseClient() {
  if (typeof SOFTWARE_CASES_DATABASE === 'undefined' || SOFTWARE_CASES_DATABASE.length === 0) return;
  const activeCount = devCases.filter(c => !c.solved && !c.leavingState).length;
  if (activeCount >= 8) return;

  const nextRaw = SOFTWARE_CASES_DATABASE[devState.casesDatabaseIndex % SOFTWARE_CASES_DATABASE.length];
  devState.casesDatabaseIndex++;

  const reception = DEV_ROOMS.find(r => r.id === 'reception') || { x: 1450, y: 960, w: 990, h: 550, door: { x: 1520, y: 960, w: 160 } };
  const puzzlesDb = (typeof SOFTWARE_PUZZLES_DATABASE !== 'undefined') ? SOFTWARE_PUZZLES_DATABASE : [];

  const newClient = prepareClientEntity(nextRaw, devCases.length, reception, puzzlesDb);
  newClient.entryDelay = 0;
  devCases.push(newClient);
  addDevLog(`🚶 Novo cliente entrou na recepção: <b>${newClient.clientName}</b> (${newClient.company || newClient.sector}) - Projeto: ${newClient.device}`);
  renderAllUI();
}

function getConnectedPlayerCount() {
  if (devState.networkMode === 'solo') return 1;
  return Math.max(1, devState.players.filter(p => p.connected).length);
}

// ============================================================================
// COMPRA DE EQUIPAMENTOS DA LOJA
// ============================================================================
function buyShopItem(itemId) {
  const item = DEV_SHOP_CATALOG.find(x => x.id === itemId);
  if (!item) return false;

  if (item.category === 'workbench') {
    const currentLvl = devState.workbenchLevel || 1;
    if (item.level <= currentLvl) {
      showToast(`✅ Você já possui a Bancada Nível ${item.level} instalada!`);
      return false;
    }
    if (devState.money < item.price) {
      showToast(`⚠️ Saldo insuficiente! Você precisa de R$ ${item.price.toLocaleString('pt-BR')} (Caixa atual: R$ ${devState.money.toLocaleString('pt-BR')}).`);
      return false;
    }

    devState.money -= item.price;
    devState.workbenchLevel = item.level;
    devState.upgrades[item.id] = true;

    showToast(`🎉 PARABÉNS! Sua bancada foi atualizada para o Nível ${item.level}!`);
    addDevLog(`🛠️ <b>BANCADA ATUALIZADA:</b> Instalada a ${item.name}! Novos benefícios e visual aprimorado em jogo.`);
    renderShopModal();
    renderAllUI();
    return true;
  }

  if (item.category === 'expansion') {
    const currentTier = devState.soloExpansionTier || 1;
    if (item.tier <= currentTier) {
      showToast(`✅ Você já possui a Expansão Nível ${item.tier}x desbloqueada!`);
      return false;
    }
    if (devState.money < item.price) {
      showToast(`⚠️ Saldo insuficiente! Você precisa de R$ ${item.price.toLocaleString('pt-BR')} (Caixa atual: R$ ${devState.money.toLocaleString('pt-BR')}).`);
      return false;
    }

    devState.money -= item.price;
    devState.soloExpansionTier = item.tier;
    devState.upgrades[item.id] = true;
    setSoloExpansionTier(item.tier);
    renderShopModal();
    renderAllUI();
    return true;
  }

  if (devState.money < item.price) {
    showToast(`⚠️ Saldo insuficiente! Você precisa de R$ ${item.price.toLocaleString('pt-BR')} (Caixa atual: R$ ${devState.money.toLocaleString('pt-BR')}).`);
    return false;
  }

  devState.money -= item.price;

  if (item.id === 'rack_lvl1') {
    devState.upgrades.rack_lvl1 = true;
    devState.stackCapacity = 8;
    devState.stackParts = 8;
    showToast('🗄️ Servidor Local (Cap. 8) instalado na sua sala!');
  } else if (item.id === 'rack_lvl2') {
    devState.upgrades.rack_lvl1 = true;
    devState.upgrades.rack_lvl2 = true;
    devState.stackCapacity = 20;
    devState.stackParts = 20;
    showToast('🗄️ Cluster Dedicado (Cap. 20) instalado na sua sala!');
  } else if (item.id === 'rack_refill') {
    devState.stackParts = Math.min(devState.stackCapacity || 8, (devState.stackParts || 0) + 8);
    showToast('📦 +8 Módulos reutilizáveis adicionados ao seu servidor!');
  } else {
    devState.upgrades[item.id] = true;
    showToast(`🎉 Compra concluída: "${item.name}" instalado na sua sala!`);
  }

  renderShopModal();
  renderAllUI();
  return true;
}

// ============================================================================
// MOTOR GRÁFICO 2D: PROCEDURAL CANVAS & ANIMAÇÃO DE DESENVOLVEDORES / CLIENTES
// ============================================================================
let animTick = 0;
const keys = {};
let devSoftwareCanvas = null;
let devSoftwareCtx = null;


// ============================================================================
// MOTOR MULTIPLAYER P2P (PLANTÃO DEV: SALA ONLINE COM CÓDIGO - ATÉ 5 DEVS)
// ============================================================================
let devBcChannel = null;

let devMqttClient = null;
let devCurrentMqttTopic = null;
let isDevMqttConnected = false;

function normalizeDevRoomCode(code) {
  if (!code) return '';
  const digits = String(code).trim().replace(/[^0-9]/g, '');
  return digits || String(Math.floor(1000 + Math.random() * 9000));
}

function connectDevMqttRoom(roomCode, onConnectSuccess) {
  const cleanCode = normalizeDevRoomCode(roomCode);
  const topic = 'omnivoid/plantaodev/room/' + cleanCode;
  
  if (devMqttClient) {
    try { devMqttClient.disconnect(); } catch (e) {}
    devMqttClient = null;
    isDevMqttConnected = false;
  }
  
  if (typeof Paho === 'undefined' || !Paho.MQTT) {
    console.warn('[Plantão Dev] Paho MQTT não carregado. Operando via canal local e PeerJS.');
    if (onConnectSuccess) onConnectSuccess();
    return;
  }

  const clientId = 'omnivoid_dev_' + devState.myPeerId + '_' + Math.random().toString(36).slice(2, 6);
  const client = new Paho.MQTT.Client('broker.hivemq.com', 8884, '/mqtt', clientId);
  devMqttClient = client;
  devCurrentMqttTopic = topic;

  client.onMessageArrived = (message) => {
    try {
      const data = JSON.parse(message.payloadString);
      if (!data || data.peerId === devState.myPeerId) return;
      handleDevNetworkMessage(data);
    } catch (e) {
      console.warn('[Plantão Dev] Erro ao processar mensagem MQTT:', e);
    }
  };

  client.onConnectionLost = (responseObject) => {
    isDevMqttConnected = false;
    if (responseObject.errorCode !== 0) {
      console.warn('[Plantão Dev] Conexão com servidor caiu:', responseObject.errorMessage);
      setTimeout(() => {
        if (devState.networkMode === 'online') {
          connectDevMqttRoom(devState.roomCode);
        }
      }, 3000);
    }
  };

  client.connect({
    useSSL: true,
    timeout: 6,
    keepAliveInterval: 30,
    cleanSession: true,
    onSuccess: () => {
      isDevMqttConnected = true;
      client.subscribe(topic, { qos: 0 });
      console.log('[Plantão Dev] Conectado ao Servidor Nuvem MQTT na sala ' + cleanCode);
      if (onConnectSuccess) onConnectSuccess();
    },
    onFailure: (err) => {
      isDevMqttConnected = false;
      console.warn('[Plantão Dev] Falha ao conectar ao servidor MQTT:', err);
    }
  });
}

function kickDevPlayer(slot) {
  const p = devState.players[slot];
  if (!p || !p.connected) return;
  if (!confirm('Deseja realmente demitir e expulsar ' + p.name + ' da Software House?')) return;
  broadcastDevNet({ type: 'kick_player', slot: slot, peerId: p.peerId });
  p.connected = false;
  p.peerId = null;
  addChatMessage('Plantão Dev', '🚫 ' + p.name + ' foi demitido e expulso da Software House pelo Tech Lead!');
  showToast('🚫 ' + p.name + ' foi expulso da sala.');
  renderAllUI();
}
window.kickDevPlayer = kickDevPlayer;

let devPeerInstance = null;
let devPeerConnections = [];

function initDevMultiplayerRoom(code) {
  const numericPart = normalizeDevRoomCode(code);
  devState.roomCode = 'DEV-' + numericPart;
  devState.myPeerId = devState.myPeerId || ('dev_' + Math.random().toString(36).slice(2, 9));
  devState.networkMode = 'online';

  // Atualiza botões de modo
  document.getElementById('btn-mode-solo')?.classList.remove('active');
  document.getElementById('btn-mode-online')?.classList.add('active');

  // Atualiza displays de código
  const displayCode = document.getElementById('display-room-code');
  if (displayCode) displayCode.textContent = devState.roomCode;
  const lobbyCode = document.getElementById('lobby-current-code');
  if (lobbyCode) lobbyCode.textContent = devState.roomCode;
  const sessionPill = document.getElementById('session-code-pill');
  if (sessionPill) sessionPill.textContent = 'Sala: ' + devState.roomCode;

  // 1. MQTT Nuvem
  connectDevMqttRoom(numericPart, () => {
    broadcastDevNet({
      type: 'join_request',
      peerId: devState.myPeerId,
      playerName: devState.players[devState.mySlotIndex]?.name || 'Dev Convidado'
    });
  });

  // 2. BroadcastChannel
  if (devBcChannel) {
    try { devBcChannel.close(); } catch (e) {}
  }
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    try {
      devBcChannel = new BroadcastChannel('plantaodev_net_' + numericPart);
      devBcChannel.onmessage = (ev) => handleDevNetworkMessage(ev.data);
      devBcChannel.postMessage({
        type: 'join_request',
        peerId: devState.myPeerId,
        playerName: devState.players[devState.mySlotIndex]?.name || 'Dev Convidado'
      });
    } catch (e) {}
  }

  // 3. PeerJS
  if (typeof window !== 'undefined' && window.Peer) {
    try {
      if (devPeerInstance) {
        devPeerInstance.destroy();
        devPeerInstance = null;
      }
      devPeerConnections = [];

      const hostPeerId = 'plantaodev-v2-' + numericPart;
      devPeerInstance = new Peer(hostPeerId);

      devPeerInstance.on('open', () => {
        devState.mySlotIndex = 0;
        devState.players[0].connected = true;
        devState.players[0].peerId = devState.myPeerId;
        showToast('🔑 Sala [' + devState.roomCode + '] criada! Você é o Tech Lead na Estação #01.');
        renderAllUI();
      });

      devPeerInstance.on('connection', (conn) => {
        devPeerConnections.push(conn);
        conn.on('data', (data) => handleDevNetworkMessage(data, conn));
        conn.on('close', () => {
          handleDevPeerDisconnect(conn);
        });
      });

      devPeerInstance.on('error', (err) => {
        if (err.type === 'unavailable-id') {
          const guestPeer = new Peer();
          devPeerInstance = guestPeer;
          guestPeer.on('open', () => {
            const conn = guestPeer.connect(hostPeerId, { reliable: true });
            devPeerConnections.push(conn);
            conn.on('open', () => {
              conn.send({
                type: 'join_request',
                peerId: devState.myPeerId,
                playerName: devState.players[devState.mySlotIndex]?.name || 'Dev Squad Partner'
              });
            });
            conn.on('data', (data) => handleDevNetworkMessage(data, conn));
            conn.on('close', () => {
              showToast('⚠️ Desconectado da sala do Tech Lead.');
            });
          });
          guestPeer.on('error', (gErr) => {
            console.warn('Guest Peer error:', gErr);
          });
        }
      });
    } catch (e) {
      console.warn('PeerJS init failed:', e);
    }
  }

  showToast('🌐 Modo Dev Squad ativado! Código: ' + devState.roomCode);
  renderAllUI();
}

function broadcastDevNet(msg) {
  if (!msg) return;
  if (!msg.peerId) msg.peerId = devState.myPeerId;

  if (devBcChannel) {
    try { devBcChannel.postMessage(msg); } catch (e) {}
  }
  devPeerConnections.forEach(c => {
    try { if (c && c.open) c.send(msg); } catch (e) {}
  });
  if (devMqttClient && isDevMqttConnected && devCurrentMqttTopic) {
    try {
      const raw = JSON.stringify(msg);
      const mqttMsg = new Paho.MQTT.Message(raw);
      mqttMsg.destinationName = devCurrentMqttTopic;
      mqttMsg.qos = 0;
      devMqttClient.send(mqttMsg);
    } catch (e) {}
  }
}

function handleDevNetworkMessage(data, conn) {
  if (data.type === 'kick_player') {
    if (data.slot === devState.mySlotIndex || (data.peerId && data.peerId === devState.myPeerId)) {
      alert('🚫 Você foi demitido e expulso da Software House pelo Tech Lead!');
      devState.mySlotIndex = 0;
      devState.networkMode = 'solo';
      try { if (devMqttClient) devMqttClient.disconnect(); } catch (e) {}
      window.location.reload();
      return;
    } else {
      const p = devState.players[data.slot];
      if (p) {
        p.connected = false;
        p.peerId = null;
        renderAllUI();
      }
    }
    return;
  }

  if (!data || data.peerId === devState.myPeerId) return;

  if (data.type === 'join_request') {
    // Se sou o host (Slot 0), atribuo o próximo slot vago
    if (devState.mySlotIndex === 0) {
      let assigned = devState.players.find(p => p.peerId === data.peerId);
      if (!assigned) {
        assigned = devState.players.find((p, idx) => idx > 0 && !p.connected);
        if (assigned) {
          assigned.connected = true;
          assigned.peerId = data.peerId;
          assigned.bubble = 'Entrei no Dev Squad! 🚀';
          assigned.bubbleTimer = 240;
          addChatMessage('Plantão Dev', '🎉 ' + assigned.name + ' conectou na sala (' + getConnectedPlayerCount() + '/5 Devs ativos)!');
          showToast('🌐 ' + assigned.name + ' entrou no Dev Squad!');
          renderAllUI();
        }
      }
      broadcastDevNet({
        type: 'room_sync',
        peerId: devState.myPeerId,
        assignedPeerId: data.peerId,
        assignedSlot: assigned ? assigned.slot : 1,
        connectedSlots: devState.players.map(p => ({
          slot: p.slot,
          connected: p.connected,
          peerId: p.peerId,
          x: p.x,
          y: p.y
        })),
        money: devState.money,
        rep: devState.rep,
        upgrades: devState.upgrades,
        soloExpansionTier: devState.soloExpansionTier
      });
    }
  } else if (data.type === 'room_sync') {
    // Sincroniza meu slot se for eu que estou entrando
    if (data.assignedPeerId === devState.myPeerId && devState.mySlotIndex === 0 && data.assignedSlot > 0) {
      devState.mySlotIndex = data.assignedSlot;
      const you = devState.players[devState.mySlotIndex];
      if (you) {
        you.connected = true;
        // Posiciona na sala da sua especialidade
        const upperStation = DEV_UPPER_ROOMS[devState.mySlotIndex - 1];
        if (upperStation) {
          you.x = upperStation.x + Math.round(upperStation.w / 2);
          you.y = upperStation.y + 230;
        }
      }
      showToast('🌐 Conectado na Estação Dev #' + String(devState.mySlotIndex + 1).padStart(2, '0') + ' (' + devState.players[devState.mySlotIndex]?.name + ')!');
    }
    // Sincroniza estado de conexões dos outros slots
    if (data.connectedSlots) {
      data.connectedSlots.forEach(s => {
        const p = devState.players[s.slot];
        if (p) {
          p.connected = s.connected;
          if (s.peerId) p.peerId = s.peerId;
        }
      });
    }
    if (typeof data.money === 'number') devState.money = data.money;
    if (typeof data.rep === 'number') devState.rep = data.rep;
    if (data.upgrades) Object.assign(devState.upgrades, data.upgrades);
    if (data.soloExpansionTier && data.soloExpansionTier > devState.soloExpansionTier) {
      setSoloExpansionTier(data.soloExpansionTier);
    }
    renderAllUI();
  } else if (data.type === 'player_move') {
    const p = devState.players[data.slot];
    if (p && data.slot !== devState.mySlotIndex) {
      p.connected = true;
      p.x = data.x;
      p.y = data.y;
      p.isMoving = data.isMoving;
      if (data.bubble) {
        p.bubble = data.bubble;
        p.bubbleTimer = 180;
      }
    }
  } else if (data.type === 'chat_sticker') {
    const p = devState.players[data.slot];
    if (p) {
      p.bubble = data.text;
      p.bubbleTimer = 240;
    }
    addChatMessage(data.author || 'Colega Dev', data.text);
  }
}

function handleDevPeerDisconnect(conn) {
  const idx = devPeerConnections.indexOf(conn);
  if (idx !== -1) devPeerConnections.splice(idx, 1);
  devState.players.forEach((p, sIdx) => {
    if (sIdx > 0 && conn && conn.peer && p.peerId === conn.peer) {
      p.connected = false;
      p.peerId = null;
      addChatMessage('Plantão Dev', '👋 ' + p.name + ' desconectou da sala.');
      showToast('👋 ' + p.name + ' desconectou.');
    }
  });
  renderAllUI();
}

function simulateDevPartner() {
  const freeSlotIdx = devState.players.findIndex((p, idx) => idx > 0 && !p.connected);
  if (freeSlotIdx !== -1) {
    const p = devState.players[freeSlotIdx];
    p.connected = true;
    p.bubble = 'Online no Dev Squad! 💻';
    p.bubbleTimer = 300;
    const upperStation = DEV_UPPER_ROOMS[freeSlotIdx - 1];
    if (upperStation) {
      p.x = upperStation.x + Math.round(upperStation.w / 2);
      p.y = upperStation.y + 230;
    }
    addChatMessage('Plantão Dev', '🎉 ' + p.name + ' conectou via simulação (' + getConnectedPlayerCount() + '/5 Devs ativos)!');
    showToast('🤖 ' + p.name + ' conectado na Estação Dev #' + String(freeSlotIdx + 1).padStart(2, '0') + '!');
  } else {
    const lastConnected = [4, 3, 2, 1].find(i => devState.players[i].connected);
    if (lastConnected) {
      devState.players[lastConnected].connected = false;
      devState.players[lastConnected].bubble = '';
      showToast('🤖 ' + devState.players[lastConnected].name + ' desconectado.');
    }
  }
  renderAllUI();
}

function addChatMessage(author, text) {
  const feed = document.getElementById('chat-feed') || document.getElementById('dev-chat-log');
  if (feed) {
    const msg = document.createElement('div');
    msg.className = 'chat-msg';
    msg.innerHTML = '<span style="font-size:14px; margin-right:4px;">💬</span><div><b>' + author + ':</b> ' + text + '</div>';
    feed.appendChild(msg);
    feed.scrollTop = feed.scrollHeight;
  }
}

function update() {
  animTick++;

  // Movimentação do Jogador Principal (WASD ou Setas com detecção de paredes)
  const you = devState.players[devState.mySlotIndex];
  if (you) {
    let speed = 5.2;
    if (devState.coffeeBoostTimer > 0) {
      speed = 7.0;
      devState.coffeeBoostTimer--;
    }

    let moveX = 0;
    let moveY = 0;
    if (keys['w'] || keys['arrowup']) moveY -= speed;
    if (keys['s'] || keys['arrowdown']) moveY += speed;
    if (keys['a'] || keys['arrowleft']) moveX -= speed;
    if (keys['d'] || keys['arrowright']) moveX += speed;

    if (moveX !== 0 || moveY !== 0) {
      const nextX = you.x + moveX;
      const nextY = you.y + moveY;
      if (canMoveTo(nextX, you.y)) you.x = nextX;
      if (canMoveTo(you.x, nextY)) you.y = nextY;
      you.isMoving = true;
      you.waypoints = [];
    } else if (you.waypoints && you.waypoints.length > 0) {
      const target = you.waypoints[0];
      const dx = target.x - you.x;
      const dy = target.y - you.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 7) {
        you.x = target.x;
        you.y = target.y;
        you.waypoints.shift();
        you.isMoving = false;
      } else {
        const stepX = you.x + (dx / dist) * speed;
        const stepY = you.y + (dy / dist) * speed;
        if (canMoveTo(stepX, stepY)) {
          you.x = stepX;
          you.y = stepY;
        } else {
          you.waypoints = [];
        }
        you.isMoving = true;
      }
    } else {
      you.isMoving = false;
    }
    updateCurrentRoomPill(you);
    if (devState.networkMode === 'online' && animTick % 3 === 0) {
      broadcastDevNet({
        type: 'player_move',
        peerId: devState.myPeerId,
        slot: devState.mySlotIndex,
        x: Math.round(you.x),
        y: Math.round(you.y),
        isMoving: you.isMoving,
        bubble: you.bubbleTimer > 0 ? you.bubble : null
      });
    }
  }

  // Atualização dos balões de fala dos desenvolvedores
  devState.players.forEach(p => {
    if (p.bubbleTimer > 0) {
      p.bubbleTimer--;
      if (p.bubbleTimer <= 0) p.bubble = '';
    }
  });

  // Atualização dos Clientes da Fila
  const connectedCount = getConnectedPlayerCount();
  const pFactor = 1.0 + (connectedCount - 1) * 0.85;
  const workbenchOpen = document.getElementById('dev-workbench-modal')?.classList.contains('open');

  devCases.forEach((c, idx) => {
    // 1. Movimentação inicial de entrada dos clientes pela porta direita
    if (c.enteringReception) {
      if (c.entryDelay > 0) {
        c.entryDelay--;
        return;
      }
      if (c.waypoints && c.waypoints.length > 0) {
        const wp = c.waypoints[0];
        const dx = wp.x - c.x;
        const dy = wp.y - c.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 8) {
          c.x = wp.x;
          c.y = wp.y;
          c.waypoints.shift();
        } else {
          c.x += (dx / dist) * 2.8;
          c.y += (dy / dist) * 2.8;
          c.isMoving = true;
        }
      } else {
        c.enteringReception = false;
        c.insideReception = true;
        c.isMoving = false;
      }
      return;
    }

    // 2. Movimentação autônoma contínua dentro da recepção
    if (!c.walkingToDesk && !c.arrivedAtDesk && !c.leavingState && c.insideReception) {
      const reception = DEV_ROOMS.find(r => r.id === 'reception') || { x: 1450, y: 960, w: 990, h: 550 };
      const minX = reception.x + 60;
      const maxX = reception.x + reception.w - 80;
      const minY = reception.y + 80;
      const maxY = reception.y + reception.h - 60;

      if (c.pauseTimer > 0) {
        c.pauseTimer--;
        c.isMoving = false;
      } else {
        c.isMoving = true;
        const speed = 1.1;
        if (c.wanderDirection === 'right') {
          c.x += speed;
          if (c.x >= maxX) {
            c.wanderDirection = 'left';
            c.pauseTimer = Math.floor(40 + Math.random() * 80);
          }
        } else {
          c.x -= speed;
          if (c.x <= minX) {
            c.wanderDirection = 'right';
            c.pauseTimer = Math.floor(40 + Math.random() * 80);
          }
        }
        if (c.y < minY) c.y = minY;
        if (c.y > maxY) c.y = maxY;
      }
    } else if (c.walkingToDesk) {
      if (c.waypoints && c.waypoints.length > 0) {
        const wp = c.waypoints[0];
        const dx = wp.x - c.x;
        const dy = wp.y - c.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 8) {
          c.x = wp.x;
          c.y = wp.y;
          c.waypoints.shift();
        } else {
          c.x += (dx / dist) * 3.4;
          c.y += (dy / dist) * 3.4;
          c.isMoving = true;
        }
      } else {
        c.isMoving = false;
        c.walkingToDesk = false;
        c.arrivedAtDesk = true;
        showToast(`💬 ${c.clientName} sentou na sua bancada: Pronto para o Briefing!`);
        openDevWorkbenchModal();
      }
    } else if (c.leavingState) {
      if (c.waypoints && c.waypoints.length > 0) {
        const wp = c.waypoints[0];
        const dx = wp.x - c.x;
        const dy = wp.y - c.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 8) {
          c.x = wp.x;
          c.y = wp.y;
          c.waypoints.shift();
        } else {
          c.x += (dx / dist) * 3.2;
          c.y += (dy / dist) * 3.2;
          c.isMoving = true;
        }
      } else {
        c.isMoving = false;
      }
    }

    // Dreno de Paciência do cliente (diminui mais rápido conforme quantidade de técnicos)
    if (!c.solved && !c.leavingState) {
      // 1 Técnico: 1.00x (~95s de paciência base)
      // 2 Técnicos: 1.90x (~50s de espera)
      // 3 Técnicos: 2.80x (~34s de espera)
      // 4 Técnicos: 3.70x (~25s de espera)
      // 5 Técnicos: 4.60x (~20s de espera frenética!)
      const baseDrain = (idx < 3 ? 0.0175 : (idx < 6 ? 0.0140 : 0.0110));
      const techPatienceSpeedMult = 1.0 + (connectedCount - 1) * 0.90;
      let drain = baseDrain * techPatienceSpeedMult;

      if (c.specialDetail && c.specialDetail.patienceDecayMult) {
        drain *= c.specialDetail.patienceDecayMult;
      }
      if (devState.upgrades.vip_sofa) drain *= 0.70; // Sofá executivo dá conforto aos clientes
      if (workbenchOpen && idx === devState.activeCaseIndex) drain *= 0.20; // Sendo atendido na mesa

      c.patience = Math.max(0, c.patience - drain);

      if (c.patience <= 0) {
        c.leavingState = 'leaving_angry';
        c.arrivedAtDesk = false;
        c.walkingToDesk = false;
        c.insideReception = false;
        c.enteringReception = false;
        c.waypoints = [{ x: 2350, y: 880 }, { x: 2460, y: 780 }];
        if (typeof PlantaoDevProfile !== "undefined" && PlantaoDevProfile.recordCrash) {
          PlantaoDevProfile.recordCrash();
        }
        saveDevGameState();

        // Dificuldade aumentada: multas e perda de reputação escalam com a quantidade de técnicos
        const cancelPenaltyMoney = Math.round(400 * (1.0 + (connectedCount - 1) * 0.50));
        const cancelPenaltyRep = Math.round(15 * (1.0 + (connectedCount - 1) * 0.35));

        devState.money = Math.max(0, devState.money - cancelPenaltyMoney);
        changeReputation(-cancelPenaltyRep);
        showToast(`🤬 ${c.clientName} cansou de esperar na fila (${connectedCount} Devs) e cancelou! (-R$ ${cancelPenaltyMoney} e -${cancelPenaltyRep}% Reputação)`);
        addDevLog(`🤬 <b>${c.clientName}</b> cancelou o contrato por demora na fila (-R$ ${cancelPenaltyMoney} | -${cancelPenaltyRep}% Rep).`);
        if (workbenchOpen && idx === devState.activeCaseIndex) {
          document.getElementById('dev-workbench-modal').classList.remove('open');
        }
        spawnNextDatabaseClient();
        const nextIdx = devCases.findIndex(x => !x.solved && !x.leavingState);
        if (nextIdx !== -1) devState.activeCaseIndex = nextIdx;
        renderAllUI();
      }
    }
  });

  // Atualização do Incidente no Cluster Cloud (NOC)
  if (cloudNOCState.incidentActive && !cloudNOCState.gameOver) {
    cloudNOCState.incidentIntervalCounter++;
    if (cloudNOCState.incidentIntervalCounter >= 60) {
      cloudNOCState.incidentIntervalCounter = 0;
      cloudNOCState.incidentSecondsRemaining--;

      const timeEl = document.getElementById('cloud-incident-time');
      if (timeEl) {
        const m = Math.floor(cloudNOCState.incidentSecondsRemaining / 60);
        const s = cloudNOCState.incidentSecondsRemaining % 60;
        timeEl.textContent = `⏱️ SLA Restante: ${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')} (${cloudNOCState.incidentSecondsRemaining}s)`;
      }

      if (cloudNOCState.incidentSecondsRemaining <= 0) {
        triggerCloudGameOver();
      }
    }
  } else if (!cloudNOCState.incidentActive && !cloudNOCState.gameOver) {
    if (animTick > 0 && animTick % 7200 === 0 && Math.random() < 0.65) {
      triggerCloudIncidentAlert();
    }
  }
}

function render() {
  if (!devSoftwareCanvas && typeof document !== 'undefined') {
    devSoftwareCanvas = document.getElementById('world-canvas');
  }
  if (!devSoftwareCanvas) return;
  if (!devSoftwareCtx) {
    devSoftwareCtx = devSoftwareCanvas.getContext('2d');
  }
  const ctx = devSoftwareCtx;
  if (!ctx) return;

  ctx.clearRect(0, 0, devSoftwareCanvas.width || 2480, devSoftwareCanvas.height || 1560);

  // 1. Piso Tecnológico do Estúdio (Grid moderno dev 2480x1560)
  drawOfficeFloors(ctx);

  // 2. Móveis Procedurais das Salas Superiores e Inferiores
  drawUpperDevRoomsFurniture(ctx);
  drawProceduralFurniture(ctx);

  // 3. Entidades / Personagens Chibi Procedurais
  const entities = [];
  devState.players.filter(p => p.connected).forEach(p => {
    entities.push({
      x: p.x,
      y: p.y,
      name: p.name,
      isPlayer: true,
      isMoving: p.isMoving,
      look: p.look,
      patience: null,
      bubble: p.bubble
    });
  });

  devCases.forEach(c => {
    if (c.leavingState === 'leaving_angry') return;
    entities.push({
      x: c.x,
      y: c.y,
      name: c.clientName,
      isPlayer: false,
      isMoving: c.isMoving,
      look: c.look,
      patience: c.solved ? null : c.patience,
      bubble: c.arrivedAtDesk ? '💬 Briefing' : ''
    });
  });

  entities.sort((a, b) => a.y - b.y);
  entities.forEach(ent => drawCanvasChibi(ctx, ent));
}

function initSoftwareCanvas() {
  if (typeof document === 'undefined') return;
  devSoftwareCanvas = document.getElementById('world-canvas');
  if (!devSoftwareCanvas) return;
  devSoftwareCtx = devSoftwareCanvas.getContext('2d');

  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', e => {
      keys[e.key.toLowerCase()] = true;
      if (e.key.toLowerCase() === 'e') handleInteractWorld();
      if (e.key.toLowerCase() === 'r' && !['input', 'textarea'].includes(e.target.tagName?.toLowerCase())) {
        callNextClientToDesk();
      }
      if (e.key.toLowerCase() === 'f' && !['input', 'textarea'].includes(e.target.tagName?.toLowerCase())) {
        toggleEnlargedScreen();
      }
    });

    window.addEventListener('keyup', e => {
      keys[e.key.toLowerCase()] = false;
    });
  }

  devSoftwareCanvas.addEventListener('click', e => {
    const rect = devSoftwareCanvas.getBoundingClientRect();
    const scaleX = devSoftwareCanvas.width / (rect.width || devSoftwareCanvas.width);
    const scaleY = devSoftwareCanvas.height / (rect.height || devSoftwareCanvas.height);
    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;

    const you = devState.players[devState.mySlotIndex];
    if (you) {
      you.waypoints = [{ x: Math.round(clickX), y: Math.round(clickY) }];
    }
  });

  function gameLoop() {
    update();
    render();
    if (typeof requestAnimationFrame !== 'undefined') {
      requestAnimationFrame(gameLoop);
    }
  }

  if (typeof requestAnimationFrame !== 'undefined') {
    requestAnimationFrame(gameLoop);
  }
}

// ============================================================================
// DESENHO PROCEDURAL DE PISOS E SALAS (CANVAS 2D PURO - MAPA 2480x1560)
// ============================================================================
function drawOfficeFloors(ctx) {
  // 1. Corredor e Área Central Ampliada: Pisos Brancos Quadriculados (2480x1560)
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(20, 170, 2440, 790);

  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1.4;
  const tile = 60;
  for (let gx = 20; gx <= 2460; gx += tile) {
    ctx.beginPath();
    ctx.moveTo(gx, 170);
    ctx.lineTo(gx, 960);
    ctx.stroke();
  }
  for (let gy = 170; gy <= 960; gy += tile) {
    ctx.beginPath();
    ctx.moveTo(20, gy);
    ctx.lineTo(2460, gy);
    ctx.stroke();
  }

  // Soleira e Tapete da Porta de Entrada de Clientes no Lado Direito (x: 2420 a 2460, y: 660 a 910)
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(2420, 660, 40, 250);
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 3;
  ctx.strokeRect(2420, 660, 40, 250);

  // Soleira da Entrada (o tapete tech rotacionado 90° é renderizado em drawDevOfficeRugs)

  ctx.save();
  ctx.translate(2444, 785);
  ctx.rotate(-Math.PI / 2);
  ctx.fillStyle = '#38bdf8';
  ctx.font = '900 16px Nunito, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('🚪 ENTRADA DE CLIENTES', 0, 5);
  ctx.restore();

  // 4 Salas Superiores Próprias de Desenvolvimento
  DEV_UPPER_ROOMS.forEach(room => {
    ctx.fillStyle = room.floorColor;
    ctx.fillRect(room.x, room.y, room.w, room.h);

    ctx.strokeStyle = room.gridColor;
    ctx.lineWidth = 1.2;
    for (let gx = room.x; gx <= room.x + room.w; gx += tile) {
      ctx.beginPath();
      ctx.moveTo(gx, room.y);
      ctx.lineTo(gx, room.y + room.h);
      ctx.stroke();
    }
    for (let gy = room.y; gy <= room.y + room.h; gy += tile) {
      ctx.beginPath();
      ctx.moveTo(room.x, gy);
      ctx.lineTo(room.x + room.w, gy);
      ctx.stroke();
    }

    // Soleira da porta da sala
    if (room.door) {
      ctx.fillStyle = 'rgba(249, 199, 66, 0.38)';
      ctx.beginPath();
      ctx.ellipse(room.door.x + room.door.w / 2, room.door.y, room.door.w / 2 - 4, 11, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Plaquinha elegante no topo da sala
    ctx.fillStyle = 'rgba(15, 23, 42, 0.90)';
    ctx.beginPath();
    ctx.roundRect(room.x + 16, room.y + 12, room.w - 32, 28, 6);
    ctx.fill();
    ctx.strokeStyle = room.wallColor;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = room.wallColor;
    ctx.font = '900 12px Nunito, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(room.name, room.x + room.w / 2, room.y + 30);
    ctx.textAlign = 'left';
  });

  // 2 Salas Inferiores: Mega Cabine #01 & Recepção
  DEV_ROOMS.forEach(room => {
    ctx.fillStyle = room.floorColor;
    ctx.fillRect(room.x, room.y, room.w, room.h);

    ctx.strokeStyle = room.gridColor;
    ctx.lineWidth = 1.2;
    for (let gx = room.x; gx <= room.x + room.w; gx += tile) {
      ctx.beginPath();
      ctx.moveTo(gx, room.y);
      ctx.lineTo(gx, room.y + room.h);
      ctx.stroke();
    }
    for (let gy = room.y; gy <= room.y + room.h; gy += tile) {
      ctx.beginPath();
      ctx.moveTo(room.x, gy);
      ctx.lineTo(room.x + room.w, gy);
      ctx.stroke();
    }

    if (room.door) {
      ctx.fillStyle = 'rgba(249, 199, 66, 0.38)';
      ctx.beginPath();
      ctx.ellipse(room.door.x + room.door.w / 2, room.door.y, room.door.w / 2 - 4, 11, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = 'rgba(15, 37, 51, 0.88)';
    ctx.beginPath();
    ctx.roundRect(room.x + 16, room.y + 12, Math.min(room.w - 32, 420), 28, 6);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 12px Nunito, sans-serif';
    ctx.fillText(room.name, room.x + 24, room.y + 30);
  });

  // Renderiza todos os Tapetes Tecnológicos sobre os pisos (vermelhos sempre, azuis aleatórios)
  drawDevOfficeRugs(ctx);

  // Paredes Sólidas com preenchimento colorido e contorno
  devSolidWalls.forEach(box => {
    // Não desenhar caixas de colisão de móveis como paredes azuis no chão
    if (box.isObstacle) return;
    ctx.fillStyle = 'rgba(15, 37, 51, 0.22)';
    ctx.fillRect(box.x + 2, box.y + 3, box.w, box.h);

    ctx.fillStyle = box.color || '#1fa6b8';
    ctx.fillRect(box.x, box.y, box.w, box.h);

    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.2;
    ctx.strokeRect(box.x, box.y, box.w, box.h);
  });
}

// ============================================================================
// SPRITES E RENDERIZADORES DOS 5 NÍVEIS DE BANCADAS DEV & BANQUETAS DO CLIENTE
// Modelos de Bancadas: Nível 1 a 5 (Imagens 2, 3, 4 e 5)
// Banquetas do Cliente: Modelo da Imagem 1 posicionada ao lado direito da bancada
// ============================================================================
const devWorkstationSprites = {
  1: (typeof Image !== 'undefined') ? new Image() : null,
  2: (typeof Image !== 'undefined') ? new Image() : null,
  3: (typeof Image !== 'undefined') ? new Image() : null,
  4: (typeof Image !== 'undefined') ? new Image() : null,
  5: (typeof Image !== 'undefined') ? new Image() : null
};

if (typeof Image !== 'undefined') {
  devWorkstationSprites[1].src = 'assets/workbench_dev_lvl1.png';
  devWorkstationSprites[2].src = 'assets/workbench_dev_lvl2.png';
  devWorkstationSprites[3].src = 'assets/workbench_dev_lvl3.png';
  devWorkstationSprites[4].src = 'assets/workbench_dev_lvl4.png';
  devWorkstationSprites[5].src = 'assets/workbench_dev_lvl5.png';
}

const clientStoolSprite = (typeof Image !== 'undefined') ? new Image() : null;
if (clientStoolSprite) {
  clientStoolSprite.src = 'assets/client_stool_blue.png';
}

const coffeeStationSprite = (typeof Image !== 'undefined') ? new Image() : null;
if (coffeeStationSprite) {
  coffeeStationSprite.src = 'assets/coffee_station_barista.png';
}

const receptionDeskSprite = (typeof Image !== 'undefined') ? new Image() : null;
if (receptionDeskSprite) {
  receptionDeskSprite.src = 'assets/reception_desk_wood.png';
}

// Novos Sprites: Plantas (Modelos 1 e 2), Bebedouro e Cadeira Gamer
const plantSprite1 = (typeof Image !== 'undefined') ? new Image() : null;
if (plantSprite1) {
  plantSprite1.src = 'assets/decor_plant_1.png';
}

const plantSprite2 = (typeof Image !== 'undefined') ? new Image() : null;
if (plantSprite2) {
  plantSprite2.src = 'assets/decor_plant_2.png';
}

const waterCoolerSprite = (typeof Image !== 'undefined') ? new Image() : null;
if (waterCoolerSprite) {
  waterCoolerSprite.src = 'assets/water_cooler_dispenser.png';
}

const gamerChairSprite = (typeof Image !== 'undefined') ? new Image() : null;
if (gamerChairSprite) {
  gamerChairSprite.src = 'assets/dev_executive_chair.png';
}

// Sistema de Plantas Decorativas nos Locais Verdes (aleatórias e que não atrapalham a movimentação)
function randomizePlantPositions() {
  const candidateSpots = [
    { x: 35, y: 730, name: 'Corredor Esquerdo' },
    { x: 800, y: 710, name: 'Corredor Sala 03' },
    { x: 2010, y: 710, name: 'Corredor Entrada' },
    { x: DEV_UPPER_ROOMS[0].x + DEV_UPPER_ROOMS[0].w - 65, y: DEV_UPPER_ROOMS[0].y + 150, name: 'Sala 02 Alta' },
    { x: DEV_UPPER_ROOMS[0].x + DEV_UPPER_ROOMS[0].w - 65, y: DEV_UPPER_ROOMS[0].y + 260, name: 'Sala 02 Baixa' },
    { x: DEV_UPPER_ROOMS[1].x + DEV_UPPER_ROOMS[1].w - 65, y: DEV_UPPER_ROOMS[1].y + 150, name: 'Sala 03 Alta' },
    { x: DEV_UPPER_ROOMS[1].x + DEV_UPPER_ROOMS[1].w - 65, y: DEV_UPPER_ROOMS[1].y + 260, name: 'Sala 03 Baixa' },
    { x: DEV_UPPER_ROOMS[2].x + DEV_UPPER_ROOMS[2].w - 65, y: DEV_UPPER_ROOMS[2].y + 150, name: 'Sala 04 Alta' },
    { x: DEV_UPPER_ROOMS[2].x + DEV_UPPER_ROOMS[2].w - 65, y: DEV_UPPER_ROOMS[2].y + 260, name: 'Sala 04 Baixa' },
    { x: DEV_UPPER_ROOMS[3].x + DEV_UPPER_ROOMS[3].w - 65, y: DEV_UPPER_ROOMS[3].y + 140, name: 'Sala 05 Alta' },
    { x: DEV_UPPER_ROOMS[3].x + DEV_UPPER_ROOMS[3].w - 65, y: DEV_UPPER_ROOMS[3].y + 250, name: 'Sala 05 Baixa' },
    { x: 1320, y: 1420, name: 'Cabine 01 Parede Direita' },
    { x: 2060, y: 1220, name: 'Recepção Lounge' },
    { x: 2400, y: 1100, name: 'Recepção Canto Direito' }
  ];

  devRandomPlants = candidateSpots.map(spot => ({
    ...spot,
    active: Math.random() < 0.65,
    model: Math.random() < 0.5 ? 1 : 2
  }));
}
randomizePlantPositions();

function randomizePlantModels() {
  randomizePlantPositions();
}

// Sprites dos 7 Modelos de Armários das Salas Superiores (Imagem 2)
const devCabinetSprites = {
  1: (typeof Image !== 'undefined') ? new Image() : null,
  2: (typeof Image !== 'undefined') ? new Image() : null,
  3: (typeof Image !== 'undefined') ? new Image() : null,
  4: (typeof Image !== 'undefined') ? new Image() : null,
  5: (typeof Image !== 'undefined') ? new Image() : null,
  6: (typeof Image !== 'undefined') ? new Image() : null,
  7: (typeof Image !== 'undefined') ? new Image() : null
};
if (typeof Image !== 'undefined') {
  for (let i = 1; i <= 7; i++) {
    devCabinetSprites[i].src = 'assets/dev_cabinet_' + i + '.png';
  }
}

// Modelos aleatórios de armários para cada uma das 4 salas superiores (Imagem 2)
let devRoomCabinets = {
  upper_room_2: Math.floor(Math.random() * 7) + 1,
  upper_room_3: Math.floor(Math.random() * 7) + 1,
  upper_room_4: Math.floor(Math.random() * 7) + 1,
  upper_room_5: Math.floor(Math.random() * 7) + 1
};

let devRoomLeftCabinets = {
  upper_room_2: Math.floor(Math.random() * 7) + 1,
  upper_room_3: Math.floor(Math.random() * 7) + 1,
  upper_room_4: Math.floor(Math.random() * 7) + 1,
  upper_room_5: Math.floor(Math.random() * 7) + 1
};

function randomizeDevRoomCabinets() {
  devRoomCabinets = {
    upper_room_2: Math.floor(Math.random() * 7) + 1,
    upper_room_3: Math.floor(Math.random() * 7) + 1,
    upper_room_4: Math.floor(Math.random() * 7) + 1,
    upper_room_5: Math.floor(Math.random() * 7) + 1
  };
  devRoomLeftCabinets = {
    upper_room_2: Math.floor(Math.random() * 7) + 1,
    upper_room_3: Math.floor(Math.random() * 7) + 1,
    upper_room_4: Math.floor(Math.random() * 7) + 1,
    upper_room_5: Math.floor(Math.random() * 7) + 1
  };
}

// Sprites de Climatização: Ar-Condicionado Split (Imagem 3) e Climatizador Torre Inverter Nv. 2 (Imagem 4)
const acSplitSprite = (typeof Image !== 'undefined') ? new Image() : null;
if (acSplitSprite) {
  acSplitSprite.src = 'assets/ac_split_inverter.png';
}

const acTowerSprite = (typeof Image !== 'undefined') ? new Image() : null;
if (acTowerSprite) {
  acTowerSprite.src = 'assets/ac_tower_inverter.png';
}

// Sprites das 8 Bancadas de Hardware & Compra (Imagem 1)
const hardwareBenchSprites = {};
if (typeof Image !== 'undefined') {
  for (let i = 1; i <= 8; i++) {
    const img = new Image();
    img.src = 'assets/hardware_bench_' + i + '.png';
    hardwareBenchSprites[i] = img;
  }
}



let devHallwayShopBenches = {
  spot1: 1,
  spot2: 3,
  spot3: 5
};

function randomizeHallwayShopBenches() {
  const pool = [1, 2, 3, 4, 5, 6, 7, 8].sort(() => Math.random() - 0.5);
  devHallwayShopBenches = {
    spot1: pool[0],
    spot2: pool[1],
    spot3: pool[2]
  };
}
randomizeHallwayShopBenches();

// Sprites da Lixeira (Imagem 2), Armário Credenza (Imagem 3) e Estação Auxiliar (Imagem 4)
const officeRecycleBinSprite = (typeof Image !== 'undefined') ? new Image() : null;
if (officeRecycleBinSprite) {
  officeRecycleBinSprite.src = 'assets/office_recycle_bin.png';
}

const officeCredenzaCabinetSprite = (typeof Image !== 'undefined') ? new Image() : null;
if (officeCredenzaCabinetSprite) {
  officeCredenzaCabinetSprite.src = 'assets/office_credenza_cabinet.png';
}

const officeSideWorkstationSprite = (typeof Image !== 'undefined') ? new Image() : null;
if (officeSideWorkstationSprite) {
  officeSideWorkstationSprite.src = 'assets/office_side_workstation.png';
}

// Sprites do Servidor Dedicado (Imagem 1), Mesa de Reuniões (Imagem 2) e Cluster Datacenter (Imagem 3)
const hallwayServerRackSprite = (typeof Image !== 'undefined') ? new Image() : null;
if (hallwayServerRackSprite) {
  hallwayServerRackSprite.src = 'assets/hallway_server_rack.png';
}

const meetingConferenceTableSprite = (typeof Image !== 'undefined') ? new Image() : null;
if (meetingConferenceTableSprite) {
  meetingConferenceTableSprite.src = 'assets/meeting_conference_table.png';
}

const clusterDatacenterRacksSprite = (typeof Image !== 'undefined') ? new Image() : null;
if (clusterDatacenterRacksSprite) {
  clusterDatacenterRacksSprite.src = 'assets/cluster_datacenter_racks.png';
}

// Sprites dos 20 Tapetes Tecnológicos / Gamers (Imagem 3)
const techRugSprites = {};
if (typeof Image !== 'undefined') {
  for (let i = 1; i <= 20; i++) {
    const img = new Image();
    img.src = 'assets/tech_rug_' + i + '.png';
    techRugSprites[i] = img;
  }
}

// Sprite do Sofá Executivo VIP (Imagem 1)
const receptionExecutiveSofaSprite = (typeof Image !== 'undefined') ? new Image() : null;
if (receptionExecutiveSofaSprite) {
  receptionExecutiveSofaSprite.src = 'assets/reception_executive_sofa.png';
}

// Estado e Aleatorização dos Tapetes da Sede
// Marcações Vermelhas: Sempre presentes (Entrada rotacionada 90° à direita, Mega Cabine #01, Recepção)
// Marcações Azuis: Aparecem aleatoriamente nas portas das 4 salas superiores
let devOfficeRugs = {
  entrance: { id: 1, rot: 90 },
  cabine: { id: 2, rot: 0 },
  cabineDoor: { id: 9, rot: 0 },
  reception: { id: 3, rot: 0 },
  receptionDoor: { id: 8, rot: 0 },
  upperRooms: [
    { active: true, id: 4, roomId: 'upper_room_2' },
    { active: true, id: 5, roomId: 'upper_room_3' },
    { active: true, id: 6, roomId: 'upper_room_4' },
    { active: true, id: 7, roomId: 'upper_room_5' }
  ]
};

function randomizeDevOfficeRugs() {
  const availableIds = Array.from({ length: 20 }, (_, i) => i + 1).sort(() => Math.random() - 0.5);
  let idIdx = 0;
  devOfficeRugs = {
    entrance: { id: availableIds[idIdx++ % 20], rot: 90 },
    cabine: { id: availableIds[idIdx++ % 20], rot: 0 },
    cabineDoor: { id: availableIds[idIdx++ % 20], rot: 0 },
    reception: { id: availableIds[idIdx++ % 20], rot: 0 },
    receptionDoor: { id: availableIds[idIdx++ % 20], rot: 0 },
    upperRooms: [
      { active: Math.random() < 0.55, id: availableIds[idIdx++ % 20], roomId: 'upper_room_2' },
      { active: Math.random() < 0.55, id: availableIds[idIdx++ % 20], roomId: 'upper_room_3' },
      { active: Math.random() < 0.55, id: availableIds[idIdx++ % 20], roomId: 'upper_room_4' },
      { active: Math.random() < 0.55, id: availableIds[idIdx++ % 20], roomId: 'upper_room_5' }
    ]
  };
}
randomizeDevOfficeRugs();

function drawDevOfficeRugs(ctx) {
  const baseW = 180;
  const baseH = 125;

  function renderSingleRug(x, y, rugId, rotate90 = false, scale = 1.0) {
    const w = baseW * scale;
    const h = baseH * scale;
    const sprite = techRugSprites[rugId];

    ctx.save();
    ctx.translate(x, y);
    if (rotate90) {
      ctx.rotate(Math.PI / 2);
    }
    // Sombra suave sob o tapete
    ctx.fillStyle = 'rgba(0, 0, 0, 0.20)';
    ctx.beginPath();
    ctx.roundRect(-w / 2 - 2, -h / 2 + 3, w + 4, h + 4, 12);
    ctx.fill();

    if (sprite && sprite.complete && sprite.naturalWidth > 0) {
      ctx.drawImage(sprite, -w / 2, -h / 2, w, h);
    } else {
      // Fallback estilizado
      ctx.fillStyle = '#0f172a';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(-w / 2, -h / 2, w, h, 10);
      ctx.fill();
      ctx.stroke();
    }
    ctx.restore();
  }

  // 1. Vermelho: Porta de Entrada de Clientes (Sempre presente, virado 90° para a direita)
  if (devOfficeRugs.entrance) {
    renderSingleRug(2350, 785, devOfficeRugs.entrance.id, true, 0.95);
  }

  // 2. Vermelho: Centro da Mega Cabine Dev #01 (Sempre presente, horizontal original)
  const cabine = DEV_ROOMS.find(r => r.id === 'dev_room_1') || { x: 40, y: 960, w: 1380, h: 550 };
  if (devOfficeRugs.cabine) {
    renderSingleRug(cabine.x + 630, cabine.y + 280, devOfficeRugs.cabine.id, false, 1.05);
  }

  // 3. Vermelho: Recepção de Clientes (Sempre presente, horizontal original no lounge)
  const reception = DEV_ROOMS.find(r => r.id === 'reception') || { x: 1450, y: 960, w: 990, h: 550 };
  if (devOfficeRugs.reception) {
    renderSingleRug(reception.x + 360, reception.y + 310, devOfficeRugs.reception.id, false, 1.05);
  }

  // 3b. Amarelo: Porta da Recepção no Corredor (Acompanha dinamicamente a porta da recepção em todas as expansões)
  if (devOfficeRugs.receptionDoor) {
    const recDoorCenterX = (reception && reception.door) ? (reception.door.x + reception.door.w / 2) : (reception.x + 150);
    renderSingleRug(recDoorCenterX, 890, devOfficeRugs.receptionDoor.id, false, 1.0);
  }

  // 3c. Amarelo: Porta da Mega Cabine #01 no Corredor (Acompanha dinamicamente a porta da cabine em todas as expansões)
  if (devOfficeRugs.cabineDoor) {
    const cabDoorCenterX = (cabine && cabine.door) ? (cabine.door.x + cabine.door.w / 2) : (cabine.x + 820);
    renderSingleRug(cabDoorCenterX, 890, devOfficeRugs.cabineDoor.id, false, 1.0);
  }

  // 4. Azul: Portas das 4 Salas Superiores (Aparecem aleatoriamente no corredor central)
  if (devOfficeRugs.upperRooms) {
    devOfficeRugs.upperRooms.forEach(spot => {
      if (!spot.active) return;
      const room = DEV_UPPER_ROOMS.find(r => r.id === spot.roomId);
      if (room && room.door) {
        const doorCenterX = room.door.x + room.door.w / 2;
        const rugY = room.y + room.h + 65;
        renderSingleRug(doorCenterX, rugY, spot.id, false, 0.82);
      }
    });
  }
}

// Renderizador dos 2 Modelos de Plantas (Imagens 2 e 3)
function drawPlantItem(ctx, x, y, modelType) {
  const sprite = modelType === 2 ? plantSprite2 : plantSprite1;
  const w = modelType === 2 ? 56 : 60;
  const h = modelType === 2 ? 96 : 100;

  // Sombra suave sob o vaso
  ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
  ctx.beginPath();
  ctx.ellipse(x + w / 2, y + h - 6, w * 0.38, 10, 0, 0, Math.PI * 2);
  ctx.fill();

  if (sprite && sprite.complete && sprite.naturalWidth > 0) {
    ctx.drawImage(sprite, x, y, w, h);
  } else {
    // Procedural Fallback fiel
    ctx.fillStyle = modelType === 2 ? '#cbd5e1' : '#475569';
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.roundRect(x + 10, y + 48, w - 20, h - 52, 8);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#15803d';
    ctx.beginPath();
    ctx.ellipse(x + w / 2, y + 28, w * 0.42, 28, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.ellipse(x + w / 2, y + 18, w * 0.32, 20, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Renderizador do Bebedouro com Galão Mineral Azul (Imagem 4)
function drawWaterCooler(ctx, x, y) {
  const w = 72;
  const h = 138;

  // Sombra suave sob o bebedouro
  ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
  ctx.beginPath();
  ctx.ellipse(x + w / 2, y + h - 6, w * 0.40, 10, 0, 0, Math.PI * 2);
  ctx.fill();

  if (waterCoolerSprite && waterCoolerSprite.complete && waterCoolerSprite.naturalWidth > 0) {
    ctx.drawImage(waterCoolerSprite, x, y, w, h);
  } else {
    // Procedural Fallback
    ctx.fillStyle = '#64748b';
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.roundRect(x + 6, y + 40, w - 12, h - 42, 6);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#38bdf8';
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(x + 10, y + 4, w - 20, 42, 8);
    ctx.fill();
    ctx.stroke();
  }

  // Plaquinha elegante do Bebedouro
  ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
  ctx.strokeStyle = '#0284c7';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(x - 14, y + h + 6, w + 28, 20, 5);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#7dd3fc';
  ctx.font = '900 9.5px Nunito, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('💧 BEBEDOURO [E]', x + w / 2, y + h + 19);
  ctx.textAlign = 'left';
}

// Renderizador da Cadeira Gamer Ergonômica (Imagem 5)
function drawExecutiveGamerChair(ctx, x, y) {
  const w = 80;
  const h = 120;

  // Sombra suave sob a cadeira gamer
  ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
  ctx.beginPath();
  ctx.ellipse(x + w / 2, y + h - 6, 28, 10, 0, 0, Math.PI * 2);
  ctx.fill();

  if (gamerChairSprite && gamerChairSprite.complete && gamerChairSprite.naturalWidth > 0) {
    ctx.drawImage(gamerChairSprite, x, y, w, h);
  } else {
    // Procedural Fallback
    ctx.fillStyle = '#1e293b';
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.roundRect(x + 10, y + 6, w - 20, 50, 8);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.roundRect(x + 6, y + 44, w - 12, 34, 8);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x + w / 2 - 4, y + 78, 8, 14);
  }

  // Plaquinha elegante da Cadeira Gamer
  ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(x - 16, y + h + 6, w + 32, 20, 5);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#fef08a';
  ctx.font = '900 9px Nunito, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('🪑 CADEIRA GAMER [E]', x + w / 2, y + h + 19);
  ctx.textAlign = 'left';
}

// Renderizador da Banqueta do Cliente (Modelo da Imagem 1 - Sem sombra)
function drawClientStool(ctx, x, y, options = {}) {
  if (clientStoolSprite && clientStoolSprite.complete && clientStoolSprite.naturalWidth > 0) {
    // Proporção perfeita 54x85 centrada na banqueta sem sombra
    ctx.drawImage(clientStoolSprite, x - 27, y - 42, 54, 85);
  } else {
    // Procedural Fallback proporcionalmente ampliado
    // Base metálica circular escura
    ctx.fillStyle = '#1e293b';
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(x, y + 25, 26, 11, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Haste vertical de sustentação
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x - 6, y, 12, 26);

    // Borda inferior do assento estofado
    ctx.fillStyle = '#1e293b';
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.ellipse(x, y + 5, 28, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Almofada circular estofada (Azul Tech vibrante conforme Imagem 1)
    const cushionColor = options.color === 'orange' ? '#ea580c' : '#0284c7';
    const cushionTop = options.color === 'orange' ? '#fb923c' : '#38bdf8';
    ctx.fillStyle = cushionColor;
    ctx.beginPath();
    ctx.ellipse(x, y - 3, 28, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    // Topo acolchoado com brilho
    ctx.fillStyle = cushionTop;
    ctx.beginPath();
    ctx.ellipse(x, y - 5, 23, 9, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Renderizador da Bancada de Trabalho com suporte aos 5 Níveis de Atualização
function drawDevWorkstationDesk(ctx, x, y, w, h, options = {}) {
  const lvl = options.level || devState.workbenchLevel || 1;
  const sprite = devWorkstationSprites[lvl] || devWorkstationSprites[1];

  // Sombra suave sob a bancada
  ctx.fillStyle = 'rgba(0, 0, 0, 0.16)';
  ctx.beginPath();
  ctx.ellipse(x + w / 2, y + h - 8, w * 0.44, h * 0.12, 0, 0, Math.PI * 2);
  ctx.fill();

  if (sprite && sprite.complete && sprite.naturalWidth > 0) {
    ctx.drawImage(sprite, x, y, w, h);
  } else {
    // Procedural Fallback dinâmico para os 5 Níveis
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(x + 16, y + h * 0.52, 14, h * 0.44);
    ctx.fillRect(x + w - 85, y + h * 0.52, 68, h * 0.44);

    ctx.fillStyle = '#334155';
    ctx.fillRect(x + w - 82, y + h * 0.55, 62, h * 0.18);
    ctx.fillRect(x + w - 82, y + h * 0.76, 62, h * 0.18);
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(x + w - 58, y + h * 0.62, 14, 3.5);
    ctx.fillRect(x + w - 58, y + h * 0.83, 14, 3.5);

    // Tampo carvalho mel
    ctx.fillStyle = '#f59e0b';
    ctx.strokeStyle = '#b45309';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(x, y + h * 0.35, w, h * 0.28, 12);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = 'rgba(254, 243, 199, 0.4)';
    ctx.fillRect(x + 8, y + h * 0.36, w - 16, 4);

    // Monitores de acordo com o Nível (1 a 5)
    if (lvl === 1) {
      // Nv 1: Laptop + 1 Monitor
      ctx.fillStyle = '#94a3b8'; ctx.beginPath(); ctx.roundRect(x + 72, y + h * 0.28, 68, 42, 3); ctx.fill();
      ctx.fillStyle = '#38bdf8'; ctx.fillRect(x + 75, y + h * 0.30, 62, 36);
      ctx.fillStyle = '#0f172a'; ctx.beginPath(); ctx.roundRect(x + 150, y + h * 0.10, 88, 64, 5); ctx.fill();
      ctx.fillStyle = '#090d16'; ctx.fillRect(x + 153, y + h * 0.12, 82, 58);
    } else if (lvl === 2) {
      // Nv 2 (Imagem 2): Dual Monitor + Torre PC
      ctx.fillStyle = '#0f172a'; ctx.beginPath(); ctx.roundRect(x + 85, y + h * 0.10, 75, 60, 4); ctx.roundRect(x + 165, y + h * 0.10, 75, 60, 4); ctx.fill();
      ctx.fillStyle = '#090d16'; ctx.fillRect(x + 88, y + h * 0.12, 69, 55); ctx.fillRect(x + 168, y + h * 0.12, 69, 55);
      ctx.fillStyle = '#1e293b'; ctx.fillRect(x + w - 42, y + h * 0.12, 34, 75);
    } else if (lvl === 3) {
      // Nv 3 (Imagem 3): Curved Ultrawide + Speakers
      ctx.fillStyle = '#0f172a'; ctx.beginPath(); ctx.roundRect(x + 50, y + h * 0.10, 180, 62, 8); ctx.fill();
      ctx.fillStyle = '#0284c7'; ctx.fillRect(x + 54, y + h * 0.12, 172, 56);
      ctx.fillStyle = '#1e293b'; ctx.fillRect(x + 20, y + h * 0.22, 22, 42); ctx.fillRect(x + 238, y + h * 0.22, 22, 42);
    } else if (lvl === 4) {
      // Nv 4 (Imagem 4): Super Ultrawide 32:9 + Lightbar
      ctx.fillStyle = '#0f172a'; ctx.beginPath(); ctx.roundRect(x + 40, y + h * 0.12, 210, 56, 6); ctx.fill();
      ctx.fillStyle = '#090d16'; ctx.fillRect(x + 43, y + h * 0.14, 204, 52);
      ctx.fillStyle = '#38bdf8'; ctx.fillRect(x + 80, y + h * 0.08, 130, 4);
    } else {
      // Nv 5 (Imagem 5): Triple 4K + Stream Deck
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.roundRect(x + 20, y + h * 0.14, 65, 56, 4);
      ctx.roundRect(x + 90, y + h * 0.08, 100, 64, 5);
      ctx.roundRect(x + 195, y + h * 0.14, 65, 56, 4);
      ctx.fill();
      ctx.fillStyle = '#38bdf8'; ctx.fillRect(x + 94, y + h * 0.10, 92, 58);
      ctx.fillStyle = '#0284c7'; ctx.fillRect(x + 23, y + h * 0.16, 59, 50); ctx.fillRect(x + 198, y + h * 0.16, 59, 50);
    }

    // Teclado mecânico e mouse
    ctx.fillStyle = '#0f172a'; ctx.beginPath(); ctx.roundRect(x + 85, y + h * 0.46, 125, 28, 5); ctx.fill();
    ctx.fillStyle = '#334155'; ctx.fillRect(x + 95, y + h * 0.49, 68, 20);
    ctx.fillStyle = '#475569'; ctx.beginPath(); ctx.ellipse(x + 190, y + h * 0.58, 6, 9, 0, 0, Math.PI * 2); ctx.fill();

    // Vasinho de suculenta
    ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.roundRect(x + 242, y + h * 0.38, 18, 18, 3); ctx.fill();
    ctx.fillStyle = '#10b981'; ctx.beginPath(); ctx.arc(x + 251, y + h * 0.33, 11, 0, Math.PI * 2); ctx.fill();
  }
}

function drawProceduralFurniture(ctx) {
  const cfg = EXPANSION_CONFIGS[devState.soloExpansionTier || 1] || EXPANSION_CONFIGS[1];
  const cabine = DEV_ROOMS.find(r => r.id === 'dev_room_1') || DEV_ROOMS[0];
  const reception = DEV_ROOMS.find(r => r.id === 'reception') || DEV_ROOMS[1];

  // ============================================================================
  // 1. MEGA CABINE DEV #01 - TECH LEAD
  // ============================================================================
  const deskX = cabine.x + 60;
  const deskY = 1005;
  const deskW = 320;
  const deskH = 200;
  const currentWorkbenchLevel = devState.workbenchLevel || 1;

  // Bancada de trabalho do Tech Lead (com suporte aos 5 níveis de upgrade)
  drawDevWorkstationDesk(ctx, deskX, deskY, deskW, deskH, { role: 'tech_lead', level: currentWorkbenchLevel });

  // Plaquinha elegante da Bancada Tech Lead
  const benchNames = {
    1: '💻 BANCADA DEV JÚNIOR',
    2: '🖥️ SETUP DUAL MONITOR (NV. 2)',
    3: '🎧 SETUP CURVED ULTRAWIDE (NV. 3)',
    4: '⚡ SUPER ULTRAWIDE 32:9 (NV. 4)',
    5: '👑 COMMAND CENTER TRIPLE 4K (NV. 5)'
  };
  const bBadge = benchNames[currentWorkbenchLevel] || '💻 BANCADA TECH LEAD';

  ctx.fillStyle = '#0f172a';
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(deskX + 18, deskY + 12, 195, 22, 6);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#38bdf8';
  ctx.font = '900 10.5px Nunito, sans-serif';
  ctx.fillText(bBadge, deskX + 26, deskY + 27);

  // ========================================================================
  // BANQUETA DO CLIENTE NA MEGA CABINE #01 NO CÍRCULO VERMELHO (AO LADO DA MESA)
  // ========================================================================
  const stoolX = deskX + deskW + 60; // Posição exata do círculo vermelho
  const stoolY = deskY + 95;
  drawClientStool(ctx, stoolX, stoolY, { color: 'blue' });

  // ========================================================================
  // ESTANTES TECNOLÓGICAS AMPLIADAS DA MEGA CABINE #01 (IMAGENS 1 E 2)
  // Estação Barista posicionada antes das estantes; estantes ampliadas com tamanho aumentado
  // ========================================================================
  const currentTier = devState.soloExpansionTier || 1;
  const numShelves = currentTier >= 4 ? 2 : 1;
  const shelfW = 145;
  const shelfH = 154;
  const coffeeW = 180;
  const coffeeH = 150;
  const gap = 16;
  const rightMargin = 22;

  const shelfXPositions = [];
  if (numShelves === 2) {
    const s2X = cabine.x + cabine.w - rightMargin - shelfW;
    const s1X = s2X - gap - shelfW;
    shelfXPositions.push(s1X, s2X);
  } else {
    const s1X = cabine.x + cabine.w - rightMargin - shelfW;
    shelfXPositions.push(s1X);
  }

  const coffeeX = shelfXPositions[0] - gap - coffeeW;
  const coffeeY = cabine.y + 16;

  // 1. Estantes Tecnológicas com tamanho ampliado
  for (let s = 0; s < shelfXPositions.length; s++) {
    const sX = shelfXPositions[s];
    const sY = cabine.y + 16;
    const shelfSpriteModel = currentTier >= 4 ? 2 : 3;
    const sSprite = devCabinetSprites[shelfSpriteModel] || devCabinetSprites[2];

    if (sSprite && sSprite.complete && sSprite.naturalWidth > 0) {
      ctx.drawImage(sSprite, sX, sY, shelfW, shelfH);
    } else {
      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(sX, sY, shelfW, shelfH, 8);
      ctx.fill();
      ctx.stroke();
    }
  }

  // 2. Estação Barista posicionada antes das estantes (apenas quando comprada)
  if (devState.upgrades && devState.upgrades.my_coffee) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.20)';
    ctx.beginPath();
    ctx.ellipse(coffeeX + coffeeW / 2, coffeeY + coffeeH - 6, coffeeW * 0.46, 14, 0, 0, Math.PI * 2);
    ctx.fill();

    if (coffeeStationSprite && coffeeStationSprite.complete && coffeeStationSprite.naturalWidth > 0) {
      ctx.drawImage(coffeeStationSprite, coffeeX, coffeeY, coffeeW, coffeeH);
    } else {
      ctx.fillStyle = '#334155';
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(coffeeX, coffeeY + 40, coffeeW, coffeeH - 40, 10);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(coffeeX + 12, coffeeY + 55, coffeeW * 0.44, coffeeH - 65);
      ctx.fillRect(coffeeX + coffeeW * 0.52, coffeeY + 55, coffeeW * 0.44, coffeeH - 65);

      ctx.fillStyle = '#0f172a';
      ctx.fillRect(coffeeX + 25, coffeeY + 5, 45, 45);
      ctx.fillStyle = '#fff';
      ctx.font = '26px sans-serif';
      ctx.fillText('☕', coffeeX + 30, coffeeY + 36);
    }

    ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(coffeeX + 15, coffeeY + coffeeH + 6, coffeeW - 30, 22, 6);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#fca5a5';
    ctx.font = '900 10.5px Nunito, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('☕ ESTAÇÃO BARISTA [E]', coffeeX + coffeeW / 2, coffeeY + coffeeH + 21);
    ctx.textAlign = 'left';
  }

  // ========================================================================
  // CADEIRA GAMER (IMAGEM 5) NO LOCAL AMARELO (CANTO INFERIOR ESQUERDO CABINE #01)
  // ========================================================================
  const gamerChairX = cabine.x + 55;
  const gamerChairY = 1210;
    drawExecutiveGamerChair(ctx, gamerChairX, gamerChairY);

  // ========================================================================
  // PLANTAS DECORATIVAS ALEATÓRIAS NOS LOCAIS MARCADOS EM VERDE
  // ========================================================================
  if (typeof devRandomPlants !== 'undefined') {
    devRandomPlants.forEach(p => {
      if (p.active) {
        drawPlantItem(ctx, p.x, p.y, p.model);
      }
    });
  }

  // ============================================================================
  // AR-CONDICIONADO DEV SPLIT (IMAGEM 3) NO LOCAL PINTADO DE VERDE (TOPO DA CABINE 01)
  // ============================================================================
  if (devState.upgrades && devState.upgrades.ac_lvl1) {
    // Posição movida para a direita, fora da área azul do título (que termina em x ~ 476)
    const acX = 520;
    const acY = 972;
    const acW = 120;
    const acH = 46;
    if (acSplitSprite && acSplitSprite.complete && acSplitSprite.naturalWidth > 0) {
      ctx.drawImage(acSplitSprite, acX, acY, acW, acH);
    } else {
      ctx.fillStyle = '#f8fafc';
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(acX, acY, acW, acH, 8);
      ctx.fill();
      ctx.stroke();
    }
    ctx.fillStyle = 'rgba(15, 23, 42, 0.90)';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(acX - 10, acY + acH + 4, acW + 20, 20, 5);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#7dd3fc';
    ctx.font = '900 9px Nunito, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('❄️ AR SPLIT INVERTER [E]', acX + acW / 2, acY + acH + 18);
    ctx.textAlign = 'left';
  }

  // ============================================================================
  // CLIMATIZADOR INVERTER NÍVEL 2 TORRE (IMAGEM 4) NO LOCAL PINTADO DE AMARELO (CORREDOR ESQUERDO)
  // ============================================================================
  if (devState.upgrades && devState.upgrades.ac_lvl2) {
    const towerX = 35;
    const towerY = 825;
    const towerW = 54;
    const towerH = 118;
    if (acTowerSprite && acTowerSprite.complete && acTowerSprite.naturalWidth > 0) {
      ctx.drawImage(acTowerSprite, towerX, towerY, towerW, towerH);
    } else {
      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(towerX, towerY, towerW, towerH, 8);
      ctx.fill();
      ctx.stroke();
    }
    ctx.fillStyle = 'rgba(15, 23, 42, 0.90)';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(towerX - 15, towerY + towerH + 4, towerW + 30, 20, 5);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#7dd3fc';
    ctx.font = '900 9px Nunito, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('❄️ CLIMATIZADOR TORRE [E]', towerX + towerW / 2, towerY + towerH + 18);
    ctx.textAlign = 'left';
  }

  // ========================================================================
  // SUBSTITUIÇÃO DO QUADRADO AZUL NO CANTO INFERIOR ESQUERDO DA CABINE #01
  // Móvel da Imagem 3 (Armário Credenza) e ao lado a Imagem 4 (Estação Auxiliar)
  // ========================================================================
  const credX = cabine.x + 40;
  const credY = 1370;
  const credW = 125;
  const credH = 116;

  // Sombra suave sob o Armário Credenza
  ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
  ctx.beginPath();
  ctx.ellipse(credX + credW / 2, credY + credH - 4, credW * 0.46, 12, 0, 0, Math.PI * 2);
  ctx.fill();

  if (officeCredenzaCabinetSprite && officeCredenzaCabinetSprite.complete && officeCredenzaCabinetSprite.naturalWidth > 0) {
    ctx.drawImage(officeCredenzaCabinetSprite, credX, credY, credW, credH);
  } else {
    ctx.fillStyle = '#cbd5e1';
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.roundRect(credX, credY, credW, credH, 8);
    ctx.fill();
    ctx.stroke();
  }

  // Estação Auxiliar de Trabalho com Monitor e Cadeira (Imagem 4) ao lado da Credenza
  const sideDeskX = credX + credW + 16;
  const sideDeskY = 1365;
  const sideDeskW = 210;
  const sideDeskH = 123;

  // Sombra suave sob a bancada auxiliar
  ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
  ctx.beginPath();
  ctx.ellipse(sideDeskX + sideDeskW / 2, sideDeskY + sideDeskH - 4, sideDeskW * 0.46, 14, 0, 0, Math.PI * 2);
  ctx.fill();

  if (officeSideWorkstationSprite && officeSideWorkstationSprite.complete && officeSideWorkstationSprite.naturalWidth > 0) {
    ctx.drawImage(officeSideWorkstationSprite, sideDeskX, sideDeskY, sideDeskW, sideDeskH);
  } else {
    ctx.fillStyle = '#94a3b8';
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.roundRect(sideDeskX, sideDeskY, sideDeskW, sideDeskH, 8);
    ctx.fill();
    ctx.stroke();
  }

  // ============================================================================
  // 2. RECEPÇÃO EXECUTIVA & BALCÃO DE RECEPÇÃO (IMAGEM 3 NO RETÂNGULO AMARELO)
  // ============================================================================
  const recDeskX = 2070;
  const recDeskY = 970;
  const recDeskW = 360;
  const recDeskH = 226;

  // Sombra suave sob o balcão de recepção de madeira
  ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
  ctx.beginPath();
  ctx.ellipse(recDeskX + recDeskW / 2, recDeskY + recDeskH - 8, recDeskW * 0.46, 18, 0, 0, Math.PI * 2);
  ctx.fill();

  if (receptionDeskSprite && receptionDeskSprite.complete && receptionDeskSprite.naturalWidth > 0) {
    ctx.drawImage(receptionDeskSprite, recDeskX, recDeskY, recDeskW, recDeskH);
  } else {
    // Procedural Fallback de alta fidelidade do Balcão de Recepção da Imagem 3
    ctx.fillStyle = '#b45309';
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.roundRect(recDeskX, recDeskY + 45, recDeskW, recDeskH - 45, 12);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.roundRect(recDeskX - 6, recDeskY + 35, recDeskW + 12, 30, 8);
    ctx.fill();
    ctx.stroke();

    // Computador / Terminal de Atendimento
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(recDeskX + 40, recDeskY + 5, 55, 40);
  }

  // Placa luminosa do Balcão de Recepção
  ctx.fillStyle = 'rgba(15, 23, 42, 0.90)';
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(recDeskX + 25, recDeskY + recDeskH + 8, recDeskW - 50, 26, 6);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#fef08a';
  ctx.font = '900 12px Nunito, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('🛎️ BALCÃO DE RECEPÇÃO & CHECK-IN [E]', recDeskX + recDeskW / 2, recDeskY + recDeskH + 25);
  ctx.textAlign = 'left';

  // ========================================================================
  // BEBEDOURO AMPLIADO COM GALÃO MINERAL DENTRO DA ÁREA DOS CLIENTES
  // ========================================================================
  const coolerX = reception.x + 90;
  const coolerY = reception.y + 325;
  drawWaterCooler(ctx, coolerX, coolerY);

  // ========================================================================
  // SOFÁ EXECUTIVO VIP AMPLIADO NO CANTO INFERIOR DIREITO DA RECEPÇÃO
  // ========================================================================
  if (devState.upgrades && devState.upgrades.vip_sofa) {
    const sofaW = 260;
    const sofaH = 166;
    const soX = 2160;
    const soY = 1320;

    // Sombra suave sob o sofá ampliado
    ctx.fillStyle = 'rgba(0, 0, 0, 0.26)';
    ctx.beginPath();
    ctx.ellipse(soX + sofaW / 2, soY + sofaH - 6, sofaW * 0.44, 16, 0, 0, Math.PI * 2);
    ctx.fill();

    if (receptionExecutiveSofaSprite && receptionExecutiveSofaSprite.complete && receptionExecutiveSofaSprite.naturalWidth > 0) {
      ctx.drawImage(receptionExecutiveSofaSprite, soX, soY, sofaW, sofaH);
    } else {
      ctx.fillStyle = '#312e81';
      ctx.strokeStyle = '#6366f1';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(soX, soY, sofaW, sofaH, 16);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#4f46e5';
      ctx.beginPath();
      ctx.roundRect(soX + 14, soY + 14, sofaW - 28, sofaH - 42, 12);
      ctx.fill();
    }

    // Plaquinha elegante do Sofá VIP Executivo
    ctx.fillStyle = 'rgba(15, 23, 42, 0.90)';
    ctx.strokeStyle = '#818cf8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(soX + 25, soY + sofaH + 4, sofaW - 50, 20, 5);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#c7d2fe';
    ctx.font = '900 10px Nunito, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🛋️ SOFÁ VIP EXECUTIVO', soX + sofaW / 2, soY + sofaH + 18);
    ctx.textAlign = 'left';
  }

  // ========================================================================
  // BANCADAS DE COMPRA & HARDWARE (IMAGEM 1) NOS LOCAIS VERMELHOS (IMAGEM 2)
  // ========================================================================
  const benchSpotKeys = ['spot1', 'spot2', 'spot3'];
  DEV_HALLWAY_SHOP_SPOTS.forEach((spot, idx) => {
    const modelId = devHallwayShopBenches[benchSpotKeys[idx]] || (idx + 1);
    const sprite = hardwareBenchSprites[modelId];

    // Sombra suave sob a bancada
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.beginPath();
    ctx.ellipse(spot.x + spot.w / 2, spot.y + spot.h - 4, spot.w * 0.48, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    if (sprite && sprite.complete && sprite.naturalWidth > 0) {
      ctx.drawImage(sprite, spot.x, spot.y, spot.w, spot.h);
    } else {
      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(spot.x, spot.y, spot.w, spot.h, 8);
      ctx.fill();
      ctx.stroke();
    }

    // Plaquinha elegante da Bancada de Compra
    ctx.fillStyle = 'rgba(15, 23, 42, 0.90)';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(spot.x + 35, spot.y + spot.h + 4, spot.w - 70, 20, 5);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#7dd3fc';
    ctx.font = '900 9.5px Nunito, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🛒 BANCADA TECH [E] LOJA', spot.x + spot.w / 2, spot.y + spot.h + 18);
    ctx.textAlign = 'left';
  });

  // ========================================================================
  // SERVIDOR DEDICADO (IMAGEM 1) NO LOCAL VERMELHO (CORREDOR À ESQUERDA)
  // Disponível assim que devState.upgrades.rack_lvl1 ou rack_lvl2 for comprado
  // ========================================================================
  const servX = 140;
  const servY = 825;
  const servW = 230;
  const servH = 133;

  if (devState.upgrades && (devState.upgrades.rack_lvl1 || devState.upgrades.rack_lvl2)) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
    ctx.beginPath();
    ctx.ellipse(servX + servW / 2, servY + servH - 4, servW * 0.46, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    if (hallwayServerRackSprite && hallwayServerRackSprite.complete && hallwayServerRackSprite.naturalWidth > 0) {
      ctx.drawImage(hallwayServerRackSprite, servX, servY, servW, servH);
    } else {
      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(servX, servY, servW, servH, 8);
      ctx.fill();
      ctx.stroke();
    }

    ctx.fillStyle = 'rgba(15, 23, 42, 0.90)';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(servX + 25, servY + servH + 4, servW - 50, 20, 5);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#7dd3fc';
    ctx.font = '900 9.5px Nunito, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🗄️ SERVIDOR BARE-METAL (40 PUZZLES) [E]', servX + servW / 2, servY + servH + 18);
    ctx.textAlign = 'left';
  }

  // ========================================================================
  // CLUSTER DATACENTER (IMAGEM 3) NO LOCAL AZUL (CORREDOR CENTRAL)
  // Acompanha dinamicamente a expansão da porta da Mega Cabine #01 em todas as fases
  // ========================================================================
  const cabDoorEnd = (cabine && cabine.door) ? (cabine.door.x + cabine.door.w) : (cabine.x + 900);
  const clusterX = cabDoorEnd + 70;
  const clusterY = 825;
  const clusterW = 160;
  const clusterH = 134;

  ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
  ctx.beginPath();
  ctx.ellipse(clusterX + clusterW / 2, clusterY + clusterH - 4, clusterW * 0.46, 12, 0, 0, Math.PI * 2);
  ctx.fill();

  if (clusterDatacenterRacksSprite && clusterDatacenterRacksSprite.complete && clusterDatacenterRacksSprite.naturalWidth > 0) {
    ctx.drawImage(clusterDatacenterRacksSprite, clusterX, clusterY, clusterW, clusterH);
  } else {
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.roundRect(clusterX, clusterY, clusterW, clusterH, 8);
    ctx.fill();
    ctx.stroke();
  }

  if (cloudNOCState && cloudNOCState.incidentActive) {
    const pulse = Math.abs(Math.sin(Date.now() / 200));
    ctx.fillStyle = 
gba(239, 68, 68, );
    ctx.strokeStyle = '#fca5a5';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(clusterX - 10, clusterY + clusterH + 4, clusterW + 20, 22, 6);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 10px Nunito, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🚨 CLUSTER SOB ATAQUE! [E]', clusterX + clusterW / 2, clusterY + clusterH + 19);
    ctx.textAlign = 'left';
  } else {
    ctx.fillStyle = 'rgba(15, 23, 42, 0.90)';
    ctx.strokeStyle = '#818cf8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(clusterX - 5, clusterY + clusterH + 4, clusterW + 10, 20, 5);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#c7d2fe';
    ctx.font = '900 9.5px Nunito, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('⚡ CLUSTER CLOUD [E]', clusterX + clusterW / 2, clusterY + clusterH + 18);
    ctx.textAlign = 'left';
  }

  // ========================================================================
  // MESA DE REUNIÕES (IMAGEM 2) NO LOCAL VERDE (PARTE INFERIOR DA CABINE #01)
  // ========================================================================
  const tableX = 880;
  const tableY = 1270;
  const tableW = 360;
  const tableH = 169;

  ctx.fillStyle = 'rgba(0, 0, 0, 0.24)';
  ctx.beginPath();
  ctx.ellipse(tableX + tableW / 2, tableY + tableH - 6, tableW * 0.48, 18, 0, 0, Math.PI * 2);
  ctx.fill();

  if (meetingConferenceTableSprite && meetingConferenceTableSprite.complete && meetingConferenceTableSprite.naturalWidth > 0) {
    ctx.drawImage(meetingConferenceTableSprite, tableX, tableY, tableW, tableH);
  } else {
    ctx.fillStyle = '#f59e0b';
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(tableX, tableY, tableW, tableH, 14);
    ctx.fill();
    ctx.stroke();
  }

  ctx.fillStyle = 'rgba(15, 23, 42, 0.90)';
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(tableX + 70, tableY + tableH + 4, tableW - 140, 20, 5);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#7dd3fc';
  ctx.font = '900 9.5px Nunito, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('📊 MESA DE REUNIÃO DE SQUAD [E]', tableX + tableW / 2, tableY + tableH + 18);
  ctx.textAlign = 'left';

  // 3. MOBILIÁRIO E BANCADAS DAS 4 SALAS SUPERIORES PRÓPRIAS DE DESENVOLVIMENTO
  drawUpperDevRoomsFurniture(ctx);
}

// Desenha bancadas técnicas, computadores, monitores, whiteboards e decorações das 4 salas superiores
function drawUpperDevRoomsFurniture(ctx) {
  DEV_UPPER_ROOMS.forEach(r => {
    // 1. Placa / Painel Superior da Sala com Borda Iluminada
    ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
    ctx.strokeStyle = r.wallColor;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.roundRect(r.x + 20, r.y + 12, r.w - 40, 36, 8);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = r.wallColor;
    ctx.font = '900 14px Nunito, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(r.name, r.x + r.w / 2, r.y + 35);
    ctx.textAlign = 'left';

    // ========================================================================
    // 2. BANCADA DE DESENVOLVIMENTO (TODAS INICIAM NO MODELO 1)
    // Só trocam de modelo quando expandirmos a sede (Tiers 2, 3, 4 e 5)
    // ========================================================================
    const deskX = r.x + 35;
    const deskY = r.y + 55;
    const deskW = 280;
    const deskH = 180;

    // Regra: Modelo 1 inicial para todas; troca com a expansão da sede
    const upperTierRequired = { backend: 2, frontend: 3, qa_security: 4, devops_cloud: 5 };
    const requiredTier = upperTierRequired[r.specialty] || 2;
    const rLvl = (devState.soloExpansionTier >= requiredTier) ? requiredTier : 1;

    drawDevWorkstationDesk(ctx, deskX, deskY, deskW, deskH, { role: r.specialty, level: rLvl });

    // Plaquinha elegante da bancada indicando Modelo Atual
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.strokeStyle = r.wallColor;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(deskX + 14, deskY + 10, 160, 20, 5);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = r.wallColor;
    ctx.font = '900 9.5px Nunito, sans-serif';
    ctx.fillText(`💻 BANCADA ${rLvl === 1 ? 'DEV (NV. 1)' : `EXPANDIDA (NV. ${rLvl})`}`, deskX + 22, deskY + 24);

    // Círculo removido na frente das estações de trabalho conforme solicitado pelo usuário

    // ========================================================================
    // 3. BANQUETA DO CLIENTE NO CÍRCULO VERMELHO (CADA SALA DEVERÁ TER UM)
    // Posicionada no canto inferior direito da sala, à direita da porta
    // ========================================================================
    const stoolX = r.x + 475;
    const stoolY = r.y + 355;
    drawClientStool(ctx, stoolX, stoolY, { color: 'blue' });

    // ========================================================================
    // 4. ARMÁRIO DE EQUIPAMENTOS DA IMAGEM 2 (ONDE PINTADO DE VERMELHO NA IMAGEM 1)
    // Escolhido aleatoriamente dentre os 7 modelos da Imagem 2 para cada sala
    // ========================================================================
    const cabX = r.x + r.w - 125;
    const cabY = r.y + 22;
    const cabW = 105;
    const cabH = 110;
    const cabModel = devRoomCabinets[r.id] || 1;
    const cabSprite = devCabinetSprites[cabModel];

    if (cabSprite && cabSprite.complete && cabSprite.naturalWidth > 0) {
      ctx.drawImage(cabSprite, cabX, cabY, cabW, cabH);
    } else {
      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(cabX, cabY, cabW, cabH, 6);
      ctx.fill();
      ctx.stroke();
    }

    // ========================================================================
    // SEGUNDO ARMÁRIO NAS SALAS 2, 3, 4 E 5 (MODELO ALEATÓRIO, AO LADO DO PRIMEIRO)
    // Posicionado na parede superior ao lado do primeiro armário (conforme setas vermelhas)
    // ========================================================================
    const cab2X = r.x + r.w - 235;
    const cab2Y = r.y + 22;
    const cab2W = 105;
    const cab2H = 110;
    const cab2Model = devRoomLeftCabinets[r.id] || 1;
    const cab2Sprite = devCabinetSprites[cab2Model];

    // Sombra do segundo armário
    ctx.fillStyle = 'rgba(0, 0, 0, 0.20)';
    ctx.beginPath();
    ctx.ellipse(cab2X + cab2W / 2, cab2Y + cab2H - 4, cab2W * 0.44, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    if (cab2Sprite && cab2Sprite.complete && cab2Sprite.naturalWidth > 0) {
      ctx.drawImage(cab2Sprite, cab2X, cab2Y, cab2W, cab2H);
    } else {
      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(cab2X, cab2Y, cab2W, cab2H, 6);
      ctx.fill();
      ctx.stroke();
    }

    // ========================================================================
    // LIXEIRA DE RECICLAGEM (IMAGEM 2) NO LOCAL VERMELHO (CANTO INFERIOR ESQUERDO)
    // ========================================================================
    const binX = r.x + 28;
    const binY = r.y + r.h - 96;
    const binW = 50;
    const binH = 82;

    // Sombra da lixeira ampliada
    ctx.fillStyle = 'rgba(0, 0, 0, 0.20)';
    ctx.beginPath();
    ctx.ellipse(binX + binW / 2, binY + binH - 4, binW * 0.44, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    if (officeRecycleBinSprite && officeRecycleBinSprite.complete && officeRecycleBinSprite.naturalWidth > 0) {
      ctx.drawImage(officeRecycleBinSprite, binX, binY, binW, binH);
    } else {
      ctx.fillStyle = '#cbd5e1';
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(binX, binY, binW, binH, 6);
      ctx.fill();
      ctx.stroke();
    }
  });
}

function drawCanvasChibi(ctx, ent) {
  const { x, y, isMoving, name, bubble, isPlayer, patience } = ent;
  const look = ent.look || { skin: '#ffdbb5', hair: '#1e293b', shirt: '#0284c7', mood: 'happy' };
  const bounce = isMoving ? Math.abs(Math.sin(animTick * 0.28)) * 4.5 : Math.sin(animTick * 0.07) * 1.5;
  const footSwing = isMoving ? Math.sin(animTick * 0.28) * 4 : 0;

  ctx.save();
  ctx.translate(x, y);
  ctx.scale(1.5, 1.5);

  // Sombra e anel de seleção do player
  if (isPlayer) {
    ctx.fillStyle = 'rgba(56, 189, 248, 0.35)';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.ellipse(0, 16, 22, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  } else {
    ctx.fillStyle = 'rgba(15, 23, 42, 0.3)';
    ctx.beginPath();
    ctx.ellipse(0, 16, 16, 6, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // Sapatinhos
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.ellipse(-6, 14 + footSwing * 0.5, 4.5, 3, 0, 0, Math.PI * 2);
  ctx.ellipse(6, 14 - footSwing * 0.5, 4.5, 3, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.translate(0, -bounce);

  // Corpo / Camisa
  ctx.fillStyle = look.shirt || '#0284c7';
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.roundRect(-14, -6, 28, 19, 9);
  ctx.fill();
  ctx.stroke();

  // Crachá de Desenvolvedor
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(3, 1, 5, 7);

  // Cabeça
  ctx.fillStyle = look.skin || '#ffdbb5';
  ctx.beginPath();
  ctx.roundRect(-16, -33, 32, 29, 14);
  ctx.fill();
  ctx.stroke();

  if (isPlayer) {
    // ========================================================================
    // ROSTO ORIGINAL CLÁSSICO DO NOSSO PERSONAGEM (TECH LEAD)
    // Mantido exatamente como o original clássico: sem franja, sem óculos, sem headset
    // ========================================================================
    ctx.fillStyle = look.hair || '#1e293b';
    ctx.beginPath();
    ctx.arc(0, -25, 16.5, Math.PI, 0);
    ctx.fill();
    ctx.stroke();

    // Olhos clássicos
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(-6, -18, 2.8, 0, Math.PI * 2);
    ctx.arc(6, -18, 2.8, 0, Math.PI * 2);
    ctx.fill();

    // Boca clássica
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, -13, 3.5, 0.15 * Math.PI, 0.85 * Math.PI);
    ctx.stroke();
  } else {
    // ========================================================================
    // ROSTO DOS CLIENTES EM CAMPO: CORES VARIADAS, FRANJA, BOCHECHAS E ÓCULOS
    // ========================================================================
    ctx.fillStyle = look.hair || '#1e293b';
    ctx.beginPath();
    ctx.arc(0, -25, 16.5, Math.PI, 0);
    ctx.fill();
    ctx.stroke();

    // Franja do cabelo
    ctx.fillStyle = look.hair || '#1e293b';
    ctx.beginPath();
    ctx.moveTo(-16, -25);
    ctx.quadraticCurveTo(-8, -20, 0, -24);
    ctx.quadraticCurveTo(8, -20, 16, -25);
    ctx.lineTo(16, -28);
    ctx.lineTo(-16, -28);
    ctx.closePath();
    ctx.fill();

    // Bochechas rosadas
    ctx.fillStyle = 'rgba(255, 143, 163, 0.65)';
    ctx.beginPath();
    ctx.ellipse(-10, -15, 3.2, 2, 0, 0, Math.PI * 2);
    ctx.ellipse(10, -15, 3.2, 2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Olhos
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(-6, -18, 2.8, 0, Math.PI * 2);
    ctx.arc(6, -18, 2.8, 0, Math.PI * 2);
    ctx.fill();

    // Brilho dos olhos
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-7, -19, 1, 0, Math.PI * 2);
    ctx.arc(5, -19, 1, 0, Math.PI * 2);
    ctx.fill();

    // Óculos se o cliente usar
    if (look.glasses) {
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1.8;
      ctx.strokeRect(-10.5, -22, 9, 8);
      ctx.strokeRect(1.5, -22, 9, 8);
      ctx.beginPath();
      ctx.moveTo(-1.5, -18);
      ctx.lineTo(1.5, -18);
      ctx.stroke();
    }

    // Boca
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, -13, 3.5, 0.15 * Math.PI, 0.85 * Math.PI);
    ctx.stroke();
  }

  // Barra de Paciência
  if (patience !== null) {
    const barW = 34;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
    ctx.fillRect(-barW / 2, -43, barW, 4.5);
    ctx.fillStyle = patience > 60 ? '#10b981' : (patience > 35 ? '#f59e0b' : '#ef4444');
    ctx.fillRect(-barW / 2, -43, (barW * Math.max(0, patience)) / 100, 4.5);
  }

  // Nome do Personagem
  ctx.font = '900 10px Nunito, sans-serif';
  const nameW = ctx.measureText(name).width + 10;
  ctx.fillStyle = isPlayer ? '#0284c7' : 'rgba(15, 23, 42, 0.85)';
  ctx.beginPath();
  ctx.roundRect(-nameW / 2, 19, nameW, 15, 7);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.fillText(name, 0, 30);

  // Balão de fala
  if (bubble) {
    ctx.font = '900 10.5px Nunito, sans-serif';
    const bW = ctx.measureText(bubble).width + 12;
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(-bW / 2, -65, bW, 19, 9);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#0284c7';
    ctx.fillText(bubble, 0, -52);
  }

  ctx.restore();
}

function renderChibiSVG(look = {}, sizeClass = '') {
  const skin = look.mood === 'angry' ? '#fca5a5' : (look.skin || '#ffdbb5');
  const hair = look.hair || '#2c1e18';
  const shirt = look.shirt || '#0284c7';
  const glasses = !!look.glasses;
  const headset = !!look.headset;
  const mood = look.mood || 'happy';

  let mouthPath = 'M 34 45 Q 40 50 46 45';
  if (mood === 'worried') mouthPath = 'M 34 48 Q 40 43 46 48';
  if (mood === 'angry') mouthPath = 'M 33 49 Q 40 41 47 49';
  if (mood === 'excited') mouthPath = 'M 33 44 Q 40 53 47 44 Z';

  return `
    <svg class="chibi-svg ${sizeClass}" viewBox="0 0 80 90" xmlns="http://www.w3.org/2000/svg" style="width:100%; height:100%; display:block;">
      <ellipse cx="40" cy="84" rx="22" ry="5" fill="rgba(15,37,51,0.16)" />
      <path d="M 20 80 C 20 58, 60 58, 60 80 Z" fill="${shirt}" stroke="#1c3144" stroke-width="3" stroke-linejoin="round"/>
      <path d="M 33 59 L 40 68 L 47 59" fill="#ffffff" stroke="#1c3144" stroke-width="2.5" stroke-linejoin="round"/>
      <rect x="43" y="67" width="8" height="10" rx="2" fill="#f9c742" stroke="#1c3144" stroke-width="2"/>
      <ellipse cx="19" cy="69" rx="5.5" ry="9" transform="rotate(15 19 69)" fill="${shirt}" stroke="#1c3144" stroke-width="3"/>
      <ellipse cx="61" cy="69" rx="5.5" ry="9" transform="rotate(-15 61 69)" fill="${shirt}" stroke="#1c3144" stroke-width="3"/>
      <circle cx="17" cy="75" r="4.5" fill="${skin}" stroke="#1c3144" stroke-width="2.5"/>
      <circle cx="63" cy="75" r="4.5" fill="${skin}" stroke="#1c3144" stroke-width="2.5"/>
      <circle cx="40" cy="34" r="24" fill="${hair}" stroke="#1c3144" stroke-width="3"/>
      <circle cx="16" cy="38" r="5" fill="${skin}" stroke="#1c3144" stroke-width="2.5"/>
      <circle cx="64" cy="38" r="5" fill="${skin}" stroke="#1c3144" stroke-width="2.5"/>
      <rect x="18" y="16" width="44" height="40" rx="20" fill="${skin}" stroke="#1c3144" stroke-width="3"/>
      <path d="M 18 30 C 22 14, 58 14, 62 30 C 54 22, 45 26, 40 21 C 34 26, 25 23, 18 30 Z" fill="${hair}" stroke="#1c3144" stroke-width="3" stroke-linejoin="round"/>
      <ellipse cx="26" cy="42" rx="4.2" ry="2.5" fill="#ff8fa3" opacity="0.65"/>
      <ellipse cx="54" cy="42" rx="4.2" ry="2.5" fill="#ff8fa3" opacity="0.65"/>
      <circle cx="30" cy="36" r="4.2" fill="#1c3144"/>
      <circle cx="50" cy="36" r="4.2" fill="#1c3144"/>
      <circle cx="28.7" cy="34.5" r="1.6" fill="#ffffff"/>
      <circle cx="48.7" cy="34.5" r="1.6" fill="#ffffff"/>
      ${glasses ? `
        <rect x="23" y="30" width="14" height="12" rx="3" fill="none" stroke="#1c3144" stroke-width="2.5"/>
        <rect x="43" y="30" width="14" height="12" rx="3" fill="none" stroke="#1c3144" stroke-width="2.5"/>
        <line x1="37" y1="36" x2="43" y2="36" stroke="#1c3144" stroke-width="2.5"/>
      ` : ''}
      ${headset ? `
        <path d="M 16 38 C 16 16, 64 16, 64 38" fill="none" stroke="#0284c7" stroke-width="4.5" stroke-linecap="round"/>
        <rect x="13" y="32" width="6" height="14" rx="3" fill="#0284c7" stroke="#1c3144" stroke-width="2"/>
        <rect x="61" y="32" width="6" height="14" rx="3" fill="#0284c7" stroke="#1c3144" stroke-width="2"/>
      ` : ''}
      <path d="${mouthPath}" fill="none" stroke="#1c3144" stroke-width="2.8" stroke-linecap="round"/>
    </svg>
  `;
}

// ============================================================================
// INTERAÇÃO NO MUNDO [E] E CHAMADA DE CLIENTES
// ============================================================================
function handleInteractWorld() {
  const you = devState.players[devState.mySlotIndex];
  if (!you) return;

  const cabine = DEV_ROOMS.find(r => r.id === 'dev_room_1') || DEV_ROOMS[0];
  const reception = DEV_ROOMS.find(r => r.id === 'reception') || DEV_ROOMS[1];

  // 1. Perto da Cafeteira Barista (Imagem 2) no canto superior direito da Cabine #01
  const coffeeX = cabine.x + cabine.w - 240;
  const coffeeY = cabine.y + 20;
  if (Math.hypot(you.x - (coffeeX + 95), you.y - (coffeeY + 75)) < 130) {
    drinkDevCoffee();
    return;
  }

  // 1.1 Perto do Bebedouro com Galão na Recepção (área dos clientes)
  const recRoom = DEV_ROOMS.find(r => r.id === 'reception') || { x: 1450, y: 960, w: 990, h: 550 };
  const coolerX = recRoom.x + 90;
  const coolerY = recRoom.y + 325;
  if (Math.hypot(you.x - (coolerX + 36), you.y - (coolerY + 69)) < 100) {
    showToast('💧 Você bebeu água mineral gelada no bebedouro! Hidratação máxima (+Foco Dev).');
    addDevLog('💧 <b>Bebedouro:</b> Desenvolvedor tomou água fresca gelada.');
    return;
  }

  // 1.1b Perto do Sofá Executivo VIP Ampliado na Recepção (quando comprado)
  if (devState.upgrades && devState.upgrades.vip_sofa) {
    const sofaX = 2160;
    const sofaY = 1320;
    if (Math.hypot(you.x - (sofaX + 130), you.y - (sofaY + 83)) < 135) {
      showToast('🛋️ Você descansou no Sofá VIP Executivo! Moral e foco renovados.');
      addDevLog('🛋️ <b>Conforto VIP:</b> Tech Lead relaxou no Sofá Executivo.');
      return;
    }
  }

  // 1.1d Perto da Credenza ou Estação Auxiliar (antigo quadrado azul)
  const credX = cabine.x + 40;
  if (Math.hypot(you.x - (credX + 62), you.y - (1370 + 58)) < 85) {
    showToast('📂 Armário Credenza: Documentação técnica e manuais de arquitetura organizados.');
    return;
  }
  const sideDeskX = credX + 125 + 16;
  if (Math.hypot(you.x - (sideDeskX + 105), you.y - (1365 + 61)) < 95) {
    showToast('🖥️ Estação Auxiliar: Ambiente de homologação e testes automatizados 100% operacional.');
    return;
  }

  // 1.1e Perto de Lixeira nas Salas Superiores
  for (let i = 0; i < DEV_UPPER_ROOMS.length; i++) {
    const r = DEV_UPPER_ROOMS[i];
    const binX = r.x + 28;
    const binY = r.y + r.h - 96;
    if (Math.hypot(you.x - (binX + 25), you.y - (binY + 41)) < 65) {
      showToast('♻️ Lixeira de Reciclagem: Escritório limpo, focado e sustentável!');
      return;
    }
  }

  // 1.1c1 Perto do Cluster Cloud Datacenter no Corredor (local azul dinâmico)
  const cabineRoom = DEV_ROOMS.find(r => r.id === 'dev_room_1') || { x: 40, y: 960, w: 1380 };
  const cabDoorEnd = (cabineRoom && cabineRoom.door) ? (cabineRoom.door.x + cabineRoom.door.w) : (cabineRoom.x + 900);
  const clusterX = cabDoorEnd + 70;
  const clusterY = 825;
  if (Math.hypot(you.x - (clusterX + 80), you.y - (clusterY + 67)) < 110) {
    openCloudNOCModal();
    return;
  }

  // 1.1c2 Perto do Servidor Dedicado no Corredor (local vermelho, 40 puzzles quando comprado)
  const servX = 140;
  const servY = 825;
  if (Math.hypot(you.x - (servX + 115), you.y - (servY + 66)) < 110) {
    openServerRackModal();
    return;
  }

  // 1.1c3 Perto da Mesa de Reuniões (local verde na Cabine #01)
  const tableX = 880;
  const tableY = 1270;
  if (Math.hypot(you.x - (tableX + 180), you.y - (tableY + 85)) < 130) {
    showToast('📊 Reunião Geral de Squad realizada! Foco, moral e produtividade da equipe aumentados!');
    addDevLog('📊 <b>Reunião de Squad:</b> Tech Lead alinhou os entregáveis na mesa de conferência com o time.');
    return;
  }

  // 1.1c Perto das Bancadas de Compra & Hardware no Corredor (Imagem 2)
  if (typeof DEV_HALLWAY_SHOP_SPOTS !== 'undefined') {
    for (let i = 0; i < DEV_HALLWAY_SHOP_SPOTS.length; i++) {
      const bSpot = DEV_HALLWAY_SHOP_SPOTS[i];
      if (Math.hypot(you.x - (bSpot.x + bSpot.w / 2), you.y - (bSpot.y + bSpot.h / 2)) < 115) {
        openShopModal();
        showToast('🛒 Acessando Loja de Hardware & Upgrades da Bancada Tech!');
        return;
      }
    }
  }

  // 1.2 Perto da Cadeira Gamer Ergonômica Ampliada na Mega Cabine #01 (local amarelo)
  const gamerChairX = cabine.x + 55;
  const gamerChairY = 1210;
  if (Math.hypot(you.x - (gamerChairX + 40), you.y - (gamerChairY + 60)) < 95) {
    showToast('🪑 Você sentou na Cadeira Gamer Ergonômica! Conforto e postura 100% alinhada.');
    addDevLog('🪑 <b>Conforto:</b> Desenvolvedor ajustou a postura na Cadeira Gamer Ergonômica.');
    return;
  }

  // 2. Perto do Novo Balcão de Recepção (Imagem 3) no topo da Recepção
  const recDeskX = 1960;
  const recDeskY = 980;
  if (Math.hypot(you.x - (recDeskX + 180), you.y - (recDeskY + 110)) < 160) {
    callNextClientToDesk();
    return;
  }

  // 3. Dentro da Área Geral da Recepção: chamar cliente
  if (you.x >= reception.x && you.x <= reception.x + reception.w && you.y >= reception.y && you.y <= reception.y + reception.h) {
    callNextClientToDesk();
    return;
  }

  // 4. Perto da Sua Estação Dev / Mesa de Reunião: dentro da Mega Cabine Dev #01
  if (you.x >= cabine.x && you.x <= cabine.x + cabine.w && you.y >= cabine.y && you.y <= cabine.y + cabine.h) {
    openDevWorkbenchModal();
    return;
  }

  showToast('🚶‍♂️ Aproxime-se da sua Bancada, da Cafeteira ou do Balcão de Recepção e aperte [E]!');
}

function callNextClientToDesk() {
  const currentAttended = devCases.find(c => c.walkingToDesk || c.arrivedAtDesk);
  if (currentAttended) {
    showToast(`⚠️ Você já está atendendo ${currentAttended.clientName}! Vá até sua Estação Dev [E].`);
    return;
  }

  const nextClient = devCases.find(c => !c.solved && !c.leavingState);
  if (!nextClient) {
    showToast('🎉 Parabéns! Todos os clientes foram atendidos com sucesso!');
    return;
  }

  const cabine = DEV_ROOMS.find(r => r.id === 'dev_room_1') || DEV_ROOMS[0];
  const reception = DEV_ROOMS.find(r => r.id === 'reception') || DEV_ROOMS[1];
  const cfg = EXPANSION_CONFIGS[devState.soloExpansionTier || 1] || EXPANSION_CONFIGS[1];
  const recDoorCenterX = reception.door.x + reception.door.w / 2;
  const cabDoorCenterX = cabine.door.x + cabine.door.w / 2;
  const deskX = cabine.x + 60;
  const deskY = 1005;
  const deskW = 320;
  const deskH = 200;
  // Banqueta do cliente posicionada ao lado direito da bancada (Imagem 1)
  const stoolX = deskX + deskW + 60;
  const stoolY = deskY + 95;

  // Trajeto inteligente do cliente: sai da recepção e vai até a Mega Cabine Dev #01
  nextClient.waypoints = [
    { x: recDoorCenterX, y: Math.max(nextClient.y, 1200) }, // 1. Garante alinhamento no corredor limpo da porta
    { x: recDoorCenterX, y: 1040 },                         // 2. Alinha na porta da recepção por dentro
    { x: recDoorCenterX, y: 880 },                          // 3. Sai pela porta para o corredor central
    { x: cabDoorCenterX, y: 880 },                          // 4. Anda pelo corredor central livre até a porta da Cabine #01
    { x: cabDoorCenterX, y: cabine.y + 70 },                // 5. Entra pela porta da cabine
    { x: stoolX, y: stoolY }                               // 6. Senta na banqueta da bancada do Tech Lead
  ];
  nextClient.walkingToDesk = true;
  nextClient.insideReception = false;
  nextClient.enteringReception = false;
  nextClient.wanderTarget = null;

  showToast(`📣 Chamando ${nextClient.clientName} da Recepção para sua Cabine Dev!`);
  addDevLog(`📣 <b>${nextClient.clientName}</b> chamado da recepção de clientes para a Cabine Dev.`);
  renderAllUI();
}

function drinkDevCoffee() {
  devState.coffeeBoostTimer = 600;
  showToast('☕ Café Barista Expresso tomado! Velocidade Turbo de Dev ativada!');
  addDevLog('☕ Tech Lead tomou um expresso duplo e ganhou velocidade turbo!');
}

// ============================================================================
// BANCADA DEV: 4 ETAPAS (BRIEFING, STACK, ESCOPO, MINI-GAME)
// ============================================================================
function openDevWorkbenchModal() {
  const c = devCases[devState.activeCaseIndex];
  if (!c || c.leavingState || (!c.arrivedAtDesk && !c.walkingToDesk)) {
    showToast('🛎️ Nenhum cliente na sua bancada! Pressione [R] no teclado ou vá até a Recepção [E] para chamar o próximo cliente.');
    return;
  }

  renderDevWorkbenchModal();
  document.getElementById('dev-workbench-modal').classList.add('open');
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function renderDevWorkbenchModal() {
  const c = devCases[devState.activeCaseIndex];
  if (!c) return;

  document.getElementById('active-ticket-title').textContent = `Estação Dev · ${c.clientName}`;
  document.getElementById('client-name-title').textContent = c.clientName;
  document.getElementById('client-sector-badge').textContent = c.sector;
  document.getElementById('client-quote-text').textContent = `"${c.quote}"`;
  document.getElementById('mentor-tech-hint').innerHTML = `💡 <b>Dica de Engenharia:</b> ${c.mentorHint}`;
  document.getElementById('client-chibi-slot').innerHTML = renderChibiSVG(c.look);

  // Renderizar Detalhe Especial do Caso (Regra que muda o desenvolvimento)
  const spec = c.specialDetail;
  const specContainer = document.getElementById('client-special-detail-container');
  if (specContainer) {
    if (spec) {
      specContainer.innerHTML = `
        <div class="special-detail-box">
          <div class="special-detail-header">
            <div class="special-detail-title">
              <span>${spec.icon || '💎'}</span>
              <span>DETALHE ESPECIAL: ${escapeHtml(spec.title)}</span>
            </div>
            <span class="special-detail-badge ${spec.tagClass || 'tag-normal'}">${escapeHtml(spec.badge)}</span>
          </div>
          <div class="special-detail-desc">${escapeHtml(spec.desc)}</div>
          <div class="special-detail-impact-tag">
            ⚡ <b>Diretriz de Desenvolvimento:</b> ${spec.hint}
          </div>
        </div>
      `;
    } else {
      specContainer.innerHTML = '';
    }
  }

  // Abas
  document.querySelectorAll('.step-tab').forEach(tab => {
    const tName = tab.dataset.tab;
    tab.classList.toggle('active', tName === devState.activeTab);
    if (tName === 'escopo') tab.classList.toggle('done', !!c.diagnosisApproved);
    if (tName === 'coding') {
      tab.classList.toggle('done', !!c.minigameDone);
      tab.classList.toggle('locked', !c.diagnosisApproved);
      const numSpan = tab.querySelector('.num');
      if (numSpan) {
        numSpan.textContent = c.diagnosisApproved ? (c.minigameDone ? '✓' : '4') : '🔒';
      }
    }
  });

  document.querySelectorAll('.tab-panel').forEach(p => {
    p.classList.toggle('active', p.id === `panel-${devState.activeTab}`);
  });

  // 1. BRIEFING & LEVANTAMENTO DE REQUISITOS (5 PERGUNTAS TÉCNICAS)
  const bGrid = document.getElementById('briefing-grid');
  const askedCount = c.questions.filter(q => q.asked).length;
  bGrid.innerHTML = `
    <div style="grid-column: 1 / -1; background:#090d16; border:1.5px solid #1e293b; border-radius:12px; padding:10px 14px; margin-bottom:8px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
      <span style="font-size:12.5px; font-weight:800; color:#38bdf8;">📋 Dossiê de Requisitos do Aplicativo (${c.device}):</span>
      <span style="font-size:12px; font-weight:900; background:#1e293b; color:${askedCount === 5 ? '#10b981' : '#f59e0b'}; padding:3px 10px; border-radius:99px;">
        ${askedCount}/5 Requisitos Levantados (${askedCount === 5 ? '✓ Concluído' : 'Em Andamento'})
      </span>
    </div>
    ${c.questions.map((q, i) => `
      <button type="button" class="action-card ${q.asked ? 'revealed' : ''}" data-q="${i}">
        <div class="action-card-title">
          <span>💬 ${q.q}</span>
          <span>${q.asked ? '✓ Levantado' : 'Perguntar'}</span>
        </div>
        <div class="action-card-result">${q.asked ? `<b>Requisito:</b> ${q.a}` : 'Clique para perguntar ao cliente e registrar a especificação...'}</div>
      </button>
    `).join('')}
    <div style="grid-column: 1 / -1; margin-top:8px; display:flex; justify-content:flex-end;">
      <button type="button" class="btn btn-azul btn-sm" id="btn-next-to-assembly" style="font-weight:900;">
        🧩 Ir para Etapa 2: Montar Aplicativo ➡️
      </button>
    </div>
  `;

  bGrid.querySelectorAll('.action-card').forEach(btn => {
    btn.onclick = () => {
      c.questions[Number(btn.dataset.q)].asked = true;
      renderDevWorkbenchModal();
    };
  });

  document.getElementById('btn-next-to-assembly')?.addEventListener('click', () => {
    devState.activeTab = 'stack';
    renderDevWorkbenchModal();
  });

  // 2. MONTAGEM DO APLICATIVO COM AS CARACTERÍSTICAS SOLICITADAS
  const sGrid = document.getElementById('stack-test-grid');
  let matchCount = 0;
  let totalSelected = 0;
  const moduleKeys = ['backend', 'frontend', 'qa', 'cloud', 'techLead'];
  moduleKeys.forEach(k => {
    const mod = c.appModules[k];
    const selIdx = c.selectedModules[k];
    if (selIdx !== null && selIdx !== undefined) {
      totalSelected++;
      if (mod.options[selIdx]?.matches) matchCount++;
    }
  });

  const adherencePercent = Math.round((matchCount / 5) * 100);

  sGrid.innerHTML = `
    <div style="background:#090d16; border:1.5px solid #1e293b; border-radius:12px; padding:12px 16px; margin-bottom:14px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; flex-wrap:wrap; gap:8px;">
        <b style="color:#f8fafc; font-size:13.5px;">🧩 Arquitetura do Aplicativo: ${c.device}</b>
        <span style="font-size:12.5px; font-weight:900; color:${matchCount === 5 ? '#34d399' : '#38bdf8'};">
          ${totalSelected}/5 Módulos Definidos (${adherencePercent}% de Aderência)
        </span>
      </div>
      <div style="width:100%; height:8px; background:#1e293b; border-radius:99px; overflow:hidden;">
        <div style="width:${(totalSelected / 5) * 100}%; height:100%; background:${matchCount === 5 ? '#10b981' : '#38bdf8'}; transition:width 0.3s ease;"></div>
      </div>
      ${matchCount === 5 ? `
        <div style="margin-top:10px; font-size:12px; color:#34d399; font-weight:800; background:rgba(16,185,129,0.15); padding:6px 12px; border-radius:8px;">
          ✨ Excelente! Todos os 5 módulos atendem com perfeição ao que o cliente pediu no levantamento!
        </div>
      ` : `
        <div style="margin-top:8px; font-size:11.5px; color:#94a3b8;">
          💡 Selecione as opções de arquitetura que combinam com os requisitos levantados no Briefing.
        </div>
      `}
    </div>

    ${moduleKeys.map(k => {
      const mod = c.appModules[k];
      const selIdx = c.selectedModules[k];
      return `
        <div class="app-module-block">
          <div class="app-module-header">
            <div class="app-module-title">${mod.title}</div>
            ${selIdx !== null && selIdx !== undefined ? (
              mod.options[selIdx].matches
                ? '<span style="font-size:11px; font-weight:900; color:#10b981; background:rgba(16,185,129,0.15); padding:2px 8px; border-radius:6px;">✨ Requisito Atendido</span>'
                : '<span style="font-size:11px; font-weight:900; color:#f59e0b; background:rgba(245,158,11,0.15); padding:2px 8px; border-radius:6px;">⚠️ Divergência</span>'
            ) : '<span style="font-size:11px; color:#64748b;">(Clique em uma opção para selecionar)</span>'}
          </div>
          <div class="app-options-grid">
            ${mod.options.map((opt, optIdx) => `
              <button type="button" class="app-option-card ${selIdx === optIdx ? 'selected' : ''} ${selIdx === optIdx && opt.matches ? 'matched' : ''}" data-mod="${k}" data-opt="${optIdx}">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <b style="color:${selIdx === optIdx ? (opt.matches ? '#34d399' : '#38bdf8') : '#f8fafc'}; font-size:12px;">${opt.title}</b>
                  <span>${selIdx === optIdx ? '🔘' : '⚪'}</span>
                </div>
                <div style="font-size:11.5px; line-height:1.45; color:#94a3b8; margin-top:4px;">${opt.desc}</div>
              </button>
            `).join('')}
          </div>
        </div>
      `;
    }).join('')}

    <div style="margin-top:14px; display:flex; justify-content:flex-end;">
      <button type="button" class="btn btn-amarelo" id="btn-next-to-scope" style="font-weight:900;">
        📋 Avançar para Etapa 3: Validar Escopo ⚠️ ➡️
      </button>
    </div>
  `;

  sGrid.querySelectorAll('.app-option-card').forEach(btn => {
    btn.onclick = () => {
      const mod = btn.dataset.mod;
      const optIdx = Number(btn.dataset.opt);
      c.selectedModules[mod] = optIdx;
      renderDevWorkbenchModal();
    };
  });

  document.getElementById('btn-next-to-scope')?.addEventListener('click', () => {
    devState.activeTab = 'escopo';
    renderDevWorkbenchModal();
  });

  // 3. DEFINIÇÃO DE ESCOPO & ARQUITETURA (DIAGNÓSTICO OBRIGATÓRIO)
  const scGrid = document.getElementById('scope-decision-grid');
  scGrid.innerHTML = c.diagnoses.map((d, i) => `
    <button type="button" class="action-card ${c.diagnosisApproved && d.correct ? 'revealed' : ''}" data-d="${i}">
      <div class="action-card-title"><span>📋 ${d.title}</span></div>
      <div class="action-card-result">${d.desc}</div>
    </button>
  `).join('');

  scGrid.querySelectorAll('.action-card').forEach(btn => {
    btn.onclick = () => {
      handleScopeDecision(c, c.diagnoses[Number(btn.dataset.d)]);
    };
  });

  // 4. DESAFIO TÉCNICO / PUZZLE INTERATIVO DE CÓDIGO
  renderCodingMinigame(c);
}

// Decisão de Escopo: se errar toma multa contratual e cliente cancela; se acertar libera o puzzle!
function handleScopeDecision(c, choice) {
  // Verificação de Detalhes Especiais com Restrições Estritas
  if (choice.correct && c.specialDetail) {
    const spec = c.specialDetail;
    if (spec.enforceQAMatch && c.selectedModules?.qa !== null && c.selectedModules?.qa !== undefined) {
      if (!c.appModules?.qa?.options[c.selectedModules.qa]?.matches) {
        showToast(`🛡️ AUDITORIA REGULATÓRIA: Bloqueado! O detalhe especial (${spec.title}) exige módulo de QA & Cybersecurity alinhado à blindagem!`);
        return;
      }
    }
    if (spec.enforceFrontendMatch && c.selectedModules?.frontend !== null && c.selectedModules?.frontend !== undefined) {
      if (!c.appModules?.frontend?.options[c.selectedModules.frontend]?.matches) {
        showToast(`📶 RESTRIÇÃO DE FRONTEND: Bloqueado! O detalhe especial (${spec.title}) exige módulo Frontend & Mobile com suporte offline/acessibilidade!`);
        return;
      }
    }
    if (spec.enforceBackendCloudMatch) {
      const bMatches = c.selectedModules?.backend !== null && c.appModules?.backend?.options[c.selectedModules.backend]?.matches;
      const cMatches = c.selectedModules?.cloud !== null && c.appModules?.cloud?.options[c.selectedModules.cloud]?.matches;
      if (!bMatches || !cMatches) {
        showToast(`⚡ ALTA ESCALA: Bloqueado! O detalhe especial (${spec.title}) exige Backend e Cloud sem gargalos arquiteturais!`);
        return;
      }
    }
    if (spec.enforceTechLeadMatch && c.selectedModules?.techLead !== null && c.selectedModules?.techLead !== undefined) {
      if (!c.appModules?.techLead?.options[c.selectedModules.techLead]?.matches) {
        showToast(`🏢 MIGRAÇÃO SEGURA: Bloqueado! O detalhe especial (${spec.title}) exige Tech Lead com Clean Architecture/Strangler Fig!`);
        return;
      }
    }
  }

  if (!choice.correct) {
    document.getElementById('dev-workbench-modal').classList.remove('open');
    const penaltyMult = c.specialDetail?.penaltyMult || 1.0;
    const repLossMult = c.specialDetail?.repLossMult || 1.0;
    const penalty = Math.round(2000 * penaltyMult);
    const repLoss = Math.round(30 * repLossMult);

    devState.money -= penalty;
    devState.failedCount++;
    changeReputation(-repLoss);

    c.leavingState = 'leaving_angry';
    c.arrivedAtDesk = false;
    c.walkingToDesk = false;
    c.insideReception = false;
    c.enteringReception = false;
    const cabine = DEV_ROOMS.find(r => r.id === 'dev_room_1') || DEV_ROOMS[0];
    const cabDoorCenterX = cabine.door.x + cabine.door.w / 2;
    c.waypoints = [
      { x: cabDoorCenterX, y: cabine.y + 80 },
      { x: cabDoorCenterX, y: 880 },
      { x: 2350, y: 880 },
      { x: 2460, y: 780 }
    ];

    showToast(`💥 PROJETO CANCELADO! Arquitetura incorreta: multa contratual de -R$ ${penalty} (-${repLoss}% Reputação)!`);
    addDevLog(`💥 <b>${c.clientName}</b> cancelou o contrato por arquitetura inadequada! Multa de -R$ ${penalty}.`);
    if (typeof PlantaoDevProfile !== "undefined" && PlantaoDevProfile.recordCrash) {
      PlantaoDevProfile.recordCrash();
    }
    saveDevGameState();

    spawnNextDatabaseClient();

    const nextIdx = devCases.findIndex(x => !x.solved && !x.leavingState);
    if (nextIdx !== -1) devState.activeCaseIndex = nextIdx;
    renderAllUI();
    return;
  }

  c.diagnosisApproved = true;
  devState.activeTab = 'coding';
  showToast('🎯 Escopo & Arquitetura aprovados! Desafio Técnico liberado na Etapa 4!');
  renderDevWorkbenchModal();
}

// Renderiza o Desafio Técnico / Puzzle Interativo selecionado dos 190 puzzles
function renderCodingMinigame(c) {
  const container = document.getElementById('coding-minigame-container');
  if (!container) return;

  if (!c.diagnosisApproved) {
    container.innerHTML = `
      <div style="background:#0f172a; border:2.5px dashed #475569; border-radius:14px; padding:35px 20px; text-align:center; color:#94a3b8; font-weight:800; margin:10px 0;">
        <div style="font-size:44px; margin-bottom:10px;">🔒</div>
        <h3 style="color:#f8fafc; margin:0 0 8px; font-size:18px;">Desafio Técnico Bloqueado!</h3>
        <p style="margin:0 auto 16px; max-width:440px; font-size:13px; line-height:1.5; color:#cbd5e1;">
          Antes de abrir o editor de engenharia, você <b>deve primeiro validar e aprovar o escopo na Etapa 3 (Escopo ⚠️)</b>. Caso aprove uma arquitetura errada, o projeto falha!
        </p>
        <button type="button" class="btn btn-amarelo btn-sm" id="btn-goto-escopo">⚠️ Ir para Etapa 3: Escopo</button>
      </div>
    `;
    document.getElementById('btn-goto-escopo')?.addEventListener('click', () => {
      devState.activeTab = 'escopo';
      renderDevWorkbenchModal();
    });
    return;
  }

  const p = c.puzzle;
  if (!p) {
    container.innerHTML = `<div style="color:#fff; padding:20px;">Carregando desafio técnico...</div>`;
    return;
  }

  const catColors = {
    backend_api: '#f59e0b',
    frontend_mobile: '#8b5cf6',
    qa_cybersecurity: '#10b981',
    cloud_devops_ai: '#0ea5e9',
    tech_lead: '#ec4899'
  };
  const catColor = catColors[p.category] || '#38bdf8';

  container.innerHTML = `
    <div class="dev-minigame-box">
      <!-- Header do Puzzle com Especialidade da Categoria -->
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:12px;">
        <span style="font-size:12px; font-weight:900; background:${catColor}22; border:1.5px solid ${catColor}; color:${catColor}; padding:4px 12px; border-radius:99px;">
          ${p.icon} ${p.categoryLabel} · Desafio #${p.id.toUpperCase()}
        </span>
        <span style="font-size:11.5px; color:#94a3b8; font-weight:700;">
          📱 Aplicação: <b style="color:#f8fafc;">${p.appType}</b>
        </span>
      </div>

      <h3 style="color:#f8fafc; margin:0 0 8px; font-size:16px; font-weight:900;">
        ${p.title}
      </h3>

      <!-- Demanda e Desafio Técnico -->
      <div style="background:#090d16; border-left:4px solid ${catColor}; padding:10px 14px; border-radius:0 8px 8px 0; margin-bottom:14px; font-size:12.5px; line-height:1.5; color:#cbd5e1;">
        <b style="color:#f8fafc;">Demanda do Cliente:</b> ${p.clientDemand}<br>
        <span style="color:#94a3b8;"><b>Desafio Técnico:</b> ${p.technicalContext}</span>
      </div>

      <!-- Editor de Código / Terminal -->
      <div class="code-editor-mock" style="margin-bottom:14px;">
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #334155; padding-bottom:6px; margin-bottom:8px; font-size:11px; color:#64748b;">
          <span>TERMINAL / EDITOR DE ENGENHARIA</span>
          <span style="color:${catColor}; font-weight:800;">${p.categoryLabel}</span>
        </div>
        <pre style="margin:0; font-family:'JetBrains Mono', monospace; font-size:12.5px; color:#38bdf8; white-space:pre-wrap; line-height:1.55;">${escapeHtml(p.codeSnippet)}</pre>
      </div>

      <!-- Alternativas Técnicas de Solução (4 opções) -->
      <b style="color:#f8fafc; font-size:13px; display:block; margin-bottom:8px;">
        ⚡ Selecione a Solução de Engenharia Adequada:
      </b>
      <div style="display:flex; flex-direction:column; gap:8px; margin-bottom:14px;">
        ${p.options.map((opt, i) => `
          <button type="button" class="puzzle-option-btn ${c.puzzleSelected === i ? (opt.correct ? 'correct' : 'wrong') : ''}" data-opt="${i}">
            <span class="puzzle-opt-radio">${c.puzzleSelected === i ? (opt.correct ? '✓' : '✗') : (i + 1)}</span>
            <span style="flex:1;">${opt.text}</span>
            ${c.puzzleSelected === i && opt.correct ? '<span style="color:#10b981; font-weight:900;">[APROVADO]</span>' : ''}
          </button>
        `).join('')}
      </div>

      <!-- Feedback e Explicação Técnica -->
      ${c.minigameDone ? `
        <div style="background:#064e3b; border:1.5px solid #10b981; border-radius:10px; padding:12px 16px; margin-bottom:14px; color:#d1fae5; font-size:12.5px; line-height:1.5;">
          <b style="color:#34d399; font-size:13.5px; display:block; margin-bottom:4px;">🎯 Solução Técnica Aprovada com Sucesso!</b>
          ${p.explanation}
        </div>
        <button type="button" class="btn btn-verde" id="btn-finish-puzzle-deploy" style="font-weight:900; font-size:15px; padding:12px 20px; width:100%; box-shadow:0 4px 16px rgba(16, 185, 129, 0.4);">
          🚀 Compilar Módulos e Fazer Deploy do Aplicativo
        </button>
      ` : ''}

      ${c.puzzleErrorMsg ? `
        <div style="background:#450a0a; border:1.5px solid #ef4444; border-radius:8px; padding:10px 14px; color:#fca5a5; font-size:12px; font-weight:800; margin-bottom:12px;">
          ${c.puzzleErrorMsg}
        </div>
      ` : ''}
    </div>
  `;

  // Event Listeners das opções do puzzle
  container.querySelectorAll('.puzzle-option-btn').forEach(btn => {
    btn.onclick = () => {
      const idx = Number(btn.dataset.opt);
      c.puzzleSelected = idx;
      const opt = p.options[idx];
      if (opt.correct) {
        c.minigameDone = true;
        c.puzzleErrorMsg = '';
        showToast('🎯 Solução correta! Requisito atendido com sucesso.');
      } else {
        c.minigameDone = false;
        const connectedCount = getConnectedPlayerCount();
        const baseMistakeCost = c.specialDetail?.puzzleMistakeCost || 200;
        const mistakeCost = Math.round(baseMistakeCost * (1.0 + (connectedCount - 1) * 0.50));
        const patienceShock = Math.round(8 * (1.0 + (connectedCount - 1) * 0.60));

        c.patience = Math.max(0, c.patience - patienceShock);
        c.puzzleErrorMsg = `⚠️ Solução Inadequada! Abordagem incorreta gerou retrabalho em equipe (-R$ ${mistakeCost} e -${patienceShock}% de Paciência do cliente).`;
        devState.money = Math.max(0, devState.money - mistakeCost);
        showToast(`❌ Solução incorreta! -R$ ${mistakeCost} e Paciência -${patienceShock}%!`);
        updateHUD();
      }
      renderCodingMinigame(c);
    };
  });

  document.getElementById('btn-finish-puzzle-deploy')?.addEventListener('click', () => {
    completeSoftwareProject(c);
  });
}

function completeSoftwareProject(c) {
  c.solved = true;
  c.minigameDone = true;
  c.arrivedAtDesk = false;
  c.walkingToDesk = false;
  c.insideReception = false;
  c.enteringReception = false;

  const cabine = DEV_ROOMS.find(r => r.id === 'dev_room_1') || DEV_ROOMS[0];
  const cabDoorCenterX = cabine.door.x + cabine.door.w / 2;
  c.leavingState = 'leaving_happy';
  c.waypoints = [
    { x: cabDoorCenterX, y: cabine.y + 80 },
    { x: cabDoorCenterX, y: 880 },
    { x: 2350, y: 880 },
    { x: 2460, y: 780 }
  ];

  // Remuneração do Projeto
  let reward = 1200;
  if (c.urgency === 'ALTA') reward += 600;
  if (c.urgency === 'CRÍTICA') reward += 1200;
  if (devState.upgrades.ac_lvl3) reward += 600;
  else if (devState.upgrades.ac_lvl2) reward += 350;
  else if (devState.upgrades.ac_lvl1) reward += 150;

  const benchLvl = devState.workbenchLevel || 1;
  if (benchLvl === 2) reward += 200;
  else if (benchLvl === 3) reward += 450;
  else if (benchLvl === 4) reward += 1000;
  else if (benchLvl >= 5) {
    reward += 2500;
    repGain += 1;
  }

  // Efeitos e Bônus dos Detalhes Especiais
  if (c.specialDetail) {
    if (c.specialDetail.payoutBonusMult && c.specialDetail.payoutBonusMult > 1) {
      reward = Math.round(reward * c.specialDetail.payoutBonusMult);
    }
    if (c.specialDetail.baseBonus) {
      reward += c.specialDetail.baseBonus;
    }
    if (c.specialDetail.timeBonus) {
      reward += c.specialDetail.timeBonus;
    }
  }

  // Reputação sobe devagar (+1% base; bônus com Sofá VIP, Crítica ou Detalhes Especiais)
  let repGain = 1;
  if (devState.upgrades.vip_sofa) repGain += 1;
  if (c.urgency === 'CRÍTICA') repGain += 1;
  if (c.specialDetail?.doubleReputation) repGain += 1;
  if (c.specialDetail?.repBonus) repGain += c.specialDetail.repBonus;

  const connectedCount = getConnectedPlayerCount();
  if (connectedCount > 1) {
    const coopSquadBonus = Math.round(reward * 0.20 * (connectedCount - 1));
    reward += coopSquadBonus;
  }
  devState.money += reward;
  changeReputation(+repGain);
  if (typeof PlantaoDevProfile !== "undefined" && PlantaoDevProfile.recordProject) {
    PlantaoDevProfile.recordProject(connectedCount, devState.rep, 25);
  }
  saveDevGameState();

  document.getElementById('dev-workbench-modal').classList.remove('open');
  showToast(`🎉 Projeto ${c.code} entregue com sucesso! (+R$ ${reward} e +${repGain}% Reputação)`);
  addDevLog(`✅ Projeto <b>${c.device}</b> entregue para <b>${c.clientName}</b>! (+R$ ${reward} | +${repGain}% Rep).`);

  spawnNextDatabaseClient();

  const nextIdx = devCases.findIndex(x => !x.solved && !x.leavingState);
  if (nextIdx !== -1) devState.activeCaseIndex = nextIdx;

  renderAllUI();
}

// ============================================================================
// SISTEMA DE REPUTAÇÃO E GAME OVER
// ============================================================================
function changeReputation(delta) {
  devState.rep = Math.max(0, Math.min(100, devState.rep + delta));
  updateHUD();

  if (devState.rep <= 0 && !cloudNOCState.gameOver) {
    triggerReputationGameOver();
  }
}

function triggerReputationGameOver() {
  cloudNOCState.gameOver = true;
  document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.remove('open'));

  const titleEl = document.getElementById('game-over-title');
  const iconEl = document.getElementById('game-over-icon');
  const descEl = document.getElementById('game-over-desc');
  if (titleEl) titleEl.textContent = 'FIM DE JOGO — SUA SOFTWARE HOUSE FALIU (REPUTAÇÃO 0%)!';
  if (iconEl) iconEl.textContent = '📉🚫💔';
  if (descEl) descEl.innerHTML = 'A reputação da empresa despencou para <b>0%</b>! Clientes furiosos cancelaram todos os contratos, aplicaram multas pesadas de SLA e o negócio declarou <b>falência completa</b>!';

  document.getElementById('game-over-money').textContent = `R$ ${devState.money}`;
  document.getElementById('game-over-rep').textContent = `0% (FALÊNCIA)`;
  document.getElementById('game-over-cloud-fixed').textContent = `${cloudNOCState.fixedCount} Incidentes`;
  document.getElementById('game-over-failed-count').textContent = `${devState.failedCount}`;

  document.getElementById('game-over-modal').classList.add('open');
  addDevLog('🚫📉 <b>FALÊNCIA:</b> A Software House encerrou as atividades por reputação 0%!');
}

function triggerCloudGameOver() {
  cloudNOCState.gameOver = true;
  cloudNOCState.onFire = true;
  document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.remove('open'));

  const titleEl = document.getElementById('game-over-title');
  const iconEl = document.getElementById('game-over-icon');
  const descEl = document.getElementById('game-over-desc');
  if (titleEl) titleEl.textContent = 'FIM DE JOGO — O CLUSTER CLOUD PEGOU FOGO!';
  if (iconEl) iconEl.textContent = '🔥💥🚨';
  if (descEl) descEl.innerHTML = 'O tempo limite de <b>180 segundos (3 minutos)</b> para conter o ataque DDoS e a sobrecarga de deploy esgotou! O Cluster Central pegou fogo, todos os bancos foram corrompidos e a empresa foi <b>evacuada pelos bombeiros</b>!';

  document.getElementById('game-over-money').textContent = `R$ ${devState.money}`;
  document.getElementById('game-over-rep').textContent = `${devState.rep}%`;
  document.getElementById('game-over-cloud-fixed').textContent = `${cloudNOCState.fixedCount} Incidentes`;
  document.getElementById('game-over-failed-count').textContent = `${devState.failedCount}`;

  document.getElementById('game-over-modal').classList.add('open');
  addDevLog('🚨🔥 <b>INCÊNDIO:</b> O Cluster Cloud derreteu e causou Game Over!');
}

function triggerCloudIncidentAlert() {
  const connectedCount = getConnectedPlayerCount();
  // Com mais técnicos na operação, o SLA de emergência é mais curto e exigente
  const slaSeconds = Math.max(80, Math.round(180 - (connectedCount - 1) * 22));

  cloudNOCState.incidentActive = true;
  cloudNOCState.incidentSecondsRemaining = slaSeconds;
  cloudNOCState.incidentIntervalCounter = 0;
  cloudNOCState.solvedModules = [];

  const banner = document.getElementById('cloud-incident-banner');
  if (banner) banner.classList.add('visible');

  showToast(`🚨 ALERTA CRÍTICO: Incidente no Cluster Cloud (${connectedCount} Devs)! ${slaSeconds}s de SLA para resolver!`);
  addDevLog(`🚨 <b>INCIDENTE CLOUD:</b> Ataque DDoS e sobrecarga massiva no cluster! SLA de contingência de ${slaSeconds}s! Vá ao NOC [E]!`);
}

function restartSoftwareGameSession() {
  randomizePlantModels();
  randomizeDevRoomCabinets();
  randomizeDevOfficeRugs();
  randomizeHallwayShopBenches();
  cloudNOCState.gameOver = false;
  cloudNOCState.onFire = false;
  cloudNOCState.incidentActive = false;
  cloudNOCState.incidentSecondsRemaining = 180;
  cloudNOCState.incidentIntervalCounter = 0;

  devState.money = 999999999;
  devState.rep = 70;
  devState.failedCount = 0;
  devCases = createClientCasesQueue();

  document.getElementById('game-over-modal').classList.remove('open');
  document.getElementById('cloud-incident-banner').classList.remove('visible');

  const you = devState.players[devState.mySlotIndex];
  if (you) {
    you.x = 450;
    you.y = 1260;
    you.waypoints = [];
  }

  showToast('🔄 Nova Software House fundada! Bom trabalho, Tech Lead!');
  addDevLog('🔄 Nova empresa fundada com R$ 2.500 no caixa e 70% de reputação.');
  renderAllUI();
}

// ============================================================================
// CLUSTER CLOUD NOC & RESOLUÇÃO DE INCIDENTES
// ============================================================================
function openCloudNOCModal() {
  renderCloudNOCModal();
  const modal = document.getElementById('cloud-noc-modal');
  if (modal) modal.classList.add('open');
}

function renderCloudNOCModal() {
  const title = document.getElementById('cloud-status-title');
  const desc = document.getElementById('cloud-status-desc');
  const badge = document.getElementById('cloud-status-badge');
  const incidentSection = document.getElementById('cloud-incident-section');
  const btnResolve = document.getElementById('btn-resolve-cloud-issue');
  const counterEl = document.getElementById('cluster-puzzles-counter');

  if (!devState.solvedClusterPuzzles) devState.solvedClusterPuzzles = [];

  if (counterEl) {
    const solvedCount = devState.solvedClusterPuzzles.length;
    counterEl.textContent = `${solvedCount}/20 Puzzles Resolvidos`;
  }

  if (cloudNOCState.incidentActive) {
    if (title) title.textContent = '🚨 Pane Crítica: Ataque DDoS & Sobrecarga de K8s';
    if (desc) desc.textContent = 'O cluster está sob ataque violento! Resolva os módulos de contenção abaixo antes do SLA de 180s esgotar!';
    if (badge) {
      badge.textContent = 'FALHA CRÍTICA';
      badge.style.background = '#ef4444';
      badge.style.color = '#fff';
    }
    if (incidentSection) incidentSection.style.display = 'block';
    if (btnResolve) btnResolve.style.display = 'inline-flex';
  } else {
    if (title) title.textContent = 'Status: Operação Normal';
    if (desc) desc.textContent = 'Cluster Kubernetes, bancos de dados e réplicas operando em alta disponibilidade (99.9% uptime).';
    if (badge) {
      badge.textContent = 'ONLINE 99.9%';
      badge.style.background = 'rgba(16, 185, 129, 0.15)';
      badge.style.color = '#34d399';
    }
    if (incidentSection) incidentSection.style.display = 'none';
    if (btnResolve) btnResolve.style.display = 'none';
  }

  // 1. Grid dos 20 Puzzles de Cluster
  const puzzlesGrid = document.getElementById('cluster-puzzles-grid');
  const clusterDb = (typeof CLUSTER_PUZZLES_DATABASE !== 'undefined') ? CLUSTER_PUZZLES_DATABASE : [];
  
  if (puzzlesGrid) {
    puzzlesGrid.innerHTML = clusterDb.map(p => {
      const isSolved = devState.solvedClusterPuzzles.includes(p.id);
      const isSelected = devState.activeClusterPuzzleId === p.id;
      return `
        <button type="button" class="action-card ${isSolved ? 'revealed' : ''} ${isSelected ? 'selected' : ''}" data-cluster-puzzle="${p.id}" style="padding:8px 10px;">
          <div class="action-card-title" style="font-size:12px;">
            <span>${p.icon} #${String(p.num).padStart(2, '0')} ${p.category}</span>
            <span style="font-size:10px; color:${isSolved ? '#34d399' : '#38bdf8'}; font-weight:900;">${isSolved ? '✓ Resolvido' : '⚡ Abrir'}</span>
          </div>
          <div class="action-card-result" style="font-size:11px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
            ${p.title}
          </div>
        </button>
      `;
    }).join('');

    puzzlesGrid.querySelectorAll('[data-cluster-puzzle]').forEach(btn => {
      btn.onclick = () => {
        const pId = btn.dataset.clusterPuzzle;
        selectClusterPuzzle(pId);
      };
    });
  }

  // Se houver um puzzle ativo, renderiza seu painel de diagnóstico
  renderActiveClusterPuzzleDetail();

  // 2. Módulos de Incidente Crítico (quando em pane)
  const grid = document.getElementById('cloud-modules-grid');
  if (grid) {
    const modules = [
      { title: '🛡️ Bloqueio de IP no Firewall (WAF)', solved: cloudNOCState.solvedModules.includes(0) },
      { title: '⚖️ Rebalanceamento de Carga Nginx', solved: cloudNOCState.solvedModules.includes(1) },
      { title: '💾 Flush de Cache e Limpeza Redis', solved: cloudNOCState.solvedModules.includes(2) }
    ];

    grid.innerHTML = modules.map((m, i) => `
      <button type="button" class="action-card ${m.solved ? 'revealed' : ''}" data-mod="${i}">
        <div class="action-card-title">
          <span>${m.title}</span>
          <span>${m.solved ? '✓ Resolvido' : (cloudNOCState.incidentActive ? '⚠️ Corrigir' : 'Operacional')}</span>
        </div>
        <div class="action-card-result">
          ${m.solved ? 'Módulo operando com métricas estáveis.' : (cloudNOCState.incidentActive ? 'Clique para aplicar o patch de correção...' : 'Nenhum erro reportado.')}
        </div>
      </button>
    `).join('');

    grid.querySelectorAll('.action-card').forEach(btn => {
      btn.onclick = () => {
        if (!cloudNOCState.incidentActive) return;
        const idx = Number(btn.dataset.mod);
        if (!cloudNOCState.solvedModules.includes(idx)) {
          cloudNOCState.solvedModules.push(idx);
          renderCloudNOCModal();
        }
      };
    });
  }

  const allSolved = cloudNOCState.requiredModules.every(m => cloudNOCState.solvedModules.includes(m));
  if (btnResolve) {
    btnResolve.disabled = !cloudNOCState.incidentActive || !allSolved;
    btnResolve.onclick = () => {
      cloudNOCState.incidentActive = false;
      cloudNOCState.fixedCount++;
      cloudNOCState.incidentIntervalCounter = 0;
      devState.money += 1500;
      changeReputation(+2);

      const banner = document.getElementById('cloud-incident-banner');
      if (banner) banner.classList.remove('visible');
      const modal = document.getElementById('cloud-noc-modal');
      if (modal) modal.classList.remove('open');

      showToast('🎉 Cluster Cloud restabelecido com sucesso! (+R$ 1.500 | +2% Rep)');
      addDevLog('✅ O Cluster Cloud foi totalmente recuperado e o tráfego normalizou! (+R$ 1.500).');
      renderAllUI();
    };
  }

  const btnClose = document.getElementById('btn-close-cloud-noc');
  if (btnClose) {
    btnClose.onclick = () => {
      const modal = document.getElementById('cloud-noc-modal');
      if (modal) modal.classList.remove('open');
    };
  }
}

function selectClusterPuzzle(puzzleId) {
  devState.activeClusterPuzzleId = puzzleId;
  renderCloudNOCModal();
}

function renderActiveClusterPuzzleDetail() {
  const panel = document.getElementById('cluster-active-puzzle-panel');
  if (!panel) return;
  if (!devState.activeClusterPuzzleId) {
    panel.style.display = 'none';
    return;
  }

  const clusterDb = (typeof CLUSTER_PUZZLES_DATABASE !== 'undefined') ? CLUSTER_PUZZLES_DATABASE : [];
  const puzzle = clusterDb.find(p => p.id === devState.activeClusterPuzzleId);
  if (!puzzle) {
    panel.style.display = 'none';
    return;
  }

  panel.style.display = 'block';
  const isSolved = devState.solvedClusterPuzzles.includes(puzzle.id);

  document.getElementById('cl-puzzle-title').textContent = `${puzzle.icon} #${String(puzzle.num).padStart(2, '0')} · ${puzzle.title}`;
  document.getElementById('cl-puzzle-reward-badge').textContent = isSolved ? '✓ Concluído' : `+R$ ${puzzle.rewardMoney} · +${puzzle.rewardRep}% Rep`;
  document.getElementById('cl-puzzle-desc').textContent = puzzle.desc;
  document.getElementById('cl-puzzle-code').textContent = puzzle.codeSnippet;

  const optContainer = document.getElementById('cl-puzzle-options');
  const feedbackEl = document.getElementById('cl-puzzle-feedback');
  feedbackEl.innerHTML = isSolved ? `<span style="color:#34d399;">✅ <b>Puzzle já resolvido!</b> ${puzzle.explanation}</span>` : '';

  optContainer.innerHTML = puzzle.options.map((opt, optIdx) => `
    <button type="button" class="btn btn-vidro btn-sm" data-cl-opt="${optIdx}" ${isSolved ? 'disabled' : ''} style="text-align:left; justify-content:flex-start; padding:8px 12px; font-size:11.5px; border-radius:8px;">
      <b>${String.fromCharCode(65 + optIdx)})</b> ${opt.text}
    </button>
  `).join('');

  if (!isSolved) {
    optContainer.querySelectorAll('[data-cl-opt]').forEach(btn => {
      btn.onclick = () => {
        const oIdx = Number(btn.dataset.clOpt);
        const chosen = puzzle.options[oIdx];
        if (chosen.correct) {
          devState.solvedClusterPuzzles.push(puzzle.id);
          devState.money += puzzle.rewardMoney;
          changeReputation(puzzle.rewardRep);
          if (puzzle.rewardStack && devState.stackCapacity > 0) {
            devState.stackParts = Math.min(devState.stackCapacity, devState.stackParts + puzzle.rewardStack);
          }
          feedbackEl.innerHTML = `<span style="color:#34d399;">🎉 <b>Correto!</b> ${puzzle.explanation} (+R$ ${puzzle.rewardMoney} | +${puzzle.rewardRep}% Rep)</span>`;
          showToast(`⚡ Cluster: Puzzle #${puzzle.num} resolvido com sucesso! (+R$ ${puzzle.rewardMoney})`);
          addDevLog(`⚡ <b>Cluster Cloud:</b> Desafio #${puzzle.num} (${puzzle.title}) solucionado com sucesso!`);
          renderAllUI();
          renderCloudNOCModal();
        } else {
          feedbackEl.innerHTML = `<span style="color:#ef4444;">❌ <b>Ação incorreta para o cluster!</b> Tente outra estratégia de orquestração.</span>`;
        }
      };
    });
  }
}

// ============================================================================
// SERVIDOR DEDICADO BARE-METAL (40 PUZZLES PRÓPRIOS DE HARDWARE & STORAGE)
// ============================================================================
function openServerRackModal() {
  const hasServer = devState.upgrades && (devState.upgrades.rack_lvl1 || devState.upgrades.rack_lvl2);
  if (!hasServer) {
    showToast('🛒 Servidor ainda não adquirido! Compre o Servidor Local na Loja Tech para desbloquear os 40 puzzles de infraestrutura física!');
    return;
  }

  renderServerRackModal();
  const modal = document.getElementById('server-rack-modal');
  if (modal) modal.classList.add('open');
}

function renderServerRackModal() {
  if (!devState.solvedServerPuzzles) devState.solvedServerPuzzles = [];

  const counterEl = document.getElementById('server-puzzles-counter');
  if (counterEl) {
    counterEl.textContent = `${devState.solvedServerPuzzles.length}/40 Puzzles Resolvidos`;
  }

  const grid = document.getElementById('server-puzzles-grid');
  const serverDb = (typeof SERVER_RACK_PUZZLES_DATABASE !== 'undefined') ? SERVER_RACK_PUZZLES_DATABASE : [];

  if (grid) {
    grid.innerHTML = serverDb.map(p => {
      const isSolved = devState.solvedServerPuzzles.includes(p.id);
      const isSelected = devState.activeServerPuzzleId === p.id;
      return `
        <button type="button" class="action-card ${isSolved ? 'revealed' : ''} ${isSelected ? 'selected' : ''}" data-srv-puzzle="${p.id}" style="padding:8px 10px;">
          <div class="action-card-title" style="font-size:12px;">
            <span>${p.icon} #${String(p.num).padStart(2, '0')} ${p.category}</span>
            <span style="font-size:10px; color:${isSolved ? '#34d399' : '#10b981'}; font-weight:900;">${isSolved ? '✓ Resolvido' : '🔧 Abrir'}</span>
          </div>
          <div class="action-card-result" style="font-size:11px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
            ${p.title}
          </div>
        </button>
      `;
    }).join('');

    grid.querySelectorAll('[data-srv-puzzle]').forEach(btn => {
      btn.onclick = () => {
        const pId = btn.dataset.srvPuzzle;
        selectServerPuzzle(pId);
      };
    });
  }

  renderActiveServerPuzzleDetail();

  const btnClose = document.getElementById('btn-close-server-rack');
  if (btnClose) {
    btnClose.onclick = () => {
      const modal = document.getElementById('server-rack-modal');
      if (modal) modal.classList.remove('open');
    };
  }
}

function selectServerPuzzle(puzzleId) {
  devState.activeServerPuzzleId = puzzleId;
  renderServerRackModal();
}

function renderActiveServerPuzzleDetail() {
  const panel = document.getElementById('server-active-puzzle-panel');
  if (!panel) return;
  if (!devState.activeServerPuzzleId) {
    panel.style.display = 'none';
    return;
  }

  const serverDb = (typeof SERVER_RACK_PUZZLES_DATABASE !== 'undefined') ? SERVER_RACK_PUZZLES_DATABASE : [];
  const puzzle = serverDb.find(p => p.id === devState.activeServerPuzzleId);
  if (!puzzle) {
    panel.style.display = 'none';
    return;
  }

  panel.style.display = 'block';
  const isSolved = devState.solvedServerPuzzles.includes(puzzle.id);

  document.getElementById('srv-puzzle-title').textContent = `${puzzle.icon} #${String(puzzle.num).padStart(2, '0')} · ${puzzle.title}`;
  document.getElementById('srv-puzzle-reward-badge').textContent = isSolved ? '✓ Concluído' : `+R$ ${puzzle.rewardMoney} · +${puzzle.rewardStack} Módulos`;
  document.getElementById('srv-puzzle-desc').textContent = puzzle.desc;
  document.getElementById('srv-puzzle-code').textContent = puzzle.codeSnippet;

  const optContainer = document.getElementById('srv-puzzle-options');
  const feedbackEl = document.getElementById('srv-puzzle-feedback');
  feedbackEl.innerHTML = isSolved ? `<span style="color:#34d399;">✅ <b>Manutenção Concluída!</b> ${puzzle.explanation}</span>` : '';

  optContainer.innerHTML = puzzle.options.map((opt, optIdx) => `
    <button type="button" class="btn btn-vidro btn-sm" data-srv-opt="${optIdx}" ${isSolved ? 'disabled' : ''} style="text-align:left; justify-content:flex-start; padding:8px 12px; font-size:11.5px; border-radius:8px;">
      <b>${String.fromCharCode(65 + optIdx)})</b> ${opt.text}
    </button>
  `).join('');

  if (!isSolved) {
    optContainer.querySelectorAll('[data-srv-opt]').forEach(btn => {
      btn.onclick = () => {
        const oIdx = Number(btn.dataset.srvOpt);
        const chosen = puzzle.options[oIdx];
        if (chosen.correct) {
          devState.solvedServerPuzzles.push(puzzle.id);
          devState.money += puzzle.rewardMoney;
          changeReputation(puzzle.rewardRep);
          if (puzzle.rewardStack && devState.stackCapacity > 0) {
            devState.stackParts = Math.min(devState.stackCapacity, devState.stackParts + puzzle.rewardStack);
          }
          feedbackEl.innerHTML = `<span style="color:#34d399;">🎉 <b>Procedimento Correto!</b> ${puzzle.explanation} (+R$ ${puzzle.rewardMoney} | +${puzzle.rewardStack} Módulos)</span>`;
          showToast(`🗄️ Servidor Bare-Metal: Puzzle #${puzzle.num} reparado com sucesso! (+R$ ${puzzle.rewardMoney})`);
          addDevLog(`🗄️ <b>Servidor Bare-Metal:</b> Desafio #${puzzle.num} (${puzzle.title}) reparado com sucesso! (+R$ ${puzzle.rewardMoney}).`);
          renderAllUI();
          renderServerRackModal();
        } else {
          feedbackEl.innerHTML = `<span style="color:#ef4444;">❌ <b>Procedimento Incorreto!</b> Risco de corrupção ou danos de hardware. Tente outra opção.</span>`;
        }
      };
    });
  }
}

// ============================================================================
// LOJA & SETUP DEV
// ============================================================================
function openShopModal() {
  renderShopModal();
  document.getElementById('shop-modal').classList.add('open');
}

function renderShopModal() {
  document.getElementById('shop-money-display').textContent = `R$ ${devState.money.toLocaleString('pt-BR')}`;
  const grid = document.getElementById('shop-items-grid');
  if (!grid) return;

  grid.innerHTML = DEV_SHOP_CATALOG.map(item => {
    let isOwned = false;
    let isLocked = false;

    if (item.category === 'expansion') {
      isOwned = (devState.soloExpansionTier || 1) >= item.tier;
    } else if (item.category === 'workbench') {
      isOwned = (devState.workbenchLevel || 1) >= item.level;
    } else if (item.id === 'rack_refill') {
      isOwned = false;
    } else {
      isOwned = !!devState.upgrades[item.id];
    }

    const canAfford = devState.money >= item.price;

    return `
      <div class="action-card" style="display:flex; flex-direction:column; justify-content:space-between; cursor:default;">
        <div>
          <div class="action-card-title">
            <span>${item.name}</span>
            <b style="color:#4ade80;">R$ ${item.price.toLocaleString('pt-BR')}</b>
          </div>
          <div class="action-card-result">${item.desc}</div>
        </div>
        <div style="margin-top:12px;">
          ${isOwned
            ? '<button type="button" class="btn btn-sm btn-verde" disabled style="width:100%; opacity:0.85;">✅ Já Adquirido</button>'
            : `<button type="button" class="btn btn-sm btn-azul btn-buy-shop-item" data-id="${item.id}" ${canAfford ? '' : 'disabled'} style="width:100%;">
                ${canAfford ? 'Comprar Equipamento' : 'Saldo Insuficiente'}
              </button>`
          }
        </div>
      </div>
    `;
  }).join('');

  grid.querySelectorAll('.btn-buy-shop-item').forEach(btn => {
    btn.onclick = () => {
      const item = DEV_SHOP_CATALOG.find(x => x.id === btn.dataset.id);
      if (!item || devState.money < item.price) return;

      devState.money -= item.price;

      if (item.category === 'expansion') {
        setSoloExpansionTier(item.tier);
        devState.upgrades[item.id] = true;
      } else if (item.category === 'workbench') {
        devState.workbenchLevel = item.level;
        devState.upgrades[item.id] = true;
      } else if (item.id === 'rack_lvl1') {
        devState.upgrades.rack_lvl1 = true;
        devState.stackCapacity = 8;
        devState.stackParts = 8;
      } else if (item.id === 'rack_lvl2') {
        devState.upgrades.rack_lvl2 = true;
        devState.stackCapacity = 20;
        devState.stackParts = 20;
      } else if (item.id === 'rack_refill') {
        devState.stackParts = Math.min(devState.stackCapacity, devState.stackParts + 8);
      } else {
        devState.upgrades[item.id] = true;
      }

      devSolidWalls = buildDevSolidWalls();
      showToast(`🎉 ${item.name} instalado no seu estúdio com sucesso!`);
      addDevLog(`🛒 Compra realizada: <b>${item.name}</b>.`);
      renderAllUI();
      renderShopModal();
    };
  });
}

// ============================================================================
// HUD & ATUALIZAÇÕES VISUAIS
// ============================================================================
function callClientByIndex(idx) {
  const target = devCases[idx];
  if (!target || target.solved || target.leavingState) return;

  const currentAttended = devCases.find(c => c.walkingToDesk || c.arrivedAtDesk);
  if (currentAttended && currentAttended !== target) {
    showToast(`⚠️ Você já está atendendo ${currentAttended.clientName}! Vá até a Estação Dev.`);
    return;
  }

  if (target.arrivedAtDesk) {
    openDevWorkbenchModal();
    return;
  }

  if (target.walkingToDesk) {
    showToast(`🚶 ${target.clientName} já está a caminho da sua Bancada!`);
    return;
  }

  const cabine = DEV_ROOMS.find(r => r.id === 'dev_room_1') || DEV_ROOMS[0];
  const reception = DEV_ROOMS.find(r => r.id === 'reception') || DEV_ROOMS[1];
  const recDoorCenterX = reception.door.x + reception.door.w / 2;
  const cabDoorCenterX = cabine.door.x + cabine.door.w / 2;
  const deskX = cabine.x + 60;
  const deskY = 1005;
  const deskW = 320;
  const stoolX = deskX + deskW + 60;
  const stoolY = deskY + 95;

  target.waypoints = [
    { x: recDoorCenterX, y: Math.max(target.y, 1200) },
    { x: recDoorCenterX, y: 1040 },
    { x: recDoorCenterX, y: 880 },
    { x: cabDoorCenterX, y: 880 },
    { x: cabDoorCenterX, y: cabine.y + 70 },
    { x: stoolX, y: stoolY }
  ];
  target.walkingToDesk = true;
  target.insideReception = false;
  target.enteringReception = false;

  showToast(`📣 Chamando ${target.clientName} para sua Bancada Tech Lead!`);
  addDevLog(`📣 <b>${target.clientName}</b> chamado para atendimento na Cabine Dev #01.`);
  updateHUD();
}

function updateHUD() {
  const moneyEl = document.getElementById('hud-money');
  if (moneyEl) moneyEl.textContent = `R$ ${devState.money.toLocaleString('pt-BR')}`;

  const repEl = document.getElementById('hud-rep');
  const repFill = document.getElementById('hud-rep-fill');
  if (repEl) repEl.textContent = `${devState.rep}%`;
  if (repFill) repFill.style.width = `${devState.rep}%`;

  const failedEl = document.getElementById('hud-failed-count');
  if (failedEl) failedEl.textContent = `${devState.failedCount}`;

  const stackEl = document.getElementById('hud-stack-count');
  if (stackEl) {
    stackEl.textContent = devState.stackCapacity > 0 ? `${devState.stackParts}/${devState.stackCapacity} Módulos` : 'Sem Servidor';
  }

  const pCount = getConnectedPlayerCount();
  const currentTier = devState.soloExpansionTier || 1;

  // 1. Card Lateral: Expansão da Sede & Desbloqueios
  const hqBadge = document.getElementById('sidebar-hq-badge');
  if (hqBadge) {
    hqBadge.textContent = `Oficina: ${pCount}/4 Técnicos · ${currentTier} Cabines`;
  }
  const hqProgress = document.getElementById('sidebar-hq-progress-text');
  if (hqProgress) {
    const speedMult = (1.0 + (pCount - 1) * 0.90).toFixed(1);
    hqProgress.innerHTML = `Sessão: <b>${pCount}/5 Devs</b> · Dificuldade: <b>Nível ${pCount}</b> · Espera: <b>${speedMult}x mais rápida</b>`;
  }
  const hqFill = document.getElementById('sidebar-hq-fill');
  if (hqFill) {
    hqFill.style.width = `${Math.min(100, Math.round((currentTier / 5) * 100))}%`;
  }
  const nextUnlock = document.getElementById('sidebar-next-unlock-hint');
  if (nextUnlock) {
    const remaining = Math.max(0, 4 - pCount);
    nextUnlock.textContent = `Espaço para +${remaining} técnico(s)! (Limite de 4 jogadores no modelo focado atual)`;
  }

  // 2. Card Lateral: Reputação da Operação
  const repStatus = document.getElementById('sidebar-rep-status');
  if (repStatus) {
    const qual = devState.rep >= 75 ? '🌟 Excelente' : (devState.rep >= 50 ? '⭐ Boa' : (devState.rep >= 30 ? '⚠️ Atenção' : '🚨 Crítica'));
    repStatus.textContent = `${qual} (${devState.rep}%)`;
  }
  const sidebarRepFill = document.getElementById('sidebar-rep-fill');
  if (sidebarRepFill) {
    sidebarRepFill.style.width = `${devState.rep}%`;
  }

  // 3. Card Lateral: Fila Perpétua (Solo & Co-op)
  const queueList = document.getElementById('client-queue-list');
  const activeCasesWithIdx = devCases
    .map((c, originalIdx) => ({ c, originalIdx }))
    .filter(item => !item.c.solved && !item.c.leavingState);

  const queueCountBadge = document.getElementById('queue-count-badge');
  if (queueCountBadge) {
    const speedMult = (1.0 + (pCount - 1) * 0.90).toFixed(1);
    queueCountBadge.innerHTML = `${activeCasesWithIdx.length} aguardando <span style="font-size:10px; background:rgba(239, 68, 68, 0.18); color:#ef4444; border:1px solid #ef4444; padding:1px 5px; border-radius:4px; margin-left:4px;" title="Velocidade de espera com ${pCount} Dev(s) na operação">⚡ ${speedMult}x vel.</span>`;
  }

  if (queueList) {
    queueList.innerHTML = activeCasesWithIdx.map(({ c, originalIdx }, displayIdx) => {
      const isAttended = c.arrivedAtDesk || c.walkingToDesk;
      const barColor = c.patience > 60 ? '#10b981' : (c.patience > 35 ? '#f59e0b' : '#ef4444');
      const numStr = String(displayIdx + 1).padStart(2, '0');

      // Tag de especialidade/categoria compatível com o design do chamado
      let tagText = 'HARDWARE';
      let tagClass = 'queue-tag-amber';
      if (c.specialDetail && c.specialDetail.badge) {
        tagText = c.specialDetail.badge;
        tagClass = c.specialDetail.tagClass === 'tag-urgent' ? 'queue-tag-red' : 'queue-tag-purple';
      } else if (c.categoryPreference === 'backend_api') {
        tagText = 'LIMPEZA LÓGICA';
        tagClass = 'queue-tag-blue';
      } else if (c.categoryPreference === 'frontend_mobile') {
        tagText = 'OTIMIZAÇÃO';
        tagClass = 'queue-tag-green';
      } else if (c.categoryPreference === 'cloud_devops') {
        tagText = 'CLOUD / REDES';
        tagClass = 'queue-tag-purple';
      }

      return `
        <div class="queue-client-ticket ${isAttended ? 'active' : ''}" data-case-index="${originalIdx}">
          <div class="queue-client-avatar">
            ${renderChibiSVG(c.look, 'sm')}
          </div>
          <div class="queue-client-info">
            <div class="queue-client-top">
              <span class="queue-client-name">Chamado #${numStr} · ${c.clientName}</span>
              <span class="queue-client-tag ${tagClass}">${tagText}</span>
            </div>
            <div class="queue-client-device">${c.device || c.company || 'Servidor Compacto'}</div>
            <div class="queue-patience-track" title="Paciência: ${Math.round(c.patience)}%">
              <div class="queue-patience-fill" style="width:${Math.round(c.patience)}%; background:${barColor};"></div>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Listener de clique para chamar ou atender o cliente
    queueList.querySelectorAll('.queue-client-ticket').forEach(el => {
      el.addEventListener('click', () => {
        const cIdx = Number(el.dataset.caseIndex);
        callClientByIndex(cIdx);
      });
    });
  }

  // 4. Card Lateral: Técnicos nas Cabines (Você + 4 Devs Online)
  const teamList = document.getElementById('team-list');
  if (teamList) {
    const members = devState.players.map((p, idx) => {
      const isYou = (idx === devState.mySlotIndex);
      return {
        name: isYou ? (p.name + ' (Você)') : p.name,
        role: p.connected ? p.role : ('Estação Dev #' + String(idx + 1).padStart(2, '0') + ' · Código ' + devState.roomCode),
        cabine: 'Estação Dev #' + String(idx + 1).padStart(2, '0'),
        connected: p.connected,
        look: p.look
      };
    });

    teamList.innerHTML = members.map(m => `
      <div class="team-member-card" style="opacity: ${m.connected ? '1' : '0.62'};">
        <div class="team-member-avatar">
          ${renderChibiSVG(m.look, 'sm')}
        </div>
        <div class="team-member-info">
          <h4>${m.name}</h4>
          <p>${m.connected ? (`${m.role} · <span style="color:#10b981; font-weight:800;">● Online</span>`) : m.role}</p>
          <p style="font-size:10px; color:#0284c7; font-weight:800; margin-top:1px;">${m.cabine}</p>${devState.mySlotIndex === 0 && m.connected && idx !== 0 ? `<button type="button" class="btn btn-coral btn-xs" onclick="kickDevPlayer(${idx})" style="font-size:10px; padding:2px 7px; margin-top:3px; border-radius:6px; font-weight:800;" title="Demitir e expulsar desenvolvedor da Software House">🚫 Demitir</button>` : ''}
        </div>
        <div>
          ${m.connected ? '<span class="team-status-pill team-status-active">● Online</span>' : '<span class="team-status-pill team-status-free">Livre</span>'}
        </div>
      </div>
    `).join('');
  }

  // Atualização dos indicadores de código e contadores no HUD
  const dispCode = document.getElementById('display-room-code');
  if (dispCode) dispCode.textContent = devState.roomCode;
  const sessPill = document.getElementById('session-code-pill');
  if (sessPill) sessPill.textContent = 'Sala: ' + devState.roomCode;
  const lobCode = document.getElementById('lobby-current-code');
  if (lobCode) lobCode.textContent = devState.roomCode;

  const teamEl = document.getElementById('session-team-counter');
  if (teamEl) {
    if (pCount === 1) {
      teamEl.innerHTML = '👤 <b>1 Desenvolvedor</b> (Tech Lead Solo)';
      teamEl.className = 'team-counter-badge solo';
    } else {
      teamEl.innerHTML = '👥 <b>' + pCount + '/5 Devs Online</b> (Dev Squad)';
      teamEl.className = 'team-counter-badge full';
    }
  }

  // 5. Card Lateral: Rádio & Figurinhas - inicializa listeners dos botões se necessário
  setupStickerButtons();


}

let stickerButtonsWired = false;
function setupStickerButtons() {
  if (stickerButtonsWired) return;
  const stickerBtns = document.querySelectorAll('.sticker-btn');
  if (stickerBtns.length === 0) return;
  stickerButtonsWired = true;

  stickerBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const stickerText = btn.dataset.sticker || '💬 Figurinha';
      const you = devState.players[devState.mySlotIndex];
      if (you) {
        you.bubble = stickerText;
        you.bubbleTimer = 240;
      }
      addChatMessage('Você', stickerText);
      if (devState.networkMode === 'online') {
        broadcastDevNet({
          type: 'chat_sticker',
          peerId: devState.myPeerId,
          slot: devState.mySlotIndex,
          author: you?.name || 'Dev',
          text: stickerText
        });
      }
      showToast('💬 Figurinha enviada: ' + stickerText);
    });
  });
}

function renderAllUI() {
  updateHUD();
}

function showToast(msg) {
  const t = document.getElementById('toast-feedback');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => t.classList.remove('show'), 3800);
}

function addDevLog(html) {
  const logEl = document.getElementById('dev-chat-log');
  if (!logEl) return;
  const line = document.createElement('div');
  line.innerHTML = `[${new Date().toLocaleTimeString()}] ${html}`;
  logEl.appendChild(line);
  logEl.scrollTop = logEl.scrollHeight;
}

// ============================================================================
// EXPANSÃO DINÂMICA DA CABINE E ESTRUTURAS ADJACENTES
// ============================================================================
function setSoloExpansionTier(tier) {
  devState.soloExpansionTier = tier;
  rebuildOfficeLayout(tier);

  document.querySelectorAll('#solo-tier-bar [data-solo-tier]').forEach(b => {
    b.classList.toggle('active', Number(b.dataset.soloTier) === tier);
  });

  const names = {
    1: 'Garagem Startup',
    2: 'Estúdio Dev Ampliado',
    3: 'Agência Tech VIP',
    4: 'Hub de Inovação',
    5: 'Mega Tech Campus'
  };

  const hqBadge = document.getElementById('sidebar-hq-badge');
  if (hqBadge) hqBadge.textContent = `Nível ${tier} · ${names[tier]}`;

  const hqProg = document.getElementById('sidebar-hq-progress-text');
  if (hqProg) hqProg.innerHTML = `Sede: <b>${names[tier]}</b> · Capacidade: <b>${tier * 4} Clientes</b>`;

  const hqFill = document.getElementById('sidebar-hq-fill');
  if (hqFill) hqFill.style.width = `${tier * 20}%`;

  // Se o player estiver dentro de uma parede após a expansão, ajusta sua posição
  const you = devState.players[devState.mySlotIndex];
  if (you && !canMoveTo(you.x, you.y)) {
    you.x = 450;
    you.y = 1260;
    you.waypoints = [];
  }

  showToast(`🏗️ Expansão Ativada (${tier}x): ${names[tier]}! Cabine e estruturas ampliadas.`);
  addDevLog(`🏗️ Software House expandida para <b>Nível ${tier}x (${names[tier]})</b>!`);
}

// ============================================================================
// MODO TELA EXPANDIDA (PANORAMA AMPLO)
// ============================================================================
function toggleEnlargedScreen(forceState) {
  const isEnlarged = typeof forceState === 'boolean'
    ? forceState
    : !document.body.classList.contains('enlarged-screen');

  document.body.classList.toggle('enlarged-screen', isEnlarged);

  const btnTop = document.getElementById('btn-toggle-enlarged-screen');
  const btnOverlay = document.getElementById('btn-overlay-enlarged');

  const label = isEnlarged ? '🖥️ Modo Normal [F]' : '🖥️ Tela Expandida [F]';
  if (btnTop) {
    btnTop.textContent = label;
    btnTop.classList.toggle('btn-amarelo', isEnlarged);
    btnTop.classList.toggle('btn-azul', !isEnlarged);
  }
  if (btnOverlay) {
    btnOverlay.textContent = label;
    btnOverlay.classList.toggle('btn-amarelo', isEnlarged);
    btnOverlay.classList.toggle('btn-azul', !isEnlarged);
  }

  showToast(isEnlarged ? '🖥️ Modo Tela Expandida Ativado! (Pressione F para alternar)' : '🖥️ Modo de Tela Normal Restaurado.');
}

function updateCurrentRoomPill(you) {
  const pill = document.querySelector('#current-room-pill span');
  if (!pill || !you) return;
  const cabine = DEV_ROOMS.find(r => r.id === 'dev_room_1') || DEV_ROOMS[0];
  const reception = DEV_ROOMS.find(r => r.id === 'reception') || DEV_ROOMS[1];

  if (cabine && you.x >= cabine.x && you.x <= cabine.x + cabine.w && you.y >= cabine.y) {
    pill.textContent = 'Mega Cabine Dev #01 (Tech Lead)';
  } else if (reception && you.x >= reception.x && you.x <= reception.x + reception.w && you.y >= reception.y) {
    pill.textContent = 'Recepção Executiva & Lounge';
  } else if (you.x >= 2350 && you.y >= 660 && you.y <= 910) {
    pill.textContent = 'Entrada de Clientes (Catracas)';
  } else {
    const upper = DEV_UPPER_ROOMS.find(r => you.x >= r.x && you.x <= r.x + r.w && you.y >= r.y && you.y <= r.y + r.h);
    if (upper) {
      pill.textContent = upper.name;
    } else {
      pill.textContent = 'Corredor Central & Lounge Tech';
    }
  }
}

// ============================================================================
// INICIALIZAÇÃO GERAL E EVENT LISTENERS DO JOGO
// ============================================================================
window.addEventListener('DOMContentLoaded', () => {
  loadDevGameState();
  try {
    const rawUser = localStorage.getItem('omnivoid_user');
    if (rawUser) {
      const u = JSON.parse(rawUser);
      if (u && (u.nickname || u.name)) {
        devState.players[0].name = (u.nickname || u.name) + ' (Tech Lead)';
      }
    }
  } catch(e){}
  setInterval(() => {
    if (typeof PlantaoDevProfile !== 'undefined' && PlantaoDevProfile.recordSeconds) {
      PlantaoDevProfile.recordSeconds(1);
    }
  }, 1000);

  initSoftwareCanvas();
  renderAllUI();

  // Botões de Interação no Canvas
  document.getElementById('btn-interact-world')?.addEventListener('click', () => handleInteractWorld());
  document.getElementById('btn-call-next')?.addEventListener('click', () => callNextClientToDesk());
  document.getElementById('btn-goto-cloud-rack')?.addEventListener('click', () => openCloudNOCModal());
  document.getElementById('btn-open-cloud-noc')?.addEventListener('click', () => openCloudNOCModal());
  document.getElementById('btn-open-shop')?.addEventListener('click', () => openShopModal());
  document.getElementById('btn-open-shop-2')?.addEventListener('click', () => openShopModal());
  document.getElementById('btn-toggle-enlarged-screen')?.addEventListener('click', () => toggleEnlargedScreen());
  document.getElementById('btn-overlay-enlarged')?.addEventListener('click', () => toggleEnlargedScreen());

  // Fechamento de Modais
  document.getElementById('btn-close-workbench')?.addEventListener('click', () => {
    document.getElementById('dev-workbench-modal').classList.remove('open');
  });
  document.getElementById('btn-close-cloud-noc')?.addEventListener('click', () => {
    document.getElementById('cloud-noc-modal').classList.remove('open');
  });
  document.getElementById('btn-close-shop')?.addEventListener('click', () => {
    document.getElementById('shop-modal').classList.remove('open');
  });

  // Reiniciar jogo após Game Over
  document.getElementById('btn-restart-software-game')?.addEventListener('click', () => {
    restartSoftwareGameSession();
  });

  // Abas de Atendimento Dev
  document.querySelectorAll('.step-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const targetTab = tab.dataset.tab;
      const c = devCases[devState.activeCaseIndex];
      if (targetTab === 'coding' && c && !c.diagnosisApproved) {
        showToast('🔒 Escopo obrigatório! Aprove a arquitetura na Etapa 3 antes de codificar.');
        return;
      }
      devState.activeTab = targetTab;
      renderDevWorkbenchModal();
    });
  });

  // Entregar Projeto Como Está
  document.getElementById('btn-cancel-project-as-is')?.addEventListener('click', () => {
    const c = devCases[devState.activeCaseIndex];
    if (!c) return;
    c.leavingState = 'leaving_angry';
    c.arrivedAtDesk = false;
    c.walkingToDesk = false;
    c.insideReception = false;
    c.enteringReception = false;
    const cabine = DEV_ROOMS.find(r => r.id === 'dev_room_1') || DEV_ROOMS[0];
    const cabDoorCenterX = cabine.door.x + cabine.door.w / 2;
    c.waypoints = [
      { x: cabDoorCenterX, y: cabine.y + 80 },
      { x: cabDoorCenterX, y: 880 },
      { x: 2350, y: 880 },
      { x: 2460, y: 780 }
    ];
    document.getElementById('dev-workbench-modal').classList.remove('open');
    changeReputation(-2);
    showToast(`📦 Demanda cancelada na bancada (-2% de Reputação).`);
    addDevLog(`📦 Demanda de <b>${c.clientName}</b> encerrada sem conclusão.`);
    const nextIdx = devCases.findIndex(x => !x.solved && !x.leavingState);
    if (nextIdx !== -1) devState.activeCaseIndex = nextIdx;
    renderAllUI();
  });

  // Portes de Teste da Software House (1x a 5x)
  document.querySelectorAll('#solo-tier-bar [data-solo-tier]').forEach(btn => {
    btn.addEventListener('click', () => {
      const tier = Number(btn.dataset.soloTier);
      setSoloExpansionTier(tier);
    });
  });

  // Copiar código de convite
  
  // MULTIPLAYER & SALAS DO PLANTÃO DEV
  // 1. Alternador de Modo (Solo / Online)
  document.getElementById('btn-mode-solo')?.addEventListener('click', () => {
    devState.networkMode = 'solo';
    document.getElementById('btn-mode-solo')?.classList.add('active');
    document.getElementById('btn-mode-online')?.classList.remove('active');
    showToast('🏠 Modo Dev Solo ativado.');
    renderAllUI();
  });

  document.getElementById('btn-mode-online')?.addEventListener('click', () => {
    initDevMultiplayerRoom(devState.roomCode);
  });

  // 2. Painel e Modais de Sala
  document.getElementById('btn-open-lobby-modal')?.addEventListener('click', () => {
    const m = document.getElementById('dev-lobby-modal');
    if (m) {
      m.classList.add('open');
      const cur = document.getElementById('lobby-current-code');
      if (cur) cur.textContent = devState.roomCode;
    }
  });

  document.getElementById('btn-close-lobby-modal')?.addEventListener('click', () => {
    document.getElementById('dev-lobby-modal')?.classList.remove('open');
  });

  document.getElementById('btn-lobby-enter-solo')?.addEventListener('click', () => {
    devState.networkMode = 'solo';
    document.getElementById('btn-mode-solo')?.classList.add('active');
    document.getElementById('btn-mode-online')?.classList.remove('active');
    document.getElementById('dev-lobby-modal')?.classList.remove('open');
    showToast('🏠 Jogando no Modo Solo.');
    renderAllUI();
  });

  document.getElementById('btn-lobby-enter-online')?.addEventListener('click', () => {
    initDevMultiplayerRoom(devState.roomCode);
    document.getElementById('dev-lobby-modal')?.classList.remove('open');
  });

  document.getElementById('btn-lobby-new-code')?.addEventListener('click', () => {
    const newCode = 'DEV-' + Math.floor(1000 + Math.random() * 9000);
    initDevMultiplayerRoom(newCode);
    showToast('🔄 Nova sala criada com o código [' + newCode + ']!');
  });

  const copyRoomAction = () => {
    navigator.clipboard?.writeText(devState.roomCode);
    showToast('📋 Código [' + devState.roomCode + '] copiado! Envie para até 4 colegas.');
  };
  document.getElementById('btn-copy-code')?.addEventListener('click', copyRoomAction);
  document.getElementById('btn-lobby-copy-code')?.addEventListener('click', copyRoomAction);
  document.getElementById('btn-copy-invite-code')?.addEventListener('click', copyRoomAction);

  // Entrar com código digitado
  const joinByInputCode = (inputId) => {
    const input = document.getElementById(inputId);
    if (!input) return;
    const val = input.value.trim().toUpperCase();
    if (!val || val.length < 3) {
      showToast('⚠️ Digite um código de sala válido (ex: DEV-1234)!');
      return;
    }
    input.value = '';
    initDevMultiplayerRoom(val);
    document.getElementById('dev-lobby-modal')?.classList.remove('open');
  };

  document.getElementById('btn-join-room')?.addEventListener('click', () => joinByInputCode('input-join-code'));
  document.getElementById('input-join-code')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') joinByInputCode('input-join-code');
  });

  document.getElementById('btn-lobby-join-btn')?.addEventListener('click', () => joinByInputCode('input-lobby-join-code'));
  document.getElementById('input-lobby-join-code')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') joinByInputCode('input-lobby-join-code');
  });

  // Simular +1 Dev Online para testes locais imediatos
  document.getElementById('btn-simulate-partner')?.addEventListener('click', () => {
    simulateDevPartner();
  });

  document.getElementById('btn-copy-invite-code')?.addEventListener('click', () => {
    navigator.clipboard?.writeText(devState.roomCode);
    showToast(`📋 Código [${devState.roomCode}] copiado! Envie aos seus colegas desenvolvedores.`);
  });
});
