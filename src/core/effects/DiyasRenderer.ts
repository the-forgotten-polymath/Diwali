import { DiyasOptions } from '../types';

interface DiyaInstance {
  x: number;
  y: number;
  baseY: number;
  scale: number;
  flamePhase: number;
  flickerSpeed: number;
  floatPhase: number;
  floatSpeed: number;
}

export class DiyasRenderer {
  private diyas: DiyaInstance[] = [];
  private options: Required<Omit<DiyasOptions, 'clearCorners'>> & { clearCorners: boolean | number };
  private offscreenDiya: HTMLCanvasElement | null = null;
  private diyaW = 60;
  private diyaH = 50;

  constructor(options?: DiyasOptions) {
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
      count: options?.count ?? 5,
      mode: options?.mode ?? 'docked',
      positions: options?.positions ?? [],
      flickerSpeed: options?.flickerSpeed ?? 1,
      glowIntensity: options?.glowIntensity ?? 1,
      smoke: options?.smoke ?? false, // Disabled by default for maximum 120 FPS smoothness
      clearCorners: options?.clearCorners ?? false,
    };

    this.createOffscreenDiya(this.options.scale);
  }

  private createOffscreenDiya(scale: number): void {
    if (typeof document === 'undefined') return;

    const s = scale;
    const w = Math.ceil(70 * s);
    const h = Math.ceil(65 * s);
    this.diyaW = w;
    this.diyaH = h;

    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    const ctx = c.getContext('2d');
    if (!ctx) return;

    const cx = w / 2;
    const cy = h - 14 * s;

    // 1. Warm ambient glow aura
    const aura = ctx.createRadialGradient(cx, cy - 14 * s, 2, cx, cy - 14 * s, 30 * s);
    aura.addColorStop(0, 'rgba(255, 179, 0, 0.45)');
    aura.addColorStop(0.5, 'rgba(255, 109, 0, 0.15)');
    aura.addColorStop(1, 'rgba(255, 87, 34, 0)');
    ctx.fillStyle = aura;
    ctx.beginPath();
    ctx.arc(cx, cy - 14 * s, 30 * s, 0, Math.PI * 2);
    ctx.fill();

    // 2. Terracotta Clay Bowl Body
    const bowlGrad = ctx.createLinearGradient(cx, cy - 6 * s, cx, cy + 14 * s);
    bowlGrad.addColorStop(0, '#D95D28');
    bowlGrad.addColorStop(0.6, '#A73812');
    bowlGrad.addColorStop(1, '#661F04');
    ctx.fillStyle = bowlGrad;
    ctx.beginPath();
    ctx.moveTo(cx - 22 * s, cy);
    ctx.bezierCurveTo(cx - 20 * s, cy + 14 * s, cx + 20 * s, cy + 14 * s, cx + 22 * s, cy);
    ctx.bezierCurveTo(cx + 15 * s, cy + 4 * s, cx - 15 * s, cy + 4 * s, cx - 22 * s, cy);
    ctx.fill();

    // 3. Polished Rim
    const rimGrad = ctx.createLinearGradient(cx - 22 * s, 0, cx + 22 * s, 0);
    rimGrad.addColorStop(0, '#8A2D09');
    rimGrad.addColorStop(0.5, '#F9A825');
    rimGrad.addColorStop(1, '#8A2D09');
    ctx.strokeStyle = rimGrad;
    ctx.lineWidth = 2.4 * s;
    ctx.beginPath();
    ctx.ellipse(cx, cy, 22 * s, 5 * s, 0, 0, Math.PI * 2);
    ctx.stroke();

    // 4. Inner Oil Pool
    const oilGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 18 * s);
    oilGrad.addColorStop(0, '#FFE082');
    oilGrad.addColorStop(0.7, '#D35400');
    oilGrad.addColorStop(1, '#78281F');
    ctx.fillStyle = oilGrad;
    ctx.beginPath();
    ctx.ellipse(cx, cy, 18 * s, 4.5 * s, 0, 0, Math.PI * 2);
    ctx.fill();

    // 5. Cotton Wick
    ctx.strokeStyle = '#2C3E50';
    ctx.lineWidth = 2 * s;
    ctx.beginPath();
    ctx.moveTo(cx, cy + 1 * s);
    ctx.lineTo(cx, cy - 6 * s);
    ctx.stroke();

    // 6. Dual-Layer Teardrop Flame (Baked in offscreen canvas)
    // Outer Saffron Flame
    const outerFlame = ctx.createLinearGradient(cx, cy - 6 * s, cx, cy - 30 * s);
    outerFlame.addColorStop(0, '#FF4500');
    outerFlame.addColorStop(0.35, '#FF8C00');
    outerFlame.addColorStop(0.85, '#FFD700');
    outerFlame.addColorStop(1, 'rgba(255, 240, 180, 0.9)');
    ctx.fillStyle = outerFlame;
    ctx.beginPath();
    ctx.moveTo(cx - 5.5 * s, cy - 6 * s);
    ctx.bezierCurveTo(cx - 7 * s, cy - 12 * s, cx - 2 * s, cy - 25 * s, cx, cy - 30 * s);
    ctx.bezierCurveTo(cx + 2 * s, cy - 25 * s, cx + 7 * s, cy - 12 * s, cx + 5.5 * s, cy - 6 * s);
    ctx.closePath();
    ctx.fill();

    // Inner White-Hot Core
    const innerFlame = ctx.createLinearGradient(cx, cy - 6 * s, cx, cy - 22 * s);
    innerFlame.addColorStop(0, '#00E5FF');
    innerFlame.addColorStop(0.25, '#FFFFFF');
    innerFlame.addColorStop(1, '#FFF59D');
    ctx.fillStyle = innerFlame;
    ctx.beginPath();
    ctx.moveTo(cx - 2.8 * s, cy - 6 * s);
    ctx.bezierCurveTo(cx - 3.5 * s, cy - 10 * s, cx - 1 * s, cy - 18 * s, cx, cy - 22 * s);
    ctx.bezierCurveTo(cx + 1 * s, cy - 18 * s, cx + 3.5 * s, cy - 10 * s, cx + 2.8 * s, cy - 6 * s);
    ctx.closePath();
    ctx.fill();

    this.offscreenDiya = c;
  }

  public init(width: number, height: number): void {
    this.diyas = [];
    this.createOffscreenDiya(this.options.scale);
    const count = this.options.count;

    if (this.options.mode === 'custom' && this.options.positions.length > 0) {
      for (const pos of this.options.positions) {
        this.diyas.push({
          x: pos.x,
          y: pos.y,
          baseY: pos.y,
          scale: this.options.scale,
          flamePhase: Math.random() * Math.PI * 2,
          flickerSpeed: (0.08 + Math.random() * 0.05) * this.options.flickerSpeed,
          floatPhase: Math.random() * Math.PI * 2,
          floatSpeed: 0.02 + Math.random() * 0.02,
        });
      }
      return;
    }

    const spacing = width / (count + 1);
    const clearSlots = typeof this.options.clearCorners === 'number'
      ? this.options.clearCorners
      : (this.options.clearCorners ? 1 : 0);

    for (let i = 0; i < count; i++) {
      if (clearSlots > 0 && (i < clearSlots || i >= count - clearSlots)) {
        continue;
      }

      const x = spacing * (i + 1);
      const isDocked = this.options.mode === 'docked';
      const y = isDocked ? height - 34 * this.options.scale : height * 0.75 + (Math.sin(i) * 20);

      this.diyas.push({
        x,
        y,
        baseY: y,
        scale: this.options.scale,
        flamePhase: Math.random() * Math.PI * 2,
        flickerSpeed: (0.07 + Math.random() * 0.04) * this.options.flickerSpeed,
        floatPhase: (i / count) * Math.PI * 2,
        floatSpeed: 0.02 + Math.random() * 0.015,
      });
    }
  }

  public update(_width: number, _height: number, dt = 1): void {
    const isFloating = this.options.mode === 'floating';

    for (const diya of this.diyas) {
      diya.flamePhase += diya.flickerSpeed * this.options.speed * dt;
      if (isFloating) {
        diya.floatPhase += diya.floatSpeed * this.options.speed * dt;
        diya.y = diya.baseY + Math.sin(diya.floatPhase) * 6;
      }
    }
  }

  public render(ctx: CanvasRenderingContext2D): void {
    if (!this.offscreenDiya) return;

    ctx.save();
    const halfW = this.diyaW / 2;
    const baseH = this.diyaH;

    // Ultra fast single drawImage per diya! (Zero gradients, zero paths in render loop)
    for (const diya of this.diyas) {
      const flicker = Math.sin(diya.flamePhase) * 0.08;
      const flickerH = baseH * (1 + flicker);
      ctx.drawImage(
        this.offscreenDiya,
        diya.x - halfW,
        diya.y - flickerH + 14 * diya.scale,
        this.diyaW,
        flickerH
      );
    }

    ctx.restore();
  }

  public clear(): void {
    this.diyas = [];
  }
}
