import { LanternsOptions } from '../types';

interface Lantern {
  x: number;
  y: number;
  baseX: number;
  width: number;
  height: number;
  vy: number;
  swayPhase: number;
  swaySpeed: number;
  swayAmplitude: number;
  paletteIndex: number;
  depth: number;
  currentAlpha: number;
  targetAlpha: number;
}

const LANTERN_PALETTES = [
  { body: '#FFA726', dark: '#E65100' },
  { body: '#FF7043', dark: '#BF360C' },
  { body: '#FFCA28', dark: '#FF8F00' },
  { body: '#EF5350', dark: '#C62828' },
];

export class LanternsRenderer {
  private lanterns: Lantern[] = [];
  private options: Required<LanternsOptions>;
  private spriteCanvases: HTMLCanvasElement[] = [];

  constructor(options?: LanternsOptions) {
    this.options = {
      container: options?.container ?? null,
      canvas: options?.canvas ?? null,
      zIndex: options?.zIndex ?? 9999,
      sound: options?.sound ?? false,
      volume: options?.volume ?? 0.3,
      reducedMotion: options?.reducedMotion ?? true,
      speed: options?.speed ?? 1,
      scale: options?.scale ?? 1,
      count: options?.count ?? 5,
      speedMultiplier: options?.speed ?? 1,
      sway: options?.sway ?? 1.5,
      size: options?.size ?? 36,
      glow: options?.glow ?? 1,
      continuous: options?.continuous ?? true,
      position: options?.position ?? 'full',
    } as unknown as Required<LanternsOptions>;

    this.preRenderSprites();
  }

  private preRenderSprites(): void {
    if (typeof document === 'undefined') return;

    this.spriteCanvases = [];
    const baseW = 60;
    const baseH = 80;
    const pad = 35;
    const totalW = baseW + pad * 2;
    const totalH = baseH + pad * 2;
    const cx = totalW / 2;
    const cy = totalH / 2;

    for (let p = 0; p < LANTERN_PALETTES.length; p++) {
      const palette = LANTERN_PALETTES[p];
      const cvs = document.createElement('canvas');
      cvs.width = totalW;
      cvs.height = totalH;
      const ctx = cvs.getContext('2d');
      if (!ctx) continue;

      // 1. Warm outer glow
      const aura = ctx.createRadialGradient(cx, cy, 4, cx, cy, 45);
      aura.addColorStop(0, 'rgba(255, 180, 50, 0.45)');
      aura.addColorStop(0.5, 'rgba(255, 100, 20, 0.16)');
      aura.addColorStop(1, 'rgba(255, 80, 0, 0)');
      ctx.fillStyle = aura;
      ctx.beginPath();
      ctx.arc(cx, cy, 45, 0, Math.PI * 2);
      ctx.fill();

      // 2. Paper lantern body
      const paperGrad = ctx.createLinearGradient(cx - baseW / 2, cy - baseH / 2, cx + baseW / 2, cy + baseH / 2);
      paperGrad.addColorStop(0, '#FFF176');
      paperGrad.addColorStop(0.4, palette.body);
      paperGrad.addColorStop(1, palette.dark);

      ctx.fillStyle = paperGrad;
      const corner = baseW * 0.2;
      ctx.beginPath();
      ctx.roundRect(cx - baseW / 2, cy - baseH / 2, baseW, baseH, [corner, corner, corner * 0.4, corner * 0.4]);
      ctx.fill();

      // Bamboo ring
      ctx.strokeStyle = '#5D4037';
      ctx.lineWidth = 2;
      ctx.strokeRect(cx - baseW * 0.4, cy + baseH / 2 - 3, baseW * 0.8, 4);

      // Inner flame
      const flameGrad = ctx.createRadialGradient(cx, cy + baseH * 0.22, 0, cx, cy + baseH * 0.22, baseW * 0.35);
      flameGrad.addColorStop(0, '#FFFFFF');
      flameGrad.addColorStop(0.4, '#FFE082');
      flameGrad.addColorStop(1, 'rgba(255, 160, 0, 0)');
      ctx.fillStyle = flameGrad;
      ctx.beginPath();
      ctx.arc(cx, cy + baseH * 0.22, baseW * 0.35, 0, Math.PI * 2);
      ctx.fill();

      this.spriteCanvases.push(cvs);
    }
  }

  public init(width: number, height: number): void {
    this.lanterns = [];
    for (let i = 0; i < this.options.count; i++) {
      this.lanterns.push(this.createLantern(width, height, true));
    }
  }

  private createLantern(width: number, height: number, initialScatter = false): Lantern {
    const depth = 0.45 + Math.random() * 0.55;
    const baseW = this.options.size * this.options.scale * depth;
    const baseH = baseW * 1.35;
    const paletteIndex = Math.floor(Math.random() * LANTERN_PALETTES.length);

    const x = Math.random() * width;
    const maxY = this.options.position === 'sky' ? height * 0.55 : height;
    const y = initialScatter ? Math.random() * maxY : height + baseH + Math.random() * 80;

    return {
      x,
      y,
      baseX: x,
      width: baseW,
      height: baseH,
      vy: (-0.35 - Math.random() * 0.45) * this.options.speed * depth,
      swayPhase: Math.random() * Math.PI * 2,
      swaySpeed: (0.012 + Math.random() * 0.014) * this.options.speed,
      swayAmplitude: (14 + Math.random() * 20) * this.options.sway * depth,
      paletteIndex,
      depth,
      currentAlpha: 1.0,
      targetAlpha: 1.0,
    };
  }

  public update(width: number, height: number, mouseX = -999, mouseY = -999, dt = 1): void {
    for (let i = 0; i < this.lanterns.length; i++) {
      const l = this.lanterns[i];
      l.swayPhase += l.swaySpeed * dt;
      l.x = l.baseX + Math.sin(l.swayPhase) * l.swayAmplitude;
      l.y += l.vy * dt;

      // Mouse proximity transparency
      const dist = Math.hypot(mouseX - l.x, mouseY - l.y);
      const fadeRadius = 90 * l.depth;
      if (dist < fadeRadius) {
        const factor = Math.max(0, dist / fadeRadius);
        l.targetAlpha = 0.08 + factor * 0.92;
      } else {
        l.targetAlpha = 1.0;
      }
      l.currentAlpha += (l.targetAlpha - l.currentAlpha) * Math.min(0.25 * dt, 1);

      if (l.y < -l.height * 2) {
        if (this.options.continuous) {
          this.lanterns[i] = this.createLantern(width, height, false);
        } else {
          this.lanterns.splice(i, 1);
          i--;
        }
      }
    }
  }

  public render(ctx: CanvasRenderingContext2D): void {
    if (this.spriteCanvases.length === 0) return;

    ctx.save();
    for (const l of this.lanterns) {
      if (l.currentAlpha <= 0.02) continue;

      const sprite = this.spriteCanvases[l.paletteIndex];
      if (!sprite) continue;

      ctx.save();
      ctx.globalAlpha = 0.88 * l.depth * l.currentAlpha;
      const drawW = l.width * 2.1;
      const drawH = l.height * 1.85;
      ctx.drawImage(sprite, l.x - drawW / 2, l.y - drawH / 2, drawW, drawH);
      ctx.restore();
    }
    ctx.restore();
  }

  public clear(): void {
    this.lanterns = [];
  }
}
