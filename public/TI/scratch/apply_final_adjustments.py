import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('game.js', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Update AC in buildOfflineMap
old_ac_block = """  if (state.upgrades.ac_split) {
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

new_ac_block = """  const hasAcLvl1 = !!state.upgrades.ac_lvl1 || !!state.upgrades.ac_split;
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
  }"""

if old_ac_block in code:
    code = code.replace(old_ac_block, new_ac_block)
    print("1. Updated AC block in buildOfflineMap with 3 levels and positioning!")
else:
    print("1. Warning: old_ac_block not found directly!")

# 2. Update Central Rack position: move up to y: 310
old_rack_plaza = """    // 4. RACK CENTRAL DE INFRAESTRUTURA (Chão normal e limpo, sem barra escura atrás)
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
    }"""

new_rack_plaza = """    // 4. RACK CENTRAL DE INFRAESTRUTURA (Subido para permitir passagem livre para a parte de cima)
    {
      id: 'central_rack_plaza',
      name: '🗄️⚡ Rack Central & NOC',
      x: recX + 20, y: 305, w: recW - 40, h: 85,
      floorColor: '#ffffff', gridColor: '#ffffff', borderColor: '#38bdf8',
      hasWalls: false,
      furniture: [
        {
          type: 'central_rack',
          x: recX + recW / 2 - 105, y: 310, w: 210, h: 72,
          label: '🗄️⚡ RACK CENTRAL DE INFRAESTRUTURA [E]',
          color: '#0f172a',
          solid: true
        }
      ]
    }"""

if old_rack_plaza in code:
    code = code.replace(old_rack_plaza, new_rack_plaza)
    print("2. Moved Central Rack up to y=310!")
else:
    print("2. Warning: old_rack_plaza not found directly!")

# Update interactable and teleports for Central Rack
code = code.replace(
    "{ id: 'central_rack', x: recX + recW / 2, y: 420, radius: 155,",
    "{ id: 'central_rack', x: recX + recW / 2, y: 345, radius: 155,"
)
code = code.replace(
    "{ label: '🗄️ Rack Central', x: recX + recW / 2, y: 480 }",
    "{ label: '🗄️ Rack Central', x: recX + recW / 2, y: 415 }"
)

# Connectors from upper stations
code = code.replace("to: 'central_rack_plaza', x1: x02 + Math.floor(wStation / 2), y1: yUpper + hUpper, x2: recX + recW / 2, y2: 380",
                    "to: 'central_rack_plaza', x1: x02 + Math.floor(wStation / 2), y1: yUpper + hUpper, x2: recX + recW / 2, y2: 310")
code = code.replace("to: 'central_rack_plaza', x1: x03 + Math.floor(wStation / 2), y1: yUpper + hUpper, x2: recX + recW / 2, y2: 380",
                    "to: 'central_rack_plaza', x1: x03 + Math.floor(wStation / 2), y1: yUpper + hUpper, x2: recX + recW / 2, y2: 310")
code = code.replace("to: 'central_rack_plaza', x1: x04 + Math.floor(wStation / 2), y1: yUpper + hUpper, x2: recX + recW / 2, y2: 380",
                    "to: 'central_rack_plaza', x1: x04 + Math.floor(wStation / 2), y1: yUpper + hUpper, x2: recX + recW / 2, y2: 310")

# 3. Update client wandering in updateWorld
old_wander_code = """      // Clientes na sala de espera: confinados estritamente dentro da Recepção & Triagem Geral!
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

new_wander_code = """      // Clientes na sala de espera: andam livremente de um lado para o outro na área central!
      // Confinados estritamente na recepção: NUNCA entram na Cabine #01, NUNCA entram no Estoque e NUNCA chegam perto do Rack Central.
      if (!c.inMyRoom && !c.leavingState && !c.solved && !c.walkingToDesk && !c.isBurntReturn) {
        const map = currentMap();
        const rec = map?.rooms?.find(r => r.id === 'main_store');
        if (rec) {
          // Limites de segurança absolutos da recepção central
          const minX = rec.x + 34;
          const maxX = rec.x + rec.w - 34;
          const minY = 575; // Distância segura do Rack Central (que agora fica em y=310)
          const maxY = 920; // Distância segura da porta da rua
          c.x = Math.max(minX, Math.min(maxX, c.x));
          c.y = Math.max(minY, Math.min(maxY, c.y));

          if (typeof c.wanderTimer !== 'number') {
            c.wanderTimer = 25 + Math.floor(Math.random() * 65);
          }
          c.wanderTimer--;

          // Quando termina a caminhada, escolhe um novo ponto do outro lado da recepção
          if (c.wanderTimer <= 0 && (!c.waypoints || c.waypoints.length === 0)) {
            c.wanderTimer = 60 + Math.floor(Math.random() * 95); // Pausa breve e natural de 1 a 2.5 segundos
            const isLeft = c.x < (rec.x + rec.w / 2);
            let nextX;
            if (isLeft) {
              // Caminha da esquerda para o lado direito da recepção
              nextX = rec.x + rec.w * 0.52 + Math.random() * (rec.w * 0.38);
            } else {
              // Caminha da direita para o lado esquerdo da recepção
              nextX = rec.x + 36 + Math.random() * (rec.w * 0.38);
            }
            // Altura aleatória pelo salão central
            let nextY = 580 + Math.random() * 325;

            // Evita colidir com o sofá no canto inferior direito
            if (nextX > rec.x + rec.w - 105 && nextY > 770) {
              nextX = rec.x + rec.w - 120;
            }
            // Evita colidir com o balcão no canto superior direito
            if (nextX > rec.x + rec.w - 150 && nextY < 645) {
              nextY = 655;
            }

            c.waypoints = [{ x: Math.round(nextX), y: Math.round(nextY) }];
          }
        }
      }"""

if old_wander_code in code:
    code = code.replace(old_wander_code, new_wander_code)
    print("3. Updated client wandering to freely walk from one side to the other in reception!")
else:
    print("3. Warning: old_wander_code not found directly!")

# 4. Also check rewards/bonus for AC levels in handleDiagnosisStep3 or completeRepairAfterMinigame
code = code.replace("if (state.upgrades.ac_split) baseReward += 200;",
                    "if (state.upgrades.ac_lvl3) baseReward += 600;\n  else if (state.upgrades.ac_lvl2) baseReward += 350;\n  else if (state.upgrades.ac_lvl1 || state.upgrades.ac_split) baseReward += 150;")

# Save game.js
with open('game.js', 'w', encoding='utf-8') as f:
    f.write(code)

print("game.js successfully patched!")
