const express = require('express');
const http = require('http');
const path = require('path');
const { WebSocketServer, WebSocket } = require('ws');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 10000;

// 1. Set Critical Headers for Godot 4 WebAssembly & SharedArrayBuffer
app.use(express.json({ limit: '2mb' }));
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// 2. Kingdoms AD 1390 - AI Game Master & Conversation Engine API
function getGeminiKey() {
  if (process.env.GEMINI_API_KEY) return process.env.GEMINI_API_KEY;
  try {
    const fs = require('fs');
    const envPaths = [
      path.join(__dirname, '.env'),
      path.join(__dirname, '..', 'Kingdoms', '.env'),
      path.join(__dirname, '..', 'Site', '.env')
    ];
    for (const p of envPaths) {
      if (fs.existsSync(p)) {
        const content = fs.readFileSync(p, 'utf8');
        const match = content.match(/GEMINI_API_KEY=([^\r\n]+)/);
        if (match && match[1]) {
          return match[1].trim();
        }
      }
    }
  } catch (e) {}
  return '';
}

const CANDIDATE_MODELS = ['gemini-3.5-flash-lite', 'gemini-3.8-flash', 'gemini-2.5-flash'];

app.post('/api/kingdoms/action', async (req, res) => {
  try {
    const { command, player, history, timeState, location, customApiKey } = req.body;
    const apiKey = customApiKey && customApiKey.trim() ? customApiKey.trim() : getGeminiKey();

    const systemPrompt = `Você é o Game Master e Diretor de Simulação de "KINGDOMS: ANNO DOMINI 1390", um simulador histórico ultrarrealista da Boêmia feudal medieval (Reino de Venceslau IV).
Você coordena os 4 motores do OmniVoid Engine:
1. WORLD ENGINE: Clima histórico, passagem das horas canônicas (Matinas, Laudes, Prima, Terça, Sexta, Noa, Vésperas, Completas), estradas, perigos da floresta e senhorios feudais.
2. PEOPLE ENGINE: Necessidades biológicas (fome, sede, energia, saúde, ferimentos), classes sociais (nobres, monges, burgueses, artesãos, servos, mendigos), moedas da Boêmia (1 Groschen de Prata = 12 Hellers de Cobre).
3. CONVERSATION ENGINE: Diálogos autênticos em português de época acessível com sotaque histórico e respeito à hierarquia feudal.
4. GAME MASTER: Avaliação lógica de riscos, sucessos, consequências morais, trabalho duro, combate, comércio e sobrevivência.

ESTADO ATUAL DO JOGADOR:
- Nome: ${player?.name || 'Jindřich'} (${player?.backgroundTitle || 'Camponês'})
- Localização: ${location || 'Praça de Ratboř'}
- Saúde: ${player?.hp ?? 100}/100 | Fome: ${player?.hunger ?? 20}/100 | Sede: ${player?.thirst ?? 20}/100 | Energia: ${player?.energy ?? 80}/100
- Moedas: ${player?.groschen ?? 2} Groschen de Prata, ${player?.hellers ?? 8} Hellers de Cobre
- Reputação: ${player?.reputation ?? 50}/100
- Inventário: ${(player?.inventory || ['Pão Velho', 'Faca de Madeira']).join(', ')}
- Clima/Hora: ${timeState || 'Primavera, Terça (Meio da Manhã) - Tempo Claro'}

INSTRUÇÕES DE RESPOSTA:
1. Narre o resultado da ação do jogador com detalhes sensoriais ricos (o que ele vê, ouve, cheira ou a resposta direta dos personagens/NPCs).
2. Mantenha o tom medieval autêntico, imersivo e direto (máximo de 2 a 3 parágrafos bem escritos).
3. No final da resposta, OBRIGATORIAMENTE inclua uma tag de mutação de estado no formato exato:
<!--DELTA: {"hp": 0, "hunger": 5, "thirst": 8, "energy": -10, "groschen": 0, "hellers": 0, "add_item": "", "remove_item": "", "new_location": "", "reputation": 0}-->
(Ajuste os valores numericamente conforme o esforço, gasto ou recompensa da ação).`;

    const contents = [
      {
        parts: [
          {
            text: `${systemPrompt}\n\nO jogador executou a seguinte ação:\n"${command || 'olhar ao redor'}"\n\nResponda como o Game Master do Kingdoms 1390.`
          }
        ]
      }
    ];

    let aiText = '';
    let usedModel = '';

    // Chamada à API do Gemini com fallback entre modelos
    for (const model of CANDIDATE_MODELS) {
      try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const response = await fetch(geminiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents,
            generationConfig: {
              temperature: 0.85,
              maxOutputTokens: 1024
            }
          })
        });

        if (response.ok) {
          const data = await response.json();
          const candidate = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (candidate) {
            aiText = candidate.trim();
            usedModel = model;
            break;
          }
        }
      } catch (err) {
        console.warn(`[Kingdoms AI] Error calling ${model}:`, err.message);
      }
    }

    // Fallback inteligente caso a API esteja indisponível
    if (!aiText) {
      aiText = generateMedievalFallbackResponse(command, location, player);
      usedModel = 'OmniVoid Offline Engine';
    }

    // Parse delta
    let delta = { hp: 0, hunger: 5, thirst: 7, energy: -8, groschen: 0, hellers: 0, add_item: '', remove_item: '', new_location: '', reputation: 0 };
    const deltaMatch = aiText.match(/<!--DELTA:\s*(\{.*?\})\s*-->/s);
    if (deltaMatch) {
      try {
        delta = JSON.parse(deltaMatch[1]);
        aiText = aiText.replace(/<!--DELTA:\s*\{.*?\}\s*-->/s, '').trim();
      } catch (e) {}
    }

    res.json({
      success: true,
      narrative: aiText,
      delta,
      model: usedModel,
      source: 'Kingdoms AD 1390 Game Master AI'
    });

  } catch (error) {
    console.error('[Kingdoms API Error]:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      narrative: 'O vento uiva pelas colinas da Boêmia. Os sinos da igreja tocam à distância enquanto você recupera o fôlego.',
      delta: { hp: 0, hunger: 2, thirst: 3, energy: -5, groschen: 0, hellers: 0 }
    });
  }
});

function generateMedievalFallbackResponse(cmd, loc, player) {
  const c = (cmd || '').toLowerCase();
  if (c.includes('trabalh') || c.includes('servico') || c.includes('lenha') || c.includes('carregar')) {
    return `Você dedica algumas horas à labuta pesada. O suor escorre pela sua fronte e suas mãos calejadas ardem com o atrito da madeira e do ferro. Pelo seu esforço, o feitor local atira algumas moedas de cobre no seu chapéu.\n<!--DELTA: {"hp": 0, "hunger": 15, "thirst": 20, "energy": -25, "groschen": 0, "hellers": 6, "reputation": 2}-->`;
  }
  if (c.includes('taberna') || c.includes('beber') || c.includes('cerveja') || c.includes('comer') || c.includes('guisado')) {
    return `O taverneiro de avental de linho engordurado desliza uma caneca de barro com cerveja escura e uma tigela fumegante de ensopado de nabo com toicinho. O calor da lareira alivia seus membros cansados.\n<!--DELTA: {"hp": 5, "hunger": -35, "thirst": -50, "energy": 15, "groschen": 0, "hellers": -4, "reputation": 0}-->`;
  }
  if (c.includes('rezar') || c.includes('igreja') || c.includes('mosteiro') || c.includes('monge') || c.includes('padre')) {
    return `Você se ajoelha diante do altar de carvalho entalhado. O perfume doce do incenso e o cântico suave dos monges beneditinos preenchem o santuário de paz. Um irmão leigo abençoa sua cabeça e oferece um gole de água pura de poço.\n<!--DELTA: {"hp": 10, "hunger": 5, "thirst": -20, "energy": 20, "groschen": 0, "hellers": 0, "reputation": 5}-->`;
  }
  if (c.includes('cacar') || c.includes('bosque') || c.includes('floresta') || c.includes('armadilha')) {
    return `Você adentra a penumbra dos carvalhos de Rataje, pisando com cautela sobre as folhas secas e o musgo úmido. Entre as moitas de espinheiro, você avista rastros de lebres e galhos secos para o fogo de inverno.\n<!--DELTA: {"hp": 0, "hunger": 12, "thirst": 15, "energy": -20, "add_item": "Carne de Lebre", "reputation": 0}-->`;
  }
  return `Você observa atentamente o movimento ao seu redor. Os camponeses empurram seus carrinhos de mão sobre a lama, os cães latem perto dos celeiros e as bandeiras heráldicas da Boêmia tremulam ao longe no cume da fortaleza.\n<!--DELTA: {"hp": 0, "hunger": 3, "thirst": 5, "energy": -2, "groschen": 0, "hellers": 0}-->`;
}

// 3. Health check endpoint for Render monitoring
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    game: 'FatecCaos',
    max_players_coop: 7,
    uptime_seconds: Math.floor(process.processUptime ? process.processUptime() : process.uptime()),
    timestamp: new Date().toISOString()
  });
});

// 4. Serve Static Web Build with proper MIME types
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

// Fallback to index.html for SPA routes (EXCEPT /api routes)
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) return next();
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
