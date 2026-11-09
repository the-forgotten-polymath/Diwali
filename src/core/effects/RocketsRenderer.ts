import { RocketsOptions, Particle } from '../types';
import { ParticlePool } from '../engine/ParticlePool';
import { SoundManager } from '../engine/SoundManager';
import { MouseTracker } from '../engine/MouseTracker';

interface Rocket {
  startX: number;
  startY: number;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  totalDistance: number;
  currentDistance: number;
  angle: number;
  speed: number;
  acceleration: number;
  color: string;
  coords: Array<[number, number]>;
  exploded: boolean;
  homing: boolean;
}

interface AmbientStardust {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  phase: number;
}

const DEFAULT_FESTIVE_COLORS = [
  '#FFD700', // Gold
  '#FF4500', // Saffron / Orange-Red
  '#00E676', // Emerald Spark
  '#FF1744', // Ruby Red
  '#E040FB', // Festive Magenta
  '#00E5FF', // Cyan Sparkle
  '#FFAB00', // Amber
  '#FFFFFF', // Diamond White
];

export class RocketsRenderer {
  private rockets: Rocket[] = [];
  private activeSparks: Particle[] = [];
  private ambientStardust: AmbientStardust[] = [];
  private pool: ParticlePool;
  private sound: SoundManager;
  private mouse: MouseTracker | null = null;
  private options: Required<RocketsOptions>;
  private isContinuous = false;
  private spawnInterval: number | null = null;
  private reducedMotion = false;
  private lowEndMode = false;

  // 🖱️ Fireworks-JS Mouse Following
  public mouseFollow = true;
  private lastMouseX = -1;
  private lastMouseY = -1;
  private mouseMoveCooldown = 0;

  constructor(pool: ParticlePool, sound: SoundManager, options?: RocketsOptions, mouse?: MouseTracker) {
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
      count: options?.count ?? 2,
      origins: options?.origins ?? [],
      colors: options?.colors ?? DEFAULT_FESTIVE_COLORS,
      burstParticles: options?.burstParticles ?? 65,
      spread: options?.spread ?? 1,
      gravity: options?.gravity ?? 0.09,
    };

    if (typeof window !== 'undefined' && window.matchMedia) {
      this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    this.initStardust(window.innerWidth || 1440, window.innerHeight || 900);
  }

  public setMouseTracker(mouse: MouseTracker): void {
    this.mouse = mouse;
  }

  public setMouseFollow(enabled: boolean): void {
    this.mouseFollow = enabled;
  }

  public setLowEndMode(enabled: boolean): void {
    this.lowEndMode = enabled;
  }

  private initStardust(w: number, h: number): void {
    const count = this.reducedMotion ? 6 : (this.lowEndMode ? 10 : 20);
    this.ambientStardust = [];
    for (let i = 0; i < count; i++) {
      this.ambientStardust.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.2,
        vy: -0.15 - Math.random() * 0.3,
        size: 0.8 + Math.random() * 1.2,
        alpha: 0.2 + Math.random() * 0.45,
        phase: Math.random() * Math.PI * 2,
      });
    }
  }

  /**
   * 💥 BLAST AT: Direct instantaneous rocket targeting (x, y) like fireworks-js!
   */
  public blastAt(targetX: number, targetY: number): void {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    const sx = Math.max(20, Math.min(screenWidth - 20, targetX + (Math.random() - 0.5) * 80));
    const sy = screenHeight + 5;
    const dx = targetX - sx;
    const dy = targetY - sy;
    const totalDistance = Math.hypot(dx, dy);
    const angle = Math.atan2(dy, dx);
    const speed = 14 * this.options.speed;
    const color = this.options.colors[Math.floor(Math.random() * this.options.colors.length)];

    this.rockets.push({
      startX: sx,
      startY: sy,
      x: sx,
      y: sy,
      targetX,
      targetY,
      totalDistance,
      currentDistance: 0,
      angle,
      speed,
      acceleration: 1.04,
      color,
      coords: [[sx, sy], [sx, sy], [sx, sy]],
      exploded: false,
      homing: true, // Smoothly tracks moving cursor in flight
    });

    if (this.options.sound) {
      this.sound.playRocketWhistle();
    }
  }

  public launch(
    count = this.options.count,
    startX?: number,
    startY?: number,
    targetX?: number,
    targetY?: number,
    homing = false
  ): void {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const sx = startX !== undefined ? startX : (0.08 + Math.random() * 0.84) * screenWidth;
        const sy = startY !== undefined ? startY : screenHeight + 5;
        const tx = targetX !== undefined ? targetX : sx + (Math.random() - 0.5) * 180;
        const ty = targetY !== undefined ? targetY : (0.12 + Math.random() * 0.32) * screenHeight;

        const dx = tx - sx;
        const dy = ty - sy;
        const totalDistance = Math.hypot(dx, dy);
        const angle = Math.atan2(dy, dx);
        const speed = (9.5 + Math.random() * 3.5) * this.options.speed;
        const color = this.options.colors[Math.floor(Math.random() * this.options.colors.length)];

        this.rockets.push({
          startX: sx,
          startY: sy,
          x: sx,
          y: sy,
          targetX: tx,
          targetY: ty,
          totalDistance,
          currentDistance: 0,
          angle,
          speed,
          acceleration: 1.025,
          color,
          coords: [[sx, sy], [sx, sy], [sx, sy]],
          exploded: false,
          homing,
        });

        if (this.options.sound) {
          this.sound.playRocketWhistle();
        }
      }, i * 200);
    }
  }

  public startLoop(intervalMs = 3800): void {
    this.isContinuous = true;
    this.launch(1);

    const scheduleNext = () => {
      if (!this.isContinuous) return;
      const count = Math.random() > 0.65 ? 2 : 1;
      this.launch(count);
      const nextDelay = intervalMs * (0.8 + Math.random() * 0.5);
      this.spawnInterval = window.setTimeout(scheduleNext, nextDelay);
    };

    this.spawnInterval = window.setTimeout(scheduleNext, intervalMs * 0.7);
  }

  public stopLoop(): void {
    this.isContinuous = false;
    if (this.spawnInterval) {
      clearTimeout(this.spawnInterval);
      this.spawnInterval = null;
    }
  }

  public update(dt = 1): void {
    const screenWidth = window.innerWidth || 1440;
    const screenHeight = window.innerHeight || 900;

    // 🖱️ Fireworks-JS Mouse Following Logic:
    // As cursor moves across screen, launch rockets homing directly onto cursor!
    if (this.mouseFollow && this.mouse && this.mouse.x > 0 && this.mouse.y > 0) {
      this.mouseMoveCooldown -= dt;
      const mouseMoved = Math.hypot(this.mouse.x - this.lastMouseX, this.mouse.y - this.lastMouseY) > 8;

      if (mouseMoved) {
        this.lastMouseX = this.mouse.x;
        this.lastMouseY = this.mouse.y;

        // Launch mouse-following rocket if cooldown passed and fewer than 3 active rockets
        if (this.mouseMoveCooldown <= 0 && this.rockets.length < 3) {
          this.mouseMoveCooldown = 22; // ~360ms between mouse-following rockets
          this.blastAt(this.mouse.x, this.mouse.y);
        }
      }
    }

    // 0. Update ambient drifting golden stardust particles
    for (const st of this.ambientStardust) {
      st.phase += 0.03 * dt;
      st.x += (st.vx + Math.sin(st.phase) * 0.12) * dt;
      st.y += st.vy * dt;

      if (st.y < -10) {
        st.y = screenHeight + 5;
        st.x = Math.random() * screenWidth;
      }
      if (st.x < -10) st.x = screenWidth + 5;
      if (st.x > screenWidth + 10) st.x = -5;
    }

    // 1. Update ascending rockets (Fast vector math like fireworks-js Trace)
    for (let i = this.rockets.length - 1; i >= 0; i--) {
      const r = this.rockets[i];

      // Dynamic homing steering towards current mouse position
      if (r.homing && this.mouse && this.mouse.x > 0) {
        r.targetX = this.mouse.x;
        r.targetY = this.mouse.y;
        const dx = r.targetX - r.x;
        const dy = r.targetY - r.y;
        const desiredAngle = Math.atan2(dy, dx);
        let angleDiff = desiredAngle - r.angle;
        while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
        while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
        r.angle += angleDiff * Math.min(0.14 * dt, 1);
        r.totalDistance = Math.hypot(r.targetX - r.startX, r.targetY - r.startY);
      }

      r.coords.pop();
      r.coords.unshift([r.x, r.y]);

      r.speed *= Math.min(1.05, 1 + (r.acceleration - 1) * dt);
      const vx = Math.cos(r.angle) * r.speed;
      const vy = Math.sin(r.angle) * r.speed;

      r.x += vx * dt;
      r.y += vy * dt;
      r.currentDistance = Math.hypot(r.x - r.startX, r.y - r.startY);

      const distToTarget = Math.hypot(r.targetX - r.x, r.targetY - r.y);
      if (r.currentDistance >= r.totalDistance || distToTarget <= 24 || r.y <= r.targetY) {
        this.explodeRocket(r);
        this.rockets.splice(i, 1);
      }
    }

    // 2. Update burst sparks (Ultra fast linear drag & gravity, 0 Math.pow)
    const normalDrag = Math.max(0.85, 1 - (1 - 0.95) * dt);
    const driftDrag = Math.max(0.92, 1 - (1 - 0.985) * dt);
    const grav = this.options.gravity * dt;
    const speed = this.options.speed * dt;

    for (let i = this.activeSparks.length - 1; i >= 0; i--) {
      const spark = this.activeSparks[i];
      spark.prevX = spark.x;
      spark.prevY = spark.y;

      const isDrift = spark.customData?.drifting;
      const dragFactor = isDrift ? driftDrag : normalDrag;

      spark.vx *= dragFactor;
      spark.vy = spark.vy * dragFactor + (isDrift ? 0.02 * dt : grav);
      spark.x += spark.vx * speed;
      spark.y += spark.vy * speed;
      spark.life += dt;

      spark.alpha = Math.max(0, 1 - spark.life / spark.maxLife);

      if (spark.life >= spark.maxLife || spark.alpha <= 0.01) {
        this.pool.release(spark);
        this.activeSparks.splice(i, 1);
      }
    }

    if (this.activeSparks.length > 400) {
      const excess = this.activeSparks.length - 400;
      for (let k = 0; k < excess; k++) {
        const s = this.activeSparks.shift();
        if (s) this.pool.release(s);
      }
    }
  }

  private explodeRocket(rocket: Rocket): void {
    if (this.options.sound) {
      this.sound.playExplosion();
    }

    let count = this.options.burstParticles;
    if (this.reducedMotion) count = Math.round(count * 0.35);
    else if (this.lowEndMode) count = Math.round(count * 0.55);

    const baseColor = rocket.color;
    const secondaryColor = this.options.colors[Math.floor(Math.random() * this.options.colors.length)];
    const patternType = Math.floor(Math.random() * 4);

    if (patternType === 1) {
      // 🌿 Weeping Willow (Kamuro)
      for (let i = 0; i < count; i++) {
        const spark = this.pool.acquire();
        const angle = Math.random() * Math.PI * 2;
        const velocity = (2.5 + Math.random() * 4.5) * this.options.spread;

        spark.x = rocket.x;
        spark.y = rocket.y;
        spark.prevX = rocket.x;
        spark.prevY = rocket.y;
        spark.vx = Math.cos(angle) * velocity;
        spark.vy = Math.sin(angle) * velocity;
        spark.color = Math.random() > 0.3 ? '#FFD700' : '#FFF9C4';
        spark.size = 2.0;
        spark.initialSize = spark.size;
        spark.alpha = 1;
        spark.maxLife = 65 + Math.random() * 35;
        spark.drag = 0.975;
        this.activeSparks.push(spark);
      }
    } else if (patternType === 2) {
      // ⭕ Saturn Ring
      for (let i = 0; i < count; i++) {
        const spark = this.pool.acquire();
        const isCore = i < count * 0.25;
        const angle = isCore ? Math.random() * Math.PI * 2 : (i / count) * Math.PI * 2;
        const velocity = isCore ? (1.2 + Math.random() * 2) : 4.5;

        spark.x = rocket.x;
        spark.y = rocket.y;
        spark.prevX = rocket.x;
        spark.prevY = rocket.y;
        spark.vx = Math.cos(angle) * velocity;
        spark.vy = Math.sin(angle) * velocity;
        spark.color = isCore ? secondaryColor : baseColor;
        spark.size = 2.0;
        spark.initialSize = spark.size;
        spark.alpha = 1;
        spark.maxLife = 48 + Math.random() * 20;
        spark.drag = 0.94;
        this.activeSparks.push(spark);
      }
    } else {
      // 🌸 Chrysanthemum
      for (let i = 0; i < count; i++) {
        const spark = this.pool.acquire();
        const angle = Math.random() * Math.PI * 2;
        const velocity = (2.0 + Math.random() * 4.0) * this.options.spread;

        spark.x = rocket.x;
        spark.y = rocket.y;
        spark.prevX = rocket.x;
        spark.prevY = rocket.y;
        spark.vx = Math.cos(angle) * velocity;
        spark.vy = Math.sin(angle) * velocity;
        spark.color = i % 2 === 0 ? baseColor : secondaryColor;
        spark.size = 2.0;
        spark.initialSize = spark.size;
        spark.alpha = 1;
        spark.maxLife = 45 + Math.random() * 28;
        spark.drag = 0.95;
        this.activeSparks.push(spark);
      }
    }

    // Drifting Golden Embers across sky
    for (let d = 0; d < 12; d++) {
      const spark = this.pool.acquire();
      const angle = Math.random() * Math.PI * 2;
      const velocity = 1.5 + Math.random() * 5.0;

      spark.x = rocket.x;
      spark.y = rocket.y;
      spark.prevX = rocket.x;
      spark.prevY = rocket.y;
      spark.vx = Math.cos(angle) * velocity;
      spark.vy = Math.sin(angle) * velocity * 0.4 - 0.3;
      spark.color = '#FFD700';
      spark.size = 1.2;
      spark.initialSize = spark.size;
      spark.alpha = 0.85;
      spark.maxLife = 75 + Math.random() * 40;
      spark.drag = 0.985;
      spark.customData = { drifting: true };
      this.activeSparks.push(spark);
    }
  }

  public render(ctx: CanvasRenderingContext2D): void {
    ctx.save();

    // 0. Ambient stardust
    ctx.fillStyle = '#FFD54F';
    for (const st of this.ambientStardust) {
      ctx.globalAlpha = st.alpha;
      ctx.beginPath();
      ctx.arc(st.x, st.y, st.size, 0, Math.PI * 2);
      ctx.fill();
    }

    // 1. Ascending rockets with clean stroke trail (Exactly like fireworks-js Trace)
    ctx.lineCap = 'round';
    for (const r of this.rockets) {
      const lastIndex = r.coords.length - 1;
      const tailX = r.coords[lastIndex][0];
      const tailY = r.coords[lastIndex][1];

      // Rocket streak trail
      ctx.strokeStyle = r.color;
      ctx.lineWidth = 2.5;
      ctx.globalAlpha = 0.85;
      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(r.x, r.y);
      ctx.stroke();

      // Bright glowing head
      ctx.fillStyle = '#FFFFFF';
      ctx.globalAlpha = 1;
      ctx.beginPath();
      ctx.arc(r.x, r.y, 2.2, 0, Math.PI * 2);
      ctx.fill();
    }

    // 2. Burst Sparks (Fast additive line segments like fireworks-js Explosion)
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineWidth = 1.8;
    for (const s of this.activeSparks) {
      ctx.globalAlpha = s.alpha;
      ctx.strokeStyle = s.color;

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
    this.rockets = [];
    this.stopLoop();
  }
}
