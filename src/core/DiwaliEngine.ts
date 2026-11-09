import {
  EngineOptions,
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
} from './types';
import { ParticlePool } from './engine/ParticlePool';
import { CanvasManager } from './engine/CanvasManager';
import { SoundManager } from './engine/SoundManager';
import { MouseTracker } from './engine/MouseTracker';

import { DiyasRenderer } from './effects/DiyasRenderer';
import { RocketsRenderer } from './effects/RocketsRenderer';
import { ChakriRenderer } from './effects/ChakriRenderer';
import { AnarRenderer } from './effects/AnarRenderer';
import { PhuljhadiRenderer } from './effects/PhuljhadiRenderer';
import { LanternsRenderer } from './effects/LanternsRenderer';
import { FlowerShowerRenderer } from './effects/FlowerShowerRenderer';
import { LadiRenderer } from './effects/LadiRenderer';

import { HangingLanternsRenderer } from './effects/HangingLanternsRenderer';
import { ToranRenderer, ToranOptions } from './effects/ToranRenderer';
import { LabradorRenderer, LabradorOptions } from './effects/LabradorRenderer';
import { RangoliRenderer, RangoliOptions } from './effects/RangoliRenderer';

export class DiwaliEngine {
  private canvasMgr: CanvasManager;
  private pool: ParticlePool;
  private sound: SoundManager;
  private mouse: MouseTracker;

  private diyasRenderer: DiyasRenderer | null = null;
  private hangingLanternsRenderer: HangingLanternsRenderer | null = null;
  private toranRenderer: ToranRenderer | null = null;
  private rangoliRenderer: RangoliRenderer | null = null;
  private labradorRenderer: LabradorRenderer | null = null;
  private rocketsRenderer: RocketsRenderer;
  private chakriRenderer: ChakriRenderer;
  private anarRenderer: AnarRenderer;
  private phuljhadiRenderer: PhuljhadiRenderer;
  private lanternsRenderer: LanternsRenderer | null = null;
  private flowerShowerRenderer: FlowerShowerRenderer | null = null;
  private ladiRenderer: LadiRenderer;

  private animationFrameId: number | null = null;
  private isRunning = false;
  private isPaused = false;
  private interactiveClickMode: InteractiveClickOptions['effect'] = 'none';

  private lastFrameTime = 0;

  constructor(options?: EngineOptions) {
    this.canvasMgr = new CanvasManager(options?.canvas, options?.container, options?.zIndex ?? 9999, options?.dpr);
    this.pool = new ParticlePool(800, 3500);
    this.sound = new SoundManager(options?.sound ?? false, options?.volume ?? 0.3);
    this.mouse = new MouseTracker(this.canvasMgr.getCanvas().parentElement || window);

    // Core cracker renderers
    this.rocketsRenderer = new RocketsRenderer(this.pool, this.sound, options, this.mouse);
    this.chakriRenderer = new ChakriRenderer(this.pool, this.sound, options, this.mouse);
    this.anarRenderer = new AnarRenderer(this.pool, this.sound, options);
    this.phuljhadiRenderer = new PhuljhadiRenderer(this.pool, this.sound, options, this.mouse);
    this.ladiRenderer = new LadiRenderer(this.pool, this.sound, options);

    this.setupListeners();
    this.startLoop();
  }

  private setupListeners(): void {
    // Canvas Resize
    this.canvasMgr.onResize((w, h) => {
      if (this.diyasRenderer) this.diyasRenderer.init(w, h);
      if (this.lanternsRenderer) this.lanternsRenderer.init(w, h);
      if (this.hangingLanternsRenderer) this.hangingLanternsRenderer.init(w);
      if (this.toranRenderer) this.toranRenderer.init(w, h);
      if (this.rangoliRenderer) this.rangoliRenderer.init(w, h);
      if (this.labradorRenderer) this.labradorRenderer.init(h);
    });

    // Page Visibility change (pause/resume)
    document.addEventListener('visibilitychange', () => {
      this.isPaused = document.hidden;
    });

    // Interactive Click/Tap
    this.mouse.onClick((x, y) => {
      this.handleInteractiveClick(x, y);
    });
  }

  private handleInteractiveClick(x: number, y: number): void {
    if (this.interactiveClickMode === 'none') return;

    let target = this.interactiveClickMode;
    if (target === 'random') {
      const choices: Array<'rocket' | 'chakri' | 'anar' | 'phuljhadi'> = ['rocket', 'chakri', 'anar', 'phuljhadi'];
      target = choices[Math.floor(Math.random() * choices.length)];
    }

    switch (target) {
      case 'rocket':
        this.rocketsRenderer.launch(1, x, this.canvasMgr.height, y);
        break;
      case 'chakri':
        this.chakriRenderer.ignite(x, y);
        break;
      case 'anar':
        this.anarRenderer.ignite(x, y);
        break;
      case 'phuljhadi':
        this.phuljhadiRenderer.lightWand(false, x, y, 4000);
        break;
    }
  }

  public setSoundEnabled(enabled: boolean): void {
    this.sound.setEnabled(enabled);
  }

  public setSoundVolume(volume: number): void {
    this.sound.setVolume(volume);
  }

  /**
   * 🪔 Diyas (Deepak): Floating or bottom-docked clay lamps with organic flame flickering & warm ambient glow
   */
  public diyas(options?: DiyasOptions): () => void {
    if (options?.sound !== undefined) this.sound.setEnabled(options.sound);
    this.diyasRenderer = new DiyasRenderer(options);
    this.diyasRenderer.init(this.canvasMgr.width, this.canvasMgr.height);

    return () => {
      this.diyasRenderer = null;
    };
  }

  /**
   * 🏮 Hanging Lanterns: Suspended from the top of the screen with pendulum sway
   * and intelligent mouse-proximity transparency (fades smoothly when mouse comes near!).
   */
  public hangingLanterns(count = 9): () => void {
    this.hangingLanternsRenderer = new HangingLanternsRenderer(count);
    this.hangingLanternsRenderer.init(this.canvasMgr.width);

    return () => {
      this.hangingLanternsRenderer = null;
    };
  }

  /**
   * 🌺 Subtle Marigold Toran: Traditional flower garland, fairy lights, and hanging brass lamps
   * across the top edge with intelligent mouse-proximity transparency!
   */
  public toran(options?: ToranOptions): () => void {
    this.toranRenderer = new ToranRenderer(options);
    this.toranRenderer.init(this.canvasMgr.width, this.canvasMgr.height);

    return () => {
      this.toranRenderer = null;
    };
  }

  /**
   * 💥 BLAST AT: Direct rocket launch detonating precisely where clicked!
   */
  public blastAt(x: number, y: number): void {
    this.rocketsRenderer.blastAt(x, y);
  }

  /**
   * 🖱️ Fireworks-JS Mouse Following: Toggle continuous mouse-following rockets
   */
  public setMouseFollow(enabled: boolean): void {
    this.rocketsRenderer.setMouseFollow(enabled);
  }

  /**
   * ⛲ Occasional Anar Fountain: Spawns a sparkling flowerpot fountain in the bottom corner
   */
  public startOccasionalAnar(intervalMs = 18000): () => void {
    let timer: number | null = null;
    const fire = () => {
      const w = this.canvasMgr.width;
      const h = this.canvasMgr.height;
      // Positioned near bottom-right corner (away from Julie in bottom-left)
      const x = Math.max(w * 0.72, w - 120);
      this.anar({ x, y: h - 14, height: 180, duration: 4200 });
      const nextDelay = intervalMs * (0.8 + Math.random() * 0.4);
      timer = window.setTimeout(fire, nextDelay);
    };
    timer = window.setTimeout(fire, 3500); // first fountain after 3.5s
    return () => {
      if (timer) clearTimeout(timer);
    };
  }

  /**
   * 🌸 Traditional Diwali Rangoli: Intricate geometric floral floor art in bottom corner with central glowing diya
   */
  public rangoli(options?: RangoliOptions): () => void {
    this.rangoliRenderer = new RangoliRenderer(options);
    this.rangoliRenderer.init(this.canvasMgr.width, this.canvasMgr.height);

    return () => {
      this.rangoliRenderer = null;
    };
  }

  /**
   * 🐕 Labrador Dog: Realistic Golden Labrador (Julie) eating festive treats in the bottom-left corner
   */
  public labrador(options?: number | LabradorOptions): () => void {
    this.labradorRenderer = new LabradorRenderer(options);
    this.labradorRenderer.init(this.canvasMgr.height);

    return () => {
      this.labradorRenderer = null;
    };
  }

  /**
   * Update mouse cursor coordinates (useful for global OS cursor tracking in desktop overlays)
   */
  public updateMousePosition(x: number, y: number): void {
    this.mouse.x = x;
    this.mouse.y = y;
  }

  /**
   * 🚀 Enable fireworks-js style cursor-following rockets!
   * Rockets launch from the bottom, curve and track your moving cursor,
   * and detonate into vibrant bursts right where your mouse is pointing.
   */
  public enableMouseRockets(options?: MouseRocketsOptions): () => void {
    if (options?.sound !== undefined) this.sound.setEnabled(options.sound);
    const intervalMs = options?.interval ?? 380;
    const homing = options?.homing ?? true;

    let lastLaunch = 0;

    const launchToCursor = (x: number, y: number) => {
      const now = performance.now();
      if (now - lastLaunch < intervalMs) return;
      lastLaunch = now;

      const w = this.canvasMgr.width;
      const h = this.canvasMgr.height;
      // Launch from bottom with randomized offset near cursor X
      const sx = Math.max(30, Math.min(w - 30, x + (Math.random() - 0.5) * 220));
      const sy = h;

      this.rocketsRenderer.launch(1, sx, sy, x, y, homing);
    };

    // 1. Launch when moving mouse
    const unbindMove = this.mouse.onMove((x, y) => {
      launchToCursor(x, y);
    });

    // 2. Also run continuous interval while mouse is down or hovering
    const timer = window.setInterval(() => {
      if (this.mouse.isMoving || this.mouse.isDown) {
        launchToCursor(this.mouse.x, this.mouse.y);
      }
    }, intervalMs);

    return () => {
      unbindMove();
      clearInterval(timer);
    };
  }

  /**
   * 🚀 Rockets (Aatishbazi): Upward launching whistling trail bursting into colorful sparkle clusters
   */
  public rockets(options?: RocketsOptions): () => void {
    if (options?.sound !== undefined) this.sound.setEnabled(options.sound);
    const count = options?.count ?? 4;
    this.rocketsRenderer.launch(count);

    return () => {
      this.rocketsRenderer.clear();
    };
  }

  /**
   * 🚀 Start continuous ambient rocket launches randomly from the bottom of the screen into the night sky
   */
  public startRocketShow(intervalMs = 850): () => void {
    this.rocketsRenderer.startLoop(intervalMs);
    return () => {
      this.rocketsRenderer.stopLoop();
    };
  }

  /**
   * 🌀 Chakri (Ground Spinner): Spinning circular wheel shooting centrifugal golden & colorful sparks
   */
  public chakri(options?: ChakriOptions): () => void {
    if (options?.sound !== undefined) this.sound.setEnabled(options.sound);
    this.chakriRenderer.ignite(options?.x, options?.y, options?.duration, options?.followMouse ?? false);

    return () => {
      this.chakriRenderer.clear();
    };
  }

  /**
   * 🌀 Enable spinning Chakkar (fire wheel) that follows the user's cursor / touch point
   */
  public enableMouseChakkar(options?: ChakriOptions): () => void {
    return this.chakri({ ...options, followMouse: true, duration: 0 });
  }

  /**
   * 🏺 Anar (Flowerpot Fountain): High-reaching vertical fountain of sparkling golden embers
   */
  public anar(options?: AnarOptions): () => void {
    if (options?.sound !== undefined) this.sound.setEnabled(options.sound);
    this.anarRenderer.ignite(options?.x, options?.y, options?.height, options?.duration);

    return () => {
      this.anarRenderer.clear();
    };
  }

  /**
   * ✨ Phuljhadi (Sparkler): Crackling golden/silver sparks with micro-bursts and smoke trail
   */
  public phuljhadi(options?: PhuljhadiOptions): () => void {
    if (options?.sound !== undefined) this.sound.setEnabled(options.sound);
    this.phuljhadiRenderer.lightWand(
      options?.followMouse ?? false,
      options?.x,
      options?.y,
      options?.duration
    );

    return () => {
      this.phuljhadiRenderer.clear();
    };
  }

  /**
   * ✨ Enable cursor-following sparkler
   */
  public enableMouseSparkler(options?: PhuljhadiOptions): () => void {
    return this.phuljhadi({ ...options, followMouse: true, duration: 0 });
  }

  /**
   * 🏮 Akash Kandil / Lanterns: Warm paper lanterns drifting upward with subtle wind sway
   */
  public lanterns(options?: LanternsOptions): () => void {
    if (options?.sound !== undefined) this.sound.setEnabled(options.sound);
    this.lanternsRenderer = new LanternsRenderer(options);
    this.lanternsRenderer.init(this.canvasMgr.width, this.canvasMgr.height);

    return () => {
      if (this.lanternsRenderer) {
        this.lanternsRenderer.clear();
        this.lanternsRenderer = null;
      }
    };
  }

  /**
   * 🌸 Flower Shower (Phoolon ki Barish): Marigold (genda phool) and rose petals fluttering softly
   */
  public flowerShower(options?: FlowerShowerOptions): () => void {
    this.flowerShowerRenderer = new FlowerShowerRenderer(options);
    this.flowerShowerRenderer.shower(this.canvasMgr.width, this.canvasMgr.height);

    return () => {
      if (this.flowerShowerRenderer) {
        this.flowerShowerRenderer.clear();
        this.flowerShowerRenderer = null;
      }
    };
  }

  /**
   * 💥 Ladi (Firecracker String): Rapid sequential popping firecracker string with flashes and smoke
   */
  public ladi(options?: LadiOptions): () => void {
    if (options?.sound !== undefined) this.sound.setEnabled(options.sound);
    this.ladiRenderer.ignite(options?.x, options?.y, options?.crackerCount);

    return () => {
      this.ladiRenderer.clear();
    };
  }

  /**
   * 💥 Festive Combo / Ladi: Curated grand show combining all Diwali animations
   */
  public celebrate(options?: FestiveComboOptions): () => void {
    const cleanups: Array<() => void> = [];

    // 1. Bottom Diyas
    if (options?.diyas !== false) {
      cleanups.push(this.diyas({ mode: 'docked', count: 7 }));
    }

    // 2. Floating Sky Lanterns in background
    if (options?.lanternCount !== 0) {
      cleanups.push(this.lanterns({ count: options?.lanternCount ?? 6 }));
    }

    // 3. Periodic Sky Rockets
    cleanups.push(this.startRocketShow(2000));

    // 4. Ground crackers (Chakri on left, Anar on right)
    if (options?.groundCrackers !== false) {
      setTimeout(() => {
        const w = this.canvasMgr.width;
        const h = this.canvasMgr.height;
        this.chakri({ x: Math.max(80, w * 0.15), y: h - 60 });
        this.anar({ x: Math.min(w - 80, w * 0.85), y: h - 30 });
      }, 800);
    }

    // 5. Flower Shower
    if (options?.flowerShower !== false) {
      cleanups.push(this.flowerShower({ count: 50, duration: options?.duration ?? 8000 }));
    }

    if (options?.duration && options.duration > 0) {
      setTimeout(() => {
        cleanups.forEach((c) => c());
      }, options.duration);
    }

    return () => {
      cleanups.forEach((c) => c());
    };
  }

  /**
   * Enable Click/Tap to spawn festive crackers
   */
  public enableClickToSpawn(mode: InteractiveClickOptions['effect'] = 'random'): () => void {
    this.interactiveClickMode = mode;
    return () => {
      this.interactiveClickMode = 'none';
    };
  }

  private startLoop(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastFrameTime = performance.now();

    const loop = (currentTime: number) => {
      if (!this.isRunning) return;
      this.animationFrameId = requestAnimationFrame(loop);

      if (this.isPaused) return;

      // Sync with native display VSync (60Hz / 120Hz ProMotion)
      const elapsed = Math.max(1, currentTime - this.lastFrameTime);
      this.lastFrameTime = currentTime;

      // Delta time factor (1.0 = standard 60 FPS 16.67ms frame)
      const dt = Math.min(elapsed / 16.667, 2.0);

      const ctx = this.canvasMgr.getContext();
      const w = this.canvasMgr.width;
      const h = this.canvasMgr.height;

      this.canvasMgr.clear();

      // Render order:
      // 1. Background sky lanterns (with mouse proximity transparency)
      if (this.lanternsRenderer) {
        this.lanternsRenderer.update(w, h, this.mouse.x, this.mouse.y, dt);
        this.lanternsRenderer.render(ctx);
      }

      // 2. Falling Flower Shower
      if (this.flowerShowerRenderer) {
        this.flowerShowerRenderer.update(w, h, dt);
        this.flowerShowerRenderer.render(ctx);
      }

      // 3. Ground Anar (Flowerpot)
      this.anarRenderer.update(dt);
      this.anarRenderer.render(ctx);

      // 4. Ground Chakri (Spinning wheel)
      this.chakriRenderer.update(dt);
      this.chakriRenderer.render(ctx);

      // 5. Sky Rockets & Firework bursts
      this.rocketsRenderer.update(dt);
      this.rocketsRenderer.render(ctx);

      // 5b. Ladi (Firecracker String)
      this.ladiRenderer.update(dt);
      this.ladiRenderer.render(ctx);

      // 6. Phuljhadi (Handheld / Cursor sparkler)
      this.phuljhadiRenderer.update(dt);
      this.phuljhadiRenderer.render(ctx);

      // 7. Foreground Diyas (Bottom of screen with mouse proximity transparency)
      if (this.diyasRenderer) {
        this.diyasRenderer.update(w, h, this.mouse.x, this.mouse.y, dt);
        this.diyasRenderer.render(ctx);
      }

      // 7b. Traditional Rangoli (Bottom-right floor art with mouse proximity transparency)
      if (this.rangoliRenderer) {
        this.rangoliRenderer.update(this.mouse.x, this.mouse.y, dt);
        this.rangoliRenderer.render(ctx);
      }

      // 8a. Subtle Marigold Toran & Fairy Lights across top of screen
      if (this.toranRenderer) {
        this.toranRenderer.update(this.mouse.x, this.mouse.y, dt);
        this.toranRenderer.render(ctx);
      }

      // 8b. Hanging Lanterns (Top of screen with mouse proximity transparency)
      if (this.hangingLanternsRenderer) {
        this.hangingLanternsRenderer.update(this.mouse.x, this.mouse.y, dt);
        this.hangingLanternsRenderer.render(ctx);
      }

      // 9. Cute Labrador Dog eating treats (Bottom-left of screen)
      if (this.labradorRenderer) {
        this.labradorRenderer.update(this.mouse.x, this.mouse.y, dt);
        this.labradorRenderer.render(ctx);
      }
    };

    this.animationFrameId = requestAnimationFrame(loop);
  }

  public clear(): void {
    this.canvasMgr.clear();
    this.rocketsRenderer.clear();
    this.chakriRenderer.clear();
    this.anarRenderer.clear();
    this.phuljhadiRenderer.clear();
    this.ladiRenderer.clear();
    if (this.lanternsRenderer) this.lanternsRenderer.clear();
    if (this.toranRenderer) this.toranRenderer.clear();
    if (this.rangoliRenderer) this.rangoliRenderer.clear();
    if (this.hangingLanternsRenderer) this.hangingLanternsRenderer.clear();
    if (this.labradorRenderer) this.labradorRenderer.clear();
    if (this.flowerShowerRenderer) this.flowerShowerRenderer.clear();
    this.pool.clear();
  }

  public destroy(): void {
    this.isRunning = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.clear();
    this.mouse.destroy();
    this.canvasMgr.destroy();
  }
}

