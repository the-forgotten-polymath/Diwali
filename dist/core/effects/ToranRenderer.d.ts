export interface ToranOptions {
    scale?: number;
    scallopWidth?: number;
    fadeRadius?: number;
}
export declare class ToranRenderer {
    private scale;
    private width;
    private nodes;
    private fairyLights;
    private currentAlpha;
    private targetAlpha;
    private time;
    private offscreenCanvas;
    private isCached;
    constructor(options?: ToranOptions);
    init(width: number, _height: number): void;
    private preRenderStaticToran;
    update(_mouseX: number, mouseY: number, dt?: number): void;
    render(ctx: CanvasRenderingContext2D): void;
    clear(): void;
}
