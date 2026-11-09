import { BaseEffectOptions } from '../types';
import { ParticlePool } from '../engine/ParticlePool';
import { SoundManager } from '../engine/SoundManager';
export interface LadiOptions extends BaseEffectOptions {
    /** Top X coordinate of the hanging ladi (default: center) */
    x?: number;
    /** Top Y coordinate of the hanging ladi (default: 50) */
    y?: number;
    /** Number of firecrackers on the string (default: 40) */
    crackerCount?: number;
    /** Length of the string in pixels (default: 260) */
    length?: number;
}
export declare class LadiRenderer {
    private crackers;
    private activeSparks;
    private smokeClouds;
    private paperDebris;
    private pool;
    private sound;
    private options;
    private currentIndex;
    private burstTimer;
    private isIgnited;
    constructor(pool: ParticlePool, sound: SoundManager, options?: LadiOptions);
    ignite(x?: number, y?: number, count?: number): void;
    private burstNextCracker;
    update(dt?: number): void;
    render(ctx: CanvasRenderingContext2D): void;
    clear(): void;
}
