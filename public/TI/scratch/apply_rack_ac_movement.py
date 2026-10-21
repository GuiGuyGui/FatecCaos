import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

with open('game.js', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Update SHOP_CATALOG to have 3 AC levels
old_ac_item = """  {
    id: 'ac_split',
    name: '❄️ Ar-Condicionado Split 24.000 BTUs',
    price: 1300,
    icon: '❄️',
    desc: 'Climatiza sua Cabine #01: todos os clientes pagam +R$ 200 de gorjeta extra pelo conforto térmico!',
    category: 'furniture'
  },"""

new_ac_items = """  {
    id: 'ac_lvl1',
    name: '❄️ Ar-Condicionado Split 12k Branco (Nv. 1)',
    price: 900,
    icon: '❄️',
    desc: 'Instala o Split Branco mais para a direita na sua Cabine: clientes pagam +R$ 150 de gorjeta e paciência drena 15% mais devagar!',
    category: 'furniture'
  },
  {
    id: 'ac_lvl2',
    name: '❄️ Ar-Condicionado Split 24k Black Glass (Nv. 2)',
    price: 1800,
    icon: '❄️✨',
    desc: 'Atualiza o Split da direita para o modelo Black Glass de alta eficiência: clientes pagam +R$ 350 e paciência drena 30% mais devagar!',
    category: 'furniture'
  },
  {
    id: 'ac_lvl3',
    name: '❄️ Ar-Condicionado Torre Coluna Datacenter (Nv. 3)',
    price: 2800,
    icon: '❄️🏢',
    desc: 'Instala o poderoso Ar Torre de chão ao lado da sua bancada de trabalho: clientes pagam +R$ 600 de bônus e sua velocidade aumenta em +15%!',
    category: 'furniture'
  },"""

if "id: 'ac_split'" in code:
    code = code.replace(old_ac_item, new_ac_items)
    print("Replaced ac_split with ac_lvl1, ac_lvl2, ac_lvl3 in SHOP_CATALOG!")

# 2. Update renderShopModal logic for AC levels
old_shop_render_check = "    } else if (item.id === 'rack_lvl1') {"
new_shop_render_check = """    } else if (item.id === 'ac_lvl1') {
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
    } else if (item.id === 'rack_lvl1') {"

if "item.id === 'ac_lvl1'" not in code:
    code = code.replace(old_shop_render_check, new_shop_render_check)
    print("Added AC levels lock/ownership check in renderShopModal!")

# 3. Update buyShopItem for AC levels
old_buy_checks = "  if (item.id === 'rack_lvl1' && state.upgrades.rack_lvl1) {"
new_buy_checks = \"\"\"  if (item.id === 'ac_lvl1' && (state.upgrades.ac_lvl1 || state.upgrades.ac_split)) {
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
  if (item.id === 'rack_lvl1' && state.upgrades.rack_lvl1) {"""

if "item.id === 'ac_lvl1' &&" not in code:
    code = code.replace(old_buy_checks, new_buy_checks)

old_buy_apply = "  } else if (item.id === 'rack_lvl1') {"
new_buy_apply = """  } else if (item.id === 'ac_lvl1') {
    state.upgrades.ac_lvl1 = true;
    state.upgrades.ac_split = true;
    refreshMapsWithUpgrades();
    rebuildColliders();
    showToast('❄️ Ar-Condicionado Nv. 1 (Split Branco) instalado à direita!');
  } else if (item.id === 'ac_lvl2') {
    state.upgrades.ac_lvl2 = true;
    state.upgrades.ac_split = true;
    refreshMapsWithUpgrades();
    rebuildColliders();
    showToast('❄️ Ar-Condicionado Nv. 2 (Split Black Glass) atualizado à direita!');
  } else if (item.id === 'ac_lvl3') {
    state.upgrades.ac_lvl3 = true;
    state.upgrades.ac_split = true;
    refreshMapsWithUpgrades();
    rebuildColliders();
    showToast('❄️ Ar-Condicionado Nv. 3 (Torre de Chão) instalado ao lado da sua bancada!');
  } else if (item.id === 'rack_lvl1') {"

if "item.id === 'ac_lvl1') {" not in code:
    code = code.replace(old_buy_apply, new_buy_apply)
    print("Added AC buy handlers in buyShopItem!")

# 4. Update AC placement in buildOfflineMap:
# Nível 1: Split Branco mais para a direita
# Nível 2: Split Black Glass mais para a direita
# Nível 3: Torre de chão ao lado da bancada de trabalho
old_ac_build = """  if (state.upgrades.ac_split) {
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

new_ac_build = """  const hasAcLvl1 = !!state.upgrades.ac_lvl1 || !!state.upgrades.ac_split;
  const hasAcLvl2 = !!state.upgrades.ac_lvl2;
  const hasAcLvl3 = !!state.upgrades.ac_lvl3;

  // Nível 1 e Nível 2: Ar-condicionado Split de parede mais para a direita (x = myRoomX + myRoomW - 135)
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

  // Nível 3: Ar-condicionado Torre Coluna de chão fica ao lado da nossa bancada de trabalho
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
code = code.replace(old_ac_build, new_ac_build)
print("Updated AC levels placement in buildOfflineMap!")

# 5. Move Central Rack upwards so player can pass above and below without bumping into anything
# Move from y: 385 to y: 315
old_rack_room = """    // 4. RACK CENTRAL DE INFRAESTRUTURA (Chão normal e limpo, sem barra escura atrás)
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

new_rack_room = """    // 4. RACK CENTRAL DE INFRAESTRUTURA (Subido para permitir passagem livre para a parte superior)
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
code = code.replace(old_rack_room, new_rack_room)

# Also update interactable position for central_rack
code = code.replace(
    "{ id: 'central_rack', x: recX + recW / 2, y: 420, radius: 155,",
    "{ id: 'central_rack', x: recX + recW / 2, y: 345, radius: 155,"
)

# Also update connectors for upper stations to central rack plaza
code = code.replace("to: 'central_rack_plaza', x1: x02 + Math.floor(wStation / 2), y1: yUpper + hUpper, x2: recX + recW / 2, y2: 380",
                    "to: 'central_rack_plaza', x1: x02 + Math.floor(wStation / 2), y1: yUpper + hUpper, x2: recX + recW / 2, y2: 310")
code = code.replace("to: 'central_rack_plaza', x1: x03 + Math.floor(wStation / 2), y1: yUpper + hUpper, x2: recX + recW / 2, y2: 380",
                    "to: 'central_rack_plaza', x1: x03 + Math.floor(wStation / 2), y1: yUpper + hUpper, x2: recX + recW / 2, y2: 310")
code = code.replace("to: 'central_rack_plaza', x1: x04 + Math.floor(wStation / 2), y1: yUpper + hUpper, x2: recX + recW / 2, y2: 380",
                    "to: 'central_rack_plaza', x1: x04 + Math.floor(wStation / 2), y1: yUpper + hUpper, x2: recX + recW / 2, y2: 310")
print("Moved Central Rack up to y=310 with generous clearance above and below!")

# 6. Make waiting clients walk freely from one side to the other across the central area
old_wander_logic = """      // Clientes na sala de espera: confinados estritamente dentro da Recepção & Triagem Geral!
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

new_wander_logic = """      // Clientes na sala de espera: andam livremente de um lado para o outro na área central!
      // Confinados estritamente na recepção: NUNCA entram na Cabine #01, NUNCA entram no Estoque e NUNCA chegam perto do Rack Central.
      if (!c.inMyRoom && !c.leavingState && !c.solved && !c.walkingToDesk && !c.isBurntReturn) {
        const map = currentMap();
        const rec = map?.rooms?.find(r => r.id === 'main_store');
        if (rec) {
          // Limites de segurança absolutos da recepção central
          const minX = rec.x + 32;
          const maxX = rec.x + rec.w - 32;
          const minY = 572; // Seguro e afastado do Rack Central (que agora está em y=310)
          const maxY = 920; // Seguro e afastado da porta da rua
          c.x = Math.max(minX, Math.min(maxX, c.x));
          c.y = Math.max(minY, Math.min(maxY, c.y));

          if (typeof c.wanderTimer !== 'number') {
            c.wanderTimer = 30 + Math.floor(Math.random() * 80);
          }
          c.wanderTimer--;

          // Quando termina a caminhada atual, escolhe um novo ponto do outro lado da recepção
          if (c.wanderTimer <= 0 && (!c.waypoints || c.waypoints.length === 0)) {
            c.wanderTimer = 75 + Math.floor(Math.random() * 120); // Pausa breve de 1.5 a 3.5 segundos
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
code = code.replace(old_wander_logic, new_wander_logic)
print("Updated client wandering to freely walk from one side to the other in reception!")

with open('game.js', 'w', encoding='utf-8') as f:
    f.write(code)

print("game.js successfully patched!")
