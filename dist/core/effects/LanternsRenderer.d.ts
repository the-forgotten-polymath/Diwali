import { LanternsOptions } from '../types';
export declare class LanternsRenderer {
    private lanterns;
    private options;
    private spriteCanvases;
    constructor(options?: LanternsOptions);
    private preRenderSprites;
    init(width: number, height: number): void;
    private createLantern;
    update(width: number, height: number, dt?: number): void;
    render(ctx: CanvasRenderingContext2D): void;
    clear(): void;
}
