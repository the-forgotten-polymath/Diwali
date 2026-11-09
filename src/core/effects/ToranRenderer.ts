export interface ToranOptions {
  scale?: number;
  scallopWidth?: number;
  fadeRadius?: number;
}

interface ToranNode {
  apexX: number;
  lampChainLen: number;
  flamePhase: number;
}

interface FairyLight {
  x: number;
  y: number;
  phase: number;
  color: string;
}

export class ToranRenderer {
  private scale = 1.0;
  private width = 1440;
  private nodes: ToranNode[] = [];
  private fairyLights: FairyLight[] = [];
  private currentAlpha = 1.0;
  private targetAlpha = 1.0;
  private time = 0;

  // High-performance offscreen canvas caching for static elements
  private offscreenCanvas: HTMLCanvasElement | null = null;
  private isCached = false;

  constructor(options?: ToranOptions) {
    this.scale = options?.scale ?? 1.0;
  }

  public init(width: number, _height: number): void {
    this.width = width;
    this.nodes = [];
    this.fairyLights = [];
    this.isCached = false;

    const s = this.scale;
    const idealWidth = 240 * s;
    const count = Math.max(4, Math.round(width / idealWidth));
    const scallopW = width / count;
    const dip = 38 * s;

    // Build Nodes and Light positions
    for (let c = 0; c < count; c++) {
      const startX = c * scallopW;

      this.nodes.push({
        apexX: startX,
        lampChainLen: (26 + (c % 2) * 8) * s,
        flamePhase: Math.random() * Math.PI * 2,
      });

      const steps = Math.round(scallopW / (14 * s));
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const x = startX + t * scallopW;
        const y = 4 * t * (1 - t) * dip;

        if (i % 2 === 0) {
          this.fairyLights.push({
            x,
            y: y - 2 * s,
            phase: Math.random() * Math.PI * 2,
            color: (i % 4 === 0) ? '#FFF9C4' : '#FFD54F',
          });
        }
      }
    }

    this.nodes.push({
      apexX: width,
      lampChainLen: 28 * s,
      flamePhase: Math.random() * Math.PI * 2,
    });

    // Pre-render static garland & brass lamps onto offscreen canvas
    this.preRenderStaticToran(count, scallopW, dip);
  }

  private preRenderStaticToran(count: number, scallopW: number, dip: number): void {
    if (typeof document === 'undefined') return;

    const s = this.scale;
    const maxH = Math.ceil(dip + 45 * s);

    this.offscreenCanvas = document.createElement('canvas');
    this.offscreenCanvas.width = this.width;
    this.offscreenCanvas.height = maxH;

    const ctx = this.offscreenCanvas.getContext('2d');
    if (!ctx) return;

    const saffron = '#FF6F00';
    const saffronLight = '#FFA000';
    const goldYellow = '#FFD600';
    const yellowLight = '#FFF176';
    const leafDark = '#1B5E20';
    const leafGreen = '#2E7D32';

    // 1. Top border cord
    ctx.strokeStyle = '#D84315';
    ctx.lineWidth = 2.5 * s;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(this.width, 0);
    ctx.stroke();

    // 2. Garland Leaves & Flowers
    for (let c = 0; c < count; c++) {
      const startX = c * scallopW;
      const steps = Math.round(scallopW / (14 * s));

      // Leaves first
      for (let i = 1; i < steps; i += 2) {
        const t = i / steps;
        const x = startX + t * scallopW;
        const y = 4 * t * (1 - t) * dip + 8 * s;
        const radius = 8 * s;
        const angle = (t - 0.5) * 0.4;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);

        ctx.fillStyle = (i % 4 === 1) ? leafDark : leafGreen;
        ctx.beginPath();
        ctx.moveTo(0, -radius);
        ctx.quadraticCurveTo(radius * 0.7, 0, 0, radius * 1.6);
        ctx.quadraticCurveTo(-radius * 0.7, 0, 0, -radius);
        ctx.fill();

        ctx.strokeStyle = '#1B5E20';
        ctx.lineWidth = 1 * s;
        ctx.beginPath();
        ctx.moveTo(0, -radius);
        ctx.lineTo(0, radius * 1.4);
        ctx.stroke();

        ctx.restore();
      }

      // Marigold Flower Rosettes
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const x = startX + t * scallopW;
        const y = 4 * t * (1 - t) * dip;
        const isYellow = (c * steps + i) % 2 === 0;

        ctx.fillStyle = isYellow ? yellowLight : saffronLight;
        ctx.beginPath();
        ctx.arc(x, y, (7 + (i % 2) * 1.5) * s, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = isYellow ? goldYellow : saffron;
        ctx.beginPath();
        ctx.arc(x, y, (5 + (i % 2)) * s, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 3. Brass Lamp Chains & Bowls at Intersections
    for (const node of this.nodes) {
      const lx = node.apexX;
      const lampY = node.lampChainLen;

      // Brass chain
      ctx.strokeStyle = '#FFB300';
      ctx.lineWidth = 1.2 * s;
      ctx.beginPath();
      ctx.moveTo(lx, 0);
      ctx.lineTo(lx, lampY);
      ctx.stroke();

      // Brass bell/cap
      ctx.fillStyle = '#FFA000';
      ctx.beginPath();
      ctx.arc(lx, lampY - 2 * s, 3.5 * s, 0, Math.PI * 2);
      ctx.fill();

      // Diya Bowl
      const diyaGrad = ctx.createLinearGradient(lx - 10 * s, lampY, lx + 10 * s, lampY + 7 * s);
      diyaGrad.addColorStop(0, '#FF8F00');
      diyaGrad.addColorStop(0.5, '#FFE082');
      diyaGrad.addColorStop(1, '#E65100');

      ctx.fillStyle = diyaGrad;
      ctx.beginPath();
      ctx.ellipse(lx, lampY + 5 * s, 10 * s, 4.5 * s, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    this.isCached = true;
  }

  public update(_mouseX: number, mouseY: number, dt = 1): void {
    this.time += 0.05 * dt;

    if (mouseY < 130) {
      const factor = Math.max(0, mouseY / 130);
      this.targetAlpha = 0.08 + factor * 0.92;
    } else {
      this.targetAlpha = 1.0;
    }

    this.currentAlpha += (this.targetAlpha - this.currentAlpha) * Math.min(0.2 * dt, 1);
  }

  public render(ctx: CanvasRenderingContext2D): void {
    if (this.currentAlpha <= 0.02) return;

    ctx.save();
    ctx.globalAlpha = this.currentAlpha;

    // 1. Draw cached static toran garland with single drawImage call! (Ultra fast)
    if (this.isCached && this.offscreenCanvas) {
      ctx.drawImage(this.offscreenCanvas, 0, 0);
    }

    const s = this.scale;

    // 2. Render only dynamic flickering flames (only 5-6 points!)
    for (const node of this.nodes) {
      const lx = node.apexX;
      const lampY = node.lampChainLen;
      const flicker = Math.sin(this.time * 3 + node.flamePhase) * 1.5 * s;

      // Small flame
      ctx.fillStyle = '#FFF9C4';
      ctx.beginPath();
      ctx.moveTo(lx - 2.5 * s, lampY + 3 * s);
      ctx.quadraticCurveTo(lx - 3.5 * s, lampY, lx, lampY - 7 * s + flicker);
      ctx.quadraticCurveTo(lx + 3.5 * s, lampY, lx + 2.5 * s, lampY + 3 * s);
      ctx.closePath();
      ctx.fill();

      // Flame core
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.ellipse(lx, lampY + 1 * s, 1.2 * s, 2.5 * s, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // 3. Render dynamic twinkling fairy lights
    for (const light of this.fairyLights) {
      const twinkle = (Math.sin(this.time * 4 + light.phase) + 1) * 0.5;
      ctx.fillStyle = light.color;
      ctx.globalAlpha = this.currentAlpha * (0.4 + twinkle * 0.6);
      ctx.beginPath();
      ctx.arc(light.x, light.y, (1.6 + twinkle * 1.2) * s, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  public clear(): void {}
}
