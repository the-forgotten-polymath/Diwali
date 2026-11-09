export type Intensity = 'low' | 'medium' | 'high';

export interface BaseEffectOptions {
  /** Target canvas element or container to render in. If omitted, uses a global overlay canvas. */
  container?: HTMLElement | null;
  /** Custom canvas element to render into directly */
  canvas?: HTMLCanvasElement | null;
  /** Z-index for the auto-created overlay canvas (default: 9999) */
  zIndex?: number;
  /** Enable procedural festive audio synthesis (default: false) */
  sound?: boolean;
  /** Sound master volume between 0.0 and 1.0 (default: 0.3) */
  volume?: number;
  /** Disable animations when user has `prefers-reduced-motion` enabled (default: true) */
  reducedMotion?: boolean;
  /** Overall speed multiplier (default: 1) */
  speed?: number;
  /** Overall size scale multiplier (default: 1) */
  scale?: number;
  /** Target frame rate for smooth animation (default: 50) */
  fps?: number;
}

export interface EngineOptions extends BaseEffectOptions {
  /** Custom device pixel ratio (default: auto, capped at 1.5) */
  dpr?: number;
}

export interface DiyasOptions extends BaseEffectOptions {
  /** Number of diyas to display (default: 5) */
  count?: number;
  /** Placement mode: 'docked' (bottom edge), 'floating' (drifting water surface), or 'custom' */
  mode?: 'docked' | 'floating' | 'custom';
  /** Custom positions when mode is 'custom' */
  positions?: Array<{ x: number; y: number }>;
  /** Flame flicker intensity speed multiplier (default: 1) */
  flickerSpeed?: number;
  /** Ambient light bloom radius around the lamp (default: 1) */
  glowIntensity?: number;
  /** Show subtle smoke wisps rising from the flame (default: true) */
  smoke?: boolean;
  /** Clear diyas from the bottom-left and bottom-right corners (boolean or number of corner slots to clear, default: 1 when true) */
  clearCorners?: boolean | number;
}

export interface RocketsOptions extends BaseEffectOptions {
  /** Number of rockets in the salvo (default: 4) */
  count?: number;
  /** Rocket launch origin X coordinates (0..1 as percent of width or pixel numbers) */
  origins?: number[];
  /** Burst color palette (array of hex, rgb, or hsl strings) */
  colors?: string[];
  /** Spark count per rocket explosion (default: 80) */
  burstParticles?: number;
  /** Spread velocity multiplier (default: 1) */
  spread?: number;
  /** Gravity pulling down exploded embers (default: 0.08) */
  gravity?: number;
}

export interface ChakriOptions extends BaseEffectOptions {
  /** Center X coordinate in pixels (default: center of screen) */
  x?: number;
  /** Center Y coordinate in pixels (default: near bottom floor) */
  y?: number;
  /** Duration of spin in milliseconds before extinguishing (default: 4500, 0 for continuous) */
  duration?: number;
  /** Base radius of the spinning wheel (default: 16) */
  radius?: number;
  /** Spark emission rate / density multiplier (default: 1) */
  sparkDensity?: number;
  /** Spark colors (golden, emerald, ruby mix) */
  colors?: string[];
  /** Whether the spinning chakri follows the mouse cursor (default: false) */
  followMouse?: boolean;
}

export interface AnarOptions extends BaseEffectOptions {
  /** Base X coordinate in pixels (default: center) */
  x?: number;
  /** Base Y coordinate in pixels (default: bottom floor) */
  y?: number;
  /** Maximum fountain height in pixels (default: 320) */
  height?: number;
  /** Fountain spread width in pixels (default: 160) */
  spread?: number;
  /** Duration of fountain spray in milliseconds (default: 5000) */
  duration?: number;
  /** Spark colors */
  colors?: string[];
}

export interface PhuljhadiOptions extends BaseEffectOptions {
  /** Whether the sparkler tip follows the user's cursor / touch point (default: false) */
  followMouse?: boolean;
  /** Tip X coordinate in pixels (when not following mouse) */
  x?: number;
  /** Tip Y coordinate in pixels (when not following mouse) */
  y?: number;
  /** Sparkler wire length in pixels (default: 120) */
  wireLength?: number;
  /** Duration of burn in milliseconds (default: 8000, 0 for infinite) */
  duration?: number;
  /** Colors of the sparks (default: radiant gold & silver) */
  colors?: string[];
}

export interface LanternsOptions extends BaseEffectOptions {
  /** Number of active sky lanterns (default: 8) */
  count?: number;
  /** Ascending speed multiplier (default: 1) */
  speed?: number;
  /** Horizontal sway amplitude (default: 1.5) */
  sway?: number;
  /** Base size of lanterns in pixels (default: 36) */
  size?: number;
  /** Warm glow intensity (default: 1) */
  glow?: number;
  /** Continuous ambient spawning (default: true) */
  continuous?: boolean;
  /** Positioning mode: 'sky' (focus in upper half) or 'full' (default: 'sky') */
  position?: 'sky' | 'full';
}

export interface FlowerShowerOptions extends BaseEffectOptions {
  /** Total falling flower petals (default: 60) */
  count?: number;
  /** Petal types: 'marigold' (genda phool), 'rose' (gulab), or 'mix' */
  petalType?: 'marigold' | 'rose' | 'mix';
  /** Gentle wind drift direction / velocity (-1 to 1, default: 0.2) */
  wind?: number;
  /** Duration in milliseconds (default: 6000, 0 for continuous) */
  duration?: number;
}

export interface LadiOptions extends BaseEffectOptions {
  /** Top X coordinate of the hanging ladi (default: center) */
  x?: number;
  /** Top Y coordinate of the hanging ladi (default: 50) */
  y?: number;
  /** Number of firecrackers on the string (default: 40) */
  crackerCount?: number;
  /** Length of the string in pixels (default: 260) */
  length?: number;
}

export interface FestiveComboOptions extends BaseEffectOptions {
  /** Whether to render bottom diyas throughout the celebration (default: true) */
  diyas?: boolean;
  /** Number of sky rockets to launch periodically (default: 12) */
  rocketCount?: number;
  /** Number of sky lanterns floating in the distance (default: 6) */
  lanternCount?: number;
  /** Include ground chakri and anar on the sides (default: true) */
  groundCrackers?: boolean;
  /** Falling marigold flower shower (default: true) */
  flowerShower?: boolean;
  /** Total duration in milliseconds (default: 12000, 0 for infinite) */
  duration?: number;
}

export interface InteractiveClickOptions {
  /** Action on user click/tap: 'rocket' | 'chakri' | 'anar' | 'phuljhadi' | 'random' | 'none' */
  effect?: 'rocket' | 'chakri' | 'anar' | 'phuljhadi' | 'random' | 'none';
  /** Sound enabled for interactive clicks (default: true) */
  sound?: boolean;
}

export interface MouseRocketsOptions {
  /** Interval in milliseconds between rockets launching towards the cursor (default: 380) */
  interval?: number;
  /** Whether rockets dynamically steer/home in towards the moving cursor in flight (default: true) */
  homing?: boolean;
  /** Sound enabled for cursor rockets (default: true) */
  sound?: boolean;
}

export interface Particle {
  id: number;
  type: 'spark' | 'ember' | 'trail' | 'petal' | 'smoke' | 'star' | 'lantern';
  x: number;
  y: number;
  prevX: number;
  prevY: number;
  vx: number;
  vy: number;
  ax: number;
  ay: number;
  size: number;
  initialSize: number;
  color: string;
  secondaryColor?: string;
  alpha: number;
  life: number;
  maxLife: number;
  rotation: number;
  rotationSpeed: number;
  scaleX: number;
  scaleY: number;
  drag: number;
  active: boolean;
  customData?: Record<string, unknown>;
}

export type CleanupFunction = () => void;

