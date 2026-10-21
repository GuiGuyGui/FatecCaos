const fs = require('fs');

let code = fs.readFileSync('game.js', 'utf8');

const target = 'let solidColliders = [];';

const netCode = `
let bcChannel = null;
let peerInstance = null;
let peerConnections = [];

function initMultiplayerRoom(code) {
  state.roomCode = (code || 'TI-1000').toUpperCase().trim();
  const displayCode = document.getElementById('display-room-code');
  if (displayCode) displayCode.textContent = state.roomCode;
  const sessionPill = document.getElementById('session-code-pill');
  if (sessionPill) sessionPill.textContent = 'Sala: ' + state.roomCode;

  if (bcChannel) {
    try { bcChannel.close(); } catch (e) {}
  }
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    try {
      bcChannel = new BroadcastChannel('plantao_ti_perpetual_' + state.roomCode);
      bcChannel.onmessage = (ev) => handleNetworkMessage(ev.data);
      bcChannel.postMessage({ type: 'join_request', peerId: state.myPeerId });
    } catch (e) {}
  }

  if (typeof window !== 'undefined' && window.Peer) {
    try {
      if (peerInstance) peerInstance.destroy();
      const hostPeerId = 'plantaoti-v9-' + state.roomCode.replace(/[^A-Z0-9]/gi, '').toLowerCase();
      peerInstance = new Peer(hostPeerId);

      peerInstance.on('open', () => { state.mySlotIndex = 0; });
      peerInstance.on('connection', (conn) => {
        peerConnections.push(conn);
        conn.on('data', (data) => handleNetworkMessage(data, conn));
      });
      peerInstance.on('error', (err) => {
        if (err.type === 'unavailable-id') {
          const guestPeer = new Peer();
          peerInstance = guestPeer;
          guestPeer.on('open', () => {
            const conn = guestPeer.connect(hostPeerId);
            peerConnections.push(conn);
            conn.on('open', () => conn.send({ type: 'join_request', peerId: state.myPeerId }));
            conn.on('data', (data) => handleNetworkMessage(data, conn));
          });
        }
      });
    } catch (e) {}
  }
}

function broadcastNet(msg) {
  if (bcChannel) {
    try { bcChannel.postMessage(msg); } catch (e) {}
  }
  peerConnections.forEach(c => {
    try { if (c && c.open) c.send(msg); } catch (e) {}
  });
}

function handleNetworkMessage(data) {
  if (!data || data.peerId === state.myPeerId) return;

  if (data.type === 'join_request') {
    const prevRooms = typeof getUnlockedRoomsCount === 'function' ? getUnlockedRoomsCount() : 5;
    let existing = state.players.find(p => p.peerId === data.peerId);
    if (!existing) {
      existing = state.players.find(p => !p.connected);
      if (existing) {
        existing.connected = true;
        existing.peerId = data.peerId;
        existing.bubble = 'Entrei na minha Cabine! 🚀';
        existing.bubbleTimer = 240;
        const newRooms = typeof getUnlockedRoomsCount === 'function' ? getUnlockedRoomsCount() : 5;
        if (newRooms > prevRooms) {
          refreshMapsWithUpgrades();
        }
        syncQueueSizeToConnectedPlayers(newRooms > prevRooms);
        addChatMessage('Sala Perpétua', '🎉 ' + existing.name + ' conectou (' + getConnectedPlayerCount() + '/20 ativos · Sede com ' + newRooms + ' Salas)!');
        showToast('🌐 ' + existing.name + ' entrou na Sala ' + state.roomCode + '!');
        renderAllUI();
      }
    }
    broadcastNet({
      type: 'room_sync',
      peerId: state.myPeerId,
      hqMinRooms: state.hqMinRooms,
      connectedSlots: state.players.map(p => ({ slot: p.slot, connected: p.connected, peerId: p.peerId, x: p.x, y: p.y })),
      assignedPeerId: data.peerId,
      assignedSlot: existing ? existing.slot : 1
    });
  } else if (data.type === 'room_sync') {
    let changed = false;
    if (data.hqMinRooms && data.hqMinRooms > state.hqMinRooms) {
      state.hqMinRooms = data.hqMinRooms;
      changed = true;
    }
    if (data.connectedSlots) {
      data.connectedSlots.forEach(s => {
        const p = state.players[s.slot];
        if (p && !p.connected && s.connected) {
          p.connected = true;
          p.peerId = s.peerId;
          changed = true;
        }
      });
    }
    if (data.assignedPeerId === state.myPeerId && state.mySlotIndex === 0 && data.assignedSlot > 0) {
      state.mySlotIndex = data.assignedSlot;
      state.players.forEach((p, idx) => { p.isLocal = (idx === state.mySlotIndex); });
      if (typeof getSmallRoomRect === 'function') {
        const myRect = getSmallRoomRect(state.mySlotIndex);
        if (MAPS.online) MAPS.online.myChairPos = { x: myRect.chairX + 18, y: myRect.chairY + 18 };
      }
      showToast('🌐 Conectado na Cabine #' + String(state.mySlotIndex + 1).padStart(2, '0') + '!');
      changed = true;
    }
    if (changed) {
      refreshMapsWithUpgrades();
      syncQueueSizeToConnectedPlayers(true);
      renderAllUI();
    }
  } else if (data.type === 'player_move') {
    const p = state.players[data.slot];
    if (p && p.slot !== state.mySlotIndex) {
      p.connected = true;
      p.x = data.x;
      p.y = data.y;
      p.isMoving = data.isMoving;
      if (data.bubble) {
        p.bubble = data.bubble;
        p.bubbleTimer = 180;
      }
    }
  } else if (data.type === 'coop_step_sync') {
    const targetCase = (cases || []).find(x => x.minigameType === data.minigameType && !x.solved);
    if (targetCase && targetCase.mgState) {
      if (typeof data.optIdx === 'number') {
        targetCase.mgState.coopSelectedOpt[data.stationIdx] = data.optIdx;
      }
      if (data.stationDone) {
        targetCase.mgState.coopStations[data.stationIdx] = true;
        addChatMessage(data.playerName || 'Parceiro Co-op', '🤝 Sincronizou a Estação #' + (data.stationIdx + 1) + ' no puzzle ' + data.minigameType.toUpperCase() + '!');
      }
      if (document.getElementById('workbench-modal')?.classList.contains('open')) {
        renderWorkbenchModal();
      }
    }
  } else if (data.type === 'chat_sticker') {
    addChatMessage(data.author, data.text);
  }
}
`;

if (!code.includes('function initMultiplayerRoom(')) {
  code = code.replace(target, netCode + '\n' + target);
  console.log('initMultiplayerRoom and networking functions inserted!');
}

fs.writeFileSync('game.js', code, 'utf8');
console.log('game.js updated! Length:', code.length);
