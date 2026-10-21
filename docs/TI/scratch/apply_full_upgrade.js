const fs = require('fs');

let gameContent = fs.readFileSync('game.js', 'utf8');
const minigameRenderCode = fs.readFileSync('scratch/minigame_render_code.js', 'utf8');
const themes = JSON.parse(fs.readFileSync('scratch/all_30_themes.json', 'utf8'));

// 1. Build Personas 50 and Devices 40
const personas = [
  { name: 'Seu Valdemar (Aposentado)', quirk: 'Lavou o computador com mangueira de jardim para tirar a poeira' },
  { name: 'Dona Gertrudes (Baixaki)', quirk: 'Instalou 47 barras no navegador e o PC começou a falar em russo' },
  { name: 'Enzo Gamer (TikTok)', quirk: 'Passou manteiga no lugar de pasta térmica porque viu numa trend viral' },
  { name: 'Claudinho da Van', quirk: 'Ligou o módulo de som do carro de 2000W direto na fonte ATX' },
  { name: 'Dr. Arnaldo (Dentista)', quirk: 'Guardou dentes de siso extraídos dentro do gabinete gamer' },
  { name: 'Sabrina Crypto', quirk: 'Colocou 12 hamsters correndo na rodinha pra tentar minerar Dogecoin' },
  { name: 'Prof. Tibúrcio (Física)', quirk: 'Tentou simular o Big Bang e a dobra espacial num processador Celeron' },
  { name: 'Marcão do Churrasco', quirk: 'Derrubou cerveja gelada direto na placa de vídeo na final do campeonato' },
  { name: 'Teozinho Streamer', quirk: 'Passou pasta de dente Colgate Total 12 no socket AM5 pra ficar branquinho' },
  { name: 'Tia Neide das Receitas', quirk: 'Tem 18.000 abas de receita abertas no Chrome desde 2014' },
  { name: 'Cleiton do TCC', quirk: 'Faltam 8 minutos pra entregar o TCC e a tela ficou toda rosa choque' },
  { name: 'Vanderlei dos Pombos', quirk: 'Pombos fizeram ninho dentro do gabinete e chocaram ovos nos slots de RAM' },
  { name: 'MC Kelvinho', quirk: 'Ligou a caixa de som paredão de 5000W na porta USB 2.0 da frente' },
  { name: 'Seu Nelson Alfaiate', quirk: 'Tentou costurar a fita flat IDE com agulha e linha de pesca transparente' },
  { name: 'Astrólogo Jurandir', quirk: 'O computador não quer ligar porque Mercúrio está retrógrado em Capricórnio' },
  { name: 'Beto do Pastel', quirk: 'Caiu caldo de cana e queijo derretido de pastel dentro da fonte de alimentação' },
  { name: 'Vovô Nonô', quirk: 'Pensou que o cooler do processador era exaustor e fritou coxinha em cima' },
  { name: 'Sommelier de RGB', quirk: 'Emendou 35 fitas LED 12V com arame de pão de forma em volta da placa-mãe' },
  { name: 'Dona Lurdes das Plantas', quirk: 'Regou uma samambaia em cima do gabinete gamer aquário' },
  { name: 'Julinho Mecânico', quirk: 'Colocou óleo de motor 20W50 como fluido no water cooler custom' },
  { name: 'Zé do Drone', quirk: 'Tentou soldar uma antena parabólica de alumínio na placa Wi-Fi com maçarico' },
  { name: 'Tiozão do Zap', quirk: 'Apagou a pasta System32 porque o áudio do zap disse que dobrava a memória RAM' },
  { name: 'Fabinho do Som', quirk: 'Colocou um subwoofer de 12 polegadas encostado no HD mecânico de 4TB' },
  { name: 'Paulinho Day Trader', quirk: 'O gato dormiu em cima do teclado e comprou 500 contratos de milho futuro' },
  { name: 'Síndico Miro', quirk: 'Ligou o interfone do prédio na porta serial COM1 do servidor da portaria' },
  { name: 'Cosplayer Cyberpunk', quirk: 'Passou neon líquido fluorescente que vazou por todos os conectores PCIe' },
  { name: 'Dra. Beatriz (Cirurgiã)', quirk: 'Esqueceu uma chave philips magnética dentro da ventoinha da GPU' },
  { name: 'Gari Robson', quirk: 'Achou o PC jogado na caçamba e quer rodar GTA 6 no talo com ray tracing' },
  { name: 'Biólogo Marinho', quirk: 'Uma colônia de baratas mutantes está morando e pagando aluguel na fonte' },
  { name: 'Mãe do Pedrinho', quirk: 'Passou lustra-móveis de lavanda em toda a placa-mãe e no processador' },
  { name: 'Estagiário Renan', quirk: 'Inverteu a chave seletora 110V/220V com o PC ligado pra ver se dobrava os FPS' },
  { name: 'Capitão Nascimento (TI)', quirk: 'Acha que o SSD NVMe está grampeado pela KGB e quer perícia militar' },
  { name: 'Padre Quevedo', quirk: 'Diz que o computador é uma heresia porque a gaveta do CD abre e fecha sozinha' },
  { name: 'Maristela do RH', quirk: 'Aperta a tecla Power achando que é o botão de pausa do expediente' },
  { name: 'Carlinhos do Overclock', quirk: 'Ligou um motor de geladeira Electrolux direto no die do Core i9' },
  { name: 'Seu Antenor do Posto', quirk: 'Limpou o gabinete com compressor de posto a 150 PSI e arrancou capacitores' },
  { name: 'Seu Jorge da Sucata', quirk: 'Encontrou o PC na prensa hidráulica e quer recuperar as fotos do churrasco de 1994' },
  { name: 'Dona Neide do Bolo de Pote', quirk: 'Deixou cair 3 colheres de brigadeiro gourmet fervendo dentro do cooler da fonte' },
  { name: 'Gamer de Lan House 2004', quirk: 'Instalou CS 1.6 com 45 skins de armas que vieram com 9 trojans e um keylogger russo' },
  { name: 'Tio do Zap Conspiracionista', quirk: 'Passou papel alumínio em todas as placas pra evitar radiação 5G dos Illuminati' },
  { name: 'Vovó do Candy Crush', quirk: 'Clicou em 14 anúncios de "Ganhe um microondas grátis" e a tela agora pisca em neon roxo' },
  { name: 'Concurseiro com 800 PDFs', quirk: 'Tem 87 janelas do Adobe Reader abertas e o processador está fritando a 99°C' },
  { name: 'Hacker de Wi-Fi da Vizinha', quirk: 'Tentou quebrar a senha WPA3 usando força bruta num netbook Atom de 1GB de RAM' },
  { name: 'Streamer Furioso', quirk: 'Deu ragequit no Valorant, socou o teclado mecânico e arrancou a porta USB do gabinete' },
  { name: 'DJ Alok da Madrugada', quirk: 'Ligou uma mesa de som de 32 canais e um canhão de laser direto no conector de áudio HD' },
  { name: 'Youtuber de Unboxing Sem Luva', quirk: 'Derrubou o processador no chão de cerâmica e entortou 14 pinos dourados com a unha' },
  { name: 'Técnico de TI da Prefeitura', quirk: 'Esqueceu a senha do Administrador e tentou resetar a BIOS com um clipe de papel entortado' },
  { name: 'Pastor Miracelso da Rádio', quirk: 'Ungiu o HD mecânico com óleo santo e agora o disco faz barulho de serra elétrica' },
  { name: 'Vendedora de Cosméticos', quirk: 'Tem 14 catálogos em PDF rodando em segundo plano e a memória RAM está em 99.8%' },
  { name: 'Trader de Cripto Alavancado 100x', quirk: 'Derramou energético Monster na GPU de 16 pinos enquanto via o gráfico despencar' }
];

const devices = [
  '🖥️ PC Aquário Gamer Recheado de Guaraná e Peixe Beta',
  '💻 Notebook Positivo com Tijolo no Lugar da Bateria',
  '🖥️ Gabinete Bege de 1998 com RTX 4090 Amarrada com Arame',
  '💻 MacBook com Queijo Mussarela Derretido no Teclado',
  '🖥️ Servidor Xeon com Ninho de Rato na Fonte ATX',
  '💻 Laptop Gamer Turbinado com Motor de Liquidificador',
  '🖥️ PC dos Correios que Roda na Manivela',
  '🖥️ Setup Espacial com Barulho de Turbina de Boeing',
  '💻 Ultrabook Dobrado ao Meio porque Sentaram em Cima',
  '🖥️ Torre Gamer Lavada na Máquina de Lavar Louça',
  '🖥️ PC Cripto Disfarçado de Cafeteira Industrial',
  '💻 Notebook de Oficina com Graxa de Chassi nas Teclas',
  '🖥️ Workstation NASA que Só Liga com Três Palmas',
  '🖥️ PC de Lan House com Chiclete no Slot PCI',
  '💻 Netbook da Xuxa Tentando Minerar Bitcoin',
  '🖥️ Rig de Mineração com 6 Placas em Varal de Roupa',
  '🖥️ Gabinete Furado com Furadeira pra Entrar Vento',
  '💻 Notebook do TCC com Tela Presa por Fita Silver Tape',
  '🖥️ PC com Water Cooler Abastecido com Cerveja Pilsen',
  '🖥️ Servidor de Padaria Coberto de Farinha de Trigo',
  '💻 ThinkPad que Sobreviveu a Queda da Escada e Incêndio',
  '🖥️ Computador Frankenstein Montado em Caixa de Sapato',
  '🖥️ Estação 8K com Manteiga no Lugar de Pasta Térmica',
  '💻 Chromebook Escolar com Giz de Cera na Porta USB',
  '🖥️ PC Retrô que Dá Choque na Carcaça e Toca Rádio AM',
  '🖥️ All-in-One de Lotérica com Fita Crepe na Webcam e Teclas Afundadas',
  '🖥️ Servidor de CFTV com Teias de Aranha e 32 Câmeras Travadas',
  '🖥️ Mini PC de Totem de Shopping com Tela Azul da Morte em Loop',
  '🖥️ Computador de Consultório com Resina Acrílica no Cooler',
  '💻 Notebook Gamer com Ventoinha Riscando o Chassi em 12000 RPM',
  '🖥️ PC de Farmácia com Leitor de Código de Barras Pegando Fogo',
  '💻 Laptop de Mecânica com Graxa Preta e Óleo Diesel no Teclado',
  '🖥️ PC de Padaria com Camada de 2cm de Farinha no Dissipador',
  '🖥️ Workstation de Arquitetura Renderizando Maquete em Chamas',
  '🖥️ Servidor de Rádio Pirata Transmitindo com Antena de Bombril',
  '💻 Netbook do Governo com Bloqueio de BIOS e Tela Trincada',
  '🖥️ PC de Barco Pesqueiro com Maresia e Salitre nos Conectores PCIe',
  '🖥️ Setup de DJ com Confete e Fumaça de Gelo Seco nos Slots de Memória',
  '📱 Tablet Híbrido com Bateria Estufada Empurrando a Tela pra Fora',
  '🖥️ Gabinete Industrial de Metal Pesado Coberto de Limalha de Ferro'
];

function serializeTheme(t) {
  const variationsStr = t.variations.map(v => {
    return `      {
        theme: ${JSON.stringify(v.theme)},
        quote: (p, d) => \`${v.quote.replace(/`/g, '\\`')}\`,
        questions: ${JSON.stringify(v.questions, null, 10).trim()},
        tools: ${JSON.stringify(v.tools, null, 10).trim()},
        correct: ${JSON.stringify(v.correct, null, 10).trim()},
        wrongs: ${JSON.stringify(v.wrongs, null, 10).trim()}
      }`;
  }).join(',\n');

  return `  {
    minigameType: ${JSON.stringify(t.minigameType)},
    requiredPart: ${JSON.stringify(t.requiredPart)},
    urgency: ${JSON.stringify(t.urgency)},
    tagClass: ${JSON.stringify(t.tagClass)},
    variations: [
${variationsStr}
    ]
  }`;
}

const serializedThemes = themes.map(serializeTheme).join(',\n');

const proceduralBlock = `const CRAZY_CLIENT_PERSONAS = ${JSON.stringify(personas, null, 2)};

const CRAZY_DEVICES = ${JSON.stringify(devices, null, 2)};

console.log('Personas:', CRAZY_CLIENT_PERSONAS.length);
console.log('Devices:', CRAZY_DEVICES.length);
console.log('Themes:', 30);
console.log('Total permutations base:', CRAZY_CLIENT_PERSONAS.length * CRAZY_DEVICES.length * 30);

const CRAZY_PROBLEM_THEMES = [
${serializedThemes}
];

// ============================================================================
// FUNÇÃO GERADORA DE CASOS PROCEDURAIS COM MAIS DE 2.000 POSSIBILIDADES E CASOS HÍBRIDOS
// ============================================================================
function generateRandomCrazyCaseTemplate(forceHybrid = false) {
  const soloTier = state.soloExpansionTier || 1;
  const isHybrid = forceHybrid || (soloTier >= 4 && Math.random() < 0.45);
  const persona = CRAZY_CLIENT_PERSONAS[Math.floor(Math.random() * CRAZY_CLIENT_PERSONAS.length)];
  const device = CRAZY_DEVICES[Math.floor(Math.random() * CRAZY_DEVICES.length)];

  if (isHybrid) {
    const hwPool = CRAZY_PROBLEM_THEMES.filter(t => t.urgency.includes('Hardware') || t.urgency.includes('Física') || t.urgency.includes('Montagem') || t.urgency.includes('Eletrônica') || t.urgency.includes('Rede'));
    const swPool = CRAZY_PROBLEM_THEMES.filter(t => t.urgency.includes('Lógica') || t.urgency.includes('Otimização') || t.urgency.includes('Diagnóstico') || t.urgency.includes('Reparo') || t.urgency.includes('Segurança') || t.urgency.includes('Firmware') || t.urgency.includes('Resgate'));

    const hwTheme = hwPool[Math.floor(Math.random() * hwPool.length)] || CRAZY_PROBLEM_THEMES[0];
    const swTheme = swPool[Math.floor(Math.random() * swPool.length)] || CRAZY_PROBLEM_THEMES[15];

    const hwVar = hwTheme.variations[Math.floor(Math.random() * hwTheme.variations.length)];
    const swVar = swTheme.variations[Math.floor(Math.random() * swTheme.variations.length)];

    const combinedQuote = \`"MEU COMPUTADOR É UM CASO PERDIDO! \${hwVar.quote(persona, device).replace(/^"|"$/g, '')} E além disso \${swVar.quote(persona, device).replace(/^"|"$/g, '')}"\`;

    const questions = [
      hwVar.questions[0],
      hwVar.questions[1] || hwVar.questions[0],
      swVar.questions[0],
      swVar.questions[1] || swVar.questions[0]
    ].map(q => ({
      q: q.q,
      a: typeof q.a === 'function' ? q.a(persona, device) : q.a
    }));

    const tools = [
      ...hwVar.tools.slice(0, 2),
      ...swVar.tools.slice(0, 2)
    ];

    const diagnoses = [
      {
        title: \`Reparo Híbrido Completo: \${hwVar.correct.title.slice(0, 50)}... E \${swVar.correct.title.slice(0, 50)}...\`,
        desc: 'Corrige o colapso físico de hardware na Fase 1 e neutraliza os vírus/danos lógicos na Fase 2.',
        correct: true
      },
      {
        title: 'Limpar Apenas por Cima com Pano Úmido e Deixar os Vírus na Máquina',
        desc: 'Procedimento superficial e incompleto.',
        correct: false,
        burnReason: 'O processador derreteu travado com poeira enquanto os trojans roubavam os dados!'
      },
      {
        title: 'Dar um Choque de 220V com Fio Desencapado para Tentar Destravar Tudo',
        desc: 'Sobretensão corretiva destrutiva.',
        burnReason: 'O choque explodiu todos os componentes internos da máquina em labaredas!'
      }
    ];

    for (let i = diagnoses.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [diagnoses[i], diagnoses[j]] = [diagnoses[j], diagnoses[i]];
    }

    return {
      clientName: persona.name,
      device: device,
      urgency: '⚡ HÍBRIDO MESTRE',
      tagClass: 'tag-urgente hybrid-badge',
      hqTier: 4,
      coopPlayers: 1,
      quote: combinedQuote,
      mentorHint: \`⚠️ CHAMADO HÍBRIDO MESTRE de \${persona.name}! Exige 2 etapas completas: Fase 1 (Limpeza Física / Hardware) e Fase 2 (Software / Desinfecção)! Recompensa Épica (+R$ 3.800+ e +35% Reputação)!\`,
      minigameType: hwTheme.minigameType,
      requiredPart: hwTheme.requiredPart || 'dust_cleaner',
      isHybrid: true,
      hardwareType: hwTheme.minigameType,
      softwareType: swTheme.minigameType,
      questions: questions,
      tools: tools,
      diagnoses: diagnoses
    };
  }

  // Chamado Individual Padrão (1 dos 30 temas)
  const themeObj = CRAZY_PROBLEM_THEMES[Math.floor(Math.random() * CRAZY_PROBLEM_THEMES.length)];
  const variation = themeObj.variations[Math.floor(Math.random() * themeObj.variations.length)];

  const quote = variation.quote(persona, device);
  const questions = variation.questions.map(q => ({
    q: q.q,
    a: typeof q.a === 'function' ? q.a(persona, device) : q.a
  }));

  const diagnoses = [
    { title: variation.correct.title, desc: variation.correct.desc, correct: true },
    ...variation.wrongs.map(w => ({
      title: w.title,
      desc: w.desc,
      correct: false,
      burnReason: w.burnReason
    }))
  ];

  for (let i = diagnoses.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [diagnoses[i], diagnoses[j]] = [diagnoses[j], diagnoses[i]];
  }

  return {
    clientName: persona.name,
    device: device,
    urgency: themeObj.urgency,
    tagClass: themeObj.tagClass,
    hqTier: 1,
    coopPlayers: 1,
    quote: quote,
    mentorHint: \`Faça as 4 perguntas para \${persona.name}, execute os testes técnicos e escolha o diagnóstico correto para liberar a Etapa 4!\`,
    minigameType: themeObj.minigameType,
    requiredPart: themeObj.requiredPart,
    isHybrid: false,
    questions: questions,
    tools: variation.tools,
    diagnoses: diagnoses
  };
}

function createClientCase(idx, walkInFromDoor = false, forcedTemplate = null) {
  let tpl = forcedTemplate;
  if (!tpl) {
    if (state.networkMode === 'online' && isGroupPuzzlesUnlocked() && Math.random() < 0.28) {
      const coopPool = getUnlockedTemplates().filter(t => t.coopPlayers > 1);
      if (coopPool.length > 0) {
        tpl = coopPool[Math.floor(Math.random() * coopPool.length)];
      }
    }
  }
  if (!tpl) {
    tpl = generateRandomCrazyCaseTemplate();
  }

  const slotIdx = cases.filter(c => !c.leavingState).length;
  const waitPos = getWaitingSlotPosition(slotIdx);
  const map = currentMap();
  const numStr = String(nextClientIdCounter++).padStart(2, '0');

  const startX = walkInFromDoor ? (map.exitPos ? map.exitPos.x : 640) : waitPos.x;
  const startY = walkInFromDoor ? ((map.exitPos ? map.exitPos.y : 955) + (idx % 3) * 14) : waitPos.y;

  return {
    id: idx + 1,
    code: \`Chamado #\${numStr}\`,
    clientName: tpl.clientName || CLIENT_NAMES[idx % CLIENT_NAMES.length],
    urgency: tpl.urgency,
    tagClass: tpl.tagClass,
    coopPlayers: tpl.coopPlayers || 1,
    hqTier: tpl.hqTier || 1,
    device: tpl.device,
    quote: tpl.quote,
    mentorHint: tpl.mentorHint,
    minigameType: tpl.minigameType,
    requiredPart: tpl.requiredPart,
    isHybrid: !!tpl.isHybrid,
    hardwareType: tpl.hardwareType || null,
    softwareType: tpl.softwareType || null,
    diagnosisApproved: false,
    solved: false,
    minigameDone: false,
    inMyRoom: false,
    leavingState: null,
    isBurntReturn: false,
    burnReasonText: '',
    patience: 100,
    insultText: ANGRY_INSULTS[idx % ANGRY_INSULTS.length],
    impatientText: IMPATIENT_QUOTES[idx % IMPATIENT_QUOTES.length],
    x: startX,
    y: startY,
    waypoints: walkInFromDoor ? [{ x: waitPos.x, y: waitPos.y }] : [],
    radius: 14,
    mgState: {
      ...createInitialMinigameState(),
      isHybrid: !!tpl.isHybrid,
      hardwareType: tpl.hardwareType || null,
      softwareType: tpl.softwareType || null,
      hybridStage: 1,
      stage1Done: false,
      stage2Done: false
    },
    look: {
      skin: SKIN_COLORS[idx % SKIN_COLORS.length],
      hair: HAIR_COLORS[idx % HAIR_COLORS.length],
      shirt: PLAYER_COLORS[idx % PLAYER_COLORS.length],
      glasses: idx % 2 === 1,
      headset: idx % 4 === 0,
      mood: 'worried'
    },
    questions: tpl.questions.map(q => ({ ...q, asked: false })),
    tools: tpl.tools.map((t, tIdx) => ({ ...t, ran: state.upgrades.pro_bench && tIdx === 0 })),
    diagnoses: tpl.diagnoses.map(d => ({ ...d }))
  };
}
`;

// Replace Section 1 (Personas to getTargetQueueSize)
const idxPStart = gameContent.indexOf('const CRAZY_CLIENT_PERSONAS = [');
const idxQStart = gameContent.indexOf('function getTargetQueueSize() {');

if (idxPStart === -1 || idxQStart === -1) {
  console.error("Could not find section 1 boundaries!", idxPStart, idxQStart);
  process.exit(1);
}

gameContent = gameContent.slice(0, idxPStart) + proceduralBlock + '\n' + gameContent.slice(idxQStart);
console.log("Section 1 (Procedural Generator & Themes) replaced successfully!");

// Replace Section 2 (completeRepairAfterMinigame - hybrid reward)
const oldRepairTarget = `  let baseReward = (usedRack || usedBackpack) ? 1100 : 850;
  if (wasBurntReturn) baseReward += 600;
  if (c.coopPlayers === 2) baseReward = 1800;
  if (c.coopPlayers === 3) baseReward = 2400;
  if (c.coopPlayers === 4) baseReward = 3200;
  if (state.upgrades.ac_split) baseReward += 200;

  const repGain = (c.coopPlayers > 1 ? 20 : 12) + (state.upgrades.vip_sofa ? 5 : 0) + (wasBurntReturn ? 15 : 0);`;

const newRepairTarget = `  let baseReward = (usedRack || usedBackpack) ? 1100 : 850;
  if (wasBurntReturn) baseReward += 600;
  if (c.isHybrid) baseReward += 2800; // Mega Recompensa Híbrida (R$ 3.900 a R$ 5.000+)
  if (c.coopPlayers === 2) baseReward = 1800;
  if (c.coopPlayers === 3) baseReward = 2400;
  if (c.coopPlayers === 4) baseReward = 3200;
  if (state.upgrades.ac_split) baseReward += 200;

  let repGain = (c.coopPlayers > 1 ? 20 : 12) + (state.upgrades.vip_sofa ? 5 : 0) + (wasBurntReturn ? 15 : 0);
  if (c.isHybrid) repGain += 25; // +37% a +45% de Reputação!`;

if (gameContent.includes(oldRepairTarget)) {
  gameContent = gameContent.replace(oldRepairTarget, newRepairTarget);
  console.log("Section 2 (completeRepairAfterMinigame hybrid bonus) replaced successfully!");
} else {
  console.error("Could not find oldRepairTarget in game.js!");
  process.exit(1);
}

// Replace Section 3 (renderSpecificProblemMinigame to addChatMessage)
const idxMgStart = gameContent.indexOf('function renderSpecificProblemMinigame(');
const idxChatStart = gameContent.indexOf('function addChatMessage(');

if (idxMgStart === -1 || idxChatStart === -1) {
  console.error("Could not find section 3 boundaries!", idxMgStart, idxChatStart);
  process.exit(1);
}

gameContent = gameContent.slice(0, idxMgStart) + minigameRenderCode.trim() + '\n\n' + gameContent.slice(idxChatStart);
console.log("Section 3 (30 Minigames + Hybrid Engine) replaced successfully!");

fs.writeFileSync('game.js', gameContent);
console.log("Saved game.js! Total length:", gameContent.length);
