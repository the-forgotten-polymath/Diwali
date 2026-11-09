import { DiwaliEngine } from './core/DiwaliEngine';
import { DiyasOptions, RocketsOptions, ChakriOptions, AnarOptions, PhuljhadiOptions, LanternsOptions, FlowerShowerOptions, FestiveComboOptions, InteractiveClickOptions, LadiOptions, MouseRocketsOptions } from './core/types';
export * from './core/types';
export { DiwaliEngine } from './core/DiwaliEngine';
export { HangingLanternsRenderer } from './core/effects/HangingLanternsRenderer';
export { ToranRenderer } from './core/effects/ToranRenderer';
export type { ToranOptions } from './core/effects/ToranRenderer';
export { LabradorRenderer } from './core/effects/LabradorRenderer';
export type { LabradorOptions } from './core/effects/LabradorRenderer';
export { RangoliRenderer } from './core/effects/RangoliRenderer';
export type { RangoliOptions } from './core/effects/RangoliRenderer';
/**
 * 🪔 Diyas (Deepak) - Floating or bottom-docked clay lamps with organic flame flickering & warm ambient glow
 */
export declare function diyas(options?: DiyasOptions): () => void;
/**
 * 🚀 Rockets (Aatishbazi) - Upward launching whistling trail bursting into colorful sparkle clusters
 */
export declare function rockets(options?: RocketsOptions): () => void;
/**
 * 🚀 Continuously and automatically launch rockets randomly from the bottom of the screen into the sky!
 */
export declare function startRocketShow(intervalMs?: number): () => void;
/**
 * 🚀 Enable fireworks-js style cursor-following rockets!
 * Rockets launch from the ground, track your moving cursor, and explode at pointer location.
 */
export declare function enableMouseRockets(options?: MouseRocketsOptions): () => void;
/**
 * 🌀 Chakri (Ground Spinner) - Spinning circular wheel shooting centrifugal golden & colorful sparks
 */
export declare function chakri(options?: ChakriOptions): () => void;
/**
 * 🏺 Anar (Flowerpot Fountain) - High-reaching vertical fountain of sparkling golden embers
 */
export declare function anar(options?: AnarOptions): () => void;
/**
 * ✨ Phuljhadi (Sparkler) - Crackling golden/silver sparks with micro-bursts and smoke trail
 */
export declare function phuljhadi(options?: PhuljhadiOptions): () => void;
/**
 * 🌀 Enable spinning Chakkar (fire wheel) that follows the user's cursor / touch point
 */
export declare function enableMouseChakkar(options?: ChakriOptions): () => void;
/**
 * ✨ Enable cursor-following sparkler
 */
export declare function enableMouseSparkler(options?: PhuljhadiOptions): () => void;
/**
 * 🏮 Akash Kandil / Lanterns - Warm paper lanterns drifting upward with subtle wind sway
 */
export declare function lanterns(options?: LanternsOptions): () => void;
/**
 * 🏮 Hanging Lanterns - Suspended from the top of the screen with pendulum sway
 * and intelligent mouse-proximity transparency!
 */
export declare function hangingLanterns(count?: number): () => void;
/**
 * 🐕 Labrador Dog (Julie) - Photorealistic Labrador eating festive treats in bottom-left corner with wagging tail
 */
export declare function labrador(options?: number | import('./core/effects/LabradorRenderer').LabradorOptions): () => void;
/**
 * 🌺 Subtle Marigold Toran - Flower garland, fairy lights, and hanging brass lamps across the top
 */
export declare function toran(options?: import('./core/effects/ToranRenderer').ToranOptions): () => void;
/**
 * 💥 Blast Rocket At Target - Fires a rocket directly to (x, y) coordinates
 */
export declare function blastAt(x: number, y: number): void;
/**
 * 🖱️ Fireworks-JS Mouse Following - Enable/disable rockets chasing mouse
 */
export declare function setMouseFollow(enabled: boolean): void;
/**
 * ⛲ Occasional Anar Fountain - Spawns intermittent festive fountain in bottom corner
 */
export declare function startOccasionalAnar(intervalMs?: number): () => void;
/**
 * 🌸 Traditional Diwali Rangoli - Colorful floral geometric mandala floor art
 */
export declare function rangoli(options?: import('./core/effects/RangoliRenderer').RangoliOptions): () => void;
/**
 * 🌸 Flower Shower (Phoolon ki Barish) - Marigold (genda phool) and rose petals fluttering softly
 */
export declare function flowerShower(options?: FlowerShowerOptions): () => void;
/**
 * 💥 Ladi (Firecracker String) - Rapid sequential popping firecracker string
 */
export declare function ladi(options?: LadiOptions): () => void;
/**
 * 💥 Festive Combo / Ladi - Curated grand celebration trigger
 */
export declare function celebrate(options?: FestiveComboOptions): () => void;
/**
 * Enable Click-to-Spawn interaction
 */
export declare function enableClickToSpawn(mode?: InteractiveClickOptions['effect']): () => void;
/**
 * Master cleanup / reset
 */
export declare function stopAll(): void;
declare const _default: {
    DiwaliEngine: typeof DiwaliEngine;
    diyas: typeof diyas;
    rockets: typeof rockets;
    startRocketShow: typeof startRocketShow;
    chakri: typeof chakri;
    anar: typeof anar;
    phuljhadi: typeof phuljhadi;
    ladi: typeof ladi;
    hangingLanterns: typeof hangingLanterns;
    labrador: typeof labrador;
    lanterns: typeof lanterns;
    flowerShower: typeof flowerShower;
    celebrate: typeof celebrate;
    enableMouseRockets: typeof enableMouseRockets;
    enableMouseSparkler: typeof enableMouseSparkler;
    enableMouseChakkar: typeof enableMouseChakkar;
    enableClickToSpawn: typeof enableClickToSpawn;
    stopAll: typeof stopAll;
};
export default _default;
