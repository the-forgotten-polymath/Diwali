import { PhuljhadiOptions, Particle } from '../types';
import { ParticlePool } from '../engine/ParticlePool';
import { SoundManager } from '../engine/SoundManager';
import { MouseTracker } from '../engine/MouseTracker';

interface WandInstance {
  x: number;
  y: number;
  angle: number;
  followMouse: boolean;
  duration: number;
  elapsed: number;
  burnLength: number;
  finished: boolean;
}

const PHULJHADI_COLORS = [
  '#FFFFFF', // Diamond White Spark
  '#FFF9C4', // Pale Yellow Star
  '#FFD54F', // Golden Spark
  '#FFCA28', // Amber
  '#FF6F00', // Saffron Ember
];

export class PhuljhadiRenderer {
  private wands: WandInstance[] = [];
  private activeSparks: Particle[] = [];
  private pool: ParticlePool;
  private sound: SoundManager;
  private mouse: MouseTracker | null = null;
  private options: Required<PhuljhadiOptions>;

  constructor(pool: ParticlePool, sound: SoundManager, options?: PhuljhadiOptions, mouse?: MouseTracker) {
    this.pool = pool;
    this.sound = sound;
    this.mouse = mouse ?? null;
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
      followMouse: options?.followMouse ?? false,
      x: options?.x ?? window.innerWidth * 0.7,
      y: options?.y ?? window.innerHeight * 0.6,
      wireLength: options?.wireLength ?? 120,
      duration: options?.duration ?? 8000,
      colors: options?.colors ?? PHULJHADI_COLORS,
    };
  }

  public setMouseTracker(mouse: MouseTracker): void {
    this.mouse = mouse;
  }

  public lightWand(followMouse = this.options.followMouse, x?: number, y?: number, duration?: number): void {
    this.wands.push({
      x: x ?? (followMouse && this.mouse ? this.mouse.x : this.options.x),
      y: y ?? (followMouse && this.mouse ? this.mouse.y : this.options.y),
      angle: -Math.PI / 4, // 45 degree tilt
      followMouse,
      duration: duration ?? this.options.duration,
      elapsed: 0,
      burnLength: 0,
      finished: false,
    });
  }

  public update(dt = 1): void {
    // 1. Update wands and emit 360-degree starburst sparks
    for (let i = this.wands.length - 1; i >= 0; i--) {
      const wand = this.wands[i];
      wand.elapsed += 20 * dt;

      if (wand.duration > 0 && wand.elapsed >= wand.duration) {
        wand.finished = true;
        this.wands.splice(i, 1);
        continue;
      }

      if (wand.followMouse && this.mouse) {
        // Smoothly interpolate wand tip towards mouse pointer
        wand.x += (this.mouse.x - wand.x) * Math.min(0.35 * dt, 1);
        wand.y += (this.mouse.y - wand.y) * Math.min(0.35 * dt, 1);
      }

      // Tip coordinates
      const tipX = wand.x;
      const tipY = wand.y;

      // Crackling starburst emission
      const sparkCount = Math.floor((5 + Math.random() * 6) * this.options.scale * dt);
      for (let s = 0; s < sparkCount; s++) {
        const spark = this.pool.acquire();
        const angle = Math.random() * Math.PI * 2;
        const speed = (2 + Math.random() * 6.5) * this.options.scale * this.options.speed;

        spark.x = tipX + (Math.random() - 0.5) * 4;
        spark.y = tipY + (Math.random() - 0.5) * 4;
        spark.prevX = tipX;
        spark.prevY = tipY;
        spark.vx = Math.cos(angle) * speed;
        spark.vy = Math.sin(angle) * speed;
        spark.drag = 0.93;
        spark.color = this.options.colors[Math.floor(Math.random() * this.options.colors.length)];
        spark.size = (1.2 + Math.random() * 2) * this.options.scale;
        spark.initialSize = spark.size;
        spark.alpha = 1;
        spark.life = 0;
        spark.maxLife = 18 + Math.random() * 20;

        // Occasional branching spark (mini crackle explosion)
        spark.customData = {
          branch: Math.random() > 0.7,
        };

        this.activeSparks.push(spark);
      }

      if (this.options.sound && Math.random() < 0.35 * dt) {
        this.sound.playSparklerCrackle();
      }
    }

    // 2. Update sparks
    for (let i = this.activeSparks.length - 1; i >= 0; i--) {
      const spark = this.activeSparks[i];
      spark.prevX = spark.x;
      spark.prevY = spark.y;
      spark.vx *= Math.pow(spark.drag, dt);
      spark.vy = spark.vy * Math.pow(spark.drag, dt) + 0.12 * dt; // Gravity
      spark.x += spark.vx * this.options.speed * dt;
      spark.y += spark.vy * this.options.speed * dt;
      spark.life += dt;

      spark.alpha = Math.max(0, 1 - spark.life / spark.maxLife);

      // Branching mini-spark
      if (spark.customData?.branch && spark.life === Math.floor(spark.maxLife * 0.5)) {
        spark.customData.branch = false;
        for (let b = 0; b < 2; b++) {
          const mini = this.pool.acquire();
          const miniAngle = Math.random() * Math.PI * 2;
          mini.x = spark.x;
          mini.y = spark.y;
          mini.prevX = spark.x;
          mini.prevY = spark.y;
          mini.vx = Math.cos(miniAngle) * 3;
          mini.vy = Math.sin(miniAngle) * 3;
          mini.drag = 0.9;
          mini.color = '#FFF9C4';
          mini.size = 1.2 * this.options.scale;
          mini.initialSize = mini.size;
          mini.alpha = 1;
          mini.life = 0;
          mini.maxLife = 10;
          this.activeSparks.push(mini);
        }
      }

      if (spark.life >= spark.maxLife || spark.alpha <= 0.01) {
        this.pool.release(spark);
        this.activeSparks.splice(i, 1);
      }
    }
  }

  public render(ctx: CanvasRenderingContext2D): void {
    ctx.save();

    // 1. Draw Phuljhadi Metallic Wand & Wire
    for (const wand of this.wands) {
      const wireLen = this.options.wireLength * this.options.scale;
      const endX = wand.x - Math.cos(wand.angle) * wireLen;
      const endY = wand.y - Math.sin(wand.angle) * wireLen;

      // Steel wire handle
      ctx.strokeStyle = '#90A4AE';
      ctx.lineWidth = 2 * this.options.scale;
      ctx.beginPath();
      ctx.moveTo(wand.x, wand.y);
      ctx.lineTo(endX, endY);
      ctx.stroke();

      // Chemical coating on upper 65% of wand
      const coatStartX = wand.x - Math.cos(wand.angle) * (wireLen * 0.05);
      const coatStartY = wand.y - Math.sin(wand.angle) * (wireLen * 0.05);
      const coatEndX = wand.x - Math.cos(wand.angle) * (wireLen * 0.65);
      const coatEndY = wand.y - Math.sin(wand.angle) * (wireLen * 0.65);

      ctx.strokeStyle = '#455A64';
      ctx.lineWidth = 4 * this.options.scale;
      ctx.beginPath();
      ctx.moveTo(coatStartX, coatStartY);
      ctx.lineTo(coatEndX, coatEndY);
      ctx.stroke();

      // White-hot tip glow
      const tipGlow = ctx.createRadialGradient(wand.x, wand.y, 1, wand.x, wand.y, 18 * this.options.scale);
      tipGlow.addColorStop(0, '#FFFFFF');
      tipGlow.addColorStop(0.3, '#FFE082');
      tipGlow.addColorStop(0.7, '#FF6F00');
      tipGlow.addColorStop(1, 'rgba(255, 111, 0, 0)');

      ctx.fillStyle = tipGlow;
      ctx.beginPath();
      ctx.arc(wand.x, wand.y, 18 * this.options.scale, 0, Math.PI * 2);
      ctx.fill();
    }

    // 2. Draw intense starburst sparks with additive blending
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineCap = 'round';
    for (const s of this.activeSparks) {
      ctx.globalAlpha = s.alpha;
      ctx.strokeStyle = s.color;
      ctx.lineWidth = s.size;
      ctx.shadowBlur = 6;
      ctx.shadowColor = s.color;

      ctx.beginPath();
      ctx.moveTo(s.prevX, s.prevY);
      ctx.lineTo(s.x, s.y);
      ctx.stroke();

      // Spark head point
      ctx.fillStyle = s.color;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size * 0.7, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  public clear(): void {
    for (const s of this.activeSparks) {
      this.pool.release(s);
    }
    this.activeSparks = [];
    this.wands = [];
  }
}

