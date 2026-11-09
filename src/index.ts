import { DiwaliEngine } from './core/DiwaliEngine';
import {
  DiyasOptions,
  RocketsOptions,
  ChakriOptions,
  AnarOptions,
  PhuljhadiOptions,
  LanternsOptions,
  FlowerShowerOptions,
  FestiveComboOptions,
  InteractiveClickOptions,
  LadiOptions,
  MouseRocketsOptions,
} from './core/types';

export * from './core/types';
export { DiwaliEngine } from './core/DiwaliEngine';
export { HangingLanternsRenderer } from './core/effects/HangingLanternsRenderer';
export { ToranRenderer } from './core/effects/ToranRenderer';
export type { ToranOptions } from './core/effects/ToranRenderer';
export { LabradorRenderer } from './core/effects/LabradorRenderer';
export type { LabradorOptions } from './core/effects/LabradorRenderer';
export { RangoliRenderer } from './core/effects/RangoliRenderer';
export type { RangoliOptions } from './core/effects/RangoliRenderer';

let globalEngine: DiwaliEngine | null = null;

function getGlobalEngine(): DiwaliEngine {
  if (!globalEngine) {
    globalEngine = new DiwaliEngine();
  }
  return globalEngine;
}

/**
 * 🪔 Diyas (Deepak) - Floating or bottom-docked clay lamps with organic flame flickering & warm ambient glow
 */
export function diyas(options?: DiyasOptions): () => void {
  return getGlobalEngine().diyas(options);
}

/**
 * 🚀 Rockets (Aatishbazi) - Upward launching whistling trail bursting into colorful sparkle clusters
 */
export function rockets(options?: RocketsOptions): () => void {
  return getGlobalEngine().rockets(options);
}

/**
 * 🚀 Continuously and automatically launch rockets randomly from the bottom of the screen into the sky!
 */
export function startRocketShow(intervalMs = 850): () => void {
  return getGlobalEngine().startRocketShow(intervalMs);
}

/**
 * 🚀 Enable fireworks-js style cursor-following rockets!
 * Rockets launch from the ground, track your moving cursor, and explode at pointer location.
 */
export function enableMouseRockets(options?: MouseRocketsOptions): () => void {
  return getGlobalEngine().enableMouseRockets(options);
}

/**
 * 🌀 Chakri (Ground Spinner) - Spinning circular wheel shooting centrifugal golden & colorful sparks
 */
export function chakri(options?: ChakriOptions): () => void {
  return getGlobalEngine().chakri(options);
}

/**
 * 🏺 Anar (Flowerpot Fountain) - High-reaching vertical fountain of sparkling golden embers
 */
export function anar(options?: AnarOptions): () => void {
  return getGlobalEngine().anar(options);
}

/**
 * ✨ Phuljhadi (Sparkler) - Crackling golden/silver sparks with micro-bursts and smoke trail
 */
export function phuljhadi(options?: PhuljhadiOptions): () => void {
  return getGlobalEngine().phuljhadi(options);
}

/**
 * 🌀 Enable spinning Chakkar (fire wheel) that follows the user's cursor / touch point
 */
export function enableMouseChakkar(options?: ChakriOptions): () => void {
  return getGlobalEngine().enableMouseChakkar(options);
}

/**
 * ✨ Enable cursor-following sparkler
 */
export function enableMouseSparkler(options?: PhuljhadiOptions): () => void {
  return getGlobalEngine().enableMouseSparkler(options);
}

/**
 * 🏮 Akash Kandil / Lanterns - Warm paper lanterns drifting upward with subtle wind sway
 */
export function lanterns(options?: LanternsOptions): () => void {
  return getGlobalEngine().lanterns(options);
}

/**
 * 🏮 Hanging Lanterns - Suspended from the top of the screen with pendulum sway
 * and intelligent mouse-proximity transparency!
 */
export function hangingLanterns(count = 9): () => void {
  return getGlobalEngine().hangingLanterns(count);
}

/**
 * 🐕 Labrador Dog (Julie) - Photorealistic Labrador eating festive treats in bottom-left corner with wagging tail
 */
export function labrador(options?: number | import('./core/effects/LabradorRenderer').LabradorOptions): () => void {
  return getGlobalEngine().labrador(options);
}

/**
 * 🌺 Subtle Marigold Toran - Flower garland, fairy lights, and hanging brass lamps across the top
 */
export function toran(options?: import('./core/effects/ToranRenderer').ToranOptions): () => void {
  return getGlobalEngine().toran(options);
}

/**
 * 💥 Blast Rocket At Target - Fires a rocket directly to (x, y) coordinates
 */
export function blastAt(x: number, y: number): void {
  getGlobalEngine().blastAt(x, y);
}

/**
 * 🖱️ Fireworks-JS Mouse Following - Enable/disable rockets chasing mouse
 */
export function setMouseFollow(enabled: boolean): void {
  getGlobalEngine().setMouseFollow(enabled);
}

/**
 * ⛲ Occasional Anar Fountain - Spawns intermittent festive fountain in bottom corner
 */
export function startOccasionalAnar(intervalMs = 18000): () => void {
  return getGlobalEngine().startOccasionalAnar(intervalMs);
}

/**
 * 🌸 Traditional Diwali Rangoli - Colorful floral geometric mandala floor art
 */
export function rangoli(options?: import('./core/effects/RangoliRenderer').RangoliOptions): () => void {
  return getGlobalEngine().rangoli(options);
}

/**
 * 🌸 Flower Shower (Phoolon ki Barish) - Marigold (genda phool) and rose petals fluttering softly
 */
export function flowerShower(options?: FlowerShowerOptions): () => void {
  return getGlobalEngine().flowerShower(options);
}

/**
 * 💥 Ladi (Firecracker String) - Rapid sequential popping firecracker string
 */
export function ladi(options?: LadiOptions): () => void {
  return getGlobalEngine().ladi(options);
}

/**
 * 💥 Festive Combo / Ladi - Curated grand celebration trigger
 */
export function celebrate(options?: FestiveComboOptions): () => void {
  return getGlobalEngine().celebrate(options);
}

/**
 * Enable Click-to-Spawn interaction
 */
export function enableClickToSpawn(mode: InteractiveClickOptions['effect'] = 'random'): () => void {
  return getGlobalEngine().enableClickToSpawn(mode);
}

/**
 * Master cleanup / reset
 */
export function stopAll(): void {
  if (globalEngine) {
    globalEngine.destroy();
    globalEngine = null;
  }
}

export default {
  DiwaliEngine,
  diyas,
  rockets,
  startRocketShow,
  chakri,
  anar,
  phuljhadi,
  ladi,
  hangingLanterns,
  labrador,
  lanterns,
  flowerShower,
  celebrate,
  enableMouseRockets,
  enableMouseSparkler,
  enableMouseChakkar,
  enableClickToSpawn,
  stopAll,
};
