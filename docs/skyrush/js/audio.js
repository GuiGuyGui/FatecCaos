// Audio Manager using Web Audio API for procedural sound effects
class SoundEngine {
    constructor() {
        this.ctx = null;
        this.enabled = true;
        this.masterVolume = 0.4;
    }

    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                this.ctx = new AudioContext();
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    playJump() {
        if (!this.enabled || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(220, now);
            osc.frequency.exponentialRampToValueAtTime(580, now + 0.12);

            gain.gain.setValueAtTime(this.masterVolume * 0.4, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.12);
        } catch (e) {}
    }

    playDoubleJump() {
        if (!this.enabled || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(350, now);
            osc.frequency.exponentialRampToValueAtTime(800, now + 0.15);

            gain.gain.setValueAtTime(this.masterVolume * 0.5, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.15);
        } catch (e) {}
    }

    playPush() {
        if (!this.enabled || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'square';
            osc.frequency.setValueAtTime(120, now);
            osc.frequency.exponentialRampToValueAtTime(40, now + 0.14);

            gain.gain.setValueAtTime(this.masterVolume * 0.6, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.14);
        } catch (e) {}
    }

    playShove() {
        if (!this.enabled || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(220, now);
            osc.frequency.exponentialRampToValueAtTime(60, now + 0.12);

            gain.gain.setValueAtTime(this.masterVolume * 0.8, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.12);
        } catch (e) {}
    }

    playSpring() {
        if (!this.enabled || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(200, now);
            osc.frequency.linearRampToValueAtTime(700, now + 0.08);
            osc.frequency.linearRampToValueAtTime(950, now + 0.22);

            gain.gain.setValueAtTime(this.masterVolume * 0.5, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.22);
        } catch (e) {}
    }

    playSniperLaser() {
        if (!this.enabled || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const sampleRate = this.ctx.sampleRate;

            // Layer 1: Sharp Gunshot Muzzle Crack (High-velocity noise transient)
            const crackDuration = 0.35;
            const bufferSize = Math.floor(sampleRate * crackDuration);
            const noiseBuffer = this.ctx.createBuffer(1, bufferSize, sampleRate);
            const output = noiseBuffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                // White noise with exponential falloff
                const decay = Math.exp(-i / (sampleRate * 0.04));
                output[i] = (Math.random() * 2 - 1) * decay;
            }

            const crackSource = this.ctx.createBufferSource();
            crackSource.buffer = noiseBuffer;

            // Highpass + Bandpass for the sharp rifle bullet crack
            const crackFilter = this.ctx.createBiquadFilter();
            crackFilter.type = 'bandpass';
            crackFilter.frequency.setValueAtTime(2800, now);
            crackFilter.frequency.exponentialRampToValueAtTime(800, now + 0.2);
            crackFilter.Q.setValueAtTime(2.0, now);

            const crackGain = this.ctx.createGain();
            crackGain.gain.setValueAtTime(this.masterVolume * 2.2, now);
            crackGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

            crackSource.connect(crackFilter);
            crackFilter.connect(crackGain);
            crackGain.connect(this.ctx.destination);

            crackSource.start(now);
            crackSource.stop(now + crackDuration);

            // Layer 2: Gunpowder Detonation / Body Explosion (Thumping mid-punch)
            const boomDuration = 0.45;
            const boomBuffer = this.ctx.createBuffer(1, Math.floor(sampleRate * boomDuration), sampleRate);
            const boomOutput = boomBuffer.getChannelData(0);
            for (let i = 0; i < boomBuffer.length; i++) {
                boomOutput[i] = (Math.random() * 2 - 1);
            }
            const boomSource = this.ctx.createBufferSource();
            boomSource.buffer = boomBuffer;

            const boomFilter = this.ctx.createBiquadFilter();
            boomFilter.type = 'lowpass';
            boomFilter.frequency.setValueAtTime(1400, now);
            boomFilter.frequency.exponentialRampToValueAtTime(180, now + 0.35);

            const boomGain = this.ctx.createGain();
            boomGain.gain.setValueAtTime(this.masterVolume * 1.8, now);
            boomGain.gain.exponentialRampToValueAtTime(0.001, now + 0.42);

            boomSource.connect(boomFilter);
            boomFilter.connect(boomGain);
            boomGain.connect(this.ctx.destination);

            boomSource.start(now);
            boomSource.stop(now + boomDuration);

            // Layer 3: Heavy Low-End Rifle Kick / Bass Thud (Shockwave)
            const bassOsc = this.ctx.createOscillator();
            const bassGain = this.ctx.createGain();

            bassOsc.type = 'sawtooth';
            bassOsc.frequency.setValueAtTime(240, now);
            bassOsc.frequency.exponentialRampToValueAtTime(32, now + 0.22);

            bassGain.gain.setValueAtTime(this.masterVolume * 1.5, now);
            bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

            bassOsc.connect(bassGain);
            bassGain.connect(this.ctx.destination);

            bassOsc.start(now);
            bassOsc.stop(now + 0.28);

            // Layer 4: Deep Sub-Bass Rumble
            const subOsc = this.ctx.createOscillator();
            const subGain = this.ctx.createGain();

            subOsc.type = 'sine';
            subOsc.frequency.setValueAtTime(150, now);
            subOsc.frequency.exponentialRampToValueAtTime(25, now + 0.35);

            subGain.gain.setValueAtTime(this.masterVolume * 1.2, now);
            subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

            subOsc.connect(subGain);
            subGain.connect(this.ctx.destination);

            subOsc.start(now);
            subOsc.stop(now + 0.35);
        } catch (e) {}
    }

    playEarthquake() {
        if (!this.enabled || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(60, now);
            osc.frequency.setValueAtTime(45, now + 0.3);
            osc.frequency.setValueAtTime(70, now + 0.6);

            gain.gain.setValueAtTime(this.masterVolume * 0.6, now);
            gain.gain.linearRampToValueAtTime(this.masterVolume * 0.7, now + 0.5);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 1.2);
        } catch (e) {}
    }

    playWind() {
        if (!this.enabled || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(260, now);
            osc.frequency.linearRampToValueAtTime(380, now + 0.4);
            osc.frequency.linearRampToValueAtTime(220, now + 0.8);

            gain.gain.setValueAtTime(this.masterVolume * 0.3, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.8);
        } catch (e) {}
    }

    playBoulderRumble() {
        if (!this.enabled || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(45, now);
            osc.frequency.linearRampToValueAtTime(70, now + 0.3);
            osc.frequency.linearRampToValueAtTime(38, now + 0.6);

            gain.gain.setValueAtTime(this.masterVolume * 0.7, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.6);
        } catch (e) {}
    }

    playBoulderCrash() {
        if (!this.enabled || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const sampleRate = this.ctx.sampleRate;

            // Heavy rock crunch noise burst
            const bufferSize = Math.floor(sampleRate * 0.35);
            const noiseBuffer = this.ctx.createBuffer(1, bufferSize, sampleRate);
            const output = noiseBuffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (sampleRate * 0.08));
            }

            const noiseSource = this.ctx.createBufferSource();
            noiseSource.buffer = noiseBuffer;

            const filter = this.ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(900, now);
            filter.frequency.exponentialRampToValueAtTime(120, now + 0.3);

            const noiseGain = this.ctx.createGain();
            noiseGain.gain.setValueAtTime(this.masterVolume * 1.5, now);
            noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

            noiseSource.connect(filter);
            filter.connect(noiseGain);
            noiseGain.connect(this.ctx.destination);

            noiseSource.start(now);
            noiseSource.stop(now + 0.35);

            // Deep impact thump
            const osc = this.ctx.createOscillator();
            const oscGain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(120, now);
            osc.frequency.exponentialRampToValueAtTime(30, now + 0.25);

            oscGain.gain.setValueAtTime(this.masterVolume * 1.2, now);
            oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

            osc.connect(oscGain);
            oscGain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.25);
        } catch (e) {}
    }

    playMeteor() {
        this.playBoulderCrash();
    }

    playSkillShockwave() {
        if (!this.enabled || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(80, now);
            osc.frequency.exponentialRampToValueAtTime(20, now + 0.3);

            gain.gain.setValueAtTime(this.masterVolume * 0.9, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.3);
        } catch (e) {}
    }

    playGhost() {
        if (!this.enabled || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(400, now);
            osc.frequency.linearRampToValueAtTime(650, now + 0.2);
            osc.frequency.linearRampToValueAtTime(500, now + 0.4);

            gain.gain.setValueAtTime(this.masterVolume * 0.4, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.4);
        } catch (e) {}
    }

    playDash() {
        if (!this.enabled || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(600, now);
            osc.frequency.exponentialRampToValueAtTime(150, now + 0.18);

            gain.gain.setValueAtTime(this.masterVolume * 0.5, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.18);
        } catch (e) {}
    }

    playLaserZap() {
        if (!this.enabled || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(1400, now);
            osc.frequency.exponentialRampToValueAtTime(120, now + 0.25);

            gain.gain.setValueAtTime(this.masterVolume * 0.8, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.25);
        } catch (e) {}
    }

    playLaserWarning() {
        if (!this.enabled || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(880, now);
            osc.frequency.setValueAtTime(1100, now + 0.06);

            gain.gain.setValueAtTime(this.masterVolume * 0.25, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.1);
        } catch (e) {}
    }

    playVictory() {
        if (!this.enabled || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const notes = [440, 554, 659, 880];
            notes.forEach((freq, idx) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                const noteStart = now + (idx * 0.12);

                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, noteStart);

                gain.gain.setValueAtTime(this.masterVolume * 0.6, noteStart);
                gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.4);

                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start(noteStart);
                osc.stop(noteStart + 0.4);
            });
        } catch (e) {}
    }

    playBlasterShot() {
        if (!this.enabled || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(950, now);
            osc.frequency.exponentialRampToValueAtTime(140, now + 0.14);

            gain.gain.setValueAtTime(this.masterVolume * 0.75, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.14);
        } catch (e) {}
    }

    playAmmoPickup() {
        if (!this.enabled || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const notes = [587.33, 880, 1174.66]; // D5, A5, D6 triumphant chime
            notes.forEach((freq, idx) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                const t = now + (idx * 0.05);

                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, t);

                gain.gain.setValueAtTime(this.masterVolume * 0.5, t);
                gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start(t);
                osc.stop(t + 0.18);
            });
        } catch (e) {}
    }

    playBulletHit() {
        if (!this.enabled || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'square';
            osc.frequency.setValueAtTime(320, now);
            osc.frequency.exponentialRampToValueAtTime(50, now + 0.18);

            gain.gain.setValueAtTime(this.masterVolume * 0.85, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.18);
        } catch (e) {}
    }

    playChain() {
        if (!this.enabled || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            // Metallic chain rattle clinks
            [450, 780, 520, 900, 360].forEach((freq, idx) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                const t = now + (idx * 0.04);

                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(freq, t);
                osc.frequency.exponentialRampToValueAtTime(120, t + 0.14);

                gain.gain.setValueAtTime(this.masterVolume * 0.45, t);
                gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);

                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start(t);
                osc.stop(t + 0.14);
            });
        } catch (e) {}
    }

    playCinematicIntro() {
        if (!this.enabled || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            // Epic deep orchestral chord
            [65.4, 98.0, 130.8, 196.0].forEach((freq) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();

                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(freq, now);
                osc.frequency.exponentialRampToValueAtTime(freq * 0.98, now + 3.0);

                gain.gain.setValueAtTime(0.01, now);
                gain.gain.linearRampToValueAtTime(this.masterVolume * 0.4, now + 0.3);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 3.5);

                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start(now);
                osc.stop(now + 3.5);
            });
        } catch (e) {}
    }

    playBattleStartHorn() {
        if (!this.enabled || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            // Heroic battle fanfare horn
            [261.63, 329.63, 392.00, 523.25].forEach((freq, idx) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                const t = now + (idx * 0.08);

                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, t);

                gain.gain.setValueAtTime(this.masterVolume * 0.55, t);
                gain.gain.exponentialRampToValueAtTime(0.001, t + 0.8);

                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start(t);
                osc.stop(t + 0.8);
            });
        } catch (e) {}
    }

    playFlashbang() {
        if (!this.enabled || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            // High pitch tinnitus sine wave (3800Hz slowly fading)
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(3800, now);
            osc.frequency.exponentialRampToValueAtTime(3200, now + 1.5);

            gain.gain.setValueAtTime(this.masterVolume * 0.45, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 1.5);
        } catch (e) {}
    }

    playChickenCluck() {
        if (!this.enabled || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            [680, 820, 560, 940, 720].forEach((freq, idx) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                const t = now + (idx * 0.06);

                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(freq, t);
                osc.frequency.exponentialRampToValueAtTime(freq * 0.6, t + 0.08);

                gain.gain.setValueAtTime(this.masterVolume * 0.5, t);
                gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start(t);
                osc.stop(t + 0.08);
            });
        } catch (e) {}
    }

    playBlackHoleHum() {
        if (!this.enabled || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(65, now);
            osc.frequency.linearRampToValueAtTime(140, now + 2.5);
            osc.frequency.exponentialRampToValueAtTime(40, now + 5.0);

            gain.gain.setValueAtTime(0.01, now);
            gain.gain.linearRampToValueAtTime(this.masterVolume * 0.5, now + 0.5);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 5.0);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 5.0);
        } catch (e) {}
    }

    playMatrixSlowmo() {
        if (!this.enabled || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(400, now);
            osc.frequency.exponentialRampToValueAtTime(75, now + 1.2);

            gain.gain.setValueAtTime(this.masterVolume * 0.6, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 1.2);
        } catch (e) {}
    }

    playSwapZap() {
        if (!this.enabled || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'square';
            osc.frequency.setValueAtTime(880, now);
            osc.frequency.exponentialRampToValueAtTime(120, now + 0.25);

            gain.gain.setValueAtTime(this.masterVolume * 0.45, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.25);
        } catch (e) {}
    }

    playDrunkWobble() {
        if (!this.enabled || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            [300, 450, 260, 520].forEach((freq, idx) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                const t = now + (idx * 0.08);

                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, t);
                osc.frequency.linearRampToValueAtTime(freq * 1.3, t + 0.1);

                gain.gain.setValueAtTime(this.masterVolume * 0.4, t);
                gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start(t);
                osc.stop(t + 0.12);
            });
        } catch (e) {}
    }

    playTrollHorn() {
        if (!this.enabled || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            // Sad trombone / comical slide
            [220, 207, 196, 174].forEach((freq, idx) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                const t = now + (idx * 0.2);

                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(freq, t);
                osc.frequency.exponentialRampToValueAtTime(freq * 0.9, t + 0.22);

                gain.gain.setValueAtTime(this.masterVolume * 0.5, t);
                gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start(t);
                osc.stop(t + 0.22);
            });
        } catch (e) {}
    }

    playKingFanfare() {
        if (!this.enabled || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                const t = now + (idx * 0.07);

                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, t);

                gain.gain.setValueAtTime(this.masterVolume * 0.55, t);
                gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);

                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start(t);
                osc.stop(t + 0.4);
            });
        } catch (e) {}
    }

    playChickenCluckChorus() {
        if (!this.enabled || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            [440, 520, 480, 600, 390].forEach((freq, idx) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                const t = now + (idx * 0.09);

                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(freq, t);
                osc.frequency.exponentialRampToValueAtTime(freq * 1.5, t + 0.06);
                osc.frequency.exponentialRampToValueAtTime(freq * 0.8, t + 0.12);

                gain.gain.setValueAtTime(this.masterVolume * 0.55, t);
                gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start(t);
                osc.stop(t + 0.12);
            });
        } catch (e) {}
    }

    playBoxingPunch() {
        if (!this.enabled || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            // Heavy metallic spring whizz + blunt punch impact
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(160, now);
            osc.frequency.exponentialRampToValueAtTime(45, now + 0.2);

            gain.gain.setValueAtTime(this.masterVolume * 0.8, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.2);
        } catch (e) {}
    }

    playBananaSlip() {
        if (!this.enabled || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            // High whistling slide up then comical drop
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(320, now);
            osc.frequency.linearRampToValueAtTime(880, now + 0.12);
            osc.frequency.exponentialRampToValueAtTime(140, now + 0.32);

            gain.gain.setValueAtTime(this.masterVolume * 0.6, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.32);
        } catch (e) {}
    }

    playUfoTractorBeam() {
        if (!this.enabled || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            // Pulsing sci-fi theremin warble
            const osc = this.ctx.createOscillator();
            const lfo = this.ctx.createOscillator();
            const lfoGain = this.ctx.createGain();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(580, now);

            lfo.type = 'sine';
            lfo.frequency.setValueAtTime(14, now); // 14 Hz vibrato

            lfoGain.gain.setValueAtTime(60, now);
            lfo.connect(osc.frequency);

            gain.gain.setValueAtTime(this.masterVolume * 0.5, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            lfo.start(now);
            osc.stop(now + 1.2);
            lfo.stop(now + 1.2);
        } catch (e) {}
    }

    playInvertedWorldZap() {
        if (!this.enabled || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(750, now);
            osc.frequency.exponentialRampToValueAtTime(180, now + 0.28);

            gain.gain.setValueAtTime(this.masterVolume * 0.5, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.28);
        } catch (e) {}
    }

    playRubberbandSnap() {
        if (!this.enabled || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            // Tension pitch up, then sharp snap twang
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(120, now);
            osc.frequency.linearRampToValueAtTime(450, now + 0.08);
            osc.frequency.exponentialRampToValueAtTime(90, now + 0.25);

            gain.gain.setValueAtTime(this.masterVolume * 0.7, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.25);
        } catch (e) {}
    }
}

window.soundEngine = new SoundEngine();
