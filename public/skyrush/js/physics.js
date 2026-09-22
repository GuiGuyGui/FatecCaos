// Physics Engine with Player-to-Player Collisions & Pushing
class PhysicsEngine {
    constructor() {
        this.gravity = 0.42;
        this.friction = 0.86;
        this.airFriction = 0.94;
        this.maxWalkSpeed = 5.2;
        this.jumpForce = -10.8;
        this.doubleJumpForce = -9.8;
        this.boundsLeft = 80;
        this.boundsRight = 2920;
    }

    updatePlayer(player, map, dt, modifiers, particleSystem) {
        if (!player) return;

        // Pinned in place while chained!
        if (player.isChained) {
            player.vx = 0;
            player.vy = 0;
            player.pushVx = 0;
            player.pushVy = 0;
            player.anim = 'idle';
            return;
        }

        // Apply Host Modifiers (Natural falling gravity; jump height is scaled cleanly on jump!)
        const currentGravity = this.gravity * ((modifiers && modifiers.gravity_scale) || 1.0);
        const windForce = ((modifiers && modifiers.wind) || 0) * 0.40;

        // Apply horizontal controls acceleration
        let accel = player.isGrounded ? 1.5 : 1.0;
        let effectiveMaxSpeed = this.maxWalkSpeed;
        if (player.hasRiderOnHead) {
            accel = 0.4;
            effectiveMaxSpeed = this.maxWalkSpeed * 0.45;
        } else if (player.isStunned) {
            accel = 0.2;
            effectiveMaxSpeed = this.maxWalkSpeed * 0.35;
        }

        // Invert horizontal input if player is drunk
        let moveLeft = player.input.left;
        let moveRight = player.input.right;
        if (player.isDrunk || player.drunkTimer > 0) {
            moveLeft = player.input.right;
            moveRight = player.input.left;
        }

        if (moveLeft) {
            player.vx -= accel;
            player.facing = -1;
        }
        if (moveRight) {
            player.vx += accel;
            player.facing = 1;
        }

        // Apply wind
        player.vx += windForce;

        // Apply Black Hole Gravitational Pull (Always pulls/drags player DOWNWARD!)
        if (window.gameClient && window.gameClient.blackHoles) {
            const px = player.x + player.w / 2;
            const py = player.y + player.h / 2;
            for (let bh of window.gameClient.blackHoles) {
                if (bh.timer > 0) {
                    const dx = bh.x - px;
                    const dy = bh.y - py;
                    const dist = Math.hypot(dx, dy);
                    if (dist < bh.radius && dist > 5) {
                        const pullRatio = (1 - dist / bh.radius);
                        // Always exert strong downward gravitational pull!
                        player.pushVy += pullRatio * 12.0 * dt * 25;
                        player.pushVy = Math.min(15.0, player.pushVy);
                        // Gentle horizontal centering without throwing player to borders
                        player.pushVx += (dx / dist) * pullRatio * 3.5 * dt * 15;
                        player.pushVx = Math.max(-3.5, Math.min(3.5, player.pushVx));
                    }
                }
            }
        }

        // Handle active skills (like Dash or Balloon/Glide)
        if (player.isDashing) {
            player.dashTimer -= dt;
            player.vx = player.facing * 10.5;
            player.vy = 0;
            if (particleSystem) {
                particleSystem.emitDashTrail(player.x, player.y, player.color);
            }
            if (player.dashTimer <= 0) {
                player.isDashing = false;
            }
        } else if (player.isBalloonGliding) {
            // Balloon only softens falling speed (gliding); full gravity applies when jumping up!
            if (player.vy < 0) {
                player.vy += currentGravity;
            } else {
                player.vy = Math.min(player.vy + currentGravity * 0.3, 1.8);
            }
        } else {
            // Apply normal gravity
            player.vy += currentGravity;
        }

        // Clamp walk speed (excluding push velocities)
        if (!player.isDashing) {
            const limit = effectiveMaxSpeed + Math.abs(player.pushVx);
            if (Math.abs(player.vx) > limit) {
                player.vx = Math.sign(player.vx) * limit;
            }
        }

        // Decay push impulse
        player.vx += player.pushVx;
        player.vy += player.pushVy;
        player.pushVx *= 0.88;
        player.pushVy *= 0.88;
        if (Math.abs(player.pushVx) < 0.05) player.pushVx = 0;
        if (Math.abs(player.pushVy) < 0.05) player.pushVy = 0;

        // Apply friction
        if (player.isGrounded) {
            const groundFriction = player.hasRiderOnHead ? 0.78 : (player.isOnIce ? 0.98 : this.friction);
            player.vx *= groundFriction;
        } else {
            player.vx *= this.airFriction;
        }

        // Terminal fall velocity
        if (player.vy > 13.5) player.vy = 13.5;

        // Move horizontally
        const prevX = player.x;
        player.x += player.vx;

        // Boundary constraints
        if (player.x < this.boundsLeft) {
            player.x = this.boundsLeft;
            player.vx = 0;
        } else if (player.x + player.w > this.boundsRight) {
            player.x = this.boundsRight - player.w;
            player.vx = 0;
        }

        // Move vertically
        const prevY = player.y;
        player.y += player.vy;
        player.isGrounded = false;
        player.isOnIce = (map && map.season === 'winter');

        // Check Rising Lava Floor Collision
        if (window.gameClient && window.gameClient.lava && window.gameClient.lava.active) {
            if (!player.isDead && (player.y + player.h) >= window.gameClient.lava.y) {
                player.takeDamage(999, null, window.gameClient, particleSystem, 'lava');
            }
        }

        // Earthquake effect
        if (modifiers.earthquake && player.isGrounded && Math.random() < 0.08) {
            player.pushVy = -3.5 + Math.random() * -2.0;
            player.pushVx = (Math.random() - 0.5) * 6.0;
        }

        // Platform Collisions (One-way jumping, Ramps, Conveyors, Moving Elevators)
        const playerFootY = player.y + player.h;
        const prevFootY = prevY + player.h;

        for (let p of map.platforms) {
            if (!p.solid) continue;

            // Check horizontal bounding box overlap
            if (player.x + player.w > p.x + 3 && player.x < p.x + p.w - 3) {
                if (p.isRamp && p.slope) {
                    // Slanted Ramp Surface Math
                    const relX = Math.max(0, Math.min(p.w, (player.x + player.w / 2) - p.x));
                    const surfaceY = p.slope > 0 ? (p.y + p.h - (relX / p.w) * p.h) : (p.y + (relX / p.w) * p.h);
                    const fallTolerance = Math.max(12, player.vy + 3);

                    if (prevFootY <= surfaceY + fallTolerance && playerFootY >= surfaceY && player.vy >= 0) {
                        player.y = surfaceY - player.h;
                        player.vy = 0;
                        player.isGrounded = true;
                        player.jumpsRemaining = player.maxJumps;
                    }
                } else {
                    // Standard Platform Landing from above
                    const fallTolerance = Math.max(10, player.vy + 2);
                    if (prevFootY <= p.y + fallTolerance && playerFootY >= p.y && player.vy >= 0) {
                        player.y = p.y - player.h;
                        player.vy = 0;
                        player.isGrounded = true;
                        player.jumpsRemaining = player.maxJumps;
                        if (p.type === 'crystal_ice' || (map && map.season === 'winter')) player.isOnIce = true;

                        // Moving platform carry (seamless horizontal dx & vertical dy)
                        if (p.isMoving) {
                            if (p.dx !== undefined) player.x += p.dx;
                            if (p.dy !== undefined) player.y += p.dy;
                        }

                        // Conveyor belt momentum push
                        if (p.isConveyor && p.conveyorSpeed) {
                            player.x += p.conveyorSpeed;
                        }

                        // Crumbling platform trigger
                        if (p.isCrumbling) {
                            p.isSteppedOn = true;
                        }
                    }
                }
            }
        }

        // Interactive Objects Collision (Springs, Trampolines, Weapons, Medkits, Ammo Boxes)
        for (let obj of map.interactiveObjects) {
            if (obj.type === 'spring') {
                if (player.x + player.w > obj.x && player.x < obj.x + obj.w &&
                    playerFootY >= obj.y && prevFootY <= obj.y + 12 && player.vy >= 0) {
                    player.y = obj.y - player.h;
                    player.vy = obj.bounceForce;
                    player.jumpsRemaining = player.maxJumps;
                    obj.activeAnim = 1.0;
                    if (particleSystem) {
                        particleSystem.emitSpringBurst(obj.x + obj.w / 2, obj.y);
                    }
                    if (window.soundEngine) {
                        window.soundEngine.playSpring();
                    }
                }
            } else if ((obj.type === 'weapon_item' || obj.type === 'ammo_box') && !obj.collected) {
                // Collect Weapon Pickup (Pistola, Shotgun, AK-47)
                if (player.x + player.w > obj.x && player.x < obj.x + obj.w &&
                    player.y + player.h > obj.y && player.y < obj.y + obj.h) {
                    obj.collected = true;
                    obj.respawnTimer = 18.0; // 18s respawn
                    const weaponType = obj.item_type || 'pistol';
                    player.currentWeapon = weaponType;
                    player.ammo = obj.bullets || (weaponType === 'ak47' ? 15 : (weaponType === 'shotgun' ? 4 : 2));

                    if (particleSystem) {
                        particleSystem.emitAmmoBurst(obj.x + obj.w / 2, obj.y + obj.h / 2);
                    }
                    if (window.soundEngine) {
                        window.soundEngine.playAmmoPickup();
                    }
                    if (window.gameApp) {
                        if (window.gameApp.ui) window.gameApp.ui.updateAmmoCount(player.ammo, player.currentWeapon);
                        window.gameApp.sendItemCollected(obj.id, weaponType);
                    }
                }
            } else if (obj.type === 'medkit' && !obj.collected) {
                // Collect Medkit (+50 HP)
                if (player.x + player.w > obj.x && player.x < obj.x + obj.w &&
                    player.y + player.h > obj.y && player.y < obj.y + obj.h) {
                    obj.collected = true;
                    obj.respawnTimer = 22.0; // 22s respawn
                    player.heal(obj.healAmount || 50);

                    if (particleSystem) {
                        particleSystem.emitSkillAura(player.x + player.w / 2, player.y + player.h / 2, '#22c55e');
                    }
                    if (window.soundEngine) {
                        window.soundEngine.playAmmoPickup();
                    }
                    if (window.gameApp) {
                        window.gameApp.sendItemCollected(obj.id, 'medkit');
                    }
                }
            }
        }

        // Update Animation States
        if (!player.isGrounded) {
            player.anim = player.vy < 0 ? 'jump' : 'fall';
        } else if (Math.abs(player.vx) > 0.4) {
            player.anim = 'run';
        } else {
            player.anim = 'idle';
        }

        // Calculate altitude in meters (12,000m total summit height, 0m at ground)
        player.altitude = Math.max(0, Math.floor(12000 - ((player.y || 7864) / 7900) * 12000));
        if (isNaN(player.altitude)) player.altitude = 0;
        if (isNaN(player.x)) player.x = 100;
        if (isNaN(player.y)) player.y = 7864;
        if (isNaN(player.vx)) player.vx = 0;
        if (isNaN(player.vy)) player.vy = 0;
    }


    // Resolve Player-to-Player Collisions & Stacking
    // 1. Standing on head: rider is grounded and can jump off; person below CANNOT jump but CAN walk to shake them off.
    // 2. Lateral collision: solid body push separation so players cannot share narrow ramps or small platforms.
    resolvePlayerCollisions(localPlayer, otherPlayers, onPushCallback) {
        if (!localPlayer || localPlayer.isGhost) return;

        localPlayer.hasRiderOnHead = false;
        localPlayer.isStandingOnOther = false;

        for (let other of Object.values(otherPlayers)) {
            if (!other || other.id === localPlayer.id || other.isGhost) continue;

            const playerFootY = localPlayer.y + localPlayer.h;
            const otherFootY = other.y + other.h;
            const playerHeadY = localPlayer.y;
            const otherHeadY = other.y;

            // Check horizontal overlap between character bodies
            const hOverlap = (localPlayer.x + localPlayer.w > other.x + 4 && localPlayer.x < other.x + other.w - 4);

            // 1. Local Player is LANDING / STANDING on top of Other Player's head
            if (hOverlap && localPlayer.vy >= 0 && playerFootY >= otherHeadY && playerFootY <= otherHeadY + 16) {
                localPlayer.y = otherHeadY - localPlayer.h;
                localPlayer.vy = 0;
                localPlayer.isGrounded = true;
                localPlayer.isStandingOnOther = true;
                localPlayer.jumpsRemaining = localPlayer.maxJumps;

                // Carry momentum if other player walks left/right
                if (other.vx && Math.abs(other.vx) > 0.1) {
                    localPlayer.x += other.vx * 0.55;
                }
                continue;
            }

            // 2. Other Player is STANDING on top of Local Player's head (Blocks local player jump!)
            if (hOverlap && otherFootY >= playerHeadY && otherFootY <= playerHeadY + 16) {
                localPlayer.hasRiderOnHead = true; // Cannot jump, but can walk left/right to throw them off!
                continue;
            }

            // 3. Lateral / Horizontal Body Collision (cannot share narrow ramps / small platforms)
            const dx = (localPlayer.x + localPlayer.w / 2) - (other.x + other.w / 2);
            const dy = (localPlayer.y + localPlayer.h / 2) - (other.y + other.h / 2);
            const combinedHalfW = (localPlayer.w + other.w) / 2;
            const combinedHalfH = (localPlayer.h + other.h) / 2;

            if (Math.abs(dx) < combinedHalfW && Math.abs(dy) < combinedHalfH - 5) {
                const overlapX = combinedHalfW - Math.abs(dx);
                const nudgeDir = Math.sign(dx) || 1;

                // Solid physical separation
                localPlayer.x += nudgeDir * (overlapX * 0.55);

                // Deflect velocity if moving directly against the other player
                if (localPlayer.vx && Math.sign(localPlayer.vx) !== nudgeDir) {
                    localPlayer.vx = 0;
                }
            }
        }
    }
}
