import { ChakriOptions } from '../types';
import { ParticlePool } from '../engine/ParticlePool';
import { SoundManager } from '../engine/SoundManager';
import { MouseTracker } from '../engine/MouseTracker';
export declare class ChakriRenderer {
    private instances;
    private activeSparks;
    private pool;
    private sound;
    private mouse;
    private options;
    constructor(pool: ParticlePool, sound: SoundManager, options?: ChakriOptions, mouse?: MouseTracker);
    setMouseTracker(mouse: MouseTracker): void;
    ignite(x?: number, y?: number, duration?: number, followMouse?: boolean): void;
    update(dt?: number): void;
    render(ctx: CanvasRenderingContext2D): void;
    clear(): void;
}
