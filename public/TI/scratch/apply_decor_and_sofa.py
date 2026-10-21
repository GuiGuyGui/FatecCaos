import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

with open('game.js', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Update ASSET_IMAGES to add sofa_horizontal, decor_plant_tall, decor_plant_small, decor_recycle_bin
asset_search = "parts_racks_strip: typeof Image !== 'undefined' ? new Image() : null"
asset_replace = """parts_racks_strip: typeof Image !== 'undefined' ? new Image() : null,
  sofa_horizontal: typeof Image !== 'undefined' ? new Image() : null,
  decor_plant_tall: typeof Image !== 'undefined' ? new Image() : null,
  decor_plant_small: typeof Image !== 'undefined' ? new Image() : null,
  decor_recycle_bin: typeof Image !== 'undefined' ? new Image() : null"""

if "sofa_horizontal:" not in code:
    code = code.replace(asset_search, asset_replace)
    src_search = "ASSET_IMAGES.parts_racks_strip.src = 'assets/parts_racks_strip.png';"
    src_replace = """ASSET_IMAGES.parts_racks_strip.src = 'assets/parts_racks_strip.png';
  ASSET_IMAGES.sofa_horizontal.src = 'assets/sofa_horizontal.png';
  ASSET_IMAGES.decor_plant_tall.src = 'assets/decor_plant_tall.png';
  ASSET_IMAGES.decor_plant_small.src = 'assets/decor_plant_small.png';
  ASSET_IMAGES.decor_recycle_bin.src = 'assets/decor_recycle_bin.png';"""
    code = code.replace(src_search, src_replace)
    print("Added new asset images!")

# 2. Add bounding box crops for sofa_horizontal and decor items
decor_crops = """
// Bounding box do Sofá Horizontal (sala de trabalho do jogador - Imagem 2)
const SOFA_HORIZONTAL_CROP = { sx: 8, sy: 18, sw: 247, sh: 158 };

// Bounding boxes dos enfeites decorativos de parede (Imagens 3, 4 e 5)
const DECOR_PLANT_TALL_CROP  = { sx: 4, sy: 6, sw: 79, sh: 136 };
const DECOR_PLANT_SMALL_CROP = { sx: 5, sy: 11, sw: 61, sh: 100 };
const DECOR_BIN_CROP         = { sx: 1, sy: 14, sw: 71, sh: 106 };
"""
if "SOFA_HORIZONTAL_CROP" not in code:
    code = code.replace("const SOFA_CROP = { sx: 10, sy: 7, sw: 158, sh: 248 };",
                        "const SOFA_CROP = { sx: 10, sy: 7, sw: 158, sh: 248 };" + decor_crops)
    print("Added decor crops constants!")

# 3. Update generateSessionShelfVariants to also randomize decor selections
old_gen = """function generateSessionShelfVariants() {
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
}"""

new_gen = """function generateSessionShelfVariants() {
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
}"""
code = code.replace(old_gen, new_gen)
print("Updated sessionShelfVariants with decor selections!")

# 4. Add drawDecorGraphic and update drawWaitingSofaGraphic
draw_decor_func = """
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
"""

if "function drawDecorGraphic" not in code:
    code = code.replace("function drawWaitingSofaGraphic(ctx, f) {",
                        draw_decor_func + "\nfunction drawWaitingSofaGraphic(ctx, f) {")

# Update drawWaitingSofaGraphic to support both horizontal and vertical sofa
old_sofa_draw = """function drawWaitingSofaGraphic(ctx, f) {
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
}"""

new_sofa_draw = """function drawWaitingSofaGraphic(ctx, f) {
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
}"""
code = code.replace(old_sofa_draw, new_sofa_draw)
print("Updated sofa drawing for horizontal and vertical support!")

# 5. Update drawWorld to dispatch decor
if "if (f.type === 'decor')" not in code:
    code = code.replace(
        "if (f.type === 'stool') {\n          drawStoolGraphic(ctx, f);\n          return;\n        }",
        "if (f.type === 'stool') {\n          drawStoolGraphic(ctx, f);\n          return;\n        }\n\n        if (f.type === 'decor') {\n          drawDecorGraphic(ctx, f);\n          return;\n        }"
    )
    print("Added decor dispatcher in drawWorld!")

# 6. Update sofa in my_room (Tier 3+) to be horizontal
old_myroom_sofa = """    furnitureMyRoom.push({
      type: 'sofa',
      x: myRoomX + 235, y: 865, w: 85, h: 135,
      label: '🛋️ Sofá VIP Executivo',
      color: '#e5534b',
      solid: true
    });"""

new_myroom_sofa = """    furnitureMyRoom.push({
      type: 'sofa',
      orientation: 'horizontal',
      x: myRoomX + 195, y: 875, w: 145, h: 90,
      label: '🛋️ Sofá VIP Executivo',
      color: '#e5534b',
      solid: true
    });"""
code = code.replace(old_myroom_sofa, new_myroom_sofa)
print("Updated my_room sofa to horizontal orientation (Image 2)!")

# 7. Update waitingSlots to the 12 positions in the red area
old_waiting_slots = """// Posições dos clientes na Área Verde marcada pelo usuário no salão de espera da recepção:
  const waitingSlots = [
    { x: recX + 90,  y: 590 },
    { x: recX + 175, y: 640 },
    { x: recX + 105, y: 695 },
    { x: recX + 210, y: 740 },
    { x: recX + 95,  y: 790 },
    { x: recX + 170, y: 840 }
  ];"""

new_waiting_slots = """// Posições dos clientes na Área Vermelha demarcada pelo usuário (Imagem 1):
  const waitingSlots = [
    { x: recX + 60,  y: 575 },
    { x: recX + 140, y: 585 },
    { x: recX + 205, y: 655 },
    { x: recX + 110, y: 650 },
    { x: recX + 55,  y: 685 },
    { x: recX + 175, y: 720 },
    { x: recX + 80,  y: 760 },
    { x: recX + 150, y: 785 },
    { x: recX + 235, y: 795 },
    { x: recX + 65,  y: 840 },
    { x: recX + 140, y: 865 },
    { x: recX + 215, y: 890 }
  ];"""
code = code.replace(old_waiting_slots, new_waiting_slots)
print("Updated waitingSlots to 12 positions in the red area!")

# 8. Add decor items to rooms in buildOfflineMap
decor_injection = """
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
"""

if "ENFEITES DECORATIVOS NAS PAREDES" not in code:
    code = code.replace("  // Ala Superior dos outros 3 jogadores", decor_injection + "\n  // Ala Superior dos outros 3 jogadores")
    print("Injected wall decorations in buildOfflineMap!")

# 9. Add client wandering in updateWorld
wandering_code = """
      // Clientes na sala de espera passeiam naturalmente pela área vermelha demarcada pelo usuário (Imagem 1)
      if (!c.inMyRoom && !c.leavingState && !c.solved && !c.walkingToDesk && !c.isBurntReturn) {
        if (typeof c.wanderTimer !== 'number') {
          c.wanderTimer = 120 + Math.floor(Math.random() * 240);
        }
        c.wanderTimer--;
        if (c.wanderTimer <= 0 && (!c.waypoints || c.waypoints.length === 0)) {
          c.wanderTimer = 240 + Math.floor(Math.random() * 300); // Passeia a cada 4 a 9 segundos
          const map = currentMap();
          if (map && map.waitingSlots && map.waitingSlots.length > 0) {
            const nextSlot = map.waitingSlots[Math.floor(Math.random() * map.waitingSlots.length)];
            const targetX = Math.round(nextSlot.x + (Math.random() * 24 - 12));
            const targetY = Math.round(nextSlot.y + (Math.random() * 24 - 12));
            c.waypoints = buildDoorwayPath(c.x, c.y, targetX, targetY);
          }
        }
      }
"""

if "wanderTimer" not in code:
    code = code.replace("stepEntityWaypoints(c, c.leavingState ? 5.2 : 4.4);",
                        "stepEntityWaypoints(c, c.leavingState ? 5.2 : (c.inMyRoom ? 4.4 : 2.0));" + wandering_code)
    print("Added natural wandering in red waiting zone for clients!")

with open('game.js', 'w', encoding='utf-8') as f:
    f.write(code)

print("game.js successfully patched!")
