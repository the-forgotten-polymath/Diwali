/**
 * Authentic Procedural Web Audio API sound synthesizer for Diwali effects.
 * Synthesizes realistic acoustic sounds for rockets, explosions, anar fountains,
 * spinning chakri, sparkler sizzles, and firecracker ladi—with zero external audio files.
 */
export class SoundManager {
  private ctx: AudioContext | null = null;
  private enabled = false;
  private volume = 0.35;
  private masterGain: GainNode | null = null;
  private compressor: DynamicsCompressorNode | null = null;

  constructor(enabled = false, volume = 0.35) {
    this.enabled = enabled;
    this.volume = Math.max(0, Math.min(1, volume));
  }

  private initContext(): void {
    if (this.ctx) return;
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();

      // Master compressor to prevent clipping and give rich acoustic punch
      this.compressor = this.ctx.createDynamicsCompressor();
      this.compressor.threshold.setValueAtTime(-18, this.ctx.currentTime);
      this.compressor.knee.setValueAtTime(12, this.ctx.currentTime);
      this.compressor.ratio.setValueAtTime(8, this.ctx.currentTime);
      this.compressor.attack.setValueAtTime(0.003, this.ctx.currentTime);
      this.compressor.release.setValueAtTime(0.25, this.ctx.currentTime);

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);

      this.masterGain.connect(this.compressor);
      this.compressor.connect(this.ctx.destination);
    } catch {
      // Audio not supported or blocked
    }
  }

  public setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    if (enabled && !this.ctx) {
      this.initContext();
    }
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public setVolume(vol: number): void {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
  }

  private resumeIfSuspended(): void {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  /**
   * 🚀 Rocket Launch: High-pitched whistling ascent + fiery exhaust air rush
   */
  public playRocketWhistle(duration = 0.9): void {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    this.resumeIfSuspended();

    const t = this.ctx.currentTime;

    // 1. Ascending whistle tone
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(380, t);
    osc.frequency.exponentialRampToValueAtTime(1800, t + duration);

    oscGain.gain.setValueAtTime(0.001, t);
    oscGain.gain.linearRampToValueAtTime(0.18, t + 0.1);
    oscGain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    osc.connect(oscGain);
    oscGain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + duration);

    // 2. Fiery thrust noise
    const noise = this.createFilteredNoise(duration, 800, 2.0);
    if (noise) {
      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.08, t);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, t + duration);
      noise.output.connect(noiseGain);
      noiseGain.connect(this.masterGain);
      noise.source.start(t);
      noise.source.stop(t + duration);
    }
  }

  /**
   * 💥 Firework Explosion: Deep sub-bass boom + shockwave transient + crackle tail
   */
  public playExplosion(): void {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    this.resumeIfSuspended();

    const t = this.ctx.currentTime;

    // 1. Sub-bass boom thump (130Hz -> 28Hz)
    const boom = this.ctx.createOscillator();
    const boomGain = this.ctx.createGain();
    boom.type = 'triangle';
    boom.frequency.setValueAtTime(140, t);
    boom.frequency.exponentialRampToValueAtTime(28, t + 0.45);

    boomGain.gain.setValueAtTime(0.65, t);
    boomGain.gain.exponentialRampToValueAtTime(0.001, t + 0.55);

    boom.connect(boomGain);
    boomGain.connect(this.masterGain);
    boom.start(t);
    boom.stop(t + 0.6);

    // 2. Shockwave punch
    const punch = this.createFilteredNoise(0.12, 450, 1.0);
    if (punch) {
      const punchGain = this.ctx.createGain();
      punchGain.gain.setValueAtTime(0.4, t);
      punchGain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
      punch.output.connect(punchGain);
      punchGain.connect(this.masterGain);
      punch.source.start(t);
      punch.source.stop(t + 0.13);
    }

    // 3. Crackling sparkle debris (kamuro willow pops)
    const crackleCount = 5 + Math.floor(Math.random() * 5);
    for (let i = 0; i < crackleCount; i++) {
      const delay = 0.12 + Math.random() * 0.35;
      setTimeout(() => {
        this.playMicroSnap(0.08, 0.12);
      }, delay * 1000);
    }
  }

  /**
   * ✨ Phuljhadi (Handheld Sparkler): Sizzling metallic hiss and crackling snaps
   */
  public playSparklerCrackle(): void {
    if (!this.enabled || Math.random() > 0.45) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    this.resumeIfSuspended();

    this.playMicroSnap(0.03 + Math.random() * 0.04, 0.09);
  }

  /**
   * 🌀 Chakri (Ground Spinner): Whirring, fluttering Doppler spin + continuous friction sizzle
   */
  public playChakriWhir(duration = 4.2): void {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    this.resumeIfSuspended();

    const t = this.ctx.currentTime;

    // 1. Whirring Doppler tone (accelerates then slows)
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(200, t);
    osc.frequency.linearRampToValueAtTime(480, t + 1.2);
    osc.frequency.linearRampToValueAtTime(160, t + duration);

    // Tremolo modulation (fluttering spin effect)
    const tremolo = this.ctx.createOscillator();
    const tremoloGain = this.ctx.createGain();
    tremolo.type = 'sine';
    tremolo.frequency.setValueAtTime(18, t);
    tremolo.frequency.linearRampToValueAtTime(28, t + 1.5);
    tremolo.frequency.linearRampToValueAtTime(8, t + duration);
    tremoloGain.gain.setValueAtTime(0.05, t);

    tremolo.connect(tremoloGain.gain);
    osc.connect(oscGain);
    oscGain.connect(this.masterGain);

    oscGain.gain.setValueAtTime(0.01, t);
    oscGain.gain.linearRampToValueAtTime(0.12, t + 0.3);
    oscGain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    osc.start(t);
    tremolo.start(t);
    osc.stop(t + duration);
    tremolo.stop(t + duration);

    // 2. Friction sizzle noise
    this.playNoiseCrackle(duration, 0.12, 2200);
  }

  /**
   * 🏺 Anar (Flowerpot Fountain): Roaring volcanic jet with continuous crackling embers
   */
  public playAnarFountain(duration = 4.8): void {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    this.resumeIfSuspended();

    // Sizzling roaring noise
    this.playNoiseCrackle(duration, 0.22, 1800);

    // Intermittent loud crackle bursts as sparks spew out
    const burstCount = Math.floor(duration * 4);
    for (let i = 0; i < burstCount; i++) {
      const delay = Math.random() * duration;
      setTimeout(() => {
        if (this.enabled) {
          this.playMicroSnap(0.04, 0.14);
        }
      }, delay * 1000);
    }
  }

  /**
   * 💥 Ladi (Firecracker String): Crisp, sharp, rapid pistol-like firecracker report
   */
  public playLadiPop(): void {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    this.resumeIfSuspended();

    const t = this.ctx.currentTime;

    // 1. Sharp pop transient
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    const baseFreq = 180 + Math.random() * 80;
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(baseFreq, t);
    osc.frequency.exponentialRampToValueAtTime(40, t + 0.08);

    oscGain.gain.setValueAtTime(0.45, t);
    oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

    osc.connect(oscGain);
    oscGain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.09);

    // 2. High-frequency paper snap crackle
    this.playMicroSnap(0.035, 0.35);
  }

  private playMicroSnap(duration: number, volume: number): void {
    if (!this.ctx || !this.masterGain) return;
    const t = this.ctx.currentTime;
    const noise = this.createFilteredNoise(duration, 2500 + Math.random() * 1500, 2.5);
    if (!noise) return;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(volume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    noise.output.connect(gain);
    gain.connect(this.masterGain);

    noise.source.start(t);
    noise.source.stop(t + duration);
  }

  private playNoiseCrackle(duration: number, volume: number, centerFreq = 1400): void {
    if (!this.ctx || !this.masterGain) return;
    const t = this.ctx.currentTime;
    const noise = this.createFilteredNoise(duration, centerFreq, 1.8);
    if (!noise) return;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.01, t);
    gain.gain.linearRampToValueAtTime(volume, t + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    noise.output.connect(gain);
    gain.connect(this.masterGain);

    noise.source.start(t);
    noise.source.stop(t + duration);
  }

  private createFilteredNoise(
    duration: number,
    freq: number,
    q: number
  ): { source: AudioBufferSourceNode; output: AudioNode } | null {
    if (!this.ctx) return null;
    const bufferSize = Math.floor(this.ctx.sampleRate * Math.min(duration, 5));
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(freq, this.ctx.currentTime);
    filter.Q.setValueAtTime(q, this.ctx.currentTime);

    whiteNoise.connect(filter);
    return { source: whiteNoise, output: filter };
  }
}
