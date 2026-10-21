with open('game.js', 'r', encoding='utf-8') as f:
    code = f.read()

code_norm = code.replace('\r\n', '\n')

# 1. Remove the misplaced corridorFurniture call from updateWorld()
misplaced_in_update = """    if (map.corridorFurniture && map.corridorFurniture.length > 0) {
      map.corridorFurniture.forEach(f => {
        if (f.type === 'central_rack') {
          drawCentralRackChassis(ctx, f);
        }
      });
    }

    activeInteractable = map.interactables.find(item =>"""

fix_in_update = """    activeInteractable = map.interactables.find(item =>"""

if misplaced_in_update in code_norm:
    code_norm = code_norm.replace(misplaced_in_update, fix_in_update, 1)
    print("1. Removed misplaced corridorFurniture call from updateWorld()!")
else:
    print("Warning: misplaced_in_update not found")

# 2. Add corridorFurniture drawing into drawWorld() right after map.rooms.forEach
target_in_draw_world = """        ctx.fillText(f.label, f.x + f.w / 2, f.y + Math.min(20, f.h / 2 + 4));
        ctx.textAlign = 'left';
      });
    });

    // Desenha todas as paredes sólidas das cabines abertas e salas inferiores!"""

fix_in_draw_world = """        ctx.fillText(f.label, f.x + f.w / 2, f.y + Math.min(20, f.h / 2 + 4));
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

    // Desenha todas as paredes sólidas das cabines abertas e salas inferiores!"""

if target_in_draw_world in code_norm:
    code_norm = code_norm.replace(target_in_draw_world, fix_in_draw_world, 1)
    print("2. Added corridorFurniture drawing into drawWorld() successfully!")
else:
    print("Warning: target_in_draw_world not found")

# 3. Update drawMinimap to draw both racks
target_minimap = """  // Desenha o Rack Central no Minimapa em destaque luminoso:
  let rackCenter = null;
  map.rooms.forEach(r => {
    const fRack = r.furniture.find(f => f.type === 'central_rack');
    if (fRack) {
      rackCenter = { x: fRack.x + fRack.w / 2, y: fRack.y + fRack.h / 2 };
    }
  });
  if (rackCenter) {
    const rx = mx + rackCenter.x * scale;
    const ry = my + rackCenter.y * scale;
    ctx.fillStyle = centralRackState.onFire ? '#ef4444' : (centralRackState.incidentActive ? '#f97316' : '#38bdf8');
    ctx.beginPath();
    ctx.arc(rx, ry, centralRackState.incidentActive ? 6 : 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.2;
    ctx.stroke();
  }"""

fix_minimap = """  // Desenha os Racks de Infraestrutura no Minimapa em destaque luminoso:
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
  });"""

if target_minimap in code_norm:
    code_norm = code_norm.replace(target_minimap, fix_minimap, 1)
    print("3. Updated drawMinimap successfully!")
else:
    print("Warning: target_minimap not found")

# 4. Remove duplicate drawCentralRackChassis at line 5632 (procedural fallback that masked line 5232)
# Find the second occurrence of "function drawCentralRackChassis"
first_pos = code_norm.find("function drawCentralRackChassis(ctx, f) {")
if first_pos != -1:
    second_pos = code_norm.find("function drawCentralRackChassis(ctx, f) {", first_pos + 1)
    if second_pos != -1:
        # Find the end of this duplicate function before "// ============================================================================"
        next_section = code_norm.find("// ============================================================================\n// INTERAÇÃO, TELEPORTES E CHAMADA DE CLIENTES", second_pos)
        if next_section != -1:
            code_norm = code_norm[:second_pos] + code_norm[next_section:]
            print("4. Removed duplicate drawCentralRackChassis function successfully!")
        else:
            print("Warning: next_section marker not found after second drawCentralRackChassis")
    else:
        print("No second drawCentralRackChassis found (already unique)")
else:
    print("Warning: first drawCentralRackChassis not found")

# 5. Enhance client wandering in updateWorld so they wander immediately and dynamically:
target_wander = """          if (typeof c.wanderTimer !== 'number') {
            c.wanderTimer = 15 + Math.floor(Math.random() * 50);
          }
          c.wanderTimer--;

          // Quando conclui o trajeto atual ou pausa, escolhe novo destino livre na área central
          if (c.wanderTimer <= 0 && (!c.waypoints || c.waypoints.length === 0)) {
            c.wanderTimer = 50 + Math.floor(Math.random() * 110); // Pausa de 1 a 2.5s
            let destX = minX + Math.random() * (maxX - minX);
            let destY = minY + Math.random() * (maxY - minY);"""

fix_wander = """          if (typeof c.wanderTimer !== 'number') {
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
            }"""

if target_wander in code_norm:
    code_norm = code_norm.replace(target_wander, fix_wander, 1)
    print("5. Enhanced client wander with minimum distance & stagger successfully!")
else:
    print("Warning: target_wander not found")

with open('game.js', 'w', encoding='utf-8') as f:
    f.write(code_norm)

print("ALL FIXES WRITTEN TO game.js!")
