const express = require('express');
const http = require('http');
const path = require('path');
const { WebSocketServer, WebSocket } = require('ws');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 10000;

// 1. Set Critical Headers for Godot 4 WebAssembly & SharedArrayBuffer
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// 2. Health check endpoint for Render monitoring
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    game: 'FatecCaos',
    max_players_coop: 7,
    uptime_seconds: Math.floor(process.processUptime ? process.processUptime() : process.uptime()),
    timestamp: new Date().toISOString()
  });
});

// 3. Serve Static Web Build with proper MIME types
const publicPath = path.join(__dirname, 'public');

app.use(express.static(publicPath, {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.wasm')) {
      res.setHeader('Content-Type', 'application/wasm');
    } else if (filePath.endsWith('.pck')) {
      res.setHeader('Content-Type', 'application/octet-stream');
    } else if (filePath.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
  }
}));

// Fallback to index.html for SPA routes
app.get('*', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

// 4. Integrated WebSocket Server for 7-Player Network Multiplayer
const wss = new WebSocketServer({ server, path: '/ws' });

// Room management: roomCode -> Set of client sockets
const rooms = new Map();

wss.on('connection', (ws, req) => {
  let currentRoom = null;
  let isHost = false;

  ws.on('message', (message, isBinary) => {
    try {
      // If it's a binary packet, broadcast to all other players in the room
      if (isBinary) {
        if (currentRoom && rooms.has(currentRoom)) {
          const peers = rooms.get(currentRoom);
          peers.forEach((peer) => {
            if (peer !== ws && peer.readyState === WebSocket.OPEN) {
              peer.send(message, { binary: true });
            }
          });
        }
        return;
      }

      // If JSON signaling / control message
      const data = JSON.parse(message.toString());

      if (data.type === 'create_room') {
        const roomCode = data.room || 'ZKW-7777';
        currentRoom = roomCode;
        isHost = true;
        if (!rooms.has(roomCode)) {
          rooms.set(roomCode, new Set());
        }
        rooms.get(roomCode).add(ws);
        ws.send(JSON.stringify({ type: 'room_created', room: roomCode, max_players: 7 }));
        console.log(`[FatecCaos WS] Room created: ${roomCode} by host. Total players in room: 1/7`);
      } 
      else if (data.type === 'join_room') {
        const roomCode = data.room || 'ZKW-7777';
        if (!rooms.has(roomCode)) {
          rooms.set(roomCode, new Set());
        }
        const roomPeers = rooms.get(roomCode);
        if (roomPeers.size >= 7) {
          ws.send(JSON.stringify({ type: 'error', message: 'Sala cheia (máximo de 7 jogadores atingido).' }));
          return;
        }
        currentRoom = roomCode;
        roomPeers.add(ws);
        ws.send(JSON.stringify({ type: 'room_joined', room: roomCode, player_slot: roomPeers.size, total_players: roomPeers.size }));
        
        // Notify others
        roomPeers.forEach((peer) => {
          if (peer !== ws && peer.readyState === WebSocket.OPEN) {
            peer.send(JSON.stringify({ type: 'peer_joined', total_players: roomPeers.size }));
          }
        });
        console.log(`[FatecCaos WS] Player joined room: ${roomCode}. Players: ${roomPeers.size}/7`);
      }
      else if (data.type === 'relay') {
        // Relay generic text message to room
        if (currentRoom && rooms.has(currentRoom)) {
          const roomPeers = rooms.get(currentRoom);
          roomPeers.forEach((peer) => {
            if (peer !== ws && peer.readyState === WebSocket.OPEN) {
              peer.send(JSON.stringify(data));
            }
          });
        }
      }
    } catch (err) {
      // Direct raw binary relay
      if (currentRoom && rooms.has(currentRoom)) {
        const peers = rooms.get(currentRoom);
        peers.forEach((peer) => {
          if (peer !== ws && peer.readyState === WebSocket.OPEN) {
            peer.send(message);
          }
        });
      }
    }
  });

  ws.on('close', () => {
    if (currentRoom && rooms.has(currentRoom)) {
      const roomPeers = rooms.get(currentRoom);
      roomPeers.delete(ws);
      if (roomPeers.size === 0) {
        rooms.delete(currentRoom);
        console.log(`[FatecCaos WS] Room ${currentRoom} closed (no active players).`);
      } else {
        roomPeers.forEach((peer) => {
          if (peer.readyState === WebSocket.OPEN) {
            peer.send(JSON.stringify({ type: 'peer_left', total_players: roomPeers.size }));
          }
        });
        console.log(`[FatecCaos WS] Player left room: ${currentRoom}. Remaining: ${roomPeers.size}/7`);
      }
    }
  });
});

// Start Server
server.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 FatecCaos Web Service is RUNNING on port ${PORT}`);
  console.log(`🌐 Web Game URL: http://localhost:${PORT}`);
  console.log(`⚡ WebSocket Server: ws://localhost:${PORT}/ws`);
  console.log(`👥 Co-op Capacity: up to 7 concurrent players`);
  console.log(`🔒 Headers: COOP & COEP configured for Godot 4 Web`);
  console.log(`====================================================`);
});
