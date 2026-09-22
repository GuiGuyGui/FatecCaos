// Seeded Random Number Generator for Procedural Generation
class SeededRandom {
    constructor(seed) {
        this.seed = (typeof seed === 'number') ? seed : this.hashString(String(seed));
    }

    hashString(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = Math.imul(31, hash) + str.charCodeAt(i) | 0;
        }
        return hash;
    }

    next() {
        let t = this.seed += 0x6D2B79F5;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }

    range(min, max) {
        return min + this.next() * (max - min);
    }

    rangeInt(min, max) {
        return Math.floor(this.range(min, max + 1));
    }

    choice(arr) {
        return arr[this.rangeInt(0, arr.length - 1)];
    }
}

// Procedural Multi-Path 3000px Wide x 12,000m Tall Map Generator (4 Seasonal Maps & Weapons)
class GameMap {
    constructor(seed = 123456) {
        this.seed = seed;
        this.worldWidth = 3000; // 3x wider map
        this.worldHeight = 8000; // 12.000 metros de altitude escalonada
        this.isBlackout = false;
        this.season = 'normal'; // 'normal', 'spring', 'summer', 'autumn', 'winter'

        // Generate 5 distinct maps (Normal + 4 Seasons) + Day/Night
        this.seasonMaps = {
            normal: this.generateMapData(new SeededRandom(seed + 50), false, 'normal'),
            spring: this.generateMapData(new SeededRandom(seed + 101), false, 'spring'),
            summer: this.generateMapData(new SeededRandom(seed + 202), false, 'summer'),
            autumn: this.generateMapData(new SeededRandom(seed + 303), false, 'autumn'),
            winter: this.generateMapData(new SeededRandom(seed + 404), false, 'winter')
        };
        this.nightMap = this.generateMapData(new SeededRandom(seed + 99991), true, 'winter');

        // Active layout pointers
        this.applySeasonLayout();
    }

    applySeasonLayout() {
        if (this.isBlackout) {
            this.platforms = this.nightMap.platforms;
            this.interactiveObjects = this.nightMap.interactiveObjects;
            this.decorations = this.nightMap.decorations;
        } else {
            const activeLayout = this.seasonMaps[this.season] || this.seasonMaps.normal || this.seasonMaps.spring;
            this.platforms = activeLayout.platforms;
            this.interactiveObjects = activeLayout.interactiveObjects;
            this.decorations = activeLayout.decorations;
        }
    }

    setSeason(seasonName) {
        if (this.seasonMaps[seasonName]) {
            this.season = seasonName;
            this.applySeasonLayout();
        }
    }

    generateMapData(rng, isNight, season = 'normal') {
        const platforms = [];
        const interactiveObjects = [];
        const decorations = [];


        // 1. Boundary Wall Pillars (Far Left x:0, Far Right x:2875)
        for (let y = 0; y <= this.worldHeight; y += 300) {
            decorations.push({
                type: 'pillar_left',
                x: 0,
                y: y,
                w: 125,
                h: 320
            });
            decorations.push({
                type: 'pillar_right',
                x: 2875,
                y: y,
                w: 125,
                h: 320
            });
        }

        // Midground decorative pillars
        for (let y = 0; y <= this.worldHeight; y += 600) {
            decorations.push({
                type: 'pillar_left',
                x: 950,
                y: y,
                w: 80,
                h: 280
            });
            decorations.push({
                type: 'pillar_right',
                x: 1950,
                y: y,
                w: 80,
                h: 280
            });
        }

        // 2. Wide Ground Floor at y: 7900 (Players start clustered on the far left)
        platforms.push({
            id: isNight ? 'ground_night' : 'ground_day',
            type: 'stone_grass',
            x: 40,
            y: 7900,
            origX: 40,
            origY: 7900,
            w: 2920,
            h: 120,
            solid: true
        });

        // Directional ground signs pointing right: players must run to the right side to start the ascent!
        const groundSigns = [450, 1100, 1750, 2200];
        groundSigns.forEach(sx => {
            decorations.push({
                type: 'arrow_sign',
                x: sx,
                y: 7840,
                w: 28,
                h: 60
            });
        });

        // Base Ascent Stairways & Launchpads across the ENTIRE bottom floor
        const baseSteps = [
            { x: 140, y: 7850, w: 90, h: 26, spring: false },
            { x: 260, y: 7800, w: 90, h: 26, spring: true, bounce: -17.5 },
            { x: 420, y: 7750, w: 100, h: 26, spring: false },
            { x: 580, y: 7700, w: 110, h: 26, spring: true, bounce: -18.0 },
            { x: 800, y: 7840, w: 90, h: 26, spring: false },
            { x: 960, y: 7780, w: 100, h: 26, spring: true, bounce: -18.5 },
            { x: 1200, y: 7820, w: 100, h: 26, spring: false },
            { x: 1400, y: 7760, w: 110, h: 26, spring: true, bounce: -19.0 },
            { x: 1650, y: 7820, w: 100, h: 26, spring: false },
            { x: 1900, y: 7760, w: 100, h: 26, spring: true, bounce: -18.5 },
            { x: 2150, y: 7840, w: 90, h: 26, spring: false },
            { x: 2380, y: 7860, w: 90, h: 26, spring: false },
            { x: 2490, y: 7815, w: 90, h: 26, spring: false },
            { x: 2600, y: 7770, w: 90, h: 26, spring: true, bounce: -19.5 },
            { x: 2720, y: 7720, w: 100, h: 28, spring: true, bounce: -20.0 }
        ];
        baseSteps.forEach((st, idx) => {
            platforms.push({
                id: `p_base_start_${isNight ? 'n' : 'd'}_${idx}`,
                type: 'ancient_brick',
                x: st.x,
                y: st.y,
                origX: st.x,
                origY: st.y,
                w: st.w,
                h: st.h,
                solid: true
            });
            if (st.spring) {
                interactiveObjects.push({
                    type: 'spring',
                    x: st.x + st.w / 2 - 12,
                    y: st.y - 16,
                    origX: st.x + st.w / 2 - 12,
                    origY: st.y - 16,
                    w: 24,
                    h: 16,
                    bounceForce: st.bounce,
                    activeAnim: 0
                });
            }
        });

        decorations.push({
            type: 'royal_banner',
            x: 2750,
            y: 7620,
            w: 36,
            h: 70,
            color: isNight ? '#a855f7' : '#3b82f6'
        });

        // Lower spreading bridges branching across the entire ground floor
        const lowerSpreadingBridges = [
            { x: 250, y: 7680, w: 140 },
            { x: 550, y: 7640, w: 130 },
            { x: 850, y: 7600, w: 140 },
            { x: 1150, y: 7560, w: 130 },
            { x: 1450, y: 7520, w: 140 },
            { x: 1750, y: 7560, w: 130 },
            { x: 2050, y: 7600, w: 140 },
            { x: 2350, y: 7640, w: 130 },
            { x: 2650, y: 7680, w: 140 }
        ];
        lowerSpreadingBridges.forEach((b, bIdx) => {
            platforms.push({
                id: `p_spread_bridge_${isNight ? 'n' : 'd'}_${bIdx}`,
                type: 'wood_bridge',
                x: b.x,
                y: b.y,
                origX: b.x,
                origY: b.y,
                w: b.w,
                h: 18,
                solid: true
            });
        });

        // =========================================================================
        // 3. Phase 1: Multi-Lane Open Ascent (Altitude 0m to 2,500m, y: 7700 down to 5480)
        // High variety of climbing paths spanning across all 3000px of width!
        // =========================================================================
        const laneCenters = isNight 
            ? [360, 780, 1200, 1620, 2040, 2460, 2750]
            : [320, 740, 1160, 1580, 2000, 2420, 2760];

        let currentY = 7700;
        let tierIndex = 0;

        while (currentY > 5480) {
            tierIndex++;
            const progress = Math.max(0, Math.min(1, (7800 - currentY) / 2350));
            const stepY = rng.range(68, 88);
            currentY -= stepY;

            const biome = this.getBiomePlatformType(currentY, season);

            laneCenters.forEach((laneX, lIdx) => {
                if (rng.next() < 0.82) {
                    const pW = Math.max(28, 48 - progress * 14 + rng.range(-4, 4));
                    const jitterX = rng.range(-75, 75);
                    const posX = Math.max(140, Math.min(2860 - pW, laneX + jitterX));

                    let ptype = biome;
                    let isMoving = false;
                    let moveRange = 0;
                    let moveSpeed = 0;
                    let moveType = 'horizontal';
                    let isCrumbling = false;
                    let isRamp = false;
                    let rampSlope = 0;
                    let isConveyor = false;
                    let conveyorSpeed = 0;

                    const roll = rng.next();
                    if (roll < 0.18) {
                        isMoving = true;
                        moveRange = rng.range(35, 75);
                        moveSpeed = rng.range(1.2, 1.8);
                        moveType = rng.next() > 0.4 ? 'horizontal' : 'vertical';
                        ptype = 'moving_wood';
                    } else if (roll < 0.32) {
                        isCrumbling = true;
                        ptype = 'crumbling';
                    } else if (roll < 0.44) {
                        isRamp = true;
                        rampSlope = rng.next() > 0.5 ? 1 : -1;
                        ptype = 'ramp';
                    } else if (roll < 0.54) {
                        isConveyor = true;
                        conveyorSpeed = rng.next() > 0.5 ? 2.2 : -2.2;
                        ptype = 'conveyor';
                    } else if (roll < 0.70) {
                        ptype = 'wood_bridge';
                    }

                    platforms.push({
                        id: `p_lane_${isNight ? 'n' : 'd'}_${lIdx}_${tierIndex}`,
                        type: ptype,
                        x: posX,
                        y: currentY,
                        origX: posX,
                        origY: currentY,
                        w: isRamp ? pW + 20 : pW,
                        h: isRamp ? 24 : 18,
                        solid: true,
                        isMoving: isMoving,
                        moveType: moveType,
                        moveRange: moveRange,
                        moveSpeed: moveSpeed,
                        moveOffset: rng.range(0, Math.PI * 2),
                        isCrumbling: isCrumbling,
                        crumbleTimer: 0,
                        isBroken: false,
                        breakResetTimer: 0,
                        isRamp: isRamp,
                        slope: rampSlope,
                        isConveyor: isConveyor,
                        conveyorSpeed: conveyorSpeed
                    });

                    // Interactive springs
                    if (rng.next() < 0.10 && !isMoving && !isCrumbling && !isRamp) {
                        interactiveObjects.push({
                            type: 'spring',
                            x: posX + pW / 2 - 12,
                            y: currentY - 16,
                            origX: posX + pW / 2 - 12,
                            origY: currentY - 16,
                            w: 24,
                            h: 16,
                            bounceForce: -18.5,
                            activeAnim: 0
                        });
                    }

                    // Interactive Weapon & Medkit Pickups (Pistola, Shotgun, AK-47, Kit Médico)
                    if (rng.next() < 0.22 && !isMoving && !isCrumbling && !isRamp) {
                        const itemRoll = rng.next();
                        let itemType = 'pistol';
                        let bullets = 2;
                        let itemIcon = '🔫';

                        if (itemRoll < 0.26) {
                            itemType = 'medkit';
                            bullets = 0;
                            itemIcon = '💊';
                        } else if (itemRoll < 0.52) {
                            itemType = 'shotgun';
                            bullets = 4;
                            itemIcon = '💥';
                        } else if (itemRoll < 0.78) {
                            itemType = 'ak47';
                            bullets = 15;
                            itemIcon = '⚡';
                        } else {
                            itemType = 'pistol';
                            bullets = 2;
                            itemIcon = '🔫';
                        }

                        interactiveObjects.push({
                            id: `item_${season}_p1_${tierIndex}_${lIdx}`,
                            type: itemType === 'medkit' ? 'medkit' : 'weapon_item',
                            item_type: itemType,
                            icon: itemIcon,
                            x: posX + pW / 2 - 14,
                            y: currentY - 26,
                            origX: posX + pW / 2 - 14,
                            origY: currentY - 26,
                            w: 28,
                            h: 24,
                            bullets: bullets,
                            healAmount: 50,
                            collected: false,
                            respawnTimer: 0,
                            floatOffset: rng.range(0, Math.PI * 2)
                        });
                    }
                }
            });

            // Spring Season: Extra Zig-Zag Loops & Doubled Pathing
            if (season === 'spring' && tierIndex % 2 === 0) {
                const zigX = rng.range(250, 2700);
                const zigW = rng.range(38, 55);
                platforms.push({
                    id: `p_spring_zigzag_${tierIndex}`,
                    type: 'flower_grass',
                    x: zigX,
                    y: currentY - 34,
                    origX: zigX,
                    origY: currentY - 34,
                    w: zigW,
                    h: 16,
                    solid: true
                });
            }


            // Intermediate stepping stones
            for (let i = 0; i < laneCenters.length - 1; i++) {
                if (rng.next() < 0.35) {
                    const midX = (laneCenters[i] + laneCenters[i + 1]) / 2 + rng.range(-40, 40);
                    const midY = currentY + rng.range(-20, 20);
                    const stoneW = rng.range(24, 36);

                    platforms.push({
                        id: `p_step_${isNight ? 'n' : 'd'}_${i}_${tierIndex}`,
                        type: biome,
                        x: midX,
                        y: midY,
                        origX: midX,
                        origY: midY,
                        w: stoneW,
                        h: 16,
                        solid: true,
                        isMoving: false,
                        isCrumbling: rng.next() < 0.2
                    });
                }
            }

            // Connecting bridges
            if (tierIndex % 3 === 0) {
                const crossIdx = rng.rangeInt(0, laneCenters.length - 2);
                const bridgeStartX = laneCenters[crossIdx] + 45;
                const bridgeW = rng.range(50, 85);
                const bridgeY = currentY + rng.range(-10, 10);

                platforms.push({
                    id: `p_bridge_${isNight ? 'n' : 'd'}_${tierIndex}_${crossIdx}`,
                    type: 'wood_bridge',
                    x: bridgeStartX,
                    y: bridgeY,
                    origX: bridgeStartX,
                    origY: bridgeY,
                    w: bridgeW,
                    h: 16,
                    solid: true,
                    isMoving: false,
                    isCrumbling: false
                });
            }
        }

        // Funnel at 2500m (y ~ 5480 to 5400) leading all routes into the RIGHT SIDE entrance
        const funnelStartX = 2750;
        const funnelSteps = [
            { x: 380, y: 5490, w: 90 },
            { x: 880, y: 5470, w: 85 },
            { x: 1380, y: 5450, w: 85 },
            { x: 1880, y: 5435, w: 85 },
            { x: 2360, y: 5418, w: 85 },
            { x: 2750, y: 5400, w: 100 }
        ];

        funnelSteps.forEach((fs, fIdx) => {
            platforms.push({
                id: `p_funnel_${isNight ? 'n' : 'd'}_${fIdx}`,
                type: 'wood_bridge',
                x: fs.x,
                y: fs.y,
                origX: fs.x,
                origY: fs.y,
                w: fs.w,
                h: 20,
                solid: true
            });
        });

        // Gateway Royal Banner at 2500m Entrance
        decorations.push({
            type: 'royal_banner',
            x: funnelStartX + 10,
            y: 5320,
            w: 38,
            h: 75,
            color: isNight ? '#a855f7' : '#dc2626'
        });

        // =========================================================================
        // 4. Phase 2: The UNIQUE SINGLE COMPLEX PATH (Altitude 2500m to 8000m, y: 5400 down to 120)
        // Starts on the RIGHT SIDE and traverses to the LEFT SIDE, weaving back and forth.
        // Platforms have varying sizes, frequently getting NARROW/TINY to force player stacking & shoving!
        // =========================================================================
        let pathX = funnelStartX;
        let pathY = 5400;
        let pathDir = -1; // Starts on the right side and moves towards the left!
        let pathStepIndex = 0;

        const leftBound = 180;
        const rightBound = 2820;

        while (pathY > 140) {
            pathStepIndex++;
            const totalProgress = Math.max(0, Math.min(1, (5400 - pathY) / 5260)); // 0.0 at 2500m, 1.0 at 8000m
            const biome = this.getBiomePlatformType(pathY, season);

            // Platform width: varied but frequently small/narrow (14px to 28px) to force cramming
            const pW = Math.max(14, Math.floor(28 - totalProgress * 14 + rng.range(-3, 3)));

            const moduleRoll = rng.next();

            if (moduleRoll < 0.22) {
                // MODULE A: Deep Valley Dip (varied & narrow footholds)
                const dipDepth = rng.range(50, 110 + totalProgress * 35);
                const stepsInDip = rng.rangeInt(4, 6);
                const stepDx = (rng.range(75, 110) * pathDir);

                for (let s = 0; s < stepsInDip; s++) {
                    pathStepIndex++;
                    const dipT = s / (stepsInDip - 1);
                    const vertOffset = Math.sin(dipT * Math.PI) * dipDepth - (dipT * 30);
                    const curX = pathX + stepDx * s;
                    const curY = pathY + vertOffset;

                    if ((pathDir > 0 && curX > rightBound - 80) || (pathDir < 0 && curX < leftBound + 80)) {
                        break;
                    }

                    const isCrumble = rng.next() < (0.2 + totalProgress * 0.25);
                    platforms.push({
                        id: `p_unique_dip_${isNight ? 'n' : 'd'}_${pathStepIndex}`,
                        type: isCrumble ? 'crumbling' : biome,
                        x: curX,
                        y: curY,
                        origX: curX,
                        origY: curY,
                        w: Math.max(14, pW - (s % 2 === 1 ? 4 : 0)),
                        h: 16,
                        solid: true,
                        isMoving: false,
                        isCrumbling: isCrumble,
                        crumbleTimer: 0,
                        isBroken: false,
                        breakResetTimer: 0
                    });
                }
                pathX += stepDx * (stepsInDip - 1);
                pathY -= rng.range(25, 45);

            } else if (moduleRoll < 0.40) {
                // MODULE B: Peak Climb & Drop (steep small platforms)
                const peakHeight = rng.range(60, 110);
                const stepsInPeak = rng.rangeInt(3, 5);
                const stepDx = (rng.range(70, 105) * pathDir);

                for (let s = 0; s < stepsInPeak; s++) {
                    pathStepIndex++;
                    const peakT = s / (stepsInPeak - 1);
                    const vertOffset = -Math.sin(peakT * Math.PI) * peakHeight - (peakT * 25);
                    const curX = pathX + stepDx * s;
                    const curY = pathY + vertOffset;

                    if ((pathDir > 0 && curX > rightBound - 80) || (pathDir < 0 && curX < leftBound + 80)) {
                        break;
                    }

                    platforms.push({
                        id: `p_unique_peak_${isNight ? 'n' : 'd'}_${pathStepIndex}`,
                        type: biome,
                        x: curX,
                        y: curY,
                        origX: curX,
                        origY: curY,
                        w: Math.max(14, pW),
                        h: 16,
                        solid: true,
                        isMoving: false,
                        isCrumbling: false
                    });
                }
                pathX += stepDx * (stepsInPeak - 1);
                pathY -= rng.range(30, 50);

            } else if (moduleRoll < 0.55) {
                // MODULE C: Stepping Stones Chasm (tiny individual steps forcing queue & collisions)
                const stepsCount = rng.rangeInt(3, 5);
                const stepDx = (rng.range(65, 95) * pathDir);

                for (let s = 0; s < stepsCount; s++) {
                    pathStepIndex++;
                    pathX += stepDx;
                    pathY -= rng.range(22, 38);

                    if ((pathDir > 0 && pathX > rightBound - 80) || (pathDir < 0 && pathX < leftBound + 80)) {
                        break;
                    }

                    const isCrumble = s % 2 === 1;
                    platforms.push({
                        id: `p_unique_step_${isNight ? 'n' : 'd'}_${pathStepIndex}`,
                        type: isCrumble ? 'crumbling' : biome,
                        x: pathX,
                        y: pathY,
                        origX: pathX,
                        origY: pathY,
                        w: Math.max(14, pW - (isCrumble ? 2 : 0)),
                        h: 16,
                        solid: true,
                        isCrumbling: isCrumble,
                        crumbleTimer: 0,
                        isBroken: false,
                        breakResetTimer: 0
                    });
                }

            } else if (moduleRoll < 0.68) {
                // MODULE D: Slanted Ramp
                const rampW = rng.range(55, 85);
                const stepDx = (rampW * pathDir);
                const slopeDir = pathDir > 0 ? 1 : -1;
                const rX = pathDir > 0 ? pathX : pathX - rampW;
                const rY = pathY - 20;

                platforms.push({
                    id: `p_unique_ramp_${isNight ? 'n' : 'd'}_${pathStepIndex}`,
                    type: 'ramp',
                    x: rX,
                    y: rY,
                    origX: rX,
                    origY: rY,
                    w: rampW,
                    h: 24,
                    solid: true,
                    isRamp: true,
                    slope: slopeDir
                });

                pathX += stepDx;
                pathY -= rng.range(25, 45);

            } else if (moduleRoll < 0.80) {
                // MODULE E: Fast Narrow Conveyor Belt
                const convW = rng.range(45, 75);
                const convDir = rng.next() > 0.4 ? -pathDir : pathDir;

                platforms.push({
                    id: `p_unique_conv_${isNight ? 'n' : 'd'}_${pathStepIndex}`,
                    type: 'conveyor',
                    x: pathX,
                    y: pathY,
                    origX: pathX,
                    origY: pathY,
                    w: convW,
                    h: 18,
                    solid: true,
                    isConveyor: true,
                    conveyorSpeed: convDir * (2.2 + totalProgress * 1.2)
                });

                pathX += (convW + 20) * pathDir;
                pathY -= rng.range(30, 50);

            } else if (moduleRoll < 0.90) {
                // MODULE F: Moving Elevator Platform
                const moveDist = (rng.range(80, 120) * pathDir);
                pathX += moveDist;
                pathY -= rng.range(35, 65);

                const moveType = rng.next() > 0.5 ? 'horizontal' : 'vertical';
                const moveRange = rng.range(35, 70 + totalProgress * 20);
                const moveSpeed = rng.range(1.4, 2.2 + totalProgress * 0.7);

                platforms.push({
                    id: `p_unique_mov_${isNight ? 'n' : 'd'}_${pathStepIndex}`,
                    type: 'moving_wood',
                    x: pathX,
                    y: pathY,
                    origX: pathX,
                    origY: pathY,
                    w: Math.max(14, pW - 2),
                    h: 16,
                    solid: true,
                    isMoving: true,
                    moveType: moveType,
                    moveRange: moveRange,
                    moveSpeed: moveSpeed,
                    moveOffset: rng.range(0, Math.PI * 2),
                    isCrumbling: false
                });

            } else {
                // MODULE G: Spring Leap over chasm
                const springX = pathX;
                const springY = pathY;

                platforms.push({
                    id: `p_unique_spr_base_${isNight ? 'n' : 'd'}_${pathStepIndex}`,
                    type: biome,
                    x: springX,
                    y: springY,
                    origX: springX,
                    origY: springY,
                    w: 32,
                    h: 16,
                    solid: true
                });

                interactiveObjects.push({
                    type: 'spring',
                    x: springX + 4,
                    y: springY - 16,
                    origX: springX + 4,
                    origY: springY - 16,
                    w: 24,
                    h: 16,
                    bounceForce: -19.5,
                    activeAnim: 0
                });

                const leapDx = (rng.range(140, 200) * pathDir);
                pathX += leapDx;
                pathY -= rng.range(90, 135);

                platforms.push({
                    id: `p_unique_spr_land_${isNight ? 'n' : 'd'}_${pathStepIndex}`,
                    type: biome,
                    x: pathX,
                    y: pathY,
                    origX: pathX,
                    origY: pathY,
                    w: Math.max(14, pW),
                    h: 16,
                    solid: true
                });
            }

            // Wall Boundary Turnaround Tower
            if (pathDir > 0 && pathX >= rightBound - 120) {
                pathX = rightBound - 80;
                for (let turn = 1; turn <= 3; turn++) {
                    pathStepIndex++;
                    pathY -= rng.range(65, 85);
                    const turnX = rightBound - 60 - turn * 35;

                    platforms.push({
                        id: `p_unique_turn_r_${isNight ? 'n' : 'd'}_${pathStepIndex}`,
                        type: biome,
                        x: turnX,
                        y: pathY,
                        origX: turnX,
                        origY: pathY,
                        w: Math.max(16, pW),
                        h: 16,
                        solid: true
                    });
                }
                pathX = rightBound - 180;
                pathDir = -1;

                decorations.push({
                    type: 'banner_arrow',
                    x: rightBound - 70,
                    y: pathY - 40,
                    w: 24,
                    h: 40
                });

            } else if (pathDir < 0 && pathX <= leftBound + 120) {
                pathX = leftBound + 80;
                for (let turn = 1; turn <= 3; turn++) {
                    pathStepIndex++;
                    pathY -= rng.range(65, 85);
                    const turnX = leftBound + 60 + turn * 35;

                    platforms.push({
                        id: `p_unique_turn_l_${isNight ? 'n' : 'd'}_${pathStepIndex}`,
                        type: biome,
                        x: turnX,
                        y: pathY,
                        origX: turnX,
                        origY: pathY,
                        w: Math.max(16, pW),
                        h: 16,
                        solid: true
                    });
                }
                pathX = leftBound + 180;
                pathDir = 1;

                decorations.push({
                    type: 'banner_arrow',
                    x: leftBound + 50,
                    y: pathY - 40,
                    w: 24,
                    h: 40
                });
            }
        }

        // Grand Summit Citadel Approach & Platform
        const summitApproachX = pathX;
        platforms.push({
            id: `p_summit_approach_${isNight ? 'n' : 'd'}`,
            type: 'gold_citadel',
            x: (summitApproachX + 1300) / 2,
            y: 110,
            origX: (summitApproachX + 1300) / 2,
            origY: 110,
            w: 80,
            h: 22,
            solid: true
        });

        platforms.push({
            id: `summit_platform_${isNight ? 'n' : 'd'}`,
            type: 'gold_citadel',
            x: 1250,
            y: 80,
            origX: 1250,
            origY: 80,
            w: 500,
            h: 40,
            solid: true
        });

        interactiveObjects.push({
            type: 'victory_flag',
            x: 1480,
            y: 10,
            origX: 1480,
            origY: 10,
            w: 40,
            h: 70
        });

        decorations.push({
            type: 'crown_pedestal',
            x: 1490,
            y: 45,
            w: 20,
            h: 35
        });

        return { platforms, interactiveObjects, decorations };
    }

    getBiomePlatformType(y, season = this.season) {
        if (season === 'winter') {
            return 'crystal_ice'; // Inverno: All icy and slippery!
        } else if (season === 'autumn') {
            if (y > 4800) return 'autumn_stone';
            if (y > 2400) return 'autumn_wood';
            return 'autumn_gold';
        } else if (season === 'summer') {
            if (y > 4800) return 'jungle_sandstone';
            if (y > 2400) return 'tropical_wood';
            return 'volcanic_sun';
        } else if (season === 'spring') {
            if (y > 4800) return 'flower_grass';
            if (y > 2400) return 'cherry_wood';
            return 'sakura_citadel';
        }

        // Normal / Default
        if (y > 6400) {
            return 'stone_grass'; // Lowland Verdant Grass (0 - 2,400m)
        } else if (y > 4800) {
            return 'ancient_brick'; // Ancient Stone Ruins (2,400 - 4,800m)
        } else if (y > 3200) {
            return 'crystal_ice'; // Frozen Glacier Peaks (4,800 - 7,200m)
        } else if (y > 1400) {
            return 'obsidian_magma'; // Volcanic Obsidian (7,200 - 9,900m)
        } else {
            return 'gold_citadel'; // Golden Heavens Citadel (9,900 - 12,000m)
        }
    }

    update(dt, time, isBlackout = false) {
        // Instant map swap between Day Map and Night Map or Seasons
        if (this.isBlackout !== isBlackout) {
            this.isBlackout = isBlackout;
            this.applySeasonLayout();
        }

        // Update active layout moving and crumbling platforms directly
        for (let p of this.platforms) {
            if (p.isMoving) {
                if (p.moveType === 'vertical') {
                    const prevY = p.y !== undefined ? p.y : p.origY;
                    const newY = p.origY + Math.sin(time * p.moveSpeed + p.moveOffset) * p.moveRange;
                    p.dy = newY - prevY;
                    p.y = newY;
                    p.x = p.origX;
                    p.dx = 0;
                } else {
                    const prevX = p.x !== undefined ? p.x : p.origX;
                    const newX = p.origX + Math.sin(time * p.moveSpeed + p.moveOffset) * p.moveRange;
                    p.dx = newX - prevX;
                    p.x = newX;
                    p.y = p.origY;
                    p.dy = 0;
                }
            } else {
                p.x = p.origX;
                p.y = p.origY;
                p.dx = 0;
                p.dy = 0;
            }

            if (p.isCrumbling) {
                if (p.isSteppedOn && !p.isBroken) {
                    p.crumbleTimer += dt;
                    if (p.crumbleTimer > 0.55) {
                        p.isBroken = true;
                        p.solid = false;
                        p.breakResetTimer = 2.4;
                    }
                } else if (p.isBroken) {
                    p.breakResetTimer -= dt;
                    if (p.breakResetTimer <= 0) {
                        p.isBroken = false;
                        p.solid = true;
                        p.crumbleTimer = 0;
                        p.isSteppedOn = false;
                    }
                }
            }
        }

        for (let obj of this.interactiveObjects) {
            if (obj.type === 'spring' && obj.activeAnim > 0) {
                obj.activeAnim -= dt * 6;
                if (obj.activeAnim < 0) obj.activeAnim = 0;
            } else if (obj.type === 'ammo_box' || obj.type === 'weapon_item' || obj.type === 'medkit') {
                if (obj.collected) {
                    obj.respawnTimer -= dt;
                    if (obj.respawnTimer <= 0) {
                        obj.collected = false;
                        obj.respawnTimer = 0;
                    }
                }
            }
        }
    }
}
