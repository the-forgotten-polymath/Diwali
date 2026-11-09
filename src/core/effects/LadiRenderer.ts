import { BaseEffectOptions, Particle } from '../types';
import { ParticlePool } from '../engine/ParticlePool';
import { SoundManager } from '../engine/SoundManager';

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

interface CrackerUnit {
  x: number;
  y: number;
  exploded: boolean;
  angle: number;
}

export class LadiRenderer {
  private crackers: CrackerUnit[] = [];
  private activeSparks: Particle[] = [];
  private smokeClouds: Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    alpha: number;
    life: number;
    maxLife: number;
  }> = [];
  private paperDebris: Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    rotation: number;
    rotationSpeed: number;
    alpha: number;
  }> = [];

  private pool: ParticlePool;
  private sound: SoundManager;
  private options: Required<LadiOptions>;
  private currentIndex = 0;
  private burstTimer: number | null = null;
  private isIgnited = false;

  constructor(pool: ParticlePool, sound: SoundManager, options?: LadiOptions) {
    this.pool = pool;
    this.sound = sound;
    this.options = {
      container: options?.container ?? null,
      canvas: options?.canvas ?? null,
      zIndex: options?.zIndex ?? 9999,
      sound: options?.sound ?? false,
      volume: options?.volume ?? 0.3,
      reducedMotion: options?.reducedMotion ?? true,
      speed: options?.speed ?? 1,
      scale: options?.scale ?? 1,
      fps: options?.fps ?? 50,
      x: options?.x ?? window.innerWidth * 0.5,
      y: options?.y ?? 60,
      crackerCount: options?.crackerCount ?? 40,
      length: options?.length ?? 280,
    };
  }

  public ignite(x?: number, y?: number, count?: number): void {
    const ladiX = x ?? this.options.x;
    const ladiY = y ?? this.options.y;
    const total = count ?? this.options.crackerCount;
    const len = this.options.length * this.options.scale;

    this.crackers = [];
    const step = len / total;

    for (let i = 0; i < total; i++) {
      const cy = ladiY + i * step;
      const side = i % 2 === 0 ? 1 : -1;
      this.crackers.push({
        x: ladiX + side * (8 * this.options.scale),
        y: cy,
        exploded: false,
        angle: side * 0.3,
      });
    }

    this.currentIndex = this.crackers.length - 1; // Burns from bottom to top
    this.isIgnited = true;

    this.burstNextCracker();
  }

  private burstNextCracker(): void {
    if (!this.isIgnited || this.currentIndex < 0) {
      this.isIgnited = false;
      return;
    }

    const c = this.crackers[this.currentIndex];
    c.exploded = true;

    // 1. Procedural explosion sound
    if (this.options.sound) {
      this.sound.playLadiPop();
    }

    // 2. White flash sparks
    const sparkCount = Math.floor(10 * this.options.scale);
    for (let s = 0; s < sparkCount; s++) {
      const spark = this.pool.acquire();
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 5;

      spark.x = c.x;
      spark.y = c.y;
      spark.prevX = c.x;
      spark.prevY = c.y;
      spark.vx = Math.cos(angle) * speed;
      spark.vy = Math.sin(angle) * speed;
      spark.drag = 0.92;
      spark.color = Math.random() > 0.4 ? '#FFFFFF' : '#FFD54F';
      spark.size = 2 * this.options.scale;
      spark.initialSize = spark.size;
      spark.alpha = 1;
      spark.life = 0;
      spark.maxLife = 12 + Math.random() * 12;
      this.activeSparks.push(spark);
    }

    // 3. Smoke puff
    for (let sm = 0; sm < 3; sm++) {
      this.smokeClouds.push({
        x: c.x + (Math.random() - 0.5) * 8,
        y: c.y,
        vx: (Math.random() - 0.5) * 0.8,
        vy: -0.8 - Math.random() * 0.8,
        size: 8 + Math.random() * 8,
        alpha: 0.5,
        life: 0,
        maxLife: 35 + Math.random() * 20,
      });
    }

    // 4. Red paper wrapper debris
    for (let p = 0; p < 4; p++) {
      this.paperDebris.push({
        x: c.x,
        y: c.y,
        vx: (Math.random() - 0.5) * 4,
        vy: -1 - Math.random() * 3,
        size: 3 + Math.random() * 3,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
        alpha: 1,
      });
    }

    this.currentIndex--;

    // Rhythmic rapid firecracker delay (35ms to 75ms)
    const delay = 35 + Math.random() * 40;
    this.burstTimer = window.setTimeout(() => {
      this.burstNextCracker();
    }, delay);
  }

  public update(dt = 1): void {
    // 1. Update sparks
    for (let i = this.activeSparks.length - 1; i >= 0; i--) {
      const spark = this.activeSparks[i];
      spark.prevX = spark.x;
      spark.prevY = spark.y;
      spark.vx *= Math.pow(spark.drag, dt);
      spark.vy = spark.vy * Math.pow(spark.drag, dt) + 0.1 * dt;
      spark.x += spark.vx * this.options.speed * dt;
      spark.y += spark.vy * this.options.speed * dt;
      spark.life += dt;
      spark.alpha = Math.max(0, 1 - spark.life / spark.maxLife);

      if (spark.life >= spark.maxLife || spark.alpha <= 0.01) {
        this.pool.release(spark);
        this.activeSparks.splice(i, 1);
      }
    }

    // 2. Update smoke clouds
    for (let i = this.smokeClouds.length - 1; i >= 0; i--) {
      const s = this.smokeClouds[i];
      s.x += s.vx * dt;
      s.y += s.vy * dt;
      s.size += 0.3 * dt;
      s.life += dt;
      s.alpha = Math.max(0, 0.5 * (1 - s.life / s.maxLife));

      if (s.life >= s.maxLife) {
        this.smokeClouds.splice(i, 1);
      }
    }

    // 3. Update red paper debris falling with gravity
    for (let i = this.paperDebris.length - 1; i >= 0; i--) {
      const d = this.paperDebris[i];
      d.x += d.vx * dt;
      d.vy += 0.15 * dt; // Gravity
      d.y += d.vy * dt;
      d.rotation += d.rotationSpeed * dt;
      d.alpha *= Math.pow(0.98, dt);

      if (d.alpha <= 0.05 || d.y > window.innerHeight) {
        this.paperDebris.splice(i, 1);
      }
    }
  }

  public render(ctx: CanvasRenderingContext2D): void {
    ctx.save();

    // 1. Draw central hanging twine string
    if (this.crackers.length > 0) {
      const topY = this.crackers[0].y - 20;
      const bottomY = this.crackers[this.crackers.length - 1].y;
      const x = this.options.x;

      ctx.strokeStyle = '#D7CCC8';
      ctx.lineWidth = 2 * this.options.scale;
      ctx.beginPath();
      ctx.moveTo(x, topY);
      ctx.lineTo(x, bottomY);
      ctx.stroke();

      // 2. Draw remaining unexploded red firecrackers
      for (const c of this.crackers) {
        if (c.exploded) continue;

        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.rotate(c.angle);

        // Red cylinder body
        ctx.fillStyle = '#D32F2F';
        ctx.fillRect(-6 * this.options.scale, -3 * this.options.scale, 12 * this.options.scale, 6 * this.options.scale);

        // Gold paper brand label ring
        ctx.fillStyle = '#FFD54F';
        ctx.fillRect(-2 * this.options.scale, -3 * this.options.scale, 4 * this.options.scale, 6 * this.options.scale);

        ctx.restore();
      }
    }

    // 3. Draw falling red paper fragments
    for (const d of this.paperDebris) {
      ctx.save();
      ctx.translate(d.x, d.y);
      ctx.rotate(d.rotation);
      ctx.fillStyle = `rgba(211, 47, 47, ${d.alpha})`;
      ctx.fillRect(-d.size / 2, -d.size / 2, d.size, d.size * 0.7);
      ctx.restore();
    }

    // 4. Draw smoke puffs
    for (const sm of this.smokeClouds) {
      ctx.fillStyle = `rgba(220, 220, 225, ${sm.alpha})`;
      ctx.beginPath();
      ctx.arc(sm.x, sm.y, sm.size, 0, Math.PI * 2);
      ctx.fill();
    }

    // 5. Draw explosive flash sparks
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineCap = 'round';
    for (const sp of this.activeSparks) {
      ctx.globalAlpha = sp.alpha;
      ctx.strokeStyle = sp.color;
      ctx.lineWidth = sp.size;
      ctx.beginPath();
      ctx.moveTo(sp.prevX, sp.prevY);
      ctx.lineTo(sp.x, sp.y);
      ctx.stroke();
    }

    ctx.restore();
  }

  public clear(): void {
    if (this.burstTimer) {
      clearTimeout(this.burstTimer);
      this.burstTimer = null;
    }
    this.isIgnited = false;
    this.crackers = [];
    this.smokeClouds = [];
    this.paperDebris = [];
    for (const s of this.activeSparks) {
      this.pool.release(s);
    }
    this.activeSparks = [];
  }
}
