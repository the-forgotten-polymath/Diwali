import { AnarOptions } from '../types';
import { ParticlePool } from '../engine/ParticlePool';
import { SoundManager } from '../engine/SoundManager';
export declare class AnarRenderer {
    private instances;
    private activeSparks;
    private pool;
    private sound;
    private options;
    constructor(pool: ParticlePool, sound: SoundManager, options?: AnarOptions);
    ignite(x?: number, y?: number, height?: number, duration?: number): void;
    update(dt?: number): void;
    render(ctx: CanvasRenderingContext2D): void;
    clear(): void;
}
