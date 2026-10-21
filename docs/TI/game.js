// ============================================================================
// PLANTÃO TI v0.9: SEDE EXPANSÍVEL (5➔10➔15➔20 SALAS ESPAÇADAS) + 18 PUZZLES CO-OP (6x 2P, 6x 3P, 6x 4P)
// ============================================================================

const STOCK_PARTS = [
  { id: 'cpu_ram',           shortName: '❄️ Pasta & RAM',      name: '❄️ Kit Pasta Térmica Prata & RAM DDR5',         desc: 'Resfriar CPU superaquecendo e ativar Dual-Channel (A2+B2).' },
  { id: 'rj45',              shortName: '🔌 Kit RJ45',         name: '🔌 Alicate & Conectores Cat6 RJ45',             desc: 'Crimpar os 8 fios do par trançado no padrão T568B.' },
  { id: 'psu_wires',         shortName: '⚡ Fonte ATX',        name: '⚡ Fonte Modular 1000W & Cabos ATX',            desc: 'Conectar os barramentos 24-Pin, EPS 12V, PCIe e SATA.' },
  { id: 'gpu_swap',          shortName: '🎮 GPU PCIe',         name: '🎮 Placa de Vídeo RTX & Trava PCIe x16',        desc: 'Substituir GPU com artefatos de VRAM no slot PCIe x16.' },
  { id: 'fpanel_wires',      shortName: '🔘 Fios F_PANEL',     name: '🔘 Chicote Painel Frontal (JFP1 / F_PANEL)',    desc: 'Ligar POWER SW, RESET SW, POWER LED e HDD LED na placa-mãe.' },
  { id: 'ssd_clone',         shortName: '💽 SSD NVMe',         name: '💽 SSD NVMe M.2 Gen4 & Clonadora SMART',        desc: 'Instalar SSD M.2 e clonar partições de HD com Bad Blocks.' },
  { id: 'malware',           shortName: '🛡️ Rescue USB',       name: '🛡️ Pen Drive Forense Anti-Malware',             desc: 'Eliminar processos de Cryptominer e Keylogger da RAM.' },
  { id: 'logic',             shortName: '🧮 Portas Lógicas',   name: '🧮 Analisador Digital & Portas Lógicas',        desc: 'Configurar chaves binárias AND/NOT para liberar POWER_GOOD = 1.' },
  { id: 'mobo_build',        shortName: '🟩 Montar Mobo',      name: '🟩 Kit Placa-Mãe Z790, 9 Standoffs & Core i9',  desc: 'Rosquear os 9 espaçadores no gabinete, encaixar I/O Shield e CPU.' },
  { id: 'watercooler_wires', shortName: '🌊 WaterCooler',      name: '🌊 WaterCooler AIO 360mm & Hub ARGB 5V',        desc: 'Conectar fios da Bomba AIO, Fans PWM, ARGB 5V e USB LCD.' },
  { id: 'sata_raid_wires',   shortName: '🗄️ Cabos RAID',       name: '🗄️ Chicote SATA3 6Gbps & Controladora RAID',    desc: 'Conectar cabos de dados e energia SATA da matriz RAID-1.' },
  { id: 'patch_panel_wires', shortName: '🖧 Patch Panel',      name: '🖧 Patch Cords Cat6A & Patch Panel 24p',        desc: 'Conectar uplinks das VLANs (WAN, Financeiro, VoIP e DB) no Rack.' },
  { id: 'audio_usb_wires',   shortName: '🎧 USB & Áudio',      name: '🎧 Chicotes Internos HD_AUDIO, USB 3.2 & USB-C',desc: 'Conectar cabos frontais de Áudio, USB 3.0 19-Pinos e USB-C.' },
  { id: 'gpu_12vhpwr',       shortName: '🔥 Cabo 12VHPWR',     name: '🔥 Calibrador 12VHPWR 600W (RTX 4090)',         desc: 'Calibrar folga 0mm, tensão 12.0V e curva de fan da GPU 600W.' },
  { id: 'cmos_bios',         shortName: '🔋 BIOS & CR2032',    name: '🔋 Bateria CR2032 3V & Gravador BIOS Flashback', desc: 'Trocar bateria CMOS e executar comandos de gravação da ROM.' },
  { id: 'vrm_soldering',     shortName: '🛠️ Solda VRM',        name: '🛠️ Estação de Solda SMD 380°C & MOSFETs 90A',   desc: 'Localizar e substituir os 4 MOSFETs em curto na matriz da placa-mãe.' },
  { id: 'fiber_splice',      shortName: '💎 Fusão Fibra',      name: '💎 Máquina de Fusão Óptica X/Y & SFP+ 10G',     desc: 'Alinhar os eixos X e Y da fibra óptica em 0µm e disparar fusão.' },
  { id: 'dual_cpu_server',   shortName: '🖥️ Dual-Xeon Mobo',   name: '🖥️ Placa-Mãe Servidor Dual-Socket & RAM ECC',   desc: 'Montar 2 processadores Xeon, duplo cabo EPS 12V e 8 bancos ECC.' },
  { id: 'dust_cleaner',      shortName: '💨 Soprador & Pincel',  name: '💨 Kit Soprador de Ar & Pincel Antiestático',     desc: 'Limpeza de pó, teias de aranha, sujeira e desobstrução de coolers.' },
  { id: 'software_toolkit',  shortName: '💻 Toolkit Software',   name: '💻 Suite Forense & Otimização de Software',       desc: 'Eliminação de malwares, trojans, cookies, popups e desfragmentador.' },
  // 3 KITS COOPERATIVOS ESPECIAIS (2, 3 e 4 PESSOAS):
  { id: 'coop_2p',           shortName: '🤝 Kit Co-op 2P',     name: '🤝 Maleta Sincronizada p/ 2 Técnicos (6 Puzzles)', desc: 'Ferramental p/ os 6 Puzzles Cooperativos de 2 Pessoas simultâneas.' },
  { id: 'coop_3p',           shortName: '🤝 Kit Co-op 3P',     name: '🤝 Maleta Sincronizada p/ 3 Técnicos (6 Puzzles)', desc: 'Ferramental p/ os 6 Puzzles Cooperativos de 3 Pessoas simultâneas.' },
  { id: 'coop_4p',           shortName: '🤝 Kit Co-op 4P',     name: '🤝 Maleta Sincronizada p/ 4 Técnicos (6 Puzzles)', desc: 'Ferramental p/ os 6 Puzzles Cooperativos de 4 Pessoas simultâneas.' }
];

// ============================================================================
// ITENS DA LOJA DE UPGRADES, RACK DE PEÇAS E MÓVEIS
// ============================================================================

// ============================================================================
// CARREGAMENTO DOS ASSETS GRÁFICOS (BANCADA E CAFETEIRA)
// ============================================================================
const ASSET_IMAGES = {
  workbench_lvl1: typeof Image !== 'undefined' ? new Image() : null,
  workbench_lvl2: typeof Image !== 'undefined' ? new Image() : null,
  workbench_lvl3: typeof Image !== 'undefined' ? new Image() : null,
  workbench_lvl4: typeof Image !== 'undefined' ? new Image() : null,
  coffee_machine: typeof Image !== 'undefined' ? new Image() : null,
  shelves_sm_strip: typeof Image !== 'undefined' ? new Image() : null,
  shelves_lg_strip: typeof Image !== 'undefined' ? new Image() : null,
  reception_counter: typeof Image !== 'undefined' ? new Image() : null,
  waiting_sofa: typeof Image !== 'undefined' ? new Image() : null,
  client_stools: typeof Image !== 'undefined' ? new Image() : null,
  server_racks_strip: typeof Image !== 'undefined' ? new Image() : null,
  parts_racks_strip: typeof Image !== 'undefined' ? new Image() : null,
  sofa_horizontal: typeof Image !== 'undefined' ? new Image() : null,
  decor_plant_tall: typeof Image !== 'undefined' ? new Image() : null,
  decor_plant_small: typeof Image !== 'undefined' ? new Image() : null,
  decor_recycle_bin: typeof Image !== 'undefined' ? new Image() : null,
  ac_white_split: typeof Image !== 'undefined' ? new Image() : null,
  ac_black_split: typeof Image !== 'undefined' ? new Image() : null,
  ac_tower_floor: typeof Image !== 'undefined' ? new Image() : null
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
  ASSET_IMAGES.parts_racks_strip.src = 'assets/parts_racks_strip.png';
  ASSET_IMAGES.sofa_horizontal.src = 'assets/sofa_horizontal.png';
  ASSET_IMAGES.decor_plant_tall.src = 'assets/decor_plant_tall.png';
  ASSET_IMAGES.decor_plant_small.src = 'assets/decor_plant_small.png';
  ASSET_IMAGES.decor_recycle_bin.src = 'assets/decor_recycle_bin.png';
  ASSET_IMAGES.ac_white_split.src = 'assets/ac_white_split.png';
  ASSET_IMAGES.ac_black_split.src = 'assets/ac_black_split.png';
  ASSET_IMAGES.ac_tower_floor.src = 'assets/ac_tower_floor.png';
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


// Bounding box do Sofá com Mesa da Área de Espera
const SOFA_CROP = { sx: 10, sy: 7, sw: 158, sh: 248 };
// Bounding box do Sofá Horizontal (sala de trabalho do jogador - Imagem 2)
const SOFA_HORIZONTAL_CROP = { sx: 8, sy: 18, sw: 247, sh: 158 };

// Bounding boxes dos enfeites decorativos de parede (Imagens 3, 4 e 5)
const DECOR_PLANT_TALL_CROP  = { sx: 4, sy: 6, sw: 79, sh: 136 };
const DECOR_PLANT_SMALL_CROP = { sx: 5, sy: 11, sw: 61, sh: 100 };
const DECOR_BIN_CROP         = { sx: 1, sy: 14, sw: 71, sh: 106 };
// Bounding boxes dos 3 modelos de Ar-Condicionado
const AC_WHITE_CROP = { sx: 8, sy: 6, sw: 269, sh: 101 };
const AC_BLACK_CROP = { sx: 6, sy: 8, sw: 338, sh: 116 };
const AC_TOWER_CROP = { sx: 5, sy: 14, sw: 109, sh: 253 };



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

// Bounding box do Balcão de Recepção (reception_counter.png)
const RECEPTION_COUNTER_CROP = { sx: 8, sy: 43, sw: 272, sh: 124 };

// Bounding boxes dos 7 modelos de Estantes de Peças (parts_racks_strip.png)
const PARTS_RACK_SPANS = [
  { sx: 18,  sy: 0, sw: 136, sh: 146 },  // 0: Caixas e cooler/ventoinha
  { sx: 167, sy: 9, sw: 131, sh: 139 },  // 1: Placas-mãe e gabinetes
  { sx: 310, sy: 0, sw: 134, sh: 143 },  // 2: Notebooks corporativos
  { sx: 457, sy: 8, sw: 139, sh: 136 },  // 3: Monitores duplos
  { sx: 611, sy: 9, sw: 133, sh: 139 },  // 4: Mouses, teclado e caixas
  { sx: 758, sy: 9, sw: 137, sh: 139 },  // 5: Memórias e gabinetes
  { sx: 907, sy: 7, sw: 109, sh: 139 }   // 6: Gaveteiro organizador de componentes
];


function generateSessionShelfVariants() {
  const serverRackCount = (Math.random() < 0.5) ? 3 : 4;
  const shuffledServer = [0, 1, 2, 3, 4, 5, 6, 7].sort(() => Math.random() - 0.5);
  const shuffledParts = [0, 1, 2, 3, 4, 5, 6].sort(() => Math.random() - 0.5);
  const decorPool = ['plant_tall', 'plant_small', 'recycle_bin', 'plant_tall', 'plant_small', 'recycle_bin', 'plant_tall'];
  const shuffledDecor = decorPool.sort(() => Math.random() - 0.5);

  state.sessionShelfVariants = {
    sm: [0, 1, 2, 3, 4, 5].sort(() => Math.random() - 0.5),
    lg: [0, 1, 2, 3, 4, 5, 6].sort(() => Math.random() - 0.5),
    serverRacks: shuffledServer.slice(0, serverRackCount),
    partsRacks: [shuffledParts[0], shuffledParts[1]],
    rackA: shuffledServer[0],
    rackB: shuffledServer[1],
    mainStool: Math.floor(Math.random() * 3),
    stationStools: [Math.floor(Math.random() * 3), Math.floor(Math.random() * 3), Math.floor(Math.random() * 3)],
    decorSelections: shuffledDecor
  };
}

const SHOP_CATALOG = [
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
];

const ANGRY_INSULTS = [
  '🤬 QUE DEMORA! Meu servidor de produção está parado!',
  '🤬 Vocês são engenheiros de TI ou tartarugas de crachá?!',
  '🤬 Meu cluster tá perdendo dinheiro nessa fila!!',
  '🤬 Vou cancelar o contrato de SLA! Assistência lenta demais!'
];

const LEAVE_ANGRY_INSULTS = [
  '🤬 ESTOUROU O SLA! Vou levar minha infraestrutura pra concorrência! Multa de -R$ 350!',
  '🤬 TCHAU! Cansei de esperar! Vocês perderam um cliente corporativo!'
];

const IMPATIENT_QUOTES = [
  '😤 Meu sistema crítico está aguardando bancada!',
  '🙄 Algum técnico pode puxar meu chamado?',
  '⏳ Cuidado com o prazo do SLA!'
];

const PLAYER_COLORS = [
  '#1fa6b8', '#f28649', '#8c6fd1', '#4bb56b', '#e5534b',
  '#3b82f6', '#d97706', '#ec4899', '#0d9488', '#6366f1',
  '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4',
  '#84cc16', '#f97316', '#14b8a6', '#a855f7', '#eab308'
];
const SKIN_COLORS = ['#ffdbb5', '#f3c19d', '#d89b72', '#c68b59', '#ffe4c4'];
const HAIR_COLORS = ['#2c1e18', '#6b2737', '#d98a2b', '#1a1a24', '#1d4ed8', '#4a2c11', '#7f8c8d', '#b45309'];

// ============================================================================
// COORDENADAS DAS CABINES ESPAÇADAS (135PX ENTRE CABINES HORIZONTAL E 185PX VERTICAL!)
// ============================================================================
// Organização em blocos de 5 salas conforme a Sede cresce (5 -> 10 -> 15 -> 20):
// - Nível 1 (Salas #01 a #05): Fileira 0, Colunas 0..4
// - Nível 2 (Salas #06 a #10): Fileira 1, Colunas 0..4
// - Nível 3 (Salas #11 a #15): Fileira 0, Colunas 5..9
// - Nível 4 (Salas #16 a #20): Fileira 1, Colunas 5..9
function getSmallRoomRect(slotIdx) {
  let row = 0;
  let col = 0;
  if (slotIdx < 5) {
    row = 0;
    col = slotIdx;
  } else if (slotIdx < 10) {
    row = 1;
    col = slotIdx - 5;
  } else if (slotIdx < 15) {
    row = 0;
    col = (slotIdx - 10) + 5;
  } else {
    row = 1;
    col = (slotIdx - 15) + 5;
  }

  const w = 240;
  const h = 210;
  const gapX = 135; // 135px livres entre cada cabine para passar com total folga!
  const gapY = 185; // 185px de avenida livre entre a Fileira 1 e a Fileira 2!
  const x = 140 + col * (w + gapX); // pitchX = 375px
  const y = 100 + row * (h + gapY); // row 0: y=100..310 | row 1: y=495..705

  return {
    x, y, w, h, row, col,
    streetX: x + w + Math.round(gapX / 2), // Centro exato da rua vertical ao lado da cabine
    doorInside: { x: x + w / 2, y: y + h - 38 },
    doorOutside: { x: x + w / 2, y: y + h + 48 },
    spawnX: x + w / 2 - 20,
    spawnY: y + 130,
    chairX: x + w - 64,
    chairY: y + 112
  };
}

function createInitialPlayers20() {
  return Array.from({ length: 20 }).map((_, idx) => {
    const r = getSmallRoomRect(idx);
    const numStr = String(idx + 1).padStart(2, '0');

    // Cabine #09 (slot 8) é permanentemente o Rack Central de Infraestrutura & NOC!
    if (idx === 8) {
      return {
        slot: idx,
        id: 'central_rack_noc',
        peerId: null,
        name: '🗄️⚡ Rack Central (NOC)',
        role: 'Infraestrutura NOC · Cabine #09',
        connected: false,
        isLocal: false,
        bubble: null,
        bubbleTimer: 0,
        x: r.doorInside.x,
        y: r.doorInside.y,
        waypoints: [],
        speed: 0,
        radius: 14,
        look: {
          skin: '#cbd5e1',
          hair: '#0f172a',
          shirt: '#0284c7',
          glasses: false,
          headset: true,
          mood: 'happy'
        }
      };
    }

    const isOwner = (idx === 0);
    const upperCol = (idx - 1) % 3;
    const defaultX = isOwner ? 210 : (255 + upperCol * 370);
    const defaultY = isOwner ? 720 : 220;

    return {
      slot: idx,
      id: isOwner ? 'you' : `p${idx + 1}`,
      peerId: null,
      name: isOwner ? 'Você (Dono da Oficina)' : `Funcionário #${numStr}`,
      role: isOwner ? '👑 Proprietário & Chefe Técnico · Cabine #01' : `🤝 Funcionário Técnico · Estação #${numStr}`,
      connected: isOwner,
      isLocal: isOwner,
      bubble: isOwner ? '🛠️ Bem-vindo à sua Oficina! Atenda os clientes na Cabine #01!' : null,
      bubbleTimer: isOwner ? 260 : 0,
      x: defaultX,
      y: defaultY,
      waypoints: [],
      speed: 4.8,
      radius: 14,
      look: {
        skin: SKIN_COLORS[idx % SKIN_COLORS.length],
        hair: HAIR_COLORS[idx % HAIR_COLORS.length],
        shirt: PLAYER_COLORS[idx % PLAYER_COLORS.length],
        glasses: idx % 2 === 0,
        headset: idx % 3 === 0,
        mood: 'happy'
      }
    };
  });
}

const initialInventory = {};
STOCK_PARTS.forEach(p => { initialInventory[p.id] = false; });

let cases = [];
let nextClientIdCounter = 1;

const state = {
  networkMode: 'online',
  soloExpandedDuo: false,
  soloExpansionTier: 1,
  enlargedScreen: false,
  roomCode: 'TI-' + Math.floor(1000 + Math.random() * 9000),
  myPeerId: 'player_' + Math.random().toString(36).slice(2, 8),
  mySlotIndex: 0,
  perpetualSeconds: 0,
  money: 2500,
  burntCount: 0,
  rep: 70,
  easyMode: true,
  activeCaseIndex: 0,
  activeTab: 'triagem',
  workbenchLevel: 1,
  coffeeBoostTimer: 0,
  coopHubFilter: 'all',
  // Expansão Dinâmica da Sede: Começa com 5 salas, e aumenta p/ 10, 15 e 20 conforme entram jogadores!
  hqMinRooms: 5,
  rackCapacity: 0,
  rackParts: 0,
  upgrades: {
    rack_lvl1: false,
    rack_lvl2: false,
    my_coffee: false,
    vip_sofa: false,
    ac_split: false,
    ac_lvl1: false,
    ac_lvl2: false,
    ac_lvl3: false,
    pro_bench: false,
    workbench_lvl2: false,
    workbench_lvl3: false,
    workbench_lvl4: false,
    solo_expansion_2: false,
    solo_expansion_3: false,
    solo_expansion_4: false,
    solo_expansion_5: false
  },
  inventory: { ...initialInventory },
  players: createInitialPlayers20()
};

function getConnectedPlayerCount() {
  if (state.networkMode === 'offline') {
    return state.soloExpandedDuo ? 2 : 1;
  }
  return Math.max(1, state.players.filter(p => p.connected).length);
}

// Regra: No Modo Solo somente puzzles de 1 pessoa; no Online, puzzles em grupo são liberados a partir de 4 jogadores online!
function isGroupPuzzlesUnlocked() {
  if (state.networkMode === 'offline') return false;
  return getConnectedPlayerCount() >= 4;
}

// Calcula quantas salas estão liberadas (5, 10, 15 ou 20) com base nos jogadores conectados ou nível expandido:
function getUnlockedRoomsCount() {
  if (state.networkMode === 'offline') return 1;
  const pCount = getConnectedPlayerCount();
  let byPlayers = 5;
  if (pCount >= 16) byPlayers = 20;
  else if (pCount >= 11) byPlayers = 15;
  else if (pCount >= 6) byPlayers = 10;
  return Math.max(byPlayers, state.hqMinRooms);
}

// Retorna o Nível da Sede (1 = 5 salas, 2 = 10 salas, 3 = 15 salas, 4 = 20 salas):
function getCurrentHQTier() {
  const rooms = getUnlockedRoomsCount();
  if (rooms >= 20) return 4;
  if (rooms >= 15) return 3;
  if (rooms >= 10) return 2;
  return 1;
}

function setHQTierRooms(targetRooms, fromPlayerJoin = false) {
  if (state.networkMode === 'offline') {
    showToast('🏠 Na Sala Solo você joga apenas puzzles de 1 pessoa! Entre em uma Sala em Grupo com Código para expandir a sede.');
    return;
  }
  const prevRooms = getUnlockedRoomsCount();
  const prevGroupUnlocked = isGroupPuzzlesUnlocked();
  state.hqMinRooms = targetRooms;

  // Se o jogador clicou no botão de porte da sede (5, 10, 15 ou 20 salas), conecta pelo menos 4 jogadores (ou o mínimo daquele porte):
  const minPlayersForTier = targetRooms === 20 ? 16 : (targetRooms === 15 ? 11 : (targetRooms === 10 ? 6 : 4));
  let curConnected = getConnectedPlayerCount();
  for (let i = 0; i < state.players.length && curConnected < minPlayersForTier; i++) {
    if (!state.players[i].connected) {
      state.players[i].connected = true;
      curConnected++;
    }
  }

  const newRooms = getUnlockedRoomsCount();
  refreshMapsWithUpgrades();
  rebuildColliders();
  if (!prevGroupUnlocked && isGroupPuzzlesUnlocked()) {
    rebuildQueueForCurrentMode();
  } else {
    syncQueueSizeToConnectedPlayers(newRooms > prevRooms);
  }
  renderTeleportButtons();
  renderAllUI();

  if (newRooms > prevRooms || !fromPlayerJoin) {
    const tier = getCurrentHQTier();
    const unlockedCoop = getUnlockedTemplates().filter(t => t.coopPlayers > 1).length;
    const unlockedSolo = getUnlockedTemplates().filter(t => !t.coopPlayers || t.coopPlayers === 1).length;
    showToast(`🏗️ Sede Nível ${tier} (${newRooms} Salas · ${getConnectedPlayerCount()} Jogadores Online)! Liberados: ${unlockedCoop}/18 Puzzles em Grupo e ${unlockedSolo}/9 Solo!`);
    addChatMessage('Sala em Grupo', `🏢 Sede com <b>${newRooms} Salas (${getConnectedPlayerCount()} jogadores online)</b>! Liberados <b>${unlockedCoop}/18 Puzzles em Grupo</b> e <b>${unlockedSolo}/9 Puzzles de 1 Pessoa</b>!`);
  }
}

function reachMinimumGroupPlayers4() {
  if (state.networkMode === 'offline') {
    switchGameMode('online');
  }
  const prevGroupUnlocked = isGroupPuzzlesUnlocked();
  let curConnected = getConnectedPlayerCount();
  for (let i = 0; i < state.players.length && curConnected < 4; i++) {
    if (!state.players[i].connected) {
      state.players[i].connected = true;
      state.players[i].bubble = `Entrei no grupo (${curConnected + 1}/4)! 🤝`;
      state.players[i].bubbleTimer = 240;
      curConnected++;
    }
  }
  refreshMapsWithUpgrades();
  rebuildColliders();
  if (!prevGroupUnlocked && isGroupPuzzlesUnlocked()) {
    rebuildQueueForCurrentMode();
  } else {
    syncQueueSizeToConnectedPlayers(true);
  }
  renderAllUI();
  if (document.getElementById('coop-hub-modal')?.classList.contains('open')) {
    renderCoopHubModal();
  }
  showToast('🤝 4 Jogadores Online conectados na Sala! Os Puzzles em Grupo foram LIBERADOS!');
  addChatMessage('Sala em Grupo', '🎉 Atingimos <b>4 jogadores online</b> na sala! Os <b>Puzzles em Grupo (Co-op)</b> agora estão liberados!');
}

function openFutureRoomsModalUI() {
  document.getElementById('future-rooms-modal')?.classList.add('open');
}

function setMatchPlayers(count, notify = true) {
  const target = Math.max(1, Math.min(4, Number(count) || 1));
  const map = currentMap();
  const cabinSpawns = (map && map.spawns) ? map.spawns : [
    { x: 210, y: 720 },
    { x: 255, y: 220 },
    { x: 625, y: 220 },
    { x: 995, y: 220 }
  ];

  state.players.forEach((p, idx) => {
    p.connected = (idx < target);
    if (idx === 0) {
      p.name = 'Você (Dono da Oficina)';
      p.role = '👑 Proprietário & Chefe Técnico · Cabine #01';
      // Garante que o jogador principal fique na Cabine #01 (térreo) e não no andar superior
      if (!p.x || p.y < 450) {
        p.x = cabinSpawns[0].x;
        p.y = cabinSpawns[0].y;
        p.waypoints = [];
      }
    } else {
      const numStr = String(idx + 1).padStart(2, '0');
      p.name = `Funcionário #${numStr}`;
      p.role = `🤝 Funcionário Técnico Contratado · Estação #${numStr}`;
      if (p.connected) {
        p.x = cabinSpawns[idx] ? cabinSpawns[idx].x : (255 + (idx - 1) * 370);
        p.y = cabinSpawns[idx] ? cabinSpawns[idx].y : 220;
        p.waypoints = [];
        p.bubble = `💼 Entrei como seu funcionário técnico! Pronto para trabalhar! 🛠️`;
        p.bubbleTimer = 220;
      }
    }
  });

  refreshMapsWithUpgrades();
  rebuildColliders();
  renderTeleportButtons();
  renderAllUI();

  if (notify) {
    const labels = {
      1: 'Apenas Você (Dono na Cabine #01)',
      2: 'Você + 1 Funcionário Técnico (Estação #02)',
      3: 'Você + 2 Funcionários Técnicos (Estações #02 e #03)',
      4: 'Você + 3 Funcionários Técnicos (Equipe Completa · Estações #02, #03 e #04)'
    };
    showToast(`🤝 Equipe da oficina: ${labels[target]}!`);
    addChatMessage('Equipe', `👥 Oficina operando com <b>${target} Técnicos (${labels[target]})</b>.`);
  }
}

function setSoloExpansionTier(tier, notify = true) {
  state.soloExpansionTier = Math.max(1, Math.min(5, Number(tier) || 1));
  state.upgrades.solo_expansion_2 = state.soloExpansionTier >= 2;
  state.upgrades.solo_expansion_3 = state.soloExpansionTier >= 3;
  state.upgrades.solo_expansion_4 = state.soloExpansionTier >= 4;
  state.upgrades.solo_expansion_5 = state.soloExpansionTier >= 5;

  refreshMapsWithUpgrades();
  rebuildColliders();
  renderTeleportButtons();
  syncQueueSizeToConnectedPlayers(false);

  if (document.getElementById('shop-modal')?.classList.contains('open')) {
    renderShopModal();
  }
  renderAllUI();

  if (notify) {
    const names = {
      1: '1x Básica (Cabine #01 + Estoque Inicial)',
      2: '2x (Ampliação da Cabine #01 +100px)',
      3: '3x (Mega Cabine Técnica #01 VIP +190px)',
      4: '4x (Ampliação do Estoque Lateral +100px)',
      5: '5x (Mega Almoxarifado Industrial +190px)'
    };
    showToast(`🧪 Teste Ativo: Loja expandida para Nível ${state.soloExpansionTier}x · ${names[state.soloExpansionTier]}!`);
    addChatMessage('Sistema de Expansão', `🧪 <b>Loja Expandida:</b> Nível <b>${state.soloExpansionTier}x</b> ativado! Mais espaço físico e capacidade aumentada para ${getTargetQueueSize()} clientes em espera.`);
  }
}

function simulateNewTechnicianJoining() {
  const connectedCount = getConnectedPlayerCount();
  if (connectedCount >= 4) {
    showToast('👥 A sessão já atingiu a capacidade máxima (4/4 Técnicos)! Em breve: Salas para 5 a 20 jogadores.');
    openFutureRoomsModalUI();
    return;
  }
  setMatchPlayers(connectedCount + 1, true);
}


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
    } else if (item.id === 'ac_lvl1') {
      isOwned = !!state.upgrades.ac_lvl1 || !!state.upgrades.ac_split;
    } else if (item.id === 'ac_lvl2') {
      isOwned = !!state.upgrades.ac_lvl2;
      if (!isOwned && !state.upgrades.ac_lvl1 && !state.upgrades.ac_split) {
        isLocked = true;
        lockReason = 'Requer Ar-Condicionado Nv. 1';
      }
    } else if (item.id === 'ac_lvl3') {
      isOwned = !!state.upgrades.ac_lvl3;
      if (!isOwned && !state.upgrades.ac_lvl2) {
        isLocked = true;
        lockReason = 'Requer Ar-Condicionado Nv. 2';
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
      btnHtml = '<button type="button" class="btn btn-sm btn-verde" disabled style="opacity:0.85; width:100%; font-weight:800;">✅ Já Adquirido</button>';
    } else if (isLocked) {
      btnHtml = '<button type="button" class="btn btn-sm btn-vidro" disabled style="opacity:0.6; width:100%; font-weight:800;">🔒 ' + lockReason + '</button>';
    } else if (!canAfford) {
      const falta = item.price - (state.money || 0);
      btnHtml = '<button type="button" class="btn btn-sm btn-vidro" disabled style="opacity:0.65; width:100%; font-weight:800;">💰 R$ ' + item.price.toLocaleString('pt-BR') + ' (Falta R$ ' + falta.toLocaleString('pt-BR') + ')</button>';
    } else {
      btnHtml = '<button type="button" class="btn btn-sm btn-amarelo" onclick="buyShopItem(\'' + item.id + '\')" style="width:100%; font-weight:900;">🛒 Comprar (R$ ' + item.price.toLocaleString('pt-BR') + ')</button>';
    }

    const borderClr = isOwned ? '#16a34a' : 'var(--linha)';
    const bgClr = isOwned ? '#f0fdf4' : '#ffffff';

    return `
      <div class="stock-item-card" style="display:flex; flex-direction:column; justify-content:space-between; padding:14px; border:2px solid ${borderClr}; border-radius:12px; background:${bgClr};">
        <div>
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:8px;">
            <span style="font-size:24px;">${item.icon}</span>
            <span style="font-size:12px; font-weight:900; padding:3px 10px; border-radius:99px; background:${isOwned ? '#bbf7d0; color:#14532d;' : '#e0f2fe; color:#0369a1;'}">
              ${isOwned ? 'ATIVADO' : 'R$ ' + item.price.toLocaleString('pt-BR')}
            </span>
          </div>
          <h4 style="margin:0 0 6px; font-size:14px; font-weight:900; color:var(--escuro);">${item.name}</h4>
          <p style="margin:0 0 12px; font-size:12px; line-height:1.4; color:var(--suave);">${item.desc}</p>
        </div>
        <div>
          ${btnHtml}
        </div>
      </div>
    `;
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

  if (item.id === 'ac_lvl1' && (state.upgrades.ac_lvl1 || state.upgrades.ac_split)) {
    showToast('⚠️ Ar-Condicionado Nível 1 já instalado!');
    return;
  }
  if (item.id === 'ac_lvl2') {
    if (state.upgrades.ac_lvl2) {
      showToast('⚠️ Ar-Condicionado Nível 2 já instalado!');
      return;
    }
    if (!state.upgrades.ac_lvl1 && !state.upgrades.ac_split) {
      showToast('⚠️ Compre primeiro o Ar-Condicionado Nível 1!');
      return;
    }
  }
  if (item.id === 'ac_lvl3') {
    if (state.upgrades.ac_lvl3) {
      showToast('⚠️ Ar Torre Nível 3 já instalado!');
      return;
    }
    if (!state.upgrades.ac_lvl2) {
      showToast('⚠️ Compre primeiro o Ar-Condicionado Nível 2!');
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
    return `
      <div class="stock-item-card" style="display:flex; flex-direction:column; justify-content:space-between; padding:12px; border:2px solid ${hasPart ? '#16a34a' : 'var(--linha)'}; border-radius:10px; background:${hasPart ? '#f0fdf4' : '#ffffff'};">
        <div>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
            <span style="font-size:20px;">${part.shortName.slice(0, 2)}</span>
            <span style="font-size:11px; font-weight:900; padding:2px 8px; border-radius:99px; background:${hasPart ? '#bbf7d0; color:#14532d;' : '#f1f5f9; color:#475569;'}">
              ${hasPart ? '🎒 NA MOCHILA' : 'DISPONÍVEL'}
            </span>
          </div>
          <h4 style="margin:0 0 4px; font-size:13px; font-weight:800; color:var(--escuro);">${part.name}</h4>
          <p style="margin:0 0 8px; font-size:11px; color:var(--suave); line-height:1.3;">${part.desc}</p>
        </div>
        <div>
          ${hasPart
            ? '<button type="button" class="btn btn-sm btn-vidro" onclick="dropStockPart(\'' + part.id + '\')" style="width:100%; font-weight:800;">Devolver ao Estoque</button>'
            : '<button type="button" class="btn btn-sm btn-azul" onclick="takeStockPart(\'' + part.id + '\')" style="width:100%; font-weight:800;">🎒 Pegar Peça</button>'
          }
        </div>
      </div>
    `;
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

function changeReputation(delta) {
  state.rep = Math.max(0, Math.min(100, state.rep + delta));
  updateHUD();
  if (state.rep <= 0 && !centralRackState.gameOver) {
    triggerReputationGameOver();
  }
}

// ============================================================================
// CONSTRUÇÃO DO MAPA ONLINE: 5 -> 10 -> 15 -> 20 CABINES ESPAÇADAS + 4 SALAS SUL
// ============================================================================
function buildOnlineWalledRoomsMap() {
  const rooms = [];
  const blueprints = [];
  const unlockedCount = getUnlockedRoomsCount();

  // Gera as cabines desbloqueadas (5, 10, 15 ou 20) com paredes sólidas e corredores largos de 135px!
  for (let i = 0; i < 20; i++) {
    const rect = getSmallRoomRect(i);
    const numStr = String(i + 1).padStart(2, '0');
    const isMine = (i === 0);

    // CABINE #09: RACK CENTRAL NO CENTRO SEM PAREDES (ONLINE COM MAIS DE 5 JOGADORES)
    if (i === 8) {
      rooms.push({
        id: 'central_rack_plaza',
        name: '🗄️⚡ RACK CENTRAL & NOC (SEM PAREDES)',
        x: rect.x - 10,
        y: rect.y - 10,
        w: rect.w + 20,
        h: rect.h + 20,
        floorColor: '#070b14',
        gridColor: '#172554',
        borderColor: '#38bdf8',
        hasWalls: false, // SEM PAREDES! APENAS O RACK NO CENTRO!
        furniture: [
          {
            type: 'central_rack',
            x: rect.x + 15,
            y: rect.y + 40,
            w: 210,
            h: 90,
            label: '🗄️⚡ RACK CENTRAL DE INFRAESTRUTURA [E]',
            color: '#0f172a',
            solid: true
          }
        ]
      });
      continue;
    }

    if (i >= unlockedCount) {
      const reqTierRooms = i < 10 ? 10 : (i < 15 ? 15 : 20);
      const reqPlayers = i < 10 ? '6+' : (i < 15 ? '11+' : '16+');
      blueprints.push({
        x: rect.x,
        y: rect.y,
        w: rect.w,
        h: rect.h,
        label: `🔒 Cabine #${numStr} (Abre c/ ${reqTierRooms} Salas / ${reqPlayers} Técnicos)`
      });
      continue;
    }

    const furniture = [
      {
        type: 'workbench',
        x: rect.x + 14,
        y: rect.y + 42,
        w: 128,
        h: 42,
        label: isMine
          ? (state.upgrades.pro_bench ? '🔬 BANCADA PRO [E]' : '🛠️ BANCADA #01 [E]')
          : `Bancada #${numStr}`,
        color: isMine && state.upgrades.pro_bench ? '#d97706' : PLAYER_COLORS[i % PLAYER_COLORS.length],
        solid: true
      },
      {
        type: 'chair',
        x: rect.chairX,
        y: rect.chairY,
        w: 42,
        h: 42,
        label: `C${numStr}`,
        color: '#f9c742',
        solid: false
      }
    ];

    // Móveis comprados na Loja aparecem fisicamente dentro da Sua Cabine #01!
    if (isMine) {
      if (state.rackCapacity > 0) {
        furniture.push({
          type: 'rack',
          x: rect.x + 152,
          y: rect.y + 42,
          w: 74,
          h: 42,
          label: `🗄️ Rack (${state.rackParts}/${state.rackCapacity})`,
          color: '#4f46e5',
          solid: true
        });
      }
      if (state.upgrades.my_coffee) {
        furniture.push({
          type: 'coffee',
          x: rect.x + 14,
          y: rect.y + 152,
          w: 82,
          h: 38,
          label: '☕ Café [E]',
          color: '#78350f',
          solid: true
        });
      }
      if (state.upgrades.ac_split) {
        furniture.push({
          type: 'ac',
          x: rect.x + 76,
          y: rect.y + 8,
          w: 95,
          h: 22,
          label: '❄️ Split 24k',
          color: '#0284c7',
          solid: false
        });
      }
      if (state.upgrades.vip_sofa) {
        furniture.push({
          type: 'sofa',
          x: rect.x + 104,
          y: rect.y + 156,
          w: 68,
          h: 34,
          label: '🛋️ VIP',
          color: '#e5534b',
          solid: false
        });
      }
    }

    rooms.push({
      id: isMine ? 'my_room' : `room_${numStr}`,
      name: isMine ? `🛠️ Cabine #01 (SUA SALA)` : `Cabine #${numStr}`,
      x: rect.x,
      y: rect.y,
      w: rect.w,
      h: rect.h,
      floorColor: isMine ? '#e4f8fa' : (rect.row === 0 ? '#f8fafc' : '#f5f3ff'),
      gridColor: isMine ? '#cdeef2' : '#e2e8f0',
      borderColor: PLAYER_COLORS[i % PLAYER_COLORS.length],
      hasWalls: true,
      doorSide: 'bottom',
      doorOffset: rect.w / 2,
      doorWidth: 88,
      doorInside: rect.doorInside,
      doorOutside: rect.doorOutside,
      furniture
    });
  }

  // 4 Salas Separadas com Paredes no Bloco Sul (y = 880..1340), também bem espaçadas!
  rooms.push(
    {
      id: 'stock_room',
      name: '📦 SALA DE ESTOQUE DE PEÇAS [E]',
      x: 140, y: 880, w: 660, h: 460,
      floorColor: '#eef2ff', gridColor: '#e0e7ff', borderColor: '#6366f1',
      hasWalls: true, doorSide: 'top', doorOffset: 330, doorWidth: 135,
      doorInside: { x: 470, y: 945 }, doorOutside: { x: 470, y: 805 },
      furniture: [
        { type: 'shelf', x: 180, y: 980, w: 250, h: 52, label: '📦 Estante A: Kits #1–#9 [E]', color: '#1fa6b8', solid: true },
        { type: 'shelf', x: 490, y: 980, w: 250, h: 52, label: '📦 Estante B: Kits #10–#18 [E]', color: '#6366f1', solid: true },
        { type: 'shelf', x: 180, y: 1205, w: 250, h: 52, label: '🗄️ Abastecer Seu Rack [E]', color: '#4bb56b', solid: true },
        { type: 'shelf', x: 490, y: 1205, w: 250, h: 52, label: '🤝 Kits Co-op 2P, 3P e 4P [E]', color: '#8c6fd1', solid: true }
      ]
    },
    {
      id: 'main_store',
      name: '🏪 RECEPÇÃO GERAL & ENTRADA DA SEDE',
      x: 920, y: 880, w: 820, h: 460,
      floorColor: '#ffffff', gridColor: '#edf7f8', borderColor: '#f9c742',
      hasWalls: true, doorSide: 'top', doorOffset: 410, doorWidth: 155,
      doorInside: { x: 1330, y: 945 }, doorOutside: { x: 1330, y: 805 },
      furniture: [
        { type: 'counter', x: 955, y: 940, w: 215, h: 54, label: '📣 Balcão Triagem [E]', color: '#f28649', solid: true },
        { type: 'waiting', x: 950, y: 1025, w: 260, h: 240, label: state.upgrades.vip_sofa ? '🛋️ Salão VIP Climatizado' : 'Espera dos Clientes', color: '#daf3f5', solid: false },
        { type: 'waiting', x: 1420, y: 1025, w: 260, h: 240, label: '🛋️ Salão de Espera Sul', color: '#e0f2fe', solid: false },
        { type: 'exit_mat', x: 1245, y: 1270, w: 170, h: 36, label: '🚪 Porta da Rua', color: '#137482', solid: false }
      ]
    },
    {
      id: 'coop_room',
      name: '🤝 SALA DE PUZZLES CO-OP (6x 2P, 6x 3P E 6x 4P)',
      x: 1860, y: 880, w: 680, h: 460,
      floorColor: '#f3e8ff', gridColor: '#e9d5ff', borderColor: '#9333ea',
      hasWalls: true, doorSide: 'top', doorOffset: 340, doorWidth: 135,
      doorInside: { x: 2200, y: 945 }, doorOutside: { x: 2200, y: 805 },
      furniture: [
        { type: 'workbench', x: 1910, y: 985, w: 250, h: 58, label: '🤝 Bancada Co-op 2P & 3P [E]', color: '#7e22ce', solid: true },
        { type: 'workbench', x: 2230, y: 985, w: 250, h: 58, label: '🤝 Bancada Co-op 4P [E]', color: '#6366f1', solid: true },
        { type: 'rack', x: 1970, y: 1205, w: 460, h: 58, label: '🖧 Central dos 18 Puzzles Cooperativos [E]', color: '#1e1b4b', solid: true }
      ]
    },
    {
      id: 'lounge',
      name: '☕ COPA & DATA CENTER NOC',
      x: 2660, y: 880, w: 560, h: 460,
      floorColor: '#fff8eb', gridColor: '#f5ead6', borderColor: '#f28649',
      hasWalls: true, doorSide: 'top', doorOffset: 280, doorWidth: 125,
      doorInside: { x: 2940, y: 945 }, doorOutside: { x: 2940, y: 805 },
      furniture: [
        { type: 'coffee', x: 2710, y: 985, w: 200, h: 56, label: '☕ Café Expresso [E]', color: '#78350f', solid: true },
        { type: 'rack', x: 2960, y: 985, w: 200, h: 56, label: '🖧 NOC 100G [E]', color: '#0f2533', solid: true },
        { type: 'sofa', x: 2780, y: 1210, w: 320, h: 56, label: '🛋️ Descanso da Equipe', color: '#e5534b', solid: true }
      ]
    }
  );

  const myRect = getSmallRoomRect(0);
  const interactables = [
    { id: 'my_workbench', x: myRect.x + 80, y: myRect.y + 68, radius: 110, label: '🛠️ [E] Atender Cliente na Bancada (Cabine #01)', action: () => interactWithMyWorkbench() },
    { id: 'central_rack', x: 1385, y: 565, radius: 155, label: '🗄️⚡ [E] Rack Central (Cabine #09)', action: () => openCentralRackModal() },
    { id: 'reception_counter', x: 1060, y: 967, radius: 130, label: '🛎️ [E] Balcão de Recepção: Chamar Cliente', action: () => interactWithReceptionCounter() },
    { id: 'stock_1', x: 305, y: 1005, radius: 125, label: '📦 [E] Abrir Sala de Estoque Geral', action: () => openStockModalUI() },
    { id: 'stock_2', x: 615, y: 1005, radius: 125, label: '📦 [E] Abrir Sala de Estoque Geral', action: () => openStockModalUI() },
    { id: 'stock_refill_rack', x: 305, y: 1230, radius: 130, label: '🗄️ [E] Encher o Rack da Sua Sala (Grátis Aqui!)', action: () => refillMyRackFree() },
    { id: 'stock_coop', x: 615, y: 1230, radius: 130, label: '🤝 [E] Pegar Kits Co-op (2P, 3P e 4P)', action: () => openStockModalUI() },
    { id: 'coop_bench_1', x: 2035, y: 1015, radius: 140, label: '🤝 [E] Abrir Central dos 18 Puzzles Co-op (2P, 3P e 4P)', action: () => openCoopHubModalUI() },
    { id: 'coop_bench_2', x: 2355, y: 1015, radius: 140, label: '🤝 [E] Abrir Desafio Co-op na Bancada', action: () => openCoopCaseOnBench() },
    { id: 'coop_rack_hub', x: 2200, y: 1230, radius: 140, label: '🖧 [E] Escolher Puzzle Co-op (2, 3 ou 4 Jogadores)', action: () => openCoopHubModalUI() },
    { id: 'coffee_machine', x: 2810, y: 1015, radius: 125, label: '☕ [E] Tomar Café Expresso (+Velocidade Turbo!)', action: () => drinkCoffee() },
    { id: 'noc_console', x: 3060, y: 1015, radius: 125, label: '🖧 [E] Checar Status do Cluster NOC', action: () => inspectNOC() }
  ];

  if (state.rackCapacity > 0) {
    interactables.push({
      id: 'my_room_rack',
      x: myRect.x + 188,
      y: myRect.y + 64,
      radius: 85,
      label: `🗄️ [E] Seu Rack (${state.rackParts}/${state.rackCapacity} Peças) · Abrir Loja`,
      action: () => openShopModalUI()
    });
  }
  if (state.upgrades.my_coffee) {
    interactables.push({
      id: 'my_room_coffee',
      x: myRect.x + 55,
      y: myRect.y + 170,
      radius: 80,
      label: '☕ [E] Tomar Café na Sua Cafeteira Exclusiva!',
      action: () => drinkCoffee()
    });
  }

  return {
    width: 3960,
    height: 1460,
    buildingRect: { x: 80, y: 60, w: 3800, h: 1340 },
    spawn: { x: myRect.spawnX, y: myRect.spawnY },
    myChairPos: { x: myRect.chairX + 18, y: myRect.chairY + 18 },
    exitPos: { x: 1330, y: 1290 },
    rooms,
    blueprints,
    teleports: [
      { id: 'my_room', label: '🛠️ Minha Cabine (#01)', x: myRect.spawnX, y: myRect.spawnY },
      { id: 'central_rack', label: '🗄️⚡ Rack Central (Cabine 09)', x: 1385, y: 740 },
      { id: 'stock_room', label: '📦 Sala de Estoque', x: 470, y: 1100 },
      { id: 'main_store', label: '🏪 Recepção', x: 1060, y: 1010 },
      { id: 'coop_room', label: '🤝 Lab 18 Puzzles Co-op', x: 2200, y: 1100 },
      { id: 'lounge', label: '☕ Copa & NOC', x: 2940, y: 1100 }
    ],
    interactables
  };
}

function buildOfflineMap(overrideCount) {
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

  // Posição da banqueta do cliente (local exato marcado com a bola azul pelo usuário, perto da porta)
  const stoolX = myRoomX + myRoomW - 85;
  const stoolY = 620;

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

  if (state.rackCapacity > 0 || state.upgrades.rack_lvl1) {
    const pVars = state.sessionShelfVariants?.partsRacks || [0, 1];
    // Rack de Peças principal (escolha aleatória entre as estantes da 3ª imagem)
    furnitureMyRoom.push({
      type: 'rack',
      partsVariant: pVars[0],
      x: myRoomX + 25, y: 635, w: 82, h: 86,
      label: `🗄️ Rack de Peças (${state.rackParts}/${state.rackCapacity})`,
      color: '#4f46e5',
      solid: true
    });

    // Quando aumentamos para o Mega Rack, coloca um segundo rack diretamente abaixo dele!
    if (state.upgrades.rack_lvl2) {
      furnitureMyRoom.push({
        type: 'rack',
        partsVariant: pVars[1],
        x: myRoomX + 25, y: 730, w: 82, h: 86,
        label: `🗄️ Mega Rack Duplo (${state.rackParts}/${state.rackCapacity})`,
        color: '#4338ca',
        solid: true
      });
    }
  }
  const hasAcLvl1 = !!state.upgrades.ac_lvl1 || !!state.upgrades.ac_split;
  const hasAcLvl2 = !!state.upgrades.ac_lvl2;
  const hasAcLvl3 = !!state.upgrades.ac_lvl3;

  // Nível 1 e Nível 2: Split de parede fica mais para a direita (x = myRoomX + myRoomW - 135)
  if (hasAcLvl1 || hasAcLvl2) {
    const isBlack = hasAcLvl2;
    furnitureMyRoom.push({
      type: 'ac',
      acModel: isBlack ? 'black' : 'white',
      x: myRoomX + myRoomW - 135, y: 468, w: 110, h: 32,
      label: isBlack ? '❄️ Split Black 24k (Nv. 2)' : '❄️ Split 12k Branco (Nv. 1)',
      color: isBlack ? '#0f172a' : '#0284c7',
      solid: false
    });
  }

  // Nível 3: Ar Torre de chão fica ao lado da nossa bancada de trabalho
  if (hasAcLvl3) {
    furnitureMyRoom.push({
      type: 'ac',
      acModel: 'tower',
      x: myRoomX + 8, y: 520, w: 26, h: 68,
      label: '❄️ Ar Torre Coluna (Nv. 3) [E]',
      color: '#1e293b',
      solid: true
    });
  }
  if (soloTier >= 2) {
    const shelfW = 70;
    const shelfH = 84;
    // Encostados na parede direita conforme indicado pelos traços roxos do usuário:
    const shelf2X = myRoomX + myRoomW - 85;
    const shelf1X = shelf2X - 78;

    furnitureMyRoom.push({
      type: 'shelf',
      shelfKind: 'small',
      shelfVariant: smVars[2 % smVars.length],
      x: shelf1X, y: 505, w: shelfW, h: shelfH,
      label: '🧰 Testes',
      color: '#0d9488',
      solid: true
    });
    furnitureMyRoom.push({
      type: 'shelf',
      shelfKind: 'small',
      shelfVariant: smVars[4 % smVars.length],
      x: shelf2X, y: 505, w: shelfW, h: shelfH,
      label: '🧰 Suprimentos',
      color: '#0d9488',
      solid: true
    });
  }
  if (soloTier >= 3) {
    furnitureMyRoom.push({
      type: 'sofa',
      orientation: 'horizontal',
      x: myRoomX + 195, y: 875, w: 145, h: 90,
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


  // ============================================================================
  // ENFEITES DECORATIVOS NAS PAREDES (Plantas e Lixeiras de Reciclagem - Imagens 3, 4 e 5)
  // Colocados perto de paredes, sem sobrepor nada nem tampar caminhos!
  // ============================================================================
  const decors = state.sessionShelfVariants?.decorSelections || ['plant_tall', 'plant_small', 'recycle_bin', 'plant_tall', 'plant_small', 'recycle_bin'];
  
  function getDecorDim(type) {
    if (type === 'plant_tall') return { w: 30, h: 50 };
    if (type === 'plant_small') return { w: 26, h: 44 };
    return { w: 26, h: 44 }; // recycle_bin
  }

  // Enfeites na Cabine #01 (paredes limpas)
  const d0 = getDecorDim(decors[0]);
  furnitureMyRoom.push({ type: 'decor', decorType: decors[0], x: myRoomX + 16, y: 472, w: d0.w, h: d0.h, solid: true, label: 'Enfeite Cabine' });
  const d1 = getDecorDim(decors[1]);
  furnitureMyRoom.push({ type: 'decor', decorType: decors[1], x: myRoomX + 16, y: 922, w: d1.w, h: d1.h, solid: true, label: 'Enfeite Cabine' });

  // Enfeites na Recepção (cantos das paredes, longe dos caminhos da porta e balcão)
  const d2 = getDecorDim(decors[2]);
  furnitureReception.push({ type: 'decor', decorType: decors[2], x: recX + 18, y: 472, w: d2.w, h: d2.h, solid: true, label: 'Enfeite Recepção' });
  const d3 = getDecorDim(decors[3]);
  furnitureReception.push({ type: 'decor', decorType: decors[3], x: recX + recW - 42, y: 472, w: d3.w, h: d3.h, solid: true, label: 'Lixeira Recepção' });
  const d4 = getDecorDim(decors[4]);
  furnitureReception.push({ type: 'decor', decorType: decors[4], x: recX + 18, y: 920, w: d4.w, h: d4.h, solid: true, label: 'Enfeite Recepção' });

  // Enfeites no Almoxarifado / Estoque (cantos das paredes)
  const d5 = getDecorDim(decors[5]);
  furnitureStock.push({ type: 'decor', decorType: decors[5], x: stockX + stockW - 42, y: 472, w: d5.w, h: d5.h, solid: true, label: 'Enfeite Estoque' });
  const d6 = getDecorDim(decors[6 % decors.length]);
  furnitureStock.push({ type: 'decor', decorType: decors[6 % decors.length], x: stockX + stockW - 42, y: 920, w: d6.w, h: d6.h, solid: true, label: 'Lixeira Estoque' });

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

  ];

  // 2 RACKS DE INFRAESTRUTURA:
  // Um em cada retângulo vermelho demarcado pelo usuário (sem detalhes em branco, piso constante):
  // Rack 1: Acima da Cabine #01 (esquerda)
  // Rack 2: Acima da Sala de Estoque (direita)
  // O centro fica 100% livre para clientes andarem à vontade!
  const rackW = 210;
  const rackH = 72;
  const rackLeftX = myRoomX + Math.floor((myRoomW - rackW) / 2);
  const rackRightX = stockX + Math.floor((stockW - rackW) / 2);
  const rackY = 335;

  const corridorFurniture = [
    {
      id: 'central_rack_1',
      type: 'central_rack',
      rackIndex: 1,
      x: rackLeftX,
      y: rackY,
      w: rackW,
      h: rackH,
      label: '🗄️⚡ RACK DE INFRAESTRUTURA #01 [E]',
      color: '#0f172a',
      solid: true
    },
    {
      id: 'central_rack_2',
      type: 'central_rack',
      rackIndex: 2,
      x: rackRightX,
      y: rackY,
      w: rackW,
      h: rackH,
      label: '🗄️⚡ RACK DE INFRAESTRUTURA #02 [E]',
      color: '#0f172a',
      solid: true
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
  // Posições dos clientes na Área Vermelha demarcada pelo usuário (Imagem 1):
  const waitingSlots = [
    { x: recX + 65,  y: 380 },
    { x: recX + 160, y: 440 },
    { x: recX + 225, y: 510 },
    { x: recX + 85,  y: 560 },
    { x: recX + 155, y: 630 },
    { x: recX + 215, y: 700 },
    { x: recX + 90,  y: 770 },
    { x: recX + 170, y: 840 },
    { x: recX + 120, y: 880 },
    { x: recX + 200, y: 390 },
    { x: recX + 75,  y: 470 },
    { x: recX + 140, y: 520 }
  ];

  const connectors = [
    { from: 'my_room', to: 'main_store', x1: myRoomX + myRoomW - 45, y1: 720, x2: recX + 45, y2: 720 },
    { from: 'main_store', to: 'stock_room', x1: recX + recW - 45, y1: 720, x2: stockX + 45, y2: 720 }
  ];

  if (hasEmployees) {
    connectors.push(
      { from: 'employee_station_02', to: 'central_rack_plaza', x1: x02 + Math.floor(wStation / 2), y1: yUpper + hUpper, x2: recX + recW / 2, y2: 310 },
      { from: 'employee_station_03', to: 'central_rack_plaza', x1: x03 + Math.floor(wStation / 2), y1: yUpper + hUpper, x2: recX + recW / 2, y2: 310 },
      { from: 'employee_station_04', to: 'central_rack_plaza', x1: x04 + Math.floor(wStation / 2), y1: yUpper + hUpper, x2: recX + recW / 2, y2: 310 }
    );
  }

  const coffeePos = (soloTier >= 2)
    ? { x: myRoomX + 80, y: 921, label: '☕ [E] Tomar Café Expresso na Sua Sala (+Velocidade)' }
    : { x: stockX + stockW - 60, y: 726, label: '☕ [E] Tomar Café na Sala de Estoque (+Velocidade)' };

  const interactables = [
    { id: 'my_workbench', x: myRoomX + 35 + benchW / 2, y: 505 + benchH / 2, radius: 125, label: `🛠️ [E] Atender Cliente na Bancada (Nv. ${benchLvl})`, action: () => interactWithMyWorkbench() },
    { id: 'central_rack_1', x: rackLeftX + rackW / 2, y: rackY + rackH / 2, radius: 145, label: '🗄️ [E] Rack de Infraestrutura #01 (10 Puzzles)', action: () => openCentralRackModal() },
    { id: 'central_rack_2', x: rackRightX + rackW / 2, y: rackY + rackH / 2, radius: 145, label: '🗄️ [E] Rack de Infraestrutura #02 (10 Puzzles)', action: () => openCentralRackModal() },
    { id: 'reception_counter', x: counterX + counterW / 2, y: counterY + counterH / 2, radius: 130, label: '🛎️ [E] Balcão de Recepção: Chamar Cliente', action: () => interactWithReceptionCounter() },
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
            showToast(`📋 Código de convite [${state.roomCode}] copiado! Passe para o Funcionário #02 entrar!`);
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
            showToast(`📋 Código de convite [${state.roomCode}] copiado! Passe para o Funcionário #03 entrar!`);
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
            showToast(`📋 Código de convite [${state.roomCode}] copiado! Passe para o Funcionário #04 entrar!`);
          }
        }
      }
    );
  }

  const teleports = [
    { label: '🛠️ Cabine #01', x: myRoomX + 160, y: 720 },
    { label: '🛎️ Recepção', x: recX + 140, y: 720 },
    { label: '📦 Estoque', x: stockX + 140, y: 720 },
    { label: '🗄️ Rack Central', x: recX + recW / 2, y: 415 }
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
    exitPos: { x: recX + recW / 2, y: 920 },
    rooms,
    corridorFurniture,
    connectors,
    waitingSlots,
    interactables,
    teleports
  };
}

// ==============================================================
// SISTEMA DE REDE WEBRTC P2P MULTIJOGADOR (HOST + ATÉ 3 FUNCIONÁRIOS)
// ==============================================================
const PEER_CONFIG = {
  debug: 1,
  config: {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' },
      { urls: 'stun:stun.cloudflare.com:3478' }
    ]
  }
};

let bcChannel = null;
let peerInstance = null;
let peerConnections = [];

function getPlayerLocalName() {
  try {
    const raw = localStorage.getItem('omnivoid_current_user') || localStorage.getItem('omnivoid_user');
    if (raw) {
      const u = JSON.parse(raw);
      if (u && (u.nickname || u.name)) return u.nickname || u.name;
    }
  } catch (e) {}
  return 'Técnico';
}

function normalizeRoomCode(code) {
  if (!code) return '';
  let s = String(code).trim().toUpperCase().replace(/\s+/g, '');
  if (!s.startsWith('TI-')) {
    if (s.startsWith('TI')) {
      s = 'TI-' + s.slice(2);
    } else {
      s = 'TI-' + s;
    }
  }
  return s;
}

function setPeerStatus(type, text) {
  const badge = document.getElementById('peer-status-badge');
  if (!badge) return;
  badge.textContent = text;
  if (type === 'online' || type === 'connected') {
    badge.style.background = 'rgba(0, 255, 136, 0.18)';
    badge.style.color = '#00ff88';
  } else if (type === 'connecting') {
    badge.style.background = 'rgba(255, 214, 10, 0.2)';
    badge.style.color = '#ffd60a';
  } else {
    badge.style.background = 'rgba(255, 0, 85, 0.2)';
    badge.style.color = '#ff4d6d';
  }
}

function initMultiplayerRoom(code) {
  state.roomCode = normalizeRoomCode(code || ('TI-' + Math.floor(1000 + Math.random() * 9000)));
  setPeerStatus('connecting', '🟡 Conectando servidor...');
  const displayCode = document.getElementById('display-room-code');
  if (displayCode) displayCode.textContent = state.roomCode;
  const sessionPill = document.getElementById('session-code-pill');
  if (sessionPill) sessionPill.textContent = 'Sala: ' + state.roomCode;

  // Local BroadcastChannel fallback
  if (bcChannel) { try { bcChannel.close(); } catch (e) {} }
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    try {
      bcChannel = new BroadcastChannel('plantao_ti_perpetual_' + state.roomCode);
      bcChannel.onmessage = (ev) => handleNetworkMessage(ev.data);
    } catch (e) {}
  }

  // Inicializa o Host via WebRTC (PeerJS)
  if (typeof window !== 'undefined' && window.Peer) {
    try {
      if (peerInstance) {
        try { peerInstance.destroy(); } catch (e) {}
      }
      peerConnections = [];

      let hostKey = state.roomCode.replace(/[^A-Z0-9]/gi, '').toLowerCase();
      if (!hostKey.startsWith('ti')) hostKey = 'ti' + hostKey;
      const hostPeerId = 'plantaoti-v10-' + hostKey;
      peerInstance = new Peer(hostPeerId, PEER_CONFIG);

      peerInstance.on('open', (id) => {
        state.mySlotIndex = 0; // Host é sempre Cabine #01 (Dono)
        console.log('[Plantão TI] Host online na sala ' + state.roomCode + ' (PeerID: ' + id + ')');
        setPeerStatus('online', '🟢 Sala Pronta (Host)');
        updateHostNameInUI();
      });

      peerInstance.on('connection', (conn) => {
        conn.on('open', () => {
          if (!peerConnections.includes(conn)) {
            peerConnections.push(conn);
          }
          console.log('[Plantão TI] Novo funcionário conectado ao Host.');
        });

        conn.on('data', (data) => {
          handleNetworkMessage(data, conn);
        });

        conn.on('close', () => {
          peerConnections = peerConnections.filter(c => c !== conn);
          const p = state.players.find(pl => pl.peerConn === conn || (conn.metadata && pl.peerId === conn.metadata.peerId));
          if (p && p.slot !== 0) {
            p.connected = false;
            p.peerId = null;
            addChatMessage('Oficina', '🚪 ' + p.name + ' desconectou da sessão.');
            showToast('🚪 Um funcionário desconectou.');
            renderAllUI();
          }
        });

        conn.on('error', (err) => {
          console.warn('[Plantão TI] Erro na conexão com funcionário:', err);
        });
      });

      peerInstance.on('error', (err) => {
        console.warn('[Plantão TI] Aviso no Peer do Host:', err);
        // Se o código já estava em uso por outro host, gera um novo código livre
        if (err.type === 'unavailable-id') {
          const newCode = 'TI-' + Math.floor(1000 + Math.random() * 9000);
          console.log('[Plantão TI] Código ' + state.roomCode + ' em uso. Criando nova sala:', newCode);
          initMultiplayerRoom(newCode);
        }
      });
    } catch (e) {
      console.error('[Plantão TI] Erro ao iniciar WebRTC:', e);
    }
  }
}

function joinRoomAsGuest(code) {
  const cleanCode = normalizeRoomCode(code);
  if (!cleanCode) {
    showToast('⚠️ Digite o código da sala (ex: 1234 ou TI-1234)!');
    return;
  }
  state.roomCode = cleanCode;
  const displayCode = document.getElementById('display-room-code');
  if (displayCode) displayCode.textContent = state.roomCode;
  setPeerStatus('connecting', '🟡 Conectando à sala...');

  showToast('🔑 Conectando à sala ' + cleanCode + ' do Host...');

  if (bcChannel) { try { bcChannel.close(); } catch (e) {} }
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    try {
      bcChannel = new BroadcastChannel('plantao_ti_perpetual_' + state.roomCode);
      bcChannel.onmessage = (ev) => handleNetworkMessage(ev.data);
      bcChannel.postMessage({ type: 'join_request', peerId: state.myPeerId, name: getPlayerLocalName() });
    } catch (e) {}
  }

  if (typeof window !== 'undefined' && window.Peer) {
    try {
      if (peerInstance) {
        try { peerInstance.destroy(); } catch (e) {}
      }
      peerConnections = [];

      const guestPeer = new Peer(null, PEER_CONFIG);
      peerInstance = guestPeer;

      guestPeer.on('open', (id) => {
        let codeKey = cleanCode.replace(/[^A-Z0-9]/gi, '').toLowerCase();
        if (!codeKey.startsWith('ti')) codeKey = 'ti' + codeKey;
        const targetHostId = 'plantaoti-v10-' + codeKey;
        console.log('[Plantão TI] Conectando ao Host ' + targetHostId + ' via Peer ' + id);
        const conn = guestPeer.connect(targetHostId, {
          reliable: true,
          metadata: { name: getPlayerLocalName(), peerId: state.myPeerId }
        });

        conn.on('open', () => {
          peerConnections = [conn];
          showToast('🟢 Conectado ao Host da Sala ' + cleanCode + '! Solicitando cabine...');
          conn.send({
            type: 'join_request',
            peerId: state.myPeerId,
            name: getPlayerLocalName()
          });
        });

        conn.on('data', (data) => {
          handleNetworkMessage(data, conn);
        });

        conn.on('close', () => {
          showToast('🚪 Conexão com o Host foi encerrada.');
          setPeerStatus('error', '🔴 Desconectado');
          peerConnections = [];
        });

        conn.on('error', (err) => {
          console.warn('[Plantão TI] Erro ao conectar ao Host:', err);
          showToast('⚠️ Erro ao conectar à sala do Host.');
          setPeerStatus('error', '🔴 Erro na conexão');
        });
      });

      guestPeer.on('error', (err) => {
        console.warn('[Plantão TI] Erro no Peer de Convidado:', err);
        showToast('⚠️ Sala não encontrada ou Host offline (' + cleanCode + ').');
        setPeerStatus('error', '🔴 Sala não encontrada');
      });
    } catch (e) {
      console.error('[Plantão TI] Erro ao conectar como convidado:', e);
    }
  }
}
window.joinRoomAsGuest = joinRoomAsGuest;

function broadcastNet(msg) {
  if (bcChannel) {
    try { bcChannel.postMessage(msg); } catch (e) {}
  }
  peerConnections.forEach(c => {
    try { if (c && c.open) c.send(msg); } catch (e) {}
  });
}

// Heartbeat a cada 8 segundos para manter conexões WebRTC ativas através de roteadores/NATs
setInterval(() => {
  if (peerConnections.length > 0) {
    broadcastNet({ type: 'ping', peerId: state.myPeerId });
  }
}, 8000);

function updateHostNameInUI() {
  const localName = getPlayerLocalName();
  if (state.players && state.players[0]) {
    state.players[0].name = localName + ' (Dono da Oficina)';
    renderAllUI();
  }
}

function handleNetworkMessage(data, conn) {
  if (!data || data.peerId === state.myPeerId) return;

  // Ignora heartbeats
  if (data.type === 'ping') return;

  // Se eu for o Host, retransmito mensagens recebidas de um convidado para todos os outros convidados (Topologia em Estrela)
  if (state.mySlotIndex === 0 && conn) {
    peerConnections.forEach(c => {
      if (c !== conn && c.open) {
        try { c.send(data); } catch (e) {}
      }
    });
  }

  // 1. Demissão/Expulsão de funcionário pelo Host
  if (data.type === 'kick_player') {
    if (data.slot === state.mySlotIndex || (data.peerId && data.peerId === state.myPeerId)) {
      alert('🚪 Você foi demitido e expulso da assistência técnica pelo Host!');
      state.mySlotIndex = 0;
      state.networkMode = 'offline';
      try { if (peerInstance) peerInstance.destroy(); } catch(e){}
      window.location.reload();
      return;
    } else {
      const p = state.players[data.slot];
      if (p) {
        p.connected = false;
        p.peerId = null;
        addChatMessage('Oficina', '🚪 ' + p.name + ' foi demitido e expulso pelo Host.');
        renderAllUI();
      }
    }
    return;
  }

  // 2. Pedido de entrada na oficina (recebido pelo Host)
  if (data.type === 'join_request') {
    // Aloca apenas entre os slots de funcionários 1 a 3 (máximo 4 pessoas na oficina)
    let existing = state.players.find(p => p.peerId === data.peerId);
    if (!existing) {
      existing = state.players.slice(1, 4).find(p => !p.connected);
      if (existing) {
        existing.connected = true;
        existing.peerId = data.peerId;
        existing.peerConn = conn;
        if (data.name) {
          existing.name = data.name + ' (Funcionário #' + String(existing.slot + 1).padStart(2, '0') + ')';
        }
        existing.bubble = 'Cheguei para trabalhar! 🛠️';
        existing.bubbleTimer = 240;

        addChatMessage('Oficina', '🎉 ' + existing.name + ' entrou como seu funcionário (' + getConnectedPlayerCount() + '/4 na equipe)!');
        showToast('👥 ' + existing.name + ' entrou na oficina!');
        renderAllUI();
      } else {
        // Sala cheia (já tem 4 jogadores)
        if (conn && conn.open) {
          try { conn.send({ type: 'room_full', peerId: state.myPeerId }); } catch(e){}
        }
        return;
      }
    }

    // Host envia sincronização de sala completa para o novo funcionário
    broadcastNet({
      type: 'room_sync',
      peerId: state.myPeerId,
      hqMinRooms: state.hqMinRooms,
      connectedSlots: state.players.slice(0, 4).map(p => ({
        slot: p.slot,
        connected: p.connected,
        peerId: p.peerId,
        name: p.name,
        x: p.x,
        y: p.y
      })),
      assignedPeerId: data.peerId,
      assignedSlot: existing ? existing.slot : 1,
      assignedName: existing ? existing.name : ''
    });
    return;
  }

  // 3. Aviso de sala cheia
  if (data.type === 'room_full') {
    alert('⚠️ Esta oficina já atingiu a capacidade máxima de 4 técnicos (Host + 3 funcionários)!');
    return;
  }

  // 4. Sincronização inicial da sala recebida pelo funcionário
  if (data.type === 'room_sync') {
    let changed = false;
    if (data.connectedSlots) {
      data.connectedSlots.forEach(s => {
        const p = state.players[s.slot];
        if (p) {
          p.connected = s.connected;
          p.peerId = s.peerId;
          if (s.name) p.name = s.name;
          if (typeof s.x === 'number') p.x = s.x;
          if (typeof s.y === 'number') p.y = s.y;
          changed = true;
        }
      });
    }

    if (data.assignedPeerId === state.myPeerId && state.mySlotIndex === 0 && data.assignedSlot > 0) {
      state.mySlotIndex = data.assignedSlot;
      state.players.forEach((p, idx) => { p.isLocal = (idx === state.mySlotIndex); });
      if (data.assignedName && state.players[state.mySlotIndex]) {
        state.players[state.mySlotIndex].name = data.assignedName;
      }
      showToast('🎉 Bem-vindo! Você assumiu o posto na Cabine #' + String(state.mySlotIndex + 1).padStart(2, '0') + ' como funcionário do Host!');
      changed = true;
    }

    if (changed) {
      renderAllUI();
    }
    return;
  }

  // 5. Movimento de outros jogadores na tela
  if (data.type === 'player_move') {
    const p = state.players[data.slot];
    if (p && p.slot !== state.mySlotIndex) {
      p.connected = true;
      p.x = data.x;
      p.y = data.y;
      p.isMoving = data.isMoving;
      if (data.bubble) {
        p.bubble = data.bubble;
        p.bubbleTimer = 180;
      }
    }
    return;
  }

  // 6. Sincronização de etapas de puzzles cooperativos
  if (data.type === 'coop_step_sync') {
    const targetCase = (cases || []).find(x => x.minigameType === data.minigameType && !x.solved);
    if (targetCase && targetCase.mgState) {
      if (typeof data.optIdx === 'number') {
        targetCase.mgState.coopSelectedOpt[data.stationIdx] = data.optIdx;
      }
      if (data.stationDone) {
        targetCase.mgState.coopStations[data.stationIdx] = true;
        addChatMessage(data.playerName || 'Colega de Trabalho', '🤝 Sincronizou a Estação #' + (data.stationIdx + 1) + ' no puzzle ' + data.minigameType.toUpperCase() + '!');
      }
      if (document.getElementById('workbench-modal')?.classList.contains('open')) {
        renderWorkbenchModal();
      }
    }
    return;
  }

  // 7. Stickers de chat
  if (data.type === 'chat_sticker') {
    addChatMessage(data.author, data.text);
    return;
  }
}

let solidColliders = [];

function rebuildColliders() {
  const map = currentMap();
  if (!map) return;
  solidColliders = [];
  const wallThick = 12;

  const b = map.buildingRect;
  if (b) {
    solidColliders.push({ x: b.x - 20, y: b.y - 20, w: b.w + 40, h: 20 });
    solidColliders.push({ x: b.x - 20, y: b.y + b.h, w: b.w + 40, h: 20 });
    solidColliders.push({ x: b.x - 20, y: b.y, w: 20, h: b.h });
    solidColliders.push({ x: b.x + b.w, y: b.y, w: 20, h: b.h });
  }

  if (map.rooms) {
    map.rooms.forEach(r => {
      if (!r.hasWalls) {
        if (r.furniture) {
          r.furniture.forEach(f => {
            if (f.solid) solidColliders.push({ x: f.x, y: f.y, w: f.w, h: f.h, isWall: false });
          });
        }
        return;
      }

      const halfT = wallThick / 2;
      const dOff = r.doorOffset || (r.doorSide === 'left' || r.doorSide === 'right' ? r.h / 2 : r.w / 2);
      const dHalf = (r.doorWidth || 88) / 2;

      if (r.doorSide === 'top') {
        const gapStart = r.x + dOff - dHalf;
        const gapEnd = r.x + dOff + dHalf;
        solidColliders.push({ x: r.x, y: r.y - halfT, w: gapStart - r.x, h: wallThick, isWall: true, color: r.borderColor });
        solidColliders.push({ x: gapEnd, y: r.y - halfT, w: (r.x + r.w) - gapEnd, h: wallThick, isWall: true, color: r.borderColor });
      } else {
        solidColliders.push({ x: r.x, y: r.y - halfT, w: r.w, h: wallThick, isWall: true, color: r.borderColor });
      }

      if (r.doorSide === 'bottom') {
        const gapStart = r.x + dOff - dHalf;
        const gapEnd = r.x + dOff + dHalf;
        solidColliders.push({ x: r.x, y: r.y + r.h - halfT, w: gapStart - r.x, h: wallThick, isWall: true, color: r.borderColor });
        solidColliders.push({ x: gapEnd, y: r.y + r.h - halfT, w: (r.x + r.w) - gapEnd, h: wallThick, isWall: true, color: r.borderColor });
      } else {
        solidColliders.push({ x: r.x, y: r.y + r.h - halfT, w: r.w, h: wallThick, isWall: true, color: r.borderColor });
      }

      if (r.doorSide === 'left') {
        const gapStart = r.y + dOff - dHalf;
        const gapEnd = r.y + dOff + dHalf;
        solidColliders.push({ x: r.x - halfT, y: r.y, w: wallThick, h: gapStart - r.y, isWall: true, color: r.borderColor });
        solidColliders.push({ x: r.x - halfT, y: gapEnd, w: wallThick, h: (r.y + r.h) - gapEnd, isWall: true, color: r.borderColor });
      } else {
        solidColliders.push({ x: r.x - halfT, y: r.y, w: wallThick, h: r.h, isWall: true, color: r.borderColor });
      }

      if (r.doorSide === 'right') {
        const gapStart = r.y + dOff - dHalf;
        const gapEnd = r.y + dOff + dHalf;
        solidColliders.push({ x: r.x + r.w - halfT, y: r.y, w: wallThick, h: gapStart - r.y, isWall: true, color: r.borderColor });
        solidColliders.push({ x: r.x + r.w - halfT, y: gapEnd, w: wallThick, h: (r.y + r.h) - gapEnd, isWall: true, color: r.borderColor });
      } else {
        solidColliders.push({ x: r.x + r.w - halfT, y: r.y, w: wallThick, h: r.h, isWall: true, color: r.borderColor });
      }

      if (r.furniture) {
        r.furniture.forEach(f => {
          if (f.solid) solidColliders.push({ x: f.x, y: f.y, w: f.w, h: f.h, isWall: false });
        });
      }
    });
  }

  if (map.corridorFurniture && map.corridorFurniture.length > 0) {
    map.corridorFurniture.forEach(f => {
      if (f.solid) solidColliders.push({ x: f.x, y: f.y, w: f.w, h: f.h, isWall: false });
    });
  }
}

function collidesAt(cx, cy, radius) {
  for (let i = 0; i < solidColliders.length; i++) {
    const box = solidColliders[i];
    const nearestX = Math.max(box.x, Math.min(cx, box.x + box.w));
    const nearestY = Math.max(box.y, Math.min(cy, box.y + box.h));
    const dx = cx - nearestX;
    const dy = cy - nearestY;
    if (dx * dx + dy * dy < radius * radius) return true;
  }
  return false;
}

const MAPS = {
  online: null,
  offline: null
};

function shouldUseGrandOnlineHQ() {
  return state.networkMode === 'online' && ((state.hqMinRooms && state.hqMinRooms > 5) || (state.players && state.players.filter(p => p.connected).length > 4));
}

function refreshMapsWithUpgrades() {
  MAPS.online = buildOnlineWalledRoomsMap();
  MAPS.offline = buildOfflineMap();
  rebuildColliders();
}

function currentMap() {
  if (!MAPS.offline) {
    refreshMapsWithUpgrades();
  }
  if (shouldUseGrandOnlineHQ()) {
    return MAPS.online || MAPS.offline;
  }
  return MAPS.offline;
}




function moveWithWallSliding(entity, vx, vy) {
  const r = entity.radius || 14;
  if (!collidesAt(entity.x + vx, entity.y, r)) entity.x += vx;
  if (!collidesAt(entity.x, entity.y + vy, r)) entity.y += vy;
}

function findRoomContaining(px, py) {
  const map = currentMap();
  if (!map || !map.rooms) return null;
  return map.rooms.find(r => r.hasWalls && px >= r.x && px <= r.x + r.w && py >= r.y && py <= r.y + r.h) || null;
}

function buildDoorwayPath(startX, startY, destX, destY) {
  const startRoom = findRoomContaining(startX, startY);
  const destRoom = findRoomContaining(destX, destY);
  const path = [];

  if (startRoom && startRoom === destRoom) {
    path.push({ x: destX, y: destY });
    return path;
  }

  let curX = startX;
  let curY = startY;

  if (startRoom && startRoom.doorInside && startRoom.doorOutside) {
    path.push({ x: startRoom.doorInside.x, y: startRoom.doorInside.y });
    path.push({ x: startRoom.doorOutside.x, y: startRoom.doorOutside.y });
    curX = startRoom.doorOutside.x;
    curY = startRoom.doorOutside.y;
  }

  const targetOutX = destRoom?.doorOutside?.x ?? destX;
  const targetOutY = destRoom?.doorOutside?.y ?? destY;

  if (state.networkMode === 'online' && Math.abs(curY - targetOutY) > 110) {
    const colIdx = Math.max(0, Math.min(9, Math.floor((curX - 140) / 375)));
    const streetX = 140 + colIdx * 375 + 240 + 67;
    path.push({ x: streetX, y: curY });
    path.push({ x: streetX, y: targetOutY });
    path.push({ x: targetOutX, y: targetOutY });
  } else if (Math.abs(curX - targetOutX) > 40) {
    path.push({ x: targetOutX, y: curY });
  }

  if (destRoom && destRoom.doorOutside && destRoom.doorInside) {
    path.push({ x: destRoom.doorOutside.x, y: destRoom.doorOutside.y });
    path.push({ x: destRoom.doorInside.x, y: destRoom.doorInside.y });
  }

  path.push({ x: destX, y: destY });
  return path;
}

function buildClientExitPath(c) {
  const map = currentMap();
  const exitX = (map && map.exitPos) ? map.exitPos.x : 640;
  const exitY = (map && map.exitPos) ? map.exitPos.y : 955;
  return typeof buildDoorwayPath === 'function' ? buildDoorwayPath(c.x, c.y, exitX, exitY) : [{ x: exitX, y: exitY }];
}

// ============================================================================
// CATÁLOGO DOS 18 PUZZLES COOPERATIVOS (6 DE 2P, 6 DE 3P, 6 DE 4P)
// ============================================================================
const COOP_PUZZLES_CATALOG = [
  // 6 Puzzles 2P
  {
    id: 'coop_2p_1', coopPlayers: 2, hqTier: 1,
    title: '2P #1 – Servidor Bancário Hot-Swap PSU & SAS',
    device: '🖥️ Servidor Bancário Hot-Swap',
    stations: [
      { title: 'Estação A (Alimentação Redundante)', options: ['Desligar Chave Geral', 'Ejetar Módulo PSU 02', 'Curto no Barramento'], correctOpt: 1 },
      { title: 'Estação B (Controladora SAS RAID)', options: ['Reconstruir Array SAS', 'Formatar sem Backup', 'Remover Disco Paridade'], correctOpt: 0 }
    ]
  },
  {
    id: 'coop_2p_2', coopPlayers: 2, hqTier: 1,
    title: '2P #2 – Link de Fibra Óptica Dupla & SFP+ 10G',
    device: '⚡ Switch Core 10G SFP+',
    stations: [
      { title: 'Estação A (Transceiver SFP+ Tx/Rx)', options: ['Inverter Fibras Tx/Rx', 'Limpar Conector LC', 'Puxar com Força'], correctOpt: 1 },
      { title: 'Estação B (OTDR & Testador de Perda)', options: ['Atenuação a 0.2dB/km', 'Zerar Potência Óptica', 'Desativar Laser'], correctOpt: 0 }
    ]
  },
  {
    id: 'coop_2p_3', coopPlayers: 2, hqTier: 2,
    title: '2P #3 – Cluster de Virtualização Proxmox HA',
    device: '📦 Nó de Virtualização HA',
    stations: [
      { title: 'Estação A (Migração Dinâmica VM)', options: ['Desconectar Storage', 'Live Migration via Corosync', 'Forçar Desligamento'], correctOpt: 1 },
      { title: 'Estação B (Quórum de Clustering)', options: ['Configurar Quorum Vote', 'Ignorar Heartbeat', 'Reset de Rede'], correctOpt: 0 }
    ]
  },
  {
    id: 'coop_2p_4', coopPlayers: 2, hqTier: 2,
    title: '2P #4 – Firewall FortiGate HA & Túnel IPsec',
    device: '🛡️ Firewall FortiGate HA',
    stations: [
      { title: 'Estação A (Sincronia Heartbeat HA)', options: ['Cabo Cruzado Porta HA', 'Liberar Any Any', 'Trocar MAC Manual'], correctOpt: 0 },
      { title: 'Estação B (Criptografia Fase 1 & 2)', options: ['DES 56-bit Fraco', 'AES-256 + SHA-384 DH14', 'Sem Chave Pré-Compartilhada'], correctOpt: 1 }
    ]
  },
  {
    id: 'coop_2p_5', coopPlayers: 2, hqTier: 3,
    title: '2P #5 – Banco de Dados PostgreSQL & WAL Streaming',
    device: '💽 Cluster PostgreSQL 16',
    stations: [
      { title: 'Estação A (Promoção de Réplica Read-Only)', options: ['Promover Standby a Primary', 'Deletar base de dados', 'Travar pg_stat'], correctOpt: 0 },
      { title: 'Estação B (Arquivo WAL e Replicação)', options: ['Desligar wal_receiver', 'Sincronizar LSN e Slots', 'Deletar pg_wal'], correctOpt: 1 }
    ]
  },
  {
    id: 'coop_2p_6', coopPlayers: 2, hqTier: 3,
    title: '2P #6 – Storage All-Flash NVMe-oF & RDMA',
    device: '⚡ SAN NVMe-oF 100Gbps',
    stations: [
      { title: 'Estação A (Configuração RoCEv2)', options: ['Habilitar PFC e ECN', 'Desativar MTU 9000', 'Ignorar QCN'], correctOpt: 0 },
      { title: 'Estação B (Mapeamento de Namespaces)', options: ['Excluir Volume LUN', 'Mapear NQN no Subsystem', 'Ativar Cache L1'], correctOpt: 1 }
    ]
  },

  // 6 Puzzles 3P
  {
    id: 'coop_3p_1', coopPlayers: 3, hqTier: 2,
    title: '3P #1 – Cluster Kubernetes Ingress & Cert-Manager',
    device: '☸️ Cluster K8s Control Plane',
    stations: [
      { title: 'Estação A (DNS Core & MetalLB)', options: ['Configurar IP Pool VIP', 'Bloquear porta 53', 'Deletar CNI'], correctOpt: 0 },
      { title: 'Estação B (Ingress NGINX Controller)', options: ['Desinstalar Pods', 'Reescrever Rotas SSL', 'Forçar HTTP 80'], correctOpt: 1 },
      { title: 'Estação C (Cert-Manager Let\'s Encrypt)', options: ['Emitir Certificado TLS ACME', 'Ignorar Challenge HTTP', 'Excluir Secret'], correctOpt: 0 }
    ]
  },
  {
    id: 'coop_3p_2', coopPlayers: 3, hqTier: 2,
    title: '3P #2 – Estação de Transmissão 4K SDI & OBS NDI',
    device: '🎥 Ilha de Produção Broadcast 4K',
    stations: [
      { title: 'Estação A (Matriz SDI 12G)', options: ['Travar Genlock Blackburst', 'Desconectar BNC', 'Inverter Áudio'], correctOpt: 0 },
      { title: 'Estação B (Encoder Hardware AV1)', options: ['Buffer em 0kbps', '60 FPS CBR 25.000 kbps', 'Resolução 480p'], correctOpt: 1 },
      { title: 'Estação C (Mixer DANTE Áudio IP)', options: ['PTP Clock Master Lock', 'Mute Geral', 'Sem Sincronia'], correctOpt: 0 }
    ]
  },
  {
    id: 'coop_3p_3', coopPlayers: 3, hqTier: 3,
    title: '3P #3 – Mainframe IBM Z & Emulador 3270',
    device: '🏛️ Mainframe Corporativo z/OS',
    stations: [
      { title: 'Estação A (IPL & Carregamento do Kernel)', options: ['Carregar IPL no Endereço 0A0', 'Desligar CBU', 'Desativar LPAR'], correctOpt: 0 },
      { title: 'Estação B (Sessão TSO/ISPF & JCL)', options: ['Submeter Job de Reorganização', 'Deletar Catálogo VSAM', 'Cancelar CICS'], correctOpt: 0 },
      { title: 'Estação C (DASD Array & FICON)', options: ['Zerar Volser', 'Validar Canais FICON Redundantes', 'Desmontar Sysplex'], correctOpt: 1 }
    ]
  },
  {
    id: 'coop_3p_4', coopPlayers: 3, hqTier: 3,
    title: '3P #4 – Farm de Render 3D Blender Cycles & OptiX',
    device: '🎬 Render Farm 8x RTX 4090',
    stations: [
      { title: 'Estação A (Distribuidor de Tiles)', options: ['Dividir Cenas em 512x512 Tiles', 'Renderizar em 1 Core', 'Travar VRAM'], correctOpt: 0 },
      { title: 'Estação B (Drivers CUDA & OptiX Denoise)', options: ['Desativar RT Cores', 'Compilar Shaders OptiX AI', 'Drivers Legados de 2018'], correctOpt: 1 },
      { title: 'Estação C (Storage NFS Cache SSD)', options: ['Desativar Cache', 'Alocar 128GB RAM Drive p/ Texturas', 'Apagar Assets'], correctOpt: 1 }
    ]
  },
  {
    id: 'coop_3p_5', coopPlayers: 3, hqTier: 4,
    title: '3P #5 – NOC Telecom GPON & OLT 128 Clientes',
    device: '🌐 Chassi OLT GPON 16 Portas',
    stations: [
      { title: 'Estação A (Alinhamento Laser B+ / C+)', options: ['Potência Óptica +3dBm a +7dBm', 'Desligar Laser Diode', 'Superaquecer Módulo'], correctOpt: 0 },
      { title: 'Estação B (Provisionamento DBA & T-CONT)', options: ['Limitar banda a 10kbps', 'Vincular Perfil T-CONT Tipo 4', 'Bloquear OMCI'], correctOpt: 1 },
      { title: 'Estação C (Sincronia VLAN Q-in-Q)', options: ['Adicionar Service Tag 802.1ad', 'Desativar Switching', 'Inverter Portas Uplink'], correctOpt: 0 }
    ]
  },
  {
    id: 'coop_3p_6', coopPlayers: 3, hqTier: 4,
    title: '3P #6 – Supercomputador Slurm & InfiniBand NDR',
    device: '⚛️ Cluster HPC InfiniBand 400G',
    stations: [
      { title: 'Estação A (Subnet Manager OpenSM)', options: ['Iniciar Subnet Manager NDR', 'Zerar GUIDs', 'Desativar Switches'], correctOpt: 0 },
      { title: 'Estação B (Fila Slurm Workload Manager)', options: ['Travar Nó em DRAIN', 'Alocar Partição GPU c/ Prioridade', 'Apagar slurmctld'], correctOpt: 1 },
      { title: 'Estação C (MPI & Comunicação RDMA)', options: ['Executar Benchmark All-Reduce', 'Bloquear portas MPI', 'Desativar CUDA-Aware'], correctOpt: 0 }
    ]
  },

  // 6 Puzzles 4P
  {
    id: 'coop_4p_1', coopPlayers: 4, hqTier: 3,
    title: '4P #1 – NOC Datacenter Tier III: Gerador, BGP & SAN',
    device: '🏢 Datacenter Tier III Completo',
    stations: [
      { title: 'Técnico 1 (Grupo Gerador Diesel & ATS)', options: ['Iniciar Partida Automática ATS', 'Drenar Tanque de Combustível', 'Desarmar Disjuntor Principal'], correctOpt: 0 },
      { title: 'Técnico 2 (Roteamento BGP & ASN)', options: ['Anunciar Prefixo /24 para Upstreams', 'Retirar Anúncio BGP', 'Filtrar Toda a Tabela Global'], correctOpt: 0 },
      { title: 'Técnico 3 (Ar-Condicionado de Precisão CRAC)', options: ['Temperatura em 21°C e Umidade 45%', 'Desligar Chiller', 'Subir para 50°C'], correctOpt: 0 },
      { title: 'Técnico 4 (SAN Fibre Channel Brocade)', options: ['Zoneamento WWN Ativo', 'Desativar Portas FC', 'Zerar Fabric OS'], correctOpt: 0 }
    ]
  },
  {
    id: 'coop_4p_2', coopPlayers: 4, hqTier: 3,
    title: '4P #2 – Resposta a Incidente Ransomware & SOC',
    device: '🚨 Sala de Crise SOC & CSIRT',
    stations: [
      { title: 'Técnico 1 (Isolamento de Rede Zero-Trust)', options: ['Bloquear Tráfego Leste-Oeste', 'Liberar RDP Global', 'Desligar IDS'], correctOpt: 0 },
      { title: 'Técnico 2 (Dump de Memória Forense RAM)', options: ['Extrair Chaves RSA da Volatilidade', 'Reiniciar Máquina Infectada', 'Sobrescrever RAM'], correctOpt: 0 },
      { title: 'Técnico 3 (Active Directory Kerberos & Krbtgt)', options: ['Reset Duplo da Conta Krbtgt', 'Dar Admin a Todos', 'Desinstalar AD DC'], correctOpt: 0 },
      { title: 'Técnico 4 (Restauração Air-Gapped Imutável)', options: ['Restaurar Snapshot WORM Off-line', 'Formatar sem Backup', 'Pagar Resgate em Bitcoin'], correctOpt: 0 }
    ]
  },
  {
    id: 'coop_4p_3', coopPlayers: 4, hqTier: 4,
    title: '4P #3 – Usina Nuclear SCADA / PLC & Sistema de Resfriamento',
    device: '☢️ Sistema SCADA Reator Crítico',
    stations: [
      { title: 'Técnico 1 (Válvula de Alívio Primária)', options: ['Pressurizar a 155 Bar Nominal', 'Fechar Todas as Válvulas', 'Drenar Fluido Refrigerante'], correctOpt: 0 },
      { title: 'Técnico 2 (Barras de Controle de Boro)', options: ['Inserir Barras a 78% p/ Estabilizar', 'Ejetar Barras de Controle', 'Travar Mecanismo'], correctOpt: 0 },
      { title: 'Técnico 3 (Barramento Modbus TCP Redundante)', options: ['Sincronizar PLC Master e Standby', 'Enviar Pacotes Broadcast Loop', 'Cortar Linha Serial'], correctOpt: 0 },
      { title: 'Técnico 4 (Turbina a Vapor e Gerador 1.2GW)', options: ['Sincronizar Fase 60Hz com a Rede', 'Acelerar sem Carga', 'Desconectar Excitatriz'], correctOpt: 0 }
    ]
  },
  {
    id: 'coop_4p_4', coopPlayers: 4, hqTier: 4,
    title: '4P #4 – Missão Aeroespacial & Telemetria de Satélite LEO',
    device: '🛰️ Estação de Solo & Satélite LEO',
    stations: [
      { title: 'Técnico 1 (Antena Parabólica Azimute & Elevação)', options: ['Acompanhamento Doppler Automático', 'Desapontar Antena', 'Travar Motores'], correctOpt: 0 },
      { title: 'Técnico 2 (Orientação Giroscópios & Magnetorquers)', options: ['Estabilizar 3 Eixos Apontado à Terra', 'Girar em Descontrole', 'Descarregar Baterias'], correctOpt: 0 },
      { title: 'Técnico 3 (Link de Descarga Banda X 800Mbps)', options: ['Desmodulação QPSK e Correção FEC', 'Inverter Polarização', 'Desligar Transmissor'], correctOpt: 0 },
      { title: 'Técnico 4 (Painéis Solares & Controle Térmico)', options: ['Orientar Painéis em 90° ao Sol', 'Bloquear Painéis na Sombra', 'Desativar Aquecedores'], correctOpt: 0 }
    ]
  },
  {
    id: 'coop_4p_5', coopPlayers: 4, hqTier: 4,
    title: '4P #5 – Acelerador de Partículas & Eletroímãs Supercondutores',
    device: '🔬 Túnel do Acelerador Síncrotron',
    stations: [
      { title: 'Técnico 1 (Criogenia de Hélio Líquido 1.9K)', options: ['Pressão de Hélio Estável a 1.9 Kelvin', 'Subir Temperatura para 100K', 'Ventilar Hélio'], correctOpt: 0 },
      { title: 'Técnico 2 (Fonte de Corrente DC 12.000A)', options: ['Rampa Gradual de 12.000A sem Quench', 'Queda Abrupta de Corrente', 'Sobrecarregar Bobina'], correctOpt: 0 },
      { title: 'Técnico 3 (Câmaras de Vácuo Ultra-Alto UHV)', options: ['Vácuo Ultra-Alto 10^-10 Torr', 'Abrir Válvula de Ar', 'Desligar Bombas Turbo'], correctOpt: 0 },
      { title: 'Técnico 4 (Cavidades de Radiofrequência RF)', options: ['Injetar Pulso RF 400MHz em Fase', 'Desfasear Feixe de Prótons', 'Emitir Harmônicos Ruído'], correctOpt: 0 }
    ]
  },
  {
    id: 'coop_4p_6', coopPlayers: 4, hqTier: 4,
    title: '4P #6 – Computador Quântico Criogênico Qubit Decoherence',
    device: '❄️ Diluição Quântica 15mK & 128 Qubits',
    stations: [
      { title: 'Técnico 1 (Refrigerador de Diluição He3/He4)', options: ['Temperatura Base em 15 Milikelvin', 'Desligar Bomba Criogênica', 'Aquecer Criostato'], correctOpt: 0 },
      { title: 'Técnico 2 (Micro-ondas Pulsadas & Portas Lógicas)', options: ['Calibrar Pulsos π/2 com Portas Hadamard', 'Ruído Gaussiano Descalibrado', 'Aumentar Amplitude ao Máximo'], correctOpt: 0 },
      { title: 'Técnico 3 (Blindagem Magnética Mu-Metal)', options: ['Campo Magnético Residual < 1 nT', 'Colocar Imã de Neodímio', 'Retirar Blindagem'], correctOpt: 0 },
      { title: 'Técnico 4 (Correção de Erro Quântico Surface Code)', options: ['Medição de Síndromes X e Z Contínua', 'Ignorar Bit-Flips e Phase-Flips', 'Zerar Estados de Prova'], correctOpt: 0 }
    ]
  }
];

function buildCoopTemplateFromCatalog(puz) {
  return {
    clientName: 'Chamado Corporativo ' + puz.title,
    urgency: 'Co-op ' + puz.coopPlayers + 'P',
    tagClass: 'tag-urgente',
    hqTier: puz.hqTier || 1,
    coopPlayers: puz.coopPlayers,
    device: puz.device || 'Cluster Co-op',
    quote: 'Precisamos de ' + puz.coopPlayers + ' técnicos operando juntos neste sistema!',
    mentorHint: 'Chame os outros técnicos para sincronizarem suas estações!',
    minigameType: puz.id,
    requiredPart: 'cpu_ram',
    questions: [],
    tools: [],
    diagnoses: []
  };
}

function getUnlockedTemplates() {
  if (typeof COOP_PUZZLES_CATALOG !== 'undefined' && Array.isArray(COOP_PUZZLES_CATALOG)) {
    const curTier = typeof getCurrentHQTier === 'function' ? getCurrentHQTier() : 1;
    return COOP_PUZZLES_CATALOG.filter(p => (p.hqTier || 1) <= curTier);
  }
  return [];
}

function getWaitingSlotPosition(slotIdx) {
  const map = currentMap();
  if (map && map.waitingSlots && map.waitingSlots.length > 0) {
    const idx = Math.min(slotIdx, map.waitingSlots.length - 1);
    return map.waitingSlots[idx];
  }
  return { x: 500, y: 550 };
}

function createInitialMinigameState() {
  return {
    coopSelectedOpt: [null, null, null, null],
    coopStations: [false, false, false, false],
    cpuCleaned: false,
    cpuPasted: false,
    ramSlots: [false, false, false, false],
    rj45Order: [],
    t568bTarget: [
      { id: 'bl', name: 'Branco-Laranja', color: 'linear-gradient(90deg, #fff 50%, #f97316 50%)' },
      { id: 'l',  name: 'Laranja',        color: '#f97316' },
      { id: 'bv', name: 'Branco-Verde',   color: 'linear-gradient(90deg, #fff 50%, #22c55e 50%)' },
      { id: 'a',  name: 'Azul',           color: '#3b82f6' },
      { id: 'ba', name: 'Branco-Azul',    color: 'linear-gradient(90deg, #fff 50%, #3b82f6 50%)' },
      { id: 'v',  name: 'Verde',          color: '#22c55e' },
      { id: 'bm', name: 'Branco-Marrom',  color: 'linear-gradient(90deg, #fff 50%, #78350f 50%)' },
      { id: 'm',  name: 'Marrom',         color: '#78350f' }
    ],
    selectedPsuCable: null,
    selectedPsuTarget: null,
    psuConnected: { atx24: false, eps8: false, pcie8: false, sata: false },
    standoffs9: [false, false, false, false, false, false, false, false, false],
    moboMounted: false,
    cpuLocked: false,
    bitA: 0,
    bitB: 1,
    bitC: 1,

    // Hardware Mini-Games
    dustSpots: [1, 1, 1, 1, 1, 1],
    crustScraped: [false, false, false],
    newPasteApplied: false,
    fanHairsRemoved: [false, false, false],
    fanOiled: [false, false, false],
    roachesCleared: [false, false, false, false, false],
    eggsDisinfected: false,
    bentPins: [false, false, false, false],
    oxidationCleaned: [false, false, false, false],
    cmosTested: false,
    cmosReplaced: false,
    clrCmosJumper: false,
    fittingsTightened: [false, false, false],
    bubblesPurged: false,
    gapMm: 2.5,
    voltageTen: 100,
    fanPct: 30,
    smdPads: [
      { id: 0, label: 'Fase 1 (MOSFET)', bad: true, fixed: false },
      { id: 1, label: 'Fase 2 (MOSFET)', bad: true, fixed: false },
      { id: 2, label: 'Fase 3 (MOSFET)', bad: true, fixed: false },
      { id: 3, label: 'Fase 4 (MOSFET)', bad: true, fixed: false }
    ],
    ihsRemoved: false,
    kaptonApplied: false,
    liquidMetalSpread: false,

    // Software Mini-Games
    trojans: [
      { id: 0, name: 'svch0st.exe', bad: true, quarantined: false },
      { id: 1, name: 'explorer.exe', bad: false, quarantined: false },
      { id: 2, name: 'winlogin.scr', bad: true, quarantined: false },
      { id: 3, name: 'RuntimeBroker.exe', bad: false, quarantined: false }
    ],
    cookieCategories: {
      supercookies: false,
      telemetry: false,
      shadow_history: false,
      ad_beacons: false
    },
    popups: [
      { id: 0, title: '⚠️ SEU PC ESTÁ INFECTADO COM 99 VÍRUS!', closed: false },
      { id: 1, title: '🎉 PARABÉNS! VOCÊ É O VISITANTE 1.000.000!', closed: false },
      { id: 2, title: '⚡ ACELERE SUA INTERNET EM 500% AGORA!', closed: false },
      { id: 3, title: '🛡️ ATUALIZAÇÃO CRÍTICA DO SEU NAVEGADOR!', closed: false },
      { id: 4, title: '🎁 VOCÊ GANHOU UM IPHONE 15 PRO MAX GRÁTIS!', closed: false }
    ],
    defragBlocks: [1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1],
    bsodLogs: [
      { id: 0, name: 'Dump 0x00000116 (VIDEO_TDR_ERROR)', driver: 'nvlddmkm.sys', isolated: false },
      { id: 1, name: 'Dump 0x0000007E (SYSTEM_THREAD_EXCEPTION)', driver: 'atikmpag.sys', isolated: false }
    ],
    missingDlls: [
      { id: 0, name: 'MSVCP140.dll (Visual C++ Redistributable)', fixed: false },
      { id: 1, name: 'VCRUNTIME140.dll (C++ Runtime Engine)', fixed: false },
      { id: 2, name: 'D3DCOMPILER_47.dll (DirectX Shader Compiler)', fixed: false }
    ],
    biosProgress: 0,
    voltageDial: 1.2,
    processes: [
      { id: 0, name: 'xmrig_silent.exe', cpu: '58%', malicious: true, killed: false, desc: 'Minerador Monero em segundo plano' },
      { id: 1, name: 'system_idle.exe', cpu: '0%', malicious: false, killed: false, desc: 'Processo ocioso legítimo' },
      { id: 2, name: 'cryptonight_worker.exe', cpu: '41%', malicious: true, killed: false, desc: 'Processo malicioso de injeção de CPU' },
      { id: 3, name: 'taskmgr.exe', cpu: '1%', malicious: false, killed: false, desc: 'Gerenciador de Tarefas do Windows' }
    ],
    bcdSteps: [
      { id: 0, cmd: 'bootrec /fixmbr', done: false },
      { id: 1, cmd: 'bootrec /fixboot', done: false },
      { id: 2, cmd: 'bootrec /rebuildbcd', done: false }
    ],
    dduSafeMode: false,
    dduDriverRemoved: false,
    dduRegistryCleaned: false,
    bloatwareList: [
      { id: 0, name: 'Baidu Antivirus & PC Faster (Trial Chato)', uninstalled: false },
      { id: 1, name: 'McAfee LiveSafe 30-Dias (Pop-ups Invasivos)', uninstalled: false },
      { id: 2, name: 'WildTangent Games Arcade (Jogos Piratas)', uninstalled: false },
      { id: 3, name: 'Ask.com Toolbar & Search Assistant', uninstalled: false }
    ],
    rsaHexBlocks: [
      { id: 0, code: '0x7F2A_B4', solved: false },
      { id: 1, code: '0x9C11_E0', solved: false },
      { id: 2, code: '0x3D88_F5', solved: false },
      { id: 3, code: '0xAA55_01', solved: false }
    ],
    firewallPorts: [
      { id: 0, port: 4444, name: 'Metasploit Backdoor Handler', mustBlock: true, blocked: false },
      { id: 1, port: 1337, name: 'Elite Hacker Trojan Port', mustBlock: true, blocked: false },
      { id: 2, port: 443, name: 'Tráfego Web HTTPS Criptografado', mustBlock: false, blocked: false }
    ],
    tempCleanPurged: [false, false, false, false],
    cryptoSeedUser: []
  };
}


// ============================================================================
// CATÁLOGO DOS 30 TEMAS (15 HARDWARE + 15 SOFTWARE) COM PERGUNTAS, TESTES E DIAGNÓSTICOS
// ============================================================================
const SOLO_THEMES_CATALOG = [{"minigameType": "dust_blower", "requiredPart": "dust_cleaner", "urgency": "Limpeza Física", "tagClass": "tag-alerta", "variations": [{"theme": "Gabinete com 3kg de Poeira e Teias de Aranha", "quote": "\"Meu ${d} parece uma múmia do Egito! Quando ligo, sobe um tornado de poeira cinza e o cooler nem consegue girar de tanta teia!\"", "questions": [{"q": "1. Há quanto tempo esse computador não é aberto?", "a": "\"Comprei em 2011 e nunca tirei a tampa lateral, virou um fóssil!\""}, {"q": "2. As ventoinhas tentam girar?", "a": "\"Dão meia volta, engasgam num tufo de pelo de gato e param!\""}, {"q": "3. Você tentou limpar com pano úmido?", "a": "\"Quase joguei água sanitária, mas fiquei com medo de dar curto.\""}, {"q": "4. O computador desliga por superaquecimento?", "a": "\"Bate 95°C só de olhar para a área de trabalho!\""}], "tools": [{"name": "🔍 1. Inspeção Visual de Chassi", "result": "Camada de 1.5cm de poeira compactada nas aletas do dissipador e teias no VRM."}, {"name": "🌡️ 2. Sensor Térmico em Idle", "result": "92°C na CPU devido a fluxo de ar 100% bloqueado."}, {"name": "💨 3. Anemômetro de Bancada", "result": "Vazão de ar: 0 CFM. Bloqueio mecânico total."}], "correct": {"title": "Usar Soprador Antiestático, Pincel Macio e Desobstruir Aletas do Dissipador", "desc": "Remove toda a poeira e teias sem gerar eletricidade estática, restaurando fluxo de ar."}, "wrongs": [{"title": "Lavar o Chassi com Mangueira de Pressão de Lavajato Ligado na Tomada", "desc": "Jato de água de alta pressão.", "burnReason": "A água sob pressão destruiu todos os componentes e explodiu a fonte!"}, {"title": "Tocar Fogo com Isqueiro nas Teias de Aranha Dentro do Gabinete", "desc": "Queimar as teias com chama.", "burnReason": "As partes plásticas pegaram fogo e o gabinete inteiro derreteu!"}]}]}, {"minigameType": "thermal_spatula", "requiredPart": "cpu_ram", "urgency": "Limpeza Física", "tagClass": "tag-urgente", "variations": [{"theme": "Pasta Térmica Original Petrificada Há 8 Anos", "quote": "\"O processador do meu ${d} virou uma chapa de hamburgueria! A pasta térmica secou tanto que parece cimento Portland colado no silício!\"", "questions": [{"q": "1. O dissipador sai facilmente?", "a": "\"Parece soldado! Tive medo de arrancar o soquete junto se puxasse forte.\""}, {"q": "2. Qual a consistência da pasta?", "a": "\"Uma casca dura e quebradiça que solta lascas marrons.\""}, {"q": "3. A temperatura bate 100°C?", "a": "\"Basta abrir o bloco de notas que ele já começa a apitar de febre!\""}, {"q": "4. Você tem pasta nova?", "a": "\"Não, achei que pasta térmica vinha com validade eterna.\""}], "tools": [{"name": "🔬 1. Teste de Resistência Térmica", "result": "Zero transferência de calor condutiva. Pasta totalmente cristalizada."}, {"name": "🌡️ 2. Termografia do Die", "result": "Hotspot de 104°C no núcleo central."}, {"name": "🧴 3. Análise de Solvência", "result": "Requer solvente isopropílico e raspador não abrasivo."}], "correct": {"title": "Remover Crosta com Espátula Plástica, Limpar Die com Álcool Isopropílico e Aplicar Pasta de Prata", "desc": "Restaura a condutividade térmica perfeita entre o die da CPU e a base do cooler."}, "wrongs": [{"title": "Raspar a Crosta Usando uma Furadeira com Broca de Concreto", "desc": "Remoção com furadeira.", "burnReason": "A broca perfurou o die de silício e destruiu o soquete da placa-mãe!"}, {"title": "Passar Super Cola Instantânea para Colar o Cooler no Silício", "desc": "Colar com cianoacrilato.", "burnReason": "A cola isolou o calor e o processador fritou até rachar em dois!"}]}]}, {"minigameType": "fan_unjam", "requiredPart": "dust_cleaner", "urgency": "Hardware", "tagClass": "tag-alerta", "variations": [{"theme": "Ventoinhas Enroscadas com Cabelo e Mancal Seco", "quote": "\"As ventoinhas do meu ${d} estão gritando como uma taquara rachada! Estão cheias de fios de cabelo e não giram mais direito!\"", "questions": [{"q": "1. O barulho é constante?", "a": "\"Parece um helicóptero caindo quando ligo o computador!\""}, {"q": "2. Tem animais de estimação perto do PC?", "a": "\"Dois gatos persas que adoram dormir em cima do exaustor!\""}, {"q": "3. As pás da hélice estão quebradas?", "a": "\"Estão inteiras, mas travadas por uma peruca de fios enrolados no eixo.\""}, {"q": "4. O motor está quente ao toque?", "a": "\"A carcaça plástica do cooler está quase derretendo de esforço.\""}], "tools": [{"name": "🔍 1. Estroboscópio Óptico", "result": "Ventoinha girando a apenas 320 RPM (esperado: 2200 RPM)."}, {"name": "🪛 2. Teste de Rotação Manual", "result": "Eixo emperrado por fios de nylon e resíduos de poeira no rolamento."}, {"name": "🌡️ 3. Termômetro do Motor", "result": "Bobina do fan a 80°C por sobrecarga mecânica."}], "correct": {"title": "Remover Resíduos com Pinça Cirúrgica, Limpar Eixo e Aplicar Micro-Gota de Óleo Sintético", "desc": "Libera a rotação mecânica e lubrifica o mancal de rolamento para máxima durabilidade."}, "wrongs": [{"title": "Injetar Óleo de Cozinha Velho de Fritura de Pastel no Motor", "desc": "Óleo vegetal culinário.", "burnReason": "O óleo vegetal esquentou, virou graxa grudenta e travou o cooler em chamas!"}, {"title": "Quebrar as Pás Travadas com Alicate de Bico pra Fazer Vento Rápido", "desc": "Arrancar as pás do fan.", "burnReason": "O desbalanceamento quebrou o eixo em alta velocidade estilhaçando a carcaça!"}]}]}, {"minigameType": "cockroach_nest", "requiredPart": "dust_cleaner", "urgency": "Limpeza Crítica", "tagClass": "tag-critica", "variations": [{"theme": "Colônia de Baratas Alemãs Morando na Fonte de 750W", "quote": "\"Socorro! Fui ligar meu ${d} e saiu faísca com cheiro de inseto assado! Tem anteninhas saindo pela grade da fonte de energia!\"", "questions": [{"q": "1. O PC estava em local úmido ou perto da cozinha?", "a": "\"Ficava no chão embaixo da pia da lanchonete!\""}, {"q": "2. Você viu insetos andando por dentro?", "a": "\"Uma família inteira com filhotes passeando nos capacitores!\""}, {"q": "3. A fonte ainda dá sinal de vida?", "a": "\"Dá um estalo forte e desarma o disjuntor da casa inteira.\""}, {"q": "4. Tem ninho com ovos na placa?", "a": "\"Está cheio de casulos marrons atrás da bobina indutora.\""}], "tools": [{"name": "🔍 1. Endoscópio de Bancada", "result": "Carcaça de baratas fechando contato elétrico entre a linha primária de 380V e o terra."}, {"name": "⚡ 2. Medidor de Curto-Circuito", "result": "Resistência de 0.2 Ohms provocada por carcaça condutiva de pragas."}, {"name": "🧴 3. Reagente Químico Sanitizante", "result": "Necessário expurgo total a seco com aspirador antiestático e sanitizante."}], "correct": {"title": "Aspirar Insetos com Sugador Antiestático, Descontaminar Carcaça e Trocar Isoladores", "desc": "Elimina os condutores biológicos em curto e higieniza a placa da fonte de alimentação."}, "wrongs": [{"title": "Espirrar Inseticida Spray Aerossol Altamente Inflamável com PC Ligado", "desc": "Inseticida inflamável na fonte.", "burnReason": "O gás do spray entrou em combustão com as faíscas da fonte e explodiu o laboratório!"}, {"title": "Mergulhar a Fonte Aberta em Bacia com Álcool 70% Conectada na Força", "desc": "Banho de álcool ligado.", "burnReason": "Arco voltaico de alta tensão eletrocutou a bancada e pulverizou a fonte!"}]}]}, {"minigameType": "socket_pins", "requiredPart": "mobo_build", "urgency": "Hardware", "tagClass": "tag-urgente", "variations": [{"theme": "Pinos do Soquete LGA1700 Entortados por Dedo Apressado", "quote": "\"Fui tirar o plástico protetor do soquete do ${d} com uma chave de fenda e esbarrei nos pinos! Agora tem 4 pinos deitados e o PC não liga nem com reza!\"", "questions": [{"q": "1. Quantos pinos parecem fora do alinhamento?", "a": "\"Vejo uns 4 pinos brilhando tortos para a esquerda sob a luz.\""}, {"q": "2. Você tentou ligar o processador com os pinos tortos?", "a": "\"Coloquei o Core i9 por cima e apertei a alavanca, ouvi um estalo.\""}, {"q": "3. A placa-mãe mostra código de erro?", "a": "\"Debug LED trava em CPU (vermelho) sem dar vídeo.\""}, {"q": "4. Algum pino chegou a quebrar?", "a": "\"Parecem apenas entortados, nenhum decepou ainda.\""}], "tools": [{"name": "🔬 1. Microscópio Estereoscópico", "result": "Pinos A1, B3, C7 e D4 inclinados em 45°. Curto entre linhas VCC e SENSE."}, {"name": "⚡ 2. Teste de Linha de Alimentação", "result": "Pino VCCSA em contato indevido com terra."}, {"name": "🪡 3. Inspeção de Elasticidade do Ouro", "result": "Pinos conservam maleabilidade para desentortar com ponta ultrafina."}], "correct": {"title": "Alinhar Pinos Sob Microscópio com Pinça de Precisão e Agulha Cirúrgica em 90°", "desc": "Restaura a geometria original dos contatos do soquete sem quebrar as hastes douradas."}, "wrongs": [{"title": "Passar um Rolo de Massa de Pastel com Força por Cima do Soquete", "desc": "Pressionar com rolo pesado.", "burnReason": "O rolo amassou e decepou todos os 1700 pinos do soquete de uma vez só!"}, {"title": "Lixar os Pinos Tortos com Lixa de Ferro Grossa até Nivelar", "desc": "Desgastar contatos.", "burnReason": "A lixa destruiu a camada condutiva de ouro e inutilizou permanentemente a placa-mãe!"}]}]}, {"minigameType": "ram_contacts", "requiredPart": "cpu_ram", "urgency": "Limpeza Física", "tagClass": "tag-alerta", "variations": [{"theme": "Contatos Dourados da Memória RAM Oxidados com Azinhavre", "quote": "\"O meu ${d} dá 3 beeps longos e não liga! Tirei os pentes de memória e os contatos dourados estão verdes e manchados parecendo moeda velha enterrada!\"", "questions": [{"q": "1. O ambiente onde o PC fica tem maresia ou umidade?", "a": "\"Moro a 20 metros da praia de Santos, a maresia come tudo aqui!\""}, {"q": "2. O pente está bem firme no slot?", "a": "\"Encaixei várias vezes mas a máquina só apita sem reconhecer a memória.\""}, {"q": "3. A oxidação está cobrindo muitos pinos?", "a": "\"Pelo menos uns 6 contatos dourados estão escurecidos e sem brilho.\""}, {"q": "4. Você já limpou contatos antes?", "a": "\"Ouvi dizer que passar borracha escolar branca resolve na hora!\""}], "tools": [{"name": "🔍 1. Lupa de Precisão 20x", "result": "Camada de óxido de cobre (azinhavre) isolando 6 pinos de dados DDR."}, {"name": "⚡ 2. Ohmímetro de Alta Precisão", "result": "Resistência infinita (circuito aberto) nos barramentos DQ0-DQ5."}, {"name": "🧽 3. Teste de Abrasão Leve", "result": "Remoção com elastômero isento de resíduos recupera 100% da condutividade."}], "correct": {"title": "Friccionar Borracha Branca Macia nos Contatos até Obter Brilho Espelhado e Limpar Resíduos", "desc": "Remove a película de oxidação isolante sem danificar a camada nobre de ouro dos contatos."}, "wrongs": [{"title": "Mergulhar a Memória RAM em Ácido Muriático para Corroer a Sujeira", "desc": "Corrosão química com ácido.", "burnReason": "O ácido dissolveu todas as trilhas de cobre e os chips de silício da memória!"}, {"title": "Raspar os Contatos com Bombril Seco Ligado na Tomada para Tirar Faísca", "desc": "Palha de aço condutiva.", "burnReason": "Os fiapos de aço entraram no slot, deram curto maciço e queimaram o chipset!"}]}]}, {"minigameType": "cmos_battery", "requiredPart": "cmos_bios", "urgency": "Hardware", "tagClass": "tag-alerta", "variations": [{"theme": "Bateria CR2032 Zerada e Relógio Voltando para 1970", "quote": "\"Toda vez que desligo o ${d} da tomada, ele esquece a data e hora, volta para 01/01/1970 e pede F1 para entrar no Setup da BIOS!\"", "questions": [{"q": "1. Você já trocou essa bateria tipo moeda alguma vez?", "a": "\"Essa bateria veio de fábrica quando o PC foi montado em 2015!\""}, {"q": "2. As configurações de XMP e boot se perdem?", "a": "\"Perde tudo! Tenho que configurar o SSD de boot manualmente todo dia.\""}, {"q": "3. A bateria está estufada ou vazando líquido?", "a": "\"Está desbotada e sem pressão na trava metálica do soquete.\""}, {"q": "4. A data errada impede navegação na internet?", "a": "\"Sim! Todos os sites dão erro de certificado SSL inválido!\""}], "tools": [{"name": "⚡ 1. Multímetro Digital DC", "result": "Tensão da bateria atual: 0.92V (Mínimo operacional: 2.80V, Nominal: 3.00V)."}, {"name": "💾 2. Leitor de NVRAM BIOS", "result": "Checksum Error permanente ao cortar alimentação da rede elétrica."}, {"name": "🔌 3. Diagnóstico de RTC (Real Time Clock)", "result": "Oscilador de 32.768 kHz parando por falta de polarização de backup."}], "correct": {"title": "Substituir Bateria Esgotada por Nova CR2032 de Lítio 3V e Resetar Jumper CLR_CMOS", "desc": "Restaura a retenção de dados da memória CMOS e a precisão do relógio em tempo real do sistema."}, "wrongs": [{"title": "Ligar Fios da Tomada de 110V Direto no Soquete da Bateria Moeda", "desc": "Injetar 110V no circuito CMOS.", "burnReason": "A sobretensão de 110V explodiu o chip Super I/O e a ponte sul da placa-mãe!"}, {"title": "Tentar Recarregar a Pilha de Lítio Comum no Fogão a Gás", "desc": "Aquecer bateria no fogo.", "burnReason": "A bateria de lítio estourou com o calor e lançou estilhaços na cozinha!"}]}]}, {"minigameType": "custom_water_leak", "requiredPart": "watercooler_wires", "urgency": "Hardware Crítico", "tagClass": "tag-critica", "variations": [{"theme": "Gotejamento de Fluido Azul nos Conectores da Placa de Vídeo", "quote": "\"O water cooler custom do meu ${d} está vazando gotas de corante azul direto no conector PCIe da placa de vídeo de 15 mil reais!\"", "questions": [{"q": "1. Onde você notou o início do vazamento?", "a": "\"Bem na rosca do fitting angular perto do reservatório da bomba!\""}, {"q": "2. Você apertou as roscas com a mão ou ferramenta?", "a": "\"Achei que rosca de acrílico só precisava de um toquezinho frouxo.\""}, {"q": "3. A bomba está fazendo barulho de sucção de ar?", "a": "\"Está borbulhando alto porque o nível de fluido está baixando rápido!\""}, {"q": "4. O líquido chegou a pingar na placa ligada?", "a": "\"Desliguei correndo assim que vi a primeira gota escorrendo pelo tubo!\""}], "tools": [{"name": "🔦 1. Luz Negra UV Forense", "result": "Trilhas de fluido fluorescente vazando em 3 conexões de compressão frouxas."}, {"name": "📊 2. Manômetro de Pressão de Loop", "result": "Pressão caindo de 0.6 bar para 0.1 bar em 30 segundos. Falha de estanqueidade."}, {"name": "🧲 3. Teste de O-Ring de Vedação", "result": "Anéis de borracha intactos, requer aperto correto e purga de bolhas."}], "correct": {"title": "Apertar Conexões Compression Fittings, Trocar O-Rings Frouxos e Purgar Ar do Sistema", "desc": "Garante estanqueidade total de 0.6 bar no circuito fechado e elimina risco de curto elétrico."}, "wrongs": [{"title": "Passar Chiclete Mastigado em Volta dos Tubos para Vedar o Vazamento", "desc": "Vedar com goma de mascar.", "burnReason": "O chiclete cedeu com a pressão quente e espirrou fluido condutivo em todos os chips!"}, {"title": "Deixar Vazando e Colocar uma Toalha de Banho Encharcada Dentro do Chassi", "desc": "Toalha molhada no gabinete.", "burnReason": "A toalha encostou nos circuitos da fonte e provocou um curto explosivo!"}]}]}, {"minigameType": "cpu_ram", "requiredPart": "cpu_ram", "urgency": "Hardware", "tagClass": "tag-urgente", "variations": [{"theme": "Memórias RAM em Single-Channel e Trava do Soquete Frouxa", "quote": "\"Minha Workstation com processador de 16 núcleos no ${d} desliga do nada e perdeu metade da velocidade nos jogos!\"", "questions": [{"q": "1. Em quais canais você encaixou os módulos de memória?", "a": "\"Coloquei nos slots 1 e 2 (A1 e A2) colados um no outro.\""}, {"q": "2. O cooler está bem travado com pressão correta?", "a": "\"Acho que esqueci de dar a última volta na mola de fixação do parafuso.\""}, {"q": "3. O CPU-Z reconhece 128 bits de largura de banda?", "a": "\"Mostra apenas 64-bit Single Channel!\""}, {"q": "4. A temperatura atinge níveis de estrangulamento térmico?", "a": "\"Bate 102°C assim que começa a compilar código.\""}], "tools": [{"name": "🌡️ 1. Termografia de Die", "result": "Temperatura de 102°C por contato irregular entre CPU e dissipador."}, {"name": "📊 2. Diagnóstico de Topologia SPD", "result": "Pentes em A1+A2. Requer canais alternados A2+B2 para ativar Dual-Channel."}, {"name": "⚡ 3. Teste de Estabilidade AIDA64", "result": "Throttling de 38% e metade da taxa de transferência de memória."}], "correct": {"title": "Reaplicar Pasta Térmica com Pressão Uniforme e Mover Pentes para os Slots A2 e B2", "desc": "Ativa barramento Dual-Channel de 128-bit e reduz a temperatura em mais de 35°C."}, "wrongs": [{"title": "Soldar os Dois Pentes de RAM Juntos com Solda de Estanho", "desc": "Unir memórias com ferro de solda.", "burnReason": "A solda uniu os pinos de alimentação aos pinos de dados e destruiu a controladora de memória!"}, {"title": "Colocar Gelo Seco Direto na Placa sem Proteção Anticondensação", "desc": "Gelo seco sem isolamento.", "burnReason": "A condensação de água pingou nas fases do VRM e explodiu a placa-mãe!"}]}]}, {"minigameType": "rj45", "requiredPart": "rj45", "urgency": "Rede", "tagClass": "tag-rede", "variations": [{"theme": "Cabo de Rede Crimpado na Ordem Errada Perdendo 90% dos Pacotes", "quote": "\"O cabo de rede que liga o ${d} ao servidor cai a cada 10 segundos e a velocidade não passa de 10 Mbps!\"", "questions": [{"q": "1. Qual sequência de cores foi usada na ponta do conector?", "a": "\"Coloquei as cores que achei mais bonitas sem seguir nenhuma tabela!\""}, {"q": "2. O cabo foi destrançado por um trecho muito longo?", "a": "\"Destrancei quase 10 centímetros antes de enfiar no conector de plástico.\""}, {"q": "3. Os contatos de cobre chegaram até o fim do conector?", "a": "\"Alguns fios parecem ter ficado mais curtos que os outros por dentro.\""}, {"q": "4. O testador de cabos acende todos os 8 LEDs?", "a": "\"Os LEDs 3 e 6 ficam piscando fora de ordem e o LED 7 está apagado.\""}], "tools": [{"name": "🔌 1. Testador de Cabo RJ45 Master/Remote", "result": "Pinagem incorreta. Pares invertidos gerando diafonia (crosstalk) destrutiva."}, {"name": "📶 2. Analisador de Ruído e Atenuação", "result": "Perda de pacotes de 87% na frequência Gigabit de 250 MHz."}, {"name": "📏 3. Certificador Fluke Networks", "result": "Falha no teste NEXT (Near-End Crosstalk). Não atende padrão Cat6."}], "correct": {"title": "Decapar Cabo, Alinhar os 8 Fios na Norma T-568B e Crimpar Conector Cat6 Blindado", "desc": "Restaura a pinagem correta e o cancelamento eletromagnético para Gigabit 1000 Mbps estável."}, "wrongs": [{"title": "Emendar os Fios de Rede com Fita Isolante e Ligar na Tomada de 220V", "desc": "Energizar par trançado.", "burnReason": "A corrente de 220V entrou na porta de rede do computador e fritou a placa de rede onboard!"}, {"title": "Passar Durex no Lugar do Conector RJ45 de Plástico", "desc": "Fixar cabo com fita adesiva.", "burnReason": "Os fios soltos encostaram na carcaça do conector e fecharam curto na linha PoE!"}]}]}, {"minigameType": "psu_wires", "requiredPart": "psu_wires", "urgency": "Hardware", "tagClass": "tag-urgente", "variations": [{"theme": "Cabos Modulares Conectados nas Entradas Invertidas da Fonte", "quote": "\"Comprei uma fonte modular de 1000W para o ${d}, mas enfiei o cabo da placa de vídeo no conector da CPU e agora não dá partida!\"", "questions": [{"q": "1. Os conectores EPS 12V e PCIe foram diferenciados?", "a": "\"Achei que conector de 8 pinos era tudo igual e enfiei onde coube!\""}, {"q": "2. O cabo principal ATX de 24 pinos está travado com o clique?", "a": "\"Está meio solto balançando de um lado.\""}, {"q": "3. A fonte desarma com clique mecânico do relé de proteção?", "a": "\"Faz um TEC seco e não gira nenhuma ventoinha.\""}, {"q": "4. Cheirou a queimado?", "a": "\"Deu um leve cheiro de plástico quente antes de desarmar.\""}], "tools": [{"name": "⚡ 1. Testador Digital de Fonte ATX", "result": "Proteção OCP (Over Current) e SCP (Short Circuit) disparada por pinagem invertida."}, {"name": "🔌 2. Verificação de Conectores de Saída", "result": "Cabo PCIe (polaridade inversa) conectado no soquete EPS da placa-mãe."}, {"name": "📊 3. Medidor de Linhas 12V, 5V e 3.3V", "result": "Linhas zeradas devido ao travamento de segurança do circuito PWM."}], "correct": {"title": "Conectar Cada Cabo Modular Exclusivamente em Seu Barramento Específico (24P, EPS, PCIe e SATA)", "desc": "Restaura o equilíbrio elétrico correto e permite a liberação do sinal POWER_GOOD."}, "wrongs": [{"title": "Forçar o Conector com Chave de Fenda para Ligar Invertido Mesmo Assim", "desc": "Inversão forçada de polaridade.", "burnReason": "A polaridade inversa de 12V no terra explodiu todos os MOSFETs da placa!"}, {"title": "Jumpear os Pinos da Fonte com um Arame de Caderno para Ignorar o Curto", "desc": "Burlar circuito de proteção.", "burnReason": "Sem proteção contra curto, a fonte explodiu os capacitores principais em labaredas!"}]}]}, {"minigameType": "mobo_build", "requiredPart": "mobo_build", "urgency": "Montagem", "tagClass": "tag-urgente", "variations": [{"theme": "Placa-Mãe Aparafusada Direto no Metal Sem Espaçadores", "quote": "\"Montei minha placa Z790 no gabinete do meu ${d}, mas aparafusei a placa de circuito direto na chapa de lata sem os pininhos de latão!\"", "questions": [{"q": "1. Quantos espaçadores (standoffs) você instalou antes da placa?", "a": "\"Nenhum! Achei que aqueles parafusos dourados compridos eram peças sobressalentes!\""}, {"q": "2. As soldas das costas da placa estão encostando na lata?", "a": "\"A placa inteira está encostada na chapa de metal do gabinete.\""}, {"q": "3. Quando liga na tomada, dá curto geral?", "a": "\"Os LEDs piscam por meio segundo e apagam na hora.\""}, {"q": "4. O processador foi assentado com alinhamento correto?", "a": "\"Instalei no soquete LGA mas não tenho certeza se o triângulo bateu.\""}], "tools": [{"name": "🔍 1. Inspeção de Chassi", "result": "9 pontos de contato direto entre trilhas de solda da placa e chassi aterrado."}, {"name": "⚡ 2. Testador de Continuidade", "result": "Curto generalizado entre alimentação VCC e plano de terra do gabinete."}, {"name": "📏 3. Gabarito de Furação ATX", "result": "Furação padrão ATX requer 9 espaçadores de latão de 6.5mm de altura."}], "correct": {"title": "Instalar os 9 Espaçadores de Latão, Isolar a Chapa Traseira e Rosquear Placa com Torque Correto", "desc": "Garante o isolamento dielétrico perfeito entre o verso do circuito impresso e o gabinete metálico."}, "wrongs": [{"title": "Bater com Martelo nas Costas da Placa para Amassar as Soldas que Encostam", "desc": "Martelar trilhas de circuito.", "burnReason": "O impacto partiu a placa de circuito impresso em múltiplos pedaços e rompeu as 8 camadas!"}, {"title": "Passar Óleo de Freio no Metal para Conduzir Melhor a Energia da Lata", "desc": "Fluido de freio condutivo.", "burnReason": "O fluido de freio corroeu as trilhas e provocou curto de alta amperagem!"}]}]}, {"minigameType": "gpu_12vhpwr", "requiredPart": "gpu_12vhpwr", "urgency": "Hardware Crítico", "tagClass": "tag-critica", "variations": [{"theme": "Conector de 16 Pinos da RTX 4090 Frouxo Cheirando a Queimado", "quote": "\"Minha RTX 4090 no ${d} está cheirando a baquelite queimado! O conector de 16 pinos está com folga e quase derretendo o plástico!\"", "questions": [{"q": "1. O conector foi inserido até ouvir o clique mecânico da trava?", "a": "\"Ficou com um vão de uns 2 milímetros porque o cabo do gabinete era duro.\""}, {"q": "2. O cabo faz uma curva muito fechada antes de 35mm da ponta?", "a": "\"Dobrei em 90 graus bem rente ao conector pra fechar a tampa de vidro.\""}, {"q": "3. A placa de vídeo consome até 450W em jogos pesados?", "a": "\"Basta abrir o simulador que o sensor mostra corrente de 50 Amperes!\""}, {"q": "4. Você notou descoloração nos pinos metálicos centrais?", "a": "\"Dois pinos do meio estão ficando com tom bronze escuro queimado.\""}], "tools": [{"name": "🌡️ 1. Câmera Termográfica Flir", "result": "Temperatura do conector atingindo 118°C nos 4 pinos centrais de alimentação."}, {"name": "📏 2. Calibrador de Folga Micrométrico", "result": "Folga de 2.2mm. Contato elétrico parcial gerando alta resistência de contato (R_contact)."}, {"name": "⚡ 3. Análise de Queda de Tensão (Voltage Drop)", "result": "Queda de 12.0V para 11.1V na entrada da GPU. Risco iminente de fusão plástica."}], "correct": {"title": "Calibrar Folga em 0.0mm com Encaixe Completo, Ajustar Tensão em 12.0V e Curva de Ventilação", "desc": "Garante resistência de contato inferior a 0.05 Ohms e opera dentro da zona térmica segura de 45°C."}, "wrongs": [{"title": "Amarrar o Conector com Arame de Pão de Forma e Cobrir com Fita Crepe", "desc": "Fixação com arame condutivo.", "burnReason": "O arame esquentou com a alta amperagem, fundiu os 16 pinos e queimou o VRM da placa!"}, {"title": "Derramar Cola Quente Fervendo Dentro dos 16 Pinos para Vedar Folga", "desc": "Preencher pinos com cola.", "burnReason": "A cola isolou os pinos de sensoriamento e provocou arco elétrico destrutivo de 600W!"}]}]}, {"minigameType": "vrm_soldering", "requiredPart": "vrm_soldering", "urgency": "Eletrônica", "tagClass": "tag-urgente", "variations": [{"theme": "MOSFETs de Alta em Curto Desarmando a Linha de 12V da Placa", "quote": "\"O VRM do ${d} soltou um estalo alto com cheiro de pólvora! O multímetro apita continuidade entre a linha de 12V e o terra!\"", "questions": [{"q": "1. O computador sofreu pico de tensão ou queda de raio?", "a": "\"Caiu um raio na rua e a luz deu um tranco forte antes do estalo.\""}, {"q": "2. Tem algum componente chamuscado perto do soquete da CPU?", "a": "\"Tem uma manchinha escura em cima de dois chips quadradinhos do VRM.\""}, {"q": "3. A fonte desarma instantaneamente ao tentar ligar a placa?", "a": "\"Desarma no mesmo milissegundo de apertar o Power.\""}, {"q": "4. Você tem estação de solda com ar quente e fluxo de qualidade?", "a": "\"Tenho a estação aqui pronta para substituir os componentes defeituosos.\""}], "tools": [{"name": "⚡ 1. Multímetro em Escala de Diodo/Continuidade", "result": "Curto franco (0.000V) nas fases #02, #05, #08 e #11 do regulador de tensão."}, {"name": "🌡️ 2. Termografia com Injeção de 1V na Linha", "result": "MOSFETs com queima de junção interna dissipando 45W em ponto único."}, {"name": "🔬 3. Microscópio Óptico SMD", "result": "Encapsulamento PowerStage rachado por avalanche térmica."}], "correct": {"title": "Dessoldar os 4 MOSFETs em Curto com Ar Quente a 380°C, Limpar Ilhas e Soldar Novos Componentes", "desc": "Elimina o curto-circuito na linha principal de 12V e restabelece as 12 fases do VRM."}, "wrongs": [{"title": "Ligar 220V Direto nas Trilhas para Fazer o Curto Explodir e Desaparecer", "desc": "Injetar sobretensão destrutiva.", "burnReason": "A explosão de 220V destruiu todas as 8 camadas da placa-mãe e estilhaçou o silício!"}, {"title": "Raspar os MOSFETs com Chave de Fenda até Arrancar as Trilhas de Cobre", "desc": "Arrancar ilhas com força mecânica.", "burnReason": "Arrancar as ilhas rompeu os planos internos de alimentação tornando o conserto impossível!"}]}]}, {"minigameType": "delid_liquid_metal", "requiredPart": "cpu_ram", "urgency": "Hardware Avançado", "tagClass": "tag-urgente", "variations": [{"theme": "Delid Extremo para Redução de 25°C com Metal Líquido", "quote": "\"O Core i9 do ${d} bate 100°C mesmo com water cooler de 360mm! Preciso remover a tampa de cobre (IHS) e aplicar metal líquido no silício!\"", "questions": [{"q": "1. Você possui a guilhotina mecânica especial de delid?", "a": "\"Sim, ferramenta de descolagem com parafuso de torque progressivo.\""}, {"q": "2. Os capacitores SMD em volta do die precisam ser isolados?", "a": "\"Com certeza, o metal líquido é altamente condutor e não pode encostar neles!\""}, {"q": "3. A cola original de fábrica é de silicone preto de alta resistência?", "a": "\"Sim, cola dura que precisa ser raspada antes de reassentar o IHS.\""}, {"q": "4. Qual a redução de temperatura esperada com metal líquido?", "a": "\"Em média 20°C a 28°C de queda imediata nos testes pesados.\""}], "tools": [{"name": "🔧 1. Guilhotina de Precisão Delid-Die-Mate", "result": "Lâmina ajustada para separar a tampa de cobre do substrato sem tracionar o silício."}, {"name": "🛡️ 2. Fita Kapton Isolante de Alta Temperatura", "result": "Isolamento dielétrico de 5000V para blindagem dos capacitores SMD vizinhos."}, {"name": "🧪 3. Metal Líquido Galinstan (73 W/mK)", "result": "Condutividade térmica 9x superior a qualquer pasta térmica convencional de prata."}], "correct": {"title": "Separar IHS com Ferramenta Delid, Isolar SMDs com Esmalte/Kapton e Espalhar Filme de Metal Líquido", "desc": "Elimina o estrangulamento térmico na transferência direta de calor do silício para o cobre."}, "wrongs": [{"title": "Cortar a Tampa do Processador com uma Makita de Obra sem Proteção", "desc": "Corte mecânico abrasivo.", "burnReason": "O disco da serra cortou o die de silício pela metade e pulverizou o processador!"}, {"title": "Derramar Metal Líquido sem Isolar os Capacitores e Ligar na Tomada", "desc": "Metal líquido nos capacitores.", "burnReason": "O metal líquido fechou curto em todos os capacitores SMD e carbonizou a CPU!"}]}]}, {"minigameType": "trojan_hunter", "requiredPart": "software_toolkit", "urgency": "Limpeza Lógica", "tagClass": "tag-alerta", "variations": [{"theme": "Cavalos de Troia Camuflados de Processos do Sistema", "quote": "\"O ${d} está com a webcam piscando sozinha, mouse mexendo sem ninguém encostar e processos estranhos como svch0st.exe gastando 70% de CPU!\"", "questions": [{"q": "1. O que foi baixado recentemente na máquina?", "a": "\"Um ativador pirata de Windows e um gerador de gemas de jogo!\""}, {"q": "2. A internet fica lenta como se estivesse enviando arquivos?", "a": "\"O tráfego de upload está no talo enviando dados para servidores desconhecidos.\""}, {"q": "3. O gerenciador de tarefas fecha sozinho quando tenta abrir?", "a": "\"Ele fecha em 2 segundos para tentar esconder os processos falsos!\""}, {"q": "4. Você notou processos com nomes parecidos com os do Windows?", "a": "\"Tem um svch0st com zero e um winlogon32 com ícone de bloco de notas.\""}], "tools": [{"name": "🛡️ 1. Scanner Forense de Processos na Memória", "result": "Detectados 3 binários com injeção de código DLL maliciosa e porta 4444 aberta."}, {"name": "🌐 2. Monitor de Conexões TCP/IP Netstat", "result": "Conexão ativa de Reverse Shell enviando telas capturadas para IP externo."}, {"name": "📑 3. Analisador de Assinatura Digital de Binários", "result": "Processos sem assinatura Microsoft fingindo ser serviços legítimos do sistema."}], "correct": {"title": "Encerrar Processos Falsificados, Enviar Trojans para Quarentena Segura e Purgar Chaves do Registro", "desc": "Elimina as portas dos invasores e restabelece a integridade operacional do sistema operacional."}, "wrongs": [{"title": "Dar Permissão de Administrador Total para os Trojans no Firewall", "desc": "Liberar acesso total aos invasores.", "burnReason": "Os hackers criptografaram todo o sistema operacional e roubaram as senhas bancárias!"}, {"title": "Deletar a Pasta Windows/System32 Inteira Para Eliminar os Vírus", "desc": "Deletar pasta vital do sistema.", "burnReason": "A deleção destruiu o boot do Windows e causou tela azul irreversível!"}]}]}, {"minigameType": "cookie_cleaner", "requiredPart": "software_toolkit", "urgency": "Limpeza Lógica", "tagClass": "tag-alerta", "variations": [{"theme": "Mais de 4.000 Rastreadores, Supercookies e Histórico Oculto", "quote": "\"Basta eu pesquisar um sapato no ${d} que começam a pipocar 800 anúncios me perseguindo em todos os sites! O navegador consome 8GB de RAM só de lixo!\"", "questions": [{"q": "1. Há quanto tempo o cache do navegador não é limpo?", "a": "\"Desde que comprei o computador em 2018! Nunca apaguei nada.\""}, {"q": "2. O navegador demora mais de 30 segundos para abrir?", "a": "\"Trava o computador inteiro só para carregar a página inicial.\""}, {"q": "3. Você aceitou todos os cookies em todos os sites?", "a": "\"Sempre clico em Aceitar Todos para sair da frente rápido!\""}, {"q": "4. Existem extensões desconhecidas instaladas?", "a": "\"Tem umas 5 barras de busca e cupons que eu nunca vi.\""}], "tools": [{"name": "🧹 1. Varredura de Armazenamento DOM e LSO", "result": "4.218 cookies de terceiros, 1.4 GB de cache zumbi e 850 beacons de rastreamento."}, {"name": "📊 2. Análise de Telemetria e Perfil Publicitário", "result": "Perfis de rastreamento cruzado gravando hábitos de navegação em segundo plano."}, {"name": "⚡ 3. Benchmark de Inicialização do Navegador", "result": "Atraso de 28 segundos causado por banco SQLite de histórico corrompido."}], "correct": {"title": "Purgar Supercookies, Limpar Histórico Oculto, Apagar Beacons e Zerar Cache de Navegação", "desc": "Libera gigabytes de memória RAM e elimina todo o rastreamento invasivo de telemetria."}, "wrongs": [{"title": "Instalar Mais 10 Extensões Gratuitas de Limpeza de Cookies Duvisosas", "desc": "Instalar mais adwares.", "burnReason": "As extensões instalaram mineradores ocultos e travaram o navegador para sempre!"}, {"title": "Tentar Desinstalar o Monitor Físico para Parar os Anúncios Visuais", "desc": "Desconectar periférico.", "burnReason": "Arrancar os cabos com força entortou os pinos da porta HDMI da placa de vídeo!"}]}]}, {"minigameType": "popups_closer", "requiredPart": "software_toolkit", "urgency": "Limpeza Lógica", "tagClass": "tag-alerta", "variations": [{"theme": "Chuva de 5 Janelas Pop-up com Botões Falsos de Fechar", "quote": "\"O navegador do meu ${d} virou um circo! Abrem 5 janelas piscando dizendo que ganhei um milhão de dólares e que o PC vai explodir se eu não clicar!\"", "questions": [{"q": "1. As janelas têm botões de fechar enganosos?", "a": "\"Sim! Se clico no X vermelho falso ele abre mais 3 páginas de propaganda!\""}, {"q": "2. Começou depois de instalar algum programa grátis?", "a": "\"Baixei um conversor de PDF e desmarquei nada nas caixas de seleção.\""}, {"q": "3. Toca som de alerta ou música irritante?", "a": "\"Fica uma sirene de polícia tocando em loop dizendo que tenho vírus!\""}, {"q": "4. A página inicial do navegador foi sequestrada?", "a": "\"Foi trocada por um portal de notícias desconhecido cheio de anúncios.\""}], "tools": [{"name": "🔍 1. Mapeamento de Camadas DOM Hijack", "result": "Detectadas janelas modais com overlays invisíveis e botões de fechar fraudulentos."}, {"name": "🛡️ 2. Inspetor de Notificações Push do Navegador", "result": "3 sites suspeitos com permissão de enviar notificações invasivas na área de trabalho."}, {"name": "📑 3. Análise de Injeção de Scripts de Adware", "result": "Scripts externos injetando banners em todos os sites legítimos visitados."}], "correct": {"title": "Identificar e Fechar Todos os Pop-ups pelo Botão Autêntico, Revogar Notificações e Desativar Scripts", "desc": "Cessa a inundação de anúncios fraudulentos e restaura o controle do usuário sobre o navegador."}, "wrongs": [{"title": "Clicar em Todos os Banners Que Dizem Ganhe um Carro Grátis Agora", "desc": "Clicar nos links maliciosos.", "burnReason": "Os links baixaram um ransomware que trancou todos os arquivos em 10 segundos!"}, {"title": "Passar Fita Isolante Preta por Cima da Tela Onde os Pop-ups Aparecem", "desc": "Tapar a tela com fita.", "burnReason": "A fita arrancou o filme polarizador do monitor LCD arruinando o painel!"}]}]}, {"minigameType": "disk_defrag", "requiredPart": "software_toolkit", "urgency": "Otimização", "tagClass": "tag-alerta", "variations": [{"theme": "HD com 78% de Fragmentação e Acesso em Milhares de Pedaços", "quote": "\"O disco do meu ${d} parece uma peneira! Para abrir uma foto de família o HD mecânico fica estalando a agulha por 3 minutos procurando os pedaços!\"", "questions": [{"q": "1. Há quanto tempo você não roda uma otimização de disco?", "a": "\"Acho que nunca rodei desfragmentador desde que comprei o computador!\""}, {"q": "2. O disco mecânico fica em 100% de uso no Gerenciador?", "a": "\"Fica em 100% o tempo todo mesmo sem nenhum programa aberto.\""}, {"q": "3. O som da agulha de leitura é de arranhão ou tec-tec contínuo?", "a": "\"Parece uma máquina de costura a toda velocidade batendo na lata.\""}, {"q": "4. O disco tem bastante espaço livre para manobrar os arquivos?", "a": "\"Tem cerca de 30% de espaço livre, perfeito para reorganizar.\""}], "tools": [{"name": "📊 1. Mapa de Clusters de Alocação de Disco", "result": "Taxa de fragmentação crítica de 78%. Mais de 42.000 fragmentos de arquivos espalhados."}, {"name": "⏱️ 2. Tempo Médio de Acesso aos Setores (Seek Time)", "result": "Tempo de busca em 24ms (ideal: < 8ms) devido ao vai-e-vem excessivo do braço mecânico."}, {"name": "💾 3. Verificação de Saúde S.M.A.R.T.", "result": "Mecânica saudável, sem setores defeituosos (bad blocks), apenas desorganização lógica severa."}], "correct": {"title": "Executar Desfragmentação e Consolidação dos Blocos Fragmentados em Setores Contíguos", "desc": "Reúne os pedaços dos arquivos em blocos sequenciais, reduzindo em 70% o tempo de carregamento."}, "wrongs": [{"title": "Abrir a Tampa de Metal do HD Mecânico Ligado para Empurrar a Agulha com a Mão", "desc": "Abrir disco fora de sala limpa.", "burnReason": "A poeira do ar riscou os pratos magnéticos e destruiu todos os dados instantaneamente!"}, {"title": "Passar um Imã Potente de Alto-Falante no HD para Puxar os Pedaços", "desc": "Aproximar ímã de neodímio.", "burnReason": "O campo magnético desmagnetizou os pratos e apagou todas as partições do HD!"}]}]}, {"minigameType": "bsod_analyzer", "requiredPart": "software_toolkit", "urgency": "Diagnóstico", "tagClass": "tag-critica", "variations": [{"theme": "Tela Azul da Morte em Loop por Driver Corrompido", "quote": "\"Meu ${d} só dá Tela Azul! Aparece MEMORY_MANAGEMENT e IRQL_NOT_LESS_OR_EQUAL toda vez que entra no Windows e reinicia sozinho!\"", "questions": [{"q": "1. O problema começou após alguma atualização de driver?", "a": "\"Atualizei um driver de vídeo beta que peguei num fórum russo ontem à noite.\""}, {"q": "2. Qual arquivo .sys ou código de parada é citado no minidump?", "a": "\"Apareceu nvlddmkm_buggy.sys escrito bem pequeno no rodapé da tela azul.\""}, {"q": "3. Em Modo de Segurança o sistema consegue inicializar?", "a": "\"Sim! No Modo de Segurança básico ele liga sem a tela azul.\""}, {"q": "4. Você fez teste nas memórias físicas com MemTest86?", "a": "\"Passei o MemTest por 2 horas e as memórias RAM passaram com zero erros.\""}], "tools": [{"name": "📋 1. Analisador Forense WinDbg de Minidump (MEMORY.DMP)", "result": "BugCheck 0x0000001A causado por violação de ponteiro no driver nvlddmkm_buggy.sys."}, {"name": "🔍 2. Verificador de Assinatura WHQL", "result": "Driver de vídeo não possui certificado digital Microsoft e invade memória não paginável."}, {"name": "💻 3. Teste de Kernel Paging", "result": "Falha de endereço de memória quando o driver tenta acessar buffer de textura corrompido."}], "correct": {"title": "Isolar Driver Instável no Dump de Memória, Reverter para Versão Certificada WHQL e Limpar BCD", "desc": "Corrige a corrupção de ponteiros de memória e restabelece a inicialização estável do Windows."}, "wrongs": [{"title": "Tentar Pintar a Tela Azul de Preto com Canetinha Hidrográfica", "desc": "Pintar o monitor.", "burnReason": "A canetinha manchou a película anti-reflexo do painel LCD sem resolver o travamento!"}, {"title": "Ignorar a Tela Azul e Apertar o Reset 200 Vezes Seguidas em 1 Minuto", "desc": "Reinicializações violentas.", "burnReason": "Os desligamentos abruptos corromperam a tabela MFT do sistema de arquivos do SSD!"}]}]}, {"minigameType": "dll_fixer", "requiredPart": "software_toolkit", "urgency": "Reparo Lógico", "tagClass": "tag-alerta", "variations": [{"theme": "Arquivos DLL Ausentes Impedindo Abertura de Programas e Jogos", "quote": "\"Nenhum jogo abre no meu ${d}! Dá erro de msvcr120.dll e d3dx9_43.dll ausentes e diz para reinstalar o programa, mas nunca resolve!\"", "questions": [{"q": "1. Os pacotes redistribuíveis do Visual C++ e DirectX estão instalados?", "a": "\"Formatei a máquina ontem e não instalei nenhum pacote complementar.\""}, {"q": "2. Você tentou baixar DLLs soltas de sites aleatórios da internet?", "a": "\"Baixei uma DLL solta e joguei na área de trabalho, mas continuou dando erro.\""}, {"q": "3. Os binários foram devidamente registrados com regsvr32?", "a": "\"Não sei o que é regsvr32, só dei duplo clique no arquivo.\""}, {"q": "4. O sistema operacional é 64 bits ou 32 bits?", "a": "\"É Windows 11 de 64 bits rodando aplicativos antigos de 32 bits.\""}], "tools": [{"name": "🔍 1. Dependency Walker / Dependencies Inspector", "result": "3 bibliotecas dinâmicas essenciais faltando nas pastas System32 e SysWOW64."}, {"name": "📑 2. Verificador de Arquivos do Sistema SFC /Scannow", "result": "Associações COM/OLE corrompidas no registro de componentes de runtime."}, {"name": "📦 3. Auditor de Versões dos Pacotes Visual C++", "result": "Runtimes de 2010 a 2019 ausentes, impedindo a carga de dependências nativas."}], "correct": {"title": "Instalar Pacotes Oficiais de Runtime e Registrar DLLs Ausentes com o Utilitário Regsvr32", "desc": "Restaura as bibliotecas compartilhadas essenciais e as chamadas de API do sistema operacional."}, "wrongs": [{"title": "Renomear Arquivos de Fotos JPEG para o Nome das DLLs e Jogar no Windows", "desc": "Substituir DLL por foto.", "burnReason": "O Windows tentou carregar a imagem como código executável e travou o explorer.exe!"}, {"title": "Desativar Todas as Mensagens de Erro do Sistema no Registro para Ignorar", "desc": "Silenciar mensagens de erro.", "burnReason": "Os programas passaram a fechar instantaneamente em silêncio sem abrir nada!"}]}]}, {"minigameType": "bios_flashing", "requiredPart": "cmos_bios", "urgency": "Firmware Crítico", "tagClass": "tag-critica", "variations": [{"theme": "Atualização Crítica de BIOS com Queda de Tensão na EEPROM", "quote": "\"Preciso atualizar a BIOS do ${d} para reconhecer o novo processador de 14ª geração, mas a rede elétrica aqui oscila e tenho medo de brickar a placa!\"", "questions": [{"q": "1. A versão atual da BIOS suporta a CPU que você quer colocar?", "a": "\"Não suporta! Sem atualizar a tela fica preta e nem dá sinal de vida.\""}, {"q": "2. A placa-mãe tem botão traseiro de BIOS Flashback de emergência?", "a": "\"Tem o botão e a porta USB dedicada para gravação direta.\""}, {"q": "3. A tensão na tomada está oscilando entre 110V e 95V?", "a": "\"Moro no fim da linha e a luz pisca quando o vizinho liga o chuveiro.\""}, {"q": "4. O arquivo de ROM (.CAP ou .BIN) é oficial do fabricante?", "a": "\"Baixei diretamente da página oficial de suporte da placa-mãe.\""}], "tools": [{"name": "⚡ 1. Monitor de Tensão do Gravador SPI", "result": "Tensão de gravação em 11.9V. Requer estabilização para não corromper os blocos flash."}, {"name": "💾 2. Leitor de Checksum SHA-256 da Imagem ROM", "result": "Hash verificado e íntegro: 64 MB de microcódigo e AGESA atualizados."}, {"name": "📊 3. Medidor de Progresso de Gravação de Setores", "result": "Blocos 0x00 a 0xFF prontos para escrita sequencial com verificação CRC."}], "correct": {"title": "Estabilizar Tensão Acima de 11.8V com No-Break e Executar Gravação dos Blocos da EEPROM até 100%", "desc": "Garante a escrita perfeita de todos os setores do firmware sem risco de brick da placa-mãe."}, "wrongs": [{"title": "Arrancar o PC da Tomada bem no Meio da Gravação aos 50% de Progresso", "desc": "Cortar energia durante flash.", "burnReason": "A EEPROM ficou corrompida pela metade e a placa-mãe virou um peso de papel inutilizável!"}, {"title": "Esquentar o Chip da BIOS com Maçarico para Gravar os Dados Mais Rápido", "desc": "Queimar o chip com maçarico.", "burnReason": "O chip da BIOS explodiu com o calor extremo e carbonizou o circuito ao redor!"}]}]}, {"minigameType": "malware_task", "requiredPart": "malware", "urgency": "Limpeza Lógica", "tagClass": "tag-alerta", "variations": [{"theme": "Minerador Oculto Monopolizando 100% da CPU em Segundo Plano", "quote": "\"O cooler do meu ${d} parece uma turbina de avião 24 horas por dia! Abro o Gerenciador e o uso de CPU está cravado em 100% mesmo sem nada aberto!\"", "questions": [{"q": "1. Quais processos mostram maior consumo de recursos na tabela?", "a": "\"Tem um tal de svch0st_miner e um keylogger_spy32 consumindo quase 100% juntos.\""}, {"q": "2. Quando você abre o navegador o computador quase congela?", "a": "\"Leva 2 minutos só para abrir uma nova guia porque a CPU está esganada.\""}, {"q": "3. Você reconhece esses dois processos de alta utilização?", "a": "\"Nunca vi na vida! Não têm descrição e estão instalados na pasta AppData.\""}, {"q": "4. O computador esquenta mesmo com o gabinete destampado?", "a": "\"Fica pelando de quente porque os núcleos estão todos em carga máxima.\""}], "tools": [{"name": "📊 1. Monitor de Recursos de CPU por Thread", "result": "Processo malicioso explorando instruções AVX2 para mineração de criptomoeda oculta."}, {"name": "🔍 2. Auditoria de Caminho de Executável", "result": "Executáveis rodando a partir de pastas temporárias ocultas com persistência no registro."}, {"name": "🛡️ 3. Análise Heurística de Memória", "result": "Tentativa de camuflagem usando o nome de serviços legítimos do Windows Explorer."}], "correct": {"title": "Finalizar Processos de Mineração no Gerenciador de Tarefas, Apagar Binários e Desativar Inicialização", "desc": "Libera 100% dos ciclos de clock da CPU e reduz a temperatura operacional imediatamente."}, "wrongs": [{"title": "Finalizar o Processo explorer.exe e o Kernel do Windows ao Mesmo Tempo", "desc": "Matar serviços vitais do sistema.", "burnReason": "A área de trabalho desapareceu, o sistema entrou em colapso e perdeu o controle!"}, {"title": "Tentar Rodar Mais 5 Jogos Pesados para Afogar o Minerador no Cansaço", "desc": "Sobrecarga de software.", "burnReason": "A temperatura atingiu o limite crítico, o silício fritou e a máquina desligou com cheiro de queimado!"}]}]}, {"minigameType": "boot_loop_fix", "requiredPart": "software_toolkit", "urgency": "Reparo Lógico", "tagClass": "tag-urgente", "variations": [{"theme": "Loop Infinito de Reparo Automático do Windows Após Queda de Energia", "quote": "\"O ${d} não passa da tela preta! Dá Preparando Reparo Automático, tenta diagnosticar o PC, diz que não pôde reparar e reinicia de novo em loop!\"", "questions": [{"q": "1. O que aconteceu imediatamente antes de começar o loop?", "a": "\"O computador desligou na tomada enquanto estava atualizando o Windows.\""}, {"q": "2. Você consegue acessar o Prompt de Comando no menu avançado?", "a": "\"Sim! Consigo abrir a janela preta do CMD nas opções de recuperação.\""}, {"q": "3. A partição EFI de inicialização está com o arquivo BCD corrompido?", "a": "\"Diz que o arquivo BCD não contém uma instalação válida do sistema operacional.\""}, {"q": "4. O disco rígido ou SSD está com os arquivos pessoais intactos?", "a": "\"Consigo ver minhas pastas e arquivos pelo comando dir C:, está tudo lá.\""}], "tools": [{"name": "💻 1. Diagnóstico do Registro de Boot (BCDedit)", "result": "Ponteiro {bootmgr} corrompido e partição de boot desconfigurada."}, {"name": "🔍 2. Verificador de Setores de Partição (Bootrec /ScanOS)", "result": "1 instalação de Windows detectada em C:\\Windows sem apontamento no BCD."}, {"name": "📑 3. Análise da Tabela MBR/GPT", "result": "Tabela de partições intacta, requer apenas reconstrução da cadeia de inicialização."}], "correct": {"title": "Executar Comandos bootrec /fixmbr, /fixboot e /rebuildbcd no Prompt para Reconstruir a Inicialização", "desc": "Recria o armazenamento de dados de configuração da inicialização (BCD) e resolve o loop de reparo."}, "wrongs": [{"title": "Formatar o Disco Inteiro com o Comando format C: /y sem Backup", "desc": "Formatação destrutiva.", "burnReason": "Todos os arquivos, documentos e fotos do cliente foram apagados permanentemente!"}, {"title": "Apertar a Tecla Enter Repetidamente com uma Furadeira", "desc": "Impacto mecânico na tecla.", "burnReason": "A broca quebrou o teclado, perfurou a placa-mãe por baixo e rompeu as trilhas!"}]}]}, {"minigameType": "ddu_driver_sweep", "requiredPart": "software_toolkit", "urgency": "Limpeza Lógica", "tagClass": "tag-alerta", "variations": [{"theme": "Conflito de Drivers de Placa de Vídeo Antiga Causando Artefatos", "quote": "\"Troquei de placa de vídeo no meu ${d}, mas os drivers antigos continuam brigando no registro! A tela pisca preta e congela em qualquer jogo!\"", "questions": [{"q": "1. Você desinstalou os drivers da placa antiga antes de colocar a nova?", "a": "\"Não! Só tirei uma da placa-mãe e espetei a outra achando que o Windows se virava.\""}, {"q": "2. Havia drivers de fabricantes diferentes instalados juntos?", "a": "\"Tinha sobras de driver AMD misturadas com o driver da NVIDIA novo.\""}, {"q": "3. O Windows Update tentou baixar um driver antigo por cima?", "a": "\"Toda vez que desinstalo, o Windows Update baixa um driver de 2021 sozinho.\""}, {"q": "4. Você sabe inicializar no Modo de Segurança?", "a": "\"Sim, segurando Shift e clicando em Reiniciar.\""}], "tools": [{"name": "🔍 1. Varredura de Chaves Órfãs do Driver no Registro", "result": "Mais de 1.800 chaves de registro antigas e arquivos .dll residentes em System32/DriverStore."}, {"name": "🖥️ 2. Inspetor de Camada de Vídeo DirectX/Vulkan", "result": "Conflito de chamadas de API entre bibliotecas de diferentes fabricantes de GPU."}, {"name": "🛡️ 3. Status do Ambiente do Sistema Operacional", "result": "Necessário expurgo completo com DDU (Display Driver Uninstaller) sem conexão de rede."}], "correct": {"title": "Reiniciar em Modo de Segurança, Limpar Arquivos de Driver Antigo com DDU e Purgar Registro", "desc": "Remove todas as sobras de drivers residuais e prepara o Windows para uma instalação limpa e sem conflitos."}, "wrongs": [{"title": "Tentar Apagar a Pasta C:\\Windows\\System32 com o Mouse no Modo Normal", "desc": "Deleção de arquivos vitais.", "burnReason": "Apagar arquivos essenciais travou o Windows e inutilizou o sistema operacional!"}, {"title": "Instalar Mais 4 Drivers Diferentes em Cima para Ver Qual Funciona", "desc": "Empilhar drivers incompatíveis.", "burnReason": "A mistura de drivers corrompeu o subsistema de vídeo e causou tela preta total!"}]}]}, {"minigameType": "bloatware_remover", "requiredPart": "software_toolkit", "urgency": "Limpeza Lógica", "tagClass": "tag-alerta", "variations": [{"theme": "PC Novo de Fábrica Atolado com 30 Programas Inúteis de Fábrica", "quote": "\"Comprei esse ${d} ontem na loja e já veio com 40 programas de propaganda instalados! Tem barra de busca, antivírus de teste vencido e assistente de compras chato!\"", "questions": [{"q": "1. Quantos programas iniciam junto com o Windows?", "a": "\"Tem mais de 35 ícones brilhando na bandeja do relógio ao mesmo tempo!\""}, {"q": "2. O antivírus de teste fica exibindo avisos para assinar a versão paga?", "a": "\"Aparece uma janela gigante no meio da tela a cada 5 minutos pedindo cartão de crédito.\""}, {"q": "3. Tem aplicativo de previsão do tempo e cupons pesando na memória?", "a": "\"Consomem mais de 4GB de RAM só para mostrar anúncios que eu não quero ver.\""}, {"q": "4. O computador tem desempenho muito abaixo do hardware que possui?", "a": "\"Tem processador potente, mas demora 2 minutos para abrir qualquer pasta.\""}], "tools": [{"name": "📑 1. Inventário de Softwares Instalados de Fábrica", "result": "4 programas inúteis com alta carga de inicialização automática identificados."}, {"name": "📊 2. Impacto no Tempo de Boot (Startup Impact)", "result": "Atraso de 45 segundos no carregamento da área de trabalho provocado por bloatwares."}, {"name": "🛡️ 3. Análise de Serviços em Segundo Plano", "result": "Serviços zumbis enviando telemetria e exibindo banners promocionais indesejados."}], "correct": {"title": "Desinstalar Barra Ask, Antivírus Demo Expirado, Assistente de Compras e Notícias em Massa", "desc": "Libera recursos vitais de processamento e reduz o consumo de memória RAM pela metade."}, "wrongs": [{"title": "Clicar em Assinar Plano Premium de R$ 500 em Todos os Bloatwares", "desc": "Comprar os softwares inúteis.", "burnReason": "O cliente gastou uma fortuna em programas lixo que continuaram deixando o PC lento!"}, {"title": "Apagar os Atalhos da Área de Trabalho Achando que Isso Desinstala", "desc": "Deletar apenas atalhos.", "burnReason": "Os programas continuaram rodando em segundo plano e drenando a memória do sistema!"}]}]}, {"minigameType": "ransomware_decrypt", "requiredPart": "software_toolkit", "urgency": "Segurança Máxima", "tagClass": "tag-critica", "variations": [{"theme": "Arquivos Criptografados com Extensão .locked e Pedido de Resgate", "quote": "\"Todos os meus documentos no ${d} viraram arquivos com final .locked! Tem um bloco de notas na área de trabalho pedindo 2 Bitcoins para devolver minhas fotos!\"", "questions": [{"q": "1. Quando os arquivos começaram a ficar bloqueados?", "a": "\"Ontem depois que abri um boleto falso que recebi por e-mail.\""}, {"q": "2. O vírus ainda está em execução criptografando novas pastas?", "a": "\"Desconectei o cabo de rede imediatamente para não passar para o resto da casa.\""}, {"q": "3. Você possui a chave de descriptografia de emergência ou backup?", "a": "\"Achei um arquivo de log com os 4 blocos hexadecimais da chave RSA na memória temporária!\""}, {"q": "4. Você tem intenção de pagar o resgate aos criminosos?", "a": "\"De jeito nenhum! Quero que o técnico use ferramentas forenses para quebrar a criptografia!\""}], "tools": [{"name": "🔍 1. Analisador Criptográfico de Assinatura de Arquivo", "result": "Criptografia RSA-2048 com vetor de inicialização parcialmente recuperável da RAM."}, {"name": "🔐 2. Extrator de Chave de Descriptografia em Dump de Memória", "result": "4 blocos hexadecimais válidos identificados: 0x7A, 0x4F, 0xB2 e 0x9C."}, {"name": "🛡️ 3. Módulo de Desinfecção Forense Anti-Ransomware", "result": "Ransomware isolado e impedido de se propagar para outras unidades de disco."}], "correct": {"title": "Combinar os 4 Blocos da Chave Hexadecimal na Ordem Correta para Decifrar e Restaurar Arquivos", "desc": "Quebra o bloqueio dos arquivos criptografados e recupera 100% dos dados dos documentos do cliente."}, "wrongs": [{"title": "Fazer um Pix de R$ 5.000 para o E-mail dos Hackers Criminosos", "desc": "Pagar o resgate.", "burnReason": "Os criminosos pegaram o dinheiro, não mandaram a chave e riram da cara do cliente!"}, {"title": "Tentar Abrir os Arquivos .locked no Bloco de Notas e Salvar por Cima", "desc": "Salvar dados corrompidos.", "burnReason": "Sobrescrever os arquivos destruiu os cabeçalhos originais tornando a recuperação impossível!"}]}]}, {"minigameType": "firewall_rules", "requiredPart": "software_toolkit", "urgency": "Segurança", "tagClass": "tag-alerta", "variations": [{"theme": "Portas de Entrada Vulneráveis Abertas para Invasores na Rede", "quote": "\"O roteador avisou que o ${d} está recebendo milhares de tentativas de ataque externo por portas suspeitas como a 4444 e a 1337!\"", "questions": [{"q": "1. O firewall do Windows estava completamente desativado?", "a": "\"Desativei para conseguir jogar um jogo online pirata e esqueci desligado.\""}, {"q": "2. Quais portas estão recebendo maior volume de conexões estranhas?", "a": "\"A porta 4444 (Reverse Shell) e a porta 1337 (RAT Backdoor) estão abertas e expostas.\""}, {"q": "3. A porta 443 de navegação segura (HTTPS) deve continuar aberta?", "a": "\"Sim! Sem a porta 443 não consigo navegar em nenhum site seguro.\""}, {"q": "4. Existem regras de exceção suspeitas criadas no sistema?", "a": "\"Tem regras permitindo qualquer conexão de entrada sem nenhuma restrição.\""}], "tools": [{"name": "🌐 1. Scanner de Portas Nmap Interno", "result": "Portas 4444 (Metasploit) e 1337 (Backdoor) em estado LISTENING totalmente expostas à internet."}, {"name": "🛡️ 2. Inspetor de Regras de Entrada do Windows Defender Firewall", "result": "Regras de entrada permissivas autorizando qualquer IP externo a conectar sem senha."}, {"name": "📊 3. Analisador de Tráfego Wireshark", "result": "Pacotes SYN de sondagem de portas sendo recebidos a cada 200 milissegundos."}], "correct": {"title": "Bloquear Portas Vulneráveis 4444 e 1337 no Firewall Mantendo Liberada Apenas a Porta Segura 443", "desc": "Fecha todas as brechas de intrusão externa e blinda a rede do computador contra invasores."}, "wrongs": [{"title": "Abrir Todas as Portas de 1 a 65535 para Qualquer Computador da Terra", "desc": "Liberar todas as portas.", "burnReason": "O computador foi invadido por dezenas de botnets em menos de 2 minutos!"}, {"title": "Desconectar o Fio do Mouse Achando que Isso Protege o Tráfego de Rede", "desc": "Desconectar mouse.", "burnReason": "Desconectar o mouse não teve efeito na rede e o usuário ficou sem controle da tela!"}]}]}, {"minigameType": "temp_cleaner", "requiredPart": "software_toolkit", "urgency": "Limpeza Lógica", "tagClass": "tag-alerta", "variations": [{"theme": "Disco C: Totalmente Cheio com 120GB de Arquivos Lixo e Logs Mortos", "quote": "\"O disco do meu ${d} está com a barra vermelha dizendo que resta apenas 100 Megabytes livres! Não consigo nem salvar um trabalho da faculdade!\"", "questions": [{"q": "1. Há quanto tempo a pasta %TEMP% não é limpa?", "a": "\"Nunca limpei! Tem arquivos temporários gravados ali desde o primeiro dia de uso.\""}, {"q": "2. A Lixeira do Windows está com dezenas de gigabytes acumulados?", "a": "\"Tem mais de 45GB de vídeos pesados que deletei mas nunca esvaziei da Lixeira.\""}, {"q": "3. As atualizações antigas do Windows Update continuam ocupando espaço?", "a": "\"A pasta WinSxS e o cache de download de updates estão gigantescos.\""}, {"q": "4. Existem arquivos de despejo de memória (Memory Dumps) antigos?", "a": "\"Tem vários arquivos de despejo de 15GB de telas azuis do ano passado.\""}], "tools": [{"name": "💾 1. Analisador de Uso de Disco TreeSize / WizTree", "result": "124 GB ocupados exclusivamente por lixo temporário, relatórios mortos e cache corrompido."}, {"name": "🧹 2. Inspetor de Componentes do Windows (Dism Component Cleanup)", "result": "Backups antigos de Service Packs ocupando 32GB de espaço não reclamado."}, {"name": "⚡ 3. Status de Espaço Livre da Unidade C:", "result": "Apenas 108 MB livres. SSD com desempenho degradado por falta de blocos livres para TRIM."}], "correct": {"title": "Purgar Pasta %TEMP%, Esvaziar Lixeira Ocupada, Limpar Cache do Windows Update e Apagar Dumps", "desc": "Recupera mais de 120GB de espaço livre imediato e restabelece a velocidade máxima do SSD."}, "wrongs": [{"title": "Deletar a Pasta Arquivos de Programas e Windows para Liberar Espaço Rápido", "desc": "Apagar pastas de programas.", "burnReason": "Apagar a pasta de programas quebrou todo o funcionamento do sistema operacional!"}, {"title": "Comprimir Todos os Arquivos com Senha sem Lembrar Qual Senha Colocou", "desc": "Comprimir e esquecer senha.", "burnReason": "Todos os arquivos ficaram bloqueados por senha perdida e ninguém conseguiu abrir!"}]}]}, {"minigameType": "crypto_wallet_rescue", "requiredPart": "software_toolkit", "urgency": "Resgate de Dados", "tagClass": "tag-alerta", "variations": [{"theme": "Frase Seed de Carteira Cripto Perdida e Fora de Ordem", "quote": "\"Esqueci a ordem das 4 palavras de recuperação da minha carteira de criptomoedas no ${d}! Se eu não acertar a sequência, minhas economias ficam trancadas para sempre!\"", "questions": [{"q": "1. Você anotou as palavras em algum pedaço de papel?", "a": "\"Anotei as 4 palavras num guardanapo, mas esqueci a numeração de cada uma!\""}, {"q": "2. As palavras são do padrão BIP-39 oficial em inglês?", "a": "\"Sim! São palavras oficiais: alpha, saturn, crypto e shield.\""}, {"q": "3. A carteira possui backup de arquivo keystore ou chave pública?", "a": "\"Tenho a chave pública e o hash mnemônico para conferir a ordem exata.\""}, {"q": "4. Você já tentou adivinhar muitas vezes seguidas?", "a": "\"Tentei uma vez e parei para não bloquear o tempo de tentativa.\""}], "tools": [{"name": "🔐 1. Verificador Mnemônico Padrão BIP-39", "result": "4 palavras identificadas no dicionário criptográfico padrão com checksum de derivação."}, {"name": "📋 2. Analisador de Entropia de Hash SHA-256", "result": "Assinatura matemática da carteira corresponde à sequência lógica de 4 elementos."}, {"name": "🛡️ 3. Ambiente Seguro Offline de Recuperação", "result": "Execução em máquina isolada sem conexão de rede para evitar vazamento da chave privada."}], "correct": {"title": "Ordenar as 4 Palavras Mnemônicas na Sequência Criptográfica Correta para Restaurar a Chave Privada", "desc": "Gera a derivação da chave privada correta e restabelece o acesso total aos ativos da carteira."}, "wrongs": [{"title": "Digitar as Palavras Num Chat Público do Discord para Estranhos Ajudarem", "desc": "Vazar palavras na internet.", "burnReason": "Um bot raspou a frase na hora e roubou todos os fundos da carteira do cliente!"}, {"title": "Tentar Adivinhar a Senha Digitando com os Olhos Fechados", "desc": "Tentativas cegas no escuro.", "burnReason": "O aplicativo da carteira bloqueou o acesso temporariamente após tentativas incorretas!"}]}]}];

function generateRandomCrazyCaseTemplate() {
  const theme = SOLO_THEMES_CATALOG[Math.floor(Math.random() * SOLO_THEMES_CATALOG.length)];
  const varIdx = Math.floor(Math.random() * theme.variations.length);
  const v = theme.variations[varIdx];

  const devices = [
    'PC Desktop Gamer', 'Notebook Ultrafino', 'Workstation de Edição',
    'Servidor Compacto', 'PC de Escritório', 'Console Híbrido'
  ];
  const device = devices[Math.floor(Math.random() * devices.length)];

  const names = [
    'Carlos Mendes', 'Vanessa Lima', 'Marcos Silveira', 'Matheus Gamer',
    'Dona Neide', 'Lucas Tech', 'Camila Dev', 'Roberto Santos',
    'Juliana Prado', 'Felipe Araújo', 'Renata Vasconcelos', 'Bruno Costa'
  ];
  const clientName = names[Math.floor(Math.random() * names.length)];

  const quote = (v.quote || 'Preciso de conserto urgente!').replace(/\$\{d\}/g, device);

  const diagList = [
    { title: v.correct.title, desc: v.correct.desc, correct: true, burnReason: '' },
    ...v.wrongs.map(w => ({ title: w.title, desc: w.desc, correct: false, burnReason: w.burnReason || 'Procedimento incorreto!' }))
  ].sort(() => Math.random() - 0.5);

  return {
    clientName,
    device,
    problem: v.theme || 'Problema técnico detectado',
    urgency: theme.urgency || 'Normal',
    tagClass: theme.tagClass || 'tag-medio',
    quote,
    reward: 450 + Math.floor(Math.random() * 300),
    minigameType: theme.minigameType || 'dust_blower',
    requiredPart: theme.requiredPart || 'dust_cleaner',
    mentorHint: 'Investigue na Etapa 1 e 2, aprove o diagnóstico na Etapa 3 e conclua o conserto no Mini-Game!',
    questions: (v.questions || []).map(q => ({ q: q.q, a: q.a, asked: false })),
    tools: (v.tools || []).map(t => ({ name: t.name, result: t.result, ran: false })),
    diagnoses: diagList
  };
}

function createClientCase(idx, walkInFromDoor = false, forcedTemplate = null) {
  let tpl = forcedTemplate;
  if (!tpl) {
    if (state.networkMode === 'online' && typeof isGroupPuzzlesUnlocked === 'function' && isGroupPuzzlesUnlocked() && Math.random() < 0.28) {
      const coopPool = typeof getUnlockedTemplates === 'function' ? getUnlockedTemplates().filter(t => t.coopPlayers > 1) : [];
      if (coopPool.length > 0) {
        tpl = coopPool[Math.floor(Math.random() * coopPool.length)];
      }
    }
  }
  if (!tpl && typeof generateRandomCrazyCaseTemplate === 'function') {
    tpl = generateRandomCrazyCaseTemplate();
  }
  if (!tpl) {
    tpl = {
      clientName: 'Cliente VIP #' + (idx + 1),
      urgency: 'Média',
      tagClass: 'tag-medio',
      device: 'PC Desktop Gamer',
      problem: 'Superaquecimento e lentidão geral',
      quote: 'Meu PC trava quando abro jogos e o cooler faz barulho!',
      reward: 350,
      minigameType: 'cpu_ram',
      requiredPart: 'cpu_ram',
      mentorHint: 'Limpe a poeira e troque a pasta térmica do processador.',
      questions: [],
      tools: [],
      diagnoses: []
    };
  }

  const slotIdx = (cases || []).filter(c => !c.leavingState).length;
  const waitPos = getWaitingSlotPosition(slotIdx);
  const map = currentMap();
  const numStr = String(nextClientIdCounter++).padStart(2, '0');

  const startX = waitPos.x;
  const startY = waitPos.y;

  return {
    id: idx + 1,
    code: 'Chamado #' + numStr,
    clientName: tpl.clientName || 'Cliente #' + numStr,
    urgency: tpl.urgency || 'Normal',
    tagClass: tpl.tagClass || 'tag-medio',
    device: tpl.device || 'PC Desktop Gamer',
    problem: tpl.problem || 'Problema técnico detectado',
    quote: tpl.quote || 'Preciso de ajuda urgente com minha máquina!',
    reward: tpl.reward || 350,
    mentorHint: tpl.mentorHint || 'Verifique na bancada de testes.',
    minigameType: tpl.minigameType || 'cpu_ram',
    requiredPart: tpl.requiredPart || 'cpu_ram',
    coopPlayers: tpl.coopPlayers || 1,
    x: startX,
    y: startY,
    targetX: waitPos.x,
    targetY: waitPos.y,
    waitIndex: slotIdx,
    speed: 2.2,
    waypoints: walkInFromDoor ? buildDoorwayPath(startX, startY, waitPos.x, waitPos.y) : [],
    walkingToDesk: false,
    arrivedAtDesk: false,
    deskPos: null,
    bubbleTimer: 180,
    solved: false,
    minigameDone: false,
    inMyRoom: false,
    leavingState: null,
    isBurntReturn: false,
    burnReasonText: '',
    patience: 100,
    insultText: (typeof ANGRY_INSULTS !== 'undefined' && ANGRY_INSULTS.length) ? ANGRY_INSULTS[idx % ANGRY_INSULTS.length] : '🤬 Preciso do meu PC logo!',
    impatientText: (typeof IMPATIENT_QUOTES !== 'undefined' && IMPATIENT_QUOTES.length) ? IMPATIENT_QUOTES[idx % IMPATIENT_QUOTES.length] : '😤 Ainda vai demorar?',
    character: {
      color: '#3b82f6',
      hair: '#1e293b',
      mood: 'worried'
    },
    look: {
      skin: (typeof SKIN_COLORS !== 'undefined') ? SKIN_COLORS[idx % SKIN_COLORS.length] : '#ffdbb5',
      hair: (typeof HAIR_COLORS !== 'undefined') ? HAIR_COLORS[idx % HAIR_COLORS.length] : '#2c1e18',
      shirt: (typeof PLAYER_COLORS !== 'undefined') ? PLAYER_COLORS[(idx + 2) % PLAYER_COLORS.length] : '#3b82f6',
      glasses: idx % 3 === 0,
      headset: false,
      mood: 'worried'
    },
    questions: (tpl.questions || []).map(q => ({ ...q, asked: false })),
    tools: (tpl.tools || []).map((t, tIdx) => ({ ...t, ran: state.workbenchLevel >= 2 && tIdx === 0 })),
    diagnoses: (tpl.diagnoses || []).map(d => ({ ...d }))
  };
}

function getTargetQueueSize() {
  if (state.networkMode === 'offline') {
    const tier = state.soloExpansionTier || 1;
    // Quando jogamos solo, até expandirmos nossa loja aparece de 3 a 4 clientes em espera; conforme expandimos mais clientes aparecem
    return Math.min(6, 3 + Math.floor((tier - 1) / 2));
  }
  const rooms = typeof getUnlockedRoomsCount === 'function' ? getUnlockedRoomsCount() : 5;
  return Math.max(8, Math.round(rooms * 0.8) + (typeof getConnectedPlayerCount === 'function' ? getConnectedPlayerCount() : 1));
}

function syncQueueSizeToConnectedPlayers(spawnNewTierCases = false) {
  const targetCount = getTargetQueueSize();
  const activeWaiting = (cases || []).filter(c => !c.leavingState).length;
  const unlocked = typeof getUnlockedTemplates === 'function' ? getUnlockedTemplates() : [];
  const maxTier = typeof getCurrentHQTier === 'function' ? getCurrentHQTier() : 1;
  const newTierPool = unlocked.filter(t => t.hqTier === maxTier);

  for (let i = activeWaiting; i < targetCount; i++) {
    const forced = (spawnNewTierCases && newTierPool.length > 0)
      ? newTierPool[i % newTierPool.length]
      : null;
    cases.push(createClientCase(nextClientIdCounter - 1, true, forced));
  }
}

function rebuildQueueForCurrentMode() {
  const targetCount = getTargetQueueSize();
  cases = [];
  nextClientIdCounter = 1;
  for (let i = 0; i < targetCount; i++) {
    cases.push(createClientCase(i, true));
  }
  state.activeCaseIndex = 0;
}

setInterval(() => {
  state.perpetualSeconds++;
  if (typeof PlantaoTIProfile !== "undefined") { try { PlantaoTIProfile.recordSeconds(1); } catch(e){} }
  const mins = String(Math.floor(state.perpetualSeconds / 60)).padStart(2, '0');
  const secs = String(state.perpetualSeconds % 60).padStart(2, '0');
  const timerEl = document.getElementById('perpetual-timer');
  if (timerEl) timerEl.textContent = `${mins}:${secs}`;

  const activeCount = cases.filter(c => !c.leavingState).length;
  if (activeCount < getTargetQueueSize()) {
    const freshClient = createClientCase(nextClientIdCounter - 1, true);
    cases.push(freshClient);
    renderAllUI();
  }

  // Monitoramento periódico do Rack Central de Infraestrutura
  centralRackState.incidentIntervalCounter++;
  if (centralRackState.incidentActive && !centralRackState.gameOver) {
    centralRackState.incidentSecondsRemaining--;
    const banner = document.getElementById('rack-incident-banner');
    const timeEl = document.getElementById('rack-incident-time');
    const pill = document.getElementById('central-rack-countdown-pill');

    if (banner && !banner.classList.contains('visible')) {
      banner.classList.add('visible');
    }

    const mins = Math.floor(Math.max(0, centralRackState.incidentSecondsRemaining) / 60);
    const secs = String(Math.max(0, centralRackState.incidentSecondsRemaining) % 60).padStart(2, '0');
    const formattedTime = `${String(mins).padStart(2, '0')}:${secs} (${centralRackState.incidentSecondsRemaining}s)`;

    if (timeEl) {
      if (centralRackState.incidentSecondsRemaining > 0) {
        timeEl.textContent = `⏳ Tempo Restante: ${formattedTime} — Risco de Incêndio!`;
      } else {
        timeEl.textContent = `🔥 TEMPO ESGOTADO! O RACK CENTRAL PEGOU FOGO!`;
      }
    }
    if (pill) {
      pill.style.display = 'inline-block';
      pill.textContent = `⏳ Tempo Restante: ${formattedTime}`;
    }

    // SE O TEMPO ESGOTAR: O RACK PEGA FOGO E O JOGO ACABA!
    if (centralRackState.incidentSecondsRemaining <= 0) {
      triggerCentralRackGameOver();
    }
  } else if (!centralRackState.incidentActive && !centralRackState.gameOver) {
    // Intervalo longo entre incidentes (~150 segundos)
    if (centralRackState.incidentIntervalCounter >= 150) {
      centralRackState.incidentIntervalCounter = 0;
      triggerCentralRackIncident();
    }
  }
}, 1000);

// ============================================================================
// SISTEMA DE ÁUDIO SINTETIZADOR (WEB AUDIO API)
// ============================================================================
let audioCtx = null;
function getAudioContext() {
  if (!audioCtx) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx) audioCtx = new AudioCtx();
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

function playTechChime(type) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    if (type === 'alarm') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.setValueAtTime(440, now + 0.15);
      osc.frequency.setValueAtTime(880, now + 0.3);
      osc.frequency.setValueAtTime(440, now + 0.45);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.6);
    } else if (type === 'success') {
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.08);
        gain.gain.setValueAtTime(0.14, now + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.35);
      });
    } else if (type === 'click') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, now);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === 'buzz') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(130, now);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
    }
  } catch (e) {
    // Autoplay policy restriction fallback
  }
}

// ============================================================================
// RACK CENTRAL DE INFRAESTRUTURA: 10 PUZZLES INTERATIVOS C/ MOUSE & INCIDENTES NOC
// ============================================================================
const CENTRAL_RACK_PROBLEMS = [
  {
    id: 'patch_panel',
    name: '1. Patch Panel Rompido (Rede Caída)',
    shortName: 'Patch Panel',
    icon: '🔌',
    category: 'Telecom & Fibra',
    desc: 'O cabeamento estruturado do rack central se soltou! Reconecte as 4 portas de rede (VLAN 10 Admin, VLAN 20 PDVs, VLAN 30 Wi-Fi e VLAN 40 Servidores) aos respectivos slots do Core Switch.',
    hint: 'Clique primeiro em uma Porta de Origem (lado esquerdo) e depois na Porta de Destino correspondente (lado direito) para ligar os cabos.',
    penaltyDesc: 'Sem internet, a taxa de atendimento cai e clientes perdem a paciência!'
  },
  {
    id: 'breakers',
    name: '2. Barramento de Disjuntores Desarmado',
    shortName: 'Disjuntores',
    icon: '⚡',
    category: 'Energia Trifásica',
    desc: 'Um surto de tensão derrubou o disjuntor geral do PDU! Reative as 4 fases na ordem estrita de segurança elétrica para evitar curto-circuito: Fase R → Fase S → Fase T → Neutro N.',
    hint: 'Clique em cada chave de disjuntor na ordem correta (R → S → T → N). Se armar na ordem errada, os disjuntores desarmam novamente!',
    penaltyDesc: 'Falta de energia nas cabines desliga computadores de bancada!'
  },
  {
    id: 'fans',
    name: '3. Troca Hot-Swap de Fans Queimadas',
    shortName: 'Fans Hot-Swap',
    icon: '🔄',
    category: 'Refrigeração Crítica',
    desc: 'Duas ventoinhas frontais de 14.000 RPM travaram por superaquecimento! Ejete os módulos danificados e encaixe novas ventoinhas redundantes sem desligar o servidor.',
    hint: 'Clique na alavanca "Ejetar Trava" das fans em falha (vermelhas) e em seguida clique em "Encaixar Nova Fan 14k RPM" para restaurar o fluxo de ar.',
    penaltyDesc: 'Superaquecimento causa thermal throttling nos servidores da loja!'
  },
  {
    id: 'raid',
    name: '4. Reconstrução RAID 10 (Troca de HD)',
    shortName: 'RAID Storage',
    icon: '💽',
    category: 'Storage & Bancos',
    desc: 'O SAS HDD #03 do array de armazenamento apresentou 4.096 Bad Sectors! Desbloqueie a gaveta hotswap, insira o SSD Enterprise novo e clique em "Iniciar Rebuild RAID".',
    hint: '1. Destrave a baia #03 -> 2. Puxe o HD Danificado -> 3. Insira o SSD Novo -> 4. Inicie o Rebuild do RAID 10.',
    penaltyDesc: 'Risco iminente de perda de dados dos clientes da assistência!'
  },
  {
    id: 'sfp',
    name: '5. Limpeza de Transceiver Óptico SFP+ 10G',
    shortName: 'SFP+ Óptico',
    icon: '💎',
    category: 'Backbone Óptico',
    desc: 'A poeira acumulada na virola da fibra monomodo gerou atenuação de sinal de -28dBm. Use a caneta de limpeza óptica para limpar o conector LC e trave o módulo SFP+ de volta no slot.',
    hint: 'Clique na caneta de limpeza 3 vezes para remover os resíduos e depois clique para travar o Transceiver no slot SFP+.',
    penaltyDesc: 'A perda de pacotes trava os terminais de pagamento da recepção!'
  },
  {
    id: 'dc_bus',
    name: '6. Barramento DC -48V & PDU Telecom',
    shortName: 'Força DC -48V',
    icon: '🎛️',
    category: 'Alimentação DC',
    desc: 'Os terminais do barramento DC -48V precisam ser reapertados e conectados nos bornes corretos: Polo Negativo (-48V), Retorno (0V RTN) e Aterramento de Proteção (PE).',
    hint: 'Clique no terminal de cabo solto e conecte no borne de latão correspondente (-48V, 0V e PE).',
    penaltyDesc: 'Queda de tensão contínua reinicia os roteadores de borda!'
  },
  {
    id: 'hvac',
    name: '7. Calibração do Climatizador de Precisão (HVAC)',
    shortName: 'Climatização',
    icon: '🌡️',
    category: 'Termodinâmica',
    desc: 'A sala do rack central está em 34°C com umidade inadequada gerando estática! Ajuste os 3 potenciômetros (Fluxo CFM, Setpoint °C e Umidade %) dentro das faixas ideais recomendadas.',
    hint: 'Arraste os 3 sliders para as zonas verdes ideais: Temperatura (19°C - 21°C), Umidade (45% - 55%) e Fluxo (> 800 CFM).',
    penaltyDesc: 'Calor excessivo queima placas-mãe em manutenção!'
  },
  {
    id: 'reset_switch',
    name: '8. Recovery ROM & Reset do Core Switch L3',
    shortName: 'Reset Switch',
    icon: '🔘',
    category: 'Firmware Switch',
    desc: 'O switch de agregação entrou em bootloop com kernel panic no firmware! É necessário segurar o botão físico de Reset de Hardware por 3 segundos ininterruptos para restaurar a ROM de fábrica.',
    hint: 'Pressione e SEGURE o botão de Reset com o mouse até a barra completar 100% (3 segundos).',
    penaltyDesc: 'Loop de broadcast congela toda a rede local!'
  },
  {
    id: 'ups',
    name: '9. Substituição de Bateria do No-break Modular',
    shortName: 'Baterias UPS',
    icon: '🔋',
    category: 'Nobreak UPS',
    desc: 'O pack de baterias LiFePO4 #2 estufou e perdeu a carga de flutuação! Desconecte o conector rápido Anderson, remova a bateria esgotada e conecte o módulo novo carregado a 100%.',
    hint: '1. Desconecte o conector Anderson -> 2. Remova o pack #2 -> 3. Encaixe o pack novo -> 4. Plugue o conector Anderson.',
    penaltyDesc: 'Qualquer oscilação na rede elétrica desliga o data center inteiro!'
  },
  {
    id: 'dip_switch',
    name: '10. Chaves DIP de Endereçamento Subnet NOC',
    shortName: 'Chaves DIP',
    icon: '🧮',
    category: 'Hardware Addressing',
    desc: 'O controlador de telemetria precisa do endereço de broadcast configurado fisicamente no bloco DIP de 8 chaves (1 a 8) para responder ao NOC: Máscara binária exigida: 1 1 0 0 1 0 1 1.',
    hint: 'Clique nas chaves DIP individuais para alterná-las entre UP (1 / Ligado) e DOWN (0 / Desligado) até igualar o código binário exigido.',
    penaltyDesc: 'Sem telemetria, o painel do NOC não recebe avisos de pane!'
  }
];

const centralRackState = {
  incidentActive: false,
  incidentProblemIdx: 0,
  incidentSecondsRemaining: 180,
  incidentIntervalCounter: 0,
  selectedPuzzleIdx: 0,
  fixedCount: 0,
  requiredProblemIndices: [],
  solvedProblemIndices: [],
  onFire: false,
  gameOver: false,
  puzzles: {
    0: { selectedSrc: null, connections: {}, required: { 0: 0, 1: 1, 2: 2, 3: 3 } },
    1: { armed: [false, false, false, false], step: 0 },
    2: {
      fans: [
        { id: 0, broken: false, installed: true, rpm: 14200 },
        { id: 1, broken: true, installed: true, rpm: 0 },
        { id: 2, broken: false, installed: true, rpm: 13900 },
        { id: 3, broken: true, installed: true, rpm: 0 }
      ]
    },
    3: { bayUnlocked: false, diskRemoved: false, newDiskInserted: false, rebuilding: false, rebuildProgress: 0 },
    4: { cleanClicks: 0, seated: false },
    5: { connected: { neg48: false, rtn0: false, pe: false }, selectedLug: null },
    6: { temp: 34, hum: 78, cfm: 350 },
    7: { holding: false, holdProgress: 0, booted: false },
    8: { andersonUnplugged: false, oldPackRemoved: false, newPackInserted: false, andersonReplugged: false },
    9: { switches: [0, 0, 0, 0, 0, 0, 0, 0], target: [1, 1, 0, 0, 1, 0, 1, 1] }
  }
};

let switchHoldInterval = null;

function resetRackPuzzleState(idx) {
  switch (idx) {
    case 0:
      centralRackState.puzzles[0] = { selectedSrc: null, connections: {}, required: { 0: 0, 1: 1, 2: 2, 3: 3 } };
      break;
    case 1:
      centralRackState.puzzles[1] = { armed: [false, false, false, false], step: 0 };
      break;
    case 2:
      centralRackState.puzzles[2] = {
        fans: [
          { id: 0, broken: false, installed: true, rpm: 14200 },
          { id: 1, broken: true, installed: true, rpm: 0 },
          { id: 2, broken: false, installed: true, rpm: 13900 },
          { id: 3, broken: true, installed: true, rpm: 0 }
        ]
      };
      break;
    case 3:
      centralRackState.puzzles[3] = { bayUnlocked: false, diskRemoved: false, newDiskInserted: false, rebuilding: false, rebuildProgress: 0 };
      break;
    case 4:
      centralRackState.puzzles[4] = { cleanClicks: 0, seated: false };
      break;
    case 5:
      centralRackState.puzzles[5] = { connected: { neg48: false, rtn0: false, pe: false }, selectedLug: null };
      break;
    case 6:
      centralRackState.puzzles[6] = { temp: 34, hum: 78, cfm: 350 };
      break;
    case 7:
      centralRackState.puzzles[7] = { holding: false, holdProgress: 0, booted: false };
      break;
    case 8:
      centralRackState.puzzles[8] = { andersonUnplugged: false, oldPackRemoved: false, newPackInserted: false, andersonReplugged: false };
      break;
    case 9:
      centralRackState.puzzles[9] = { switches: [0, 0, 0, 0, 0, 0, 0, 0], target: [1, 1, 0, 0, 1, 0, 1, 1] };
      break;
  }
}

function isCurrentRackPuzzleSolved(idx) {
  const p = centralRackState.puzzles[idx];
  if (!p) return false;
  switch (idx) {
    case 0:
      return [0, 1, 2, 3].every(src => p.connections[src] === p.required[src]);
    case 1:
      return p.armed.every(Boolean);
    case 2:
      return p.fans.every(f => f.installed && !f.broken);
    case 3:
      return p.newDiskInserted && p.rebuildProgress >= 100;
    case 4:
      return p.cleanClicks >= 3 && p.seated;
    case 5:
      return !!(p.connected.neg48 && p.connected.rtn0 && p.connected.pe);
    case 6:
      return p.temp >= 19 && p.temp <= 21 && p.hum >= 45 && p.hum <= 55 && p.cfm >= 800;
    case 7:
      return !!p.booted;
    case 8:
      return !!(p.andersonUnplugged && p.oldPackRemoved && p.newPackInserted && p.andersonReplugged);
    case 9:
      return p.switches.every((val, i) => val === p.target[i]);
    default:
      return false;
  }
}

function triggerCentralRackIncident(specificIdx) {
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
  if (titleEl) titleEl.textContent = `🚨 PANE NO RACK CENTRAL: ${requiredCount} MÓDULOS DEFEITUOSOS!`;
  if (textEl) textEl.innerHTML = `⚠️ <b>${requiredCount} Defeitos Pendentes:</b> ${probNames}. Resolva todos para reestabelecer o rack!`;
  
  const mins = Math.floor(centralRackState.incidentSecondsRemaining / 60);
  const secs = String(centralRackState.incidentSecondsRemaining % 60).padStart(2, '0');
  if (timeEl) timeEl.textContent = `Tempo Restante: ${String(mins).padStart(2, '0')}:${secs} (${centralRackState.incidentSecondsRemaining}s)`;

  playTechChime('alarm');
  showToast(`🚨 PANE NO RACK CENTRAL! ${requiredCount} módulos pifaram! Vá até um dos racks para consertar!`);
  addChatMessage('Alerta NOC', `🚨 <b>PANE NO RACK CENTRAL:</b> ${requiredCount} módulos apresentaram falha simultânea (${probNames}). Repare todos os módulos indicados no painel!`);

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
  const repGain = 1 + (count >= 5 ? 1 : 0);
  state.money += rewardMoney;
  changeReputation(repGain);
  playTechChime('success');

  showToast(`🎉 Todos os ${count} problemas do Rack foram resolvidos com sucesso! (+R$ ${rewardMoney} | +${repGain}% Rep)`);
  addChatMessage('Rack Central', `✅ <b>Infraestrutura 100% Reestabelecida!</b> Todos os ${count} módulos com defeito foram corrigidos. A rede, energia e climatização voltaram ao normal! (+R$ ${rewardMoney} | +${repGain}% Reputação)`);

  // Fecha o modal do rack automaticamente assim que todos os problemas forem concluídos!
  document.getElementById('central-rack-modal')?.classList.remove('open');

  renderCentralRackModal();
  renderAllUI();
}

function isPlayerNearCentralRack() {
  const you = state.players[state.mySlotIndex];
  if (!you) return true;
  const map = currentMap();
  const rackItems = (map.interactables || []).filter(i => i.id.startsWith('central_rack'));
  if (rackItems.length === 0) return true;
  return rackItems.some(item => Math.hypot(you.x - item.x, you.y - item.y) <= (item.radius + 35));
}

function isPlayerNearWorkbench() {
  const you = state.players[state.mySlotIndex];
  if (!you) return true;
  const map = currentMap();
  const wb = map.interactables?.find(i => i.id === 'my_workbench');
  if (!wb) return true;
  const dist = Math.hypot(you.x - wb.x, you.y - wb.y);
  return dist <= (wb.radius + 35);
}

function interactWithReceptionCounter() {
  const you = state.players[state.mySlotIndex];
  let nextIdx = cases.findIndex(c => !c.solved && !c.leavingState && !c.inMyRoom);
  if (nextIdx === -1) {
    nextIdx = cases.findIndex(c => !c.solved && !c.leavingState);
  }
  if (nextIdx === -1) {
    rebuildQueueForCurrentMode();
    nextIdx = 0;
  }

  const c = cases[nextIdx];
  if (!c) {
    showToast('🛎️ Nenhum cliente na fila de espera no momento!');
    return;
  }

  callClientToMyRoom(nextIdx);
  you.bubble = `🛎️ Senha chamada! ${c.clientName}, dirija-se à Bancada #01!`;
  you.bubbleTimer = 220;
  showToast(`🛎️ ${c.clientName} (${c.device}) chamado! Ele está indo para sua mesa. Vá até a sua Bancada de Trabalho na Cabine #01 para atendê-lo.`);
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

  if (clientInRoom.walkingToDesk && !clientInRoom.arrivedAtDesk) {
    you.bubble = '⏳ Aguardando o cliente sentar no banquinho...';
    you.bubbleTimer = 160;
    showToast(`⏳ ${clientInRoom.clientName} está a caminho da sua mesa. Aguarde ele se sentar para atendê-lo!`);
    return;
  }

  state.activeCaseIndex = cases.indexOf(clientInRoom);
  openWorkbenchModal(null, true);
}

function openCentralRackModal(idx, forceBypass = false) {
  if (!forceBypass && !isPlayerNearCentralRack()) {
    const you = state.players[state.mySlotIndex];
    const map = currentMap();
    const rackItems = (map.interactables || []).filter(i => i.id.startsWith('central_rack'));
    let closest = rackItems[0];
    let minDist = Infinity;
    rackItems.forEach(item => {
      const d = Math.hypot(you.x - item.x, you.y - item.y);
      if (d < minDist) { minDist = d; closest = item; }
    });
    const targetX = closest ? closest.x : 230;
    const targetY = closest ? (closest.y + 70) : 405;

    you.waypoints = buildDoorwayPath(you.x, you.y, targetX, targetY);
    you.bubble = '🏃 Indo até o Rack de Infraestrutura!';
    you.bubbleTimer = 180;
    showToast('⚠️ Você precisa ir até um dos Racks de Infraestrutura para acessar os comandos e resolver os incidentes!');
    return;
  }
  if (idx !== undefined) {
    centralRackState.selectedPuzzleIdx = idx;
  } else if (centralRackState.incidentActive) {
    centralRackState.selectedPuzzleIdx = centralRackState.incidentProblemIdx;
  }
  renderCentralRackModal();
  document.getElementById('central-rack-modal')?.classList.add('open');
}

function renderCentralRackModal() {
  const pwrLed = document.getElementById('rack-led-pwr');
  const netLed = document.getElementById('rack-led-net');
  const fanLed = document.getElementById('rack-led-fan');
  const raidLed = document.getElementById('rack-led-raid');

  const pwrOk = isCurrentRackPuzzleSolved(1) && isCurrentRackPuzzleSolved(5) && isCurrentRackPuzzleSolved(8);
  const netOk = isCurrentRackPuzzleSolved(0) && isCurrentRackPuzzleSolved(4) && isCurrentRackPuzzleSolved(7);
  const fanOk = isCurrentRackPuzzleSolved(2) && isCurrentRackPuzzleSolved(6);
  const raidOk = isCurrentRackPuzzleSolved(3);

  if (pwrLed) pwrLed.className = `rack-led ${pwrOk ? 'led-green' : 'led-red'}`;
  if (netLed) netLed.className = `rack-led ${netOk ? 'led-green' : 'led-amber'}`;
  if (fanLed) fanLed.className = `rack-led ${fanOk ? 'led-green' : 'led-red'}`;
  if (raidLed) raidLed.className = `rack-led ${raidOk ? 'led-green' : 'led-red'}`;

  const statusPill = document.getElementById('central-rack-status-pill');
  if (statusPill) {
    if (centralRackState.incidentActive) {
      const totalReq = centralRackState.requiredProblemIndices?.length || 1;
      const doneReq = centralRackState.solvedProblemIndices?.length || 0;
      statusPill.textContent = `🔴 PANE ATIVA: ${doneReq}/${totalReq} RESOLVIDOS`;
      statusPill.className = 'ticket-tag tag-burnt';
    } else {
      statusPill.textContent = '🟢 100% Operacional (Sem Falhas)';
      statusPill.className = 'ticket-tag tag-coop';
    }
  }

  const fixedEl = document.getElementById('central-rack-fixed-count');
  if (fixedEl) fixedEl.textContent = `${centralRackState.fixedCount} Incidentes Resolvidos`;

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
    defectTrackerHTML = `
      <div style="background:rgba(234, 88, 12, 0.15); border:2px solid #ea580c; border-radius:10px; padding:10px 14px; margin-bottom:12px;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:6px; margin-bottom:6px;">
          <b style="color:#fdba74; font-size:13px;">🚨 MÓDULOS DEFEITUOSOS QUE VOCÊ PRECISA CONSERTAR:</b>
          <span style="background:#ea580c; color:#fff; font-size:11px; font-weight:900; padding:2px 8px; border-radius:6px;">
            Progresso: ${doneReq}/${totalReq} Resolvidos
          </span>
        </div>
        <div style="display:flex; gap:8px; flex-wrap:wrap;">
          ${centralRackState.requiredProblemIndices.map(pIdx => {
            const p = CENTRAL_RACK_PROBLEMS[pIdx];
            const isDone = centralRackState.solvedProblemIndices?.includes(pIdx);
            const isSelected = curIdx === pIdx;
            return `
              <button type="button" class="btn ${isDone ? 'btn-verde' : 'btn-coral'} btn-xs" data-switch-rack-idx="${pIdx}" style="${isSelected ? 'outline:2px solid #fff; box-shadow:0 0 8px #fff;' : ''}">
                ${isDone ? '✅' : '⚠️'} ${p.shortName} ${isDone ? '(Concluído)' : '(Pendente)'}
              </button>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  if (titleEl) {
    const isCurDefective = centralRackState.incidentActive && centralRackState.requiredProblemIndices?.includes(curIdx);
    const isCurDone = centralRackState.solvedProblemIndices?.includes(curIdx);
    titleEl.innerHTML = `
      🗄️ ${curProb.name} 
      <span style="font-size:11px; color:#38bdf8; font-weight:700;">(${curProb.category})</span>
      ${isCurDefective ? (isCurDone ? ' <span style="color:#4ade80; font-size:12px; font-weight:900;">[✅ CONCLUÍDO]</span>' : ' <span style="color:#f87171; font-size:12px; font-weight:900;">[⚠️ DEFEITO ATIVO]</span>') : ''}
    `;
  }
  if (descEl) descEl.innerHTML = defectTrackerHTML + curProb.desc;
  if (hintEl) hintEl.innerHTML = `💡 <b>Como operar:</b> ${curProb.hint}`;

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
        completeBtn.innerHTML = `✅ Módulo "${curProb.shortName}" Já Reparado! Escolha o próximo defeito`;
      } else if (isSolved) {
        completeBtn.className = 'btn btn-verde btn-sm';
        completeBtn.innerHTML = `✅ Confirmar Reparo deste Módulo (${curProb.shortName})`;
      } else {
        completeBtn.className = 'btn btn-coral btn-sm';
        completeBtn.innerHTML = `⚠️ Resolva o Puzzle Acima para Reparar este Módulo`;
      }
    } else {
      completeBtn.className = 'btn btn-vidro btn-sm';
      completeBtn.innerHTML = `✅ Rack 100% Operacional (Sem panes ativas)`;
    }
  }


  // RENDERIZAÇÃO DOS 10 PUZZLES INTERATIVOS DO MOUSE
  switch (curIdx) {
    case 0: { // 1. Patch Panel
      const p = centralRackState.puzzles[0];
      const srcPorts = [
        { id: 0, name: 'VLAN 10 (Admin & Caixas)', tag: 'VLAN 10', color: '#38bdf8', icon: '💻' },
        { id: 1, name: 'VLAN 20 (PDVs & Balcão)', tag: 'VLAN 20', color: '#f59e0b', icon: '💳' },
        { id: 2, name: 'VLAN 30 (Wi-Fi 6 Visitantes)', tag: 'VLAN 30', color: '#22c55e', icon: '📶' },
        { id: 3, name: 'VLAN 40 (Servidores & NOC)', tag: 'VLAN 40', color: '#a855f7', icon: '🖥️' }
      ];
      const dstPorts = [
        { id: 0, name: 'Porta #01 (Core Admin)' },
        { id: 1, name: 'Porta #02 (Core PDV)' },
        { id: 2, name: 'Porta #03 (Access Point)' },
        { id: 3, name: 'Porta #04 (Cluster NOC)' }
      ];

      stage.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:12px;">
          <div style="font-size:12.5px; font-weight:700; color:#cbd5e1;">
            O patch cord das 4 VLANs se soltou do Switch Core 10G. Conecte cada porta de origem (Patch Panel à esquerda) na sua porta correspondente do Switch (à direita).
          </div>
          <div style="display:grid; grid-template-columns: 1fr auto 1fr; gap:14px; align-items:center;">
            <div style="display:flex; flex-direction:column; gap:8px;">
              <div style="font-size:11px; font-weight:900; color:#94a3b8; text-transform:uppercase;">1. Patch Panel (Origem)</div>
              ${srcPorts.map(s => `
                <div class="rack-click-slot ${p.selectedSrc === s.id ? 'slot-selected' : ''} ${p.connections[s.id] !== undefined ? 'slot-connected' : ''}" data-patch-src="${s.id}">
                  <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span>${s.icon} ${s.name}</span>
                    <span style="font-size:10px; padding:2px 6px; border-radius:4px; background:${s.color}; color:#000; font-weight:900;">${s.tag}</span>
                  </div>
                  ${p.connections[s.id] !== undefined ? `<div style="font-size:10px; color:#86efac; margin-top:4px;">➔ Ligado ao ${dstPorts[p.connections[s.id]].name}</div>` : ''}
                </div>
              `).join('')}
            </div>

            <div style="display:flex; flex-direction:column; align-items:center; gap:8px; padding:0 8px;">
              <span style="font-size:22px;">⇄</span>
              <button type="button" class="btn btn-vidro btn-xs" id="btn-rack-reset-patch">Desfazer Cabos</button>
            </div>

            <div style="display:flex; flex-direction:column; gap:8px;">
              <div style="font-size:11px; font-weight:900; color:#94a3b8; text-transform:uppercase;">2. Switch Core 10G (Destino)</div>
              ${dstPorts.map(d => {
                const connectedSrcId = Object.keys(p.connections).find(k => p.connections[k] === d.id);
                const isConnected = connectedSrcId !== undefined;
                return `
                  <div class="rack-click-slot ${isConnected ? 'slot-connected' : ''}" data-patch-dst="${d.id}">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                      <span>🖧 ${d.name}</span>
                      <span class="ticket-tag ${isConnected ? 'tag-verde' : 'tag-normal'}">${isConnected ? 'LINK 10G OK' : 'PORTA LIVRE'}</span>
                    </div>
                    ${isConnected ? `<div style="font-size:10px; color:#86efac; margin-top:4px;">Recebendo: ${srcPorts[connectedSrcId].name}</div>` : ''}
                  </div>
                `;
              }).join('')}
            </div>
          </div>
          ${isSolved ? `<div style="background:#14532d; border:2px solid #22c55e; border-radius:10px; padding:10px; text-align:center; font-size:12.5px; font-weight:900; color:#86efac;">✅ Todos os 4 Cabos Estruturados Conectados com Link de 10Gbps!</div>` : ''}
        </div>
      `;

      stage.querySelectorAll('[data-patch-src]').forEach(btn => {
        btn.addEventListener('click', () => {
          p.selectedSrc = Number(btn.dataset.patchSrc);
          playTechChime('click');
          renderCentralRackModal();
        });
      });

      stage.querySelectorAll('[data-patch-dst]').forEach(btn => {
        btn.addEventListener('click', () => {
          if (p.selectedSrc === null) {
            showToast('⚠️ Clique primeiro em uma Porta de Origem (lado esquerdo)!');
            return;
          }
          const dstId = Number(btn.dataset.patchDst);
          p.connections[p.selectedSrc] = dstId;
          p.selectedSrc = null;
          playTechChime('click');
          if (isCurrentRackPuzzleSolved(0)) {
            playTechChime('success');
          }
          renderCentralRackModal();
        });
      });

      stage.querySelector('#btn-rack-reset-patch')?.addEventListener('click', () => {
        p.connections = {};
        p.selectedSrc = null;
        playTechChime('click');
        renderCentralRackModal();
      });
      break;
    }

    case 1: { // 2. Barramento de Disjuntores
      const p = centralRackState.puzzles[1];
      const breakers = [
        { phase: 'Fase R (L1)', label: 'Barramento 127V' },
        { phase: 'Fase S (L2)', label: 'Barramento 127V' },
        { phase: 'Fase T (L3)', label: 'Barramento 127V' },
        { phase: 'Neutro N (PE)', label: 'Barramento Terra' }
      ];

      stage.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:12px; align-items:center;">
          <div style="font-size:12.5px; font-weight:700; color:#cbd5e1; text-align:center;">
            ⚠️ <b>Procedimento de Segurança NR-10:</b> Para evitar desequilíbrio de fase e arco voltaico, arme os disjuntores na ordem estrita: <b style="color:#fde047;">Fase R ➔ Fase S ➔ Fase T ➔ Neutro N</b>.
          </div>
          <div style="display:flex; gap:16px; justify-content:center; flex-wrap:wrap; margin:10px 0;">
            ${breakers.map((b, idx) => `
              <div class="rack-breaker-switch ${p.armed[idx] ? 'armed' : ''}" data-breaker-idx="${idx}">
                <span style="font-size:11px; font-weight:900; color:#94a3b8;">${b.phase}</span>
                <div class="breaker-handle"></div>
                <span class="rack-led ${p.armed[idx] ? 'led-green' : 'led-red'}"></span>
                <span style="font-size:10px; font-weight:900; margin-top:4px; color:${p.armed[idx] ? '#86efac' : '#fca5a5'};">
                  ${p.armed[idx] ? 'ARMADO' : 'DESARMADO'}
                </span>
              </div>
            `).join('')}
          </div>
          <div style="font-size:11.5px; font-weight:800; color:#94a3b8;">
            Passo atual: <b style="color:#38bdf8;">${p.step < 4 ? `Armar ${breakers[p.step].phase} (${breakers[p.step].label})` : '✅ Barramento Trifásico 380V Alimentando o PDU!'}</b>
          </div>
        </div>
      `;

      stage.querySelectorAll('[data-breaker-idx]').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = Number(btn.dataset.breakerIdx);
          if (p.armed[idx]) return;
          if (idx === p.step) {
            p.armed[idx] = true;
            p.step++;
            playTechChime('click');
            if (p.step === 4) {
              playTechChime('success');
              showToast('⚡ Barramento Trifásico 380V Armado com Sucesso!');
            }
          } else {
            p.armed = [false, false, false, false];
            p.step = 0;
            playTechChime('buzz');
            showToast('⚠️ Curto de Fase! Os disjuntores desarmaram por segurança. Arme na ordem R ➔ S ➔ T ➔ N!');
          }
          renderCentralRackModal();
        });
      });
      break;
    }

    case 2: { // 3. Fans Hot-Swap
      const p = centralRackState.puzzles[2];
      stage.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:12px;">
          <div style="font-size:12.5px; font-weight:700; color:#cbd5e1;">
            Duas gavetas de ventoinhas frontais falharam (0 RPM)! Destrave as travas mecânicas das fans em alerta vermelho, remova o módulo danificado e insira as novas ventoinhas de 14.000 RPM.
          </div>
          <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap:12px;">
            ${p.fans.map((f, i) => `
              <div style="background:#1e293b; border:2px solid ${f.broken ? '#ef4444' : '#22c55e'}; border-radius:12px; padding:12px; display:flex; flex-direction:column; align-items:center; gap:8px;">
                <div style="display:flex; justify-content:space-between; width:100%; align-items:center;">
                  <span style="font-size:12px; font-weight:900;">Fan Bay #${i + 1}</span>
                  <span class="rack-led ${f.broken ? 'led-red' : 'led-green'}"></span>
                </div>
                <div style="font-size:32px;">
                  ${!f.installed ? '🕳️' : (f.broken ? '💥' : '🌀')}
                </div>
                <div style="font-size:11.5px; font-weight:900; color:${f.broken ? '#f87171' : '#4ade80'};">
                  ${!f.installed ? 'VAZIO (FAN REMOVIDA)' : (f.broken ? 'FALHA: 0 RPM' : `${f.rpm} RPM (OPERACIONAL)`)}
                </div>
                ${f.broken && f.installed ? `
                  <button type="button" class="btn btn-coral btn-xs" data-eject-fan="${i}">🔓 Ejetar Trava da Fan</button>
                ` : ''}
                ${!f.installed ? `
                  <button type="button" class="btn btn-verde btn-xs" data-insert-fan="${i}">📥 Encaixar Nova Fan 14k RPM</button>
                ` : ''}
                ${!f.broken && f.installed ? `
                  <span style="font-size:10.5px; font-weight:800; color:#86efac;">Trava Travada · OK</span>
                ` : ''}
              </div>
            `).join('')}
          </div>
          ${isSolved ? `<div style="background:#14532d; border:2px solid #22c55e; border-radius:10px; padding:10px; text-align:center; font-size:12.5px; font-weight:900; color:#86efac;">✅ Todos os 4 Módulos de Refrigeração Operando a 14.000 RPM!</div>` : ''}
        </div>
      `;

      stage.querySelectorAll('[data-eject-fan]').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = Number(btn.dataset.ejectFan);
          p.fans[idx].installed = false;
          playTechChime('click');
          renderCentralRackModal();
        });
      });

      stage.querySelectorAll('[data-insert-fan]').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = Number(btn.dataset.insertFan);
          p.fans[idx].installed = true;
          p.fans[idx].broken = false;
          p.fans[idx].rpm = 14000;
          playTechChime('click');
          if (isCurrentRackPuzzleSolved(2)) {
            playTechChime('success');
          }
          renderCentralRackModal();
        });
      });
      break;
    }

    case 3: { // 4. RAID Storage
      const p = centralRackState.puzzles[3];
      stage.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:12px;">
          <div style="font-size:12.5px; font-weight:700; color:#cbd5e1;">
            Array de Armazenamento RAID 10 com gavetas SAS de 2.5". O SAS Drive #03 acusou setores corrompidos. Substitua-o e comande o espelhamento RAID.
          </div>
          <div style="display:grid; grid-template-columns: repeat(6, 1fr); gap:8px;">
            ${[1, 2, 3, 4, 5, 6].map(slot => {
              const isDamaged = (slot === 3);
              let statusColor = '#22c55e';
              let statusText = 'SAS OK';
              let icon = '💽';
              if (isDamaged) {
                if (!p.bayUnlocked) { statusColor = '#ef4444'; statusText = 'SMART FAIL'; icon = '💥'; }
                else if (!p.diskRemoved) { statusColor = '#f59e0b'; statusText = 'DESTRAVADO'; icon = '🔓'; }
                else if (!p.newDiskInserted) { statusColor = '#94a3b8'; statusText = 'SLOT LIVRE'; icon = '🕳️'; }
                else if (p.rebuildProgress < 100) { statusColor = '#38bdf8'; statusText = 'REBUILDING'; icon = '🔄'; }
                else { statusColor = '#22c55e'; statusText = 'SSD ATIVO'; icon = '💾'; }
              }
              return `
                <div style="background:#1e293b; border:2px solid ${statusColor}; border-radius:10px; padding:10px 4px; text-align:center; display:flex; flex-direction:column; align-items:center; gap:4px;">
                  <span style="font-size:10px; font-weight:900; color:#94a3b8;">BAY #${slot}</span>
                  <span style="font-size:20px;">${icon}</span>
                  <span style="font-size:9.5px; font-weight:900; color:${statusColor};">${statusText}</span>
                </div>
              `;
            }).join('')}
          </div>

          <div style="background:#1e293b; border:1.5px solid #334155; border-radius:12px; padding:12px; display:flex; flex-direction:column; gap:8px;">
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
              <span style="font-size:12px; font-weight:800; color:#f8fafc;">Ações de Troca na Baia #03:</span>
              <div style="display:flex; gap:6px; flex-wrap:wrap;">
                ${!p.bayUnlocked ? `
                  <button type="button" class="btn btn-amarelo btn-xs" id="btn-raid-unlock">1. 🔓 Destravar Gaveta Hot-swap</button>
                ` : ''}
                ${p.bayUnlocked && !p.diskRemoved ? `
                  <button type="button" class="btn btn-coral btn-xs" id="btn-raid-remove">2. 🗑️ Puxar Disco Danificado</button>
                ` : ''}
                ${p.diskRemoved && !p.newDiskInserted ? `
                  <button type="button" class="btn btn-verde btn-xs" id="btn-raid-insert">3. 💾 Inserir SSD Enterprise 3.84TB</button>
                ` : ''}
                ${p.newDiskInserted && p.rebuildProgress < 100 && !p.rebuilding ? `
                  <button type="button" class="btn btn-roxo btn-xs" id="btn-raid-rebuild">4. ⚡ Iniciar Rebuild do RAID 10</button>
                ` : ''}
              </div>
            </div>
            ${p.rebuilding || p.rebuildProgress >= 100 ? `
              <div>
                <div style="display:flex; justify-content:space-between; font-size:11px; font-weight:900; margin-bottom:4px;">
                  <span>Sincronizando Blocos do Espelhamento RAID 10...</span>
                  <span style="color:#38bdf8;">${p.rebuildProgress}%</span>
                </div>
                <div style="background:#090d16; border-radius:8px; height:12px; overflow:hidden;">
                  <div style="background:linear-gradient(90deg, #38bdf8, #22c55e); height:100%; width:${p.rebuildProgress}%; transition:width 0.2s;"></div>
                </div>
              </div>
            ` : ''}
          </div>
          ${isSolved ? `<div style="background:#14532d; border:2px solid #22c55e; border-radius:10px; padding:10px; text-align:center; font-size:12.5px; font-weight:900; color:#86efac;">✅ RAID 10 Reconstruído e Sincronizado com SSD Enterprise!</div>` : ''}
        </div>
      `;

      stage.querySelector('#btn-raid-unlock')?.addEventListener('click', () => {
        p.bayUnlocked = true;
        playTechChime('click');
        renderCentralRackModal();
      });

      stage.querySelector('#btn-raid-remove')?.addEventListener('click', () => {
        p.diskRemoved = true;
        playTechChime('click');
        renderCentralRackModal();
      });

      stage.querySelector('#btn-raid-insert')?.addEventListener('click', () => {
        p.newDiskInserted = true;
        playTechChime('click');
        renderCentralRackModal();
      });

      stage.querySelector('#btn-raid-rebuild')?.addEventListener('click', () => {
        p.rebuilding = true;
        renderCentralRackModal();
        const interval = setInterval(() => {
          p.rebuildProgress += 10;
          if (p.rebuildProgress >= 100) {
            p.rebuildProgress = 100;
            p.rebuilding = false;
            clearInterval(interval);
            playTechChime('success');
            showToast('✅ Rebuild do RAID 10 Concluído com Sucesso! Array 100% íntegro.');
          }
          renderCentralRackModal();
        }, 150);
      });
      break;
    }

    case 4: { // 5. SFP+ Óptico
      const p = centralRackState.puzzles[4];
      stage.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:12px; align-items:center;">
          <div style="font-size:12.5px; font-weight:700; color:#cbd5e1; text-align:center;">
            Atenuação no enlace de fibra óptica devido a sujeira na virola cerâmica LC do transceiver SFP+ 10Gbps.
          </div>
          <div style="display:flex; gap:20px; align-items:center; justify-content:center; flex-wrap:wrap;">
            <div style="display:flex; flex-direction:column; align-items:center; gap:6px;">
              <span style="font-size:11px; font-weight:900; color:#94a3b8;">Inspeção Microscópica da Virola (200x)</span>
              <div style="width:110px; height:110px; border-radius:50%; border:3px solid ${p.cleanClicks >= 3 ? '#22c55e' : '#f59e0b'}; background:#020617; display:flex; align-items:center; justify-content:center; position:relative; box-shadow:0 0 15px rgba(0,0,0,0.8);">
                <div style="width:36px; height:36px; border-radius:50%; border:2px dashed #38bdf8; display:flex; align-items:center; justify-content:center;">
                  <div style="width:10px; height:10px; border-radius:50%; background:${p.cleanClicks >= 3 ? '#38bdf8' : '#64748b'};"></div>
                </div>
                ${p.cleanClicks < 1 ? `<span style="position:absolute; top:28px; left:28px; font-size:14px;">🟤</span>` : ''}
                ${p.cleanClicks < 2 ? `<span style="position:absolute; bottom:24px; right:26px; font-size:12px;">⚫</span>` : ''}
                ${p.cleanClicks < 3 ? `<span style="position:absolute; top:35px; right:28px; font-size:10px;">🟤</span>` : ''}
                ${p.cleanClicks >= 3 ? `<span style="position:absolute; font-size:24px;">✨</span>` : ''}
              </div>
              <span style="font-size:11px; font-weight:800; color:${p.cleanClicks >= 3 ? '#86efac' : '#fcd34d'};">
                ${p.cleanClicks >= 3 ? '100% Limpo (Perda 0.01 dB)' : `Sujeira detectada (${p.cleanClicks}/3 passadas)`}
              </span>
            </div>

            <div style="display:flex; flex-direction:column; gap:10px; min-width:240px;">
              ${p.cleanClicks < 3 ? `
                <button type="button" class="btn btn-teal btn-sm" id="btn-sfp-clean">
                  🧹 Passar Caneta de Limpeza Óptica (${p.cleanClicks}/3)
                </button>
              ` : ''}
              ${p.cleanClicks >= 3 && !p.seated ? `
                <button type="button" class="btn btn-verde btn-sm" id="btn-sfp-seat">
                  📥 Encaixar e Travar Transceiver no Slot SFP+ 10G
                </button>
              ` : ''}
              ${p.seated ? `
                <div style="background:#14532d; border:2px solid #22c55e; border-radius:10px; padding:10px; text-align:center;">
                  <span style="font-size:12px; font-weight:900; color:#86efac;">🟢 LINK ÓPTICO 10G FIXO</span>
                  <div style="font-size:10.5px; color:#bbf7d0; margin-top:2px;">Transceiver travado e sincronizado a 10.312 Gbps!</div>
                </div>
              ` : ''}
            </div>
          </div>
        </div>
      `;

      stage.querySelector('#btn-sfp-clean')?.addEventListener('click', () => {
        p.cleanClicks++;
        playTechChime('click');
        renderCentralRackModal();
      });

      stage.querySelector('#btn-sfp-seat')?.addEventListener('click', () => {
        p.seated = true;
        playTechChime('success');
        renderCentralRackModal();
      });
      break;
    }

    case 5: { // 6. Força DC -48V
      const p = centralRackState.puzzles[5];
      const dcLugs = [
        { id: 'neg48', name: 'Terminal Polo Negativo (-48V DC)', label: '-48V', color: '#1e3a8a', icon: '⚡' },
        { id: 'rtn0', name: 'Terminal Retorno Neutro (0V RTN)', label: '0V RTN', color: '#b91c1c', icon: '🔌' },
        { id: 'pe', name: 'Terminal Proteção Terra (PE)', label: 'PE TERRA', color: '#15803d', icon: '🛡️' }
      ];

      stage.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:12px;">
          <div style="font-size:12.5px; font-weight:700; color:#cbd5e1;">
            Reconecte os 3 terminais olhal de cobre estanhado aos bornes rosqueados de latão do Barramento DC -48V Telecom.
          </div>
          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px;">
            <div style="display:flex; flex-direction:column; gap:8px;">
              <span style="font-size:11px; font-weight:900; color:#94a3b8; text-transform:uppercase;">1. Cabos de Força (Clique p/ Selecionar)</span>
              ${dcLugs.map(l => `
                <div class="rack-click-slot ${p.selectedLug === l.id ? 'slot-selected' : ''} ${p.connected[l.id] ? 'slot-connected' : ''}" data-dc-lug="${l.id}">
                  <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span>${l.icon} ${l.name}</span>
                    <span style="font-size:10px; padding:2px 6px; border-radius:4px; background:${l.color}; color:#fff; font-weight:900;">${l.label}</span>
                  </div>
                  <div style="font-size:10px; color:${p.connected[l.id] ? '#86efac' : '#94a3b8'}; margin-top:4px;">
                    ${p.connected[l.id] ? 'Apertado a 12 N·m [OK]' : 'Terminal Desconectado'}
                  </div>
                </div>
              `).join('')}
            </div>

            <div style="display:flex; flex-direction:column; gap:8px;">
              <span style="font-size:11px; font-weight:900; color:#94a3b8; text-transform:uppercase;">2. Bornes do Barramento PDU DC</span>
              ${dcLugs.map(l => `
                <div class="rack-click-slot ${p.connected[l.id] ? 'slot-connected' : ''}" data-dc-stud="${l.id}">
                  <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span>🔩 Borne ${l.label}</span>
                    <span class="ticket-tag ${p.connected[l.id] ? 'tag-verde' : 'tag-normal'}">${p.connected[l.id] ? 'CONECTADO' : 'AGUARDANDO'}</span>
                  </div>
                  <div style="font-size:10px; color:#cbd5e1; margin-top:4px;">${l.name}</div>
                </div>
              `).join('')}
            </div>
          </div>
          ${isSolved ? `<div style="background:#14532d; border:2px solid #22c55e; border-radius:10px; padding:10px; text-align:center; font-size:12.5px; font-weight:900; color:#86efac;">✅ Barramento DC -48V Alimentando o PDU Telecom (Tensão Estável: -48.4V)!</div>` : ''}
        </div>
      `;

      stage.querySelectorAll('[data-dc-lug]').forEach(btn => {
        btn.addEventListener('click', () => {
          p.selectedLug = btn.dataset.dcLug;
          playTechChime('click');
          renderCentralRackModal();
        });
      });

      stage.querySelectorAll('[data-dc-stud]').forEach(btn => {
        btn.addEventListener('click', () => {
          if (!p.selectedLug) {
            showToast('⚠️ Clique primeiro em um Cabo de Força (lado esquerdo)!');
            return;
          }
          const studId = btn.dataset.dcStud;
          if (p.selectedLug === studId) {
            p.connected[studId] = true;
            p.selectedLug = null;
            playTechChime('click');
            if (isCurrentRackPuzzleSolved(5)) {
              playTechChime('success');
            }
          } else {
            playTechChime('buzz');
            showToast('⚠️ Curto! Conecte cada cabo no seu borne correto (-48V, 0V e PE)!');
          }
          renderCentralRackModal();
        });
      });
      break;
    }

    case 6: { // 7. Climatização HVAC
      const p = centralRackState.puzzles[6];
      stage.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:12px;">
          <div style="font-size:12.5px; font-weight:700; color:#cbd5e1;">
            Ajuste os 3 potenciômetros do controlador HVAC de precisão para atingir as zonas verdes ideais:
          </div>
          <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap:12px;">
            <div class="rack-slider-wrap">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <span style="font-size:12px; font-weight:900;">🌡️ Setpoint de Temperatura:</span>
                <b style="color:${p.temp >= 19 && p.temp <= 21 ? '#4ade80' : '#f87171'};">${p.temp}°C ${p.temp >= 19 && p.temp <= 21 ? '✓' : ''}</b>
              </div>
              <input type="range" id="slider-rack-temp" min="15" max="35" value="${p.temp}">
              <span style="font-size:10.5px; color:#94a3b8;">Faixa Ideal: <b>19°C a 21°C</b></span>
            </div>

            <div class="rack-slider-wrap">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <span style="font-size:12px; font-weight:900;">💧 Umidade Relativa:</span>
                <b style="color:${p.hum >= 45 && p.hum <= 55 ? '#4ade80' : '#f87171'};">${p.hum}% ${p.hum >= 45 && p.hum <= 55 ? '✓' : ''}</b>
              </div>
              <input type="range" id="slider-rack-hum" min="20" max="90" value="${p.hum}">
              <span style="font-size:10.5px; color:#94a3b8;">Faixa Ideal: <b>45% a 55%</b> (Evita estática)</span>
            </div>

            <div class="rack-slider-wrap">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <span style="font-size:12px; font-weight:900;">💨 Fluxo de Ar Frontal:</span>
                <b style="color:${p.cfm >= 800 ? '#4ade80' : '#f87171'};">${p.cfm} CFM ${p.cfm >= 800 ? '✓' : ''}</b>
              </div>
              <input type="range" id="slider-rack-cfm" min="200" max="1200" step="50" value="${p.cfm}">
              <span style="font-size:10.5px; color:#94a3b8;">Faixa Ideal: <b>800+ CFM</b></span>
            </div>
          </div>
          ${isSolved ? `<div style="background:#14532d; border:2px solid #22c55e; border-radius:10px; padding:10px; text-align:center; font-size:12.5px; font-weight:900; color:#86efac;">✅ Climatização e Refrigeração nos Parâmetros Ótimos!</div>` : ''}
        </div>
      `;

      stage.querySelector('#slider-rack-temp')?.addEventListener('input', (e) => {
        p.temp = Number(e.target.value);
        if (isCurrentRackPuzzleSolved(6)) playTechChime('success');
        renderCentralRackModal();
      });

      stage.querySelector('#slider-rack-hum')?.addEventListener('input', (e) => {
        p.hum = Number(e.target.value);
        if (isCurrentRackPuzzleSolved(6)) playTechChime('success');
        renderCentralRackModal();
      });

      stage.querySelector('#slider-rack-cfm')?.addEventListener('input', (e) => {
        p.cfm = Number(e.target.value);
        if (isCurrentRackPuzzleSolved(6)) playTechChime('success');
        renderCentralRackModal();
      });
      break;
    }

    case 7: { // 8. Reset Switch (Hold 3s)
      const p = centralRackState.puzzles[7];
      stage.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:12px; align-items:center;">
          <div style="font-size:12.5px; font-weight:700; color:#cbd5e1; text-align:center;">
            O Switch Core L3 travou o microcódigo do ASIC. Pressione e <b>SEGURE</b> o botão de Hardware Recovery por 3 segundos ininterruptos para regravar a ROM!
          </div>
          <div style="background:#020617; border:1.5px solid #334155; border-radius:10px; padding:10px; width:100%; max-width:600px; font-family:monospace; font-size:11px; color:${p.booted ? '#4ade80' : '#f87171'};">
            ${p.booted
              ? `> ROM Recovered [OK]<br>> Booting Switch Core v22.4R1...<br>> Port 1-48 GigabitEthernet UP [OK]<br>> Core Switch 100% OPERATIONAL!`
              : `> [PANIC 0x8F01] ASIC microcode loop timeout!<br>> System halted. Press and HOLD Hardware Reset for 3s to restore factory ROM.`}
          </div>

          ${!p.booted ? `
            <div style="display:flex; flex-direction:column; align-items:center; gap:8px;">
              <button type="button" class="btn btn-coral" id="btn-rack-reset-hold" style="padding:14px 28px; font-size:14px; font-weight:900; user-select:none;">
                🔘 SEGURE O BOTÃO RESET AQUI (3s)
              </button>
              <div style="width:240px; background:#1e293b; border-radius:6px; height:10px; overflow:hidden;">
                <div style="background:#22c55e; height:100%; width:${p.holdProgress}%; transition:width 0.05s;"></div>
              </div>
              <span style="font-size:11px; font-weight:800; color:#94a3b8;">Progresso: ${Math.round(p.holdProgress)}%</span>
            </div>
          ` : `
            <div style="background:#14532d; border:2px solid #22c55e; border-radius:10px; padding:10px 20px; text-align:center;">
              <span style="font-size:13px; font-weight:900; color:#86efac;">✅ CORE SWITCH REINICIALIZADO COM SUCESSO!</span>
            </div>
          `}
        </div>
      `;

      const holdBtn = stage.querySelector('#btn-rack-reset-hold');
      if (holdBtn) {
        const startHold = () => {
          if (p.booted) return;
          p.holding = true;
          if (switchHoldInterval) clearInterval(switchHoldInterval);
          switchHoldInterval = setInterval(() => {
            p.holdProgress += 4;
            if (p.holdProgress >= 100) {
              p.holdProgress = 100;
              p.booted = true;
              p.holding = false;
              clearInterval(switchHoldInterval);
              playTechChime('success');
              showToast('✅ Reset de Hardware concluído! ROM restaurada e Switch Core reiniciado.');
            }
            renderCentralRackModal();
          }, 40);
        };
        const cancelHold = () => {
          if (p.booted) return;
          if (switchHoldInterval) {
            clearInterval(switchHoldInterval);
            switchHoldInterval = null;
          }
          if (p.holdProgress < 100) {
            p.holdProgress = 0;
            p.holding = false;
            renderCentralRackModal();
          }
        };

        holdBtn.addEventListener('mousedown', startHold);
        holdBtn.addEventListener('mouseup', cancelHold);
        holdBtn.addEventListener('mouseleave', cancelHold);
        holdBtn.addEventListener('touchstart', (e) => { e.preventDefault(); startHold(); });
        holdBtn.addEventListener('touchend', cancelHold);
      }
      break;
    }

    case 8: { // 9. Baterias UPS
      const p = centralRackState.puzzles[8];
      stage.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:12px;">
          <div style="font-size:12.5px; font-weight:700; color:#cbd5e1;">
            Módulo de baterias do Nobreak Rack. O Pack #2 LiFePO4 perdeu capacidade eletroquímica. Execute os 4 passos com o mouse:
          </div>
          <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:10px;">
            ${[1, 2, 3, 4].map(bId => {
              const isBad = (bId === 2);
              let border = '#22c55e';
              let icon = '🔋';
              let text = 'Pack LiFePO4 OK (54.4V)';
              if (isBad) {
                if (!p.oldPackRemoved) { border = '#ef4444'; icon = '⚠️'; text = 'Pack Esgotado (0V)'; }
                else if (!p.newPackInserted) { border = '#94a3b8'; icon = '🕳️'; text = 'Gaveta Vazia'; }
                else { border = '#22c55e'; icon = '🔋'; text = 'Novo Pack LiFePO4 (54.4V)'; }
              }
              return `
                <div style="background:#1e293b; border:2px solid ${border}; border-radius:10px; padding:10px; text-align:center; display:flex; flex-direction:column; align-items:center; gap:4px;">
                  <span style="font-size:10px; font-weight:900; color:#94a3b8;">UPS PACK #${bId}</span>
                  <span style="font-size:26px;">${icon}</span>
                  <span style="font-size:9.5px; font-weight:800; color:${border};">${text}</span>
                </div>
              `;
            }).join('')}
          </div>

          <div style="display:flex; gap:8px; justify-content:center; flex-wrap:wrap; margin-top:6px;">
            ${!p.andersonUnplugged ? `
              <button type="button" class="btn btn-amarelo btn-xs" id="btn-ups-step1">1. 🔌 Desconectar Trava Anderson Powerpole</button>
            ` : ''}
            ${p.andersonUnplugged && !p.oldPackRemoved ? `
              <button type="button" class="btn btn-coral btn-xs" id="btn-ups-step2">2. 📤 Puxar Módulo LiFePO4 Esgotado #2</button>
            ` : ''}
            ${p.oldPackRemoved && !p.newPackInserted ? `
              <button type="button" class="btn btn-verde btn-xs" id="btn-ups-step3">3. 📥 Deslizar Novo Pack LiFePO4 48V 100Ah</button>
            ` : ''}
            ${p.newPackInserted && !p.andersonReplugged ? `
              <button type="button" class="btn btn-roxo btn-xs" id="btn-ups-step4">4. 🔒 Travar Conector Rápido Anderson</button>
            ` : ''}
            ${p.andersonReplugged ? `
              <div style="background:#14532d; border:2px solid #22c55e; border-radius:10px; padding:8px 16px; font-size:12px; font-weight:900; color:#86efac;">
                ✅ Banco de Baterias em Flutuação (54.4V · Autonomia: 8 Horas)!
              </div>
            ` : ''}
          </div>
        </div>
      `;

      stage.querySelector('#btn-ups-step1')?.addEventListener('click', () => {
        p.andersonUnplugged = true;
        playTechChime('click');
        renderCentralRackModal();
      });

      stage.querySelector('#btn-ups-step2')?.addEventListener('click', () => {
        p.oldPackRemoved = true;
        playTechChime('click');
        renderCentralRackModal();
      });

      stage.querySelector('#btn-ups-step3')?.addEventListener('click', () => {
        p.newPackInserted = true;
        playTechChime('click');
        renderCentralRackModal();
      });

      stage.querySelector('#btn-ups-step4')?.addEventListener('click', () => {
        p.andersonReplugged = true;
        playTechChime('success');
        renderCentralRackModal();
      });
      break;
    }

    case 9: { // 10. Chaves DIP
      const p = centralRackState.puzzles[9];
      stage.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:12px; align-items:center;">
          <div style="font-size:12.5px; font-weight:700; color:#cbd5e1; text-align:center;">
            Configure as 8 chaves DIP físicas para o endereço de broadcast exigido pelo NOC: <b style="color:#fde047; font-family:monospace; font-size:14px;">1  1  0  0  1  0  1  1</b>
          </div>

          <div style="display:flex; gap:12px; justify-content:center; flex-wrap:wrap; margin:10px 0;">
            ${p.switches.map((val, idx) => `
              <div style="display:flex; flex-direction:column; align-items:center; gap:6px;">
                <span style="font-size:10px; font-weight:900; color:#94a3b8;">SW #${idx + 1}</span>
                <div class="rack-dip-switch ${val === 1 ? 'dip-on' : ''}" data-dip-idx="${idx}">
                  <span style="font-size:9px; font-weight:900; color:#fff;">ON</span>
                  <div class="dip-toggle-nub"></div>
                  <span style="font-size:9px; font-weight:900; color:#fff;">OFF</span>
                </div>
                <span style="font-size:11px; font-weight:900; color:${val === p.target[idx] ? '#4ade80' : '#f87171'};">
                  ${val} ${val === p.target[idx] ? '✓' : '✗'}
                </span>
              </div>
            `).join('')}
          </div>

          <div style="font-size:11px; font-weight:800; color:#94a3b8;">
            Alvo do NOC: <span style="font-family:monospace; color:#38bdf8;">[ 1, 1, 0, 0, 1, 0, 1, 1 ]</span> · Atual: <span style="font-family:monospace; color:${p.switches.every((v, i) => v === p.target[i]) ? '#4ade80' : '#fca5a5'};">[ ${p.switches.join(', ')} ]</span>
          </div>
          ${isSolved ? `<div style="background:#14532d; border:2px solid #22c55e; border-radius:10px; padding:10px; text-align:center; font-size:12.5px; font-weight:900; color:#86efac;">✅ Endereço Subnet Broadcast Reconhecido pelo NOC!</div>` : ''}
        </div>
      `;

      stage.querySelectorAll('[data-dip-idx]').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = Number(btn.dataset.dipIdx);
          p.switches[idx] = 1 - p.switches[idx];
          playTechChime('click');
          if (isCurrentRackPuzzleSolved(9)) {
            playTechChime('success');
          }
          renderCentralRackModal();
        });
      });
      break;
    }
  }
}

// ============================================================================
// CENTRAL DE SALAS (SOLO 1P, SALA EM GRUPO C/ CÓDIGO & FUTURA SALA "MUNDO" 20P)
// ============================================================================
function openLobbyModalUI() {
  renderLobbyModal();
  document.getElementById('room-lobby-modal')?.classList.add('open');
}

function renderLobbyModal() {
  const codeEl = document.getElementById('lobby-current-code');
  if (codeEl) codeEl.textContent = state.roomCode;

  const soloCard = document.getElementById('lobby-card-solo');
  const groupCard = document.getElementById('lobby-card-group');
  if (soloCard) soloCard.classList.toggle('owned', state.networkMode === 'offline');
  if (groupCard) groupCard.classList.toggle('owned', state.networkMode === 'online');
}

// ============================================================================
// CENTRAL DOS 18 PUZZLES EM GRUPO (LIBERADOS SOMENTE A PARTIR DE 4 JOGADORES ONLINE!)
// ============================================================================
function openCoopHubModalUI() {
  renderCoopHubModal();
  document.getElementById('coop-hub-modal').classList.add('open');
}

function renderCoopHubModal() {
  const curTier = getCurrentHQTier();
  const curRooms = getUnlockedRoomsCount();
  const pCount = getConnectedPlayerCount();
  const groupAllowed = isGroupPuzzlesUnlocked();

  const sub = document.getElementById('coop-hub-subtitle');
  const lockBanner = document.getElementById('coop-lock-banner');
  const btnReach4 = document.getElementById('btn-coop-hub-reach-4p');
  const btnExpand = document.getElementById('btn-coop-hub-expand');

  if (btnReach4) {
    btnReach4.style.display = groupAllowed ? 'none' : 'inline-flex';
  }
  if (btnExpand) {
    btnExpand.style.display = state.networkMode === 'offline' ? 'none' : 'inline-flex';
  }

  if (state.networkMode === 'offline') {
    if (sub) {
      sub.innerHTML = `🏠 <b>Modo Sala Solo (1 Pessoa) Ativo</b> · No modo solo somente puzzles de 1 pessoa podem ser jogados!`;
    }
    if (lockBanner) {
      lockBanner.style.display = 'block';
      lockBanner.innerHTML = `🔒 <b>Modo Solo Ativo:</b> Quando jogamos no modo solo, <b>somente puzzles de 1 pessoa</b> são permitidos! Para jogar puzzles de fazer em grupo, entre em uma <b>Sala em Grupo com Código</b> e tenha <b>a partir de 4 jogadores online</b>.`;
    }
  } else if (!groupAllowed) {
    if (sub) {
      sub.innerHTML = `🔑 <b>Sala em Grupo (${state.roomCode}) · ${pCount}/4 Jogadores Online</b> · Faltam <b>${4 - pCount} jogador(es)</b> para liberar os Puzzles em Grupo!`;
    }
    if (lockBanner) {
      lockBanner.style.display = 'block';
      lockBanner.innerHTML = `🔒 <b>Aguardando 4 Jogadores Online (${pCount}/4 conectados):</b> Com menos de 4 jogadores online, apenas puzzles de 1 pessoa ficam ativos. Passe o código <b>${state.roomCode}</b> para seu grupo ou clique em <b>"👥 Conectar 4 Jogadores"</b> acima!`;
    }
  } else {
    if (sub) {
      sub.innerHTML = `✅ <b>Puzzles em Grupo Liberados! (${pCount} Jogadores Online · Sede ${curRooms} Salas)</b> · Clique em um Puzzle desbloqueado para iniciá-lo na Bancada!`;
    }
    if (lockBanner) {
      lockBanner.style.display = 'none';
    }
  }

  document.querySelectorAll('#coop-hub-filter-bar [data-coop-filter]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.coopFilter === state.coopHubFilter);
  });

  const filtered = COOP_PUZZLES_CATALOG.filter(p => {
    if (state.coopHubFilter === 'all') return true;
    return String(p.coopPlayers) === state.coopHubFilter;
  });

  const grid = document.getElementById('coop-hub-grid');
  grid.innerHTML = filtered.map(puz => {
    const tierOk = puz.hqTier <= curTier;
    const unlocked = groupAllowed && tierOk;
    const reqRooms = puz.hqTier * 5;
    const reward = puz.coopPlayers === 2 ? 1800 : (puz.coopPlayers === 3 ? 2400 : 3200);

    let btnLabel = `🚀 Iniciar Puzzle em Grupo (${puz.coopPlayers}P) na Bancada`;
    if (state.networkMode === 'offline') {
      btnLabel = `🔒 Indisponível no Modo Solo (Exige Sala c/ 4+ Jogadores)`;
    } else if (!groupAllowed) {
      btnLabel = `🔒 Requer 4+ Jogadores Online (Atual: ${pCount}/4)`;
    } else if (!tierOk) {
      btnLabel = `🏗️ Expandir Sede p/ ${reqRooms} Salas & Liberar`;
    }

    return `
      <div class="stock-item-card ${unlocked ? 'owned' : ''}" style="opacity:${unlocked ? '1' : '0.68'};">
        <div style="font-weight:900; font-size:13.5px; color:var(--tinta); display:flex; justify-content:space-between; gap:6px;">
          <span>${puz.title}</span>
          <span class="ticket-tag ${unlocked ? 'tag-coop' : 'tag-normal'}" style="white-space:nowrap;">
            ${unlocked ? `👥 Grupo ${puz.coopPlayers}P · +R$ ${reward}` : (groupAllowed ? `🔒 Sede ${reqRooms} Salas` : `🔒 4+ Jogadores`)}
          </span>
        </div>
        <div style="font-size:12px; font-weight:700; color:var(--suave); flex:1;">
          ${puz.quote}
          <div style="margin-top:5px; font-size:11px; color:var(--teal-e);">
            <b>Estações simultâneas (${puz.coopPlayers}):</b> ${puz.stations.map(s => s.title).join(' · ')}
          </div>
        </div>
        <button type="button" class="btn ${unlocked ? 'btn-roxo' : 'btn-amarelo'} btn-sm btn-launch-coop-puz" data-puz-id="${puz.id}" data-req-rooms="${reqRooms}">
          ${btnLabel}
        </button>
      </div>
    `;
  }).join('');

  grid.querySelectorAll('.btn-launch-coop-puz').forEach(btn => {
    btn.addEventListener('click', () => {
      const puzId = btn.dataset.puzId;
      const puz = COOP_PUZZLES_CATALOG.find(x => x.id === puzId);
      if (!puz) return;

      if (state.networkMode === 'offline') {
        showToast('🏠 No Modo Solo somente puzzles de 1 pessoa são permitidos! Entre em uma Sala em Grupo com 4+ jogadores.');
        return;
      }

      if (!isGroupPuzzlesUnlocked()) {
        showToast(`🔒 Puzzles em Grupo exigem a partir de 4 jogadores online (Atual: ${getConnectedPlayerCount()}/4)! Clique em "Conectar 4 Jogadores".`);
        return;
      }

      if (puz.hqTier > getCurrentHQTier()) {
        setHQTierRooms(puz.hqTier * 5);
        renderCoopHubModal();
        return;
      }

      launchSpecificCoopPuzzle(puzId);
    });
  });
}

function launchSpecificCoopPuzzle(puzId) {
  if (state.networkMode === 'offline' || !isGroupPuzzlesUnlocked()) {
    showToast('🔒 Somente puzzles de 1 pessoa estão disponíveis até atingir 4 jogadores online na Sala em Grupo!');
    return;
  }
  const puz = COOP_PUZZLES_CATALOG.find(x => x.id === puzId);
  if (!puz) return;

  let existingIdx = cases.findIndex(c => c.minigameType === puzId && !c.leavingState && !c.solved);
  if (existingIdx === -1) {
    const tpl = buildCoopTemplateFromCatalog(puz);
    const newCase = createClientCase(nextClientIdCounter - 1, false, tpl);
    cases.unshift(newCase);
    existingIdx = 0;
  }

  document.getElementById('coop-hub-modal').classList.remove('open');
  callClientToMyRoom(existingIdx);
  openWorkbenchModal('triagem');
  showToast(`🤝 Puzzle em Grupo "${puz.title}" (${puz.coopPlayers} Jogadores Simultâneos) carregado na Bancada!`);
}

function openCoopCaseOnBench() {
  if (state.networkMode === 'offline' || !isGroupPuzzlesUnlocked()) {
    openCoopHubModalUI();
    return;
  }
  const coopIdx = cases.findIndex(c => c.coopPlayers > 1 && !c.leavingState);
  if (coopIdx !== -1) {
    callClientToMyRoom(coopIdx);
    openWorkbenchModal();
  } else {
    openCoopHubModalUI();
  }
}

// ============================================================================
// GERADOR DE BONEQUINHOS CHIBI SVG
// ============================================================================
function renderChibiSVG(look = {}, sizeClass = '') {
  const skin = look.mood === 'angry' ? '#fca5a5' : (look.skin || '#ffdbb5');
  const hair = look.hair || '#2c1e18';
  const shirt = look.shirt || '#1fa6b8';
  const glasses = !!look.glasses;
  const headset = !!look.headset;
  const mood = look.mood || 'happy';

  let mouthPath = 'M 34 45 Q 40 50 46 45';
  if (mood === 'worried') mouthPath = 'M 34 48 Q 40 43 46 48';
  if (mood === 'angry') mouthPath = 'M 33 49 Q 40 41 47 49';
  if (mood === 'excited') mouthPath = 'M 33 44 Q 40 53 47 44 Z';

  return `
    <svg class="chibi-svg ${sizeClass}" viewBox="0 0 80 90" xmlns="http://www.w3.org/2000/svg">
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
      ${mood === 'angry' ? `
        <line x1="23" y1="29" x2="35" y2="33" stroke="#991b1b" stroke-width="3" stroke-linecap="round"/>
        <line x1="57" y1="29" x2="45" y2="33" stroke="#991b1b" stroke-width="3" stroke-linecap="round"/>
      ` : ''}
      ${glasses ? `
        <rect x="22" y="30" width="15" height="11" rx="4" fill="rgba(255,255,255,0.25)" stroke="#1c3144" stroke-width="2.5"/>
        <rect x="43" y="30" width="15" height="11" rx="4" fill="rgba(255,255,255,0.25)" stroke="#1c3144" stroke-width="2.5"/>
        <line x1="37" y1="35" x2="43" y2="35" stroke="#1c3144" stroke-width="2.5"/>
      ` : ''}
      <path d="${mouthPath}" fill="${mood === 'excited' ? '#e5534b' : 'none'}" stroke="#1c3144" stroke-width="2.8" stroke-linecap="round"/>
      ${headset ? `
        <path d="M 15 36 A 25 25 0 0 1 65 36" fill="none" stroke="#1fa6b8" stroke-width="4" stroke-linecap="round"/>
        <rect x="11" y="31" width="7" height="13" rx="3.5" fill="#1fa6b8" stroke="#1c3144" stroke-width="2.5"/>
        <rect x="62" y="31" width="7" height="13" rx="3.5" fill="#1fa6b8" stroke="#1c3144" stroke-width="2.5"/>
      ` : ''}
    </svg>
  `;
}

// ============================================================================
// MOTOR GRÁFICO 2D DO MUNDO (CABINES ESPAÇADAS E EXPANSÃO 5➔10➔15➔20 SALAS)
// ============================================================================
const keys = {};
let camera = { x: 0, y: 0 };
let activeInteractable = null;
let animTick = 0;

function toggleEnlargedScreen(forceState) {
  const willBeEnlarged = typeof forceState === 'boolean'
    ? forceState
    : !document.body.classList.contains('enlarged-screen');

  document.body.classList.toggle('enlarged-screen', willBeEnlarged);
  state.enlargedScreen = willBeEnlarged;

  const btnHeader = document.getElementById('btn-toggle-enlarged-screen');
  const btnOverlay = document.getElementById('btn-overlay-enlarged');

  if (btnHeader) {
    btnHeader.innerHTML = willBeEnlarged ? '🗗 Tela Normal' : '🖥️ Tela Aumentada';
    btnHeader.classList.toggle('btn-amarelo', willBeEnlarged);
    btnHeader.classList.toggle('btn-vidro', !willBeEnlarged);
  }
  if (btnOverlay) {
    btnOverlay.innerHTML = willBeEnlarged ? '🗗 Normal (F)' : '🖥️ Aumentada (F)';
    btnOverlay.classList.toggle('btn-amarelo', willBeEnlarged);
    btnOverlay.classList.toggle('btn-vidro', !willBeEnlarged);
  }

  if (window.resizeGameCanvas) window.resizeGameCanvas();
  window.dispatchEvent(new Event('resize'));
  setTimeout(() => {
    if (window.resizeGameCanvas) window.resizeGameCanvas();
    window.dispatchEvent(new Event('resize'));
  }, 100);

  showToast(willBeEnlarged
    ? '🖥️ Modo Tela Aumentada Ativado! Pressione "F" a qualquer momento para alternar.'
    : '🖥️ Modo Tela Padrão Restaurado.'
  );
}

function initCanvasWorld() {
  const canvas = document.getElementById('world-canvas');
  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
  }
  window.resizeGameCanvas = resizeCanvas;
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  window.addEventListener('keydown', (e) => {
    if (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA')) return;
    const modalOpen = document.querySelector('.modal-backdrop.open');
    if (modalOpen) {
      if (e.key === 'Escape') modalOpen.classList.remove('open');
      return;
    }
    const k = e.key.toLowerCase();
    if (k === 'f') {
      toggleEnlargedScreen();
      return;
    }
    keys[k] = true;
    if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(k)) {
      e.preventDefault();
    }
    if (k === 'e' && activeInteractable) {
      activeInteractable.action();
    }
  });

  window.addEventListener('keyup', (e) => {
    keys[e.key.toLowerCase()] = false;
  });

  canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left + camera.x;
    const clickY = e.clientY - rect.top + camera.y;
    const you = state.players[state.mySlotIndex];
    you.waypoints = buildDoorwayPath(you.x, you.y, clickX, clickY);
  });

  function stepEntityWaypoints(ent, speed) {
    if (!ent.waypoints || ent.waypoints.length === 0) {
      ent.isMoving = false;
      return;
    }
    const target = ent.waypoints[0];
    const dx = target.x - ent.x;
    const dy = target.y - ent.y;
    const dist = Math.hypot(dx, dy);

    if (dist <= speed + 2) {
      ent.waypoints.shift();
      ent.isMoving = ent.waypoints.length > 0;
      ent.stuckTicks = 0;
    } else {
      const vx = (dx / dist) * speed;
      const vy = (dy / dist) * speed;
      const oldX = ent.x;
      const oldY = ent.y;
      moveWithWallSliding(ent, vx, vy);
      const moved = Math.hypot(ent.x - oldX, ent.y - oldY);
      ent.isMoving = moved > 0.3;
      if (moved < 0.25) {
        ent.stuckTicks = (ent.stuckTicks || 0) + 1;
        if (ent.stuckTicks > 16) {
          ent.waypoints = [];
          ent.stuckTicks = 0;
          ent.wanderTimer = 10;
        }
      } else {
        ent.stuckTicks = 0;
      }
    }
  }

  function updateWorld() {
    animTick++;
    const map = currentMap();
    const you = state.players[state.mySlotIndex];

    let baseSpeed = state.upgrades.my_coffee ? 6.2 : 4.8;
    const benchLvl = state.workbenchLevel || 1;
    if (benchLvl >= 4) baseSpeed += 1.2;
    else if (benchLvl >= 3) baseSpeed += 0.8;
    else if (benchLvl >= 2) baseSpeed += 0.4;
    if (state.coffeeBoostTimer > 0) {
      state.coffeeBoostTimer--;
      you.speed = 7.5;
    } else {
      you.speed = baseSpeed;
    }

    let dx = 0;
    let dy = 0;
    if (keys['w'] || keys['arrowup']) dy -= 1;
    if (keys['s'] || keys['arrowdown']) dy += 1;
    if (keys['a'] || keys['arrowleft']) dx -= 1;
    if (keys['d'] || keys['arrowright']) dx += 1;

    if (dx !== 0 || dy !== 0) {
      you.waypoints = [];
      const len = Math.hypot(dx, dy);
      moveWithWallSliding(you, (dx / len) * you.speed, (dy / len) * you.speed);
      you.isMoving = true;
    } else {
      stepEntityWaypoints(you, you.speed);
    }

    if (you.bubbleTimer > 0) you.bubbleTimer--;

    if ((state.networkMode === 'online' || state.soloExpandedDuo) && animTick % 3 === 0) {
      broadcastNet({
        type: 'player_move',
        peerId: state.myPeerId,
        slot: state.mySlotIndex,
        x: Math.round(you.x),
        y: Math.round(you.y),
        isMoving: you.isMoving,
        bubble: you.bubbleTimer > 0 ? you.bubble : null
      });
    }

    const workbenchOpen = document.getElementById('workbench-modal').classList.contains('open');
    let removedAnyClient = false;

    for (let idx = cases.length - 1; idx >= 0; idx--) {
      const c = cases[idx];
      stepEntityWaypoints(c, c.leavingState ? 5.2 : (c.inMyRoom ? 4.4 : 2.0));
      // Clientes na sala de espera: andam livremente por toda a área central sem travar!
      // Como o rack do centro foi retirado para as laterais, toda a área central (y=300 a y=905) é 100% aberta!
      if (!c.inMyRoom && !c.leavingState && !c.solved && !c.walkingToDesk && !c.isBurntReturn) {
        const map = currentMap();
        const rec = map?.rooms?.find(r => r.id === 'main_store');
        if (rec) {
          // Limites da área central ampla (entre a Cabine #01 e a Sala de Estoque)
          const minX = rec.x + 30;
          const maxX = rec.x + rec.w - 30;
          const minY = 300; // Totalmente livre do topo ao fundo
          const maxY = 905;
          c.x = Math.max(minX, Math.min(maxX, c.x));
          c.y = Math.max(minY, Math.min(maxY, c.y));

          // Repulsão anti-aglomeração: impede que os clientes fiquem amontoados/grudados no mesmo ponto!
          for (let j = idx - 1; j >= 0; j--) {
            const other = cases[j];
            if (other && !other.inMyRoom && !other.leavingState && !other.walkingToDesk) {
              const d = Math.hypot(c.x - other.x, c.y - other.y);
              if (d < 28 && d > 0.1) {
                const push = (28 - d) * 0.15;
                const nx = (c.x - other.x) / d;
                const ny = (c.y - other.y) / d;
                c.x += nx * push;
                c.y += ny * push;
                other.x -= nx * push;
                other.y -= ny * push;
              }
            }
          }

          if (typeof c.wanderTimer !== 'number') {
            c.wanderTimer = (idx % 5) * 8 + Math.floor(Math.random() * 10);
          }
          c.wanderTimer--;

          // Quando conclui o trajeto atual ou pausa, escolhe novo destino livre na área central
          if (c.wanderTimer <= 0 && (!c.waypoints || c.waypoints.length === 0)) {
            c.wanderTimer = 40 + Math.floor(Math.random() * 85); // Pausa breve de 0.8s a 2s
            let destX = minX + Math.random() * (maxX - minX);
            let destY = minY + Math.random() * (maxY - minY);

            // Garante que o cliente caminhe uma distância mínima visível
            let attempts = 0;
            while (Math.hypot(destX - c.x, destY - c.y) < 70 && attempts < 6) {
              destX = minX + Math.random() * (maxX - minX);
              destY = minY + Math.random() * (maxY - minY);
              attempts++;
            }

            // Desvia com folga do balcão da recepção
            const cX = rec.x + rec.w - 145;
            const cY = 575;
            if (destX > cX - 25 && destX < cX + 140 && destY > cY - 20 && destY < cY + 75) {
              destX = cX - 35;
            }
            // Desvia com folga do sofá de espera
            const sX = rec.x + rec.w - 95;
            const sY = 785;
            if (destX > sX - 25 && destY > sY - 20) {
              destX = sX - 35;
            }

            c.waypoints = [{ x: Math.round(destX), y: Math.round(destY) }];
          }
        }
      }


      if (c.leavingState) {
        if (!c.waypoints || c.waypoints.length === 0) {
          const map = currentMap();
          const distToExit = (map && map.exitPos) ? Math.hypot(c.x - map.exitPos.x, c.y - map.exitPos.y) : 0;
          if (distToExit < 65) {
            c.leaveHoldTimer = (c.leaveHoldTimer || 0) + 1;
            if (c.leaveHoldTimer > 20) {
              cases.splice(idx, 1);
              removedAnyClient = true;
            }
          } else {
            c.waypoints = buildClientExitPath(c);
          }
        }
        continue;
      }

      // Assim que o cliente chega andando até a nossa mesa, ele fala o que está acontecendo!
      if (c.inMyRoom && c.walkingToDesk && (!c.waypoints || c.waypoints.length === 0)) {
        c.walkingToDesk = false;
        c.arrivedAtDesk = true;
        showToast(`💬 ${c.clientName} chegou na sua mesa: ${c.quote}`);
        addChatMessage(`💬 ${c.clientName} (Na Sua Mesa)`, `${c.quote} (${c.device})`);
      }

      if (!c.solved && !c.pendingBurnTimer) {
        // Paciência desce lentamente: sozinho bem devagar, e acelera proporcionalmente à quantidade de técnicos online
        const connectedCount = Math.max(1, Math.min(4, getConnectedPlayerCount()));
        const pFactor = 1.0 + (connectedCount - 1) * 0.85;
        let drainRate = (idx < 4 ? 0.0008 : 0.0004) * pFactor;
        if (state.upgrades.vip_sofa) drainRate *= 0.65;
        if (workbenchOpen && idx === state.activeCaseIndex) drainRate *= 0.35;

        c.patience = Math.max(0, c.patience - drainRate);

        if (c.patience < 35 && c.look.mood !== 'angry') {
          c.look.mood = 'angry';
          c.insultText = ANGRY_INSULTS[Math.floor(Math.random() * ANGRY_INSULTS.length)];
          addChatMessage(`${c.clientName}`, c.insultText);
        }

        if (c.patience <= 0) {
          const rageBye = LEAVE_ANGRY_INSULTS[Math.floor(Math.random() * LEAVE_ANGRY_INSULTS.length)];
          c.leavingState = 'leaving_angry';
          c.inMyRoom = false;
          c.walkingToDesk = false;
          c.arrivedAtDesk = false;
          c.look.mood = 'angry';
          c.insultText = rageBye;
          c.waypoints = buildClientExitPath(c);

          state.money -= 350;
          changeReputation(-18);
          showToast(`🤬 ${c.clientName} estourou a espera, ofendeu e FOI EMBORA! (-R$ 350 e -18% Reputação)`);
          addChatMessage(`🤬 ${c.clientName} (FOI EMBORA)`, `${rageBye} (-R$ 350 | -18% Reputação)`);

          if (workbenchOpen && idx === state.activeCaseIndex) {
            document.getElementById('workbench-modal').classList.remove('open');
          }
          renderAllUI();
        }
      }
    }

    if (removedAnyClient) {
      if (state.activeCaseIndex >= cases.length) {
        state.activeCaseIndex = Math.max(0, cases.length - 1);
      }
      const activeCount = cases.filter(c => !c.leavingState).length;
      if (activeCount < getTargetQueueSize()) {
        cases.push(createClientCase(nextClientIdCounter - 1, true));
      }
      renderAllUI();
    }

    if (animTick % 90 === 0) {
      renderQueue();
    }

    const minCamY = (map.buildingRect && map.buildingRect.y > 200) ? Math.max(0, map.buildingRect.y - 30) : 0;
    const maxCamY = Math.max(0, map.height - canvas.height);
    const targetCamX = Math.max(0, Math.min(map.width - canvas.width, you.x - canvas.width / 2));
    const targetCamY = Math.max(minCamY, Math.min(maxCamY, you.y - canvas.height / 2));
    camera.x += (targetCamX - camera.x) * 0.15;
    camera.y += (targetCamY - camera.y) * 0.15;

    const currentRoom = map.rooms.find(r =>
      you.x >= r.x && you.x <= r.x + r.w && you.y >= r.y && you.y <= r.y + r.h
    );
    const locSpan = document.querySelector('#current-room-pill span');
    if (locSpan) {
      locSpan.textContent = currentRoom ? currentRoom.name : `Corredor Amplo da Sede (${getUnlockedRoomsCount()} Salas)`;
    }

    activeInteractable = map.interactables.find(item =>
      Math.hypot(you.x - item.x, you.y - item.y) <= item.radius
    ) || null;

    const promptBtn = document.getElementById('btn-interact-world');
    if (activeInteractable) {
      promptBtn.textContent = activeInteractable.label;
      promptBtn.classList.add('visible');
    } else {
      promptBtn.classList.remove('visible');
    }

    if (document.getElementById('central-rack-modal')?.classList.contains('open') && !isPlayerNearCentralRack()) {
      document.getElementById('central-rack-modal').classList.remove('open');
      showToast('⚠️ Você se afastou do Rack Central!');
    }
    if (document.getElementById('workbench-modal')?.classList.contains('open') && !isPlayerNearWorkbench()) {
      document.getElementById('workbench-modal').classList.remove('open');
      showToast('⚠️ Você se afastou da sua Bancada de Trabalho!');
    }
  }

  function drawWorld() {
    const map = currentMap();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#0f2230';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(-Math.round(camera.x), -Math.round(camera.y));

    const b = map.buildingRect;
    ctx.fillStyle = '#f4f0e4';
    ctx.strokeStyle = '#38c3d6';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.roundRect(b.x, b.y, b.w, b.h, 20);
    ctx.fill();
    ctx.stroke();

    // Desenha plantas baixas tracejadas (blueprints) das cabines que ainda vão abrir conforme mais jogadores entrarem (10, 15 e 20 salas)
    if (map.blueprints && map.blueprints.length > 0) {
      map.blueprints.forEach(bp => {
        ctx.save();
        ctx.fillStyle = 'rgba(148, 163, 184, 0.15)';
        ctx.strokeStyle = 'rgba(100, 116, 139, 0.45)';
        ctx.lineWidth = 2;
        ctx.setLineDash([8, 6]);
        ctx.beginPath();
        ctx.roundRect(bp.x, bp.y, bp.w, bp.h, 10);
        ctx.fill();
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = '#475569';
        ctx.font = '800 10.5px Nunito, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(bp.label, bp.x + bp.w / 2, bp.y + bp.h / 2);
        ctx.restore();
      });
    }

    // Conectores / Passagens de piso entre salas expandidas
    if (map.connectors && map.connectors.length > 0) {
      map.connectors.forEach(c => {
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(c.x, c.y, c.w, c.h, 4);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = 'rgba(249, 199, 66, 0.22)';
        ctx.fillRect(c.x + 1, c.y + 1, c.w - 2, c.h - 2);
      });
    }

    map.rooms.forEach(room => {
      ctx.fillStyle = room.floorColor;
      ctx.fillRect(room.x, room.y, room.w, room.h);

      ctx.strokeStyle = room.gridColor;
      ctx.lineWidth = 1.2;
      const tile = 44;
      for (let gx = room.x; gx < room.x + room.w; gx += tile) {
        ctx.beginPath();
        ctx.moveTo(gx, room.y);
        ctx.lineTo(gx, room.y + room.h);
        ctx.stroke();
      }
      for (let gy = room.y; gy < room.y + room.h; gy += tile) {
        ctx.beginPath();
        ctx.moveTo(room.x, gy);
        ctx.lineTo(room.x + room.w, gy);
        ctx.stroke();
      }

      const allDoors = room.doors && room.doors.length > 0
        ? room.doors
        : (room.doorInside ? [{ doorInside: room.doorInside, doorOutside: room.doorOutside }] : []);

      allDoors.forEach(d => {
        if (d.doorInside && d.doorOutside) {
          ctx.fillStyle = 'rgba(249, 199, 66, 0.35)';
          ctx.beginPath();
          ctx.arc((d.doorInside.x + d.doorOutside.x) / 2, (d.doorInside.y + d.doorOutside.y) / 2, 28, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Não desenha barra escura nem texto atrás do Rack Central (mantém chão 100% normal e limpo)
      if (room.id !== 'central_rack_plaza') {
        ctx.fillStyle = room.darkTheme ? 'rgba(255,255,255,0.15)' : 'rgba(15, 37, 51, 0.86)';
        ctx.beginPath();
        ctx.roundRect(room.x + 10, room.y + 8, Math.min(room.w - 20, 340), 22, 6);
        ctx.fill();

        ctx.fillStyle = room.darkTheme ? '#68f0ae' : '#ffffff';
        ctx.font = '900 11px Nunito, sans-serif';
        ctx.fillText(room.name, room.x + 16, room.y + 23);
      }

      room.furniture.forEach(f => {
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
        }

        if (f.type === 'counter') {
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
        }

        if (f.type === 'decor') {
          drawDecorGraphic(ctx, f);
          return;
        }

        if (f.type === 'ac') {
          drawAirConditionerGraphic(ctx, f);
          return;
        }

        if (f.type === 'rack') {
          drawPartsRackGraphic(ctx, f);
          return;
        }

        ctx.fillStyle = 'rgba(15,37,51,0.16)';
        ctx.beginPath();
        ctx.roundRect(f.x + 3, f.y + 5, f.w, f.h, 8);
        ctx.fill();

        ctx.fillStyle = f.color;
        ctx.strokeStyle = '#1c3144';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.roundRect(f.x, f.y, f.w, f.h, 8);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = f.type === 'waiting' ? '#137482' : '#ffffff';
        ctx.font = '800 10px Nunito, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(f.label, f.x + f.w / 2, f.y + Math.min(20, f.h / 2 + 4));
        ctx.textAlign = 'left';
      });
    });

    // Desenha os 2 Racks de Infraestrutura nas laterais (acima da Cabine #01 e acima do Estoque)
    if (map.corridorFurniture && map.corridorFurniture.length > 0) {
      map.corridorFurniture.forEach(f => {
        if (f.type === 'central_rack') {
          drawCentralRackChassis(ctx, f);
        }
      });
    }

    // Desenha todas as paredes sólidas das cabines abertas e salas inferiores!
    solidColliders.forEach(box => {
      if (!box.isWall) return;
      ctx.fillStyle = 'rgba(15, 37, 51, 0.25)';
      ctx.fillRect(box.x + 2, box.y + 4, box.w, box.h);

      ctx.fillStyle = box.color || '#1fa6b8';
      ctx.strokeStyle = '#1c3144';
      ctx.lineWidth = 2;
      ctx.fillRect(box.x, box.y, box.w, box.h);
      ctx.strokeRect(box.x, box.y, box.w, box.h);
    });

    const you = state.players[state.mySlotIndex];
    if (you.waypoints && you.waypoints.length > 0) {
      const dest = you.waypoints[you.waypoints.length - 1];
      ctx.strokeStyle = 'rgba(31, 166, 184, 0.85)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(dest.x, dest.y, 12 + (animTick % 10), 0, Math.PI * 2);
      ctx.stroke();
    }

    map.interactables.forEach(item => {
      const isNear = activeInteractable && activeInteractable.id === item.id;
      ctx.strokeStyle = isNear ? '#f9c742' : 'rgba(31, 166, 184, 0.35)';
      ctx.lineWidth = isNear ? 4 : 2;
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.arc(item.x, item.y, 34, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    });

    const entities = [];

    state.players.filter(p => p.connected).forEach(p => {
      entities.push({
        type: 'tech',
        isPlayer: p.slot === state.mySlotIndex,
        name: p.name,
        x: p.x,
        y: p.y,
        isMoving: p.isMoving,
        look: p.look,
        bubble: p.bubbleTimer > 0 ? p.bubble : null,
        isAngry: false,
        isBurntReturn: false,
        patience: null
      });
    });

    cases.forEach((c) => {
      if (c.pendingBurnTimer) return;
      const isAngry = c.leavingState === 'leaving_angry' || c.leavingState === 'leaving_burnt' || (!c.solved && c.patience < 35) || c.isBurntReturn;
      const isImpatient = !c.solved && !c.leavingState && c.patience >= 35 && c.patience < 65;

      const shortQuote = c.quote.length > 62 ? c.quote.slice(0, 60) + '…”' : c.quote;
      let bubbleText = c.coopPlayers > 1 ? `🤝 CO-OP ${c.coopPlayers}P` : `📋 ${c.code}`;
      if (c.leavingState === 'leaving_happy') bubbleText = '🎉 Reparo Perfeito! Indo embora feliz!';
      else if (c.leavingState === 'leaving_burnt') bubbleText = c.insultText;
      else if (c.leavingState === 'leaving_angry') bubbleText = c.insultText;
      else if (c.solved) bubbleText = '✓ Resolvido!';
      else if (c.inMyRoom && c.walkingToDesk) bubbleText = '🚶‍♂️ Indo até sua mesa na Cabine #01...';
      else if (c.inMyRoom) bubbleText = `💬 ${shortQuote}`;
      else if (isAngry) bubbleText = c.insultText;
      else if (isImpatient) bubbleText = c.impatientText;

      entities.push({
        type: 'client',
        name: c.clientName,
        x: c.x + (isAngry ? Math.sin(animTick * 0.9) * 2.5 : 0),
        y: c.y,
        isMoving: c.isMoving,
        look: c.solved || c.leavingState === 'leaving_happy'
          ? { ...c.look, mood: 'excited' }
          : (isAngry ? { ...c.look, mood: 'angry' } : c.look),
        bubble: bubbleText,
        isAngry,
        isBurntReturn: c.isBurntReturn || c.leavingState === 'leaving_burnt',
        patience: (c.solved || c.leavingState) ? null : c.patience
      });
    });

    entities.sort((a, b) => a.y - b.y);
    entities.forEach(ent => drawCanvasChibi(ctx, ent));

    ctx.restore();
    drawMinimap(ctx, canvas.width, canvas.height);
  }

  function loop() {
    updateWorld();
    drawWorld();
    requestAnimationFrame(loop);
  }
  loop();
}

function drawCanvasChibi(ctx, ent) {
  const { x, y, isMoving, name, bubble, isPlayer, isAngry, isBurntReturn, patience } = ent;
  const look = ent.look || { skin: '#ffdbb5', hair: '#2c1e18', shirt: '#1fa6b8', mood: 'neutral' };
  const bounce = isMoving ? Math.abs(Math.sin(animTick * 0.28)) * 5 : Math.sin(animTick * 0.07) * 1.5;
  const footSwing = isMoving ? Math.sin(animTick * 0.28) * 4 : 0;

  ctx.save();
  ctx.translate(x, y);

  if (isPlayer) {
    ctx.fillStyle = 'rgba(249, 199, 66, 0.38)';
    ctx.strokeStyle = '#f9c742';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.ellipse(0, 16, 22, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  } else {
    ctx.fillStyle = isBurntReturn ? 'rgba(249, 115, 22, 0.55)' : (isAngry ? 'rgba(229, 83, 75, 0.38)' : 'rgba(15, 37, 51, 0.22)');
    ctx.beginPath();
    ctx.ellipse(0, 16, 16, 6, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = '#1c3144';
  ctx.beginPath();
  ctx.ellipse(-6, 14 + footSwing * 0.5, 4.5, 3, 0, 0, Math.PI * 2);
  ctx.ellipse(6, 14 - footSwing * 0.5, 4.5, 3, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.translate(0, -bounce);

  ctx.fillStyle = look.shirt || '#1fa6b8';
  ctx.strokeStyle = '#1c3144';
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.roundRect(-14, -6, 28, 19, 9);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#f9c742';
  ctx.fillRect(3, 1, 5, 7);

  ctx.fillStyle = isAngry ? '#fca5a5' : (look.skin || '#ffdbb5');
  ctx.beginPath();
  ctx.roundRect(-16, -33, 32, 29, 14);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = look.hair || '#2c1e18';
  ctx.beginPath();
  ctx.arc(0, -25, 16.5, Math.PI, 0);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#1c3144';
  ctx.beginPath();
  ctx.arc(-6, -18, 2.8, 0, Math.PI * 2);
  ctx.arc(6, -18, 2.8, 0, Math.PI * 2);
  ctx.fill();

  if (isAngry) {
    ctx.strokeStyle = '#991b1b';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(-11, -24);
    ctx.lineTo(-2, -20);
    ctx.moveTo(11, -24);
    ctx.lineTo(2, -20);
    ctx.stroke();
  }

  ctx.strokeStyle = '#1c3144';
  ctx.lineWidth = 2;
  ctx.beginPath();
  if (isAngry || look.mood === 'worried') {
    ctx.arc(0, -9, 3.5, Math.PI * 1.15, Math.PI * 1.85);
  } else {
    ctx.arc(0, -13, 3.5, 0.15 * Math.PI, 0.85 * Math.PI);
  }
  ctx.stroke();

  if (isBurntReturn) {
    ctx.font = '15px sans-serif';
    ctx.fillText('🔥💨', -14, -38 - (animTick % 10) * 0.4);
  }

  if (patience !== null) {
    const barW = 34;
    ctx.fillStyle = 'rgba(15, 37, 51, 0.75)';
    ctx.fillRect(-barW / 2, -43, barW, 4.5);
    ctx.fillStyle = patience > 60 ? '#4bb56b' : (patience > 35 ? '#f9c742' : '#e5534b');
    ctx.fillRect(-barW / 2, -43, (barW * Math.max(0, patience)) / 100, 4.5);
  }

  ctx.font = '900 10px Nunito, sans-serif';
  const nameW = ctx.measureText(name).width + 10;
  ctx.fillStyle = isPlayer ? '#0f2533' : (isBurntReturn ? '#7f1d1d' : 'rgba(15, 37, 51, 0.82)');
  ctx.beginPath();
  ctx.roundRect(-nameW / 2, 19, nameW, 15, 7);
  ctx.fill();

  ctx.fillStyle = isPlayer ? '#f9c742' : '#ffffff';
  ctx.textAlign = 'center';
  ctx.fillText(name, 0, 30);

  if (bubble) {
    ctx.font = '900 10.5px Nunito, sans-serif';
    const bW = ctx.measureText(bubble).width + 12;
    ctx.fillStyle = isBurntReturn ? '#7f1d1d' : (isAngry ? '#fee2e2' : '#ffffff');
    ctx.strokeStyle = isBurntReturn ? '#f97316' : (isAngry ? '#dc2626' : '#1c3144');
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(-bW / 2, -65, bW, 19, 9);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = isBurntReturn ? '#ffffff' : (isAngry ? '#991b1b' : '#1c3144');
    ctx.fillText(bubble, 0, -52);
  }

  ctx.restore();
}

function drawMinimap(ctx, cw, ch) {
  const map = currentMap();
  const maxMiniW = 195;
  const scale = maxMiniW / map.width;
  const mw = map.width * scale;
  const mh = map.height * scale;
  const mx = cw - mw - 14;
  const my = ch - mh - 58;

  ctx.save();
  ctx.fillStyle = 'rgba(15, 37, 51, 0.88)';
  ctx.strokeStyle = '#38c3d6';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(mx - 6, my - 6, mw + 12, mh + 12, 10);
  ctx.fill();
  ctx.stroke();

  map.rooms.forEach(r => {
    let color = '#475569';
    if (r.id === 'my_room') color = '#38c3d6';
    else if (r.id === 'partner_room') color = '#c084fc';
    else if (r.id === 'central_rack_plaza' || r.id === 'central_rack_offline') color = '#38bdf8';
    else if (r.id === 'stock_room') color = '#818cf8';
    else if (r.id === 'main_store') color = '#f9c742';
    else if (r.id === 'coop_room') color = '#a855f7';
    ctx.fillStyle = color;
    ctx.fillRect(mx + r.x * scale, my + r.y * scale, Math.max(2, r.w * scale - 1), Math.max(2, r.h * scale - 1));
  });

  cases.forEach(c => {
    if (c.pendingBurnTimer) return;
    ctx.fillStyle = c.leavingState === 'leaving_happy' ? '#4bb56b' : (c.leavingState === 'leaving_as_is' ? '#f59e0b' : (c.leavingState === 'leaving_angry' || c.isBurntReturn ? '#ef4444' : '#f28649'));
    ctx.beginPath();
    ctx.arc(mx + c.x * scale, my + c.y * scale, 2.2, 0, Math.PI * 2);
    ctx.fill();
  });

  const you = state.players[state.mySlotIndex];
  ctx.fillStyle = '#68f0ae';
  ctx.beginPath();
  ctx.arc(mx + you.x * scale, my + you.y * scale, 3.8, 0, Math.PI * 2);
  ctx.fill();

  // Desenha os Racks de Infraestrutura no Minimapa em destaque luminoso:
  const allRacks = [];
  if (map.corridorFurniture) {
    map.corridorFurniture.filter(f => f.type === 'central_rack').forEach(f => {
      allRacks.push({ x: f.x + f.w / 2, y: f.y + f.h / 2 });
    });
  }
  map.rooms.forEach(r => {
    const fRack = r.furniture?.find(f => f.type === 'central_rack');
    if (fRack) allRacks.push({ x: fRack.x + fRack.w / 2, y: fRack.y + fRack.h / 2 });
  });

  allRacks.forEach(rk => {
    const rx = mx + rk.x * scale;
    const ry = my + rk.y * scale;
    ctx.fillStyle = centralRackState.onFire ? '#ef4444' : (centralRackState.incidentActive ? '#f97316' : '#38bdf8');
    ctx.beginPath();
    ctx.arc(rx, ry, centralRackState.incidentActive ? 6 : 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.2;
    ctx.stroke();
  });

  ctx.restore();
}

// ============================================================================
// DESENHO DO CHASSI DO RACK CENTRAL DE INFRAESTRUTURA NO CANVAS (ULTRA-DESTACADO)
// ============================================================================

// ============================================================================
// DESENHO GRÁFICO DA BANCADA E DA CAFETEIRA USANDO ASSETS PNG
// ============================================================================
function drawWorkbenchGraphic(ctx, f) {
  const benchLvl = state.workbenchLevel || 1;
  const imgKey = `workbench_lvl${benchLvl}`;
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





function drawAirConditionerGraphic(ctx, f) {
  const model = f.acModel || 'white';
  let img = ASSET_IMAGES.ac_white_split;
  let crop = AC_WHITE_CROP;

  if (model === 'black') {
    img = ASSET_IMAGES.ac_black_split;
    crop = AC_BLACK_CROP;
  } else if (model === 'tower') {
    img = ASSET_IMAGES.ac_tower_floor;
    crop = AC_TOWER_CROP;
  }

  // Sombra sob o aparelho
  ctx.fillStyle = 'rgba(15, 37, 51, 0.22)';
  ctx.beginPath();
  if (model === 'tower') {
    ctx.ellipse(f.x + f.w / 2, f.y + f.h - 2, f.w / 2, 4, 0, 0, Math.PI * 2);
  } else {
    ctx.roundRect(f.x + 2, f.y + 4, f.w, f.h, 4);
  }
  ctx.fill();

  if (img && img.complete && img.naturalWidth && crop) {
    ctx.drawImage(img, crop.sx, crop.sy, crop.sw, crop.sh, f.x, f.y, f.w, f.h);

    // Efeito de brisa fresca animada saindo do ar-condicionado
    const t = animTick;
    ctx.save();
    ctx.fillStyle = 'rgba(186, 230, 253, 0.45)';
    for (let i = 0; i < 3; i++) {
      const bx = f.x + 8 + i * (f.w / 3) + Math.sin(t * 0.15 + i) * 3;
      const by = (model === 'tower') ? (f.y + f.h * 0.35 + (t * 0.6 + i * 8) % 18) : (f.y + f.h + 2 + (t * 0.5 + i * 6) % 16);
      ctx.beginPath();
      ctx.arc(bx, by, 1.6, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  } else {
    ctx.fillStyle = model === 'black' ? '#0f172a' : '#f8fafc';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(f.x, f.y, f.w, f.h, 6);
    ctx.fill();
    ctx.stroke();
  }
}

function drawDecorGraphic(ctx, f) {
  let img = null;
  let crop = null;

  if (f.decorType === 'plant_tall') {
    img = ASSET_IMAGES.decor_plant_tall;
    crop = DECOR_PLANT_TALL_CROP;
  } else if (f.decorType === 'plant_small') {
    img = ASSET_IMAGES.decor_plant_small;
    crop = DECOR_PLANT_SMALL_CROP;
  } else if (f.decorType === 'recycle_bin') {
    img = ASSET_IMAGES.decor_recycle_bin;
    crop = DECOR_BIN_CROP;
  }

  // Sombra elíptica no chão sob o enfeite
  ctx.fillStyle = 'rgba(15, 37, 51, 0.22)';
  ctx.beginPath();
  ctx.ellipse(f.x + f.w / 2, f.y + f.h - 3, f.w / 2, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  if (img && img.complete && img.naturalWidth && crop) {
    ctx.drawImage(img, crop.sx, crop.sy, crop.sw, crop.sh, f.x, f.y, f.w, f.h);
  } else {
    ctx.fillStyle = f.decorType === 'recycle_bin' ? '#94a3b8' : '#22c55e';
    ctx.beginPath();
    ctx.roundRect(f.x, f.y, f.w, f.h, 6);
    ctx.fill();
  }
}

function drawWaitingSofaGraphic(ctx, f) {
  const isHorizontal = f.orientation === 'horizontal' || (f.w > f.h);
  const img = isHorizontal ? ASSET_IMAGES.sofa_horizontal : ASSET_IMAGES.waiting_sofa;
  const crop = isHorizontal ? SOFA_HORIZONTAL_CROP : SOFA_CROP;

  if (img && img.complete && img.naturalWidth && crop) {
    ctx.fillStyle = 'rgba(15, 37, 51, 0.22)';
    ctx.beginPath();
    ctx.roundRect(f.x + 3, f.y + 6, f.w, f.h, 8);
    ctx.fill();

    ctx.drawImage(img, crop.sx, crop.sy, crop.sw, crop.sh, f.x, f.y, f.w, f.h);
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


function drawPartsRackGraphic(ctx, f) {
  const img = ASSET_IMAGES.parts_racks_strip;
  const variant = (typeof f.partsVariant === 'number') ? (f.partsVariant % PARTS_RACK_SPANS.length) : 0;
  const span = PARTS_RACK_SPANS[variant];

  // Sombra suave sob a estante de peças
  ctx.fillStyle = 'rgba(15, 37, 51, 0.24)';
  ctx.beginPath();
  ctx.roundRect(f.x + 2, f.y + 4, f.w, f.h, 6);
  ctx.fill();

  if (img && img.complete && img.naturalWidth && span) {
    ctx.drawImage(img, span.sx, span.sy, span.sw, span.sh, f.x, f.y, f.w, f.h);
  } else {
    ctx.fillStyle = '#4f46e5';
    ctx.strokeStyle = '#1e1b4b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(f.x, f.y, f.w, f.h, 6);
    ctx.fill();
    ctx.stroke();
  }

  // Pill com status de peças em cima do rack
  const badgeText = `📦 ${state.rackParts}/${state.rackCapacity}`;
  const textW = ctx.measureText ? (ctx.measureText(badgeText).width + 12) : 55;
  ctx.fillStyle = 'rgba(15, 23, 42, 0.90)';
  ctx.beginPath();
  ctx.roundRect(f.x + f.w / 2 - textW / 2, f.y - 10, textW, 16, 8);
  ctx.fill();
  ctx.strokeStyle = state.rackParts > 0 ? '#38bdf8' : '#ef4444';
  ctx.lineWidth = 1.2;
  ctx.stroke();

  ctx.fillStyle = state.rackParts > 0 ? '#67e8f9' : '#fca5a5';
  ctx.font = '900 9px Nunito, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(badgeText, f.x + f.w / 2, f.y + 1);
  ctx.textAlign = 'left';
}

function drawCentralRackChassis(ctx, f) {
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
    ctx.fillStyle = `rgba(239, 68, 68, ${arrAlpha})`;
    ctx.font = '900 13px Nunito, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('⚠️ PANE NOC ATIVA ⚠️', cx, f.y - 12);
  }

  // Modelos aleatórios de 3 a 4 racks de servidores para esta partida (mesmo tamanho total do rack)
  const variants = state.sessionShelfVariants || {};
  let rackList = variants.serverRacks;
  if (!rackList || rackList.length < 3) {
    rackList = [variants.rackA ?? 1, variants.rackB ?? 4, 2];
  }
  const count = rackList.length;
  const rackGap = count === 4 ? 4 : 6;
  const singleRackW = (f.w - (count - 1) * rackGap) / count;

  const cabinets = rackList.map((v, i) => ({
    x: f.x + i * (singleRackW + rackGap),
    w: singleRackW,
    variant: v % SERVER_RACK_SPANS.length
  }));

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
      ctx.fillStyle = incident ? `rgba(239, 68, 68, ${pwrGlow})` : `rgba(56, 189, 248, ${pwrGlow})`;
      ctx.shadowColor = incident ? '#ef4444' : '#38bdf8';
      ctx.shadowBlur = 8;
      ctx.fillRect(cab.x + cab.w * 0.12, f.y + f.h * 0.18, cab.w * 0.76, 2);

      // 2. LEDs de atividade de discos SAS e tráfego de rede (piscando rápido)
      const leds = [
        { rx: 0.22, ry: 0.32, color: '#22c55e', cycle: 8 },
        { rx: 0.40, ry: 0.32, color: '#38bdf8', cycle: 6 },
        { rx: 0.58, ry: 0.32, color: '#f59e0b', cycle: 11 },
        { rx: 0.76, ry: 0.32, color: '#22c55e', cycle: 9 },

        { rx: 0.22, ry: 0.48, color: '#38bdf8', cycle: 5 },
        { rx: 0.40, ry: 0.48, color: '#22c55e', cycle: 7 },
        { rx: 0.58, ry: 0.48, color: '#22c55e', cycle: 13 },
        { rx: 0.76, ry: 0.48, color: '#f59e0b', cycle: 6 },

        { rx: 0.25, ry: 0.65, color: '#22c55e', cycle: 10 },
        { rx: 0.50, ry: 0.65, color: '#38bdf8', cycle: 8 },
        { rx: 0.72, ry: 0.65, color: '#22c55e', cycle: 12 }
      ];

      leds.forEach((l, lIdx) => {
        const on = ((t + lIdx * 7 + cIdx * 13) % l.cycle) > 2;
        if (on && !incident) {
          ctx.fillStyle = l.color;
          ctx.shadowColor = l.color;
          ctx.shadowBlur = 4;
          ctx.fillRect(cab.x + cab.w * l.rx, f.y + f.h * l.ry, 2, 2);
        } else if (incident) {
          // Em pane, todos piscam em vermelho
          if ((t + lIdx) % 10 < 5) {
            ctx.fillStyle = '#ef4444';
            ctx.shadowColor = '#ef4444';
            ctx.shadowBlur = 5;
            ctx.fillRect(cab.x + cab.w * l.rx, f.y + f.h * l.ry, 2, 2);
          }
        }
      });
      ctx.restore();
    } else {
      ctx.fillStyle = '#0f172a';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.roundRect(cab.x, f.y, cab.w, f.h, 6);
      ctx.fill();
      ctx.stroke();
    }
  });

  // Efeito de Fogo se estiver em chamas
  if (centralRackState.onFire) {
    ctx.save();
    for (let i = 0; i < 5; i++) {
      const fx = f.x + 25 + i * 40 + Math.sin(t * 0.3 + i) * 8;
      const fy = f.y + 15 + Math.cos(t * 0.4 + i) * 6;
      ctx.fillStyle = i % 2 === 0 ? 'rgba(239, 68, 68, 0.75)' : 'rgba(249, 115, 22, 0.75)';
      ctx.beginPath();
      ctx.arc(fx, fy, 10 + (t % 5), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}

function drawWorkbenchGraphic(ctx, f) {
  const benchLvl = state.workbenchLevel || 1;
  const imgKey = `workbench_lvl${benchLvl}`;
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





function drawAirConditionerGraphic(ctx, f) {
  const model = f.acModel || 'white';
  let img = ASSET_IMAGES.ac_white_split;
  let crop = AC_WHITE_CROP;

  if (model === 'black') {
    img = ASSET_IMAGES.ac_black_split;
    crop = AC_BLACK_CROP;
  } else if (model === 'tower') {
    img = ASSET_IMAGES.ac_tower_floor;
    crop = AC_TOWER_CROP;
  }

  // Sombra sob o aparelho
  ctx.fillStyle = 'rgba(15, 37, 51, 0.22)';
  ctx.beginPath();
  if (model === 'tower') {
    ctx.ellipse(f.x + f.w / 2, f.y + f.h - 2, f.w / 2, 4, 0, 0, Math.PI * 2);
  } else {
    ctx.roundRect(f.x + 2, f.y + 4, f.w, f.h, 4);
  }
  ctx.fill();

  if (img && img.complete && img.naturalWidth && crop) {
    ctx.drawImage(img, crop.sx, crop.sy, crop.sw, crop.sh, f.x, f.y, f.w, f.h);

    // Efeito de brisa fresca animada saindo do ar-condicionado
    const t = animTick;
    ctx.save();
    ctx.fillStyle = 'rgba(186, 230, 253, 0.45)';
    for (let i = 0; i < 3; i++) {
      const bx = f.x + 8 + i * (f.w / 3) + Math.sin(t * 0.15 + i) * 3;
      const by = (model === 'tower') ? (f.y + f.h * 0.35 + (t * 0.6 + i * 8) % 18) : (f.y + f.h + 2 + (t * 0.5 + i * 6) % 16);
      ctx.beginPath();
      ctx.arc(bx, by, 1.6, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  } else {
    ctx.fillStyle = model === 'black' ? '#0f172a' : '#f8fafc';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(f.x, f.y, f.w, f.h, 6);
    ctx.fill();
    ctx.stroke();
  }
}

function drawDecorGraphic(ctx, f) {
  let img = null;
  let crop = null;

  if (f.decorType === 'plant_tall') {
    img = ASSET_IMAGES.decor_plant_tall;
    crop = DECOR_PLANT_TALL_CROP;
  } else if (f.decorType === 'plant_small') {
    img = ASSET_IMAGES.decor_plant_small;
    crop = DECOR_PLANT_SMALL_CROP;
  } else if (f.decorType === 'recycle_bin') {
    img = ASSET_IMAGES.decor_recycle_bin;
    crop = DECOR_BIN_CROP;
  }

  // Sombra elíptica no chão sob o enfeite
  ctx.fillStyle = 'rgba(15, 37, 51, 0.22)';
  ctx.beginPath();
  ctx.ellipse(f.x + f.w / 2, f.y + f.h - 3, f.w / 2, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  if (img && img.complete && img.naturalWidth && crop) {
    ctx.drawImage(img, crop.sx, crop.sy, crop.sw, crop.sh, f.x, f.y, f.w, f.h);
  } else {
    ctx.fillStyle = f.decorType === 'recycle_bin' ? '#94a3b8' : '#22c55e';
    ctx.beginPath();
    ctx.roundRect(f.x, f.y, f.w, f.h, 6);
    ctx.fill();
  }
}

function drawWaitingSofaGraphic(ctx, f) {
  const isHorizontal = f.orientation === 'horizontal' || (f.w > f.h);
  const img = isHorizontal ? ASSET_IMAGES.sofa_horizontal : ASSET_IMAGES.waiting_sofa;
  const crop = isHorizontal ? SOFA_HORIZONTAL_CROP : SOFA_CROP;

  if (img && img.complete && img.naturalWidth && crop) {
    ctx.fillStyle = 'rgba(15, 37, 51, 0.22)';
    ctx.beginPath();
    ctx.roundRect(f.x + 3, f.y + 6, f.w, f.h, 8);
    ctx.fill();

    ctx.drawImage(img, crop.sx, crop.sy, crop.sw, crop.sh, f.x, f.y, f.w, f.h);
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

// ============================================================================
// INTERAÇÃO, TELEPORTES E CHAMADA DE CLIENTES
// ============================================================================
function switchGameMode(mode) {
  state.networkMode = mode;
  state.soloExpandedDuo = false;
  state.hqMinRooms = 5;
  state.players.forEach((p, idx) => { p.connected = (idx === 0); });
  state.mySlotIndex = 0;

  refreshMapsWithUpgrades();
  rebuildColliders();

  const map = currentMap();
  const you = state.players[0];
  you.x = map.spawn.x;
  you.y = map.spawn.y;
  you.waypoints = [];

  rebuildQueueForCurrentMode();
  renderTeleportButtons();
  renderAllUI();

  if (mode === 'offline') {
    showToast('🏠 Modo Offline ativado: Lojinha Compacta!');
  } else {
    showToast(`🏢 Sede Online (${state.roomCode}) iniciada com 5 Salas! Expande p/ 10, 15 e 20 salas conforme entram técnicos!`);
  }
}

function toggleSoloDuoMode(forcedState) {
  if (state.networkMode !== 'offline') {
    state.networkMode = 'offline';
  }

  const nextState = (forcedState !== undefined) ? forcedState : !state.soloExpandedDuo;
  state.soloExpandedDuo = nextState;

  if (state.soloExpandedDuo) {
    initMultiplayerRoom(state.roomCode);
    state.players[1].connected = true;
    state.players[1].x = 1285;
    state.players[1].y = 340;
    state.players[1].name = 'Parceiro #02';
    state.players[1].bubble = 'Sua sala solo expandiu! Pronto para ajudar! 🤝';
    state.players[1].bubbleTimer = 240;

    refreshMapsWithUpgrades();
  rebuildColliders();
    rebuildColliders();
    renderTeleportButtons();
    renderAllUI();

    showToast(`🤝 Modo Duo Solo ativado! A sede expandiu para os lados. Dê o código [${state.roomCode}] para seu amigo entrar!`);
  } else {
    state.players[1].connected = false;
    refreshMapsWithUpgrades();
  rebuildColliders();
    rebuildColliders();
    renderTeleportButtons();
    renderAllUI();
    showToast('🏠 Modo Solo 1P compacto restaurado.');
  }
}

function renderTeleportButtons() {
  const bar = document.getElementById('teleport-bar');
  if (!bar) return;
  const map = currentMap();
  const tps = (map && map.teleports) ? map.teleports : [];
  bar.innerHTML = tps.map(tp => `
    <button type="button" class="tp-btn" data-x="${tp.x}" data-y="${tp.y}" data-label="${tp.label}">${tp.label}</button>
  `).join('');

  bar.querySelectorAll('.tp-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const you = state.players[state.mySlotIndex];
      const tx = Number(btn.dataset.x);
      const ty = Number(btn.dataset.y);
      you.waypoints = buildDoorwayPath(you.x, you.y, tx, ty);
      you.bubble = `Indo para ${btn.dataset.label}!`;
      you.bubbleTimer = 150;
    });
  });
}

function callClientToMyRoom(caseIdx) {
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
  you.bubble = `📣 Próximo! ${c.clientName}, venha até minha mesa!`;
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

    showToast(`📣 Você chamou ${c.clientName} (${c.code})! Ele está a caminho do banquinho da sua mesa para sentar-se.`);
  } else {
    c.inMyRoom = true;
    c.walkingToDesk = false;
    c.arrivedAtDesk = true;
    c.x = targetPos.x;
    c.y = targetPos.y;
    showToast(`🗣️ ${c.clientName} sentado na sua mesa: ${c.quote}`);
    addChatMessage(`🗣️ ${c.clientName}`, `${c.quote} (${c.device})`);
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
    showToast(`🪑 ${clientInRoom.clientName} acomodou-se no banquinho pronto para o conserto!`);
  }

  state.activeCaseIndex = cases.indexOf(clientInRoom);
  openWorkbenchModal(null, true);
}

function callNextClientToRoom() {
  const nextIdx = cases.findIndex(c => !c.solved && !c.leavingState && !c.inMyRoom);
  const fallbackIdx = cases.findIndex(c => !c.solved && !c.leavingState);
  const chosenIdx = nextIdx !== -1 ? nextIdx : fallbackIdx;
  if (chosenIdx === -1) {
    rebuildQueueForCurrentMode();
    renderAllUI();
    return;
  }
  callClientToMyRoom(chosenIdx);
}

function openWorkbenchModal(defaultTab = null, forceBypass = false) {
  if (!forceBypass && !isPlayerNearWorkbench()) {
    const you = state.players[state.mySlotIndex];
    const map = currentMap();
    const wb = map.interactables?.find(i => i.id === 'my_workbench');
    const targetX = wb ? wb.x : 210;
    const targetY = wb ? (wb.y + 40) : 680;

    you.waypoints = buildDoorwayPath(you.x, you.y, targetX, targetY);
    you.bubble = '🏃 Indo até minha Bancada de Trabalho!';
    you.bubbleTimer = 180;
    showToast('⚠️ Você precisa ir até a sua Bancada de Trabalho na Cabine #01 para atender o cliente!');
    return;
  }

  let c = cases[state.activeCaseIndex];
  if (!c || c.leavingState || !c.inMyRoom) {
    const roomClientIdx = cases.findIndex(x => x.inMyRoom && !x.leavingState);
    if (roomClientIdx !== -1) {
      state.activeCaseIndex = roomClientIdx;
      c = cases[roomClientIdx];
    } else {
      const you = state.players[state.mySlotIndex];
      you.bubble = '🛎️ Balcão de Recepção: Chame um cliente!';
      you.bubbleTimer = 200;
      showToast('🛎️ Nenhum cliente na sua bancada! Vá até o Balcão de Recepção para chamar o próximo cliente.');
      return;
    }
  }

  if (defaultTab) {
    state.activeTab = defaultTab;
  }
  renderWorkbenchModal();
  document.getElementById('workbench-modal').classList.add('open');
}

function drinkCoffee() {
  state.coffeeBoostTimer = 700;
  const you = state.players[state.mySlotIndex];
  you.bubble = '☕ Café Expresso! Velocidade Turbo!';
  you.bubbleTimer = 220;
  showToast('☕ Café Expresso tomado! Velocidade Turbo ativada!');
}

function inspectNOC() {
  const you = state.players[state.mySlotIndex];
  you.bubble = '🖧 Servidores NOC 100% Online!';
  you.bubbleTimer = 180;
  showToast('🖧 Cluster NOC Perpétuo operando a 100 Gbps!');
}

function showToast(msg) {
  const t = document.getElementById('toast-feedback');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => t.classList.remove('show'), 3800);
}

function updateHUD() {
  const moneyEl = document.getElementById('hud-money');
  moneyEl.textContent = state.money < 0 ? `-R$ ${Math.abs(state.money)} (DÍVIDA!)` : `R$ ${state.money}`;
  document.getElementById('hud-money-pill').classList.toggle('in-debt', state.money < 0);

  document.getElementById('hud-burnt-count').textContent = `${state.burntCount}`;

  const rackCountEl = document.getElementById('hud-rack-count');
  if (rackCountEl) {
    rackCountEl.textContent = state.rackCapacity > 0
      ? `${state.rackParts}/${state.rackCapacity} Peças`
      : 'Comprar na Loja';
  }

  // Barra de Reputação
  const repPct = Math.round(state.rep);
  const repColor = repPct >= 70
    ? 'linear-gradient(90deg, #4bb56b, #22c55e)'
    : (repPct >= 40 ? 'linear-gradient(90deg, #f9c742, #f59e0b)' : 'linear-gradient(90deg, #e5534b, #dc2626)');

  const hudRepEl = document.getElementById('hud-rep');
  const hudRepFill = document.getElementById('hud-rep-fill');
  if (hudRepEl) hudRepEl.textContent = `${repPct}%`;
  if (hudRepFill) {
    hudRepFill.style.width = `${repPct}%`;
    hudRepFill.style.background = repColor;
  }

  const sideRepFill = document.getElementById('sidebar-rep-fill');
  const sideRepStatus = document.getElementById('sidebar-rep-status');
  if (sideRepFill) {
    sideRepFill.style.width = `${repPct}%`;
    sideRepFill.style.background = repColor;
  }
  if (sideRepStatus) {
    let label = `🌟 Excelente (${repPct}%)`;
    if (repPct < 40) label = `🤬 Crítica (${repPct}%)`;
    else if (repPct < 70) label = `⭐ Regular (${repPct}%)`;
    sideRepStatus.textContent = label;
    sideRepStatus.style.color = repPct >= 70 ? 'var(--verde-e)' : (repPct >= 40 ? 'var(--amarelo-e)' : 'var(--vermelho)');
  }

  const ownedCount = Object.values(state.inventory).filter(Boolean).length;
  document.getElementById('hud-inventory-count').textContent = `${ownedCount}/${STOCK_PARTS.length}`;

  const curRooms = getUnlockedRoomsCount();
  const curTier = getCurrentHQTier();
  const unlockedCoopCount = getUnlockedTemplates().filter(t => t.coopPlayers > 1).length;
  const unlockedSoloCount = getUnlockedTemplates().filter(t => !t.coopPlayers || t.coopPlayers === 1).length;

  const curPCount = Math.min(4, Math.max(1, getConnectedPlayerCount()));
  const soloTier = Math.min(5, state.soloExpansionTier || 1);
  const activeRooms = Math.min(5, Math.max(curPCount, soloTier));

  // Atualiza badge de equipe na oficina dinamicamente conforme jogadores entram
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
  });
  document.querySelectorAll('#solo-tier-bar [data-solo-tier]').forEach(btn => {
    btn.classList.toggle('active', Number(btn.dataset.soloTier) === soloTier);
  });
  document.querySelectorAll('.btn-shop-test-tier').forEach(btn => {
    const isAct = Number(btn.dataset.shopTier) === soloTier;
    btn.classList.toggle('btn-amarelo', isAct);
    btn.classList.toggle('btn-vidro', !isAct);
  });

  const worldQueueBadge = document.getElementById('world-queue-badge');
  if (worldQueueBadge) {
    worldQueueBadge.textContent = curPCount >= 4
      ? '👥 4/4 Técnicos · Puzzles Co-op Liberados!'
      : `👥 ${curPCount}/4 Técnicos · ${curPCount > 1 ? 'Modo Coop Ativo' : 'Só Puzzles 1P'}`;
  }

  // Card Lateral de Status da Oficina (Focado em 1 a 4 Jogadores)
  const hqBadge = document.getElementById('sidebar-hq-badge');
  const hqProgText = document.getElementById('sidebar-hq-progress-text');
  const hqFill = document.getElementById('sidebar-hq-fill');
  const hqHint = document.getElementById('sidebar-next-unlock-hint');
  const btnSideTech = document.getElementById('btn-sidebar-add-tech');

  if (hqBadge) hqBadge.textContent = `Oficina: ${curPCount}/4 Técnicos · ${activeRooms} Cabines`;
  if (hqProgText) {
    hqProgText.innerHTML = `Sessão: <b>${curPCount}/4 Técnicos</b> · Cabines Abertas: <b>${activeRooms}/4</b> · Puzzles: <b>1P a 4P</b>`;
  }
  if (hqFill) {
    hqFill.style.width = `${(activeRooms / 4) * 100}%`;
    hqFill.style.background = 'linear-gradient(90deg, #10b981, #6366f1)';
  }
  if (hqHint) {
    if (curPCount < 4) {
      hqHint.textContent = `Espaço para +${4 - curPCount} técnico(s)! (Limite de 4 jogadores no modelo focado atual)`;
    } else {
      hqHint.textContent = '🌟 Lotação Máxima (4/4)! Salas massivas para 5 a 20 jogadores em desenvolvimento no Roadmap!';
    }
  }
  if (btnSideTech) {
    btnSideTech.textContent = curPCount < 4 ? '+1 Jogador Online' : '🚀 +5 a 20 Jogadores (Futuro)';
    btnSideTech.className = curPCount < 4 ? 'btn btn-teal btn-xs' : 'btn btn-roxo btn-xs';
    btnSideTech.onclick = () => {
      if (curPCount < 4) simulateNewTechnicianJoining();
      else openFutureRoomsModalUI();
    };
  }

  const strip = document.getElementById('inventory-hud-strip');
  strip.innerHTML = `
    <div class="inv-chip has-part" id="chip-open-coop" style="cursor:pointer;">
      <span>🤝</span>
      <span>Puzzles Co-op: ${unlockedCoopCount}/18 (${curRooms} Salas)</span>
    </div>
    <div class="inv-chip ${state.rackParts > 0 ? 'has-part' : ''}" id="chip-open-shop" style="cursor:pointer;">
      <span>🗄️</span>
      <span>Rack Sala: ${state.rackCapacity > 0 ? `${state.rackParts}/${state.rackCapacity}` : 'Comprar na Loja 🛒'}</span>
    </div>
    <div class="inv-chip ${ownedCount > 0 ? 'has-part' : ''}" id="chip-open-stock" style="cursor:pointer;">
      <span>🎒</span>
      <span>Mochila: ${ownedCount} Kits</span>
    </div>
  `;
  document.getElementById('chip-open-coop')?.addEventListener('click', () => openCoopHubModalUI());
  document.getElementById('chip-open-shop')?.addEventListener('click', () => openShopModalUI());
  document.getElementById('chip-open-stock')?.addEventListener('click', () => openStockModalUI());

  document.getElementById('btn-mode-online')?.classList.toggle('active', state.networkMode === 'online');
  document.getElementById('btn-mode-offline')?.classList.toggle('active', state.networkMode === 'offline');
  
  const onlineBar = document.getElementById('online-room-bar');
  const soloBar = document.getElementById('solo-room-bar');
  if (onlineBar) onlineBar.classList.toggle('hidden', state.networkMode === 'offline');
  if (soloBar) soloBar.style.display = (state.networkMode === 'offline') ? 'inline-flex' : 'none';

  const btnSoloCallDuo = document.getElementById('btn-solo-call-duo');
  const soloDuoBadge = document.getElementById('solo-duo-code-badge');
  const displaySoloCode = document.getElementById('display-solo-duo-code');

  if (btnSoloCallDuo) {
    if (state.soloExpandedDuo) {
      btnSoloCallDuo.className = 'btn btn-amarelo btn-xs';
      btnSoloCallDuo.textContent = '👥 Duo Solo Ativo (Expandido)';
      if (soloDuoBadge) soloDuoBadge.style.display = 'inline-flex';
      if (displaySoloCode) displaySoloCode.textContent = state.roomCode;
    } else {
      btnSoloCallDuo.className = 'btn btn-verde btn-xs';
      btnSoloCallDuo.textContent = '👥 Chamar +1 (Duo Solo)';
      if (soloDuoBadge) soloDuoBadge.style.display = 'none';
    }
  }

  const headerTitle = document.getElementById('world-header-title');
  const queueBadge = document.getElementById('world-queue-badge');
  const pendingCount = cases.filter(c => !c.solved && !c.leavingState).length;
  const pCount = getConnectedPlayerCount();

  if (state.networkMode === 'offline') {
    if (state.soloExpandedDuo) {
      headerTitle.textContent = `🏠 Sede Solo Expandida (Modo Duo 2P · Sala ${state.roomCode})`;
      queueBadge.textContent = `🤝 Duo Solo 2P Ativo · ${pendingCount} Clientes na Fila`;
    } else {
      headerTitle.textContent = '🏠 Lojinha Compacta Offline (Com Loja de Móveis & Rack)';
      queueBadge.textContent = `🏠 Modo Offline · ${pendingCount} Clientes na Fila`;
    }
  } else {
    headerTitle.textContent = `🏢 Sede Online Nível ${curTier} (${curRooms} Cabines Espaçadas · Sala ${state.roomCode})`;
    queueBadge.textContent = `👥 ${pCount}/${curRooms} Técnicos · ${curRooms} Salas · ${unlockedCoopCount}/18 Co-op`;
  }
}

function renderQueue() {
  const list = document.getElementById('queue-list');
  const visibleCases = cases.map((c, idx) => ({ c, idx })).filter(item => !item.c.leavingState);
  document.getElementById('queue-counter').textContent = `${visibleCases.length} aguardando`;

  list.innerHTML = visibleCases.map(({ c, idx }) => {
    const isAngry = (!c.solved && c.patience < 35) || c.isBurntReturn;
    const barColor = c.patience > 60 ? '#4bb56b' : (c.patience > 35 ? '#f9c742' : '#e5534b');
    return `
      <div class="client-ticket ${idx === state.activeCaseIndex ? 'active' : ''} ${c.isBurntReturn ? 'burnt-return' : (isAngry ? 'angry' : '')}" data-index="${idx}">
        <div>${renderChibiSVG(isAngry ? { ...c.look, mood: 'angry' } : c.look, 'sm')}</div>
        <div class="ticket-info">
          <div class="ticket-top">
            <span class="ticket-name">${c.code} · ${c.clientName}</span>
            <span class="ticket-tag ${c.isBurntReturn ? 'tag-burnt' : c.tagClass}">
              ${c.isBurntReturn ? '🔥 PC QUEIMADO!' : (isAngry ? '🤬 BRAVO!' : c.urgency)}
            </span>
          </div>
          <div class="ticket-Preview">${c.isBurntReturn ? `🔥 ${c.burnReasonText}` : (isAngry ? c.insultText : c.device)}</div>
          <div class="patience-bar-wrap" title="Paciência: ${Math.round(c.patience)}%">
            <div class="patience-bar-fill" style="width:${Math.round(c.patience)}%; background:${barColor};"></div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  list.querySelectorAll('.client-ticket').forEach(el => {
    el.addEventListener('click', () => {
      const idx = Number(el.dataset.index);
      callClientToMyRoom(idx);
      if (isPlayerNearWorkbench()) {
        openWorkbenchModal('triagem');
      } else {
        const cName = cases[idx]?.clientName || 'Cliente';
        showToast(`📣 ${cName} chamado para sua mesa! Vá até a sua Bancada de Trabalho na Cabine #01 para atendê-lo.`);
      }
    });
  });
}

function renderTeam() {
  const list = document.getElementById('team-list');
  const unlockedRooms = getUnlockedRoomsCount();
  list.innerHTML = state.players.slice(0, unlockedRooms).map((p) => `
    <div class="team-member-card" style="opacity:${p.connected ? '1' : '0.52'}">
      <div>${renderChibiSVG(p.look, 'sm')}</div>
      <div class="team-member-info">
        <h4>${p.name}</h4>
        <p>${p.connected ? p.role : `Cabine Aberta · Código ${state.roomCode}`}</p>${state.mySlotIndex === 0 && p.connected && p.slot !== 0 ? `<button type="button" class="btn btn-coral btn-xs" onclick="kickPlayer(${p.slot})" style="font-size:10px; padding:2px 7px; margin-top:3px; border-radius:6px; font-weight:800;" title="Expulsar funcionário da oficina">🚪 Demitir</button>` : ''}
      </div>
      <div>
        ${p.connected
          ? `<span style="font-size:11px; font-weight:900; color:var(--verde);">● Ativo</span>`
          : `<span style="font-size:10px; font-weight:800; color:var(--suave);">Livre</span>`
        }
      </div>
    </div>
  `).join('');
}

function renderManualTopics() {
  const grid = document.getElementById('manual-topics-grid');
  if (!grid) return;
  const rackTopics = CENTRAL_RACK_PROBLEMS.map((p, i) => `
    <div class="manual-topic" style="border-left: 4px solid #38bdf8; background:#0f172a; color:#f8fafc;">
      <h4 style="color:#38bdf8;">🗄️⚡ Rack Central #${i + 1}: ${p.name} (${p.category})</h4>
      <p style="color:#cbd5e1;"><b>Desafio:</b> ${p.desc} <br><b>Como operar c/ mouse:</b> <span style="color:#fde047;">${p.hint}</span></p>
    </div>
  `).join('');
  const coopTopics = COOP_PUZZLES_CATALOG.map((p, i) => `
    <div class="manual-topic">
      <h4>🤝 Puzzle Co-op #${i + 1} (${p.coopPlayers}P · Sede ${p.hqTier * 5} Salas): ${p.title}</h4>
      <p>${p.stations.map(s => `<b>${s.title}:</b> ${s.options[s.correctOpt]}`).join(' | ')}</p>
    </div>
  `).join('');
  const soloTopics = STOCK_PARTS.slice(0, 9).map((p, idx) => `
    <div class="manual-topic">
      <h4>🛠️ Kit Solo #${idx + 1} · ${p.name}</h4>
      <p>${p.desc}</p>
    </div>
  `).join('');
  grid.innerHTML = rackTopics + coopTopics + soloTopics;
}

// ============================================================================
// BANCADA: MINI-GAME COMO ÚLTIMA ETAPA (ETAPA 4) E APENAS O DO PROBLEMA ATUAL!
// ============================================================================
function renderWorkbenchModal() {
  const c = cases[state.activeCaseIndex];
  if (!c) return;
  if (!c.mgState) c.mgState = createInitialMinigameState();

  // Garante que o chamado sempre tenha as 4 Perguntas, 3 Testes e 3 Diagnósticos preenchidos!
  if (!c.questions || c.questions.length === 0 || !c.diagnoses || c.diagnoses.length === 0) {
    const tpl = generateRandomCrazyCaseTemplate();
    c.questions = tpl.questions;
    c.tools = tpl.tools;
    c.diagnoses = tpl.diagnoses;
    c.minigameType = tpl.minigameType;
    c.requiredPart = tpl.requiredPart;
    c.problem = tpl.problem;
    c.quote = tpl.quote;
    c.device = tpl.device;
  }

  const reqPart = STOCK_PARTS.find(p => p.id === c.requiredPart) || STOCK_PARTS[0];
  const hasPartOrRack = !!state.inventory[c.requiredPart] || state.rackParts > 0;

  document.getElementById('active-ticket-title').textContent = `🛠️ Bancada · ${c.clientName}`;
  const badge = document.getElementById('active-ticket-badge');
  badge.textContent = c.isBurntReturn ? `${c.code} · 🔥 RETORNO PC QUEIMADO` : `${c.code} · ${c.urgency}`;
  badge.className = `ticket-tag ${c.isBurntReturn ? 'tag-burnt' : c.tagClass}`;

  document.getElementById('workbench-case-banner').classList.toggle('burnt-mode', !!c.isBurntReturn);

  if (state.rackParts > 0) {
    document.getElementById('workbench-part-status').innerHTML = `
      <span style="background:#e0e7ff; color:#3730a3; font-weight:900; font-size:12px; padding:3px 10px; border-radius:99px; border:1.5px solid #6366f1;">
        🗄️ Usando Peça do Rack da Sua Sala (${state.rackParts}/${state.rackCapacity} disp.)
      </span>
    `;
  } else if (state.inventory[c.requiredPart]) {
    document.getElementById('workbench-part-status').innerHTML = `
      <span style="background:#dcfce7; color:#166534; font-weight:900; font-size:12px; padding:3px 10px; border-radius:99px; border:1.5px solid #4ade80;">
        ✅ Na Mochila: ${reqPart.shortName} (+Bônus R$ 250)
      </span>
    `;
  } else {
    document.getElementById('workbench-part-status').innerHTML = `
      <button type="button" class="btn btn-amarelo btn-xs" id="btn-quick-equip-top">✋ Pegar ${reqPart.shortName}</button>
    `;
    document.getElementById('btn-quick-equip-top')?.addEventListener('click', () => collectStockPart(c.requiredPart));
  }

  const clientMood = c.isBurntReturn ? { ...c.look, mood: 'angry' } : c.look;
  document.getElementById('client-chibi-slot').innerHTML = renderChibiSVG(clientMood, 'lg');
  document.getElementById('client-device-badge').textContent = c.device;

  if (c.isBurntReturn) {
    document.getElementById('client-quote-text').textContent = `“🔥🤬 VOCÊ QUEIMOU MEU EQUIPAMENTO!! (${c.burnReasonText}) Já cobrei a indenização e exijo o conserto AGORA!!”`;
  } else {
    document.getElementById('client-quote-text').textContent = c.patience < 35 ? `${c.insultText} — ${c.quote}` : c.quote;
  }

  document.getElementById('mentor-chibi-slot').innerHTML = renderChibiSVG(state.players[0].look, 'sm');
  document.getElementById('mentor-hint-text').textContent = c.mentorHint;

  // Se tentar ir para a aba de minigame sem diagnóstico correto, redireciona para triagem
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
  });

  document.querySelectorAll('.tab-panel').forEach(panel => {
    panel.classList.toggle('active', panel.id === `panel-${state.activeTab}`);
  });

  // 1. Triagem
  const qGrid = document.getElementById('questions-grid');
  qGrid.innerHTML = c.questions.map((item, i) => `
    <button type="button" class="action-card ${item.asked ? 'revealed' : ''}" data-q="${i}">
      <div class="action-card-title">
        <span>💬 ${item.q}</span>
        <span>${item.asked ? '✓' : 'Perguntar'}</span>
      </div>
      <div class="action-card-result">${item.asked ? item.a : 'Clique para ouvir a resposta...'}</div>
    </button>
  `).join('');

  qGrid.querySelectorAll('.action-card').forEach(btn => {
    btn.addEventListener('click', () => {
      c.questions[Number(btn.dataset.q)].asked = true;
      renderWorkbenchModal();
    });
  });

  // 2. Testes
  const tGrid = document.getElementById('tools-grid');
  tGrid.innerHTML = c.tools.map((tool, i) => `
    <button type="button" class="action-card ${tool.ran ? 'revealed' : ''}" data-t="${i}">
      <div class="action-card-title">
        <span>${tool.name}</span>
        <span>${tool.ran ? '✓ Concluído' : 'Testar'}</span>
      </div>
      <div class="action-card-result">${tool.ran ? tool.result : 'Clique para rodar na bancada...'}</div>
    </button>
  `).join('');

  tGrid.querySelectorAll('.action-card').forEach(btn => {
    btn.addEventListener('click', () => {
      c.tools[Number(btn.dataset.t)].ran = true;
      renderWorkbenchModal();
    });
  });

  // 3. Diagnóstico
  const dGrid = document.getElementById('diagnosis-grid');
  dGrid.innerHTML = c.diagnoses.map((d, i) => `
    <button type="button" class="action-card ${c.diagnosisApproved && d.correct ? 'revealed' : ''}" data-d="${i}">
      <div class="action-card-title"><span>📋 ${d.title}</span></div>
      <div class="action-card-result">${d.desc}</div>
    </button>
  `).join('');

  dGrid.querySelectorAll('.action-card').forEach(btn => {
    btn.addEventListener('click', () => {
      handleDiagnosisStep3(c, c.diagnoses[Number(btn.dataset.d)]);
    });
  });

  // 4. Mini-Game / Puzzle Específico do Problema (ÚLTIMA OPÇÃO PARA FINALIZAR O CONSERTO!)
  renderSpecificProblemMinigame(c, hasPartOrRack, reqPart);
}

// ============================================================================
// AGENDAMENTO DE RETORNO DO CLIENTE FURÍOSO CUJO PC QUEIMOU
// ============================================================================
function scheduleAngryBurntClientReturn(clientName, device, reason) {
  setTimeout(() => {
    const existing = cases.find(c => c.clientName === clientName && c.isBurntReturn);
    if (existing) return;
    const map = currentMap();
    const waitPos = getWaitingSlotPosition(0);
    const numStr = String(nextClientIdCounter++).padStart(2, '0');

    const angryClient = {
      id: Date.now(),
      code: `Chamado #${numStr}`,
      clientName: clientName,
      urgency: 'URGENTE 🔥',
      tagClass: 'tag-burnt',
      coopPlayers: 1,
      hqTier: 1,
      device: `${device} (CHAMUSCADO)`,
      quote: `🔥 O PC que você queimou ainda está cheirando a fumaça! Exijo que troque os componentes na bancada e resolva isso!`,
      mentorHint: `⚠️ Atenção! Este cliente voltou furioso pela porta da rua porque o equipamento queimou. Faça a substituição de peças na bancada para restaurar sua reputação!`,
      minigameType: 'circuit_logic',
      requiredPart: 'placa_mae',
      diagnosisApproved: false,
      solved: false,
      minigameDone: false,
      inMyRoom: false,
      leavingState: null,
      isBurntReturn: true,
      burnReasonText: reason,
      patience: 80,
      insultText: `🔥🤬 VOLTEI! MEU PC QUEIMOU! Exijo conserto ou um novo agora!`,
      impatientText: `🔥 Anda logo! Vocês queimaram minha máquina!`,
      x: map.exitPos ? map.exitPos.x : 640,
      y: map.exitPos ? map.exitPos.y : 955,
      waypoints: [{ x: waitPos.x, y: waitPos.y }],
      radius: 14,
      mgState: createInitialMinigameState(),
      look: {
        skin: SKIN_COLORS[Math.floor(Math.random() * SKIN_COLORS.length)],
        hair: HAIR_COLORS[Math.floor(Math.random() * HAIR_COLORS.length)],
        shirt: '#b91c1c',
        glasses: true,
        headset: false,
        mood: 'angry'
      },
      questions: [
        { q: 'O que aconteceu depois do curto-circuito?', a: 'Saiu faísca e a máquina travou! Exijo revisão completa na bancada.', asked: false },
        { q: 'O senhor aceita que façamos a troca do componente queimado?', a: 'Se ficar 100% funcionando e sem cobrança indevida, sim!', asked: false }
      ],
      tools: [
        { name: 'Inspeção Térmica e Multímetro', desc: 'Mede continuidade e detecta trilhas rompidas pelo fogo.', output: 'Trilhas da linha 12V rompidas e capacitor estufado. Requer substituição de componente.', ran: false }
      ],
      diagnoses: [
        { label: 'Substituir Componentes e Placa Chamuscada', correct: true, feedback: 'Excelente! Componentes danificados trocados com sucesso.' },
        { label: 'Ligar direto na tomada para testar', correct: false, burnReason: 'Explodiu novamente o circuito de entrada!' }
      ]
    };

    cases.unshift(angryClient);
    state.activeCaseIndex = 0;
    showToast(`🔥💥 O CLIENTE ${clientName.toUpperCase()} VOLTOU PELA PORTA DA RUA COM O PC QUEIMADO!`);
    addChatMessage(`🔥 ${clientName} (RETORNOU PELA PORTA DA RUA)`, `🤬🔥 VOLTEI! O computador que você queimou (${reason}) está aqui! EXIJO CONSERTO IMEDIATO!`);

    const banner = document.getElementById('burnt-alert-banner');
    if (banner) {
      document.getElementById('burnt-alert-title').textContent = `🔥 CLIENTE ${clientName.toUpperCase()} RETORNOU PELA PORTA DA RUA!`;
      document.getElementById('burnt-alert-desc').textContent = `Ele entrou furioso com o equipamento queimado (${reason}) exigindo que você o atenda na bancada!`;
      banner.classList.add('visible');
    }
    renderAllUI();
  }, 14000);
}

// ============================================================================
// ETAPA 3 (DIAGNÓSTICO): SE ERRAR QUEIMA O PC, PAGAMOS A INDENIZAÇÃO E O CLIENTE VAI EMBORA!
// SE ACERTAR DESTRAVA O MINI-GAME NA ETAPA 4!
// ============================================================================
function handleDiagnosisStep3(c, choice) {
  if (!choice.correct) {
    const burnWhy = choice.burnReason || 'Você aplicou um procedimento errado que fechou curto-circuito no equipamento!';
    document.getElementById('workbench-modal').classList.remove('open');

    let penalty = 1800;
    const benchLvl = state.workbenchLevel || 1;
    if (benchLvl >= 4) penalty = Math.round(penalty * 0.30);
    else if (benchLvl === 3) penalty = Math.round(penalty * 0.50);
    else if (benchLvl === 2) penalty = Math.round(penalty * 0.75);
    else if (state.upgrades.pro_bench) penalty = 900;
    state.money -= penalty;
    state.burntCount += 1;
    if (typeof PlantaoTIProfile !== "undefined") { try { PlantaoTIProfile.recordBurn(); } catch(e){} }
    changeReputation(-30);

    c.inMyRoom = false;
    c.walkingToDesk = false;
    c.arrivedAtDesk = false;
    c.isBurntReturn = true;
    c.burnReasonText = burnWhy;
    c.leavingState = 'leaving_burnt';
    c.look.mood = 'angry';
    c.insultText = `🔥🤬 VOCÊ QUEIMOU MEU PC! Recebi R$ ${penalty} e nunca mais volto!`;
    c.waypoints = buildClientExitPath(c);

    scheduleAngryBurntClientReturn(c.clientName, c.device, burnWhy);

    const you = state.players[state.mySlotIndex];
    you.bubble = `🔥 Queimei o PC de ${c.clientName}! Paguei -R$ ${penalty} e ele foi embora! 😭`;
    you.bubbleTimer = 260;

    const banner = document.getElementById('burnt-alert-banner');
    if (banner) {
      document.getElementById('burnt-alert-title').textContent = `🔥💥 PC QUEIMADO! VOCÊ PAGOU -R$ ${penalty} E ${c.clientName.toUpperCase()} FOI EMBORA!`;
      document.getElementById('burnt-alert-desc').textContent = `${burnWhy} Indenização de -R$ ${penalty} paga na hora (-30% Reputação) e o cliente deixou a loja furioso!`;
      banner.classList.add('visible');
    }

    addChatMessage(`🔥 ${c.clientName} (PC QUEIMADO)`, `🤬🔥 VOCÊ QUEIMOU MEU EQUIPAMENTO!! (${burnWhy}) Peguei a indenização de R$ ${penalty} e estou indo embora!!`);
    showToast(`🔥💥 PC QUEIMADO! Você pagou -R$ ${penalty} de indenização (-30% Reputação) e ${c.clientName} foi embora!`);

    syncQueueSizeToConnectedPlayers(false);
    const nextIdx = cases.findIndex(x => !x.solved && !x.leavingState);
    if (nextIdx !== -1) state.activeCaseIndex = nextIdx;

    renderAllUI();
    return;
  }

  c.diagnosisApproved = true;
  state.activeTab = 'minigame';
  showToast('🎯 Diagnóstico correto! O Mini-Game / Puzzle específico deste problema foi liberado na Etapa 4!');
  renderWorkbenchModal();
}

// ============================================================================
// ENTREGA DO EQUIPAMENTO COMO ESTÁ (FUNCIONANDO OU NÃO)
// ============================================================================
function deliverEquipmentAsIs() {
  const c = cases[state.activeCaseIndex];
  if (!c || c.leavingState) {
    showToast('Nenhum equipamento na bancada para entregar.');
    return;
  }

  // Se o chamado já foi resolvido, entrega com sucesso e pagamento total
  if (c.solved) {
    completeRepairAfterMinigame(c);
    return;
  }

  // Devolver como está ao cliente (não consertado ou em triagem)
  const hadTriage = c.questions.some(q => q.asked) || c.tools.some(t => t.ran);
  const benchFee = hadTriage ? 40 : 20;

  state.money += benchFee;
  changeReputation(-2); // Penalidade leve (-2%) por devolver sem conserto

  c.inMyRoom = false;
  c.walkingToDesk = false;
  c.arrivedAtDesk = false;
  c.leavingState = 'leaving_as_is';
  c.look.mood = 'neutral';
  c.waypoints = buildClientExitPath(c);

  const clientMsg = hadTriage
    ? `“Certo, vou levar meu ${c.device} de volta como está. Valeu pelos testes na bancada!”`
    : `“Vou levar meu equipamento de volta do jeito que trouxe!”`;

  const you = state.players[state.mySlotIndex];
  you.bubble = `📦 Equipamento entregue como está para ${c.clientName}!`;
  you.bubbleTimer = 220;

  document.getElementById('workbench-modal').classList.remove('open');

  addChatMessage(`📦 ${c.clientName} (Devolução)`, `${clientMsg} (+R$ ${benchFee} taxa de bancada | -2% Reputação)`);
  showToast(`📦 Equipamento entregue no estado atual a ${c.clientName}! (+R$ ${benchFee} taxa de bancada recebida)`);

  syncQueueSizeToConnectedPlayers(false);
  const nextIdx = cases.findIndex(x => !x.solved && !x.leavingState);
  if (nextIdx !== -1) {
    state.activeCaseIndex = nextIdx;
  }

  renderAllUI();
}

// ============================================================================
// GAME OVER POR INCÊNDIO NO RACK CENTRAL & REINÍCIO DE EXPEDIENTE
// ============================================================================
function triggerCentralRackGameOver() {
  centralRackState.onFire = true;
  centralRackState.gameOver = true;
  centralRackState.incidentActive = false;

  document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.remove('open'));
  playTechChime('alarm');

  const mEl = document.getElementById('game-over-money');
  if (mEl) mEl.textContent = state.money < 0 ? `-R$ ${Math.abs(state.money)} (DÍVIDA!)` : `R$ ${state.money}`;
  const rEl = document.getElementById('game-over-rep');
  if (rEl) rEl.textContent = `${state.rep}%`;
  const fEl = document.getElementById('game-over-rack-fixed');
  if (fEl) fEl.textContent = `${centralRackState.fixedCount} Incidentes`;
  const bEl = document.getElementById('game-over-burnt-count');
  if (bEl) bEl.textContent = `${state.burntCount}`;

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
  if (mEl) mEl.textContent = state.money < 0 ? `-R$ ${Math.abs(state.money)} (DÍVIDA!)` : `R$ ${state.money}`;
  const rEl = document.getElementById('game-over-rep');
  if (rEl) rEl.textContent = `0% (FALÊNCIA)`;
  const fEl = document.getElementById('game-over-rack-fixed');
  if (fEl) fEl.textContent = `${centralRackState.fixedCount} Incidentes`;
  const bEl = document.getElementById('game-over-burnt-count');
  if (bEl) bEl.textContent = `${state.burntCount}`;

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
}

function restartGameSession() {
  centralRackState.onFire = false;
  centralRackState.gameOver = false;
  centralRackState.incidentActive = false;
  centralRackState.incidentSecondsRemaining = 180;
  centralRackState.incidentIntervalCounter = 0;
  centralRackState.fixedCount = 0;

  state.money = 2500;
  state.rep = 70;
  state.burntCount = 0;

  const goModal = document.getElementById('game-over-modal');
  if (goModal) goModal.classList.remove('open');

  const rackBanner = document.getElementById('rack-incident-banner');
  if (rackBanner) rackBanner.classList.remove('visible');

  const pill = document.getElementById('central-rack-countdown-pill');
  if (pill) pill.style.display = 'none';

  rebuildQueueForCurrentMode();
  const map = currentMap();
  const you = state.players[state.mySlotIndex];
  const spawnPos = (map && map.spawns && map.spawns[state.mySlotIndex]) ? map.spawns[state.mySlotIndex] : (map.spawn || { x: 210, y: 720 });
  you.x = spawnPos.x;
  you.y = spawnPos.y;
  you.waypoints = [];
  you.bubble = '🏢 Novo expediente iniciado! Rack Central reconstruído!';
  you.bubbleTimer = 240;

  showToast('🔄 Novo expediente iniciado! O Rack Central foi totalmente restaurado.');
  addChatMessage('Central de Operações', '🔄 O Rack Central foi reconstruído pela engenharia e um novo expediente técnico começou!');

  renderAllUI();
}

// ============================================================================
// FINALIZAR CONSERTO APÓS COMPLETAR O MINI-GAME NA ETAPA 4
// ============================================================================
function completeRepairAfterMinigame(c) {
  const usedRack = state.rackParts > 0;
  const usedBackpack = !!state.inventory[c.requiredPart];

  if (usedRack) {
    state.rackParts = Math.max(0, state.rackParts - 1);
    refreshMapsWithUpgrades();
  rebuildColliders();
  } else if (usedBackpack) {
    state.inventory[c.requiredPart] = false;
  }

  const wasBurntReturn = !!c.isBurntReturn;
  c.solved = true;
  c.isBurntReturn = false;
  c.inMyRoom = false;
  c.leavingState = 'leaving_happy';
  c.look.mood = 'excited';
  c.waypoints = buildClientExitPath(c);

  let baseReward = (usedRack || usedBackpack) ? 1100 : 850;
  if (wasBurntReturn) baseReward += 600;
  if (c.isHybrid) baseReward += 2800; // Mega Recompensa Híbrida (R$ 3.900 a R$ 5.000+)
  if (c.coopPlayers === 2) baseReward = 1800;
  if (c.coopPlayers === 3) baseReward = 2400;
  if (c.coopPlayers === 4) baseReward = 3200;
  if (state.upgrades.ac_lvl3) baseReward += 600;
  else if (state.upgrades.ac_lvl2) baseReward += 350;
  else if (state.upgrades.ac_lvl1 || state.upgrades.ac_split) baseReward += 150;
  const benchLvl = state.workbenchLevel || 1;
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
  changeReputation(+repGain);
  if (typeof PlantaoTIProfile !== "undefined") { try { const pCount = typeof getConnectedPlayerCount === "function" ? getConnectedPlayerCount() : 1; PlantaoTIProfile.recordRepair({ coopPlayers: pCount, repGain: repGain, wasBurntRecovery: wasBurntReturn }); } catch(e){} }

  const you = state.players[state.mySlotIndex];
  you.bubble = wasBurntReturn
    ? `🎉 Salvei o PC queimado de ${c.clientName}! Reputação restaurada! (+R$ ${baseReward} & +${repGain}% ⭐)`
    : `🎉 ${c.clientName} atendido! (+R$ ${baseReward} & +${repGain}% ⭐)`;
  you.bubbleTimer = 240;

  document.getElementById('workbench-modal').classList.remove('open');

  const toastMsg = wasBurntReturn
    ? `🎉 Cliente recuperado! ${c.clientName} perdoou o erro anterior e foi embora satisfeito (+R$ ${baseReward} e +${repGain}% Reputação)!`
    : `✅ Conserto finalizado! ${c.clientName} indo embora feliz (+R$ ${baseReward} e +${repGain}% Reputação)!`;
  addChatMessage('Assistência', `✅ ${c.clientName} (${c.code}) teve o reparo concluído e está indo embora! (+R$ ${baseReward} | +${repGain}% Reputação)`);
  showToast(toastMsg);

  renderAllUI();
}

// ============================================================================
// ETAPA 4: MINI-GAME SOLO OU UM DOS 18 PUZZLES CO-OP (6x 2P, 6x 3P, 6x 4P)!
// ============================================================================
// ============================================================================
// ETAPA 4: 30 MINI-GAMES / PUZZLES (15 HARDWARE + 15 SOFTWARE) & CASOS HÍBRIDOS!
// ============================================================================
function renderSpecificProblemMinigame(c, hasPartOrRack, reqPart) {
  const container = document.getElementById('minigame-container');
  const mg = c.mgState;

  // REGRA: O Mini-game só abre se o jogador diagnosticar com sucesso na Etapa 3!
  if (!c.diagnosisApproved) {
    container.innerHTML = `
      <div style="background:#0f172a; border:2.5px dashed #475569; border-radius:14px; padding:40px 20px; text-align:center; color:#94a3b8; font-weight:800; margin:10px 0;">
        <div style="font-size:46px; margin-bottom:12px;">🔒</div>
        <h3 style="color:#f8fafc; margin:0 0 8px; font-size:19px;">Mini-Game de Reparo Bloqueado!</h3>
        <p style="margin:0 auto 16px; max-width:460px; font-size:13.5px; line-height:1.5; color:#cbd5e1;">
          Para abrir a bancada de manutenção e o mini-game, você <b>deve primeiro acertar o diagnóstico na Etapa 3 (Diagnóstico ⚠️)</b>. Caso erre, o PC queima!
        </p>
        <button type="button" class="btn btn-amarelo btn-sm" id="btn-goto-diagnosis-step" style="font-weight:900;">⚠️ Ir para Etapa 3: Diagnóstico</button>
      </div>
    `;
    document.getElementById('btn-goto-diagnosis-step')?.addEventListener('click', () => {
      state.activeTab = 'conduta';
      renderWorkbenchModal();
    });
    return;
  }

  let diagTipHTML = '';

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
            ? `✅ <b>Kit na Mochila:</b> ${reqPart ? reqPart.name : "Peça Técnica"} (+Bônus R$ 250!)`
            : `📦 <b>Peça Recomendada:</b> ${reqPart ? reqPart.name : "Peça Técnica"} (Compre um Rack na Loja para nunca faltar peça na sala!)`)
        }
      </div>
      ${!hasPartOrRack && reqPart ? `
        <button type="button" class="btn btn-amarelo btn-xs" id="btn-mg-grab-now">✋ Pegar ${reqPart.shortName || reqPart.name}</button>
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

  container.innerHTML = (typeof diagTipHTML !== 'undefined' ? diagTipHTML : '') + partBannerHTML + hybridHeaderHTML + gameBodyHTML + completionBanner;
  document.getElementById('btn-go-step3-optional')?.addEventListener('click', () => {
    state.activeTab = 'conduta';
    renderWorkbenchModal();
  });

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

function addChatMessage(author, text) {
  const feed = document.getElementById('chat-feed');
  const div = document.createElement('div');
  div.className = 'chat-msg';
  div.innerHTML = `<span>💬</span><div><b>${author}:</b> ${text}</div>`;
  feed.appendChild(div);
  feed.scrollTop = feed.scrollHeight;
}

function setupEvents() {
  document.getElementById('btn-mode-online').addEventListener('click', () => switchGameMode('online'));
  document.getElementById('btn-mode-offline').addEventListener('click', () => switchGameMode('offline'));

  // Controles do Modo Duo Solo (Expansão Lateral com a Conta Solo)
  document.getElementById('btn-solo-call-duo')?.addEventListener('click', () => toggleSoloDuoMode());
  document.getElementById('btn-solo-simulate-partner')?.addEventListener('click', () => toggleSoloDuoMode(true));
  document.getElementById('btn-copy-solo-duo-code')?.addEventListener('click', () => {
    navigator.clipboard?.writeText(state.roomCode);
    showToast(`📋 Código Duo [${state.roomCode}] copiado! Passe para seu amigo entrar!`);
  });
  document.getElementById('btn-solo-open-lobby')?.addEventListener('click', () => openLobbyModalUI());
  document.getElementById('btn-lobby-enter-duo')?.addEventListener('click', () => {
    closeLobbyModalUI();
    toggleSoloDuoMode(true);
  });

  // Controle de jogadores da partida (1 a 4 jogadores no modelo focado atual)
  document.querySelectorAll('#session-players-bar [data-match-players]').forEach(btn => {
    btn.addEventListener('click', () => {
      setMatchPlayers(Number(btn.dataset.matchPlayers), true);
    });
  });
  document.getElementById('btn-sim-join-player')?.addEventListener('click', () => simulateNewTechnicianJoining());
  document.getElementById('btn-sidebar-add-tech')?.addEventListener('click', () => simulateNewTechnicianJoining());
  document.getElementById('btn-copy-invite-code')?.addEventListener('click', () => {
    navigator.clipboard?.writeText(state.roomCode);
    showToast(`📋 Código de Convite [${state.roomCode}] copiado! Envie para seus amigos entrarem como seus funcionários!`);
    addChatMessage('Convite', `📋 Código de convite copiado: <b>${state.roomCode}</b>. Passe para os amigos para que entrem como seus funcionários nas Estações #02, #03 e #04.`);
  });

  // Modal de salas massivas no futuro (5 a 20 jogadores)
  const futureModal = document.getElementById('future-rooms-modal');
  document.getElementById('btn-open-future-rooms')?.addEventListener('click', () => openFutureRoomsModalUI());
  document.getElementById('btn-close-future-rooms')?.addEventListener('click', () => futureModal?.classList.remove('open'));
  document.getElementById('btn-close-future-rooms-2')?.addEventListener('click', () => futureModal?.classList.remove('open'));
  futureModal?.addEventListener('click', (e) => { if (e.target === futureModal) futureModal.classList.remove('open'); });

  document.getElementById('btn-lobby-preview-world')?.addEventListener('click', () => openFutureRoomsModalUI());
  document.getElementById('btn-mode-world-future')?.addEventListener('click', () => openFutureRoomsModalUI());

  // Botões de Teste das Expansões da Loja Solo (1x a 5x)
  document.querySelectorAll('#solo-tier-bar [data-solo-tier]').forEach(btn => {
    btn.addEventListener('click', () => {
      setSoloExpansionTier(Number(btn.dataset.soloTier), true);
    });
  });
  document.querySelectorAll('.btn-shop-test-tier').forEach(btn => {
    btn.addEventListener('click', () => {
      setSoloExpansionTier(Number(btn.dataset.shopTier), true);
    });
  });
  document.getElementById('btn-cheat-money')?.addEventListener('click', () => {
    state.money += 10000;
    playTechChime('success');
    showToast('💰 +R$ 10.000 adicionados ao caixa para testes!');
    renderAllUI();
    if (document.getElementById('shop-modal')?.classList.contains('open')) renderShopModal();
  });
  document.getElementById('btn-cheat-rep')?.addEventListener('click', () => {
    state.rep = 100;
    playTechChime('success');
    showToast('⭐ Reputação ajustada para 100% para testes!');
    renderAllUI();
    if (document.getElementById('shop-modal')?.classList.contains('open')) renderShopModal();
  });

  // Central dos 18 Puzzles Co-op (6x 2P, 6x 3P, 6x 4P)
  const coopHubModal = document.getElementById('coop-hub-modal');
  document.getElementById('btn-open-coop-hub')?.addEventListener('click', () => openCoopHubModalUI());
  document.getElementById('btn-open-coop-hub-2')?.addEventListener('click', () => openCoopHubModalUI());
  document.getElementById('btn-wb-open-coop-hub')?.addEventListener('click', () => openCoopHubModalUI());
  document.getElementById('btn-close-coop-hub')?.addEventListener('click', () => coopHubModal.classList.remove('open'));
  coopHubModal?.addEventListener('click', (e) => { if (e.target === coopHubModal) coopHubModal.classList.remove('open'); });

  document.getElementById('btn-coop-hub-expand')?.addEventListener('click', () => {
    const cur = getUnlockedRoomsCount();
    const next = cur < 10 ? 10 : (cur < 15 ? 15 : 20);
    setHQTierRooms(next);
    renderCoopHubModal();
  });

  document.querySelectorAll('#coop-hub-filter-bar [data-coop-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.coopHubFilter = btn.dataset.coopFilter;
      renderCoopHubModal();
    });
  });

  document.getElementById('btn-dismiss-burnt').addEventListener('click', () => {
    document.getElementById('burnt-alert-banner').classList.remove('visible');
  });

  document.getElementById('btn-copy-code').addEventListener('click', () => {
    if (navigator.clipboard) navigator.clipboard.writeText(state.roomCode).catch(() => {});
    showToast(`📋 Código da Sala "${state.roomCode}" copiado!`);
  });

  document.getElementById('btn-join-room').addEventListener('click', () => {
    const code = document.getElementById('input-join-code').value.trim().toUpperCase();
    if (!code) {
      showToast('⚠️ Digite um código de sala (ex: TI-4829)!');
      return;
    }
    joinRoomAsGuest(code);
  });

  // Alternar Tela Aumentada (Teatral / Widescreen)
  document.getElementById('btn-toggle-enlarged-screen')?.addEventListener('click', () => toggleEnlargedScreen());
  document.getElementById('btn-overlay-enlarged')?.addEventListener('click', () => toggleEnlargedScreen());

  // Loja de Móveis & Rack
  const shopModal = document.getElementById('shop-modal');
  document.getElementById('btn-open-shop')?.addEventListener('click', () => openShopModalUI());
  document.getElementById('btn-open-shop-2')?.addEventListener('click', () => openShopModalUI());
  document.getElementById('btn-close-shop')?.addEventListener('click', () => shopModal.classList.remove('open'));
  shopModal?.addEventListener('click', (e) => { if (e.target === shopModal) shopModal.classList.remove('open'); });

  // Estoque Geral
  const stockModal = document.getElementById('stock-modal');
  document.getElementById('btn-open-stock-modal')?.addEventListener('click', () => openStockModalUI());
  document.getElementById('btn-refill-rack-from-stock')?.addEventListener('click', () => refillMyRackFree());
  document.getElementById('btn-grab-all-stock')?.addEventListener('click', () => collectAllStockParts());
  document.getElementById('btn-close-stock').addEventListener('click', () => stockModal.classList.remove('open'));
  stockModal.addEventListener('click', (e) => { if (e.target === stockModal) stockModal.classList.remove('open'); });

  document.getElementById('btn-interact-world').addEventListener('click', () => {
    if (activeInteractable) activeInteractable.action();
  });

  document.getElementById('btn-call-next').addEventListener('click', () => callNextClientToRoom());

  const wbModal = document.getElementById('workbench-modal');
  document.getElementById('btn-close-workbench').addEventListener('click', () => wbModal.classList.remove('open'));
  wbModal.addEventListener('click', (e) => { if (e.target === wbModal) wbModal.classList.remove('open'); });

  // Botões de entregar equipamento no estado em que está (seja consertado ou não)
  document.getElementById('btn-deliver-as-is')?.addEventListener('click', () => deliverEquipmentAsIs());
  document.getElementById('btn-deliver-as-is-bottom')?.addEventListener('click', () => deliverEquipmentAsIs());

  // Botão de reiniciar após Game Over
  document.getElementById('btn-restart-game')?.addEventListener('click', () => restartGameSession());

  document.querySelectorAll('.step-tab').forEach(tab => {
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
  });

  const manualModal = document.getElementById('manual-modal');
  document.getElementById('btn-open-manual').addEventListener('click', () => {
    renderManualTopics();
    manualModal.classList.add('open');
  });
  document.getElementById('btn-close-manual').addEventListener('click', () => manualModal.classList.remove('open'));
  manualModal.addEventListener('click', (e) => { if (e.target === manualModal) manualModal.classList.remove('open'); });

  document.querySelectorAll('.sticker-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const sticker = btn.dataset.sticker;
      const you = state.players[state.mySlotIndex];
      you.bubble = sticker;
      you.bubbleTimer = 220;
      addChatMessage(you.name, `<b>${sticker}</b>`);
      broadcastNet({ type: 'chat_sticker', peerId: state.myPeerId, author: you.name, text: `<b>${sticker}</b>` });
    });
  });

  // Central de Salas (Solo 1P, Sala em Grupo com Código e Futura Sala "Mundo" 20P)
  const roomLobbyModal = document.getElementById('room-lobby-modal');
  document.getElementById('btn-open-lobby-modal')?.addEventListener('click', () => openLobbyModalUI());
  document.getElementById('btn-close-lobby-modal')?.addEventListener('click', () => roomLobbyModal?.classList.remove('open'));
  roomLobbyModal?.addEventListener('click', (e) => { if (e.target === roomLobbyModal) roomLobbyModal.classList.remove('open'); });

  document.getElementById('btn-lobby-enter-solo')?.addEventListener('click', () => {
    switchGameMode('offline');
    roomLobbyModal?.classList.remove('open');
    showToast('🏠 Você entrou na Sala Solo! Apenas puzzles de 1 pessoa estarão disponíveis.');
  });

  document.getElementById('btn-lobby-enter-group')?.addEventListener('click', () => {
    switchGameMode('online');
    roomLobbyModal?.classList.remove('open');
    showToast(`👥 Você está na Sala em Grupo (${state.roomCode})! A partir de 4 jogadores, puzzles em grupo são liberados.`);
  });

  document.getElementById('btn-lobby-new-code')?.addEventListener('click', () => {
    const newCode = 'TI-' + Math.floor(1000 + Math.random() * 9000);
    initMultiplayerRoom(newCode);
    renderLobbyModal();
    showToast(`🔄 Nova Sala em Grupo criada: ${newCode}!`);
  });

  document.getElementById('btn-lobby-join-code')?.addEventListener('click', () => {
    const input = document.getElementById('input-lobby-join-code');
    const code = input ? input.value.trim().toUpperCase() : '';
    if (!code) {
      showToast('⚠️ Digite o código da sala (ex: TI-4829)!');
      return;
    }
    joinRoomAsGuest(code);
    renderLobbyModal();
    roomLobbyModal?.classList.remove('open');
    showToast(`🔑 Conectado com sucesso à Sala em Grupo ${code}!`);
  });

  const handleWorldFuture = () => {
    showToast('🌍 Sala "Mundo" 20p: Um mundo persistente 24/7 sem código, com 20 jogadores simultâneos e grandes incidentes globais. Em breve!');
    addChatMessage('Central de Salas', '🌍 <b>Sala "Mundo" (Até 20 Jogadores Simultâneos):</b> Em desenvolvimento! Uma sala online constante e perpétua 24/7 sem necessidade de código, com desafios massivos de infraestrutura.');
  };
  document.getElementById('btn-lobby-preview-world')?.addEventListener('click', handleWorldFuture);
  document.getElementById('btn-mode-world-future')?.addEventListener('click', handleWorldFuture);

  // Botões de conectar 4 jogadores para liberar grupo imediatamente:
  document.getElementById('btn-sim-reach-4p')?.addEventListener('click', () => reachMinimumGroupPlayers4());
  document.getElementById('btn-coop-hub-reach-4p')?.addEventListener('click', () => reachMinimumGroupPlayers4());

  // Rack Central de Infraestrutura (10 Puzzles Interativos & Incidentes Periódicos)
  const centralRackModal = document.getElementById('central-rack-modal');
  document.getElementById('btn-open-central-rack')?.addEventListener('click', () => openCentralRackModal());
  document.getElementById('btn-close-central-rack')?.addEventListener('click', () => centralRackModal?.classList.remove('open'));
  centralRackModal?.addEventListener('click', (e) => { if (e.target === centralRackModal) centralRackModal.classList.remove('open'); });

  document.getElementById('btn-goto-central-rack')?.addEventListener('click', () => {
    const you = state.players[state.mySlotIndex];
    const map = currentMap();
    const rackItems = (map.interactables || []).filter(i => i.id.startsWith('central_rack'));
    let closest = rackItems[0];
    let minDist = Infinity;
    rackItems.forEach(item => {
      const d = Math.hypot(you.x - item.x, you.y - item.y);
      if (d < minDist) { minDist = d; closest = item; }
    });
    const targetX = closest ? closest.x : 230;
    const targetY = closest ? (closest.y + 70) : 405;

    you.waypoints = buildDoorwayPath(you.x, you.y, targetX, targetY);
    you.bubble = '🏃 Correndo para o Rack de Infraestrutura resolver a pane!';
    you.bubbleTimer = 180;
    showToast('🏃 Caminhando até o Rack de Infraestrutura! Ao chegar perto, pressione [E] no rack para abrir os controles.');
  });

  document.getElementById('btn-rack-sim-incident')?.addEventListener('click', () => {
    triggerCentralRackIncident();
    showToast('⚡ Incidente aleatório simulado no Rack Central!');
  });

  document.querySelectorAll('#central-rack-selector-bar [data-rack-puzzle]').forEach(btn => {
    btn.addEventListener('click', () => {
      centralRackState.selectedPuzzleIdx = Number(btn.dataset.rackPuzzle);
      playTechChime('click');
      renderCentralRackModal();
    });
  });

  document.getElementById('btn-complete-rack-puzzle')?.addEventListener('click', () => {
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
      showToast(`⚠️ Complete o puzzle "${curProb.shortName}" interativamente antes de confirmar o reparo! ${curProb.hint}`);
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
      showToast(`✅ Módulo "${curProb.shortName}" reparado! (${doneReq}/${totalReq} resolvidos). Avançando para o próximo defeito...`);
      renderCentralRackModal();
    }
  });
}

function renderAllUI() {
  updateHUD();
  renderQueue();
  renderTeam();
}

window.addEventListener('DOMContentLoaded', () => {
  setupEvents();
  rebuildColliders();
  rebuildQueueForCurrentMode();
  renderTeleportButtons();
  renderManualTopics();
  initMultiplayerRoom(state.roomCode);

  // Posiciona o jogador principal exatamente na Cabine #01 (térreo)
  const map = currentMap();
  const you = state.players[0];
  you.x = (map && map.spawn) ? map.spawn.x : 210;
  you.y = (map && map.spawn) ? map.spawn.y : 720;
  you.waypoints = [];

  generateSessionShelfVariants();
  initCanvasWorld();
  const youInitial = state.players[0];
  if (youInitial) {
    youInitial.bubble = '🛎️ Balcão de Recepção: Chame seu cliente!';
    youInitial.bubbleTimer = 260;
  }
  addChatMessage('Sistema', `🛠️ Oficina aberta! Você é o Chefe Técnico na Cabine #01. Convide amigos com o código [${state.roomCode}] para entrarem como seus funcionários!`);
  renderAllUI();
});


// ==========================================
// FUNÇÕES DE EXPULSÃO (KICK) & PERFIL
// ==========================================
function kickPlayer(slot) {
  const p = state.players[slot];
  if (!p || !p.connected) return;
  if (!confirm('Deseja realmente demitir e expulsar ' + p.name + ' da oficina?')) return;
  broadcastNet({ type: 'kick_player', slot: slot, peerId: p.peerId });
  p.connected = false;
  p.peerId = null;
  addChatMessage('👑 Chefe da Oficina', '🚪 ' + p.name + ' foi demitido e expulso da assistência técnica!');
  showToast('🚪 ' + p.name + ' foi expulso da sala.');
  renderAllUI();
}
window.kickPlayer = kickPlayer;

try {
  const rawUser = localStorage.getItem('omnivoid_user');
  if (rawUser) {
    const u = JSON.parse(rawUser);
    if (u && (u.nickname || u.name)) {
      state.players[0].name = (u.nickname || u.name) + ' (Dono da Oficina)';
    }
  }
} catch(e){}
