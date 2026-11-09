export interface HangingLantern {
  baseX: number;
  x: number;
  y: number;
  stringLength: number;
  width: number;
  height: number;
  swayPhase: number;
  swaySpeed: number;
  swayMaxAngle: number;
  swayAngle: number;
  glowPhase: number;
  paletteIndex: number;
  primaryColor: string;
  accentColor: string;
  currentAlpha: number;
  targetAlpha: number;
}

const HANGING_PALETTES = [
  { primary: '#FF5722', accent: '#FFD700' }, // Saffron Red & Gold
  { primary: '#FF9800', accent: '#FFF59D' }, // Amber Orange & Bright Yellow
  { primary: '#E91E63', accent: '#FFEB3B' }, // Festive Magenta & Golden
  { primary: '#9C27B0', accent: '#FFD54F' }, // Royal Purple & Gold
  { primary: '#00BCD4', accent: '#FFE082' }, // Turquoise & Gold
];

export class HangingLanternsRenderer {
  private lanterns: HangingLantern[] = [];
  private count = 6;
  private fadeRadius = 170;
  private spriteCanvases: HTMLCanvasElement[] = [];

  constructor(count = 6) {
    this.count = count;
    this.preRenderSprites();
  }

  private preRenderSprites(): void {
    if (typeof document === 'undefined') return;
    this.spriteCanvases = [];

    const baseW = 44;
    const h = baseW * 1.35;
    const totalW = baseW + 24;
    const totalH = h + 24;
    const halfW = baseW * 0.5;
    const cx = totalW / 2;
    const cy = 12;

    for (let p = 0; p < HANGING_PALETTES.length; p++) {
      const pal = HANGING_PALETTES[p];
      const cvs = document.createElement('canvas');
      cvs.width = totalW;
      cvs.height = totalH;
      const ctx = cvs.getContext('2d');
      if (!ctx) continue;

      // Glow
      ctx.fillStyle = 'rgba(255, 150, 0, 0.25)';
      ctx.beginPath();
      ctx.arc(cx, cy + h * 0.45, halfW * 1.3, 0, Math.PI * 2);
      ctx.fill();

      // Outer paper body
      const bodyGrad = ctx.createLinearGradient(cx - halfW, cy, cx + halfW, cy + h);
      bodyGrad.addColorStop(0, pal.primary);
      bodyGrad.addColorStop(0.5, pal.accent);
      bodyGrad.addColorStop(1, pal.primary);

      ctx.fillStyle = bodyGrad;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + halfW, cy + h * 0.45);
      ctx.lineTo(cx + halfW * 0.5, cy + h);
      ctx.lineTo(cx - halfW * 0.5, cy + h);
      ctx.lineTo(cx - halfW, cy + h * 0.45);
      ctx.closePath();
      ctx.fill();

      // Top collar & ring
      ctx.fillStyle = '#FFA000';
      ctx.fillRect(cx - halfW * 0.35, cy - 5, halfW * 0.7, 5);
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.arc(cx, cy - 6, 3.5, 0, Math.PI * 2);
      ctx.fill();

      // Inner flame glow
      const innerGrad = ctx.createRadialGradient(cx, cy + h * 0.45, 2, cx, cy + h * 0.45, halfW * 0.7);
      innerGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
      innerGrad.addColorStop(0.4, 'rgba(255, 235, 59, 0.75)');
      innerGrad.addColorStop(1, 'rgba(255, 152, 0, 0)');

      ctx.fillStyle = innerGrad;
      ctx.beginPath();
      ctx.arc(cx, cy + h * 0.45, halfW * 0.7, 0, Math.PI * 2);
      ctx.fill();

      this.spriteCanvases.push(cvs);
    }
  }

  public init(width: number): void {
    this.lanterns = [];
    const spacing = width / (this.count + 1);

    for (let i = 0; i < this.count; i++) {
      const baseX = spacing * (i + 1);
      const paletteIndex = i % HANGING_PALETTES.length;
      const palette = HANGING_PALETTES[paletteIndex];
      const stringLength = 35 + (i % 3) * 16 + Math.random() * 8;
      const width = 40;
      const height = width * 1.35;

      this.lanterns.push({
        baseX,
        x: baseX,
        y: stringLength,
        stringLength,
        width,
        height,
        swayPhase: (i / this.count) * Math.PI * 2 + Math.random(),
        swaySpeed: 0.016 + Math.random() * 0.010,
        swayMaxAngle: 0.07 + Math.random() * 0.05,
        swayAngle: 0,
        glowPhase: Math.random() * Math.PI * 2,
        paletteIndex,
        primaryColor: palette.primary,
        accentColor: palette.accent,
        currentAlpha: 1.0,
        targetAlpha: 1.0,
      });
    }
  }

  public update(mouseX: number, mouseY: number, dt = 1): void {
    for (const l of this.lanterns) {
      l.swayPhase += l.swaySpeed * dt;
      l.swayAngle = Math.sin(l.swayPhase) * l.swayMaxAngle;
      l.glowPhase += 0.05 * dt;

      l.x = l.baseX + Math.sin(l.swayAngle) * l.stringLength;
      l.y = Math.cos(l.swayAngle) * l.stringLength;

      const dist = Math.hypot(mouseX - l.x, mouseY - (l.y + l.height * 0.5));
      if (dist < this.fadeRadius) {
        const factor = Math.max(0.06, dist / this.fadeRadius);
        l.targetAlpha = factor * factor;
        const pushX = (l.x - mouseX) / (this.fadeRadius || 1);
        l.swayAngle += pushX * 0.005 * dt;
      } else {
        l.targetAlpha = 1.0;
      }

      l.currentAlpha += (l.targetAlpha - l.currentAlpha) * Math.min(0.2 * dt, 1);
    }
  }

  public render(ctx: CanvasRenderingContext2D): void {
    if (this.spriteCanvases.length === 0) return;

    ctx.save();
    for (const l of this.lanterns) {
      if (l.currentAlpha <= 0.01) continue;

      ctx.save();
      ctx.globalAlpha = l.currentAlpha;

      // 1. Suspension string
      ctx.strokeStyle = 'rgba(255, 215, 0, 0.45)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(l.baseX, 0);
      ctx.lineTo(l.x, l.y);
      ctx.stroke();

      ctx.translate(l.x, l.y);
      ctx.rotate(l.swayAngle);

      // 2. Pre-rendered sprite body (Ultra fast drawImage!)
      const sprite = this.spriteCanvases[l.paletteIndex];
      if (sprite) {
        const sw = l.width + 24;
        const sh = l.height + 24;
        ctx.drawImage(sprite, -sw / 2, -6, sw, sh);
      }

      // 3. Tassels
      ctx.strokeStyle = l.accentColor;
      ctx.lineWidth = 1.4;
      const halfW = l.width * 0.5;
      const ty = l.height;
      const wave = Math.sin(l.swayPhase * 1.3) * 5;

      ctx.beginPath();
      ctx.moveTo(-halfW * 0.3, ty);
      ctx.quadraticCurveTo(-halfW * 0.15, ty + 10, -halfW * 0.3 + wave, ty + 20);
      ctx.moveTo(0, ty);
      ctx.quadraticCurveTo(wave * 0.5, ty + 11, wave, ty + 22);
      ctx.moveTo(halfW * 0.3, ty);
      ctx.quadraticCurveTo(halfW * 0.15, ty + 10, halfW * 0.3 + wave, ty + 20);
      ctx.stroke();

      ctx.restore();
    }
    ctx.restore();
  }

  public clear(): void {
    this.lanterns = [];
  }
}
