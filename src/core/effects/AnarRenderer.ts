import { AnarOptions, Particle } from '../types';
import { ParticlePool } from '../engine/ParticlePool';
import { SoundManager } from '../engine/SoundManager';

interface AnarInstance {
  x: number;
  y: number;
  height: number;
  spread: number;
  duration: number;
  elapsed: number;
  finished: boolean;
}

const ANAR_COLORS = [
  '#FFF8E1', // Radiant White/Cream
  '#FFD54F', // Golden Spark
  '#FFB300', // Amber
  '#FF6F00', // Fiery Orange
  '#FF1744', // Red ember
];

export class AnarRenderer {
  private instances: AnarInstance[] = [];
  private activeSparks: Particle[] = [];
  private pool: ParticlePool;
  private sound: SoundManager;
  private options: Required<AnarOptions>;

  constructor(pool: ParticlePool, sound: SoundManager, options?: AnarOptions) {
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
      x: options?.x ?? window.innerWidth / 2,
      y: options?.y ?? window.innerHeight - 30,
      height: options?.height ?? 320,
      spread: options?.spread ?? 160,
      duration: options?.duration ?? 5000,
      colors: options?.colors ?? ANAR_COLORS,
    };
  }

  public ignite(x?: number, y?: number, height?: number, duration?: number): void {
    const anarX = x ?? this.options.x;
    const anarY = y ?? this.options.y;
    const h = height ?? this.options.height;
    const dur = duration ?? this.options.duration;

    this.instances.push({
      x: anarX,
      y: anarY,
      height: h * this.options.scale,
      spread: this.options.spread * this.options.scale,
      duration: dur,
      elapsed: 0,
      finished: false,
    });

    if (this.options.sound) {
      this.sound.playAnarFountain();
    }
  }

  public update(dt = 1): void {
    // 1. Update anar instances and emit upward fountain sparks
    for (let i = this.instances.length - 1; i >= 0; i--) {
      const anar = this.instances[i];
      anar.elapsed += 20 * dt;

      const progress = anar.elapsed / anar.duration;
      if (progress >= 1) {
        anar.finished = true;
        this.instances.splice(i, 1);
        continue;
      }

      // Fountain power curve: ramps up in first 15%, peaks, and gently drops in last 25%
      let power = 1;
      if (progress < 0.15) {
        power = progress / 0.15;
      } else if (progress > 0.75) {
        power = Math.max(0.1, (1 - progress) / 0.25);
      }

      // Nozzle is at the top of the terracotta cone
      const nozzleY = anar.y - 28 * this.options.scale;

      // Spawn fountain sparks
      const sparksPerFrame = Math.floor((14 + Math.random() * 16) * power * dt);
      for (let s = 0; s < sparksPerFrame; s++) {
        const spark = this.pool.acquire();
        const launchVelocity = (10 + Math.random() * 9) * power * this.options.scale * this.options.speed;
        const spreadAngle = (Math.PI / 2) + (Math.random() - 0.5) * 0.5; // vertical cone

        spark.x = anar.x + (Math.random() - 0.5) * 8;
        spark.y = nozzleY;
        spark.prevX = spark.x;
        spark.prevY = spark.y;
        spark.vx = Math.cos(spreadAngle) * launchVelocity * 0.4 + (Math.random() - 0.5) * 2.5;
        spark.vy = -Math.sin(spreadAngle) * launchVelocity;
        spark.drag = 0.988;
        spark.color = this.options.colors[Math.floor(Math.random() * this.options.colors.length)];
        spark.size = (1.5 + Math.random() * 2.2) * this.options.scale;
        spark.initialSize = spark.size;
        spark.alpha = 1;
        spark.life = 0;
        spark.maxLife = 45 + Math.random() * 35;

        this.activeSparks.push(spark);
      }
    }

    // 2. Update fountain sparks with gravity pulling them into a cascading umbrella
    for (let i = this.activeSparks.length - 1; i >= 0; i--) {
      const spark = this.activeSparks[i];
      spark.prevX = spark.x;
      spark.prevY = spark.y;
      spark.vx *= Math.pow(spark.drag, dt);
      spark.vy = spark.vy * Math.pow(spark.drag, dt) + 0.22 * dt; // Gravity accelerates downward waterfall
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

    // 1. Draw Terracotta Anar Cones
    for (const anar of this.instances) {
      const coneScale = this.options.scale;
      const coneHeight = 32 * coneScale;
      const baseWidth = 36 * coneScale;

      ctx.save();
      ctx.translate(anar.x, anar.y);

      // Terracotta gradient
      const coneGrad = ctx.createLinearGradient(0, -coneHeight, 0, 0);
      coneGrad.addColorStop(0, '#E65100');
      coneGrad.addColorStop(0.5, '#BF360C');
      coneGrad.addColorStop(1, '#4E342E');

      ctx.fillStyle = coneGrad;
      ctx.beginPath();
      ctx.moveTo(0, -coneHeight);
      ctx.lineTo(baseWidth / 2, 0);
      ctx.lineTo(-baseWidth / 2, 0);
      ctx.closePath();
      ctx.fill();

      // Golden decorative bands
      ctx.strokeStyle = '#FFD54F';
      ctx.lineWidth = 2 * coneScale;
      ctx.beginPath();
      ctx.moveTo(-baseWidth * 0.35, -coneHeight * 0.35);
      ctx.lineTo(baseWidth * 0.35, -coneHeight * 0.35);
      ctx.moveTo(-baseWidth * 0.2, -coneHeight * 0.65);
      ctx.lineTo(baseWidth * 0.2, -coneHeight * 0.65);
      ctx.stroke();

      // Nozzle nozzle mouth glow
      const mouthGlow = ctx.createRadialGradient(0, -coneHeight, 1, 0, -coneHeight, 14 * coneScale);
      mouthGlow.addColorStop(0, '#FFFFFF');
      mouthGlow.addColorStop(0.4, '#FFE082');
      mouthGlow.addColorStop(1, 'rgba(255, 111, 0, 0)');

      ctx.fillStyle = mouthGlow;
      ctx.beginPath();
      ctx.arc(0, -coneHeight, 14 * coneScale, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    // 2. Draw Fountain Sparks with additive blending
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

