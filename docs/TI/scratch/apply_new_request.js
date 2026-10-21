const fs = require('fs');

let code = fs.readFileSync('game.js', 'utf8');

// 1. Add parts_racks_strip to ASSET_IMAGES
if (!code.includes('parts_racks_strip:')) {
  code = code.replace(
    'server_racks_strip: typeof Image !== \'undefined\' ? new Image() : null',
    'server_racks_strip: typeof Image !== \'undefined\' ? new Image() : null,\n  parts_racks_strip: typeof Image !== \'undefined\' ? new Image() : null'
  );
  code = code.replace(
    'ASSET_IMAGES.server_racks_strip.src = \'assets/server_racks_strip.png\';',
    'ASSET_IMAGES.server_racks_strip.src = \'assets/server_racks_strip.png\';\n  ASSET_IMAGES.parts_racks_strip.src = \'assets/parts_racks_strip.png\';'
  );
}

// 2. Add PARTS_RACK_SPANS
if (!code.includes('const PARTS_RACK_SPANS =')) {
  const partsSpansCode = `
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
`;
  code = code.replace(
    'const RECEPTION_COUNTER_CROP = { sx: 8, sy: 43, sw: 272, sh: 124 };',
    'const RECEPTION_COUNTER_CROP = { sx: 8, sy: 43, sw: 272, sh: 124 };\n' + partsSpansCode
  );
}

// 3. Update generateSessionShelfVariants()
const oldGenRegex = /function generateSessionShelfVariants\(\) \{[\s\S]*?state\.sessionShelfVariants = \{[\s\S]*?\};\s*\}/;
const newGenCode = `function generateSessionShelfVariants() {
  const serverRackCount = (Math.random() < 0.5) ? 3 : 4;
  const shuffledServer = [0, 1, 2, 3, 4, 5, 6, 7].sort(() => Math.random() - 0.5);
  const shuffledParts = [0, 1, 2, 3, 4, 5, 6].sort(() => Math.random() - 0.5);

  state.sessionShelfVariants = {
    sm: [0, 1, 2, 3, 4, 5].sort(() => Math.random() - 0.5),
    lg: [0, 1, 2, 3, 4, 5, 6].sort(() => Math.random() - 0.5),
    serverRacks: shuffledServer.slice(0, serverRackCount),
    partsRacks: [shuffledParts[0], shuffledParts[1]],
    rackA: shuffledServer[0],
    rackB: shuffledServer[1],
    mainStool: Math.floor(Math.random() * 3),
    stationStools: [Math.floor(Math.random() * 3), Math.floor(Math.random() * 3), Math.floor(Math.random() * 3)]
  };
}`;
code = code.replace(oldGenRegex, newGenCode);

// 4. Update createClientCase to set waypoints when walking in from door
code = code.replace(
  `    walkingToDesk: false,
    arrivedAtDesk: false,`,
  `    waypoints: walkInFromDoor ? buildDoorwayPath(startX, startY, waitPos.x, waitPos.y) : [],
    walkingToDesk: false,
    arrivedAtDesk: false,`
);

// 5. Add drawPartsRackGraphic
if (!code.includes('function drawPartsRackGraphic')) {
  const partsRackDrawCode = `
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
  const badgeText = \`📦 \${state.rackParts}/\${state.rackCapacity}\`;
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
`;
  code = code.replace(
    'function drawCentralRackChassis(ctx, f) {',
    partsRackDrawCode + '\nfunction drawCentralRackChassis(ctx, f) {'
  );
}

// 6. Update drawCentralRackChassis to render 3 to 4 cabinets
const oldRackChassisRegex = /function drawCentralRackChassis\(ctx, f\) \{[\s\S]*?cabinets\.forEach\(\(cab, cIdx\) => \{[\s\S]*?\}\);\s*\}/;
const newRackChassisCode = `function drawCentralRackChassis(ctx, f) {
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
      ctx.fillStyle = incident ? \`rgba(239, 68, 68, \${pwrGlow})\` : \`rgba(56, 189, 248, \${pwrGlow})\`;
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
}`;
code = code.replace(oldRackChassisRegex, newRackChassisCode);

// 7. Update drawWorld to dispatch f.type === 'rack' to drawPartsRackGraphic
if (!code.includes("if (f.type === 'rack')")) {
  code = code.replace(
    "if (f.type === 'stool') {\n          drawStoolGraphic(ctx, f);\n          return;\n        }",
    "if (f.type === 'stool') {\n          drawStoolGraphic(ctx, f);\n          return;\n        }\n\n        if (f.type === 'rack') {\n          drawPartsRackGraphic(ctx, f);\n          return;\n        }"
  );
}

// 8. Update buildOfflineMap:
// - Blue dot stool pos: x = myRoomX + myRoomW - 85, y = 620
// - Purple arrows shelves: pushed to right wall (x = myRoomX + myRoomW - 163, x = myRoomX + myRoomW - 85)
// - Parts rack: 1 rack when rack_lvl1, 2nd rack below when rack_lvl2
// - Waiting slots in green area

// First replace stool position in buildOfflineMap
code = code.replace(
  `  // Posição da banqueta do cliente (substitui o quadrado amarelo, cor aleatória entre os 3 modelos)
  const stoolX = myRoomX + benchW + 30;
  const stoolY = 535;`,
  `  // Posição da banqueta do cliente (local exato marcado com a bola azul pelo usuário, perto da porta)
  const stoolX = myRoomX + myRoomW - 85;
  const stoolY = 620;`
);

// Second replace shelves in Cabine 01
const oldShelvesRegex = /if \(soloTier >= 2\) \{\s*furnitureMyRoom\.push\(\{\s*type: 'shelf'[\s\S]*?label: '🧰 Suprimentos'[\s\S]*?\}\);\s*\}/;
const newShelvesCode = `if (soloTier >= 2) {
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
  }`;
code = code.replace(oldShelvesRegex, newShelvesCode);

// Third replace rack in Cabine 01 with the 3rd image parts racks (and 2nd below if mega rack)
const oldRackRoomRegex = /if \(state\.rackCapacity > 0\) \{\s*furnitureMyRoom\.push\(\{\s*type: 'rack'[\s\S]*?solid: true\s*\}\);\s*\}/;
const newRackRoomCode = `if (state.rackCapacity > 0 || state.upgrades.rack_lvl1) {
    const pVars = state.sessionShelfVariants?.partsRacks || [0, 1];
    // Rack de Peças principal (escolha aleatória entre as estantes da 3ª imagem)
    furnitureMyRoom.push({
      type: 'rack',
      partsVariant: pVars[0],
      x: myRoomX + 25, y: 635, w: 82, h: 86,
      label: \`🗄️ Rack de Peças (\${state.rackParts}/\${state.rackCapacity})\`,
      color: '#4f46e5',
      solid: true
    });

    // Quando aumentamos para o Mega Rack, coloca um segundo rack diretamente abaixo dele!
    if (state.upgrades.rack_lvl2) {
      furnitureMyRoom.push({
        type: 'rack',
        partsVariant: pVars[1],
        x: myRoomX + 25, y: 730, w: 82, h: 86,
        label: \`🗄️ Mega Rack Duplo (\${state.rackParts}/\${state.rackCapacity})\`,
        color: '#4338ca',
        solid: true
      });
    }
  }`;
code = code.replace(oldRackRoomRegex, newRackRoomCode);

// Fourth replace waitingSlots with the green area positions
const oldSlotsRegex = /const waitingSlots = \[\s*\{ x: recX \+ 130, y: 580 \}[\s\S]*?\{ x: recX \+ 90,  y: 850 \}\s*\];/;
const newSlotsCode = `// Posições dos clientes na Área Verde marcada pelo usuário no salão de espera da recepção:
  const waitingSlots = [
    { x: recX + 90,  y: 590 },
    { x: recX + 175, y: 640 },
    { x: recX + 105, y: 695 },
    { x: recX + 210, y: 740 },
    { x: recX + 95,  y: 790 },
    { x: recX + 170, y: 840 }
  ];`;
code = code.replace(oldSlotsRegex, newSlotsCode);

fs.writeFileSync('game.js', code, 'utf8');
console.log('Successfully updated game.js with all requested features!');
