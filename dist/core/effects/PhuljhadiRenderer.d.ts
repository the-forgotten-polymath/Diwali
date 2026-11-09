import { PhuljhadiOptions } from '../types';
import { ParticlePool } from '../engine/ParticlePool';
import { SoundManager } from '../engine/SoundManager';
import { MouseTracker } from '../engine/MouseTracker';
export declare class PhuljhadiRenderer {
    private wands;
    private activeSparks;
    private pool;
    private sound;
    private mouse;
    private options;
    constructor(pool: ParticlePool, sound: SoundManager, options?: PhuljhadiOptions, mouse?: MouseTracker);
    setMouseTracker(mouse: MouseTracker): void;
    lightWand(followMouse?: boolean, x?: number, y?: number, duration?: number): void;
    update(dt?: number): void;
    render(ctx: CanvasRenderingContext2D): void;
    clear(): void;
}
