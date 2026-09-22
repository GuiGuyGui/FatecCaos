// Player Class & Skills Manager
class Player {
    constructor(id, name, color, isLocal = false) {
        this.id = id;
        this.name = name;
        this.color = color || '#3b82f6';
        this.isLocal = isLocal;
        this.isHost = false;

        // Position & Dimensions (Cute Pill-shaped character)
        this.x = 90 + Math.random() * 60; // Spawn clustered together on left side
        this.y = 7864; // Ground floor level
        this.w = 30; // cute bean character width
        this.h = 36; // character height
        this.vx = 0;
        this.vy = 0;
        this.targetX = this.x;
        this.targetY = this.y;
        this.altitude = 0;
        this.facing = 1; // 1 = right, -1 = left
        this.isGrounded = false;
        this.anim = 'idle'; // 'idle', 'run', 'jump', 'fall'
        this.animTimer = 0;

        // Push Momentum (applied from other players, items, or skills)
        this.pushVx = 0;
        this.pushVy = 0;

        // Shove (Elbow Bump / Cotovelada)
        this.isShoving = false;
        this.shoveTimer = 0;
        this.shoveCooldown = 0;

        // Health & Combat System (100 Max HP, Health Bars, PvP Death & Revive)
        this.maxHp = 100;
        this.hp = 100;
        this.isDead = false;
        this.respawnTimer = 0;
        this.deathX = this.x;
        this.deathY = this.y;
        this.deathCause = ''; // 'damage', 'lava', etc.

        // Weapons & Ammo (Pistola: 2 tiros, Shotgun: 4 tiros, AK-47: 15 tiros)
        this.currentWeapon = 'pistol'; // 'pistol', 'shotgun', 'ak47'
        this.ammo = 2; // Default pistol starts with 2 bullets
        this.shootTimer = 0;
        this.shootCooldown = 0;
        this.aimAngle = 0;
        this.mouseWorldX = 0;
        this.mouseWorldY = 0;

        // Stacking state (Rider on head / standing on other)
        this.hasRiderOnHead = false;
        this.isStandingOnOther = false;

        // Stun & Chained Status Effects
        this.isStunned = false;
        this.stunTimer = 0;
        this.isChained = false;
        this.chainTimer = 0;
        this.chainAnchorX = 0;
        this.chainAnchorY = 0;
        this.chainFreezeX = this.x;
        this.chainFreezeY = this.y;

        // Cosmic Drunk & King of the Hill & Chicken Morph Effects
        this.isDrunk = false;
        this.drunkTimer = 0;
        this.isKing = false;
        this.kingScore = 0;
        this.isChickenMorph = false;
        this.chickenTimer = 0;

        // Jump mechanics (W / Up only)
        this.maxJumps = 2; // Double jump standard
        this.jumpsRemaining = 2;

        // Skills & Timers (Triple Jump, Ghost, Balloon)
        this.isGhost = false;
        this.ghostTimer = 0;
        this.isBalloonGliding = false;
        this.balloonTimer = 0;

        // 3 Active Skills
        this.skills = {
            triple_jump: { name: 'Pulo Triplo', key: '1', icon: '🦘', cooldown: 5, timer: 0, unlocked: true },
            ghost: { name: 'Fantasma', key: '2', icon: '👻', cooldown: 10, timer: 0, unlocked: true },
            balloon: { name: 'Balão Flutuante', key: '3', icon: '🎈', cooldown: 8, timer: 0, unlocked: true }
        };

        // Inputs (Local Player)
        this.input = {
            left: false,
            right: false,
            jump: false,
            jumpPressed: false
        };

        // Network Interpolation target for remote players
        this.targetX = this.x;
        this.targetY = this.y;
    }

    takeDamage(amount, sourceId, networkClient, particleSystem, cause = 'bullet') {
        if (this.isDead || this.isGhost) return false;

        this.hp = Math.max(0, this.hp - amount);
        this.isStunned = true;
        this.stunTimer = 0.28;

        if (this.hp <= 0) {
            this.die(cause, this.x, this.y, networkClient, particleSystem);
            return true;
        }
        return false;
    }

    heal(amount) {
        if (this.isDead) return;
        this.hp = Math.min(this.maxHp, this.hp + amount);
    }

    die(cause, atX, atY, networkClient, particleSystem) {
        if (this.isDead) return;
        this.isDead = true;
        this.isGhost = true;
        this.hp = 0;
        this.respawnTimer = 3.0; // 3 seconds countdown
        this.deathX = atX !== undefined ? atX : this.x;
        this.deathY = atY !== undefined ? atY : this.y;
        this.deathCause = cause || 'damage';
        this.vx = 0;
        this.vy = 0;
        this.pushVx = 0;
        this.pushVy = 0;

        if (particleSystem) {
            particleSystem.emitFeatherExplosion(this.x + this.w / 2, this.y + this.h / 2);
        }
        if (window.soundEngine) {
            window.soundEngine.playPlayerDeath?.();
        }
        if (networkClient && this.isLocal) {
            networkClient.sendPlayerDied?.(this.deathCause, this.deathX, this.deathY);
        }
    }

    respawn(targetX, targetY) {
        this.isDead = false;
        this.isGhost = false;
        this.hp = this.maxHp;
        this.respawnTimer = 0;
        if (targetX !== undefined && targetY !== undefined) {
            this.x = targetX;
            this.y = targetY;
        } else {
            this.x = this.deathX;
            this.y = this.deathY;
        }
        this.vx = 0;
        this.vy = 0;
        this.pushVx = 0;
        this.pushVy = 0;
        this.jumpsRemaining = this.maxJumps;
        if (window.soundEngine) {
            window.soundEngine.playJump?.();
        }
    }


    setChained(anchorX, anchorY, duration = 2.0) {
        this.isChained = true;
        this.chainTimer = duration;
        this.chainAnchorX = anchorX;
        this.chainAnchorY = anchorY;
        this.chainFreezeX = this.x;
        this.chainFreezeY = this.y;
        this.vx = 0;
        this.vy = 0;
        this.pushVx = 0;
        this.pushVy = 0;
    }

    jump(physicsEngine, particleSystem) {
        // Cannot jump if another player is standing on your head, stunned, or chained!
        if (this.hasRiderOnHead || this.isStunned || this.isChained) return false;

        // Scale jump force with gravity scale slider: lighter gravity jumps higher, heavier jumps lower
        const gravScale = (window.gameClient && window.gameClient.modifiers && window.gameClient.modifiers.gravity_scale !== undefined) ? window.gameClient.modifiers.gravity_scale : 1.0;
        let jumpMult = 1.0 / Math.sqrt(Math.max(0.2, gravScale));
        if (window.gameClient && window.gameClient.modifiers && window.gameClient.modifiers.heavy_gravity) {
            jumpMult *= 0.85;
        }
        if (this.isChickenMorph) {
            jumpMult *= 0.5; // Chicken metamorphosis: exactly 50% jump height!
        }

        if (this.jumpsRemaining > 0) {
            if (this.jumpsRemaining === this.maxJumps) {
                this.vy = physicsEngine.jumpForce * jumpMult;
                if (window.soundEngine) {
                    if (this.isChickenMorph) window.soundEngine.playChickenCluckChorus();
                    else window.soundEngine.playJump();
                }
                if (particleSystem) particleSystem.emitJumpPuff(this.x + this.w / 2, this.y + this.h);
            } else {
                this.vy = physicsEngine.doubleJumpForce * jumpMult;
                if (window.soundEngine) {
                    if (this.isChickenMorph) window.soundEngine.playChickenCluckChorus();
                    else window.soundEngine.playDoubleJump();
                }
                if (particleSystem) particleSystem.emitDoubleJumpRing(this.x + this.w / 2, this.y + this.h / 2);
            }
            this.jumpsRemaining--;
            this.isGrounded = false;
            return true;
        }
        return false;
    }

    // Space Key: Elbow Bump / Shove Attack (Cotovelada)
    shove(physicsEngine, otherPlayers, networkClient, particleSystem) {
        if (this.shoveCooldown > 0 || this.isStunned || this.isChained) return false;

        this.isShoving = true;
        this.shoveTimer = 0.24;
        this.shoveCooldown = 0.40; // Short cooldown for tactical shoving

        if (window.soundEngine) window.soundEngine.playShove();
        if (particleSystem) {
            particleSystem.emitShoveSwoosh(this.x + (this.facing > 0 ? this.w + 8 : -8), this.y + this.h / 2, this.facing);
        }

        // Notify other clients about shove animation
        if (networkClient) {
            networkClient.sendSkill('shove', { facing: this.facing });
        }

        // Check hitting other players in front of character
        const reach = 54;
        const hitBoxX = this.facing > 0 ? (this.x + this.w * 0.2) : (this.x - reach + this.w * 0.8);
        const hitBoxW = reach + this.w * 0.4;
        const hitBoxY = this.y - 10;
        const hitBoxH = this.h + 20;

        let hitAny = false;
        for (let other of Object.values(otherPlayers)) {
            if (!other || other.id === this.id || other.isGhost) continue;

            if (other.x + other.w > hitBoxX && other.x < hitBoxX + hitBoxW &&
                other.y + other.h > hitBoxY && other.y < hitBoxY + hitBoxH) {
                // Tactical shove knockback impulse!
                const forceX = this.facing * 8.8;
                const forceY = -2.2;

                // Immediate client prediction
                other.pushVx = (other.pushVx || 0) + forceX;
                other.pushVy = (other.pushVy || 0) + forceY;

                if (networkClient) {
                    networkClient.sendPush(other.id, forceX, forceY);
                }
                if (particleSystem) {
                    particleSystem.emitShoveImpact(other.x + other.w / 2, other.y + other.h / 2);
                }
                hitAny = true;
            }
        }

        return true;
    }

    // F Key / Left Click: Shoot Active Weapon (Pistola, Shotgun, AK-47)
    shoot(particleSystem, networkClient, targetWorldX, targetWorldY) {
        const isUnlimitedKingAmmo = !!(window.gameClient && window.gameClient.isKingOfHillActive && !this.isKing);
        if ((this.ammo <= 0 && !isUnlimitedKingAmmo) || this.shootCooldown > 0 || this.isStunned || this.isChained || this.isDead) return false;

        if (!isUnlimitedKingAmmo) {
            this.ammo -= 1;
        }

        const weapon = this.currentWeapon || 'pistol';

        if (weapon === 'ak47') {
            this.shootTimer = 0.12;
            this.shootCooldown = isUnlimitedKingAmmo ? 0.08 : 0.11; // High fire rate
        } else if (weapon === 'shotgun') {
            this.shootTimer = 0.35;
            this.shootCooldown = isUnlimitedKingAmmo ? 0.25 : 0.45; // Pump action
        } else {
            // Pistol
            this.shootTimer = 0.22;
            this.shootCooldown = isUnlimitedKingAmmo ? 0.16 : 0.25;
        }

        const originX = this.x + this.w / 2;
        const originY = this.y + this.h / 2 + 3;

        let baseAngle;
        if (targetWorldX !== undefined && targetWorldY !== undefined) {
            baseAngle = Math.atan2(targetWorldY - originY, targetWorldX - originX);
        } else if (this.aimAngle !== undefined && this.aimAngle !== null) {
            baseAngle = this.aimAngle;
        } else {
            baseAngle = this.facing >= 0 ? 0 : Math.PI;
        }

        this.aimAngle = baseAngle;
        this.facing = Math.cos(baseAngle) >= 0 ? 1 : -1;

        if (weapon === 'shotgun') {
            // Shotgun fires 5 spread pellets
            const pelletCount = 5;
            const spreadAngle = 0.28; // ~16 degree total cone
            const bulletSpeed = 24.0;
            const damagePerPellet = 15;

            if (window.soundEngine) window.soundEngine.playShotgunShot?.() || window.soundEngine.playBlasterShot();

            for (let i = 0; i < pelletCount; i++) {
                const angle = baseAngle + (i - (pelletCount - 1) / 2) * (spreadAngle / (pelletCount - 1)) + (Math.random() - 0.5) * 0.05;
                const speed = bulletSpeed + (Math.random() - 0.5) * 4.0;
                const vx = Math.cos(angle) * speed;
                const vy = Math.sin(angle) * speed;
                const spawnX = originX + Math.cos(angle) * 16;
                const spawnY = originY + Math.sin(angle) * 16;

                if (particleSystem) {
                    particleSystem.emitMuzzleFlash(spawnX, spawnY, angle, '#f97316');
                    particleSystem.spawnBullet(spawnX, spawnY, vx, vy, this.id, '#f97316', damagePerPellet, 'shotgun');
                }
                if (networkClient) {
                    networkClient.sendShootBullet(spawnX, spawnY, vx, vy, '#f97316', damagePerPellet, 'shotgun');
                }
            }
        } else if (weapon === 'ak47') {
            // AK-47 rapid fire bullet
            const bulletSpeed = 26.0;
            const damage = 18;
            const spread = (Math.random() - 0.5) * 0.08;
            const angle = baseAngle + spread;
            const vx = Math.cos(angle) * bulletSpeed;
            const vy = Math.sin(angle) * bulletSpeed;
            const spawnX = originX + Math.cos(angle) * 16;
            const spawnY = originY + Math.sin(angle) * 16;

            if (window.soundEngine) window.soundEngine.playAk47Shot?.() || window.soundEngine.playBlasterShot();

            if (particleSystem) {
                particleSystem.emitMuzzleFlash(spawnX, spawnY, angle, '#facc15');
                particleSystem.spawnBullet(spawnX, spawnY, vx, vy, this.id, '#facc15', damage, 'ak47');
            }
            if (networkClient) {
                networkClient.sendShootBullet(spawnX, spawnY, vx, vy, '#facc15', damage, 'ak47');
            }
        } else {
            // Pistol (25 damage)
            const bulletSpeed = 22.0;
            const damage = 25;
            const vx = Math.cos(baseAngle) * bulletSpeed;
            const vy = Math.sin(baseAngle) * bulletSpeed;
            const spawnX = originX + Math.cos(baseAngle) * 16;
            const spawnY = originY + Math.sin(baseAngle) * 16;

            if (window.soundEngine) window.soundEngine.playBlasterShot();

            if (particleSystem) {
                particleSystem.emitMuzzleFlash(spawnX, spawnY, baseAngle, this.color);
                particleSystem.spawnBullet(spawnX, spawnY, vx, vy, this.id, this.color, damage, 'pistol');
            }
            if (networkClient) {
                networkClient.sendShootBullet(spawnX, spawnY, vx, vy, this.color, damage, 'pistol');
            }
        }

        if (networkClient && networkClient.ui) {
            networkClient.ui.updateAmmoCount(this.ammo, this.currentWeapon);
        }

        return true;
    }

    useSkill(skillKey, networkClient, particleSystem) {
        if (this.isStunned || this.isChained || this.isDead) return false;
        const skill = this.skills[skillKey];
        if (!skill || skill.timer > 0) return false;

        skill.timer = skill.cooldown;

        if (skillKey === 'triple_jump') {
            const gravScale = (window.gameClient && window.gameClient.modifiers && window.gameClient.modifiers.gravity_scale !== undefined) ? window.gameClient.modifiers.gravity_scale : 1.0;
            let jumpMult = 1.0 / Math.sqrt(Math.max(0.2, gravScale));
            if (this.isChickenMorph) jumpMult *= 0.5;
            this.vy = -12.5 * jumpMult;
            this.jumpsRemaining = 1;
            if (window.soundEngine) window.soundEngine.playJump();
            if (particleSystem) particleSystem.emitSkillAura(this.x + this.w / 2, this.y + this.h / 2, '#38bdf8');
            if (networkClient) networkClient.sendSkill('triple_jump', { x: this.x, y: this.y });
        } else if (skillKey === 'ghost') {
            this.isGhost = true;
            this.ghostTimer = 5.0;
            if (window.soundEngine) window.soundEngine.playGhost();
            if (particleSystem) particleSystem.emitSkillAura(this.x + this.w / 2, this.y + this.h / 2, '#c084fc');
            if (networkClient) networkClient.sendSkill('ghost', { duration: 5.0 });
        } else if (skillKey === 'balloon') {
            this.isBalloonGliding = true;
            this.balloonTimer = 4.5;
            // Only reduce downward falling speed, never launch upward!
            if (this.vy > 2.0) {
                this.vy = 2.0;
            }
            if (window.soundEngine) window.soundEngine.playJump();
            if (networkClient) networkClient.sendSkill('balloon', { duration: 4.5 });
        }
        return true;
    }

    update(dt) {
        this.animTimer += dt * 10;

        // Update respawn timer when dead
        if (this.isDead && this.respawnTimer > 0) {
            this.respawnTimer -= dt;
            if (this.respawnTimer <= 0) {
                // Check if died by lava -> respawn above lava
                let respawnY = this.deathY;
                let respawnX = this.deathX;
                if (this.deathCause === 'lava' && window.gameClient && window.gameClient.lava) {
                    respawnY = Math.max(100, window.gameClient.lava.y - 60);
                }
                this.respawn(respawnX, respawnY);
            }
        }

        // Update drunk state (controles invertidos)
        if (this.isDrunk) {
            this.drunkTimer -= dt;
            if (this.drunkTimer <= 0) {
                this.isDrunk = false;
            }
        }

        // Update stun state (atordoamento por milésimos de segundo após tiro)
        if (this.isStunned) {
            this.stunTimer -= dt;
            if (this.stunTimer <= 0) {
                this.isStunned = false;
            }
        }

        // Update chained state (preso por correntes no obstáculo)
        if (this.isChained) {
            this.chainTimer -= dt;
            if (this.chainTimer <= 0) {
                this.isChained = false;
            } else {
                if (this.chainFreezeX !== undefined && this.chainFreezeY !== undefined) {
                    this.x = this.chainFreezeX;
                    this.y = this.chainFreezeY;
                }
                this.vx = 0;
                this.vy = 0;
                this.pushVx = 0;
                this.pushVy = 0;
            }
        }

        // Update chicken morph timer
        if (this.chickenTimer > 0) {
            this.chickenTimer -= dt;
            if (this.chickenTimer <= 0) {
                this.isChickenMorph = false;
            }
        }
        if (this.isChickenMorph && this.vy > 3.0) {
            this.vy = 3.0; // Clumsy wing flapping glide!
        }

        // Update shove
        if (this.shoveCooldown > 0) {
            this.shoveCooldown = Math.max(0, this.shoveCooldown - dt);
        }
        if (this.isShoving) {
            this.shoveTimer -= dt;
            if (this.shoveTimer <= 0) {
                this.isShoving = false;
            }
        }

        // Update waist blaster shoot timers
        if (this.shootCooldown > 0) {
            this.shootCooldown = Math.max(0, this.shootCooldown - dt);
        }
        if (this.shootTimer > 0) {
            this.shootTimer = Math.max(0, this.shootTimer - dt);
        }

        // Update skill cooldowns
        for (let key in this.skills) {
            if (this.skills[key].timer > 0) {
                this.skills[key].timer = Math.max(0, this.skills[key].timer - dt);
            }
        }

        if (this.isGhost && !this.isDead) {
            this.ghostTimer -= dt;
            if (this.ghostTimer <= 0) {
                this.isGhost = false;
            }
        }

        if (this.isBalloonGliding) {
            this.balloonTimer -= dt;
            if (this.balloonTimer <= 0 || this.isGrounded) {
                this.isBalloonGliding = false;
            }
        }

        if (!this.isLocal) {
            if (this.targetX !== undefined && !isNaN(this.targetX)) {
                this.x += (this.targetX - this.x) * 0.35;
            }
            if (this.targetY !== undefined && !isNaN(this.targetY)) {
                this.y += (this.targetY - this.y) * 0.35;
            }
        }
    }

    applyRemoteSync(data) {
        if (data.x !== undefined && !isNaN(data.x)) {
            this.targetX = data.x;
            if (isNaN(this.x)) this.x = data.x;
        }
        if (data.y !== undefined && !isNaN(data.y)) {
            this.targetY = data.y;
            if (isNaN(this.y)) this.y = data.y;
        }
        if (data.vx !== undefined && !isNaN(data.vx)) this.vx = data.vx;
        if (data.vy !== undefined && !isNaN(data.vy)) this.vy = data.vy;
        if (data.a !== undefined && !isNaN(data.a)) this.altitude = data.a;
        if (data.f !== undefined) this.facing = data.f;
        if (data.an !== undefined) this.anim = data.an;
        if (data.g !== undefined) this.isGhost = data.g;
        if (data.gr !== undefined) this.isGrounded = data.gr;
        if (data.hp !== undefined) this.hp = data.hp;
        if (data.mhp !== undefined) this.maxHp = data.mhp;
        if (data.wep !== undefined) this.currentWeapon = data.wep;
        if (data.d !== undefined) this.isDead = data.d;
        if (data.rt !== undefined) this.respawnTimer = data.rt;
        if (data.n) this.name = data.n;
        if (data.c) this.color = data.c;
        if (data.em !== undefined) this.emote = data.em;
        if (data.am !== undefined) this.ammo = data.am;
        if (data.st !== undefined) this.isStunned = data.st;
        if (data.ch !== undefined) this.isChained = data.ch;
        if (data.cm !== undefined) this.isChickenMorph = data.cm;
    }
}
