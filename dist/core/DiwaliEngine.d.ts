import { EngineOptions, DiyasOptions, RocketsOptions, ChakriOptions, AnarOptions, PhuljhadiOptions, LanternsOptions, FlowerShowerOptions, FestiveComboOptions, InteractiveClickOptions, LadiOptions, MouseRocketsOptions } from './types';
import { ToranOptions } from './effects/ToranRenderer';
import { LabradorOptions } from './effects/LabradorRenderer';
import { RangoliOptions } from './effects/RangoliRenderer';
export declare class DiwaliEngine {
    private canvasMgr;
    private pool;
    private sound;
    private mouse;
    private diyasRenderer;
    private hangingLanternsRenderer;
    private toranRenderer;
    private rangoliRenderer;
    private labradorRenderer;
    private rocketsRenderer;
    private chakriRenderer;
    private anarRenderer;
    private phuljhadiRenderer;
    private lanternsRenderer;
    private flowerShowerRenderer;
    private ladiRenderer;
    private animationFrameId;
    private isRunning;
    private isPaused;
    private interactiveClickMode;
    private lastFrameTime;
    constructor(options?: EngineOptions);
    private setupListeners;
    private handleInteractiveClick;
    setSoundEnabled(enabled: boolean): void;
    setSoundVolume(volume: number): void;
    /**
     * 🪔 Diyas (Deepak): Floating or bottom-docked clay lamps with organic flame flickering & warm ambient glow
     */
    diyas(options?: DiyasOptions): () => void;
    /**
     * 🏮 Hanging Lanterns: Suspended from the top of the screen with pendulum sway
     * and intelligent mouse-proximity transparency (fades smoothly when mouse comes near!).
     */
    hangingLanterns(count?: number): () => void;
    /**
     * 🌺 Subtle Marigold Toran: Traditional flower garland, fairy lights, and hanging brass lamps
     * across the top edge with intelligent mouse-proximity transparency!
     */
    toran(options?: ToranOptions): () => void;
    /**
     * 💥 BLAST AT: Direct rocket launch detonating precisely where clicked!
     */
    blastAt(x: number, y: number): void;
    /**
     * 🖱️ Fireworks-JS Mouse Following: Toggle continuous mouse-following rockets
     */
    setMouseFollow(enabled: boolean): void;
    /**
     * ⛲ Occasional Anar Fountain: Spawns a sparkling flowerpot fountain in the bottom corner
     */
    startOccasionalAnar(intervalMs?: number): () => void;
    /**
     * 🌸 Traditional Diwali Rangoli: Intricate geometric floral floor art in bottom corner with central glowing diya
     */
    rangoli(options?: RangoliOptions): () => void;
    /**
     * 🐕 Labrador Dog: Realistic Golden Labrador (Julie) eating festive treats in the bottom-left corner
     */
    labrador(options?: number | LabradorOptions): () => void;
    /**
     * Update mouse cursor coordinates (useful for global OS cursor tracking in desktop overlays)
     */
    updateMousePosition(x: number, y: number): void;
    /**
     * 🚀 Enable fireworks-js style cursor-following rockets!
     * Rockets launch from the bottom, curve and track your moving cursor,
     * and detonate into vibrant bursts right where your mouse is pointing.
     */
    enableMouseRockets(options?: MouseRocketsOptions): () => void;
    /**
     * 🚀 Rockets (Aatishbazi): Upward launching whistling trail bursting into colorful sparkle clusters
     */
    rockets(options?: RocketsOptions): () => void;
    /**
     * 🚀 Start continuous ambient rocket launches randomly from the bottom of the screen into the night sky
     */
    startRocketShow(intervalMs?: number): () => void;
    /**
     * 🌀 Chakri (Ground Spinner): Spinning circular wheel shooting centrifugal golden & colorful sparks
     */
    chakri(options?: ChakriOptions): () => void;
    /**
     * 🌀 Enable spinning Chakkar (fire wheel) that follows the user's cursor / touch point
     */
    enableMouseChakkar(options?: ChakriOptions): () => void;
    /**
     * 🏺 Anar (Flowerpot Fountain): High-reaching vertical fountain of sparkling golden embers
     */
    anar(options?: AnarOptions): () => void;
    /**
     * ✨ Phuljhadi (Sparkler): Crackling golden/silver sparks with micro-bursts and smoke trail
     */
    phuljhadi(options?: PhuljhadiOptions): () => void;
    /**
     * ✨ Enable cursor-following sparkler
     */
    enableMouseSparkler(options?: PhuljhadiOptions): () => void;
    /**
     * 🏮 Akash Kandil / Lanterns: Warm paper lanterns drifting upward with subtle wind sway
     */
    lanterns(options?: LanternsOptions): () => void;
    /**
     * 🌸 Flower Shower (Phoolon ki Barish): Marigold (genda phool) and rose petals fluttering softly
     */
    flowerShower(options?: FlowerShowerOptions): () => void;
    /**
     * 💥 Ladi (Firecracker String): Rapid sequential popping firecracker string with flashes and smoke
     */
    ladi(options?: LadiOptions): () => void;
    /**
     * 💥 Festive Combo / Ladi: Curated grand show combining all Diwali animations
     */
    celebrate(options?: FestiveComboOptions): () => void;
    /**
     * Enable Click/Tap to spawn festive crackers
     */
    enableClickToSpawn(mode?: InteractiveClickOptions['effect']): () => void;
    private startLoop;
    clear(): void;
    destroy(): void;
}
