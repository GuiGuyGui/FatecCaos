with open('game.js', 'r', encoding='utf-8') as f:
    code = f.read()

target1 = "function interactWithReceptionCounter() {"
end1 = "function openCentralRackModal(idx, forceBypass = false) {"

correct1 = """function interactWithReceptionCounter() {
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

"""

idx1 = code.find(target1)
idx2 = code.find(end1)

if idx1 != -1 and idx2 != -1:
    code = code[:idx1] + correct1 + code[idx2:]
    print("Section 1 fixed!")
else:
    print("Failed section 1:", idx1, idx2)

target2 = "function openWorkbenchModal(defaultTab = null, forceBypass = false) {"
end2 = "function drinkCoffee() {"

correct2 = """function openWorkbenchModal(defaultTab = null, forceBypass = false) {
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

"""

idx3 = code.find(target2)
idx4 = code.find(end2)

if idx3 != -1 and idx4 != -1:
    code = code[:idx3] + correct2 + code[idx4:]
    print("Section 2 fixed!")
else:
    print("Failed section 2:", idx3, idx4)

with open('game.js', 'w', encoding='utf-8') as f:
    f.write(code)
