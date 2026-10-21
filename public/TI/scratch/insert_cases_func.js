const fs = require('fs');

let code = fs.readFileSync('game.js', 'utf8');

const target = 'function getTargetQueueSize() {';

const codeToInsert = `
function getWaitingSlotPosition(slotIdx) {
  const map = currentMap();
  if (map && map.waitingSlots && map.waitingSlots.length > 0) {
    const idx = Math.min(slotIdx, map.waitingSlots.length - 1);
    return map.waitingSlots[idx];
  }
  return { x: 500, y: 550 };
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

  const startX = walkInFromDoor ? (map && map.exitPos ? map.exitPos.x : 640) : waitPos.x;
  const startY = walkInFromDoor ? ((map && map.exitPos ? map.exitPos.y : 955) + (idx % 3) * 14) : waitPos.y;

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
    questions: (tpl.questions || []).map(q => ({ ...q, asked: false })),
    tools: (tpl.tools || []).map((t, tIdx) => ({ ...t, ran: state.workbenchLevel >= 2 && tIdx === 0 })),
    diagnoses: (tpl.diagnoses || []).map(d => ({ ...d }))
  };
}
`;

if (!code.includes('function createClientCase(')) {
  code = code.replace(target, codeToInsert + '\n' + target);
  console.log('getWaitingSlotPosition and createClientCase inserted!');
}

fs.writeFileSync('game.js', code, 'utf8');
console.log('game.js written successfully! Length:', code.length);
