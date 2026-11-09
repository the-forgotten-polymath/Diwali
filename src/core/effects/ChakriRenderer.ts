import { ChakriOptions, Particle } from '../types';
import { ParticlePool } from '../engine/ParticlePool';
import { SoundManager } from '../engine/SoundManager';
import { MouseTracker } from '../engine/MouseTracker';

interface ChakriInstance {
  x: number;
  y: number;
  radius: number;
  angle: number;
  angularVelocity: number;
  duration: number;
  elapsed: number;
  sparkColors: string[];
  followMouse: boolean;
  finished: boolean;
}

const CHAKRI_COLORS = [
  '#FFD700', // Gold
  '#FF9100', // Vivid Orange
  '#00E676', // Emerald Green
  '#FFFFFF', // White heat
  '#FF3D00', // Fiery Red
];

export class ChakriRenderer {
  private instances: ChakriInstance[] = [];
  private activeSparks: Particle[] = [];
  private pool: ParticlePool;
  private sound: SoundManager;
  private mouse: MouseTracker | null = null;
  private options: Required<ChakriOptions>;

  constructor(pool: ParticlePool, sound: SoundManager, options?: ChakriOptions, mouse?: MouseTracker) {
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
      x: options?.x ?? window.innerWidth / 2,
      y: options?.y ?? window.innerHeight - 80,
      duration: options?.duration ?? 4500,
      radius: options?.radius ?? 16,
      sparkDensity: options?.sparkDensity ?? 1,
      colors: options?.colors ?? CHAKRI_COLORS,
      followMouse: options?.followMouse ?? false,
    };
  }

  public setMouseTracker(mouse: MouseTracker): void {
    this.mouse = mouse;
  }

  public ignite(x?: number, y?: number, duration?: number, followMouse = false): void {
    const isMouse = followMouse || this.options.followMouse;
    const chakriX = isMouse && this.mouse ? this.mouse.x : (x ?? this.options.x);
    const chakriY = isMouse && this.mouse ? this.mouse.y : (y ?? this.options.y);
    const dur = duration ?? this.options.duration;

    this.instances.push({
      x: chakriX,
      y: chakriY,
      radius: this.options.radius * this.options.scale,
      angle: 0,
      angularVelocity: 0.35 * this.options.speed,
      duration: dur,
      elapsed: 0,
      sparkColors: this.options.colors,
      followMouse: isMouse,
      finished: false,
    });

    if (this.options.sound) {
      this.sound.playChakriWhir();
    }
  }

  public update(dt = 1): void {
    // 1. Update spinning chakri instances
    for (let i = this.instances.length - 1; i >= 0; i--) {
      const c = this.instances[i];
      c.elapsed += 20 * dt;
      c.angle += c.angularVelocity * dt;

      if (c.followMouse && this.mouse) {
        c.x += (this.mouse.x - c.x) * Math.min(0.4 * dt, 1);
        c.y += (this.mouse.y - c.y) * Math.min(0.4 * dt, 1);
      }

      // If duration is 0, it spins continuously
      if (c.duration > 0) {
        const progress = c.elapsed / c.duration;
        if (progress >= 1) {
          c.finished = true;
          this.instances.splice(i, 1);
          continue;
        }

        // Angular velocity accelerates then gradually winds down
        if (progress < 0.2) {
          c.angularVelocity = Math.min(0.5, c.angularVelocity + 0.015 * dt);
        } else if (progress > 0.7) {
          c.angularVelocity = Math.max(0.08, c.angularVelocity * Math.pow(0.985, dt));
        }
      } else {
        // Continuous mouse-following chakkar stays spinning fast
        c.angularVelocity = 0.42 * this.options.speed;
      }

      // Spawn centrifugal sparks
      const sparksToEmit = Math.floor((8 + Math.random() * 8) * this.options.sparkDensity * dt);
      for (let s = 0; s < sparksToEmit; s++) {
        // Offset angle around the circumference (2 to 4 nozzle arms)
        const armOffset = (Math.PI * 2 * (s % 3)) / 3;
        const emitterAngle = c.angle + armOffset;
        const nozzleX = c.x + Math.cos(emitterAngle) * c.radius;
        const nozzleY = c.y + Math.sin(emitterAngle) * c.radius;

        // Velocity tangent to circumference + radial outward thrust
        const tangentAngle = emitterAngle + Math.PI / 2;
        const speed = (5 + Math.random() * 9) * this.options.scale * (c.angularVelocity / 0.3);

        const spark = this.pool.acquire();
        spark.x = nozzleX;
        spark.y = nozzleY;
        spark.prevX = nozzleX;
        spark.prevY = nozzleY;
        spark.vx = Math.cos(tangentAngle) * speed + (Math.random() - 0.5) * 2;
        spark.vy = Math.sin(tangentAngle) * speed + (Math.random() - 0.5) * 2;
        spark.drag = 0.93;
        spark.color = c.sparkColors[Math.floor(Math.random() * c.sparkColors.length)];
        spark.size = (1.5 + Math.random() * 2.2) * this.options.scale;
        spark.initialSize = spark.size;
        spark.alpha = 1;
        spark.life = 0;
        spark.maxLife = 22 + Math.random() * 28;

        this.activeSparks.push(spark);
      }
    }

    // 2. Update centrifugal sparks
    for (let i = this.activeSparks.length - 1; i >= 0; i--) {
      const spark = this.activeSparks[i];
      spark.prevX = spark.x;
      spark.prevY = spark.y;
      spark.vx *= Math.pow(spark.drag, dt);
      spark.vy = spark.vy * Math.pow(spark.drag, dt) + 0.05 * dt; // Light gravity
      spark.x += spark.vx * this.options.speed * dt;
      spark.y += spark.vy * this.options.speed * dt;
      spark.life += dt;

      spark.alpha = Math.max(0, 1 - spark.life / spark.maxLife);

      if (spark.life >= spark.maxLife || spark.alpha <= 0.01) {
        this.pool.release(spark);
        this.activeSparks.splice(i, 1);
      }
    }
  }

  public render(ctx: CanvasRenderingContext2D): void {
    ctx.save();

    // 1. Draw glowing ground burn reflection for each chakri
    for (const c of this.instances) {
      const glowGrad = ctx.createRadialGradient(c.x, c.y, 2, c.x, c.y, 45 * this.options.scale);
      glowGrad.addColorStop(0, 'rgba(255, 200, 50, 0.4)');
      glowGrad.addColorStop(0.5, 'rgba(255, 100, 0, 0.15)');
      glowGrad.addColorStop(1, 'rgba(255, 80, 0, 0)');

      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(c.x, c.y, 45 * this.options.scale, 0, Math.PI * 2);
      ctx.fill();

      // Spinning center disc
      ctx.save();
      ctx.translate(c.x, c.y);
      ctx.rotate(c.angle);

      // Central body
      ctx.fillStyle = '#D84315';
      ctx.beginPath();
      ctx.arc(0, 0, c.radius, 0, Math.PI * 2);
      ctx.fill();

      // Golden spiral pattern on body
      ctx.strokeStyle = '#FFE082';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let a = 0; a < Math.PI * 4; a += 0.2) {
        const r = (c.radius * a) / (Math.PI * 4);
        const px = Math.cos(a) * r;
        const py = Math.sin(a) * r;
        if (a === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Center hot white axle
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(0, 0, 3 * this.options.scale, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    // 2. Draw sparks with additive blending
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineCap = 'round';
    for (const s of this.activeSparks) {
      ctx.globalAlpha = s.alpha;
      ctx.strokeStyle = s.color;
      ctx.lineWidth = s.size;
      ctx.shadowBlur = 5;
      ctx.shadowColor = s.color;

      ctx.beginPath();
      ctx.moveTo(s.prevX, s.prevY);
      ctx.lineTo(s.x, s.y);
      ctx.stroke();
    }

    ctx.restore();
  }

  public clear(): void {
    for (const s of this.activeSparks) {
      this.pool.release(s);
    }
    this.activeSparks = [];
    this.instances = [];
  }
}

