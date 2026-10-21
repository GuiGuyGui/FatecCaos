import sys
import json
import re

sys.stdout.reconfigure(encoding='utf-8')

# Read all 30 themes from all_30_themes.json
with open('scratch/all_30_themes.json', 'r', encoding='utf-8') as f:
    themes_data = json.load(f)

print(f"Loaded {len(themes_data)} themes from all_30_themes.json")

with open('game.js', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Add AC images to ASSET_IMAGES
if 'ac_white_split:' not in code:
    asset_search = "decor_recycle_bin: typeof Image !== 'undefined' ? new Image() : null"
    asset_replace = """decor_recycle_bin: typeof Image !== 'undefined' ? new Image() : null,
  ac_white_split: typeof Image !== 'undefined' ? new Image() : null,
  ac_black_split: typeof Image !== 'undefined' ? new Image() : null,
  ac_tower_floor: typeof Image !== 'undefined' ? new Image() : null"""
    code = code.replace(asset_search, asset_replace)

    src_search = "ASSET_IMAGES.decor_recycle_bin.src = 'assets/decor_recycle_bin.png';"
    src_replace = """ASSET_IMAGES.decor_recycle_bin.src = 'assets/decor_recycle_bin.png';
  ASSET_IMAGES.ac_white_split.src = 'assets/ac_white_split.png';
  ASSET_IMAGES.ac_black_split.src = 'assets/ac_black_split.png';
  ASSET_IMAGES.ac_tower_floor.src = 'assets/ac_tower_floor.png';"""
    code = code.replace(src_search, src_replace)
    print("Added AC image assets to ASSET_IMAGES!")

# 2. Add AC crop constants
ac_crops = """
// Bounding boxes dos 3 modelos de Ar-Condicionado
const AC_WHITE_CROP = { sx: 8, sy: 6, sw: 269, sh: 101 };
const AC_BLACK_CROP = { sx: 6, sy: 8, sw: 338, sh: 116 };
const AC_TOWER_CROP = { sx: 5, sy: 14, sw: 109, sh: 253 };
"""
if 'AC_WHITE_CROP' not in code:
    code = code.replace("const DECOR_BIN_CROP         = { sx: 1, sy: 14, sw: 71, sh: 106 };",
                        "const DECOR_BIN_CROP         = { sx: 1, sy: 14, sw: 71, sh: 106 };" + ac_crops)
    print("Added AC crop constants!")

# 3. Add drawAirConditionerGraphic
ac_draw_func = """
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
"""

if 'function drawAirConditionerGraphic' not in code:
    code = code.replace("function drawDecorGraphic(ctx, f) {",
                        ac_draw_func + "\nfunction drawDecorGraphic(ctx, f) {")
    print("Added drawAirConditionerGraphic!")

# 4. Dispatch ac in drawWorld
if "if (f.type === 'ac')" not in code:
    code = code.replace(
        "if (f.type === 'decor') {\n          drawDecorGraphic(ctx, f);\n          return;\n        }",
        "if (f.type === 'decor') {\n          drawDecorGraphic(ctx, f);\n          return;\n        }\n\n        if (f.type === 'ac') {\n          drawAirConditionerGraphic(ctx, f);\n          return;\n        }"
    )
    print("Added ac dispatcher in drawWorld!")

# 5. Update buildOfflineMap AC placement:
# Split on wall (exact same size: w=110, h=32)
# AND Tower model beside our workbench (w=28, h=68)
old_ac_build = """  if (state.upgrades.ac_split) {
    furnitureMyRoom.push({
      type: 'ac',
      x: myRoomX + 105, y: 468, w: 110, h: 24,
      label: '❄️ Split 24k',
      color: '#0284c7',
      solid: false
    });
  }"""

new_ac_build = """  if (state.upgrades.ac_split) {
    // 1 e 2: Ar Split de Parede (Branco ou Black Glass - mesmo tamanho do atual: w=110, h=32)
    const splitModel = (state.upgrades.ac_split_black ? 'black' : 'white');
    furnitureMyRoom.push({
      type: 'ac',
      acModel: splitModel,
      x: myRoomX + 105, y: 468, w: 110, h: 32,
      label: splitModel === 'black' ? '❄️ Split Black 24k' : '❄️ Split 12k Branco',
      color: '#0284c7',
      solid: false
    });

    // 3: O terceiro modelo (Ar Torre Coluna) fica no chão DO LADO DA NOSSA BANCADA DE TRABALHO:
    furnitureMyRoom.push({
      type: 'ac',
      acModel: 'tower',
      x: myRoomX + 8, y: 520, w: 26, h: 68,
      label: '❄️ Ar Torre [E]',
      color: '#1e293b',
      solid: true
    });
  }"""
code = code.replace(old_ac_build, new_ac_build)
print("Updated AC placement in buildOfflineMap!")

# 6. Insert SOLO_THEMES_CATALOG and generateRandomCrazyCaseTemplate
catalog_json_str = json.dumps(themes_data, ensure_ascii=False)
themes_catalog_code = f"""
// ============================================================================
// CATÁLOGO DOS 30 TEMAS (15 HARDWARE + 15 SOFTWARE) COM PERGUNTAS, TESTES E DIAGNÓSTICOS
// ============================================================================
const SOLO_THEMES_CATALOG = {catalog_json_str};

function generateRandomCrazyCaseTemplate() {{
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

  const quote = (v.quote || 'Preciso de conserto urgente!').replace(/\\$\\{{d\\}}/g, device);

  const diagList = [
    {{ title: v.correct.title, desc: v.correct.desc, correct: true, burnReason: '' }},
    ...v.wrongs.map(w => ({{ title: w.title, desc: w.desc, correct: false, burnReason: w.burnReason || 'Procedimento incorreto!' }}))
  ].sort(() => Math.random() - 0.5);

  return {{
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
    questions: (v.questions || []).map(q => ({{ q: q.q, a: q.a, asked: false }})),
    tools: (v.tools || []).map(t => ({{ name: t.name, result: t.result, ran: false }})),
    diagnoses: diagList
  }};
}}
"""

if 'const SOLO_THEMES_CATALOG =' not in code:
    code = code.replace("function createClientCase(idx, walkInFromDoor = false, forcedTemplate = null) {",
                        themes_catalog_code + "\nfunction createClientCase(idx, walkInFromDoor = false, forcedTemplate = null) {")
    print("Injected SOLO_THEMES_CATALOG and generateRandomCrazyCaseTemplate!")

# 7. Auto-populate cases if questions/tools/diagnoses are empty in renderWorkbenchModal
auto_pop = """  const c = cases[state.activeCaseIndex];
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
  }"""

code = code.replace("""  const c = cases[state.activeCaseIndex];
  if (!c) return;
  if (!c.mgState) c.mgState = createInitialMinigameState();""", auto_pop)
print("Added auto-populate for empty workbench cases!")

# 8. Restrict waiting clients movement strictly to Reception:
# - No going into Cabine #01 (x < recX + 28)
# - No going into Estoque (x > recX + recW - 28)
# - No approaching Central Rack (y < 565)
# - No going out street door until leaving (y > 930)
# - Direct linear wandering waypoints only within reception
old_wander_block = """      // Clientes na sala de espera passeiam naturalmente pela área vermelha demarcada pelo usuário (Imagem 1)
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
      }"""

new_wander_block = """      // Clientes na sala de espera: confinados estritamente dentro da Recepção & Triagem Geral!
      // NUNCA entram na Cabine #01 nem no Estoque, e NUNCA chegam perto do Rack Central (y >= 565).
      if (!c.inMyRoom && !c.leavingState && !c.solved && !c.walkingToDesk && !c.isBurntReturn) {
        const map = currentMap();
        const rec = map?.rooms?.find(r => r.id === 'main_store');
        if (rec) {
          // Confinamento físico absoluto dentro da Recepção
          const minX = rec.x + 30;
          const maxX = rec.x + rec.w - 30;
          const minY = 568; // Distância segura do Rack Central (que fica em y <= 460)
          const maxY = 925; // Distância segura da porta da rua até ser hora de sair
          c.x = Math.max(minX, Math.min(maxX, c.x));
          c.y = Math.max(minY, Math.min(maxY, c.y));
        }

        if (typeof c.wanderTimer !== 'number') {
          c.wanderTimer = 120 + Math.floor(Math.random() * 240);
        }
        c.wanderTimer--;
        if (c.wanderTimer <= 0 && (!c.waypoints || c.waypoints.length === 0)) {
          c.wanderTimer = 240 + Math.floor(Math.random() * 300); // Passeia a cada 4 a 9 segundos
          if (map && map.waitingSlots && map.waitingSlots.length > 0) {
            const nextSlot = map.waitingSlots[Math.floor(Math.random() * map.waitingSlots.length)];
            const targetX = Math.round(nextSlot.x + (Math.random() * 20 - 10));
            const targetY = Math.round(nextSlot.y + (Math.random() * 20 - 10));
            // Movimento direto dentro da recepção, sem usar portas de salas!
            c.waypoints = [{ x: targetX, y: targetY }];
          }
        }
      }"""

code = code.replace(old_wander_block, new_wander_block)
print("Updated client wandering with strict reception confinement!")

# Write patched file
with open('game.js', 'w', encoding='utf-8') as f:
    f.write(code)

print("game.js successfully patched with all features and fixes!")
