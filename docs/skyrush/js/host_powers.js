// Host / Game Master Powers & Interventions
class HostPowerManager {
    constructor(networkClient, particleSystem) {
        this.network = networkClient;
        this.particles = particleSystem;
        this.isSniperModeActive = false;
        this.sniperAimX = 0;
        this.sniperAimY = 0;
        this.isChainModeActive = false;
        this.chainAimX = 0;
        this.chainAimY = 0;
        this.isBlackHoleModeActive = false;
        this.blackHoleAimX = 0;
        this.blackHoleAimY = 0;
        this.isFakeSummitModeActive = false;
        this.fakeSummitAimX = 0;
        this.fakeSummitAimY = 0;
        this.isBoxingGloveModeActive = false;
        this.hoveredPlayer = null;

        this.powers = {
            sniper: { name: 'Sniper Laser', icon: '🎯', desc: 'Clique para atirar e derrubar um jogador!' },
            chain: { name: 'Encorrentar', icon: '⛓️', desc: 'Clique para prender um jogador no obstáculo mais próximo!' },
            blackhole: { name: 'Buraco Negro', icon: '🧲', desc: 'Clique no mapa para criar um vórtice gravitacional sugador por 5s!' },
            fakesummit: { name: 'Falso Cume', icon: '🏆', desc: 'Clique no mapa para plantar uma linha de chegada troll holográfica!' },
            boxing_glove: { name: 'Luva de Boxe', icon: '🥊', desc: 'Clique no mapa para disparar a luva gigante em mola!' },
            earthquake: { name: 'Terremoto', icon: '🌋', desc: 'Faz tudo tremer e desequilibra todos!' },
            wind_left: { name: 'Vento ⬅️', icon: '🌪️', desc: 'Vendaval empurrando para a esquerda' },
            wind_right: { name: 'Vento ➡️', icon: '💨', desc: 'Vendaval empurrando para a direita' },
            boulder: { name: 'Soltar Rocha', icon: '🪨', desc: 'Solta pedras gigantes do topo que desabam e empurram todos!' }
        };
    }

    resetAimModes() {
        this.isSniperModeActive = false;
        this.isChainModeActive = false;
        this.isBlackHoleModeActive = false;
        this.isFakeSummitModeActive = false;
        this.isBoxingGloveModeActive = false;
        const canvas = document.getElementById('gameCanvas');
        if (canvas) canvas.style.cursor = 'default';
        document.getElementById('host-btn-sniper')?.classList.remove('active');
        document.getElementById('host-btn-chain')?.classList.remove('active');
        document.getElementById('host-btn-blackhole')?.classList.remove('active');
        document.getElementById('host-btn-fakesummit')?.classList.remove('active');
        document.getElementById('host-btn-boxing-glove')?.classList.remove('active');
    }

    toggleBoxingGloveMode() {
        const wasActive = this.isBoxingGloveModeActive;
        this.resetAimModes();
        this.isBoxingGloveModeActive = !wasActive;
        const canvas = document.getElementById('gameCanvas');
        if (canvas) canvas.style.cursor = this.isBoxingGloveModeActive ? 'crosshair' : 'default';
        return this.isBoxingGloveModeActive;
    }

    handleBoxingGloveClick(worldX, worldY) {
        if (!this.isBoxingGloveModeActive) return false;
        if (this.network) {
            this.network.sendHostPower('boxing_punch', {
                x: worldX,
                y: worldY,
                radius: 140
            });
        }
        this.resetAimModes();
        return true;
    }

    toggleSniperMode() {
        const wasActive = this.isSniperModeActive;
        this.resetAimModes();
        this.isSniperModeActive = !wasActive;
        const canvas = document.getElementById('gameCanvas');
        if (canvas) canvas.style.cursor = this.isSniperModeActive ? 'crosshair' : 'default';
        return this.isSniperModeActive;
    }

    toggleChainMode() {
        const wasActive = this.isChainModeActive;
        this.resetAimModes();
        this.isChainModeActive = !wasActive;
        const canvas = document.getElementById('gameCanvas');
        if (canvas) canvas.style.cursor = this.isChainModeActive ? 'crosshair' : 'default';
        return this.isChainModeActive;
    }

    toggleBlackHoleMode() {
        const wasActive = this.isBlackHoleModeActive;
        this.resetAimModes();
        this.isBlackHoleModeActive = !wasActive;
        const canvas = document.getElementById('gameCanvas');
        if (canvas) canvas.style.cursor = this.isBlackHoleModeActive ? 'crosshair' : 'default';
        return this.isBlackHoleModeActive;
    }

    toggleFakeSummitMode() {
        const wasActive = this.isFakeSummitModeActive;
        this.resetAimModes();
        this.isFakeSummitModeActive = !wasActive;
        const canvas = document.getElementById('gameCanvas');
        if (canvas) canvas.style.cursor = this.isFakeSummitModeActive ? 'crosshair' : 'default';
        return this.isFakeSummitModeActive;
    }

    handleBlackHoleClick(worldX, worldY) {
        if (!this.isBlackHoleModeActive) return false;
        if (this.network) {
            this.network.sendHostPower('black_hole', {
                x: worldX,
                y: worldY,
                duration: 5.0,
                radius: 450,
                force: 13.5
            });
        }
        this.resetAimModes();
        return true;
    }

    handleFakeSummitClick(worldX, worldY) {
        if (!this.isFakeSummitModeActive) return false;
        if (this.network) {
            this.network.sendHostPower('fake_summit', {
                x: worldX,
                y: worldY
            });
        }
        this.resetAimModes();
        return true;
    }

    handleChainClick(worldX, worldY, players, map) {
        if (!this.isChainModeActive) return false;

        let hitPlayer = null;
        let minDist = 140; // Generous radius so host can easily hook players

        for (let p of Object.values(players)) {
            if (!p) continue;
            const dx = (p.x + p.w / 2) - worldX;
            const dy = (p.y + p.h / 2) - worldY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < minDist) {
                minDist = dist;
                hitPlayer = p;
            }
        }

        if (hitPlayer) {
            // Find nearest obstacle/platform to anchor chains to
            let nearestPlat = null;
            let minPlatDist = 99999;
            const px = hitPlayer.x + hitPlayer.w / 2;
            const py = hitPlayer.y + hitPlayer.h / 2;

            if (map && map.platforms) {
                for (let plat of map.platforms) {
                    if (!plat.solid || plat.isBroken) continue;
                    const closestX = Math.max(plat.x, Math.min(plat.x + plat.w, px));
                    const closestY = Math.max(plat.y, Math.min(plat.y + plat.h, py));
                    const d = Math.hypot(closestX - px, closestY - py);
                    if (d < minPlatDist) {
                        minPlatDist = d;
                        nearestPlat = { x: closestX, y: closestY };
                    }
                }
            }

            const anchorX = nearestPlat ? nearestPlat.x : (px + 35);
            const anchorY = nearestPlat ? nearestPlat.y : (py + 35);

            if (this.network) {
                this.network.sendHostPower('chain', {
                    target_id: hitPlayer.id,
                    anchor_x: anchorX,
                    anchor_y: anchorY,
                    duration: 2.0
                });
            }

            // Immediately set local visual effect if local target
            if (typeof hitPlayer.setChained === 'function') {
                hitPlayer.setChained(anchorX, anchorY, 2.0);
            } else {
                hitPlayer.isChained = true;
                hitPlayer.chainTimer = 2.0;
                hitPlayer.chainAnchorX = anchorX;
                hitPlayer.chainAnchorY = anchorY;
            }

            return true;
        }
        return false;
    }

    handleSniperClick(worldX, worldY, players) {
        if (!this.isSniperModeActive) return false;

        let hitPlayer = null;
        let minDist = 65;

        for (let p of Object.values(players)) {
            const dx = (p.x + p.w / 2) - worldX;
            const dy = (p.y + p.h / 2) - worldY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < minDist) {
                minDist = dist;
                hitPlayer = p;
            }
        }

        const targetId = hitPlayer ? hitPlayer.id : null;
        const targetX = hitPlayer ? hitPlayer.x + hitPlayer.w / 2 : worldX;
        const targetY = hitPlayer ? hitPlayer.y + hitPlayer.h / 2 : worldY;

        if (this.network) {
            this.network.sendHostPower('sniper', {
                target_id: targetId,
                x: targetX,
                y: targetY
            });
        }

        return true;
    }

    triggerEarthquake() {
        if (this.network) {
            this.network.sendHostPower('earthquake', { duration: 6.0 });
        }
    }

    triggerWind(direction) {
        if (this.network) {
            this.network.sendHostPower('wind', { direction: direction, duration: 8.0 });
        }
    }

    triggerBoulderDrop() {
        if (this.network) {
            this.network.sendHostPower('boulder_drop', {});
        }
    }

    triggerMeteorShower() {
        this.triggerBoulderDrop();
    }

    triggerAddBots(count = 5) {
        if (this.network) {
            this.network.sendHostPower('add_bots', { count: count });
        }
    }

    triggerToggleBlackout() {
        if (this.network) {
            this.network.sendHostPower('toggle_blackout', {});
        }
    }

    triggerToggleGravity() {
        if (this.network) {
            this.network.sendHostPower('toggle_gravity', {});
        }
    }

    triggerResetAll() {
        if (confirm('Tem certeza que deseja reiniciar todos os jogadores para o início?')) {
            if (this.network) {
                this.network.sendHostPower('reset_all', {});
            }
        }
    }

    triggerDrunkControls() {
        if (this.network) {
            this.network.sendHostPower('drunk_controls', { duration: 4.0 });
        }
    }

    triggerChickenMissile() {
        if (this.network) {
            this.network.sendHostPower('chicken_missile', {});
        }
    }

    triggerSwapPlayers() {
        if (this.network) {
            this.network.sendHostPower('swap_players', {});
        }
    }

    triggerMatrixSlowmo() {
        if (this.network) {
            this.network.sendHostPower('matrix_slowmo', { duration: 5.0, scale: 0.3 });
        }
    }

    triggerFlashbang() {
        if (this.network) {
            this.network.sendHostPower('flashbang', { duration: 0.5 });
        }
    }

    triggerToggleKingOfHill() {
        if (this.network) {
            this.network.sendHostPower('toggle_king_of_hill', {});
        }
    }

    triggerAdjustTime(deltaSeconds) {
        if (this.network) {
            this.network.sendHostPower('adjust_time', { delta: deltaSeconds });
        }
    }

    triggerEndGame() {
        if (confirm('Deseja realmente encerrar a partida agora? O jogador na maior altitude será coroado vencedor!')) {
            if (this.network) {
                this.network.sendHostPower('end_game', {});
            }
        }
    }

    triggerToggleAutoHost() {
        if (this.network) {
            this.network.sendHostPower('toggle_auto_host', {});
        }
    }

    triggerChickenMorph() {
        if (this.network) {
            this.network.sendHostPower('chicken_morph', {});
        }
    }

    triggerBoxingGlove() {
        const active = this.toggleBoxingGloveMode();
        const btn = document.getElementById('host-btn-boxing-glove');
        if (btn) btn.classList.toggle('active', active);
    }

    triggerBananaRain() {
        if (this.network) {
            this.network.sendHostPower('banana_rain', {});
        }
    }

    triggerUfoAbduction() {
        if (this.network) {
            this.network.sendHostPower('ufo_abduction', {});
        }
    }

    triggerInvertedWorld() {
        if (this.network) {
            this.network.sendHostPower('inverted_world', { duration: 4.0 });
        }
    }

    triggerRubberband() {
        if (this.network) {
            this.network.sendHostPower('rubberband', {});
        }
    }

    triggerAddHunterBot() {
        if (this.network) {
            this.network.sendHostPower('add_hunter', {});
        }
    }

    triggerSetSeason(season) {
        if (this.network) {
            this.network.sendHostPower('set_season', { season: season });
        }
    }

    triggerToggleLava(active = null, speed = 18.0) {
        if (this.network) {
            this.network.sendHostPower('toggle_lava', { active: active, speed: speed });
        }
    }
}

