import { RocketsOptions } from '../types';
import { ParticlePool } from '../engine/ParticlePool';
import { SoundManager } from '../engine/SoundManager';
import { MouseTracker } from '../engine/MouseTracker';
export declare class RocketsRenderer {
    private rockets;
    private activeSparks;
    private ambientStardust;
    private pool;
    private sound;
    private mouse;
    private options;
    private isContinuous;
    private spawnInterval;
    private reducedMotion;
    private lowEndMode;
    mouseFollow: boolean;
    private lastMouseX;
    private lastMouseY;
    private mouseMoveCooldown;
    constructor(pool: ParticlePool, sound: SoundManager, options?: RocketsOptions, mouse?: MouseTracker);
    setMouseTracker(mouse: MouseTracker): void;
    setMouseFollow(enabled: boolean): void;
    setLowEndMode(enabled: boolean): void;
    private initStardust;
    /**
     * 💥 BLAST AT: Direct instantaneous rocket targeting (x, y) like fireworks-js!
     */
    blastAt(targetX: number, targetY: number): void;
    launch(count?: number, startX?: number, startY?: number, targetX?: number, targetY?: number, homing?: boolean): void;
    startLoop(intervalMs?: number): void;
    stopLoop(): void;
    update(dt?: number): void;
    private explodeRocket;
    render(ctx: CanvasRenderingContext2D): void;
    clear(): void;
}
