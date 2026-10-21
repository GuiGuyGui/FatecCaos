import re

with open('game.js', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Update buildOfflineMap():
# Remove central_rack_plaza from rooms
# Add corridorFurniture with 2 racks (left above Cabine #01, right above Estoque)
# Update interactables to have central_rack_1 and central_rack_2
# Remove white connector to central_rack_plaza

old_build_offline_snippet = """    // 4. RACK CENTRAL DE INFRAESTRUTURA (Subido para permitir passagem livre para a parte de cima)
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
    }
  ];"""

new_build_offline_snippet = """  ];

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
  ];"""

# Replace in code
code_norm = code.replace('\r\n', '\n')
old_build_offline_snippet_norm = old_build_offline_snippet.replace('\r\n', '\n')
new_build_offline_snippet_norm = new_build_offline_snippet.replace('\r\n', '\n')

if old_build_offline_snippet_norm in code_norm:
    code_norm = code_norm.replace(old_build_offline_snippet_norm, new_build_offline_snippet_norm, 1)
    print("1. Replaced central_rack_plaza room with 2 racks corridorFurniture successfully!")
else:
    print("Failed to find old_build_offline_snippet")

# 2. Update connectors & interactables in buildOfflineMap
old_interactables = """  const interactables = [
    { id: 'my_workbench', x: myRoomX + 35 + benchW / 2, y: 505 + benchH / 2, radius: 125, label: `🛠️ [E] Atender Cliente na Bancada (Nv. ${benchLvl})`, action: () => interactWithMyWorkbench() },
    { id: 'central_rack', x: recX + recW / 2, y: 345, radius: 155, label: '🗄️ [E] Rack Central de Infraestrutura (10 Puzzles)', action: () => openCentralRackModal() },
    { id: 'reception_counter', x: counterX + counterW / 2, y: counterY + counterH / 2, radius: 130, label: '🛎️ [E] Balcão de Recepção: Chamar Cliente', action: () => interactWithReceptionCounter() },"""

new_interactables = """  const interactables = [
    { id: 'my_workbench', x: myRoomX + 35 + benchW / 2, y: 505 + benchH / 2, radius: 125, label: `🛠️ [E] Atender Cliente na Bancada (Nv. ${benchLvl})`, action: () => interactWithMyWorkbench() },
    { id: 'central_rack_1', x: rackLeftX + rackW / 2, y: rackY + rackH / 2, radius: 145, label: '🗄️ [E] Rack de Infraestrutura #01 (10 Puzzles)', action: () => openCentralRackModal() },
    { id: 'central_rack_2', x: rackRightX + rackW / 2, y: rackY + rackH / 2, radius: 145, label: '🗄️ [E] Rack de Infraestrutura #02 (10 Puzzles)', action: () => openCentralRackModal() },
    { id: 'reception_counter', x: counterX + counterW / 2, y: counterY + counterH / 2, radius: 130, label: '🛎️ [E] Balcão de Recepção: Chamar Cliente', action: () => interactWithReceptionCounter() },"""

old_interactables_norm = old_interactables.replace('\r\n', '\n')
new_interactables_norm = new_interactables.replace('\r\n', '\n')

if old_interactables_norm in code_norm:
    code_norm = code_norm.replace(old_interactables_norm, new_interactables_norm, 1)
    print("2. Replaced interactables successfully!")
else:
    print("Failed to find old_interactables")

# 3. Add corridorFurniture to returned object of buildOfflineMap:
old_return = """    exitPos: { x: recX + recW / 2, y: 955 },
    rooms,
    connectors,
    waitingSlots,
    interactables,
    teleports"""

new_return = """    exitPos: { x: recX + recW / 2, y: 920 },
    rooms,
    corridorFurniture,
    connectors,
    waitingSlots,
    interactables,
    teleports"""

old_return_norm = old_return.replace('\r\n', '\n')
new_return_norm = new_return.replace('\r\n', '\n')

if old_return_norm in code_norm:
    code_norm = code_norm.replace(old_return_norm, new_return_norm, 1)
    print("3. Replaced buildOfflineMap return object successfully!")
else:
    print("Failed to find old_return")

# 4. In rebuildColliders(): add solidColliders for corridorFurniture
old_rebuild_colliders = """      if (r.furniture) {
        r.furniture.forEach(f => {
          if (f.solid) solidColliders.push({ x: f.x, y: f.y, w: f.w, h: f.h, isWall: false });
        });
      }
    });
  }
}"""

new_rebuild_colliders = """      if (r.furniture) {
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
}"""

old_rebuild_colliders_norm = old_rebuild_colliders.replace('\r\n', '\n')
new_rebuild_colliders_norm = new_rebuild_colliders.replace('\r\n', '\n')

if old_rebuild_colliders_norm in code_norm:
    code_norm = code_norm.replace(old_rebuild_colliders_norm, new_rebuild_colliders_norm, 1)
    print("4. Updated rebuildColliders successfully!")
else:
    print("Failed to find old_rebuild_colliders")

# 5. In drawWorld(): render corridorFurniture
old_draw_world_furniture = """      room.furniture.forEach(f => {
        if (f.type === 'central_rack') {
          drawCentralRackChassis(ctx, f);
          return;
        }"""

new_draw_world_furniture = """    if (map.corridorFurniture && map.corridorFurniture.length > 0) {
      map.corridorFurniture.forEach(f => {
        if (f.type === 'central_rack') {
          drawCentralRackChassis(ctx, f);
        }
      });
    }

    map.rooms.forEach(room => {
      // (room drawing)"""

# Instead of replacing room.furniture, let's inject drawing corridorFurniture right after map.rooms.forEach:
old_after_rooms = """      room.furniture.forEach(f => {
        if (f.type === 'central_rack') {
          drawCentralRackChassis(ctx, f);
          return;
        }

        if (f.type === 'workbench') {"""

new_after_rooms = """      room.furniture.forEach(f => {
        if (f.type === 'central_rack') {
          drawCentralRackChassis(ctx, f);
          return;
        }

        if (f.type === 'workbench') {"""

# Let's find where room.furniture loop finishes, or right before activeInteractable:
old_room_loop_end = """    activeInteractable = map.interactables.find(item =>
      Math.hypot(you.x - item.x, you.y - item.y) <= item.radius
    ) || null;"""

new_room_loop_end = """    if (map.corridorFurniture && map.corridorFurniture.length > 0) {
      map.corridorFurniture.forEach(f => {
        if (f.type === 'central_rack') {
          drawCentralRackChassis(ctx, f);
        }
      });
    }

    activeInteractable = map.interactables.find(item =>
      Math.hypot(you.x - item.x, you.y - item.y) <= item.radius
    ) || null;"""

old_room_loop_end_norm = old_room_loop_end.replace('\r\n', '\n')
new_room_loop_end_norm = new_room_loop_end.replace('\r\n', '\n')

if old_room_loop_end_norm in code_norm:
    code_norm = code_norm.replace(old_room_loop_end_norm, new_room_loop_end_norm, 1)
    print("5. Added corridorFurniture drawing in drawWorld successfully!")
else:
    print("Failed to find old_room_loop_end")

# 6. Update stepEntityWaypoints with anti-stuck watchdog
old_step_waypoints = """    if (dist <= speed + 2) {
      ent.waypoints.shift();
      ent.isMoving = ent.waypoints.length > 0;
    } else {
      const vx = (dx / dist) * speed;
      const vy = (dy / dist) * speed;
      const oldX = ent.x;
      const oldY = ent.y;
      moveWithWallSliding(ent, vx, vy);
      ent.isMoving = Math.hypot(ent.x - oldX, ent.y - oldY) > 0.3;
    }"""

new_step_waypoints = """    if (dist <= speed + 2) {
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
    }"""

old_step_waypoints_norm = old_step_waypoints.replace('\r\n', '\n')
new_step_waypoints_norm = new_step_waypoints.replace('\r\n', '\n')

if old_step_waypoints_norm in code_norm:
    code_norm = code_norm.replace(old_step_waypoints_norm, new_step_waypoints_norm, 1)
    print("6. Updated stepEntityWaypoints with anti-stuck watchdog successfully!")
else:
    print("Failed to find old_step_waypoints")

# 7. Update client wandering logic in updateWorld
old_wander_block = """      // Clientes na sala de espera: andam livremente de um lado para o outro na área central!
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

new_wander_block = """      // Clientes na sala de espera: andam livremente por toda a área central sem travar!
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
            c.wanderTimer = 15 + Math.floor(Math.random() * 50);
          }
          c.wanderTimer--;

          // Quando conclui o trajeto atual ou pausa, escolhe novo destino livre na área central
          if (c.wanderTimer <= 0 && (!c.waypoints || c.waypoints.length === 0)) {
            c.wanderTimer = 50 + Math.floor(Math.random() * 110); // Pausa de 1 a 2.5s
            let destX = minX + Math.random() * (maxX - minX);
            let destY = minY + Math.random() * (maxY - minY);

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
      }"""

old_wander_block_norm = old_wander_block.replace('\r\n', '\n')
new_wander_block_norm = new_wander_block.replace('\r\n', '\n')

if old_wander_block_norm in code_norm:
    code_norm = code_norm.replace(old_wander_block_norm, new_wander_block_norm, 1)
    print("7. Updated client wandering logic successfully!")
else:
    print("Failed to find old_wander_block")

# 8. Update isPlayerNearCentralRack() and openCentralRackModal() to support both racks
old_rack_check = """function isPlayerNearCentralRack() {
  const you = state.players[state.mySlotIndex];
  if (!you) return true;
  const map = currentMap();
  const rack = map.interactables?.find(i => i.id === 'central_rack');
  if (!rack) return true;
  const dist = Math.hypot(you.x - rack.x, you.y - rack.y);
  return dist <= (rack.radius + 35);
}"""

new_rack_check = """function isPlayerNearCentralRack() {
  const you = state.players[state.mySlotIndex];
  if (!you) return true;
  const map = currentMap();
  const rackItems = (map.interactables || []).filter(i => i.id.startsWith('central_rack'));
  if (rackItems.length === 0) return true;
  return rackItems.some(item => Math.hypot(you.x - item.x, you.y - item.y) <= (item.radius + 35));
}"""

old_rack_check_norm = old_rack_check.replace('\r\n', '\n')
new_rack_check_norm = new_rack_check.replace('\r\n', '\n')

if old_rack_check_norm in code_norm:
    code_norm = code_norm.replace(old_rack_check_norm, new_rack_check_norm, 1)
    print("8. Updated isPlayerNearCentralRack() successfully!")
else:
    print("Failed to find old_rack_check")

# 9. Update openCentralRackModal() to target closest of the 2 racks:
old_open_rack = """  if (!forceBypass && !isPlayerNearCentralRack()) {
    const you = state.players[state.mySlotIndex];
    const map = currentMap();
    const rackItem = map.interactables?.find(i => i.id === 'central_rack');
    const targetX = rackItem ? rackItem.x : 770;
    const targetY = rackItem ? (rackItem.y + 75) : 385;

    you.waypoints = buildDoorwayPath(you.x, you.y, targetX, targetY);
    you.bubble = '🏃 Indo até o Rack Central!';
    you.bubbleTimer = 180;
    showToast('⚠️ Você precisa ir até o Rack Central para acessar os comandos e resolver os incidentes!');
    return;
  }"""

new_open_rack = """  if (!forceBypass && !isPlayerNearCentralRack()) {
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
  }"""

old_open_rack_norm = old_open_rack.replace('\r\n', '\n')
new_open_rack_norm = new_open_rack.replace('\r\n', '\n')

if old_open_rack_norm in code_norm:
    code_norm = code_norm.replace(old_open_rack_norm, new_open_rack_norm, 1)
    print("9. Updated openCentralRackModal pathfinding to closest rack successfully!")
else:
    print("Failed to find old_open_rack")

# 10. Update btn-goto-central-rack click handler:
old_goto_rack = """  document.getElementById('btn-goto-central-rack')?.addEventListener('click', () => {
    const you = state.players[state.mySlotIndex];
    const map = currentMap();
    const rackItem = map.interactables?.find(i => i.id === 'central_rack');
    const targetX = rackItem ? rackItem.x : 770;
    const targetY = rackItem ? (rackItem.y + 75) : 385;

    you.waypoints = buildDoorwayPath(you.x, you.y, targetX, targetY);
    you.bubble = '🏃 Correndo para o Rack Central resolver a pane!';
    you.bubbleTimer = 180;
    showToast('🏃 Caminhando até o Rack Central! Ao chegar perto, pressione [E] no rack para abrir os controles.');
  });"""

new_goto_rack = """  document.getElementById('btn-goto-central-rack')?.addEventListener('click', () => {
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
  });"""

old_goto_rack_norm = old_goto_rack.replace('\r\n', '\n')
new_goto_rack_norm = new_goto_rack.replace('\r\n', '\n')

if old_goto_rack_norm in code_norm:
    code_norm = code_norm.replace(old_goto_rack_norm, new_goto_rack_norm, 1)
    print("10. Updated btn-goto-central-rack to pathfind to closest rack successfully!")
else:
    print("Failed to find old_goto_rack")

# 11. Update createClientCase to spawn clients with varied positions inside central area
old_create_case_spawn = """  const startX = walkInFromDoor ? (map && map.exitPos ? map.exitPos.x : 640) : waitPos.x;
  const startY = walkInFromDoor ? ((map && map.exitPos ? map.exitPos.y : 955) + (idx % 3) * 14) : waitPos.y;"""

new_create_case_spawn = """  const startX = waitPos.x;
  const startY = waitPos.y;"""

old_create_case_spawn_norm = old_create_case_spawn.replace('\r\n', '\n')
new_create_case_spawn_norm = new_create_case_spawn.replace('\r\n', '\n')

if old_create_case_spawn_norm in code_norm:
    code_norm = code_norm.replace(old_create_case_spawn_norm, new_create_case_spawn_norm, 1)
    print("11. Updated client spawn position to use waitPos directly successfully!")
else:
    print("Failed to find old_create_case_spawn")

# 12. Update waitingSlots to spread naturally across the full height of central lobby
old_waiting_slots = """  const waitingSlots = [
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

new_waiting_slots = """  const waitingSlots = [
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
  ];"""

old_waiting_slots_norm = old_waiting_slots.replace('\r\n', '\n')
new_waiting_slots_norm = new_waiting_slots.replace('\r\n', '\n')

if old_waiting_slots_norm in code_norm:
    code_norm = code_norm.replace(old_waiting_slots_norm, new_waiting_slots_norm, 1)
    print("12. Updated waitingSlots across full height of central lobby successfully!")
else:
    print("Failed to find old_waiting_slots")

with open('game.js', 'w', encoding='utf-8') as f:
    f.write(code_norm)

print("ALL REPLACEMENTS APPLIED TO game.js!")
