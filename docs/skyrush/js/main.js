// Main Game Controller & WebSocket Client
class GameClient {
    constructor() {
        this.ws = null;
        this.playerId = null;
        this.roomCode = null;
        this.isHost = false;

        this.map = null;
        this.localPlayer = null;
        this.otherPlayers = {};
        this.modifiers = {
            wind: 0,
            gravity_scale: 1.0,
            earthquake: false,
            meteor_active: false,
            blackout: false
        };

        this.physics = new PhysicsEngine();
        this.canvas = document.getElementById('gameCanvas');
        this.renderer = new GameRenderer(this.canvas);
        this.ui = new UIManager();
        this.hostManager = new HostPowerManager(this, this.renderer.particles);

        this.lastTime = performance.now();
        this.roundTime = 600;
        this.lastNetworkSend = 0;
        this.selectedColor = '#3b82f6';
        this.selectedBotCount = 0;
        this.selectedHunter = 0;
        this.selectedDurationMinutes = 10;
        this.hostSelectedRole = 'player'; // 'player' or 'spectator'
        this.isFreeCamera = false;
        this.freeCamInput = { up: false, down: false, left: false, right: false, turbo: false };

        // Host Powers & Special Modes State
        this.isKingOfHillActive = false;
        this.kingId = null;
        this.isAutoHostActive = false;
        this.isViewerModeActive = false;
        this.viewerTimer = 0;
        this.viewerTargetId = null;
        this.matrixSlowmoTimer = 0;
        this.matrixSlowmoScale = 1.0;
        this.blackHoles = [];

        this.init();
    }

    init() {
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());

        this.setupLobbyUI();
        this.setupGameInputs();
        this.setupChatUI();
        this.setupHostControls();
        this.setupSkillUI();

        // Start Game Animation Loop
        requestAnimationFrame((t) => this.gameLoop(t));
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    connectWS(onOpenCallback) {
        try {
            const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
            const wsUrl = `${protocol}//${window.location.host}/ws`;

            this.ws = new WebSocket(wsUrl);

            this.ws.onopen = () => {
                console.log('Connected to Sky Rush Server');
                if (onOpenCallback) onOpenCallback();
            };

            this.ws.onmessage = (event) => {
                try {
                    const data = jsonParseSafe(event.data);
                    if (data) this.handleServerMessage(data);
                } catch (e) {
                    console.error('Error handling WS message:', e);
                }
            };

            this.ws.onclose = () => {
                console.log('Disconnected from server');
                this.ui.addChatMessage('Sistema', 'Conexão perdida com o servidor.', '#f87171');
            };

            this.ws.onerror = (err) => {
                console.error('WS Error:', err);
            };
        } catch (err) {
            console.error('WebSocket connection error:', err);
        }
    }

    createRoom(name, color) {
        window.soundEngine.init();
        let wsConnected = false;
        const fallbackTimer = setTimeout(() => {
            if (!wsConnected) {
                console.log('Servidor WebSocket indisponível. Iniciando Modo Local Offline!');
                this.startLocalSoloGame(name, color);
            }
        }, 800);

        try {
            this.connectWS(() => {
                wsConnected = true;
                clearTimeout(fallbackTimer);
                this.ws.send(JSON.stringify({
                    type: 'create_room',
                    name: name,
                    color: color,
                    hunter_active: (this.selectedHunter || 0) > 0,
                    bot_count: this.selectedBotCount || 0,
                    duration_minutes: this.selectedDurationMinutes || 10
                }));
            });
        } catch (e) {
            clearTimeout(fallbackTimer);
            this.startLocalSoloGame(name, color);
        }
    }

    joinRoom(code, name, color) {
        window.soundEngine.init();
        let wsConnected = false;
        const fallbackTimer = setTimeout(() => {
            if (!wsConnected) {
                console.log('Servidor indisponível. Iniciando Modo Local Offline!');
                this.startLocalSoloGame(name, color);
            }
        }, 800);

        try {
            this.connectWS(() => {
                wsConnected = true;
                clearTimeout(fallbackTimer);
                this.ws.send(JSON.stringify({
                    type: 'join_room',
                    room_code: code,
                    name: name,
                    color: color
                }));
            });
        } catch (e) {
            clearTimeout(fallbackTimer);
            this.startLocalSoloGame(name, color);
        }
    }

    startLocalSoloGame(name, color) {
        this.isLocalSolo = true;
        this.playerId = 'p_local';
        this.roomCode = 'SOLO-' + Math.floor(Math.random() * 9000 + 1000);
        this.isHost = true;
        this.roundTime = (this.selectedDurationMinutes || 10) * 60;
        this.gameState = 'playing';

        // Generate Map
        this.map = new GameMap(Math.floor(Math.random() * 999999));

        // Create Local Player
        this.localPlayer = new Player(this.playerId, name || 'Jogador', color || '#3b82f6', true);
        this.localPlayer.isHost = true;
        this.localPlayer.x = 240;
        this.localPlayer.y = 11600;
        this.renderer.camera.x = this.localPlayer.x + this.localPlayer.w / 2;
        this.renderer.camera.y = this.localPlayer.y - 40;
        this.renderer.camera.targetX = this.renderer.camera.x;
        this.renderer.camera.targetY = this.renderer.camera.y;

        this.otherPlayers = {};
        const botCount = this.selectedBotCount > 0 ? this.selectedBotCount : 3;
        const botNames = ['CyberBot_01', 'CloudClimber', 'SkyNinja', 'AeroPilot', 'SummitKing'];
        const botColors = ['#ec4899', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4'];

        for (let i = 0; i < botCount; i++) {
            const bid = 'bot_' + (i + 1);
            const bp = new Player(bid, botNames[i % botNames.length], botColors[i % botColors.length], false);
            bp.isBot = true;
            bp.x = 100 + i * 90;
            bp.y = 11600;
            this.otherPlayers[bid] = bp;
        }

        // Update UI
        this.ui.setRoomCode(this.roomCode);
        this.ui.showLobbyModal(false);
        this.ui.showWaitingLobby(false);
        this.ui.showCinematic(false);
        this.ui.showHostToolbar(true);
        this.ui.updatePlayerList(this.localPlayer, this.otherPlayers);
        this.ui.updateAltitudeBar(this.localPlayer, this.otherPlayers);

        if (this.hostSelectedRole === 'spectator') {
            this.setFreeCameraMode(true);
        }

        if (this.canvas) this.canvas.focus();
        if (window.soundEngine && window.soundEngine.playBattleStartHorn) {
            window.soundEngine.playBattleStartHorn();
        }
        this.ui.addChatMessage('Sistema', '🎮 Modo Local / Offline iniciado! Suba até o topo!', '#10b981');
    }

    handleServerMessage(data) {
        switch (data.type) {
            case 'room_joined':
                this.roomCode = data.room_code;
                this.playerId = data.player_id;
                this.isHost = data.is_host;
                this.roundTime = data.time_left || 600;
                this.gameState = data.state || 'lobby';

                // Generate Map using deterministic room seed
                this.map = new GameMap(data.seed);

                // Create Local Player
                const myData = data.players.find(p => p.id === this.playerId);
                this.localPlayer = new Player(this.playerId, myData.name, myData.color, true);
                this.localPlayer.isHost = this.isHost;
                this.localPlayer.x = myData.x;
                this.localPlayer.y = myData.y;
                this.renderer.camera.x = this.localPlayer.x + this.localPlayer.w / 2;
                this.renderer.camera.y = this.localPlayer.y - 40;
                this.renderer.camera.targetX = this.renderer.camera.x;
                this.renderer.camera.targetY = this.renderer.camera.y;

                // Load existing other players
                this.otherPlayers = {};
                for (let p of data.players) {
                    if (p.id !== this.playerId) {
                        const rp = new Player(p.id, p.name, p.color, false);
                        rp.isHost = p.is_host;
                        rp.isBot = p.is_bot;
                        rp.x = p.x;
                        rp.y = p.y;
                        this.otherPlayers[p.id] = rp;
                    }
                }

                // Update UI
                this.ui.setRoomCode(this.roomCode);
                this.ui.showLobbyModal(false);
                this.ui.updatePlayerList(this.localPlayer, this.otherPlayers);
                this.ui.updateAltitudeBar(this.localPlayer, this.otherPlayers);

                if (this.gameState === 'lobby') {
                    this.ui.showWaitingLobby(true, this.roomCode, this.isHost, this.localPlayer, this.otherPlayers);
                    this.ui.showHostToolbar(false);
                } else {
                    this.ui.showWaitingLobby(false);
                    this.ui.showHostToolbar(this.isHost);
                }

                if (this.isHost && this.hostSelectedRole === 'spectator') {
                    this.setFreeCameraMode(true);
                }

                if (data.auto_host_mode !== undefined) {
                    this.isAutoHostActive = data.auto_host_mode;
                    const btnAuto = document.getElementById('host-btn-autohost');
                    if (btnAuto) btnAuto.classList.toggle('active', data.auto_host_mode);
                }

                if (this.autoStart && this.isHost) {
                    setTimeout(() => {
                        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                            this.ws.send(JSON.stringify({ type: 'start_game' }));
                        }
                    }, 120);
                }

                if (data.chat_history) {
                    for (let c of data.chat_history) {
                        this.ui.addChatMessage(c.sender, c.text, c.color, c.time);
                    }
                }
                break;

            case 'player_joined':
                if (data.player.id !== this.playerId) {
                    const np = new Player(data.player.id, data.player.name, data.player.color, false);
                    np.isHost = data.player.is_host;
                    np.isBot = data.player.is_bot;
                    np.x = data.player.x;
                    np.y = data.player.y;
                    this.otherPlayers[data.player.id] = np;
                    this.ui.updatePlayerList(this.localPlayer, this.otherPlayers);
                    this.ui.updateWaitingLobbyRoster(this.localPlayer, this.otherPlayers, this.isHost);
                }
                break;

            case 'player_left':
                if (data.player_id in this.otherPlayers) {
                    delete this.otherPlayers[data.player_id];
                    this.ui.updatePlayerList(this.localPlayer, this.otherPlayers);
                    this.ui.updateWaitingLobbyRoster(this.localPlayer, this.otherPlayers, this.isHost);
                }
                break;

            case 'game_started':
                this.gameState = 'playing';
                this.ui.showWaitingLobby(false);
                this.ui.showCinematic(false);
                this.ui.showHostToolbar(this.isHost);
                if (this.canvas) this.canvas.focus();
                if (window.soundEngine && window.soundEngine.playBattleStartHorn) {
                    window.soundEngine.playBattleStartHorn();
                }
                break;

            case 'host_transferred':
                if (data.new_host_id === this.playerId) {
                    this.isHost = true;
                    if (this.localPlayer) this.localPlayer.isHost = true;
                    if (this.gameState === 'playing') this.ui.showHostToolbar(true);
                    this.ui.showWaitingLobby(this.gameState === 'lobby', this.roomCode, this.isHost, this.localPlayer, this.otherPlayers);
                    this.ui.addChatMessage('Sistema', 'Você agora é o Anfitrião da sala!', '#fbbf24');
                } else if (data.new_host_id in this.otherPlayers) {
                    this.otherPlayers[data.new_host_id].isHost = true;
                    this.ui.updateWaitingLobbyRoster(this.localPlayer, this.otherPlayers, this.isHost);
                }
                break;

            case 'world_sync':
                this.roundTime = data.t;
                this.ui.updateTimer(this.roundTime);
                if (data.state === 'playing') {
                    this.gameState = 'playing';
                    this.ui.showWaitingLobby(false);
                    this.ui.showCinematic(false);
                    this.ui.showHostToolbar(this.isHost);
                }
                if (data.m) {
                    this.modifiers = data.m;
                }
                if (data.season && this.map) {
                    this.map.setSeason(data.season);
                    document.querySelectorAll('.host-btn-season').forEach(b => {
                        b.classList.toggle('active', b.dataset.season === data.season);
                    });
                }
                if (data.lava) {
                    this.lava = data.lava;
                    const btnLava = document.getElementById('host-btn-lava');
                    if (btnLava) btnLava.classList.toggle('active', !!data.lava.active);
                }
                if (data.p) {
                    for (let pdata of data.p) {
                        if (pdata.i !== this.playerId) {
                            if (!this.otherPlayers[pdata.i]) {
                                const rp = new Player(pdata.i, pdata.n || 'Jogador', pdata.c || '#f59e0b', false);
                                rp.isHost = false;
                                rp.isBot = pdata.b;
                                this.otherPlayers[pdata.i] = rp;
                            }
                            this.otherPlayers[pdata.i].applyRemoteSync(pdata);
                        }
                    }
                    if (this.gameState === 'lobby') {
                        this.ui.updateWaitingLobbyRoster(this.localPlayer, this.otherPlayers, this.isHost);
                    }
                }
                break;

            case 'apply_push':
                if (data.target_id === this.playerId && this.localPlayer) {
                    if (!this.localPlayer.isGhost) {
                        this.localPlayer.pushVx += data.force_x;
                        this.localPlayer.pushVy += data.force_y;
                        if (window.soundEngine) window.soundEngine.playPush();
                    }
                }
                break;

            case 'skill_activated':
                const skillUser = (data.player_id === this.playerId) ? this.localPlayer : this.otherPlayers[data.player_id];
                if (skillUser) {
                    if (data.skill === 'shove') {
                        skillUser.isShoving = true;
                        skillUser.shoveTimer = 0.24;
                        if (data.data && data.data.facing) skillUser.facing = data.data.facing;
                        if (this.renderer.particles) {
                            this.renderer.particles.emitShoveSwoosh(skillUser.x + (skillUser.facing > 0 ? skillUser.w + 8 : -8), skillUser.y + skillUser.h / 2, skillUser.facing);
                        }
                        if (window.soundEngine && skillUser !== this.localPlayer) {
                            window.soundEngine.playShove();
                        }
                    } else if (data.skill === 'shockwave') {
                        this.renderer.particles.emitShockwave(data.data.x, data.data.y);
                        // Check if local player hit by shockwave
                        if (this.localPlayer && this.localPlayer.id !== data.player_id && !this.localPlayer.isGhost) {
                            const dx = (this.localPlayer.x + this.localPlayer.w / 2) - data.data.x;
                            const dy = (this.localPlayer.y + this.localPlayer.h / 2) - data.data.y;
                            const dist = Math.sqrt(dx * dx + dy * dy);
                            if (dist < data.data.radius) {
                                const force = (1 - dist / data.data.radius) * data.data.force;
                                const angle = Math.atan2(dy, dx);
                                this.localPlayer.pushVx += Math.cos(angle) * force;
                                this.localPlayer.pushVy += Math.sin(angle) * force - 3;
                            }
                        }
                    } else if (data.skill === 'ghost') {
                        skillUser.isGhost = true;
                        skillUser.ghostTimer = data.data.duration || 5.0;
                    }
                }
                break;

            case 'host_sniper_fired':
                // Shoot laser from top sky down to target coordinate
                this.renderer.particles.addLaser(data.x, data.y - 800, data.x, data.y);
                if (window.soundEngine) window.soundEngine.playSniperLaser();
                this.renderer.setScreenShake(4.0);

                if (data.target_id === this.playerId && this.localPlayer) {
                    // Struck by Sniper! Big downward and horizontal knockback
                    this.localPlayer.pushVy = 14.0;
                    this.localPlayer.pushVx = (Math.random() - 0.5) * 12.0;
                    this.ui.addChatMessage('Sistema', '🎯 Você foi atingido pelo Sniper do Anfitrião!', '#ef4444');
                }
                break;

            case 'host_earthquake':
                this.modifiers.earthquake = true;
                this.renderer.setScreenShake(6.0);
                if (window.soundEngine) window.soundEngine.playEarthquake();
                this.ui.addChatMessage('Sistema', '🌋 Terremoto ativado pelo Anfitrião!', '#f97316');
                break;

            case 'host_wind':
                this.modifiers.wind = data.direction;
                if (window.soundEngine) window.soundEngine.playWind();
                this.ui.addChatMessage('Sistema', `🌪️ Tempestade de vento (${data.direction > 0 ? 'Direita ➡️' : 'Esquerda ⬅️'})!`, '#38bdf8');
                break;

            case 'host_blackout':
                this.modifiers.blackout = data.blackout;
                const btnBlackout = document.getElementById('host-btn-blackout');
                if (btnBlackout) btnBlackout.classList.toggle('active', data.blackout);
                this.ui.addChatMessage('Sistema', data.blackout ? '🌙 MODO NOITE ATIVADO! A escuridão tomou o reino: use os faróis dos seus olhos para revelar o caminho!' : '☀️ MODO DIA ATIVADO! O sol voltou a iluminar todo o percurso!', data.blackout ? '#a855f7' : '#fbbf24');
                break;

            case 'host_gravity':
                this.modifiers.heavy_gravity = data.heavy_gravity;
                this.modifiers.gravity_scale = data.gravity_scale || 1.0;
                // Sync slider UI if it exists
                const gSlider = document.getElementById('host-gravity-slider');
                const gVal = document.getElementById('gravity-slider-val');
                if (gSlider) gSlider.value = this.modifiers.gravity_scale;
                if (gVal) gVal.textContent = this.modifiers.gravity_scale.toFixed(1) + 'x';
                break;


            case 'host_drunk_controls':
                if (this.localPlayer) {
                    this.localPlayer.isDrunk = true;
                    this.localPlayer.drunkTimer = data.duration || 4.0;
                }
                for (let p of Object.values(this.otherPlayers)) {
                    p.isDrunk = true;
                    p.drunkTimer = data.duration || 4.0;
                }
                const drunkOverlay = document.getElementById('drunkOverlay');
                if (drunkOverlay) {
                    drunkOverlay.style.display = 'flex';
                    setTimeout(() => {
                        if (drunkOverlay) drunkOverlay.style.display = 'none';
                    }, (data.duration || 4.0) * 1000);
                }
                if (window.soundEngine) window.soundEngine.playDrunkWobble();
                break;

            case 'host_black_hole':
                this.renderer.particles.spawnBlackHole(data.x, data.y, data.duration, data.radius, data.force);
                this.renderer.setScreenShake(4.0);
                if (window.soundEngine) window.soundEngine.playBlackHoleHum();
                break;

            case 'host_chicken_missile':
                this.renderer.particles.spawnChickenMissile(data.target_id, data.target_name, data.spawn_x, data.spawn_y);
                if (window.soundEngine) window.soundEngine.playChickenCluck();
                break;

            case 'host_swap_players':
                if (data.p1_id === this.playerId && this.localPlayer) {
                    this.localPlayer.x = data.p1_x;
                    this.localPlayer.y = data.p1_y;
                    this.localPlayer.vx = 0;
                    this.localPlayer.vy = 0;
                } else if (this.otherPlayers[data.p1_id]) {
                    this.otherPlayers[data.p1_id].x = data.p1_x;
                    this.otherPlayers[data.p1_id].y = data.p1_y;
                }

                if (data.p2_id === this.playerId && this.localPlayer) {
                    this.localPlayer.x = data.p2_x;
                    this.localPlayer.y = data.p2_y;
                    this.localPlayer.vx = 0;
                    this.localPlayer.vy = 0;
                } else if (this.otherPlayers[data.p2_id]) {
                    this.otherPlayers[data.p2_id].x = data.p2_x;
                    this.otherPlayers[data.p2_id].y = data.p2_y;
                }

                if (this.renderer && this.renderer.particles) {
                    this.renderer.particles.emitSkillAura(data.p1_x + 15, data.p1_y + 18, '#06b6d4');
                    this.renderer.particles.emitSkillAura(data.p2_x + 15, data.p2_y + 18, '#06b6d4');
                }
                if (window.soundEngine) window.soundEngine.playSwapZap();
                break;

            case 'host_matrix_slowmo':
                this.matrixSlowmoTimer = data.duration || 5.0;
                this.matrixSlowmoScale = data.scale || 0.3;
                const matrixOverlay = document.getElementById('matrixOverlay');
                if (matrixOverlay) {
                    matrixOverlay.style.display = 'flex';
                }
                if (window.soundEngine) window.soundEngine.playMatrixSlowmo();
                break;

            case 'host_flashbang':
                const flashOverlay = document.getElementById('flashbangOverlay');
                if (flashOverlay) {
                    // Force solid white, no transition during initial flash
                    flashOverlay.style.transition = 'none';
                    flashOverlay.style.backgroundColor = 'rgba(255,255,255,1)';
                    flashOverlay.style.opacity = '1';
                    flashOverlay.style.display = 'block';
                    // After 0.5s of pure white, fade out in 0.4s
                    setTimeout(() => {
                        flashOverlay.style.transition = 'opacity 0.4s ease-out';
                        flashOverlay.style.opacity = '0';
                        setTimeout(() => {
                            flashOverlay.style.display = 'none';
                            flashOverlay.style.transition = 'none';
                        }, 450);
                    }, 500);
                }
                if (window.soundEngine) window.soundEngine.playFlashbang();
                break;

            case 'host_fake_summit':
                this.renderer.particles.spawnFakeSummit(data.summit_id, data.x, data.y);
                break;

            case 'fake_summit_exploded':
                this.renderer.particles.emitConfettiTroll(data.x, data.y);
                if (window.soundEngine) window.soundEngine.playTrollHorn();
                break;

            case 'host_king_of_hill':
                this.isKingOfHillActive = data.active;
                this.kingId = data.king_id;
                const btnKing = document.getElementById('host-btn-kinghill');
                if (btnKing) btnKing.classList.toggle('active', data.active);
                const bannerKing = document.getElementById('kingOfHillBanner');
                if (bannerKing) bannerKing.style.display = data.active ? 'flex' : 'none';
                if (data.active && window.soundEngine) window.soundEngine.playKingFanfare();
                break;

            case 'king_changed':
                this.kingId = data.king_id;
                const kingNameEl = document.getElementById('kingNameTxt');
                if (kingNameEl) kingNameEl.textContent = data.king_name;
                for (let p of Object.values(this.otherPlayers)) {
                    p.isKing = (p.id === data.king_id);
                }
                if (this.localPlayer) {
                    this.localPlayer.isKing = (this.localPlayer.id === data.king_id);
                }
                break;

            case 'king_score_update':
                const scoreBadge = document.getElementById('kingScoreBadge');
                if (scoreBadge) scoreBadge.textContent = `${data.score} pts`;
                break;

            case 'host_auto_mode':
                this.isAutoHostActive = data.auto_mode;
                const btnAuto = document.getElementById('host-btn-autohost');
                if (btnAuto) btnAuto.classList.toggle('active', data.auto_mode);
                const spotlightEl = document.getElementById('spotlightCard');
                if (spotlightEl && !data.auto_mode) {
                    spotlightEl.style.display = 'none';
                }
                break;

            case 'auto_host_spotlight':
                const card = document.getElementById('spotlightCard');
                if (card) {
                    card.style.display = 'flex';
                    const nameEl = document.getElementById('spotlightPlayerName');
                    const altEl = document.getElementById('spotlightPlayerAlt');
                    const dotEl = document.getElementById('spotlightAvatarDot');
                    if (nameEl) nameEl.textContent = data.name + (data.is_bot ? ' 🤖' : '');
                    if (altEl) altEl.textContent = `${data.altitude}m de altitude`;
                    if (dotEl) dotEl.style.backgroundColor = data.color || '#3b82f6';
                }
                // If Host is using free camera spectator mode, smoothly focus to the spotlighted player
                if (this.isFreeCamera && data.x !== undefined && data.y !== undefined) {
                    this.renderer.camera.x = data.x;
                    this.renderer.camera.y = data.y;
                }
                break;

            case 'host_chicken_morph':
                const chickenDur = data.duration || 5.0;
                // Server sends target_ids as array of player ID strings
                const chickenTargetIds = data.target_ids || [];
                if (chickenTargetIds.includes(this.playerId) && this.localPlayer) {
                    this.localPlayer.isChickenMorph = true;
                    this.localPlayer.chickenTimer = chickenDur;
                }
                for (let tid of chickenTargetIds) {
                    if (this.otherPlayers[tid]) {
                        this.otherPlayers[tid].isChickenMorph = true;
                        this.otherPlayers[tid].chickenTimer = chickenDur;
                    }
                }

                if (window.soundEngine) window.soundEngine.playChickenCluckChorus();
                break;

            case 'host_boxing_punch':
                // Instant area punch at clicked position
                if (this.renderer && this.renderer.particles) {
                    this.renderer.particles.emitImpactRing(data.x, data.y, '#ef4444');
                    this.renderer.particles.emitStars(data.x, data.y, 18);
                }
                this.renderer.setScreenShake(3.5);
                if (window.soundEngine) window.soundEngine.playBoxingPunch();
                // Apply knockback to local player if in punch radius
                if (this.localPlayer && !this.localPlayer.isGhost) {
                    const bpDx = (this.localPlayer.x + this.localPlayer.w / 2) - data.x;
                    const bpDy = (this.localPlayer.y + this.localPlayer.h / 2) - data.y;
                    const bpDist = Math.hypot(bpDx, bpDy);
                    if (bpDist < (data.radius || 120)) {
                        const dir = bpDx >= 0 ? 1 : -1;
                        this.localPlayer.pushVx = dir * 25.0;
                        this.localPlayer.pushVy = 12.0; // Down
                        this.localPlayer.isStunned = true;
                        this.localPlayer.stunTimer = 0.5;
                    }
                }
                break;

            case 'host_boxing_glove':
                this.renderer.particles.spawnBoxingGlove(data.x, data.y, data.dir, 34.0, 3000);

                if (window.soundEngine) window.soundEngine.playBoxingPunch();
                break;

            case 'host_banana_rain':
                const bananas = data.bananas || data.peels || [];
                if (bananas.length > 0 && this.renderer && this.renderer.particles) {
                    this.renderer.particles.spawnBananaRain(bananas);
                }
                if (window.soundEngine) window.soundEngine.playBananaSlip();
                break;

            case 'banana_slipped':
                if (data.banana_id !== undefined) {
                    this.renderer.particles.removeBanana(data.banana_id);
                }
                if (data.player_id === this.playerId && this.localPlayer) {
                    this.localPlayer.pushVx = (Math.random() < 0.5 ? -1 : 1) * 8.0;
                    this.localPlayer.pushVy = -3.0;
                    this.localPlayer.y = Math.min(9900, this.localPlayer.y + 120);
                    this.localPlayer.isStunned = true;
                    this.localPlayer.stunTimer = 0.6;
                    if (this.renderer.particles) {
                        this.renderer.particles.emitSlipBanana(data.x || this.localPlayer.x, data.y || this.localPlayer.y);
                    }
                }
                if (window.soundEngine) window.soundEngine.playBananaSlip();
                break;

            case 'host_ufo_abduction':
                this.renderer.particles.spawnUfoAbduction(data.target_id, data.target_name, data.start_x, data.start_y, data.drop_y);
                if (window.soundEngine) window.soundEngine.playUfoTractorBeam();
                if (data.target_id === this.playerId && this.localPlayer) {
                    setTimeout(() => {
                        if (this.localPlayer) {
                            this.localPlayer.y = data.drop_y;
                            this.localPlayer.vx = 0;
                            this.localPlayer.vy = 0;
                        }
                    }, 1800);
                }
                break;

            case 'host_inverted_world':
                const invDur = data.duration || 4.0;
                const canvasEl = document.getElementById('gameCanvas');
                const overlayEl = document.getElementById('invertedWorldOverlay');
                if (canvasEl) canvasEl.classList.add('canvas-inverted');
                if (overlayEl) overlayEl.style.display = 'flex';
                if (window.soundEngine) window.soundEngine.playInvertedWorldZap();
                setTimeout(() => {
                    if (canvasEl) canvasEl.classList.remove('canvas-inverted');
                    if (overlayEl) overlayEl.style.display = 'none';
                }, invDur * 1000);
                break;

            case 'host_rubberband':
                this.renderer.particles.spawnRubberband(
                    data.p_lead_id, data.p_lead_name, data.p_lead_old_y, data.p_lead_new_y,
                    data.p_last_id, data.p_last_name, data.p_last_old_y, data.p_last_new_y
                );
                if (window.soundEngine) window.soundEngine.playRubberbandSnap();
                if (data.p_lead_id === this.playerId && this.localPlayer) {
                    this.localPlayer.y = data.p_lead_new_y;
                    this.localPlayer.vx = 0;
                    this.localPlayer.vy = 0;
                } else if (data.p_last_id === this.playerId && this.localPlayer) {
                    this.localPlayer.y = data.p_last_new_y;
                    this.localPlayer.vx = 0;
                    this.localPlayer.vy = 0;
                }
                break;

            case 'host_chain':
                const chainTarget = (data.target_id === this.playerId) ? this.localPlayer : this.otherPlayers[data.target_id];
                if (chainTarget) {
                    if (typeof chainTarget.setChained === 'function') {
                        chainTarget.setChained(data.anchor_x, data.anchor_y, data.duration || 2.0);
                    } else {
                        chainTarget.isChained = true;
                        chainTarget.chainTimer = data.duration || 2.0;
                        chainTarget.chainAnchorX = data.anchor_x;
                        chainTarget.chainAnchorY = data.anchor_y;
                        chainTarget.vx = 0;
                        chainTarget.vy = 0;
                        chainTarget.pushVx = 0;
                        chainTarget.pushVy = 0;
                    }
                    if (window.soundEngine && window.soundEngine.playChain) {
                        window.soundEngine.playChain();
                    }
                }
                break;

            case 'host_boulder_drop':
                this.ui.addChatMessage('Sistema', '🪨 Grandes rochas começaram a desabar do cume!', '#f59e0b');
                this.renderer.setScreenShake(5.0);
                if (window.soundEngine) {
                    window.soundEngine.playBoulderRumble();
                }
                const dropBoulders = data.boulders || [{
                    x: Math.random() * 2400 + 300,
                    y: -120,
                    radius: Math.floor(Math.random() * 45) + 30,
                    vx: (Math.random() - 0.5) * 8,
                    vy: Math.random() * 3 + 2
                }];
                dropBoulders.forEach((b, idx) => {
                    setTimeout(() => {
                        this.renderer.particles.spawnBoulder(b.x, b.y, b.radius, b.vx, b.vy);
                    }, idx * 175);
                });
                break;

            case 'host_meteor_shower':
                this.ui.addChatMessage('Sistema', '🪨 Grandes rochas começaram a desabar do cume!', '#f59e0b');
                this.renderer.setScreenShake(5.0);
                if (window.soundEngine) window.soundEngine.playBoulderRumble();
                for (let i = 0; i < 2; i++) {
                    setTimeout(() => {
                        this.renderer.particles.spawnBoulder(
                            Math.random() * 2400 + 300,
                            -120,
                            Math.floor(Math.random() * 45) + 30,
                            (Math.random() - 0.5) * 8,
                            Math.random() * 3 + 2
                        );
                    }, i * 200);
                }
                break;

            case 'host_reset_all':
                if (this.localPlayer) {
                    this.localPlayer.x = 90 + (Math.random() - 0.5) * 40;
                    this.localPlayer.y = 7864;
                    this.localPlayer.vx = 0;
                    this.localPlayer.vy = 0;
                }
                this.ui.addChatMessage('Sistema', '🔄 A sala foi reiniciada para o início!', '#fbbf24');
                break;

            case 'host_season':
                if (this.map) {
                    this.map.setSeason(data.season);
                }
                // Update active state on season buttons
                document.querySelectorAll('.host-btn-season').forEach(b => {
                    b.classList.toggle('active', b.dataset.season === data.season);
                });
                break;

            case 'host_lava':
                this.lava = {
                    active: data.active,
                    y: data.y !== undefined ? data.y : 7920,
                    speed: data.speed || 18.0
                };
                const btnLava = document.getElementById('host-btn-lava');
                if (btnLava) btnLava.classList.toggle('active', data.active);
                break;

            case 'player_damaged':
                if (data.target_id === this.playerId && this.localPlayer) {
                    this.localPlayer.hp = data.hp;
                    this.localPlayer.pushVx = (this.localPlayer.pushVx || 0) + (data.force_x || 0);
                    this.localPlayer.pushVy = (this.localPlayer.pushVy || 0) + (data.force_y || 0);
                    if (data.is_dead) {
                        this.localPlayer.die('damage', this.localPlayer.x, this.localPlayer.y, this, this.renderer ? this.renderer.particles : null);
                    }
                } else if (this.otherPlayers[data.target_id]) {
                    const target = this.otherPlayers[data.target_id];
                    target.hp = data.hp;
                    target.pushVx = (target.pushVx || 0) + (data.force_x || 0);
                    target.pushVy = (target.pushVy || 0) + (data.force_y || 0);
                    if (data.is_dead) {
                        target.isDead = true;
                        target.isGhost = true;
                    }
                }
                break;

            case 'player_died':
                if (data.player_id === this.playerId && this.localPlayer) {
                    this.localPlayer.die(data.cause || 'damage', this.localPlayer.x, this.localPlayer.y, this, this.renderer ? this.renderer.particles : null);
                } else if (this.otherPlayers[data.player_id]) {
                    const target = this.otherPlayers[data.player_id];
                    target.hp = 0;
                    target.isDead = true;
                    target.isGhost = true;
                }
                break;

            case 'item_collected':
                if (this.map && this.map.interactiveObjects) {
                    const item = this.map.interactiveObjects.find(o => o.id === data.item_id);
                    if (item) {
                        item.collected = true;
                        item.respawnTimer = 18.0;
                    }
                }
                break;

            case 'ammo_collected':
                if (this.map && this.map.interactiveObjects) {
                    const crate = this.map.interactiveObjects.find(o => o.id === data.ammo_id);
                    if (crate) {
                        crate.collected = true;
                        crate.respawnTimer = 18.0;
                    }
                }
                break;

            case 'bullet_fired':
                if (this.renderer && this.renderer.particles) {
                    this.renderer.particles.spawnBullet(data.x, data.y, data.vx, data.vy, data.shooter_id, data.color, data.damage || 25, data.weapon_type || 'pistol');
                    if (data.shooter_id !== this.playerId && window.soundEngine) {
                        if (data.weapon_type === 'shotgun') window.soundEngine.playShotgunShot?.() || window.soundEngine.playBlasterShot();
                        else if (data.weapon_type === 'ak47') window.soundEngine.playAk47Shot?.() || window.soundEngine.playBlasterShot();
                        else window.soundEngine.playBlasterShot();
                    }
                }
                break;

            case 'chat':
                this.ui.addChatMessage(data.sender, data.text, data.color, data.time);
                break;

            case 'game_won':
                if (window.soundEngine) window.soundEngine.playVictory();
                this.ui.showVictoryModal(data.winner_name, data.winner_color, data.subtext, data.rankings, this.localPlayer, this.otherPlayers);
                break;

            case 'error':
                alert(data.message);
                break;
        }
    }


    sendPlayerUpdate() {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN || !this.localPlayer) return;

        this.ws.send(JSON.stringify({
            type: 'player_update',
            x: this.localPlayer.x,
            y: this.localPlayer.y,
            vx: this.localPlayer.vx,
            vy: this.localPlayer.vy,
            altitude: this.localPlayer.altitude,
            is_grounded: this.localPlayer.isGrounded,
            facing: this.localPlayer.facing,
            anim: this.localPlayer.anim,
            is_ghost: this.localPlayer.isGhost
        }));
    }

    sendPush(targetId, forceX, forceY) {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
        this.ws.send(JSON.stringify({
            type: 'player_push',
            target_id: targetId,
            force_x: forceX,
            force_y: forceY
        }));
    }

    sendSkill(skillName, data) {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
        this.ws.send(JSON.stringify({
            type: 'use_skill',
            skill: skillName,
            data: data
        }));
    }

    sendShootBullet(x, y, vx, vy, color, damage = 25, weaponType = 'pistol') {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
        this.ws.send(JSON.stringify({
            type: 'shoot_bullet',
            x: x,
            y: y,
            vx: vx,
            vy: vy,
            color: color,
            damage: damage,
            weapon_type: weaponType
        }));
    }

    sendHitPlayer(targetId, damage, forceX, forceY) {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
        this.ws.send(JSON.stringify({
            type: 'hit_player',
            target_id: targetId,
            damage: damage,
            force_x: forceX,
            force_y: forceY
        }));
    }

    sendPlayerDied(cause, x, y) {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
        this.ws.send(JSON.stringify({
            type: 'player_died',
            cause: cause,
            x: x,
            y: y
        }));
    }

    sendItemCollected(itemId, itemType = 'pistol') {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
        this.ws.send(JSON.stringify({
            type: 'item_collected',
            item_id: itemId,
            item_type: itemType
        }));
    }

    sendAmmoCollected(ammoId) {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
        this.ws.send(JSON.stringify({
            type: 'ammo_collected',
            ammo_id: ammoId
        }));
    }

    sendHostPower(powerName, args) {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
        this.ws.send(JSON.stringify({
            type: 'host_power',
            power: powerName,
            args: args
        }));
    }


    sendChat(text) {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN || !text.trim()) return;
        this.ws.send(JSON.stringify({
            type: 'chat_message',
            text: text
        }));
    }

    sendWin() {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
        this.ws.send(JSON.stringify({
            type: 'player_win'
        }));
    }

    sendFakeSummitTouch(summitId, x, y) {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
        this.ws.send(JSON.stringify({
            type: 'fake_summit_touch',
            summit_id: summitId,
            x: x,
            y: y
        }));
    }

    setFreeCameraMode(active) {
        this.isFreeCamera = active;
        const camBtn = document.getElementById('host-btn-cam-mode');
        if (camBtn) {
            camBtn.textContent = active ? '🎮 Entrar como Jogador' : '👁️ Câmera Livre';
            camBtn.classList.toggle('active', active);
        }
        if (this.ui.skillBarEl) {
            this.ui.skillBarEl.style.display = active ? 'none' : 'flex';
        }
        if (this.localPlayer) {
            if (active) {
                this.localPlayer.isGhost = true;
                this.localPlayer.vx = 0;
                this.localPlayer.vy = 0;
            } else {
                this.localPlayer.isGhost = false;
            }
        }
    }

    toggleViewerMode() {
        this.isViewerModeActive = !this.isViewerModeActive;
        const btn = document.getElementById('host-btn-viewer');
        if (btn) btn.classList.toggle('active', this.isViewerModeActive);

        if (this.isViewerModeActive) {
            this.setFreeCameraMode(true);
            this.viewerTimer = 5.0; // Trigger immediate pick
            this.viewerTargetId = null;
            this.ui.addChatMessage('Sistema', '📺 Modo Visualizador ATIVADO! A câmera acompanhará um jogador aleatório a cada 5s.', '#38bdf8');
        } else {
            const spotlightEl = document.getElementById('spotlightCard');
            if (spotlightEl && !this.isAutoHostActive) {
                spotlightEl.style.display = 'none';
            }
            this.ui.addChatMessage('Sistema', '📺 Modo Visualizador DESATIVADO.', '#94a3b8');
        }
    }

    focusCameraOnPlayer(playerId) {
        let target = null;
        if (this.localPlayer && this.localPlayer.id === playerId) target = this.localPlayer;
        else if (this.otherPlayers[playerId]) target = this.otherPlayers[playerId];
        if (target) {
            this.renderer.camera.x = target.x + target.w / 2;
            this.renderer.camera.y = target.y + target.h / 2;
        }
    }

    playOpeningCinematic(data) {
        if (this.autoStart) {
            this.finishOpeningCinematic();
            return;
        }

        this.gameState = 'cinematic';
        const hostName = data.host_name || 'O Anfitrião';
        const hostColor = data.host_color || '#ef4444';
        const playersList = data.players || [
            ...(this.localPlayer ? [{ name: this.localPlayer.name, color: this.localPlayer.color, is_host: this.isHost }] : []),
            ...Object.values(this.otherPlayers).map(p => ({ name: p.name, color: p.color, is_host: p.isHost, is_bot: p.isBot }))
        ];

        this.ui.showCinematic(true, hostName, hostColor, playersList, 3);
        if (window.soundEngine && window.soundEngine.playCinematicIntro) {
            window.soundEngine.playCinematicIntro();
        }

        let count = 3;
        if (this.cinematicInterval) clearInterval(this.cinematicInterval);
        this.cinematicInterval = setInterval(() => {
            count--;
            if (count > 0) {
                this.ui.updateCinematicCountdown(count);
                if (window.soundEngine && window.soundEngine.playJump) window.soundEngine.playJump();
            } else if (count === 0) {
                this.ui.updateCinematicCountdown(0);
                if (window.soundEngine && window.soundEngine.playBattleStartHorn) {
                    window.soundEngine.playBattleStartHorn();
                }
            } else {
                this.finishOpeningCinematic();
            }
        }, 1100);
    }

    finishOpeningCinematic() {
        if (this.cinematicInterval) {
            clearInterval(this.cinematicInterval);
            this.cinematicInterval = null;
        }
        this.gameState = 'playing';
        this.ui.showCinematic(false);
        this.ui.showHostToolbar(this.isHost);
        window.focus();
        if (document.activeElement && document.activeElement !== this.ui.chatInputEl) {
            document.activeElement.blur();
        }
        if (window.soundEngine && window.soundEngine.playBattleStartHorn) {
            window.soundEngine.playBattleStartHorn();
        }
    }

    setupGameInputs() {
        // Ensure clicking canvas focuses the game and releases trapped inputs
        this.canvas.addEventListener('click', () => {
            window.focus();
            if (document.activeElement && document.activeElement !== this.ui.chatInputEl) {
                document.activeElement.blur();
            }
        });

        window.addEventListener('keydown', (e) => {
            const active = document.activeElement;
            if (active === this.ui.chatInputEl || (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA') && active.id !== 'gameCanvas')) {
                return;
            }

            const code = e.code || '';
            const key = (e.key || '').toLowerCase();

            // Shift Turbo for Free Camera
            if (code === 'ShiftLeft' || code === 'ShiftRight' || key === 'shift') {
                this.freeCamInput.turbo = true;
            }

            const isLeft = code === 'KeyA' || code === 'ArrowLeft' || key === 'a' || key === 'arrowleft';
            const isRight = code === 'KeyD' || code === 'ArrowRight' || key === 'd' || key === 'arrowright';
            const isUp = code === 'KeyW' || code === 'ArrowUp' || key === 'w' || key === 'arrowup';
            const isDown = code === 'KeyS' || code === 'ArrowDown' || key === 's' || key === 'arrowdown';
            const isShoot = code === 'KeyF' || key === 'f';
            const isShove = code === 'Space' || key === ' ';

            if (this.isFreeCamera) {
                // Free Camera Navigation
                if (isLeft) this.freeCamInput.left = true;
                if (isRight) this.freeCamInput.right = true;
                if (isUp) this.freeCamInput.up = true;
                if (isDown) this.freeCamInput.down = true;
                if (code === 'PageUp') this.renderer.camera.y -= 400;
                if (code === 'PageDown') this.renderer.camera.y += 400;
            } else {
                // Player Character Movement
                if (isLeft) {
                    if (this.localPlayer) this.localPlayer.input.left = true;
                }
                if (isRight) {
                    if (this.localPlayer) this.localPlayer.input.right = true;
                }
                if (isUp) {
                    if (this.localPlayer && !this.localPlayer.input.jump) {
                        this.localPlayer.input.jump = true;
                        this.localPlayer.jump(this.physics, this.renderer.particles);
                    }
                }

                // SPACE: Cotovelada / Empurrão (Elbow Bump)
                if (isShove) {
                    if (this.localPlayer) {
                        this.localPlayer.shove(this.physics, this.otherPlayers, this, this.renderer.particles);
                    }
                }

                // F: Atirar com a Arminha da Cintura na direção do mouse
                if (isShoot) {
                    if (this.localPlayer) {
                        this.localPlayer.shoot(this.renderer.particles, this, this.mouseWorldX, this.mouseWorldY);
                    }
                }

                // Skills 1 to 3
                if (e.key === '1') this.useLocalSkill('triple_jump');
                if (e.key === '2') this.useLocalSkill('ghost');
                if (e.key === '3') this.useLocalSkill('balloon');
            }
        });

        window.addEventListener('keyup', (e) => {
            const code = e.code || '';
            const key = (e.key || '').toLowerCase();

            if (code === 'ShiftLeft' || code === 'ShiftRight' || key === 'shift') {
                this.freeCamInput.turbo = false;
            }

            const isLeft = code === 'KeyA' || code === 'ArrowLeft' || key === 'a' || key === 'arrowleft';
            const isRight = code === 'KeyD' || code === 'ArrowRight' || key === 'd' || key === 'arrowright';
            const isUp = code === 'KeyW' || code === 'ArrowUp' || key === 'w' || key === 'arrowup';
            const isDown = code === 'KeyS' || code === 'ArrowDown' || key === 's' || key === 'arrowdown';

            if (this.isFreeCamera) {
                if (isLeft) this.freeCamInput.left = false;
                if (isRight) this.freeCamInput.right = false;
                if (isUp) this.freeCamInput.up = false;
                if (isDown) this.freeCamInput.down = false;
            } else {
                if (isLeft) {
                    if (this.localPlayer) this.localPlayer.input.left = false;
                }
                if (isRight) {
                    if (this.localPlayer) this.localPlayer.input.right = false;
                }
                if (isUp) {
                    if (this.localPlayer) this.localPlayer.input.jump = false;
                }
            }
        });

        // Mouse Wheel: Ctrl+Wheel for Canvas Zoom, normal wheel to scroll Camera in Free Cam Mode
        this.canvas.addEventListener('wheel', (e) => {
            if (e.ctrlKey) {
                e.preventDefault();
                const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
                this.renderer.zoom = Math.max(0.4, Math.min(3.0, this.renderer.zoom * zoomFactor));
            } else if (this.isFreeCamera) {
                this.renderer.camera.y += e.deltaY * 0.85;
                const halfVisibleH = (this.canvas.height / this.renderer.zoom) / 2;
                this.renderer.camera.y = Math.max(50, Math.min(8000 - halfVisibleH, this.renderer.camera.y));
            }
        }, { passive: false });

        // Mouse Move for Aiming Blaster & Sniper Reticle
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            const worldX = (mouseX - this.canvas.width / 2) / this.renderer.zoom + this.renderer.camera.x;
            const worldY = (mouseY - this.canvas.height / 2) / this.renderer.zoom + this.renderer.camera.y;

            this.mouseWorldX = worldX;
            this.mouseWorldY = worldY;

            if (this.localPlayer) {
                this.localPlayer.mouseWorldX = worldX;
                this.localPlayer.mouseWorldY = worldY;
                const originX = this.localPlayer.x + this.localPlayer.w / 2;
                const originY = this.localPlayer.y + this.localPlayer.h / 2 + 3;
                this.localPlayer.aimAngle = Math.atan2(worldY - originY, worldX - originX);
            }

            if (this.hostManager) {
                if (this.hostManager.isSniperModeActive) {
                    this.hostManager.sniperAimX = worldX;
                    this.hostManager.sniperAimY = worldY;
                }
                if (this.hostManager.isChainModeActive) {
                    this.hostManager.chainAimX = worldX;
                    this.hostManager.chainAimY = worldY;
                }
                if (this.hostManager.isBlackHoleModeActive) {
                    this.hostManager.blackHoleAimX = worldX;
                    this.hostManager.blackHoleAimY = worldY;
                }
                if (this.hostManager.isFakeSummitModeActive) {
                    this.hostManager.fakeSummitAimX = worldX;
                    this.hostManager.fakeSummitAimY = worldY;
                }
                if (this.hostManager.isBoxingGloveModeActive) {
                    this.hostManager.boxingGloveAimX = worldX;
                    this.hostManager.boxingGloveAimY = worldY;
                }
            }
        });

        // Canvas Click for Sniper Fire, Chain Trap, Black Hole, Fake Summit, Boxing Glove, or Player Blaster Shoot
        this.canvas.addEventListener('click', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            const worldX = (mouseX - this.canvas.width / 2) / this.renderer.zoom + this.renderer.camera.x;
            const worldY = (mouseY - this.canvas.height / 2) / this.renderer.zoom + this.renderer.camera.y;

            if (this.hostManager && this.hostManager.isSniperModeActive) {
                this.hostManager.handleSniperClick(worldX, worldY, {
                    ...this.otherPlayers,
                    [this.localPlayer.id]: this.localPlayer
                });
            } else if (this.hostManager && this.hostManager.isChainModeActive) {
                this.hostManager.handleChainClick(worldX, worldY, {
                    ...this.otherPlayers,
                    [this.localPlayer.id]: this.localPlayer
                }, this.map);
            } else if (this.hostManager && this.hostManager.isBlackHoleModeActive) {
                this.hostManager.handleBlackHoleClick(worldX, worldY);
            } else if (this.hostManager && this.hostManager.isFakeSummitModeActive) {
                this.hostManager.handleFakeSummitClick(worldX, worldY);
            } else if (this.hostManager && this.hostManager.isBoxingGloveModeActive) {
                this.hostManager.handleBoxingGloveClick(worldX, worldY);
            } else if (!this.isFreeCamera && this.localPlayer) {
                // Shoot waist blaster on left click pointing directly where clicked!
                this.localPlayer.shoot(this.renderer.particles, this, worldX, worldY);
            }
        });
    }

    useLocalSkill(skillKey) {
        if (this.localPlayer && !this.isFreeCamera) {
            this.localPlayer.useSkill(skillKey, this, this.renderer.particles);
        }
    }

    setupLobbyUI() {
        const colorOptions = document.querySelectorAll('.color-dot-choice');
        colorOptions.forEach(opt => {
            opt.addEventListener('click', () => {
                colorOptions.forEach(o => o.classList.remove('active'));
                opt.classList.add('active');
                this.selectedColor = opt.getAttribute('data-color');
            });
        });

        // Host Role Selector (Player vs Spectator)
        const roleOptions = document.querySelectorAll('#hostRolePickerRow .host-role-opt');
        roleOptions.forEach(opt => {
            opt.addEventListener('click', () => {
                roleOptions.forEach(o => o.classList.remove('active'));
                opt.classList.add('active');
                this.hostSelectedRole = opt.getAttribute('data-role') || 'player';
            });
        });

        // Match Duration Selector
        const durationOptions = document.querySelectorAll('#durationPickerRow .duration-opt');
        durationOptions.forEach(opt => {
            opt.addEventListener('click', () => {
                durationOptions.forEach(o => o.classList.remove('active'));
                opt.classList.add('active');
                this.selectedDurationMinutes = parseInt(opt.getAttribute('data-duration')) || 10;
            });
        });

        // Hunter Bot Selector
        const hunterOptions = document.querySelectorAll('#hunterPickerRow .hunter-opt-btn');
        hunterOptions.forEach(opt => {
            opt.addEventListener('click', () => {
                hunterOptions.forEach(o => o.classList.remove('active'));
                opt.classList.add('active');
                this.selectedHunter = parseInt(opt.getAttribute('data-hunter')) || 0;
            });
        });

        // Bot Count Selector
        const botOptions = document.querySelectorAll('#botsPickerRow .bot-opt-btn');
        botOptions.forEach(opt => {
            opt.addEventListener('click', () => {
                botOptions.forEach(o => o.classList.remove('active'));
                opt.classList.add('active');
                this.selectedBotCount = parseInt(opt.getAttribute('data-bots')) || 0;
            });
        });

        // Quick Play / Test Solo Button (Host Starts Instantly in Local Offline Mode)
        document.getElementById('btnQuickPlay')?.addEventListener('click', () => {
            const name = document.getElementById('nicknameInput').value.trim() || 'Host';
            window.soundEngine.init();
            this.startLocalSoloGame(name, this.selectedColor);
        });

        // Create Room Button
        document.getElementById('btnCreateRoom').addEventListener('click', () => {
            const name = document.getElementById('nicknameInput').value.trim() || 'Jogador';
            this.autoStart = false;
            this.createRoom(name, this.selectedColor);
        });

        // Auto-fill room code from URL parameter (?room=ABCD)
        const urlParams = new URLSearchParams(window.location.search);
        const roomParam = urlParams.get('room');
        if (roomParam) {
            const roomInput = document.getElementById('roomCodeInput');
            if (roomInput) {
                roomInput.value = roomParam.trim().toUpperCase();
            }
        }

        // Join Room Button
        document.getElementById('btnJoinRoom').addEventListener('click', () => {
            const name = document.getElementById('nicknameInput').value.trim() || 'Jogador';
            const code = document.getElementById('roomCodeInput').value.trim().toUpperCase();
            if (!code) {
                alert('Digite o código da sala!');
                return;
            }
            this.joinRoom(code, name, this.selectedColor);
        });

        // Copy Room Code Button
        document.getElementById('btnCopyCode').addEventListener('click', () => {
            if (this.roomCode) {
                navigator.clipboard.writeText(this.roomCode);
                alert(`Código '${this.roomCode}' copiado para a área de transferência!`);
            }
        });

        // Lobby Copy Link/Code Button
        document.getElementById('lobbyCopyBtn')?.addEventListener('click', () => {
            if (this.roomCode) {
                const shareUrl = `${window.location.origin}?room=${this.roomCode}`;
                navigator.clipboard.writeText(shareUrl).then(() => {
                    alert(`Link da sala copiado!\n${shareUrl}`);
                }).catch(() => {
                    navigator.clipboard.writeText(this.roomCode);
                    alert(`Código '${this.roomCode}' copiado!`);
                });
            }
        });

        // Lobby Start Game (Host Button)
        document.getElementById('btnLobbyStartGame')?.addEventListener('click', () => {
            if (this.ws && this.isHost) {
                this.ws.send(JSON.stringify({
                    type: 'start_game'
                }));
            }
        });

        // Skip Opening Cinematic Button
        document.getElementById('btnSkipCinematic')?.addEventListener('click', () => {
            this.finishOpeningCinematic();
        });

        // Exit Room Button
        document.getElementById('btnLeaveRoom').addEventListener('click', () => {
            if (confirm('Deseja sair da sala?')) {
                window.location.reload();
            }
        });
    }

    setupChatUI() {
        const sendAction = () => {
            const text = this.ui.chatInputEl.value;
            if (text.trim()) {
                this.sendChat(text);
                this.ui.chatInputEl.value = '';
            }
        };

        this.ui.chatSendBtn.addEventListener('click', sendAction);
        this.ui.chatInputEl.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                sendAction();
            }
        });
    }

    setupHostControls() {
        // Toggle Auto-Host (Caos IA Mode)
        document.getElementById('host-btn-autohost')?.addEventListener('click', () => {
            this.hostManager.triggerToggleAutoHost();
        });

        // Toggle Viewer Mode (Modo Visualizador 5s)
        document.getElementById('host-btn-viewer')?.addEventListener('click', () => {
            this.toggleViewerMode();
        });

        // Toggle Host Camera Mode (Free Camera vs Player Mode)
        document.getElementById('host-btn-cam-mode')?.addEventListener('click', () => {
            this.setFreeCameraMode(!this.isFreeCamera);
        });

        // Host Adjust Match Time (+1 Min / -1 Min)
        document.getElementById('host-btn-time-add')?.addEventListener('click', () => {
            this.hostManager.triggerAdjustTime(60);
        });

        document.getElementById('host-btn-time-sub')?.addEventListener('click', () => {
            this.hostManager.triggerAdjustTime(-60);
        });

        // Host End Game Immediately
        document.getElementById('host-btn-end-game')?.addEventListener('click', () => {
            this.hostManager.triggerEndGame();
        });

        // Toggle Lights (Blackout / Darkness)
        document.getElementById('host-btn-blackout')?.addEventListener('click', () => {
            this.hostManager.triggerToggleBlackout();
        });

        // Gravity is now controlled via #host-gravity-slider (range input) — see below
        // Bebedeira / Drunk Controls
        document.getElementById('host-btn-drunk')?.addEventListener('click', () => {
            this.hostManager.triggerDrunkControls();
        });

        // Buraco Negro / Black Hole
        document.getElementById('host-btn-blackhole')?.addEventListener('click', () => {
            const active = this.hostManager.toggleBlackHoleMode();
            document.getElementById('host-btn-blackhole')?.classList.toggle('active', active);
        });

        // Míssil de Galinha
        document.getElementById('host-btn-chicken')?.addEventListener('click', () => {
            this.hostManager.triggerChickenMissile();
        });

        // Roleta Russa / Swap Players
        document.getElementById('host-btn-swap')?.addEventListener('click', () => {
            this.hostManager.triggerSwapPlayers();
        });

        // Modo Matrix / Slowmo
        document.getElementById('host-btn-matrix')?.addEventListener('click', () => {
            this.hostManager.triggerMatrixSlowmo();
        });

        // Flashbang
        document.getElementById('host-btn-flashbang')?.addEventListener('click', () => {
            this.hostManager.triggerFlashbang();
        });

        // Falso Cume / Fake Summit
        document.getElementById('host-btn-fakesummit')?.addEventListener('click', () => {
            const active = this.hostManager.toggleFakeSummitMode();
            document.getElementById('host-btn-fakesummit')?.classList.toggle('active', active);
        });

        // Modo Rei da Montanha
        document.getElementById('host-btn-kinghill')?.addEventListener('click', () => {
            this.hostManager.triggerToggleKingOfHill();
        });

        // Metamorfose da Galinha
        document.getElementById('host-btn-chicken-morph')?.addEventListener('click', () => {
            this.hostManager.triggerChickenMorph();
        });

        // Luva de Boxe em Mola
        document.getElementById('host-btn-boxing-glove')?.addEventListener('click', () => {
            const active = this.hostManager.toggleBoxingGloveMode();
            document.getElementById('host-btn-boxing-glove')?.classList.toggle('active', active);
        });

        // Chuva de Cascas de Banana
        document.getElementById('host-btn-banana-rain')?.addEventListener('click', () => {
            this.hostManager.triggerBananaRain();
        });

        // Abdução Alienígena
        document.getElementById('host-btn-ufo')?.addEventListener('click', () => {
            this.hostManager.triggerUfoAbduction();
        });

        // Mundo Invertido (180º)
        document.getElementById('host-btn-inverted-world')?.addEventListener('click', () => {
            this.hostManager.triggerInvertedWorld();
        });

        // Efeito Elástico Global
        document.getElementById('host-btn-rubberband')?.addEventListener('click', () => {
            this.hostManager.triggerRubberband();
        });

        // Host God Powers Buttons
        document.getElementById('host-btn-sniper')?.addEventListener('click', () => {
            const active = this.hostManager.toggleSniperMode();
            const btn = document.getElementById('host-btn-sniper');
            btn.classList.toggle('active', active);
            document.getElementById('host-btn-chain')?.classList.remove('active');
        });

        // Encorrentar / Chain Power
        document.getElementById('host-btn-chain')?.addEventListener('click', () => {
            const active = this.hostManager.toggleChainMode();
            const btn = document.getElementById('host-btn-chain');
            btn.classList.toggle('active', active);
            document.getElementById('host-btn-sniper')?.classList.remove('active');
        });

        document.getElementById('host-btn-earthquake')?.addEventListener('click', () => {
            this.hostManager.triggerEarthquake();
        });

        document.getElementById('host-btn-wind-left')?.addEventListener('click', () => {
            this.hostManager.triggerWind(-1);
        });

        document.getElementById('host-btn-wind-right')?.addEventListener('click', () => {
            this.hostManager.triggerWind(1);
        });

        document.getElementById('host-btn-boulder')?.addEventListener('click', () => {
            this.hostManager.triggerBoulderDrop();
        });

        document.getElementById('host-btn-meteor')?.addEventListener('click', () => {
            this.hostManager.triggerBoulderDrop();
        });

        // Gravity Slider
        const gravitySlider = document.getElementById('host-gravity-slider');
        const gravityVal = document.getElementById('gravity-slider-val');
        if (gravitySlider) {
            gravitySlider.addEventListener('input', () => {
                const scale = parseFloat(gravitySlider.value);
                if (gravityVal) gravityVal.textContent = scale.toFixed(1) + 'x';
                this.sendHostPower('set_gravity', { scale: scale });
            });
        }

        // Host Seasons Buttons (Primavera, Verão, Outono, Inverno)
        document.querySelectorAll('.host-btn-season').forEach(btn => {
            btn.addEventListener('click', () => {
                const season = btn.dataset.season || 'spring';
                this.hostManager.triggerSetSeason(season);
            });
        });

        // Host Lava Toggle Button
        document.getElementById('host-btn-lava')?.addEventListener('click', () => {
            this.hostManager.triggerToggleLava();
        });

        // Host Clean View Mode (Ocultar menus e ver mapa inteiro)
        document.getElementById('host-btn-clean-view')?.addEventListener('click', () => {
            document.body.classList.toggle('clean-view-mode');
            const btn = document.getElementById('host-btn-clean-view');
            if (btn) {
                const isClean = document.body.classList.contains('clean-view-mode');
                btn.classList.toggle('active', isClean);
                btn.textContent = isClean ? '🗺️ Restaurar Menus' : '👁️ Ver Mapa Inteiro';
            }
        });

        // Host Toolbar Minimize Toggle
        document.getElementById('host-btn-minimize')?.addEventListener('click', () => {
            const hostToolbar = document.getElementById('hostToolbar');
            const groups = document.getElementById('host-dock-groups');
            const btn = document.getElementById('host-btn-minimize');
            if (hostToolbar) {
                const isMin = hostToolbar.classList.toggle('host-minimized');
                if (groups) groups.style.display = isMin ? 'none' : '';
                if (btn) btn.textContent = isMin ? '➕ Expandir' : '➖ Minimizar';
            }
        });

        // Add Hunter Bot (Caçador)
        document.getElementById('host-btn-add-hunter')?.addEventListener('click', () => {
            this.hostManager.triggerAddHunterBot();
        });

        document.getElementById('host-btn-reset')?.addEventListener('click', () => {
            this.hostManager.triggerResetAll();
        });
    }

    toggleDockGroup(groupId) {
        const groupEl = document.getElementById(groupId);
        if (!groupEl) return;
        const btn = groupEl.querySelector('.group-min-btn');
        const isMin = groupEl.classList.toggle('group-minimized');
        if (btn) btn.textContent = isMin ? '+' : '−';
    }



    setupSkillUI() {
        const skills = ['triple_jump', 'ghost', 'balloon'];
        skills.forEach(skillKey => {
            document.getElementById(`skill-btn-${skillKey}`)?.addEventListener('click', () => {
                this.useLocalSkill(skillKey);
            });
        });
    }

    gameLoop(timestamp) {
        let dt = Math.min((timestamp - this.lastTime) / 1000, 0.1);
        this.lastTime = timestamp;

        // Apply Matrix Slowmo Scaling
        if (this.matrixSlowmoTimer > 0) {
            this.matrixSlowmoTimer -= dt;
            dt *= this.matrixSlowmoScale;
            if (this.matrixSlowmoTimer <= 0) {
                const matrixOverlay = document.getElementById('matrixOverlay');
                if (matrixOverlay) matrixOverlay.style.display = 'none';
            }
        }

        // Advance smooth rising lava floor
        if (this.lava && this.lava.active && this.gameState === 'playing') {
            this.lava.y = Math.max(100, this.lava.y - (this.lava.speed || 24.0) * dt);
        }

        if (this.map) {
            // Update Map moving & crumbling platforms with dynamic blackout shifting
            this.map.update(dt, timestamp / 1000, !!(this.modifiers && this.modifiers.blackout));
        }

        if (this.map && this.localPlayer) {
            // Update Local Player Physics (if in player mode)
            if (!this.isFreeCamera) {
                this.physics.updatePlayer(this.localPlayer, this.map, dt, this.modifiers, this.renderer.particles);
                this.localPlayer.update(dt);

                // Check Banana Peel Collision
                if (!this.localPlayer.isGhost && this.renderer.particles && this.renderer.particles.bananaPeels) {
                    const px = this.localPlayer.x + this.localPlayer.w / 2;
                    const py = this.localPlayer.y + this.localPlayer.h / 2;
                    for (let i = 0; i < this.renderer.particles.bananaPeels.length; i++) {
                        const peel = this.renderer.particles.bananaPeels[i];
                        if (peel && peel.alive) {
                            const dist = Math.hypot(px - peel.x, py - peel.y);
                            if (dist < 26) {
                                peel.alive = false;
                                this.renderer.particles.bananaPeels.splice(i, 1);
                                if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                                    this.ws.send(JSON.stringify({
                                        type: 'banana_slip',
                                        banana_id: peel.id,
                                        x: peel.x,
                                        y: peel.y
                                    }));
                                }
                                break;
                            }
                        }
                    }
                }

                // Check Player-to-Player Collisions, Stacking, and Momentum Push
                this.physics.resolvePlayerCollisions(this.localPlayer, this.otherPlayers, (targetId, forceX, forceY) => {
                    this.sendPush(targetId, forceX, forceY);
                });

                // Check Summit / Win Condition (Altitude >= 7900 or Y <= 120)
                if (this.localPlayer.y <= 120) {
                    this.sendWin();
                }
            }

            // Update Remote Players
            for (let rp of Object.values(this.otherPlayers)) {
                rp.update(dt);
            }

            // Sync with Server at ~30 FPS
            if (timestamp - this.lastNetworkSend > 33) {
                this.sendPlayerUpdate();
                this.lastNetworkSend = timestamp;
            }

            // Viewer Mode: automatically follow a random player and switch every 5 seconds
            if (this.isViewerModeActive) {
                this.viewerTimer += dt;
                if (this.viewerTimer >= 5.0 || !this.viewerTargetId) {
                    this.viewerTimer = 0;
                    const candidates = [
                        ...(this.localPlayer && !this.isFreeCamera ? [this.localPlayer] : []),
                        ...Object.values(this.otherPlayers)
                    ];
                    if (candidates.length > 0) {
                        const chosen = candidates[Math.floor(Math.random() * candidates.length)];
                        this.viewerTargetId = chosen.id;
                    } else if (this.localPlayer) {
                        this.viewerTargetId = this.localPlayer.id;
                    }
                }

                if (this.viewerTargetId) {
                    let target = (this.localPlayer && this.localPlayer.id === this.viewerTargetId) ? this.localPlayer : this.otherPlayers[this.viewerTargetId];
                    if (target) {
                        // Smoothly steer camera towards followed player
                        const targetCamX = target.x + target.w / 2;
                        const targetCamY = target.y + target.h / 2;
                        this.renderer.camera.x += (targetCamX - this.renderer.camera.x) * 0.14;
                        this.renderer.camera.y += (targetCamY - this.renderer.camera.y) * 0.14;

                        // Update Spotlight floating card
                        const card = document.getElementById('spotlightCard');
                        if (card) {
                            card.style.display = 'flex';
                            const topBadge = card.querySelector('.spotlight-top-badge span:last-child');
                            if (topBadge) topBadge.textContent = 'VISUALIZADOR AO VIVO (5s)';
                            const nameEl = document.getElementById('spotlightPlayerName');
                            const altEl = document.getElementById('spotlightPlayerAlt');
                            const dotEl = document.getElementById('spotlightAvatarDot');
                            if (nameEl) nameEl.textContent = target.name + (target.isBot ? ' 🤖' : '');
                            if (altEl) altEl.textContent = `${Math.max(0, Math.floor(8000 - target.y))}m de altitude`;
                            if (dotEl) dotEl.style.backgroundColor = target.color || '#3b82f6';
                        }
                    }
                }
            }

            // Update Camera, Particles, and Render Frame
            this.renderer.particles.update(dt, this.map, this.localPlayer, this.otherPlayers);
            if (!this.isViewerModeActive) {
                this.renderer.updateCamera(this.localPlayer, dt, this.isFreeCamera, this.freeCamInput);
            }
            this.renderer.render(
                this.map,
                this.localPlayer,
                this.otherPlayers,
                this.modifiers,
                this.hostManager,
                this.roundTime
            );

            // Update UI elements
            if (!this.isFreeCamera) {
                this.ui.updateSkillBar(this.localPlayer);
            }

            // Throttle heavy DOM updates to ~4 times per second (smooth 60 FPS performance for 50 players!)
            if (!this.lastUiUpdate || timestamp - this.lastUiUpdate > 250) {
                this.ui.updatePlayerList(this.localPlayer, this.otherPlayers);
                this.ui.updateAltitudeBar(this.localPlayer, this.otherPlayers);
                this.lastUiUpdate = timestamp;
            }
        }

        requestAnimationFrame((t) => this.gameLoop(t));
    }
}

function jsonParseSafe(str) {
    try {
        return JSON.parse(str);
    } catch (e) {
        return null;
    }
}

// Initialize on DOM load
window.addEventListener('DOMContentLoaded', () => {
    window.gameClient = new GameClient();
    window.gameApp = window.gameClient;
});
