// Canvas 2D Game Renderer & Visual Effects
if (typeof CanvasRenderingContext2D !== 'undefined' && !CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, radii) {
        if (!radii) radii = 0;
        let r = typeof radii === 'number' ? radii : (Array.isArray(radii) ? radii[0] : 0);
        r = Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2);
        this.beginPath();
        this.moveTo(x + r, y);
        this.arcTo(x + w, y, x + w, y + h, r);
        this.arcTo(x + w, y + h, x, y + h, r);
        this.arcTo(x, y + h, x, y, r);
        this.arcTo(x, y, x + w, y, r);
        this.closePath();
        return this;
    };
}

class Boulder {
    constructor(x, y, radius, vx = 0, vy = 1) {
        this.x = x;
        this.y = y;
        this.radius = radius || 38;
        this.vx = vx || (Math.random() - 0.5) * 2;
        this.vy = vy || 1.0;
        this.rotation = Math.random() * Math.PI * 2;
        this.angularVelocity = this.vx * 0.05;
        this.alive = true;
        this.bounceCount = 0;
        
        // Generate crag points for procedural rock shape
        this.cragPoints = [];
        const numPoints = 12;
        for (let i = 0; i < numPoints; i++) {
            const angle = (i / numPoints) * Math.PI * 2;
            const variance = 0.80 + Math.random() * 0.40;
            this.cragPoints.push({
                x: Math.cos(angle) * this.radius * variance,
                y: Math.sin(angle) * this.radius * variance
            });
        }
    }

    update(dt, map, localPlayer, otherPlayers, particleSystem) {
        // Boulder downward acceleration (relentless cascade - reduced for smoother gameplay)
        this.vy += 0.28;
        this.x += this.vx;
        this.y += this.vy;

        this.angularVelocity = this.vx * 0.05;
        this.rotation += this.angularVelocity;

        // Bounce on boundary walls
        if (this.x - this.radius < 60) {
            this.x = 60 + this.radius;
            this.vx = Math.abs(this.vx) * 0.8 + 1.5;
            if (particleSystem) particleSystem.emitBoulderDust(this.x, this.y, this.radius);
        } else if (this.x + this.radius > 2940) {
            this.x = 2940 - this.radius;
            this.vx = -Math.abs(this.vx) * 0.8 - 1.5;
            if (particleSystem) particleSystem.emitBoulderDust(this.x, this.y, this.radius);
        }

        // Collision with local player & other players (ALWAYS pushes DOWNWARD without flinging to map edges!)
        if (localPlayer && !localPlayer.isGhost && !localPlayer.isDead) {
            const px = localPlayer.x + localPlayer.w / 2;
            const py = localPlayer.y + localPlayer.h / 2;
            const dx = px - this.x;
            const dy = py - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const hitDist = this.radius + 20;

            if (dist < hitDist) {
                const shoveDir = dx >= 0 ? 1 : -1;
                localPlayer.pushVx = shoveDir * (2.0 + Math.random() * 2.5); // Minimal horizontal jitter
                localPlayer.pushVy = 14.0 + (this.radius / 35) * 4.0; // PUSH HARD DOWNWARD!
                localPlayer.isStunned = true;
                localPlayer.stunTimer = 0.45;
                if (particleSystem) {
                    particleSystem.emitBoulderImpact(px, py, this.radius);
                }
                if (window.soundEngine) {
                    window.soundEngine.playBoulderCrash();
                }
            }
        }

        if (otherPlayers) {
            for (let op of Object.values(otherPlayers)) {
                if (op && !op.isGhost && !op.isDead) {
                    const px = op.x + op.w / 2;
                    const py = op.y + op.h / 2;
                    const dist = Math.hypot(px - this.x, py - this.y);
                    if (dist < this.radius + 20) {
                        const shoveDir = px >= this.x ? 1 : -1;
                        op.pushVx = shoveDir * (2.0 + Math.random() * 2.5);
                        op.pushVy = 14.0 + (this.radius / 35) * 4.0;
                    }
                }
            }
        }

        // Trail emission during plunge
        if (particleSystem && Math.random() < 0.45) {
            particleSystem.emitBoulderTrail(this.x, this.y, this.radius);
        }

        if (this.y > 10300) {
            this.alive = false;
        }
    }
}

class BlackHoleVortex {
    constructor(x, y, duration = 5.0, radius = 450, force = 13.5) {
        this.x = x;
        this.y = y;
        this.duration = duration;
        this.timer = duration;
        this.radius = radius;
        this.force = force;
        this.rotation = 0;
        this.alive = true;
    }

    update(dt, particleSystem) {
        this.timer -= dt;
        this.rotation += dt * 4.5;
        if (this.timer <= 0) {
            this.alive = false;
        }
        if (particleSystem && Math.random() < 0.8) {
            const angle = Math.random() * Math.PI * 2;
            const dist = 50 + Math.random() * (this.radius - 50);
            const sx = this.x + Math.cos(angle) * dist;
            const sy = this.y + Math.sin(angle) * dist;
            const speed = 4 + Math.random() * 6;
            particleSystem.particles.push({
                x: sx,
                y: sy,
                vx: -Math.cos(angle + 0.3) * speed,
                vy: -Math.sin(angle + 0.3) * speed,
                radius: 2.5 + Math.random() * 3,
                color: Math.random() > 0.5 ? '#a855f7' : '#c084fc',
                life: 0.35,
                maxLife: 0.35
            });
        }
    }
}

class ChickenMissile {
    constructor(targetId, targetName, spawnX, spawnY) {
        this.targetId = targetId;
        this.targetName = targetName || 'Líder';
        this.x = spawnX;
        this.y = spawnY;
        this.vx = 0;
        this.vy = 4;
        this.speed = 10.5;
        this.angle = 0;
        this.alive = true;
        this.life = 12.0;
        this.flapTimer = 0;
    }

    update(dt, players, localPlayer, particleSystem) {
        this.life -= dt;
        this.flapTimer += dt * 16;
        if (this.life <= 0) {
            this.alive = false;
            return;
        }

        let target = null;
        if (this.targetId && players && players[this.targetId]) {
            target = players[this.targetId];
        } else if (localPlayer && localPlayer.id === this.targetId) {
            target = localPlayer;
        } else if (players && Object.keys(players).length > 0) {
            const all = [localPlayer, ...Object.values(players)].filter(Boolean);
            target = all.reduce((min, p) => (p.y < min.y ? p : min), all[0]);
        }

        if (target) {
            const tx = target.x + target.w / 2;
            const ty = target.y + target.h / 2;
            const dx = tx - this.x;
            const dy = ty - this.y;
            const targetAngle = Math.atan2(dy, dx);

            let diff = targetAngle - this.angle;
            while (diff < -Math.PI) diff += Math.PI * 2;
            while (diff > Math.PI) diff -= Math.PI * 2;
            this.angle += diff * Math.min(1.0, dt * 5.5);

            this.vx = Math.cos(this.angle) * this.speed;
            this.vy = Math.sin(this.angle) * this.speed;
        }

        this.x += this.vx * (dt * 60) * 0.5;
        this.y += this.vy * (dt * 60) * 0.5;

        if (particleSystem && Math.random() < 0.65) {
            particleSystem.particles.push({
                x: this.x - Math.cos(this.angle) * 14,
                y: this.y - Math.sin(this.angle) * 14,
                vx: -this.vx * 0.2 + (Math.random() - 0.5) * 2,
                vy: -this.vy * 0.2 + (Math.random() - 0.5) * 2,
                radius: 3.5 + Math.random() * 3,
                color: Math.random() > 0.5 ? '#fde047' : '#f97316',
                life: 0.3,
                maxLife: 0.3
            });
        }

        const allTargets = [localPlayer, ...Object.values(players || {})].filter(Boolean);
        for (let p of allTargets) {
            if (p.isGhost) continue;
            const px = p.x + p.w / 2;
            const py = p.y + p.h / 2;
            const dist = Math.hypot(px - this.x, py - this.y);
            if (dist < 32) {
                p.pushVx = (this.vx > 0 ? 1 : -1) * 15.0;
                p.pushVy = 8.0;
                p.isStunned = true;
                p.stunTimer = 0.6;
                if (particleSystem) {
                    particleSystem.emitFeatherExplosion(this.x, this.y);
                }
                if (window.soundEngine) {
                    window.soundEngine.playChickenCluck();
                    window.soundEngine.playBoulderCrash();
                }
                this.alive = false;
                break;
            }
        }
    }
}

class FakeSummitHologram {
    constructor(id, x, y) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.w = 120;
        this.h = 90;
        this.alive = true;
        this.anim = 0;
    }

    update(dt) {
        this.anim += dt * 3.5;
    }
}

class SpringBoxingGlove {
    constructor(spawnX, spawnY, dir, speed = 34.0, maxRange = 3000) {
        this.startX = spawnX;
        this.x = spawnX;
        this.y = spawnY;
        this.dir = dir; // 1 (right) or -1 (left)
        this.speed = speed;
        this.maxRange = maxRange;
        this.w = 64;
        this.h = 44;
        this.alive = true;
        this.hitTargets = new Set();
    }

    update(dt, players, localPlayer, particleSystem) {
        this.x += this.dir * this.speed * (dt * 60);
        if (Math.abs(this.x - this.startX) >= this.maxRange || this.x < -300 || this.x > 3300) {
            this.alive = false;
        }

        const allTargets = [localPlayer, ...Object.values(players || {})].filter(Boolean);
        for (let p of allTargets) {
            if (p.isGhost || this.hitTargets.has(p.id)) continue;
            const px = p.x + p.w / 2;
            const py = p.y + p.h / 2;
            const dx = Math.abs(px - this.x);
            const dy = Math.abs(py - this.y);
            if (dx < 50 && dy < 42) {
                this.hitTargets.add(p.id);
                p.pushVx = this.dir * 28.0;
                p.pushVy = -8.0;
                p.isStunned = true;
                p.stunTimer = 0.8;
                if (particleSystem) {
                    particleSystem.emitImpactRing(this.x, this.y, '#ef4444');
                    particleSystem.emitStars(this.x, this.y, 12);
                }
                if (window.soundEngine && window.soundEngine.playBoxingPunch) {
                    window.soundEngine.playBoxingPunch();
                }
            }
        }
    }
}

class BananaPeel {
    constructor(id, x, y) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.w = 28;
        this.h = 22;
        this.alive = true;
        this.anim = Math.random() * Math.PI * 2;
    }

    update(dt) {
        this.anim += dt * 2.0;
    }
}

class UfoAbductionEvent {
    constructor(targetId, targetName, startX, startY, dropY) {
        this.targetId = targetId;
        this.targetName = targetName;
        this.startX = startX;
        this.startY = startY;
        this.dropY = dropY;
        this.ufoX = startX;
        this.ufoY = startY - 240;
        this.timer = 0;
        this.duration = 2.4;
        this.alive = true;
    }

    update(dt, players, localPlayer, particleSystem) {
        this.timer += dt;
        if (this.timer >= this.duration) {
            this.alive = false;
            if (particleSystem) {
                particleSystem.emitTeleportRays(this.startX, this.dropY, '#22c55e');
            }
        }
    }
}

class RubberbandSnapEvent {
    constructor(leadId, leadName, leadOldY, leadNewY, lastId, lastName, lastOldY, lastNewY) {
        this.leadId = leadId;
        this.leadName = leadName;
        this.leadOldY = leadOldY;
        this.leadNewY = leadNewY;
        this.lastId = lastId;
        this.lastName = lastName;
        this.lastOldY = lastOldY;
        this.lastNewY = lastNewY;
        this.timer = 0;
        this.duration = 1.4;
        this.alive = true;
    }

    update(dt) {
        this.timer += dt;
        if (this.timer >= this.duration) {
            this.alive = false;
        }
    }
}

class ParticleSystem {
    constructor() {
        this.particles = [];
        this.meteors = [];
        this.lasers = [];
        this.boulders = [];
        this.bullets = [];
        this.blackHoles = [];
        this.chickenMissiles = [];
        this.fakeSummits = [];
        this.boxingGloves = [];
        this.bananaPeels = [];
        this.ufoAbductions = [];
        this.rubberbands = [];
    }

    spawnBoxingGlove(spawnX, spawnY, dir, speed, range) {
        this.boxingGloves.push(new SpringBoxingGlove(spawnX, spawnY, dir, speed, range));
    }

    spawnBananaRain(bananas) {
        for (let b of bananas) {
            this.bananaPeels.push(new BananaPeel(b.id, b.x, b.y));
        }
    }

    removeBanana(bananaId) {
        const idx = this.bananaPeels.findIndex(b => b.id === bananaId);
        if (idx !== -1) this.bananaPeels.splice(idx, 1);
    }

    spawnUfoAbduction(targetId, targetName, startX, startY, dropY) {
        this.ufoAbductions.push(new UfoAbductionEvent(targetId, targetName, startX, startY, dropY));
    }

    spawnRubberband(leadId, leadName, leadOldY, leadNewY, lastId, lastName, lastOldY, lastNewY) {
        this.rubberbands.push(new RubberbandSnapEvent(leadId, leadName, leadOldY, leadNewY, lastId, lastName, lastOldY, lastNewY));
    }

    spawnBlackHole(x, y, duration = 5.0, radius = 450, force = 13.5) {
        const bh = new BlackHoleVortex(x, y, duration, radius, force);
        this.blackHoles.push(bh);
        if (!window.gameClient.blackHoles) window.gameClient.blackHoles = [];
        window.gameClient.blackHoles.push(bh);
    }

    spawnChickenMissile(targetId, targetName, spawnX, spawnY) {
        this.chickenMissiles.push(new ChickenMissile(targetId, targetName, spawnX, spawnY));
    }

    spawnFakeSummit(id, x, y) {
        this.fakeSummits.push(new FakeSummitHologram(id, x, y));
    }

    emitFeatherExplosion(x, y) {
        for (let i = 0; i < 28; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 4 + Math.random() * 9;
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 2,
                radius: 4 + Math.random() * 5,
                color: Math.random() > 0.4 ? '#fef08a' : (Math.random() > 0.5 ? '#f97316' : '#ef4444'),
                life: 0.6,
                maxLife: 0.6
            });
        }
    }

    emitConfettiTroll(x, y) {
        const colors = ['#ec4899', '#a855f7', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];
        for (let i = 0; i < 45; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 5 + Math.random() * 11;
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 4,
                radius: 3 + Math.random() * 4,
                color: colors[Math.floor(Math.random() * colors.length)],
                life: 0.85,
                maxLife: 0.85
            });
        }
    }

    spawnBullet(x, y, vx, vy, shooterId, color, damage = 25, weaponType = 'pistol') {
        this.bullets.push({
            x: x,
            y: y,
            vx: vx,
            vy: vy,
            shooterId: shooterId,
            color: color || '#fde047',
            damage: damage,
            weaponType: weaponType,
            life: 2.5,
            alive: true
        });
    }


    emitMuzzleFlash(x, y, angleOrDir, color) {
        const baseAngle = (typeof angleOrDir === 'number') ? angleOrDir : (angleOrDir > 0 ? 0 : Math.PI);
        for (let i = 0; i < 9; i++) {
            const angle = baseAngle + (Math.random() - 0.5) * 0.6;
            const speed = 4 + Math.random() * 8;
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                radius: 3 + Math.random() * 3,
                color: color || '#fef08a',
                life: 0.22,
                maxLife: 0.22
            });
        }
    }

    emitAmmoBurst(x, y) {
        for (let i = 0; i < 18; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 3 + Math.random() * 5;
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 1.5,
                radius: 3.5 + Math.random() * 3,
                color: Math.random() > 0.4 ? '#fbbf24' : '#fde047',
                life: 0.45,
                maxLife: 0.45
            });
        }
    }

    emitBulletExplosion(x, y, color) {
        for (let i = 0; i < 16; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 3 + Math.random() * 7;
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                radius: 3 + Math.random() * 4,
                color: color || '#f59e0b',
                life: 0.35,
                maxLife: 0.35
            });
        }
    }

    emitJumpPuff(x, y) {
        for (let i = 0; i < 6; i++) {
            this.particles.push({
                x: x + (Math.random() - 0.5) * 16,
                y: y,
                vx: (Math.random() - 0.5) * 2.5,
                vy: -Math.random() * 1.5,
                radius: 4 + Math.random() * 3,
                color: 'rgba(255, 255, 255, 0.85)',
                life: 0.35,
                maxLife: 0.35
            });
        }
    }

    emitDoubleJumpRing(x, y) {
        for (let i = 0; i < 10; i++) {
            const angle = (i / 10) * Math.PI * 2;
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * 3.5,
                vy: Math.sin(angle) * 2.0,
                radius: 4 + Math.random() * 2,
                color: 'rgba(255, 255, 255, 0.9)',
                life: 0.4,
                maxLife: 0.4
            });
        }
    }

    emitSpringBurst(x, y) {
        for (let i = 0; i < 12; i++) {
            this.particles.push({
                x: x + (Math.random() - 0.5) * 24,
                y: y,
                vx: (Math.random() - 0.5) * 4.0,
                vy: -Math.random() * 4.5 - 2,
                radius: 3 + Math.random() * 3,
                color: 'rgba(56, 189, 248, 0.9)',
                life: 0.5,
                maxLife: 0.5
            });
        }
    }

    emitShoveSwoosh(x, y, dir) {
        for (let i = 0; i < 8; i++) {
            this.particles.push({
                x: x,
                y: y + (Math.random() - 0.5) * 16,
                vx: dir * (5 + Math.random() * 6),
                vy: (Math.random() - 0.5) * 2,
                radius: 4 + Math.random() * 3,
                color: 'rgba(255, 255, 255, 0.9)',
                life: 0.25,
                maxLife: 0.25
            });
        }
    }

    emitShoveImpact(x, y) {
        for (let i = 0; i < 12; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 3 + Math.random() * 5;
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                radius: 3 + Math.random() * 3,
                color: '#fde047',
                life: 0.3,
                maxLife: 0.3
            });
        }
    }

    emitDashBurst(x, y, dir) {
        for (let i = 0; i < 12; i++) {
            this.particles.push({
                x: x,
                y: y + (Math.random() - 0.5) * 20,
                vx: -dir * (4 + Math.random() * 6),
                vy: (Math.random() - 0.5) * 3,
                radius: 4 + Math.random() * 3,
                color: 'rgba(250, 204, 21, 0.9)',
                life: 0.35,
                maxLife: 0.35
            });
        }
    }

    emitDashTrail(x, y, color) {
        this.particles.push({
            x: x + 14,
            y: y + 18,
            vx: 0,
            vy: 0,
            radius: 12,
            color: color,
            alpha: 0.5,
            life: 0.2,
            maxLife: 0.2
        });
    }

    emitSkillAura(x, y, color) {
        for (let i = 0; i < 14; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 2 + Math.random() * 3;
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                radius: 3 + Math.random() * 3,
                color: color,
                life: 0.5,
                maxLife: 0.5
            });
        }
    }

    emitShockwave(x, y) {
        for (let i = 0; i < 24; i++) {
            const angle = (i / 24) * Math.PI * 2;
            const speed = 6.5;
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                radius: 5 + Math.random() * 3,
                color: 'rgba(239, 68, 68, 0.85)',
                life: 0.45,
                maxLife: 0.45
            });
        }
    }

    addLaser(x1, y1, x2, y2) {
        this.lasers.push({
            x1, y1, x2, y2,
            life: 0.4,
            maxLife: 0.4
        });
        for (let i = 0; i < 18; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 3 + Math.random() * 6;
            this.particles.push({
                x: x2,
                y: y2,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                radius: 4 + Math.random() * 4,
                color: 'rgba(239, 68, 68, 0.95)',
                life: 0.4,
                maxLife: 0.4
            });
        }
    }

    spawnBoulder(x, y, radius, vx, vy) {
        this.boulders.push(new Boulder(x, y, radius, vx, vy));
    }

    emitBoulderDust(x, y, radius) {
        for (let i = 0; i < 10; i++) {
            this.particles.push({
                x: x + (Math.random() - 0.5) * radius * 1.4,
                y: y,
                vx: (Math.random() - 0.5) * 5.0,
                vy: -Math.random() * 3.5,
                radius: 4 + Math.random() * 5,
                color: Math.random() > 0.5 ? '#94a3b8' : '#64748b',
                life: 0.4,
                maxLife: 0.4
            });
        }
    }

    emitBoulderImpact(x, y, radius) {
        this.emitShockwave(x, y);
        for (let i = 0; i < 22; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 4 + Math.random() * 8;
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 2,
                radius: 4 + Math.random() * 6,
                color: Math.random() > 0.4 ? '#64748b' : '#334155',
                life: 0.55,
                maxLife: 0.55
            });
        }
    }

    emitBoulderTrail(x, y, radius) {
        this.particles.push({
            x: x + (Math.random() - 0.5) * radius * 0.8,
            y: y + (Math.random() - 0.5) * radius * 0.8,
            vx: (Math.random() - 0.5) * 1.5,
            vy: -Math.random() * 1.5,
            radius: 5 + Math.random() * 6,
            color: 'rgba(148, 163, 184, 0.45)',
            life: 0.35,
            maxLife: 0.35
        });
    }

    spawnMeteor(worldX, worldY) {
        this.meteors.push({
            x: worldX - 350,
            y: worldY - 600,
            targetX: worldX,
            targetY: worldY,
            vx: 14,
            vy: 24,
            radius: 20,
            alive: true
        });
    }

    emitMeteorExplosion(x, y) {
        // Shockwave rings
        this.emitShockwave(x, y);

        // Burst of flying sparks and fire embers
        for (let i = 0; i < 35; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 4 + Math.random() * 10;
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 3,
                radius: 4 + Math.random() * 5,
                color: Math.random() > 0.4 ? '#fbbf24' : (Math.random() > 0.5 ? '#f97316' : '#ef4444'),
                life: 0.6 + Math.random() * 0.4,
                maxLife: 1.0
            });
        }

        // Heavy smoke clouds
        for (let i = 0; i < 15; i++) {
            this.particles.push({
                x: x + (Math.random() - 0.5) * 40,
                y: y + (Math.random() - 0.5) * 30,
                vx: (Math.random() - 0.5) * 3,
                vy: -Math.random() * 4,
                radius: 12 + Math.random() * 10,
                color: 'rgba(30, 41, 59, 0.7)',
                life: 0.8,
                maxLife: 0.8
            });
        }
    }

    update(dt, map, localPlayer, otherPlayers) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.life -= dt;
            if (p.life <= 0) {
                this.particles.splice(i, 1);
            }
        }

        for (let i = this.lasers.length - 1; i >= 0; i--) {
            const l = this.lasers[i];
            l.life -= dt;
            if (l.life <= 0) {
                this.lasers.splice(i, 1);
            }
        }

        for (let i = this.boulders.length - 1; i >= 0; i--) {
            const b = this.boulders[i];
            b.update(dt, map, localPlayer, otherPlayers, this);
            if (!b.alive) {
                this.boulders.splice(i, 1);
            }
        }

        for (let i = this.meteors.length - 1; i >= 0; i--) {
            const m = this.meteors[i];
            m.x += m.vx;
            m.y += m.vy;

            // Fiery flame particles trailing behind meteor
            for (let k = 0; k < 3; k++) {
                this.particles.push({
                    x: m.x + (Math.random() - 0.5) * 16,
                    y: m.y + (Math.random() - 0.5) * 16,
                    vx: -m.vx * 0.3 + (Math.random() - 0.5) * 3,
                    vy: -m.vy * 0.3 + (Math.random() - 0.5) * 3,
                    radius: 8 + Math.random() * 6,
                    color: Math.random() > 0.5 ? 'rgba(251, 191, 36, 0.9)' : 'rgba(239, 68, 68, 0.9)',
                    life: 0.35,
                    maxLife: 0.35
                });
            }

            if (m.y >= m.targetY) {
                this.emitMeteorExplosion(m.targetX, m.targetY);
                if (window.soundEngine) window.soundEngine.playMeteor();
                this.meteors.splice(i, 1);
            }
        }

        // Update Flying Blaster Bullets
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const b = this.bullets[i];
            b.x += b.vx * (dt * 60);
            b.y += b.vy * (dt * 60);
            b.life -= dt;

            // Glowing bullet trail
            if (Math.random() < 0.6) {
                this.particles.push({
                    x: b.x + (Math.random() - 0.5) * 4,
                    y: b.y + (Math.random() - 0.5) * 4,
                    vx: -b.vx * 0.1,
                    vy: (Math.random() - 0.5) * 1.5,
                    radius: 3,
                    color: b.color || '#fde047',
                    life: 0.18,
                    maxLife: 0.18
                });
            }

            // Check Map Platforms collision
            if (map && map.platforms) {
                for (let plat of map.platforms) {
                    if (plat.solid && !plat.isBroken) {
                        if (b.x > plat.x && b.x < plat.x + plat.w &&
                            b.y > plat.y && b.y < plat.y + plat.h) {
                            this.emitBulletExplosion(b.x, b.y, b.color);
                            b.alive = false;
                            break;
                        }
                    }
                }
            }

            // Check collision against players / bots
            if (b.alive) {
                const targets = [localPlayer, ...Object.values(otherPlayers || {})].filter(Boolean);
                for (let target of targets) {
                    if (target.id === b.shooterId || target.isGhost || target.isDead) continue;
                    if (b.x > target.x && b.x < target.x + target.w &&
                        b.y > target.y && b.y < target.y + target.h) {
                        // Impact directional knockback along bullet trajectory (NEVER PROPEL UPWARD!)
                        const bSpeed = Math.sqrt(b.vx * b.vx + b.vy * b.vy) || 1;
                        const dirX = b.vx / bSpeed;
                        const dirY = b.vy / bSpeed;
                        const knockX = dirX * (b.weaponType === 'shotgun' ? 10.5 : 8.5);
                        const knockY = Math.max(0.6, dirY * 3.5); // Downward or horizontal only, NEVER UPWARD!
                        target.pushVx = (target.pushVx || 0) + knockX;
                        target.pushVy = (target.pushVy || 0) + knockY;

                        // Apply Weapon Damage & Stun
                        const bulletDamage = b.damage || 25;
                        if (typeof target.takeDamage === 'function') {
                            target.takeDamage(bulletDamage, b.shooterId, window.gameApp, this, 'bullet');
                        }

                        this.emitBulletExplosion(b.x, b.y, b.color);
                        if (window.soundEngine) window.soundEngine.playBulletHit();

                        if (b.shooterId === (localPlayer ? localPlayer.id : null)) {
                            if (window.gameApp) {
                                window.gameApp.sendHitPlayer(target.id, bulletDamage, knockX, knockY);
                            }
                        }
                        b.alive = false;
                        break;
                    }
                }
            }


            if (!b.alive || b.life <= 0) {
                this.bullets.splice(i, 1);
            }
        }

        // Update Black Holes
        for (let i = this.blackHoles.length - 1; i >= 0; i--) {
            const bh = this.blackHoles[i];
            bh.update(dt, this);
            if (!bh.alive) {
                this.blackHoles.splice(i, 1);
                if (window.gameClient && window.gameClient.blackHoles) {
                    const idx = window.gameClient.blackHoles.indexOf(bh);
                    if (idx !== -1) window.gameClient.blackHoles.splice(idx, 1);
                }
            }
        }

        // Update Chicken Missiles
        for (let i = this.chickenMissiles.length - 1; i >= 0; i--) {
            const cm = this.chickenMissiles[i];
            cm.update(dt, otherPlayers, localPlayer, this);
            if (!cm.alive) {
                this.chickenMissiles.splice(i, 1);
            }
        }

        // Update Fake Summits & Check collision
        for (let i = this.fakeSummits.length - 1; i >= 0; i--) {
            const fs = this.fakeSummits[i];
            fs.update(dt);
            // Check if local player touched the fake summit
            if (localPlayer && !localPlayer.isGhost) {
                const px = localPlayer.x + localPlayer.w / 2;
                const py = localPlayer.y + localPlayer.h / 2;
                if (Math.hypot(px - fs.x, py - fs.y) < 55) {
                    if (window.gameClient && window.gameClient.ws) {
                        window.gameClient.ws.send(JSON.stringify({
                            type: 'fake_summit_touch',
                            summit_id: fs.id,
                            x: fs.x,
                            y: fs.y
                        }));
                    }
                    this.emitConfettiTroll(fs.x, fs.y);
                    if (window.soundEngine) window.soundEngine.playTrollHorn();
                    fs.alive = false;
                    this.fakeSummits.splice(i, 1);
                }
            }
        }

        // Update Boxing Gloves
        for (let i = this.boxingGloves.length - 1; i >= 0; i--) {
            const bg = this.boxingGloves[i];
            bg.update(dt, otherPlayers, localPlayer, this);
            if (!bg.alive) {
                this.boxingGloves.splice(i, 1);
            }
        }

        // Update Banana Peels & Check collision with localPlayer
        for (let i = this.bananaPeels.length - 1; i >= 0; i--) {
            const bp = this.bananaPeels[i];
            bp.update(dt);
            if (localPlayer && !localPlayer.isGhost) {
                const px = localPlayer.x + localPlayer.w / 2;
                const py = localPlayer.y + localPlayer.h / 2;
                if (Math.hypot(px - bp.x, py - bp.y) < 28) {
                    // Slip backwards!
                    const slipDir = localPlayer.facing >= 0 ? -1 : 1;
                    localPlayer.pushVx = slipDir * 18.0;
                    localPlayer.pushVy = -6.0;
                    localPlayer.isStunned = true;
                    localPlayer.stunTimer = 0.75;
                    this.emitSlipBanana(bp.x, bp.y);
                    if (window.soundEngine && window.soundEngine.playBananaSlip) {
                        window.soundEngine.playBananaSlip();
                    }
                    if (window.gameClient && window.gameClient.ws) {
                        window.gameClient.ws.send(JSON.stringify({
                            type: 'banana_slip',
                            banana_id: bp.id,
                            x: bp.x,
                            y: bp.y
                        }));
                    }
                    this.bananaPeels.splice(i, 1);
                }
            }
        }

        // Update UFO Abductions
        for (let i = this.ufoAbductions.length - 1; i >= 0; i--) {
            const ufo = this.ufoAbductions[i];
            ufo.update(dt, otherPlayers, localPlayer, this);
            if (!ufo.alive) {
                this.ufoAbductions.splice(i, 1);
            }
        }

        // Update Rubberbands
        for (let i = this.rubberbands.length - 1; i >= 0; i--) {
            const rb = this.rubberbands[i];
            rb.update(dt);
            if (!rb.alive) {
                this.rubberbands.splice(i, 1);
            }
        }
    }

    emitStars(x, y, count = 10) {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 2 + Math.random() * 6;
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 1.5,
                radius: 3 + Math.random() * 3,
                color: Math.random() > 0.5 ? '#fde047' : '#f59e0b',
                life: 0.6,
                maxLife: 0.6
            });
        }
    }

    emitImpactRing(x, y, color = '#ef4444') {
        for (let i = 0; i < 18; i++) {
            const angle = (i / 18) * Math.PI * 2;
            const speed = 6 + Math.random() * 4;
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                radius: 3.5,
                color: color,
                life: 0.35,
                maxLife: 0.35
            });
        }
    }

    emitTeleportRays(x, y, color = '#22c55e') {
        for (let i = 0; i < 24; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 3 + Math.random() * 7;
            this.particles.push({
                x: x + (Math.random() - 0.5) * 30,
                y: y + (Math.random() - 0.5) * 30,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 3,
                radius: 4,
                color: color,
                life: 0.5,
                maxLife: 0.5
            });
        }
    }

    emitSlipBanana(x, y) {
        for (let i = 0; i < 14; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 3 + Math.random() * 5;
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 2,
                radius: 3.5,
                color: '#facc15',
                life: 0.4,
                maxLife: 0.4
            });
        }
    }
}

class GameRenderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.camera = { x: 200, y: 7800, targetX: 200, targetY: 7800 };
        this.zoom = 1.30;
        this.screenShake = 0;
        this.particles = new ParticleSystem();
        this.clouds = this.initClouds();
        this.windStreaks = [];
        this.lightingCanvas = document.createElement('canvas');
        this.lightingCtx = this.lightingCanvas.getContext('2d');
    }

    initClouds() {
        const clouds = [];
        for (let i = 0; i < 35; i++) {
            clouds.push({
                x: Math.random() * 1400 - 200,
                y: Math.random() * 8000,
                w: 160 + Math.random() * 220,
                h: 50 + Math.random() * 60,
                speed: 0.2 + Math.random() * 0.4,
                opacity: 0.4 + Math.random() * 0.45
            });
        }
        return clouds;
    }

    setScreenShake(amount) {
        this.screenShake = amount;
    }

    updateCamera(player, dt, isFreeCamera = false, freeCamInput = null) {
        const halfVisibleW = (this.canvas.width / this.zoom) / 2;
        const halfVisibleH = (this.canvas.height / this.zoom) / 2;

        if (isFreeCamera && freeCamInput) {
            const speed = (freeCamInput.turbo ? 38.0 : 18.0) * (dt * 60);
            if (freeCamInput.left) this.camera.x -= speed;
            if (freeCamInput.right) this.camera.x += speed;
            if (freeCamInput.up) this.camera.y -= speed;
            if (freeCamInput.down) this.camera.y += speed;

            this.camera.x = Math.max(80, Math.min(2920, this.camera.x));
            this.camera.y = Math.max(50, Math.min(7950, this.camera.y));
        } else if (player) {
            // Smooth camera follow focused on player
            this.camera.targetX = player.x + player.w / 2;
            this.camera.targetY = player.y + player.h / 2 - 60;

            this.camera.x += (this.camera.targetX - this.camera.x) * 0.18;
            this.camera.y += (this.camera.targetY - this.camera.y) * 0.18;

            this.camera.x = Math.max(80, Math.min(2920, this.camera.x));
            this.camera.y = Math.min(7950, this.camera.y);
        }

        if (this.screenShake > 0) {
            this.screenShake = Math.max(0, this.screenShake - dt * 2.5);
        }
    }

    renderDaylightNightMask(cw, ch, shakeX, shakeY, allPlayers) {
        if (this.lightingCanvas.width !== cw || this.lightingCanvas.height !== ch) {
            this.lightingCanvas.width = cw;
            this.lightingCanvas.height = ch;
        }
        const lctx = this.lightingCtx;
        lctx.clearRect(0, 0, cw, ch);

        // Deep night darkness shroud covering the entire world
        lctx.fillStyle = 'rgba(2, 6, 23, 0.985)';
        lctx.fillRect(0, 0, cw, ch);

        // Cut out daylight illumination wherever players' eyes are pointing
        lctx.globalCompositeOperation = 'destination-out';

        const halfW = (cw / this.zoom) / 2 + 350;
        const halfH = (ch / this.zoom) / 2 + 350;
        const minX = this.camera.x - halfW;
        const maxX = this.camera.x + halfW;
        const minY = this.camera.y - halfH;
        const maxY = this.camera.y + halfH;

        for (let p of allPlayers) {
            if (!p || p.isGhost) continue;
            // Culling for offscreen players in darkness mask
            if (p.x + p.w < minX || p.x > maxX || p.y + p.h < minY || p.y > maxY) continue;

            const px = cw / 2 + (p.x + p.w / 2 - this.camera.x - shakeX) * this.zoom;
            const py = ch / 2 + (p.y + p.h / 2 - this.camera.y - shakeY) * this.zoom;
            const beamDir = (p.facing >= 0) ? 1 : -1;
            const beamAngle = beamDir > 0 ? 0 : Math.PI;

            // 1. Broad Daylight Forward Vision Beam Cone (reveals path ahead in crystal-clear daylight!)
            const coneReach = 420 * this.zoom;
            const eyeCut = lctx.createRadialGradient(px, py, 12 * this.zoom, px + beamDir * 180 * this.zoom, py, coneReach);
            eyeCut.addColorStop(0, 'rgba(0, 0, 0, 1.0)');
            eyeCut.addColorStop(0.70, 'rgba(0, 0, 0, 0.96)');
            eyeCut.addColorStop(0.90, 'rgba(0, 0, 0, 0.50)');
            eyeCut.addColorStop(1, 'rgba(0, 0, 0, 0)');

            lctx.fillStyle = eyeCut;
            lctx.beginPath();
            lctx.moveTo(px, py);
            // 62-degree daylight vision cone
            lctx.arc(px, py, coneReach, beamAngle - 0.54, beamAngle + 0.54);
            lctx.closePath();
            lctx.fill();

            // 2. 360° Ambient Daylight Aura (reveals ground underneath and immediate platforms)
            const auraRadius = 115 * this.zoom;
            const auraCut = lctx.createRadialGradient(px, py, 6 * this.zoom, px, py, auraRadius);
            auraCut.addColorStop(0, 'rgba(0, 0, 0, 1.0)');
            auraCut.addColorStop(0.65, 'rgba(0, 0, 0, 0.90)');
            auraCut.addColorStop(0.90, 'rgba(0, 0, 0, 0.40)');
            auraCut.addColorStop(1, 'rgba(0, 0, 0, 0)');

            lctx.fillStyle = auraCut;
            lctx.beginPath();
            lctx.arc(px, py, auraRadius, 0, Math.PI * 2);
            lctx.fill();
        }

        lctx.globalCompositeOperation = 'source-over';
    }

    render(map, localPlayer, otherPlayers, modifiers, hostManager, roundTime) {
        const ctx = this.ctx;
        const cw = this.canvas.width;
        const ch = this.canvas.height;
        const isBlackout = !!(modifiers && modifiers.blackout);

        ctx.clearRect(0, 0, cw, ch);

        let shakeX = 0;
        let shakeY = 0;
        if (this.screenShake > 0 || modifiers.earthquake) {
            const intensity = (this.screenShake + (modifiers.earthquake ? 3.5 : 0));
            shakeX = (Math.random() - 0.5) * intensity * 2;
            shakeY = (Math.random() - 0.5) * intensity * 2;
        }

        // 1. Sky Gradient Background (8,000m total altitude & Day/Night & Seasons)
        const altRatio = Math.max(0, Math.min(1, 1 - (this.camera.y / 8000)));
        const season = (map && map.season) ? map.season : 'normal';
        const grad = ctx.createLinearGradient(0, 0, 0, ch);

        if (isBlackout) {
            // Starry Midnight Night Sky
            grad.addColorStop(0, '#02040a');
            grad.addColorStop(0.5, '#050c1e');
            grad.addColorStop(1, '#09152e');
        } else if (altRatio > 0.8) {
            // Cosmic Deep Space
            grad.addColorStop(0, '#020617');
            grad.addColorStop(0.6, '#0f172a');
            grad.addColorStop(1, '#1e1b4b');
        } else if (altRatio > 0.5) {
            // High Stratosphere
            grad.addColorStop(0, '#1e3a8a');
            grad.addColorStop(0.6, '#0284c7');
            grad.addColorStop(1, '#38bdf8');
        } else if (season === 'winter') {
            // Winter Glacial Sky
            grad.addColorStop(0, '#0f172a');
            grad.addColorStop(0.4, '#1e293b');
            grad.addColorStop(0.8, '#38bdf8');
            grad.addColorStop(1, '#e0f2fe');
        } else if (season === 'autumn') {
            // Autumn Golden Sunset Sky
            grad.addColorStop(0, '#451a03');
            grad.addColorStop(0.4, '#7c2d12');
            grad.addColorStop(0.8, '#f59e0b');
            grad.addColorStop(1, '#fed7aa');
        } else if (season === 'summer') {
            // Summer Sunburst & Tropical Sea Sky
            grad.addColorStop(0, '#0369a1');
            grad.addColorStop(0.4, '#0ea5e9');
            grad.addColorStop(0.8, '#38bdf8');
            grad.addColorStop(1, '#fef08a');
        } else if (season === 'spring') {
            // Spring Cherry Blossom Sky
            grad.addColorStop(0, '#831843');
            grad.addColorStop(0.4, '#db2777');
            grad.addColorStop(0.8, '#f472b6');
            grad.addColorStop(1, '#fdf2f8');
        } else if (altRatio > 0.25) {
            // Mid Atmosphere (Normal)
            grad.addColorStop(0, '#0284c7');
            grad.addColorStop(0.6, '#38bdf8');
            grad.addColorStop(1, '#bae6fd');
        } else {
            // Sunny Daylight Sky (Normal)
            grad.addColorStop(0, '#38bdf8');
            grad.addColorStop(0.5, '#7dd3fc');
            grad.addColorStop(1, '#e0f2fe');
        }
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, cw, ch);

        // 2. Parallax Background Mountains & Castles
        this.renderParallaxBackground(ctx, this.camera.x, this.camera.y, cw, ch, map);

        // 3. Fluffy Clouds
        this.renderClouds(ctx, this.camera.x, this.camera.y, cw, ch, modifiers.wind || 0);

        // Find all active players for Crown and Lighting
        let highestPlayerId = null;
        let lowestY = 99999;
        const allPlayers = [localPlayer, ...Object.values(otherPlayers)].filter(Boolean);
        for (let p of allPlayers) {
            if (p.y < lowestY) {
                lowestY = p.y;
                highestPlayerId = p.id;
            }
        }

        // --- Render World Elements ---
        ctx.save();
        ctx.translate(cw / 2, ch / 2);
        ctx.scale(this.zoom, this.zoom);
        ctx.translate(-this.camera.x - shakeX, -this.camera.y - shakeY);

        // 4. Render Decorative Castle Pillars & Signs
        this.renderDecorations(ctx, map);

        // 5. Render Platforms (Stone Bricks, Grass, Wood, Ice, Crumbling, Ramps, Conveyors)
        this.renderPlatforms(ctx, map);

        // 6. Render Interactive Objects (Springs, Banners, Victory Flag, Weapons, Medkits)
        this.renderInteractiveObjects(ctx, map);

        // 6.5. Render Rising Lava Floor
        this.renderLava(ctx, map);

        // 7. Render Particles, Lasers, Meteors
        this.renderParticleEffects(ctx);

        ctx.restore();

        // 8. Apply Night Darkness Shroud with Daylight Vision Cutout (if Night mode active)
        if (isBlackout) {
            this.renderDaylightNightMask(cw, ch, shakeX, shakeY, allPlayers);
            ctx.drawImage(this.lightingCanvas, 0, 0);
        }

        // --- Render Characters & UI Overheads on top ---
        ctx.save();
        ctx.translate(cw / 2, ch / 2);
        ctx.scale(this.zoom, this.zoom);
        ctx.translate(-this.camera.x - shakeX, -this.camera.y - shakeY);

        // 9. Render Remote Players
        for (let p of Object.values(otherPlayers)) {
            p.isCrownHolder = (p.id === highestPlayerId);
            this.renderPlayer(ctx, p, false, isBlackout);
        }

        // 10. Render Local Player
        if (localPlayer) {
            localPlayer.isCrownHolder = (localPlayer.id === highestPlayerId);
            this.renderPlayer(ctx, localPlayer, true, isBlackout);

            // 10.5. Render Blaster Aim Reticle & Guideline when player has ammo
            if (localPlayer.ammo > 0 && localPlayer.mouseWorldX !== undefined && localPlayer.mouseWorldX !== null) {
                this.renderBlasterCrosshair(ctx, localPlayer, localPlayer.mouseWorldX, localPlayer.mouseWorldY);
            }
        }

        // 11. Render Host Sniper, Chain, Black Hole, or Fake Summit Reticle if aiming
        if (hostManager && hostManager.isSniperModeActive) {
            this.renderSniperCrosshair(ctx, hostManager.sniperAimX, hostManager.sniperAimY);
        }
        if (hostManager && hostManager.isChainModeActive) {
            this.renderChainCrosshair(ctx, hostManager.chainAimX, hostManager.chainAimY);
        }
        if (hostManager && hostManager.isBlackHoleModeActive) {
            this.renderBlackHoleCrosshair(ctx, hostManager.blackHoleAimX, hostManager.blackHoleAimY);
        }
        if (hostManager && hostManager.isFakeSummitModeActive) {
            this.renderFakeSummitCrosshair(ctx, hostManager.fakeSummitAimX, hostManager.fakeSummitAimY);
        }
        if (hostManager && hostManager.isBoxingGloveModeActive) {
            this.renderBoxingGloveCrosshair(ctx, hostManager.boxingGloveAimX, hostManager.boxingGloveAimY);
        }

        ctx.restore();

        // 12. Seasons Weather & Particles Effects (Snow, Falling Leaves, Rain, Blossom Petals)
        this.renderSeasonsEffects(ctx, cw, ch, map);

        // 13. Fullscreen Overlays & Player Death Countdown
        this.renderScreenOverlays(ctx, cw, ch, modifiers, localPlayer, map);
    }


    renderParallaxBackground(ctx, camX, camY, cw, ch, map) {
        const parallaxY = camY * 0.2;
        const parallaxX = camX * 0.15;
        const season = (map && map.season) ? map.season : 'normal';

        // Distant Floating Mountains (Themed by Season)
        let mountainColor = 'rgba(125, 211, 252, 0.4)';
        let islandColor = 'rgba(186, 230, 253, 0.6)';
        if (season === 'winter') {
            mountainColor = 'rgba(224, 242, 254, 0.55)'; // Snowy Frosted Peaks
            islandColor = 'rgba(186, 230, 253, 0.7)';
        } else if (season === 'autumn') {
            mountainColor = 'rgba(217, 119, 6, 0.45)'; // Amber Autumn Hills
            islandColor = 'rgba(245, 158, 11, 0.6)';
        } else if (season === 'summer') {
            mountainColor = 'rgba(34, 197, 94, 0.45)'; // Lush Emerald Tropical Mountains
            islandColor = 'rgba(74, 222, 128, 0.6)';
        } else if (season === 'spring') {
            mountainColor = 'rgba(244, 114, 182, 0.45)'; // Cherry Blossom Pink Hills
            islandColor = 'rgba(251, 207, 232, 0.6)';
        }

        ctx.fillStyle = mountainColor;
        for (let i = -1; i < 7; i++) {
            const bx = (i * 260) - (parallaxX % 260);
            const by = ch - 240 - (parallaxY % 450);

            ctx.beginPath();
            ctx.moveTo(bx, by + 260);
            ctx.lineTo(bx + 130, by + 30);
            ctx.lineTo(bx + 260, by + 260);
            ctx.fill();
        }

        // Midground Islands with waterfalls
        const midY = camY * 0.35;
        const midX = camX * 0.3;
        ctx.fillStyle = islandColor;
        for (let i = 0; i < 5; i++) {
            const ix = (i * 340) - (midX % 340) + 30;
            const iy = ch - 340 - (midY % 650);

            ctx.beginPath();
            ctx.roundRect(ix, iy, 150, 75, [16, 16, 32, 32]);
            ctx.fill();

            // Waterfall
            ctx.fillStyle = season === 'autumn' ? 'rgba(254, 243, 199, 0.8)' : (season === 'spring' ? 'rgba(253, 232, 244, 0.8)' : 'rgba(255, 255, 255, 0.75)');
            ctx.fillRect(ix + 65, iy + 60, 14, 180);
            ctx.fillStyle = islandColor;
        }
    }

    renderClouds(ctx, camX, camY, cw, ch, windSpeed) {
        for (let cloud of this.clouds) {
            cloud.x += cloud.speed + (windSpeed * 1.5);
            if (cloud.x > 1400) cloud.x = -cloud.w - 100;
            if (cloud.x < -cloud.w - 100) cloud.x = 1400;

            const screenX = cloud.x - camX * 0.4;
            const screenY = cloud.y - camY * 0.6;

            if (screenX + cloud.w < -100 || screenX > cw + 100 ||
                screenY + cloud.h < -100 || screenY > ch + 100) continue;

            ctx.fillStyle = `rgba(255, 255, 255, ${cloud.opacity})`;
            ctx.beginPath();
            ctx.roundRect(screenX, screenY, cloud.w, cloud.h, 28);
            ctx.fill();
        }
    }

    renderDecorations(ctx, map) {
        const halfW = (this.canvas.width / this.zoom) / 2 + 150;
        const halfH = (this.canvas.height / this.zoom) / 2 + 150;
        const minX = this.camera.x - halfW;
        const maxX = this.camera.x + halfW;
        const minY = this.camera.y - halfH;
        const maxY = this.camera.y + halfH;

        for (let d of map.decorations) {
            if (d.x + d.w < minX || d.x > maxX || d.y + d.h < minY || d.y > maxY) continue;

            if (d.type === 'pillar_left' || d.type === 'pillar_right') {
                ctx.fillStyle = '#64748b';
                ctx.fillRect(d.x, d.y, d.w, d.h);

                ctx.strokeStyle = '#334155';
                ctx.lineWidth = 2;
                for (let by = d.y; by < d.y + d.h; by += 32) {
                    ctx.beginPath();
                    ctx.moveTo(d.x, by);
                    ctx.lineTo(d.x + d.w, by);
                    ctx.stroke();

                    const offset = (Math.floor(by / 32) % 2) * 25;
                    for (let bx = d.x + offset; bx < d.x + d.w; bx += 50) {
                        ctx.beginPath();
                        ctx.moveTo(bx, by);
                        ctx.lineTo(bx, by + 32);
                        ctx.stroke();
                    }
                }

                // Windows
                ctx.fillStyle = '#1e293b';
                ctx.strokeStyle = '#0f172a';
                ctx.lineWidth = 2.5;
                const winX = d.type === 'pillar_left' ? d.x + d.w - 36 : d.x + 12;
                for (let wy = d.y + 40; wy < d.y + d.h - 40; wy += 90) {
                    ctx.fillRect(winX, wy, 24, 38);
                    ctx.strokeRect(winX, wy, 24, 38);
                }
            } else if (d.type === 'royal_banner') {
                ctx.fillStyle = d.color || '#3b82f6';
                ctx.beginPath();
                ctx.moveTo(d.x, d.y);
                ctx.lineTo(d.x + d.w, d.y);
                ctx.lineTo(d.x + d.w, d.y + d.h);
                ctx.lineTo(d.x + d.w / 2, d.y + d.h - 18);
                ctx.lineTo(d.x, d.y + d.h);
                ctx.closePath();
                ctx.fill();

                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 2;
                ctx.stroke();

                ctx.fillStyle = '#fef08a';
                ctx.font = 'bold 16px sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText('👑', d.x + d.w / 2, d.y + d.h * 0.45);
            } else if (d.type === 'banner') {
                ctx.fillStyle = d.color || '#dc2626';
                ctx.beginPath();
                ctx.moveTo(d.x, d.y);
                ctx.lineTo(d.x + d.w, d.y);
                ctx.lineTo(d.x + d.w, d.y + d.h);
                ctx.lineTo(d.x + d.w / 2, d.y + d.h - 14);
                ctx.lineTo(d.x, d.y + d.h);
                ctx.closePath();
                ctx.fill();

                ctx.strokeStyle = '#f59e0b';
                ctx.lineWidth = 3;
                ctx.stroke();

                ctx.fillStyle = '#fef08a';
                ctx.font = 'bold 18px sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText('👑', d.x + d.w / 2, d.y + d.h * 0.45);
            } else if (d.type === 'banner_arrow') {
                ctx.fillStyle = '#dc2626';
                ctx.beginPath();
                ctx.moveTo(d.x, d.y);
                ctx.lineTo(d.x + d.w, d.y);
                ctx.lineTo(d.x + d.w, d.y + d.h);
                ctx.lineTo(d.x + d.w / 2, d.y + d.h - 10);
                ctx.lineTo(d.x, d.y + d.h);
                ctx.closePath();
                ctx.fill();

                ctx.strokeStyle = '#f59e0b';
                ctx.lineWidth = 2.5;
                ctx.stroke();

                ctx.fillStyle = '#fef08a';
                ctx.font = 'bold 16px sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText('⬆', d.x + d.w / 2, d.y + d.h * 0.55);
            } else if (d.type === 'arrow_sign') {
                ctx.fillStyle = '#78350f';
                ctx.fillRect(d.x + d.w / 2 - 3, d.y + 14, 6, d.h - 14);

                ctx.fillStyle = '#b45309';
                ctx.fillRect(d.x, d.y, d.w, 18);
                ctx.strokeStyle = '#451a03';
                ctx.lineWidth = 2;
                ctx.strokeRect(d.x, d.y, d.w, 18);

                ctx.fillStyle = '#fef3c7';
                ctx.font = 'bold 12px sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText('▲', d.x + d.w / 2, d.y + 13);
            } else if (d.type === 'stump') {
                ctx.fillStyle = '#78350f';
                ctx.fillRect(d.x + 8, d.y + 8, d.w - 16, d.h - 8);
                ctx.fillStyle = '#b45309';
                ctx.fillRect(d.x, d.y, d.w, 10);
                ctx.strokeStyle = '#451a03';
                ctx.strokeRect(d.x, d.y, d.w, 10);
            } else if (d.type === 'rope_bridge_end') {
                ctx.strokeStyle = '#92400e';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo(d.x, d.y);
                ctx.lineTo(d.x + d.w, d.y + 4);
                ctx.stroke();

                ctx.strokeStyle = '#b45309';
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(d.x, d.y + 12);
                ctx.lineTo(d.x + d.w, d.y + 14);
                ctx.stroke();
            }
        }
    }

    renderPlatforms(ctx, map) {
        const halfW = (this.canvas.width / this.zoom) / 2 + 150;
        const halfH = (this.canvas.height / this.zoom) / 2 + 150;
        const minX = this.camera.x - halfW;
        const maxX = this.camera.x + halfW;
        const minY = this.camera.y - halfH;
        const maxY = this.camera.y + halfH;
        const isLavaActive = !!(window.gameClient && window.gameClient.lava && window.gameClient.lava.active);

        for (let p of map.platforms) {
            if (p.isBroken) continue;
            if (p.x + p.w < minX || p.x > maxX || p.y + p.h < minY || p.y > maxY) continue;

            const isGroundBase = p.id && (p.id.startsWith('ground_') || p.y >= 7890);

            if (isGroundBase && isLavaActive) {
                // Ground transformed into cracked magma
                const magmaGrad = ctx.createLinearGradient(p.x, p.y, p.x, p.y + p.h);
                magmaGrad.addColorStop(0, '#f97316');
                magmaGrad.addColorStop(0.2, '#dc2626');
                magmaGrad.addColorStop(1, '#450a0a');
                ctx.fillStyle = magmaGrad;
                ctx.fillRect(p.x, p.y, p.w, p.h);

                ctx.strokeStyle = '#ff4500';
                ctx.lineWidth = 2.5;
                ctx.strokeRect(p.x, p.y, p.w, p.h);

                // Magma cracks
                ctx.strokeStyle = '#fde047';
                ctx.lineWidth = 2;
                for (let cx = p.x + 30; cx < p.x + p.w; cx += 45) {
                    ctx.beginPath();
                    ctx.moveTo(cx, p.y);
                    ctx.lineTo(cx + 8, p.y + 12);
                    ctx.lineTo(cx - 4, p.y + 24);
                    ctx.stroke();
                }
            } else if (p.type === 'stone_grass') {
                // Stone body with Gimkit brick styling
                ctx.fillStyle = '#64748b';
                ctx.fillRect(p.x, p.y + 6, p.w, p.h - 6);

                ctx.strokeStyle = '#1e293b';
                ctx.lineWidth = 2.5;
                ctx.strokeRect(p.x, p.y + 6, p.w, p.h - 6);

                // Brick lines
                ctx.strokeStyle = '#475569';
                ctx.lineWidth = 1.5;
                for (let bx = p.x + 20; bx < p.x + p.w; bx += 24) {
                    ctx.beginPath();
                    ctx.moveTo(bx, p.y + 6);
                    ctx.lineTo(bx, p.y + p.h);
                    ctx.stroke();
                }

                // Lush Green Grass Cap
                ctx.fillStyle = '#22c55e';
                ctx.beginPath();
                ctx.roundRect(p.x - 2, p.y, p.w + 4, 10, [5, 5, 0, 0]);
                ctx.fill();

                ctx.strokeStyle = '#15803d';
                ctx.lineWidth = 1.5;
                ctx.stroke();

                // Grass fringes
                ctx.fillStyle = '#16a34a';
                for (let gx = p.x + 4; gx < p.x + p.w - 4; gx += 10) {
                    ctx.fillRect(gx, p.y + 8, 5, 5);
                }
            } else if (p.type === 'flower_grass') {
                // Spring: Cherry Blossom Floral Grass
                ctx.fillStyle = '#475569';
                ctx.fillRect(p.x, p.y + 6, p.w, p.h - 6);

                // Pink floral grass cap
                ctx.fillStyle = '#ec4899';
                ctx.beginPath();
                ctx.roundRect(p.x - 2, p.y, p.w + 4, 10, [5, 5, 0, 0]);
                ctx.fill();

                ctx.strokeStyle = '#db2777';
                ctx.lineWidth = 1.5;
                ctx.stroke();

                // Small Sakura Flowers
                ctx.fillStyle = '#fbcfe8';
                for (let fx = p.x + 6; fx < p.x + p.w - 4; fx += 14) {
                    ctx.beginPath();
                    ctx.arc(fx, p.y + 4, 2.5, 0, Math.PI * 2);
                    ctx.fill();
                }
            } else if (p.type === 'cherry_wood') {
                // Spring: Pink Cherry Timber Wood
                ctx.fillStyle = '#be185d';
                ctx.beginPath();
                ctx.roundRect(p.x, p.y, p.w, p.h, 4);
                ctx.fill();

                ctx.strokeStyle = '#831843';
                ctx.lineWidth = 2.5;
                ctx.stroke();

                ctx.fillStyle = '#f472b6';
                for (let px = p.x + 12; px < p.x + p.w; px += 18) {
                    ctx.fillRect(px, p.y, 2, p.h);
                }
            } else if (p.type === 'sakura_citadel') {
                // Spring: Shimmering Sakura Citadel Block
                const sakGrad = ctx.createLinearGradient(p.x, p.y, p.x, p.y + p.h);
                sakGrad.addColorStop(0, '#f472b6');
                sakGrad.addColorStop(1, '#db2777');
                ctx.fillStyle = sakGrad;
                ctx.beginPath();
                ctx.roundRect(p.x, p.y, p.w, p.h, 6);
                ctx.fill();

                ctx.strokeStyle = '#fce7f3';
                ctx.lineWidth = 2.5;
                ctx.stroke();
            } else if (p.type === 'autumn_stone') {
                // Autumn: Warm Orange-Red Stone with Golden Moss
                ctx.fillStyle = '#9a3412';
                ctx.fillRect(p.x, p.y + 6, p.w, p.h - 6);

                ctx.strokeStyle = '#431407';
                ctx.lineWidth = 2.5;
                ctx.strokeRect(p.x, p.y + 6, p.w, p.h - 6);

                // Golden Autumn Leaves Cap
                ctx.fillStyle = '#f59e0b';
                ctx.beginPath();
                ctx.roundRect(p.x - 2, p.y, p.w + 4, 9, [4, 4, 0, 0]);
                ctx.fill();

                ctx.strokeStyle = '#d97706';
                ctx.lineWidth = 1.5;
                ctx.stroke();
            } else if (p.type === 'autumn_wood') {
                // Autumn: Amber-Golden Timber Planks
                ctx.fillStyle = '#b45309';
                ctx.beginPath();
                ctx.roundRect(p.x, p.y, p.w, p.h, 4);
                ctx.fill();

                ctx.strokeStyle = '#78350f';
                ctx.lineWidth = 2.5;
                ctx.stroke();

                ctx.fillStyle = '#d97706';
                for (let px = p.x + 14; px < p.x + p.w; px += 18) {
                    ctx.fillRect(px, p.y, 2, p.h);
                }
            } else if (p.type === 'autumn_gold') {
                // Autumn: Sunlit Gold Heavens
                ctx.fillStyle = '#d97706';
                ctx.beginPath();
                ctx.roundRect(p.x, p.y, p.w, p.h, 6);
                ctx.fill();

                ctx.strokeStyle = '#fed7aa';
                ctx.lineWidth = 2.5;
                ctx.stroke();
            } else if (p.type === 'jungle_sandstone') {
                // Summer: Tropical Sandstone with Jungle Vine Cap
                ctx.fillStyle = '#d97706';
                ctx.fillRect(p.x, p.y + 6, p.w, p.h - 6);

                ctx.strokeStyle = '#78350f';
                ctx.lineWidth = 2.5;
                ctx.strokeRect(p.x, p.y + 6, p.w, p.h - 6);

                // Bright Green Tropical Moss Cap
                ctx.fillStyle = '#16a34a';
                ctx.beginPath();
                ctx.roundRect(p.x - 2, p.y, p.w + 4, 9, [4, 4, 0, 0]);
                ctx.fill();
            } else if (p.type === 'tropical_wood') {
                // Summer: Deep Palm/Teak Wood
                ctx.fillStyle = '#7c2d12';
                ctx.beginPath();
                ctx.roundRect(p.x, p.y, p.w, p.h, 4);
                ctx.fill();

                ctx.strokeStyle = '#431407';
                ctx.lineWidth = 2.5;
                ctx.stroke();
            } else if (p.type === 'volcanic_sun') {
                // Summer: Sunburst Volcanic Block
                const sunGrad = ctx.createLinearGradient(p.x, p.y, p.x, p.y + p.h);
                sunGrad.addColorStop(0, '#fde047');
                sunGrad.addColorStop(1, '#ea580c');
                ctx.fillStyle = sunGrad;
                ctx.beginPath();
                ctx.roundRect(p.x, p.y, p.w, p.h, 6);
                ctx.fill();

                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 2;
                ctx.stroke();
            } else if (p.type === 'ancient_brick') {
                // Medieval Ancient Castle Stone
                ctx.fillStyle = '#475569';
                ctx.fillRect(p.x, p.y, p.w, p.h);

                ctx.strokeStyle = '#1e293b';
                ctx.lineWidth = 2.5;
                ctx.strokeRect(p.x, p.y, p.w, p.h);

                ctx.strokeStyle = '#334155';
                ctx.lineWidth = 1.5;
                for (let bx = p.x + 16; bx < p.x + p.w; bx += 20) {
                    ctx.beginPath();
                    ctx.moveTo(bx, p.y);
                    ctx.lineTo(bx, p.y + p.h);
                    ctx.stroke();
                }
            } else if (p.type === 'obsidian_magma') {
                // Volcanic Obsidian with Magma Veins
                ctx.fillStyle = '#18181b';
                ctx.beginPath();
                ctx.roundRect(p.x, p.y, p.w, p.h, 4);
                ctx.fill();

                ctx.strokeStyle = '#dc2626';
                ctx.lineWidth = 2;
                ctx.stroke();

                ctx.strokeStyle = '#f97316';
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(p.x + 4, p.y + p.h / 2);
                ctx.lineTo(p.x + p.w - 4, p.y + p.h / 2);
                ctx.stroke();
            } else if (p.type === 'wood_bridge' || p.type === 'moving_wood') {
                ctx.fillStyle = '#92400e';
                ctx.beginPath();
                ctx.roundRect(p.x, p.y, p.w, p.h, 4);
                ctx.fill();

                ctx.strokeStyle = '#451a03';
                ctx.lineWidth = 2.5;
                ctx.stroke();

                ctx.fillStyle = '#78350f';
                for (let px = p.x + 16; px < p.x + p.w; px += 20) {
                    ctx.fillRect(px, p.y, 2.5, p.h);
                }

                ctx.fillStyle = '#b45309';
                ctx.fillRect(p.x - 2, p.y - 8, 5, p.h + 8);
                ctx.fillRect(p.x + p.w - 3, p.y - 8, 5, p.h + 8);
            } else if (p.type === 'crystal_ice') {
                const iceGrad = ctx.createLinearGradient(p.x, p.y, p.x, p.y + p.h);
                iceGrad.addColorStop(0, '#e0f2fe');
                iceGrad.addColorStop(1, '#38bdf8');
                ctx.fillStyle = iceGrad;
                ctx.beginPath();
                ctx.roundRect(p.x, p.y, p.w, p.h, 6);
                ctx.fill();

                ctx.strokeStyle = '#bae6fd';
                ctx.lineWidth = 2.5;
                ctx.stroke();

                // Ice shine glint
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(p.x + 4, p.y + 3, Math.min(18, p.w - 8), 2.5);
            } else if (p.type === 'crumbling') {
                ctx.fillStyle = p.crumbleTimer > 0 ? '#dc2626' : '#78716c';
                ctx.beginPath();
                ctx.roundRect(p.x, p.y, p.w, p.h, 4);
                ctx.fill();

                ctx.strokeStyle = '#292524';
                ctx.lineWidth = 2.5;
                ctx.stroke();

                if (p.crumbleTimer > 0) {
                    ctx.strokeStyle = '#ffffff';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(p.x + 6, p.y + 4);
                    ctx.lineTo(p.x + p.w / 2, p.y + p.h - 4);
                    ctx.lineTo(p.x + p.w - 6, p.y + 6);
                    ctx.stroke();
                }
            } else if (p.type === 'ramp' || p.isRamp) {
                // Slanted Ramp
                ctx.fillStyle = '#b45309';
                ctx.beginPath();
                if (p.slope > 0) {
                    ctx.moveTo(p.x, p.y + p.h);
                    ctx.lineTo(p.x + p.w, p.y);
                    ctx.lineTo(p.x + p.w, p.y + p.h);
                } else {
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p.x + p.w, p.y + p.h);
                    ctx.lineTo(p.x, p.y + p.h);
                }
                ctx.closePath();
                ctx.fill();

                ctx.strokeStyle = '#451a03';
                ctx.lineWidth = 2.5;
                ctx.stroke();

                // Plank lines on ramp
                ctx.strokeStyle = '#78350f';
                ctx.lineWidth = 1.5;
                for (let rx = p.x + 12; rx < p.x + p.w; rx += 14) {
                    const ratio = (rx - p.x) / p.w;
                    const topY = p.slope > 0 ? (p.y + p.h - ratio * p.h) : (p.y + ratio * p.h);
                    ctx.beginPath();
                    ctx.moveTo(rx, topY);
                    ctx.lineTo(rx, p.y + p.h);
                    ctx.stroke();
                }
            } else if (p.type === 'conveyor' || p.isConveyor) {
                // Conveyor Belt Platform
                ctx.fillStyle = '#1e293b';
                ctx.beginPath();
                ctx.roundRect(p.x, p.y, p.w, p.h, 4);
                ctx.fill();

                ctx.strokeStyle = '#0284c7';
                ctx.lineWidth = 2.5;
                ctx.stroke();

                // Animated Conveyor Tread Arrows
                const dir = (p.conveyorSpeed || 1) > 0 ? 1 : -1;
                const offset = (performance.now() / 120 * dir) % 18;
                ctx.fillStyle = '#38bdf8';
                ctx.font = 'bold 11px sans-serif';
                ctx.textAlign = 'center';
                for (let cx = p.x + 10 + (offset < 0 ? offset + 18 : offset); cx < p.x + p.w - 8; cx += 18) {
                    ctx.fillText(dir > 0 ? '▶' : '◀', cx, p.y + p.h - 5);
                }
            } else if (p.type === 'gold_citadel') {
                ctx.fillStyle = '#f59e0b';
                ctx.beginPath();
                ctx.roundRect(p.x, p.y, p.w, p.h, 6);
                ctx.fill();

                ctx.strokeStyle = '#fef08a';
                ctx.lineWidth = 3;
                ctx.stroke();
            } else {
                ctx.fillStyle = '#64748b';
                ctx.beginPath();
                ctx.roundRect(p.x, p.y, p.w, p.h, 4);
                ctx.fill();
            }
        }
    }

    renderLaserGates(ctx, map) {
        if (!map.laserGates) return;

        const halfW = (this.canvas.width / this.zoom) / 2 + 150;
        const halfH = (this.canvas.height / this.zoom) / 2 + 150;
        const minX = this.camera.x - halfW;
        const maxX = this.camera.x + halfW;
        const minY = this.camera.y - halfH;
        const maxY = this.camera.y + halfH;

        const time = performance.now() / 1000;
        for (let lg of map.laserGates) {
            if (lg.x + lg.w < minX || lg.x > maxX || lg.y + lg.h < minY || lg.y > maxY) continue;

            // Emitter Posts
            ctx.fillStyle = '#1e293b';
            ctx.fillRect(lg.x - 5, lg.y - 6, 10, lg.h + 12);
            ctx.fillRect(lg.x + lg.w - 5, lg.y - 6, 10, lg.h + 12);

            ctx.strokeStyle = '#475569';
            ctx.lineWidth = 2;
            ctx.strokeRect(lg.x - 5, lg.y - 6, 10, lg.h + 12);
            ctx.strokeRect(lg.x + lg.w - 5, lg.y - 6, 10, lg.h + 12);

            // Glowing Crystal Nodes
            const nodeColor = lg.active ? '#ef4444' : (lg.warning ? '#f59e0b' : '#334155');
            ctx.fillStyle = nodeColor;
            ctx.beginPath();
            ctx.arc(lg.x, lg.y + lg.h / 2, 5, 0, Math.PI * 2);
            ctx.arc(lg.x + lg.w, lg.y + lg.h / 2, 5, 0, Math.PI * 2);
            ctx.fill();

            if (lg.active) {
                // Active Laser Energy Beam
                ctx.save();
                ctx.shadowColor = '#ef4444';
                ctx.shadowBlur = 14;

                // Outer Laser Glow Beam
                const beamAlpha = 0.75 + Math.sin(time * 18) * 0.2;
                ctx.strokeStyle = `rgba(239, 68, 68, ${beamAlpha})`;
                ctx.lineWidth = lg.h;
                ctx.beginPath();
                ctx.moveTo(lg.x, lg.y + lg.h / 2);
                ctx.lineTo(lg.x + lg.w, lg.y + lg.h / 2);
                ctx.stroke();

                // High-Intensity White Core
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo(lg.x, lg.y + lg.h / 2);
                ctx.lineTo(lg.x + lg.w, lg.y + lg.h / 2);
                ctx.stroke();

                ctx.restore();
            } else if (lg.warning) {
                // Pre-firing Warning Blinking Sparks
                const blink = Math.sin(time * 30) > 0;
                if (blink) {
                    ctx.strokeStyle = 'rgba(245, 158, 11, 0.75)';
                    ctx.lineWidth = 2;
                    ctx.setLineDash([4, 4]);
                    ctx.beginPath();
                    ctx.moveTo(lg.x, lg.y + lg.h / 2);
                    ctx.lineTo(lg.x + lg.w, lg.y + lg.h / 2);
                    ctx.stroke();
                    ctx.setLineDash([]);
                }
            }
        }
    }

    renderInteractiveObjects(ctx, map) {
        const halfW = (this.canvas.width / this.zoom) / 2 + 150;
        const halfH = (this.canvas.height / this.zoom) / 2 + 150;
        const minX = this.camera.x - halfW;
        const maxX = this.camera.x + halfW;
        const minY = this.camera.y - halfH;
        const maxY = this.camera.y + halfH;

        for (let obj of map.interactiveObjects) {
            if (obj.x + obj.w < minX || obj.x > maxX || obj.y + obj.h < minY || obj.y > maxY) continue;

            if (obj.type === 'spring') {
                ctx.fillStyle = '#1e293b';
                ctx.fillRect(obj.x + 4, obj.y + obj.h - 4, obj.w - 8, 4);

                ctx.strokeStyle = '#94a3b8';
                ctx.lineWidth = 3;
                ctx.beginPath();
                const squish = obj.activeAnim ? 8 : 0;
                ctx.moveTo(obj.x + 8, obj.y + obj.h - 4);
                ctx.lineTo(obj.x + obj.w - 8, obj.y + 8 + squish);
                ctx.lineTo(obj.x + 8, obj.y + 4 + squish);
                ctx.stroke();

                ctx.fillStyle = '#38bdf8';
                ctx.beginPath();
                ctx.roundRect(obj.x + 2, obj.y + squish, obj.w - 4, 6, 3);
                ctx.fill();

                ctx.strokeStyle = '#0284c7';
                ctx.lineWidth = 1.5;
                ctx.stroke();
            } else if (obj.type === 'victory_flag') {
                ctx.fillStyle = '#f59e0b';
                ctx.fillRect(obj.x + 4, obj.y, 4, obj.h);

                ctx.fillStyle = '#dc2626';
                ctx.beginPath();
                ctx.moveTo(obj.x + 8, obj.y);
                ctx.lineTo(obj.x + 42, obj.y + 16);
                ctx.lineTo(obj.x + 8, obj.y + 32);
                ctx.closePath();
                ctx.fill();

                ctx.font = '22px sans-serif';
                ctx.fillText('🏁', obj.x + 12, obj.y + 24);
            } else if (obj.type === 'weapon_item' || obj.type === 'ammo_box') {
                if (!obj.collected) {
                    const hoverY = obj.y + Math.sin(Date.now() * 0.005 + (obj.floatOffset || 0)) * 4.0;
                    const itemType = obj.item_type || 'pistol';

                    ctx.save();
                    // Glow color based on weapon
                    let glowColor = '#3b82f6';
                    let badgeLabel = '🔫 2x';
                    let borderGrad = ['#93c5fd', '#3b82f6', '#1d4ed8'];

                    if (itemType === 'shotgun') {
                        glowColor = '#ea580c';
                        badgeLabel = '💥 4x';
                        borderGrad = ['#fdba74', '#ea580c', '#9a3412'];
                    } else if (itemType === 'ak47') {
                        glowColor = '#eab308';
                        badgeLabel = '⚡ 15x';
                        borderGrad = ['#fef08a', '#eab308', '#854d0e'];
                    }

                    ctx.shadowColor = glowColor;
                    ctx.shadowBlur = 14;

                    // Weapon Box
                    const boxGrad = ctx.createLinearGradient(obj.x, hoverY, obj.x, hoverY + obj.h);
                    boxGrad.addColorStop(0, borderGrad[0]);
                    boxGrad.addColorStop(0.5, borderGrad[1]);
                    boxGrad.addColorStop(1, borderGrad[2]);
                    ctx.fillStyle = boxGrad;
                    ctx.beginPath();
                    ctx.roundRect(obj.x, hoverY, obj.w, obj.h, 5);
                    ctx.fill();

                    // Inner Dark Compartment
                    ctx.fillStyle = '#0f172a';
                    ctx.beginPath();
                    ctx.roundRect(obj.x + 2.5, hoverY + 2.5, obj.w - 5, obj.h - 5, 3);
                    ctx.fill();

                    // Weapon Icon & Ammo badge
                    ctx.font = '14px sans-serif';
                    ctx.textAlign = 'center';
                    const icon = obj.icon || (itemType === 'shotgun' ? '💥' : (itemType === 'ak47' ? '⚡' : '🔫'));
                    ctx.fillText(icon, obj.x + obj.w / 2, hoverY + 16);

                    // Tiny overhead ammo count
                    ctx.font = 'bold 9px Fredoka, sans-serif';
                    ctx.fillStyle = '#ffffff';
                    ctx.fillText(badgeLabel, obj.x + obj.w / 2, hoverY - 4);

                    ctx.restore();
                }
            } else if (obj.type === 'medkit') {
                if (!obj.collected) {
                    const hoverY = obj.y + Math.sin(Date.now() * 0.005 + (obj.floatOffset || 0)) * 4.0;

                    ctx.save();
                    ctx.shadowColor = '#22c55e';
                    ctx.shadowBlur = 14;

                    // Green / White Medical Kit Body
                    const kitGrad = ctx.createLinearGradient(obj.x, hoverY, obj.x, hoverY + obj.h);
                    kitGrad.addColorStop(0, '#86efac');
                    kitGrad.addColorStop(0.5, '#22c55e');
                    kitGrad.addColorStop(1, '#15803d');
                    ctx.fillStyle = kitGrad;
                    ctx.beginPath();
                    ctx.roundRect(obj.x, hoverY, obj.w, obj.h, 5);
                    ctx.fill();

                    // White first aid cross box
                    ctx.fillStyle = '#ffffff';
                    ctx.beginPath();
                    ctx.roundRect(obj.x + 3, hoverY + 3, obj.w - 6, obj.h - 6, 3);
                    ctx.fill();

                    // Red Cross
                    ctx.fillStyle = '#ef4444';
                    ctx.fillRect(obj.x + obj.w / 2 - 2, hoverY + 5, 4, 14);
                    ctx.fillRect(obj.x + 6, hoverY + obj.h / 2 - 2, 16, 4);

                    // Overhead +50 HP Tag
                    ctx.font = 'bold 9px Fredoka, sans-serif';
                    ctx.fillStyle = '#4ade80';
                    ctx.textAlign = 'center';
                    ctx.fillText('💊 +50 HP', obj.x + obj.w / 2, hoverY - 4);

                    ctx.restore();
                }
            }
        }
    }


    renderPlayer(ctx, player, isLocal, isBlackout = false) {
        ctx.save();
        ctx.translate(player.x + player.w / 2, player.y + player.h / 2);

        if (player.isGhost) {
            ctx.globalAlpha = 0.45;
        }

        if (player.isChickenMorph || (player.chickenTimer && player.chickenTimer > 0)) {
            const bw = player.w;
            const bh = player.h - 8;
            const wingFlap = Math.sin(Date.now() * 0.025) * 10;
            const facingDir = player.facing >= 0 ? 1 : -1;

            // Orange feet
            ctx.fillStyle = '#ea580c';
            ctx.strokeStyle = '#9a3412';
            ctx.lineWidth = 1.5;
            ctx.fillRect(-bw / 2 + 4, bh / 2, 6, 5);
            ctx.fillRect(bw / 2 - 10, bh / 2, 6, 5);

            // Plump white feather body
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.ellipse(0, 0, bw / 2 + 2, bh / 2 + 2, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#cbd5e1';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Red comb on head
            ctx.fillStyle = '#ef4444';
            ctx.beginPath();
            ctx.arc(-4, -bh / 2 - 5, 4, 0, Math.PI * 2);
            ctx.arc(2, -bh / 2 - 7, 4.5, 0, Math.PI * 2);
            ctx.arc(8, -bh / 2 - 4, 3.5, 0, Math.PI * 2);
            ctx.fill();

            // Flapping Wing
            ctx.fillStyle = '#f1f5f9';
            ctx.strokeStyle = '#94a3b8';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.ellipse(-facingDir * 4, wingFlap * 0.3, 9, 6, (wingFlap * Math.PI) / 180, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // Yellow Beak
            ctx.fillStyle = '#f59e0b';
            ctx.beginPath();
            ctx.moveTo(facingDir * (bw / 2 - 2), -3);
            ctx.lineTo(facingDir * (bw / 2 + 9), 0);
            ctx.lineTo(facingDir * (bw / 2 - 2), 4);
            ctx.closePath();
            ctx.fill();

            // Red wattle
            ctx.fillStyle = '#dc2626';
            ctx.beginPath();
            ctx.arc(facingDir * (bw / 2 - 1), 5, 3, 0, Math.PI * 2);
            ctx.fill();

            // Big goofy eye
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(facingDir * 6, -5, 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#0f172a';
            ctx.beginPath();
            ctx.arc(facingDir * 7.5, -5, 2.5, 0, Math.PI * 2);
            ctx.fill();

            // "COCK-A-DOODLE-DOO" / Cacarejo bubble floating above
            if (Math.sin(Date.now() * 0.003) > 0.6) {
                ctx.font = 'bold 11px Fredoka, sans-serif';
                ctx.fillStyle = '#facc15';
                ctx.textAlign = 'center';
                ctx.fillText('🐔 PÓ PÓ PÓ!', 0, -bh / 2 - 16);
            }

            // Name Overhead Tag
            ctx.font = 'bold 11px Fredoka, sans-serif';
            ctx.fillStyle = player.color || '#ffffff';
            ctx.textAlign = 'center';
            ctx.fillText(player.name + ' 🐔', 0, -bh / 2 - 28);

            ctx.restore();
            return;
        }

        let scaleX = 1.0;
        let scaleY = 1.0;
        if (player.anim === 'jump') {
            scaleX = 0.88;
            scaleY = 1.15;
        } else if (player.anim === 'fall') {
            scaleX = 0.92;
            scaleY = 1.1;
        } else if (player.anim === 'run') {
            scaleY = 1.0 + Math.sin(player.animTimer) * 0.06;
            scaleX = 1.0 - Math.sin(player.animTimer) * 0.06;
        }
        ctx.scale(scaleX, scaleY);

        const bw = player.w;
        const bh = player.h - 8;

        // 1. Animated Legs & Shoes (Gimkit bean character feet)
        const legW = 6;
        const legH = 8;
        let leftLegOffset = 0;
        let rightLegOffset = 0;

        if (player.anim === 'run') {
            leftLegOffset = Math.sin(player.animTimer) * 4;
            rightLegOffset = Math.sin(player.animTimer + Math.PI) * 4;
        } else if (player.anim === 'jump') {
            leftLegOffset = -2;
            rightLegOffset = -1;
        } else if (player.anim === 'fall') {
            leftLegOffset = 1;
            rightLegOffset = 2;
        }

        const lH = Math.max(3, legH + leftLegOffset);
        const rH = Math.max(3, legH + rightLegOffset);

        ctx.fillStyle = player.color;
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 2;

        // Left leg
        ctx.beginPath();
        ctx.roundRect(-bw / 2 + 4, bh / 2 - 4, legW, lH, 2);
        ctx.fill();
        ctx.stroke();

        // Right leg
        ctx.beginPath();
        ctx.roundRect(bw / 2 - 4 - legW, bh / 2 - 4, legW, rH, 2);
        ctx.fill();
        ctx.stroke();

        // 2. Cute Bean / Pill Body
        ctx.fillStyle = player.color;
        ctx.beginPath();
        ctx.roundRect(-bw / 2, -bh / 2 - 4, bw, bh + 4, 13);
        ctx.fill();

        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // 2.5. Elbow Shove Action Arm (Cotovelada)
        if (player.isShoving) {
            ctx.save();
            ctx.fillStyle = player.color;
            ctx.strokeStyle = '#0f172a';
            ctx.lineWidth = 2;
            const armDir = (player.facing >= 0) ? 1 : -1;
            const armX = armDir > 0 ? (bw / 2 - 2) : (-bw / 2 - 12);
            ctx.beginPath();
            ctx.roundRect(armX, -6, 14, 9, 3);
            ctx.fill();
            ctx.stroke();

            // Fist / elbow punch highlight
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(armDir > 0 ? armX + 11 : armX + 3, -1.5, 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        // 2.7. Waist Holster Belt & Mini Blaster Pistol (Arminha na cintura apontando para a mira do mouse)
        ctx.save();
        const gunDir = (player.facing >= 0) ? 1 : -1;
        const hipX = gunDir > 0 ? (bw / 2 - 2) : (-bw / 2 + 2);
        const hipY = 5;
        
        // Leather holster belt around waist
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(-bw / 2 - 1, 3, bw + 2, 3);
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(-2, 3, 4, 3);

        // Holster base on hip
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.roundRect(hipX - (gunDir > 0 ? 3 : 5), 2, 8, 8, 2);
        ctx.fill();
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Mini Blaster Pistol with Dynamic Aim Angle
        ctx.save();
        ctx.translate(hipX, hipY);

        let gunAngle = (player.aimAngle !== undefined && player.aimAngle !== null) ? player.aimAngle : (gunDir > 0 ? 0 : Math.PI);
        ctx.rotate(gunAngle);

        // Pistol Body
        ctx.fillStyle = '#334155'; // Grip
        ctx.fillRect(-2, -2, 4, 4);
        ctx.fillStyle = '#94a3b8'; // Barrel
        ctx.fillRect(2, -2, 9, 4);
        ctx.fillStyle = '#f59e0b'; // Nozzle
        ctx.fillRect(11, -2.5, 3, 5);

        // Ammo Status Laser / LED
        if (player.ammo && player.ammo > 0) {
            ctx.shadowColor = '#22c55e';
            ctx.shadowBlur = 6;
            ctx.fillStyle = '#4ade80';
            ctx.beginPath();
            ctx.arc(6, 0, 1.5, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.fillStyle = '#64748b';
            ctx.beginPath();
            ctx.arc(6, 0, 1.0, 0, Math.PI * 2);
            ctx.fill();
        }

        // Shooting Muzzle Flash
        if (player.shootTimer && player.shootTimer > 0) {
            ctx.shadowColor = '#fbbf24';
            ctx.shadowBlur = 14;
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(15, 0, 6, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
        ctx.restore();

        // 3. Eyes (Looking in facing direction / Mega Glowing Bulb Lamps during Blackout)
        const eyeOffsetX = (player.facing >= 0 ? 1 : -1) * 4;
        const eyeY = -6;

        if (isBlackout) {
            const beamDir = (player.facing >= 0) ? 1 : -1;
            const beamAngle = beamDir > 0 ? 0 : Math.PI;
            const leftEyeX = -4 + eyeOffsetX;
            const rightEyeX = 5 + eyeOffsetX;

            // Layer 1: Ground Reflection / Low-beam forward road illumination
            ctx.save();
            const groundGrad = ctx.createRadialGradient(beamDir * 80, 14, 8, beamDir * 80, 14, 110);
            groundGrad.addColorStop(0, 'rgba(254, 240, 138, 0.28)');
            groundGrad.addColorStop(0.55, 'rgba(250, 204, 21, 0.10)');
            groundGrad.addColorStop(1, 'rgba(250, 204, 21, 0)');
            ctx.fillStyle = groundGrad;
            ctx.beginPath();
            ctx.ellipse(beamDir * 80, 14, 110, 22, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();

            // Layer 2: Twin Automotive Forward Headlight Beam Cones (Faróis de Carro)
            ctx.save();
            [leftEyeX, rightEyeX].forEach((hx) => {
                const beamGrad = ctx.createRadialGradient(hx, eyeY, 3, hx + beamDir * 120, eyeY + 4, 220);
                beamGrad.addColorStop(0, 'rgba(255, 255, 255, 0.55)');
                beamGrad.addColorStop(0.18, 'rgba(254, 240, 138, 0.35)');
                beamGrad.addColorStop(0.55, 'rgba(250, 204, 21, 0.12)');
                beamGrad.addColorStop(0.90, 'rgba(250, 204, 21, 0.03)');
                beamGrad.addColorStop(1, 'rgba(250, 204, 21, 0)');

                ctx.fillStyle = beamGrad;
                ctx.beginPath();
                ctx.moveTo(hx, eyeY);
                // 34-degree directional automotive headlight cone angled slightly downward
                ctx.arc(hx, eyeY, 220, beamAngle - 0.28, beamAngle + 0.32);
                ctx.closePath();
                ctx.fill();

                // High-intensity central projector cut line
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
                ctx.lineWidth = 2.5;
                ctx.beginPath();
                ctx.moveTo(hx, eyeY);
                ctx.lineTo(hx + beamDir * 150, eyeY + 2);
                ctx.stroke();
            });
            ctx.restore();

            // Layer 3: Headlight Bezel Housing & Chrome Rim (Faróis de Carro)
            ctx.save();
            ctx.fillStyle = '#0f172a';
            ctx.strokeStyle = '#475569';
            ctx.lineWidth = 1;

            // Left Headlight Bezel
            ctx.beginPath();
            ctx.ellipse(leftEyeX, eyeY, 3.8, 4.8, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // Right Headlight Bezel
            ctx.beginPath();
            ctx.ellipse(rightEyeX, eyeY, 3.8, 4.8, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // Layer 4: Projector Lens with Crisp Halogen Glow (Balanced & Non-blinding)
            ctx.shadowColor = '#fde047';
            ctx.shadowBlur = 10;
            ctx.fillStyle = '#fef08a';

            ctx.beginPath();
            ctx.ellipse(leftEyeX, eyeY, 2.8, 3.8, 0, 0, Math.PI * 2);
            ctx.ellipse(rightEyeX, eyeY, 2.8, 3.8, 0, 0, Math.PI * 2);
            ctx.fill();

            // Xenon / Halogen Bright Bulb Core
            ctx.fillStyle = '#ffffff';
            ctx.shadowColor = '#ffffff';
            ctx.shadowBlur = 6;
            ctx.beginPath();
            ctx.ellipse(leftEyeX + beamDir * 0.5, eyeY, 1.4, 2.0, 0, 0, Math.PI * 2);
            ctx.ellipse(rightEyeX + beamDir * 0.5, eyeY, 1.4, 2.0, 0, 0, Math.PI * 2);
            ctx.fill();

            // Horizontal Anamorphic Lens Flare Streak (Automotive headlight effect)
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
            ctx.lineWidth = 1.0;
            ctx.beginPath();
            ctx.moveTo(leftEyeX - 6, eyeY);
            ctx.lineTo(rightEyeX + 6, eyeY);
            ctx.stroke();
            ctx.restore();
        } else {
            ctx.fillStyle = '#0f172a';
            ctx.beginPath();
            ctx.ellipse(-4 + eyeOffsetX, eyeY, 2.5, 4, 0, 0, Math.PI * 2);
            ctx.fill();

            ctx.beginPath();
            ctx.ellipse(5 + eyeOffsetX, eyeY, 2.5, 4, 0, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(-4 + eyeOffsetX - 1, eyeY - 1.5, 1, 0, Math.PI * 2);
            ctx.arc(5 + eyeOffsetX - 1, eyeY - 1.5, 1, 0, Math.PI * 2);
            ctx.fill();
        }

        // 4. Balloon if Gliding
        if (player.isBalloonGliding) {
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(0, -bh / 2 - 4);
            ctx.lineTo(0, -bh / 2 - 30);
            ctx.stroke();

            ctx.fillStyle = '#ef4444';
            ctx.beginPath();
            ctx.arc(0, -bh / 2 - 40, 14, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        }

        ctx.restore();

        // 5. Overheads (Crown, "Você" Indicator, Name Tag)
        if (player.isCrownHolder) {
            ctx.font = '16px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('👑', player.x + player.w / 2, player.y - 32);
        }

        if (isLocal) {
            const badgeY = player.y - (player.isCrownHolder ? 48 : 34);
            ctx.fillStyle = '#3b82f6';
            ctx.beginPath();
            ctx.roundRect(player.x + player.w / 2 - 18, badgeY, 36, 16, 4);
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(player.x + player.w / 2 - 4, badgeY + 16);
            ctx.lineTo(player.x + player.w / 2 + 4, badgeY + 16);
            ctx.lineTo(player.x + player.w / 2, badgeY + 20);
            ctx.fill();

            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 9px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('Você', player.x + player.w / 2, badgeY + 11);
        }

        const nameY = player.y - 10;
        ctx.font = 'bold 11px sans-serif';
        const textWidth = ctx.measureText(player.name).width;
        const pillW = Math.max(34, textWidth + 12);

        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.beginPath();
        ctx.roundRect(player.x + player.w / 2 - pillW / 2, nameY - 11, pillW, 14, 4);
        ctx.fill();

        ctx.fillStyle = '#f8fafc';
        ctx.textAlign = 'center';
        ctx.fillText(player.name, player.x + player.w / 2, nameY);

        // 5.5. Mini Health Bar under player character feet
        const hpMax = player.maxHp || 100;
        const hpVal = (player.hp !== undefined) ? player.hp : 100;
        const hpPct = Math.max(0, Math.min(1, hpVal / hpMax));
        const barW = 32;
        const barH = 4;
        const barX = player.x + player.w / 2 - barW / 2;
        const barY = player.y + player.h + 4;

        // Health bar background frame
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.beginPath();
        ctx.roundRect(barX - 1, barY - 1, barW + 2, barH + 2, 2);
        ctx.fill();

        // Health bar colored fill
        const hpColor = hpPct > 0.5 ? '#22c55e' : (hpPct > 0.25 ? '#eab308' : '#ef4444');
        ctx.fillStyle = hpColor;
        ctx.beginPath();
        ctx.roundRect(barX, barY, Math.max(2, barW * hpPct), barH, 2);
        ctx.fill();

        // 5.8. Player Dead / Ghost Countdown Tag
        if (player.isDead) {
            ctx.save();
            ctx.font = 'bold 11px Fredoka, sans-serif';
            ctx.fillStyle = '#f87171';
            ctx.textAlign = 'center';
            const timeRemaining = Math.max(0.1, player.respawnTimer || 3.0).toFixed(1);
            ctx.fillText(`💀 ${timeRemaining}s`, player.x + player.w / 2, nameY - 20);
            ctx.restore();
        }

        // 6. Overhead Animated Emote Speech Bubble (Spammed by Bots & Players)
        if (player.emote) {
            const charSeed = (player.id && typeof player.id === 'string') ? player.id.charCodeAt(0) : 0;
            const bob = Math.sin(Date.now() * 0.007 + charSeed) * 2.5;
            const bubbleY = nameY - (player.isCrownHolder ? 38 : 22) + bob;
            ctx.font = 'bold 12px sans-serif';
            const emWidth = ctx.measureText(player.emote).width;
            const bW = Math.max(26, emWidth + 12);
            const bH = 20;

            // Bubble background with border
            ctx.fillStyle = '#ffffff';
            ctx.strokeStyle = '#0f172a';
            ctx.lineWidth = 1.8;
            ctx.beginPath();
            ctx.roundRect(player.x + player.w / 2 - bW / 2, bubbleY - bH, bW, bH, 6);
            ctx.fill();
            ctx.stroke();

            // Pointer tip pointing down to head
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.moveTo(player.x + player.w / 2 - 4, bubbleY);
            ctx.lineTo(player.x + player.w / 2 + 4, bubbleY);
            ctx.lineTo(player.x + player.w / 2, bubbleY + 5);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Emote text/icon
            ctx.fillStyle = '#0f172a';
            ctx.textAlign = 'center';
            ctx.fillText(player.emote, player.x + player.w / 2, bubbleY - 5);
        }

        // 7. Stun Effect: Circling Dizzy Stars (quando atingido por tiro)
        if (player.isStunned) {
            ctx.save();
            const time = Date.now() * 0.009;
            const starRadius = 14;
            const cx = player.x + player.w / 2;
            const cy = nameY - (player.isCrownHolder ? 32 : 18);

            ctx.font = 'bold 11px sans-serif';
            ctx.textAlign = 'center';
            for (let i = 0; i < 3; i++) {
                const angle = time + (i * Math.PI * 2 / 3);
                const sx = cx + Math.cos(angle) * starRadius;
                const sy = cy + Math.sin(angle) * (starRadius * 0.42);
                ctx.fillText('💫', sx, sy);
            }
            ctx.restore();
        }

        // 7.2. Cosmic Drunk Dizzy Orbiting Bubbles & Mugs
        if (player.isDrunk || player.drunkTimer > 0) {
            ctx.save();
            const time = Date.now() * 0.007;
            const orbitR = 17;
            const cx = player.x + player.w / 2;
            const cy = nameY - (player.isCrownHolder ? 36 : 22);
            ctx.font = 'bold 13px sans-serif';
            ctx.textAlign = 'center';
            const drunkIcons = ['🍺', '💫', '🌀'];
            for (let i = 0; i < 3; i++) {
                const angle = time + (i * Math.PI * 2 / 3);
                const sx = cx + Math.cos(angle) * orbitR;
                const sy = cy + Math.sin(angle) * (orbitR * 0.45);
                ctx.fillText(drunkIcons[i], sx, sy);
            }
            ctx.restore();
        }

        // 7.5. King of the Hill Golden Crown & Radiance Aura
        const isKingActive = !!(window.gameClient && window.gameClient.isKingOfHillActive && window.gameClient.kingId === player.id);
        if (isKingActive) {
            ctx.save();
            const crownBob = Math.sin(Date.now() * 0.006) * 3.5;
            const crownY = nameY - 26 + crownBob;

            // Golden radiant aura ring
            ctx.shadowColor = '#facc15';
            ctx.shadowBlur = 16;
            ctx.strokeStyle = '#fde047';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.arc(player.x + player.w / 2, player.y + player.h / 2, 22, 0, Math.PI * 2);
            ctx.stroke();

            // Floating Golden Crown
            ctx.font = '22px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('👑', player.x + player.w / 2, crownY);
            ctx.restore();
        }

        // 8. Chained Effect: Metallic Iron Chains Anchoring Player to Obstacle
        if (player.isChained && player.chainAnchorX && player.chainAnchorY) {
            ctx.save();
            const px = player.x + player.w / 2;
            const py = player.y + player.h / 2;
            const ax = player.chainAnchorX;
            const ay = player.chainAnchorY;

            const dx = ax - px;
            const dy = ay - py;
            const dist = Math.hypot(dx, dy);
            const angle = Math.atan2(dy, dx);

            // 1. Draw Interlocking Metallic Chain Links along tether line
            const linkStep = 12;
            const numLinks = Math.max(2, Math.floor(dist / linkStep));

            for (let i = 0; i <= numLinks; i++) {
                const t = i / numLinks;
                const lx = px + dx * t;
                const ly = py + dy * t + Math.sin(t * Math.PI) * 4; // Slight realistic chain sag

                ctx.save();
                ctx.translate(lx, ly);
                ctx.rotate(angle + (i % 2 === 0 ? 0 : Math.PI / 12));

                // Link outer iron
                ctx.strokeStyle = '#1e293b';
                ctx.lineWidth = 4.5;
                ctx.beginPath();
                ctx.ellipse(0, 0, 7, 3.5, 0, 0, Math.PI * 2);
                ctx.stroke();

                // Link metallic highlight
                ctx.strokeStyle = (i % 2 === 0) ? '#94a3b8' : '#cbd5e1';
                ctx.lineWidth = 2.2;
                ctx.beginPath();
                ctx.ellipse(0, 0, 6, 2.8, 0, 0, Math.PI * 2);
                ctx.stroke();

                ctx.restore();
            }

            // 2. Heavy Anchor Bolt / Padlock on Platform Obstacle (ax, ay)
            ctx.fillStyle = '#334155';
            ctx.strokeStyle = '#94a3b8';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.roundRect(ax - 8, ay - 8, 16, 16, 4);
            ctx.fill();
            ctx.stroke();

            // Anchor golden rivet
            ctx.fillStyle = '#facc15';
            ctx.beginPath();
            ctx.arc(ax, ay, 3, 0, Math.PI * 2);
            ctx.fill();

            // 3. Heavy Iron Chains Wrapped Tightly Around Player Character Body
            ctx.strokeStyle = '#0f172a';
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.ellipse(px, py - 2, 16, 8, -Math.PI / 6, 0, Math.PI * 2);
            ctx.ellipse(px, py + 2, 16, 8, Math.PI / 6, 0, Math.PI * 2);
            ctx.ellipse(px, py, 17, 7, 0, 0, Math.PI * 2);
            ctx.stroke();

            ctx.strokeStyle = '#94a3b8';
            ctx.lineWidth = 2.8;
            ctx.setLineDash([4, 3]);
            ctx.beginPath();
            ctx.ellipse(px, py - 2, 16, 8, -Math.PI / 6, 0, Math.PI * 2);
            ctx.ellipse(px, py + 2, 16, 8, Math.PI / 6, 0, Math.PI * 2);
            ctx.ellipse(px, py, 17, 7, 0, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]);

            // 4. Heavy Brass Padlock on Player Chest
            ctx.fillStyle = '#475569';
            ctx.strokeStyle = '#cbd5e1';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.roundRect(px - 6, py - 5, 12, 11, 2.5);
            ctx.fill();
            ctx.stroke();

            // Padlock golden keyhole
            ctx.fillStyle = '#facc15';
            ctx.beginPath();
            ctx.arc(px, py - 1, 1.8, 0, Math.PI * 2);
            ctx.rect(px - 1, py - 1, 2, 3);
            ctx.fill();

            ctx.restore();
        }
    }

    renderChainCrosshair(ctx, aimX, aimY) {
        ctx.save();
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 2;

        // Circular metallic chain reticle
        ctx.beginPath();
        ctx.arc(aimX, aimY, 22, 0, Math.PI * 2);
        ctx.stroke();

        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = '#cbd5e1';
        ctx.beginPath();
        ctx.arc(aimX, aimY, 16, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        // Chain icon center
        ctx.font = '16px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('⛓️', aimX, aimY + 6);

        ctx.restore();
    }

    renderSniperCrosshair(ctx, aimX, aimY) {
        ctx.save();
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.arc(aimX, aimY, 20, 0, Math.PI * 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(aimX - 28, aimY);
        ctx.lineTo(aimX + 28, aimY);
        ctx.moveTo(aimX, aimY - 28);
        ctx.lineTo(aimX, aimY + 28);
        ctx.stroke();

        ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(aimX, aimY - 600);
        ctx.lineTo(aimX, aimY);
        ctx.stroke();

        ctx.restore();
    }

    renderBlasterCrosshair(ctx, player, aimX, aimY) {
        const originX = player.x + player.w / 2;
        const originY = player.y + player.h / 2 + 3;

        ctx.save();

        // 1. Subtle Laser Aim Trajectory Guideline (faint glow line)
        ctx.strokeStyle = 'rgba(253, 224, 71, 0.35)';
        ctx.lineWidth = 1.2;
        ctx.setLineDash([4, 6]);
        ctx.beginPath();
        ctx.moveTo(originX, originY);
        ctx.lineTo(aimX, aimY);
        ctx.stroke();
        ctx.setLineDash([]);

        // 2. Holographic Crosshair Reticle at Mouse Position
        ctx.translate(aimX, aimY);
        const rot = Date.now() * 0.002;
        ctx.rotate(rot);

        // Glowing outer circle
        ctx.strokeStyle = '#fde047';
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 8;
        ctx.lineWidth = 1.5;

        ctx.beginPath();
        ctx.arc(0, 0, 12, 0, Math.PI * 2);
        ctx.stroke();

        // 4 Tick marks
        ctx.beginPath();
        ctx.moveTo(-16, 0); ctx.lineTo(-8, 0);
        ctx.moveTo(8, 0); ctx.lineTo(16, 0);
        ctx.moveTo(0, -16); ctx.lineTo(0, -8);
        ctx.moveTo(0, 8); ctx.lineTo(0, 16);
        ctx.stroke();

        // Center dot
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(0, 0, 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    renderParticleEffects(ctx) {
        for (let p of this.particles.particles) {
            ctx.save();
            ctx.fillStyle = p.color;
            ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        for (let l of this.particles.lasers) {
            ctx.save();
            ctx.strokeStyle = '#ef4444';
            ctx.lineWidth = 6 * (l.life / l.maxLife);
            ctx.beginPath();
            ctx.moveTo(l.x1, l.y1);
            ctx.lineTo(l.x2, l.y2);
            ctx.stroke();

            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.restore();
        }

        for (let b of this.particles.boulders) {
            if (!b.alive) continue;
            ctx.save();
            ctx.translate(b.x, b.y);
            ctx.rotate(b.rotation);

            // Outer Rock Body
            ctx.beginPath();
            ctx.moveTo(b.cragPoints[0].x, b.cragPoints[0].y);
            for (let i = 1; i < b.cragPoints.length; i++) {
                ctx.lineTo(b.cragPoints[i].x, b.cragPoints[i].y);
            }
            ctx.closePath();

            // Radial 3D rock granite gradient
            const radGrad = ctx.createRadialGradient(-b.radius * 0.3, -b.radius * 0.3, b.radius * 0.1, 0, 0, b.radius);
            radGrad.addColorStop(0, '#94a3b8');
            radGrad.addColorStop(0.45, '#475569');
            radGrad.addColorStop(0.85, '#1e293b');
            radGrad.addColorStop(1, '#0f172a');
            ctx.fillStyle = radGrad;
            ctx.fill();

            ctx.strokeStyle = '#020617';
            ctx.lineWidth = Math.max(2.5, b.radius * 0.08);
            ctx.stroke();

            // Crag Crevice Lines
            ctx.strokeStyle = '#0f172a';
            ctx.lineWidth = 2.2;
            ctx.beginPath();
            ctx.moveTo(-b.radius * 0.45, -b.radius * 0.2);
            ctx.lineTo(0, 0);
            ctx.lineTo(b.radius * 0.35, -b.radius * 0.35);
            ctx.moveTo(0, 0);
            ctx.lineTo(b.radius * 0.25, b.radius * 0.45);
            ctx.stroke();

            // Moss specks
            ctx.fillStyle = '#16a34a';
            ctx.beginPath();
            ctx.arc(-b.radius * 0.35, b.radius * 0.25, Math.max(3, b.radius * 0.16), 0, Math.PI * 2);
            ctx.fill();

            // Highlight Glint
            ctx.fillStyle = 'rgba(255, 255, 255, 0.28)';
            ctx.beginPath();
            ctx.arc(-b.radius * 0.35, -b.radius * 0.35, Math.max(4, b.radius * 0.2), 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
        }

        for (let m of this.particles.meteors) {
            ctx.save();
            // Outer Fire Glow
            const glowGrad = ctx.createRadialGradient(m.x, m.y, 2, m.x, m.y, m.radius * 1.8);
            glowGrad.addColorStop(0, '#ffffff');
            glowGrad.addColorStop(0.3, '#fde047');
            glowGrad.addColorStop(0.6, '#ea580c');
            glowGrad.addColorStop(1, 'rgba(239, 68, 68, 0)');

            ctx.fillStyle = glowGrad;
            ctx.beginPath();
            ctx.arc(m.x, m.y, m.radius * 1.8, 0, Math.PI * 2);
            ctx.fill();

            // Rock Core
            ctx.fillStyle = '#7c2d12';
            ctx.beginPath();
            ctx.arc(m.x, m.y, m.radius * 0.75, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#f97316';
            ctx.lineWidth = 3;
            ctx.stroke();

            ctx.restore();
        }

        // Render Flying Plasma Blaster Bullets
        for (let b of this.particles.bullets) {
            ctx.save();
            ctx.translate(b.x, b.y);
            const angle = Math.atan2(b.vy, b.vx);
            ctx.rotate(angle);

            // Radiant Plasma Glow
            ctx.shadowColor = b.color || '#fde047';
            ctx.shadowBlur = 12;

            // Bullet Capsule
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.roundRect(-8, -3, 16, 6, 3);
            ctx.fill();

            // Colored Plasma Rim
            ctx.strokeStyle = b.color || '#f59e0b';
            ctx.lineWidth = 1.8;
            ctx.stroke();

            // Core energy line
            ctx.fillStyle = '#fef08a';
            ctx.fillRect(-5, -1, 10, 2);

            ctx.restore();
        }

        // Render Black Holes
        this.renderBlackHoles(ctx);

        // Render Fake Summits
        this.renderFakeSummits(ctx);

        // Render Chicken Missiles
        this.renderChickenMissiles(ctx);

        // Render Boxing Gloves
        this.renderBoxingGloves(ctx);

        // Render Banana Peels
        this.renderBananaPeels(ctx);

        // Render UFO Abductions
        this.renderUfoAbductions(ctx);

        // Render Rubberbands
        this.renderRubberbands(ctx);
    }

    renderBlackHoles(ctx) {
        for (let bh of this.particles.blackHoles) {
            if (!bh.alive) continue;
            ctx.save();
            ctx.translate(bh.x, bh.y);

            // Gravitational Distortive Outer Glow Field
            const pulse = 1.0 + Math.sin(Date.now() * 0.008) * 0.08;
            const grad = ctx.createRadialGradient(0, 0, 15, 0, 0, bh.radius * pulse);
            grad.addColorStop(0, 'rgba(15, 7, 30, 0.95)');
            grad.addColorStop(0.3, 'rgba(112, 26, 117, 0.45)');
            grad.addColorStop(0.65, 'rgba(168, 85, 247, 0.18)');
            grad.addColorStop(1, 'rgba(168, 85, 247, 0)');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(0, 0, bh.radius * pulse, 0, Math.PI * 2);
            ctx.fill();

            // Swirling Accretion Spiral Arms
            ctx.rotate(bh.rotation);
            ctx.strokeStyle = '#c084fc';
            ctx.lineWidth = 3;
            for (let a = 0; a < 4; a++) {
                ctx.beginPath();
                ctx.rotate(Math.PI / 2);
                ctx.moveTo(18, 0);
                ctx.bezierCurveTo(45, 25, 90, 60, 140, 20);
                ctx.stroke();
            }

            // Dark Singularity Event Horizon Core
            ctx.fillStyle = '#05020a';
            ctx.strokeStyle = '#e879f9';
            ctx.lineWidth = 3.5;
            ctx.beginPath();
            ctx.arc(0, 0, 28, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // Singularity center point
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(0, 0, 4, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
        }
    }

    renderChickenMissiles(ctx) {
        for (let cm of this.particles.chickenMissiles) {
            if (!cm.alive) continue;
            ctx.save();
            ctx.translate(cm.x, cm.y);
            ctx.rotate(cm.angle);

            // Rocket Thruster Flame at Back
            const flameW = 14 + Math.sin(Date.now() * 0.02) * 6;
            ctx.fillStyle = '#f97316';
            ctx.beginPath();
            ctx.moveTo(-14, -5);
            ctx.lineTo(-14 - flameW, 0);
            ctx.lineTo(-14, 5);
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = '#fde047';
            ctx.beginPath();
            ctx.moveTo(-14, -2.5);
            ctx.lineTo(-14 - flameW * 0.6, 0);
            ctx.lineTo(-14, 2.5);
            ctx.closePath();
            ctx.fill();

            // Chicken Body (Egg/Round shaped)
            ctx.fillStyle = '#ffffff';
            ctx.strokeStyle = '#0f172a';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.ellipse(0, 0, 16, 12, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // Flapping Wings
            const wingFlap = Math.sin(cm.flapTimer) * 7;
            ctx.fillStyle = '#f1f5f9';
            ctx.beginPath();
            ctx.ellipse(-2, -6 + wingFlap * 0.5, 9, 5, -Math.PI / 6, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // Red Rooster Comb on top
            ctx.fillStyle = '#ef4444';
            ctx.beginPath();
            ctx.arc(4, -12, 3.5, 0, Math.PI * 2);
            ctx.arc(9, -13, 3.5, 0, Math.PI * 2);
            ctx.arc(13, -11, 3.5, 0, Math.PI * 2);
            ctx.fill();

            // Wattle below beak
            ctx.beginPath();
            ctx.ellipse(13, 6, 2.5, 4, 0, 0, Math.PI * 2);
            ctx.fill();

            // Sharp Yellow Beak
            ctx.fillStyle = '#f59e0b';
            ctx.beginPath();
            ctx.moveTo(14, -3);
            ctx.lineTo(23, 0);
            ctx.lineTo(14, 4);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Googly Eye
            ctx.fillStyle = '#0f172a';
            ctx.beginPath();
            ctx.arc(9, -3, 2.2, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(8.5, -3.5, 0.8, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
        }
    }

    renderFakeSummits(ctx) {
        for (let fs of this.particles.fakeSummits) {
            if (!fs.alive) continue;
            ctx.save();
            ctx.translate(fs.x, fs.y);

            const glow = Math.sin(fs.anim) * 0.2 + 0.8;
            ctx.shadowColor = '#facc15';
            ctx.shadowBlur = 18 * glow;

            // Golden Arch Portal Columns
            ctx.fillStyle = '#f59e0b';
            ctx.strokeStyle = '#fde047';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.roundRect(-45, -35, 14, 70, 4);
            ctx.roundRect(31, -35, 14, 70, 4);
            ctx.fill();
            ctx.stroke();

            // Top Arch Beam
            ctx.beginPath();
            ctx.roundRect(-50, -45, 100, 16, 6);
            ctx.fill();
            ctx.stroke();

            // Shimmering Hologram Victory Curtain
            ctx.fillStyle = `rgba(250, 204, 21, ${0.35 * glow})`;
            ctx.fillRect(-31, -35, 62, 70);

            // Trophy & Sign
            ctx.font = '24px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('🏆', 0, -12);

            ctx.font = 'bold 11px Fredoka, sans-serif';
            ctx.fillStyle = '#ffffff';
            ctx.shadowColor = '#000000';
            ctx.shadowBlur = 4;
            ctx.fillText('CUME DE OURO!', 0, 14);

            ctx.restore();
        }
    }

    renderBlackHoleCrosshair(ctx, aimX, aimY) {
        ctx.save();
        ctx.translate(aimX, aimY);
        ctx.rotate(Date.now() * 0.003);

        ctx.strokeStyle = '#c084fc';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(0, 0, 32, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = '#e879f9';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([6, 6]);
        ctx.beginPath();
        ctx.arc(0, 0, 50, 0, Math.PI * 2);
        ctx.stroke();

        ctx.font = '20px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🧲', 0, 7);

        ctx.restore();
    }

    renderFakeSummitCrosshair(ctx, aimX, aimY) {
        ctx.save();
        ctx.translate(aimX, aimY);

        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(-35, -25, 70, 50);

        ctx.font = '22px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🏆', 0, 8);

        ctx.restore();
    }

    renderBoxingGloveCrosshair(ctx, aimX, aimY) {
        ctx.save();
        ctx.translate(aimX, aimY);

        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 4]);
        ctx.beginPath();
        ctx.arc(0, 0, 26, 0, Math.PI * 2);
        ctx.stroke();

        ctx.font = '22px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🥊', 0, 8);

        ctx.restore();
    }

    renderBoxingGloves(ctx) {
        for (let bg of this.particles.boxingGloves) {
            if (!bg.alive) continue;
            ctx.save();
            ctx.translate(bg.x, bg.y);

            // 1. Accordion Metallic Spring Behind Glove
            const springDir = -bg.dir;
            const springDist = Math.min(350, Math.abs(bg.x - bg.startX));
            const segments = 8;
            ctx.strokeStyle = '#94a3b8';
            ctx.lineWidth = 3.5;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            for (let s = 1; s <= segments; s++) {
                const sx = springDir * (s / segments) * springDist;
                const sy = (s % 2 === 0 ? 12 : -12);
                ctx.lineTo(sx, sy);
            }
            ctx.stroke();

            // 2. Speed Lines
            ctx.strokeStyle = 'rgba(239, 68, 68, 0.6)';
            ctx.lineWidth = 2;
            for (let i = 0; i < 3; i++) {
                const offY = (i - 1) * 14;
                ctx.beginPath();
                ctx.moveTo(springDir * 20, offY);
                ctx.lineTo(springDir * (40 + Math.random() * 30), offY);
                ctx.stroke();
            }

            // 3. Giant Red Boxing Glove (🥊)
            ctx.scale(bg.dir, 1);
            ctx.fillStyle = '#dc2626';
            ctx.shadowColor = '#ef4444';
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.roundRect(-24, -20, 48, 40, [10, 16, 16, 10]);
            ctx.fill();

            // Thumb knuckle
            ctx.beginPath();
            ctx.roundRect(4, -26, 18, 14, 6);
            ctx.fill();

            // Wrist cuff
            ctx.fillStyle = '#ffffff';
            ctx.strokeStyle = '#0f172a';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.roundRect(-28, -16, 10, 32, 3);
            ctx.fill();
            ctx.stroke();

            // Glove highlights
            ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
            ctx.beginPath();
            ctx.ellipse(10, -10, 10, 5, 0, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
        }
    }

    renderBananaPeels(ctx) {
        for (let bp of this.particles.bananaPeels) {
            if (!bp.alive) continue;
            ctx.save();
            ctx.translate(bp.x, bp.y);

            // Shimmering yellow glow
            ctx.shadowColor = '#facc15';
            ctx.shadowBlur = 6;

            // 3 Open Banana Peels
            ctx.fillStyle = '#facc15';
            ctx.strokeStyle = '#ca8a04';
            ctx.lineWidth = 1.5;

            // Base core
            ctx.beginPath();
            ctx.arc(0, 0, 5, 0, Math.PI * 2);
            ctx.fill();

            // Left peel
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.quadraticCurveTo(-12, -4, -14, 6);
            ctx.quadraticCurveTo(-8, 3, 0, 0);
            ctx.fill();
            ctx.stroke();

            // Right peel
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.quadraticCurveTo(12, -4, 14, 6);
            ctx.quadraticCurveTo(8, 3, 0, 0);
            ctx.fill();
            ctx.stroke();

            // Top peel
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.quadraticCurveTo(0, -14, 6, -12);
            ctx.quadraticCurveTo(2, -6, 0, 0);
            ctx.fill();
            ctx.stroke();

            // Banana top tip (brown stem)
            ctx.fillStyle = '#713f12';
            ctx.fillRect(-1.5, -7, 3, 3);

            ctx.restore();
        }
    }

    renderUfoAbductions(ctx) {
        for (let ufo of this.particles.ufoAbductions) {
            if (!ufo.alive) continue;
            ctx.save();

            // 1. Green Pulsating Tractor Beam
            const beamAlpha = 0.35 + Math.sin(ufo.timer * 15) * 0.15;
            const beamGrad = ctx.createLinearGradient(ufo.ufoX, ufo.ufoY + 15, ufo.ufoX, ufo.startY + 40);
            beamGrad.addColorStop(0, `rgba(34, 197, 94, ${beamAlpha * 1.5})`);
            beamGrad.addColorStop(1, 'rgba(74, 222, 128, 0.05)');

            ctx.fillStyle = beamGrad;
            ctx.beginPath();
            ctx.moveTo(ufo.ufoX - 18, ufo.ufoY + 15);
            ctx.lineTo(ufo.ufoX + 18, ufo.ufoY + 15);
            ctx.lineTo(ufo.startX + 45, ufo.startY + 40);
            ctx.lineTo(ufo.startX - 45, ufo.startY + 40);
            ctx.closePath();
            ctx.fill();

            // Rings floating up tractor beam
            const ringOffset = ((ufo.timer * 80) % 60);
            ctx.strokeStyle = '#86efac';
            ctx.lineWidth = 2;
            for (let r = 0; r < 4; r++) {
                const ry = ufo.startY + 20 - (r * 60 + ringOffset);
                if (ry > ufo.ufoY + 20 && ry < ufo.startY + 30) {
                    const widthFactor = (ry - (ufo.ufoY + 15)) / (ufo.startY + 40 - (ufo.ufoY + 15));
                    const rx = 18 + widthFactor * 27;
                    ctx.beginPath();
                    ctx.ellipse(ufo.ufoX, ry, rx, rx * 0.28, 0, 0, Math.PI * 2);
                    ctx.stroke();
                }
            }

            // 2. Retro Sci-Fi Flying Saucer (UFO)
            ctx.translate(ufo.ufoX, ufo.ufoY);
            ctx.shadowColor = '#4ade80';
            ctx.shadowBlur = 15;

            // Glass Cockpit Dome
            ctx.fillStyle = 'rgba(186, 230, 253, 0.85)';
            ctx.beginPath();
            ctx.arc(0, -6, 16, Math.PI, 0);
            ctx.fill();
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Metallic Saucer Hull
            const hullGrad = ctx.createLinearGradient(-40, 0, 40, 0);
            hullGrad.addColorStop(0, '#64748b');
            hullGrad.addColorStop(0.5, '#cbd5e1');
            hullGrad.addColorStop(1, '#64748b');
            ctx.fillStyle = hullGrad;
            ctx.beginPath();
            ctx.ellipse(0, 4, 42, 14, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#334155';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Pulsing Under-lights
            const lightColors = ['#ef4444', '#facc15', '#22c55e', '#3b82f6'];
            const step = (Date.now() * 0.006) % lightColors.length;
            for (let i = 0; i < 5; i++) {
                const lx = -28 + i * 14;
                ctx.fillStyle = lightColors[(Math.floor(step) + i) % lightColors.length];
                ctx.beginPath();
                ctx.arc(lx, 6, 3, 0, Math.PI * 2);
                ctx.fill();
            }

            // Abduction Text
            ctx.font = 'bold 11px Fredoka, sans-serif';
            ctx.fillStyle = '#4ade80';
            ctx.textAlign = 'center';
            ctx.fillText(`🛸 ABDUZINDO ${ufo.targetName}!`, 0, -28);

            ctx.restore();
        }
    }

    renderRubberbands(ctx) {
        for (let rb of this.particles.rubberbands) {
            if (!rb.alive) continue;
            ctx.save();
            const snapProgress = rb.timer / rb.duration;
            const alpha = 1.0 - snapProgress;

            // Snapping Neon Rubberband Lines
            ctx.strokeStyle = `rgba(236, 72, 153, ${alpha * 0.9})`;
            ctx.shadowColor = '#ec4899';
            ctx.shadowBlur = 14;
            ctx.lineWidth = 4 * (1 - snapProgress * 0.5);

            // Lead slingshot line
            ctx.beginPath();
            ctx.moveTo(1500, rb.leadOldY);
            ctx.lineTo(1500, rb.leadNewY);
            ctx.stroke();

            // Last place slingshot line
            ctx.strokeStyle = `rgba(56, 189, 248, ${alpha * 0.9})`;
            ctx.shadowColor = '#38bdf8';
            ctx.beginPath();
            ctx.moveTo(1500, rb.lastOldY);
            ctx.lineTo(1500, rb.lastNewY);
            ctx.stroke();

            // Snap Text
            ctx.font = 'bold 13px Fredoka, sans-serif';
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.textAlign = 'center';
            ctx.fillText(`🪢 RUBBERBAND! ${rb.leadName} ⬇️ 200m | ${rb.lastName} ⬆️ 200m!`, 1500, (rb.leadNewY + rb.lastNewY) / 2);

            ctx.restore();
        }
    }

    renderLava(ctx, map) {
        if (!window.gameClient || !window.gameClient.lava || !window.gameClient.lava.active) return;
        const lavaY = window.gameClient.lava.y !== undefined ? window.gameClient.lava.y : 7900;
        const time = Date.now() * 0.0035;

        ctx.save();
        // 1. Radiant Molten Underglow & Atmospheric Heat Bloom
        const glowGrad = ctx.createLinearGradient(0, lavaY - 140, 0, lavaY + 200);
        glowGrad.addColorStop(0, 'rgba(239, 68, 68, 0)');
        glowGrad.addColorStop(0.25, 'rgba(249, 115, 22, 0.35)');
        glowGrad.addColorStop(0.65, 'rgba(239, 68, 68, 0.75)');
        glowGrad.addColorStop(1, 'rgba(153, 27, 27, 0.95)');
        ctx.fillStyle = glowGrad;
        ctx.fillRect(-1000, lavaY - 140, 5000, 8500 - lavaY + 300);

        // 2. Layer 1: Dark Molten Magma Backdrop Wave
        ctx.beginPath();
        ctx.moveTo(-1000, lavaY + 12);
        for (let x = -1000; x <= 4000; x += 50) {
            const wave1 = Math.sin(x * 0.015 + time * 2.2) * 9 + Math.cos(x * 0.03 - time * 1.5) * 5;
            ctx.lineTo(x, lavaY + 12 + wave1);
        }
        ctx.lineTo(4000, 9500);
        ctx.lineTo(-1000, 9500);
        ctx.closePath();
        ctx.fillStyle = '#7f1d1d';
        ctx.fill();

        // 3. Layer 2: Main Fiery Magma Body Wave
        ctx.beginPath();
        ctx.moveTo(-1000, lavaY);
        for (let x = -1000; x <= 4000; x += 40) {
            const wave2 = Math.sin(x * 0.02 + time * 3.5) * 7 + Math.cos(x * 0.04 - time * 2.5) * 4;
            ctx.lineTo(x, lavaY + wave2);
        }
        ctx.lineTo(4000, 9500);
        ctx.lineTo(-1000, 9500);
        ctx.closePath();

        const lavaBodyGrad = ctx.createLinearGradient(0, lavaY, 0, lavaY + 500);
        lavaBodyGrad.addColorStop(0, '#fde047'); // Glowing yellow crest
        lavaBodyGrad.addColorStop(0.06, '#ea580c'); // Searing orange
        lavaBodyGrad.addColorStop(0.25, '#dc2626'); // Blazing red
        lavaBodyGrad.addColorStop(0.7, '#991b1b'); // Dark magma
        lavaBodyGrad.addColorStop(1, '#450a0a'); // Obsidian bedrock
        ctx.fillStyle = lavaBodyGrad;
        ctx.fill();

        // 4. Layer 3: Glowing Molten Crest Line
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-1000, lavaY);
        for (let x = -1000; x <= 4000; x += 40) {
            const wave = Math.sin(x * 0.02 + time * 3.5) * 7 + Math.cos(x * 0.04 - time * 2.5) * 4;
            ctx.lineTo(x, lavaY + wave);
        }
        ctx.stroke();

        // 5. Bubbling Magma Bursts and Rising Fire Embers
        for (let i = 0; i < 40; i++) {
            const emberX = ((i * 127 + time * 180) % 4600) - 800;
            const emberYOffset = ((i * 83 + time * 220) % 180);
            const emberY = lavaY - emberYOffset;
            const size = 2 + (i % 4) * 1.5;
            const alpha = Math.max(0, 1 - (emberYOffset / 180));

            ctx.fillStyle = (i % 2 === 0) ? `rgba(253, 224, 71, ${alpha})` : `rgba(249, 115, 22, ${alpha})`;
            ctx.beginPath();
            ctx.arc(emberX + Math.sin(time * 3 + i) * 10, emberY, size, 0, Math.PI * 2);
            ctx.fill();
        }

        // 6. Lava Hazard Danger Line
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 2.5;
        ctx.setLineDash([10, 10]);
        ctx.beginPath();
        ctx.moveTo(-1000, lavaY - 14);
        ctx.lineTo(4000, lavaY - 14);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.restore();
    }

    renderSeasonsEffects(ctx, cw, ch, map) {
        if (!map) return;
        const season = map.season || 'spring';
        const time = Date.now() * 0.001;

        ctx.save();

        if (season === 'winter') {
            // Winter: Gentle falling snowflakes with slight drift
            ctx.fillStyle = '#ffffff';
            for (let i = 0; i < 45; i++) {
                const sx = ((i * 73 + time * 25 + Math.sin(time + i) * 30) % (cw + 40)) - 20;
                const sy = ((i * 53 + time * 65) % (ch + 40)) - 20;
                const radius = 1.5 + (i % 3) * 1.0;
                ctx.globalAlpha = 0.4 + (i % 4) * 0.15;
                ctx.beginPath();
                ctx.arc(sx, sy, radius, 0, Math.PI * 2);
                ctx.fill();
            }
        } else if (season === 'autumn') {
            // Autumn: Falling & swirling golden/red leaves
            const leafColors = ['#f59e0b', '#d97706', '#dc2626', '#b45309', '#f97316'];
            for (let i = 0; i < 35; i++) {
                const lx = ((i * 89 + time * 45 + Math.sin(time * 2 + i) * 45) % (cw + 60)) - 30;
                const ly = ((i * 61 + time * 55) % (ch + 60)) - 30;
                const rot = time * 2 + i;
                ctx.save();
                ctx.translate(lx, ly);
                ctx.rotate(rot);
                ctx.fillStyle = leafColors[i % leafColors.length];
                ctx.globalAlpha = 0.55 + (i % 3) * 0.15;
                ctx.beginPath();
                ctx.ellipse(0, 0, 6, 3, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        } else if (season === 'summer') {
            // Summer: Rain Showers (when raining, reduce jump)
            ctx.strokeStyle = 'rgba(186, 230, 253, 0.45)';
            ctx.lineWidth = 1.4;
            for (let i = 0; i < 50; i++) {
                const rx = ((i * 59 + time * 120) % (cw + 60)) - 30;
                const ry = ((i * 79 + time * 450) % (ch + 80)) - 40;
                ctx.beginPath();
                ctx.moveTo(rx, ry);
                ctx.lineTo(rx - 4, ry + 16);
                ctx.stroke();
            }
        } else if (season === 'spring') {
            // Spring: Floating pink cherry blossom petals
            ctx.fillStyle = '#fbcfe8';
            for (let i = 0; i < 30; i++) {
                const px = ((i * 97 + time * 35 + Math.sin(time + i * 2) * 35) % (cw + 40)) - 20;
                const py = ((i * 67 + time * 40) % (ch + 40)) - 20;
                const rot = time + i;
                ctx.save();
                ctx.translate(px, py);
                ctx.rotate(rot);
                ctx.globalAlpha = 0.65;
                ctx.beginPath();
                ctx.ellipse(0, 0, 5, 2.8, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }

        ctx.restore();
    }

    renderScreenOverlays(ctx, cw, ch, modifiers, localPlayer, map) {
        // 1. Wind overlay streaks
        if (modifiers && modifiers.wind) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
            const dir = modifiers.wind;
            for (let i = 0; i < 6; i++) {
                const wy = ((Date.now() * 0.1 + i * 110) % ch);
                const wx = ((Date.now() * 0.8 * dir + i * 200) % (cw + 300)) - 150;
                ctx.fillRect(wx, wy, 80, 2.5);
            }
        }

        // 2. Rising Lava Warning Banner
        if (window.gameClient && window.gameClient.lava && window.gameClient.lava.active) {
            ctx.save();
            ctx.fillStyle = 'rgba(220, 38, 38, 0.9)';
            ctx.beginPath();
            ctx.roundRect(cw / 2 - 160, 18, 320, 32, 16);
            ctx.fill();
            ctx.strokeStyle = '#fef08a';
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.font = 'bold 13px Fredoka, sans-serif';
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'center';
            ctx.fillText('🌋 O CHÃO É LAVA! SUBA RAPIDAMENTE!', cw / 2, 39);
            ctx.restore();
        }

        // 3. Local Player Death & 3s Respawn Screen Countdown Card
        if (localPlayer && localPlayer.isDead) {
            ctx.save();
            // Dark vignette overlay
            ctx.fillStyle = 'rgba(15, 23, 42, 0.65)';
            ctx.fillRect(0, 0, cw, ch);

            // Centered Respawn Card
            const cardW = 320;
            const cardH = 140;
            const cardX = cw / 2 - cardW / 2;
            const cardY = ch / 2 - cardH / 2;

            ctx.fillStyle = 'rgba(15, 23, 42, 0.94)';
            ctx.beginPath();
            ctx.roundRect(cardX, cardY, cardW, cardH, 20);
            ctx.fill();

            ctx.strokeStyle = '#ef4444';
            ctx.lineWidth = 3;
            ctx.shadowColor = '#ef4444';
            ctx.shadowBlur = 18;
            ctx.stroke();

            // Skull Icon & Title
            ctx.font = 'bold 22px Fredoka, sans-serif';
            ctx.fillStyle = '#ef4444';
            ctx.textAlign = 'center';
            ctx.fillText('💀 VOCÊ FOI DERRUBADO!', cw / 2, cardY + 45);

            // Countdown Timer Display
            const secLeft = Math.max(0.1, localPlayer.respawnTimer || 3.0).toFixed(1);
            ctx.font = 'bold 28px Fredoka, sans-serif';
            ctx.fillStyle = '#facc15';
            ctx.fillText(`Revivendo em ${secLeft}s...`, cw / 2, cardY + 95);

            ctx.font = '12px Fredoka, sans-serif';
            ctx.fillStyle = '#94a3b8';
            const causeText = localPlayer.deathCause === 'lava' ? 'Você caiu na lava ardente!' : 'Você sofreu dano em combate!';
            ctx.fillText(causeText, cw / 2, cardY + 122);

            ctx.restore();
        }
    }
}

