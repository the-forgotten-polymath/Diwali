import { DiyasOptions } from '../types';
export declare class DiyasRenderer {
    private diyas;
    private options;
    private offscreenDiya;
    private diyaW;
    private diyaH;
    constructor(options?: DiyasOptions);
    private createOffscreenDiya;
    init(width: number, height: number): void;
    update(_width: number, _height: number, dt?: number): void;
    render(ctx: CanvasRenderingContext2D): void;
    clear(): void;
}
