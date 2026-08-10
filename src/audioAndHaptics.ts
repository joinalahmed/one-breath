// Web Audio API and Web Vibration API helper for One Breath

class AudioAndHapticsController {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private heartbeatOsc: OscillatorNode | null = null;
  private heartbeatGain: GainNode | null = null;
  private lastHeartbeatTime: number = 0;

  constructor() {
    // Lazily initialized on first touch
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public enableAudio() {
    this.initCtx();
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // Haptic feedback using navigator.vibrate
  public triggerHaptic(type: 'grab' | 'empty' | 'lowAir' | 'shark' | 'basketLost' | 'stoneCut') {
    if (typeof navigator === 'undefined' || !navigator.vibrate) return;

    try {
      switch (type) {
        case 'grab':
          navigator.vibrate(30); // Single light tick
          break;
        case 'empty':
          navigator.vibrate([15, 20, 15]); // Single dull tick
          break;
        case 'lowAir':
          navigator.vibrate(25); // Slow pulse
          break;
        case 'shark':
          navigator.vibrate([50, 40, 50]); // Sharp double tap
          break;
        case 'basketLost':
          navigator.vibrate(200); // Long buzz
          break;
        case 'stoneCut':
          navigator.vibrate([20, 30, 40]);
          break;
      }
    } catch {
      // Ignore vibration permissions errors
    }
  }

  // Play heart rate sound based on air remaining
  public updateHeartbeat(airPct: number) {
    if (this.isMuted || airPct > 0.4) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // Air 0.4 -> beat every 1.2s, Air 0.0 -> beat every 0.3s
    const interval = 0.3 + (airPct / 0.4) * 0.9;

    if (now - this.lastHeartbeatTime >= interval) {
      this.lastHeartbeatTime = now;
      this.playThump(60, 0.1, 0.15); // Deep thud
      this.triggerHaptic('lowAir');
    }
  }

  private playThump(freq: number, duration: number, volume: number) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + duration);

      gain.gain.setValueAtTime(volume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Audio fallback silent
    }
  }

  public playGrabConfirm(isFilled: boolean) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = isFilled ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(isFilled ? 587.33 : 220, this.ctx.currentTime); // D5 or A3
      if (isFilled) {
        osc.frequency.setValueAtTime(880, this.ctx.currentTime + 0.05); // A5 chime
      }

      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.15);
    } catch {}

    this.triggerHaptic(isFilled ? 'grab' : 'empty');
  }

  public playSharkSting() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      // Minor dissonance chord
      [130.81, 138.59, 164.81].forEach((freq) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sawtooth';
        osc.frequency.value = freq;

        gain.gain.setValueAtTime(0.25, this.ctx!.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start();
        osc.stop(this.ctx!.currentTime + 0.4);
      });
    } catch {}

    this.triggerHaptic('shark');
  }

  public playStoneCut() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(400, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.1);

      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.15);
    } catch {}

    this.triggerHaptic('stoneCut');
  }

  public playSurfacingSplash() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      // Noise buffer for splash sound
      const bufferSize = this.ctx.sampleRate * 0.3;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 1000;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start();
    } catch {}
  }

  public playLevelUp() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'triangle';
        osc.frequency.value = freq;

        gain.gain.setValueAtTime(0.2, now + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.3);
      });
    } catch {}
  }

  public playConfirm() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.setValueAtTime(880, now + 0.06);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.15);
    } catch {}
  }

  public playCoinPickup() {
    this.playConfirm();
  }

  public playSharkAttack() {
    this.playSharkSting();
  }
}

export const soundManager = new AudioAndHapticsController();
