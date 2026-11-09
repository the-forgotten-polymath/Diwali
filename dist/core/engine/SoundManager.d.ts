/**
 * Authentic Procedural Web Audio API sound synthesizer for Diwali effects.
 * Synthesizes realistic acoustic sounds for rockets, explosions, anar fountains,
 * spinning chakri, sparkler sizzles, and firecracker ladi—with zero external audio files.
 */
export declare class SoundManager {
    private ctx;
    private enabled;
    private volume;
    private masterGain;
    private compressor;
    constructor(enabled?: boolean, volume?: number);
    private initContext;
    setEnabled(enabled: boolean): void;
    isEnabled(): boolean;
    setVolume(vol: number): void;
    private resumeIfSuspended;
    /**
     * 🚀 Rocket Launch: High-pitched whistling ascent + fiery exhaust air rush
     */
    playRocketWhistle(duration?: number): void;
    /**
     * 💥 Firework Explosion: Deep sub-bass boom + shockwave transient + crackle tail
     */
    playExplosion(): void;
    /**
     * ✨ Phuljhadi (Handheld Sparkler): Sizzling metallic hiss and crackling snaps
     */
    playSparklerCrackle(): void;
    /**
     * 🌀 Chakri (Ground Spinner): Whirring, fluttering Doppler spin + continuous friction sizzle
     */
    playChakriWhir(duration?: number): void;
    /**
     * 🏺 Anar (Flowerpot Fountain): Roaring volcanic jet with continuous crackling embers
     */
    playAnarFountain(duration?: number): void;
    /**
     * 💥 Ladi (Firecracker String): Crisp, sharp, rapid pistol-like firecracker report
     */
    playLadiPop(): void;
    private playMicroSnap;
    private playNoiseCrackle;
    private createFilteredNoise;
}
