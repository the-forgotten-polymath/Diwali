import { FlowerShowerOptions } from '../types';

interface Petal {
  x: number;
  y: number;
  vy: number;
  vx: number;
  size: number;
  type: 'marigold' | 'rose';
  color: string;
  rotation: number;
  rotationSpeed: number;
  rollAngle: number;
  rollSpeed: number;
  swayPhase: number;
  swaySpeed: number;
  alpha: number;
}

const MARIGOLD_COLORS = ['#FF9800', '#FFB300', '#F57C00', '#FFC107'];
const ROSE_COLORS = ['#C2185B', '#D81B60', '#E91E63', '#880E4F'];

export class FlowerShowerRenderer {
  private petals: Petal[] = [];
  private options: Required<FlowerShowerOptions>;
  private isRunning = false;

  constructor(options?: FlowerShowerOptions) {
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
      count: options?.count ?? 60,
      petalType: options?.petalType ?? 'mix',
      wind: options?.wind ?? 0.2,
      duration: options?.duration ?? 6000,
    };
  }

  public shower(width: number, height: number): void {
    this.isRunning = true;
    this.petals = [];

    for (let i = 0; i < this.options.count; i++) {
      this.petals.push(this.createPetal(width, height, true));
    }

    if (this.options.duration > 0) {
      setTimeout(() => {
        this.isRunning = false;
      }, this.options.duration);
    }
  }

  private createPetal(width: number, height: number, initialScatter = false): Petal {
    let type: 'marigold' | 'rose' = 'marigold';
    if (this.options.petalType === 'rose') {
      type = 'rose';
    } else if (this.options.petalType === 'mix') {
      type = Math.random() > 0.4 ? 'marigold' : 'rose';
    }

    const palette = type === 'marigold' ? MARIGOLD_COLORS : ROSE_COLORS;
    const color = palette[Math.floor(Math.random() * palette.length)];

    return {
      x: Math.random() * (width + 100) - 50,
      y: initialScatter ? Math.random() * height - height * 0.3 : -20 - Math.random() * 50,
      vy: (1.2 + Math.random() * 1.5) * this.options.speed,
      vx: this.options.wind * 2 + (Math.random() - 0.5) * 0.5,
      size: (10 + Math.random() * 8) * this.options.scale,
      type,
      color,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.04,
      rollAngle: Math.random() * Math.PI * 2,
      rollSpeed: (Math.random() - 0.5) * 0.05,
      swayPhase: Math.random() * Math.PI * 2,
      swaySpeed: 0.03 + Math.random() * 0.02,
      alpha: 0.9,
    };
  }

  public update(width: number, height: number, dt = 1): void {
    for (let i = this.petals.length - 1; i >= 0; i--) {
      const p = this.petals[i];
      p.swayPhase += p.swaySpeed * dt;
      p.rotation += p.rotationSpeed * dt;
      p.rollAngle += p.rollSpeed * dt;

      p.x += (p.vx + Math.sin(p.swayPhase) * 1.2) * dt;
      p.y += p.vy * dt;

      if (p.y > height + 30) {
        if (this.isRunning) {
          this.petals[i] = this.createPetal(width, height, false);
        } else {
          this.petals.splice(i, 1);
        }
      }
    }
  }

  public render(ctx: CanvasRenderingContext2D): void {
    ctx.save();

    for (const p of this.petals) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);

      // Simulate 3D tumbling via cosine scale
      const scaleX = Math.cos(p.rollAngle);
      ctx.scale(scaleX, 1);

      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;

      if (p.type === 'marigold') {
        // Marigold petal (fluted / fan shaped)
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-p.size * 0.4, -p.size * 0.5, -p.size * 0.3, -p.size, 0, -p.size);
        ctx.bezierCurveTo(p.size * 0.3, -p.size, p.size * 0.4, -p.size * 0.5, 0, 0);
        ctx.fill();

        // Central petal fold vein
        ctx.strokeStyle = 'rgba(190, 80, 0, 0.4)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -p.size * 0.85);
        ctx.stroke();
      } else {
        // Velvet rose petal (rounded tear shape)
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-p.size * 0.5, -p.size * 0.4, -p.size * 0.6, -p.size * 0.8, 0, -p.size);
        ctx.bezierCurveTo(p.size * 0.6, -p.size * 0.8, p.size * 0.5, -p.size * 0.4, 0, 0);
        ctx.fill();
      }

      ctx.restore();
    }

    ctx.restore();
  }

  public clear(): void {
    this.petals = [];
    this.isRunning = false;
  }
}

