import { Particle } from '../types';
export declare class ParticlePool {
    private pool;
    private activeCount;
    private readonly maxCapacity;
    private idSequence;
    constructor(initialSize?: number, maxCapacity?: number);
    private preallocate;
    private createEmptyParticle;
    acquire(): Particle;
    release(p: Particle): void;
    getActiveCount(): number;
    getPoolSize(): number;
    clear(): void;
}
