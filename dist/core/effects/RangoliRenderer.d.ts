export interface RangoliOptions {
    scale?: number;
    x?: number;
    y?: number;
    radiusX?: number;
    radiusY?: number;
}
export declare class RangoliRenderer {
    private scale;
    private x;
    private y;
    private radiusX;
    private radiusY;
    private nativeR;
    private offscreenCanvas;
    private flamePhase;
    private currentAlpha;
    private targetAlpha;
    private options?;
    constructor(options?: RangoliOptions);
    init(width: number, height: number): void;
    private preRenderRangoli;
    update(mouseX?: number, mouseY?: number, dt?: number): void;
    render(ctx: CanvasRenderingContext2D): void;
    clear(): void;
}
