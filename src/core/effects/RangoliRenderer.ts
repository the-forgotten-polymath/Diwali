export interface RangoliOptions {
  scale?: number;
  x?: number;
  y?: number;
  radiusX?: number;
  radiusY?: number;
}

export class RangoliRenderer {
  private scale = 1.0;
  private x = 0;
  private y = 0;
  private radiusX = 68;
  private radiusY = 34;
  private nativeR = 56;
  private offscreenCanvas: HTMLCanvasElement | null = null;
  private flamePhase = 0;
  private options?: RangoliOptions;

  constructor(options?: RangoliOptions) {
    this.options = options;
    this.scale = options?.scale ?? 1.0;
    this.radiusX = Math.round((options?.radiusX ?? 68) * this.scale);
    this.radiusY = Math.round((options?.radiusY ?? 34) * this.scale);
  }

  public init(width: number, height: number): void {
    const s = this.scale;
    this.radiusX = Math.round((this.options?.radiusX ?? 68) * s);
    this.radiusY = Math.round((this.options?.radiusY ?? 34) * s);

    // Positioned safely in bottom-right corner, lying horizontally on the floor
    // Entire oval stays comfortably inside the screen with zero clipping
    const totalPadY = 16 * s;
    const totalPadX = 24 * s;
    this.x = this.options?.x ?? (width - this.radiusX - totalPadX);
    this.y = this.options?.y ?? (height - this.radiusY - totalPadY);

    this.preRenderRangoli();
  }

  private preRenderRangoli(): void {
    if (typeof document === 'undefined') return;

    const r = this.nativeR;
    const pad = 14;
    const size = Math.ceil((r + pad) * 2);
    const cx = size / 2;
    const cy = size / 2;

    this.offscreenCanvas = document.createElement('canvas');
    this.offscreenCanvas.width = size;
    this.offscreenCanvas.height = size;

    const ctx = this.offscreenCanvas.getContext('2d');
    if (!ctx) return;

    // 1. Soft Floor Shadow (gives natural grounded 3D depth on the floor)
    const shadowGrad = ctx.createRadialGradient(cx, cy, r * 0.45, cx, cy, r + 8);
    shadowGrad.addColorStop(0, 'rgba(0, 0, 0, 0.46)');
    shadowGrad.addColorStop(0.7, 'rgba(0, 0, 0, 0.18)');
    shadowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = shadowGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, r + 8, 0, Math.PI * 2);
    ctx.fill();

    // 2. Auspicious Brick-Terracotta Floor Disc
    ctx.fillStyle = '#6E1B00'; // Deep auspicious temple terracotta
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.98, 0, Math.PI * 2);
    ctx.fill();

    // White rice flour fine outer scalloped border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.lineWidth = 1.6;
    ctx.stroke();

    // 3. Layer 1: Outer Curved Lotus Petals (16 Plump, Organic Kamal Petals)
    const petals = 16;
    const dAngle = (Math.PI * 2) / petals;

    for (let i = 0; i < petals; i++) {
      const startAngle = i * dAngle;
      const midAngle = startAngle + dAngle / 2;
      const endAngle = startAngle + dAngle;

      const baseR = r * 0.64;
      const tipR = i % 2 === 0 ? r * 0.96 : r * 0.88;
      const bulgeR = r * 0.82;

      const p1x = cx + Math.cos(startAngle) * baseR;
      const p1y = cy + Math.sin(startAngle) * baseR;

      const tipX = cx + Math.cos(midAngle) * tipR;
      const tipY = cy + Math.sin(midAngle) * tipR;

      const p2x = cx + Math.cos(endAngle) * baseR;
      const p2y = cy + Math.sin(endAngle) * baseR;

      // Curved control points for plump, natural lotus petals
      const cp1x = cx + Math.cos(startAngle + dAngle * 0.22) * bulgeR;
      const cp1y = cy + Math.sin(startAngle + dAngle * 0.22) * bulgeR;
      const cp2x = cx + Math.cos(midAngle - dAngle * 0.08) * (tipR * 0.98);
      const cp2y = cy + Math.sin(midAngle - dAngle * 0.08) * (tipR * 0.98);

      const cp3x = cx + Math.cos(midAngle + dAngle * 0.08) * (tipR * 0.98);
      const cp3y = cy + Math.sin(midAngle + dAngle * 0.08) * (tipR * 0.98);
      const cp4x = cx + Math.cos(endAngle - dAngle * 0.22) * bulgeR;
      const cp4y = cy + Math.sin(endAngle - dAngle * 0.22) * bulgeR;

      // Auspicious Sindoor Red & Vermilion Orange gradients
      const petalGrad = ctx.createRadialGradient(cx, cy, baseR * 0.8, tipX, tipY, r * 0.4);
      if (i % 2 === 0) {
        petalGrad.addColorStop(0, '#B71C1C'); // Deep Kumkum red
        petalGrad.addColorStop(0.5, '#E91E63'); // Vibrant rose pink
        petalGrad.addColorStop(1, '#FF80AB');
      } else {
        petalGrad.addColorStop(0, '#E65100'); // Deep saffron
        petalGrad.addColorStop(0.6, '#FF9800'); // Auspicious orange
        petalGrad.addColorStop(1, '#FFE082'); // Golden yellow tip
      }

      ctx.fillStyle = petalGrad;
      ctx.beginPath();
      ctx.moveTo(p1x, p1y);
      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, tipX, tipY);
      ctx.bezierCurveTo(cp3x, cp3y, cp4x, cp4y, p2x, p2y);
      ctx.closePath();
      ctx.fill();

      // Delicate white rice-powder filigree border on each lotus petal
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.lineWidth = 1.0;
      ctx.stroke();

      // Pearl Kolam drop at each petal apex
      const dotX = cx + Math.cos(midAngle) * (tipR * 0.92);
      const dotY = cy + Math.sin(midAngle) * (tipR * 0.92);
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(dotX, dotY, 1.3, 0, Math.PI * 2);
      ctx.fill();
    }

    // 4. Layer 2: Middle Golden Marigold Flower Ring (16 nested inner petals)
    for (let i = 0; i < petals; i++) {
      const midAngle = (i + 0.5) * dAngle;
      const startAngle = i * dAngle;
      const endAngle = (i + 1) * dAngle;

      const innerBaseR = r * 0.44;
      const innerTipR = r * 0.65;
      const innerBulgeR = r * 0.56;

      const p1x = cx + Math.cos(startAngle) * innerBaseR;
      const p1y = cy + Math.sin(startAngle) * innerBaseR;
      const tipX = cx + Math.cos(midAngle) * innerTipR;
      const tipY = cy + Math.sin(midAngle) * innerTipR;
      const p2x = cx + Math.cos(endAngle) * innerBaseR;
      const p2y = cy + Math.sin(endAngle) * innerBaseR;

      const cp1x = cx + Math.cos(startAngle + dAngle * 0.25) * innerBulgeR;
      const cp1y = cy + Math.sin(startAngle + dAngle * 0.25) * innerBulgeR;
      const cp2x = cx + Math.cos(endAngle - dAngle * 0.25) * innerBulgeR;
      const cp2y = cy + Math.sin(endAngle - dAngle * 0.25) * innerBulgeR;

      ctx.fillStyle = (i % 2 === 0) ? '#FFB300' : '#FFD54F';
      ctx.beginPath();
      ctx.moveTo(p1x, p1y);
      ctx.quadraticCurveTo(cp1x, cp1y, tipX, tipY);
      ctx.quadraticCurveTo(cp2x, cp2y, p2x, p2y);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 0.8;
      ctx.stroke();
    }

    // 5. Layer 3: Concentric Peacock Emerald Green Kolam Ring
    ctx.fillStyle = '#00695C'; // Auspicious peacock teal
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.43, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1.3;
    ctx.stroke();

    // 6. Layer 4: Turmeric Yellow Sun Core & Delicate Kolam Dots
    ctx.fillStyle = '#FFC107'; // Pure turmeric yellow
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.32, 0, Math.PI * 2);
    ctx.fill();

    // Kolam white pearls around turmeric core
    ctx.fillStyle = '#FFFFFF';
    for (let d = 0; d < 12; d++) {
      const da = (d / 12) * Math.PI * 2;
      const dx = cx + Math.cos(da) * (r * 0.38);
      const dy = cy + Math.sin(da) * (r * 0.38);
      ctx.beginPath();
      ctx.arc(dx, dy, 1.4, 0, Math.PI * 2);
      ctx.fill();
    }

    // 7. Center Terracotta Diya Base (Traditional Earthen Lamp)
    const diyaRadius = r * 0.21;
    const diyaGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, diyaRadius);
    diyaGrad.addColorStop(0, '#FFA000'); // Warm baked clay highlight
    diyaGrad.addColorStop(0.5, '#D84315'); // Rich terracotta body
    diyaGrad.addColorStop(1, '#8D2B0F'); // Deep earthen rim
    ctx.fillStyle = diyaGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, diyaRadius, 0, Math.PI * 2);
    ctx.fill();

    // Golden embossed rim
    ctx.strokeStyle = '#FFF176';
    ctx.lineWidth = 1.3;
    ctx.stroke();

    // Dark oil pool inside Diya
    ctx.fillStyle = '#4E342E';
    ctx.beginPath();
    ctx.arc(cx, cy, diyaRadius * 0.65, 0, Math.PI * 2);
    ctx.fill();

    // Cotton wick tip
    ctx.fillStyle = '#212121';
    ctx.beginPath();
    ctx.arc(cx, cy - diyaRadius * 0.2, 1.5, 0, Math.PI * 2);
    ctx.fill();
  }

  public update(dt = 1): void {
    this.flamePhase += 0.08 * dt;
  }

  public render(ctx: CanvasRenderingContext2D): void {
    if (!this.offscreenCanvas) return;

    ctx.save();

    const r = this.nativeR;
    const pad = 14;
    const nativeSize = (r + pad) * 2;
    const scaleMul = (r + pad) / r;

    // Horizontal oval perspective (aspect ratio ~0.50) so it feels like it is lying flat on the floor
    const drawW = this.radiusX * 2 * scaleMul;
    const drawH = this.radiusY * 2 * scaleMul;

    ctx.drawImage(
      this.offscreenCanvas,
      0,
      0,
      nativeSize,
      nativeSize,
      this.x - drawW / 2,
      this.y - drawH / 2,
      drawW,
      drawH
    );

    // Warm, alive flickering flame in the center of the Rangoli Diya (standing upright from floor)
    const flicker = Math.sin(this.flamePhase) * 1.5;
    const flameBaseX = this.x;
    const flameBaseY = this.y - 2 * this.scale;

    // 1. Soft radial light bloom casting onto Rangoli floor powders
    const bloom = ctx.createRadialGradient(
      flameBaseX,
      flameBaseY - 6,
      1,
      flameBaseX,
      flameBaseY - 6,
      30 * this.scale
    );
    bloom.addColorStop(0, 'rgba(255, 214, 0, 0.65)');
    bloom.addColorStop(0.45, 'rgba(255, 111, 0, 0.24)');
    bloom.addColorStop(1, 'rgba(255, 111, 0, 0)');
    ctx.fillStyle = bloom;
    ctx.beginPath();
    ctx.arc(flameBaseX, flameBaseY - 6, 30 * this.scale, 0, Math.PI * 2);
    ctx.fill();

    // 2. Outer Saffron Teardrop Flame (stands upright towards the sky)
    const flameH = (16 + flicker) * this.scale;
    const flameW = 5.0 * this.scale;

    ctx.fillStyle = '#FF9100';
    ctx.beginPath();
    ctx.moveTo(flameBaseX - flameW, flameBaseY);
    ctx.quadraticCurveTo(flameBaseX - flameW * 1.3, flameBaseY - flameH * 0.4, flameBaseX, flameBaseY - flameH);
    ctx.quadraticCurveTo(flameBaseX + flameW * 1.3, flameBaseY - flameH * 0.4, flameBaseX + flameW, flameBaseY);
    ctx.closePath();
    ctx.fill();

    // 3. Middle Bright Golden Flame
    const midH = flameH * 0.72;
    const midW = flameW * 0.62;
    ctx.fillStyle = '#FFEA00';
    ctx.beginPath();
    ctx.moveTo(flameBaseX - midW, flameBaseY);
    ctx.quadraticCurveTo(flameBaseX - midW * 1.2, flameBaseY - midH * 0.4, flameBaseX, flameBaseY - midH);
    ctx.quadraticCurveTo(flameBaseX + midW * 1.2, flameBaseY - midH * 0.4, flameBaseX + midW, flameBaseY);
    ctx.closePath();
    ctx.fill();

    // 4. Inner Cyan / White-Hot Core
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.ellipse(flameBaseX, flameBaseY - midH * 0.35, 1.4 * this.scale, 3.2 * this.scale, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  public clear(): void {}
}
