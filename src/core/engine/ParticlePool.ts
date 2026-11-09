import { Particle } from '../types';

export class ParticlePool {
  private pool: Particle[] = [];
  private activeCount = 0;
  private readonly maxCapacity: number;
  private idSequence = 0;

  constructor(initialSize = 1000, maxCapacity = 4000) {
    this.maxCapacity = maxCapacity;
    this.preallocate(initialSize);
  }

  private preallocate(count: number): void {
    for (let i = 0; i < count; i++) {
      this.pool.push(this.createEmptyParticle());
    }
  }

  private createEmptyParticle(): Particle {
    return {
      id: ++this.idSequence,
      type: 'spark',
      x: 0,
      y: 0,
      prevX: 0,
      prevY: 0,
      vx: 0,
      vy: 0,
      ax: 0,
      ay: 0,
      size: 2,
      initialSize: 2,
      color: '#FFD700',
      alpha: 1,
      life: 0,
      maxLife: 60,
      rotation: 0,
      rotationSpeed: 0,
      scaleX: 1,
      scaleY: 1,
      drag: 0.98,
      active: false,
    };
  }

  public acquire(): Particle {
    this.activeCount++;
    if (this.pool.length > 0) {
      const p = this.pool.pop()!;
      p.active = true;
      p.life = 0;
      p.alpha = 1;
      p.prevX = p.x;
      p.prevY = p.y;
      p.customData = undefined;
      return p;
    }

    if (this.activeCount < this.maxCapacity) {
      const p = this.createEmptyParticle();
      p.active = true;
      p.prevX = p.x;
      p.prevY = p.y;
      return p;
    }

    // Safety fallback: recycle an existing particle if capacity exceeded
    const fallback = this.createEmptyParticle();
    fallback.active = true;
    fallback.prevX = fallback.x;
    fallback.prevY = fallback.y;
    return fallback;
  }

  public release(p: Particle): void {
    if (!p.active) return;
    p.active = false;
    this.activeCount = Math.max(0, this.activeCount - 1);
    if (this.pool.length < this.maxCapacity) {
      this.pool.push(p);
    }
  }

  public getActiveCount(): number {
    return this.activeCount;
  }

  public getPoolSize(): number {
    return this.pool.length;
  }

  public clear(): void {
    this.pool.length = 0;
    this.activeCount = 0;
  }
}

