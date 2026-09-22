// UI Manager - HUD, Chat, Altitude Bar, Modals, Host Toolbar
class UIManager {
    constructor() {
        this.roomCodeEl = document.getElementById('roomCodeDisplay');
        this.playerCountEl = document.getElementById('playerCount');
        this.playerListEl = document.getElementById('playerList');
        this.chatMessagesEl = document.getElementById('chatMessages');
        this.chatInputEl = document.getElementById('chatInput');
        this.chatSendBtn = document.getElementById('chatSendBtn');
        this.timerDisplayEl = document.getElementById('timerDisplay');
        this.altitudeTrackEl = document.getElementById('altitudeTrack');
        this.hostToolbarEl = document.getElementById('hostToolbar');
        this.skillBarEl = document.getElementById('skillBar');
        this.lobbyModalEl = document.getElementById('lobbyModal');
        this.victoryModalEl = document.getElementById('victoryModal');
    }

    setRoomCode(code) {
        if (this.roomCodeEl) {
            this.roomCodeEl.textContent = `Sala: ${code}`;
        }
    }

    updateTimer(seconds) {
        if (!this.timerDisplayEl) return;
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        this.timerDisplayEl.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    updatePlayerList(localPlayer, otherPlayers) {
        if (!this.playerListEl || !this.playerCountEl) return;

        const all = [localPlayer, ...Object.values(otherPlayers)].filter(Boolean);
        // Sort descending by altitude (highest player first)
        all.sort((a, b) => b.altitude - a.altitude);

        this.playerCountEl.textContent = `Jogadores (${all.length}/50)`;

        let html = '';
        all.forEach((p, idx) => {
            const isCrown = (idx === 0);
            const isHost = p.isHost;
            const displayName = p.isLocal ? 'Você' : p.name;

            html += `
                <div class="player-list-item ${p.isLocal ? 'is-local' : ''}" style="cursor: pointer;" onclick="if(window.gameClient) window.gameClient.focusCameraOnPlayer('${p.id}')" title="Clique para focar a câmera neste jogador">
                    <div class="player-list-left">
                        ${isCrown ? '<span class="crown-icon">👑</span>' : isHost ? '<span class="host-icon">⭐</span>' : ''}
                        <span class="player-color-dot" style="background-color: ${p.color};"></span>
                        <span class="player-name-label">${escapeHtml(displayName)}</span>
                    </div>
                    <span class="player-alt-label">${Math.floor(p.altitude || 0)}m</span>
                </div>
            `;
        });
        this.playerListEl.innerHTML = html;
    }

    updateAltitudeBar(localPlayer, otherPlayers) {
        if (!this.altitudeTrackEl) return;

        const all = [localPlayer, ...Object.values(otherPlayers)].filter(Boolean);
        all.sort((a, b) => b.altitude - a.altitude);

        // Clear existing player markers
        const existingMarkers = this.altitudeTrackEl.querySelectorAll('.alt-player-dot');
        existingMarkers.forEach(m => m.remove());

        const maxHeight = Math.max(12000, ...all.map(p => p.altitude || 0));
        const trackHeight = this.altitudeTrackEl.clientHeight || 300;

        all.forEach((p, idx) => {
            const isCrown = (idx === 0);
            // Altitude is 0 (bottom) to 12000 (top).
            // In CSS: bottom: 0% is start, top: 0% is summit.
            const percent = Math.max(0, Math.min(100, (p.altitude / maxHeight) * 100));

            const dot = document.createElement('div');
            dot.className = `alt-player-dot ${isCrown ? 'has-crown' : ''}`;
            dot.style.bottom = `${percent}%`;
            dot.style.backgroundColor = p.color;
            dot.title = `${p.name}: ${Math.floor(p.altitude)}m`;

            if (isCrown) {
                const crown = document.createElement('span');
                crown.className = 'alt-dot-crown';
                crown.textContent = '👑';
                dot.appendChild(crown);
            }

            this.altitudeTrackEl.appendChild(dot);
        });
    }

    addChatMessage(sender, text, color, time) {
        if (!this.chatMessagesEl) return;

        const msgDiv = document.createElement('div');
        msgDiv.className = 'chat-msg';
        msgDiv.innerHTML = `
            <span class="chat-time">${escapeHtml(time || '')}</span>
            <span class="chat-sender" style="color: ${color || '#38bdf8'}">${escapeHtml(sender)}:</span>
            <span class="chat-text">${escapeHtml(text)}</span>
        `;
        this.chatMessagesEl.appendChild(msgDiv);
        this.chatMessagesEl.scrollTop = this.chatMessagesEl.scrollHeight;
    }

    updateSkillCooldowns(player) {
        if (!player || !player.skills) return;

        for (let key in player.skills) {
            const skill = player.skills[key];
            const btn = document.getElementById(`skill-btn-${key}`);
            const cdOverlay = document.getElementById(`skill-cd-${key}`);
            const cdText = document.getElementById(`skill-time-${key}`);

            if (btn && cdOverlay && cdText) {
                if (skill.timer > 0) {
                    btn.classList.add('on-cooldown');
                    const percent = (skill.timer / skill.cooldown) * 100;
                    cdOverlay.style.height = `${percent}%`;
                    cdText.textContent = skill.timer.toFixed(1) + 's';
                    cdText.style.display = 'block';
                } else {
                    btn.classList.remove('on-cooldown');
                    cdOverlay.style.height = '0%';
                    cdText.style.display = 'none';
                }
            }
        }
    }

    showHostToolbar(show) {
        if (this.hostToolbarEl) {
            this.hostToolbarEl.style.display = show ? 'flex' : 'none';
        }
    }

    showLobbyModal(show) {
        if (this.lobbyModalEl) {
            this.lobbyModalEl.style.display = show ? 'flex' : 'none';
        }
    }

    updateAmmoCount(count, weapon = 'pistol') {
        const ammoEl = document.getElementById('ammoCountDisplay');
        const ammoBadge = document.getElementById('ammoBadge');
        if (ammoEl) {
            ammoEl.textContent = count;
        }
        if (ammoBadge) {
            ammoBadge.classList.toggle('has-ammo', count > 0);
            const ammoIconEl = ammoBadge.querySelector('.ammo-icon');
            const ammoTextEl = ammoBadge.querySelector('.ammo-text');
            if (ammoIconEl) {
                ammoIconEl.textContent = weapon === 'shotgun' ? '💥' : (weapon === 'ak47' ? '⚡' : '🔫');
            }
            if (ammoTextEl) {
                ammoTextEl.textContent = weapon === 'shotgun' ? 'SHOTGUN' : (weapon === 'ak47' ? 'AK-47' : 'BALAS');
            }
        }
    }

    showVictoryModal(winnerName, winnerColor, subtext, rankings, localPlayer, otherPlayers) {
        if (this.victoryModalEl) {
            document.getElementById('winnerNameDisplay').textContent = winnerName;
            document.getElementById('winnerNameDisplay').style.color = winnerColor;
            const subtextEl = document.getElementById('winnerSubtextDisplay');
            if (subtextEl) {
                subtextEl.textContent = subtext || 'Alcançou o cume da montanha!';
            }

            const rankingEl = document.getElementById('victoryRankingList');
            if (rankingEl) {
                let list = rankings;
                if (!list || list.length === 0) {
                    const all = [localPlayer, ...Object.values(otherPlayers || {})].filter(Boolean);
                    all.sort((a, b) => (b.altitude || 0) - (a.altitude || 0));
                    list = all.map(p => ({
                        name: p.name,
                        color: p.color,
                        altitude: Math.floor(p.altitude || 0),
                        is_host: p.isHost,
                        is_bot: p.isBot
                    }));
                }

                let html = '';
                list.forEach((p, idx) => {
                    const pos = idx + 1;
                    const podiumClass = pos === 1 ? 'podium-1' : (pos === 2 ? 'podium-2' : (pos === 3 ? 'podium-3' : ''));
                    const posBadge = pos === 1 ? '🥇 1º' : (pos === 2 ? '🥈 2º' : (pos === 3 ? '🥉 3º' : `${pos}º`));
                    const alt = Math.max(0, Math.floor(p.altitude || 0));
                    const percent = Math.min(100, Math.round((alt / 8000) * 100));

                    html += `
                        <div class="ranking-row-item ${podiumClass}">
                            <div class="ranking-left">
                                <span class="ranking-pos-badge">${posBadge}</span>
                                <span class="ranking-dot" style="background-color: ${p.color};"></span>
                                <span class="ranking-name">${escapeHtml(p.name)} ${p.is_host ? '👑' : (p.is_bot ? '🤖' : '')}</span>
                            </div>
                            <div class="ranking-right">
                                <span class="ranking-alt-text">${alt}m (${percent}%)</span>
                                <div class="ranking-bar-track">
                                    <div class="ranking-bar-fill" style="width: ${percent}%;"></div>
                                </div>
                            </div>
                        </div>
                    `;
                });
                rankingEl.innerHTML = html;
            }

            this.victoryModalEl.style.display = 'flex';
        }
    }

    showWaitingLobby(show, roomCode, isHost, localPlayer, otherPlayers) {
        const modal = document.getElementById('waitingLobbyModal');
        if (!modal) return;
        modal.style.display = show ? 'flex' : 'none';

        if (show) {
            const codeEl = document.getElementById('lobbyRoomCode');
            if (codeEl && roomCode) codeEl.textContent = roomCode;

            const hostArea = document.getElementById('lobbyHostArea');
            const guestArea = document.getElementById('lobbyGuestArea');
            if (hostArea) hostArea.style.display = isHost ? 'block' : 'none';
            if (guestArea) guestArea.style.display = isHost ? 'none' : 'block';

            this.updateWaitingLobbyRoster(localPlayer, otherPlayers, isHost);
        }
    }

    updateWaitingLobbyRoster(localPlayer, otherPlayers, isHost) {
        const rosterEl = document.getElementById('lobbyPlayerRoster');
        const countEl = document.getElementById('lobbyPlayerCount');
        if (!rosterEl) return;

        const all = [localPlayer, ...Object.values(otherPlayers || {})].filter(Boolean);
        if (countEl) countEl.textContent = all.length;

        let html = '';
        all.forEach(p => {
            const isPLeader = p.isHost;
            const isBot = p.isBot;
            html += `
                <div class="lobby-player-chip">
                    <span class="lobby-player-dot" style="background-color: ${p.color};"></span>
                    <span class="lobby-chip-name">${escapeHtml(p.name)}</span>
                    ${isPLeader ? '<span class="lobby-chip-crown" title="Anfitrião (Host)">👑</span>' : (isBot ? '<span title="Bot">🤖</span>' : '')}
                </div>
            `;
        });
        rosterEl.innerHTML = html;
    }

    showCinematic(show, hostName, hostColor, playersList, countdownVal = 3) {
        const overlay = document.getElementById('cinematicOverlay');
        if (!overlay) return;
        overlay.style.display = show ? 'flex' : 'none';

        if (show) {
            const bossNameEl = document.getElementById('bossNameDisplay');
            const bossAvatarBody = document.getElementById('bossAvatarBody');
            if (bossNameEl) bossNameEl.textContent = `👑 ${hostName || 'ANFITRIÃO MALIGNO'}`;
            if (bossAvatarBody && hostColor) bossAvatarBody.style.background = `linear-gradient(135deg, #1e1b4b, ${hostColor})`;

            const heroesListEl = document.getElementById('cinematicHeroesList');
            if (heroesListEl && playersList) {
                let html = '';
                const nonHostPlayers = playersList.filter(p => !p.is_host);
                const displayPlayers = nonHostPlayers.length > 0 ? nonHostPlayers : playersList;
                displayPlayers.slice(0, 8).forEach(p => {
                    html += `
                        <div class="hero-sprite-box">
                            <div class="hero-avatar-circle" style="background-color: ${p.color || '#38bdf8'};">
                                ${p.is_bot ? '🤖' : '🧗'}
                            </div>
                            <span class="hero-avatar-name">${escapeHtml(p.name || 'Herói')}</span>
                        </div>
                    `;
                });
                heroesListEl.innerHTML = html;
            }

            this.updateCinematicCountdown(countdownVal);
        }
    }

    updateCinematicCountdown(val) {
        const countEl = document.getElementById('cinematicCountdownTxt');
        if (!countEl) return;
        if (typeof val === 'number') {
            countEl.textContent = val > 0 ? val : 'SUBAM!';
            if (val <= 0) {
                countEl.style.color = '#4ade80';
            } else {
                countEl.style.color = '#facc15';
            }
        } else {
            countEl.textContent = val;
        }
    }
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
