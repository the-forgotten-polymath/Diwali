import { FlowerShowerOptions } from '../types';
export declare class FlowerShowerRenderer {
    private petals;
    private options;
    private isRunning;
    constructor(options?: FlowerShowerOptions);
    shower(width: number, height: number): void;
    private createPetal;
    update(width: number, height: number, dt?: number): void;
    render(ctx: CanvasRenderingContext2D): void;
    clear(): void;
}
