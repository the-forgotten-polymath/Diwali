import { JULIE_IMAGE_DATA_URI } from './julieAsset';

export interface LabradorOptions {
  scale?: number;
  imageSrc?: string;
}

export class LabradorRenderer {
  private scale = 1.0;
  private x = 12;
  private y = 0;
  private targetWidth = 125;
  private targetHeight = 148;

  private image: HTMLImageElement | null = null;
  private isImageLoaded = false;

  private chewPhase = 0;
  private breathPhase = 0;
  private sparkleTimer = 0;

  // Offscreen pre-rendered sweets bowl & laddoos
  private bowlCanvas: HTMLCanvasElement | null = null;
  private bowlOffsetX = 0;
  private bowlOffsetY = 0;

  private crumbs: Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    alpha: number;
    color: string;
  }> = [];

  private sparkles: Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    alpha: number;
    char: string;
  }> = [];

  constructor(options?: number | LabradorOptions) {
    if (typeof options === 'number') {
      this.scale = options;
    } else if (options) {
      this.scale = options.scale ?? 1.0;
    }

    const src = (typeof options === 'object' && options?.imageSrc) ? options.imageSrc : JULIE_IMAGE_DATA_URI;
    this.loadImage(src);
  }

  private loadImage(src: string): void {
    if (typeof Image === 'undefined') return;
    this.image = new Image();
    this.image.onload = () => {
      this.isImageLoaded = true;
    };
    this.image.src = src;
    if (this.image.complete && this.image.naturalWidth > 0) {
      this.isImageLoaded = true;
    }
  }

  public init(height: number): void {
    const s = this.scale;
    this.targetHeight = Math.round(148 * s);
    this.targetWidth = Math.round(this.targetHeight * (420 / 495));
    this.x = 10 * s;
    this.y = height - this.targetHeight - 6 * s;

    this.preRenderSweetsBowl();
  }

  private preRenderSweetsBowl(): void {
    if (typeof document === 'undefined') return;
    const s = this.scale;
    const bowlRadiusX = 32 * s;
    const bowlDepth = 23 * s;
    const w = Math.ceil(bowlRadiusX * 2 + 50 * s);
    const h = Math.ceil(bowlDepth + 60 * s);

    this.bowlCanvas = document.createElement('canvas');
    this.bowlCanvas.width = w;
    this.bowlCanvas.height = h;

    const ctx = this.bowlCanvas.getContext('2d');
    if (!ctx) return;

    const centerX = w / 2;
    const baseY = h - 12 * s;

    this.bowlOffsetX = centerX;
    this.bowlOffsetY = baseY;

    // 1. Warm ambient glow
    const glowGrad = ctx.createRadialGradient(centerX, baseY - 14 * s, 4 * s, centerX, baseY - 14 * s, 48 * s);
    glowGrad.addColorStop(0, 'rgba(255, 179, 0, 0.35)');
    glowGrad.addColorStop(0.6, 'rgba(255, 143, 0, 0.12)');
    glowGrad.addColorStop(1, 'rgba(255, 143, 0, 0)');
    ctx.fillStyle = glowGrad;
    ctx.beginPath();
    ctx.arc(centerX, baseY - 14 * s, 48 * s, 0, Math.PI * 2);
    ctx.fill();

    // 2. Bowl contact shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.40)';
    ctx.beginPath();
    ctx.ellipse(centerX, baseY + 4 * s, bowlRadiusX, 7 * s, 0, 0, Math.PI * 2);
    ctx.fill();

    // 3. Polished Brass/Golden Bowl Body
    const bowlGrad = ctx.createLinearGradient(centerX - bowlRadiusX, 0, centerX + bowlRadiusX, -bowlDepth);
    bowlGrad.addColorStop(0, '#E65100');
    bowlGrad.addColorStop(0.25, '#FFB300');
    bowlGrad.addColorStop(0.55, '#FFF176');
    bowlGrad.addColorStop(0.8, '#FFA000');
    bowlGrad.addColorStop(1, '#BF360C');

    ctx.fillStyle = bowlGrad;
    ctx.beginPath();
    ctx.moveTo(centerX - bowlRadiusX, baseY);
    ctx.bezierCurveTo(
      centerX - bowlRadiusX * 0.9,
      baseY - bowlDepth,
      centerX + bowlRadiusX * 0.9,
      baseY - bowlDepth,
      centerX + bowlRadiusX,
      baseY
    );
    ctx.closePath();
    ctx.fill();

    // 4. Polished Golden Rim Highlight
    const rimGrad = ctx.createLinearGradient(centerX - bowlRadiusX, 0, centerX + bowlRadiusX, 0);
    rimGrad.addColorStop(0, '#FFA000');
    rimGrad.addColorStop(0.4, '#FFFDE7');
    rimGrad.addColorStop(0.7, '#FFD54F');
    rimGrad.addColorStop(1, '#FF8F00');

    ctx.strokeStyle = rimGrad;
    ctx.lineWidth = 3.6 * s;
    ctx.beginPath();
    ctx.ellipse(centerX, baseY - bowlDepth + 2 * s, bowlRadiusX, 7.5 * s, 0, 0, Math.PI * 2);
    ctx.stroke();

    // 5. Piled Golden Laddoos
    const laddoos = [
      { x: centerX - 16 * s, y: baseY - bowlDepth - 2 * s, r: 11.5 * s, c1: '#FFE082', c2: '#FF8F00', vark: true },
      { x: centerX + 16 * s, y: baseY - bowlDepth - 2 * s, r: 11.5 * s, c1: '#FFD54F', c2: '#FF6F00', vark: true },
      { x: centerX, y: baseY - bowlDepth - 1 * s, r: 12.0 * s, c1: '#FFF9C4', c2: '#FFA000', vark: false },
      { x: centerX, y: baseY - bowlDepth - 14 * s, r: 11.0 * s, c1: '#FFF9C4', c2: '#FFA000', vark: true },
    ];

    for (const lad of laddoos) {
      const ladGrad = ctx.createRadialGradient(
        lad.x - lad.r * 0.35,
        lad.y - lad.r * 0.35,
        lad.r * 0.15,
        lad.x,
        lad.y,
        lad.r
      );
      ladGrad.addColorStop(0, lad.c1);
      ladGrad.addColorStop(1, lad.c2);

      ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
      ctx.beginPath();
      ctx.arc(lad.x, lad.y + 2 * s, lad.r, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = ladGrad;
      ctx.beginPath();
      ctx.arc(lad.x, lad.y, lad.r, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#00E676';
      ctx.beginPath();
      ctx.ellipse(lad.x - lad.r * 0.25, lad.y - lad.r * 0.3, 2.2 * s, 1.2 * s, 0.5, 0, Math.PI * 2);
      ctx.fill();

      if (lad.vark) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.beginPath();
        ctx.arc(lad.x - lad.r * 0.32, lad.y - lad.r * 0.38, 2.0 * s, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  public update(mouseX: number, mouseY: number, dt = 1): void {
    this.chewPhase += 0.08 * dt;
    this.breathPhase += 0.04 * dt;

    const dogCenterX = this.x + this.targetWidth * 0.45;
    const dogCenterY = this.y + this.targetHeight * 0.55;
    const distToMouse = Math.hypot(mouseX - dogCenterX, mouseY - dogCenterY);
    const isPetted = distToMouse < 200;

    if (isPetted) {
      this.sparkleTimer += dt;
      if (this.sparkleTimer > 18) {
        this.sparkleTimer = 0;
        this.sparkles.push({
          x: dogCenterX + (Math.random() - 0.5) * 50,
          y: this.y + 25 + Math.random() * 25,
          vx: (Math.random() - 0.5) * 1.0,
          vy: -1.0 - Math.random() * 0.8,
          size: 9 + Math.random() * 5,
          alpha: 1.0,
          char: Math.random() < 0.6 ? '✨' : '💛',
        });
      }
    }

    if (Math.sin(this.chewPhase * 2.2) > 0.80 && Math.random() < 0.35 * dt) {
      const crumbColors = ['#FFB300', '#FFA000', '#FFE082', '#FF8F00'];
      const bowlX = this.x + this.targetWidth + 30 * this.scale;
      const bowlY = this.y + this.targetHeight - 16 * this.scale;

      this.crumbs.push({
        x: bowlX + (Math.random() - 0.5) * 26,
        y: bowlY - 18 * this.scale,
        vx: (Math.random() - 0.5) * 2.2,
        vy: -1.8 - Math.random() * 1.8,
        size: 1.8 + Math.random() * 2.4,
        alpha: 1.0,
        color: crumbColors[Math.floor(Math.random() * crumbColors.length)],
      });
    }

    for (let i = this.crumbs.length - 1; i >= 0; i--) {
      const c = this.crumbs[i];
      c.x += c.vx * dt;
      c.y += c.vy * dt;
      c.vy += 0.16 * dt;
      c.alpha -= 0.028 * dt;
      if (c.alpha <= 0) {
        this.crumbs.splice(i, 1);
      }
    }

    for (let i = this.sparkles.length - 1; i >= 0; i--) {
      const sp = this.sparkles[i];
      sp.x += sp.vx * dt;
      sp.y += sp.vy * dt;
      sp.alpha -= 0.022 * dt;
      if (sp.alpha <= 0) {
        this.sparkles.splice(i, 1);
      }
    }
  }

  public render(ctx: CanvasRenderingContext2D): void {
    const s = this.scale;
    const w = this.targetWidth;
    const h = this.targetHeight;
    const floorY = this.y + h;

    ctx.save();

    // 1. Soft Floor Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
    ctx.beginPath();
    ctx.ellipse(this.x + w * 0.42, floorY + 3 * s, w * 0.52, 7 * s, 0, 0, Math.PI * 2);
    ctx.fill();

    // 2. Photographic Julie Cutout
    if (this.image && (this.isImageLoaded || this.image.complete)) {
      ctx.save();
      const breath = Math.sin(this.breathPhase) * 0.012;
      const chewBob = Math.sin(this.chewPhase) * 1.3 * s;

      const pivotX = this.x + w * 0.45;
      const pivotY = floorY;

      ctx.translate(pivotX, pivotY + chewBob);
      ctx.scale(1 - breath * 0.4, 1 + breath);
      ctx.translate(-pivotX, -pivotY);

      ctx.drawImage(this.image, this.x, this.y, w, h);
      ctx.restore();
    }

    // 3. Fast cached Sweets Bowl
    if (this.bowlCanvas) {
      const bowlX = this.x + w + 30 * s;
      const bowlY = floorY - 4 * s;
      ctx.drawImage(this.bowlCanvas, bowlX - this.bowlOffsetX, bowlY - this.bowlOffsetY);
    }

    // 4. Munching Treat Crumbs
    for (const crumb of this.crumbs) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, crumb.alpha);
      ctx.fillStyle = crumb.color;
      ctx.beginPath();
      ctx.arc(crumb.x, crumb.y, crumb.size * s, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 5. Affectionate Sparkles / Hearts
    for (const sp of this.sparkles) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, sp.alpha);
      ctx.font = `${Math.round(sp.size * s)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(sp.char, sp.x, sp.y);
      ctx.restore();
    }

    ctx.restore();
  }

  public clear(): void {
    this.crumbs = [];
    this.sparkles = [];
  }
}
